/**
 * Returns the closest element that matches the given selector in the given element.
 *
 * @param {HTMLElement | null} element
 * @param {HTMLElement | string | null} selector
 *
 * @returns {HTMLElement | null}
 *
 * @author Bas Milius <bas@mili.us>
 * @since 2.0.0
 */
export function closest(element: HTMLElement | null, selector: HTMLElement | string | null): HTMLElement | undefined
{
	for (; element && element !== <any>document; element = <any>element.parentNode)
		if (element === selector || (typeof selector === "string" && element.matches(selector)))
			return element;

	return undefined;
}
