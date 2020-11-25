<template>

	<div class="container">

		<div class="row">
			<template v-for="i of [1, 2, 3, 4]">
				<div class="col-4 mt-7">
					<GSGameCard game-id="gta-v" game-name="GTA V">
						<p>
							When a young street hustler, a retired bank robber and a terrifying
							psychopath land themselves in...
						</p>
					</GSGameCard>
				</div>

				<div class="col-4 mt-7">
					<GSGameCard game-id="minecraft" game-name="Minecraft">
						<p>
							Explore randomly generated worlds and build amazing things from the
							simplest of homes to the grandest...
						</p>
					</GSGameCard>
				</div>

				<div class="col-4 mt-7">
					<GSGameCard game-id="minecraft-dungeons" game-name="Minecraft Dungeons">
						<p>
							Fight your way through an all-new action-adventure game, inspired by
							classic dungeon crawlers and set...
						</p>
					</GSGameCard>
				</div>
			</template>
		</div>

	</div>

</template>

<script lang="ts">

	import { defineComponent } from "vue";
	import { Button } from "@latte-ui/core";
	import { default as GSGameCard } from "@/component/GSGameCard.vue";

	export default defineComponent({

		name: "GSStore",

		components: {
			Button,
			GSGameCard
		},

		setup()
		{
			return {};
		}

	});

</script>
