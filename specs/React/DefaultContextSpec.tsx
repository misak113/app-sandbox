/// <reference path="../../node_modules/di-ts/di-ts.d.ts" />

import DefaultContext from '../../src/React/DefaultContext';
import {Inject, Injector as InjectorConstructor} from 'di-ts';
import {Injector} from 'di';
import * as React from 'react';
import {PropTypes, Component} from 'react';

describe('React.DefaultContext', () => {

	class Rider {
		public name = 'Michael';
	}

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

	it('should set default context to react component', () => {
		var app = React.createElement(App, { injector: injector });
		var body = React.renderToStaticMarkup(app);
		expect(body).toBe('<div>Michael</div>');
	});
});
