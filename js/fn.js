/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

const http = require('http');
const wol = require('node-wol');
const plat = require('./platform');
const vf = require('./viewfinder');

var handler = null;
var shuttr = {
    system: {
        getStatus: function(callback) { get('status', {}, callback) }
    },
    controls: {
        vf_open: function() {
            console.log('open vf');
            vf.open(function(dgramClient){
                console.log(dgramClient);
                handler = window.setInterval(vf.keepAlive, 2500);
            });
        },
        vf_play: function() {
            vf.play()
        },
        vf_close: function() {
            console.log('close vf');
            window.clearInterval(handler);
            vf.close();
        },
        trigger: function() { command('shutter', {p: 1}) },
        stoprec: function() { command('shutter', {p: 0}) }
    },
    power: {
        off: function() { command('system/sleep') },
        on: function() {
            wol.wake(plat.DARWIN.getBssid(), {
                address: '10.5.5.9',
                port: 9
            }, function(e) { console.log(e) });
        }
    },
    mode: {
        // Video
        video: function() { command('sub_mode', {mode: 0, sub_mode: 0}) },
        vphoto: function() { command('sub_mode', {mode: 0, sub_mode: 2}) },
        looping: function() { command('sub_mode', {mode: 0, sub_mode: 3}) },

        // Photo
        photo: function() { command('sub_mode', {mode: 1, sub_mode: 0}) },
        night: function() { command('sub_mode', {mode: 1, sub_mode: 2}) },
        burst: function() { command('sub_mode', {mode: 2, sub_mode: 0}) },
        continuous: function() { command('sub_mode', {mode: 1, sub_mode: 1}) }, // Not on hero5

        // Timelapse
        timelapse: function() { command('sub_mode', {mode: 2, sub_mode: 1}) },
        tl_video: function() { command('sub_mode', {mode: 0, sub_mode: 1}) },
        nightlapse: function() { command('sub_mode', {mode: 2, sub_mode: 2}) }
    }
}

var command = function(cmd, data) {
    get('command/' + cmd, data);
}
var get = function(loc, data, cb) {
    var host = '10.5.5.9',
        path = '/gp/gpControl/' + loc,
        response = "";

    // Encode data object as GET url
    if (typeof data !== undefined) {
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
}

module.exports = shuttr;