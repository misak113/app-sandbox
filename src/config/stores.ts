
import {Map} from 'immutable';
import Store from '../Flux/Store';
import IClassStatic from '../Flux/IClassStatic';
import HomepageState from '../Demo/HomepageState';
import HomepageStore from '../Demo/HomepageStore';

let stores = Map<any, IClassStatic<Store<any>>>();

stores = stores.set(HomepageState, HomepageStore);

export default stores;
