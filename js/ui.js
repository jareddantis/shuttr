/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

const $ = require('jquery');
const fn = require(__dirname + '/js/fn');
const constants = require(__dirname + '/js/constants');
const dbg = require(__dirname + '/js/heartbeat');
let model = "Hero5";

// Buttons
var bindToButton = function(id, fn) { $('#' + id).click(fn) }
$(function(){
    // Power
    bindToButton('sys_pwr_on', fn.power.on);
    bindToButton('sys_pwr_off', fn.power.off);

    // Debugging
    bindToButton('sys_getstatus', dbg.parseStatus);
    bindToButton('sys_clrstatus', dbg.clearStatus);

    // Start/stop recording
    bindToButton('sys_trigger', fn.controls.trigger);
    bindToButton('sys_stop_rec', fn.controls.stoprec);

    // Switch modes
    bindToButton('mode_video_normal', fn.mode.video);
    bindToButton('mode_video_timelapse', fn.mode.tl_video);
    bindToButton('mode_video_vphoto', fn.mode.vphoto);
    bindToButton('mode_video_looping', fn.mode.looping);
    bindToButton('mode_photo_normal', fn.mode.photo);
    bindToButton('mode_photo_cont', fn.mode.continuous);
    bindToButton('mode_photo_night', fn.mode.night);
    bindToButton('mode_multi_burst', fn.mode.burst);
    bindToButton('mode_multi_timelapse', fn.mode.timelapse);
    bindToButton('mode_multi_nightlapse', fn.mode.nightlapse);
});