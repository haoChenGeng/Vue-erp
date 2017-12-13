import Cookie from 'js-cookie'
import supplyService from 'src/services/supply/Service.js'
import DateUtils from 'src/utils/DateUtils.js'

//列表页面表单列名
export const queryPageColumns = [
    {
        prop: "code",
        label: "单据编号",
    },
    {
        prop: "invoiceNo",
        label: "发票号"
    },
    {
        prop: "invoiceType",
        label: "发票类型",
        list:"invoiceType"
    },
    {
        prop: "bizPurpose",
        label: "业务用途",
        list: "bizPurpose"
    },
    {
        prop: "invoiceTime",
        label: "发票日期",
        formatter: function(val){
            return val == 0 ? '' : DateUtils(val * 1000, "yyyy-mm-dd")
        }
    },
    {
        prop: "recordTime",
        label: "记账日期",
        formatter: function(val){
            return val == 0 ? '' : DateUtils(val * 1000, "yyyy-mm-dd")
        }
    },
    {
        prop: "orgName",
        label: "财务组织"
    },
    {
        prop: "shopName",
        label: "供应商名称"
    },
    {
        prop: "totalTaxAmount",
        label: "价税合计"
    },
    {
        prop: "orderStatus",
        label: "单据状态",
        list: "orderStatus"
    },
    {
        prop: "verifyStatus",
        label: "核销状态",
        list: "verifyStatus"
    },
    {
        prop: "verifyCount",
        label: "已核销数量"
    },
    {
        prop: "verifyAmount",
        label: "已核销金额"
    },
    {
        prop: "recordStatus",
        label: "传K3状态",
        list: "recordStatus"
    },
    {
        prop: "colorType",
        label: "红蓝字",
        list: "colorType"
    },
    {
        prop: "k3No",
        label: "K3单据编码"
    },
    {
        prop: "createTime",
        label: "创建日期",
        formatter: "dateParser"
    },
    {
        prop: "createName",
        label: "创建人"
    }
];

//所有下拉菜单静态配置项
export const  selectSource = {
    orderStatus:[
        {
            text: '暂存',
            value: 1
        },
        {
            text: '审核中',
            value: 2
        },
        {
            text: '已审核',
            value: 3
        },
        {
            text: '已作废',
            value: 4
        }
    ],
    verifyStatus:[
        {
            text: '未核销',
            value: 1
        },
        {
            text: '部分核销',
            value: 2
        },
        {
            text: '已核销',
            value: 3
        }
    ],
    recordStatus:[
        {
            text: '未传',
            value: 1
        },
        {
            text: '已传',
            value: 2
        }
    ],
    bizPurpose:[
        {
            text: '材料费',
            value: 1
        },
        {
            text: '服务费',
            value: 2
        }
    ],
    invoiceType:[
        {
            text: '增值税专用发票',
            value: 1
        },
        {
            text: '普通发票',
            value: 2
        }
    ],
    colorType:[
        {
            text: '蓝字',
            value: 1
        },
        {
            text: '红字',
            value: 2
        }
    ]
};

