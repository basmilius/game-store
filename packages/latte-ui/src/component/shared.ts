export type LAxis = "horizontal" | "vertical";

export type LColor = "primary" | "error" | "info" | "success" | "warning" | "dark" | "light" | "outline";

export type LFunctionalIcon = (isActive: boolean, isHover: boolean) => string | null;

export type LLocationCenter = "center";
export type LLocationHorizontal = "left" | "right";
export type LLocationVertical = "top" | "bottom";
export type LLocationCorners = LLocationHorizontal & LLocationVertical;
export type LLocation = LLocationCenter & LLocationHorizontal & LLocationVertical;

export type LNavType = "list" | "pagination" | "pills" | "tabs";

export type LStyles = { [key: string]: string; };

export enum LLocationSides
{
	Top = "top",
	TopLeft = "top-left",
	TopRight = "top-right",
	Bottom = "bottom",
	BottomLeft = "bottom-left",
	BottomRight = "bottom-right"
}
