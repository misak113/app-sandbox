
var injector = require("./dist/js/config/injector").default;
var Server = require("./dist/js/Server").default;
console.info('Starting App');
var server = injector.get(Server);
server.start();
