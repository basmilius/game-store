<template>

	<Popup v-bind="$attrs" v-if="breakpoints.isExpanded">
		<template #opener="api">
			<slot name="opener" v-bind="api"/>
		</template>

		<template #default="api">
			<slot v-bind="{...api, type: 'popup'}"/>
		</template>
	</Popup>

	<Sheet is-modal v-bind="$attrs" v-else>
		<template #opener="api">
			<slot name="opener" v-bind="api"/>
		</template>

		<template #default="api">
			<slot v-bind="{...api, type: 'sheet'}"/>
		</template>
	</Sheet>

</template>

<script lang="ts">

	import { defineComponent } from "vue";
	import { default as Popup } from "./Popup.vue";
	import { default as Sheet } from "../sheet/Sheet.vue";
	import { useBreakpointsAPI } from "../../composable";

	export default defineComponent({

		name: "LatteResponsivePopup",

		components: {
			Popup, Sheet
		},

		inheritAttrs: false,

		setup()
		{
			const breakpoints = useBreakpointsAPI();

			return {
				breakpoints
			};
		}

	});

</script>
