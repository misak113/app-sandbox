
import * as React from 'react';
import Main from '../Layout/Main';
import Homepage from '../Page/Homepage';
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;

var routes = (
	<Route path="/" component={Main}>
		<IndexRoute component={Homepage}/>
	</Route>
);

export default routes;
