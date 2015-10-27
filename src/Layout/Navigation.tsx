
import * as React from 'react';
import Component from '../React/Component';
import ResponsiveButton from './ResponsiveButton';
import {classNames} from '../React/helper';
/* tslint:disable */
var Link = require('react-router').Link;
/* tslint:enable */

export default class Navigation extends Component<{ activePath: string; }, {}, {}> {

	render() {
		return (
			<nav className="navbar navbar-fixed-top navbar-dark bg-inverse">
				<ResponsiveButton target="#navbar"/>
				<div className="navbar-brand">
					App sandbox
				</div>
				<div id="navbar" className="collapse navbar-toggleable-xs">
					<ul className="nav navbar-nav" role="navigation">
						<li className={classNames("nav-item", this.props.activePath === '/' ? "active" : null)}>
							<Link to="/" className="nav-link">
								Demo
								{this.props.activePath === '/'  ? < span className="sr-only">(current) </span> : null}
							</Link>
						</li>
					</ul>
				</div>
			</nav>
		);
	}
}
