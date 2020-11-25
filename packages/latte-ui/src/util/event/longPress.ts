import { LElements } from "../type";
import { addTouchAwareEventListener } from "./basic";

export function longPress(elm: LElements, fn: EventListener): Function
{
	let timer: number;

	const removeStart = addTouchAwareEventListener(elm, "mousedown", "touchstart", evt =>
	{
		timer = window.setTimeout(fn, 240);
	});

	const removeEnd = addTouchAwareEventListener(elm, "mouseup", "touchend", () =>
	{
		window.clearTimeout(timer);
	});

	return () =>
	{
		removeStart();
		removeEnd();
	};
}
