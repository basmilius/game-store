<template>

	<slot name="opener" v-bind="{close, open, toggle}"></slot>

	<Teleport :to="latte.root.parentElement">

		<Transition name="overlay" v-if="isModal">
			<div class="overlay" :style="{zIndex: position.z}" v-if="isOpen"></div>
		</Transition>

		<Transition name="popup" @before-enter="onBeforeEnter" @before-leave="onBeforeLeave" @enter="onEnter" ref="root">
			<slot v-bind="{close, toggle}" v-if="isOpen"></slot>
		</Transition>

	</Teleport>

</template>

<script lang="ts">

	import type { ComputedRef, PropType, Ref } from "vue";
	import { computed, defineComponent, nextTick, onMounted, onUnmounted, provide, reactive, ref, watch } from "vue";
	import type { LAxis } from "../shared";
	import type { LVector2D, LVector3D } from "../../util";
	import { addTouchAwareOutsideEventListener, animationFrame, applyStyles, onHotKey } from "../../util";
	import { LattePopupSymbol, useDialogAPI, useLatte, useZIndexAPI } from "../../";

	export default defineComponent({

		name: "LattePopup",

		emits: [
			"calculate",
			"close",
			"open"
		],

		inheritAttrs: false,

		props: {
			axis: {default: "vertical", type: String as PropType<LAxis>},
			isDismissible: {default: false, type: Boolean},
			isDumb: {default: false, type: Boolean},
			isLongPress: {default: false, type: Boolean},
			isNonBlocking: {default: false, type: Boolean},
			isModal: {default: false, type: Boolean},
			isOpen: {default: false, type: Boolean},
			isPersistent: {default: false, type: Boolean},
			isWidthInherited: {default: false, type: Boolean},
			offset: {default: 12, type: Number},
			marginX: {default: 0, type: Number},
			marginY: {default: 0, type: Number}
		},

		setup(props, {emit})
		{
			let removeOutsideEventListener: Function | undefined;

			const latte = useLatte();
			const dialogAPI = useDialogAPI();
			const zIndexAPI = useZIndexAPI();

			let escapeEvent: Function | null = null;

			const anchorRect: Ref<ClientRect | null> = ref(null);
			const isOpen = ref(props.isOpen);
			const margin = reactive({x: props.marginX, y: props.marginY});
			const offset = reactive({x: 0, y: 0});
			const popup = reactive({x: 0, y: 0});
			const position = reactive({x: 0, y: 0, z: 0});
			const root: Ref<HTMLElement | null> = ref(null);

			// Computed Props
			const isLeft: ComputedRef<boolean> = computed(() => position.x < (latte.windowSize.width / 2));
			const isTop: ComputedRef<boolean> = computed(() => position.y < (latte.windowSize.height / 2));
			const styles = reactive<any>({
				"--origin": "0 0",
				top: "0",
				left: "0",
				width: undefined,
				zIndex: "0"
			});

			const close = () =>
			{
				if (!isOpen.value)
					return;

				if (!props.isNonBlocking)
					dialogAPI.onClosed();

				isOpen.value = false;
			};

			const open = (evt?: MouseEvent, fn?: (elm: HTMLElement) => HTMLElement) =>
			{
				if (isOpen.value)
					return;

				if (evt)
				{
					let elm = evt.currentTarget as HTMLElement;

					if (fn)
						elm = fn(elm);

					updateAnchorRect(elm);
				}

				if (!props.isNonBlocking)
					dialogAPI.onOpened();

				nextTick(() =>
				{
					position.z = zIndexAPI.get();
					isOpen.value = true;

					animationFrame(calculate);
				});
			};

			const toggle = () => isOpen.value ? close() : open();

			const calculate = () =>
			{
				if (root.value === null || !(root.value instanceof HTMLElement))
					return;

				const elm = root.value;

				applyStyles(elm, styles);

				const pcr = elm.getBoundingClientRect();
				const l = position.x;
				const t = position.y;
				const h = anchorRect.value?.height || 0;
				const w = anchorRect.value?.width || 0;

				let adjust: LVector2D = {x: 0, y: 0};
				let pos: LVector2D = {x: 0, y: 0};

				if (props.axis === "horizontal")
				{
					pos.x = l + w + margin.x;
					pos.y = t + (h / 2) + margin.y - (pcr.height / 2);

					if (pos.y + pcr.height + 24 > latte.windowSize.height)
					{
						let n = t + (h / 2) + margin.y - pcr.height + 24;
						adjust.y = pos.y - n;
						pos.y = n;
					}

					if (pos.y - 24 < 0)
					{
						let n = t + (h / 2) + margin.y - 24;
						adjust.y = pos.y - n;
						pos.y = n;
					}

					if (!isLeft.value)
						pos.x = l - pcr.width - margin.x;
				}
				else
				{
					pos.x = l + (w / 2) + margin.x - (pcr.width / 2);
					pos.y = t + h + margin.y;

					if (pos.x + pcr.width + 24 > latte.windowSize.width)
					{
						let n = l + (w / 2) + margin.x - pcr.width + 24;
						adjust.x = pos.x - n;
						pos.x = n;
					}

					if (pos.x - 24 < 0)
					{
						let n = l + (w / 2) + margin.x - 24;
						adjust.x = pos.x - n;
						pos.x = n;
					}

					if (!isTop.value)
						pos.y = t - pcr.height - margin.y;
				}

				// if (props.isWidthInherited && anchorRect && props.axis === "vertical")
				// {
				// 	pos.x = anchorRect.value?.left || 0;
				// }

				popup.x = pos.x = Math.round(pos.x);
				popup.y = pos.y = Math.round(pos.y);

				emit("calculate", pos, adjust);
			};

			const updateAnchorRect = (elm: HTMLElement | null = null) =>
			{
				anchorRect.value = elm?.getBoundingClientRect() || null;

				if (isOpen.value)
					animationFrame(calculate);
			};

			const onIsDismissibleChanged = (isDismissible: boolean): void =>
			{
				if (isDismissible && !escapeEvent)
					escapeEvent = onHotKey("Escape", () => close());

				if (!isDismissible && escapeEvent)
					escapeEvent();
			};

			const onOffsetChanged = (offset: LVector2D) =>
			{
				styles["--origin"] = `${offset.x}px, ${offset.y}px`;
			};

			const onPopupChanged = (popup: LVector2D) =>
			{
				styles.top = `${popup.y}px`;
				styles.left = `${popup.x}px`;
			};

			const onPositionChanged = (position: LVector3D) =>
			{
				styles.zIndex = `${position.z}`;

				calculate();
			};

			const onBeforeEnter = (elm: HTMLElement) =>
			{
				root.value = elm;
				styles.width = props.isWidthInherited && anchorRect.value ? anchorRect.value.width + "px" : undefined;

				removeOutsideEventListener = addTouchAwareOutsideEventListener(elm, "mousedown", "touchstart", () =>
				{
					if (!isOpen.value || props.isPersistent)
						return;

					close();
				});

				animationFrame(calculate);
			};

			const onBeforeLeave = () => removeOutsideEventListener && removeOutsideEventListener();

			watch(anchorRect, rect =>
			{
				position.x = rect?.left || 0;
				position.y = rect?.top || 0;

				offset.x = props.axis === "horizontal" ? (isLeft.value ? -props.offset : props.offset) : 0;
				offset.y = props.axis === "vertical" ? (isTop.value ? -props.offset : props.offset) : 0;
			});

			watch(() => props.isDismissible, onIsDismissibleChanged, {immediate: true});
			watch(() => props.isOpen, isOpen => isOpen ? open() : close());
			watch(() => props.marginX, marginX => margin.x = marginX);
			watch(() => props.marginY, marginY => margin.y = marginY);

			watch(isOpen, isOpen => emit(isOpen ? "open" : "close"));
			watch(margin, calculate);
			watch(offset, onOffsetChanged);
			watch(popup, onPopupChanged, {flush: "post"});
			watch(position, onPositionChanged);
			watch(root, root => root && root instanceof HTMLElement && root.classList.add("popup"));
			watch(styles, styles => root && root.value instanceof HTMLElement && applyStyles(root.value!, styles));

			// Hooks
			onMounted(() =>
			{
				if (!isOpen.value)
					return;

				calculate();
			});

			onUnmounted(() =>
			{
				if (isOpen.value && !props.isNonBlocking)
					dialogAPI.onClosed();

				if (escapeEvent)
					escapeEvent();
			});

			provide(LattePopupSymbol, {
				isOpen,

				calculate,
				close,
				open,
				toggle
			});

			return {
				anchorRect,
				isOpen,

				close,
				open,
				toggle,
				position,

				onBeforeEnter,
				onBeforeLeave,
				onEnter: calculate,

				latte,
				root
			}
		}

	});

</script>
