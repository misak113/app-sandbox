/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>

import 'reflect-metadata';
import {ArgumentIsNotImmutableEntityException} from './exceptions';
import IEntityStatic from './IEntityStatic';
import embedded from './embedded';
import Entity from './Entity';
import {Map, List, fromJS} from 'immutable';
import EntityStorage from './EntityStorage';
import {Inject} from 'di-ts';
/* tslint:disable */
var diff = require('immutablediff');
var patch = require('immutablepatch');
/* tslint:enable */

@Inject
export default class Convertor {

	constructor(
		private entityStorage: EntityStorage
	) {}

	convertToJS<IEntity>(EntityClassConstructor: IEntityStatic<IEntity>, entity: IEntity) {
		const EntityClass = this.getOriginalEntityClass(EntityClassConstructor);
		const data: Map<string, any> = (<any>entity).data;
		if (!(data instanceof Map)) {
			throw new ArgumentIsNotImmutableEntityException();
		}
		let object = {};
		data.forEach((valueData: any, keyName: string) => {
			const EmbeddedClass = Reflect.getMetadata(embedded, EntityClass, keyName);
			if (EmbeddedClass) {
				object[keyName] = this.convertToJS(EmbeddedClass, valueData);
			} else {
				object[keyName] = valueData;
			}
		});
		return object;
	}

	convertFromJS<IEntity>(EntityClassConstructor: IEntityStatic<IEntity>, object: any): IEntity {
		const EntityClass = this.getOriginalEntityClass(EntityClassConstructor);
		let data: Map<string, any> = Map({});
		Object.keys(object).forEach((keyName: string) => {
			const value = object[keyName];
			const EmbeddedClass = Reflect.getMetadata(embedded, EntityClass, keyName);
			if (EmbeddedClass) {
				data = data.set(keyName, this.convertFromJS(EmbeddedClass, value));
			} else {
				data = data.set(keyName, value);
			}
		});
		let entity = this.entityStorage.restoreEntity<IEntity>(EntityClass, data);
		if (entity === null) {
			entity = new EntityClassConstructor();
			(<any>entity).data = data;
		}
		return entity;
	}

	diff<IEntity>(EntityClassConstructor: IEntityStatic<IEntity>, sourceEntity: IEntity, targetEntity: IEntity): List<any> {
		const sourceData = this.convertToJS(EntityClassConstructor, sourceEntity);
		const targetData = this.convertToJS(EntityClassConstructor, targetEntity);
		return diff(fromJS(sourceData), fromJS(targetData));
	}

	patch<IEntity>(EntityClassConstructor: IEntityStatic<IEntity>, sourceEntity: IEntity, ops: List<any>): IEntity {
		const sourceData = this.convertToJS(EntityClassConstructor, sourceEntity);
		const targetData = patch(fromJS(sourceData), ops).toJS();
		return this.convertFromJS(EntityClassConstructor, targetData);
	}

	private getOriginalEntityClass<IEntity>(EntityClass: IEntityStatic<IEntity>) {
		const OriginalEntityClass = Reflect.getMetadata(Entity, EntityClass);
		return OriginalEntityClass ? this.getOriginalEntityClass(OriginalEntityClass) : EntityClass;
	}
}
