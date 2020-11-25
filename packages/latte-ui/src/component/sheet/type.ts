import type { Ref } from "vue";

export interface SheetAPI
{
	isOpen: Ref<boolean>;

	close: () => void;
	open: () => void;
	toggle: () => void;
}
