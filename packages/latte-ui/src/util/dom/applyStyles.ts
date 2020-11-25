import { toRaw } from "vue";

const map: Record<string, string> = {
	zIndex: "z-index"
};

/**
 * Applies the given style properties to the given element.
 *
 * @param {HTMLElement} elm
 * @param {Styles} styles
 *
 * @author Bas Milius <bas@mili.us>
 * @since 2.0.0
 */
export function applyStyles(elm: HTMLElement, styles: Styles): HTMLElement
{
	styles = toRaw(styles);

	for (let prop in styles)
		if (!!styles[prop])
			elm.style.setProperty(map[prop] || prop, <string>styles[prop]);

	return elm;
}

type Styles = { [key: string]: string | undefined };
