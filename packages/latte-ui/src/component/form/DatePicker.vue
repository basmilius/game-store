<template>

	<Popup>
		<template #opener="{open}">
			<div class="input-group" v-bind="$attrs">
				<input type="date" class="form-control" :value="inputValue"/>
				<div class="input-group-addon">
					<Button color="base-dark" :icon="icons.calendar" size="small" type="text" @click="open($event, elm => elm.parentElement.parentElement)"/>
				</div>
			</div>
		</template>

		<template #default="{}">
			<div class="panel bg-base-light radius-default shadow-outline-8">
				<DatePickerCalendar v-bind="$props" @update:modelValue="onValueUpdate"/>
			</div>
		</template>
	</Popup>

</template>

<script lang="ts">

	import type { PropType } from "vue";
	import { computed, defineComponent, ref, watch } from "vue";
	import type { DatePickerValue } from "./shared";
	import { Button } from "../button";
	import { Popup } from "../popup";
	import { default as DatePickerCalendar } from "./DatePickerCalendar.vue";
	import { useLatte } from "../../symbols";
	import { yyyymmdd } from "../../util/datetime";

	export default defineComponent({

		name: "LatteDatePicker",

		components: {
			Button, Popup,
			DatePickerCalendar
		},

		emits: [
			"update:modelValue"
		],

		inheritAttrs: false,

		props: {
			modelValue: {default: null, type: Object as PropType<DatePickerValue>},
			yearsAfter: {default: 5},
			yearsBefore: {default: 50}
		},

		setup(props, {emit})
		{
			const today = new Date();

			const latte = useLatte();
			const {icons} = latte.options;

			const selectedValue = ref(props.modelValue || today);

			const inputValue = computed(() => yyyymmdd(selectedValue.value));

			const onValueUpdate = (value: DatePickerValue | DatePickerValue[]) => emit("update:modelValue", value);

			watch(() => props.modelValue, date => selectedValue.value = date || today);

			return {
				icons,

				selectedValue,

				inputValue,

				onValueUpdate
			};
		}

	});

</script>
