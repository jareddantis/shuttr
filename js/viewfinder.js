/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

const http = require('http');
const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const spawn = require('child_process').spawn;
const ws = require('ws');
const socketserver = ws.Server;
const express = require('express');

const GOPRO_IP = '10.5.5.9';
const GOPRO_PORT = '8554';
const PREVIEW_PORT = 2000;
const WS_PORT = 2001;
let websocket = new socketserver({ port: WS_PORT });
let server = express();

// Detect OS and change ffplay binary as needed
var ffbin = require('app-root-dir').get() + '/bin/';
if (process.platform == 'darwin')
    ffbin += 'ffmpeg-darwin';
else if (process.platform == 'win32') {
    if (process.arch == 'x64')
        ffbin += 'ffmpeg-win64.exe';
    else
        ffbin += 'ffmpeg-win32.exe';
} else
    console.error("[viewfinder] Only Mac and Windows are supported, sorry");

var viewfinder = {
    open: function(callback){
        console.log('[viewfinder] opening');
        if (typeof callback !== "function")
            console.error("viewfinder.open() requires a callback");
        http.request({
            host: GOPRO_IP,
            path: '/gp/gpControl/execute?p1=gpStream&c1=restart'
        }, (response) => {
            response.on('end', () => true);
            callback(client);
        }).end();
    },
    close: function() {
        http.request({
            host: GOPRO_IP,
            path: '/gp/gpControl/execute?p1=gpStream&c1=stop'
        }, (response) => {
            response.on('end', () => true);
        }).end();
    },
    play: function() {
        // Adapted from @citolen's goproh4 project
        // Create a WebSocket
        websocket.on('connection', (socket) => {
            console.log("[viewfinder] socket connected");

            let header = new Buffer(8);
            header.write('jsmp');
            header.writeUInt16BE(800, 4);
            header.writeUInt16BE(600, 6);
            socket.send(header, { binary: true });

            socket.on('close', (e, m) => {
                console.log("[viewfinder] socket disconnected with e = " + e + ", m = \"" + m + "\"");
            })
        })
        websocket.broadcast = (d,o) => {
            websocket.clients.forEach((client) => {
                if (client.readyState == ws.OPEN)
                    client.send(d,o);
                else
                    console.error("[viewfinder] client " + client + " not connected (readyState = " + client.readyState + ")");
            });
        }

        // Serve video using Express
        server.post("/in", (req, res) => {
            console.log("[viewfinder] stream connected @ " + req.socket.remoteAddress + ":" + req.socket.remotePort);
            req.socket.setTimeout(0);
            req.on('data', (data) => {
                console.log
                websocket.broadcast(data, {binary: true});
            });
        })
        server.use("/out", express.static(require('app-root-dir').get() + "/viewfinder"))
        server.listen(PREVIEW_PORT);

        // Transcode H.264 UDP stream to MPEG2 format
        const transcode = () => {
            let ffmpeg = spawn(ffbin, [
                //"-loglevel", "16",
                "-f", "mpegts",
                "-i", "udp://" + GOPRO_IP + ":" + GOPRO_PORT,
                "-f", "mpeg1video",
                "-s", "800x600",
                "-b", "1000k",
                "-r", "30",
                "http://127.0.0.1:2000/in"
            ])
            ffmpeg.stdout.pipe(process.stdout)
            ffmpeg.stderr.pipe(process.stdout)
            ffmpeg.on('exit', (e) => {
                console.log("[viewfinder] ffmpeg process ended with code " + e);
            })
            return ffmpeg;
        }

        // Display frame on webpage
        return {
            ready: true,
            transcoder: transcode()
        };
    },
    stop: function() {
        
    },
    keepAlive: function() {
        var msg = Buffer.from('_GPHD_:0:0:2:0.000000\n');
        client.send(msg, GOPRO_PORT, GOPRO_IP, (e) => {
            if (e !== null) console.log(e)
        });
    }
}

module.exports = viewfinder;