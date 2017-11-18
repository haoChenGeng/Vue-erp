import Cookie from 'js-cookie'
export const breadcrumbData = [
    {
        title: '财务'
    },
    {
        title: '财务基础配置'
    },
    {
        title: '付款类型配置'
    }
];
export const columns = [
    {
        prop: 'remitTypeCode',
        label: '编码',
    },
    {
        prop: 'name',
        label: '付款类型'
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
    ]
};

export const formData = {
    remitTypeCode: null,
    remitTypeId: null,
    name: null,
    businessTypeId: null,
    payObjectId: null,
    createUser: parseInt(Cookie.get('t8t-tc-uid')),
};

export const rules = {
    remitTypeId: [
        {
            type:'number',
            required: true ,
            message: "请选择付款类型",
            trigger: 'change'
        }
    ],
    businessTypeId: [
        {
            type:'number',
            required: true ,
            message: "请选择业务类型",
            trigger: 'change'
        }
    ],
    payObjectId: [
        {
            type:'number',
            required: true ,
            message: "请选择付款对象",
            trigger: 'change'
        }
    ]
};
