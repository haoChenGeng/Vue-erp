// http请求库配置
import Vue from 'vue'
import axios from 'axios'
import Cookie from 'js-cookie'
import qs from 'qs'
import Utils from './Utils.js'
import Config from 'src/config/server.js'

axios.defaults.timeout = 20000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL = Config.oldGatewayAddr
    // POST传参序列化
axios.interceptors.request.use((config) => {
        if (config.method === 'post') {
            config.data = qs.stringify(config.data)
        }
        return config
    }, (error) => {
        console.log('错误的传参')
        return Promise.reject(error)
    })
    // code状态码200判断
axios.interceptors.response.use((res) => {

    // ticket过期处理
    if (res.data && res.data.status === 605) {
        Utils.redirectLoginPage()
    } else if (res.data && res.data.status !== 200 && res.data.message) {
        res.data.message = res.data.message.split('|||')[0]
    }
    return res
}, (error) => {
    console.log('网络异常！')
    return Promise.reject(error)
})

function buildURL(obj) {
    let arr = [
        axios.defaults.baseURL,
        encodeURIComponent(obj.service),
        encodeURIComponent(obj.method)
    ];

    let _url = arr.join('/');
    let querys = 'uid=' + Cookie.get('t8t-tc-uid') + '&ticket=' + Cookie.get('t8t-tc-ticket')

    _url += ('/?' + querys)

    return _url
}

export default function(obj) {
    var requestData = {
        args: JSON.stringify(obj.args || {})
    }

    let url = buildURL(obj)

    return axios({
        method: 'post',
        url: url,
        data: requestData,
        headers: {'ref-src': window.location.hash.split('#')[1].split('?')[0]}
    })
}
