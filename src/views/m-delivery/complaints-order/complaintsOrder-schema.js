import Service from 'src/services/delivery/Service.js'
export default {
    addTable: {
        name: 'complaintsOrder',
        args: {
            id: null
        },
        tabs: [
            {
                label: '项目信息',
                name: 'tab1',
                fields: [
                    {
                        type: 'input',
                        label: '项目ID',
                        prop: 'projectId',
                        rules: [
                            {required: true, message: '请输入项目ID'}
                        ],
                    },
                    // {
                    //     type: 'input',
                    //     label: '业主称呼',
                    //     prop: 'nickName',
                    //     disabled: "disabled"
                    // },
                    {
                        type: 'input',
                        label: '业主姓名',
                        prop: 'ownerName',
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '业务类型',
                        prop: 'bizTypeName',
                        disabled: "disabled"
                    },
                    // {
                    //     type: 'input',
                    //     label: '组织',
                    //     prop: 'organizationName',
                    //     disabled: "disabled"
                    // },
                    {
                        type: 'input',
                        label: '产品包',
                        prop: 'productPkgName',
                        disabled: "disabled"
                    },
                    {
                        type: 'input',
                        label: '城市',
                        prop: 'cityName',
                        disabled: "disabled"
                    },
                    {
                        type: 'select',
                        label: '投诉来源',
                        prop: 'complaintSource',
                        list: 'complaintSource',
                        rules: [
                            {required: true, message: '请选择投诉来源'}
                        ]
                    },
                    {
                        type: 'input',
                        label: '项目阶段',
                        prop: 'phaseName',
                        disabled: "disabled"
                    },
                    {
                        type: 'textarea',
                        label: '项目地址',
                        prop: 'protectAddress',
                        disabled: "disabled"
                    },
                ]
            }
        ]
    },
    addSubTables: [
        {
            name: 'complaintsItem',
            label: '投诉内容',
            type: 'table',
            args: {
            },
            fields: [
                {
                    label: "ID",
                    prop: 'id'
                },
                {
                    type: 'select',
                    label: '投诉对象',
                    prop: 'complaintObjectId',
                    list: 'complaintObjOption',
                    editor: {
                        type: 'select',
                        rules: [
                            {required: true, message: '请选择投诉对象'}
                        ]
                    },

                },
                {
                    type: 'select',
                    label: '具体名称',
                    prop: 'specificNameId',
                    list: 'specificNameOptions',
                    editor: {
                        type: 'select',
                        list: 'specificNameOption',
                        rules: [
                            {required: true, message: '请选择具体名称'}
                        ]
                    }
                }, {
                    type: 'lookup',
                    label: '投诉内容',
                    prop: 'complaintsConfigItemId',
                    editor:{
                        'type': 'lookup',
                        "dataSource":[],
                        'columns': [{
                            'prop': 'text',
                            'label': '投诉内容'
                        }],
                        "multiple":true,
                        rules: [
                            {required: true, message: '请选择投诉内容'}
                        ]
                    },
                    // formatter:function(k,v,c,t){
                    //     console.log(k,v,c,t)
                    //     let list = []
                    //     let showList = []
                    //     if(typeof (k) === 'object') {
                    //         k.forEach((item) => {
                    //             list.push(item.value)
                    //             showList.push(item.text)
                    //         })
                    //     }
                    //     k.complaintsConfigItemId = list
                    //     console.log(showList)
                    //     console.log(list)
                    //     return "test"
                    // }
                },
                // {
                //     type: 'select',
                //     label: '投诉类型',
                //     prop: 'complaintType',
                //     list: 'complaintType',
                //     editor: {
                //         type: 'select',
                //         rules: [
                //             {required: true, message: '请选择投诉类型'}
                //         ]
                //     },},
                {
                    type: 'select',
                    label: '投诉等级',
                    prop: 'complaintLevel',
                    list: 'complaintLevel',
                    editor: {
                        type: 'select',
                    },
                }, {
                    type: 'select',
                    label: '回访人',
                    prop: 'visitorId',
                    list: 'visitorOptions',
                    editor: {
                        type: 'select',
                        list: 'visitorOption',
                        rules: [
                            {required: true, message: '请选择回访人'}
                        ]
                    }
                },
                // {
                //     type: 'input',
                //     label: '回访跟进时间',
                //     prop: 'visitFollowTime',
                //     editor: {
                //         type: 'datetime',
                //         rules: [
                //             {required: true, message: '请选择回访跟进时间'}
                //         ]
                //     },
                // },
                {
                    type: 'select',
                    label: '处理人',
                    prop: 'handlerId',
                    list: 'handlerOptions',
                    editor: {
                        type: 'select',
                        list: 'handlerOption',
                        rules: [
                            {required: true, message: '请选择处理人'}
                        ]
                    },
                },

            ]
        }
    ],
    mainTable: {
        name: 'complaintsOrder',
        service: Service.COMPLAINT.name,
        method: Service.COMPLAINT.methods.COMPLAINTSORDERFINDBYID,
        args: {
            id: null
        },
        // createMethod: 'wbUV-GcLK0-kaDblIzd7Kw91cvwuOBmR7mn',
        // updateMethod: 'uPqTDowalIBATLzaVJEwCIkU7XDvsbnDqXX',
        tabs: [
            {
                label: '投诉信息',
                name: 'tab1',
                fields: [
                    {
                        type: 'input',
                        label: '投诉单号',
                        disabled:'disabled',
                        prop: 'orderCode',
                    }, {
                        type: 'input',
                        label: '投诉对象',
                        prop: 'objectName',
                        disabled:"disabled",
                        formatter:function (val,row) {
                            return val || row.complaintObjectId
                        }
                    }, {
                        type: 'input',
                        label: '具体名称',
                        prop: 'specificName',
                        disabled:"disabled",
                        formatter:function(val,row){
                            return val || row.specificNameId
                        }
                    }, {
                        type: 'select',
                        label: '投诉类型',
                        prop: 'complaintType',
                        list: 'complaintType',
                        disabled:"disabled"
                    }, {
                        type: 'select',
                        label: '投诉等级',
                        prop: 'complaintLevel',
                        list: 'complaintLevel',
                        rules: [
                            {required: true, message: '请选择投诉等级'}
                        ]
                    }, {
                        type: 'input',
                        label: '投诉阶段',
                        prop: 'phaseName',
                        disabled:"disabled"
                    }, {
                        type: 'select',
                        label: '投诉来源',
                        prop: 'complaintSource',
                        list: 'complaintSource'
                    }, {
                        type: 'select',
                        label: '投诉状态',
                        disabled:'disabled',
                        prop: 'orderStatus',
                        list: 'statusOption'
                    }, {
                        type: 'select',
                        label: '升级原因',
                        disabled:'disabled',
                        prop: 'upgradeReason',
                        list: 'upgradeReason',
                    },
                ]
            },
            {
                label: '项目信息',
                name: 'tab2',
                fields: [
                    {
                        type: 'input',
                        label: '项目ID',
                        disabled:'disabled',
                        prop: 'projectId',
                    }, {
                        type: 'input',
                        label: '业主称呼',
                        disabled:'disabled',
                        prop: 'nickName',
                    }, {
                        type: 'input',
                        label: '业主姓名',
                        disabled:'disabled',
                        prop: 'ownerName'
                    }, {
                        type: 'input',
                        label: '业务类型',
                        disabled:'disabled',
                        prop: 'bizTypeName',
                    }, {
                        type: 'input',
                        label: '组织',
                        disabled:'disabled',
                        prop: 'organizationName'
                    }, {
                        type: 'input',
                        label: '项目地址',
                        disabled:'disabled',
                        prop: 'protectAddress'
                    }, {
                        type: 'input',
                        label: '城市',
                        disabled:'disabled',
                        prop: 'cityName'
                    }, {
                        type: 'input',
                        label: '产品包',
                        disabled:'disabled',
                        prop: 'productPkgName'
                    }
                ]
            },
            {
                label: '跟进信息',
                name: 'tab3',
                fields: [
                    {
                        type: 'select-option-group',
                        label: '回访人ID',
                        prop: 'visitorId',
                        list: 'visitorId',
                        disabled:true
                    },
                    {
                        type: 'datetime',
                        label: '回访跟进时间',
                        disabled:'disabled',
                        prop: 'visitFollowTime',
                    },

                    {
                        type: 'select-option-group',
                        label: '处理人ID',
                        prop: 'handlerId',
                        list: 'handlerId',
                        disabled:true
                    },
                    {
                        type: 'datetime',
                        label: '处理跟进时间',
                        disabled:'disabled',
                        prop: 'handleFollowTime'
                    },
                    {
                        type: 'datetime',
                        label: '创建时间',
                        disabled:'disabled',
                        prop: 'createTime'
                    },
                    {
                        type: 'datetime',
                        label: '投诉时间',
                        disabled:'disabled',
                        prop: 'complaintTime'
                    },
                    {
                        type: 'datetime',
                        label: '处理时间',
                        disabled:'disabled',
                        prop: 'handlingTime'
                    },
                    {
                        type: 'datetime',
                        label: '关闭时间',
                        disabled:'disabled',
                        prop: 'closeTime'
                    },
                    {
                        type: 'datetime',
                        label: '升级时间',
                        disabled:'disabled',
                        prop: 'upgradeTime'
                    }
                ]
            }

        ]
    },
    subTables: [
        {
            name: 'complaintsItem',
            label: '投诉内容',
            type: 'table',
            service: Service.COMPLAINT.name,
            method: Service.COMPLAINT.methods.COMPLAINTSITEMQUERYPAGE,
            args: {
                search: {
                    complaintsOrderId: '@id'
                }
            },
            fields: [
                {
                    type: 'input',
                    label: 'ID',
                    prop: 'id',
                },
                {
                    label: '投诉内容',
                    prop: 'complaintsConfigItemId',
                    list: 'complaintsContentOpt',
                    editor: {
                        type: 'select',
                        rules: [
                            {required: true, message: '请选择投诉内容'}
                        ]
                    }
                },
                {
                    type: 'input',
                    label: '创建人',
                    prop: 'createName',
                },
                {
                    formatter: "dateParser",
                    label: '创建时间',
                    prop: 'createTime'
                },
            ]
        },
        {
            name: 'complaintsPicture',
            label: '投诉图片',
            type: 'pic',
            service: '',
            method: '',
            args:{}
        }
    ]
}
