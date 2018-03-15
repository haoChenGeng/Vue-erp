/**
 * 点击流vue版
 */

import Cookie from 'js-cookie';
import axios from 'axios';
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8';

function cookieEnabled() {
  return (
    'undefined' != typeof navigator.cookieEnabled && navigator.cookieEnabled
  );
}

function createGuid() {
  for (var t = '', e = 1; 32 >= e; e++) {
    var i = Math.floor(16 * Math.random()).toString(16),
      t = t + i;
    (8 != e && 12 != e && 16 != e && 20 != e) || (t += '');
  }
  return (t += Math.ceil(1e6 * Math.random()));
}

function createIframe(options) {
  // create form element and append to iframe element
  let formElem = document.createElement('form');

  // create input hidden element
  let inputElem = document.createElement('input');
  inputElem.type = 'hidden';
  inputElem.id = options.inputId;
  inputElem.name = options.inputName;
  formElem.appendChild(inputElem);

  // append to document
  document.body.appendChild(formElem);
}

function $(id) {
  return document.querySelector(id);
}

function getDate() {
  var t = new Date(),
    e = t.getFullYear(),
    i = t.getMonth() + 1,
    i = 10 > i ? '0' + i : i,
    n = t.getDate(),
    n = 10 > n ? '0' + n : n,
    o = t.getHours(),
    o = 10 > o ? '0' + o : o,
    r = t.getMinutes(),
    r = 10 > r ? '0' + r : r,
    a = t.getSeconds(),
    a = 10 > a ? '0' + a : a,
    t = t.getMilliseconds();
  return (
    e.toString() +
    i.toString() +
    n.toString() +
    o.toString() +
    r.toString() +
    a.toString() +
    '.' +
    t
  );
}

function detectOS() {
  var t = navigator.userAgent,
    e = 'Win32' == navigator.platform || 'Windows' == navigator.platform,
    i =
      'Mac68K' == navigator.platform ||
      'MacPPC' == navigator.platform ||
      'Macintosh' == navigator.platform ||
      'MacIntel' == navigator.platform;
  if (i) return '09';
  if ('X11' == navigator.platform && !e && !i) return '08';
  var i = -1 < String(navigator.platform).indexOf('Linux'),
    n = 'android' == t.toLowerCase().match(/android/i);
  if (i) return n ? '07' : '06';
  if (e) {
    if (-1 < t.indexOf('Windows NT 5.0') || -1 < t.indexOf('Windows 2000'))
      return '05';
    if (-1 < t.indexOf('Windows NT 5.1') || -1 < t.indexOf('Windows XP'))
      return '04';
    if (-1 < t.indexOf('Windows NT 5.2') || -1 < t.indexOf('Windows 2003'))
      return '03';
    if (-1 < t.indexOf('Windows NT 6.0') || -1 < t.indexOf('Windows Vista'))
      return '02';
    if (-1 < t.indexOf('Windows NT 6.1') || -1 < t.indexOf('Windows 7'))
      return '01';
  }
  return '404';
}
// 判断是否生产环境
const debug = process.env.NODE_ENV !== 'production';
let _submitAddr = '';
if (debug) {
  // 开发环境跨域问题
  _submitAddr = 'http://localhost:8070/apis';
} else {
  _submitAddr =
    'http://www.to8to.com/count/a682ab23d4b4c95f84c744b2826419cd.php';
}

