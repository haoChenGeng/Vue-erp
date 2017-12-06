export default {
    "tableDebitType": [
        {
            "prop": "bizId",
            "label": "业务类型",
            "list": "businessTypes",
            "required": true,
            "sortable": false,
            "editor": {
                "type": "select",
                "rules": [
                    {
                        "required": true,
                        "message": "不能为空"
                    }
                ]
            }
        },
        {
            "prop": "receiptRoleId",
            "label": "所属项目经理",
            "list": "debitObjects",
            "required": true,
            "sortable": false,
            "editor": {
                "type": "select",
                "rules": [
                    {
                        "required": true,
                        "message": "不能为空"
                    }
                ]
            }
        },
        {
            "prop": "receiptTypeId",
            "label": "工种",
            "list": "debitTypes",
            "required": true,
            "sortable": false,
            "editor": {
                "type": "select",
                "rules": [
                    {
                        "required": true,
                        "message": "不能为空"
                    }
                ]
            }
        },
        {
            "prop": "receiptorId",
            "label": "状态",
            "sortable": false,
            "editor": {
                "type": "input"
            }
        },
        {
            "prop": "receiptorName",
            "label": "创建时间",
            "sortable": false,
            "editor": {
                "type": "input"
            }
        }
    ]
}