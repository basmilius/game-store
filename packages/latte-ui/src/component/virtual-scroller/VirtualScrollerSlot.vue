<template>

	<div class="virtual-scroller-slot" :role="uniqueKey">
		<slot></slot>
	</div>

</template>

<script lang="ts">

	import type { PropType } from "vue";
	import { defineComponent } from "vue";
	import type { LAxis } from "../shared";
	import { useWrapper } from "./wrapper";

	export default defineComponent({

		name: "LatteVirtualScrollerSlot",

		emits: [
			"update:size"
		],

		props: {
			axis: {default: "vertical", type: String as PropType<LAxis>},
			uniqueKey: {required: true, type: String}
		},

		setup(props, {emit})
		{
			const {size} = useWrapper(emit, props);

			return {
				size
			};
		}

	});

</script>
