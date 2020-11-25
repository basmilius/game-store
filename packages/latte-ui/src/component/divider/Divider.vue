<script lang="ts">

	import { defineComponent, h } from "vue";

	export default defineComponent({

		name: "LatteDivider",

		props: {
			isHorizontal: {default: false, type: Boolean},
			isVertical: {default: false, type: Boolean}
		},

		setup(props)
		{
			return () => h("div", {
				class: [
					"divider",
					props.isHorizontal ? "divider-horizontal" : undefined,
					props.isVertical ? "divider-vertical" : undefined
				]
			});
		}

	});

</script>
