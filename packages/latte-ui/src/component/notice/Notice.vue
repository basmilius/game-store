<template>

	<div :class="classes">

		<template v-if="$slots.body">
			<slot name="body" v-bind="{close: onCloseClick, color, icon, isCloseable, isFluid, isSerious}"></slot>
		</template>

		<template v-else>
			<Icon :name="icon" v-if="icon"/>

			<div class="notice-body">
				<slot></slot>
			</div>

			<button class="close" @click="onCloseClick" v-if="isCloseable"></button>
		</template>

	</div>

</template>

<script lang="ts">

	import { computed, defineComponent } from "vue";
	import { Icon } from "../icon";

	export default defineComponent({

		name: "LatteNotice",

		components: {Icon},

		props: {
			color: {default: null}, // LColor | String | null
			icon: {default: null}, // String | null
			isCloseable: {default: false, type: Boolean},
			isFluid: {default: false, type: Boolean},
			isSerious: {default: false, type: Boolean}
		},

		setup(props, {emit})
		{
			const classes = computed(() =>
			{
				const c = ["notice"];

				if (props.color !== null)
					c.push(`is-${props.color}`);

				if (props.isFluid)
					c.push("is-fluid");

				if (props.isSerious)
					c.push("is-serious");

				return c;
			});

			const onCloseClick = (evt: MouseEvent) => emit("close", evt);

			return {
				classes,
				onCloseClick
			};
		}

	});

</script>
