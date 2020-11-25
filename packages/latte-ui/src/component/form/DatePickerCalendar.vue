<template>

	<div class="panel date-picker">
		<div class="panel-body date-picker-header d-flex align-items-center pb-3">
			<Button :icon="icons.chevronLeft" size="small" type="text" @click="navigate(-1)"/>

			<div class="mx-auto">
				<Button :label="viewDateMonth" size="small" type="text" @click="setView(DatePickerView.Months)"/>
				<Button :label="viewDateYear" size="small" type="text" @click="setView(DatePickerView.Years)"/>
			</div>

			<Button :icon="icons.chevronRight" size="small" type="text" @click="navigate(1)"/>
		</div>

		<template v-if="view === DatePickerView.Dates">

			<div class="panel-body date-picker-dates pt-0" ref="datesViewEl">
				<template v-for="day of visibleDays">
					<span class="date-picker-day">{{ day }}</span>
				</template>
				<template v-for="date of visibleDates">
					<button class="btn is-small" :class="getClassesForDate(date)" @click="setValue(date)">
						<span>{{ date.getDate() }}</span>
					</button>
				</template>
			</div>

		</template>

		<template v-if="view === DatePickerView.Months">

			<Divider is-horizontal/>

			<Nav type="list" class="date-picker-months is-primary" :style="viewStyles">
				<template v-for="month of visibleMonths">
					<NavItem :label="getMonthName(month)" class="justify-content-center fw-700" @click="navigateMonth(month.getMonth())" is-active v-scroll-into-view v-if="isViewingMonth(month)"/>
					<NavItem :label="getMonthName(month)" class="justify-content-center fw-700" @click="navigateMonth(month.getMonth())" v-else/>
				</template>
			</Nav>

		</template>

		<template v-if="view === DatePickerView.Years">

			<Divider is-horizontal/>

			<Nav type="list" class="date-picker-years is-primary" :style="viewStyles">
				<template v-for="year of visibleYears">
					<NavItem :label="year" class="justify-content-center fw-700" @click="navigateYear(year)" is-active v-scroll-into-view v-if="isViewingYear(year)"/>
					<NavItem :label="year" class="justify-content-center fw-700" @click="navigateYear(year)" v-else/>
				</template>
			</Nav>

		</template>
	</div>

</template>

