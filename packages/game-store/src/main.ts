import { createApp } from "vue";

import { LatteUI, LOptions } from "@latte-ui/core";

import "@mdi/font/scss/materialdesignicons.scss";
import "./assets/css/index.scss";

import App from "./App.vue";

import { initializeRouter } from "@/logic/routing";

// @ts-ignore
createApp(App)
	.use(LatteUI, <LOptions>{
		icons: {
			calendar: "fad calendar",
			chevronDoubleLeft: "fad angle-double-left",
			chevronDoubleRight: "fad angle-double-right",
			chevronLeft: "fad angle-left",
			chevronRight: "fad angle-right"
		}
	})
	.use(initializeRouter())
	.mount("#app");
