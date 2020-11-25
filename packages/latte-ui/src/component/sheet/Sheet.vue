<template>

	<slot name="opener" v-bind="{close, open, toggle}"/>

	<Teleport :to="latte.root">
		<Transition name="sheet" @after-leave="onAfterLeave" @before-enter="onBeforeEnter" @enter="onEnter">
			<div :class="classes" :style="styles" v-if="isOpen">
				<div class="sheet-mount">
					<slot v-bind="{close, open, toggle}"/>
				</div>
			</div>
		</Transition>
	</Teleport>

</template>

<script lang="ts">

	import type { PropType, Ref } from "vue";
	import { computed, defineComponent, onBeforeUnmount, onMounted, provide, reactive, ref, watch } from "vue";
	import type { LLocationCorners, LVector2D } from "../../";
	import { addTouchAwareEventListener, animationFrame, clamp, getCoords, isPointerInside, LatteSheetSymbol, useDialogAPI, useLatte, useZIndexAPI } from "../../";

	interface PointerParams
	{
		coords: LVector2D;
		event: MouseEvent & TouchEvent;
		isInside: boolean;
		prevent: boolean;
		rect: ClientRect;
		sheet: HTMLElement;
	}

	export default defineComponent({

		name: "LatteSheet",

		emits: ["close", "open"],

		inheritAttrs: false,

		props: {
			class: {default: null},
			height: {default: null},
			isModal: {default: false, type: Boolean},
			isOpen: {default: false, type: Boolean},
			isOverscrollAllowed: {default: true, type: Boolean},
			isResponding: {default: true, type: Boolean},
			location: {default: "bottom", type: String as PropType<LLocationCorners | string>},
			stops: {default: () => [0, 1], type: Array as PropType<number[]>},
			triggerThreshold: {default: 0}
		},

		setup(props, {emit})
		{
			const latte = useLatte();
			const dialogAPI = useDialogAPI();
			const zIndexAPI = useZIndexAPI();

			const events: Function[] = [];

			const positions = {
				current: {x: 0, y: 0},
				offset: {h: 0, w: 0},
				previous: {x: 0, y: 0},
				start: {x: 0, y: 0}
			};

			const canAnimate = ref(true);
			const isOpen = ref(false);
			const isTouching = ref(false);
			const sheet: Ref<HTMLElement | null> = ref(null);
			const sheetRect: Ref<ClientRect | null> = ref(null);
			const state = reactive({
				transform: {x: 0, y: 0},
				value: props.isOpen ? props.stops[1] || 1 : 0
			});
			const zIndex = ref(0);

			const maxValue = computed(() => props.stops[props.stops.length - 1]);

			const classes = computed(() => [
				props.class,
				"sheet",
				"is-" + props.location,
				"is-" + (props.isModal ? "modal" : "over"),
				"is-" + (isTouching.value || !canAnimate.value ? "touching" : "idle")
			]);
			const styles = computed(() => ({
				zIndex: zIndex.value.toString(),
				"--size": props.height || `${maxValue.value * 100}vh`,
				"--transform": `${state.transform.x}px, ${state.transform.y}px`
			}));

			let isClosing = false;

			const close = () =>
			{
				isClosing = true;
				isTouching.value = false;
				state.value = 0;

				animationFrame(() =>
				{
					isOpen.value = false;
					isClosing = false;
				}, 1);
			};

			const open = () =>
			{
				canAnimate.value = false;
				state.value = 0;
				isOpen.value = true;

				animationFrame(() =>
				{
					canAnimate.value = true;
					state.value = props.stops[1] || 1;
				}, 1);
			};

			const toggle = () => isOpen.value ? close() : open();

			const resetToStateValue = () =>
			{
				const rect = sheetRect.value;

				if (!rect)
					return;

				let x = 0, y = 0, value = state.value;

				switch (props.location)
				{
					case "top":
						y = (value - 1) * rect.height;
						break;

					case "left":
						x = (value - 1) * rect.width;
						break;

					case "right":
						x = (1 - value) * rect.width;
						break;

					case "bottom":
						y = (1 - value) * rect.height;
						break;
				}

				state.transform = {
					x: Math.ceil(x),
					y: Math.ceil(y)
				};
			}

			const onPointer = (fn: (params: PointerParams) => void) => (evt: MouseEvent & TouchEvent, prevent: boolean = true) =>
			{
				if (sheet.value === null || sheetRect.value === null || isClosing)
					return;

				const coords = getCoords(evt);

				if (!coords)
					return;

				fn({
					coords,
					event: evt,
					isInside: isPointerInside(sheet.value!, evt),
					prevent,
					rect: sheetRect.value!,
					sheet: sheet.value!
				});
			};

			const onPointerStart = onPointer(({coords}) =>
			{
				if (!isOpen.value)
					return;

				positions.current = coords;
				positions.offset = {h: 0, w: 0};
				positions.previous = coords;
				positions.start = {
					x: coords.x - state.transform.x,
					y: coords.y - state.transform.y
				};

				isTouching.value = true;
			});

			const onPointerMove = onPointer(({coords, event, isInside, prevent, sheet, rect}) =>
			{
				if (!isTouching.value || !props.isResponding)
					return;

				let canOverscroll = props.isOverscrollAllowed;

				if (isInside)
				{
					const canScroll = sheet.scrollHeight > rect.height && state.value === maxValue.value;
					const didScroll = sheet.scrollTop > 0;

					if (props.location === "bottom")
					{
						const wantScroll = positions.current.y > coords.y;

						if (canScroll && (didScroll || wantScroll))
						{
							isTouching.value = false;
							return;
						}

						canOverscroll = canOverscroll && !canScroll;
					}

					if (props.location === "left" || props.location === "right")
					{
						const wantScroll = Math.abs(positions.current.y - coords.y) > 5;

						if (canScroll && wantScroll)
						{
							isTouching.value = false;
							return;
						}

						canOverscroll = canOverscroll && !canScroll;
					}
				}

				// todo(bas): check if sheet is not open yet and open it
				//  when inside a trigger boundary.

				if (prevent)
					event.preventDefault();

				positions.previous = positions.current;
				positions.current = coords;

				const current = positions.current;
				const start = positions.start;

				const delta = {
					x: current.x - start.x,
					y: current.y - start.y
				};

				let x = 0, y = 0;

				switch (props.location)
				{
					case "top":
						y = start.y < current.y ? (canOverscroll ? delta.y / 3 : 0) : delta.y;
						break;

					case "left":
						x = start.x < current.x ? (canOverscroll ? delta.x / 3 : 0) : delta.x;
						break;

					case "right":
						x = start.x > current.x ? (canOverscroll ? delta.x / 3 : 0) : delta.x;
						break;

					case "bottom":
						y = start.y > current.y ? (canOverscroll ? delta.y / 3 : 0) : delta.y;
						break;
				}

				const percentageRaw = props.location === "left" || props.location === "right"
					? x / rect.width
					: y / rect.height;

				if (props.location === "top" || props.location === "left")
					state.value = Math.round((canOverscroll ? percentageRaw + 1 : clamp(percentageRaw + 1, 0, maxValue.value)) * 1000) / 1000;
				else
					state.value = Math.round((1 - (canOverscroll ? percentageRaw : clamp(percentageRaw, 0, maxValue.value))) * 1000) / 1000;
			});

			const onPointerEnd = onPointer(({isInside}) =>
			{
				if (!isTouching.value || !props.isResponding)
					return;

				const {current, previous, start} = positions;
				const {transform} = state;

				const didMoveX = !(start.x + transform.x === current.x && current.x === previous.x);
				const didMoveY = !(start.y + transform.y === current.y && current.y === previous.y);
				const stops = [...props.stops];

				const isTopLeft = props.location === "top" || props.location === "left";
				const isBottomRight = props.location === "bottom" || props.location === "right";
				const prop = props.location === "top" || props.location === "bottom" ? "y" : "x";

				const currentStop = (isTopLeft && previous[prop] <= current[prop]) || (isBottomRight && previous[prop] >= current[prop])
					? stops.find(s => s >= state.value) || maxValue.value
					: stops.reverse().find(s => s <= state.value) || 0;

				isTouching.value = false;

				switch (props.location)
				{
					case "left":
					case "right":
						if ((!isInside && !didMoveX) || currentStop === 0)
							close();
						else
							state.value = currentStop;
						break;

					case "top":
					case "bottom":
						if ((!isInside && !didMoveY) || currentStop === 0)
							close();
						else
							state.value = currentStop;
						break;
				}
			});

			const onIsOpenChanged = (isOpen: boolean, old: boolean) =>
			{
				if (isOpen === old)
					return;

				if (isOpen)
				{
					dialogAPI.onOpened();
					zIndex.value = zIndexAPI.get();
					emit("open");
				}
				else
				{
					dialogAPI.onClosed();
					emit("close");
				}

				resetToStateValue();
			};

			const onAfterLeave = () =>
			{
				sheet.value = null;
				sheetRect.value = null;
			};

			const onBeforeEnter = (elm: HTMLElement) =>
			{
				sheet.value = elm.children[0] as HTMLElement;
			};

			const onEnter = () =>
			{
				sheetRect.value = sheet.value!.getBoundingClientRect();
				resetToStateValue();
			};

			watch(() => props.isOpen, o => o ? open() : close());

			watch(isOpen, onIsOpenChanged as any, {immediate: true});
			watch(() => state.value, resetToStateValue);

			onMounted(() =>
			{
				events.push(
					addTouchAwareEventListener(document, "mousedown", "touchstart", onPointerStart as any, {passive: false}),
					addTouchAwareEventListener(document, "mousemove", "touchmove", onPointerMove as any, {passive: false}),
					addTouchAwareEventListener(document, "mouseup", "touchend", onPointerEnd as any, {passive: false})
				);

				if (props.isOpen)
					open();
			});

			onBeforeUnmount(() =>
			{
				events.forEach(remove => remove());

				if (isOpen.value)
					dialogAPI.onClosed();
			});

			provide(LatteSheetSymbol, {
				isOpen,

				close,
				open,
				toggle
			});

			return {
				latte,

				close,
				open,
				toggle,

				sheetRect,
				state,

				isOpen,
				classes,
				styles,

				onAfterLeave,
				onBeforeEnter,
				onEnter
			};
		}

	});

</script>