<script lang="ts">

	import type { PropType } from "vue";
	import { computed, defineComponent, nextTick, ref, watch } from "vue";
	import { createDateFormatter, getMonthEnd, getMonthName, getMonthStart, isSameDate, isSameMonth, useLatte } from "../../";
	import { ScrollIntoViewDirective } from "../../directive";
	import type { DatePickerValue } from "./shared";
	import { DatePickerView } from "./shared";
	import { Button } from "../button";
	import { Divider } from "../divider";
	import { Nav, NavItem } from "../nav";

	export default defineComponent({

		name: "LatteDatePickerCalendar",

		components: {
			Button, Divider, Nav, NavItem
		},

		directives: {
			"scroll-into-view": ScrollIntoViewDirective
		},

		emits: [
			"update:modelValue"
		],

		props: {
			isRange: {default: false, type: Boolean},
			modelValue: {default: null, type: Object as PropType<DatePickerValue | DatePickerValue[]>},
			yearsAfter: {default: 5},
			yearsBefore: {default: 50}
		},

		setup(props, {emit})
		{
			const longMonth = createDateFormatter({
				month: "long"
			});

			const longYear = createDateFormatter({
				year: "numeric"
			});

			const latte = useLatte();
			const icons = latte.options.icons;
			const today = new Date();

			const datesViewEl = ref<HTMLElement | null>(null);
			const datesViewHeight = ref(0);
			const selectedDateEnd = ref<DatePickerValue>(null);
			const selectedDateStart = ref<DatePickerValue>(null);
			const view = ref<string>(DatePickerView.Dates);
			const viewDate = ref(getMonthStart(selectedDateStart.value || today));

			const isSelectingEnd = computed(() => props.isRange && selectedDateEnd.value === null && selectedDateStart.value !== null);
			const viewDateEnd = computed(() => getMonthEnd(viewDate.value));
			const viewDateMonth = computed(() => longMonth.format(viewDate.value));
			const viewDateYear = computed(() => longYear.format(viewDate.value));
			const viewStyles = computed(() => ({
				height: datesViewHeight.value === 0 ? "auto" : (datesViewHeight.value - 1) + "px"
			}));

			let skipModelUpdate = false;

			const visibleDates = computed(() =>
			{
				const dates = [];
				const daysInMonth = viewDateEnd.value.getDate();
				const datesBefore = viewDate.value.getDay() === 0 ? 7 : viewDate.value.getDay();

				for (let i = datesBefore - 2; i >= 0; i--)
				{
					const date = new Date(viewDate.value);
					date.setDate(-i)

					dates.push(date);
				}

				for (let i = 1; i <= daysInMonth; i++)
				{
					const date = new Date(viewDate.value);
					date.setDate(i);

					dates.push(date);
				}

				const rows = 6;
				const datesToShow = rows * 7;
				let i = 0;

				while (datesToShow > dates.length)
				{
					const date = new Date(viewDate.value);
					date.setMonth(date.getMonth() + 1)
					date.setDate(++i)

					dates.push(date);
				}

				return dates;
			});

			const visibleDays = computed(() =>
			{
				const formatter = createDateFormatter({
					weekday: "short"
				});

				return visibleDates.value
					.slice(0, 7)
					.map(d => formatter.format(d));
			});

			const visibleMonths = computed(() =>
			{
				const current = new Date();
				const months = [];
				const year = current.getFullYear();

				for (let i = 0; i < 12; i++)
					months.push(new Date(year, i, 1));

				return months;
			});

			const visibleYears = computed(() =>
			{
				const current = today.getFullYear();
				const years = [];

				for (let i = current - props.yearsBefore; i <= current + props.yearsAfter; i++)
					years.push(i);

				return years;
			});

			const navigate = (dir: number) =>
			{
				const date = new Date(viewDate.value);
				date.setMonth(date.getMonth() + dir);

				viewDate.value = date;
			};

			const navigateMonth = (month: number) =>
			{
				const date = new Date(viewDate.value);
				date.setMonth(month);

				viewDate.value = date;

				setView(DatePickerView.Dates);
			};

			const navigateYear = (year: number) =>
			{
				const date = new Date(viewDate.value);
				date.setFullYear(year);

				viewDate.value = date;

				setView(DatePickerView.Dates);
			};

			const getClassesForDate = (date: Date) =>
			{
				const isSelectedStart = isSameDate(date, selectedDateStart.value);
				const isSelectedEnd = isSameDate(date, selectedDateEnd.value);

				const classes = [isSelectedStart || isSelectedEnd ? "btn-contained" : "btn-text"];
				const sameMonth = isSameMonth(date, viewDate.value);

				if (sameMonth)
					classes.push("is-current-month");
				else
					classes.push("is-other-month");

				if (isSameDate(date, today))
					classes.push("is-current-date");

				if (isSelectedStart || isSelectedEnd)
					classes.push("is-selected-date");

				if (props.isRange && selectedDateStart.value && selectedDateEnd.value)
				{
					if (!isSelectedStart && date > selectedDateStart.value && date < selectedDateEnd.value)
						classes.push("is-in-range");

					if (isSelectedStart)
						classes.push("is-range-start");

					if (isSelectedEnd)
						classes.push("is-range-end");
				}

				return classes;
			};

			const isSelectedDate = (date: Date) => isSameDate(date, selectedDateStart.value) || isSameDate(date, selectedDateEnd.value);

			const isViewingMonth = (date: Date) => isSameMonth(date, viewDate.value);

			const isViewingYear = (year: number) => year === viewDate.value.getFullYear();

			const setValue = (date: Date) =>
			{
				if (!isSameMonth(date, viewDate.value))
					return;

				if (props.isRange)
				{
					if (isSelectingEnd.value)
					{
						selectedDateEnd.value = date;

						if (selectedDateEnd.value && selectedDateStart.value && selectedDateEnd.value < selectedDateStart.value)
						{
							let tmp = selectedDateEnd.value;
							selectedDateEnd.value = selectedDateStart.value;
							selectedDateStart.value = tmp;
						}
					}
					else
					{
						selectedDateEnd.value = null;
						selectedDateStart.value = date;
					}
				}
				else
				{
					selectedDateStart.value = date;
				}

				skipModelUpdate = true;
				nextTick(() => skipModelUpdate = false);
			};

			const setView = (v: DatePickerView) =>
			{
				if (datesViewEl.value)
				{
					const {height} = datesViewEl.value.getBoundingClientRect();

					datesViewHeight.value = height;
				}

				view.value = v === view.value ? DatePickerView.Dates : v;
			};

			const onModelValueChanged = (date: DatePickerValue | DatePickerValue[]) =>
			{
				if (skipModelUpdate)
					return;

				if (Array.isArray(date))
				{
					selectedDateEnd.value = date[1];
					selectedDateStart.value = date[0];
				}
				else
				{
					selectedDateEnd.value = null;
					selectedDateStart.value = date;
				}

				viewDate.value = getMonthStart(selectedDateStart.value || today);
			};

			watch(() => props.modelValue, onModelValueChanged, {immediate: true});
			watch([selectedDateStart, selectedDateEnd], ([start, end]) =>
			{
				if (props.isRange)
					emit("update:modelValue", [start, end]);
				else
					emit("update:modelValue", start)
			});

			return {
				icons,
				view,
				viewDate,

				datesViewEl,

				isSelectingEnd,
				viewDateEnd,
				viewDateMonth,
				viewDateYear,
				viewStyles,
				visibleDates,
				visibleDays,
				visibleMonths,
				visibleYears,

				getClassesForDate,
				isSelectedDate,
				isViewingMonth,
				isViewingYear,
				navigate,
				navigateMonth,
				navigateYear,
				setValue,
				setView,

				getMonthName,

				DatePickerView
			};
		}

	});

</script>
