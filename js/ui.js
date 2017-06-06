/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

// Logging
const l = require(__dirname + '/js/logger').log;
var log = function(msg) { l('ui', msg) };

const $ = require('jquery');
const fn = require(__dirname + '/js/shuttr');
const hb = require(__dirname + '/js/heartbeat');
const ants = require(__dirname + '/js/constants');
const {BrowserWindow, app} = require('electron').remote;
var win = BrowserWindow;
let model = "HeroFive";
var mode = "video";

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

// Handle window close and ctrl + c
var cleanup = function() {
    log("Terminating heartbeat and stopping viewfinder");
    heart.stop();
    fn.controls.vf_close();
    log("Quitting");
    if (win) {
        win.destroy();
        win = null;
    }
    app.quit();
}
app.on('ready', () => {
    win.on('closed', (e) => {
        e.preventDefault();
        cleanup();
    })
})
window.onbeforeunload = cleanup;

// Update state from camera status
var state = {};
var refreshInfo = function(data) {
    state = {
        status: data.status,
        settings: data.settings
    };
    var ref = {
        status: ants[model].status,
        settings: ants[model].settings
    };

    /****************************
        Update changed values
    ****************************/

    /* Video resolution, fps, fov, stabilizer, auto low light */
    // Populate lists
    var newRes = data.settings[ref.settings.video.RESOLUTION],
        resChanged = newRes != parseInt($('select[name=res]').val()),
        newFps = data.settings[ref.settings.video.FRAME_RATE],
        fpsChanged = newFps != parseInt($('select[name=fps]').val()),
        newFov = data.settings[ref.settings.video.FOV],
        fovChanged = newFov != parseInt($('select[name=fov]').val());
    if (resChanged || fpsChanged) {
        populateList(newRes, newFps);

        // Disable stabilizer on 4k and framerates above 60
        if (newRes == 1 || newFps < 5)
            $('#set_stab').removeClass('on').addClass('disabled');
        else {
            $('#set_stab').removeClass('disabled');
            if (parseInt(data.settings[ref.settings.video.STABILIZER]))
                $('#set_stab').addClass('on');
            else
                $('#set_stab').removeClass('on');
        }
        // Disable auto low light on framerates below 48
        if (newFps > 7)
            $('#set_lolt').removeClass('on').addClass('disabled');
        else {
            $('#set_lolt').removeClass('disabled');
            if (parseInt(data.settings[ref.settings.video.LOWLIGHT]))
                $('#set_lolt').addClass('on');
            else
                $('#set_lolt').removeClass('on');
        }
    }

    // Update dropdowns
    if (resChanged) $('select[name=res]').val(newRes);
    if (fpsChanged) $('select[name=fps]').val(newFps);
    if (fovChanged)$('select[name=fov]').val(newFov);

    // Update HUD for res, fov, and fps
    var oldStr = $('#stat_res').text(), newStr = $('select[name=res] option[value=' + newRes + ']').text();
    if (oldStr != newStr)
        $('#stat_res').text($('select[name=res] option[value=' + newRes + ']').text());
    oldStr = $('#stat_fps').text(), newStr = $('select[name=fps] option[value=' + newFps + ']').text() + 'FPS';
    if (oldStr != newStr)
        $('#stat_fps').text(newStr);
    oldStr = $('#stat_fov').text(), newStr = $('select[name=fov] option[value=' + newFov + ']').attr('data-abbr');
    if (oldStr != newStr)
        $('#stat_fov').text(newStr);

    // Storage space
    oldStr = parseInt($('#stat_sd').attr('data-secs'));
    var remain = $('#stat_sd').attr('class') == "video" ? data.status[ref.status.REMAINING_VIDEO] : data.status[ref.status.REMAINING_PHOTO];
    if (oldStr != parseInt(remain)) {
        var d = new Date(null);
        d.setSeconds(parseInt(remain));
        var i = d.toISOString().substr(11,8), // hh:mm:ss
            r = i.split(':');         // [hh, mm, ss]
        newStr = r[0] + 'h ' + r[1] + 'm ' + r[2] + 's';
        $('#stat_sd').attr('data-secs',remain).text(newStr);
    }

    // Battery percentage
    oldStr = $('#stat_bat').text(), newStr = data.status[ref.status.INTERNAL_BATT_PERCENT] + '%';
    if (oldStr != newStr)
        $('#stat_bat').text(newStr);
};
var query = {
    status: function(id) {
        var key = ants[model].status[id];
        return state.status[key];
    },
    setting: function(category,id) {
        var key = ants[model].settings[category][id];
        return state.settings[key];
    }
};

