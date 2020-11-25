import type { LStyles } from "../shared";

export interface SwiperAPI
{
	effect: SwiperEffect;
	fill: number;
	isHorizontal: boolean;
	isVertical: boolean;
	items: number;
	offset: number;
	rect: ClientRect | null;
}

export interface SwiperEffect
{
	(item: SwiperItemState): LStyles;
}

export interface SwiperEffects
{
	[key: string]: SwiperEffect;
}

export interface SwiperItemState
{
	index: number;
	isCurrent: boolean;
	height: number;
	width: number;
	offset: number;
	offsetAbsolute: number;
	swiper: SwiperAPI;
}
