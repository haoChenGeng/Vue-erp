import ZZ from 'src/config/delivery/common-regular-expression.js'
export default {
    "tableDebitType": [
        {
            "prop": "emergencyName",
            "label": "紧急联系人姓名",
            "sortable": false,
            "required": true,
            "editor": {
                "type": "input",
                "rules": [
                    {
                        "required": true,
                        "message": "请填写紧急联系人姓名"
                    },
                    { max: 30, min:1, message: '紧急联系人姓名长度不能超过30个字符'}
                ]
            }
        },
        {
            "prop": "emergencyPhone",
            "label": "紧急联系人电话",
            "sortable": false,
            "required": true,
            "editor": {
                "type": "input",
                "rules": [
                    {
                        "required": true,
                        "message": "请填写紧急联系人电话",
                    },
                    {pattern: ZZ.phone, message: '请输入正确的手机号码'}
                ]
            }
        },
        {
            "prop": "emergencyEmail",
            "label": "邮箱",
            "sortable": false,
            "editor": {
                "type":"input",
                "rules":[
                { max: 30, min:0, message: '邮箱长度不能超过30个字符'},
                {pattern: ZZ.email, message: '请输入正确的邮箱地址'}
                ]
            }
        },
        {
            "prop": "emergencyRelation",
            "label": "与工人关系",
            "sortable": false,
            "list":"relationList",
            "required": true,
            "editor": {
                "type": "select",
                "rules":[{
                    "required" : true,
                    "message":"请选择关系类型"
                }]
            }
        },
        {
            "prop": "createTime",
            "label": "创建时间",
            "sortable": false,
            "formatter": "dateParser" 
        }
    ]
}