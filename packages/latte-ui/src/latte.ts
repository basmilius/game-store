import type { LSize } from "./util";
import { initializeScrollbar, isBrowser } from "./util";
import { App, reactive } from "vue";
import { ReactiveReferences } from "./mixin/reactive-refs";
import { LOptions, optionsWithDefaults } from "./options";

export class LatteAPI
{

	public readonly app: App;
	public readonly options: LOptions;

	public windowSize: LSize = reactive({
		height: 0,
		width: 0
	});

	public get root(): HTMLElement
	{
		return this.app._container;
	}

	constructor(app: App, options: LOptions)
	{
		this.app = app;
		this.options = optionsWithDefaults(options);

		this.registerMixins();

		if (isBrowser)
		{
			window.addEventListener("load", this.initialize.bind(this), {once: true});
			window.addEventListener("resize", this.onResize.bind(this), {passive: true});

			this.initialize();
		}
	}

	private initialize(): void
	{
		initializeScrollbar();

		this.onResize();
	}

	private onResize(): void
	{
		this.windowSize.height = window.innerHeight;
		this.windowSize.width = window.innerWidth;
	}

	private registerMixins(): void
	{
		this.app.mixin(ReactiveReferences);
	}

}
