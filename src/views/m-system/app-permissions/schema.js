export default {
    mainTable: {
        name: 'function',
        service: 'rTqcMAanBn6-MLIyk4LwB4zwP6nkzaz',
        method: 'S1b5PvagixA0URdsqg_Dycgcbm3',
        args: {
            id: null
        },
        createMethod: 'DhVtT1PTlXyitR4EiZEOnLP',
        updateMethod: '31284KimNuJbS60TO5y590D',
        fields: [
            {
                label: '功能ID',
                prop: 'id'
            },
            {
                label: '功能名称',
                prop: 'functionName',
            },
            {
                type: 'select',
                label: '功能类型#取自supply_property|id',
                prop: 'functionType',
                list: 'functionType',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'select',
                label: '开发类型 0原生 1H5',
                prop: 'developType',
                list: 'developType',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: 'android版本号',
                prop: 'androidVersionNumber',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: 'android版本值',
                prop: 'androidVersionValue',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: 'ios版本号',
                prop: 'iosVersionNumber',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: 'ios版本值',
                prop: 'iosVersionValue',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'select',
                label: '是否启用 0启用 1禁用',
                prop: 'isDel',
                list: 'isDel',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'select',
                label: '是否展示 0展示 1不展示',
                prop: 'isShow',
                list: 'isShow',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'datetime',
                label: '修改时间',
                prop: 'updateTime'
            }
            
        ]
    }
}
