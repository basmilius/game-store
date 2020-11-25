<template>

	<component :is="tag" :class="classes">
		<span v-if="label">{{ label }}</span>
		<button class="close" tabindex="-1" @click="onDismissClick" v-if="isDismissible"></button>
	</component>

</template>

<script lang="ts">

	import { computed, defineComponent } from "vue";

	export default defineComponent({

		name: "LatteBadge",

		props: {
			color: {default: null}, // LColor | String | null
			isDismissible: {default: false, type: Boolean},
			label: {default: null}, // String | null
			tag: {default: "div", type: String}
		},

		setup(props, {emit})
		{
			const classes = computed(() =>
			{
				const c = ["badge"];

				if (props.color !== null)
					c.push(`is-${props.color}`);

				return c;
			});

			const onDismissClick = (evt: MouseEvent) => emit("dismiss", evt);

			return {
				classes,
				onDismissClick
			}
		}

	});

</script>
