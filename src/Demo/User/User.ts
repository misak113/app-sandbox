
import Entity from '../../Immutable/Entity';

@Entity
export default class User {

	private id: number;

	constructor(
		private firstName: string,
		private lastName: string
	) {}

	getId() {
		return this.id;
	}

	getFirstName() {
		return this.firstName;
	}

	getLastName() {
		return this.lastName;
	}

	getFullName() {
		return this.firstName + ' ' + this.lastName;
	}

	setFirstName(firstName: string) {
		this.firstName = firstName;
		return this;
	}

	setLastName(lastName: string) {
		this.lastName = lastName;
		return this;
	}
}
