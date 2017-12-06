import Cookie from 'js-cookie'
export const breadcrumbData = [
    {
        title: '财务'
    },
    {
        title: '存货核算'
    },
    {
        title: '存货单价计算'
    }
];
export const columns = [
    {
        prop: 'costDomainName',
        label: '成本域',
    },
    {
        prop: 'accountingTime',
        label: '会计期间',
        formatter: function (val) {
            var date = new Date(val * 1000)
            return date.getFullYear() + "-" + (date.getMonth() + 1);
            //return new Date(val * 1000).toLocaleDateString().split("/").slice(0, 2).join("-")
        }
    },
    {
        prop: 'taskStageName',
        label: '流程步骤',
    },
    {
        prop: 'status',
        label: '状态',
        list: 'status'
    },
    {
        prop: 'taskStartTime',
        label: '执行开始时间',
        formatter: "dateParser"
    },
    {
        prop: 'taskEndTime',
        label: '执行结束时间',
        formatter: "dateParser"
    },
    {
        prop: 'taskStartUserName',
        label: '发起人'
    }
];


export const commonData = {
    status: [
        {
            text: '未开始',
            value: 0
        },
        {
            text: '执行中',
            value: 1
        },
        {
            text: '执行成功',
            value: 2
        },
        {
            text: '执行失败',
            value: 3
        },
        {
            text: '已撤销',
            value: 4
        }
    ]
};

export const formData = {
    id: null,
    code: null,
    name: null,
    status: null,
    remark: null,
    createUser: parseInt(Cookie.get('t8t-tc-uid'))
};

