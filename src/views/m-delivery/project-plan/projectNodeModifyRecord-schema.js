export default {
    mainTable: {
        name: 'projectNodeModifyRecord',
        service: '-rNbirB8ZP7VjkJPuQOSgA630lvEIIB',
        method: 'Bi0dFOr8EfPJ-fv6BkqO0S4T9BsmW38qTyASnUHdWuU9E7o',
        args: {
            id: null
        },
        createMethod: 'VUQqSzgxV8-pfQQGWU69eimuFgKmhbnUrK0iyCefkKy',
        updateMethod: 'QO_1iqLsRWLAogMKGPI6vGdgdradMWojtJ1jM6YRMFs',
        fields: [
            {
                type: 'input',
                label: '项目ID',
                prop: 'projectId',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '节点ID',
                prop: 'nodeId',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '引用的排期模板ID',
                prop: 'moduleId',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '模板节点ID',
                prop: 'moduleItemId',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '单据类型',
                prop: 'billType',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '变更的项目节点表字段名',
                prop: 'modifyField',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '变更字段的原值',
                prop: 'originValue',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '变更字段的新值',
                prop: 'newValue',
                rules: [
                    {required: true, message: ''}
                ]
            },
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
            }
            
        ]
    }
}
