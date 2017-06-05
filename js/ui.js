/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

// Logging
const l = require(__dirname + '/js/logger').log;
var log = function(msg) { l('ui', msg) };

const $ = require('jquery');
const remote = require('electron').remote;
const fn = require(__dirname + '/js/shuttr');
const hb = require(__dirname + '/js/heartbeat');
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

// Update state from camera status
var refreshInfo = function(data) {
    // var status = data.status, settings = data.settings;
    // // Resolution, fps, fov
    // $('select[name=res]').val(settings['2']).change();
    // $('select[name=fps]').val(settings['3']).change();
    // $('select[name=fov]').val(settings['4']).change();
}

// Init
$("#msg_err").hide();
var init = function(){
    fn.init(model, function(){
        // On success
        $('#messages').fadeOut();
        fn.controls.vf_init();
        $('#overlays').removeClass("hidden");

        // TODO: Populate settings
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

    /*****************
        Resolution
    *****************/
    var populate = function(dropdown, value, text, isDefault) {
        var option = $('<option>').attr('value',value).text(text);
        if (typeof isDefault !== undefined && isDefault)
            $(option).attr('selected', true);
        $('select[name='+dropdown+']').append(option);
    };
    // Disable FOV
    var disable = function(option) {
        $('select[name=fov] option[value=' + option + ']').attr('disabled', 'disabled');
    }
    // Enable FOV
    var enable = function(option) {
        $('select[name=fov] option[value=' + option + ']').removeAttr('disabled');
    }
    // Select FOV
    var select = function(option) {
        $('select[name=fov]').val(option);
        fn.set(4, option);
    }
    $('select[name=res]').on('change', function(){
        var val = parseInt($(this).val());
        fn.set(2, val);
        prefs.video.res = val;
        $('#stat_res').text($('select[name=res] option[value=' + val + ']').text());

        // Update available fps
        $('select[name=fps]').empty();
        $('select[name=fov] option').each(function(){ $(this).removeAttr('disabled') });
        switch (val) {
            case 1: // 4k, wide (supr 24)
                fn.set(3,8);
                populate('fps', 8, 30, true);
                populate('fps', 9, 24);
                select(0);
                disable(1);
                disable(2);
                disable(3);
                disable(4);
                break;
            case 4: // 2.7k, no supr/nar
                fn.set(3,0);
                populate('fps', 0, 60, true);
                populate('fps', 6, 48);
                populate('fps', 8, 30);
                populate('fps', 9, 24);
                select(0);
                disable(3);
                disable(2);
                break;
            case 6: // 2.7k 4:3, wide only
                fn.set(3,0);
                populate('fps', 0, 30, true);
                select(0);
                disable(3);
                disable(1);
                disable(2);
                disable(4);
                break;
            case 7: // 1440p, wide only
                fn.set(3,0);
                populate('fps', 0, 80, true);
                populate('fps', 5, 60);
                populate('fps', 6, 48);
                populate('fps', 8, 30);
                populate('fps', 9, 24);
                select(0);
                disable(3);
                disable(1);
                disable(2);
                disable(4);
                break;
            case 9: // 1080p, all present
                fn.set(3,0);
                populate('fps', 0, 120, true); // wide, narrow
                populate('fps', 2, 90); // wide
                populate('fps', 4, 80); // supr only
                populate('fps', 5, 60); 
                populate('fps', 6, 48);
                populate('fps', 8, 30);
                populate('fps', 9, 24);
                select(0);
                disable(3);
                disable(1);
                disable(4);
                break;
            case 10: // 960p, wide only
                fn.set(3,0);
                populate('fps', 0, 120, true);
                populate('fps', 2, 60);
                select(0);
                disable(3);
                disable(1);
                disable(2);
                disable(4);
                break;
            case 12: // 720p, no lin
                fn.set(3,0);
                populate('fps', 0, 240, true); // nar only
                populate('fps', 1, 120);
                populate('fps', 2, 100); // supr only
                populate('fps', 3, 60);
                populate('fps', 6, 30); // no supr
                select(2);
                disable(0);
                disable(1);
                disable(3);
                disable(4);
                break;
            case 13: // 480p, wide only
                fn.set(3,0);
                populate('fps', 0, 240, true);
                select(0);
                disable(3);
                disable(1);
                disable(2);
                disable(4);
                break;
        }
    })
    $('select[name=fps]').on('change', function(){
        var val = parseInt($(this).val());
        prefs.video.fps = val;
        fn.set(3, val);
        $('#stat_fps').text($('select[name=fps] option[value=' + val + ']').text());

        // Update available FOVs
        var res = parseInt($('select[name=res]').val());
        $('select[name=fov] option').each(function(){ $(this).removeAttr('disabled') });
        switch (res) {
            case 1: // 4k
                if (val == 9) { // 24fps supr, wide
                    enable(3);
                    select(3);
                } else { // 30fps supr only
                    disable(3);
                    select(0);
                }
                break;
            case 9: // 1080p
                switch (val) {
                    case 0: // 120fps wide, narr
                        disable(3);
                        disable(1);
                        disable(4);
                        select(0);
                        break;
                    case 2: // 90fps wide only
                        disable(3);
                        disable(1);
                        disable(2);
                        disable(4);
                        select(0);
                        break;
                    case 4: // 80fps supr only
                        disable(0);
                        disable(1);
                        disable(2);
                        disable(4);
                        select(3);
                        break;
                    default: // use supr for everything else
                        select(3);
                }
                break;
            case 12: // 720p
                switch (val) {
                    case 0: // 240fps narr only
                        disable(0);
                        disable(1);
                        disable(2);
                        disable(3);
                        select(4);
                        break;
                    case 1: // 120fps supr wide med narr
                    case 3: // 60fps supr wide med narr
                        disable(4);
                        select(3);
                        break;
                    case 2: // 100fps supr only
                        disable(0);
                        disable(1);
                        disable(2);
                        disable(4);
                        select(3);
                        break;
                    case 6: // 30fps wide med narr
                        disable(0);
                        disable(1);
                        disable(2);
                        select(3);
                        break;
                }
                break;
            default: // wide is available for everything
                select(0);
        }
    })
    $('select[name=fov]').on('change', function(){
        var val = parseInt($(this).val());
        prefs.video.fov = val;
        fn.set(4, val);
        $('#stat_fov').text($('select[name=fov] option[value=' + val + ']').text());
    })

    /***************
        Controls
    ***************/

    // Protune
    $('#set_pro').click(function(){
        prefs[mode].pro = !prefs[mode].pro;
        if (prefs[mode].pro) {
            $(this).text("on");
            $("td.pt").each(function(){ $(this).removeClass("disabled") });
        } else {
            $(this).text("off");
            $("td.pt").each(function(){ $(this).addClass("disabled") });
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
        fn.set(78, prefs.video.stab);
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