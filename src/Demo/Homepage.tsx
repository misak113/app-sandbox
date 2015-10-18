
import * as React from 'react';
import Component from '../React/Component';
import Status from './Status';
import ToggleButton from './ToggleButton';

export default class Homepage extends Component<{}, {}, {}> {

	render() {
		return (
			<div>
				<Status/>
				<ToggleButton/>
			</div>
		);
	}
}
