export const breadcrumbData = [
    {title: '财务'},
    {title: '返款管理'},
    {title: '轮单费'}
]

export const columns = [
    {'prop': 'sourceProjectId', 'label': '项目ID'},
    {'prop': 'houseAddress', 'label': '项目地址'},
    {
        'prop': 'dispatchFeeStatus', 'label': '操作',
        formatter: function (value) {
            return '申请返款'
        }
    },
    {'prop': 'appellation', 'label': '业主称呼'},
    {'prop': 'decoratePatternName', 'label': '装修方式'},
    {'prop': 'houseTypeName', 'label': '房屋类型'},
    {'prop': 'houseArea', 'label': '面积'},
    {'prop': 'dispatchFee', 'label': '轮单费'},
    {'prop': 'orderMainStatusName', 'label': '项目状态'},
    {'prop': 'dispatchFeeStatusName', 'label': '轮单费状态', 'list': 'reFundStatuses'},
]

export const operations = [
    {
        'text': '申请返款',
        'value': 0
    },
    {
        'text': '申请返款',
        'value': 1
    }
]

/**
 * 返款状态 1.全部 2.无返款状态 3.返款申请中 4.待定 5.已返款 6.返款被驳回
 */
export const reFundStatuses = [
    {text: '全部', value: 1},
    {text: '无返款状态', value: 2},
    {text: '返款申请中', value: 3},
    {text: '待定', value: 4},
    {text: '已返款', value: 5},
    {text: '返款被驳回', value: 6}
]
