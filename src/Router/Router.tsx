
import * as React from 'react';
import Component from '../React/Component';
import DefaultContext from '../React/DefaultContext';
import {Request, Response} from 'express';
import {Inject} from 'di-ts';
import {Injector} from 'di';
import RoutingContext from './RoutingContext';
import ExpressServer from '../Http/ExpressServer';
import IClientState from '../ClientState/IClientState';
import ClientStateActionCreator from '../ClientState/ClientStateActionCreator';
import Dispatcher from '../Flux/Dispatcher';
import routes from '../config/routes';
import services from '../config/services';
/* tslint:disable */
var match = require('react-router').match;
var renderToString = require('react-dom/server').renderToString;
/* tslint:enable */

@Inject
export class RouterContext {
	constructor(
		public expressServer: ExpressServer,
		public clientStateActionCreator: ClientStateActionCreator,
		public dispatcher: Dispatcher
	) {}
}

@DefaultContext(RouterContext)
export default class Router extends Component<{ doctype?: string }, { doctype?: string }, RouterContext> {

	constructor(props: { doctype?: string }, context: RouterContext) {
		super(props, context);
		this.state = {
			doctype: props.doctype || '<!doctype html>'
		};
	}

	private middleware() {
		return (request: Request, response: Response, next: () => void) => this.handle(request, response, next);
	}

	private handle(request: Request, response: Response, next: () => void) {
		var startTime = process.hrtime();
		var options = {
			routes: routes,
			location: request.url
		};
		match(options, (error: Error, redirectLocation: IRedirectLocation, renderProps: IRenderProps) => this.match(
			error, redirectLocation, renderProps, response, startTime, next
		));
	}

	private match(
		error: Error,
		redirectLocation: IRedirectLocation,
		renderProps: IRenderProps,
		response: Response,
		startTime: number[],
		next: () => void
	) {
		if (error) {
			response.status(500)
				.send(error.message);
		} else if (redirectLocation) {
			response.status(302)
				.redirect(redirectLocation.pathname + redirectLocation.search);
		} else if (renderProps) {
			var totalTime = process.hrtime(startTime);
			var injector = new Injector(services);
			this.context.dispatcher.dispatch(this.context.clientStateActionCreator.create((clientState: IClientState, clientId: string) => {
				var body = renderToString(
					<RoutingContext
						{...renderProps}
						injector={injector}
						componentProps={{ clientState: clientState, clientId: clientId }}/>);
				response.status(200)
					.header(this.getHeader(body, totalTime))
					.send(this.state.doctype + body);
			}));
		} else {
			next();
		}
	}

	private getHeader(body: string, totalTime: number[]) {
		return {
			'Content-Length': body.length,
			'Content-Type': 'text/html',
			'X-Render-Time': this.getMiliseconds(totalTime) + ' ms'
		};
	}

	private getMiliseconds(time: number[]) {
		return Math.round(time[0] * 1E3 + time[1] / 1E6 * 1E2) / 1E2;
	}

	componentWillMount() {
		this.context.expressServer.App.use(this.middleware());
	}

	render() {
		return null;
	}
}

// TODO move to react-router.d.ts
interface IRedirectLocation {
	pathname: string;
	search: string;
}

interface IRenderProps {
	history: any;
	createElement<P>(component: Component<any, any, any>, props: P): React.ReactElement<P>;
	location: Location;
	routes: any[];
	params: any;
	components: Component<any, any, any>[];
}
