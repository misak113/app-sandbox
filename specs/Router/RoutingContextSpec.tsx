
import * as React from 'react';
import {Injector} from 'di';
import RoutingContext from '../../src/Router/RoutingContext';
import IReactDOMServer = require('react-dom/server');
// TODO react-dom definition is writen bad. Should be static
/* tslint:disable */
var History = require('history');
var ReactDOMServer: IReactDOMServer = require('react-dom/server');
var Route = require('react-router').Route;
/* tslint:enable */

describe('Router.RoutingContext', () => {

	class Main extends React.Component<{
		routingContextElement: React.ReactElement<any>;
		history: any;
		location: any;
	}, {}> {

		static childContextTypes: React.ValidationMap<string> = {
			history: React.PropTypes.object,
			location: React.PropTypes.object
		};

		getChildContext() {
			return {
				history: this.props.history,
				location: this.props.location
			};
		}

		render() {
			return this.props.routingContextElement;
		}
	}

	class Homepage extends React.Component<{}, {}> {

		render() {
			return <div></div>;
		}
	}

	it('should create react-router RoutingContext standard way needs to have injector in props', () => {
		var injector = new Injector();
		var history = History.createMemoryHistory();
		var location = history.createLocation();
		var routes = [
			<Route path='*' component={Homepage}></Route>
		];
		var params = {};
		var components = [];
		var routingContext = (
			<RoutingContext
				injector={injector}
				history={history}
				location={location}
				routes={routes}
				params={params}
				components={components}/>
		);
		var html = ReactDOMServer.renderToStaticMarkup(
			<Main routingContextElement={routingContext} history={history} location={location}/>
		);
		expect(html).toBe('<noscript></noscript>');
	});
});
