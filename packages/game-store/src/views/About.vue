<template>

	<div class="container">
		<div class="row mt-9">
			<div class="col-7">

				<h1 class="h4 text-primary">About GameStore</h1>
				<p class="lead fw-700">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ad culpa error et omnis possimus quod quos ratione sequi voluptatibus. Architecto commodi cum dicta dolore ipsum laborum ratione ullam voluptatem?</p>
				<p>Corporis, fugit, harum. Ad adipisci assumenda delectus dolor doloremque ea eos, exercitationem facere, impedit inventore ipsa labore minima molestiae nulla quaerat repudiandae rerum suscipit ullam vitae voluptatem? Magni, tempore, vero!</p>
				<p>Consectetur hic pariatur quae! Debitis, minus veritatis! A accusantium facilis harum impedit necessitatibus odio quia quos reprehenderit! Asperiores at dolore provident quae quam? Distinctio impedit nisi provident quam tempora voluptatibus?</p>

			</div>
			<div class="col-5">

				<h2 class="h5 text-primary">Our info</h2>
				<p>
					<strong>GameStore</strong><br/>
					15 Rockland Drive<br/>
					Brooklyn, NY 11234
				</p>
				<p>
					E-mail: <a href="mailto:info@game.store">info@game.store</a><br/>
					Phone: <a href="tel:+31600000000">+31 6 00000000</a><br/>
				</p>

			</div>
		</div>
		<div class="row mt-9">
			<div class="col-12">

				<h2 class="h5 text-primary">Where to find us</h2>

				<div class="mt-5 position-relative fw-700 text-large radius-default overflow-hidden" style="height: 300px">
					<img src="@/assets/image/map.jpg" alt="Where our store is located." class="aspect-ratio-item" style="object-fit: cover; object-position: center"/>
				</div>

			</div>
		</div>
		<div class="row mt-9">
			<div class="col-12">

				<h2 class="h5 text-primary">Partners</h2>

			</div>
			<div class="col-3" v-for="i of [1, 2, 3, 4]">
				<div class="mt-5 bg-base-light fw-700 text-large radius-default d-flex align-items-center justify-content-center text-base-dark" style="height: 120px">
					Partner Logo
				</div>
			</div>
		</div>
		<div class="row mt-9">
			<div class="col-6">

				<h2 class="h5 text-primary">Submit your game</h2>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error laudantium quia, repellat sapiente sequi velit vero. Aspernatur aut dignissimos eaque inventore molestias non possimus reiciendis tempora temporibus voluptates. Quisquam, tempora?</p>
				<Button color="primary" label="Contact us" icon-after="arrow-right" type="outline" class="mt-3"/>

			</div>
			<div class="col-6">

				<h2 class="h5 text-primary">Become a partner</h2>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error laudantium quia, repellat sapiente sequi velit vero. Aspernatur aut dignissimos eaque inventore molestias non possimus reiciendis tempora temporibus voluptates. Quisquam, tempora?</p>
				<Button color="primary" label="Contact us" icon-after="arrow-right" type="outline" class="mt-3"/>

			</div>
		</div>
	</div>

</template>

<script lang="ts">

	import { defineComponent } from "vue";
	import { Button } from "@latte-ui/core";

	export default defineComponent({

		name: "GSAbout",

		components: {
			Button
		},

		setup()
		{
			return {};
		}

	});

</script>
