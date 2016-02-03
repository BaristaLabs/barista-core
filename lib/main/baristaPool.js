"use strict";

var _ = require('lodash');
var Barista = require("./localBarista");
var generic = require('generic-pool');
var NodeCache = require("node-cache");

class BaristaPool {
    constructor(settings) {
        if (!settings)
            settings = {};

        _.defaults(settings, {
            name: 'barista-pool',
            size: require('os').cpus().length * 2,
            log: false,
            timeout: 30000
        });

        this._consoleCache = new NodeCache({ stdTTL: 300, checkperiod: 120 });
        var that = this;

        var storeConsoleMessage = function(baristaContext, m) {
            var consoleMessages = that._consoleCache.get("console-" + baristaContext.correlationId);
            if (!consoleMessages)
                consoleMessages = [];

            consoleMessages.push(m);
            that._consoleCache.set("console-" + baristaContext.correlationId, consoleMessages);
        };

        this._pool = new generic.Pool({
            name: settings.name,
            create: function (callback) {
                let barista = new Barista();

                barista.console = {
                    assert: storeConsoleMessage,
                    dir: storeConsoleMessage,
                    error: storeConsoleMessage,
                    info: storeConsoleMessage,
                    log: storeConsoleMessage,
                    timeEnd: storeConsoleMessage,
                    trace: storeConsoleMessage,
                    warn: storeConsoleMessage
                };
                callback(null, barista);
            },
            destroy: function (barista) {
                barista.tidyUp();
            },
            max: settings.size,
            min: settings.size - 1,
            idleTimeoutMillis: settings.timeout,
            log: settings.log
        });
    }

    acquire(err, callback) {
        var instance = this._pool;
        instance.acquire(err, callback);
    }

    release(barista) {
        var instance = this._pool;
        instance.release(barista);
    }

    drain(data, callback) {
        var instance = this._pool;
        instance.drain(function () {
            instance.destroyAllNow();
            if (callback)
                callback(null);
        });
        this._pool = null;
        this._consoleCache.close();
        this._consoleCache = null;
    }
}

module.exports = BaristaPool;