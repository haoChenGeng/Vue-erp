"use strict";

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _JSEnctypt = require("./JSEnctypt.js");

var _JSEnctypt2 = _interopRequireDefault(_JSEnctypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RSAUtils = {};

var publickeystr = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDwzOVC3GYdAMx3qZ3/FATb6zoCfwb/O+ujbBTxrrHe3Dzqwg3gy8mBcf4UXcabqhZdczWPRPECtsSxh5cjY8wGMWXQMeyEvdUcX9SN75QW2phm9MQGiDgJEJ98n97w+KB5wE/n6vbKWlOCKjqoBI0EpGniMFEFP+4pOtO7sFQ3ZwIDAQAB";

RSAUtils.encrypt = new _JSEnctypt2.default();
RSAUtils.encrypt.setPublicKey(publickeystr);

RSAUtils.encryptfun = function (txt) {
    var nestr = RSAUtils.encrypt.encrypt(txt);
    return nestr;
};

/*********************utf-8****************/
function encodeUTF8(str) {
    var temp = "",
        rs = "";
    for (var i = 0, len = str.length; i < len; i++) {
        temp = str.charCodeAt(i).toString(16);
        rs += "\\u" + new Array(5 - temp.length).join("0") + temp;
    }
    return rs;
}

/************************************JS BASE64编码解码************************************/
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
//编码的方法
function base64encode(str) {
    var out = void 0,
        i = void 0,
        len = void 0;
    var c1 = void 0,
        c2 = void 0,
        c3 = void 0;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4);
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4);
        out += base64EncodeChars.charAt((c2 & 0xF) << 2 | (c3 & 0xC0) >> 6);
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

//解码的方法
function base64decode(str) {
    var c1 = void 0,
        c2 = void 0,
        c3 = void 0,
        c4 = void 0;
    var i = void 0,
        len = void 0,
        out = void 0;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {

        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1) break;

        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1) break;
        out += String.fromCharCode(c1 << 2 | (c2 & 0x30) >> 4);

        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61) return out;
            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1) break;
        out += String.fromCharCode((c2 & 0XF) << 4 | (c3 & 0x3C) >> 2);

        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61) return out;
            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1) break;
        out += String.fromCharCode((c3 & 0x03) << 6 | c4);
    }
    return out;
}

function utf16to8(str) {
    var out = void 0,
        i = void 0,
        len = void 0,
        c = void 0;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x0001 && c <= 0x007F) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | c >> 12 & 0x0F);
            out += String.fromCharCode(0x80 | c >> 6 & 0x3F);
            out += String.fromCharCode(0x80 | c >> 0 & 0x3F);
        } else {
            out += String.fromCharCode(0xC0 | c >> 6 & 0x1F);
            out += String.fromCharCode(0x80 | c >> 0 & 0x3F);
        }
    }
    return out;
}

/**
 * json对象转字符串形式
 */
function json2str(o) {
    var arr = [];
    var fmt = function fmt(s) {
        if ((typeof s === "undefined" ? "undefined" : _typeof(s)) == 'object' && s != null) return json2str(s);
        return (/^(string|number)$/.test(typeof s === "undefined" ? "undefined" : _typeof(s)) ? '"' + s + '"' : s
        );
    };
    for (var i in o) {
        arr.push('"' + i + '":' + fmt(o[i]));
    }return '{' + arr.join(',') + '}';
}

exports.default = RSAUtils;