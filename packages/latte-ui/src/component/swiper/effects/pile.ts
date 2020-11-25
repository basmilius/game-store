import type { SwiperItemState } from "../type";
import { LStyles } from "../../shared";

export default function (item: SwiperItemState): LStyles
{
	const {index, offset, offsetAbsolute, swiper} = item;
	const {fill, isHorizontal, isVertical} = swiper;

	let r = offset > 0 ? 0 : Math.sin(offset * 2);
	let x = isHorizontal ? offset * -100 - (offset < 0 ? offset * -100 : 0) : (offset > 0 ? offset * 9 : 0);
	let y = isVertical ? offset * -100 - (offset < 0 ? offset * -100 : 0) : (offset > 0 ? offset * 9 : 0);
	let s = 1 - (offsetAbsolute * .0125);
	let o = offset < 0 ? 1 : (offset > 3 ? (offset - 3) * (1 - offset / 4) : 1 - offset / 4);

	const sizeProp = isHorizontal ? "width" : "height";

	return {
		opacity: `${o}`,
		transform: `translate3d(${x}%, ${y}%, 0) rotate3d(0, 0, 1, ${r * 5}deg) scale3d(${s}, ${s}, ${s})`,
		zIndex: `${100000 - index}`,
		[sizeProp]: `${fill * 100}%`
	};
}
