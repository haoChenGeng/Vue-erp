export default [{
    "prop": "bizId",
    "label": "业务类型",
    "list": "businessTypes",
    "required": true,
    "sortable": false,
    "editor": {
        "type": "select",
        "rules": [{
            "required": true,
            "message": "不能为空"
        }]
    }
}, {
    "prop": "receiptRoleId",
    "label": "收款对象",
    "list": "debitObjects",
    "required": true,
    "sortable": false,
    "editor": {
        "type": "select",
        "rules": [{
            "required": true,
            "message": "不能为空"
        }]
    }
}, {
    "prop": "receiptorId",
    "label": "收款对象ID",
    "sortable": false,
    "editor": {
        "type": "input",
        "rules": [{ pattern: /^\d{1,}$/, message: '请输入数字' }]
    }
}, {
    "prop": "receiptorName",
    "label": "收款对象名称",
    "sortable": false,
    "editor": {
        "type": "input"
    }
}, {
    "prop": "receiptTypeId",
    "label": "收款类型",
    "list": "debitTypes",
    "required": true,
    "sortable": false,
    "editor": {
        "type": "select",
        "rules": [{
            "required": true,
            "message": "不能为空"
        }]
    }
}, {
    "prop": "arriveAmount",
    "label": "收款金额",
    "required": true,
    "sortable": false,
    "editor": {
        "type": "input",
        "rules": [{
            "required": true,
            "message": "不能为空"
        },{ pattern: /^((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/, message: '请输入正确金额' }]
    }
}, {
    "prop": "projectId",
    "label": "项目ID",
    "sortable": false,
    "required": true,
    "editor": {
        "type": "input",
        "rules": [{
            "required": true,
            "message": "不能为空"
        },{ pattern: /^\d{1,}$/, message: '请输入数字' }]
    }
}]
