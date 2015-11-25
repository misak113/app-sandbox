
import IEntityStatic from './IEntityStatic';
import { Map } from 'immutable';

export type Data = Map<string, any>;
export type EntityByData<IEntity> = Map<Data, IEntity>;

export default class EntityStorage {

	private entityStorage = Map<IEntityStatic<any>, EntityByData<any>>({});

	storeEntity<IEntity>(OriginalEntityClass: IEntityStatic<IEntity>, entity: IEntity) {
		if (!this.entityStorage.has(OriginalEntityClass)) {
			this.entityStorage = this.entityStorage.set(OriginalEntityClass, Map<Data, any>());
		}
		this.entityStorage = this.entityStorage.setIn([OriginalEntityClass, (<any>entity).data], entity);
	};

	restoreEntity<IEntity>(OriginalEntityClass: IEntityStatic<IEntity>, data: Data): IEntity {
		if (this.entityStorage.hasIn([OriginalEntityClass, data])) {
			return this.entityStorage.getIn([OriginalEntityClass, data]);
		} else {
			return null;
		}
	}
}
