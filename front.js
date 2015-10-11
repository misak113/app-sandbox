
var React = require('react');
var injector = require("./dist/js/src/config/injector").default;
var Client = require('./dist/js/src/Client').default;
console.info('Starting Client');
React.render(
	React.createElement(Client, { injector: injector }),
	document.getElementById('app')
);
