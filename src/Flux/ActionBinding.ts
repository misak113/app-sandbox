
import Action from './Action';

export default class ActionBinding {

	get ActionNames() { return this.actionNames; }
	get ActionCallback() { return this.actionCallback; }

	constructor(
		private actionNames: string[],
		private actionCallback: (action: Action) => void
	) {}
}
