
import * as React from 'react';
import {Injector} from 'di';
import Router from '../../src/Router/Router';
import IReactDOMServer = require('react-dom/server');
// TODO react-dom definition is writen bad. Should be static
/* tslint:disable */
var ReactDOMServer: IReactDOMServer = require('react-dom/server');
/* tslint:enable */

describe('Router.Router', () => {
	xit('should render page server-side', () => {
		const html = ReactDOMServer.renderToStaticMarkup(
			React.createElement(Router, { injector: new Injector() })
		);
		expect(html).toBeNull();
	});
});
