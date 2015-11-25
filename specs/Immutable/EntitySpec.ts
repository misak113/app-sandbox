
import Entity, { setEntityStorage } from '../../src/Immutable/Entity';
import EntityStorage from '../../src/Immutable/EntityStorage';
import { WrongReturnWhileSetProperties } from '../../src/Immutable/exceptions';

describe('Immutable.Entity', () => {

	@Entity
	class User {

		private id: number;

		constructor(
			private firstName: string,
			private lastName: string
		) {
			this.setId(1);
		}

		getId() {
			return this.id;
		}

		getFirstName() {
			return this.firstName;
		}

		getLastName() {
			return this.lastName;
		}

		setId(id: number) {
			this.id = id;
			return this;
		}

		setFirstName(firstName: string) {
			this.firstName = firstName;
			return this;
		}

		setLastName(lastName: string) {
			this.lastName = lastName;
			return this;
		}

		setFullName(firstName: string, lastName: string) {
			this.lastName = lastName;
			this.firstName = firstName;
			return this;
		}

		setFullNameBySetters(firstName: string, lastName: string) {
			this.setLastName(lastName);
			this.setFirstName(firstName);
			return this;
		}

		setNothing() {
			return this;
		}

		setLastNameNotReturnSelf(lastName: string) {
			this.lastName = lastName;
		}
	}

	const entityStorage = new EntityStorage();

	beforeEach(() => {
		setEntityStorage(entityStorage);
	});

	it('should get properties set in constructor', () => {
		const user = new User('Michael', 'Žabka');
		expect(user.getFirstName()).toBe('Michael');
		expect(user.getLastName()).toBe('Žabka');
	});

	it('should set properties by setter methods', () => {
		let user = new User('Michael', 'Žabka');
		user = user.setFirstName('Kateřina');
		user = user.setLastName('Švecová');
		user = user.setId(113);
		expect(user.getFirstName()).toBe('Kateřina');
		expect(user.getLastName()).toBe('Švecová');
		expect(user.getId()).toBe(113);
	});

	it('should set multiple properties at once by setter method', () => {
		let user = new User('Michael', 'Žabka');
		user = user.setFullName('Kateřina', 'Švecová');
		expect(user.getFirstName()).toBe('Kateřina');
		expect(user.getLastName()).toBe('Švecová');
	});

	it('should set properties using internal call of setters', () => {
		let user = new User('Michael', 'Žabka');
		user = user.setFullNameBySetters('Kateřina', 'Švecová');
		expect(user.getFirstName()).toBe('Kateřina');
		expect(user.getLastName()).toBe('Švecová');
	});

	it('should not change original immutable entity', () => {
		const user = new User('Michael', 'Žabka');
		const newUser = user.setFirstName('Gabriela');

		expect(user).not.toBe(newUser);
		expect(user).not.toEqual(newUser);

		expect(newUser.getFirstName()).toBe('Gabriela');
		expect(user.getFirstName()).toBe('Michael');
	});

	it('should return immutable entity equal to original if no changes', () => {
		const user = new User('Michael', 'Žabka');

		const newUser = user.setFirstName('Gabriela');
		expect(user === newUser).toBeFalsy();

		const sameUser = newUser.setFirstName('Michael');
		expect(user === sameUser).toBeTruthy();
	});

	it('should return instance of same entity by set method', () => {
		let user = new User('Michael', 'Žabka');
		user = user.setFirstName('Kateřina');
		expect(user instanceof User).toBeTruthy();
	});

	it('should not allow set in setter if not returned self entity', () => {
		const user = new User('Michael', 'Žabka');
		expect(() => user.setLastNameNotReturnSelf('Švecová'))
			.toThrow(new WrongReturnWhileSetProperties(
				'If set properties during call method then needs to return self entity'
			));
	});

	it('should contains reflection metadata of original Entity', () => {
		const OriginalUser = Reflect.getMetadata(Entity, User);
		expect(typeof OriginalUser === 'function').toBeTruthy();
		expect(OriginalUser.prototype === User.prototype).toBeTruthy();
	});
});
