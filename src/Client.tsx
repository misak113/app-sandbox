
import * as React from 'react';
import {PropTypes, ValidationMap} from 'react';
import Component from './React/Component';
import ClientDispatcher from './Socket/ClientDispatcher';
import {Injector} from 'di';
import routes from './config/routes';
var Router = require('react-router').Router;
var history = require('history');

export interface IClientProps {
	injector: Injector;
}

export interface IClientState {
	clientDispatcher: ClientDispatcher;
}

export default class Client extends Component<IClientProps, IClientState, {}> {

	static childContextTypes: ValidationMap<any> = {
		injector: PropTypes.object
	};

	constructor(props: IClientProps, context: {}) {
		super(props, context);
		this.state = {
			clientDispatcher: this.props.injector.get(ClientDispatcher)
		};
	}

	getChildContext() {
		return {
			injector: this.props.injector
		};
	}

	componentWillMount() {
		this.state.clientDispatcher.listen();
	}
	
	render() {
		return (
			<Router routes={routes} history={history.createHistory({})}/>
		);
	}
}
