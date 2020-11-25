export const isBrowser = "browser" in process;
export const isRenderedOnServer = isBrowser && !!(<any>window).__INITIALI_STATE__;
