
import * as React from 'react';
import {PropTypes, ValidationMap} from 'react';
import Component from './React/Component';
import Router from './Router/Router';
import {Injector} from 'di';
import * as serveStatic from 'serve-static';
import ExpressServer from './Http/ExpressServer';

export interface IServerProps {
	injector: Injector;
}

export interface IServerState {
	expressServer: ExpressServer;
}

export interface IServerChildContext {
	injector: Injector;
}

export default class Server extends Component<IServerProps, IServerState, {}> {

	static childContextTypes: ValidationMap<any> = {
		injector: PropTypes.object
	};

	constructor(props: IServerProps, context: {}) {
		super(props, context);
		this.state = {
			expressServer: this.props.injector.get(ExpressServer)
		};
	}

	getChildContext(): IServerChildContext {
		return {
			injector: this.props.injector
		};
	}

	render() {
		var app = this.state.expressServer.App;
		app.use(serveStatic(__dirname + '/../../../dist'));
		var port = process.env.PORT || 80;
		app.listen(port, () => console.info('Listen on port ' + port));
		return (
			<Router/>
		);
	}
}
