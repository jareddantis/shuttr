/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

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
            console.log("success", res);
        }).on("error", function(e) {
            console.log("failure", e);
        });
    },
    start: function(cb) {
        var isAlive = false;
        var beat = function() {
            http.request(opts, (res) => {
                response = "";
                res.on('data', (chunk) => { response += chunk });
                res.on('end', function(){
                    var data = JSON.parse(response);
                    heartbeat.currentStatus = data.status;
                    heartbeat.currentSettings = data.settings;
                    isAlive = true;
                });
            }).end();
        };
        var response = "";
        
        console.log("[heartbeat] Checking if host is reachable");
        beat();
        window.setTimeout(function(){
            if (isAlive) {
                console.log("[heartbeat] Host is reachable, starting regular ping");
                beacon = window.setInterval(beat, 1000);
            } else
                console.log("[heartbeat] Host http://10.5.5.9/ is unreachable");
            cb(isAlive);
        }, 5000);
    },
    restart: function(err){
        counts = 0;
        this.start(err);
    },
    currentStatus: {},
    currentSettings: {},
    const: require('./constants').HeroFive.status,
    get: function(id) {
        var key = this.const[id];
        var value = this.currentStatus[key];
        return value;
    }
}

module.exports = heartbeat;