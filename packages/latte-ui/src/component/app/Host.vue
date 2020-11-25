<template>

	<slot></slot>

	<Snackbar
		:key="s.id"
		:id="s.id"
		:reject="s.reject"
		:resolve="s.resolve"
		v-bind="s.options"
		is-fixed
		v-for="s of snackbar.instances.value"/>

</template>

<script lang="ts">

	import { defineComponent } from "vue";
	import { useSnackbar } from "../../composable";
	import { default as Snackbar } from "../snackbar/Snackbar.vue";

	export default defineComponent({

		name: "LatteHost",

		components: {Snackbar},

		setup()
		{
			return {
				snackbar: useSnackbar()
			};
		}

	});

</script>
