/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>

import 'reflect-metadata';

export default function action(targetName: string) {
	'use strict';
	return function(target: Object) {
		Reflect.defineMetadata(action, targetName, target);
		if (typeof Reflect.getMetadata(targetName, action) !== 'undefined') {
			throw new Error('Name "' + targetName + '" is already used for another action object'); // TODO
		}
		Reflect.defineMetadata(targetName, target, action);
	};
}
