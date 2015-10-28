
import * as React from 'react';
import Component from '../../React/Component';
import IClientState from '../../ClientState/IClientState';
import User from './User';
/* tslint:disable */
var Link = require('react-router').Link;
/* tslint:enable */

export interface IUsersPageProps {
	clientState: IClientState;
}

export default class UsersPage extends Component<IUsersPageProps, {}, {}> {

	render() {
		var userList = this.props.clientState.get('userList');
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
