
import Action from '../Flux/Action';
import ResourceTarget from '../Addressing/ResourceTarget';
import { List, fromJS } from 'immutable';

export class Patch extends Action<any[]> {

	constructor(ops: List<any>, resourceTarget: ResourceTarget) {
		super(ops.toJS(), resourceTarget);
	}

	getOps() {
		return fromJS(this.getPayload());
	}
}

export class Subscribe extends Action<{ identifier: string }> {

	constructor(resourceTarget: ResourceTarget) {
		super({ identifier: resourceTarget.getIdentifier() });
	}
}

export class Unsubscribe extends Action<{ identifier: string }> {

	constructor(resourceTarget: ResourceTarget) {
		super({ identifier: resourceTarget.getIdentifier() });
	}
}

export class Initialize extends Action<{ identifier: string }> {

	constructor(resourceTarget: ResourceTarget) {
		super({ identifier: resourceTarget.getIdentifier() });
	}
}

export class InitialState extends Action<any> {

	constructor(initialState: any, resourceTarget: ResourceTarget) {
		super(initialState, resourceTarget);
	}
}

export class Update extends Action<{
	StateClass: any;
	resourceTarget: ResourceTarget;
	originalState: any;
	nextState: any;
}> { }
