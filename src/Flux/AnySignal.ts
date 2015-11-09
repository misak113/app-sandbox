
import Signal from './Signal';

export default class AnySignal extends Signal<{}> {

	constructor() {
		super('*');
	}
}
