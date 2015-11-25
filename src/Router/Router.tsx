/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>

import 'reflect-metadata';
import * as React from 'react';
import Component from '../React/Component';
import DefaultContext from '../React/DefaultContext';
import DefaultProps from '../React/DefaultProps';
import {Request, Response} from 'express';
import {Inject} from 'di-ts';
import {Injector} from 'di';
import ExpressServer from '../Http/ExpressServer';
import routes from '../config/routes';
import services from '../config/services';
import stores from '../config/stores';
import EntityStorage from '../Immutable/EntityStorage';
import Convertor from '../Immutable/Convertor';
import Store from '../Flux/Store';
import { setEntityStorage } from '../Immutable/Entity';
/* tslint:disable */
var match = require('react-router').match;
var renderToString = require('react-dom/server').renderToString;
var RoutingContext = require('react-router').RoutingContext;
/* tslint:enable */

@Inject
export class RouterContext {
	constructor(
		public expressServer: ExpressServer,
		public convertor: Convertor,
		public injector: Injector
	) {}
}

@DefaultContext(RouterContext)
export default class Router extends Component<{}, {}, RouterContext> {

	private doctype = '<!doctype html>';

	private middleware() {
		return (request: Request, response: Response, next: () => void) => this.handle(request, response, next);
	}

	private handle(request: Request, response: Response, next: () => void) {
		const startTime = process.hrtime();
		const options = {
			routes: routes,
			location: request.url
		};
		match(options, (error: Error, redirectLocation: IRedirectLocation, renderProps: IRenderProps) => this.match(
			error,
			redirectLocation,
			renderProps,
			request,
			response,
			startTime,
			next
		));
	}

	private match(
		error: Error,
		redirectLocation: IRedirectLocation,
		renderProps: IRenderProps,
		request: Request,
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
			const totalTime = process.hrtime(startTime);
			const clientId = this.getClientId(request);
			const Component = renderProps.components[renderProps.components.length - 1]; // TODO
			let initialState: { [stateName: string]: any } = {};
			const StatesStatic = Reflect.getMetadata(DefaultProps, Component);
			Object.keys(StatesStatic).map((stateName: string) => {
				const StateStatic = StatesStatic[stateName];
				const store = this.context.injector.get<Store<any>>(stores.get(StateStatic));
				const params = renderProps.params;
				const state = store.getState(params);
				const State = store.getStateClass();
				initialState[stateName] = this.context.convertor.convertToJS(State, state);
			});

			class Client extends React.Component<{}, {}> {

				private injector: Injector;

				static childContextTypes: React.ValidationMap<any> = {
					injector: React.PropTypes.object.isRequired,
					initialState: React.PropTypes.object,
					clientId: React.PropTypes.string.isRequired
				};

				constructor(props: {}, context: {}) {
					super(props, context);
					this.injector = new Injector(services);
					setEntityStorage(this.injector.get(EntityStorage));
				}

				getChildContext() {
					return { injector: this.injector, initialState, clientId };
				}

				render() {
					return (
						<RoutingContext {...renderProps}/>
					);
				}
			}

			const body = renderToString(<Client/>);
			const initialScript = this.getInitialScript(initialState, clientId);
			response.status(200)
				.cookie('clientId', clientId)
				.header(this.getHeader(body, totalTime, clientId))
				.send(this.doctype + initialScript + body);
		} else {
			next();
		}
	}

	private getClientId(request: Request) {
		return request.cookies.clientId || '' + Math.random();
	}

	private getInitialScript(initialState: any, clientId: string) {
		return `<script>
			window.clientId = ` + JSON.stringify(clientId) + `;
			window.initialState = ` + JSON.stringify(initialState) + `;
		</script>`;
	}

	private getHeader(body: string, totalTime: number[], clientId: string) {
		return {
			'Content-Length': body.length,
			'Content-Type': 'text/html',
			'X-Render-Time': this.getMiliseconds(totalTime) + ' ms',
			'X-Client-Id': clientId
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
	route: any;
	params: any;
	components: Component<any, any, any>[];
}
