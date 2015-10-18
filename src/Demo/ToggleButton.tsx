
import * as React from 'react';
import {Inject} from 'di-ts';
import Component from '../React/Component';
import DefaultContext from '../React/DefaultContext';
import Dispatcher from '../Flux/Dispatcher';
import Action from '../Flux/Action';
import StatusActionCreator from './StatusActionCreator';

@Inject
export class ToggleButtonContext {
	constructor(
		public dispatcher: Dispatcher,
		public statusActionCreator: StatusActionCreator
	) { }
}

@DefaultContext(ToggleButtonContext)
export default class ToggleButton extends Component<{}, {}, ToggleButtonContext> {

	toggleStatus() {
		this.context.dispatcher.dispatch(this.context.statusActionCreator.changeStatus());
	}

	render() {
		return <button onClick={() => this.toggleStatus()}>Toogle</button>;
	}
}
