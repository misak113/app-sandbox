
import ServerSource from '../../src/Addressing/ServerSource';

describe('Addressing.ServerSource', () => {

	it('shoud return instance', () => {
		var serverSource = new ServerSource;
		expect(serverSource instanceof ServerSource).toBeTruthy();
	});
});
