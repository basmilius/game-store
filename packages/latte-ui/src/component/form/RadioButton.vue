<template>

	<input type="radio" :class="classes" v-model="checked"/>

</template>

<script lang="ts">

	import { computed, defineComponent, ref, watch } from "vue";

	export default defineComponent({

		name: "LatteRadioButton",

		emits: [
			"update:modelValue"
		],

		props: {
			color: {default: null},
			modelValue: {default: null}
		},

		setup(props, {emit})
		{
			const checked = ref(props.modelValue);

			const classes = computed(() => ["form-radio", props.color ? "is-" + props.color : null]);

			watch(checked, checked => emit("update:modelValue", checked));
			watch(() => props.modelValue, value => checked.value = value);

			return {
				checked,

				classes
			};
		}

	});

</script>
