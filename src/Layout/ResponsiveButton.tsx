
import * as React from 'react';
import Component from '../React/Component';

export default class ResponsiveButton extends Component<{ target: string; }, {}, {}> {

	render() {
		return (
			<button type="button"
				className="navbar-toggle collapsed"
				data-toggle="collapse"
				data-target={this.props.target}
				aria-expanded="false">
				<span className="sr-only">Toggle navigation</span>
				<span className="icon-bar"></span>
				<span className="icon-bar"></span>
				<span className="icon-bar"></span>
			</button>
		);
	}
}
