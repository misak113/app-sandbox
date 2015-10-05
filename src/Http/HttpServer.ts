
import * as http from 'http';
import {Inject} from 'di-ts';
import ExpressServer from './ExpressServer';

@Inject
export default class HttpServer {
	private server: http.Server;
	get Server() { return this.server; }
	constructor(
		expressServer: ExpressServer
	) {
		this.server = http.createServer(expressServer.App);
	}
}
