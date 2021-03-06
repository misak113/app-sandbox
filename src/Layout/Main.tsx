
import * as React from 'react';
import Navigation from './Navigation';

export default class Main extends React.Component<{ children: any[]; location: any; }, {}> {

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
				<body className="main">
					<Navigation activePath={this.props.location.pathname}/>
					{this.props.children}
					<script src='/front-bundle.js'></script>
				</body>
			</html>
		);
	}
}
