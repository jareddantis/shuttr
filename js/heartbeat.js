/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

// Logging
const l = require('./logger').log;
var log = function(msg) { l('heartbeat', msg) };

const $ = require('jquery');
const fn = require('./shuttr');
const http = require('http');
const ping = require('ping');

var oldStatus = null, oldSettings = null, handle = null;
var opts = { host: '10.5.5.9', path: '/gp/gpControl/status' };
var counts = 0;
var delay = 2000;
var beacon = null;

var heartbeat = {
    test: function() {
        http.get({
            host: '10.5.5.9', 
            port: '80' 
        }, function(res) {
            log("success", res);
        }).on("error", function(e) {
            log("failure", e);
        });
    },
    start: function(callback, beatlistener) {
        var isAlive = false;
        var beat = function() {
            http.request(opts, (res) => {
                response = "";
                res.on('data', (chunk) => { response += chunk });
                res.on('end', function(){
                    var data = JSON.parse(response);
                    isAlive = true;
                    beatlistener(data);
                });
            }).end();
        };
        var response = "";
        
        log("Checking if host is reachable");
        beat();
        window.setTimeout(function(){
            if (isAlive) {
                log("Host is reachable, starting regular ping");
                beacon = window.setInterval(beat, 1000);
            } else
                log("Host http://10.5.5.9/ is unreachable");
            callback(isAlive);
        }, 5000);
    },
    restart: function(err){
        counts = 0;
        this.start(err);
    },
    const: require('./constants').HeroFive.status,
    get: function(id) {
        var key = this.const[id];
        var value = this.currentStatus[key];
        return value;
    }
}

module.exports = heartbeat;