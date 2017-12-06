export const breadcrumbData = [
    {
        title: '财务'
    },
    {
        title: '财务基础配置'
    },
    {
        title: '款项用途配置'
    }
]
export const columns = [
    {
        prop: 'code',
        label: '编码'
    },
    {
        prop: 'name',
        label: '款项用途'
    },
    {
        prop: 'isRepeat',
        label: '是否唯一',
        list: 'isRepeat'
    },
    {
        prop: 'businessTypeName',
        label: '业务类型'
    },
    {
        prop: 'debitObjectName',
        label: '收款对象'
    },
    {
        prop: 'debitTypeName',
        label: '收款类型'
    },
    {
        prop: 'status',
        label: '状态',
        list: 'status'
    },
    {
        prop: 'createName',
        label: '创建人'
    },
    {
        prop: 'createTime',
        label: '创建时间',
        formatter: 'dateParser'
    },
    {
        prop: 'updateName',
        label: '修改人'
    },
    {
        prop: 'updateTime',
        label: '修改时间',
        formatter: 'dateParser'
    }
]
export const blankData = {
    fundPurposeId: null,
    isRepeat: null,
    debitTypeCodeId: null,
    businessTypeId: null,
    createUser: null,
    debitObjectId: null,
    permittedDiffAmount: null
}
export const commonData = {
    businessTypeCode: [],
    debitObjectCode: [],
    debitTypeCode: [],
    fundPurposes: [],
    status: [
        {
            text: '有效',
            value: 1
        },
        {
            text: '作废',
            value: 0
        }
    ],
    isRepeat: [
        {
            text: '否',
            value: 0
        },
        {
            text: '是',
            value: 1
        }
    ]
}
export const dlgRules = {
    businessTypeId: [
        {
            required: true,
            message: '请选择业务类型'
        }
    ],
    debitObjectId: [
        {
            required: true,
            message: '请选择收款对象'
        }
    ],
    debitTypeCodeId: [
        {
            required: true,
            message: '请选择收款类型'
        }
    ],
    fundPurposeId: [
        {
            required: true,
            message: '请选择款项用途'
        }
    ],
    isRepeat: [
        {
            required: true,
            message: '请选择是否唯一'
        }
    ],
    permittedDiffAmount: [
        {
            required: true,
            message: '请填写核销差额0-100'
        },
        {
            pattern: /^(\d|[1-9]\d|100)$/,
            message: '请填写核销差额0-100'
        }
    ]
}
