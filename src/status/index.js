/*
* 状态码
* */

import comm from './comm/Status'
import salemanager from './salemanager/Status'

var Status = function () {}

Status.prototype = {

    // 状态码
    status1: Object.assign(
        {},
        // 在下面增加
        salemanager
    ),
    // 返回所有状态码。 最后引入通用编码. 如果重复， 以通用编码优先
    status () {
        return Object.assign(this.status1, comm)
    },

    /**
     * 匹配网关返回状态码的信息
     * @param status 网关返回的状态码
     * @param defaultMessage 默认信息，状态码未匹配到信息时候使用
     * @returns {*|string}
     */
    getMsgByStatus (status, defaultMessage) {
        return (this.status()[status] || (defaultMessage || '系统出错了，请联系工作人员。'))+ " (错误码 : "+status+")"
    }
}

export default Status
