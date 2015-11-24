
import ResourceTarget from './ResourceTarget';
import IClassStatic from './IClassStatic';
import HomepageState from '../Demo/HomepageState';

export default class ResourceFactory {

	get(State: IClassStatic<any>, params: { [name: string]: string }) {
		var name: string;
		if (State === HomepageState) {
			name = '/homepage';
		} else {
			throw new Error();
		}
		return new ResourceTarget(name + ':' + JSON.stringify(params)); // TODO
	}

	reverse(resourceTarget: ResourceTarget) {
		if (resourceTarget.getIdentifier() === '/homepage:{}') {
			return { State: HomepageState, params: '{}' }; // TODO
		} else {
			throw new Error();
		}
	}
}
