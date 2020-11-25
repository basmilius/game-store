<template>

	<span :class="classes">{{ title }}</span>

</template>

<script lang="ts">

	import { computed, defineComponent } from "vue";

	export default defineComponent({

		name: "LatteAppBarTitle",

		props: {
			isSub: {default: false, type: Boolean},
			title: {default: "AppBar", type: String}
		},

		setup(props)
		{
			const classes = computed(() => props.isSub ? "app-bar-sub-title" : "app-bar-title");

			return {
				classes
			}
		}

	});

</script>
