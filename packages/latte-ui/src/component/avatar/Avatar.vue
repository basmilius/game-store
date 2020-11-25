<template>

	<img class="avatar" :alt="alt" :src="src" :title="title" v-if="src"/>
	<Initials class="avatar" :letters="letters" v-else/>

</template>

<script lang="ts">

	import { defineComponent } from "vue";
	import { default as Initials } from "./Initials.vue";

	export default defineComponent({

		name: "LatteAvatar",

		components: {Initials},

		props: {
			alt: {default: null}, // String | null
			letters: {default: null}, // String | null
			src: {default: null}, // String | null
			title: {default: null} // String | null
		}

	});

</script>
