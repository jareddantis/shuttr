/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

const $ = require('jquery');
const remote = require('electron').remote;
const fn = require(__dirname + '/js/shuttr');
const hb = require(__dirname + '/js/heartbeat');
let model = "Hero5";

var mode = "video";
var prefs = {
    grid: 0, // disabled
    video: {
        pro: 1, // on
        pt: {
            color: 0, // GoPro
            wb: 0, // auto
            iso: 9, // auto (SEPARATE KEY IN CONSTANTS)
            shut: 8, // 1/60s
            ev: 4, // off
            shrp: 0, // hi
            rawaud: 3 // off
        },
        lolt: 0, // off
        stab: 0, // off
        aud: 2, // auto
    },
    photo: {
        pro: 0, // off
        pt: {
            color: 0, // GoPro
            wb: 0, // auto
            isomin: 3, // 100
            isomax: 0, // 800
            ev: 4, // off
            shrp: 0, // hi
        },
        raw: 0, // off
        wdr: 0 // off
    }
};

// Init
$("#msg_err").hide();
var init = function(){
    fn.init(function(){
        // On success
        $('#messages').fadeOut();
        fn.controls.vf_init();
        $('#overlays').removeClass("hidden");
    }, function(){
        // On error
        $('.message').each(function(){ $(this).hide() });
        $('#msg_err .errTitle').text("Unable to connect");
        $('#msg_err .errBody').html("Make sure that you are connected to your camera via Wi-Fi.<br><br>If you are connected to your camera,<br>we will also try turning it on remotely.");
        $('#msg_err').show();
    });
};
$('#msg_err button').click(function(){
    $("#msg_err").hide();
    $("#msg_con .conStat").text("hey");
    $("#msg_con").show();
    fn.power.on(function(e){
        if (typeof e !== "undefined") {
            $("#msg_con").hide();
            $('#msg_err .errTitle').text("Error turning camera on");
            $('#msg_err .errBody').text(e);
            $("#msg_err").show();
        } else
            window.setTimeout(init, 5000);
    });
});
init();

// Controls switcher
var defaultState = "video";
$("#modeselect li:first-child").hover(function(){
    $("#modeselect .triangle").css("border-bottom-color", "#dab12e");
}, function(){
    $("#modeselect .triangle").removeAttr("style");
});

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

// Buttons
var bindToButton = function(id, fn) { $('#' + id).click(fn) }
$(function(){
    // Platform-specific styles
    $('body').addClass(process.platform);

    // Power
    bindToButton('sys_pwr_on', fn.power.on);
    bindToButton('sys_pwr_off', fn.power.off);

    // Viewfinder
    bindToButton('vf_init', fn.controls.vf_init);

    // Start/stop recording
    bindToButton('shutter', function(){
        var busy = hb.get("IS_BUSY");
        if (busy == 1) {
            fn.controls.stoprec();
            $('.shutter').removeClass("rolling");
        } else {
            fn.controls.trigger();
            if (hb.get("CURRENT_MODE") == 0)
                $('.shutter').addClass("rolling");
        }
    });

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
    $("#modeselect li").click(function(){
        var mode = $(this).text();
        $('#stat_mode').text(mode);
    })

    /***************
        Controls
    ***************/

    // Protune
    $('#set_pro').click(function(){
        prefs.pt = !prefs.pt;
        if (prefs.pt) {
            $(this).text("on");
            $("td.pt").each(function(){ $(this).removeClass("disabled")});
        } else {
            $(this).text("off");
            $("td.pt").each(function(){ $(this).addClass("disabled")});
        }
    })

    // Grid
    $('#set_grid').click(function(){
        prefs.grid++;
        if (prefs.grid == 3)
            prefs.grid = 0;

        switch (prefs.grid) {
            case 0:
                $(this).text("off");
                $('#overlays > div').each(function(){ $(this).addClass("hidden") });
                break;
            case 1:
                $(this).text("thirds");
                $("#overlays .quadgrid").addClass("hidden");
                $("#overlays .thirdgrid").removeClass("hidden");
                break;
            case 2:
                $(this).text("quads");
                $("#overlays .thirdgrid").addClass("hidden");
                $("#overlays .quadgrid").removeClass("hidden");
                break;
        }
    })

    // Stabilizer
    $("#set_stab").click(function(){
        prefs.video.stab = !prefs.video.stab;
        if (prefs.video.stab)
            $(this).text("on")
        else
            $(this).text("off");
    })

    // Auto low light
    $("#set_lolt").click(function(){
        prefs.video.lolt = !prefs.video.lolt;
        if (prefs.video.lolt)
            $(this).text("on")
        else
            $(this).text("off");
    })
});