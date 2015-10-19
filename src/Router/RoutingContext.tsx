
import * as React from 'react';
import {PropTypes, ValidationMap} from 'react';
import Component from '../React/Component';
import {Injector} from 'di';
var ReactRouterRoutingContext = require('react-router').RoutingContext;

export interface IRoutingContextProps {
	injector: Injector;
	[name: string]: any;
}

export interface IRoutingContextChildContext {
	injector: Injector;
}

export default class RoutingContext extends Component<IRoutingContextProps, {}, {}> {

	static childContextTypes: ValidationMap<any> = {
		injector: PropTypes.object
	};

	getChildContext(): IRoutingContextChildContext {
		return {
			injector: this.props.injector
		};
	}

	render() {
		return <ReactRouterRoutingContext {...this.props} />;
	}
}
