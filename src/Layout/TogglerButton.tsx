
import * as React from 'react';

export default class TogglerButton extends React.Component<{ target: string; }, {}> {

	render() {
		return (
			<button type="button"
				className="navbar-toggler hidden-sm-up pull-right"
				data-toggle="collapse"
				data-target={this.props.target}
				aria-expanded="false">
				{/*&#9776;*/}
				☰
			</button>
		);
	}
}
