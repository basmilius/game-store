<template>

	<span class="nav-header" v-if="label">{{ label }}</span>

</template>

<script lang="ts">

	import { defineComponent } from "vue";

	export default defineComponent({

		name: "LatteNavHeader",

		props: {
			label: {default: null} // String | null
		}

	});

</script>
