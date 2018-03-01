/**
 * ------------------------------------------------------------------
 * description:
 * author: carl.wu@corp.to8to.com
 * date: 2018/1/30 10:44
 * ------------------------------------------------------------------
 */

const Cookie = require('js-cookie')
const md5 = require('md5')

let System = {}

/**
 * 是否演示系统
 * @returns {boolean}
 */
System.isDemoSystem = function () {
    let demo = this.getLocalTag()
    let validTag = this.createSystemTag()

    return demo === validTag
}

System.createSystemTag = function () {
    let date = new Date()
    let hs = '/hello/' + date.getFullYear() + '-' + formatNumber(date.getMonth() + 1) + '-' + formatNumber(date.getDate())
    return md5(hs)
}

System.getLocalTag = function () {
    return Cookie.get('demo')
}

function formatNumber(month) {
    if (month < 10) {
        return '0' + month
    }

    return month
}

export default System
