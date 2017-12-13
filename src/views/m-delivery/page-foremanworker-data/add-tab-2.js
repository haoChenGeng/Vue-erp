export default {
    "tableDebitType": [
        {
            "prop": "bizType",
            "label": "业务类型",
            "list": "businessTypes",
            "required": true,
            "sortable": false,
            "editor": {
                "type": "select",
                "rules": [
                    {
                        "required": true,
                        "message": "请选择业务类型"
                    }
                ]
            }
        },
        {
            "prop": "projectManagerId",
            "label": "所属项目经理",
            "required": true,
             "editor": {
                "type": "select",
                "list": "debitObjects",
                "rules": [
                    {
                        "required": true,
                        "message": "请选择所属项目经理"
                    }
                ]
            },
            formatter(val, row, col, table){
                var obj = null
                table.commonData.debitObjects.forEach((item) =>{
                        if(item.value == val){
                            obj = item
                        }
                })
              if(obj){
                  return obj.text
              }
              return  row.projectManagerName
            }
        },
        {
            "prop": "workType",
            "label": "工种",
            "list": "debitTypes",
            "required": true,
            "sortable": false,
            "editor": {
                "type": "select",
                "rules": [
                    {
                        "required": true,
                        "message": "请选择工种"
                    }
                ]
            }
        },
        {
            "prop": "dataStatus",
            "label": "状态",
            "list": "statusList",
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