
import * as React from 'react';
import {Inject} from 'di-ts';
import Component from '../React/Component';
import DefaultContext from '../React/DefaultContext';
import Dispatcher from '../Flux/Dispatcher';
import Action from '../Flux/Action';

@Inject
export class ToggleButtonContext {
	constructor(
		public dispatcher: Dispatcher
	) { }
}

@DefaultContext(ToggleButtonContext)
export default class ToggleButton extends Component<{}, {}, ToggleButtonContext> {
	

	toggleStatus() {
		this.context.dispatcher.dispatch(new Action('changeStatus'));
	}

	render() {
		return <button onClick={() => this.toggleStatus()}>Toogle</button>;
	}
}
