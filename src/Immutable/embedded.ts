/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>

import 'reflect-metadata';

const getParameterName = (Constructor: any, index: number) => {
	const fn = Constructor.toString();
	const paramsStartAt = fn.indexOf('(');
	const paramsEndAt = fn.indexOf(')');
	const paramsString = fn.substring(paramsStartAt, paramsEndAt);
	const params = paramsString.split(', ');
	return params[index];
};

function embedded(target: Object, propertyName: string, paramIndex?: number) {
	'use strict';
	let EmbeddedClass;
	let EntityClass;
	if (typeof paramIndex !== 'undefined') {
		propertyName = getParameterName(target, paramIndex);
		const metadataKeys = Reflect.getMetadata('design:paramtypes', target);
		EmbeddedClass = metadataKeys[paramIndex];
		EntityClass = target;
	} else {
		const metadataKeys = Reflect.getMetadata('design:type', target, propertyName);
		EmbeddedClass = metadataKeys;
		EntityClass = target.constructor;
	}
	Reflect.defineMetadata(embedded, EmbeddedClass, EntityClass, propertyName);
}
export default embedded as ParameterDecorator & PropertyDecorator;
