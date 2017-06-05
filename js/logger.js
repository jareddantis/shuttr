/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

const fs = require('fs');

var logger = {
    enabled: true,
    writeToFile: true,
    filename: (function(){
        var o = new Date(),
            y = o.getFullYear(),
            m = o.getMonth(),
            d = o.getDate(),
            hh = o.getHours(),
            mm = o.getMinutes();
        // Prepend zero to values less than 10
        m = m < 10 ? '0' + m : m;
        d = d < 10 ? '0' + d : d;
        hh = hh < 10 ? '0' + hh : hh;
        mm = mm < 10 ? '0' + mm : mm;
        
        return 'shuttrlog_' + y + '-' + m + '-' + d + '_' + hh + '-' + mm + '.txt';
    })(),
    log: (src, msg) => {
        var entry = '[' + src + '] ' + msg;
        console.log(entry);
        if (logger.writeToFile) {
            var f = logger.filename;
            fs.appendFile(f, entry + '\n', (e) => {
                if (e) {
                    throw e;
                    console.error("error writing to log: " + e);
                }
            });
        }
    }
}

module.exports = logger;