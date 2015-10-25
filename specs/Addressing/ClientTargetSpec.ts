
import ClientTarget from '../../src/Addressing/ClientTarget';

describe('Addressing.ClientTarget', () => {

	it('shoud return instance with id property', () => {
		var clientTarget = new ClientTarget('abc113');
		expect(clientTarget instanceof ClientTarget).toBeTruthy();
		expect(clientTarget.Id).toBe('abc113');
	});
});
