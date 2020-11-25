import type { SwiperItemState } from "../type";
import { LStyles } from "../../shared";

export default function (item: SwiperItemState): LStyles
{
	const {offset, swiper} = item;
	const {fill, isHorizontal, isVertical} = swiper;

	const sizeProp = isHorizontal ? "width" : "height";

	const x = isHorizontal ? offset * -100 : 0;
	const y = isVertical ? offset * -100 : 0;

	return {
		transform: `translate3d(${x}%, ${y}%, 0)`,
		[sizeProp]: `${fill * 100}%`
	};
}
