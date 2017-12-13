export default {
    "tableDebitType": [
        {
            "prop": "workerCode",
            "label": "工号",
            "sortable": false,
        },
        {
            "prop": "workerName",
            "label": "姓名",
            "sortable": false,
        },
        {
            "prop": "subOrgName",
            "label": "土巴兔分公司",
            "sortable": true,
        },
        {
            "prop": "bizTypeName",
            "label": "模式",
            "sortable": false,
        },
        {
            "prop": "phoneDecode",
            "label": "手机号码",
            "sortable": false,
        },
        {
            "prop": "workTypeName",
            "label": "工种",
            "sortable": false,
        },
        {
            "prop": "isWorkerBankAccount",
            "label": "是否添加银行",
            "list": "isWorkerBankAccountList",
            "sortable": false,
        },
        {
            "prop": "workerStatus",
            "label": "状态",
            "list":"workerStatusList",
            "sortable": false,
        },
        {
            "prop": "createTime",
            "label": "创建时间",
            "sortable": false,
            "formatter": "dateParser"
        }
    ]
}