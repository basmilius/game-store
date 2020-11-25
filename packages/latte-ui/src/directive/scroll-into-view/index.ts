import { ObjectDirective } from "vue";

export const ScrollIntoViewDirective: ObjectDirective = {

	mounted(el): void
	{
		el.scrollIntoView({
			block: "nearest",
			inline: "start"
		});
	}

};
