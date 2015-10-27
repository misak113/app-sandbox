
import * as React from 'react';
import Main from '../Layout/Main';
import Homepage from '../Demo/Homepage';
/* tslint:disable */
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;
var Route = require('react-router').Route;
/* tslint:enable */

var routes = (
	<Route path="/" component={Main}>
		<IndexRoute component={Homepage}/>
		<Route path="/users" component={Homepage}/>
	</Route>
);

export default routes;
