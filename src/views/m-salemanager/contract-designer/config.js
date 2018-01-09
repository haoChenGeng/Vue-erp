import ServiceApi from 'src/services/dsp-prs-mdm/service.js'
import isIdCard from 'src/utils/isIdCard.js'
export default {

    //三要素字段
    formFields3:[
        {
            prop:'phone',
            label:'业主手机号码',
            type:'input',
            rules: [
                {
                    required: true,
                    message: '请填写业主手机号码'
                },
                {
                    /*香港手机号码正则 ：^([6|9])\d{7}$

                        澳门手机号码正则：^[6]([8|6])\d{5}$

                        大陆：^[1][3-8]\d{9}$
                        正则表达式：^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[6]([8|6])\d{5}$

                        这是规则：

                        大陆：开头1 3-8号码段，后面加9位数字

                        香港：9或6开头后面跟7位数字

                        澳门：66或68开头后面跟5位数字

                        注意：以上表达式只验证港澳台及大陆手机号码，不包含座机小灵通及区号等验证*/
                    pattern: /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[6]([8|6])\d{5}$/,
                    message: '填写的手机号格式错误'
                }

            ]
        },
        {
            prop:'identityCard',
            label:'业主身份证号',
            type:'input',
            rules: [
                {
                    required: true,
                    message: '请填写业主身份证号'
                },
                {
                    validator: function (rule, value, callback, source, options) {

                       /* var taiwanreg=/^[A-Z][0-9]{9}$/;  或者 /^[A-KM-QT-XZ]{1}[0-9]{9}$/
                        var xianggangreg=/^[A-Z][0-9]{6}\([0-9A]\)$/;
                        var aomenreg=/^[157][0-9]{6}\([0-9]\)$/;*/

                        let hongkongCard = new RegExp('^[A-Z]{1,2}[0-9]{6}\\(?[0-9A]\\)?$')
                        if( !(isIdCard(value) || hongkongCard.test(value) ) ){
                            return callback(new Error('填写的身份证号码格式错误'));
                        }
                        callback()
                    }
                }
            ]
        },
        {
            prop:'name',
            label:'业主姓名',
            type:'input',
            rules: [
                {
                    required: true,
                    message: '请填写业主姓名'
                },
                {
                    min:2,
                    max: 20,
                    message:'业主姓名2-20个字',
                }
            ]
        },
        {
            prop:'email',
            label:'业主邮箱',
            type:'input',
            rules: [
                {
                    required: true,
                    message: '请填写业主邮箱'
                },
                {
                    type:'email',
                    required: true,
                    message: '填写的邮箱格式错误'
                },
            ]
        },
    ],
    formFieldsNote3:[
        "请填写签约人的手机号码(如业主需修改手机号码请联系城市负责人）",
        "请确保填写的身份证、姓名、手机号是签约人本人的信息",
        "请填写签约人的姓名",
        "我们将把您填写的信息通过运营商进行核实校验，我们将对您的信息严格保密",
    ],

    //四要素字段
    formFields4:[
        {
            prop:'bankcard',
            label:'业主银行卡号',
            type:'input',
            rules: [
                {
                    required: true,
                    message: '请填写业主银行卡号'
                },
                {
                    pattern: /^\d{16,19}$/,
                    message: '填写的银行卡号格式错误'
                }
            ]
        },
        {
            prop:'phone',
            label:'银行预留手机号码',
            type:'input',
            rules: [
                {
                    required: true,
                    message: '请填写银行预留手机号码'
                },
                {
                    pattern: /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[6]([8|6])\d{5}$/,
                    message: '填写的手机号格式错误'
                }
            ]
        },
        {
            prop:'identityCard',
            label:'业主身份证号',
            type:'input',
            rules: [
                {
                    required: true,
                    message: '请填写业主身份证号'
                },
                {
                    validator: function (rule, value, callback, source, options) {
                        let hongkongCard = new RegExp('^[A-Z]{1,2}[0-9]{6}\\(?[0-9A]\\)?$')
                        if( !(isIdCard(value) || hongkongCard.test(value) ) ){
                            return callback(new Error('填写的身份证号码格式错误'));
                        }
                        callback()
                    }
                }
            ]
        },
        {
            prop:'name',
            label:'业主姓名',
            type:'input',
            rules: [
                {
                    required: true,
                    message: '请填写业主姓名'
                },
                {
                    min:2,
                    max: 20,
                    message:'业主姓名2-20个字',
                }
            ]
        },
        {
            prop:'email',
            label:'业主邮箱',
            type:'input',
            rules: [
                {
                    required: true,
                    message: '请填写业主邮箱'
                },
                {
                    type:'email',
                    required: true,
                    message: '填写的邮箱格式错误'
                },
            ]
        },
    ],
    formFieldsNote4:[
        "请填写签约人的银行卡号",
        "请填写签约人在银行预留的手机号码",
        "请确保填写的身份证、姓名是签约人本人的信息",
        "请填写签约人的姓名",
        "我们将把您填写的信息通过银行进行核实校验，我们将对您的信息严格保密",
    ],

    //合同字段
    formFieldsOrder:[
        {
            prop:'realSignedTime',
            label:'签约时间',
            type:'datetime',
            rules:[{
                type:'date',
                required:true,
                message:'请填写签约时间',
            }]
        },
        {
            prop:'times',
            label:'施工日期',
            type:'daterange',
            rangeSeparator:' 至 ',
            rules:[
                {
                    type:'array',
                    fields:{
                        0:{type:'date', required: true,message:'请填写施工日期',},
                        1:{type:'date', required: true,message:'请填写施工日期',},
                    },
                    required:true,
                    message:'请填写施工日期',
                },
                {
                    type: 'array',
                    'validator': (rule, value, callback, source, options) => {
                        if(new Date(value[0]).getTime() >= new Date(value[1]).getTime()){
                            callback(false)
                        }
                        callback()

                    },
                    message: `结束时间需大于开始时间`
                }
            ]
        },
        /*{
            prop:'endTime',
            label:'施工日期',
            type:'date',
            rules:[{
                required:true,
                message:'请填写施工日期',
            }]
        },*/
        {
            prop:'contractOffer',
            label:'装修总价',
            type:'input',
            rules:[
                {
                    type: 'number',
                    required:true,
                    message:'请填写装修总价',
                    transform:function (val){
                        return +val
                    }
                },
                {
                    type: 'number',
                    'validator': (rule, value, callback, source, options) => {

                        //匹配多于两位的小数
                        var exp = new RegExp('^[0-9]+(\\.\\d{3,})$')

                        if( typeof(value) != 'number' ){
                            callback(false)
                        }
                        //最多精确到两位小数
                        else if(exp.test(+value)){
                            callback(false)
                        }
                        else if( (+value >=500 && +value <= 10000000)){
                            callback()
                        }else{
                            callback(false)
                        }

                    },

                    message: `请输入500-10000000之间的数字，保留两位小数`
                }
            ]
        },
        {
            prop:'decorateType',
            label:'装修类型',
            type:'select',
            list:'decorateType',
            rules:[{
                required:true,
                message:'请选择装修类型',
            }]
        },
        {
            prop:'decoratePattern',
            label:'装修方式',
            type:'select',
            list:'decoratePattern',
            rules:[{
                required:true,
                message:'请选择装修方式',
            }]
        },
        {
            prop:'paymentMode',
            label:'支付方式',
            type:'select',
            list:'paymentMode',
            rules:[{
                required:true,
                message:'请选择支付方式',
            }]
        },
        {
            prop:'contactName',
            label:'公司联系人',
            type:'input',
            rules:[
                {
                    required:true,
                    message:'请填写公司联系人',
                },
                {
                    min:2,
                    max: 20,
                    message:'公司联系人2-20个字',
                }
            ]
        },
        {
            prop:'contactPhone',
            label:'联系人电话',
            type:'input',
            rules:[
                {
                    required:true,
                    message:'请填写联系人电话',
                },
                {
                    //TODO 兼容座机或者不限制
                    pattern: /^1[34578]\d{9}$/,
                    message: '填写的联系人电话格式错误'
                }
            ]
        },
        {
            prop:'contactEmail',
            label:'联系人邮箱',
            type:'input',
            rules: [
                {
                    required: true,
                    message: '请填写联系人邮箱'
                },
                {
                    type:'email',
                    required: true,
                    message: '填写的邮箱格式错误'
                },
            ]
        },
        {
            prop:'moreWaterPlat',
            label:'超水电增项最大比例',
            type:'input',
            append:'%（全包无）',
            rules:[
                {
                    type: 'number',
                    required:true,
                    message:'请填写超水电增项最大比例',
                    transform:function (val){
                        return +val
                    }
                },
                {
                    type: 'number',
                    'validator': (rule, value, callback, source, options) => {

                        //匹配多于两位的小数
                        var exp = new RegExp('^[0-9]+(\\.\\d{3,})$')

                        if( typeof(value) != 'number' ){
                            callback(false)
                        }
                        //最多精确到两位小数
                        else if(exp.test(+value)){
                            callback(false)
                        }
                        else if( (+value >=0 && +value <= 100)){
                            callback()
                        }else{
                            callback(false)
                        }

                    },

                    message: `请输入0-100之间的数字，保留两位小数`
                }
            ]
        },
        {
            prop:'moreOtherPlat',
            label:'超其他增项最大比例',
            type:'input',
            append:'%',
            rules:[
                {
                    type: 'number',
                    required:true,
                    message:'请填写超其他增项最大比例',
                    transform:function (val){
                        return +val
                    }
                },
                {
                    type: 'number',
                    'validator': (rule, value, callback, source, options) => {

                        //匹配多于两位的小数
                        var exp = new RegExp('^[0-9]+(\\.\\d{3,})$')

                        if( typeof(value) != 'number' ){
                            callback(false)
                        }
                        //最多精确到两位小数
                        else if(exp.test(+value)){
                            callback(false)
                        }
                        else if( (+value >=0 && +value <= 100)){
                            callback()
                        }else{
                            callback(false)
                        }

                    },

                    message: `请输入0-100之间的数字，保留两位小数`
                }
            ]
        },
        {
            prop:'townIds',
            label:'装修地址',
            rules:[
                    /*{
                    type:'array',
                    fields:{
                        0:{
                            //type:'string',
                            required:true,
                            message:'请选择省份',
                        },
                        1:{
                            //type:'string',
                            required:true,
                            message:'请选择市',
                        },
                        2:{
                            //type:'string',
                            required:true,
                            message:'请选择区',
                        },
                    },
                    required:true,
                    message:'请选择装修地址',
                },*/
                {
                    required: true,
                    validator: (rule, value, callback) => {
                        if(value.length >= 2) {
                            callback()
                        }else{
                            callback(false)
                        }
                    },
                    message: '请选择装修地址',
                },
            ]

        },
        {
            prop:'estateId',
            name:'estateId',
            label:'楼盘',
            type:'popup',
            readonly: true,
            placeholder:'请选择楼盘',
            textValue: 'sname',  //需要展示出来的名称
            filedValue: 'id',    //选中那条数据的ID
            defaultValue: {
                filedValue: '',
                textValue: ''
            },
            dialog:{
                title: "查找楼盘",
                size: 'large',
                //自动补全
                remote: false,
                service: ServiceApi.name,
                method: ServiceApi.methods.queryEstatePage,
                remoteQueryKey: "estateName",
                remoteArgs: {
                    page: 1,
                    size: 10
                },
                searchForm: {
                    fields: [{
                        type: 'input',
                        label: '楼盘名',
                        name: 'estateName',
                        placeholder:'请先按楼盘名搜索',
                    }],
                    resetBtnVisible: true,
                    showToggleBtn: false
                },
                table: {
                    //表格
                    columns: [{
                        prop: 'sname',
                        label: '楼盘名'
                    }],
                    commonData: {

                    },
                    //请求参数配置
                    service: ServiceApi.name,
                    method: ServiceApi.methods.queryEstatePage,
                    args: {},
                    radioCol: true,
                    preLoad:false,
                    selectable: function(row) {
                        return true
                    }
                },
                onBeforeConfirm: function(rows) {
                    let row = rows[0]
                    return true
                }
            },
            rules:[
                {
                    required:true,
                    validator: (rule, value, callback) => {
                        if(value != '') {
                            callback()
                        }else{
                            callback(false)
                        }
                    },
                    message:'请选择楼盘',
                },

            ]
        },
        {
            prop:'houseAddr',
            label:'详细地址',
            type:'input',
            placeholder:'请填写详细地址（欢乐小区1栋3单元404）',
            rules:[
                {
                    required:true,
                    message:'请填写详细地址',
                },
                {
                    min:2,
                    max: 30,
                    message:'详细地址2-30个字',
                }
            ]
        },
        {
            prop:'orderImg',
            autoWidth:true,
            label:'合同照片',
            rules:[{
                type:'array',
                fields:{
                    "cover":{type:'string',required:true,message:'请上传合同封面'},
                    "first":{type:'string',required:true,message:'请上传合同第一页'},
                    "last":{type:'string',required:true,message:'请上传合同最后一页'}
                },
                required:true,
                message:'请上传合同照片',
            }]
        },
        {
            prop:'pqmImg',
            autoWidth:true,
            label:'报价单',
            rules:[{
                required:true,
                message:'请上传报价单附件',
            }]
        }
    ],
    //合同状态1-暂存 2-待签 3-已签 4-作废 5-终止
    contractStatus:[
        {text:'未签',value:0},
        {text:'待签',value:1},//'暂存' 文本展示为 '待签'
        {text:'待签',value:2},
        {text:'已签',value:3},
        {text:'作废',value:4},
        {text:'终止',value:5}
    ],
    //项目状态
    orderStatus:[
        //项目子状态状态，量房成功及之后的.数据来源：供应链=辅助资料=装修公司=项目状态
        {value:"8100303", text: "量房成功"},
        {value:"8100304", text: "已死单"},
        {value:"8100601", text: "提交中标"},
        {value:"8100602", text: "签约成功"},
        {value:"8100701", text: "已开工"},
        {value:"8100702", text: "材料验收成功"},
        {value:"8100703", text: "水电验收成功"},
        {value:"8100704", text: "中期（泥木）"},
        {value:"8100705", text: "油漆验收成功"},
        {value:"8100801", text: "竣工验收成功"},
        {value:"8100802", text: "已财务竣工"}
    ]
}
