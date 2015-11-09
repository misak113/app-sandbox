
import ResourceTarget from './ResourceTarget';
import IClassStatic from './IClassStatic';

export default class ResourceFactory {

	get(Store: IClassStatic<any>, params: { [name: string]: string }) {
		return new ResourceTarget((<any>Store).name + ':' + JSON.stringify(params)); // TODO
	}
}
