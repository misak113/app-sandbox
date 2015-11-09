
import * as React from 'react';
import StatusView from './StatusView';
import ToggleButton from './ToggleButton';
import HomepageState from './HomepageState';
import Action from '../Flux/Action';
import Binding from '../Flux/Binding';
import Dispatcher from '../Flux/Dispatcher';
import Convertor from '../Immutable/Convertor';
import ResourceFactory from '../Addressing/ResourceFactory';
import { StateSignals, StateActions, IPatchPayload } from '../State/State';
import { Inject } from 'di-ts';
import { fromJS } from 'immutable';
import DefaultContext from '../React/DefaultContext';
import StatusStore from './StatusStore';

@Inject
export class HomepageContext {

	public initialState: HomepageState;
	public location: Location;

	constructor(
		public convertor: Convertor,
		public dispatcher: Dispatcher,
		public stateSignals: StateSignals,
		public stateActions: StateActions,
		public resourceFactory: ResourceFactory
	) {}
}

export interface IHomepageProps {
	params: { [name: string]: string };
}

export interface IHomepageState {
	homepage: HomepageState;
}

@DefaultContext(HomepageContext)
export default class Homepage extends React.Component<IHomepageProps, IHomepageState> {

	static contextTypes: React.ValidationMap<any> = {
		initialState: React.PropTypes.object.isRequired,
		location: React.PropTypes.object.isRequired
	};

	public context: HomepageContext;
	private patchBinding: Binding<IPatchPayload>;

	constructor(props: IHomepageProps, context: HomepageContext) {
		super(props, context);
		this.state = {
			homepage: this.context.convertor.convertFromJS<HomepageState>(
				HomepageState,
				this.context.initialState
			)
		};
	}

	componentDidMount() {
		var resourceTarget = this.context.resourceFactory.get(StatusStore, this.props.params);
		this.context.dispatcher.dispatch(this.context.stateActions.subscribe(resourceTarget));
		this.patchBinding = this.context.dispatcher.bind(
			this.context.stateSignals.patch(),
			(action: Action<IPatchPayload>) => {
				var nextState = this.context.convertor.patch(
					HomepageState,
					this.state.homepage,
					fromJS(action.getPayload())
				);
				this.setState({ homepage: nextState });
			}
		);
	}

	componentWillUmount() {
		this.context.dispatcher.unbind(this.patchBinding);
	}

	render() {
		return (
			<div>
				<StatusView status={this.state.homepage.getStatus() }/>
				<ToggleButton/>
			</div>
		);
	}
}
