<template>

	<div class="panel bg-base-light radius-default shadow-outline-2">
		<div class="panel-media aspect-ratio aspect-ratio-16/9" :class="'game-hero-' + gameId"></div>
		<div class="panel-body">
			<h3 class="h5 text-base-dark">{{ gameName }}</h3>
			<slot></slot>
		</div>
		<div class="panel-body pt-0">
			<Button color="primary" label="Buy Now" size="large" is-fluid @click="onClick"/>
		</div>
	</div>

</template>

<script lang="ts">

	import { defineComponent } from "vue";
	import { Button } from "@latte-ui/core";
	import { useRouter } from "vue-router";

	export default defineComponent({

		name: "GSGameCard",

		components: {
			Button
		},

		props: {
			gameId: {required: true, type: String},
			gameName: {required: true, type: String}
		},

		setup()
		{
			const router = useRouter();

			const onClick = () => router.push({
				name: "gs.game"
			});

			return {
				onClick
			};
		}

	});

</script>
