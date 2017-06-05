/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

var logger = {
    enabled: true,
    log: (src, msg) => {
        console.log('[' + src + '] ' + msg);
    }
}

module.exports = logger;