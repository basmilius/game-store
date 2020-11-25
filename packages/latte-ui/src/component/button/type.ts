import type { LColor } from "../shared";

export type LButtonSize = "small" | "medium" | "large" | "huge";
export type LButtonType = "contained" | "outline" | "text" | "text-alt";

export interface LButton
{
	id?: number | string;
	color?: LColor | null;
	icon?: string | null;
	iconAfter?: string | null;
	iconBefore?: string | null;
	label?: string;
	size: LButtonSize;
	type: LButtonType;
}
