/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

const http = require('http');
const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const exec = require('child_process').exec;
const ip = '10.5.5.9';
const port = '8554';
const msg = Buffer.from('_GPHD_:0:0:2:0.000000\n');

// Detect OS and change ffplay binary as needed
var ffbin = require('app-root-dir').get() + '/ffplay/';
if (process.platform == 'darwin')
    ffbin += 'ffplay-darwin';
else if (process.platform == 'win32') {
    if (process.arch == 'x64')
        ffbin += 'ffplay-win64.exe';
    else
        ffbin += 'ffplay-win32.exe';
} else
    console.log("Only Mac and Windows are supported, sorry");

var viewfinder = {
    open: function(callback){
        console.log('opening');
        if (typeof callback !== "function")
            console.log("error: viewfinder.open() requires a callback");
        http.request({
            host: ip,
            path: '/gp/gpControl/execute?p1=gpStream&c1=restart'
        }, (response) => {
            response.on('end', () => true);
            callback(client);
        }).end();
    },
    close: function() {
        http.request({
            host: ip,
            path: '/gp/gpControl/execute?p1=gpStream&c1=stop'
        }, (response) => {
            response.on('end', () => true);
        }).end();
    },
    play: function() {
        var args = [
            '-an',
            '-fflags', 'nobuffer',
            '-f:v', 'mpegts',
            '-probesize', '8192',
            'rtp://' + ip + ':' + port
        ];
        var ffmpeg = exec(ffbin + ' ' + args.join(' '));
        ffmpeg.stdout.on('data', data => { console.log('[ffplay] ' + data) });
    },
    keepAlive: function() {
        client.send(msg, port, ip, (e) => { if (e !== null) console.log(e) });
    }
}

module.exports = viewfinder;