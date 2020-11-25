import { LElements, LListeners } from "../type";
import { isTouchEvent } from "./isTouchEvent";

const events: LListeners = {};

export function addEventListener(elm: LElements, name: string, fn: EventListener, options: AddEventListenerOptions = {passive: true}): Function
{
	const uid = <any>Symbol("latte-event");

	events[uid] = fn;

	elm.addEventListener(name, <any>fn, options);

	return () => removeEventListener(elm, name, uid);
}

export function removeEventListener(elm: LElements, name: string, uid: any): void
{
	if (!events[uid])
		return;

	elm.removeEventListener(name, events[uid]);

	delete events[uid];
}

export function addTouchAwareEventListener(elm: LElements, mouseEvent: string, touchEvent: string, fn: EventListener, options: AddEventListenerOptions = {passive: true}): Function
{
	const cb = touchAwareEventHandler(fn);

	elm.addEventListener(touchEvent, cb, options);
	elm.addEventListener(mouseEvent, cb, options);

	return () =>
	{
		elm.removeEventListener(touchEvent, cb);
		elm.removeEventListener(mouseEvent, cb);
	};
}

export function touchAwareEventHandler(fn: EventListener): EventListener
{
	let isTouch = false;

	return (evt: Event) =>
	{
		const wasTouch = isTouchEvent(evt);

		if (wasTouch)
			isTouch = true;

		if ((wasTouch && isTouch) || (!wasTouch && !isTouch))
			(<any>fn)(evt, wasTouch);

		if (!wasTouch)
			isTouch = false;
	};
}
