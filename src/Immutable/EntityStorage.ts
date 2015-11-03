
import IEntityStatic from './IEntityStatic';
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

export {
	storeEntity,
	restoreEntity
};