const TCS = {
  name: 'tcs',
  version: '1.0.0',
  cookieName: 'to8tocookieid',
  domain: 'to8to.com',
  expires: 7776000,
  submitAddr: _submitAddr,
  method: 'POST',
  inputId: 'clickValId',
  formId: 'frm_dealer',
  timeout_id: 'clickStreamTimeout',
  vt: '',
  cd: '',
  gu: '',
  platform: 8,
  lastUrl: '',
  tag_id: '',
  item: 0,
  sendSpeed: 4e3,
  sendCvTime: 4e3,
  cvTimtOut: 0,
  allowSend: !0,
  userCookiePrefix: 't8t-tc-uid',
  data: {
    pv: {},
    cv: {}
  },
  /**
   * 手动埋点
   * this.$TCS.addTag('1_21_33')
   * @param tag
   * @returns {*}
   */
  addTag(tag) {
    return this.sendCV(tag);
  },
  /**
   * 设置点击流数据对应的平台（8是ERP）
   * this.$TCS.setPlatform(8)
   * @param platform
   */
  setPlatform(platform) {
    this.platform = platform;
  },
  getId() {
    return Cookie.get(this.cookieName);
  },
  initCookie() {
    let cookieId = this.getId();
    if (!cookieId) {
      Cookie.set(this.cookieName, createGuid(), this.expires, this.domain);
    }
  },
  createPV() {
    let t = Math.floor(1e5 * Math.random());
    this.data.pv = {};
    this.data.pv.lu = document.referrer;
    this.data.pv.ly = 1;
    this.data.pv.pn = this.platform;
    (this.data.pv.vt = getDate()),
      (this.data.pv.cd = new Date().getTime().toString() + t.toString());
    this.data.pv.gu = window.location.href;
    this.data.pv.ov = detectOS();
    this.data.pv.ds = screen.width + '*' + screen.height;
    this.data.pv.u = Cookie.get(this.userCookiePrefix);
  },
  sendCV(ptag) {
    let e = new Date().getTime(),
      i = Math.floor(1e5 * Math.random());
    this.data.cv[0] = {};
    this.data.cv[0].lu = document.referrer;
    this.data.cv[0].ly = 2;
    this.data.cv[0].cg = ptag;
    this.data.cv[0].cd = e.toString() + i.toString();
    this.data.cv[0].vt = getDate();
    this.data.cv[0].gu = window.location.href;
    this.data.cv[0].ov = detectOS();
    this.data.cv[0].ds = screen.width + '*' + screen.height;
    this.sendPV();
  },
  sendPV() {
    (this.data.cid = this.getId()), (this.data.pv.lt = getDate());
    let e = JSON.stringify(this.data);
    $('#' + this.inputId).value = e;
    this.postData();
    this.data.cv = {};
    this.item = 0;
    this.data.pv.vt = getDate();
  },
  postData() {
    let _data = {
      key: JSON.stringify(this.data)
    };
    axios.post(this.submitAddr, _data);
  },
  initEvents() {
    let that = this;
    // 只考虑chrome浏览器，所以不考虑事件的兼容性问题
    document.addEventListener(
      'click',
      function(event) {
        try {
          let ptag = event.target.getAttribute('data-ptag') || null;
          // 发送点击流CV数据
          if (ptag) that.sendCV(ptag);
        } catch (e) {}
      },
      false
    );
  },
  setUserCookiePrefix(userCookiePrefix) {
    this.userCookiePrefix = userCookiePrefix;
  },
  /**
   * 初始化点击流
   * (初始化用户标识cookieid，初始化PV数据、初始化点击事件、初始化iframe提交域,
   * 使用iframe主要是为了解决跨域post问题)
   */
  init() {
    if (!cookieEnabled()) return;
    this.initCookie();
    createIframe({
      iframeName: 'frm_dealer',
      iframeId: 'clsIframe',
      formId: this.formId,
      submitAddr: this.submitAddr,
      inputId: this.inputId,
      inputName: 'key'
    });
    this.createPV();
    this.initEvents();
  }
};

TCS.install = function(Vue) {
  TCS.init();
  Vue.prototype.$TCS = TCS;
  Vue.mixin({
    watch: {
      /**
       * 切换路由后要发送一条pv（相当于浏览了一次页面）
       */
      $route: function() {
        // 只有绑定路由的组件才会触发发送PV
        if (this.$options.router) {
          this.$TCS.sendPV();
        }
      }
    }
  });
};

export default TCS;
