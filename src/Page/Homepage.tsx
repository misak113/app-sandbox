
import * as React from 'react';
import {Inject} from 'di-ts';
import Component from '../React/Component';
import DefaultContext from '../React/DefaultContext';
import Dispatcher from '../Flux/Dispatcher';
import Action from '../Flux/Action';
import ActionBinding from '../Flux/ActionBinding';

@Inject
export class HomepageContext {
	constructor(
		public dispatcher: Dispatcher
	) { }
}

@DefaultContext(HomepageContext)
export default class Homepage extends Component<{}, { status?: boolean }, HomepageContext> {

	private changeStatusBinding: ActionBinding;

	constructor(props, context) {
		super(props, context);
		this.state = {
			status: false
		};
	}

	toggleStatus() {
		this.context.dispatcher.dispatch(new Action('changeStatus'));
	}

	componentDidMount() {
		this.changeStatusBinding = this.context.dispatcher.bind('changeStatus', () => this.setState({ status: !this.state.status }));
	}

	componentWillUnmount() {
		this.context.dispatcher.unbind(this.changeStatusBinding);
	}

	render() {
		return (
			<div>
				{this.state.status ? 'ON' : 'OFF'}
				<button onClick={() => this.toggleStatus()}>Toogle</button>
			</div>
		);
	}
}
