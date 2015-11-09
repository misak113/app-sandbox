
// TODO temporary load of jQuery into global context for bootstrap
import * as jQuery from 'jquery';
(window as any).jQuery = jQuery;
import 'bootstrap';
import * as React from 'react';
import ClientDispatcher from './Socket/ClientDispatcher';
import routes from './config/routes';
import {Injector} from 'di';
import EntityStorage from './Immutable/EntityStorage';
import { setEntityStorage } from './Immutable/Entity';
/* tslint:disable */
var Router = require('react-router').Router;
var history = require('history');
/* tslint:enable */

export interface IClientProps {
	injector: Injector;
	clientId: string;
	initialState: any;
}

export default class Client extends React.Component<IClientProps, {}> {

	private history: any;
	private clientDispatcher: ClientDispatcher;

	static childContextTypes: React.ValidationMap<any> = {
		injector: React.PropTypes.object.isRequired,
		initialState: React.PropTypes.object,
		clientId: React.PropTypes.string.isRequired
	};

	constructor(props: IClientProps, context: {}) {
		super(props, context);
		setEntityStorage(this.props.injector.get(EntityStorage));
		this.history = history.createHistory({});
		this.clientDispatcher = this.props.injector.get(ClientDispatcher);
	}

	getChildContext() {
		return {
			injector: this.props.injector,
			initialState: this.props.initialState,
			clientId: this.props.clientId
		};
	}

	componentWillMount() {
		this.clientDispatcher.listen(this.props.clientId);
	}

	render() {
		return (
			<Router
				routes={routes}
				history={this.history}
			/>
		);
	}
}
