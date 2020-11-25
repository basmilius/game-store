/**
 * Gets the start of the month by the given date.
 *
 * @param {Date} date
 *
 * @returns {Date}
 * @author Bas Milius <bas@mili.us>
 * @since 2.0.0
 */
export function getMonthStart(date: Date): Date
{
	const d = new Date();
	d.setFullYear(date.getFullYear());
	d.setMonth(date.getMonth())
	d.setDate(1);

	return d;
}
