// 报价单状态 0-完成初稿 1-审核中 2-审核驳回 3-报价已出 4-核算中 5-核算驳回 6-报价完成 7-已签约
export const orderStatusArray = [
    { value: 0, text: '完成初稿' },
    { value: 1, text: '审核中' },
    { value: 2, text: '审核驳回' },
    { value: 3, text: '报价已出' },
    { value: 4, text: '核算中' },
    { value: 5, text: '核算驳回' },
    { value: 6, text: '报价完成' },
    { value: 7, text: '已签约' },
]

// 校验手机号码
export const checkPhone = function (rule, value, callback) {
    if (value !== null && value !== 'undefined') {
        const val = value.trim()
        if (val.length > 0) {
            if(!(/^1[34578]\d{9}$/.test(val))){
                return callback(new Error('请输入正确的手机号码'))
            }
        }
    }
    return callback()
}

// 校验身份证号码
export const checkIentityNumber = function (rule, value, callback) {
    if (value !== null && value !== 'undefined') {
        const val = value.trim()
        if (val.length > 0) {
            if (val.length !== 18) {
                return callback(new Error('请输入18位身份证号码'))
            }
        }
    }
    return callback()
}

