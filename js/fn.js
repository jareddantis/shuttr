/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

const { ajax } = require('jquery');
const plat = require('./platform');
const wol = require('node-wol');

var shuttr = {
    system: {
        getStatus: function(callback) { get('status', {}, callback) }
    },
    controls: {
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
    loc = 'http://10.5.5.9/gp/gpControl/' + loc;
    data = (typeof data !== undefined) ? data : {};
    var response = "";
    ajax({
        url: loc,
        method: 'GET',
        data: data
    }).done(function(d){
        if (typeof cb === "function")
            cb(d);
    });
}

module.exports = shuttr;