<template>

	<div class="swiper-item" :style="styles" ref="root">
		<slot v-bind="state"></slot>
	</div>

</template>

<script lang="ts">

	import type { SwiperItemState } from "./type";
	import type { Ref } from "vue";
	import { computed, defineComponent, getCurrentInstance, ref, watch } from "vue";
	import { useSwiper } from "../../symbols";
	import { findComponentIndex } from "../../util/vue";
	import { roundStep } from "../../util/math";

	export default defineComponent({

		name: "LatteSwiperItem",

		emits: [
			"activate",
			"deactivate"
		],

		setup(props, {emit})
		{
			const instance = getCurrentInstance()!;
			const swiper = useSwiper();

			if (!swiper)
				throw new Error("LatteUI: A Swiper component is required to use SwiperItem.");

			const rect: Ref<ClientRect | null> = ref(null);
			const root: Ref<HTMLElement | null> = ref(null);

			const index = computed(() => findComponentIndex(instance.parent!, instance.type.name!, c => c.uid === instance.uid));
			const offset = computed(() => swiper.offset - index.value);

			const isCurrent = computed(() =>
			{
				let is = false;
				let o = roundStep(swiper.offset);

				for (let i = 0; !is && i < swiper.items; i++)
					is = o + i === index.value;

				return is;
			});

			const state = computed(() => ({
				index: index.value,
				isCurrent: isCurrent.value,
				height: roundStep(rect.value?.height || 0),
				width: roundStep(rect.value?.width || 0),
				offset: offset.value,
				offsetAbsolute: Math.abs(offset.value),
				swiper
			} as SwiperItemState));

			const styles = computed(() => swiper.effect(state.value));

			const onIsCurrentChanged = (isCurrent: boolean) =>
			{
				emit(isCurrent ? "activate" : "deactivate");
			};

			const onRootChanged = (root: HTMLElement | null) =>
			{
				if (root)
					rect.value = root.children[0].getBoundingClientRect();
			};

			const updateRect = () => onRootChanged(root.value);

			watch(isCurrent, onIsCurrentChanged);
			watch(root, onRootChanged);

			return {
				root,

				index,
				isCurrent,
				offset,
				state,
				styles,

				updateRect
			};
		}

	});

</script>
