/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

const $ = require('jquery');
const remote = require('electron').remote;
const fn = require(__dirname + '/js/shuttr');
const dbg = require(__dirname + '/js/heartbeat');
let model = "Hero5";

// Fullscreen
let globalWin = remote.getCurrentWindow();
globalWin.on('enter-full-screen', (e) => {
    if (typeof e !== null)
        console.log(e);
    $('body').addClass('fullscreen');
});
globalWin.on('leave-full-screen', (e) => {
    if (typeof e !== null)
        console.log(e);
    $('body').removeClass('fullscreen');
});

// Loader
$(function(){
    fn.init();
    window.setTimeout(() => { $('#intro').fadeOut() }, 500);
    window.setTimeout(() => { $('.hud').removeClass('hidden') }, 1000);
    window.setTimeout(() => { $('#viewfinder').animate({opacity: '1'}) }, 2000);
})

// Buttons
var bindToButton = function(id, fn) { $('#' + id).click(fn) }
$(function(){
    // Platform-specific styles
    $('body').addClass(process.platform);

    // Power
    bindToButton('sys_pwr_on', fn.power.on);
    bindToButton('sys_pwr_off', fn.power.off);

    // Viewfinder
    bindToButton('vf_open', fn.controls.vf_open);
    bindToButton('vf_play', fn.controls.vf_play);
    bindToButton('vf_close', fn.controls.vf_close);

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