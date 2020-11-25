<template>

	<NavItem @click="$emit('select')">
		<slot></slot>
	</NavItem>

</template>

<script lang="ts">

	import { defineComponent } from "vue";
	import { default as NavItem } from "../nav/NavItem.vue";

	export default defineComponent({

		name: "LatteSelectOption",

		components: {
			NavItem
		},

		emits: [
			"select"
		],

		props: {
			value: { default: null }
		}

	});

</script>
