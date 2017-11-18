export default {
    mainTable: {
        name: 'voucherSourceItem',
        service: 'aza3u0LzMXc9Znlqn3Ymv2IHTAuO_U-',
        method: 'bvO9U0szmxJrnfCgZkeyyin8qX.xz_4lAFDaPNL',
        args: {
            id: null
        },
        createMethod: 'Nnt7N8ltiqMhkcIDXZYlkaG6je7RwrcdWDs',
        updateMethod: 'CctnM8cVXNHETNQ7TO4LZPGmiDLzdVn6O1V',
        fields: [
            {
                type: 'input',
                label: '创建人名称',
                prop: 'createName'
            },
            {
                type: 'input',
                label: '创建人登录名称',
                prop: 'createBy'
            },
            {
                type: 'datetime',
                label: '创建时间',
                prop: 'createTime'
            },
            {
                type: 'input',
                label: '修改人名称',
                prop: 'updateName'
            },
            {
                type: 'input',
                label: '修改人登录名称',
                prop: 'updateBy'
            },
            {
                type: 'datetime',
                label: '修改时间',
                prop: 'updateTime'
            },
            {
                type: 'input',
                label: '来源表行id',
                prop: 'sourceOrderId'
            },
            {
                type: 'input',
                label: '来源单据号',
                prop: 'sourceOrderCode'
            },
            {
                type: 'input',
                label: '来源单据类型',
                prop: 'sourceOrderType'
            },
            {
                type: 'input',
                label: '来源单据日期',
                prop: 'sourceOrderTime'
            },
            {
                type: 'input',
                label: '凭证分录id',
                prop: 'voucherTemplateEntryId'
            }
            
        ]
    }
}
