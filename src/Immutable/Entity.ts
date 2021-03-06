/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>

import 'reflect-metadata';
import IEntityStatic from './IEntityStatic';
import { WrongReturnWhileSetProperties, NotEntityStorageWasSetException } from './exceptions';
import { Map } from 'immutable';
import EntityStorage from './EntityStorage';

var localEntityStorage: EntityStorage;

export function setEntityStorage(entityStorage: EntityStorage) {
	'use strict';
	localEntityStorage = entityStorage;
}

export function getEntityStorage() {
	'use strict';
	if (!localEntityStorage) {
		throw new NotEntityStorageWasSetException();
	}
	return localEntityStorage;
}

const getMethodNames = (OriginalEntityClass: IEntityStatic<any>) => {
	const methodNames = Object.getOwnPropertyNames(OriginalEntityClass.prototype);
	return methodNames.filter((methodName: string) => methodName !== 'constructor');
};

const createProxyEntity = (EntityProxy: IEntityStatic<any>, entity: any) => {
	type Properties = { [propertyKey: string]: any };
	let proxyEntity: Properties = new EntityProxy();
	let overridenProperties: Properties = {};
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

const getOrCreateEntity = (OriginalEntityClass: IEntityStatic<any>, EntityClass: any, data: Map<string, any>) => {
	let nextEntity = getEntityStorage().restoreEntity<any>(OriginalEntityClass, data);
	if (!nextEntity) {
		nextEntity = new EntityClass();
		nextEntity.data = data;
		getEntityStorage().storeEntity(OriginalEntityClass, nextEntity);
	}
	return nextEntity;
};

function Entity<IEntity>(OriginalEntityClass: IEntityStatic<IEntity>) {
	'use strict';

	class EntityProxy { }

	class EntityClass {

		/** @internal */
		public data: Map<string, any> = Map({});

		constructor(...args: any[]) {
			const proxyEntity = createProxyEntity(EntityProxy, this);
			OriginalEntityClass.apply(proxyEntity, args);
			Object.keys(proxyEntity).forEach((propertyKey: string) => {
				this.data = this.data.set(propertyKey, proxyEntity[propertyKey]);
			});
			getEntityStorage().storeEntity<IEntity>(OriginalEntityClass, <IEntity><any>this);
		}
	}
	EntityClass.prototype = OriginalEntityClass.prototype;
	Reflect.defineMetadata(Entity, OriginalEntityClass, EntityClass);

	getMethodNames(OriginalEntityClass).forEach((methodName: string) => {
		const originalMethod = OriginalEntityClass.prototype[methodName];
		Object.defineProperty(EntityProxy.prototype, methodName, {
			get: () => originalMethod
		});
		Object.defineProperty(EntityClass.prototype, methodName, {
			get: () => {
				return function(...args: any[]) {
					const originalEntity: EntityClass = this;
					let proxyEntity = createProxyEntity(EntityProxy, originalEntity);
					const result = originalMethod.apply(proxyEntity, args);
					const propertyKeys = Object.keys(proxyEntity);
					if (propertyKeys.length) { // any set of private properties
						if (result !== proxyEntity) {
							throw new WrongReturnWhileSetProperties(
								'If set properties during call method then needs to return self entity'
							);
						}
						let data = originalEntity.data;
						propertyKeys.forEach((propertyKey: string) => {
							const propertyValue = proxyEntity[propertyKey];
							data = data.set(propertyKey, propertyValue);
						});
						if (data !== originalEntity.data) {
							return getOrCreateEntity(OriginalEntityClass, EntityClass, data);
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
