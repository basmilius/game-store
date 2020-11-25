/**
 * Executes the given function in the next animation frame.
 *
 * @param {FrameRequestCallback} fn
 * @param {Number} delay
 *
 * @author Bas Milius <bas@mili.us>
 * @since 2.0.0
 */
export function animationFrame(fn: FrameRequestCallback, delay: number = 0): void
{
	if (delay > 0)
		setTimeout(() => requestAnimationFrame(fn), delay);
	else
		requestAnimationFrame(fn);
}
