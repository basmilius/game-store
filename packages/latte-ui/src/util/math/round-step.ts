export function roundStep(value: number, step: number = 1): number
{
	return Math.round(value / step) * step;
}
