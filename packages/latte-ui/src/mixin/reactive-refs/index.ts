import { ComponentOptions, reactive, ref } from "vue";

export const ReactiveReferences: ComponentOptions = {

	beforeCreate(): void
	{
		const {refs} = this.$options;

		if (refs === undefined || !Array.isArray(refs) || refs.length === 0)
			return;

		const knownRefs: any = {};

		for (let r of refs)
			knownRefs[r] = ref(null);

		this.$.setupState = reactive({
			...this.$.setupState._,
			...knownRefs
		});
	}

}
