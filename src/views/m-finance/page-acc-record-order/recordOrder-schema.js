export default {
    mainTable: {
        name: 'recordOrder',
        service: 'Kh3eXXNq1QESZYlg9uYQ5i2kzpHtBuC',
        method: 'eEmphcb6H5gMMibYcwnn6wZYH5VUl9N',
        args: {
            id: null
        },
        createMethod: 'mfMxnEF7cbU9CeSQE3Q_SvROfHx',
        updateMethod: 'hoKTe54-oH9JmOL9eFNLJpaMBRo',
        fields: [
            {
                type: 'input',
                label: '业务组织id',
                prop: 'organizationId',
                rules: [
                    {required: true, message: '不能为空'},
                    {type: 'integer', message: '请填写整数'}
                ]
            },{
                type: 'input',
                label: '法人组织id',
                prop: 'financialId',
                rules: [
                    {required: true, message: '不能为空'},
                    {type: 'integer', message: '请填写整数'}
                ]
            },{
                type: 'input',
                label: '业务模块',
                prop: 'businessModuleCode',
                rules: [
                    {required: true, message: '不能为空'},
                    {type: 'string', message: '请填写字符串'}
                ]
            },{
                type: 'input',
                label: '单据类型编码',
                prop: 'orderTypeCode',
                rules: [
                    {required: true, message: '不能为空'},
                    {type: 'string', message: '请填写字符串'}
                ]
            },{
                type: 'input',
                label: '收支单编号',
                prop: 'code',
                rules: [
                    {required: true, message: '不能为空'},
                    {type: 'string', message: '请填写字符串'}
                ]
            },{
                type: 'input',
                label: '状态',
                prop: 'status',
                rules: [
                    {required: true, message: '不能为空'},
                    {type: 'integer', message: '请填写整数'}
                ]
            },{
                type: 'input',
                label: '创建人ID',
                prop: 'createUser',
                rules: [
                    {required: false, message: '不能为空'},
                    {type: 'integer', message: '请填写整数'}
                ]
            },{
                type: 'input',
                label: '创建人名称',
                prop: 'createName',
                rules: [
                    {required: false, message: '不能为空'},
                    {type: 'string', message: '请填写字符串'}
                ]
            },{
                type: 'input',
                label: '创建人登录名称',
                prop: 'createBy',
                rules: [
                    {required: false, message: '不能为空'},
                    {type: 'string', message: '请填写字符串'}
                ]
            },{
                type: 'datetime',
                label: '创建时间',
                prop: 'createTime',
                rules: [
                    {required: false, message: '不能为空'},
                    {type: 'integer', message: '请填写整数'}
                ]
            },{
                type: 'input',
                label: '修改人ID',
                prop: 'updateUser',
                rules: [
                    {required: false, message: '不能为空'},
                    {type: 'integer', message: '请填写整数'}
                ]
            },{
                type: 'input',
                label: '修改人名称',
                prop: 'updateName',
                rules: [
                    {required: false, message: '不能为空'},
                    {type: 'string', message: '请填写字符串'}
                ]
            },{
                type: 'input',
                label: '修改人登录名称',
                prop: 'updateBy',
                rules: [
                    {required: false, message: '不能为空'},
                    {type: 'string', message: '请填写字符串'}
                ]
            },{
                type: 'datetime',
                label: '修改时间',
                prop: 'updateTime',
                rules: [
                    {required: false, message: '不能为空'},
                    {type: 'integer', message: '请填写整数'}
                ]
            }
        ]
    },
    subTables:  [
        {
            name: 'recordOrderItem',
            label: '收支单明细表',
            type: 'table',
            service: 'Kh3eXXNq1QESZYlg9uYQ5i2kzpHtBuC',
            method: 'o4RguHcyl3FjsUFafoaU5djCIpqXLUCEfd6WMRL',
            args: {
                search: {
                    recordOrderId: '@id'
                }
            },
            fields: [
                {
                    type: 'input',
                    label: '创建人ID',
                    prop: 'createUser',
                    editor: {
                        type: 'input',
                        rules: [
                            {required: false, message: '不能为空'},
                            {type: 'integer', message: '请填写整数'}
                        ]
                    }
                },
                {
                    type: 'input',
                    label: '创建人名称',
                    prop: 'createName',
                    editor: {
                        type: 'input',
                        rules: [
                            {required: false, message: '不能为空'},
                            {type: 'string', message: '请填写字符串'}
                        ]
                    }
                },
                {
                    type: 'input',
                    label: '创建人登录名称',
                    prop: 'createBy',
                    editor: {
                        type: 'input',
                        rules: [
                            {required: false, message: '不能为空'},
                            {type: 'string', message: '请填写字符串'}
                        ]
                    }
                },
                {
                    type: 'input',
                    label: '创建时间',
                    prop: 'createTime',
                    editor: {
                        type: 'datetime',
                        rules: [
                            {required: false, message: '不能为空'},
                            {type: 'integer', message: '请填写整数'}
                        ]
                    }
                },
                {
                    type: 'input',
                    label: '修改人ID',
                    prop: 'updateUser',
                    editor: {
                        type: 'input',
                        rules: [
                            {required: false, message: '不能为空'},
                            {type: 'integer', message: '请填写整数'}
                        ]
                    }
                },
                {
                    type: 'input',
                    label: '修改人名称',
                    prop: 'updateName',
                    editor: {
                        type: 'input',
                        rules: [
                            {required: false, message: '不能为空'},
                            {type: 'string', message: '请填写字符串'}
                        ]
                    }
                },
                {
                    type: 'input',
                    label: '修改人登录名称',
                    prop: 'updateBy',
                    editor: {
                        type: 'input',
                        rules: [
                            {required: false, message: '不能为空'},
                            {type: 'string', message: '请填写字符串'}
                        ]
                    }
                },
                {
                    type: 'input',
                    label: '修改时间',
                    prop: 'updateTime',
                    editor: {
                        type: 'datetime',
                        rules: [
                            {required: false, message: '不能为空'},
                            {type: 'integer', message: '请填写整数'}
                        ]
                    }
                },
                {
                    type: 'input',
                    label: '关联收支单标号',
                    prop: 'recordOrderId',
                    editor: {
                        type: 'input',
                        rules: [
                            {required: true, message: '不能为空'},
                            {type: 'integer', message: '请填写整数'}
                        ]
                    }
                },
                {
                    type: 'input',
                    label: '业务单据编号',
                    prop: 'bizCode',
                    editor: {
                        type: 'input',
                        rules: [
                            {required: true, message: '不能为空'},
                            {type: 'string', message: '请填写字符串'}
                        ]
                    }
                },
                {
                    type: 'input',
                    label: '用户ID',
                    prop: 'userId',
                    editor: {
                        type: 'input',
                        rules: [
                            {required: true, message: '不能为空'},
                            {type: 'integer', message: '请填写整数'}
                        ]
                    }
                },
                {
                    type: 'input',
                    label: '用户类型code',
                    prop: 'userTypeCode',
                    editor: {
                        type: 'input',
                        rules: [
                            {required: true, message: '不能为空'},
                            {type: 'string', message: '请填写字符串'}
                        ]
                    }
                },
                {
                    type: 'input',
                    label: '账户类型code',
                    prop: 'accountTypeCode',
                    editor: {
                        type: 'input',
                        rules: [
                            {required: true, message: '不能为空'},
                            {type: 'string', message: '请填写字符串'}
                        ]
                    }
                },
                {
                    type: 'input',
                    label: '收支类型',
                    prop: 'recordType',
                    editor: {
                        type: 'input',
                        rules: [
                            {required: true, message: '不能为空'},
                            {type: 'integer', message: '请填写整数'}
                        ]
                    }
                },
                {
                    type: 'input',
                    label: '收支子类型',
                    prop: 'recordChildTypeCode',
                    editor: {
                        type: 'input',
                        rules: [
                            {required: true, message: '不能为空'},
                            {type: 'string', message: '请填写字符串'}
                        ]
                    }
                },
                {
                    type: 'input',
                    label: '收支单明细金额',
                    prop: 'amount',
                    editor: {
                        type: 'input',
                        rules: [
                            {required: true, message: '不能为空'},
                            {type: 'float', message: '请填写数值'}
                        ]
                    }
                },
                {
                    type: 'input',
                    label: '单位类型',
                    prop: 'unitCode',
                    editor: {
                        type: 'input',
                        rules: [
                            {required: true, message: '不能为空'},
                            {type: 'string', message: '请填写字符串'}
                        ]
                    }
                },
                {
                    type: 'input',
                    label: '备注',
                    prop: 'remark',
                    editor: {
                        type: 'input',
                        rules: [
                            {required: true, message: '不能为空'},
                            {type: 'string', message: '请填写字符串'}
                        ]
                    }
                }
            ]
        }
    ]
}
