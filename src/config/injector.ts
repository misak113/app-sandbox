/// <reference path="../../node_modules/di-ts/di-ts.d.ts" />

import {Inject, Provide, Injector} from 'di-ts';
import * as express from 'express';
import * as http from 'http';
import Server from '../Server';

@Inject
export class HttpServer {
	private server: http.Server;
	get Server() { return this.server; }
	constructor(
		expressServer: ExpressServer
	) {
		this.server = http.createServer(expressServer.App);
	}
}

export class ExpressServer {
	private app: express.Express;
	get App() { return this.app; }
	constructor() {
		this.app = express();
	}
}

var injector = new Injector();
export default injector;
