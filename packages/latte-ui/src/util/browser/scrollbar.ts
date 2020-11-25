import { nextTick } from "vue";
import { createElement } from "../dom";

export function initializeScrollbar(): void
{
	createElement("div", (div: HTMLDivElement) =>
	{
		const docRoot = document.documentElement;
		const props: any = {
			height: "50px",
			width: "50px",
			overflow: "auto"
		};

		div.innerHTML = "".padStart(100, "<br/>");

		for (let prop in props)
			div.style.setProperty(prop, props[prop]);

		document.body.appendChild(div);

		nextTick(() =>
		{
			docRoot.style.setProperty("--scrollbarWidth", `${div.offsetWidth - div.clientWidth}px`);
			div.remove();
		});
	});
}
