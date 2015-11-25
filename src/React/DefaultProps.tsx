/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>

import 'reflect-metadata';
import * as React from 'react';
import Action from '../Flux/Action';
import Binding from '../Flux/Binding';
import { fromJS } from 'immutable';
import { StateSignals, StateActions, IPatchPayload, IInitialStatePayload } from '../State/State';
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

let reactInitialized = false; // TODO

export default function DefaultProps(StatesStatic: { [stateName: string]: any }): ClassDecorator {
	'use strict';
	return (ComponentStatic: React.ComponentClass<any>) => {
		@DefaultContext(Context)
		class ComponentWithProps extends React.Component<any, any> {

			static contextTypes: React.ValidationMap<any> = {
				initialState: React.PropTypes.object.isRequired
			};

			context: Context;
			private bindings: {
				patchBinding: Binding<IPatchPayload>;
				stateBinding: Binding<IInitialStatePayload>;
			}[];

			constructor(props: any, context: any) {
				super(props, context);
				this.state = {};
				if (this.componentShouldInitialize()) {
					Object.keys(StatesStatic).forEach((stateName: string) => {
						const StateStatic = StatesStatic[stateName];
						this.state[stateName] = this.context.convertor.convertFromJS(
							StateStatic,
							this.context.initialState[stateName]
						);
					});
				}
			}

			componentDidMount() {
				var initializeState = !this.componentWasInitialized();
				this.bindings = Object.keys(StatesStatic).map((stateName: string) => {
					const StateStatic = StatesStatic[stateName];
					const resourceTarget = this.context.resourceFactory.get(StateStatic, this.props.params);
					this.context.dispatcher.dispatch(this.context.stateActions.subscribe(resourceTarget));
					const patchBinding = this.context.dispatcher.bind(
						this.context.stateSignals.patch(resourceTarget),
						(action: Action<IPatchPayload>) => {
							const nextState = this.context.convertor.patch(
								StateStatic,
								this.state[stateName],
								fromJS(action.getPayload())
							);
							this.setState({ [stateName]: nextState });
						}
					);
					const stateBinding = this.context.dispatcher.bind(
						this.context.stateSignals.initialState(resourceTarget),
						(action: Action<IInitialStatePayload>) => {
							const nextState = this.context.convertor.convertFromJS(
								StateStatic,
								action.getPayload()
							);
							this.setState({ [stateName]: nextState });
						}
					);
					if (initializeState) {
						this.context.dispatcher.dispatch(this.context.stateActions.initialize(resourceTarget));
					}
					return { patchBinding, stateBinding };
				});
			}

			componentWillUnmount() {
				this.bindings.forEach(({ patchBinding, stateBinding }: {
					patchBinding: Binding<IPatchPayload>;
					stateBinding: Binding<IInitialStatePayload>;
				}) => {
					this.context.dispatcher
						.unbind(patchBinding)
						.unbind(stateBinding);
				});
				Object.keys(StatesStatic).forEach((stateName: string) => {
					const StateStatic = StatesStatic[stateName];
					const resourceTarget = this.context.resourceFactory.get(StateStatic, this.props.params);
					this.context.dispatcher.dispatch(this.context.stateActions.unsubscribe(resourceTarget));
				});
			}

			componentWillReceiveProps(nextProps: any) {
				if (nextProps.params !== this.props.params) {
					this.componentWillUnmount();
					this.componentDidMount();
				}
			}

			private componentShouldInitialize() {
				if (typeof window !== 'undefined' && reactInitialized) {
					return false;
				}
				reactInitialized = true;
				return true; // TODO
			}

			private componentWasInitialized() {
				for (let stateName of Object.keys(StatesStatic)) {
					if (typeof this.state[stateName] === 'undefined' && typeof this.props[stateName] === 'undefined') {
						return false;
					}
				}
				return true;
			}

			render() {
				if (this.componentWasInitialized()) {
					return <ComponentStatic {...this.state} {...this.props}/>;
				} else {
					return null;
				}
			}
		}
		Reflect.defineMetadata(DefaultProps, StatesStatic, ComponentStatic);
		Reflect.defineMetadata(DefaultProps, StatesStatic, ComponentWithProps);
		return ComponentWithProps as any as React.ComponentClass<any>;
	};
}
