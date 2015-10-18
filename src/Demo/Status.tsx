
import * as React from 'react';
import {Inject} from 'di-ts';
import Component from '../React/Component';
import DefaultContext from '../React/DefaultContext';
import Dispatcher from '../Flux/Dispatcher';
import ActionBinding from '../Flux/ActionBinding';
import StatusStore from './StatusStore';
import StatusActionCreator, {StatusActionName} from './StatusActionCreator';

@Inject
export class StatusContext {
	constructor(
		public dispatcher: Dispatcher,
		public statusActionCreator: StatusActionCreator,
		public statusStore: StatusStore
	) { }
}

@DefaultContext(StatusContext)
export default class Status extends Component<{}, { status?: boolean }, StatusContext> {

	private changeStatusBinding: ActionBinding;

	constructor(props: {}, context: StatusContext) {
		super(props, context);
		this.state = {};
	}

	componentDidMount() {
		this.changeStatusBinding = this.context.dispatcher.bind(
			this.context.statusActionCreator.createActionName(StatusActionName.STATUS_CHANGED), () => this.setState({
				status: this.context.statusStore.Status
			})
		);
	}

	componentWillUnmount() {
		this.context.dispatcher.unbind(this.changeStatusBinding);
	}

	render() {
		return <span>{this.state.status ? 'ON' : 'OFF'}</span>;
	}
}
