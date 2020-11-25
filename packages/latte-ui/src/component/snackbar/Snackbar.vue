<template>

	<Transition name="snackbar">

		<div :class="classes" :style="styles" @mouseover="cancelTimeout" @mouseout="resumeTimeout" ref="root" v-if="isOpen">
			<div class="snackbar-body" v-if="!$slots.default">
				<Icon :name="icon" v-if="icon"/>
				<div class="d-flex flex-column">
					<p class="m-0" v-if="title"><strong>{{ title }}</strong></p>
					<p class="m-0" v-if="message">{{ message }}</p>
				</div>
			</div>
			<slot v-bind="{close}"></slot>
			<slot name="action" v-bind="{close}"></slot>
			<button class="close" @click="close" v-if="isCloseable"/>
		</div>

	</Transition>

</template>

<script lang="ts">

	import { useBreakpointsAPI, useSnackbar, useZIndexAPI } from "../../composable";
	import type { PropType } from "vue";
	import { computed, defineComponent, onMounted, ref } from "vue";
	import { animationFrame } from "../../";
	import { LLocationSides } from "../shared";
	import { default as Icon } from "../icon/Icon.vue";

	export default defineComponent({

		name: "LatteSnackbar",

		components: {
			Icon
		},

		emits: [
			"close",
			"open"
		],

		props: {
			id: {default: null}, // Number | null
			isFixed: {default: false, type: Boolean},
			reject: {default: null}, // Function | null
			resolve: {default: null}, // Function | null
			color: {default: null}, // LColor | string | null
			duration: {default: 5000, type: Number},
			icon: {default: null}, // String | null
			isCloseable: {default: false, type: Boolean},
			isPersistent: {default: false, type: Boolean},
			location: {default: LLocationSides.Top, type: String as PropType<LLocationSides>},
			message: {default: null}, // String | null
			title: {default: null} // String | null
		},

		setup(props, {emit})
		{
			const breakpointsAPI = useBreakpointsAPI();
			const snackbarAPI = useSnackbar();
			const zIndexAPI = useZIndexAPI();

			const instances = snackbarAPI.instances.value;
			const me = instances.find(x => x.id === props.id);

			const isOpen = ref(false);
			const root = ref(null);
			const z = ref(0);

			let timeout: number = 0;
			let visible: number = Date.now();

			const classes = computed(() =>
			{
				const c = ["snackbar", "position-fixed", "shadow-8"];

				if (props.color)
					c.push("is-" + props.color);

				return c;
			});

			const previousSiblings = computed(() =>
			{
				let found = false;

				return instances.filter(x => x.id === props.id ? !(found = true) : !found && x.options.location === props.location);
			});

			const styles = computed(() =>
			{
				const s: any = {
					zIndex: z.value
				};

				if (snackbarAPI.isTop(props.location))
				{
					s["top"] = previousSiblings.value.reduce((a, b) => a + b.height, 0) + "px";
					s["--origin"] = "0, -12px";
				}
				else if (snackbarAPI.isBottom(props.location))
				{
					s["bottom"] = previousSiblings.value.reduce((a, b) => a + b.height, 0) + "px";
					s["--origin"] = "0, 12px";
				}

				if (!breakpointsAPI.isCollapsed)
				{
					if (props.location === LLocationSides.Top || props.location === LLocationSides.Bottom)
					{
						s["left"] = "50%";
						s["--target"] = "-50%, 0";
					}

					if (props.location === LLocationSides.Top)
						s["--origin"] = "-50%, -12px";

					if (props.location === LLocationSides.Bottom)
						s["--origin"] = "-50%, 12px";
				}

				if (props.location === LLocationSides.BottomLeft || props.location === LLocationSides.TopLeft)
					s["left"] = "0";

				if (props.location === LLocationSides.BottomRight || props.location === LLocationSides.TopRight)
					s["right"] = "0";

				return s;
			});

			const cancelTimeout = () => clearTimeout(timeout);

			const close = () =>
			{
				emit("close");
				me?.resolve();

				isOpen.value = false;
				setTimeout(onAfterLeave, 240);
				cancelTimeout();
			};

			const open = () =>
			{
				emit("open");
				isOpen.value = true;
				resumeTimeout();

				z.value = zIndexAPI.get();

				animationFrame(() =>
				{
					if (root.value)
					{
						const {height, marginBottom} = window.getComputedStyle(root.value!);

						me!.height = [height, marginBottom]
							.map(parseFloat)
							.reduce((a, b) => a + b, 0);
					}
					else
					{
						me!.height = 0;
					}
				});
			};

			const resumeTimeout = () => !props.isPersistent && (timeout = setTimeout(close, visible + props.duration - Date.now()));

			const onAfterLeave = () => instances.splice(instances.findIndex(x => x.id === props.id), 1);

			onMounted(open);

			return {
				root,

				isOpen,
				classes,
				styles,

				cancelTimeout,
				close,
				open,
				resumeTimeout
			};
		}

	});

</script>
