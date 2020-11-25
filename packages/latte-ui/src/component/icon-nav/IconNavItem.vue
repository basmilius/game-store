<template>

	<button class="icon-nav-item" :class="{'is-active': isActive}" @click="onClick">
		<Icon :name="icon" v-if="icon"/>
		<span v-if="label">{{ label }}</span>
		<slot></slot>
	</button>

</template>

<script lang="ts">

	import { computed, defineComponent, getCurrentInstance } from "vue";
	import { useIconNav } from "../../symbols";
	import { findComponentIndex } from "../../util";
	import { default as Icon } from "../icon/Icon.vue"

	export default defineComponent({

		name: "LatteIconNavItem",

		components: {Icon},

		emits: [
			"click"
		],

		props: {
			icon: {default: null}, // String | LFunctionalIcon
			label: {default: null} // String | null
		},

		setup(props, {emit})
		{
			const iconNav = useIconNav();
			const instance = getCurrentInstance()!;

			const index = computed(() => instance.parent ? findComponentIndex(instance.parent, instance.type.name!, c => c.uid === instance.uid) : -1);
			const isActive = computed(() => index.value === iconNav?.index.value);

			const onClick = (evt: MouseEvent) =>
			{
				emit("click", evt);
				iconNav?.setActive(index.value);
			};

			return {
				index,
				isActive,

				onClick
			};
		}

	});

</script>
