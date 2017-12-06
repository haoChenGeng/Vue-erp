import DateUtils from 'src/utils/DateUtils.js'
let config = {
    columns:[
        {
            'prop': 'id',
            'label':'ID'
        },
        {
            'prop': 'uid',
            'label':'uid'
        },
        {
            'prop': 'userName',
            'label':'用户名'
        },
        {
            'prop': 'ip',
            'label':'IP'
        },
        {
            'prop': 'loginType',
            'label':'登录平台',
            'list':'loginType'
        },
        {
            'prop': 'loginPortal',
            'label':'登录入口'
        },
        {
            'prop': 'createTime',
            'label':'登录时间',
            formatter: function (val){
                return val ? DateUtils(val*1000,'yyyy-mm-dd HH:MM'): val
            }
        },
    ]
}

export default config
