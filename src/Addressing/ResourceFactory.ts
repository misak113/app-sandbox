/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>

import 'reflect-metadata';
import ResourceTarget from './ResourceTarget';
import IClassStatic from './IClassStatic';
import resource from './resource';

export default class ResourceFactory {

	get(State: IClassStatic<any>, params: { [name: string]: string }) {
		const stateResourceName = Reflect.getMetadata(resource, State);
		if (typeof stateResourceName === 'undefined') {
			throw new Error('State ' + State + ' is not annotated by resource annotation'); // TODO
		}
		return new ResourceTarget(stateResourceName + ':' + JSON.stringify(params));
	}

	reverse(resourceTarget: ResourceTarget) {
		const identifier = resourceTarget.getIdentifier();
		const stateResourceName = identifier.split(':')[0];
		const State = Reflect.getMetadata(stateResourceName, resource);
		if (typeof State === 'undefined') {
			throw new Error('ResourceTarget with identifier ' + identifier + ' is not annotated by resource annotation'); // TODO
		}
		const paramsString = identifier.substring(stateResourceName.length + 1, identifier.length);
		const params = JSON.parse(paramsString);
		return { State, params };
	}
}
