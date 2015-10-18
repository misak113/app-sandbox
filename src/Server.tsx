
import * as React from 'react';
import {PropTypes, ValidationMap} from 'react';
import Component from './React/Component';
import Router from './Router/Router';
import ServerDispatcher from './Socket/ServerDispatcher';
import {Injector} from 'di';
import * as serveStatic from 'serve-static';
import ExpressServer from './Http/ExpressServer';
import HttpServer from './Http/HttpServer';
import ServerOptions from './Http/ServerOptions';

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
		var app = this.state.expressServer.App;
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
