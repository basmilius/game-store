<template>

	<nav class="nav" :class="[color ? 'is-' + color : null, 'nav-' + type]">
		<slot></slot>
	</nav>

</template>

<script lang="ts">

	import type { PropType } from "vue";
	import { defineComponent } from "vue";
	import type { LNavType } from "../shared";

	export default defineComponent({

		name: "LatteNav",

		props: {
			color: {default: null}, // LColor | String | null
			type: {default: "list", type: String as PropType<LNavType>}
		}

	});

</script>
