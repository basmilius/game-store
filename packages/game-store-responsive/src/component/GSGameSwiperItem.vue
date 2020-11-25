<template>

	<div class="panel overflow-hidden mx-4 game-swiper-item">
		<div class="panel-media aspect-ratio aspect-ratio-21/9" :class="'game-hero-' + gameId"></div>

		<div class="panel flex-row bg-base-light shadow-outline-2 game-swiper-box" :class="{'is-current': isCurrent}">
			<div class="panel-body flex-grow-0 pr-1 align-self-start lg:align-self-end">
				<img src="@/assets/image/games/minecraft/box.jpg" alt="Minecraft box" v-if="gameId === 'minecraft'"/>
				<img src="@/assets/image/games/minecraft-dungeons/box.jpg" alt="Minecraft Dungeons box" v-else-if="gameId === 'minecraft-dungeons'"/>
				<img src="@/assets/image/games/gta-v/box.jpg" alt="GTA V box" v-else-if="gameId === 'gta-v'"/>
			</div>
			<div class="panel-body">
				<h3 class="h4 m-0 text-base-dark">{{ gameName }}</h3>
				<slot></slot>
			</div>
			<div class="panel-body flex-grow-0 pl-1 align-self-start d-none lg:d-block">
				<Button color="primary" label="Buy Now" class="text-nowrap" @click="onClick"/>
			</div>
		</div>
	</div>

</template>

<script lang="ts">

	import { defineComponent } from "vue";
	import { useRouter } from "vue-router";
	import { Button } from "@latte-ui/core";

	export default defineComponent({

		name: "GSGameCard",

		components: {
			Button
		},

		props: {
			gameId: {required: true, type: String},
			gameName: {required: true, type: String},
			isCurrent: {default: false, type: Boolean}
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
