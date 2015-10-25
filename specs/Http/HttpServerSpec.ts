
import HttpServer from '../../src/Http/HttpServer';
import ExpressServer from '../../src/Http/ExpressServer';

describe('Http.HttpServer', () => {

	it('should create express app instance', () => {
		var expressServer = new ExpressServer();
		var httpServer = new HttpServer(expressServer);
		expect(typeof httpServer.Server === 'object').toBeTruthy();
	});
});
