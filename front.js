
var React = require('react');
var injector = require("./dist/js/config/injector").default;
var Client = require('./dist/js/Client').default;
console.info('Starting Client');
React.render(
	React.createElement(Client, { injector: injector }),
	document.getElementById('app')
);
