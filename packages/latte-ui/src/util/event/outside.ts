import type { LOutsideHandler, LOutsideRegistry } from "../../../types";

import { touchAwareEventHandler } from "./basic";
import { isPointerInside } from "../";

let id = 0;

class Handler implements LOutsideHandler
{

	public id: number = ++id;
	public instance: EventListener;

	constructor(public readonly element: HTMLElement, public readonly fn: EventListener, public readonly type: string)
	{
		this.instance = (evt: Event) => this.handle(evt as (MouseEvent & TouchEvent));
	}

	private handle(evt: MouseEvent & TouchEvent): void
	{
		if (isPointerInside(this.element, evt))
			return;

		this.fn(evt);
	}

}

class Registry implements LOutsideRegistry
{

	private handlers: any[] = [];

	constructor(private readonly element: HTMLElement)
	{
	}

	public add(type: string, fn: EventListener, options: AddEventListenerOptions): Handler
	{
		const handler = new Handler(this.element, fn, type);

		window.addEventListener(type, handler.instance, options);
		this.handlers.push(handler);

		return handler;
	}

	public clear(): void
	{
		this.handlers.forEach(listener => this.remove(listener));
	}

	public remove(handler: LOutsideHandler): void
	{
		const index = this.handlers.findIndex(h => h.id === handler.id);

		if (index === -1)
			return;

		window.removeEventListener(handler.type, handler.instance);
		this.handlers.splice(index, 1);
	}

}

export function addOutsideEventListener(elm: HTMLElement, type: string, fn: EventListener, options: AddEventListenerOptions = {passive: true}): LOutsideHandler
{
	if (!elm.__latte_outside)
		elm.__latte_outside = new Registry(elm);

	return elm.__latte_outside.add(type, fn, options);
}

export function clearOutsideEventListener(elm: HTMLElement): void
{
	elm.__latte_outside?.clear();
}

export function removeOutsideEventListener(elm: HTMLElement, handler: LOutsideHandler): void
{
	elm.__latte_outside?.remove(handler);
}

export function addTouchAwareOutsideEventListener(elm: HTMLElement, mouseEvent: string, touchEvent: string, fn: EventListener, options: AddEventListenerOptions = {passive: true}): Function
{
	const cb = touchAwareEventHandler(fn);

	const touchHandler = addOutsideEventListener(elm, touchEvent, cb, options);
	const mouseHandler = addOutsideEventListener(elm, mouseEvent, cb, options);

	return () =>
	{
		removeOutsideEventListener(elm, touchHandler);
		removeOutsideEventListener(elm, mouseHandler);
	};
}
