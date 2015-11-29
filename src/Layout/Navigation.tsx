
import * as React from 'react';
import TogglerButton from './TogglerButton';
import {classNames} from '../React/helper';
import {List, Map} from 'immutable';
/* tslint:disable */
var Link = require('react-router').Link;
/* tslint:enable */

export default class Navigation extends React.Component<{ activePath: string; }, { items?: List<Map<string, string>> }> {

	componentWillMount() {
		this.setState({
			items: List([
				Map({ label: 'Demo', to: '/' }),
				Map({ label: 'Users', to: '/users' }),
			])
		});
	}

	render() {
		return (
			<nav className="navbar navbar-fixed-top navbar-dark bg-inverse bd-navbar">
				<TogglerButton target="#navbar"/>
				<div className="navbar-brand">
					App sandbox
				</div>
				<div className="clearfix hidden-sm-up"/>
				<div id="navbar" className="collapse navbar-toggleable-xs">
					<ul className="nav navbar-nav" role="navigation">
						{this.state.items.map((item: Map<string, string>) => (
							<li className={classNames("nav-item", this.props.activePath === item.get('to') ? "active" : null)}
								key={item.get('to')}>
								<Link to={item.get('to')} className="nav-link">
									{item.get('label')}
									{this.props.activePath === item.get('to') ? < span className="sr-only">(current)</span> : null}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</nav>
		);
	}
}
