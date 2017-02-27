/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

const $ = require('jquery');
const fn = require('./shuttr');

var oldStatus = null, oldSettings = null, handle = null;
var debug = {
    clearStatus: function() {
        clearInterval(handle);
        handle = null;
        oldSettings = null;
        oldStatus = null;
        $('#status').empty();
        $('#settings').empty();
    },
    parseStatus: function() {
        if (handle === null) {
            handle = window.setInterval(function() {
                fn.system.getStatus(function(data){
                    var { status, settings } = JSON.parse(data);
                    $('#status').empty();
                    $('#settings').empty();

                    // Current system time
                    var timeArr = status[40].slice(1).split('%');
                    for (var i = 0; i < timeArr.length; i++)
                        timeArr[i] = (parseInt(timeArr[i], 16) < 10) ? '0' + parseInt(timeArr[i], 16) : parseInt(timeArr[i], 16);
                    status[40] = status[40] + " (" + timeArr.join('/') + ")";

                    // Compare old and new status
                    if (oldStatus == null) {
                        oldStatus = status;
                        for (var key in oldStatus) {
                            var oldContent = $('#status').html();
                            $('#status').html(oldContent + ", " + key + " = " + status[key]);
                        }
                    } else {
                        for (var key in status) {
                            var oldContent = $('#status').html();
                            if (oldStatus.hasOwnProperty(key) && status[key] != oldStatus[key])
                                $("#status").html(oldContent + ", <strong>" + key + " = " + status[key] + "</strong>");
                            else
                                $("#status").html(oldContent + ", " + key + " = " + status[key]);
                        }
                    }
                    if (oldSettings == null) {
                        oldSettings = settings;
                        for (var key in oldSettings) {
                            var oldContent = $('#settings').html();
                            $('#settings').html(oldContent + ", " + key + " = " + settings[key]);
                        }
                    } else {
                        for (var key in settings) {
                            var oldContent = $('#settings').html();
                            if (oldSettings.hasOwnProperty(key) && settings[key] != oldSettings[key])
                                $("#settings").html(oldContent + ", <strong>" + key + " = " + settings[key] + "</strong>");
                            else
                                $("#settings").html(oldContent + ", " + key + " = " + settings[key]);
                        }
                    }
                });
            }, 500);
        }
    }
}

module.exports = debug;