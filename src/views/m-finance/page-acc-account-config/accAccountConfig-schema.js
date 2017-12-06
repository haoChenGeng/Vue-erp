export default {
    mainTable: {
        name: 'accAccountConfig',
        service: 'L2H1suP0jbhqxlo08YrbjBL0R-oSAqV',
        method: 'wpSzkrR5yLqBzVSw_docBos3J65vaP7k84fqFBC',
        args: {
            id: null
        },
        createMethod: 'mjhfSNUezY3g-bAa9bxja3mG1ga3lemdRk-',
        updateMethod: 'lkLyblcjs4g7oPeBXr2V2nwISArVRyyeRhL',
        fields: [
            {
                type: 'select',
                label: '用户类型code|取自supply_property.whole_code',
                prop: 'userTypeCode',
                list: 'userTypeCode',
                rules: [
                    {required: true, message: '不能为空'},
                    {type: 'string', message: '请填写字符串'}
                ]
            },{
                type: 'input',
                label: '账户类型code|取自supply_property.whole_code',
                prop: 'accountTypeCode',
                rules: [
                    {required: true, message: '不能为空'},
                    {type: 'string', message: '请填写字符串'},
                    {min: 1, message: '不能少于个字符'},
                    {max: 10, message: '不能多于个字符'},
                    {min: 1, message: '不能小于'},
                    {max: 10, message: '不能大于'}
                ]
            },{
                type: 'select',
                label: '账户层级|1-一级 2-二级',
                prop: 'accountLevel',
                list: 'accountLevel',
                rules: [
                    {required: true, message: '不能为空'},
                    {type: 'integer', message: '请填写整数'}
                ]
            },{
                type: 'select',
                label: '单位类型code|取自supply_property.whole_code',
                prop: 'unitCode',
                list: 'unitCode',
                rules: [
                    {required: true, message: '不能为空'},
                    {type: 'string', message: '请填写字符串'}
                ]
            },{
                type: 'select',
                label: '上级账户类型|取自supply_property.whole_code',
                prop: 'parentAccountTypeCode',
                list: 'parentAccountTypeCode',
                rules: [
                    {required: true, message: '不能为空'},
                    {type: 'string', message: '请填写字符串'}
                ]
            },{
                type: 'select',
                label: '上级用户类型|取自supply_property.whole_code',
                prop: 'parentUserTypeCode',
                list: 'parentUserTypeCode',
                rules: [
                    {required: true, message: '不能为空'},
                    {type: 'string', message: '请填写字符串'}
                ]
            },{
                type: 'select',
                label: '是否透支|1-透支，2-不能透支',
                prop: 'isOverdraft',
                list: 'isOverdraft',
                rules: [
                    {required: true, message: '不能为空'},
                    {type: 'integer', message: '请填写整数'}
                ]
            },{
                type: 'select',
                label: '透支类型|1-个性额度，2-统一额度',
                prop: 'overdraftType',
                list: 'overdraftType',
                rules: [
                    {required: true, message: '不能为空'},
                    {type: 'integer', message: '请填写整数'}
                ]
            },{
                type: 'input',
                label: '统一透支额度',
                prop: 'overdraftCredit',
                rules: [
                    {required: true, message: '不能为空'},
                    {type: 'float', message: '请填写数值'}
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
    }
}
