
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
import ServerOptions from './Http/ServerOptions';
import stores from './config/stores';

export interface IServerProps {
	injector: Injector;
}

export interface IServerState {
	expressServer: ExpressServer;
	serverDispatcher: ServerDispatcher;
	httpServer: HttpServer;
	serverOptions: ServerOptions;
}

export default class Server extends Component<IServerProps, IServerState, {}> {

	static childContextTypes: ValidationMap<any> = {
		injector: PropTypes.object
	};

	constructor(props: IServerProps, context: {}) {
		super(props, context);
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
			<Router/>
		);
	}
}
