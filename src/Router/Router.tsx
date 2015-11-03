
import * as React from 'react';
import Component from '../React/Component';
import DefaultContext from '../React/DefaultContext';
import {Request, Response} from 'express';
import {Inject} from 'di-ts';
import {Injector} from 'di';
import RoutingContext from './RoutingContext';
import ExpressServer from '../Http/ExpressServer';
import ClientStateStore from '../ClientState/ClientStateStore';
import ClientStateActionCreator, {ClientStateActionName} from '../ClientState/ClientStateActionCreator';
import Dispatcher from '../Flux/Dispatcher';
import Convertor from '../Immutable/Convertor';
import IEntityStatic from '../Immutable/IEntityStatic';
import Action from '../Flux/Action';
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
		public dispatcher: Dispatcher,
		public clientStateStore: ClientStateStore,
		public convertor: Convertor
	) {}
}

export interface IRouterProps<IClientState> {
	doctype?: string;
	ClientState: IEntityStatic<IClientState>;
}

@DefaultContext(RouterContext)
export default class Router<IClientState> extends Component<IRouterProps<IClientState>, { doctype?: string }, RouterContext> {

	constructor(props: IRouterProps<IClientState>, context: RouterContext) {
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
			error, redirectLocation, renderProps, request, response, startTime, next
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
			var totalTime = process.hrtime(startTime);
			var injector = new Injector(services);
			var clientId = request.cookies.clientId || this.generateClientId();
			this.context.dispatcher.dispatch(this.context.clientStateActionCreator.createIfNotExists(
				this.props.ClientState,
				clientId
			));
			var createdIfNotExistsBinding = this.context.dispatcher.bind(
				this.context.clientStateActionCreator.createActionName(ClientStateActionName.CREATED_IF_NOT_EXISTS),
				(action: Action) => {
					if (action.Payload.clientId !== clientId) {
						return;
					}
					this.context.dispatcher.unbind(createdIfNotExistsBinding);
					var clientState = this.context.clientStateStore.getById<IClientState>(clientId);
					var body = renderToString(
						<RoutingContext
							{...renderProps}
							injector={injector}
							componentProps={{ clientState: clientState, clientId: clientId }}/>);
					var initialScript = this.getInitialScript(clientState);
					response.status(200)
						.cookie('clientId', clientId)
						.header(this.getHeader(body, totalTime, clientId))
						.send(this.state.doctype + initialScript + body);
				}
			);
		} else {
			next();
		}
	}

	private generateClientId() {
		return '' + Math.random();
	}

	private getInitialScript(clientState: IClientState) {
		var clientStateJson = JSON.stringify(this.context.convertor.convertToJS(this.props.ClientState, clientState));
		return `<script>
			var clientState = ` + clientStateJson + `;
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
	params: any;
	components: Component<any, any, any>[];
}
