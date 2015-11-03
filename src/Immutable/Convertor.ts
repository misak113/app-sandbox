
import {ArgumentIsNotImmutableEntityException} from './exceptions';
import IEntityStatic from './IEntityStatic';
import embedded from './embedded';
import Entity from './Entity';
import {Map, List, fromJS} from 'immutable';
import EntityStorage from './EntityStorage';
/* tslint:disable */
var diff = require('immutablediff');
var patch = require('immutablepatch');
/* tslint:enable */

export default class Convertor {

	constructor(
		private entityStorage: EntityStorage
	) {}

	convertToJS<IEntity>(EntityClassConstructor: IEntityStatic<IEntity>, entity: IEntity) {
		var EntityClass = this.getOriginalEntityClass(EntityClassConstructor);
		var data: Map<string, any> = (<any>entity).data;
		if (!(data instanceof Map)) {
			throw new ArgumentIsNotImmutableEntityException();
		}
		var object = {};
		data.forEach((valueData: any, keyName: string) => {
			var EmbeddedClass = Reflect.getMetadata(embedded, EntityClass, keyName);
			if (EmbeddedClass) {
				object[keyName] = this.convertToJS(EmbeddedClass, valueData);
			} else {
				object[keyName] = valueData;
			}
		});
		return object;
	}

	convertFromJS<IEntity>(EntityClassConstructor: IEntityStatic<IEntity>, object: any): IEntity {
		var EntityClass = this.getOriginalEntityClass(EntityClassConstructor);
		var data: Map<string, any> = Map({});
		Object.keys(object).forEach((keyName: string) => {
			var value = object[keyName];
			var EmbeddedClass = Reflect.getMetadata(embedded, EntityClass, keyName);
			if (EmbeddedClass) {
				data = data.set(keyName, this.convertFromJS(EmbeddedClass, value));
			} else {
				data = data.set(keyName, value);
			}
		});
		var entity = this.entityStorage.restoreEntity<IEntity>(EntityClass, data);
		if (entity === null) {
			entity = new EntityClassConstructor();
			(<any>entity).data = data;
		}
		return entity;
	}

	diff<IEntity>(EntityClassConstructor: IEntityStatic<IEntity>, sourceEntity: IEntity, targetEntity: IEntity): List<any> {
		var sourceData = this.convertToJS(EntityClassConstructor, sourceEntity);
		var targetData = this.convertToJS(EntityClassConstructor, targetEntity);
		return diff(fromJS(sourceData), fromJS(targetData));
	}

	patch<IEntity>(EntityClassConstructor: IEntityStatic<IEntity>, sourceEntity: IEntity, ops: List<any>): IEntity {
		var sourceData = this.convertToJS(EntityClassConstructor, sourceEntity);
		var targetData = patch(fromJS(sourceData), ops).toJS();
		return this.convertFromJS(EntityClassConstructor, targetData);
	}

	private getOriginalEntityClass<IEntity>(EntityClass: IEntityStatic<IEntity>) {
		var OriginalEntityClass = Reflect.getMetadata(Entity, EntityClass);
		return OriginalEntityClass ? this.getOriginalEntityClass(OriginalEntityClass) : EntityClass;
	}
}
