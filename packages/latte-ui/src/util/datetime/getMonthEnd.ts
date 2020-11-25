/**
 * Gets the end of the month by the given date.
 *
 * @param {Date} date
 *
 * @returns {Date}
 * @author Bas Milius <bas@mili.us>
 * @since 2.0.0
 */
export function getMonthEnd(date: Date): Date
{
	const d = new Date();
	d.setFullYear(date.getFullYear());
	d.setMonth(date.getMonth() + 1);
	d.setDate(0);

	return d;
}
