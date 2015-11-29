
import Entity from '../Immutable/Entity';
import resource from '../Addressing/resource';

@resource('/homepage')
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
