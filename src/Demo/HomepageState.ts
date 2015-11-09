
import Entity from '../Immutable/Entity';

@Entity
export default class HomepageState {

	private status: boolean;

	getStatus() {
		return this.status;
	}

	setStatus(status: boolean) {
		this.status = status;
		return this;
	}
}
