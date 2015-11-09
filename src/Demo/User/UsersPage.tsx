
import * as React from 'react';
import User from './User';
/* tslint:disable */
var Link = require('react-router').Link;
/* tslint:enable */

export interface IUsersPageProps {}

export default class UsersPage extends React.Component<IUsersPageProps, {}> {

	render() {
		var userList = null;
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
