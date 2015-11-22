
import * as React from 'react';
import Action from '../Flux/Action';
import Binding from '../Flux/Binding';
import { fromJS } from 'immutable';
import { StateSignals, StateActions, IPatchPayload } from '../State/State';
import Dispatcher from '../Flux/Dispatcher';
import Convertor from '../Immutable/Convertor';
import ResourceFactory from '../Addressing/ResourceFactory';
import { Inject } from 'di-ts';
import DefaultContext from './DefaultContext';

@Inject
export class Context {
	public initialState: any;
	constructor(
		public convertor: Convertor,
		public dispatcher: Dispatcher,
		public stateSignals: StateSignals,
		public stateActions: StateActions,
		public resourceFactory: ResourceFactory
	) { }
}

export default function DefaultProps(StatesStatic: { [stateName: string]: any }): ClassDecorator {
	'use strict';
	return (ComponentStatic: React.ComponentClass<any>) => {
		@DefaultContext(Context)
		class ComponentWithProps extends React.Component<any, any> {

			static contextTypes: React.ValidationMap<any> = {
				initialState: React.PropTypes.object.isRequired
			};

			context: Context;
			private patchBindings: Binding<IPatchPayload>[];

			constructor(props: any, context: any) {
				super(props, context);
				this.state = {};
				Object.keys(StatesStatic).forEach((stateName: string) => {
					var StateStatic = StatesStatic[stateName];
					this.state[stateName] = this.context.convertor.convertFromJS(
						StateStatic,
						this.context.initialState[stateName]
					);
				});
			}

			componentDidMount() {
				this.patchBindings = Object.keys(StatesStatic).map((stateName: string) => {
					var StateStatic = StatesStatic[stateName];
					var resourceTarget = this.context.resourceFactory.get(StateStatic, this.props.params);
					this.context.dispatcher.dispatch(this.context.stateActions.subscribe(resourceTarget));
					return this.context.dispatcher.bind(
						this.context.stateSignals.patch(resourceTarget),
						(action: Action<IPatchPayload>) => {
							var nextState = this.context.convertor.patch(
								StateStatic,
								this.state[stateName],
								fromJS(action.getPayload())
							);
							this.setState({ [stateName]: nextState });
						}
					);
				});
			}

			componentWillUnmount() {
				this.patchBindings.forEach((patchBinding: Binding<IPatchPayload>) => {
					this.context.dispatcher.unbind(patchBinding);
				});
				Object.keys(StatesStatic).forEach((stateName: string) => {
					var StateStatic = StatesStatic[stateName];
					var resourceTarget = this.context.resourceFactory.get(StateStatic, this.props.params);
					this.context.dispatcher.dispatch(this.context.stateActions.unsubscribe(resourceTarget));
				});
			}

			render() {
				return <ComponentStatic {...this.state} {...this.props}/>;
			}
		}
		Reflect.defineMetadata(DefaultProps, StatesStatic, ComponentStatic);
		Reflect.defineMetadata(DefaultProps, StatesStatic, ComponentWithProps);
		return ComponentWithProps as any as React.ComponentClass<any>;
	};
}
