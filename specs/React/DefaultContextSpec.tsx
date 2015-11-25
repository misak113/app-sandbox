/// <reference path="../../node_modules/di-ts/di-ts.d.ts" />

import DefaultContext from '../../src/React/DefaultContext';
import {Injector} from 'di';
import {Inject, Provide, Injector as InjectorConstructor} from 'di-ts';
import * as React from 'react';
import IReactDOMServer = require('react-dom/server');
import {PropTypes, Component} from 'react';
// TODO react-dom definition is writen bad. Should be static
/* tslint:disable */
var ReactDOMServer: IReactDOMServer = require('react-dom/server');
/* tslint:enable */

describe('React.DefaultContext', () => {
	class Rider {
		constructor(
			public name: string = 'Michael'
		) { }
	}

	it('should set default context to react component', () => {
		const injector = new InjectorConstructor();

		@Inject
		class CarContext {
			constructor(
				public rider: Rider
			) { }
		}

		@DefaultContext(CarContext)
		class Car extends Component<{}, {}> {

			context: CarContext;

			render() {
				return <div>{this.context.rider.name}</div>;
			}
		}

		class App extends Component<{ injector: Injector }, {}> {

			static childContextTypes: React.ValidationMap<any> = {
				injector: PropTypes.object
			};

			getChildContext() {
				return {
					injector: this.props.injector
				};
			}

			render() {
				return <Car/>;
			}
		}

		const app = React.createElement(App, { injector: injector });
		const body = ReactDOMServer.renderToStaticMarkup(app);
		expect(body).toBe('<div>Michael</div>');
	});

	it('should override default context from parent context definition', () => {
		const injector = new InjectorConstructor();

		@Inject
		class BikeContext {
			constructor(
				public rider: Rider
			) { }
		}

		@DefaultContext(BikeContext)
		class Bike extends Component<{}, {}> {

			static contextTypes: React.ValidationMap<any> = {
				rider: PropTypes.object
			};

			context: BikeContext;

			render() {
				return <div>{this.context.rider.name}</div>;
			}
		}

		class Street extends Component<{}, {}> {

			static childContextTypes: React.ValidationMap<any> = {
				rider: PropTypes.object
			};

			getChildContext() {
				return {
					rider: new Rider('Daniel')
				};
			}

			render() {
				return <Bike/>;
			}
		}

		class App extends Component<{ injector: Injector }, {}> {

			static childContextTypes: React.ValidationMap<any> = {
				injector: PropTypes.object
			};

			getChildContext() {
				return {
					injector: this.props.injector
				};
			}

			render() {
				return <Street/>;
			}
		}

		const app = React.createElement(App, { injector: injector });
		const body = ReactDOMServer.renderToStaticMarkup(app);
		expect(body).toBe('<div>Daniel</div>');
	});

	it('should override default context from parent context definition changing type of context value', () => {
		const injector = new InjectorConstructor();

		@Inject
		class CarContext {
			constructor(
				public rider: Rider
			) { }
		}

		@DefaultContext(CarContext)
		class Car extends Component<{}, {}> {

			context: CarContext;
			static contextTypes: React.ValidationMap<any> = {
				rider: PropTypes.string.isRequired
			};

			render() {
				return <div>{this.context.rider}</div>;
			}
		}

		class Rode extends Component<{}, {}> {

			static childContextTypes: React.ValidationMap<any> = {
				rider: PropTypes.string
			};

			getChildContext() {
				return {
					rider: 'Alfred'
				};
			}

			render() {
				return <Car/>;
			}
		}

		class App extends Component<{ injector: Injector }, {}> {

			static childContextTypes: React.ValidationMap<any> = {
				injector: PropTypes.object
			};

			getChildContext() {
				return {
					injector: this.props.injector
				};
			}

			render() {
				return <Rode/>;
			}
		}

		const app = React.createElement(App, { injector: injector });
		const body = ReactDOMServer.renderToStaticMarkup(app);
		expect(body).toBe('<div>Alfred</div>');
	});

	it('should setup default context for nested components also', () => {
		const injector = new InjectorConstructor();

		class Sign {
			constructor(
				public type: string = 'Stop'
			) {}
		}

		@Inject
		class CarContext {
			constructor(
				public rider: Rider
			) { }
		}

		@DefaultContext(CarContext)
		class Car extends Component<{}, {}> {

			context: CarContext;

			render() {
				return <div>{this.context.rider.name}</div>;
			}
		}

		@Inject
		class RodeContext {
			constructor(
				public sign: Sign
			) {}
		}

		@DefaultContext(RodeContext)
		class Rode extends Component<{}, {}> {

			context: RodeContext;

			render() {
				return <div>{this.context.sign.type} - <Car/></div>;
			}
		}

		class App extends Component<{ injector: Injector }, {}> {

			static childContextTypes: React.ValidationMap<any> = {
				injector: PropTypes.object
			};

			getChildContext() {
				return {
					injector: this.props.injector
				};
			}

			render() {
				return <Rode/>;
			}
		}

		const app = React.createElement(App, { injector: injector });
		const body = ReactDOMServer.renderToStaticMarkup(app);
		expect(body).toBe('<div>Stop - <div>Michael</div></div>');
	});

	it('should allow to override injector by any component', () => {
		const injector = new InjectorConstructor();

		@Provide(Rider)
		class RaceRider {
			constructor(
				public name: string = 'Alonzo'
			) { }
		}

		const injectorWithRacers = new InjectorConstructor([
			RaceRider
		]);

		@Inject
		class CarContext {
			constructor(
				public rider: Rider
			) { }
		}

		@DefaultContext(CarContext)
		class Car extends Component<{}, {}> {

			context: CarContext;

			render() {
				return <div>{this.context.rider.name}</div>;
			}
		}

		@Inject
		class RodeContext {
			constructor(
				public allowedRider: Rider
			) { }
		}

		@DefaultContext(RodeContext)
		class Rode extends Component<{}, {}> {

			static childContextTypes: React.ValidationMap<any> = {
				injector: PropTypes.object
			};

			context: RodeContext;

			getChildContext() {
				return {
					injector: injectorWithRacers
				};
			}

			render() {
				return <div>{this.context.allowedRider.name} is not <Car/></div>;
			}
		}

		class App extends Component<{ injector: Injector }, {}> {

			static childContextTypes: React.ValidationMap<any> = {
				injector: PropTypes.object
			};

			getChildContext() {
				return {
					injector: this.props.injector
				};
			}

			render() {
				return <Rode/>;
			}
		}

		const app = React.createElement(App, { injector: injector });
		const body = ReactDOMServer.renderToStaticMarkup(app);
		expect(body).toBe('<div>Michael is not <div>Alonzo</div></div>');
	});
});
