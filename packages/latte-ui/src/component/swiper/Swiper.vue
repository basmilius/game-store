<template>

	<div class="swiper" ref="root" :class="classes" :style="styles">
		<slot></slot>
	</div>

</template>

<script lang="ts">

	import type { LAxis } from "../shared";
	import type { PropType, Ref } from "vue";
	import { computed, defineComponent, getCurrentInstance, onMounted, onUnmounted, provide, reactive, ref, toRefs, watch } from "vue";
	import { LatteSwiperSymbol } from "../../symbols";
	import type { LVector2D } from "../../util";
	import { addEventListener, animationFrame, ceilStep, clamp, floorStep, forEachComponentWithName, getCoords, isPointerInside, roundStep } from "../../util";
	import { addTouchAwareEventListener } from "../../util/event";
	import { getEffect } from "./effects";

	interface PointerParams
	{
		coords: LVector2D;
		elm: HTMLDivElement;
		event: MouseEvent | TouchEvent;
		isInside: boolean;
	}

	interface PointerStates
	{
		current: LVector2D;
		previous: LVector2D;
		start: LVector2D;
		velocity: number;
		wheel: LVector2D;
	}

	let isSwiperDragging = false;

	export default defineComponent({

		name: "LatteSwiper",

		emits: [
			"update:modelValue"
		],

		props: {
			direction: {default: "horizontal", type: String as PropType<LAxis>},
			isBlocking: {default: false, type: Boolean},
			effect: {default: "default"},
			items: {default: 1},
			modelValue: {default: 0},
			threshold: {default: 20}
		},

		setup(props, {emit})
		{
			const instance = getCurrentInstance()!;

			const {items, modelValue, threshold} = toRefs(props);

			const isDragging = ref(false);
			const isDraggingSelf = ref(false);
			const offset = ref(modelValue.value);
			const pointer = reactive<PointerStates>({
				current: {x: 0, y: 0},
				previous: {x: 0, y: 0},
				start: {x: 0, y: 0},
				velocity: 0,
				wheel: {x: 0, y: 0}
			});
			const rect: Ref<ClientRect | null> = ref(null);
			const root: Ref<HTMLElement | null> = ref(null);

			const classes = computed(() => ({
				"is-dragging": isDragging.value
			}));
			const styles = reactive({
				height: "0px",
				touchAction: "auto"
			});
			const effect = computed(() => getEffect(props.effect));
			const fill = computed(() => 1 / clamp(props.items, 1, 12));
			const isHorizontal = computed(() => props.direction === "horizontal");
			const isVertical = computed(() => props.direction === "vertical");

			const events: Function[] = [];

			let didPassThreshold = false;
			let isRunning = false;
			let offsetStart = 0;
			let wheelTimer = 0;

			const frame = () =>
			{
				if (!root.value)
					return;

				const axis = isHorizontal.value ? "x" : "y";
				const count = root.value.children.length - (items.value - 1);
				const delta = pointer.current[axis] - pointer.start[axis];
				const size = isHorizontal.value ? "width" : "height";

				if (isDragging.value)
				{
					pointer.velocity = pointer.current[axis] - pointer.previous[axis];
				}
				else
				{
					let fn = pointer.velocity > 0 && pointer.velocity > 5 ? floorStep : (pointer.velocity < -5 ? ceilStep : roundStep);

					offset.value = clamp(fn(offset.value), 0, count - 1);
					isRunning = false;
					return;
				}

				if (Math.abs(delta) > threshold.value || didPassThreshold)
				{
					didPassThreshold = true;

					if (rect.value)
						offset.value = offsetStart - (delta / (rect.value[size] * fill.value));

					let min = 0;
					let max = roundStep(count - 1);

					if (offset.value < min)
					{
						let diff = Math.abs(offset.value);

						offset.value = 0 - (diff * .3);
					}
					else if (offset.value > max)
					{
						let diff = offset.value - max;

						offset.value = max + (diff * .3);
					}
				}

				if (isRunning)
					animationFrame(frame);
			};

			const onPointer = (fn: (params: PointerParams) => void) => (evt: MouseEvent | TouchEvent) =>
			{
				if (root.value === null)
					return;

				const coords = getCoords(evt);
				const elm = root.value! as HTMLDivElement;

				if (!coords)
					return;

				fn({
					coords,
					elm,
					event: evt,
					isInside: isPointerInside(elm, evt)
				});
			};

			const onPointerStart = onPointer(({coords, elm}) =>
			{
				isDragging.value = true;
				isDraggingSelf.value = true;
				offsetStart = offset.value;

				pointer.current = coords;
				pointer.previous = coords;
				pointer.start = coords;

				rect.value = elm.getBoundingClientRect();

				animationFrame(() =>
				{
					isRunning = true;
					frame();
				});
			});

			const onPointerMove = onPointer(({coords, event}) =>
			{
				if (!isDragging.value)
					return;

				pointer.previous = pointer.current;
				pointer.current = coords;

				if (props.isBlocking)
					event.preventDefault();
			});

			const onPointerEnd = onPointer(({event}) =>
			{
				if (!isDragging.value)
					return;

				onPointerMove(event);

				didPassThreshold = false;
				isDragging.value = false;
				isDraggingSelf.value = false;

				animationFrame(resizeToActiveItem);
			});

			const onWheel = (evt: WheelEvent) =>
			{
				if (!root.value)
					return;

				const {deltaX, deltaY} = evt;

				if (isHorizontal.value && deltaX === 0)
					return;

				if (isVertical.value && deltaY === 0)
					return;

				if (wheelTimer !== 0)
					window.clearTimeout(wheelTimer);

				if (!isDragging.value)
				{
					onPointerStart(new MouseEvent("mousedown", {
						clientX: evt.clientX,
						clientY: evt.clientY
					}));

					pointer.wheel.x = evt.clientX;
					pointer.wheel.y = evt.clientY;
				}
				else
				{
					pointer.wheel.x -= deltaX;
					pointer.wheel.y -= deltaY;
				}

				onPointerMove(new MouseEvent("mousemove", {
					clientX: pointer.wheel.x,
					clientY: pointer.wheel.y
				}));

				const end = () =>
				{
					onPointerEnd(new MouseEvent("mouseup", {
						clientX: pointer.wheel.x,
						clientY: pointer.wheel.y
					}));

					wheelTimer = 0;
				};

				wheelTimer = window.setTimeout(end, 50);

				evt.preventDefault();
			};

			const resizeToActiveItem = () => animationFrame(() =>
			{
				if (!isHorizontal)
					return;

				let height = 0;

				forEachComponentWithName(instance, "LatteSwiperItem", c =>
				{
					c.setupState.updateRect();

					const {height: h, isCurrent} = c.setupState.state;

					if (isCurrent && h > height)
						height = h;
				});

				styles.height = `${height}px`;
			});

			onMounted(() =>
			{
				if (!root.value)
					return;

				const elm = root.value!;

				rect.value = elm.getBoundingClientRect();

				animationFrame(resizeToActiveItem);

				events.push(
					addEventListener(elm, "wheel", onWheel as any, {passive: false}),

					addTouchAwareEventListener(elm, "mousedown", "touchstart", onPointerStart as any, {passive: false}),
					addTouchAwareEventListener(document, "mousemove", "touchmove", onPointerMove as any, {passive: false}),
					addTouchAwareEventListener(document, "mouseup", "touchend", onPointerEnd as any, {passive: false}),
					addTouchAwareEventListener(document, "cancel", "touchend", onPointerEnd as any, {passive: false})
				);
			});

			onUnmounted(() => events.forEach(remove => remove()));

			watch(modelValue, value =>
			{
				if (isDraggingSelf.value || value === offset.value)
					return;

				isDragging.value = isSwiperDragging;
				offset.value = value;
			});

			watch(isDraggingSelf, isDragging => isSwiperDragging = isDragging);
			watch(isHorizontal, is => styles.touchAction = is ? "pan-y" : "pan-x", {immediate: true});
			watch(offset, offset => emit("update:modelValue", offset));

			provide(LatteSwiperSymbol, reactive({
				effect,
				fill,
				isHorizontal,
				isVertical,
				items,
				offset,
				rect
			}));

			return {
				root,
				fill,

				classes,
				styles,

				isDragging
			};
		}

	});

</script>
