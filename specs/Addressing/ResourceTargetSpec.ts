
import ClientTarget from '../../src/Addressing/ResourceTarget';

describe('Addressing.ResourceTarget', () => {

	it('shoud return instance with id property', () => {
		const clientTarget = new ClientTarget('abc113');
		expect(clientTarget instanceof ClientTarget).toBeTruthy();
		expect(clientTarget.getIdentifier()).toBe('abc113');
	});
});
