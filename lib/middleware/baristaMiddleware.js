var requireUncached = require("require-uncached");
var barista = require("../main/app.js");
var _ = require("lodash");

var baristaPool = new barista.BaristaPool();

module.exports.consoleMessagesHandler = function (req, res, next) {
    var correlationId = req.params.correlationId;

    var consoleMessages = baristaPool._consoleCache.get("console-" + correlationId);
    res.send(consoleMessages);
};
 
module.exports.brewHandler = function (req, res, next) {
    
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