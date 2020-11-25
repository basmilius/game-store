import { PropType } from "vue";

export type DatePickerValue = Date | null;

export enum DatePickerView
{
	Dates = "d",
	Months = "m",
	Years = "y"
}
