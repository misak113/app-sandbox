/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>

import 'reflect-metadata';
import * as React from 'react';
import {PropTypes, ComponentClass, Component} from 'react';
import {Injector} from 'di';

export default function DefaultContext(Context: any): ClassDecorator {
	return (Component: ComponentClass<any>) => {
		class ComponentWithContext {

			static contextTypes = {
				injector: PropTypes.object
			};
			static childContextTypes = {
				injector: PropTypes.object
			};

			public props: any;
			public context: {
				injector: Injector;
			};

			getChildContext() {
				Component.contextTypes = Component.contextTypes || {};
				var context = this.context.injector.get(Context);
				Object.keys(context).forEach((key: string) => {
					if (!Component.contextTypes[key]) {
						Component.contextTypes[key] = PropTypes.any.isRequired;
					}
					ComponentWithContext.childContextTypes[key] = PropTypes.any.isRequired;
				});
				Object.keys(this.context).forEach((key: string) => {
					if (!Component.contextTypes[key]) {
						Component.contextTypes[key] = PropTypes.any.isRequired;
					}
					context[key] = this.context[key];
				});
				return context;
			}

			render() {
				return <Component {...this.props}/>;
			}
		}
		var contextTypes = Component.contextTypes || {};
		Object.keys(contextTypes).forEach((key: string) => {
			ComponentWithContext.contextTypes[key] = contextTypes[key];
		});
		return ComponentWithContext as any as ComponentClass<any>;
	}
}
