import Service from 'src/services/finance/Service.js'
export default {
    mainTable: {
        name: 'projectCosts',
        service: 'FeERWZ4p3_JmROhpC8vEbzxtoTR714p',
        method: '8dNT7gildog0PxNrZnTZJqhYCKdcqAn',
        args: {
            id: null
        }
    },
    subTables: [
        {
            name: 'laborCosts',
            label: '工费明细',
            type: 'table',
            fields: [
                {
                    label: '单据日期',
                    prop: 'billsTime',
                    formatter: "dateParser",
                    show: true
                },
                {
                    label: '单据号',
                    prop: 'billCode',
                    show: true
                },
                {
                    label: '成本要素',
                    prop: 'costElementName',
                    show: true
                },
                {
                    label: '结算对象',
                    prop: 'settleObjectType',
                    list: 'settleObjectTypeOptions',
                    show: true
                },
                {
                    label: '结算类型',
                    prop: 'settleTypeName',
                    show: true
                },
                {
                    label: '结算方向',
                    prop: 'dirName',
                    show: true
                },
                {
                    label: '结算项',
                    prop: 'settleItemName',
                    show: true
                },
                {
                    label: '计划金额',
                    prop: 'planAmount',
                    align: 'right',
                    formatter: 'retainTwoDecimal',
                    show: true
                },
                {
                    label: '实际金额',
                    prop: 'actualAmount',
                    align: 'right',
                    formatter: 'retainTwoDecimal',
                    show: true
                }
            ]
        },
        {
            name: 'materialCosts',
            label: '材料费',
            type: 'table',
            fields: [
                {
                    label: '要货日期',
                    prop: 'billsTime',
                    formatter: "dateParser",
                    show: true
                },
                {
                    label: '单据号',
                    prop: 'orderCode',
                    show: true
                },
                {
                    label: '材料类型',
                    prop: 'materialName',
                    show: true
                },
                {
                    label: '成本要素',
                    prop: 'costElementName',
                    show: true
                },
                {
                    label: '商品品类',
                    prop: 'goodsCategoryName',
                    show: true
                },
                {
                    label: '商品编码',
                    prop: 'goodsCode',
                    show: true
                },
                {
                    label: '商品名称',
                    prop: 'goodsName',
                    show: true
                },
                {
                    label: '商品规格',
                    prop: 'standard',
                    show: true
                },
                {
                    label: '商品型号',
                    prop: 'model',
                    show: true
                },
                {
                    label: '品牌',
                    prop: 'brandName',
                    show: true
                },
                {
                    label: '税率',
                    prop: 'taxRate',
                    formatter: 'percent',
                    show: true
                },
                {
                    label: '计划数量',
                    prop: 'planNum',
                    align: 'right',
                    formatter: 'retainTwoDecimal',
                    show: true,
                    editor: {
                        type: 'hyperlink',
                        onClick: (val, row, col, tab) => {
                            tab.$router.push({
                                path: '/tuchat-delivery/dosage-detail',
                                query: {
                                    yid: row.projectId,
                                    deliveryId: row.goodsId,
                                    editType: "view"
                                }
                            })
                        }
                    }
                },
                {
                    label: '计划单价(不含税)',
                    prop: 'planPrice',
                    align: 'right',
                    formatter: 'retainTwoDecimal',
                    show: true
                },
                {
                    label: '计划金额',
                    prop: 'planAmount',
                    align: 'right',
                    formatter: 'retainTwoDecimal',
                    show: true
                },
                {
                    label: '实际数量',
                    prop: 'actualNum',
                    align: 'right',
                    formatter: 'retainTwoDecimal',
                    show: true,
                    editor: {
                        type: 'hyperlink',
                        onClick: (val, row, col, tab) => {
                            let rout = ''
                            //要货单
                            if(row.orderType === 1){
                                rout = '/tuchat-delivery/demand-list'
                            }else{
                                rout = '/tuchat-delivery/refundOrder-index'
                            }
                            tab.$router.push({
                                path: rout,
                                query: {
                                    editType: "view"
                                }
                            })
                        }
                    }
                },
                {
                    label: '实际单价(不含税)',
                    prop: 'actualPrice',
                    align: 'right',
                    formatter: 'retainTwoDecimal',
                    show: true
                },
                {
                    label: '实际金额(不含税)',
                    prop: 'actualAmount',
                    align: 'right',
                    formatter: 'retainTwoDecimal',
                    show: true
                },
                {
                    label: '实际金额(含税)',
                    prop: 'actualAmountTax',
                    align: 'right',
                    formatter: 'retainTwoDecimal',
                    show: true
                }
            ]
        }
    ]
}
