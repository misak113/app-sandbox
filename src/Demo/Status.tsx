
import * as React from 'react';
import Component from '../React/Component';

export default class Status extends Component<{ status: boolean }, {}, {}> {

	render() {
		return <span>{this.props.status ? 'ON' : 'OFF'}</span>;
	}
}
