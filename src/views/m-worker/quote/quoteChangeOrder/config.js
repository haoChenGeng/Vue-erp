/**
 * 变更单
 * Created by tomy.li on 2017/9/12.
 */
let config = {
    datas:{
        //水电增项状态：0.待确认；1.已确认: 2.装修公司申请：3.业主驳回
        statusConfirms: [
            {
                'text': '待确认',
                'value': 0
            },
            {
                'text': '已确认',
                'value': 1
            },
            {
                'text': '装修公司申请',
                'value': 2
            },
            {
                'text': '业主驳回',
                'value': 3
            },
        ],
        //变更单状态 0-完成初稿 1-审核中 2-审核驳回 3-报价已出 4-核算中 5-核算驳回 6-报价完成
        order_status: [
            {
                'text': '完成初稿',
                'value': 0
            },
            {
                'text': '审核中',
                'value': 1
            },
            {
                'text': '审核驳回',
                'value': 2
            },
            {
                'text': '报价已出',
                'value': 3
            },
            {
                'text': '核算中',
                'value': 4
            },
            {
                'text': '核算驳回',
                'value': 5
            },
            {
                'text': '报价完成',
                'value': 6
            },
            {
                'text': '已签约',
                'value': 7
            },
            {
                'text': '作废',
                'value': 8
            },
        ],
        addOrSubItemTypes:[
            {
                'text': '增项',
                'value': 1
            },
            {
                'text': '减项',
                'value': 2
            },
        ]
    },
    formFields:[
        {
            prop: 'sourceProjectId',
            label: '原项目ID',
            type: 'input',
            disabled:true
        },
        {
            prop: 'projectAddress',
            label: '项目地址',
            type: 'input',
            disabled:true
        },
        {
            prop: 'ownerName',
            label: '业主姓名',
            type: 'input',
            disabled:true
        },
        {
            prop: 'houseTypeName',
            label: '户型',
            type: 'input',
            disabled:true,
        },
        {
            prop: 'lbfy',
            label: '水电增项金额',
            type: 'input',
            disabled:true
        },
        {
            prop: 'realSignedTime',
            label: '签约时间',
            type: 'input',
            disabled:true
        },
        {
            prop: 'statusConfirm',
            label: '水电增项状态',
            type: 'select',
            list: 'statusConfirms',
            disabled: true
        },
    ],
    mainTableColumns:[
        {
            prop: 'orderSpaceId',
            label: '使用空间',
            resizable:false,
            required: true,
            list:'spaces',
        },
        {
            prop: 'placeId',
            label: '位置',
            resizable:false,
            list:'places',
        },
        {
            prop: 'qiName',
            label: '报价项名称',
            resizable:false
        },
        {
            prop: 'amount',
            label: '数量',
            resizable:false,
        },
        {
            prop: 'qiUnit',
            label: '单位',
            resizable:false
        },
        {
            prop: 'price',
            label: '单价',
            resizable:false
        },
        {
            prop: 'lbfy',
            label: '金额',
            resizable:false,
            required:true,
            trigger:'blur',
            editor: {
                type:'input',
                rules:
                    function(val, row , col, tab){
                        //匹配整数
                        let exp = new RegExp('^[0-9]+$')
                        let upperLimit = row.upperLimit || 1000000
                        debugger

                        let includeLowerLimitWord = 0
                        let includeUpperLimitWord = upperLimit
                        return [
                            {
                                type:'number',
                                'validator': (rule, value, callback, source, options) => {

                                    if(!exp.test(+value)){
                                        callback(false)
                                    }
                                    else if(+value < 0){
                                        callback(false)
                                    }
                                    else if( (+value >=includeLowerLimitWord && +value <= includeUpperLimitWord) || +value === 0){
                                        callback()
                                    }else{
                                        callback(false)
                                    }
                                },
                                message: `请输入${includeLowerLimitWord}-${includeUpperLimitWord}之间的整数`,
                                transform (val) {
                                    return +val
                                },
                                trigger:'blur'
                            },
                            {type:'number',message:'必须为数值', trigger:'blur'},
                        ]
                    },
            },
        },
        {
            prop: 'addOrSubItemType',
            label: '增减',
            resizable:false,
            list:'addOrSubItemTypes'
        },
        {
            prop: 'craftDetails',
            label: '工艺详情',
            "align": 'left',
            resizable:false
        },
    ],

    //汇总面板列
    summaryColumns:[
        {
            prop: 'spaceName',
            label: '使用空间',
            resizable:false
        },
        {
            prop: 'placeName',
            label: '位置',
            resizable:false
        },
        {
            prop: 'qiName',
            label: '报价项名称',
            resizable:false
        },
        {
            prop: 'amount',
            label: '数量',
            resizable:false,
        },
        {
            prop: 'qiUnit',
            label: '单位',
            resizable:false
        },
        {
            prop: 'price',
            label: '单价',
            resizable:false
        },
        {
            prop: 'totalMoney',
            label: '金额',
            resizable:false
        },
        {
            prop: 'addOrSubItem',
            label: '增减',
            resizable:false
        },
        {
            prop: 'craftDetails',
            label: '工艺详情',
            "align": 'left',
            resizable:false
        },
    ],

    //添加增项的列
    addPlusItemColumns:[
        {
            prop:'qiName',
            label:'报价项名'
        },
        {
            prop:'qiUnit',
            label:'单位'
        },
        {
            prop:'price',
            label:'单价'
        },
        {
            prop:'craftDetails',
            label:'工艺详情'
        },
    ],

    //添加增项弹框表单的搜索字段
    addPlusItemFormFields:[
        {
            name: 'qiCode',
            placeholder: '报价项编码',
            type: 'input',
        },
        {
            name: 'qiName',
            placeholder: '报价项名称',
            type: 'input',
        },
        {
            name: 'craftDetails',
            placeholder: '工艺详情关键字',
            type: 'input',
        },
    ],

    //添加减项的列
    addSubItemColumns:[],
    //添加减项弹框表单的搜索字段
    addSubItemFormFields:[
        {
            name: 'qiName',
            placeholder: '报价项名称',
            type: 'input',
        },
        {
            name: 'orderSpaceId',
            placeholder: '空间',
            type: 'select',
            selectSourceKey:'spaces'
        },
        {
            name: 'placeId',
            placeholder: '位置',
            type: 'select',
            selectSourceKey:'places'
        },
    ],

}

export default config
