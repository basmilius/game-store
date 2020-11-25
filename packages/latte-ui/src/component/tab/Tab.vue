<template>

	<slot v-if="isActive"></slot>

</template>

<script lang="ts">

	import { defineComponent } from "vue";

	export default defineComponent({

		name: "LatteTab",

		props: {
			isActive: {default: false, type: Boolean},
			icon: {default: null},
			label: {default: null}
		}

	});

</script>
