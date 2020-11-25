import type { PopupAPI, SheetAPI, SwiperAPI } from "./component";
import type { LatteAPI } from "./latte";
import type { ComponentPublicInstance, InjectionKey, Ref } from "vue";
import { inject } from "vue";

export const LatteSymbol: InjectionKey<LatteAPI> = Symbol.for("l");
export const LatteExpandableGroupSymbol: InjectionKey<ComponentPublicInstance | null> = Symbol.for("l_expandable_group");
export const LatteIconNavSymbol: InjectionKey<IconNavAPI | null> = Symbol.for("l_icon_nav");
export const LattePopupSymbol: InjectionKey<PopupAPI | null> = Symbol.for("l_popup");
export const LatteSheetSymbol: InjectionKey<SheetAPI | null> = Symbol.for("l_sheet");
export const LatteSwiperSymbol: InjectionKey<SwiperAPI | null> = Symbol.for("l_swiper");

export function useLatte(): LatteAPI
{
	const latte = inject(LatteSymbol);

	if (!latte)
		throw new Error("LatteUI: LatteUI is not used in this Vue instance.");

	return latte!;
}

export function useExpandableGroup(): ComponentPublicInstance | null
{
	return inject(LatteExpandableGroupSymbol, null);
}

export function useIconNav(): IconNavAPI | null
{
	return inject(LatteIconNavSymbol, null);
}

export function usePopup(): PopupAPI | null
{
	return inject(LattePopupSymbol, null);
}

export function useSheet(): SheetAPI | null
{
	return inject(LatteSheetSymbol, null);
}

export function useSwiper(): SwiperAPI | null
{
	return inject(LatteSwiperSymbol, null);
}

interface IconNavAPI
{
	index: Ref<number>;

	setActive(index: number): void;
}
