
var getParameterName = (Constructor: any, index: number) => {
	var fn = Constructor.toString();
	var paramsStartAt = fn.indexOf('(');
	var paramsEndAt = fn.indexOf(')');
	var paramsString = fn.substring(paramsStartAt, paramsEndAt);
	var params = paramsString.split(', ');
	return params[index];
};

function embedded(target: Object, propertyName: string, paramIndex?: number) {
	'use strict';
	var EmbeddedClass;
	var EntityClass;
	if (typeof paramIndex !== 'undefined') {
		propertyName = getParameterName(target, paramIndex);
		var metadataKeys = Reflect.getMetadata('design:paramtypes', target);
		EmbeddedClass = metadataKeys[paramIndex];
		EntityClass = target;
	} else {
		var metadataKeys = Reflect.getMetadata('design:type', target, propertyName);
		EmbeddedClass = metadataKeys;
		EntityClass = target.constructor;
	}
	Reflect.defineMetadata(embedded, EmbeddedClass, EntityClass, propertyName);
}
export default embedded as ParameterDecorator & PropertyDecorator;
