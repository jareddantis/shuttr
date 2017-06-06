/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

// Logging
const l = require('./logger').log;
var log = function(msg) { l('stetho', msg) };

const $ = require('jquery');
const ants = require('./constants');
const populateList = require('./ui-populate');

var stethoscope = {
    state: {},
    model: null,
    setModel: function(model) {
        log("Setting model to " + model);
        this.model = model;
    },
    query: {
        status: function(id) {
            var key = ants[stethoscope.model].status[id];
            return stethoscope.state.status[key];
        },
        setting: function(category,id) {
            var key = ants[stethoscope.model].settings[category][id];
            return stethoscope.settings[key];
        }
    },
    respond: function(data) {
        this.state = {
            status: data.status,
            settings: data.settings
        };
        var ref = {
            status: ants[stethoscope.model].status,
            settings: ants[stethoscope.model].settings
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
            var newStr = d.toISOString().substr(11,8);
            $('#stat_sd').attr('data-secs',remain).text(newStr);
        }

        // Battery percentage
        oldStr = $('#stat_bat').text(), newStr = data.status[ref.status.INTERNAL_BATT_PERCENT] + '%';
        if (oldStr != newStr)
            $('#stat_bat').text(newStr);
    }
}

module.exports = stethoscope;