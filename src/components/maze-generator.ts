export class MazeGenerator extends HTMLElement {
	private readonly root = this.attachShadow({mode: 'open'});
	private readonly canvas = document.createElement('canvas');
	private readonly context = this.canvas.getContext('2d');
	private width = 0;

	static get observedAttributes() { return ['cell', 'height']; }

	get height(): number {
		return Number(this.getAttribute('height'));
	}

	set height(value: number) {
		this.setAttribute('height', value.toString());
	}

	constructor() {
		super();

		this.root.appendChild(this.canvas);
	}

	connectedCallback() {
		// const context = this.getContext('2d');
		// console.log(context, this.height, this.cell);
		this.width = this.computeWidth(this.height);
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		// console.log(this.width)
	}

	// attributeChangedCallback(name: string, oldValue: any, newValue: any) {
	// 	console.log('Custom square element attributes changed.', name, oldValue, newValue);
	// 	// updateStyle(this);
	// }

	disconnectedCallback() {

	}

	private computeWidth(height: number): number {
		return height * 2 - 1;
	}
}