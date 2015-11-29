
/* tslint:disable */
import * as React from 'react';
/* tslint:enable */
import Main from '../Layout/Main';
import Homepage from '../Demo/Homepage';
import UsersPage from '../Demo/User/UsersPage';
/* tslint:disable */
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;
var Route = require('react-router').Route;
/* tslint:enable */

const routes = (
	<Route path="/" component={Main}>
		<IndexRoute component={Homepage}/>
		<Route path="/users" component={UsersPage}/>
	</Route>
);

export default routes;
