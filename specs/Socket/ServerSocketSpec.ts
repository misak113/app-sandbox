
import ServerSocket from '../../src/Socket/ServerSocket';
import HttpServer from '../../src/Http/HttpServer';
import ExpressServer from '../../src/Http/ExpressServer';

describe('Socket.ServerSocket', () => {

	const expressServer = new ExpressServer();
	const httpServer = new HttpServer(expressServer);
	const serverSocket = new ServerSocket(httpServer);

	it('should get socket with specified namespace uri', () => {
		const namespace = serverSocket.Socket.of('/any-namespace');
		expect(namespace.name).toBe('/any-namespace');
	});
});
