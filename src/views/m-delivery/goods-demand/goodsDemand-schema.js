import Service from 'src/services/delivery/Service.js'
export default {
    //查看单头
    mainTable: {
        name: 'goodsDemand',
        service: Service.DEMAND.name,
        method: Service.DEMAND.methods.QUERYDETAIL,
        args: {
            id: null
        },
        createMethod: 'g__aNyQkKgwK2wk8sGtNlsh0vC-',
        updateMethod: 'GTqhHyn2K1hTGT5TZIFgR1EPDXT',
        tabs: [
            {
                label: '基本信息',
                name: 'tab1',
                fields: [
                    {
                        type: 'input',
                        label: '编号',
                        prop: 'orderCode'
                    },
                    {
                        type: 'input',
                        label: '单据类型',
                        prop: 'billType'
                    },
                    {
                        type: 'input',
                        label: '项目',
                        prop: 'projectId'
                    },
                    {
                        type: 'input',
                        label: '排期节点',
                        prop: 'scheduleNodeName'
                    },
                    {
                        type: 'input',
                        label: '业主姓名',
                        prop: 'ownerName'
                    },
                    {
                        type: 'date',
                        label: '排期要货日期',
                        prop: 'scheduleDemandTime'
                    },
                    {
                        type: 'date',
                        label: '要货日期',
                        prop: 'goodsDemandTime'
                    },
                    {
                        type: 'select',
                        label: '数据状态',
                        prop: 'orderStatus',
                        list: 'orderStatusOption'
                    },
                    {
                        type: 'textarea',
                        label: '备注',
                        prop: 'remark',
                    }
                ]
            },
            {
                label: '详细地址',
                name: 'tab2',
                fields: [
                    {
                        type: 'input',
                        label: '工长姓名',
                        prop: 'workerName'
                    },
                    {
                        type: 'textarea',
                        label: '收货地址',
                        prop: 'detailAddress',

                    },
                ]
            },
            {
                label: '其他信息',
                name: 'tab3',
                fields: [
                    {
                        type: 'input',
                        label: '创建人',
                        prop: 'createName'
                    },
                    {
                        type: 'datetime',
                        label: '创建时间',
                        prop: 'createTime'
                    },
                    {
                        type: 'input',
                        label: '确认收货人',
                        prop: 'consigneeName'
                    },
                    {
                        type: 'datetime',
                        label: '发货日期',
                        prop: 'firstSendTime'
                    },
                    {
                        type: 'datetime',
                        label: '确认收货日期',
                        prop: 'consigneeTime'
                    },
                    {
                        type: 'input',
                        label: '最后修改人',
                        prop: 'updateName'
                    },
                    {
                        type: 'datetime',
                        label: '最后修改日期',
                        prop: 'updateTime'
                    }
                ]
            }

        ]
    },
    //查看行
    subTables: [
        {
            name: 'goodsDemandItem',
            label: '要货单项表',
            type: 'table',
            service: Service.DEMAND.name,
            method: Service.DEMAND.methods.ITEMQUERYPAGEBYID,
            args: {
                id: '@id'
            },
            fields: [
                {
                    label: 'SKUID',
                    prop: 'skuId'
                },
                {
                    label: '商品名称',
                    prop: 'goodsName'
                },
                {
                    label: '品类',
                    prop: 'category'
                },
                {
                    label: '商品规格',
                    prop: 'standard'
                },
                {
                    label: '商品型号',
                    prop: 'model'
                },
                {
                    label: '品牌',
                    prop: 'brand'
                },
                {
                    label: '用量',
                    prop: 'goodsDemandAmount'
                },
                {
                    label: '单位',
                    prop: 'basicUnitName'
                },
                {
                    label: '状态',
                    prop: 'orderItemStatus',
                    list: 'orderStatusOption'
                },
                {
                    label: '要货备注',
                    prop: 'remark'
                }
            ]
        }
    ],
    //新增单头
    addFields: {
        name: 'addFields',
        label: '新增要货单',
        fields: [
            {
                type: 'popup',
                label: '项目ID',
                prop: 'projectId',
                filedValue: 'projectId',
                textValue: 'projectId',
                placeholder: "请选择项目ID",
                useQuery: true,
                //自动补全
                remote: true,
                service: Service.DEMAND.name,
                method: Service.DEMAND.methods.QUERYPROJECTID,
                remoteArgs: { page: 1, size: 20 },
                remoteQueryKey: "projectId",
                rules: [{ required: true, message: '请输入项目ID' }],
                dialog: {
                    title: "查找项目ID",
                    size: 'large',
                    searchForm: {
                        fields: [
                            { type: 'input', label: '项目ID', name: 'projectId' },
                            { type: 'input', label: '业主姓名', name: 'ownerName' },
                        ],
                        resetBtnVisible: false,
                        showToggleBtn: false,
                        // labelWidth: '50px'
                    },
                    dialogWidth: "780px",
                    table: {
                        //表格
                        columns: [{
                            prop: 'projectId',
                            label: '项目ID'
                        }, {
                            prop: 'ownerName',
                            label: '业主姓名'
                        }, {
                            prop: 'detailAddress',
                            label: '项目地址'
                        }],
                        //请求参数配置
                        service: Service.DEMAND.name,
                        method: Service.DEMAND.methods.QUERYPROJECTID,
                        args: { page: 1, size: 20 },
                        remoteQueryKey: "ownerName"
                    }
                }
            }, {
                type: 'input',
                label: '业主姓名',
                prop: 'ownerName',
                disabled: true
            }, {
                type: 'select',
                label: '要货批次',
                prop: 'scheduleNodeId',
                list: 'scheduleNodeOption',
                rules: [
                    { required: true, message: '请选择排期节点' }
                ]
            },
            {
                type: 'date',
                label: '要货日期',
                prop: 'goodsDemandTime',
                rules: [
                    { required: true, message: '请选择要货时间' }
                ],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    }
                }
            },
            // {
            //     type: 't8t-select',
            //     label: '品类',
            //     prop: 'categoryId',
            //     list: 'categoryOption',
            //     name: 'categoryId',
            //     disabled: true,
            //     multiple: true,
            //     rules: [
            //         {type:'array',required: true, message: '品类不能为空'}
            //     ]
            // },
            {
                type: 'textarea',
                label: '备注信息',
                prop: 'remark'
            }]
    },
    //新增行
    addTable: {
        pageBar: false,
        addAble: false,
        name: 'addTable',
        label: '要货明细',
        type: 'table',
        fields: [
            {
                label: 'SKUID',
                prop: 'skuId',
            },
            {
                label: '商品名称',
                prop: 'goodsName'
            },
            {
                label: '商品规格',
                prop: 'standard'
            },
            {
                label: '使用空间',
                prop: 'spaceName'
            },
            {
                label: '使用位置',
                prop: 'usedPlace'
            },
            {
                label: '参考数量',
                prop: 'estimateAmount'
            },
            {
                label: '要货数量',
                prop: 'goodsDemandAmount',
                required: true,
                editor: {
                    type: 'input',
                    rules: [{
                        required: true,
                        type: 'number',
                        min: 0.01,
                        max: 99999999.99,
                        transform(val) {
                            return +val
                        },
                        message: '请输入正确的要货数量'
                    }]
                },
                onChange(val, row, column, table) {
                    table.$nextTick(() => {
                        if (!isNaN(val)) {
                            row.floatAmount = (Number(val) + Number(val) * Number(row.floatPercent)).toFixed(2);
                        } else {
                            row.floatAmount = '';
                        }
                    })
                },
            },
            {
                label: '计算损耗后数量',
                prop: 'floatAmount'
            },
            {
                label: '单位',
                prop: 'basicUnitName'
            },
            {
                label: '类型',
                prop: 'goodsTypeName'
            }, {
                label: '所属成品',
                prop: 'pGoods'
            }]
    },

    //todo 编辑单头
    editFields: {
        name: 'addFields',
        label: '新增要货单',
        fields: [
            {
                type: 'input',
                label: '项目ID',
                prop: 'projectId',
                disabled: true,
                rules: [{ required: true, message: '请输入项目ID' }],
            }, {
                type: 'input',
                label: '业主姓名',
                prop: 'ownerName',
                disabled: true
            }, {
                type: 'input',
                label: '要货批次',
                prop: 'scheduleNodeName',
                disabled: true
            },
            {
                type: 'date',
                label: '要货日期',
                prop: 'goodsDemandTime',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    }
                },
                rules: [
                    { type: 'number', required: true, min: 1, message: '请选择要货时间' }
                ]
            },
            // {
            //     type: 't8t-select',
            //     label: '品类',
            //     prop: 'categoryId',
            //     list: 'categoryOption',
            //     name: 'categoryId',
            //     disabled: true,
            //     multiple: true,
            //     rules: [
            //         {type:'array',required: true, message: '品类不能为空'}
            //     ]
            // },
            {
                type: 'textarea',
                label: '备注信息',
                prop: 'remark'
            }]
    },
    //补货单头
    replenishFields: {
        name: 'replenishFields',
        label: '新增补货单',
        fields: [
            {
                type: 'popup',
                label: '项目ID',
                prop: 'projectId',
                filedValue: 'projectId',
                textValue: 'projectId',
                placeholder: "请选择项目ID",
                useQuery: true,
                //自动补全
                remote: true,
                service: Service.DEMAND.name,
                method: Service.DEMAND.methods.QUERYPROJECTID,
                remoteArgs: { page: 1, size: 20 },
                remoteQueryKey: "projectId",
                rules: [{ required: true, message: '请输入项目ID' }],
                dialog: {
                    title: "查找项目ID",
                    size: 'large',
                    searchForm: {
                        fields: [
                            { type: 'input', label: '项目ID', name: 'projectId' },
                            { type: 'input', label: '业主姓名', name: 'ownerName' },
                        ],
                        resetBtnVisible: false,
                        showToggleBtn: false,
                        // labelWidth: '50px'
                    },
                    dialogWidth: "780px",
                    table: {
                        //表格
                        columns: [{
                            prop: 'projectId',
                            label: '项目ID'
                        }, {
                            prop: 'ownerName',
                            label: '业主姓名'
                        }, {
                            prop: 'detailAddress',
                            label: '项目地址'
                        }],
                        //请求参数配置
                        service: Service.DEMAND.name,
                        method: Service.DEMAND.methods.QUERYPROJECTID,
                        args: { page: 1, size: 20 },
                        remoteQueryKey: "ownerName"
                    }
                }
            },
            {
                type: 'input',
                label: '业主姓名',
                prop: 'ownerName',
                disabled: true
            },
            // {
            //     type: 'select',
            //     label: '需要安装调度',
            //     prop: 'installDispatch',
            //     list: 'installDispatchOption',
            //     rules: [
            //         {required: true, message: '请选择是否需要安装调度'}
            //     ]
            // },
            {
                type: 'date',
                label: '要货日期',
                prop: 'goodsDemandTime',
                rules: [
                    { required: true, message: '请选择要货时间' }
                ],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    }
                }
            },
            {
                type: 't8t-select',
                label: '品类',
                prop: 'categoryId',
                list: 'categoryOption',
                name: 'categoryId',
                multiple: true,
                rules: [
                    { type: 'array', required: true, message: '请选择品类' }
                ]
            }, {
                type: 'textarea',
                label: '备注信息',
                prop: 'remark'
            }]
    },
    //补货单行
    replenishTable: {
        addable: true,
        name: 'replenishTable',
        pageBar: true,
        label: '补货明细',
        fields: [
            {
                type: 'input',
                label: 'SKUID',
                prop: 'skuId',
                required: true,
                sortable: false,
                editor: {
                    readonly: true,
                    type: 'input',
                    "rules": [{
                        "required": true,
                        "message": "不能为空",
                        "trigger": "change"
                    }]
                }
            },
            {
                type: 'input',
                label: '商品名称',
                prop: 'goodsName',
                required: true,
                sortable: false,
                editor: {
                    readonly: true,
                    type: 'input',
                    "rules": [{
                        "required": true,
                        "message": "不能为空",
                        "trigger": "change"
                    }]
                }
            },
            {
                label: '商品规格',
                prop: 'standard'
            },
            {
                label: '类型',
                prop: 'goodsTypeName'
            },
            {
                label: '要货数量',
                prop: 'goodsDemandAmount',
                required: true,
                editor: {
                    type: 'input',
                    rules: [
                        {
                            required: true,
                            message: '请输入要货数量'
                        },
                        {
                            type: 'number',
                            min: 0.01,
                            max: 99999999.99,
                            transform(val) {
                                return +val
                            },
                            message: '请输入正确的要货数量'
                        }
                    ]
                }
            },
            {
                label: '单位',
                prop: 'basicUnitName'
            },
            {
                label: '补货原因',
                prop: 'replenishReason',
                required: true,
                list: "replenishReasonList",
                editor: {
                    type: "select",
                    disabled: true,
                    rules: [
                        {
                            type: 'number',
                            required: true,
                            message: "请填写补货原因",
                            trigger: "change"
                        }
                    ]
                }
            }
        ]
    },
    //弹出关闭/确认收货要货
    dialogCommonTable: [
        {
            label: 'SKUID',
            prop: 'skuId',
            width: 80
        },
        {
            label: '商品名称',
            prop: 'goodsName',
            width: 80
        },
        {
            label: '商品型号',
            prop: 'model',
            width: 80
        },
        {
            label: '商品规格',
            prop: 'standard',
            width: 100
        },
        {
            label: '品牌',
            prop: 'brand',
            width: 100
        },
        {
            label: '要货数量',
            prop: 'goodsDemandAmount',
            width: 80
        },
        {
            label: '单位',
            prop: 'basicUnitName',
            width: 70
        },
        {
            label: '收货数量',
            prop: 'realReceiptAmount',
            width: 86,
            required: true,
            editor: {
                type: 'input',
                rules(val, row) {
                    return {
                        type: 'number',
                        min: 0,
                        max: row.goodsDemandAmount,
                        transform(val) {
                            return +val
                        },
                        message: '收货数量不能大于要货数量'
                    }
                }
            }
        }],
    //查看明细项
    dialogDetailTable: [
        {
            label: 'SKUID',
            prop: 'skuId',
            width: 80
        },
        {
            label: '商品名称',
            prop: 'goodsName',
            width: 94
        },
        {
            label: '商品型号',
            prop: 'model',
            width: 100
        },
        {
            label: '商品规格',
            prop: 'standard',
            width: 100
        },
        {
            label: '品牌',
            prop: 'brand',
            width: 100
        },
        {
            label: '状态',
            prop: 'orderItemStatus',
            width: 120,
            list: "orderStatusOption"
        },
        {
            label: '要货数量',
            prop: 'goodsDemandAmount',
            width: 120
        },
        {
            label: '单位',
            prop: 'basicUnitName'
        }],
    //审核要货明细弹窗
    dialogDemandTable: [
        {
            label: 'SKUID',
            prop: 'skuId',
            width: 80
        },
        {
            label: '商品名称',
            prop: 'goodsName',
            width: 94
        },
        {
            label: '商品型号',
            prop: 'model',
            width: 100
        },
        {
            label: '商品规格',
            prop: 'standard',
            width: 100
        },
        {
            label: '品牌',
            prop: 'brand',
            width: 100
        },
        {
            label: '要货数量',
            prop: 'goodsDemandAmount',
            width: 120
        },
        {
            label: '单位',
            prop: 'basicUnitName',
            width: 120
        },
        {
            label: '系统上限用量',
            prop: 'systemGoodsDemandAmount',
            width: 120
        }],
    //审核单头
    verifyFiled: {
        label: "基本信息",
        name: "verifyFiled",
        service: Service.DEMAND.name,
        method: Service.DEMAND.methods.GETDETAILBYPROCESSID,
        args: {
            processId: null
        },
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
            }, {
                type: 'input',
                label: '项目ID',
                prop: 'projectId',
                disabled: true
            }, {
                type: 'input',
                label: '业主姓名',
                prop: 'ownerName',
                disabled: true
            }, {
                type: 'input',
                label: '要货批次',
                prop: 'goodsDemandSourceName',
                disabled: true
            }, {
                type: 'date',
                label: '要货日期',
                prop: 'goodsDemandTime',
                disabled: true
            }, {
                type: 'input',
                label: '要货单编号',
                prop: 'orderCode',
                disabled: true
            }, {
                type: 'input',
                label: '工长姓名',
                prop: 'workerName',
                disabled: true
            }, {
                type: 'input',
                label: '工长电话',
                prop: 'workerPhone',
                disabled: true
            }, {
                type: 'input',
                label: '工地地址',
                prop: 'address',
                disabled: true
            }]
    },
    //审核单行
    verifyTable: {
        service: Service.DEMAND.name,
        method: Service.DEMAND.methods.ITEMQUERYPAGEBYID,
        args: {
            id: '@id'
        },
        name: "verifyTable",
        label: "要货明细",
        type: 'table',
        fields: [
            {
                label: 'SKUID',
                prop: 'skuId'
            },
            {
                label: '商品名称',
                prop: 'goodsName'
            },
            {
                label: '品类',
                prop: 'category'
            },
            {
                label: '商品规格',
                prop: 'standard'
            },
            {
                label: '商品型号',
                prop: 'model'
            }, {
                label: '品牌',
                prop: 'brand'
            }, {
                label: '用量',
                prop: 'goodsDemandAmount'
            }, {
                label: '单位',
                prop: 'basicUnitName'
            }, {
                label: '系统上限用量',
                prop: 'systemGoodsDemandAmount'
            }, {
                label: '要货备注',
                prop: 'remark'
            }]
    }

}
