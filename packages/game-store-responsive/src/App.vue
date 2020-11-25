<template>

	<Host>

		<AppBar is-main :class="{'bg-transparent': !isElevated, 'shadow-outline-8': isElevated}" id="main-header">
			<AppBarRow class="pt-4 lg:pb-4" is-auto-height>
				<div class="container">
					<div class="row align-items-center">
						<div class="col-12 lg:col-3 text-center lg:text-left py-4 lg:py-0">

							<router-link to="/" class="gs-logo">
								<span class="gs-logo-game">Game</span>
								<span class="gs-logo-store">Store</span>
							</router-link>

						</div>
						<div class="col-12 lg:col-6">

							<Nav type="list" class="flex-row my-1/2 lg:my-3 p-0 justify-content-center" id="main-header-nav">
								<NavItem label="Home" :is-active="routeName === 'gs.home'" @click="navigate('gs.home')"/>
								<NavItem label="Games" :is-active="routeName === 'gs.games'" @click="navigate('gs.games')"/>
								<NavItem label="About us" :is-active="routeName === 'gs.about'" @click="navigate('gs.about')"/>
							</Nav>

						</div>
						<div class="col-12 lg:col-3 text-right d-none lg:d-block">

							<div class="input-group">
								<div class="input-group-addon pr-0">
									<i class="mdi mdi-magnify"></i>
								</div>
								<input type="search" placeholder="Search for anything..." class="form-control pl-2"/>
							</div>

						</div>
					</div>
				</div>
			</AppBarRow>
		</AppBar>

		<router-view v-slot="{Component}">
			<transition mode="out-in" name="route-transition">
				<component :is="Component"/>
			</transition>
		</router-view>

		<div class="container">
			<div class="divider divider-horizontal mt-10 opacity-50" style="height: 3px"></div>

			<div class="text-center text-small text-muted my-8">
				Copyright &copy; GameStore 2020 &mdash; All rights reserved.
			</div>
		</div>

	</Host>

</template>

<script lang="ts">

	import { computed, defineComponent, onMounted, onUnmounted, ref } from "vue";
	import { AppBar, AppBarRow, AppBarTitle, Host, Nav, NavItem } from "@latte-ui/core";
	import { useRoute, useRouter } from "vue-router";

	export default defineComponent({

		name: "GSApp",

		components: {
			AppBar, AppBarRow, AppBarTitle, Host, Nav, NavItem
		},

		setup()
		{
			const route = useRoute();
			const router = useRouter();

			const isElevated = ref(false);
			const routeName = computed(() => route.name || "");

			const navigate = (name: string) => router.push({name});

			const onScroll = () => isElevated.value = document.scrollingElement!.scrollTop > 0;

			onMounted(() => window.addEventListener("scroll", onScroll, {passive: true}));
			onUnmounted(() => window.removeEventListener("scroll", onScroll));

			return {
				isElevated,
				routeName,

				navigate
			};
		}

	});

</script>
