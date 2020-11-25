export * from "../src";

export interface LOutsideHandler
{
	id: number;
	instance: EventListener;
	type: string;
}

export interface LOutsideRegistry
{
	add(type: string, fn: EventListener, options: AddEventListenerOptions): LOutsideHandler;

	clear(): void;

	remove(handler: LOutsideHandler): void;
}

declare global
{

	interface HTMLElement
	{
		__latte_outside?: LOutsideRegistry;
	}

	class ResizeObserver
	{
		constructor(fn: Function);

		[key: string]: any;
	}

	interface TypedEventListener<T extends Event = Event> extends EventListener
	{
		(evt: T): void;
	}

}
