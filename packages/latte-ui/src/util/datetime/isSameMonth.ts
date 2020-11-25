/**
 * Returns TRUE if the given dates have the same YYYY-MM.
 *
 * @param {Date} a
 * @param {Date} b
 *
 * @returns {Boolean}
 * @author Bas Milius <bas@mili.us>
 * @since 2.0.0
 */
export function isSameMonth(a: Date | null, b: Date | null): boolean
{
	if (!a || !b)
		return false;

	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
