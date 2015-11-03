
import * as React from 'react';
import Component from '../../React/Component';
import ClientState from '../ClientState';
import User from './User';
/* tslint:disable */
var Link = require('react-router').Link;
/* tslint:enable */

export interface IUsersPageProps {
	clientState: ClientState;
}

export default class UsersPage extends Component<IUsersPageProps, {}, {}> {

	render() {
		var userList = this.props.clientState.getUserList();
		if (!userList) {
			return <div>Loading...</div>;
		}
		return (
			<section className="demo-usersPage">
				<ul>
					{userList.map((user: User) => (
						<li>
							<Link to={"/users/" + user.getId()}>{user.getFullName()}</Link>
						</li>
					))}
				</ul>
			</section>
		);
	}
}
