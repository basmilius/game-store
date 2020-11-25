<template>

	<component :is="tag" :class="classes" v-on:[eventName]="onClick">
		<Icon :name="icon" :class="iconClass" v-if="icon"/>
		<Icon :name="iconBefore" :class="iconClass" v-if="iconBefore && !icon"/>
		<span v-if="label">{{ label }}</span>
		<slot></slot>
		<Icon :name="iconAfter" :class="iconClass" v-if="iconAfter"/>
	</component>

</template>

<script lang="ts">

	import { computed, defineComponent } from "vue";
	import { default as Icon } from "../icon/Icon.vue";

	export default defineComponent({

		name: "LatteNavItem",

		components: {Icon},

		emits: [
			"click"
		],

		props: {
			color: {default: null}, // LColor | String | null
			disabled: {default: false, type: Boolean},
			icon: {default: null}, // String | null
			iconAfter: {default: null}, // String | null
			iconBefore: {default: null}, // String | null
			iconClass: {default: null}, // String | null
			isActive: {default: false, type: Boolean},
			isFocus: {default: false, type: Boolean},
			isHover: {default: false, type: Boolean},
			label: {default: null}, // String | null
			tag: {default: "button", type: String}
		},

		setup(props, {emit})
		{
			const classes = computed(() =>
			{
				const c = ["nav-link"];

				if (props.color !== null)
					c.push("is-" + props.color);

				if (props.disabled)
					c.push("is-disabled");

				if (props.isActive)
					c.push("is-active");

				if (props.isFocus)
					c.push("is-focus");

				if (props.isHover)
					c.push("is-hover");

				return c;
			});

			const eventName = computed(() => props.tag === "router-link" ? "noop" : "click");

			const onClick = (evt: MouseEvent) =>
			{
				emit("click", evt);
			};

			return {
				classes,
				eventName,
				onClick
			};
		}

	});

</script>
