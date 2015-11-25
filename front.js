
var assign = Object.assign;
var Injector = require('di-ts').Injector;
// TODO traceur of di-ts -> di bad override Object.assign function. This should set back right function body
Object.assign = assign;

var React = require('react');
var ReactDOM = require('react-dom');
var services = require("./dist/js/src/config/services").default;
var Client = require('./dist/js/src/Client').default;
console.info('Starting Client');
ReactDOM.render(
	React.createElement(Client, {
		injector: new Injector(services),
		initialState: window.initialState,
		clientId: window.clientId
	}),
	document
);
