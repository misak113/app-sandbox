
import * as React from 'react';
import {Inject} from 'di-ts';
import Component from '../React/Component';
import DefaultContext from '../React/DefaultContext';
import Dispatcher from '../Flux/Dispatcher';
import ActionBinding from '../Flux/ActionBinding';
import StatusStore from './StatusStore';
import StatusActionCreator, {StatusActionName} from './StatusActionCreator';

export default class Status extends Component<{ status: boolean }, {}, {}> {

	render() {
		return <span>{this.props.status ? 'ON' : 'OFF'}</span>;
	}
}
