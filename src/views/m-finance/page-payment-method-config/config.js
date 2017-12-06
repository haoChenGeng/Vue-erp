import Cookie from 'js-cookie'
export const breadcrumbData = [
    {
        title: '财务'
    },
    {
        title: '财务基础配置'
    },
    {
        title: '付款方式配置'
    }
];
export const columns = [
    {
        prop: 'remitChannelCode',
        label: '编码',
    },
    {
        prop: 'name',
        label: '付款方式'
    },
    {
        prop: 'organizationName',
        label: '付款主体'
    },
    {
        prop: 'channelType',
        label: '渠道',
        list: 'channelType'
    },
    {
        prop: 'bankNames',
        label: '开户银行'
    },
    {
        prop: 'isPublic',
        label: '对公对私',
        list:'isPublic'
    },
    {
        prop: 'amount',
        label: '付款金额'
    },
    {
        prop: 'status',
        label: '禁用状态',
        list: 'status'
    },
    {
        prop: 'createUserName',
        label: '创建人'
    },
    {
        prop: 'createTime',
        label: '创建时间',
        formatter: "dateParser"
    },
    {
        prop: 'updateUserName',
        label: '修改人'

    },
    {
        prop: 'updateTime',
        label: '修改时间',
        formatter: "dateParser"
    }
];
export const commonData = {
    channelType: [
        {
            text: '线上',
            value: 1
        },
        {
            text: '线下',
            value: 2
        }
    ],
    status: [
        {
            text: '是',
            value: 0
        },
        {
            text: '否',
            value: 1
        }
    ],
    isPublic: [
        {
            text: '对公对私',
            value: 1
        },
        {
            text: '对公',
            value: 2
        },
        {
            text: '对私',
            value: 3
        }
    ]
};

export const formData = {
    remitChannelCode: null,
    remitChannelId: null,
    name: null,
    organizationId: null,
    channelType: null,
    bankIds: [],
    isPublic: null,
    amountLowerBound:null,
    amountUpperBound:null,
    createUser: parseInt(Cookie.get('t8t-tc-uid'))
};

export const rules = {
    remitChannelId: [
        {type:"number",required: true , message: "请选择付款方式",trigger: 'change'}
    ],
    organizationId: [
        {type:"number",required: true , message: "请选择付款主体",trigger: 'change'}
    ],
    channelType: [
        {required: true , message: "请选择渠道",trigger: 'change'}
    ],
   bankIds: [
       {type:"array", required: true , message: "请选择开户银行", trigger: 'change'}
   ],
    isPublic: [
        {required: true , message: "请选择对公对私", trigger: 'change'}
    ],
    amountLowerBound:[
        {
            type:'number',
            required: true,
            min:0,
            max:9999999,
            message: '请输入0-9999999的整数',
            trigger: 'blur',
        },
        {
            pattern: /^[0-9]*[0-9][0-9]*$/,
            message: '请输入0-9999999的整数',
            trigger: 'blur'
        }
    ],
    amountUpperBound:[
        {
            type:'number',
            required: true,
            min:0,
            max:9999999,
            message: '请输入0-9999999的整数',
            trigger: 'blur'
        },
        {
            pattern: /^[0-9]*[1-9][0-9]*$/,
            message: '请输入0-9999999的整数',
            trigger: 'blur'
        }
    ]
};
