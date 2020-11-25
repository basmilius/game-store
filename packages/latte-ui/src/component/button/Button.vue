<template>

	<component :is="tag" :class="classes" type="button" :key="label">

		<Spinner v-if="isSpinner"/>

		<Icon :name="icon" v-if="icon && !isSpinner"/>
		<Icon :name="iconBefore" v-if="iconBefore && !icon && !isSpinner"/>

		<span v-if="label">{{ label }}</span>

		<slot></slot>

		<Icon :name="iconAfter" v-if="iconAfter"/>

	</component>

</template>

<script lang="ts">

	import type { LButtonSize, LButtonType } from "./type";
	import type { PropType } from "vue";
	import { computed, defineComponent } from "vue";
	import { Icon } from "../icon";
	import { Spinner } from "../spinner";

	export default defineComponent({

		name: "LatteButton",

		components: {Icon, Spinner},

		props: {
			color: {default: null}, // LColor | String | null
			icon: {default: null}, // String | null
			iconAfter: {default: null}, // String | null
			iconBefore: {default: null}, // String | null
			isActive: {default: false, type: Boolean},
			isFluid: {default: false, type: Boolean},
			isFocus: {default: false, type: Boolean},
			isHover: {default: false, type: Boolean},
			isSpinner: {default: false, type: Boolean},
			label: {default: null}, // String | null
			size: {default: "medium", type: String as PropType<LButtonSize>},
			tag: {default: "button", type: String},
			type: {default: "contained", type: String as PropType<LButtonType>}
		},

		setup(props, {slots})
		{
			const classes = computed(() =>
			{
				const c = ["btn", "btn-" + props.type];

				if (props.color !== null)
					c.push("is-" + props.color);

				if (props.size !== "medium")
					c.push("is-" + props.size);

				if (props.isFluid)
					c.push("is-fluid");

				if (props.icon && !slots.default && props.label === null)
					c.push("is-icon");

				if (props.isActive)
					c.push("is-active");

				if (props.isFocus)
					c.push("is-focus");

				if (props.isHover)
					c.push("is-hover");

				return c;
			});

			return {
				classes
			};
		}

	});

</script>
