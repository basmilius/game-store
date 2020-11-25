import type { LSize } from "../util";
import { reactive, UnwrapRef, watch } from "vue";
import { useLatte } from "../symbols";

const breakpoints: Breakpoints = {
	xs: [0, 575],
	sm: [576, 767],
	md: [768, 991],
	lg: [992, 1199],
	xl: [1200, 99999]
};

export function useBreakpointsAPI(): UnwrapRef<BreakpointsAPI>
{
	const latte = useLatte();

	const api = reactive<BreakpointsAPI>({
		windowSize: latte.windowSize,
		isCollapsed: false,
		isExpanded: false,

		isBetween(breakpointSmall: string, breakpointLarge: string): boolean
		{
			return this.isUp(breakpointSmall) && this.isDown(breakpointLarge);
		},

		isDown(breakpoint: string): boolean
		{
			const b = breakpoints[breakpoint] || null;

			return b && b[1] >= latte.windowSize.width;
		},

		isOnly(breakpoint: string): boolean
		{
			return this.isDown(breakpoint) && this.isUp(breakpoint);
		},

		isUp(breakpoint: string): boolean
		{
			const b = breakpoints[breakpoint] || null;

			return b && latte.windowSize.width >= b[0];
		}
	});

	watch(latte.windowSize, windowSize =>
	{
		api.windowSize = windowSize;
		api.isCollapsed = api.isDown("md");
		api.isExpanded = !api.isCollapsed;
	}, {immediate: true});

	return api;
}

export interface BreakpointsAPI
{

	isCollapsed: boolean;
	isExpanded: boolean;
	windowSize: LSize;

	isBetween(breakpointSmall: string, breakpointLarge: string): boolean;

	isDown(breakpoint: string): boolean;

	isOnly(breakpoint: string): boolean;

	isUp(breakpoint: string): boolean;

}

type Breakpoints = { [key: string]: number[] };
