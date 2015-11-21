
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

export default function DefaultProps(StateStatic: any): ClassDecorator {
	'use strict';
	return (ComponentStatic: React.ComponentClass<any>) => {
		@DefaultContext(Context)
		class ComponentWithProps extends React.Component<any, any> {

			static contextTypes: React.ValidationMap<any> = {
				initialState: React.PropTypes.object.isRequired
			};

			context: Context;
			private patchBinding: Binding<IPatchPayload>;

			constructor(props: any, context: any) {
				super(props, context);
				this.state = {
					defaultProps: this.context.initialState
				};
			}

			componentDidMount() {
				var resourceTarget = this.context.resourceFactory.get(StateStatic, this.props.params);
				this.context.dispatcher.dispatch(this.context.stateActions.subscribe(resourceTarget));
				this.patchBinding = this.context.dispatcher.bind(
					this.context.stateSignals.patch(),
					(action: Action<IPatchPayload>) => {
						var nextState = this.context.convertor.patch(
							StateStatic,
							this.state.defaultProps,
							fromJS(action.getPayload())
						);
						this.setState({ defaultProps: nextState });
					}
				);
			}

			componentWillUmount() {
				this.context.dispatcher.unbind(this.patchBinding);
			}

			render() {
				return <ComponentStatic {...this.state.defaultProps} {...this.props}/>;
			}
		}
		Reflect.defineMetadata(DefaultProps, StateStatic, ComponentStatic);
		Reflect.defineMetadata(DefaultProps, StateStatic, ComponentWithProps);
		return ComponentWithProps as any as React.ComponentClass<any>;
	};
}
