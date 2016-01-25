"use strict";

//Put some beans, some water, some energy in... your coffee comes out.

var stringify = require('json-stringify-safe');
var _ = require('lodash');
var vm = require("vm");
var templates = require("./responseTemplates.js");
var requireUncached = require("require-uncached");

var expose = [
    'Buffer',
    'setTimeout',
    'setInterval',
    'clearTimeout',
    'clearInterval'
];

var codepress = {};

/// <summary>
/// Brews a cup of coffee. E.g. Evaluates the specified script and sets the appropriate values on the response object.
/// </summary>
/// <param name="code"></param>
/// <param name="codePath"></param>
/// <param name="requestBody"></param>
codepress.brew = function (baristaContext, code, codePath, callback) {

    //Initialize our sandbox
    var sandbox = {};

    for (var i = 0; i < expose.length; i++) {
        sandbox[expose[i]] = global[expose[i]];
    }

    var baristaRequire = requireUncached("./baristaRequire.js");


    //define the barista global object.
    sandbox.barista = requireUncached("./baristaGlobal.js");

    var console = require("./baristaConsole.js");
    sandbox.console = new console.BaristaConsole();
    sandbox.console.Console = console.BaristaConsole;

    sandbox.require = baristaRequire.require;

    //If the there is a require whitelist defined in the context, use that, otherwise use the default require whitelist
    if (baristaContext.requireWhitelist && util.isArray(baristaContext.requireWhitelist)) {
        baristaRequire.requireWhitelist = baristaContext.requireWhitelist;
    }

    //Run any initialization scripts defined in the input param
    if (baristaContext.initialization) {
        //TODO: Finish this.
    }

    try {

        var executionTimeout = 5 * 1000; //5 seconds
        if (_.isNumber(baristaContext.executionTimeout))
            executionTimeout = baristaContext.executionTimeout;

        var executionResult = vm.runInContext(code, vm.createContext(sandbox), {
            fileName: codePath,
            displayErrors: true, //TODO: only in debug..
            timeout: executionTimeout
        });
        
        if (_.isNull(baristaContext.response.content) || _.isUndefined(baristaContext.response.content))
            baristaContext.response.content = executionResult;
        
        if (Buffer.isBuffer(baristaContext.response.content)) {
            if (!baristaContext.response.contentType)
                baristaContext.response.contentType = "application/octet-stream";
            baristaContext.response.content = baristaContext.response.content;
        }
        else {
            if (!baristaContext.response.contentType)
                baristaContext.response.contentType = "application/json";
            
            var resultString = stringify(baristaContext.response.content);
            if (_.isUndefined(resultString))
                resultString = "\"undefined\"";
            
            baristaContext.response.content = sandbox.barista.str2buf(resultString);
        }

        callback(null, baristaContext);
    } catch (ex) {
        //When a javascript error occurs, output a purty message.
        baristaContext.response.statusCode = 400;
        baristaContext.response.contentType = "text/html";
        
        //todo: filter non-related stack traces
        if (!_.isError(ex)) {
            ex = new Error(ex);
        }

        ex.stack = ex.stack.replace(/(?:\r\n|\r|\n)/g, '<br />');

        baristaContext.response.content = sandbox.barista.str2buf(templates.javascriptExceptionWithStackTrace(ex));

        callback(null, baristaContext);
    }
};

var sendResponse = function (error, baristaContext) {
    process.send({
        type: "brewResult",
        context: baristaContext
    });
};

process.on('message', function (m) {
    switch (m.type) {
        case 'grind':
            break;
        case 'brew':
            codepress.brew(m.context, m.code, m.codePath, sendResponse);
            break;
    }
});
