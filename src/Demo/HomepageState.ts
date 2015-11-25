
import Entity from '../Immutable/Entity';
import name from '../Addressing/name';

@name('/homepage')
@Entity
export default class HomepageState {

	private status: boolean;

	getStatus() {
		return this.status;
	}

	toggleStatus() {
		this.status = !this.status;
		return this;
	}
}
