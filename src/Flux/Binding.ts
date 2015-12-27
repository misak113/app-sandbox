
import Action from './Action';
import IClassStatic from './IClassStatic';

export default class Binding<A extends Action<any>> {

	getActionStatics() { return this.ActionStatics; }
	getCallback() { return this.callback; }

	constructor(
		private ActionStatics: IClassStatic<A>[],
		private callback: (action: A) => void
	) {}
}
