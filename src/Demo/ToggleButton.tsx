
import * as React from 'react';
import {Inject} from 'di-ts';
import DefaultContext from '../React/DefaultContext';
import Dispatcher from '../Flux/Dispatcher';
import { ChangeStatus } from './HomepageActions';

@Inject
export class ToggleButtonContext {
	constructor(
		public dispatcher: Dispatcher
	) { }
}

@DefaultContext(ToggleButtonContext)
export default class ToggleButton extends React.Component<{}, {}> {

	context: ToggleButtonContext;

	toggleStatus() {
		this.context.dispatcher.dispatch(new ChangeStatus());
	}

	render() {
		return <button onClick={() => this.toggleStatus()}>Toogle</button>;
	}
}
