import { createDateFormatter } from "./createDateFormatter";

/**
 * Gets the name of the given month date in the browsers language.
 *
 * @param {Date} date
 * @param {String} style
 *
 * @returns {String}
 * @author Bas Milius <bas@mili.us>
 * @since 2.0.0
 */
export function getMonthName(date: Date, style: string = "long"): string
{
	const formatter = createDateFormatter({
		month: style
	});

	return formatter.format(date);
}
