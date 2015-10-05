
import * as express from 'express';
import * as serveStatic from 'serve-static';
import {Inject, Provide} from 'di-ts';
import ExpressServer from './Http/ExpressServer';

@Inject
export default class Server {

	constructor(
		private expressServer: ExpressServer
	) {}

	start() {
		console.log('Start Server');
		var app = this.expressServer.App;
		app.use(serveStatic(__dirname + '/../../dist'));
		app.use(serveStatic(__dirname + '/../../../src/index.html'));
		var port = process.env.PORT || 80;
		app.listen(port, () => console.info('Listen on port ' + port));
	}
}
