/**
 * Returns TRUE if the given event is a TouchEvent.
 *
 * @param {Event} evt
 *
 * @returns {Boolean}
 *
 * @author Bas Milius <bas@mili.us>
 * @since 2.0.0
 */
export function isTouchEvent(evt: Event): boolean
{
	return evt.constructor.name === "TouchEvent";
}
