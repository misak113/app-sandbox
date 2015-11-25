/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>

import 'reflect-metadata';
import * as React from 'react';
import {PropTypes, ComponentClass, ValidationMap} from 'react';
import ReactComponent from './Component';
import {Injector} from 'di';
import {InjectorMissingException} from './exceptions';

export default function DefaultContext(contextStatic: any): ClassDecorator {
	'use strict';
	return (ComponentStatic: ComponentClass<any>) => {
		class ComponentWithContext extends ReactComponent<any, any, { injector: Injector }> {

			static contextTypes: ValidationMap<any> = {
				injector: PropTypes.object
			};
			static childContextTypes: ValidationMap<any> = {
				injector: PropTypes.object
			};

			public props: any;

			getChildContext() {
				if (!this.context.injector) {
					throw new InjectorMissingException('You must pass injector to context of any parent component');
				}
				ComponentStatic.contextTypes = ComponentStatic.contextTypes || {};
				let context = this.context.injector.get(contextStatic);
				Object.keys(context).forEach((key: string) => {
					if (!ComponentStatic.contextTypes[key]) {
						ComponentStatic.contextTypes[key] = PropTypes.any.isRequired;
					}
					ComponentWithContext.childContextTypes[key] = PropTypes.any.isRequired;
				});
				Object.keys(this.context).forEach((key: string) => {
					if (!ComponentStatic.contextTypes[key]) {
						ComponentStatic.contextTypes[key] = PropTypes.any.isRequired;
					}
					context[key] = this.context[key];
					ComponentWithContext.childContextTypes[key] = PropTypes.any.isRequired;
				});
				return context;
			}

			render() {
				return <ComponentStatic {...this.props}/>;
			}
		}
		const contextTypes = ComponentStatic.contextTypes || {};
		Object.keys(contextTypes).forEach((key: string) => {
			ComponentWithContext.contextTypes[key] = contextTypes[key];
		});
		return ComponentWithContext as any as ComponentClass<any>;
	};
}
