import { LColor, LLocationSides } from "../component/shared";
import { ref, Ref } from "vue";
import { useBreakpointsAPI } from "./breakpoints";

const instances: Ref<SnackbarInternalOptions[]> = ref([]);
const locationsBottom = [LLocationSides.Bottom, LLocationSides.BottomLeft, LLocationSides.BottomRight];
const locationsTop = [LLocationSides.Top, LLocationSides.TopLeft, LLocationSides.TopRight];

let snackbarId = -1;

export function useSnackbar(): SnackbarAPI
{
	const breakpointsAPI = useBreakpointsAPI();

	const isBottom = (location: LLocationSides): boolean => locationsBottom.includes(location);
	const isTop = (location: LLocationSides): boolean => locationsTop.includes(location);

	const getLocation = (location: LLocationSides): LLocationSides =>
	{
		if (breakpointsAPI.isCollapsed)
		{
			if (isTop(location))
				return LLocationSides.Top;
			else if (isBottom(location))
				return LLocationSides.Bottom;
		}

		return location;
	};

	const add = (options: SnackbarOptions): Promise<void> =>
	{
		options.location = getLocation(options.location || LLocationSides.Top);

		return new Promise((resolve, reject) => instances.value.push({
			id: ++snackbarId,
			height: 0,
			reject,
			resolve,
			options
		}));
	};

	return {
		instances,

		add,
		getLocation,
		isBottom,
		isTop
	};
}

export interface SnackbarAPI
{
	instances: Ref<SnackbarInternalOptions[]>;

	add(options: SnackbarOptions): Promise<void>;

	getLocation(location: LLocationSides): LLocationSides;

	isBottom(location: LLocationSides): boolean;

	isTop(location: LLocationSides): boolean;
}

export interface SnackbarOptions
{
	color?: LColor | null;
	duration?: number;
	icon?: string | null;
	isCloseable?: boolean;
	isPersistent?: boolean;
	location?: LLocationSides;
	message?: string | null;
	title?: string | null;
}

export interface SnackbarInternalOptions
{
	id: number;
	height: number;
	reject: Function;
	resolve: Function;
	options: SnackbarOptions;
}
