// http请求库配置
import Vue from 'vue'
import axios from 'axios'
import Cookie from 'js-cookie'
import qs from 'qs'
import Utils from './Utils.js'
import Config from 'src/config/server.js'

axios.defaults.timeout = 20000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

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

    if(res.data &&  res.data.status !== 200){
        // ticket过期处理
        if (res.data.status === 605) {

            // 直接踢出
            Utils.logout(false)
        }

        //可控的、有必要让用户知道的错误类型进行弹框提示
        let status = [
            601,
            602,
            603,
            604,
            605,
            607,
            619
        ]
        if( status.indexOf(res.data.status) > -1 ){
            let msg = Utils.getGatewayError(res.data.status)
            Vue.prototype.$message.error(msg)
            res.data.message = res.data.error = msg
        }else if(res.data.message){
            res.data.message = res.data.message.split('|||')[0]
        }
    }

    return res
}, (error) => {
    console.log('网络异常！')
    return Promise.reject(error)
})

function buildURL(obj) {
    let arr = [
        Config.oldGatewayAddr,
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
