import type { Ref } from "vue";

export interface PopupAPI
{
	isOpen: Ref<boolean>;

	calculate: () => void;
	close: () => void;
	open: () => void;
	toggle: () => void;
}
