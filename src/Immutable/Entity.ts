
import IEntityStatic from './IEntityStatic';
import { WrongReturnWhileSetProperties } from './exceptions';
import { Map } from 'immutable';

/* tslint:disable */
function Entity<IEntity>(OriginalEntityClass: IEntityStatic<IEntity>) {
	/* tslint:enable */
	'use strict';
	var createProxyEntity = (entity: EntityClass) => {
		type Properties = { [propertyKey: string]: any };
		var entityProxy: Properties = {};
		var overridenProperties: Properties = {};
		entity.data.forEach((value: any, propertyKey: string) => {
			Object.defineProperty(entityProxy, propertyKey, {
				get: () => {
					return Object.keys(overridenProperties).indexOf(propertyKey) !== -1
						? overridenProperties[propertyKey]
						: entity.data.get(propertyKey);
				},
				set: (value: any) => {
					overridenProperties[propertyKey] = value;
					Object.defineProperty(entityProxy, propertyKey, {
						enumerable: true
					});
				},
				enumerable: false,
				configurable: true
			});
		});
		return entityProxy;
	};
	var methodNames = Object.getOwnPropertyNames(OriginalEntityClass.prototype);
	methodNames.forEach((methodName: string) => {
		var originalMethod = OriginalEntityClass.prototype[methodName];
		Object.defineProperty(OriginalEntityClass.prototype, methodName, {
			get: () => {
				return function(...args: any[]) {
					var entity: EntityClass = this;
					var entityProxy = createProxyEntity(entity);
					var result = originalMethod.apply(entityProxy, args);
					var propertyKeys = Object.keys(entityProxy);
					if (propertyKeys.length) {
						if (result !== entityProxy) {
							throw new WrongReturnWhileSetProperties(
								'If set properties during call method then needs to return self entity'
							);
						}
						propertyKeys.forEach((propertyKey: string) => {
							var propertyValue = entityProxy[propertyKey];
							var nextData = entity.data.set(propertyKey, propertyValue);
							if (nextData !== entity.data) {
								entity = new EntityClass();
								entity.data = nextData;
							}
						});
						return entity;
					} else {
						return result;
					}
				};
			}
		});
	});
	class EntityClass {

		/** @internal */
		public data: Map<string, any> = Map({});

		constructor(...args: any[]) {
			var originalEntity = new OriginalEntityClass(...args);
			Object.keys(originalEntity).forEach((propertyKey: string) => {
				this.data = this.data.set(propertyKey, originalEntity[propertyKey]);
			});
		}
	}
	EntityClass.prototype = OriginalEntityClass.prototype;
	return <IEntityStatic<IEntity>><any>EntityClass;
};
export default Entity as ClassDecorator;
