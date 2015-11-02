
import {ArgumentIsNotImmutableEntityException} from './exceptions';
import embedded from './embedded';
import {Map} from 'immutable';

export default class Convertor {

	convertToJS<IEntity>(entity: IEntity) {
		var EntityClass = entity.constructor;
		var data: Map<string, any> = (<any>entity).data;
		if (!(data instanceof Map)) {
			throw new ArgumentIsNotImmutableEntityException();
		}
		var object = {};
		data.forEach((valueData: any, keyName: string) => {
			var EmbeddedClass = Reflect.getMetadata(embedded, EntityClass, keyName);
			if (EmbeddedClass) {
				object[keyName] = this.convertToJS(valueData);
			} else {
				object[keyName] = valueData;
			}
		});
		return object;
	}
}
