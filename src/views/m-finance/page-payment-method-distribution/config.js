import Cookie from 'js-cookie'
export const breadcrumbData = [
    {
        title: '财务'
    },
    {
        title: '财务基础配置'
    },
    {
        title: '付款方式分配'
    }
];
export const columns = [
    {
        prop: 'organizationNames',
        label: '业务组织',
    },
    {
        prop: 'businessTypeName',
        label: '业务类型'
    },
    {
        prop: 'payObjectName',
        label: '付款对象',
    },
    {
        prop: 'payTypeName',
        label: '付款类型'
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
        prop: 'payOrganizationName',
        label: '付款主体',
    },
    {
        prop: 'payChannelName',
        label: '付款方式'
    },
    {
        prop: 'priority',
        label: '优先级'
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
    organizationIds: [],
    payTypeId: null,
    businessTypeName: null,
    payOrganizationName: null,
    payObjectName: null,
    payChannelId: null,
    createUser: parseInt(Cookie.get('t8t-tc-uid')),
    priority:null,
};
export const rules = {
    organizationIds: [
        {
            type:'array',
            required: true ,
            message: "请选择组织",
            trigger: 'change'
        }
    ],
    payTypeId: [
        {
            type:'number',
            required: true ,
            message: "请选择付款类型",
            trigger: 'change'
        }
    ],
    payChannelId: [
        {
            type:'number',
            required: true ,
            message: "请选择付款方式",
            trigger: 'change'
        }
    ],
    priority: [
        {
            required: true ,
            message: "请输入优先级",
        },
        { pattern: /^\+?[1-9][0-9]*$/, message: '只允许正整数' }
    ]
};
