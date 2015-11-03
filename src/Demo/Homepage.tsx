
import * as React from 'react';
import Component from '../React/Component';
import Status from './Status';
import ToggleButton from './ToggleButton';
import ClientState from './ClientState';

export interface IHomepageProps {
	clientState: ClientState;
}

export default class Homepage extends Component<IHomepageProps, {}, {}> {

	render() {
		return (
			<div>
				<Status status={this.props.clientState.getStatus()}/>
				<ToggleButton/>
			</div>
		);
	}
}
