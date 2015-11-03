
import {ArgumentIsNotImmutableEntityException} from './exceptions';
import IEntityStatic from './IEntityStatic';
import embedded from './embedded';
import Entity from './Entity';
import {Map} from 'immutable';
import { restoreEntity } from './EntityStorage';

export default class Convertor {

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
		var entity = restoreEntity(EntityClass, data);
		if (entity === null) {
			entity = new EntityClassConstructor();
			(<any>entity).data = data;
		}
		return entity;
	}

	private getOriginalEntityClass<IEntity>(EntityClass: IEntityStatic<IEntity>) {
		var OriginalEntityClass = Reflect.getMetadata(Entity, EntityClass);
		return OriginalEntityClass ? this.getOriginalEntityClass(OriginalEntityClass) : EntityClass;
	}
}
