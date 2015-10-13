
import * as React from 'react';
import {Inject} from 'di-ts';
import Component from '../React/Component';
import DefaultContext from '../React/DefaultContext';
import DateFactory from '../DateTime/DateFactory';

@Inject
export class HomepageContext {
	constructor(
		public dateFactory: DateFactory
	) { }
}

@DefaultContext(HomepageContext)
export default class Homepage extends Component<{}, { nowHumanized?: string }, HomepageContext> {

	private nowInterval: NodeJS.Timer;

	constructor(props, context) {
		super(props, context);
		this.state = {};
	}

	componentDidMount() {
		this.nowInterval = setInterval(() => this.setState({
			nowHumanized: this.context.dateFactory.now().toString()
		}), 1000);
	}

	componentWillUnmount() {
		clearInterval(this.nowInterval);
	}

	render() {
		return <div>{this.state.nowHumanized}</div>;
	}
}
