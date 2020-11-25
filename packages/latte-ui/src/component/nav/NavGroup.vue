<template>

	<Divider is-horizontal v-if="hasPreviousSibling"/>

	<Nav :type="type">
		<NavHeader :label="label" v-if="label"/>
		<slot></slot>
	</Nav>

</template>

<script lang="ts">

	import type { LNavType } from "../shared";
	import type { PropType } from "vue";
	import { defineComponent, getCurrentInstance, onMounted, ref } from "vue";
	import { default as Divider } from "../divider/Divider.vue";
	import { default as Nav } from "./Nav.vue";
	import { default as NavHeader } from "./NavHeader.vue";
	import { findComponentIndex } from "../../util/vue";

	export default defineComponent({

		name: "LatteNavGroup",

		components: {Divider, Nav, NavHeader},

		props: {
			label: {default: null}, // String | null
			type: {default: "list", type: String as PropType<LNavType>}
		},

		setup()
		{
			const instance = getCurrentInstance()!;
			const hasPreviousSibling = ref(false);

			onMounted(() => hasPreviousSibling.value = findComponentIndex(instance.parent!, instance.type.name!, c => c.uid === instance.uid) > 0);

			return {
				hasPreviousSibling
			};
		}

	});

</script>
