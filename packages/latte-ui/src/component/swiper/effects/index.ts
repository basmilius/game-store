import type { SwiperEffect, SwiperEffects } from "../type";
import { default as defaultEffect } from "./default";
import { default as pileEffect } from "./pile";

export const effects: SwiperEffects = {
	default: defaultEffect,
	pile: pileEffect
};

export function getEffect(name: string): SwiperEffect
{
	return effects[name] || effects.default;
}
