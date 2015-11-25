
import Convertor from '../../src/Immutable/Convertor';
import Entity, { setEntityStorage } from '../../src/Immutable/Entity';
import EntityStorage from '../../src/Immutable/EntityStorage';
import embedded from '../../src/Immutable/embedded';

@Entity
class Skype {

	constructor(
		private nickName: string
	) {}

	getNickName() {
		return this.nickName;
	}

	setNickName(nickName: string) {
		this.nickName = nickName;
		return this;
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

	const entityStorage = new EntityStorage();
	const convertor = new Convertor(entityStorage);

	beforeEach(() => {
		setEntityStorage(entityStorage);
	});

	it('should return JS object of entity', () => {
		const skype = new Skype('misak113');
		const address = new Address('Falešná');
		let user = new User('Michael', address);
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
		const user = convertor.convertFromJS(User, {
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
		const skype = new Skype('misak113');
		const address = new Address('Falešná');
		let user = new User('Michael', address);
		user = user.setSkype(skype);
		const convertedUser = convertor.convertFromJS(User, convertor.convertToJS(User, user));
		expect(convertedUser).toBe(user);
	});

	it('should return same instance if data are same', () => {
		const data = {
			name: 'Michael',
			address: {
				street: 'Falešná'
			},
			skype: {
				nickName: 'misak113'
			}
		};
		const user1 = convertor.convertFromJS(User, data);
		const user2 = convertor.convertFromJS(User, data);
		expect(user1).toBe(user2);
	});

	it('should diff & patch entity to be same result entity', () => {
		const skype = new Skype('misak113');
		const address = new Address('Falešná');
		let user = new User('Michael', address);
		user = user.setSkype(skype);

		const changedSkype = skype.setNickName('oleg');
		const changedUser = user.setSkype(changedSkype);

		const ops = convertor.diff(User, user, changedUser);

		expect(ops.toJS()).toEqual([
			{ op: 'replace', path: '/skype/nickName', value: 'oleg' }
		]);

		const patchedUser = convertor.patch(User, user, ops);

		expect(patchedUser).toBe(changedUser);
		expect(user.getSkype()).toBe(skype);

		expect(patchedUser.getSkype()).toBe(changedSkype);
		expect(changedUser.getSkype()).toBe(changedSkype);

		expect(user.getSkype().getNickName()).toBe('misak113');
		expect(changedUser.getSkype().getNickName()).toBe('oleg');
	});
});
