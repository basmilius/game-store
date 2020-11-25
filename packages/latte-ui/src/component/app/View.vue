<template>

	<div class="app-view">
		<slot></slot>
	</div>

</template>

<script lang="ts">

	import { defineComponent } from "vue";

	export default defineComponent({

		name: "LatteView",

		props: {
			isHost: {default: false, type: Boolean}
		}

	});

</script>
