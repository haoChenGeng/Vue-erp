export default {
    "indexField":[
        {"type": 'input',"label": '项目ID',"name": 'projectId_like'},
        {"type": 'input',"label": '测量人',"name": 'measurer'},
        {"type": 'input',"label": '工长',"name": 'workerName'},
        {"type": "date","label": "预计测量时间自","name": "planMeasureTime_gte"},
        {"type": "date","label": "预计测量时间至","name": "planMeasureTime_lte"},
        {"type": 'select',"label": '单据状态',"name": 'orderStatus',"selectSourceKey":'orderStatusOption'},
        {"type": "date","label": "实际测量时间自","name": "realMeasureTime_gte"},
        {"type": "date","label": "实际测量时间至","name": "realMeasureTime_lte"},
        {"type": 'select',"label": '测量人类型',"name": 'measurerType',"selectSourceKey":'measurerTypeOption'},
        {"type": "date","label": "创建日期自","name": "createTime_gte"},
        {"type": "date","label": "创建日期至","name": "createTime_lte"}
    ],
    "indexTable" : [
        { "prop": "billCode", "label": "测量单号" },
        { "prop": "projectId", "label": "项目ID" },
        { "prop": "measurer", "label": "测量人员" },
        { "prop": "ownerName", "label": "业主姓名" },
        { "prop": "workerName", "label": "工长姓名" },
        { "prop": "detailAddress", "label": "详细地址" },
        { "prop": "orderStatus", "label": "单据状态" , "list":"orderStatusOption"},
        { "prop": "rejectReason", "label": "驳回原因"},
        { "prop": "planMeasureTime", "label": "预计测量时间", "formatter": 'dateParser'},
        { "prop": "realMeasureTime", "label": "实际测量时间", "formatter": 'dateParser'},
        { "prop": "createTime", "label": "创建日期", "formatter": 'dateParser'}
    ],
    lineHeadTable: [
        { "prop": "goodsCode", "label": "商品编码","width":120},
        { "prop": "goodsName", "label": "商品名称","width":100},
        { "prop": "usedSpaceName", "label": "使用空间","width":80},
        { "prop": "brand", "label": "品牌","width":80},
        { "prop": "standard", "label": "商品规格","width":80},
        { "prop": "model", "label": "商品型号","width":80},
        { "prop": "color", "label": "颜色","width":80},
        { "prop": "basicUnit", "label": "单位","width":80},
        { "prop": "measureDosage", "label": "用量","required": true,"width":100,"sortable":false,
            "editor":   {
                        "type": "number",
                        "controls": false,
                        "rules": [
                            {
                                "type": "number",
                                "required": true,
                                "message": "用量的格式不正确",
                                min:0.00000001,
                                max:99999999.999999
                            },
                            {pattern: /^\d{0,8}(\.\d{1,8})?$/, message: '用量的格式不正确'}
                            ]
                        }
        },
        { "prop": "remark","label": "测量备注","sortable":false,"editor": {"type": "input"}}
    ],
    lineItemTable:[
        { "prop": "accessoryCode", "label": "配件编码",readonly:true},
        { "prop": "accessoryName", "label": "配件名称",readonly:true},
        { "prop": "basicUnitName", "label": "单位","width":120,readonly:true},
        { "prop": "chooseType", "label": "是否选用","required": true,"sortable":false,"list": "selectedOption","editor": 
            {
                "type": "select",
                "rules":[
                    { "type": "number", "required": true, "message": "请选择是否可用"}
                ]
            },"width":100},
        { "prop": "dosage", "label": "用量","required": true,"sortable":false,"editor":
         {
            "type": "input",
            "rules":[
                    {"required": true, "message": "请填写用量"},
                    {pattern: /^\d{0,9}(\.\d{1,2})?$/, message: '用量的格式不正确'}
                ]
            }
        }
    ],
    detailTable:[
        { "prop": "goodsCode", "label": "商品编码","width":200},
        { "prop": "goodsName", "label": "商品名称","width":200},
        { "prop": "usedSpaceName", "label": "使用空间","width":100},
        { "prop": "usedPlaceName", "label": "使用位置","width":180 },
        { "prop": "basicUnit", "label": "单位","width":100},
        { "prop": "measureDosage", "label": "测量用量","width":100,"formatter":function (val) {if(val == 0 || val == 'undefined'){return '未提交'}return val}},
        { "prop": "remark", "label": "备注"}
    ]
}
