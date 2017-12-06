/**
 * Created by tomy.li on 2017/05/03.
 * PDF打印
 * @example
 * import printPDFUtils from 'src/utils/printPDF.js'
 * printPDFUtils({
        service: 'serviceName',
        method: 'methodName',
        args: {
            ids:[1,23,34]
        },
    })

 */

import Config from 'src/config/server.js'
import Cookie from 'js-cookie'

function buildURL(obj) {
    let arr = [
        Config.gatewayAddr,
        encodeURIComponent(obj.service),
        encodeURIComponent(obj.method)
    ]

    let args = obj.args || {}
    /*args.page = args.page ? args.page : 1
    args.size = args.size ? args.size : 2000*/

    let _url = arr.join('/')
    let querys = 'action=printPDF&uid=' + Cookie.get('t8t-tc-uid') + '&ticket=' + Cookie.get('t8t-tc-ticket')
        + '&args=' + JSON.stringify(args)

    _url += ('/?' + querys)

    return _url
}

export default function(obj) {
    let url = buildURL(obj)
    let a = document.createElement('a')
    a.href = url
    a.target = '_blank'
    //a.download = ''
    a.click()
}
