import type { Component, VNode } from "vue";

export type LIconRenderer = (name: string | null) => VNode;
export type LIcons = { [key: string]: string; };

export interface LOptions
{
	componentList?: Record<string, Component>;
	componentPrefix?: string;
	emoji?: LOptionsEmoji;
	iconRenderer?: LIconRenderer;
	icons?: LIcons;
}

export interface LOptionsEmoji
{
	baseUrl: string;
	fileName: string;
}
