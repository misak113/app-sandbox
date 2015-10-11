
var injector = require("./dist/js/src/config/injector").default;
var Server = require("./dist/js/src/Server").default;
console.info('Starting Server');
var server = injector.get(Server);
server.start();
