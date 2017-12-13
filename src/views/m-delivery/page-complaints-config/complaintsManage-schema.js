import Service from 'src/services/delivery/Service.js'
export default {
    addTable: {
        name: 'manageDetail',
        tabs: [
            {
                label: '基本信息',
                name: 'tab1',
                fields: [
                    {
                        type: 'select',
                        label: '产品包',
                        prop: 'productPackageId',
                        list: 'productPkgOption',
                        rules: [
                            {required: true, message: '请选择产品包'}
                        ]
                    }, {
                        type: 'select',
                        label: '投诉对象',
                        prop: 'objectConfigId',
                        list: 'objectConfigOption',
                        rules: [
                            {required: true, message: '请选择投诉对象'}
                        ]
                    }
                ]
            }
        ]
    },
    mainTable: {
        name: 'manageDetail',
        service: Service.COMPLAINT.name,
        method: Service.COMPLAINT.methods.COMPLAINTMANAFINDBYID,
        args: {
            id: null
        },
        tabs: [
            {
                label: '基本信息',
                name: 'tab1',
                fields: [
                    {
                        type: 'select',
                        label: '产品包',
                        prop: 'productPackageId',
                        list: 'productPkgOption',
                        disabled: "disabled"
                    }, {
                        type: 'select',
                        label: '投诉对象',
                        prop: 'objectConfigId',
                        list: 'objectConfigOption',
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '创建人',
                        prop: 'createName',
                        disabled: "disabled"
                    }, {
                        type: 'datetime',
                        label: '创建时间',
                        prop: 'createTime',
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '修改人',
                        prop: 'updateBy',
                        disabled: "disabled"
                    },
                    {
                        type: 'datetime',
                        label: '修改时间',
                        prop: 'updateTime',
                        disabled: "disabled"
                    }
                ]
            }
        ]
    },
    subTables: [
        {
            name: 'contentConfig',
            label: '投诉内容配置',
            type: 'table',
            service: Service.COMPLAINT.name,
            method: Service.COMPLAINT.methods.COMPLAINTCONTENTQUERYPAGE,
            args: {
                search: {
                    managementId: '@id'
                }
            },
            fields: [
                {
                    label: 'ID',
                    prop: 'id'
                },
                {
                    type: 'select',
                    label: '投诉内容',
                    prop: 'complaintContentId',
                    list: 'complaintContentOption',
                    editor: {
                        type: "select",
                        rules: [
                            {required: true, message: '请选择投诉内容'}
                        ]
                    }
                }, {
                    type: 'select',
                    label: '状态',
                    prop: 'status',
                    list: 'statusOption',
                    editor: {
                        type: "select",
                        rules: [
                            {required: true, message: '请选择投诉内容'}
                        ]
                    }

                }, {
                    label: '创建人',
                    prop: 'createBy',
                }, {
                    type: "datetime",
                    label: '创建时间',
                    prop: 'createTime',
                    "formatter": "dateParser"
                }, {
                    label: '修改人',
                    prop: 'updateBy',
                }, {
                    type: "datetime",
                    label: '修改时间',
                    prop: 'updateTime',
                    "formatter": "dateParser"
                }
            ]
        }, {
            name: 'staffConfig',
            label: '投诉人员配置',
            type: 'table',
            service: Service.COMPLAINT.name,
            method: Service.COMPLAINT.methods.COMPLAINTSTAFFQUERYPAGE,
            args: {
                search: {
                    managementId: '@id'
                }
            },
            fields: [
                {
                    label: "ID",
                    prop: "id"
                },
                {
                    label: '人员类型',
                    prop: 'staffType',
                    list: 'staffTypeOption',
                    editor: {
                        type: "select",
                        rules: [
                            {required: true, message: '请选择人员类型'}
                        ]
                    }
                },
                {
                    label: '分配类型',
                    prop: 'distributionType',
                    list: 'distributionTypeOption',
                    editor: {
                        type: "select",
                        rules: [
                            {required: true, message: '请选择分配类型'}
                        ]
                    }
                }, {
                    label: '具体来源',
                    prop: 'specificCode',
                    list: 'specificSourceOption',
                    editor: {
                        type: "select"
                    }
                }, {
                    label: '状态',
                    prop: 'status',
                    list: 'statusOption',
                    editor: {
                        type: "select",
                        rules: [
                            {required: true, message: ''}
                        ]
                    }
                }, {
                    label: '是否默认',
                    prop: 'isDefault',
                    list: 'isDefaultOption',
                    editor: {
                        type: "select",
                    }
                },  {
                    label: '创建人',
                    prop: 'createBy',
                }, {
                    type: "datetime",
                    label: '创建时间',
                    prop: 'createTime',
                    "formatter": "dateParser"
                }, {
                    label: '修改人',
                    prop: 'updateBy',
                }, {
                    type: "datetime",
                    label: '修改时间',
                    prop: 'updateTime',
                    "formatter": "dateParser"
                }
            ]
        }
    ]
}
