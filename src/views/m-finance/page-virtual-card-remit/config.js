import Cookie from 'js-cookie'
export const breadcrumbData = [
    { title: '财务' },
    { title: '财务基础数据' },
    { title: '银行虚拟卡汇款记录' }
];

export const columns = [
    { "prop": "orignizationName", "label": "财务组织" },
    { "prop": "bankName", "label": "银行类型" },
    { "prop": "bankAccount", "label": "主卡卡号" },
    { "prop": "virtualCard", "label": "虚拟卡卡号" },
    { "prop": "bankFlowNo", "label": "银行流水号" },
    { "prop": "payUsername", "label": "支付方户名"},
    { "prop": "payBank", "label": "支付银行"},
    { "prop": "payAccount", "label": "支付方账号"},
    {"prop": "remitAmount", "label": "交易金额（元)"},
    {"prop": "status", "label": "确认状态","list": "statusOptions" },
    { "prop": "payTime", "label": "到帐时间", "formatter": "dateParser" },
    { "prop": "createTime", "label": "生成时间", "formatter": "dateParser" },
    { "prop": "confirmTime", "label": "确认时间", "formatter": "dateParser" }
]


