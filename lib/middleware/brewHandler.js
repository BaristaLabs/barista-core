"use strict";

var util = require('util');
var _ = require("lodash");
var uuid = require("node-uuid");
var requireUncached = require("require-uncached");

var requestProperties = [
    "baseUrl",
    "body",
    "cookies",
    "files",
    "fresh",
    "headers",
    "hostname",
    "ip",
    "ips",
    "method",
    "originalUrl",
    "params",
    "path",
    "protocol",
    "query",
    "route",
    "secure",
    "signedCookies",
    "stale",
    "subdomains",
    "xhr"
];

var responseProperties = [
    "attachment",
    "body",
    "cookies",
    "headers",
    "links",
    "location",
    "redirect",
    "status",
    "type",
    "vary"
];

module.exports = function (data, callback) {

    //Create the context from the current request/response data.
    var baristaContext = {
        correlationId: uuid.v4(),
        request: _.pick(data.request, requestProperties),
        response: _.pick(data.response, responseProperties),
        environment: data.environment,
        requireWhiteList: data.requireWhitelist
    };

    data.baristaPool.acquire(function (err, myBarista) {

        if (err)
            throw err;
        
        //Should grind be executed in the sandbox?
        let code = myBarista.grind(baristaContext);

        if (_.isUndefined(code) || _.isNull(code))
            throw "Code to evaluate must be specified either through a 'X-Barista-Code' header, a 'c' query string parameter or the 'code' or 'c' form field that contains either a literal script declaration or a relative or absolute path to a script file.";

        try {
            var brewCallback = function (err, m) {
                callback(err, m);
                data.baristaPool.release(myBarista);
            };

            myBarista.brew(baristaContext, code, "", brewCallback);
        }
        catch (ex) {
            //TODO: Set a response object.
            data.baristaPool.release(myBarista);
        }
    });
};