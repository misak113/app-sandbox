
import {Map} from 'immutable';
import Store from '../Flux/Store';
import IClassStatic from '../Flux/IClassStatic';
import HomepageState from '../Demo/HomepageState';
import StatusStore from '../Demo/StatusStore';

let stores = Map<any, IClassStatic<Store<any>>>();

stores = stores.set(HomepageState, StatusStore);

export default stores;
