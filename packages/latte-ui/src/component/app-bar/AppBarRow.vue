<template>

	<div :class="classes">
		<slot></slot>
	</div>

</template>

<script lang="ts">

	import { computed, defineComponent } from "vue";

	export default defineComponent({

		name: "LatteAppBarRow",

		props: {
			isAutoHeight: {default: false, type: Boolean},
			isContainer: {default: false, type: Boolean}
		},

		setup(props)
		{
			const classes = computed(() =>
			{
				const c = ["app-bar-row"];

				if (props.isAutoHeight)
					c.push("is-auto-height");

				if (props.isContainer)
					c.push("container");

				return c;
			});

			return {
				classes
			}
		}

	});

</script>
