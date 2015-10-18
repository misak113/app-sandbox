/// <reference path="../../node_modules/di-ts/di-ts.d.ts" />

import * as parameters from './parameters';

export default [
	parameters.SocketDispatcherNamespace,
	parameters.HttpServerOptions,
	parameters.HttpHostOptions,
];
