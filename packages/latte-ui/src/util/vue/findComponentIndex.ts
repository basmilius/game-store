import type { ComponentInternalInstance, VNode } from "vue";

export function findComponentIndex(parent: ComponentInternalInstance, name: string | null, fn: (component: ComponentInternalInstance) => boolean): number
{
	let nodes = parent.subTree.children as VNode[];

	while (typeof nodes[0].type === "symbol")
		nodes = nodes[0].children as VNode[];

	return nodes
		.filter(c => c.component && c.component.type.name === name || !name)
		.findIndex(c => fn(c.component!));
}
