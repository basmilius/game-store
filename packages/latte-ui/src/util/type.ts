export type LElements = HTMLElement | Document | Window;
export type LListener = ((evt: Event, wasTouchEvent?: boolean) => void) | Function;
export type LListeners = { [key: string]: EventListener; };

export interface LSize
{
	height: number;
	width: number;
}

export interface LVector2D
{
	x: number;
	y: number;
}

export interface LVector3D extends LVector2D
{
	z: number;
}
