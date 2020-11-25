<template>

	<slot name="header" v-bind="{close, open, toggle, isOpen}"></slot>

	<Transition @enter="onEnter" :name="isSimple ? 'expandable-simple' : 'expandable'">
		<slot v-if="isOpen"></slot>
	</Transition>

</template>

<script lang="ts">

	import { defineComponent, getCurrentInstance, ref, watch } from "vue";
	import { useExpandableGroup } from "../../symbols";
	import { forEachComponentWithName } from "../../util";

	export default defineComponent({

		name: "LatteExpandable",

		emits: [
			"close",
			"open"
		],

		props: {
			isOpen: {default: false, type: Boolean},
			isSimple: {default: false, type: Boolean}
		},

		setup(props, {emit})
		{
			const group = useExpandableGroup();
			const instance = getCurrentInstance()!;

			const isOpen = ref(props.isOpen);
			const isSimple = ref(props.isSimple);

			const close = () => isOpen.value = false;
			const open = () =>
			{
				if (group)
					forEachComponentWithName(group.$, instance.type.name!, c => c.setupState.close());

				isOpen.value = true;
			};
			const toggle = () => isOpen.value ? close() : open();

			const onEnter = (elm: HTMLElement) =>
			{
				const {height} = window.getComputedStyle(elm);

				elm.style.setProperty("--height", height);
			};

			watch(isOpen, () => emit(isOpen.value ? "open" : "close"));
			watch(() => props.isOpen, is => isOpen.value = is);

			return {
				isOpen,
				isSimple,

				close,
				open,
				toggle,

				onEnter
			};
		}

	});

</script>
