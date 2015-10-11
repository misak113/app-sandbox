
import * as React from 'react';
import {PropTypes} from 'react';
import Component from './React/Component';
import {Injector} from 'di';
import Main from './Layout/Main';
import injector from './config/injector';

export interface IClientProps {
	injector: Injector;
}

export interface IClientChildContext {
	injector: Injector;
}

export default class Client extends Component<IClientProps, {}, {}> {

	static childContextTypes = {
		injector: PropTypes.object
	};

	public getChildContext(): IClientChildContext {
		return {
			injector: this.props.injector
		};
	}
	
	render() {
		return <Main/>;
	}
}
