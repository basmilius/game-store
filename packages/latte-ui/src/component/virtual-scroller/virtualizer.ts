const LEADING_BUFFER = 2;

export class Virtualizer
{

	private onUpdate!: Function | null;
	private params!: Params | null;

	private calculationIndex!: number;
	private calculationType!: Calculation;
	private firstRangeAverageSize?: number;
	private firstRangeTotalSize?: number;
	private fixedSize?: number;

	private scrollDirection!: Direction;
	private scrollOffset!: number;

	private currentRange!: Range;
	private sizes!: Map<string, number>;

	public get estimatedSize(): number
	{
		if (!this.params)
			return 0;

		return this.isFixed ? this.fixedSize! : (this.firstRangeAverageSize || this.params.estimatedSize);
	}

	public get isFixed(): boolean
	{
		return this.calculationType === Calculation.FIXED;
	}

	public get isFront(): boolean
	{
		return this.scrollDirection === Direction.FRONT;
	}

	public get lastIndex(): number
	{
		if (!this.params)
			return 0;

		return this.params.uniqueIds.length - 1;
	}

	public get offset(): number
	{
		return this.scrollOffset;
	}

	public get padBehind(): number
	{
		const end = this.currentRange.end;
		const lastIndex = this.lastIndex;

		if (this.isFixed)
			return (lastIndex - end) * this.fixedSize!;

		if (this.calculationIndex === lastIndex)
			return this.getIndexOffset(lastIndex) - this.getIndexOffset(end);

		return (lastIndex - end) * this.estimatedSize;
	}

	public get padFront(): number
	{
		if (this.isFixed)
			return this.fixedSize! * this.currentRange.start;

		return this.getIndexOffset(this.currentRange.start);
	}

	public get range(): Range
	{
		return {...this.currentRange};
	}

	constructor(params: Params, onUpdate: Function)
	{
		this.initialize(params, onUpdate);
	}

	public destroy(): void
	{
		this.initialize(null, null);
	}

	public initialize(params: Params | null, onUpdate: Function | null): void
	{
		this.params = params;
		this.onUpdate = onUpdate;

		this.sizes = new Map();
		this.calculationIndex = 0;
		this.calculationType = Calculation.INITIALIZE;
		this.firstRangeAverageSize = 0;
		this.firstRangeTotalSize = 0;
		this.fixedSize = 0;

		this.scrollDirection = Direction.FRONT;
		this.scrollOffset = 0;

		this.currentRange = Object.create(null);

		if (params)
			this.checkRange(0, params.keeps - 1);
	}

	public getEndByStart(start: number): number
	{
		if (!this.params)
			return 0;

		return Math.min(start + this.params.keeps - 1, this.lastIndex);
	}

	public getIndexOffset(index?: number): number
	{
		if (!index || !this.params)
			return 0;

		let offset = 0;
		let size = 0;

		for (let i = 0; i < index; i++)
		{
			let s = this.sizes.get(this.params.uniqueIds[i]);

			if (s)
				size = s;

			offset = offset + (s || this.estimatedSize);
		}

		this.calculationIndex = Math.max(this.calculationIndex, index - 1);
		this.calculationIndex = Math.min(this.calculationIndex, this.lastIndex);

		return offset;
	}

	public getOffset(index: number): number
	{
		return (index < 0 ? 0 : this.getIndexOffset(index)) + (this.params?.headerSize || 0);
	}

	public getScrollOvers(): number
	{
		if (!this.params)
			return 0;

		const offset = this.scrollOffset - (this.params.headerSize || 0);

		if (offset <= 0)
			return 0;

		if (this.isFixed)
			return Math.floor(offset / this.fixedSize!);

		let low = 0,
			middle = 0,
			middleOffset = 0,
			high = this.params.uniqueIds.length;

		while (low <= high)
		{
			middle = low + Math.floor((high - low) / 2);
			middleOffset = this.getIndexOffset(middle);

			if (middleOffset === offset)
				return middle;

			if (middleOffset < offset)
				low = middle + 1;
			else
				high = middle - 1;
		}

		return low > 0 ? --low : 0;
	}

