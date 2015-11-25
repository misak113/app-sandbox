
import * as io from 'socket.io';
import {Inject} from 'di-ts';
import HttpServer from '../Http/HttpServer';

@Inject
export default class ServerSocket {

	private socket: SocketIO.Server;

	get Socket() { return this.socket; }

	constructor(
		httpServer: HttpServer
	) {
		const options = {
			serveClient: false
		};
		this.socket = io(httpServer.Server, options);
	}
}
