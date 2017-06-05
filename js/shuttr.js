/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

// Logging
const l = require('./logger').log;
var log = function(msg) { l('shuttr', msg) };

const http = require('http');
const wol = require('node-wol');
const vf = require('./viewfinder');
const heartbeat = require('./heartbeat');
const exec = require('child_process').execSync;

var handler = null;
var child = null;

var platform = {
    detect: function() {
        let plat = "";
        if (process.platform == "darwin")
            plat = "darwin";
        else if (process.platform == "win32") {
            if (process.arch == "x64")
                plat = "win64";
            else
                plat = "win32";
        } else
            plat = "linux";
        return this[plat];
    },
    win32: {},
    win64: {},
    linux: {},
    darwin: {
        getBssid: function() {
            var cmd = "system_profiler SPNetworkDataType | grep RouterHardwareAddress | sed 's/.*RouterHardwareAddress=//'";
            var code = exec(cmd), bssid = "";
            for (var i = 0; i < code.length - 1; i++)    // The last character is a newline
                bssid += String.fromCharCode(code[i]);
            return bssid;
        }
    }
}

var ping = null, model = null;
var Shuttr = {
    init: function(m, p, e, b) {
        log("Starting up");
        model = m;
        heartbeat.start(function(isAlive) {
            if (isAlive)
                p();
            else
                e();
        }, b);
    },
    command: function(cmd, data) {
        this.get('/command' + cmd, data);
    },
    set: function(key, value) {
        this.get('/setting/' + key + '/' + value);
    },
    get: function(loc, data, cb) {
        var host = '10.5.5.9',
            path = '/gp/gpControl' + loc,
            response = "";

        // Encode data object as GET url
        if (typeof data !== undefined && data !== null) {
            path += '?';
            for (var key in data)
                path += key + '=' + data[key] + '&';
        }

        var opts = { host: host, path: path };
        http.request(opts, (res) => {
            res.on('data', (chunk) => { response += chunk });
            res.on('end', function(){
                if (typeof cb === "function")
                    cb(response);
            });
        }).end();
    },
    controls: {
        vf_init: function() {
            var that = Shuttr.controls;
            // Close any currently open handles
            vf.close();
            // then open a new one
            that.vf_open();
            that.vf_play();
        },
        vf_open: function() {
            // Set stream resolution to 1280x720
            Shuttr.get("/setting/64/7", null, function(){
                // Set stream bitrate to 8 Mbps
                Shuttr.get("/setting/62/8000000", null, function(){
                    // Open viewfinder
                    vf.open((dgramClient) => {
                        handler = window.setInterval(vf.keepAlive, 2500);
                    });
                });
            });
        },
        vf_play: function() {
            let viewfinder = vf.play();
            if (viewfinder.ready) {
                child = viewfinder.transcoder;

                // Create iframe
                let iframe = document.createElement('iframe');
                iframe.src = 'http://127.0.0.1:2000/out';
                iframe.width = '100%';
                iframe.height = '100%';
                document.querySelector('#viewfinder').appendChild(iframe);

                log("iframe created");
            }
        },
        vf_close: function() {
            window.clearInterval(handler);
            vf.close();
            child.kill('SIGKILL');
        },
        trigger: function() { Shuttr.command('/shutter', {p: 1}) },
        stoprec: function() { Shuttr.command('/shutter', {p: 0}) }
    },
    power: {
        off: function() { Shuttr.command('/system/sleep') },
        on: function(cb) {
            wol.wake(platform.detect().getBssid(), {
                address: '10.5.5.9',
                port: 9
            }, (e) => {
                cb(e);
                if (e !== undefined)
                    log(e)
            });
        }
    },
    mode: {
        // Video
        video: function() { Shuttr.command('/sub_mode', {mode: 0, sub_mode: 0}) },
        vphoto: function() { Shuttr.command('/sub_mode', {mode: 0, sub_mode: 2}) },
        looping: function() { Shuttr.command('/sub_mode', {mode: 0, sub_mode: 3}) },

        // Photo
        photo: function() { Shuttr.command('/sub_mode', {mode: 1, sub_mode: 0}) },
        night: function() { Shuttr.command('/sub_mode', {mode: 1, sub_mode: 2}) },
        burst: function() { Shuttr.command('/sub_mode', {mode: 2, sub_mode: 0}) },
        continuous: function() { Shuttr.command('/sub_mode', {mode: 1, sub_mode: 1}) }, // Not on hero5

        // Timelapse
        timelapse: function() { Shuttr.command('/sub_mode', {mode: 2, sub_mode: 1}) },
        tl_video: function() { Shuttr.command('/sub_mode', {mode: 0, sub_mode: 1}) },
        nightlapse: function() { Shuttr.command('/sub_mode', {mode: 2, sub_mode: 2}) }
    }
}

module.exports = Shuttr;
