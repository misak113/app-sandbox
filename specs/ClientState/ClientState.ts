
import Entity from '../../src/Immutable/Entity';

@Entity
export default class ClientState {

	[name: string]: any;

	constructor(
		object?: any
	) {
		if (object) {
			Object.keys(object).forEach((name: string) => this[name] = object[name]);
		}
	}

	get(name: string) {
		return this[name];
	}

	set(name: string, value: any) {
		this[name] = value;
		return this;
	}

}
