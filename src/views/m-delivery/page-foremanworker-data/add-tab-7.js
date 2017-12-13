export default {
    "tableDebitType": [
        {
            "prop": "frozenType",
            "label": "冻结类型",
            "list": "frozenTypeList",
            "sortable": false,
            "editor": {
                "type": "select",
                "rules": [
                    {
                        "required": true,
                        "message": "请选择冻结类型"
                    }
                ]
            }
        },
        {
            "prop": "dataStatus",
            "label": "状态",
            "list": "dataStatusList",
            "sortable": false
        },
        {
            "prop": "updateTime",
            "label": "修改时间",
            "sortable": false,
             "formatter": "dateParser" 
        }
    ]
}