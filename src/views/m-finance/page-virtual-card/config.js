import Cookie from 'js-cookie'
export const breadcrumbData = [
    { title: '财务' },
    { title: '财务基础数据' },
    { title: '银行虚拟卡管理' }
];

export const columns = [
    { "prop": "orignizationName", "label": "财务组织" },
    { "prop": "bankAccount", "label": "主卡卡号" },
    { "prop": "bankName", "label": "银行类型" },
    { "prop": "virtualCard", "label": "虚拟卡卡号" },
    { "prop": "bankBranch", "label": "开户行地址" },
    { "prop": "cardStatus", "label": "卡状态","list": "cardStatusOptions" },
    { "prop": "occupyStatus", "label": "卡使用情况", "list": "cardUseOption" },
    { "prop": "createTime", "label": "导入时间", "formatter": "dateParser" },
    { "prop": "activateTime", "label": "激活时间", "formatter": "dateParser" },
    { "prop": "updateTime", "label": "更新时间", "formatter": "dateParser" }
]


