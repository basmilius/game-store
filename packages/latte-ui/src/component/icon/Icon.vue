<script lang="ts">

	import { defineComponent, toRefs } from "vue";
	import { useLatte } from "../../symbols";

	export default defineComponent({

		name: "LatteIcon",

		props: {
			name: {default: null} // String | null
		},

		setup(props)
		{
			const {name} = toRefs(props);

			return () => useLatte().options.iconRenderer!(name.value);
		}

	});

</script>
