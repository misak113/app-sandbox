
import {Component as ReactComponent} from 'react';

export default class Component<P, S, C> extends ReactComponent<P, S> {
	context: C;
}
