export const breadcrumbData = [
    {title: '销售管理'},
    {title: '活动管理'},
    {title: '活动类型'}
]

export const columns = [
    { "prop": "code", "label": "活动编码" },
    { "prop": "name", "label": "活动类型" }
]

export const formData = {
    code: null,
    name: null,
}

export const formRules = {
    code: [
        {
            required: true,
            message: '请填写活动编码',
            trigger: 'blur'
        }
    ],
    name: [
        {
            required: true,
            message: '请填写活动类型',
            trigger: 'blur'
        }
    ]
}
