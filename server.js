var express = require('express');
var portfinder = require("portfinder");
var requireUncached = require('require-uncached');
var bodyParser = require('body-parser');
var multer = require('multer');
var _ = require("lodash");
var upload = multer();

var start = function (callback) {

    var barista = requireUncached("./lib/middleware/baristaMiddleware.js");

    var app = express();
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    app.use("/api/eval*", barista.brewHandler);
    app.get("/api/consoleMessages/:correlationId", barista.consoleMessagesHandler);

    return portfinder.getPort(function (err, port) {

        var server = app.listen(port, function () {
            var host = server.address().address;
            var port = server.address().port;

            console.log("Barista listening at http://%s:%s", host, port);
            callback({
                barista: barista,
                server: server
            });
        });

        return {
            barista: barista,
            server: server
        };
    });
};

var barista = null;

module.exports.shutdown = function (callback) {
    
    if (barista) {
        barista.barista.shutdown();

        //Close all the sockets we know about.
        for (var socketId in barista.server.sockets) {
            barista.server.sockets[socketId].destroy();
        }
        barista.server.close(callback);
        barista = null;
    }
}

module.exports.createBaristaServer = function (callback) {
    module.exports.shutdown();

    //Start a Barista Server
    start(function (result) {
        barista = result;
        var baristaServer = result.server;

        // Maintain a hash of all connected sockets so we can close them later.
        baristaServer.sockets = {};
        baristaServer.nextSocketId = 0;

        baristaServer.on('connection', function (socket) {
            // Add a newly connected socket
            var socketId = baristaServer.nextSocketId++;
            baristaServer.sockets[socketId] = socket;

            // Remove the socket when it closes
            socket.on('close', function () {
                _.unset(baristaServer.sockets, socketId);
            });
        });

        if (callback)
            callback(baristaServer);
    });
};