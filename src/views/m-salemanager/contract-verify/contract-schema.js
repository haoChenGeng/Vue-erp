import Service from 'src/services/salemanager/Service.js'
export default {
    mainTable: {
        name: 'contractOrder',
        service: Service.CONTRACT.name,
        method: Service.CONTRACT.methods.FINDINFOBYPROJECTID,
        args: {
            projectId: null
        },
        tabs: [
            {
                label: '项目信息',
                name: 'main',
                fields: [
                    {
                        type: 'input',
                        label: '项目ID',
                        disabled: 'disabled',
                        prop: 'projectId',
                    },
                    {
                        type: 'input',
                        label: '业主称呼',
                        disabled: 'disabled',
                        prop: 'ownerName',
                    },
                    {
                        type: 'input',
                        label: '计价面积',
                        disabled: 'disabled',
                        prop: 'houseValuationArea',
                    },
                    {
                        type: 'input',
                        label: '合同报价',
                        disabled: 'disabled',
                        prop: 'contractPrice',
                    },
                    {
                        type: 'input',
                        label: '户型',
                        disabled: 'disabled',
                        prop: 'houseStyle',
                    },
                    {
                        type: 'textarea',
                        label: '详细地址',
                        disabled: 'disabled',
                        prop: 'projectAddr',
                    }
                ]
            }
        ]
    },
    subTables: [
        // {
        //     name: 'measure',
        //     label: '量房记录',
        //     type: 'table',
        //     service: '',
        //     method: '',
        //     args: {
        //         search: {
        //             complaintsOrderId: '@id'
        //         }
        //     },
        //     fields: []
        // },
        {
            name: 'constructionPic',
            label: '施工图纸',
            type: 'pic',
            service: '',
            method: '',
            args: {}
        },
        {
            name: 'quotes',
            label: '选品报价单',
            type: 'table',
            fields: [
                {
                    type: 'index',
                    label: '序号',
                    minWidth:40,
                },
                {
                    "prop": "placeId",
                    "label": "位置",
                    "width": 80,
                    "list":'places',
                    "resizable": false,
                },
                {
                    "prop": "qiName",
                    "label": "报价项名称",
                    "width": 250,
                    "resizable": false
                },
                {
                    "prop": "amount",
                    "label": "数量",
                    "width": 80,
                    "resizable": false,
                    formatter(val, row) {
                        return val ? +val : 0
                    }
                },
                {
                    "prop": "qiUnit",
                    "label": "单位",
                    "width": 80,
                    "resizable": false
                },
                {
                    "prop": "price",
                    "label": "单价",
                    "width": 80,
                    "resizable": false,
                    formatter(val, row) {
                        return row.tempItemType == 0 ? '-' : +row.price
                    }
                },
                {
                    "prop": "totalMoney",
                    "label": "金额",
                    "width": 120,
                    "resizable": false,
                    formatter(val, row) {
                        return row.tempItemType == 0 ? '-' : row.amount ? (+row.price * +row.amount).toFixed(2) : 0
                    }
                },
                {
                    "prop": "tempItemType",
                    "label": "是否标准",
                    "width": 80,
                    "resizable": false,
                    formatter(val, row) {
                        return row.tempItemType == 0 ? '是' : '否'
                    }
                },

                {
                    "prop": "deliveryId",
                    "label": "SKU",
                    "width": 150,
                    formatter(){
                        return `<span class="selectDeliveryIdHand">*******</span>`
                    },
                    "resizable": false
                },
                {
                    "prop": "craftDetails",
                    "label": "工艺详情",
                    "resizable": false,
                    "minWidth":300
                },
            ]
        },
        {
            name: 'contractPic',
            label: '合同信息',
            type: 'pic',
            service: '',
            method: '',
            args: {}
        },
        // {
        //     name: 'favorable',
        //     label: '优惠审批单',
        //     type: 'table',
        //     service: '',
        //     method: '',
        //     args: {
        //         search: {
        //             complaintsOrderId: '@id'
        //         }
        //     },
        //     fields: [
        //         {
        //             type: 'input',
        //             label: 'ID',
        //             prop: 'id',
        //         },
        //         {
        //             label: '投诉内容',
        //             prop: 'complaintsConfigItemId',
        //             list: 'complaintsContentOpt',
        //             editor: {
        //                 type: 'select',
        //                 rules: [
        //                     {required: true, message: '请选择投诉内容'}
        //                 ]
        //             }
        //         },
        //         {
        //             type: 'input',
        //             label: '创建人',
        //             prop: 'createName',
        //         },
        //         {
        //             formatter: "dateParser",
        //             label: '创建时间',
        //             prop: 'createTime'
        //         },
        //     ]
        // },
        // {
        //     name: 'append',
        //     label: '补充协议',
        //     type: 'table',
        //     service: '',
        //     method: '',
        //     args: {
        //         search: {
        //             complaintsOrderId: '@id'
        //         }
        //     },
        //     fields: []
        // },
    ]
}
