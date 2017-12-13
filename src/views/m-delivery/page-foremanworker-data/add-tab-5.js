export default {
    "tableDebitType": [
        {
            "prop": "bankId",
            "label": "开户银行",
            "list": "bankList",
            "required": true,
            "sortable": false,
            "editor": {
                "type": "select",
                "filterable":true,
                "rules": [
                    {
                        "required": true,
                        "message": "不能为空"
                    }
                ]
            }
        },
        {
            "prop": "bankBranchName",
            "label": "开户支行",
            "required": true,
            "sortable": false,
            "editor": {
                "type": "input",
                "rules": [
                    {
                        "required": true,
                        "message": "不能为空"
                    },
                    { max: 20, min:1, message: '开户支行长度不能超过20个字符'}
                ]
            }
        },
        {
            "prop": "openingAccountName",
            "label": "银行开户名",
            "sortable": false,
            "required": true,
            "editor": {
                "type": "input",
                 "rules": [
                    {
                        "required": true,
                        "message": "不能为空"
                    },
                    { max: 20, min:1, message: '银行开户名长度不能超过20个字符'}
                ]
            }
        },
        {
            "prop": "bankAccount",
            "label": "银行卡号",
            "sortable": false,
            "required": true,
            "editor": {
                "type": "input",
                "rules": [
                    {
                        "required": true,
                        "message": "不能为空"
                    },
                    { pattern: /^\d{16,20}$/, message: '银行卡号格式错误'}
                ]
            }
        },
        {
            "prop": "provinceCode",
            "label": "开户省",
            "list": "provinces",
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
            "prop": "cityCode",
            "label": "开户市",
            "required": true,
            "list":"cities",
            "sortable": false,
            "editor": {
                "type": "select",
                "list": "_cities",
                "rules": [
                    {
                        "required": true,
                        "message": "不能为空"
                    }
                ]
            }
        },
        {
            "prop": "status",
            "label": "状态",
            "list": "statusList",
            "sortable": false,
        },
        {
            "prop": "isDefault",
            "label": "是否默认卡",
            "list": "isDefaultList",
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
            "prop": "voucher",
            "label": "凭证附件",
            "required": true,
            "sortable": false,
             "editor": {
                "readonly":true,
                "type": "input",
                "rules": [
                    {
                        "required": true,
                        "message": "凭证附件不能为空"
                    }
                ]
            }
        },
        {
            "prop": "createName",
            "label": "创建人",
            "sortable": false
        },
        {
            "prop": "createTime",
            "label": "创建时间",
            "sortable": false,
            "formatter": "dateParser"
        }
    ]
}