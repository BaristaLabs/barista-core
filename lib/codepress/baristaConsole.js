"use strict"
var _ = require("lodash");
var MemoryStream = require("memorystream");
var NativeConsole = require("console").Console;
var moment = require("moment");

class BaristaConsole {
    constructor(targetProcess) {
        if (targetProcess)
            this._process = targetProcess;
        else
            this._process = process;

        this._timers = {};
    }

    _getConsoleRedirect() {
        var output = MemoryStream.createWriteStream();
        var errorOutput = MemoryStream.createWriteStream();
        var result = {
            output: output,
            errorOutput: errorOutput,
            console: new NativeConsole(output, errorOutput)
        };

        return result;
    }

    assert() {
        var cr = this._getConsoleRedirect();
        cr.console.assert.apply(this, arguments);

        this._process.send({
            type: "console.assert",
            date: new Date(),
            pid: process.pid,
            message: cr.output.toString(),
            error: cr.errorOutput.toString()
        });
    }

    dir() {
        var cr = this._getConsoleRedirect();
        cr.console.dir.apply(this, arguments);

        this._process.send({
            type: "console.dir",
            date: new Date(),
            pid: process.pid,
            message: cr.output.toString(),
            error: cr.errorOutput.toString()
        });
    }

    error() {
        var cr = this._getConsoleRedirect();
        cr.console.error.apply(this, arguments);

        this._process.send({
            type: "console.error",
            date: new Date(),
            pid: process.pid,
            message: cr.output.toString(),
            error: cr.errorOutput.toString()
        });
    }

    info() {
        var cr = this._getConsoleRedirect();
        cr.console.info.apply(this, arguments);

        this._process.send({
            type: "console.info",
            date: new Date(),
            pid: process.pid,
            message: cr.output.toString(),
            error: cr.errorOutput.toString()
        });
    }

    log() {
        var cr = this._getConsoleRedirect();
        cr.console.log.apply(this, arguments);

        this._process.send({
            type: "console.log",
            date: new Date(),
            pid: process.pid,
            message: cr.output.toString(),
            error: cr.errorOutput.toString()
        });
    }

    time(label) {
        this._timers[label] = moment()
    }

    timeEnd(label) {
        this._process.send({
            type: "console.timeEnd",
            date: new Date(),
            pid: process.pid,
            message: label + ": " + moment().diff(this._timers[label]) + "ms",
            error: ""
        });

        delete this._timers[label];
    }

    trace() {
        var cr = this._getConsoleRedirect();
        cr.console.trace.apply(this, arguments);

        this._process.send({
            type: "console.trace",
            date: new Date(),
            pid: process.pid,
            message: cr.output.toString(),
            error: cr.errorOutput.toString()
        });
    }

    warn() {
        var cr = this._getConsoleRedirect();
        cr.console.warn.apply(this, arguments);

        this._process.send({
            type: "console.warn",
            date: new Date(),
            pid: process.pid,
            message: cr.output.toString(),
            error: cr.errorOutput.toString()
        });
    }
}

module.exports.BaristaConsole = BaristaConsole;