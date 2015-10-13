
var React = require('react');
var ReactDOM = require('react-dom');
var injector = require("./dist/js/src/config/injector").default;
var Client = require('./dist/js/src/Client').default;
console.info('Starting Client');
ReactDOM.render(
	React.createElement(Client, { injector: injector }),
	document
);
