<template>

	<input type="checkbox" :class="classes" v-model="checked"/>

</template>

<script lang="ts">

	import { computed, defineComponent, ref, watch } from "vue";

	export default defineComponent({

		name: "LatteToggle",

		emits: [
			"update:modelValue"
		],

		props: {
			color: {default: null},
			modelValue: {default: false, type: Boolean}
		},

		setup(props, {emit})
		{
			const checked = ref(props.modelValue);

			const classes = computed(() => ["form-toggle", props.color ? "is-" + props.color : null]);

			watch(checked, checked => emit("update:modelValue", checked));
			watch(() => props.modelValue, value => checked.value = value);

			return {
				checked,

				classes
			};
		}

	});

</script>
