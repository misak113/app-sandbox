
import {Provide} from 'di-ts';
import DispatcherNamespace from '../Socket/DispatcherNamespace';
import ServerOptions from '../Http/ServerOptions';
import HostOptions from '../Http/HostOptions';

@Provide(DispatcherNamespace)
export class SocketDispatcherNamespace extends DispatcherNamespace {
	constructor() {
		super();
		this.value = '/dispatcher';
	}
}

@Provide(ServerOptions)
export class HttpServerOptions extends ServerOptions {
	constructor() {
		super();
		this.host = 'localhost';
		this.port = process.env.PORT || 80;
	}
}

@Provide(HostOptions)
export class HttpHostOptions extends HostOptions {
	constructor() {
		super();
		this.host = 'localhost';
		this.port = window.location.port || '80';
		this.secure = false;
	}
}
