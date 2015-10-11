/// <reference path="../../node_modules/di-ts/di-ts.d.ts" />

import DefaultContext from '../../src/React/DefaultContext';
import {Inject, Injector as InjectorConstructor} from 'di-ts';
import {Injector} from 'di';
import * as React from 'react';
import {PropTypes, Component} from 'react';

describe('React.DefaultContext', () => {
	class Rider {
		constructor(
			public name = 'Michael'
		) { }
	}

	it('should set default context to react component', () => {
		var injector = new InjectorConstructor();

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

		var app = React.createElement(App, { injector: injector });
		var body = React.renderToStaticMarkup(app);
		expect(body).toBe('<div>Michael</div>');
	});

	it('should override default context from parent context definition', () => {
		var injector = new InjectorConstructor();

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

		var app = React.createElement(App, { injector: injector });
		var body = React.renderToStaticMarkup(app);
		expect(body).toBe('<div>Daniel</div>');
	});

	it('should override default context from parent context definition changing type of context value', () => {
		var injector = new InjectorConstructor();

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

		var app = React.createElement(App, { injector: injector });
		var body = React.renderToStaticMarkup(app);
		expect(body).toBe('<div>Alfred</div>');
	});

	it('should setup default context for nested components also', () => {
		var injector = new InjectorConstructor();

		class Sign {
			constructor(
				public type = 'Stop'
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

		var app = React.createElement(App, { injector: injector });
		var body = React.renderToStaticMarkup(app);
		expect(body).toBe('<div>Stop - <div>Michael</div></div>');
	});
});
