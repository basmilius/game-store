export function ceilStep(value: number, step: number = 1): number
{
	return Math.ceil(value / step) * step;
}
