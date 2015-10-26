
import * as React from 'react';
import Component from '../React/Component';

export default class Main extends Component<{ children: any[] }, {}, {}> {

	render() {
		return (
			<html lang='en'>
				<head>
					<meta charSet='utf-8'/>
					<meta name='viewport' content='width=device-width, initial-scale=1'/>
					<meta httpEquiv='x-ua-compatible' content='ie=edge'/>
					<title>App sandbox</title>
					<link rel='stylesheet' media='all' href='/css/index.css'></link>
				</head>
				<body>
					{this.props.children}
					<script src='/front-bundle.js'></script>
				</body>
			</html>
		);
	}
}
