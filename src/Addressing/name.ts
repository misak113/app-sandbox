/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>

import 'reflect-metadata';

function nameAnnotation(targetName: string) {
	'use strict';
	if (targetName.indexOf(':') !== -1) {
		throw new Error('Name "' + targetName + '" cannot contains ":" character'); // TODO
	}
	return function(target: Object) {
		Reflect.defineMetadata(nameAnnotation, targetName, target);
		if (typeof Reflect.getMetadata(targetName, nameAnnotation) !== 'undefined') {
			throw new Error('Name "' + targetName + '" is already used for another addressing object'); // TODO
		}
		Reflect.defineMetadata(targetName, target, nameAnnotation);
	};
}
export default nameAnnotation;
