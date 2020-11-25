<script lang="ts">

	import { defineComponent, h } from "vue";

	export default defineComponent({

		name: "LatteSpinner",

		props: {
			color: {default: null} // LColor | String | null
		},

		setup(props)
		{
			return () => h("span", {
				class: ["spinner", "is-" + (props.color || "null")]
			});
		}

	});

</script>
