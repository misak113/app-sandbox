
import * as React from 'react';
import Component from '../React/Component';
import DefaultContext from '../React/DefaultContext';
import {Request, Response} from 'express';
import {Inject} from 'di-ts';
import {Injector} from 'di';
import RoutingContext from './RoutingContext';
import ExpressServer from '../Http/ExpressServer';
import routes from '../config/routes';
var match = require('react-router').match;
var renderToString = require('react-dom/server').renderToString;

@Inject
export class RouterContext {
	constructor(
		public injector: Injector,
		public expressServer: ExpressServer
	) {}
}

@DefaultContext(RouterContext)
export default class Router extends Component<{ doctype?: string }, { doctype?: string }, RouterContext> {

	constructor(props, context) {
		super(props, context);
		this.state = {
			doctype: props.doctype || '<!doctype html>'
		};
	}

	private handler(request: Request, response: Response, next: () => void) {
		var startTime = process.hrtime();
		match({
			routes,
			location: request.url
		}, (error: Error, redirectLocation, renderProps) => {
			if (error) {
				response.status(500)
					.send(error.message);
			} else if (redirectLocation) {
				response.status(302)
					.redirect(redirectLocation.pathname + redirectLocation.search);
			} else if (renderProps) {
				var totalTime = process.hrtime(startTime);
				var body = renderToString(<RoutingContext {...renderProps} injector={this.context.injector} />);
				var header = {
					"Content-Length": body.length,
					"Content-Type": "text/html",
					"X-Render-Time": Math.round(totalTime[0] * 1E3 + totalTime[1] / 1E6 * 1E2) / 1E2 + " ms"
				};
				response.status(200)
					.header(header).send(this.state.doctype + body);
			} else {
				response.status(404).send('Not found');
			}
		});
	}

	render() {
		this.context.expressServer.App.use(
			(request: Request, response: Response, next: () => void) => this.handler(request, response, next)
		);
		return null;
	}
}
