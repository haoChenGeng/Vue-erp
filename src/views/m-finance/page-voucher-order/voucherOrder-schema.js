export default {
    mainTable: {
        name: 'voucherOrder',
        service: 'N7MleTA0MHTcaUUxIqAYpQ5BwNDA-dv',
        method: '2-OOzMyF26UOxO3Lb1NpLxv-BIgMXwCv9qb2qL9',
        args: {
            id: null
        },
        createMethod: 'gsFB-LO_mpRtB5M5KlMuQ1faOniVE-1',
        updateMethod: 'lHgDwfDnvekvF7iQQ4QdO4TMA7mW5fI',
        fields: [
            {
                type: 'select',
                label: '财务组织',
                prop: 'organizationName'
            },
            {
                type: 'input',
                label: '会计期间',
                prop: 'generatedAccountingTimeStr'
            },
            {
                type: 'select',
                label: '状态',
                prop: 'status',
                list: 'status'
            },
            {
                type: 'input',
                label: '凭证单据号',
                prop: 'voucherCode'
            },
            {
                type: 'input',
                label: '模板名称',
                prop: 'templateName'
            },
            {
                type: 'input',
                label: 'K3凭证号',
                prop: 'k3No'
            },
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
                type: 'select',
                label: '数据来源',
                prop: 'dataSource',
                list: 'dataSource'
            }
        ]
    },

    subTables: [
        {
            name: 'voucherTemplateEntry',
            label: '模板分录',
            type: 'table',
            service: 'N7MleTA0MHTcaUUxIqAYpQ5BwNDA-dv',
            method: 'y-77GM5VB8niBdLMzc7K_D1dfigUsZdvB2i7ws-_6VY',
            args: {
                search: {
                    voucherOrderId: '@id'
                }
            },
            fields: [
                {
                    type: 'input',
                    label: '序号',
                    prop: 'sequenceNumber'
                },
                {
                    type: 'input',
                    label: '科目编码',
                    prop: 'accountCode'
                },
                {
                    type: 'input',
                    label: '科目名称',
                    prop: 'accountName'
                },
                {
                    type: 'input',
                    label: '借贷方向',
                    prop: 'cashFlow'
                },
                {
                    type: 'input',
                    label: '金额',
                    prop: 'amount',
                    editor: {
                        type: 'input'
                    }
                },
                {
                    type: 'input',
                    label: '摘要',
                    prop: 'entryAbstract',
                    editor: {
                        type: 'input'
                    }
                },
                {
                    type: 'input',
                    label: '联查明细',
                    prop: 'voucherOrderId',
                    editor: {
                        type: 'input'
                    }
                }
            ]
        }
    ],
    thirdTables: [
        {
            name: 'voucherAccountAssistant',
            label: '辅助核算项',
            type: 'table',
            service: 'N7MleTA0MHTcaUUxIqAYpQ5BwNDA-dv',
            method: 'wpYr4xKTCEIyADHbO0tk7e2b8QJuunW29fs0KZpyAjxiqp4j96qeog9',
            args: {
                search: {
                    voucherEntryId: '@voucherOrderId'
                }
            },
            fields: [
                {
                    type: 'input',
                    label: '序号',
                    prop: 'sequenceNumber'
                },
                {
                    type: 'select',
                    label: '辅助项',
                    prop: 'assistantItemId',
                    list: 'assistantItemId'
                },
                {
                    type: 'input',
                    label: '辅助项值',
                    prop: 'assistantItemName'
                }
            ]
        }
    ]
}
