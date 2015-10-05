
import * as express from 'express';

export default class ExpressServer {
	private app: express.Express;
	get App() { return this.app; }
	constructor() {
		this.app = express();
	}
}
