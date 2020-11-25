/**
 * Returns the given date in YYYY-MM-DD format.
 *
 * @param {Date} date
 *
 * @returns {String}
 * @author Bas Milius <bas@mili.us>
 * @since 2.0.0
 */
export function yyyymmdd(date: Date | null): string
{
	if (!date)
		return "";

	let year = date.getFullYear().toString().padStart(4, "0");
	let month = (date.getMonth() + 1).toString().padStart(2, "0");
	let day = (date.getDate()).toString().padStart(2, "0");

	return `${year}-${month}-${day}`;
}
