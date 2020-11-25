<template>

	<slot/>

</template>

<script lang="ts">

	import { defineComponent, getCurrentInstance, onMounted, onUnmounted, ref } from "vue";

	const BLACKLISTED = [
		"Tab"
	];

	export default defineComponent({

		name: "LatteKeyboardTrap",

		setup(props, {emit})
		{
			const instance = getCurrentInstance()!;

			const root = ref<HTMLElement | null>(null);

			let events: Function[] = [];

			const addEvents = () =>
			{
				events.forEach(remove => remove());
				events.splice(0, events.length);
			};

			onMounted(() =>
			{
				console.log(instance.subTree);
			});

			onUnmounted(() =>
			{
			});

			return {};
		}

	});

</script>
