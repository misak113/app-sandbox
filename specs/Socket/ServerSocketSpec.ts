
import ServerSocket from '../../src/Socket/ServerSocket';
import HttpServer from '../../src/Http/HttpServer';
import ExpressServer from '../../src/Http/ExpressServer';

describe('Socket.ServerSocket', () => {

	var expressServer = new ExpressServer();
	var httpServer = new HttpServer(expressServer);
	var serverSocket = new ServerSocket(httpServer);

	it('should get socket with specified namespace uri', () => {
		var namespace = serverSocket.Socket.of('/any-namespace');
		expect(namespace.name).toBe('/any-namespace');
	});
});
