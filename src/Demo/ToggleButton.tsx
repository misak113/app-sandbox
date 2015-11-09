
import * as React from 'react';
import {Inject} from 'di-ts';
import DefaultContext from '../React/DefaultContext';
import Dispatcher from '../Flux/Dispatcher';
import { StatusActions } from './Status';

@Inject
export class ToggleButtonContext {
	constructor(
		public dispatcher: Dispatcher,
		public statusActions: StatusActions
	) { }
}

@DefaultContext(ToggleButtonContext)
export default class ToggleButton extends React.Component<{}, {}> {

	context: ToggleButtonContext;

	toggleStatus() {
		this.context.dispatcher.dispatch(this.context.statusActions.changeStatus());
	}

	render() {
		return <button onClick={() => this.toggleStatus()}>Toogle</button>;
	}
}
