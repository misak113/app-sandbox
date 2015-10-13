
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
		this.state = {
			nowHumanized: this.getHumanizedTime()
		};
	}

	componentDidMount() {
		this.nowInterval = setInterval(() => this.setState({
			nowHumanized: this.getHumanizedTime()
		}), 1000);
	}

	componentWillUnmount() {
		clearInterval(this.nowInterval);
	}

	private getHumanizedTime() {
		return this.context.dateFactory.now().toString();
	}

	render() {
		return <div>{this.state.nowHumanized}</div>;
	}
}
