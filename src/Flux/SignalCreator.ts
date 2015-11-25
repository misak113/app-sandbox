
import Signal from './Signal';
import EnumStatic from './EnumStatic';

abstract class SignalCreator<ActionName extends EnumStatic<any>> {

	constructor(
		private name: string,
		private ActionNameStatic: EnumStatic<ActionName>
	) {}

	protected createSignal(actionName: ActionName, payload?: any) {
		return new Signal(this.createActionName(actionName), payload);
	}

	private createActionName(actionName: ActionName) {
		return this.name + ':' + this.ActionNameStatic[<any>actionName];
	}
}
export default SignalCreator;
