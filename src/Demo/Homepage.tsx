
import * as React from 'react';
import StatusView from './StatusView';
import ToggleButton from './ToggleButton';
import HomepageState from './HomepageState';
import DefaultProps from '../React/DefaultProps';

export interface IHomepageProps {
	homepage: HomepageState;
}

@DefaultProps({
	homepage: HomepageState
})
export default class Homepage extends React.Component<IHomepageProps, {}> {

	render() {
		return (
			<div>
				<StatusView status={this.props.homepage.getStatus() }/>
				<ToggleButton/>
			</div>
		);
	}
}
