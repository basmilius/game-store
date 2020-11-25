<template>

	<div class="container">

		<div class="row my-7">
			<div class="col-12">

				<Swiper class="overflow-hidden -mx-4 game-swiper">

					<SwiperItem v-slot="{isCurrent}">
						<GSGameSwiperItem :is-current="isCurrent" game-id="minecraft" game-name="Minecraft">
							<p class="m-0">
								Explore randomly generated worlds and build amazing things from the
								simplest of homes to the grandest of castles. Play in creative mode
								with unlimited resources or mine deep into the world in survival
								mode, crafting weapons and armor to fend off the dangerous mobs.
							</p>
						</GSGameSwiperItem>
					</SwiperItem>

					<SwiperItem v-slot="{isCurrent}">
						<GSGameSwiperItem :is-current="isCurrent" game-id="gta-v" game-name="GTA V">
							<p class="m-0">
								When a young street hustler, a retired bank robber and a terrifying
								psychopath land themselves in trouble, they must pull off a series
								of dangerous heists to survive in a city in which they can trust
								nobody, least of all each other.
							</p>
						</GSGameSwiperItem>
					</SwiperItem>

					<SwiperItem v-slot="{isCurrent}">
						<GSGameSwiperItem :is-current="isCurrent" game-id="minecraft-dungeons" game-name="Minecraft Dungeons">
							<p class="m-0">
								Fight your way through an all-new action-adventure game, inspired by
								classic dungeon crawlers and set in the Minecraft universe! Brave
								the dungeons alone, or team up with friends! Up to four players
								can battle together through action-packed, treasure-stuffed, wildly
								varied levels – all in an epic quest to save the villagers and take
								down the evil Arch-Illager!
							</p>
						</GSGameSwiperItem>
					</SwiperItem>

				</Swiper>

			</div>
		</div>

		<div class="row mt-9">
			<div class="col-7">

				<h1 class="h4 text-primary">Welcome in our store!</h1>
				<p class="lead fw-700">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ad culpa error et omnis possimus quod quos ratione sequi voluptatibus. Architecto commodi cum dicta dolore ipsum laborum ratione ullam voluptatem?</p>
				<p>Corporis, fugit, harum. Ad adipisci assumenda delectus dolor doloremque ea eos, exercitationem facere, impedit inventore ipsa labore minima molestiae nulla quaerat repudiandae rerum suscipit ullam vitae voluptatem? Magni, tempore, vero!</p>
				<p>Consectetur hic pariatur quae! Debitis, minus veritatis! A accusantium facilis harum impedit necessitatibus odio quia quos reprehenderit! Asperiores at dolore provident quae quam? Distinctio impedit nisi provident quam tempora voluptatibus?</p>

			</div>
			<div class="col-5">

				<div class="aspect-ratio aspect-ratio-4/3 radius-double overflow-hidden">
					<img src="@/assets/image/homepage-store.jpg" alt="Photo of the inside of our store." class="aspect-ratio-item" style="object-fit: cover; object-position: center"/>
				</div>

			</div>
		</div>

		<section class="mt-9">
			<div class="row align-items-center">
				<div class="col">
					<h2 class="h4 m-0 text-primary">Upcoming releases</h2>
				</div>
				<div class="col-auto">
					<Button color="base-dark" label="All Games" icon-after="arrow-right" size="small" type="text" class="pr-2"/>
				</div>
			</div>

			<div class="row">
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
			</div>
		</section>

	</div>

</template>

<script lang="ts">

	import { defineComponent } from "vue";
	import { Button, Swiper, SwiperItem } from "@latte-ui/core";
	import { default as GSGameCard } from "@/component/GSGameCard.vue";
	import { default as GSGameSwiperItem } from "@/component/GSGameSwiperItem.vue";

	export default defineComponent({

		name: "GSHome",

		components: {
			Button, Swiper, SwiperItem,
			GSGameCard,
			GSGameSwiperItem
		},

		setup()
		{
			return {};
		}

	});

</script>
