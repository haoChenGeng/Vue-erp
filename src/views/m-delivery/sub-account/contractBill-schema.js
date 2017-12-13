export default {
    mainTable: {
        name: 'contractBill',
        type: 'table',
        service: 'Py3ZgnBx_L_tabFLcUd5XmHk1yhE9Lx',
        method: '5HNQQtpoI7IzW9pAKfpJqKs2zSAzM_H',
        args: {
            id: null
        },
        createMethod: 'EpdgPl6BZ5pF2OyidnEreM23m3IBgah',
        updateMethod: 'VDN_pIGxo4fToWBAYK2TtmWWA0aNQQQ',
        fields: [
            {
                type: 'input',
                label: '单据编码',
                prop: 'billCode',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'select',
                label: '组织',
                prop: 'organizationName',
                //list: 'organizationId',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '项目ID',
                prop: 'projectId',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'select',
                label: '项目产品包',
                prop: 'productPkgName',
                //list: 'productPkgId',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'select',
                label: '项目业务类型',
                prop: 'bizTypeName',
                //list: 'bizTypeList',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '发包对象类型',
                prop: 'objectTypeName',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '发包单价',
                prop: 'unitPrice',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '发包成本',
                prop: 'accountMoney',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '发包毛利',
                prop: 'profitMoney',
                rules: [
                    {required: true, message: ''}
                ]
            }
        ]
    },
    subTables: [
        {
            name: 'contractItem',
            label: '发包清单',
            type: 'table',
            service: 'Py3ZgnBx_L_tabFLcUd5XmHk1yhE9Lx',
            method: 'kJ-7drGYvs4rjdxGVqH1UBsYW5TVT7FaiUU',
            args: {
                search: {
                    contractId: '@id'
                }
            },
            fields: [
                {
                    type: 'input',
                    label: '序号',
                    prop: 'id',
                    editor: {
                        type: 'input'
                    },
                    summaryType: function (data, prop) {
                        return '合计'
                    }
                },
                {
                    type: 'input',
                    label: '发包项目',
                    prop: 'contractName',
                    editor: {
                        type: 'input'
                    }
                },
                {
                    type: 'input',
                    label: '发包金额',
                    prop: 'itemMoney',
                    editor: {
                        type: 'input'
                    },
                    summaryType: function (data, prop) {
                        let sum = 0.00
                        data.forEach((row) => {
                            sum += parseFloat(row[prop])
                        })
                        return parseFloat(sum).toFixed(2)
                    }
                }
            ]
        },
        {
            name: 'accountItem',
            label: '核算清单',
            type: 'table',
            service: 'Py3ZgnBx_L_tabFLcUd5XmHk1yhE9Lx',
            method: 'jKTrUHsFM4VMt_eLs0jdewQttJNNnHd',
            args: {
                search: {
                    contractId: '@id'
                }
            },
            fields: [
                {
                    label: '序号',
                    prop: 'id',
                    width: '100',
                    editor: {
                        type: 'input'
                    }
                },
                {
                    label: '一级项目',
                    prop: 'level1Name',
                    editor: {
                        type: 'input'
                    }
                },
                {
                    label: '二级项目',
                    prop: 'level2Name',
                    editor: {
                        type: 'input'
                    }
                },
                {
                    label: '三级项目',
                    prop: 'level3Name',
                    align: 'left',
                    editor: {
                        type: 'input'
                    }
                },
                {
                    label: '核算金额',
                    prop: 'itemMoney',
                    width: '200',
                    editor: {
                        type: 'input'
                    }
                }
            ]
        }
    ]
}
