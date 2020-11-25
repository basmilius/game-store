import deepmerge from "deepmerge";

import type { VNode } from "vue";
import { h } from "vue";
import type { LIconRenderer, LIcons, LOptions, LOptionsEmoji } from "./type";

const defaults: LOptions = {
	componentList: {},
	componentPrefix: "latte",
	iconRenderer: mdiIconRenderer,
	icons: {
		calendar: "calendar",
		chevronDoubleLeft: "chevron-double-left",
		chevronDoubleRight: "chevron-double-right",
		chevronLeft: "chevron-left",
		chevronRight: "chevron-right"
	}
};

export function mdiIconRenderer(name: string | null): VNode
{
	return h("i", {
		class: ["mdi", name ? "mdi-" + name : undefined].filter(c => !!c)
	});
}

export function optionsWithDefaults(options: LOptions): LOptions
{
	return deepmerge(defaults, options);
}

export {
	LIconRenderer,
	LIcons,
	LOptions,
	LOptionsEmoji
};
