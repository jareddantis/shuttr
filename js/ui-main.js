/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

// Logging
const l = require('./logger').log;
var log = function(msg) { l('ui-main', msg) };

const $ = require('jquery');
const fn = require('./shuttr');
const ants = require('./constants');
const {BrowserWindow, app} = require('electron').remote;
var mode = "video";

// Handle window close and ctrl + c
var win = BrowserWindow;
var cleanup = function() {
    log("Terminating heartbeat and stopping viewfinder");
    require('./heartbeat').stop();
    fn.controls.vf_close();
    log("Quitting");
    if (win)
        win.destroy();
    app.quit();
}
app.on('ready', () => {
    win.on('closed', (e) => {
        e.preventDefault();
        cleanup();
    })
})
window.onbeforeunload = cleanup;

// Init
var init = function(model){
    $("#msg_err").hide();
    $("#msg_off").hide();
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

    fn.init(function(){
        // On success
        $('#messages').fadeOut();
        $('#pwr').removeClass('disabled');
        $('#controls').removeClass('disabled');

        // Create viewfinder iframe
        fn.controls.vf_init(function(){
            var iframe = $('<iframe>').attr('src', 'http://127.0.0.1:2000/out');
            $(iframe).attr('width', '100%').attr('height', '100%');
            $('#overlays').removeClass("hidden");
            $('#viewfinder').append(iframe);
        });

        // Platform-specific styles
        $('body').addClass(process.platform);
    }, function(){
        // On error
        $('.message').each(function(){ $(this).hide() });
        $('#msg_err .errTitle').text("Unable to connect");
        $('#msg_err .errBody').html("Make sure that you are connected to your camera via Wi-Fi.<br><br>If you are connected to your camera,<br>we will also try turning it on remotely.");
        $('#msg_err').show();
    });
}

module.exports.init = init;
