import DateUtils from 'src/utils/DateUtils.js'
import Service from 'src/services/salemanager/project/Service.js'
export default {
    baseForm: [{
        label: '项目信息',
        name: 'mainInfo',
        type: 'form',
        fields: [
            {
                type: 'input',
                label: '项目ID',
                disabled: 'disabled',
                prop: 'sourceProjectId',
            },
            {
                type: 'input',
                label: '项目地区',
                disabled: 'disabled',
                prop: 'cityTownName',
            },
            {
                type: 'input',
                label: '楼盘',
                disabled: 'disabled',
                prop: 'estateName',
            },
            {
                type: 'input',
                label: '详细地址',
                disabled: 'disabled',
                prop: 'houseAddress',
            },
            {
                type: 'input',
                label: '项目状态',
                disabled: 'disabled',
                prop: 'orderSubStatusName',
            },
            {
                type: 'input',
                label: '家装公装',
                disabled: 'disabled',
                prop: 'decorateTypeName',
            },
            {
                type: 'input',
                label: '整改局改',
                disabled: 'disabled',
                prop: 'decorateRangeName',
            },
            {
                type: 'input',
                label: '装修风格',
                disabled: 'disabled',
                prop: 'preferStyleName',
            },
            {
                type: 'input',
                label: '新旧房',
                disabled: 'disabled',
                prop: 'houseStatusName',
            },
            {
                type: 'input',
                label: '房屋类型',
                disabled: 'disabled',
                prop: 'houseTypeName',
            },
            {
                type: 'input',
                label: '户型',
                disabled: 'disabled',
                prop: 'houseStyle',
            },
            {
                type: 'input',
                label: '套内面积',
                disabled: 'disabled',
                prop: 'houseArea',
            },
            {
                type: 'input',
                label: '房屋结构',
                disabled: 'disabled',
                prop: 'houseStructName',
            }
        ]
    },
    {
        label: '业主信息',
        name: 'suppliers',
        type: 'form',
        fields: [
            {
                type: 'input',
                label: '业主ID',
                disabled: 'disabled',
                prop: 'ownerId',
            },
            {
                type: 'input',
                label: '业主电话ID',
                disabled: 'disabled',
                prop: 'phoneId',
            },
            {
                type: 'input',
                label: '业主姓名',
                disabled: 'disabled',
                prop: 'ownerName',
            },
            {
                type: 'input',
                label: '业主称呼',
                disabled: 'disabled',
                prop: 'appellation',
            }
        ]
    },
    {
        label: '跟进记录',
        name: 'followRecord',
        type: 'table',
        showPage: false,
        fields: [
            {
                prop: "feedbackType",
                label: "反馈类型",
                list: 'feedbackTypeList'
            },
            {
                prop: "feedbackStageName",
                label: "反馈节点"
            },
            {
                prop: "createTime",
                label: "反馈时间",
                formatter: 'dateParser'
            },
            {
                prop: "feedbackContent",
                label: "反馈内容"
            },
            {
                prop: "createUserNameAndRole",
                label: "反馈人"

            }
        ]
    }],
    customForm: [
        {
            label: '土巴兔客服反馈信息',
            name: 'customRecord',
            type: 'table',
            showPage: false,
            fields: [
                {
                    prop: "feedbackTypeName",
                    label: "事件类型"

                },
                {
                    prop: "feedbackStageName",
                    label: "状态"
                },
                {
                    prop: "feedbackContent",
                    label: "进展内容"
                },
                {
                    prop: "createTime",
                    label: "记录时间",
                    formatter: 'dateParser'

                },
                {
                    prop: "createUserName",
                    label: "记录人"
                }
            ]
        }
    ],
    sellForm: [
        {
            label: '当前跟进人',
            name: 'followPerson',
            type: 'table',
            showPage: false,
            fields: [
                {
                    prop: "roleName",
                    label: "角色"
                },
                {
                    prop: "followPersonName",
                    label: "跟进人"
                },
                {
                    prop: "phone",
                    label: "电话"
                }
            ]
        },
        {
            label: '分派装修公司记录',
            name: 'assignCompany',
            type: 'table',
            showPage: false,
            fields: [
                {
                    prop: "companyName",
                    label: "装修公司名称"
                },
                {
                    prop: "createTime",
                    label: "分派时间",
                    formatter: 'dateParser'
                }
            ]
        },
        {
            label: '派工记录',
            name: 'assignRecord',
            type: 'table',
            showPage: false,
            fields: [
                {
                    prop: "id",
                    label: "单据ID"
                },
                {
                    prop: "rootOrgName",
                    label: "组织"
                },
                {
                    prop: "sourceProjectId",
                    label: "项目ID"
                },
                // {
                //     prop: "bizType",
                //     label: "业务类型"
                // },
                {
                    prop: "reason",
                    label: "派工原因"
                },
                {
                    prop: "assignType",
                    label: "派工类型"
                },
                {
                    prop: "principalName",
                    label: "负责人"
                },
                {
                    prop: "state",
                    label: "单据状态",
                    list: "recordList"

                },
                {
                    prop: "assignerName",
                    label: "操作人"
                },
                {
                    prop: "assignTime",
                    label: "操作时间",
                    formatter: 'dateParser'
                }
            ]
        }
    ],
    inviteForm: [
        {
            label: '邀约情况',
            name: 'inviteInfo',
            type: 'table',
            showPage: false,
            fields: [
                {
                    prop: "status",
                    label: "邀约情况",
                    list: "appointStatus"
                },
                {
                    prop: "appointTime",
                    label: "预计量房时间",
                    formatter: 'dateParser'
                },
                {
                    prop: "nextTime",
                    label: "下次跟进时间",
                    formatter: 'dateParser'
                },
                {
                    prop: "remark",
                    label: "邀约反馈"
                },
                {
                    prop: "createName",
                    label: "跟进人"
                },
                {
                    prop: "createTime",
                    label: "操作时间",
                    formatter: 'dateParser'
                }
            ]
        }
    ],
    measureForm: [
        {
            label: '量房情况',
            name: 'measureDetail',
            type: 'form',
            fields: [
                {
                    type: 'input',
                    label: '量房结果',
                    disabled: 'disabled',
                    prop: 'statusString',
                },
                {
                    type: 'datetime',
                    label: '量房时间',
                    disabled: 'disabled',
                    prop: 'measureTime',
                },
                {
                    type: 'input',
                    label: '跟进人',
                    disabled: 'disabled',
                    prop: 'designerName',
                },
                {
                    type: 'input',
                    label: '量房地址',
                    disabled: 'disabled',
                    prop: 'measureAddr',
                }
            ]
        },
        {
            label: '打卡记录',
            name: 'punchInfo',
            type: 'table',
            service: Service.MEASURE.name,
            method: Service.MEASURE.methods.QUERYPUNCHPAGE,
            args: {
                page: 1,
                size: 20,
                search: {
                    projectId: '@id'
                }
            },
            showPage: true,
            fields: [
                {
                    label: '记录ID',
                    prop: 'id',
                },
                {
                    label: '打卡时间',
                    prop: 'punchTime',
                    formatter: 'dateParser'
                },
                {
                    label: '打卡地址',
                    prop: 'punchAddr',
                },
                {
                    label: '操作人',
                    prop: 'createName',
                }
            ]
        },
        {
            label: '房屋细节图',
            name: 'measureImgs',
            prop: 'attachVOS',
            type: 'picList'
        }
    ],
    contractForm: [
        {
            label: '合同预览',
            name: 'contractView',
            prop: 'pdfUrl',
            type: 'pdf'
        }
    ],
    financeForm: [
        {
            label: '轮单费信息',
            name: 'financeInfo',
            type: 'form',
            fields: [
                {
                    type: 'input',
                    label: '轮单费',
                    disabled: 'disabled',
                    prop: 'xiaohao',
                },
                {
                    type: 'input',
                    label: '扣费状态',
                    disabled: 'disabled',
                    prop: 'iscostName',
                }
            ]
        },
        {
            label: '托管款信息',
            name: 'trusteeInfo',
            type: 'table',
            showPage: false,
            hideIndex: true,
            fields: [
                {
                    label: '款项类型',
                    prop: 'type',
                    list: 'trusteeInfoList'
                },
                {
                    label: '缴费状态',
                    prop: 'status',
                    list: "trusteeStatus"
                },
                {
                    label: '金额',
                    prop: 'money',
                }
            ]
        },
        {
            label: '返款信息',
            name: 'nodeMoneyInfo',
            type: 'table',
            showPage: false,
            hideIndex: true,
            fields: [
                {
                    label: '款项类型',
                    prop: 'type',
                    list: 'nodeMoneyInfo'
                },
                {
                    label: '返款状态',
                    prop: 'status',
                    list: 'nodeMoneyStatus'
                },
                {
                    label: '金额',
                    prop: 'money',
                }
            ]
        }
    ],
    projectForm: [
        {
            label: '当前跟进人',
            name: 'followPerson',
            type: 'table',
            showPage: false,
            fields: [
                {
                    label: '角色',
                    prop: 'roleName',
                },
                {
                    label: '跟进人',
                    prop: 'followPersonName',
                },
                {
                    label: '电话',
                    prop: 'phone',
                }
            ]
        },
        {
            label: '派工记录',
            name: 'assignRecord',
            type: 'table',
            showPage: false,
            fields: [
                {
                    prop: "id",
                    label: "单据ID"
                },
                {
                    prop: "rootOrgName",
                    label: "组织"
                },
                {
                    prop: "sourceProjectId",
                    label: "项目ID"
                },
                // {
                //     prop: "bizType",
                //     label: "业务类型"
                // },
                {
                    prop: "reason",
                    label: "派工原因"
                },
                {
                    prop: "assignType",
                    label: "派工类型"
                },
                {
                    prop: "principalName",
                    label: "负责人"
                },
                {
                    prop: "state",
                    label: "单据状态",
                    list: "recordList"

                },
                {
                    prop: "assignerName",
                    label: "操作人"
                },
                {
                    prop: "assignTime",
                    label: "操作时间",
                    formatter: 'dateParser'
                }
            ]
        },
    ],
    platCheckForm: [
        {
            label: '工程验收信息',
            name: "platCheckList",
            type: 'table',
            showPage: false,
            fields: [
                {
                    prop: "billCode",
                    label: "验收单号"
                },
                {
                    prop: "checkTypeName",
                    label: "验收节点"
                },
                {
                    prop: "projectManagerName",
                    label: "工长姓名"
                },
                {
                    prop: "ownerName",
                    label: "业主姓名"
                },
                {
                    prop: "qualityControlName",
                    label: "质检姓名"
                },
                {
                    prop: "billStatus",
                    label: "单据状态",
                    list: "billStatusList"
                },
                {
                    prop: "expectTime",
                    label: "预约验收时间",
                },
                {
                    prop: "checkTime",
                    label: "实际验收时间"
                },
                {
                    prop: "createTime",
                    label: "创建日期",
                    formatter: 'dateParser'
                }
            ]
        }
    ],
    goodsDemandForm: [
        {
            label: '辅材下单信息',
            name: "goodsDemand",
            type: 'table',
            showPage: false,
            fields: [
                {
                    prop: "orderCode",
                    label: "要货单编号"
                },
                {
                    prop: "materialTypeName",
                    label: "材料类型"
                },
                {
                    prop: "goodsDemandSourceName",
                    label: "要货来源"
                },
                // {
                //     prop: "ownerName",
                //     label: "要货批次"
                // },
                {
                    prop: "workerName",
                    label: "工长姓名"
                },
                {
                    prop: "ownerName",
                    label: "业主姓名"
                },
                {
                    prop: "orderStatus",
                    label: "状态",
                    list: "orderStatusList"
                },
                {
                    prop: "createTime",
                    label: "要货日期",
                    formatter: 'dateParser'
                },
                {
                    prop: "goodsDemandTime",
                    label: "创建时间",
                    formatter: 'dateParser'
                },
            ]
        }
    ],
    assignForm: [{
        label: '项目信息',
        name: 'mainInfo',
        type: 'form',
        fields: [
            {
                type: 'input',
                label: '项目ID',
                disabled: 'disabled',
                prop: 'sourceProjectId',
            },
            {
                type: 'input',
                label: '项目地区',
                disabled: 'disabled',
                prop: 'cityTownName',
            },
            {
                type: 'input',
                label: '楼盘',
                disabled: 'disabled',
                prop: 'estateName',
            },
            {
                type: 'input',
                label: '详细地址',
                disabled: 'disabled',
                prop: 'houseAddress',
            },
            {
                type: 'input',
                label: '项目状态',
                disabled: 'disabled',
                prop: 'orderSubStatusName',
            },
            {
                type: 'input',
                label: '家装公装',
                disabled: 'disabled',
                prop: 'decorateTypeName',
            },
            {
                type: 'input',
                label: '整改局改',
                disabled: 'disabled',
                prop: 'decorateRangeName',
            },
            {
                type: 'input',
                label: '装修风格',
                disabled: 'disabled',
                prop: 'preferStyleName',
            },
            {
                type: 'input',
                label: '新旧房',
                disabled: 'disabled',
                prop: 'houseStatusName',
            },
            {
                type: 'input',
                label: '房屋类型',
                disabled: 'disabled',
                prop: 'houseTypeName',
            },
            {
                type: 'input',
                label: '户型',
                disabled: 'disabled',
                prop: 'houseStyle',
            },
            {
                type: 'input',
                label: '套内面积',
                disabled: 'disabled',
                prop: 'houseArea',
            },
            {
                type: 'input',
                label: '房屋结构',
                disabled: 'disabled',
                prop: 'houseStructName',
            }
        ]
    },
    {
        label: '业主信息',
        name: 'suppliers',
        type: 'form',
        fields: [
            {
                type: 'input',
                label: '业主ID',
                disabled: 'disabled',
                prop: 'ownerId',
            },
            {
                type: 'input',
                label: '业主电话',
                disabled: 'disabled',
                prop: 'phone',
            },
            {
                type: 'input',
                label: '业主姓名',
                disabled: 'disabled',
                prop: 'ownerName',
            },
            {
                type: 'input',
                label: '业主称呼',
                disabled: 'disabled',
                prop: 'appellation',
            }
        ]
    },
    {
        label: '跟进记录',
        name: 'followRecord',
        type: 'table',
        showPage: false,
        fields: [
            {
                prop: "feedbackType",
                label: "反馈类型",
                list: 'feedbackTypeList'
            },
            {
                prop: "feedbackStageName",
                label: "反馈节点"
            },
            {
                prop: "createTime",
                label: "反馈时间",
                formatter: 'dateParser'
            },
            {
                prop: "feedbackContent",
                label: "反馈内容"
            },
            {
                prop: "createUserNameAndRole",
                label: "反馈人"

            }
        ]
    }],
    options: {
        feedbackTypeList: [
            { value: 1, text: "项目进度" },
            { value: 2, text: "一般事件" },
        ],
        recordList: [
            { value: 1, text: "生效" },
            { value: 2, text: "作废" }

        ],
        appointStatus: [
            { value: 1, text: "邀约成功" },
            { value: 2, text: "暂不量房" },
            { value: 3, text: "死单" }
        ],
        billStatusList: [
            { value: 0, text: "默认" },
            { value: 1, text: "待验收" },
            { value: 2, text: "合格" },
            { value: 3, text: "不合格" }
        ],
        orderStatusList: [
            { value: 0, text: "待发货" },
            { value: 1, text: "已发货" },
            { value: 2, text: "已收货" },
            { value: 3, text: "取消" },
            { value: 4, text: "待审核" },
            { value: 5, text: "已驳回" },
            { value: 6, text: "新建（暂存）" },
        ],
        trusteeStatus: [
            { value: 0, text: "已提交" },
            { value: 1, text: "已缴" },
            { value: 2, text: "应缴" },
        ],
        nodeMoneyStatus: [
            { value: 0, text: "已提交" },
            { value: 1, text: "已返" },
            { value: 2, text: "应返" },
        ],
        trusteeInfoList: [
            { value: "4", text: "首期" },
            { value: "5", text: "水电增项款" },
            { value: "6", text: "二期" },
            { value: "7", text: "三期" }
        ],
        nodeMoneyInfo: [
            { value: "3", text: "泥木" },
            { value: "2", text: "水电" },
            { value: "4", text: "油漆" },
            { value: "5", text: "竣工" },
            { value: "6", text: "开工" },
            { value: "7", text: "材料" },
            { value: "8", text: "水电增项" }
        ]
    }

}