	public handleBehind(): void
	{
		const overs = this.getScrollOvers();

		if (!this.params || overs < this.currentRange.start + this.params.buffer)
			return;

		this.checkRange(overs, this.getEndByStart(overs));
	}

	public handleFront(): void
	{
		const overs = this.getScrollOvers();

		if (!this.params || overs > this.currentRange.start)
			return;

		const start = Math.max(overs - this.params.buffer, 0);

		this.checkRange(start, this.getEndByStart(start));
	}

	public onDataSourceChanged(): void
	{
		let start = this.currentRange.start;
		start = this.isFront ? (start - LEADING_BUFFER) : (start + LEADING_BUFFER);
		start = Math.max(start, 0);

		this.updateRange(this.currentRange.start, this.getEndByStart(start));
	}

	public onSlotSizeChanged(): void
	{
		this.onDataSourceChanged();
	}

	public onScroll(offset: number): void
	{
		this.scrollDirection = offset < this.scrollOffset ? Direction.FRONT : Direction.BEHIND;
		this.scrollOffset = offset;

		if (!this.params)
			return;

		if (this.scrollDirection === Direction.FRONT)
			this.handleFront();
		else
			this.handleBehind();
	}

	public saveSize(id: string, size: number): void
	{
		if (!this.params)
			return;

		this.sizes.set(id, size);

		if (this.calculationType === Calculation.INITIALIZE)
		{
			this.fixedSize = size;
			this.calculationType = Calculation.FIXED;
		}
		else if (this.calculationType === Calculation.FIXED && this.fixedSize !== size)
		{
			this.calculationType = Calculation.DYNAMIC;
			delete this.fixedSize;
		}

		if (this.calculationType !== Calculation.FIXED && typeof this.firstRangeTotalSize !== "undefined")
		{
			if (this.sizes.size < Math.min(this.params.keeps, this.params.uniqueIds.length))
			{
				this.firstRangeTotalSize = this.firstRangeTotalSize + size;
				this.firstRangeAverageSize = Math.round(this.firstRangeTotalSize / this.sizes.size);
			}
			else
			{
				delete this.firstRangeTotalSize;
			}
		}
	}

	public updateParam<T extends keyof Params>(key: T, value: Params[T]): void
	{
		if (!this.params || !(key in this.params))
			return;

		if (key === "uniqueIds")
		{
			this.sizes.forEach((_, key) =>
			{
				if (!(value as string[]).includes(key))
					this.sizes.delete(key);
			});
		}

		this.params[key] = value;
	}

	private checkRange(start: number, end: number): void
	{
		if (!this.params)
			return;

		const keeps = this.params.keeps;
		const total = this.params.uniqueIds.length;

		if (total <= keeps)
		{
			start = 0;
			end = this.lastIndex;
		}
		else if (end - start < keeps - 1)
		{
			start = end - keeps + 1;
		}

		if (this.currentRange.start !== start)
			this.updateRange(start, end);
	}

	private updateRange(start: number, end: number): void
	{
		if (start === this.currentRange.start && end === this.currentRange.end)
			return;

		this.currentRange.start = start;
		this.currentRange.end = end;
		this.currentRange.padBehind = this.padBehind;
		this.currentRange.padFront = this.padFront;

		if (this.onUpdate)
			this.onUpdate(this.range);
	}

}

export enum Calculation
{
	INITIALIZE,
	DYNAMIC,
	FIXED
}

export enum Direction
{
	BEHIND,
	FRONT
}

export interface Params
{
	buffer: number;
	estimatedSize: number;
	headerSize: number;
	footerSize: number;
	keeps: number;
	uniqueIds: string[];
}

export interface Range
{
	end: number;
	start: number;
	padBehind: number;
	padFront: number;
}
