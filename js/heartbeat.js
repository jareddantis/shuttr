/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

// Logging
const l = require('./logger').log;
var log = function(msg) { l('heartbeat', msg) };

const listener = require('./stethoscope').respond;
const fn = require('./shuttr');
const http = require('http');

var counts = 0;
var delay = 2000;

var heart = {
    isAlive: false,
    regulator: null,
    test: function(onSuccess, onError) {
        this.isAlive = false;
        var req = this.beat();
        window.setTimeout(function(){
            if (heart.isAlive)
                onSuccess();
            else {
                // Terminate request past timeout
                log("Timeout reached but request failed, aborting");
                req.abort();
                onError();
            }
        }, 5000);
    },
    beat: function() {
        var req = http.request({
            host: '10.5.5.9',
            path: '/gp/gpControl/status'
        }, (res) => {
            var response = "";
            res.on('data', (chunk) => { response += chunk });
            res.on('end', function(){
                var data = JSON.parse(response);
                heart.isAlive = true;
                listener(data);
            });
        });
        req.end();
        return req;
    },
    start: function(onSuccess, onError) {
        log("Checking if host is reachable");

        this.test(function(){
            log("Host is reachable, starting heartbeat");
            heart.beat();
            heart.regulator = window.setInterval(heart.beat, 2000);
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
