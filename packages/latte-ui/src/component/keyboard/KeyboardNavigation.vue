<script lang="ts">

	import type { PropType } from "vue";
	import { defineComponent, getCurrentInstance, onMounted, onUnmounted, ref, unref, warn, watch } from "vue";
	import type { LAxis } from "../../";
	import { addEventListener, findComponentElement } from "../../";

	export default defineComponent({

		name: "LatteKeyboardNavigation",

		emits: [
			"keydown",
			"update:modelValue"
		],

		props: {
			direction: {default: "vertical", type: String as PropType<LAxis>},
			modelValue: {default: 0},
			tabIndex: {default: 1}
		},

		setup(props, {emit, slots})
		{
			const instance = getCurrentInstance()!;

			const count = ref(0);
			const index = ref(props.modelValue);
			const isFocused = ref(false);
			const root = ref<HTMLElement | null>(null);

			let events: Function[] = [];

			const addEvents = () =>
			{
				events.forEach(remove => remove());
				events.splice(0, events.length);

				if (!root.value)
					return;

				events.push(
					addEventListener(root.value, "focusin", onFocusIn),
					addEventListener(root.value, "focusout", onFocusOut),
					addEventListener(root.value, "keydown", onKeyDown as TypedEventListener<KeyboardEvent>, {passive: false})
				);
			};

			const onFocusIn = () => isFocused.value = true;
			const onFocusOut = () => isFocused.value = false;

			const onKeyDown = (evt: KeyboardEvent) =>
			{
				if (count.value === 0)
					return;

				const previousArrow = props.direction === "horizontal" ? "ArrowLeft" : "ArrowUp";
				const nextArrow = props.direction === "horizontal" ? "ArrowRight" : "ArrowDown";

				switch (evt.key)
				{
					case nextArrow:
					case previousArrow:
						const dir = evt.key === previousArrow ? -1 : 1;
						let idx = index.value + dir;

						if (idx < 0)
							idx = count.value - 1;
						else if (idx >= count.value)
							idx = 0;

						index.value = idx;
						emit("update:modelValue", idx);
						break;

					default:
						emit("keydown", evt.key, evt);
						return;
				}

				evt.preventDefault();
				evt.stopPropagation();
			};

			onMounted(() =>
			{
				const elements = findComponentElement(instance);

				if ((elements?.length || 0) > 1)
				{
					root.value = null;
					warn("LatteUI: KeyboardNavigation is limited to one child.");
					return;
				}

				if (!elements || elements.length === 0)
				{
					root.value = null;
					return;
				}

				root.value = elements[0];

				addEvents();

				// todo(Bas): Create util that can find components by their name.
				if (instance.parent && instance.parent.parent && instance.parent.parent.parent)
				{
					const {type} = instance.parent.parent.parent;

					if (type.name === "LattePopup" || type.name === "LatteSheet")
					{
						const firstElm = root.value.querySelector(`[tabindex="${props.tabIndex}"]`) as HTMLElement;
						firstElm?.focus();
					}
				}
			});

			onUnmounted(() =>
			{
				events.forEach(remove => remove());
				events.splice(0, events.length);
			});

			watch(() => props.modelValue, val => index.value = val);

			return () =>
			{
				if (!slots.default)
					return null;

				const elm = unref(root);
				const focused = unref(isFocused);
				const idx = unref(index);

				if (!elm) return slots.default({
					count: 0,
					elm: null,
					isFocused: false,
					index: 0
				});

				const tabbables: HTMLElement[] = Array.from(elm.querySelectorAll("[tabindex]"));
				count.value = tabbables.length;

				if (tabbables.length > 0 && tabbables[idx])
				{
					tabbables.forEach(t => t.setAttribute("tabindex", "-1"));
					tabbables[idx].setAttribute("tabindex", String(props.tabIndex));

					if (focused)
						tabbables[idx].focus();
				}

				return slots.default({
					count: count.value,
					elm: elm,
					isFocused: focused,
					index: idx
				});
			};
		}

	});

</script>
