/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

const exec = require('child_process').execSync;

var Platforms = {
    DARWIN: {
        getBssid: function() {
            var cmd = "system_profiler SPNetworkDataType | grep RouterHardwareAddress | sed 's/.*RouterHardwareAddress=//'";
            var code = exec(cmd), bssid = "";
            for (var i = 0; i < code.length - 1; i++)    // The last character is a newline
                bssid += String.fromCharCode(code[i]);
            return bssid;
        }
    }
}

module.exports = Platforms;