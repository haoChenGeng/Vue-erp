export default {
    "columns1": [{
        "prop": "verifyStatus",
        "label": "核销状态",
        "list": "verifyStatus"
    }, {
        "prop": "code",
        "label": "单据编号"
    }, {
        "prop": "finOrgName",
        "label": "财务组织"
    }, {
        "prop": "bizName",
        "label": "业务类型"
    }, {
        "prop": "receiptRoleName",
        "label": "收款对象"
    }, {
        "prop": "fundPurposeName",
        "label": "款项用途"
    }, {
        "prop": "projectId",
        "label": "项目ID"
    }, {
        "prop": "oughtAmount",
        "label": "应收金额"
    }, {
        "prop": "realAmount",
        "label": "已收金额"
    },{
        "prop": "pendAuditAmount",
        "label": "待核销金额"
    }, {
        "prop": "planMoney",
        "label": "核销金额",
        "editor": {
            "type": "input",
            "rules": [
                {
                    "required": true,
                    "message": "不能为空"
                },
                { pattern: /^(\-?(0|[1-9]\d{0,7})((\.[0-9]{1,2})?))$/, message: '请输入正确金额' }
            ]
        }
    }, {
        "prop": "createName",
        "label": "创建人"
    }, {
        "prop": "createTime",
        "label": "创建时间",
        "formatter": "dateParser"
    }, {
        "prop": "updateName",
        "label": "修改人"
    }, {
        "prop": "updateTime",
        "label": "修改时间",
        "formatter": "dateParser"
    }],


    "columns2": [{
        "prop": "verifyStatus",
        "label": "核销状态",
        "list": "verifyStatus"
    }, {
        "prop": "code",
        "label": "单据编号"
    }, {
        "prop": "receiptOrgName",
        "label": "财务组织"
    }, {
        "prop": "bizName",
        "label": "业务类型"
    }, {
        "prop": "receiptRoleName",
        "label": "收款对象"
    }, {
        "prop": "receiptTypeName",
        "label": "收款类型"
    }, {
        "prop": "projectId",
        "label": "项目ID"
    }, {
        "prop": "arriveAmount",
        "label": "收款金额"
    }, {
        "prop": "verifyAmount",
        "label": "已核销金额"
    }, {
        "prop": "rcvMoney",
        "label": "核销金额",
        "editor": {
            "type": "input",
            "rules": [
                {
                    "required": true,
                    "message": "不能为空"
                },
                { pattern: /^(\-?(0|[1-9]\d{0,7})((\.[0-9]{1,2})?))$/, message: '请输入正确金额' }
            ]
        }
    }, {
        "prop": "createName",
        "label": "创建人"
    }, {
        "prop": "createTime",
        "label": "创建时间",
        "formatter": "dateParser"
    }, {
        "prop": "updateName",
        "label": "修改人"
    }, {
        "prop": "updateTime",
        "label": "修改时间",
        "formatter": "dateParser"
    }]
}
