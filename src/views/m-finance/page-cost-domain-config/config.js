import Cookie from 'js-cookie'
export const breadcrumbData = [
    {
        title: '财务'
    },
    {
        title: '财务基础配置'
    },
    {
        title: '存货核算成本域配置'
    }
];
export const columns = [
    {
        prop: 'code',
        label: '成本域编码'
    },
    {
        prop: 'name',
        label: '成本域名称'
    },
    {
        prop: 'status',
        label: '状态',
        list: 'status'
    },
    {
        prop: 'remark',
        label: '备注'
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
            text: '停用',
            value: 0
        },
        {
            text: '启用',
            value: 1
        }
    ]
};

export const formData = {
    id: null,
    code: null,
    name: null,
    status: null,
    remark: null,
    createUser: parseInt(Cookie.get('t8t-tc-uid'))
};
