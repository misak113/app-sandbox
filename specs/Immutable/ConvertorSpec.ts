
import Convertor from '../../src/Immutable/Convertor';
import Entity from '../../src/Immutable/Entity';
import embedded from '../../src/Immutable/embedded';

@Entity
class Skype {

	constructor(
		private nickName: string
	) {}
}

@Entity
class Address {

	constructor(
		private street: string
	) {}

}

@Entity
class User {

	@embedded private skype: Skype;

	constructor(
		private name: string,
		@embedded private address: Address
	) { }

	getName() {
		return this.name;
	}

	getSkype() {
		return this.skype;
	}

	getAddress() {
		return this.address;
	}

	setSkype(skype: Skype) {
		this.skype = skype;
		return this;
	}
}

describe('Immutable.Convertor', () => {

	var convertor = new Convertor();

	it('should return JS object of entity', () => {
		var skype = new Skype('misak113');
		var address = new Address('Falešná');
		var user = new User('Michael', address);
		user = user.setSkype(skype);
		expect(convertor.convertToJS(user)).toEqual({
			name: 'Michael',
			address: {
				street: 'Falešná'
			},
			skype: {
				nickName: 'misak113'
			}
		});
	});
	/*

	it('should return entity by JS object', () => {
		var user = new User(undefined, undefined);
		user = user.fromJS({ firstName: 'Michael', lastName: 'Žabka' });
		expect(user instanceof User).toBeTruthy();
		expect(user.getFirstName()).toBe('Michael');
		expect(user.getLastName()).toBe('Žabka');
	});

	it('should not allow create entity by wrong JS object', () => {
		var user = new User(undefined, undefined);
		expect(() => user.fromJS({ firstNameTypo: 'Michael', lastName: 'Žabka' }))
			.toThrow(new InvalidDirectPropertySetException(
				'Every set property must be annotated by Property'
			));
	});

	it('should update internal map by update callback', () => {
		var user = new User('Michael', 'Žabka');
		var newUser = user.update((data: Map<string, any>) => {
			data = data.set('lastName', 'Švecová');
			return data;
		});
		expect(newUser).not.toBe(user);
		expect(newUser instanceof User).toBeTruthy();
		expect(newUser.getFirstName()).toBe('Michael');
		expect(newUser.getLastName()).toBe('Švecová');
	});*/
});
