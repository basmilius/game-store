<template>

	<nav :class="classes">
		<slot></slot>
	</nav>

</template>

<script lang="ts">

	import type { LAxis } from "../shared";
	import type { PropType } from "vue";
	import { computed, defineComponent, provide, ref, watch } from "vue";
	import { LatteIconNavSymbol } from "../../symbols";

	export default defineComponent({

		name: "LatteIconNav",

		emits: [
			"update:modelValue"
		],

		props: {
			axis: {default: "horizontal", type: String as PropType<LAxis>},
			color: {default: null}, // LColor | String | null
			isFlat: {default: false, type: Boolean},
			isShifting: {default: false, type: Boolean},
			isTransparent: {default: false, type: Boolean},
			modelValue: {default: -1, type: Number}
		},

		setup(props, {emit})
		{
			const index = ref(props.modelValue);

			const classes = computed(() =>
			{
				const c = ["icon-nav", "icon-nav-" + props.axis];

				if (props.color)
					c.push("is-" + props.color);

				if (props.isFlat)
					c.push("is-flat");

				if (props.isShifting)
					c.push("is-shifting");

				if (props.isTransparent)
					c.push("is-transparent");

				return c;
			});

			const setActive = (idx: number) =>
			{
				index.value = idx;
				emit("update:modelValue", idx);
			};

			watch(() => props.modelValue, val => index.value = val);

			provide(LatteIconNavSymbol, {
				index,
				setActive
			});

			return {
				classes,
				index,

				setActive
			};
		}

	});

</script>
