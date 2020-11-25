import { ObjectDirective } from "vue";

export const AutoFocusDirective: ObjectDirective = {

	mounted(el, {value}): void
	{
		if (value === false)
			return;

		el.focus();
	}

};
