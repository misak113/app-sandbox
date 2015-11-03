
var assign = Object.assign;
var Injector = require('di-ts').Injector;
// TODO traceur of di-ts -> di bad override Object.assign function. This should set back right function body
Object.assign = assign;

var React = require('react');
var ReactDOMServer = require('react-dom/server');
var services = require("./dist/js/src/config/services").default;
var Server = require("./dist/js/src/Server").default;
console.info('Starting Server');
ReactDOMServer.renderToString(
	React.createElement(Server, { injector: new Injector(services), ClientState: require('./dist/js/src/Demo/ClientState').default })
);
