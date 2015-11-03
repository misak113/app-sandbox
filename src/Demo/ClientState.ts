
import Entity from '../Immutable/Entity';

@Entity
export default class ClientState {

	private status: boolean;

	getStatus() {
		return this.status;
	}

	setStatus(status: boolean) {
		this.status = status;
		return this;
	}

	getUserList() {
		return null;
	}
}
