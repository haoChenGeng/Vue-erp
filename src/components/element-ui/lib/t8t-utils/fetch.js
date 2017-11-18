'use strict';

exports.__esModule = true;
exports.axiosPer = undefined;

exports.default = function (obj) {
  var requestData = {
    args: JSON.stringify(obj.args || {})
  };
  var url = buildURL(obj);

  return axios({
    method: 'post',
    url: url,
    data: requestData
  });
};

var _vueResource = require('vue-resource');

var _vueResource2 = _interopRequireDefault(_vueResource);

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

var _Utils = require('./Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

var _server = require('./server.js');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import qs from 'qs'
// http请求库配置
// import Vue from 'vue'
axios.defaults.timeout = 20000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = _server2.default.gatewayAddr;
// POST传参序列化
axios.interceptors.request.use(function (config) {

  //     if (config.method === 'post') {
  //         config.data = qs.stringify(config.data)
  //     }
  return config;
}, function (error) {
  console.log('错误的传参');
  return Promise.reject(error);
});
// code状态码200判断
axios.interceptors.response.use(function (res) {

  // ticket过期处理
  if (res.data && res.data.status === 605) {
    _Utils2.default.redirectLoginPage();
  } else if (res.data && res.data.status !== 200 && res.data.message) {
    res.data.message = res.data.message.split('|||')[0];
  }
  return res;
}, function (error) {
  console.log('网络异常！');
  return Promise.reject(error);
});

function buildURL(obj) {
  var arr = [axios.defaults.baseURL, encodeURIComponent(obj.service), encodeURIComponent(obj.method)];

  var _url = arr.join('/');
  var querys = 'uid=' + _jsCookie2.default.get('t8t-tc-uid') + '&ticket=' + _jsCookie2.default.get('t8t-tc-ticket');

  _url += '/?' + querys;

  return _url;
}

// 鉴权请求
function buildURLPer(obj) {
  var arr = [axios.defaults.baseURL, encodeURIComponent(obj.service), encodeURIComponent(obj.method)];

  var _url = arr.join('/');
  var querys = 'action=urlRight&' + 'uid=' + _jsCookie2.default.get('t8t-tc-uid') + '&ticket=' + _jsCookie2.default.get('t8t-tc-ticket');

  _url += '/?' + querys;

  return _url;
}

var axiosPer = exports.axiosPer = function axiosPer(obj) {
  var requestData = {
    args: JSON.stringify(obj.args || {})
  };

  var url = buildURLPer(obj);

  return axios({
    method: 'post',
    url: url,
    data: requestData
  });
};
