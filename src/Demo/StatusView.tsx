
import * as React from 'react';

export default class StatusView extends React.Component<{ status: boolean }, {}> {

	render() {
		return <span>{this.props.status ? 'ON' : 'OFF'}</span>;
	}
}
