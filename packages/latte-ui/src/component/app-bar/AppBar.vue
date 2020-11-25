<template>

	<div :class="classes">
		<slot></slot>
	</div>

</template>

<script lang="ts">

	import { computed, defineComponent } from "vue";

	export default defineComponent({

		name: "LatteAppBar",

		props: {
			color: {default: null}, // LColor | String | null
			isMain: {default: false, type: Boolean},
			isTransparent: {default: false, type: Boolean}
		},

		setup(props)
		{
			const classes = computed(() =>
			{
				const c = ["app-bar"];

				if (props.color !== null)
					c.push(`is-${props.color}`);

				if (props.isMain)
					c.push("is-main");

				if (props.isTransparent)
					c.push("is-transparent");

				return c;
			});

			return {
				classes
			}
		}

	});

</script>
