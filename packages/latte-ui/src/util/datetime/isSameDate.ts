/**
 * Returns TRUE if the given dates have the same YYYY-MM-DD.
 *
 * @param {Date} a
 * @param {Date} b
 *
 * @returns {Boolean}
 * @author Bas Milius <bas@mili.us>
 * @since 2.0.0
 */
export function isSameDate(a: Date | null, b: Date | null): boolean
{
	if (!a || !b)
		return false;

	return a.toDateString() === b.toDateString();
}
