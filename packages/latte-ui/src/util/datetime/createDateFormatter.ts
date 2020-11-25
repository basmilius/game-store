/**
 * Create an Intl.DateTimeFormat instance with the given options.
 *
 * @param {Intl.DateTimeFormatOptions} options
 *
 * @returns {Intl.DateTimeFormat}
 * @author Bas Milius <bas@mili.us>
 * @since 2.0.0
 */
export function createDateFormatter(options: Intl.DateTimeFormatOptions = {}): Intl.DateTimeFormat
{
	return new Intl.DateTimeFormat(navigator.language, options);
}
