export default {
    mainTable: {
        name: 'voucherTemplate',
        service: '9wjmWM9cR44vZeERRK2R3Z4Tye3fdrq',
        method: '5Paobg8NhkZ-sh_lvuqQrXXPa3vdYEs-nQykqb2kaXY',
        args: {
            id: null
        },
        createMethod: '9CF5B-DsI7EZA3SEGEt9CfF33dNk3rDpCYR15mV2egc',
        updateMethod: 'HOALGe2XE0SXdAeQyNQGL3PDynV_B6M3B9YB1te_2qo',
        fields: [
            {
                type: 'select',
                label: '财务组织',
                prop: 'organizationId',
                list: 'organizationId'
            },
            {
                type: 'input',
                label: '模板编码',
                prop: 'code'
            },
            {
                type: 'input',
                label: '模板名称',
                prop: 'name'
            },
            {
                type: 'select',
                label: '状态',
                prop: 'status',
                list: 'status'
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
            name: 'templateEntry',
            label: '模板分录',
            type: 'table',
            service: '9wjmWM9cR44vZeERRK2R3Z4Tye3fdrq',
            method: 'vzkwsBIBdCk6oUDdbW8ZjXomcBoFOMxZli-sn9fpEmN',
            args: {
                search: {
                    voucherTemplateId: '@id'
                }
            },
            fields: [
                {
                    type: 'input',
                    label: '科目编码',
                    prop: 'accountCode',
                    editor: {
                        type: 'input'
                    }
                },
                {
                    type: 'input',
                    label: '科目名称',
                    prop: 'accountName',
                    editor: {
                        type: 'input'
                    }
                },
                {
                    type: 'select',
                    label: '借贷方向',
                    prop: 'cashFlow',
                    list: 'cashFlow',
                    editor: {
                        type: 'select',
                        list: 'cashFlow'
                    }
                },
                {
                    type: 'select',
                    label: '金额来源',
                    prop: 'amountSource',
                    list: 'amountSource',
                    editor: {
                        type: 'select',
                        list: 'amountSource'
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
                    label: '行生成条件',
                    prop: 'formula_id',
                    editor: {
                        type: 'input'
                    }
                }
            ]
        }
    ]
}
