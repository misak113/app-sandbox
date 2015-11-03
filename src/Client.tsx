
// TODO temporary load of jQuery into global context for bootstrap
import * as jQuery from 'jquery';
(window as any).jQuery = jQuery;
import 'bootstrap';
import * as React from 'react';
import {PropTypes, ValidationMap} from 'react';
import Component from './React/Component';
import ClientDispatcher from './Socket/ClientDispatcher';
import Dispatcher from './Flux/Dispatcher';
import Action from './Flux/Action';
import ClientStateActionCreator, {ClientStateActionName} from './ClientState/ClientStateActionCreator';
import Convertor from './Immutable/Convertor';
import IEntityStatic from './Immutable/IEntityStatic';
import { setEntityStorage } from './Immutable/Entity';
import EntityStorage from './Immutable/EntityStorage';
import {Injector} from 'di';
import {fromJS} from 'immutable';
import {parse as parseCookies} from 'cookie';
import routes from './config/routes';
/* tslint:disable */
var Router = require('react-router').Router;
var history = require('history');
/* tslint:enable */

declare namespace window {
	export var clientState: any;
}

export interface IClientProps<IAppClientState> {
	injector: Injector;
	ClientState: IEntityStatic<IAppClientState>;
}

export interface IClientState<IAppClientState> {
	history?: any;
	clientDispatcher?: ClientDispatcher;
	dispatcher?: Dispatcher;
	convertor?: Convertor;
	clientStateActionCreator?: ClientStateActionCreator;
	clientState?: IAppClientState;
	clientId?: string;
}

export default class Client<IAppClientState> extends Component<IClientProps<IAppClientState>, IClientState<IAppClientState>, {}> {

	static childContextTypes: ValidationMap<any> = {
		injector: PropTypes.object
	};

	constructor(props: IClientProps<IAppClientState>, context: {}) {
		super(props, context);
		setEntityStorage(this.props.injector.get(EntityStorage));
		var cookies = parseCookies(document.cookie) as any as { clientId: string; };
		var convertor = this.props.injector.get(Convertor);
		this.state = {
			history: history.createHistory({}),
			clientDispatcher: this.props.injector.get(ClientDispatcher),
			dispatcher: this.props.injector.get(Dispatcher),
			convertor: convertor,
			clientStateActionCreator: this.props.injector.get(ClientStateActionCreator),
			// from global context added in Router.tsx
			clientState: convertor.convertFromJS<IAppClientState>(this.props.ClientState, window.clientState),
			clientId: cookies.clientId
		};
	}

	getChildContext() {
		return {
			injector: this.props.injector
		};
	}

	componentWillMount() {
		this.state.clientDispatcher.listen(this.state.clientId);
		this.state.dispatcher.bind(this.state.clientStateActionCreator.createActionName(ClientStateActionName.SEND_DIFF), (action: Action) => {
			var nextClientState = this.state.convertor.patch(this.props.ClientState, this.state.clientState, fromJS(action.Payload));
			this.setState({ clientState: nextClientState });
		});
	}

	render() {
		return (
			<Router
				routes={routes}
				history={this.state.history}
				componentProps={{ clientState: this.state.clientState, clientId: this.state.clientId }}/>
		);
	}
}
