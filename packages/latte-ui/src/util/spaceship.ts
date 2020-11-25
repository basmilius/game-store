type SpaceshipParam = number;

export function spaceship(a: SpaceshipParam, b: SpaceshipParam): number
{
	if (a > b)
		return 1;

	if (a < b)
		return -1;

	return 0;
}
