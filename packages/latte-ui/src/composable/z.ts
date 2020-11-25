import { ref } from "vue";

let z = ref(2000);

export function useZIndexAPI(): ZIndexAPI
{
	return {

		get(): number
		{
			return ++z.value;
		}

	};
}

export interface ZIndexAPI
{
	get(): number;
}
