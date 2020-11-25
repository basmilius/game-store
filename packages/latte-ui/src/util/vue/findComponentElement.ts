import { ComponentInternalInstance, VNode } from "vue";

export function findComponentElement(component: ComponentInternalInstance): HTMLElement[] | null
{
	let node: VNode | null = component.subTree;

	if (!node)
		return null;

	let children = node.children as VNode[];

	while (typeof children[0].type === "symbol")
	{
		node = children[0];
		children = node.children as VNode[];
	}

	return children.map(n => n.el as HTMLElement);
}
