
import * as React from 'react';
import {Inject} from 'di-ts';
import Component from '../React/Component';
import DefaultContext from '../React/DefaultContext';
import Dispatcher from '../Flux/Dispatcher';
import ActionBinding from '../Flux/ActionBinding';

@Inject
export class StatusContext {
	constructor(
		public dispatcher: Dispatcher
	) { }
}

@DefaultContext(StatusContext)
export default class Status extends Component<{}, { status?: boolean }, StatusContext> {

	private changeStatusBinding: ActionBinding;

	constructor(props, context) {
		super(props, context);
		this.state = {
			status: false
		};
	}

	componentDidMount() {
		this.changeStatusBinding = this.context.dispatcher.bind('changeStatus', () => this.setState({ status: !this.state.status }));
	}

	componentWillUnmount() {
		this.context.dispatcher.unbind(this.changeStatusBinding);
	}

	render() {
		return <span>{this.state.status ? 'ON' : 'OFF'}</span>;
	}
}
