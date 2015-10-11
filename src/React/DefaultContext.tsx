/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>

import 'reflect-metadata';
import * as React from 'react';
import {PropTypes, ComponentClass, Component} from 'react';
import {Injector} from 'di';

export default function DefaultContext(Context: any): ClassDecorator {
	return (Component: ComponentClass<any>) => {
		return class ComponentWithContext {

			static contextTypes = {
				injector: PropTypes.object
			};
			static childContextTypes = {};

			public props: any;
			public context: {
				injector: Injector;
			};

			getChildContext() {
				Component.contextTypes = Component.contextTypes || {};
				var context = this.context.injector.get(Context);
				Object.keys(context).forEach((key: string) => {
					ComponentWithContext.childContextTypes[key] = PropTypes.any.isRequired;
					Component.contextTypes[key] = PropTypes.any.isRequired;
				});
				Object.keys(this.context).forEach((key: string) => {
					context[key] = this.context[key];
					ComponentWithContext.childContextTypes[key] = PropTypes.any;
				});
				return context;
			}

			render() {
				return <Component {...this.props}/>;
			}
		} as any as ComponentClass<any>;
	}
}
