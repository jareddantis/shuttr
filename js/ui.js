/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

// Logging
const l = require(__dirname + '/js/logger').log;
var log = function(msg) { l('ui', msg) };

const main = require(__dirname + '/js/ui-main');
const buttons = require(__dirname + '/js/ui-buttons');
const stethoscope = require(__dirname + '/js/stethoscope');
const $ = require('jquery');
let model = "HeroFiveBlack";

$(function(){
    buttons.init();
    main.init();
    stethoscope.setModel(model);
})
