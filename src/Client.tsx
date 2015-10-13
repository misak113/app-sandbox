
import * as React from 'react';
import {PropTypes, ValidationMap} from 'react';
import Component from './React/Component';
import {Injector} from 'di';
import routes from './config/routes';
var Router = require('react-router').Router;
var history = require('history');

export interface IClientProps {
	injector: Injector;
}

export default class Client extends Component<IClientProps, {}, {}> {

	static childContextTypes: ValidationMap<any> = {
		injector: PropTypes.object
	};

	getChildContext() {
		return {
			injector: this.props.injector
		};
	}
	
	render() {
		return (
			<Router routes={routes} history={history.createHistory({})}/>
		);
	}
}
