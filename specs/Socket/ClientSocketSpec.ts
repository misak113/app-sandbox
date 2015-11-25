
import ClientSocket from '../../src/Socket/ClientSocket';
import HostOptions from '../../src/Http/HostOptions';

describe('Socket.ClientSocket', () => {

	let hostOptions = new HostOptions();
	hostOptions.host = 'my.domain.cz';
	hostOptions.port = '8081';

	it('should get socket with specified namespace uri', () => {
		hostOptions.secure = false;
		const clientSocket = new ClientSocket(hostOptions);
		const namespace = clientSocket.getSocketOf('/any-namespace');
		expect(namespace.io.uri).toBe('http://my.domain.cz:8081/any-namespace');
	});

	it('should get socket with specified namespace uri with ssl', () => {
		hostOptions.secure = true;
		const clientSocket = new ClientSocket(hostOptions);
		const namespace = clientSocket.getSocketOf('/any-namespace');
		expect(namespace.io.uri).toBe('https://my.domain.cz:8081/any-namespace');
	});
});
