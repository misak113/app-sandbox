
import * as React from 'react';
import Router from './Router/Router';
import ServerDispatcher from './Socket/ServerDispatcher';
import {Injector} from 'di';
import * as serveStatic from 'serve-static';
import * as cookieParser from 'cookie-parser';
import ExpressServer from './Http/ExpressServer';
import HttpServer from './Http/HttpServer';
import ServerOptions from './Http/ServerOptions';
import EntityStorage from './Immutable/EntityStorage';
import { setEntityStorage } from './Immutable/Entity';
import StateStore from './State/StateStore';

export interface IServerProps {
	injector: Injector;
}

export interface IServerState {
}

export default class Server extends React.Component<IServerProps, IServerState> {

	private expressServer: ExpressServer;
	private serverDispatcher: ServerDispatcher;
	private httpServer: HttpServer;
	private serverOptions: ServerOptions;
	private stateStore: StateStore;

	static childContextTypes: React.ValidationMap<any> = {
		injector: React.PropTypes.object
	};

	constructor(props: IServerProps, context: {}) {
		super(props, context);
		setEntityStorage(this.props.injector.get(EntityStorage));
		this.expressServer = this.props.injector.get(ExpressServer);
		this.serverDispatcher = this.props.injector.get(ServerDispatcher);
		this.httpServer = this.props.injector.get(HttpServer);
		this.serverOptions = this.props.injector.get(ServerOptions);
		// Allow send patches of states
		this.stateStore = this.props.injector.get(StateStore);
	}

	getChildContext() {
		return {
			injector: this.props.injector
		};
	}

	componentWillMount() {
		this.serverDispatcher.listen();
		const app = this.expressServer.App;
		app.use(cookieParser());
		app.use(serveStatic(__dirname + '/../../../dist'));
		const port = this.serverOptions.port;
		this.httpServer.Server.listen(port, () => console.info('Listen on port ' + port));
	}

	render() {
		return (
			<Router/>
		);
	}
}
