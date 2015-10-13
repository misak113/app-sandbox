
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var injector = require("./dist/js/src/config/injector").default;
var Server = require("./dist/js/src/Server").default;
console.info('Starting Server');
ReactDOMServer.renderToString(
	React.createElement(Server, { injector: injector })
);
