
import * as React from 'react';
import {PropTypes, ValidationMap} from 'react';
import Component from './React/Component';
import ClientDispatcher from './Socket/ClientDispatcher';
import Dispatcher from './Flux/Dispatcher';
import Action from './Flux/Action';
import ClientStateActionCreator, {ClientStateActionName} from './Router/ClientStateActionCreator';
import {Injector} from 'di';
import {Map, fromJS} from 'immutable';
import routes from './config/routes';
/* tslint:disable */
var Router = require('react-router').Router;
var history = require('history');
var patch = require('immutablepatch');
/* tslint:enable */

export interface IClientProps {
	injector: Injector;
}

export interface IClientState {
	history?: any;
	clientDispatcher?: ClientDispatcher;
	dispatcher?: Dispatcher;
	clientStateActionCreator?: ClientStateActionCreator;
	clientState?: Map<string, any>;
}

export default class Client extends Component<IClientProps, IClientState, {}> {

	static childContextTypes: ValidationMap<any> = {
		injector: PropTypes.object
	};

	constructor(props: IClientProps, context: {}) {
		super(props, context);
		this.state = {
			history: history.createHistory({}),
			clientDispatcher: this.props.injector.get(ClientDispatcher),
			dispatcher: this.props.injector.get(Dispatcher),
			clientStateActionCreator: this.props.injector.get(ClientStateActionCreator),
			clientState: Map({})
		};
	}

	getChildContext() {
		return {
			injector: this.props.injector
		};
	}

	componentWillMount() {
		this.state.clientDispatcher.listen();
		this.state.dispatcher.bind(this.state.clientStateActionCreator.createActionName(ClientStateActionName.SEND_DIFF), (action: Action) => {
			var nextClientState = patch(this.state.clientState, fromJS(action.Payload));
			this.setState({ clientState: nextClientState });
		});
	}

	render() {
		return (
			<Router
				routes={routes}
				history={this.state.history}
				componentProps={{ clientState: this.state.clientState }}/>
		);
	}
}
