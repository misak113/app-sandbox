
import {Map} from 'immutable';
import Store from '../Flux/Store';
import IClassStatic from '../Flux/IClassStatic';
import Homepage from '../Demo/Homepage';
import StatusStore from '../Demo/StatusStore';

let stores = Map<any, IClassStatic<Store<any>>>();

stores = stores.set(Homepage, StatusStore);

export default stores;
