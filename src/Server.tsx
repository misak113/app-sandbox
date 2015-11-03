
import * as React from 'react';
import {PropTypes, ValidationMap} from 'react';
import Component from './React/Component';
import Router from './Router/Router';
import ServerDispatcher from './Socket/ServerDispatcher';
import {Injector} from 'di';
import * as serveStatic from 'serve-static';
import * as cookieParser from 'cookie-parser';
import ExpressServer from './Http/ExpressServer';
import HttpServer from './Http/HttpServer';
import IEntityStatic from './Immutable/IEntityStatic';
import { setEntityStorage } from './Immutable/Entity';
import EntityStorage from './Immutable/EntityStorage';
import ServerOptions from './Http/ServerOptions';
import stores from './config/stores';

export interface IServerProps<IClientState> {
	injector: Injector;
	ClientState: IEntityStatic<IClientState>;
}

export interface IServerState {
	expressServer: ExpressServer;
	serverDispatcher: ServerDispatcher;
	httpServer: HttpServer;
	serverOptions: ServerOptions;
}

export default class Server<IClientState> extends Component<IServerProps<IClientState>, IServerState, {}> {

	static childContextTypes: ValidationMap<any> = {
		injector: PropTypes.object
	};

	constructor(props: IServerProps<IClientState>, context: {}) {
		super(props, context);
		setEntityStorage(this.props.injector.get(EntityStorage));
		this.state = {
			expressServer: this.props.injector.get(ExpressServer),
			serverDispatcher: this.props.injector.get(ServerDispatcher),
			httpServer: this.props.injector.get(HttpServer),
			serverOptions: this.props.injector.get(ServerOptions)
		};
	}

	getChildContext() {
		return {
			injector: this.props.injector
		};
	}

	componentWillMount() {
		this.state.serverDispatcher.listen();
		stores.forEach((store: any) => this.props.injector.get(store));
		var app = this.state.expressServer.App;
		app.use(cookieParser());
		app.use(serveStatic(__dirname + '/../../../dist'));
		var port = this.state.serverOptions.port;
		this.state.httpServer.Server.listen(port, () => console.info('Listen on port ' + port));
	}

	render() {
		return (
			<Router ClientState={this.props.ClientState as IEntityStatic<any>}/>
		);
	}
}
