<template>

	<Expandable @close="$emit('close')" @open="$emit('open')">

		<template #header="api">
			<slot name="header" v-bind="api"></slot>
		</template>

		<template #default>
			<Nav :type="type">
				<slot></slot>
			</Nav>
		</template>

	</Expandable>

</template>

<script lang="ts">

	import type { PropType } from "vue";
	import { defineComponent } from "vue";
	import type { LNavType } from "../shared";
	import { default as Expandable } from "../expandable/Expandable.vue";
	import { default as Nav } from "./Nav.vue";

	export default defineComponent({

		name: "LatteCollapsibleNav",

		components: {Expandable, Nav},

		emits: [
			"close",
			"open"
		],

		props: {
			type: {default: "list", type: String as PropType<LNavType>}
		}

	});

</script>
