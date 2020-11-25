import { sprintf as _sprintf, vsprintf as _vsprintf } from "sprintf-js";

export function commaCommaAnd(strs: string[]): string
{
	return strs.join(", ").replace(/(.*),/, "$1 &");
}

export function sprintf(str: string, ...args: any): string
{
	return _sprintf(str, ...args);
}

export function vsprintf(str: string, args: any): string
{
	return _vsprintf(str, args);
}
