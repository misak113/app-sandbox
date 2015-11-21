
import ResourceTarget from './ResourceTarget';
import IClassStatic from './IClassStatic';

export default class ResourceFactory {

	get(State: IClassStatic<any>, params: { [name: string]: string }) {
		return new ResourceTarget((<any>State).name + ':' + JSON.stringify(params)); // TODO
	}
}
