
import IClassStatic from './IClassStatic';

abstract class Store<State> {

	constructor(
		private StateClass: IClassStatic<State>
	) {}

	public abstract getState(params: { [name: string]: string }): State;

	public getStateClass(): IClassStatic<State> {
		return this.StateClass;
	}
}
export default Store;
