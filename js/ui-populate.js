/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

const fn = require('./shuttr');

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
        require('./shuttr').set(4, option);
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

module.exports = populateList;
