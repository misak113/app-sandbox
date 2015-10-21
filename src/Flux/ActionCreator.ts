
import Action from './Action';
import ActionNameStatic from './ActionNameStatic';

abstract class ActionCreator<ActionName extends ActionNameStatic<any>> {

	protected abstract getActionName(): ActionNameStatic<ActionName>;
	protected abstract getName(): string;

	protected createAction(actionName: ActionName, payload?: any) {
		return new Action(this.createActionName(actionName), payload);
	}

	createActionName(actionName: ActionName) {
		return this.getName() + ':' + this.getActionName()[<any>actionName];
	}
}
export default ActionCreator;