//手动新增表单列名
export const createColumnsBak = [
    {
        type:"index",
        label:"行号",
        summaryType: () => "合计"
    },
    {
        prop: "goodsSku",
        label: "商品SKU",
        sortable: false,
        required: true,
        editor: {
            rules:[{
                type:"string",
                required: true,
                message: "请选择商品",
            }],
            type: "lookup",
            service:supplyService.SUPPLY.name,
            method:supplyService.SUPPLY.methods.GOODS_QUERY_PAGE,
            'columns': [
                {
                    'prop': 'skuId',
                    'label': '商品SKUID'
                },
                {
                    'prop': 'goodsCode',
                    'label': '商品编码'
                },
                {
                    'prop': 'goodsName',
                    'label': '商品名称'
                },
                {
                    'prop': 'model',
                    'label': '型号'
                },
                {
                    'prop': 'standard',
                    'label': '规格'
                },
                {
                    'prop': 'basicUnitName',
                    'label': '基本单位'
                },
                {
                    'prop': 'taxRate',
                    'label': '税率',
                    'formatter': function(val){
                        return val * 100 + '%'
                    }
                },
            ],
            'filterMethod': function (val, args) {
                args['search'] = {
                    'goodsCode': val,
                }
                return args
            },
        }
    },
    {
        prop: "goodsCode",
        label: "商品编码",
        sortable: false,
        required: true,
        editor: {
            rules:[{
                type:"string",
                required: true,
                message: "请选择商品",
            }],
            type: "lookup",
            service:supplyService.SUPPLY.name,
            method:supplyService.SUPPLY.methods.GOODS_QUERY_PAGE,
            'columns': [
                {
                    'prop': 'skuId',
                    'label': '商品SKUID'
                },
                {
                    'prop': 'goodsCode',
                    'label': '商品编码'
                },
                {
                    'prop': 'goodsName',
                    'label': '商品名称'
                },
                {
                    'prop': 'model',
                    'label': '型号'
                },
                {
                    'prop': 'standard',
                    'label': '规格'
                },
                {
                    'prop': 'basicUnitName',
                    'label': '基本单位'
                },
                {
                    'prop': 'taxRate',
                    'label': '税率',
                    'formatter': function(val){
                        return val * 100 + '%'
                    }
                },
            ],
            'filterMethod': function (val, args) {
                args['search'] = {
                    'goodsCode': val,
                }
                return args
            },
        }
    },
    {
        prop: "goodsName",
        label: "商品名称",
        sortable: false,
        required: true,
        editor: {
            type: "lookup",
            service:supplyService.SUPPLY.name,
            method:supplyService.SUPPLY.methods.GOODS_QUERY_PAGE,
            'columns': [
                {
                    'prop': 'skuId',
                    'label': '商品SKUID'
                },
                {
                    'prop': 'goodsCode',
                    'label': '商品编码'
                },
                {
                    'prop': 'goodsName',
                    'label': '商品名称'
                },
                {
                    'prop': 'model',
                    'label': '型号'
                },
                {
                    'prop': 'standard',
                    'label': '规格'
                },
                {
                    'prop': 'basicUnitName',
                    'label': '基本单位'
                },
                {
                    'prop': 'taxRate',
                    'label': '税率',
                    'formatter': function(val){
                        return val * 100 + '%'
                    }
                },
            ],
            'filterMethod': function (val, args) {
                args['search'] = {
                    'goodsName': val,
                }
                return args
            },
        }
    },
    {
        prop: "baseUnitName",
        label: "基本单位",
        sortable: false,
    },
    {
        prop: "taxRate",
        label: "税率（%）",
        required: true,
        sortable: false,
        formatter: function(val){
            return parseFloat(val) + '%';
        },
        editor: {
            type: "input",
            rules:[{
                type:"integer",
                required: true,
                message: "请录入1-100的整数",
                min:1,
                max:100
                }
            ]
        }
    },
    {
        prop: "invoiceCount",
        label: "数量",
        required: true,
        sortable: false,
        editor: {
            type: "input",
            rules:[{
                type:"number",
                required: true,
                message: "请录入0.01-9999999之间的数值",
                max:9999999,
                min:0.01
            },
                {
                    pattern: /^((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/, message: '请输入两位小数'
                }
            ]
        },
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
    },
    {
        prop: "taxPrice",
        label: "含税单价",
        required: true,
        sortable: false,
        editor: {
            type: "input",
            rules:[{
                type:"number",
                required: true,
                message: "请输入0.01到9999999的数字",
                max:9999999,
                min:0.01
            },
                {
                    pattern: /^((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/, message: '请输入两位小数'
                }
            ]
        },
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
    },
    {
        prop: "noTaxPrice",
        label: "不含税单价",
        sortable: false
    },
    {
        prop: "noTaxAmount",
        label: "不含税金额",
        required: true,
        sortable: false,
        summaryType: function (data, prop) {
            let sum = 0.00;
            data.forEach((row) => {
                sum += parseFloat(row[prop]);
            });
            return parseFloat(sum).toFixed(2);
        },
    },
    {
        prop: "taxDiff",
        label: "税额",
        sortable: false,
        summaryType: function (data, prop) {
            let sum = 0.00;
            data.forEach((row) => {
                sum += parseFloat(row[prop]);
            });
            return parseFloat(sum).toFixed(2);
        },
    },
    {
        prop: "taxAmount",
        label: "含税金额",
        sortable: false,
        summaryType: function (data, prop) {
            let sum = 0.00;
            data.forEach((row) => {
                sum += parseFloat(row[prop]);
            });
            return parseFloat(sum).toFixed(2);
        },
    }
];

//修改详情页面表单列名
export const  autoCreateColumns = [
    {
        type:"index",
        label:"行号",
        summaryType: () => "合计"
    },
    {
        prop: "goodsSku",
        label: "商品SKU",
        sortable: false,
    },
    {
        prop: "goodsCode",
        label: "商品编码",
        sortable: false,
    },
    {
        prop: "goodsName",
        label: "商品名称",
        sortable: false,
    },
    {
        prop: "baseUnitName",
        label: "基本单位",
        sortable: false,
    },
    {
        prop: "taxRate",
        label: "税率（%）",
        required: true,
        sortable: false,
        formatter: function(val){
            return parseFloat(val) + '%';
        },
        editor: {
            type: "input",
            rules:[{
                type:"integer",
                required: true,
                message: "请录入0-100的整数",
                min:0,
                max:100
            }
            ]
        }
    },
    {
        prop: "invoiceCount",
        label: "数量"
    },
    {
        prop: "taxPrice",
        label: "含税单价",
        required: true,
        sortable: false,
        editor: {
            type: "input",
            rules:[{
                type:"number",
                required: true,
                message: "请输入0.01到9999999的数字",
                max:9999999,
                min:0.01
                }
            ]
        },
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
    },
    {
        prop: "noTaxPrice",
        label: "不含税单价",
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
    },
    {
        prop: "noTaxAmount",
        label: "不含税金额",
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
        summaryType: function (data, prop) {
            let sum = 0.00;
            data.forEach((row) => {
                sum += parseFloat(row[prop]);
            });
            return parseFloat(sum).toFixed(2);
        },
    },
    {
        prop: "taxDiff",
        label: "税额",
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
        summaryType: function (data, prop) {
            let sum = 0.00;
            data.forEach((row) => {
                sum += parseFloat(row[prop]);
            });
            return parseFloat(sum).toFixed(2);
        },
    },
    {
        prop: "taxAmount",
        label: "含税金额",
        sortable: false,
        editor: {
            type: "input",
            rules:[{
                type:"number",
                required: true,
                message: "请输入-9999999.99到99999999.99的数字",
                max:99999999.99,
                min:-9999999.99
                },
                {
                    pattern: /^[+-]?((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/,
                    message: '请保留两位小数'
                }
            ]
        },
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
        summaryType: function (data, prop) {
            let sum = 0.00;
            data.forEach((row) => {
                sum += parseFloat(row[prop]);
            });
            return parseFloat(sum).toFixed(2);
        },
    },
    {
        prop: "taxSharePrice",
        label: "对账单含税单价（平摊单价）",
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
    },
    {
        prop: "shouldSettleAmount",
        label: "对账单应结金额",
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
        summaryType: function (data, prop) {
            let sum = 0.00;
            data.forEach((row) => {
                sum += parseFloat(row[prop]);
            });
            return parseFloat(sum).toFixed(2);
        },
    },
    {
        prop: "reconAdjustAmount",
        label: "对账单调整金额（不含税）",
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
        summaryType: function (data, prop) {
            let sum = 0.00;
            data.forEach((row) => {
                sum += parseFloat(row[prop]);
            });
            return parseFloat(sum).toFixed(2);
        },
    },
    {
        prop: "invoiceAdjustAmount",
        label: "发票调整金额（不含税）",
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
        summaryType: function (data, prop) {
            let sum = 0.00;
            data.forEach((row) => {
                sum += parseFloat(row[prop]);
            });
            return parseFloat(sum).toFixed(2);
        },
    }
];

//详情页面单头验证规则
export const detailFormRules = {
    orgId: [
        {
            required: true,
            message: '请选择财务组织'
        }
    ],
    invoiceNo: [
        {
            required: true,
            message: '请填写发票号'
        },
        {
            pattern: /^[0-9,]+$/,
            message: '请输入数字及英文逗号'
        }
    ],
    invoiceType: [
        {
            required: true,
            message: '请填写发票类型'
        }
    ],
    shopId:[
        {
            required: true,
            message: '请选择供应商'
        }
    ],
    invoiceTime: [
        {
            required: true,
            message: '请填写发票日期'
        }
    ],
    recordTime: [
        {
            required: true,
            message: '请填写记账日期'
        }
    ],

    bizPurpose: [
        {
            required: true,
            message: '请填写业务用途'
        }
    ],
}

//参照对账单新增搜索页面表单列名
export const autoCreateSearchColumns = [
    {
        prop: "code",
        label: "对账单单据编码",
    },
    {
        prop: "supplierName",
        label: "供应商名称"
    },
    {
        prop: "settleOrgName",
        label: "结算组织"
    },
    {
        prop: "reconciliationStartTime",
        label: "对账时间",
        width:300,
        formatter: function(val,row){
            return DateUtils(row.reconciliationStartTime * 1000, "yyyy-mm-dd HH:MM:ss") + '-' + DateUtils(row.reconciliationEndTime * 1000, "yyyy-mm-dd HH:MM:ss")
        }
    },
    {
        prop: "shouldSettleAmount",
        label: "应结金额"
    },
    {
        prop: "verifyStatus",
        label: "数据状态",
        list: "verifyStatus"
    },
    {
        prop: "settleStatus",
        label: "结算状态",
        list: "settleStatus"
    },
    {
        prop: "createTime",
        label: "创建日期",
        formatter: "dateParser"
    }
];

//所有下拉菜单静态配置项
export const  reconciliationSelectSource = {
    verifyStatus:[
        {
            text: '',
            value: 0
        },
        {
            text: '暂存',
            value: 1
        },
        {
            text: '待商家审核',
            value: 2
        },
        {
            text: '商家驳回',
            value: 3
        },
        {
            text: '审核中',
            value: 4
        },
        {
            text: '重新审核',
            value: 5
        },
        {
            text: '已审核',
            value: 6
        },
        {
            text: '已关闭',
            value: 7
        }
    ],
    settleStatus:[
        {
            text: '',
            value: 0
        },
        {
            text: '待结算',
            value: 1
        },
        {
            text: '结算中',
            value: 2
        },
        {
            text: '已结算',
            value: 3
        }
    ],
    orgOptions:[]
};


//核销页面（上面table）
export const writeOffTopColumns = [
    {
        type:"index",
        label:"行号",
        summaryType: () => "合计"
    },
    {
        prop: "goodsSku",
        label: "商品SKU",
        sortable: false,
    },
    {
        prop: "goodsCode",
        label: "商品编码",
        sortable: false,
    },
    {
        prop: "goodsName",
        label: "商品名称",
        sortable: false,
    },
    {
        prop: "thisVerifyCount",
        label: "本次核销数量",
        sortable: false,
        editor: {
            type: "input",
            rules:[{
                type:"number",
                required: true,
                message: "请输入-9999999.99到99999999.99的数字",
                max:99999999.99,
                min:-9999999.99
            },
                {
                    pattern: /^[+-]?((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/, message: '请输入两位小数'
                }
            ]
        }
    },
    {
        prop: "thisVerifyAmount",
        label: "本次核销金额",
        required: true,
        sortable: false,
        formatter: function(val,row){
            if(Number.isNaN(parseFloat(row.thisVerifyCount))) {
                return 0.00;
            }
            return parseFloat(parseFloat(row.thisVerifyCount) * parseFloat(row.taxPrice)).toFixed(2);
        },
    },
    {
        prop: "pendVerifyCount",
        label: "未核销数量",
        required: true,
        sortable: false,
    },
    {
        prop: "pendVerifyAmount",
        label: "未核销金额",
        required: true,
        sortable: false,
        formatter: function(val,row){
            return parseFloat(parseFloat(row.pendVerifyCount) * parseFloat(row.taxPrice)).toFixed(2);
        },
    },
    {
        prop: "invoiceType",
        label: "发票类型",
        list: "invoiceType"
    },
    {
        prop: "baseUnitName",
        label: "基本单位",
        required: true,
        sortable: false
    },
    {
        prop: "invoiceCount",
        label: "数量",
        required: true,
        sortable: false
    },
    {
        prop: "taxPrice",
        label: "含税单价",
        required: true,
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        }
    },
    {
        prop: "noTaxPrice",
        label: "不含税单价",
        required: true,
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        }
    },
    {
        prop: "taxDiff",
        label: "税额",
        required: true,
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
        summaryType: function (data, prop) {
            let sum = 0.00;
            data.forEach((row) => {
                sum += parseFloat(row[prop]);
            });
            return parseFloat(sum).toFixed(2);
        }
    },
    {
        prop: "taxAmount",
        label: "含税金额",
        required: true,
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
        summaryType: function (data, prop) {
            let sum = 0.00;
            data.forEach((row) => {
                sum += parseFloat(row[prop]);
            });
            return parseFloat(sum).toFixed(2);
        }
    },
    {
        prop: "noTaxAmount",
        label: "不含税金额",
        required: true,
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
        summaryType: function (data, prop) {
            let sum = 0.00;
            data.forEach((row) => {
                sum += parseFloat(row[prop]);
            });
            return parseFloat(sum).toFixed(2);
        }
    },
    {
        prop: "invoiceTime",
        label: "发票日期",
        required: true,
        formatter: function(val){
            return val == 0 ? '' : DateUtils(val * 1000, "yyyy-mm-dd")
        }
    },
    {
        prop: "recordTime",
        label: "记账日期",
        required: true,
        formatter: function(val){
            return val == 0 ? '' : DateUtils(val * 1000, "yyyy-mm-dd")
        }
    }
];

//核销页面（下面table）
export const writeOffBottomColumns = [
    {
        type:"index",
        label:"行号",
        summaryType: () => "合计"
    },
    {
        prop: "goodsSku",
        label: "商品SKU",
        sortable: false,
    },
    {
        prop: "goodsCode",
        label: "商品编码",
        sortable: false,
    },
    {
        prop: "goodsName",
        label: "商品名称",
        sortable: false,
    },
    {
        prop: "thisVerifyCount",
        label: "本次核销数量",
        sortable: false,
        editor: {
            type: "input",
            rules:[
                {
                type:"number",
                required: true,
                message: "请输入-9999999.99到99999999.99的数字",
                max:99999999.99,
                min:-9999999.99
                },
                {
                    pattern: /^[+-]?((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/, message: '请输入两位小数'
                }
            ]
        }
    },
    {
        prop: "thisVerifyAmount",
        label: "本次核销金额",
        required: true,
        sortable: false,
        formatter: function(val,row){
            if(Number.isNaN(parseFloat(row.thisVerifyCount))) {
                return 0.00;
            }
            return parseFloat(parseFloat(row.thisVerifyCount) * parseFloat(row.taxPrice)).toFixed(2);
        },
    },
    {
        prop: "pendVerifyCount",
        label: "未核销数量",
        required: true,
        sortable: false,
    },
    {
        prop: "pendVerifyAmount",
        label: "未核销金额",
        required: true,
        sortable: false,
        formatter: function(val,row){
            return parseFloat(parseFloat(row.pendVerifyCount) * parseFloat(row.taxPrice)).toFixed(2);
        },
    },
    {
        prop: "sourceOrderCode",
        label: "来源单据号",
        required: true,
        sortable: false,
    },
    {
        prop: "basicUnitName",
        label: "基本单位",
        required: true,
        sortable: false
    },
    {
        prop: "basicCount",
        label: "数量",
        required: true,
        sortable: false
    },
    {
        prop: "taxPrice",
        label: "含税单价",
        required: true,
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        }
    },
    {
        prop: "noTaxPrice",
        label: "不含税单价",
        required: true,
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        }
    },
    {
        prop: "taxDiff",
        label: "税额",
        required: true,
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
        summaryType: function (data, prop) {
            let sum = 0.00;
            data.forEach((row) => {
                sum += parseFloat(row[prop]);
            });
            return parseFloat(sum).toFixed(2);
        }
    },
    {
        prop: "shouldSettleAmount",
        label: "应结金额（含税）",
        required: true,
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
        summaryType: function (data, prop) {
            let sum = 0.00;
            data.forEach((row) => {
                sum += parseFloat(row[prop]);
            });
            return parseFloat(sum).toFixed(2);
        }
    },
    {
        prop: "noTaxAmount",
        label: "不含税金额",
        required: true,
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
        summaryType: function (data, prop) {
            let sum = 0.00;
            data.forEach((row) => {
                sum += parseFloat(row[prop]);
            });
            return parseFloat(sum).toFixed(2);
        }
    },
    {
        prop: "reconAdjustAmount",
        label: "调整金额（含税）",
        required: true,
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        }
    },
    {
        prop: "reconOrderCode",
        label: "对账单单据编号",
        required: true,
        sortable: false,
    },
    {
        prop: "orderTypeName",
        label: "单据类型",
        required: true
    },
    {
        prop: "warehouseGroupName",
        label: "仓库分组",
        required: true,
        sortable: false,
    },
    {
        prop: "warehouseName",
        label: "仓库",
        required: true,
        sortable: false,
    },
    {
        prop: "reconStartTime",
        label: "对账时间",
        required: true,
        sortable: false,
        width:300,
        formatter: function(val,row){
            return DateUtils(row.reconStartTime * 1000, "yyyy-mm-dd HH:MM:ss") + '-' + DateUtils(row.reconEndTime * 1000, "yyyy-mm-dd HH:MM:ss")
        }
    }
];

//核销页面（悬浮table）
export const writeOffRightColumns = [
    {
        prop: "goodsCode",
        label: "商品编码",
        sortable: false,
        width:100
    },
    {
        prop: "goodsName",
        label: "商品名称",
        sortable: false,
        width:100
    },

    {
        prop: "thisVerifyCount",
        label: "本次核销数量",
        required: true,
        sortable: false,
        width:100
    },
    {
        prop: "thisVerifyAmount",
        label: "本次核销金额",
        required: true,
        sortable: false,
        width:100,
        formatter: function(val,row){
            return parseFloat(parseFloat(row.thisVerifyCount) * parseFloat(row.taxPrice)).toFixed(2);
        },
    },
];


