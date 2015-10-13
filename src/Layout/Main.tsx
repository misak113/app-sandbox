
import * as React from 'react';
import Component from '../React/Component';

export default class Main extends Component<{ children: any[] }, {}, {}> {

	render() {
		return (
			<html>
				<head></head>
				<body>{this.props.children}</body>
			</html>
		);
	}
}