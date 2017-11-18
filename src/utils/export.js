/**
 * Created by Carl.wu on 2017/3/21.
 */
import Vue from 'vue'
import Config from 'src/config/server.js'
import Cookie from 'js-cookie'
import axios from 'axios'
import fileSaver from './FileSaver.js'

function buildURL(obj) {
    let arr = [
        Config.gatewayAddr,
        encodeURIComponent(obj.service),
        encodeURIComponent(obj.method)
    ]

    let args = obj.args || {}
    args.page = args.page ? args.page : 1
    args.size = args.size ? args.size : 2000

    let _url = arr.join('/')
    let ref = encodeURIComponent(window.location.hash.split('#')[1].split('?')[0])
    let querys = 'action=export&uid=' + Cookie.get('t8t-tc-uid') + '&ticket=' + Cookie.get('t8t-tc-ticket') + '&headers=' + obj.headers + '&args=' + JSON.stringify(args) + '&sorts=' + obj.sorts + '&title=' + (obj.title || "") + '&ref=' + ref

    _url += ('/?' + querys)

    return _url
}

function dateFtt(fmt, date) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function _getName() {
    let now = new Date()
    return dateFtt('yyyy-MM-dd hh-mm-ss', now)
}

export default function(obj) {
    let url = buildURL(obj)

    let myMsg = Vue.prototype.$message({
        duration: 0,
        message: '正在导出...'
    })

    return axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 120000,
            onDownloadProgress: function(progressEvent) {
                console.log(progressEvent)
            }
        })
        .then(res => {
            let _data = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            let _name = obj.title || _getName()
            fileSaver.saveAs(_data, _name + '.xls')
            myMsg.close()
        })
}
