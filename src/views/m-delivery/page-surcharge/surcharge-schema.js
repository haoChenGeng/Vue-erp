import Service from 'src/services/delivery/surcharge/Service.js'
export default {

    //查看单头
    mainTable: {
        name: 'goodsDemand',
        service: Service.SURCHARGE.name,
        method: Service.SURCHARGE.methods.QUERYDETAIL,
        args: {
            id: null
        },
        tabs: [
            {
                label: '基本信息',
                name: 'tab1',
                fields: [
                    {
                        type: 'input',
                        label: '单据编码',
                        prop: 'code',
                		disabled: true
                    },
                    {
                        type: 'input',
                        label: '商家名称',
                        prop: 'supplierName',
                		disabled: true
                    },
                    {
                        type: 'input',
                        label: '附加费类别',
                        prop: 'surchargeTypeName',
                		disabled: true
                    },
                    {
                        type: 'select',
                        label: '关联单据类型',
                        prop: 'sourceOrderType',
                        disabled: true,                        
                        list: 'sourceOrderTypeOpt'
                    },
                    {
                        type: 'input',
                        label: '关联单据',
                        prop: 'sourceOrderCode',
                		disabled: true
                    },
                    {
                        type: 'input',
                        label: '关联单据行',
                        prop: 'sourceOrderLineNo',
                		disabled: true
                    },
                    {
                        type: 'input',
                        label: '币别',
                        prop: 'currencyName',
                		disabled: true
                    },
                    {
                        type: 'input',
                        label: '申请金额',
                        prop: 'applyAmount',
                		disabled: true
                    },
                    {
                        type: 'input',
                        label: '实结金额',
                        prop: 'realAmount',
                		disabled: true
                    },
                    {
                        type: 'select',
                        label: '数据状态',
                        prop: 'verifyStatus',
                        disabled: true,
                        list:'verifyStatusOpt'
                    },
                    {
                        type: 'select',
                        label: '结算状态',
                        prop: 'settleStatus',
                		disabled: true,
                        list: 'settleStatusOpt'
                    },
                    {
                        type: 'textarea',
                        label: '描述',
                        prop: 'remark',
                		disabled: true
                    }
                ]
            },
            {
                label: '其他信息',
                name: 'tab2',
                fields: [
                    {
                        type: 'input',
                        label: '创建人',
                        prop: 'createUserName',
                		disabled: true
                    },
                    {
                        type: 'input',
                        label: '修改人',
                        prop: 'updateUser',
                		disabled: true
                    },
                    {
                        type: 'input',
                        label: '审核人',
                        prop: 'verifyUserName',
                		disabled: true
                    },
                    {
                        type: 'datetime',
                        label: '创建时间',
                        prop: 'createTime',
                		disabled: true
                    },
                    {
                        type: 'datetime',
                        label: '修改时间',
                        prop: 'updateTime',
                		disabled: true
                    },                    
                    {
                        type: 'datetime',
                        label: '审核时间',
                        prop: 'verifyTime',
                		disabled: true
                    },
                    {
                        type: 'textarea',
                        label: '关闭原因',
                        prop: 'closeReason',
                		disabled: true
                    }
                ]
            }
        ]
    },
    //审核主表
    verifyFiled: {
        label: "流程信息",
        name: "verifyFiled",
        fields: [
            {
                type: 'input',
                label: '任务ID',
                prop: 'taskId',
                disabled: true
            },
            {
                type: 'input',
                label: '流程名',
                prop: 'processName',
                disabled: true
            },
            {
                type: 'input',
                label: '发起人',
                prop: 'startName',
                disabled: true
            },
            {
                type: 'datetime',
                label: '发起时间',
                prop: 'startTime',
                disabled: true
            },
        ]
    },
    //审核附表
    verifySub: {
        name: 'verifySub',
        tabs: [
            {
                label: '基本信息',
                name: 'tab1',
                fields: [
                    {
                        type: 'input',
                        label: '单据编码',
                        prop: 'code',
                		disabled: true
                    },
                    {
                        type: 'input',
                        label: '商家名称',
                        prop: 'supplierName',
                		disabled: true
                    },
                    {
                        type: 'input',
                        label: '附加费类别',
                        prop: 'surchargeTypeName',
                		disabled: true
                    },
                    {
                        type: 'select',
                        label: '关联单据类型',
                        prop: 'sourceOrderType',
                        disabled: true,                        
                        list: 'sourceOrderTypeOpt'
                    },
                    {
                        type: 'input',
                        label: '关联单据',
                        prop: 'sourceOrderCode',
                		disabled: true
                    },       
                    {
                        type: 'input',
                        label: '币别',
                        prop: 'currencyName',
                		disabled: true
                    },
                    {
                        type: 'input',
                        label: '申请金额',
                        prop: 'applyAmount',
                		disabled: true
                    },
                    {
                        type: 'textarea',
                        label: '描述',
                        prop: 'remark',
                		disabled: true
                    }
                ]
            },
            {
                label: '其他信息',
                name: 'tab2',
                fields: [
                    {
                        type: 'input',
                        label: '创建人',
                        prop: 'createUserName',
                		disabled: true
                    },
                    {
                        type: 'input',
                        label: '修改人',
                        prop: 'updateUser',
                		disabled: true
                    },
                    {
                        type: 'input',
                        label: '审核人',
                        prop: 'verifyUserName',
                		disabled: true
                    },
                    {
                        type: 'datetime',
                        label: '创建时间',
                        prop: 'createTime',
                		disabled: true
                    },
                    {
                        type: 'datetime',
                        label: '修改时间',
                        prop: 'updateTime',
                		disabled: true
                    },                    
                    {
                        type: 'datetime',
                        label: '审核时间',
                        prop: 'verifyTime',
                		disabled: true
                    },
                    {
                        type: 'textarea',
                        label: '关闭原因',
                        prop: 'closeReason',
                		disabled: true
                    }
                ]
            }
        ]
    }
}