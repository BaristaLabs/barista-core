"use strict";

var path = require('path');
var _ = require('lodash');

var codePressPath = path.join(__dirname, '../codepress/codepress.js');
        
class Barista {

    constructor() {
        
        let childProcess = require('child_process');
    
        this.dedicatedThread = true;
        this._disconnected = false;

        this._handleCodePressMessage = function () { };
        this._disconnectHandler = function () { };



        this._process = childProcess.fork(codePressPath, [], {
            cwd: __dirname,
            execArgv: ['--use_strict']
        });
        
        var _this = this;
        this._process.on('message', function (m) {
            _this._handleCodePressMessage(m);
        });
    
        this._process.on('exit', function (m) {
            _this._disconnected = true;
            _this._disconnectHandler(m);
        });

        this.console = function () { };
    }

    /**
     * Sets-up the handler to be called upon the Barista
     * initialization is completed.
     * 
     * For Node.js the connection is fully initialized within the
     * constructor, so simply calls the provided handler.
     * 
     * @param {Function} handler to be called upon connection init
     */
    whenInit(handler) {
        handler();
    }

    /** 
     * Takes an order. E.g. initialization. (todo)
     */
    takeOrder() {

    }

    /** <summary>
     * Grinds the beans. E.g. Attempts to retrieve the code value from the request.
     */
    grind(baristaContext) {
    
        if (!baristaContext || !baristaContext.request)
            throw "A context object must be supplied that contains request and response objects.";
    
        //If the request has a header named "X-Barista-Code" use that first.
        var headerBasedCodeValue = _.get(baristaContext.request.headers, "x-barista-code");
        if (headerBasedCodeValue)
            return headerBasedCodeValue;
    
        //If the request has a query string parameter named "c" use that.
        var queryBasedCodeValue = _.get(baristaContext.request.query, "c");
        if (queryBasedCodeValue)
            return queryBasedCodeValue;
    
        //Otherwise, use the body of the post as code.
        //Note: this assumes that a body parser middleware is in use.
        //TODO: auto-configure the app to use a nominal configuration of body-parser/multer/etc?
        var requestBody = baristaContext.request.body;
        if (requestBody && baristaContext.request.method === "POST") {
            var codeValue = _.get(requestBody, "c");
            if (codeValue)
                return codeValue;
        
            codeValue = _.get(requestBody, "code");
            if (codeValue)
                return codeValue;
        }
    
        //Last Chance: attempt to use everything after eval/ in the url as the code
        if (baristaContext.request.params[0])
            return codeValue;
    
        return undefined;
    }

    /**
     * Tamps the ground coffee. E.g. Parses the code and makes it ready to be executed (brewed).
     */
    tamp() {

    }

    /**
     * Brews a cup of coffee. E.g. Evaluates the specified script and sets the appropriate values on the response object.
     * @param baristaContext
     * @param code
     * @param codePath
     * @param callback
     */
    brew(baristaContext, code, codePath, callback) {

        this._handleCodePressMessage = function (m) {
            switch (m.type) {
                case 'brewResult':
                    callback(null, m.context);
                    break;
                case 'console.assert':
                    if (this.console)
                        this.console.assert(baristaContext, m);
                    return;
                case 'console.dir':
                    if (this.console)
                        this.console.dir(baristaContext, m);
                    return;
                case 'console.error':
                    if (this.console)
                        this.console.error(baristaContext, m);
                    return;
                case 'console.info':
                    if (this.console)
                        this.console.info(baristaContext, m);
                    return;
                case 'console.log':
                    if (this.console)
                        this.console.log(baristaContext, m);
                    return;
                case 'console.timeEnd':
                    if (this.console)
                        this.console.timeEnd(baristaContext, m);
                    return;
                case 'console.trace':
                    if (this.console)
                        this.console.trace(baristaContext, m);
                    return;
                case 'console.warn':
                    if (this.console)
                        this.console.warn(baristaContext, m);
                    return;
                default:
                    return;
            }

            this._handleCodePressMessage = function () { };
        }

        this.send({
            type: "brew",
            context: baristaContext,
            code: code,
            codePath: codePath
        });
    }

    /**
     * Sends a message to the plugin site
     * 
     * @param {Object} data to send
     */
    send(data) {
        if (!this._disconnected) {
            this._process.send(data);
        }
    }

    /**
     * Adds a handler for the event of plugin disconnection
     * (= plugin process exit)
     * 
     * @param {Function} handler to call upon a disconnect
     */
    onDisconnect(handler) {
        this._disconnectHandler = handler;
    }

    /**
     * Disconnects the plugin (= kills the forked process)
     */
    tidyUp() {
        this._process.kill("SIGKILL");
        this._disconnected = true;
    }
}

module.exports = Barista;