
import ExpressServer from '../../src/Http/ExpressServer';

describe('Http.ExpressServer', () => {

	it('should create express app instance', () => {
		const expressServer = new ExpressServer();
		expect(typeof expressServer.App === 'function').toBeTruthy();
	});
});
