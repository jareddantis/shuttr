/*
    Part of the Shuttr app by @aureljared.
    Licensed under GPLv3.
    http://github.com/aureljared/shuttr
*/

var gopro = {
    Hero5: {
        status: {
            INTERNAL_BATT_PRESENT: 1,    // 0 or 1
            INTERNAL_BATT_LEVEL: 2,      // 4 - charging, 3 - full, 2 - half, 1 - low
            IS_BUSY: 8,                  // 0 or 1. Recording or processing.
            IS_RECORDING: 10,            // 0 or 1. Recording only.
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
            AVAILABLE_SPACE: 54,         // SD card, in KB
            SYS_UPTIME: 63,              // Milliseconds
            IS_ON_PREFS: 63              // 0 or 1
        },
        settings: {
            video: {
                CURRENT_SUBMODE: {
                    key: 68,
                    values: {
                        VIDEO: 0,
                        TL_VIDEO: 1,
                        VPHOTO: 2,
                        LOOPING: 3
                    }
                },
                AUDIO_MODE: {
                    key: 80,
                    values: {
                        AUTO: 2,
                        STEREO_ONLY: 0,
                        WIND_ONLY: 1
                    }
                },
                VIDEO_RESOLUTION: {
                    key: 2,
                    values: {
                        _4K: 1,
                        //_4K_SUPR: 2,
                        _27K: 4,
                        _2_7K_SUPR: 5,
                        _2_7K_STD: 6,    // 4:3
                        _1440: 7,
                        _1080_SUPR: 8,
                        _1080: 9,
                        _960: 10,
                        _720_SUPR: 11,
                        _720: 12,
                        _WVGA: 13
                    }
                },
                FRAME_RATE: {
                    key: 3,
                    values: {
                        _240: 0,
                        _120: 1,
                        _100: 2,
                        _90: 3,
                        _80: 4,
                        _60: 5,
                        _50: 6,
                        _48: 7,
                        _30: 8,
                        _25: 9,
                        _24: 10,
                        _15: 11,
                        _12_5: 12
                    }
                },
                FOV: {
                    key: 4,
                    values: {
                        WID: 0,
                        MED: 1,
                        NAR: 2,
                        SUPR: 3,
                        LNR: 4
                    }
                },
                TL_INTR: {
                    key: 5,
                    values: {
                        _0_5s: 0,
                        _1s: 1,
                        _2s: 2,
                        _5s: 3,
                        _10s: 4,
                        _30s: 5,
                        _60s: 6
                    }
                },
                LOOP_INTR: {
                    key: 6,
                    values: {
                        MAX: 0,
                        _5m: 1,
                        _20m: 2,
                        _60m: 3,
                        _120m: 4
                    }
                },
                VPHOTO_INTR: {
                    key: 7,
                    values: {
                        _5s: 1,
                        _10s: 2,
                        _30s: 3,
                        _60s: 4
                    }
                },
                LOWLIGHT: {
                    key: 8,
                    values: { ON: 1, OFF: 0 }
                },
                SPOT_METER: {
                    key: 9,
                    values: { ON: 1, OFF: 0 }
                },
                PROTUNE: {
                    key: 10,
                    values: { ON: 1, OFF: 0 }
                },
                PROTUNE_WB: {
                    key: 11,
                    values: {
                        AUTO: 0,
                        NATIVE: 4,
                        _3000K: 1,
                        _5500K: 2,
                        _6500K: 3,
                        _4000K: 5,
                        _4800K: 6,
                        _6000K: 7
                    }
                },
                PROTUNE_COLOR: {
                    key: 12,
                    values: {
                        GOPR: 0,
                        FLAT: 1
                    }
                },
                PROTUNE_EXP: {
                    key: 73,
                    values: {
                        _1_24s: 3,
                        _1_25s: 4,
                        _1_30s: 5,
                        _1_48s: 6,
                        _1_50s: 7,
                        _1_60s: 8,
                        _1_80s: 9,
                        _1_90s: 10,
                        _1_96s: 11,
                        _1_100s: 12,
                        _1_120s: 13,
                        _1_160s: 14,
                        _1_180s: 15,
                        _1_192s: 16,
                        _1_200s: 17,
                        _1_240s: 18,
                        _1_320s: 19,
                        _1_360s: 20,
                        _1_400s: 21,
                        _1_480s: 22,
                        _1_960s: 23
                    }
                },
                PROTUNE_ISO_MODE: {
                    key: 74,
                    values: { MAX: 0, LOCK: 1 }
                },
                PROTUNE_ISO_MAX: {
                    key: 13,
                    values: {
                        _6400: 0,
                        _3200: 3,
                        _1600: 1,
                        _800: 4,
                        _400: 2,
                        _200: 7,
                        _100: 8
                    }
                },
                PROTUNE_SHARP: {
                    key: 14,
                    values: {
                        HI: 0,
                        MED: 1,
                        LOW: 2
                    }
                },
                PROTUNE_EV: {
                    key: 15,
                    values: {
                        OFF: 4,
                        _M2_0: 8,
                        _M1_5: 7,
                        _M1_0: 6,
                        _M0_5: 5,
                        _P0_5: 3,
                        _P1_0: 2,
                        _P1_5: 1,
                        _P2_0: 0
                    }
                },
                /* PROTUNE_AUDIO: {
                    key: 79,
                    values: { ON: 1, OFF: 0 }
                }, */
                PROTUNE_RAW_AUDIO: {
                    key: 81,
                    values: {
                        OFF: 3,
                        LOW: 0,
                        MID: 1,
                        HI: 2
                    }
                }
            },
            photo: {
                RAW: {
                    key: 82,
                    values: { ON: 1, OFF: 0 }
                },
                WDR: {
                    key: 77,
                    values: { ON: 1, OFF: 0 }
                },
                CURRENT_SUBMODE: {
                    key: 69,
                    values: {
                        SINGLE: 0,
                        CONT: 1,
                        NIGHT: 2
                    }
                },
                CONT_RATE: {
                    key: 18,
                    values: {
                        _3FPS: 0,
                        _5FPS: 1,
                        _10FPS: 2
                    }
                },
                RESOLUTION: {
                    key: 17,
                    values: {
                        WIDE_12: 0,
                        MED_12: 8,
                        NARROW_12: 9,
                        LINEAR_12: 10,
                        WIDE_7: 1,
                        MED_7: 2,
                        MED_5: 3
                    }
                },
                SHUTTER: {
                    key: 19,
                    values: {
                        AUTO: 0,
                        _2s: 1,
                        _5s: 2,
                        _10s: 3,
                        _15s: 4,
                        _20s: 5,
                        _30s: 6
                    }
                },
                SPOT_METER: {
                    key: 20,
                    values: { ON: 1, OFF: 0 }
                },
                PROTUNE: {
                    key: 21,
                    values: { ON: 1, OFF: 0 }
                },
                PROTUNE_WB: {
                    key: 22,
                    values: {
                        AUTO: 0,
                        NATIVE: 4,
                        _3000K: 1,
                        _5500K: 2,
                        _6500K: 3,
                        _4000K: 5,
                        _4800K: 6,
                        _6000K: 7
                    }
                },
                PROTUNE_COLOR: {
                    key: 23,
                    values: {
                        GOPR: 0,
                        FLAT: 1
                    }
                },
                PROTUNE_ISO_MIN: {
                    key: 75,
                    values: {
                        _800: 0,
                        _400: 1,
                        _200: 2,
                        _100: 3
                    }
                },
                PROTUNE_ISO_MAX: {
                    key: 24,
                    values: {
                        _800: 0,
                        _400: 1,
                        _200: 2,
                        _100: 3
                    }
                },
                PROTUNE_SHARP: {
                    key: 25,
                    values: {
                        HI: 0,
                        MED: 1,
                        LOW: 2
                    }
                },
                PROTUNE_EV: {
                    key: 26,
                    values: {
                        OFF: 4,
                        _M2_0: 8,
                        _M1_5: 7,
                        _M1_0: 6,
                        _M0_5: 5,
                        _P0_5: 3,
                        _P1_0: 2,
                        _P1_5: 1,
                        _P2_0: 0
                    }
                }
            },
            multishot: {
                DEFAULT_SUBMODE: {
                    key: 27,
                    values: {
                        BURST: 0,
                        TIMELAPSE: 1,
                        NIGHTLAPSE: 2 
                    }
                },
                CURRENT_SUBMODE: {
                    key: 27,
                    values: {
                        BURST: 0,
                        TIMELAPSE: 1,
                        NIGHTLAPSE: 2 
                    }
                },
                NIGHT_SHUTTER: {
                    key: 31,
                    values: {
                        AUTO: 0,
                        _2s: 1,
                        _5s: 2,
                        _10s: 3,
                        _15s: 4,
                        _20s: 5,
                        _30s: 6
                    }
                },
                BURST_RATE: {
                    key: 29,
                    values: {
                        _3p1s: 0,
                        _5p1s: 1,
                        _10p1s: 2,
                        _10p2s: 3,
                        _10p3s: 4,
                        _30p1s: 5,
                        _30p2s: 6,
                        _30p3s: 7,
                        _30p6s: 8 
                    }
                },
                TIMELAPSE_INTR: {
                    key: 30,
                    values: {
                        _0_5s: 0,
                        _1s: 1,
                        _2s: 2,
                        _5s: 5,
                        _10s: 10,
                        _30s: 30,
                        _60s: 60
                    }
                },
                NIGHTLAPSE_INTR: {
                    key: 32,
                    values: {
                        CONT: 0,
                        _4s: 4,
                        _5s: 5,
                        _10s: 10,
                        _15s: 15,
                        _20s: 20,
                        _30s: 30,
                        _1m: 60,
                        _2m: 120,
                        _5m: 300,
                        _30m: 1800,
                        _60m: 3600
                    }
                },
                RESOLUTION: {
                    key: 28,
                    values: {
                        WIDE_12: 0,
                        WIDE_7: 1,
                        MED_7: 2,
                        MED_5: 3
                    }
                },
                SPOT_METER: {
                    key: 33,
                    values: { ON: 1, OFF: 0 }
                },
                PROTUNE: {
                    key: 34,
                    values: { ON: 1, OFF: 0 }
                },
                PROTUNE_WB: {
                    key: 35,
                    values: {
                        AUTO: 0,
                        NATIVE: 4,
                        _3000K: 1,
                        _5500K: 2,
                        _6500K: 3,
                        _4000K: 5,
                        _4800K: 6,
                        _6000K: 7
                    }
                },
                PROTUNE_COLOR: {
                    key: 36,
                    values: {
                        GOPR: 0,
                        FLAT: 1
                    }
                },
                PROTUNE_ISO_MIN: {
                    key: 76,
                    values: {
                        _800: 0,
                        _400: 1,
                        _200: 2,
                        _100: 3
                    }
                },
                PROTUNE_ISO_MAX: {
                    key: 37,
                    values: {
                        _800: 0,
                        _400: 1,
                        _200: 2,
                        _100: 3
                    }
                },
                PROTUNE_SHARP: {
                    key: 38,
                    values: {
                        HI: 0,
                        MED: 1,
                        LOW: 2
                    }
                },
                PROTUNE_EV: {
                    key: 39,
                    values: {
                        OFF: 4,
                        _M2_0: 8,
                        _M1_5: 7,
                        _M1_0: 6,
                        _M0_5: 5,
                        _P0_5: 3,
                        _P1_0: 2,
                        _P1_5: 1,
                        _P2_0: 0
                    }
                }
            },
            system: {
                AUTO_OFF: {
                    key: 59,
                    values: {
                        OFF: 0,
                        _1m: 1,
                        _2m: 2,
                        _3m: 3,
                        _5m: 4
                    }
                },
                LANGUAGE: {
                    key: 84,
                    values: {
                        ENGLISH: 0,
                        GERMAN: 2,
                        FRENCH: 6,
                        ITALIAN: 3,
                        SPANISH: 4,
                        CHINESE: 1,
                        JAPANESE: 5
                    }
                },
                GPS: {
                    key: 83,
                    values: { ON: 1, OFF: 0 }
                },
                VOICE_CONTROL: {
                    key: 86,
                    values: { ON: 1, OFF: 0 }
                },
                VOICE_CONTROL_LANG: {
                    key: 85,
                    values: {
                        ENGLISH_US: 0,
                        ENGLISH_GB: 1,
                        ENGLISH_AU: 2,
                        GERMAN: 3,
                        FRENCH: 4,
                        ITALIAN: 5,
                        SPANISH: 6,
                        SPANISH_NA: 7,
                        CHINESE: 8,
                        JAPANESE: 9
                    }
                },
                LCD: {
                    key: 72,
                    values: { ON: 1, OFF: 0 }
                },
                LCD_BRIGHTNESS: {
                    key: 49,
                    values: {
                        MAX: 0,
                        MED: 1,
                        LOW: 2
                    }
                },
                LCD_LOCK: {
                    key: 50,
                    values: { ON: 1, OFF: 0 }
                },
                LCD_TIMEOUT: {
                    key: 51,
                    values: {
                        OFF: 0,
                        _1m: 1,
                        _2m: 2,
                        _3m: 3
                    }
                },
                LED: {
                    key: 55,
                    values: {
                        OFF: 0,
                        FRONT_OFF: 1,
                        ALL: 2
                    }
                },
                ORIENTATION: {
                    key: 52,
                    values: {
                        AUTO: 0,
                        UP: 1,
                        DOWN: 2
                    }
                },
                STARTUP_MODE: {
                    key: 53,
                    values: {
                        VIDEO: 0,
                        PHOTO: 1,
                        MULTI: 2
                    }
                },
                QUICKCAPTURE: {
                    key: 54,
                    values: { ON: 1, OFF: 0 }
                },
                BEEPVOL: {
                    key: 56,
                    values: {
                        MAX: 0,
                        MID: 1,
                        OFF: 2
                    }
                },
                HDMI_FMT: {
                    key: 57,
                    values: { NTSC: 0, PAL: 1 }
                },
                HUD: {
                    key: 58,
                    values: { ON: 1, OFF: 0 }
                }
            }
        }
    },
    Hero4: {
        status: {
            INTERNAL_BATT_PRESENT: 1,    // 0/1
            INTERNAL_BATT_LEVEL: 2,      // 4 - charging, 3 - full, 2 - half, 1 - low
            CURRENT_MODE: 43,            // 2 - MultiShot, 1 - Photo, 0 - Video
            CURRENT_SUBMODE: 44,         // 2 - Video+Photo/NightPhoto/NightLapse, 1 - TimelapseVideo/Looping/Timelapse, 0 - Video/Photo/Burst
            CURRENT_VID_DURATION: 13,
            CONNECTED_CLIENTS: 31,
            STREAMING_MODE: 32,          // 0/1
            SDCARD_PRESENT: 33,          // 0/1
            REMAINING_PHOTO: 34,
            REMAINING_VIDEO: 35,
            NUM_BATCH_SHOTS: 36,
            NUM_VIDEO_SHOTS: 37,
            TOTAL_PHOTOS: 38,
            TOTAL_VIDEOS: 39,
            IS_BUSY: 8                   // 0/1. Recording or processing.
        },
        settings: {
            video: {
                CURRENT_SUBMODE: {
                    key: 68,
                    values: {
                        VIDEO: 0,
                        TL_VIDEO: 1,
                        VPHOTO: 2,
                        LOOPING: 3
                    }
                },
                VIDEO_RESOLUTION: {
                    key: 2,
                    values: {
                        _4K: 1,
                        //_4K_SUPR: 2,
                        _27K: 4,
                        _2_7K_SUPR: 5,
                        _2_7K_STD: 6,    // 4:3
                        _1440: 7,
                        _1080_SUPR: 8,
                        _1080: 9,
                        _960: 10,
                        _720_SUPR: 11,
                        _720: 12,
                        _WVGA: 13
                    }
                },
                FRAME_RATE: {
                    key: 3,
                    values: {
                        _240: 0,
                        _120: 1,
                        _100: 2,
                        _90: 3,
                        _80: 4,
                        _60: 5,
                        _50: 6,
                        _48: 7,
                        _30: 8,
                        _25: 9,
                        _24: 10,
                        _15: 11,
                        _12_5: 12
                    }
                },
                FOV: {
                    key: 4,
                    values: {
                        WID: 0,
                        MED: 1,
                        NAR: 2,
                        LNR: 3
                    }
                },
                TL_INTR: {
                    key: 5,
                    values: {
                        _0_5s: 0,
                        _1s: 1,
                        _2s: 2,
                        _5s: 3,
                        _10s: 4,
                        _30s: 5,
                        _60s: 6
                    }
                },
                LOOP_INTR: {
                    key: 6,
                    values: {
                        MAX: 0,
                        _5m: 1,
                        _20m: 2,
                        _60m: 3,
                        _120m: 4
                    }
                },
                VPHOTO_INTR: {
                    key: 7,
                    values: {
                        _5s: 1,
                        _10s: 2,
                        _30s: 3,
                        _60s: 4
                    }
                },
                LOWLIGHT: {
                    key: 8,
                    values: { ON: 1, OFF: 0 }
                },
                SPOT_METER: {
                    key: 9,
                    values: { ON: 1, OFF: 0 }
                },
                PROTUNE: {
                    key: 10,
                    values: { ON: 1, OFF: 0 }
                },
                PROTUNE_WB: {
                    key: 11,
                    values: {
                        AUTO: 0,
                        NATIVE: 4,
                        _3000K: 1,
                        _5500K: 2,
                        _6500K: 3,
                        _4000K: 5,
                        _4800K: 6,
                        _6000K: 7
                    }
                },
                PROTUNE_COLOR: {
                    key: 12,
                    values: {
                        GOPR: 0,
                        FLAT: 1
                    }
                },
                PROTUNE_EXP: {
                    key: 73,
                    values: {
                        _1_24s: 3,
                        _1_25s: 4,
                        _1_30s: 5,
                        _1_48s: 6,
                        _1_50s: 7,
                        _1_60s: 8,
                        _1_80s: 9,
                        _1_90s: 10,
                        _1_96s: 11,
                        _1_100s: 12,
                        _1_120s: 13,
                        _1_160s: 14,
                        _1_180s: 15,
                        _1_192s: 16,
                        _1_200s: 17,
                        _1_240s: 18,
                        _1_320s: 19,
                        _1_360s: 20,
                        _1_400s: 21,
                        _1_480s: 22,
                        _1_960s: 23
                    }
                },
                PROTUNE_ISO_MODE: {
                    key: 74,
                    values: { MAX: 0, LOCK: 1 }
                },
                PROTUNE_ISO_MAX: {
                    key: 13,
                    values: {
                        _6400: 0,
                        _3200: 3,
                        _1600: 1,
                        _800: 4,
                        _400: 2,
                        _200: 7,
                        _100: 8
                    }
                },
                PROTUNE_SHARP: {
                    key: 14,
                    values: {
                        HI: 0,
                        MED: 1,
                        LOW: 2
                    }
                },
                PROTUNE_EV: {
                    key: 15,
                    values: {
                        OFF: 4,
                        _M2_0: 8,
                        _M1_5: 7,
                        _M1_0: 6,
                        _M0_5: 5,
                        _P0_5: 3,
                        _P1_0: 2,
                        _P1_5: 1,
                        _P2_0: 0
                    }
                }
            },
            photo: {
                CURRENT_SUBMODE: {
                    key: 69,
                    values: {
                        SINGLE: 0,
                        CONT: 1,
                        NIGHT: 2
                    }
                },
                CONT_RATE: {
                    key: 18,
                    values: {
                        _3FPS: 0,
                        _5FPS: 1,
                        _10FPS: 2
                    }
                },
                RESOLUTION: {
                    key: 17,
                    values: {
                        WIDE_12: 0,
                        WIDE_7: 1,
                        MED_7: 2,
                        MED_5: 3
                    }
                },
                SHUTTER: {
                    key: 19,
                    values: {
                        AUTO: 0,
                        _2s: 1,
                        _5s: 2,
                        _10s: 3,
                        _15s: 4,
                        _20s: 5,
                        _30s: 6
                    }
                },
                SPOT_METER: {
                    key: 20,
                    values: { ON: 1, OFF: 0 }
                },
                PROTUNE: {
                    key: 21,
                    values: { ON: 1, OFF: 0 }
                },
                PROTUNE_WB: {
                    key: 22,
                    values: {
                        AUTO: 0,
                        NATIVE: 4,
                        _3000K: 1,
                        _5500K: 2,
                        _6500K: 3,
                        _4000K: 5,
                        _4800K: 6,
                        _6000K: 7
                    }
                },
                PROTUNE_COLOR: {
                    key: 23,
                    values: {
                        GOPR: 0,
                        FLAT: 1
                    }
                },
                PROTUNE_ISO_MIN: {
                    key: 75,
                    values: {
                        _800: 0,
                        _400: 1,
                        _200: 2,
                        _100: 3
                    }
                },
                PROTUNE_ISO_MAX: {
                    key: 24,
                    values: {
                        _800: 0,
                        _400: 1,
                        _200: 2,
                        _100: 3
                    }
                },
                PROTUNE_SHARP: {
                    key: 25,
                    values: {
                        HI: 0,
                        MED: 1,
                        LOW: 2
                    }
                },
                PROTUNE_EV: {
                    key: 26,
                    values: {
                        OFF: 4,
                        _M2_0: 8,
                        _M1_5: 7,
                        _M1_0: 6,
                        _M0_5: 5,
                        _P0_5: 3,
                        _P1_0: 2,
                        _P1_5: 1,
                        _P2_0: 0
                    }
                }
            },
            multishot: {
                DEFAULT_SUBMODE: {
                    key: 27,
                    values: {
                        BURST: 0,
                        TIMELAPSE: 1,
                        NIGHTLAPSE: 2 
                    }
                },
                CURRENT_SUBMODE: {
                    key: 27,
                    values: {
                        BURST: 0,
                        TIMELAPSE: 1,
                        NIGHTLAPSE: 2 
                    }
                },
                NIGHT_SHUTTER: {
                    key: 31,
                    values: {
                        AUTO: 0,
                        _2s: 1,
                        _5s: 2,
                        _10s: 3,
                        _15s: 4,
                        _20s: 5,
                        _30s: 6
                    }
                },
                BURST_RATE: {
                    key: 29,
                    values: {
                        _3p1s: 0,
                        _5p1s: 1,
                        _10p1s: 2,
                        _10p2s: 3,
                        _10p3s: 4,
                        _30p1s: 5,
                        _30p2s: 6,
                        _30p3s: 7,
                        _30p6s: 8 
                    }
                },
                TIMELAPSE_INTR: {
                    key: 30,
                    values: {
                        _0_5s: 0,
                        _1s: 1,
                        _2s: 2,
                        _5s: 5,
                        _10s: 10,
                        _30s: 30,
                        _60s: 60
                    }
                },
                NIGHTLAPSE_INTR: {
                    key: 32,
                    values: {
                        CONT: 0,
                        _4s: 4,
                        _5s: 5,
                        _10s: 10,
                        _15s: 15,
                        _20s: 20,
                        _30s: 30,
                        _1m: 60,
                        _2m: 120,
                        _5m: 300,
                        _30m: 1800,
                        _60m: 3600
                    }
                },
                RESOLUTION: {
                    key: 28,
                    values: {
                        WIDE_12: 0,
                        WIDE_7: 1,
                        MED_7: 2,
                        MED_5: 3
                    }
                },
                SPOT_METER: {
                    key: 33,
                    values: { ON: 1, OFF: 0 }
                },
                PROTUNE: {
                    key: 34,
                    values: { ON: 1, OFF: 0 }
                },
                PROTUNE_WB: {
                    key: 35,
                    values: {
                        AUTO: 0,
                        NATIVE: 4,
                        _3000K: 1,
                        _5500K: 2,
                        _6500K: 3,
                        _4000K: 5,
                        _4800K: 6,
                        _6000K: 7
                    }
                },
                PROTUNE_COLOR: {
                    key: 36,
                    values: {
                        GOPR: 0,
                        FLAT: 1
                    }
                },
                PROTUNE_ISO_MIN: {
                    key: 76,
                    values: {
                        _800: 0,
                        _400: 1,
                        _200: 2,
                        _100: 3
                    }
                },
                PROTUNE_ISO_MAX: {
                    key: 37,
                    values: {
                        _800: 0,
                        _400: 1,
                        _200: 2,
                        _100: 3
                    }
                },
                PROTUNE_SHARP: {
                    key: 38,
                    values: {
                        HI: 0,
                        MED: 1,
                        LOW: 2
                    }
                },
                PROTUNE_EV: {
                    key: 39,
                    values: {
                        OFF: 4,
                        _M2_0: 8,
                        _M1_5: 7,
                        _M1_0: 6,
                        _M0_5: 5,
                        _P0_5: 3,
                        _P1_0: 2,
                        _P1_5: 1,
                        _P2_0: 0
                    }
                }
            },
            system: {
                AUTO_OFF: {
                    key: 59,
                    values: {
                        OFF: 0,
                        _1m: 1,
                        _2m: 2,
                        _3m: 3,
                        _5m: 4
                    }
                },
                LCD: {
                    key: 72,
                    values: { ON: 1, OFF: 0 }
                },
                LCD_BRIGHTNESS: {
                    key: 49,
                    values: {
                        MAX: 0,
                        MED: 1,
                        LOW: 2
                    }
                },
                LCD_LOCK: {
                    key: 50,
                    values: { ON: 1, OFF: 0 }
                },
                LCD_TIMEOUT: {
                    key: 51,
                    values: {
                        OFF: 0,
                        _1m: 1,
                        _2m: 2,
                        _3m: 3
                    }
                },
                LED: {
                    key: 55,
                    values: {
                        OFF: 0,
                        MID: 1,
                        ALL: 2
                    }
                },
                ORIENTATION: {
                    key: 52,
                    values: {
                        AUTO: 0,
                        UP: 1,
                        DOWN: 2
                    }
                },
                STARTUP_MODE: {
                    key: 53,
                    values: {
                        VIDEO: 0,
                        PHOTO: 1,
                        MULTI: 2
                    }
                },
                QUICKCAPTURE: {
                    key: 54,
                    values: { ON: 1, OFF: 0 }
                },
                BEEPVOL: {
                    key: 56,
                    values: {
                        MAX: 0,
                        MID: 1,
                        OFF: 2
                    }
                },
                HDMI_FMT: {
                    key: 57,
                    values: { NTSC: 0, PAL: 1 }
                },
                HUD: {
                    key: 58,
                    values: { ON: 1, OFF: 0 }
                }
            }
        }
    }
}

module.exports = gopro;