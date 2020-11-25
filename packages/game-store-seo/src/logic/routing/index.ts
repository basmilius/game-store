import { createRouter, createWebHistory, Router, RouteRecordRaw } from "vue-router";
import { delayed } from "@latte-ui/core";

export function initializeRouter(): Router
{
	return createRouter({
		history: createWebHistory(process.env.BASE_URL),
		routes: createRootRoutes(),
		scrollBehavior: async (to, from, savedPosition) =>
		{
			await delayed(180);

			if (savedPosition)
				return savedPosition;

			return {
				top: 0,
				left: 0,
				behavior: "auto"
			};
		}
	});
}

function createRootRoutes(): RouteRecordRaw[]
{
	return [
		{
			name: "gs.home",
			path: "/",
			component: () => import("../../views/Home.vue")
		},
		{
			name: "gs.about",
			path: "/about",
			component: () => import("../../views/About.vue")
		},
		{
			name: "gs.game",
			path: "/game",
			component: () => import("../../views/Game.vue")
		},
		{
			name: "gs.games",
			path: "/games",
			component: () => import("../../views/Games.vue")
		}
	];
}
