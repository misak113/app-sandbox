
import Convertor from '../../src/Immutable/Convertor';
import Entity from '../../src/Immutable/Entity';
import embedded from '../../src/Immutable/embedded';

@Entity
class Skype {

	constructor(
		private nickName: string
	) {}

	getNickName() {
		return this.nickName;
	}
}

@Entity
class Address {

	constructor(
		private street: string
	) { }

	getStreet() {
		return this.street;
	}
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
		expect(convertor.convertToJS(User, user)).toEqual({
			name: 'Michael',
			address: {
				street: 'Falešná'
			},
			skype: {
				nickName: 'misak113'
			}
		});
	});

	it('should return entity by JS object', () => {
		var user = convertor.convertFromJS(User, {
			name: 'Michael',
			address: {
				street: 'Falešná'
			},
			skype: {
				nickName: 'misak113'
			}
		});
		expect(user instanceof User).toBeTruthy();
		expect(user.getName()).toBe('Michael');
		expect(user.getAddress() instanceof Address).toBeTruthy();
		expect(user.getAddress().getStreet()).toBe('Falešná');
		expect(user.getSkype() instanceof Skype).toBeTruthy();
		expect(user.getSkype().getNickName()).toBe('misak113');
	});

	it('should convert to & then from JS to be same instance', () => {
		var skype = new Skype('misak113');
		var address = new Address('Falešná');
		var user = new User('Michael', address);
		user = user.setSkype(skype);
		var convertedUser = convertor.convertFromJS(User, convertor.convertToJS(User, user));
		expect(convertedUser).toBe(user);
	});

	/*
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
