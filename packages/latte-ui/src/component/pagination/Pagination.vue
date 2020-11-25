<template>

	<Nav :color="color" type="pagination">
		<NavItem :icon="icons.chevronDoubleLeft" :disabled="!isStartNavEnabled" @click="onPageClick(1)" v-if="isNavEnabled && isNavTeleportEnabled && (isStartNavEnabled || isNavAlwaysVisible)"/>
		<NavItem :icon="icons.chevronLeft" :disabled="!isStartNavEnabled" @click="onPageClick(currentPage - 1)" v-if="isNavEnabled && (isStartNavEnabled || isNavAlwaysVisible)"/>

		<template v-for="page of pages">
			<NavItem :label="page" :is-active="page === currentPage" @click="onPageClick(page)" v-if="page !== null"/>
			<span class="nav-link is-disabled" v-else>...</span>
		</template>

		<NavItem :icon="icons.chevronRight" :disabled="!isEndNavEnabled" @click="onPageClick(currentPage + 1)" v-if="isNavEnabled && (isEndNavEnabled || isNavAlwaysVisible)"/>
		<NavItem :icon="icons.chevronDoubleRight" :disabled="!isEndNavEnabled" @click="onPageClick(totalPages)" v-if="isNavEnabled && isNavTeleportEnabled && (isEndNavEnabled || isNavAlwaysVisible)"/>
	</Nav>

</template>

<script lang="ts">

	import { computed, defineComponent, unref } from "vue";
	import { Button } from "../button";
	import { Nav, NavItem } from "../nav";
	import { useLatte } from "../../";
	import { clamp } from "../../util";

	export default defineComponent({

		name: "LattePagination",

		components: {
			Button,
			Nav, NavItem
		},

		emits: [
			"navigate"
		],

		props: {
			color: {default: null}, // LColor | String | null
			isNavAlwaysVisible: {default: false, type: Boolean},
			isNavEnabled: {default: false, type: Boolean},
			isNavTeleportEnabled: {default: false, type: Boolean},
			limit: {default: 0, type: Number},
			offset: {default: 0, type: Number},
			sizeEnd: {default: 2, type: Number},
			sizeMiddle: {default: 1, type: Number},
			total: {default: 0, type: Number}
		},

		setup(props, {emit})
		{
			const latte = useLatte();
			const icons = latte.options.icons;

			const totalPages = computed(() => Math.ceil(props.total / props.limit));
			const currentPage = computed(() => clamp(Math.floor(props.offset / props.limit) + 1, 1, totalPages.value));
			const isEndNavEnabled = computed(() => currentPage.value < totalPages.value);
			const isStartNavEnabled = computed(() => currentPage.value > 1);

			const pages = computed(() =>
			{
				const current = unref(currentPage);
				const total = unref(totalPages);

				if (total === 0)
					return [];

				let dots = false;
				let pages: Array<number | null> = [];

				if (total === (props.sizeEnd + props.sizeMiddle + 2))
				{
					for (let n = 1; n <= total; n++)
						pages.push(n);
				}
				else for (let n = 1; n <= total; n++)
				{
					if (current === n)
					{
						dots = true;
						pages.push(n);
					}
					else if (n <= props.sizeEnd || (n >= current - props.sizeMiddle && n <= current + props.sizeMiddle) || n > total - props.sizeEnd)
					{
						dots = true;
						pages.push(n);
					}
					else if (dots)
					{
						dots = false;
						pages.push(null);
					}
				}

				return pages;
			});

			const onPageClick = (page: number) => emit("navigate", (page - 1) * props.limit, page);

			return {
				icons,

				currentPage,
				isEndNavEnabled,
				isStartNavEnabled,
				pages,
				totalPages,

				onPageClick
			};
		}

	});

</script>
