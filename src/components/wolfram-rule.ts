const rules = new Map([
	[true, new Map([
		[true, new Map([[true, false], [false, false]])],
		[false, new Map([[true, false], [false, true]])],
	])],
	[false, new Map([
		[true, new Map([[true, true], [false, true]])],
		[false, new Map([[true, true], [false, false]])],
	])],
]);

export class WolframRule extends HTMLElement {
	private readonly root = this.attachShadow({mode: 'open'});
	private readonly canvas = document.createElement('canvas');
	private readonly context = this.canvas.getContext('2d')!;

	static get observedAttributes() { return ['cell', 'height']; }

	get height(): number {
		return Number(this.getAttribute('height'));
	}

	get width(): number {
		return this.height * 2 - 1;
	}

	get cell(): number {
		return Number(this.getAttribute('cell'));
	}

	constructor() {
		super();

		this.root.appendChild(this.canvas);
	}

	connectedCallback() {
		this.fullDraw();
	}

	attributeChangedCallback(name: string, oldValue: any, newValue: any) {
		if (oldValue !== null && oldValue !== newValue) {
			this.fullDraw();
		}
	}

	private initCanvas() {
		this.canvas.width = this.width * this.cell;
		this.canvas.height = this.height * this.cell;
	}

	private initData(): boolean[][] {
		const data = [];

		for (let i = 0; i < this.width; i++) {
			data.push(Array(this.height).fill(false));
		}

		return data;
	}

	private rule(topLeft: boolean, top: boolean, topRight: boolean): boolean {
		// const rules: [[boolean, boolean, boolean], boolean][] = [
		// 	[[true, true, true], false],
		// 	[[true, true, false], false],
		// 	[[true, false, true], false],
		// 	[[true, false, false], true],
		// 	[[false, true, true], true],
		// 	[[false, true, false], true],
		// 	[[false, false, true], true],
		// 	[[false, false, false], false],
		// ];

		// Spierpinski rules
		// const rules = [
		// 	[[true, true, true], false],
		// 	[[true, true, false], true],
		// 	[[true, false, true], false],
		// 	[[true, false, false], true],
		// 	[[false, true, true], true],
		// 	[[false, true, false], false],
		// 	[[false, false, true], true],
		// 	[[false, false, false], false],
		// ];

		return rules.get(topLeft)!.get(top)!.get(topRight)!;

		// const [_, output] = rules.find(([state, output]) => {
		// 	const [a, b, c] = state;
		// 	return topLeft === a && top === b && topRight === c;
		// })!;

		// return output;
	}

	private step(width: number, data: boolean[][], currentStep: number) {
		const previousStep = currentStep - 1;
		for (let i = 0; i < width; i++) {
			const topRight = i > 1 ? data[i - 1][previousStep] : false;
			const top = data[i][previousStep];
			const topLeft = i < width - 1 ? data[i + 1][previousStep] : false;
			data[i][currentStep] = this.rule(topRight, top, topLeft);
		}
	}

	private draw(data: boolean[][]) {
		const width = this.width;
		const height = this.height;
		const cell = this.cell;

		for (let i = 0; i < width; i++) {
			for (let j = 0; j < height; j++) {
				if (data[i][j]) {
					this.context.fillRect(i * cell, j * cell, cell, cell);
				}
			}
		}
	}

	private compute(data: boolean[][]) {
		const width = this.width;
		const height = this.height;
		data[Math.floor(width / 2)][0] = true;

		for (let i = 1; i < height; i++) {
			this.step(width, data, i);
		}
	}

	private fullDraw() {
		this.initCanvas();
		const data = this.initData();
		this.compute(data);
		this.draw(data);
	}
}