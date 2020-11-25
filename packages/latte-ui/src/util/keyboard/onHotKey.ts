import { addEventListener } from "../event";

export function onHotKey(key: string, fn: (evt: KeyboardEvent) => void, passive: boolean = true): Function
{
	const handler = (evt: KeyboardEvent) =>
	{
		if (evt.key !== key)
			return;

		fn(evt);
	};

	return addEventListener(window, "keydown", <EventListener>handler, {passive});
}
