<template>

	<svg class="user-select-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<rect fill="hsl(var(--base-light), var(--base-light-l))" height="24" width="24"/>
		<rect :fill="color" height="24" width="24" opacity=".25"/>
		<text :fill="color" x="12" y="16" style="font-family: var(--font)" font-size="11" font-weight="500" text-anchor="middle" text-rendering="geometricPrecision">
			{{ letters }}
		</text>
	</svg>

</template>

<script lang="ts">

	import { computed, defineComponent } from "vue";

	const colors = [
		"#477d59",
		"#a54549",
		"#c1823f",
		"#3c9b9f",
		"#aa4b83",
		"#b3464b",
		"#e5993b",
		"#7f51a9"
	];

	export default defineComponent({

		name: "LatteInitials",

		props: {
			letters: {default: "BM", required: true, type: String}
		},

		setup(props)
		{
			const seed = computed(() =>
			{
				let s = 0;

				for (let i = 0; i < props.letters.length; i++)
					s ^= props.letters.charCodeAt(i);

				return s;
			});

			const color = computed(() => colors[seed.value % colors.length]);

			return {
				color,
				seed
			}
		}

	});

</script>
