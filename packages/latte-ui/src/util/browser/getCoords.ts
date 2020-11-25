import { LVector2D } from "../";

interface ClientVector
{
	clientX: number;
	clientY: number;
}

/**
 * Gets the coords from a mouse or touch event.
 *
 * @param {MouseEvent | TouchEvent} evt
 *
 * @returns {LVector2D | undefined}
 *
 * @author Bas Milius <bas@mili.us>
 * @since 2.0.0
 */
export function getCoords(evt: MouseEvent | TouchEvent): LVector2D | undefined
{
	let e: ClientVector | undefined;

	if (window.TouchEvent && evt instanceof TouchEvent)
	{
		if (evt.touches.length > 0)
			e = evt.touches.item(evt.touches.length - 1) || undefined;
		else
			e = evt.changedTouches.item(evt.changedTouches.length - 1) || undefined;
	}
	else if (evt instanceof MouseEvent)
	{
		e = evt;
	}

	if (!e || !e.clientX || !e.clientY)
		return undefined;

	return {
		x: Math.round(e.clientX),
		y: Math.round(e.clientY)
	};
}
