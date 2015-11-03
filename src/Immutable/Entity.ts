
import IEntityStatic from './IEntityStatic';
import { WrongReturnWhileSetProperties } from './exceptions';
import { Map } from 'immutable';

var entityStorage: Map<IEntityStatic<any>, Map<Map<string, any>, any>>;

var storeEntity = (OriginalEntityClass: IEntityStatic<any>, entity: any) => {
	if (!entityStorage) {
		entityStorage = Map<IEntityStatic<any>, Map<Map<string, any>, any>>();
	}
	if (!entityStorage.has(OriginalEntityClass)) {
		entityStorage = entityStorage.set(OriginalEntityClass, Map<Map<string, any>, any>());
	}
	entityStorage = entityStorage.setIn([OriginalEntityClass, entity.data], entity);
};

var restoreEntity = (OriginalEntityClass: IEntityStatic<any>, data: Map<string, any>) => {
	if (entityStorage && entityStorage.hasIn([OriginalEntityClass, data])) {
		return entityStorage.getIn([OriginalEntityClass, data]);
	} else {
		return null;
	}
};

var getMethodNames = (OriginalEntityClass: IEntityStatic<any>) => {
	var methodNames = Object.getOwnPropertyNames(OriginalEntityClass.prototype);
	return methodNames.filter((methodName: string) => methodName !== 'constructor');
};

var createProxyEntity = (EntityProxy: IEntityStatic<any>, entity: any) => {
	type Properties = { [propertyKey: string]: any };
	var proxyEntity: Properties = new EntityProxy();
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

function Entity<IEntity>(OriginalEntityClass: IEntityStatic<IEntity>) {
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

	class EntityProxy { }

	class EntityClass {

		/** @internal */
		public data: Map<string, any> = Map({});

		constructor(...args: any[]) {
			var proxyEntity = createProxyEntity(EntityProxy, this);
			OriginalEntityClass.apply(proxyEntity, args);
			Object.keys(proxyEntity).forEach((propertyKey: string) => {
				this.data = this.data.set(propertyKey, proxyEntity[propertyKey]);
			});
			storeEntity(OriginalEntityClass, this);
		}
	}
	EntityClass.prototype = OriginalEntityClass.prototype;
	Reflect.defineMetadata(Entity, OriginalEntityClass, EntityClass);

	getMethodNames(OriginalEntityClass).forEach((methodName: string) => {
		var originalMethod = OriginalEntityClass.prototype[methodName];
		Object.defineProperty(EntityProxy.prototype, methodName, {
			get: () => originalMethod
		});
		Object.defineProperty(EntityClass.prototype, methodName, {
			get: () => {
				return function(...args: any[]) {
					var originalEntity: EntityClass = this;
					var proxyEntity = createProxyEntity(EntityProxy, originalEntity);
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

	return <IEntityStatic<IEntity>><any>EntityClass;
};
export default Entity as ClassDecorator;
