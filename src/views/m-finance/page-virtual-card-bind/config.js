import Cookie from 'js-cookie'
export const breadcrumbData = [
    { title: '财务' },
    { title: '财务基础数据' },
    { title: '银行虚拟卡绑定查询' }
];

export const columns = [
    { "prop": "orignizationName", "label": "财务组织" },
    { "prop": "bankAccount", "label": "主卡卡号" },
    { "prop": "bankName", "label": "银行类型" },
    { "prop": "virtualCard", "label": "虚拟卡卡号" },
    { "prop": "customerOrgnizationName", "label": "客户组织" },
    { "prop": "objectName", "label": "客户"},
    { "prop": "customerId", "label": "客户id" },
    { "prop": "projectId", "label": "项目id" ,
        formatter(val) {
            let color = val >0 ? val : ''
            return color
        }
    },
    { "prop": "bussinessTypeName", "label": "业务类型" },
    {"prop": "status", "label": "绑卡状态","list": "statusOptions" },
    {"prop": "unwrapMethod", "label": "解绑方式","list": "unwrapMethodOptions" },
    { "prop": "createTime", "label": "绑定时间", "formatter": "dateParser" },
    { "prop": "unwrapTime", "label": "解绑时间", "formatter": "dateParser" }
]


