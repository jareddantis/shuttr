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

var heart = {
    isAlive: false,
    regulator: null,
    test: function(onSuccess, onError) {
        this.isAlive = false;
        this.beat(new Function());
        window.setTimeout(function(){
            if (heart.isAlive)
                onSuccess();
            else
                onError();
        }, 5000);
    },
    beat: function(listener) {
        http.request(opts, (res) => {
            var response = "";
            res.on('data', (chunk) => { response += chunk });
            res.on('end', function(){
                var data = JSON.parse(response);
                heart.isAlive = true;
                listener(data);
            });
        }).end();
    },
    start: function(onSuccess, onError, beatlistener) {
        log("Checking if host is reachable");

        this.test(function(){
            log("Host is reachable, starting heartbeat");
            heart.beat(beatlistener);
            heart.regulator = window.setInterval(function(){
                heart.beat(beatlistener);
            }, 2000);
        }, function(){
            log("Host http://10.5.5.9/ is unreachable");
        })

        window.setTimeout(function(){
            if (heart.isAlive)
                onSuccess();
            else
                onError();
        }, 5000);
    },
    stop: function(){
        window.clearInterval(this.regulator);
    }
}

module.exports = heart;