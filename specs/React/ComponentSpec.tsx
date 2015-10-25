
import * as React from 'react';
import Component from '../../src/React/Component';
import IReactDOMServer = require('react-dom/server');
// TODO react-dom definition is writen bad. Should be static
/* tslint:disable */
var ReactDOMServer: IReactDOMServer = require('react-dom/server');
/* tslint:enable */

describe('React.Component', () => {

	it('should contains typed context', () => {

		interface IMyContext {
			dog: string;
		}

		class MyComponent extends Component<{}, {}, IMyContext> {

			static contextTypes: React.ValidationMap<string> = {
				dog: React.PropTypes.string.isRequired
			};

			render() {
				var context: IMyContext = this.context;
				return <div>{context.dog}</div>;
			}
		}

		class MyParentComponent extends React.Component<{}, {}> {

			static childContextTypes: React.ValidationMap<string> = {
				dog: React.PropTypes.string
			};

			getChildContext() {
				return {
					dog: 'Peggy'
				};
			}

			render() {
				return <MyComponent/>;
			}
		}

		var html = ReactDOMServer.renderToStaticMarkup(
			React.createElement(MyParentComponent)
		);
		expect(html).toBe('<div>Peggy</div>');
	});
});
