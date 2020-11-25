import { ref, watch } from "vue";

const isDialogOpenClass = "is-dialog-open";

let dialogs = ref(0);

watch(dialogs, dialogs =>
{
	const {classList} = document.documentElement;

	if (dialogs === 0)
		classList.remove(isDialogOpenClass);
	else if (!classList.contains(isDialogOpenClass))
		classList.add(isDialogOpenClass);
}, {flush: "post"});

export function useDialogAPI(): DialogAPI
{
	return {

		onClosed(): void
		{
			dialogs.value = Math.max(0, dialogs.value - 1);
		},

		onOpened(): void
		{
			++dialogs.value;
		}

	};
}

export interface DialogAPI
{
	onClosed(): void;

	onOpened(): void;
}
