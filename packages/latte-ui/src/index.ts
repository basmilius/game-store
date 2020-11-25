import type { App, Plugin } from "vue";
import type { LOptions } from "./options";
import { LatteAPI } from "./latte";
import { LatteSymbol } from "./symbols";

export * from "./component";
export * from "./composable";
export * from "./directive";
export * from "./mixin";
export * from "./options";
export * from "./util";

export * from "./symbols";

export const LatteUI: Plugin = {

	install(app: App, options: LOptions): void
	{
		app.provide(LatteSymbol, new LatteAPI(app, options));
	}

};

export { LatteAPI };
