<template>

	<div class="virtual-scroller" @scroll.passive="onScroll" role="list" ref="root">
		<VirtualSlot :axis="axis" unique-key="header" @update:size="onResizeSlot" v-if="$slots.header">
			<slot name="header"></slot>
		</VirtualSlot>

		<div class="virtual-scroller-items" :style="wrapperStyle" role="group" ref="wrapper">
			<template v-for="visibleItem of visibleItems">

				<VirtualItem :index="visibleItem.index" :item="visibleItem.item" :unique-key="'item-' + visibleItem.item[uniqueKey]" v-slot="_" @update:size="onResizeItem">
					<slot v-bind="_"/>
				</VirtualItem>

			</template>
		</div>

		<VirtualSlot :axis="axis" unique-key="footer" @update:size="onResizeSlot" v-if="$slots.footer">
			<slot name="footer"></slot>
		</VirtualSlot>
	</div>

	<div class="position-absolute ff-monospace fw-700 m-7 text-small radius-default" style="background: rgba(220,20,60,.9); color: white; top: 0; right: 0; padding: 9px 15px;">
		{{ wrapperStyle }}
	</div>

</template>

<script lang="ts">

	import type { PropType } from "vue";
	import { computed, defineComponent, onActivated, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
	import { Range, Virtualizer } from "./virtualizer";
	import type { LAxis } from "../shared";
	import { animationFrame } from "../../util/dom";
	import { default as VirtualItem } from "./VirtualScrollerItem.vue";
	import { default as VirtualSlot } from "./VirtualScrollerSlot.vue";

	export default defineComponent({

		name: "LatteVirtualScroller",

		components: {
			VirtualItem,
			VirtualSlot
		},

		emits: [
			"resize",
			"scroll"
		],

		props: {
			axis: {default: "vertical", type: String as PropType<LAxis>},
			items: {required: true, type: Array as PropType<any[]>},
			keeps: {default: 30, type: Number},
			offset: {default: null}, // Number | null
			start: {default: null}, // Number | null
			uniqueKey: {default: "id", type: String}
		},

		setup(props, {emit})
		{
			const estimatedSize = ref(43);
			const items = ref(props.items);
			const keeps = ref(props.keeps);
			const range = ref<Range>({start: 0, end: 0, padFront: 0, padBehind: 0});

			const root = ref<HTMLDivElement | null>(null);
			const wrapper = ref<HTMLDivElement | null>(null);

			const wrapperStyle = reactive({
				paddingTop: "0",
				paddingLeft: "0",
				paddingRight: "0",
				paddingBottom: "0"
			});

			const isHorizontal = computed(() => props.axis === "horizontal");
			const offsetKey = computed(() => isHorizontal.value ? "scrollLeft" : "scrollTop");

			const visibleItems = computed(() =>
			{
				const result: any[] = [];
				const {start, end} = range.value;

				for (let index = start; index <= end; index++)
				{
					const item = items.value[index];

					result.push({item, index});
				}

				return result;
			});

			let virtualizer!: Virtualizer;

			const initializeVirtualizer = () =>
			{
				virtualizer = new Virtualizer({
					headerSize: 0,
					footerSize: 0,
					keeps: keeps.value,
					estimatedSize: estimatedSize.value,
					buffer: Math.round(keeps.value / 2),
					uniqueIds: getUniqueIdsFromItems()
				}, onRangeChanged);

				range.value = virtualizer.range;
			};

			const getClientSize = () =>
			{
				const key = isHorizontal.value ? "clientWidth" : "clientHeight";

				if (!root.value)
					return 0;

				return Math.ceil(root.value[key]);
			};

			const getOffset = () =>
			{
				if (!root.value)
					return 0;

				return Math.ceil(root.value[offsetKey.value]);
			};

			const getScrollSize = () =>
			{
				const key = isHorizontal.value ? "scrollWidth" : "scrollHeight";

				if (!root.value)
					return 0;

				return root.value[key];
			};

			const getUniqueIdsFromItems = () =>
			{
				return items.value
					.map(i => i[props.uniqueKey])
					.map(i => "item-" + i);
			};

			const scrollToEnd = () =>
			{
				if (!root.value)
					return;

				const key = isHorizontal.value ? "scrollWidth" : "scrollHeight";
				const offset = root.value[key];

				scrollToOffset(offset);
				animationFrame(() => getOffset() + getClientSize() < getScrollSize() && scrollToEnd());
			};

			const scrollToIndex = (index: number) =>
			{
				scrollToOffset(virtualizer.getIndexOffset(index));
			};

			const scrollToOffset = (offset: number) =>
			{
				if (!root.value)
					return;

				root.value[offsetKey.value] = offset;
			};

			const onRangeChanged = (r: Range) =>
			{
				range.value = r;
			};

			const onResizeItem = (id: string, size: number) =>
			{
				virtualizer.saveSize(id, size);
				emit("resize", id, size);
			};

			const onResizeSlot = (id: string, size: number) =>
			{
				if (id === "header")
					virtualizer.updateParam("headerSize", size);
				else if (id === "footer")
					virtualizer.updateParam("footerSize", size);

				virtualizer.onSlotSizeChanged();
			};

			const onScroll = (evt: Event) =>
			{
				const offset = getOffset();
				const clientSize = getClientSize();
				const scrollSize = getScrollSize();

				if (offset < 0 || (offset + clientSize > scrollSize + 1) || !scrollSize)
					return;

				virtualizer.onScroll(offset);
				emit("scroll", offset, clientSize, scrollSize, evt);
			};

			onActivated(() => scrollToOffset(virtualizer.offset));
			onBeforeUnmount(() => virtualizer.destroy());

			onMounted(() =>
			{
				if (props.start)
					scrollToIndex(props.start as unknown as number)
				else if (props.offset)
					scrollToOffset(props.offset as unknown as number);
			});

			watch(() => props.items, itms => items.value = itms, {deep: true});
			watch(() => props.keeps, val => keeps.value = val);

			watch(items, () =>
			{
				virtualizer.updateParam("uniqueIds", getUniqueIdsFromItems());
				virtualizer.onDataSourceChanged();
			});
			watch(keeps, val => virtualizer.updateParam("keeps", val));
			watch(range, r =>
			{
				if (isHorizontal.value)
				{
					wrapperStyle.paddingLeft = r.padFront + "px";
					wrapperStyle.paddingRight = r.padBehind + "px";
				}
				else
				{
					wrapperStyle.paddingTop = r.padFront + "px";
					wrapperStyle.paddingBottom = r.padBehind + "px";
				}
			});

			initializeVirtualizer();

			return {
				root,
				wrapper,
				visibleItems,

				wrapperStyle,

				onResizeItem,
				onResizeSlot,
				onScroll,

				scrollToEnd,
				scrollToIndex,
				scrollToOffset
			};
		}

	});

</script>
