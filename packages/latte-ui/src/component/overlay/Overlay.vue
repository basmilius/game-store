<template>

	<slot name="opener" v-bind="{close, open, toggle, isOpen}"></slot>

	<Teleport :to="latte.root">

		<Transition name="overlay">
			<div :class="classes" :style="styles" v-if="isOpen">
				<slot v-bind="{close, toggle}"></slot>
			</div>
		</Transition>

	</Teleport>

</template>

<script lang="ts">

	import type { LLocationCenter, LLocationVertical } from "../shared";
	import type { PropType } from "vue";
	import { computed, defineComponent, onBeforeUnmount, onUnmounted, ref, toRefs, watch } from "vue";
	import { onHotKey, useDialogAPI, useLatte, useZIndexAPI } from "../../";

	export default defineComponent({

		name: "LatteOverlay",

		emits: [
			"close",
			"open"
		],

		props: {
			isDismissible: {default: false, type: Boolean},
			isOpen: {default: false, type: Boolean},
			location: {default: "center", type: String as PropType<LLocationCenter | LLocationVertical>},
			locationMobile: {default: null} // LLocationCenter | LLocationVertical | null
		},

		setup(props, {emit})
		{
			const latte = useLatte();
			const dialogAPI = useDialogAPI();
			const zIndexAPI = useZIndexAPI();
			const refProps = toRefs(props);

			const isOpen = ref(props.isOpen);
			const zIndex = ref(props.isOpen ? zIndexAPI.get() : 0);

			let escapeEvent: Function | null = null;
			let resolve: Function | null = null;

			const classes = computed(() => ["overlay", "overlay-" + refProps.location.value, "overlay-mobile-" + (refProps.locationMobile.value || refProps.location.value)]);
			const styles = computed(() => ({zIndex: zIndex.value.toString()}));

			const close = (resolveWith?: any) =>
			{
				if (!isOpen.value)
					return;

				if (resolve)
					resolve(resolveWith);

				isOpen.value = false;
				resolve = null;
			};

			const open = () =>
			{
				if (isOpen.value)
					return;

				zIndex.value = zIndexAPI.get();
				isOpen.value = true;
			};

			const openAndWait = () => new Promise<void>(rslv =>
			{
				resolve = rslv;
				open();
			});

			const toggle = () =>
			{
				if (isOpen.value)
					close();
				else
					open();
			};

			const onIsDismissibleChanged = (isDismissible: boolean): void =>
			{
				if (isDismissible && !escapeEvent)
					escapeEvent = onHotKey("Escape", () => close());

				if (!isDismissible && escapeEvent)
					escapeEvent();
			};

			const onIsOpenChanged = (isOpen: boolean): void =>
			{
				if (isOpen)
					open();
				else
					close();
			};

			const onOpenChanged = (isOpen: boolean): void =>
			{
				if (isOpen)
				{
					emit("open");
					dialogAPI.onOpened();
				}
				else
				{
					emit("close");
					dialogAPI.onClosed();
				}
			};

			watch(isOpen, onOpenChanged, {flush: "pre", immediate: true});
			watch(refProps.isOpen, onIsOpenChanged, {flush: "pre"});
			watch(refProps.isDismissible, onIsDismissibleChanged, {flush: "pre", immediate: true});

			onBeforeUnmount(() => isOpen.value && dialogAPI.onClosed());
			onUnmounted(() => escapeEvent && escapeEvent());

			return {
				latte,

				isOpen,

				classes,
				styles,

				close,
				open,
				openAndWait,
				toggle
			};
		}

	});

</script>
