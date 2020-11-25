<template>

	<slot></slot>

</template>

<script lang="ts">

	import { defineComponent } from "vue";
	import { LatteExpandableGroupSymbol } from "../../symbols";

	export default defineComponent({

		nama: "LatteExpandableGroup",

		provide()
		{
			return {
				[LatteExpandableGroupSymbol as symbol]: this
			};
		}

	});

</script>
