'use strict';

exports.__esModule = true;

var _server = require('./server.js');

var _server2 = _interopRequireDefault(_server);

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _url2 = require('url');

var _url3 = _interopRequireDefault(_url2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @FileName: Utils
 * @Description:
 * @Date: 2017-03-06
 * @version: 1.0
 * @author: <carl.wu@corp.to8to.com>
 */
var Utils = {
    redirectLoginPage: function redirectLoginPage() {
        location.href = 'http://erp.to8to.com/index.php/admin/login';
    },
    redirectIndex: function redirectIndex() {
        location.href = 'http://erp.to8to.com/index.php/index/index';
    },

    // 上传url处理
    getUploadURL: function getUploadURL() {
        var _url = _server2.default.gatewayAddr + '?action=file&uid=' + _jsCookie2.default.get('t8t-tc-uid') + '&ticket=' + _jsCookie2.default.get('t8t-tc-ticket');
        return _url;
    },

    // url补全
    getFullURL: function getFullURL(src) {
        var _url = _server2.default.gatewayAddr + '?path=' + src + '&action=file&uid=' + _jsCookie2.default.get('t8t-tc-uid') + '&ticket=' + _jsCookie2.default.get('t8t-tc-ticket');
        return _url;
    },
    getPublicKey: function getPublicKey(cb) {
        var _url = '?action=pbs';

        _axios2.default.defaults.timeout = 20000;
        _axios2.default.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        // axios.defaults.baseURL = _url
        (0, _axios2.default)({
            method: 'GET',
            url: _url
        }).then(function (res) {
            cb && cb(res);
        });
    },
    getImportURL: function getImportURL(service, method) {
        var path = [service, method].join('/') + '/';
        return _url3.default.format({
            protocol: _server2.default.protocol,
            host: _server2.default.host,
            pathname: path,
            query: {
                action: "import",
                uid: _jsCookie2.default.get('t8t-tc-uid'),
                ticket: _jsCookie2.default.get('t8t-tc-ticket')
            }
        });
    }
};

exports.default = Utils;
