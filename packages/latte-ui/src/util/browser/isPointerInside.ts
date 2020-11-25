import { getCoords } from "./";
import { closest } from "../";

/**
 * Returns TRUE if the given mouse or touch event is inside the given element.
 *
 * @param {HTMLElement} elm
 * @param {MouseEvent | TouchEvent} evt
 *
 * @returns {Boolean}
 * @author Bas Milius <bas@mili.us>
 * @since 2.0.0
 */
export function isPointerInside(elm: HTMLElement, evt: MouseEvent | TouchEvent): boolean
{
	const coords = getCoords(evt);

	return !!coords && !!closest(document.elementFromPoint(coords.x, coords.y) as HTMLElement, elm);
}
