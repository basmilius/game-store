import type { ComponentInternalInstance, VNode } from "vue";

export function forEachComponentWithName(parent: ComponentInternalInstance, name: string, fn: (component: ComponentInternalInstance | any) => void): void
{
	let nodes = parent.subTree.children as VNode[];

	while (typeof nodes[0].type === "symbol")
		nodes = nodes[0].children as VNode[];

	nodes
		.filter(c => c.component && c.component.type.name === name)
		.forEach(c => fn(c.component!));
}
