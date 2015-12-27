/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>

import 'reflect-metadata';
import * as React from 'react';
import Binding from '../Flux/Binding';
import { fromJS } from 'immutable';
import { Patch, InitialState, Subscribe, Initialize, Unsubscribe } from '../State/StateActions';
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
				patchBinding: Binding<Patch>;
				stateBinding: Binding<InitialState>;
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
				const initializeState = !this.componentWasInitialized();
				this.bindings = Object.keys(StatesStatic).map((stateName: string) => {
					const StateStatic = StatesStatic[stateName];
					const resourceTarget = this.context.resourceFactory.get(StateStatic, this.props.params);
					this.context.dispatcher.dispatch(new Subscribe(resourceTarget));
					const patchBinding = this.context.dispatcher.bind(
						Patch,
						(action: Patch) => {
							const nextState = this.context.convertor.patch(
								StateStatic,
								this.state[stateName],
								fromJS(action.getPayload())
							);
							this.setState({ [stateName]: nextState });
						},
						resourceTarget
					);
					const stateBinding = this.context.dispatcher.bind(
						InitialState,
						(action: InitialState) => {
							const nextState = this.context.convertor.convertFromJS(
								StateStatic,
								action.getPayload()
							);
							this.setState({ [stateName]: nextState });
						},
						resourceTarget
					);
					if (initializeState) {
						this.context.dispatcher.dispatch(new Initialize(resourceTarget));
					}
					return { patchBinding, stateBinding };
				});
			}

			componentWillUnmount() {
				this.bindings.forEach(({ patchBinding, stateBinding }: {
					patchBinding: Binding<Patch>;
					stateBinding: Binding<InitialState>;
				}) => {
					this.context.dispatcher
						.unbind(patchBinding)
						.unbind(stateBinding);
				});
				Object.keys(StatesStatic).forEach((stateName: string) => {
					const StateStatic = StatesStatic[stateName];
					const resourceTarget = this.context.resourceFactory.get(StateStatic, this.props.params);
					this.context.dispatcher.dispatch(new Unsubscribe(resourceTarget));
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
