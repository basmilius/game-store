<template>

	<main>
		<div id="header-photo">
			<img src="@/assets/image/games/minecraft-dungeons/hero.jpg" alt="Minecraft Dungeons Impression Header"/>
		</div>

		<div class="container">

			<div class="row mt-7 sm:mt-9">
				<div class="col-12 lg:col-6">

					<h1 class="h2 text-primary">Minecraft Dungeons</h1>
					<p class="lead fw-700">
						Minecraft Dungeons. An all-new action-adventure game, inspired by classic dungeon crawlers and set in the Minecraft universe!
					</p>

					<h2 class="h5 text-primary">Unite. Fight. Survive</h2>
					<p>
						Fight your way through an all-new action-adventure game available on PC, Nintendo Switch, PlayStation 4, Xbox One, and Xbox Game Pass.
					</p>

					<h2 class="h5 text-primary">Unite</h2>
					<p>
						Brave the dungeons alone or team up with friends! Up to four players can battle together online or in couch co-op.
					</p>

					<h2 class="h5 text-primary">Fight</h2>
					<p>
						Use melee swings, hang back with ranged attacks, or tank your way through shielded by heavy armour! Personalize your character, and unlock unique items and weapon enchantments for devastating special attacks.
					</p>

					<h2 class="h5 text-primary">Survive</h2>
					<p>
						Explore the action-packed, treasure-stuffed levels—all in an epic quest to save the villagers and take down the evil Arch-Illager!
					</p>

				</div>
				<div class="col-12 lg:col-6 mt-5 lg:mt-0">

					<div class="panel bg-base-light radius-default shadow-outline-2 overflow-hidden">
						<div class="panel-body">
							<Button color="primary" label="Buy now ($19,99)" size="huge" is-fluid/>
						</div>
					</div>

					<div class="panel bg-base-light radius-default shadow-outline-2 overflow-hidden mt-5 lg:mt-7">
						<div class="panel-body">
							<h3 class="h5 m-0 text-primary">Trailer</h3>
						</div>
						<div class="panel-media aspect-ratio aspect-ratio-16/9">
							<iframe src="https://www.youtube-nocookie.com/embed/HJicIi8Lvx0" class="aspect-ratio-item border-0"></iframe>
						</div>
					</div>

					<div class="panel bg-base-light radius-default shadow-outline-2 mt-5 lg:mt-7">
						<div class="panel-body">
							<h3 class="h5 text-primary">Available on</h3>
							<p>PC, Nintendo Switch, PlayStation 4, Xbox One, and Xbox Game Pass.</p>
						</div>
					</div>

				</div>
			</div>

			<div class="row mt-5 lg:mt-7">
				<div class="col-12">
					<div class="panel bg-base-light radius-default shadow-outline-2 overflow-hidden">
						<div class="panel-body">
							<h3 class="h5 m-0 text-primary">Gameplay Trailer</h3>
						</div>
						<div class="panel-media aspect-ratio aspect-ratio-16/9">
							<iframe src="https://www.youtube-nocookie.com/embed/076mjMOL6R8" class="aspect-ratio-item border-0"></iframe>
						</div>
					</div>
				</div>
			</div>

			<div class="row mt-7 lg:mt-9">
				<div class="col-12 lg:col-6">
					<h4 class="h5 text-primary">Minimum specs</h4>
					<ul>
						<li>An Intel Core i5 at 2.8GHz or an AMD equivalent.</li>
						<li>NVIDIA GeForce GTX 660, AMD Radeon HD 7870 or equivalent GPU that supports DirectX 11.</li>
						<li>8GB of RAM, 2 GB of VRAM.</li>
						<li>6GB of free storage.</li>
						<li>A 64-bit version of Windows 10, Windows 8, or Windows 7.</li>
					</ul>
				</div>
				<div class="col-12 lg:col-6 mt-5 lg:mt-0">
					<h4 class="h5 text-primary">Recommended specs</h4>
					<ul>
						<li>Intel Core i5-9600K or AMD Ryzen 5 3600.</li>
						<li>EVGA KO Ultra Gaming NVIDIA GeForce RTX 2060.</li>
						<li>Corsair Vengeance LPX DDR4 16GB RAM.</li>
						<li>Windows 10 Home 64-bit.</li>
					</ul>
				</div>
			</div>

		</div>
	</main>

</template>

<script lang="ts">

	import { defineComponent, onMounted, onUnmounted } from "vue";
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
			onMounted(() => document.body.classList.add("is-game"));
			onUnmounted(() => document.body.classList.remove("is-game"));

			return {};
		}

	});

</script>
