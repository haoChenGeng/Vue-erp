
/**
 * 根据ID获取文本
 * @param {Array} list
 * @param {Array} value
 * @returns text
 */
export const getTextById = function (list, value, prop) {
    let item = list.filter((item) => item.value === value)
    if (item[0]) {
        if (item[0].hasOwnProperty(prop)) {
            return item[0][prop]
        } else if (item[0].hasOwnProperty('text')) {
            return item[0]['text']
        } else if (item[0].hasOwnProperty('label')) {
            return item[0]['label']
        }
    } else {
        return ''
    }
}


/**
 * 定义操作类型
 */
export const M = {
    create: '提交',
    update: '编辑',
    delete: '删除',
    void: '作废',
    valid: '反作废'
}
/**
 * 根据消息和类型生成一个 msgBox 配置项
 * @param {String} message
 * @param {String} type
 */
export const mb = function (message, type) {
    let mbCfg = {
        title: '消息',
        type: type || 'success',
        message: message,
        showCancelButton: false,
        confirmButtonText: '知道了',
        confirmButtonClass: 'is-plain'
    }
    return mbCfg
}

