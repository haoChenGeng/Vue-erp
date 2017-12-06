export default {
    mainTable: {
        name: 'deliverInstallPlan',
        service: '2ut6bUIvrvApAgRqxlP3eQCn3mCy3Kh',
        method: 'VCBbIRYFiHOQpL4NsNdGqMXy0cFFSWUFRMxfQRm',
        args: {
            id: null
        },
        createMethod: 'WGnorhpw8o24uq1duvpWxNbYBw_V2Y-rpFCXcOO',
        updateMethod: 'h2HhbKNkhZpwQ2FTbcLwYL46v-bUbZ1OKHoYEyB',
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
                label: '项目表id',
                prop: 'applyId',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '前继计划id',
                prop: 'parentId',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '配送计划id',
                prop: 'deliverId',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '类型',
                prop: 'type',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '排期节点id',
                prop: 'scheduleNodeId',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '楼盘id  -- apply_id关联',
                prop: 'estateId',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: 'gps信息 -- apply_id 关联',
                prop: 'houseCoordinate',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '品类id -- 排期节点属性',
                prop: 'categoryId',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '安装人id',
                prop: 'installer',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '安装计划开始日期',
                prop: 'insPlanStart',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '安装计划结束日期',
                prop: 'insPlanEnd',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '计划类型',
                prop: 'planType',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '责任方',
                prop: 'responsible',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '业务类型id -- 项目id关联',
                prop: 'bizTypeId',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '产品包id -- 项目id关联',
                prop: 'productPkgId',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '业主id -- 项目id关联',
                prop: 'projectOwerId',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '工长id -- 项目id关联',
                prop: 'workerId',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '报备备注',
                prop: 'reportRemark',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '安装结果备注',
                prop: 'installResultRemark',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '状态 : 待调度',
                prop: 'status',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '安装调度提交日期',
                prop: 'insDispatchSubmit',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '工长报备日期',
                prop: 'workerReportTime',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '工长提交报备时的日期',
                prop: 'workerReportSubmit',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '调度计划配送日期',
                prop: 'disPlanDeliverTime',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '调度配送计划提交日期',
                prop: 'disPlanDeliverSubmit',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '物流确认送达时间',
                prop: 'logConfirmDeliver',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '调度计划最后修改时间',
                prop: 'disPlanDeliverMdf',
                rules: [
                    {required: true, message: ''}
                ]
            },
            {
                type: 'input',
                label: '附件数量',
                prop: 'attachNum',
                rules: [
                    {required: true, message: ''}
                ]
            }
            
        ]
    }
}
