<script lang="ts">

	import type { VNode } from "vue";
	import { cloneVNode, defineComponent, h, ref, watch } from "vue";
	import { default as Nav } from "../nav/Nav.vue";
	import { default as NavItem } from "../nav/NavItem.vue";
	import { default as ResponsivePopup } from "../popup/ResponsivePopup.vue";

	interface PopupSheetAPI
	{
		type: string;

		close(): void;

		open(): void;
	}

	function renderItems(items: VNode[], {close, type}: PopupSheetAPI, onSelect: Function): VNode
	{
		const panelProps = {
			class: `panel bg-base-light shadow-outline-8 radius-${type === "popup" ? "default" : "none"}`
		};

		return h("div", panelProps, h(Nav, {type: "list"}, {

			default: () => items.map(item =>
			{
				if (item.props) item.props.onClick = () =>
				{
					onSelect(item.props?.value || null);
					close();
				};

				return item;
			})

		}));
	}

	function renderOpener(item: VNode | null, {open}: PopupSheetAPI): VNode
	{
		return h(Nav, {type: "list", class: "input-group is-select p-0"}, {

			default: () => item
				? cloneVNode(item, {
					class: "bg-transparent px-4 py-2 user-select-none",
					onClick: open
				})
				: h(NavItem, {class: "bg-transparent px-4 py-2 text-muted user-select-none", onClick: open}, {
					default: () => "Plaatshouder"
				})

		});
	}

	export default defineComponent({

		name: "LatteSelect",

		components: {
			Nav, NavItem,
			ResponsivePopup
		},

		emits: [
			"update:modelValue"
		],

		props: {
			modelValue: {default: null}
		},

		setup(props, {emit, slots})
		{
			const selected = ref<any>(props.modelValue);

			const onItemClicked = (value: any) =>
			{
				selected.value = value;
				emit("update:modelValue", value);
			};

			watch(() => props.modelValue, value => selected.value = value);

			return () =>
			{
				if (!slots.default)
					return null;

				const items = slots.default();
				const selectedItem = items.find(item => item.props?.value === selected.value);

				return h(ResponsivePopup, {marginY: 9, isWidthInherited: true}, {
					default: (api: PopupSheetAPI) => renderItems(items, api, onItemClicked),
					opener: (api: PopupSheetAPI) => renderOpener(selectedItem || null, api)
				});
			};
		}

	});

</script>
