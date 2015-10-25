/// <reference path="../../node_modules/di-ts/di-ts.d.ts" />
/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />

import * as parameters from './parameters';

export default [
	parameters.SocketDispatcherNamespace,
	parameters.HttpServerOptions,
	parameters.HttpHostOptions,
];
