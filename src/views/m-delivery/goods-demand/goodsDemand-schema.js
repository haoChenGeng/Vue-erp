import Service from 'src/services/delivery/goodsDemand/Service.js'
export default {
    //查看单头
    mainTable: {
        name: 'goodsDemand',
        service: Service.DEMAND.name,
        method: Service.DEMAND.methods.QUERYPAGE,
        args: {
            search: {
                id: null
            },
            page: 1,
            size: 1
        },
        tabs: [
            {
                label: '基本信息',
                name: 'tab1',
                fields: [
                    {
                        type: 'input',
                        label: '编号',
                        prop: 'orderCode',
                        disabled: true
                    },
                    {
                        type: 'input',
                        label: '单据类型',
                        prop: 'billType',
                        disabled: true
                    },
                    {
                        type: 'input',
                        label: '项目',
                        prop: 'projectId',
                        disabled: true
                    },
                    {
                        type: 'input',
                        label: '排期节点',
                        prop: 'scheduleNodeName',
                        disabled: true
                    },
                    {
                        type: 'input',
                        label: '业主姓名',
                        prop: 'ownerName',
                        disabled: true
                    },
                    {
                        type: 'date',
                        label: '排期要货日期',
                        prop: 'scheduleDemandTime',
                        disabled: true
                    },
                    {
                        type: 'date',
                        label: '要货日期',
                        prop: 'goodsDemandTime',
                        disabled: true
                    },
                    {
                        type: 'select',
                        label: '数据状态',
                        prop: 'orderStatus',
                        list: 'orderStatusOption',
                        disabled: true
                    },
                    {
                        type: 'textarea',
                        label: '备注',
                        prop: 'remark',
                        disabled: true
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
                        prop: 'workerName',
                        disabled: true
                    },
                    {
                        type: 'textarea',
                        label: '收货地址',
                        prop: 'receiveAddress',
                        disabled: true

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
                        prop: 'createName',
                        disabled: true
                    },
                    {
                        type: 'datetime',
                        label: '创建时间',
                        prop: 'createTime',
                        disabled: true
                    },
                    {
                        type: 'input',
                        label: '确认收货人',
                        prop: 'consigneeName',
                        disabled: true
                    },
                    {
                        type: 'datetime',
                        label: '发货日期',
                        prop: 'firstSendTime',
                        disabled: true
                    },
                    {
                        type: 'datetime',
                        label: '确认收货日期',
                        prop: 'consigneeTime',
                        disabled: true
                    },
                    {
                        type: 'input',
                        label: '最后修改人',
                        prop: 'updateName',
                        disabled: true
                    },
                    {
                        type: 'datetime',
                        label: '最后修改日期',
                        prop: 'updateTime',
                        disabled: true
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
            method: Service.DEMAND.methods.ITEMQUERYPAGE,
            args: {
                search:{ 
                    goodsDemandId: '@id'
                },
                page:1,
                size:100
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
                    prop: 'unitName'
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
    ]
}
