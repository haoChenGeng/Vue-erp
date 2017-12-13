import Cookie from 'js-cookie'
export const breadcrumbData = [
    { title: '财务' },
    { title: '财务配置管理' },
    { title: '资金渠道管理配置' }
];

export const columns = [
    { "prop": "channelNo", "label": "编码" },
    { "prop": "origanizationName", "label": "财务组织" },
    { "prop": "channelName", "label": "资金渠道" },
    { "prop": "secondChannelName", "label": "二级渠道" },
    { "prop": "partnerNo", "label": "商户编号" },
    { "prop": "account", "label": "商户账号" },
    { "prop": "channelType", "label": "收付类型", "list": "channelTypeOptions" },
    { "prop": "secretKeyType", "label": "密钥类型", "list": "secretKeyTypeOption" },
    { "prop": "wechatPublic", "label": "公众号ID" },
    { "prop": "status", "label": "状态", "list": "statusOptions" },
    { "prop": "createName", "label": "创建人" },
    { "prop": "createTime", "label": "创建时间", "formatter": "dateParser" },
    { "prop": "updateName", "label": "修改人" },
    { "prop": "updateTime", "label": "修改时间", "formatter": "dateParser" }
]

export const formData = {
    channelNo: '',
    channelType: '',
    channelId: '',
    secondChannelId: '',
    partnerNo: '',
    account: '',
    wechatPublic: '',
    secretKeyType: '',
    md5Key: '',
    rsaPublicKey: '',
    rsaPrivateKey: '',
    createUser: parseInt(Cookie.get('t8t-tc-uid'))
}

export const rules = {
    channelNo: [
        {
            required: true ,
            message: "请填写编码",
            trigger: 'blur'
        },
        {
            max: 50,
            message: '编码最大不超过50个字符',
            trigger: 'blur'
        }
    ],
    channelType: [
        {
            type:'number',
            required: true ,
            message: "请选择收付类型",
            trigger: 'change'
        }
    ],
    channelId: [
        {
            type:'number',
            required: true ,
            message: "请选择资金渠道",
            trigger: 'change'
        }
    ],
    partnerNo: [
        {
            required: true ,
            message: "请填写商户编号",
            trigger: 'blur'
        },
        {
            max: 50,
            message: '商户编号最大不超过50个字符',
            trigger: 'blur'
        }
    ],
    account: [
        {
            max: 50,
            message: '商户账号最大不超过50个字符',
            trigger: 'blur'
        }
    ],
    wechatPublic: [
        {
            max: 50,
            message: '公众号id最大不超过50个字符',
            trigger: 'blur'
        }
    ],
    secretKeyType: [
        {
            type:'number',
            required: true ,
            message: "请选择密钥类型",
            trigger: 'change'
        }
    ],
    md5Key: [
        {
            required: true ,
            message: "请上传MD5密钥",
            trigger: 'change'
        },
        {
            max: 100,
            message: 'MD5密钥最大不超过100个字符',
            trigger: 'change'
        }
    ],
    rsaPublicKey: [
        {
            required: true ,
            message: "请上传RSA公钥",
            trigger: 'change'
        },
        {
            max: 4000,
            message: 'RSA公钥最大不超过4000个字符',
            trigger: 'change'
        }
    ],
    rsaPrivateKey: [
        {
            required: true ,
            message: "请上传RSA私钥",
            trigger: 'change'
        },
        {
            max: 4000,
            message: 'RSA私钥最大不超过4000个字符',
            trigger: 'change'
        }
    ]
}
