﻿var requireUncached = require("require-uncached");
var barista = require("../main/index.js");
var _ = require("lodash");

var baristaPool = new barista.BaristaPool();

module.exports.consoleMessages = function (req, res, next) {
    var correlationId = req.params.correlationId;

    var consoleMessages = baristaPool._consoleCache.get("console-" + correlationId);
    //omit some properties from the response as to not leak system internals, but keep them for debugging purposes.
    consoleMessages = _.mapValues(consoleMessages, function (consoleMessage) {
        return _.omit(consoleMessage, ["pid"]);
    });
    res.send(consoleMessages);
};
 
module.exports.brew = function (req, res, next) {
    
    var brewHandler = requireUncached("./brewHandler.js");
    
    var result = brewHandler({
        request: _.cloneDeep(req),
        response: _.cloneDeep(res),
        baristaPool: baristaPool
    }, function (err, result) {

        if (err) {
            res.status(500).send(err);
            return;
        }

        //TODO: Headers and all that.
        res.set('X-Barista-CorrelationId', result.correlationId);
        res.set('Content-Type', result.response.contentType);

        var responseValue = null;
        switch (result.response.content.type) {
            case "Buffer":
                responseValue = new Buffer(result.response.content.data);
                break;
        }

        res.send(responseValue);
    });
};

module.exports.shutdown = function () {
    
    if (baristaPool) {
        baristaPool.drain();
        baristaPool = null;
    }
};