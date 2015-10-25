
import ClientSource from '../../src/Addressing/ClientSource';

describe('Addressing.ClientSource', () => {

	it('shoud return instance with id property', () => {
		var clientSource = new ClientSource('abc113');
		expect(clientSource instanceof ClientSource).toBeTruthy();
		expect(clientSource.Id).toBe('abc113');
	});
});
