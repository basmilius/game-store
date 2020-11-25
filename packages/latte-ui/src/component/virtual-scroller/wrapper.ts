import { getCurrentInstance, onBeforeUnmount, onMounted, onUpdated, ref, watch } from "vue";
import type { LAxis } from "../shared";

export function useWrapper(emit: Function, props: Props)
{
	const instance = getCurrentInstance()!;

	const axisKey = props.axis === "horizontal" ? "width" : "height";
	const size = ref(0);

	let observer: ResizeObserver | null = null;

	watch(size, size =>
	{
		if (size === 0)
			return;

		emit("update:size", props.uniqueKey, size);
	});

	const initializeObserver = () =>
	{
		if (typeof ResizeObserver === "undefined")
			return;

		observer?.disconnect();
		observer = new ResizeObserver((entries: any) => size.value = entries[0].contentRect[axisKey]);
		observer.observe(instance.subTree.el);
	};

	onBeforeUnmount(() =>
	{
		observer?.disconnect();
		observer = null;
	});

	onMounted(initializeObserver);
	onUpdated(initializeObserver);

	return {
		size
	};
}

interface Props
{
	axis: LAxis;
	uniqueKey: string;
}
