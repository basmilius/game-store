<template>

	<img :src="url" :alt="alt || 'Emoji'" class="emoji"/>

</template>

<script lang="ts">

	import { computed, defineComponent } from "vue";
	import { useLatte } from "../../";
	import { sprintf } from "../../util";

	export default defineComponent({

		name: "LatteEmoji",

		props: {
			alt: {default: null},
			codePoint: {required: true}
		},

		setup(props)
		{
			const latte = useLatte();
			const {baseUrl, fileName} = latte.options.emoji!;

			if (!baseUrl || !fileName)
				throw new Error("LatteUI: Emoji options should be provided.");

			const url = computed(() => baseUrl + sprintf(fileName, props.codePoint));

			return {
				url
			};
		}

	});

</script>
