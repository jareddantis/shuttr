/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

// Logging
const l = require('./logger').log;
var log = function(msg) { l('ui-buttons', msg) };

const hb = require('./heartbeat');
const fn = require('./shuttr');
const ants = require('./constants');
const query = require('./stethoscope').query;
const populateList = require('./ui-populate');

var prefs = {
    grid: 0, // disabled
    video: {
        res: 0, // 4k
        fps: 8, // 4k 24fps
        fov: 3, // 4k 24fps superview
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

// Flip boolean values and convert to 1/0
var flip = function(val) {
    return !val ? 1 : 0;
}

// On button click
var bindToButton = function(id, fn) { $('#' + id).click(fn) }

var init = function() {
    // Controls switcher
    $("#modeselect li:first-child").hover(function(){
        $("#modeselect .triangle").css("border-bottom-color", "#dab12e");
    }, function(){
        $("#modeselect .triangle").removeAttr("style");
    });

    // Power
    $('#pwr').click(function(){
        hb.test(function(){
            // Switch off
            $('.message').each(function(){ $(this).hide() });
            $('#msg_off').show();
            $('#msg_off .title').text("Turning camera off");
            $('#messages').fadeIn();
            fn.controls.vf_close();
            hb.stop();
            fn.power.off();
            $('#msg_off .title').text("Camera is off");
        }, function(){
            // Switch on
            $('#msg_off .title').text("Turning camera on");
            fn.power.on(function(){
                $('#messages').fadeOut();
            });
        });
    })

    // Start/stop recording
    bindToButton('shutter', function(){
        var busy = query.status('IS_BUSY');
        if (busy == 1) {
            fn.controls.stoprec();
            $('.shutter').removeClass("rolling");
        } else {
            fn.controls.trigger();
            if (query.status("CURRENT_MODE") == 0)
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

    /**********************
        Footage settings
    **********************/
    $('select[name=res]').on('change', function(){
        var val = parseInt($(this).val());
        fn.set(2, val);
        prefs.video.res = val;

        // Update available fps
        populateList(val);
    })
    $('select[name=fps]').on('change', function(){
        var val = parseInt($(this).val());
        prefs.video.fps = val;
        fn.set(3, val);

        // Update available FOVs
        populateList(null, val);
    })
    $('select[name=fov]').on('change', function(){
        var val = parseInt($(this).val());
        prefs.video.fov = val;
        fn.set(4, val);
    })

    /***************
        Controls
    ***************/
    // Protune master toggle
    $('#set_pro').click(function(){
        prefs[mode].pro = flip(prefs[mode].pro);
        var ptKey = ants[model].settings[mode].PROTUNE;
        fn.set(ptKey, prefs[mode].pro);

        if (prefs[mode].pro) {
            $(this).addClass("on");
            $("td.pt").each(function(){ $(this).removeClass("disabled") });
        } else {
            $(this).removeClass("on");
            $("td.pt").each(function(){ $(this).addClass("disabled") });
        }
    })

    // Stabilizer
    $("#set_stab").click(function(){
        prefs.video.stab = flip(prefs.video.stab);
        fn.set(ants[model].settings.video.STABILIZER, prefs.video.stab);
        if (prefs.video.stab)
            $(this).addClass("on")
        else
            $(this).removeClass("on");
    })

    // Auto low light
    $("#set_lolt").click(function(){
        prefs.video.lolt = flip(prefs.video.lolt);
        fn.set(ants[model].settings.video.LOWLIGHT, prefs.video.lolt);
        if (prefs.video.lolt)
            $(this).addClass("on")
        else
            $(this).removeClass("on");
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
};

module.exports.init = init;