// Init
$("#msg_err").hide();
$("#msg_off").hide();
var init = function(){
    fn.init(model, function(){
        // Create viewfinder iframe
        $('#messages').fadeOut();
        $('#pwr').removeClass('disabled');
        $('#controls').removeClass('disabled');
        fn.controls.vf_init(function(){
            var iframe = $('<iframe>').attr('src', 'http://127.0.0.1:2000/out');
            $(iframe).attr('width', '100%').attr('height', '100%');
            $('#overlays').removeClass("hidden");
            $('#viewfinder').append(iframe);
        });
    }, function(){
        // On error
        $('.message').each(function(){ $(this).hide() });
        $('#msg_err .errTitle').text("Unable to connect");
        $('#msg_err .errBody').html("Make sure that you are connected to your camera via Wi-Fi.<br><br>If you are connected to your camera,<br>we will also try turning it on remotely.");
        $('#msg_err').show();
    }, refreshInfo);
};
$('#msg_err button').click(function(){
    $("#msg_err").hide();
    $("#msg_con .conStat").text("Trying to connect again");
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

// Flip boolean values and convert to 1/0
var flip = function(val) {
    return !val ? 1 : 0;
}

// Populate lists
var populateList = function(r,f) {
    var populate = function(dropdown, value, text) {
        var option = $('<option>').attr('value',value).text(text);
        $('select[name='+dropdown+']').append(option);
    }
    var disableFPS = function(options) {
        for (var i = 0; i < options.length; i++)
            $('select[name=fps] option[value=' + options[i] + ']').attr('disabled', 'disabled');
    }
    var disableFOV = function(option) {
        $('select[name=fov] option[value=' + option + ']').attr('disabled', 'disabled');
    }
    var enableFOV = function(option) {
        $('select[name=fov] option[value=' + option + ']').removeAttr('disabled');
    }
    var selectFOV = function(option) {
        $('select[name=fov]').val(option);
        fn.set(4, option);
    }
    var res = (typeof r !== undefined && r !== null) ? r : parseInt($('select[name=res]').val()),
        val = (typeof f !== undefined && f !== null) ? f : parseInt($('select[name=fps]').val());

    $('select[name=fps] option').each(function(){ $(this).removeAttr('disabled') });
    $('select[name=fov] option').each(function(){ $(this).removeAttr('disabled') });
    switch (res) {
        case 1: // 4k
            disableFPS([0,1,2,3,4,5,7]);
            disableFOV(1);
            disableFOV(2);
            disableFOV(4);
            if (val == 10) { // 24fps supr, wide
                enableFOV(3);
                selectFOV(3);
            } else { // 30fps supr only
                disableFOV(3);
                selectFOV(0);
            }
            break;
        case 4: // 2.7k, no supr/nar
            disableFPS([0,1,2,3,4]);
            disableFOV(3);
            disableFOV(2);
            break;
        case 6: // 2.7k 4:3, wide only
            disableFPS([0,1,2,3,4,5,7,10]);
            disableFOV(3);
            disableFOV(1);
            disableFOV(2);
            disableFOV(4);
            break;
        case 7: // 1440p, wide only
            disableFPS([0,1,2,3]);
            disableFOV(3);
            disableFOV(1);
            disableFOV(2);
            disableFOV(4);
            break;
        case 9: // 1080p
            disableFPS([0,2]);
            switch (val) {
                case 1: // 120fps wide, narr
                    disableFOV(3);
                    disableFOV(1);
                    disableFOV(4);
                    selectFOV(0);
                    break;
                case 3: // 90fps wide only
                    disableFOV(3);
                    disableFOV(1);
                    disableFOV(2);
                    disableFOV(4);
                    selectFOV(0);
                    break;
                case 4: // 80fps supr only
                    disableFOV(0);
                    disableFOV(1);
                    disableFOV(2);
                    disableFOV(4);
                    selectFOV(3);
                    break;
                default: // use supr for everything else
                    selectFOV(3);
            }
            break;
        case 10: // 960p, wide only
            disableFPS([0,2,3,4,7,8,10]);
            disableFOV(3);
            disableFOV(1);
            disableFOV(2);
            disableFOV(4);
            break;
        case 12: // 720p, no lin
            disableFPS([3,4,7,10]);
            disableFOV(4);
            switch (val) {
                case 0: // 240fps narr only
                    disableFOV(0);
                    disableFOV(1);
                    disableFOV(4);
                    disableFOV(3);
                    selectFOV(2);
                    break;
                case 1: // 120fps supr wide med narr
                case 5: // 60fps supr wide med narr
                    disableFOV(4);
                    selectFOV(3);
                    break;
                case 2: // 100fps supr only
                    disableFOV(0);
                    disableFOV(1);
                    disableFOV(2);
                    disableFOV(4);
                    selectFOV(3);
                    break;
                case 8: // 30fps wide med narr
                    disableFOV(3);
                    selectFOV(0);
                    break;
            }
            break;
        case 17: // 480p, wide only
            disableFPS([1,2,3,4,5,7,8,10]);
            disableFOV(3);
            disableFOV(1);
            disableFOV(2);
            disableFOV(4);
            break;
    }
}

// Buttons
var bindToButton = function(id, fn) { $('#' + id).click(fn) }
$(function(){
    // Platform-specific styles
    $('body').addClass(process.platform);

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
});