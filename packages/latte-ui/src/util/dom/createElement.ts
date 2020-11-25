/**
 * Creates a new HTMLElement with the given tag. If a function is given,
 * it will be executed with the newly created element.
 *
 * @param {String} tag
 * @param {Function|undefined} fn
 *
 * @author Bas Milius <bas@mili.us>
 * @since 2.0.0
 */
export function createElement<T extends HTMLElement>(tag: string, fn?: (elm: T) => void): T
{
	const elm = document.createElement(tag) as T;

	if (fn) fn(elm);

	return elm;
}
