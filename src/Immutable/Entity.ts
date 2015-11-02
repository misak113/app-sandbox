// / <reference path="node_modules/reflect-metadata/reflect-metadata.d.ts"/>

import IEntityStatic from './IEntityStatic';
import { WrongReturnWhileSetProperties } from './exceptions';
import { Map } from 'immutable';

var entityStorage: Map<IEntityStatic<any>, Map<Map<string, any>, any>>;

/* tslint:disable */
var storeEntity = (OriginalEntityClass: IEntityStatic<any>, entity: any) => {
	/* tslint:enable */
	if (!entityStorage) {
		entityStorage = Map<IEntityStatic<any>, Map<Map<string, any>, any>>();
	}
	if (!entityStorage.has(OriginalEntityClass)) {
		entityStorage = entityStorage.set(OriginalEntityClass, Map<Map<string, any>, any>());
	}
	entityStorage = entityStorage.setIn([OriginalEntityClass, entity.data], entity);
};

/* tslint:disable */
var restoreEntity = (OriginalEntityClass: IEntityStatic<any>, data: Map<string, any>) => {
	/* tslint:enable */
	if (entityStorage && entityStorage.hasIn([OriginalEntityClass, data])) {
		return entityStorage.getIn([OriginalEntityClass, data]);
	} else {
		return null;
	}
};

/* tslint:disable */
function Entity<IEntity>(OriginalEntityClass: IEntityStatic<IEntity>) {
	/* tslint:enable */
	'use strict';
	var getOrCreateEntity = (data: Map<string, any>) => {
		var nextEntity = restoreEntity(OriginalEntityClass, data);
		if (!nextEntity) {
			nextEntity = new EntityClass();
			nextEntity.data = data;
			storeEntity(OriginalEntityClass, nextEntity);
		}
		return nextEntity;
	};
	var createProxyEntity = (entity: EntityClass) => {
		type Properties = { [propertyKey: string]: any };
		var proxyEntity: Properties = {};
		var overridenProperties: Properties = {};
		entity.data.forEach((value: any, propertyKey: string) => {
			Object.defineProperty(proxyEntity, propertyKey, {
				get: () => {
					return Object.keys(overridenProperties).indexOf(propertyKey) !== -1
						? overridenProperties[propertyKey]
						: entity.data.get(propertyKey);
				},
				set: (value: any) => {
					overridenProperties[propertyKey] = value;
					Object.defineProperty(proxyEntity, propertyKey, {
						enumerable: true
					});
				},
				enumerable: false,
				configurable: true
			});
		});
		return proxyEntity;
	};
	var methodNames = Object.getOwnPropertyNames(OriginalEntityClass.prototype);
	methodNames.forEach((methodName: string) => {
		var originalMethod = OriginalEntityClass.prototype[methodName];
		Object.defineProperty(OriginalEntityClass.prototype, methodName, {
			get: () => {
				return function(...args: any[]) {
					var originalEntity: EntityClass = this;
					var proxyEntity = createProxyEntity(originalEntity);
					var result = originalMethod.apply(proxyEntity, args);
					var propertyKeys = Object.keys(proxyEntity);
					if (propertyKeys.length) { // any set of private properties
						if (result !== proxyEntity) {
							throw new WrongReturnWhileSetProperties(
								'If set properties during call method then needs to return self entity'
							);
						}
						var data = originalEntity.data;
						propertyKeys.forEach((propertyKey: string) => {
							var propertyValue = proxyEntity[propertyKey];
							data = data.set(propertyKey, propertyValue);
						});
						if (data !== originalEntity.data) {
							return getOrCreateEntity(data);
						} else {
							return originalEntity;
						}
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
			storeEntity(OriginalEntityClass, this);
		}
	}
	EntityClass.prototype = OriginalEntityClass.prototype;
	return <IEntityStatic<IEntity>><any>EntityClass;
};
export default Entity as ClassDecorator;
