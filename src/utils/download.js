import Utils from './Utils.js'

export default function(url) {
    let a = document.createElement('a')
    let _url = (url.indexOf('&action=file&uid=') > -1) ? url : Utils.getFullURL(url)
    a.href = _url
    a.download = ''
    a.click()
}
