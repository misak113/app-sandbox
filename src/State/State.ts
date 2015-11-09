
import Action from '../Flux/Action';
import Signal from '../Flux/Signal';
import ActionCreator from '../Flux/ActionCreator';
import SignalCreator from '../Flux/SignalCreator';
import ResourceTarget from '../Addressing/ResourceTarget';
import Convertor from '../Immutable/Convertor';
import IEntityStatic from '../Immutable/IEntityStatic';
import IClassStatic from '../Flux/IClassStatic';
import {Inject} from 'di-ts';

const name = 'State.State';

export enum State {
	patch,
	subscribe,
	update
}

@Inject
export class StateActions extends ActionCreator<State> {

	constructor(
		private convertor: Convertor
	) {
		super(name, State);
	}

	patch<S>(S: IEntityStatic<S>, originalState: S, nextState: S, resourceTarget: ResourceTarget): Action<IPatchPayload> {
		var ops = this.convertor.diff(S, originalState, nextState);
		return this.createAction(State.patch, ops.toJS(), resourceTarget);
	}

	subscribe(resourceTarget: ResourceTarget): Action<ISubscribePayload> {
		return this.createAction(State.subscribe, { identifier: resourceTarget.getIdentifier() });
	}

	update<S>(S: IClassStatic<S>, originalState: S, nextState: S, resource: ResourceTarget): Action<IUpdatePayload> {
		return this.createAction(State.update, {
			StateClass: S,
			resource: resource,
			originalState: originalState,
			nextState: nextState
		});
	}
}
export class StateSignals extends SignalCreator<State> {

	constructor() {
		super(name, State);
	}

	patch(): Signal<{}> {
		return this.createSignal(State.patch);
	}

	subscribe() {
		return this.createSignal(State.subscribe);
	}

	update(): Signal<{}> {
		return this.createSignal(State.update);
	}
}

export type IPatchPayload = any[];

export interface ISubscribePayload {
	identifier: string;
}

export interface IUpdatePayload {
	StateClass: any;
	resource: ResourceTarget;
	originalState: any;
	nextState: any;
}