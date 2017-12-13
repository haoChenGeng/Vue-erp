export default {
    mainTable: {
        fields: [
            {
                type: 'select',
                label: '平台',
                prop: 'versionPlat',
                list: 'versionPlat',
                disabled:true,
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'select',
                label: '更新类型',
                prop: 'versionType',
                list: 'versionType',
                rules: [
                    {type:'number', required: true, message: '请选择更新类型', trigger:"change"}
                ]
            },
            {
                type: 'input',
                label: '版本号',
                prop: 'versionNumber',
                rules: [
                    {required: true, message: '请填写版本号', trigger: 'blur'}
                ]
            },
            {
                type: 'input',
                label: '版本值',
                prop: 'versionValue',
                rules: [
                    { required: true, message: '请填写版本值', trigger: 'blur'},
                    { pattern: /^\d{0,9}$/, message: '版本值格式错误', trigger: 'blur' }
                ]
            },
            {
                type: 'textarea',
                label: '版本说明',
                prop: 'versionMemo',
                rules: [
                    {required: true, message: '请填写版本说明', trigger: 'blur'},
                    { min: 1, max: 500, message: '功能名称不能超过500个字符', trigger: 'blur' }
                ]
            }
            
        ]
    }
}
