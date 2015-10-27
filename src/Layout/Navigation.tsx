
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
			<nav className="navbar navbar-fixed-top navbar-inverse">
				<div className="navbar-header">
					<ResponsiveButton target="#navbar"/>
					<div className="navbar-brand">
						App sandbox
					</div>
				</div>
				<div id="navbar" className="navbar-collapse collapse">
					<ul className="nav navbar-nav" role="navigation">
						<li className={classNames(this.props.activePath === '/' ? "active" : null)}>
							<Link to="/">Demo</Link>
						</li>
					</ul>
				</div>
			</nav>
		);
	}
}
