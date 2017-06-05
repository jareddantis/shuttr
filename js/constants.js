/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

var gopro = {
    HeroFive: {
        status: {
            INTERNAL_BATT_PRESENT: 1,    // 0 or 1
            INTERNAL_BATT_LEVEL: 2,      // 4 - charging, 3 - full, 2 - half, 1 - low
            EXTERNAL_BATT_PRESENT: 3,
            EXTERNAL_BATT_LEVEL: 4,
            IS_HOT: 6,                   // 0 or 1
            IS_BUSY: 8,                  // 0 or 1. Recording or processing.
            IS_QUICK_CAPTURE: 9,         // 0 or 1
            IS_RECORDING: 10,            // 0 or 1. Recording only.
            IS_SCREEN_LOCKED: 11,        // 0 or 1
            CURRENT_VID_DURATION: 13,    // Seconds
            CONNECTED_CLIENTS: 31,
            STREAMING_MODE: 32,          // 0 or 1
            SDCARD_PRESENT: 33,          // 0 or 1
            REMAINING_PHOTO: 34,         // Only accurate when in a photo mode
            REMAINING_VIDEO: 35,         // Seconds
            NUM_BATCH_SHOTS: 36,
            NUM_VIDEO_SHOTS: 37, 
            TOTAL_PHOTOS: 38,
            TOTAL_VIDEOS: 39,            // Seconds
            SYS_TIME: 40,                // Hex numbers, separated by '%' characters. YY:MM:DD:HH:MM:SS
            CURRENT_MODE: 43,            // 4 - Media Browser, 2 - MultiShot, 1 - Photo, 0 - Video
            CURRENT_SUBMODE: 44,         // 2 - Video+Photo/NightPhoto/NightLapse, 1 - TimelapseVideo/Looping/Timelapse, 0 - Video/Photo/Burst
            IS_LOCATE_ACTIVE: 45,        // 0 or 1. Not GPS! Refers to self locator (beeping)
            AVAILABLE_SPACE: 54,         // SD card, in KB
            SYS_UPTIME: 63,              // Milliseconds
            IS_ON_PREFS: 63,             // 0 or 1
            INTERNAL_BATT_PERCENT: 70
        },
        settings: {
            video: {
                VIDEO_RESOLUTION: 2,
                FRAME_RATE: 3,
                FOV: 4,
                TL_INTR: 5,
                LOOP_INTR: 6,
                VPHOTO_INTR: 7,
                LOWLIGHT: 8,
                SPOT_METER: 9,
                PROTUNE: 10,
                PROTUNE_WB: 11,
                PROTUNE_COLOR: 12,
                PROTUNE_EXP: 73,
                PROTUNE_ISO_MODE: 74,
                PROTUNE_ISO_MAX: 13,
                PROTUNE_SHARP: 14,
                PROTUNE_EV: 15,
                STABILIZER: 78,
                AUDIO_MODE: 80,
                PROTUNE_RAW_AUDIO: 81
            },
            photo: {
                RAW: 82,
                WDR: 77,
                CONT_RATE: 18,
                RESOLUTION: 17,
                SHUTTER: 19,
                SPOT_METER: 20,
                PROTUNE: 21,
                PROTUNE_WB: 22,
                PROTUNE_COLOR: 23,
                PROTUNE_ISO_MIN: 75,
                PROTUNE_ISO_MAX: 24,
                PROTUNE_SHARP: 25,
                PROTUNE_EV: 26,
                PROTUNE_SHTR: 97
            },
            multishot: {
                NIGHT_SHUTTER: 31,
                NIGHT_RAW: 98,
                TIMELAPSE_RAW: 94,
                NIGHTLAPSE_RAW: 99,
                TIMELAPSE_WDR: 93,
                BURST_RATE: 29,
                TIMELAPSE_INTR: 30,
                NIGHTLAPSE_INTR: 32,
                RESOLUTION: 28,
                SPOT_METER: 33,
                PROTUNE: 34,
                PROTUNE_WB: 35,
                PROTUNE_COLOR: 36,
                PROTUNE_ISO_MIN: 76,
                PROTUNE_ISO_MAX: 37,
                PROTUNE_SHARP: 38,
                PROTUNE_EV: 39,
            },
            system: {
                AUTO_OFF: 59,
                LANGUAGE: 84,
                GPS: 83,
                VOICE_CONTROL: 86,
                VOICE_CONTROL_LANG: 85,
                LCD: 72,
                LCD_BRIGHTNESS: 49,
                LCD_LOCK: 50,
                LCD_TIMEOUT: 51,
                LED: 55,
                ORIENTATION: 52,
                STARTUP_MODE: 53,
                QUICKCAPTURE: 54,
                BEEPVOL: 56,
                HDMI_FMT: 57,
                HUD: 58
            }
        }
    }
}

module.exports = gopro;