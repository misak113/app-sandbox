
import * as React from 'react';
import Component from '../React/Component';
import Status from './Status';
import ToggleButton from './ToggleButton';
import IClientState from '../Router/IClientState';

export interface IHomepageProps {
	clientState: IClientState;
}

export default class Homepage extends Component<IHomepageProps, {}, {}> {

	render() {
		return (
			<div>
				<Status status={this.props.clientState.get('status')}/>
				<ToggleButton/>
			</div>
		);
	}
}
