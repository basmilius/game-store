<script lang="ts">

	import type { VNode } from "vue";
	import { cloneVNode, defineComponent, Fragment, h, ref, toRefs, watch } from "vue";

	export default defineComponent({

		name: "LatteTabContainer",

		emits: [
			"update:modelValue"
		],

		props: {
			modelValue: {default: 0, type: Number}
		},

		setup(props, {emit, slots})
		{
			const {modelValue} = toRefs(props);

			const currentTabIndex = ref(modelValue.value);

			const activateTab = (index: number) => currentTabIndex.value = index;

			watch(currentTabIndex, currentTabIndex => emit("update:modelValue", currentTabIndex));
			watch(modelValue, modelValue => currentTabIndex.value = modelValue);

			return () =>
			{
				const api: any = {
					activateTab,
					index: currentTabIndex.value
				};

				let tabIndex = -1;

				const slotViews: VNode[] = slots.default ? slots.default(api) : [];
				const tabs = slotViews
					.filter(c => (c.type as any).name === "LatteTab");

				api.tabs = tabs.map((view, index) => ({
					...view.props,
					activate: () => activateTab(index),
					isActive: currentTabIndex.value === index
				}));

				return h(Fragment, [
					...(slots.tabs ? slots.tabs(api) : []),
					slotViews.map(c => (c.type as any).name !== "LatteTab" ? c : cloneVNode(c, {isActive: ++tabIndex === currentTabIndex.value}))
				]);
			};
		}

	});

</script>
