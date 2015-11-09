
import Action from './Action';
import EnumStatic from './EnumStatic';

abstract class ActionCreator<ActionName extends EnumStatic<any>> {

	constructor(
		private name: string,
		private ActionNameStatic: EnumStatic<ActionName>
	) {}

	protected createAction(actionName: ActionName, payload?: any, target?: any, source?: any) {
		return new Action(this.createActionName(actionName), payload, source, target);
	}

	private createActionName(actionName: ActionName) {
		return this.name + ':' + this.ActionNameStatic[<any>actionName];
	}
}
export default ActionCreator;
