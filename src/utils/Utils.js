/*
 * @FileName: Utils
 * @Description:
 * @Date: 2017-03-06
 * @version: 1.0
 * @author: <carl.wu@corp.to8to.com>
 */
import Config from 'src/config/server.js'
import Cookie from 'js-cookie'
import Parser from 'url'
import axios from 'axios'

let Utils = {
    redirectLoginPage() {
        location.href = '/#/login/'
    },
    redirectIndex() {
       location.href = '/#/index/'
    },
    // 上传url处理
    getUploadURL() {
        let _url = Config.gatewayAddr + '?action=file&uid=' + Cookie.get('t8t-tc-uid') + '&ticket=' + Cookie.get('t8t-tc-ticket')
        return _url
    },
    // 上传图片url处理
    getPicUploadURL() {
        let _url = Config.gatewayAddr + '?action=pic&uid=' + Cookie.get('t8t-tc-uid') + '&ticket=' + Cookie.get('t8t-tc-ticket')
        return _url
    },
    // url补全
    getFullURL(src) {
        let _url = Config.gatewayAddr + '?path=' + src + '&action=file&uid=' + Cookie.get('t8t-tc-uid') + '&ticket=' + Cookie.get('t8t-tc-ticket')
        return _url
    },
    // preview url补全
    getPreviewURL(src) {
        let _url = Config.gatewayAddr + '?path=' + src + '&action=preview&uid=' + Cookie.get('t8t-tc-uid') + '&ticket=' + Cookie.get('t8t-tc-ticket')
        return _url
    },
    // url验证码
    getCaptchaURL() {
        let _url = Config.gatewayAddr + '?action=captcha';
        return _url
    },
    getPublicKey(cb) {
        let _url = '?action=pbs'

        axios.defaults.timeout = 20000
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
        // axios.defaults.baseURL = _url
        return axios({
            method: 'GET',
            url: _url
        }).then((res) => {
            cb && cb(res)
        })
    },
    getImportURL(service, method) {
        let path = [service, method].join('/') + '/'
        return Parser.format({
            protocol: Config.protocol,
            host: Config.host,
            pathname: path,
            query: {
                action: "import",
                uid: Cookie.get('t8t-tc-uid'),
                ticket: Cookie.get('t8t-tc-ticket')
            }
        });
    },
    getFullURLById(id) {
        let _url = Config.gatewayAddr + '?file=' + id + '&action=file&uid=' + Cookie.get('t8t-tc-uid') + '&ticket=' + Cookie.get('t8t-tc-ticket')
        return _url
    }
}

export default Utils
