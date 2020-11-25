<template>

	<div class="virtual-scroller-item" :key="uniqueKey" role="listitem">
		<slot v-bind="{axis, index, item, size, uniqueKey}"></slot>
	</div>

</template>

<script lang="ts">

	import type { PropType } from "vue";
	import { defineComponent } from "vue";
	import type { LAxis } from "../shared";
	import { useWrapper } from "./wrapper";

	export default defineComponent({

		name: "LatteVirtualScrollerItem",

		emits: [
			"update:size"
		],

		props: {
			axis: {default: "vertical", type: String as PropType<LAxis>},
			index: {required: true, type: Number},
			item: {required: true, type: Object as PropType<any>},
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
