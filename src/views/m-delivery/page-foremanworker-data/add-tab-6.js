export default {
    "tableDebitType": [
        {
            "prop": "attachTypeValueId",
            "label": "附件类型",
            "list": "attachTypeList",
            "required": true,
            "sortable": false,
            "editor": {
                "type": "select",
                "rules": [
                    {
                        "required": true,
                        "message": "请选择附件类型"
                    }
                ]
            }
        },
        {
            "prop": "attachName",
            "label": "附件名称",
            "sortable": false,
            "required": true,
            "editor": {
                "type": "input",
                "readonly":true,
                "rules": [
                    {
                        "required": true,
                        "message": "附件不能为空"
                    }
                ]
            }
        },
        {
            "prop": "createTime",
            "label": "上传时间",
            "sortable": false,
             "formatter": "dateParser"
        },
        {
            "prop": "status",
            "label": "状态",
            "list": "statusList",
            "sortable": false
        },
        {
            "prop": "createUserName",
            "label": "上传人",
            "sortable": false
        },
    ]
}