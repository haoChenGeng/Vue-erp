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
            "label": "收款对象",
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
            "prop": "receiptorId",
            "label": "收款对象ID",
            "sortable": false,
            "editor": {
                "type": "input"
            }
        },
        {
            "prop": "receiptorName",
            "label": "收款对象名称",
            "sortable": false,
            "editor": {
                "type": "input"
            }
        },
        {
            "prop": "receiptTypeId",
            "label": "收款类型",
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
            "prop": "arriveAmount",
            "label": "收款金额",
            "required": true,
            "sortable": false,
            "editor": {
                "type": "input",
                "rules": [
                    {
                        "required": true,
                        "message": "不能为空"
                    },{ pattern: /^((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/, message: '正数,最多保留两位小数' },
                    { pattern: /^((0|[1-9]\d{0,7})((\.[0-9]{1,2})?))$/, message: '数额整数位不能超过8位数' }
                ]
            }
        },
        {
            "prop": "projectId",
            "label": "项目ID",
            "required": true,
            "sortable": false,
            "editor": {
                "type": "input",
                "rules": [
                    {
                        "required": true,
                        "message": "不能为空"
                    },{ pattern: /^\d{1,}$/, message: '请输入数字' }
                ]
            }
        }
    ],
    "columnsRmv": [
        {
            "prop": "code",
            "label": "核销编号"
        },
        {
            "prop": "verifyAmount",
            "label": "核销金额"
        },
        {
            "prop": "verifyStatus",
            "label": "核销状态",
            "list": "verifyStatus"
        },
        {
            "prop": "verifyName",
            "label": "核销人"
        },
        {
            "prop": "verifyTime",
            "label": "核销日期",
            "formatter": "dateParser"
        },
        {
            "prop": "updateName",
            "label": "修改人"
        },
        {
            "prop": "updateTime",
            "label": "修改日期",
            "formatter": "dateParser"
        },
        {
            "prop": "id",
            "label": "操作",
            "sortable": false
        }
    ],
    "commonDataRmv": {
        "verifyStatus": [
            {
                "text": "未核销",
                "value": 1
            },
            {
                "text": "部分核销",
                "value": 2
            },
            {
                "text": "已核销",
                "value": 3
            },
            {
                "text": "作废",
                "value": 4
            }
        ]
    },
    "operateLog": [
        {
            "prop": "editContent",
            "label": "修改内容"
        },
        {
            "prop": "editTime",
            "label": "修改时间",
            "formatter": "dateParser"
        },
        {
            "prop": "editor",
            "label": "修改人"
        }
    ]
}
