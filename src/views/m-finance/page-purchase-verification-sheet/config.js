import Cookie from 'js-cookie'

import Supply from 'src/services/supply/Service.js'
import DateUtils from 'src/utils/DateUtils.js'

//面包屑
export const breadcrumbData = [
    {title: '财务'},
    {title: '应付核算'},
    {title: '采购核销单'}
];

export const searchFields =  [
    {type: 'input',label: '单据编号',name: 'code'},
    {type: 'date',label: '单据日期',name: 'orderTime'},
    {type: 'popup',label: '供应商',
        name: 'shopId',
        textValue:'shopName',
        filedValue:'id',
        dialog:{
            title: "供应商搜索",
            size: 'large',
            dialogWidth:'780px',
            searchForm: {
                fields:[
                    {
                        type: 'input',
                        label: '供应商编码',
                        name: 'shopCode_like'
                    },
                    {
                        type: 'input',
                        label: '供应商名称',
                        name: 'shopName_like'
                    },
                ],
                resetBtnVisible: true,
                showToggleBtn: false,
                labelWidth: '100px'
            },
            table: {
                //表格
                columns: [{
                    prop: 'shopCode',
                    label: '供应商编码'
                }, {
                    prop: 'shopName',
                    label: '供应商名称'
                }],
                radioCol:true,
                //请求参数配置
                service: Supply.SUPPLY.name,
                method: Supply.SUPPLY.methods.SHOP_QUERY,
                args: {
                    sort: ['id_desc'],
                }
            }
        },

        //自动补全
        remote:true,
        service: Supply.SUPPLY.name,
        method: Supply.SUPPLY.methods.SHOP_QUERY,
        remoteQueryKey:"shopName_like"
    },
    {type: 'select',label: '单据状态',name: 'verifyStatus', selectSourceKey:'verifyStatus'},
    {type: 'select',label: '财务组织',name: 'finOrgId', selectSourceKey:'orgOptions'},
];
//列表页面表单列名
export const queryPageColumns = [
    {
        type:"index",
        label:"行号",
    },
    {
        prop: "code",
        label: "单据编号",
    },
    {
        prop: "orderTime",
        label: "单据日期",
        formatter: function(val){
            return val == 0 ? '' : DateUtils(val * 1000, "yyyy-mm-dd")
        }
    },
    {
        prop: "orgName",
        label: "财务组织"
    },
    {
        prop: 'shopName',
        label: '供应商',
    },
    {
        prop: "verifyCount",
        label: "已核销数量",
    },
    {
        prop: "verifyAmount",
        label: "已核销含税金额",
    },
    {
        prop: "verifyStatus",
        label: "单据状态",
        list: "verifyStatus"
    },
    {
        prop: "createName",
        label: "创建人"
    },
    {
        prop: "createTime",
        label: "创建时间",
        formatter: "dateParser"
    },
    {
        prop: "updateName",
        label: "修改人"
    },
    {
        prop: "updateTime",
        label: "修改时间",
        formatter: "dateParser"
    }

];

//所有下拉菜单静态配置项
export const  selectSource = {
    verifyStatus:[
        {
            text: '未核销',
            value: 1
        },
        {
            text: '已核销',
            value: 2
        },
        {
            text: '已作废',
            value: 3
        }
    ],
    verifyWay:[
        {
            text: '依据对账单生成核销',
            value: 1
        },
        {
            text: '手动核销',
            value: 2
        }
    ],
    orgOptions:[]
}

//修改详情页面表单列名
export const createColumns = [
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
        prop: "basicUnitName",
        label: "基本单位",
        sortable: false,
    },
    {
        prop: "verifyCount",
        label: "本次核销数量",
        sortable: false,
    },
    {
        prop: "invoiceCode",
        label: "发票编号",
        required: true,
        sortable: false,
    },
    {
        prop: "invoiceTaxPrice",
        label: "发票单价（含税）",
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
            }]
        },
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
    },
    {
        prop: "invoiceNoTaxPrice",
        label: "发票单价（不含税）",
        required: true,
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
    },
    {
        prop: "invoiceTaxVerifyAmount",
        label: "发票本次核销金额（含税）",
        required: true,
        sortable: false,
        width:200,
        summaryType: function (data, prop) {
            let sum = 0.00;
            data.forEach((row) => {
                sum += parseFloat(row[prop]);
            });
            return parseFloat(sum).toFixed(2);
        },
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
    },
    {
        prop: "invoiceNotaxVerifyAmount",
        label: "发票本次核销金额（不含税）",
        required: true,
        sortable: false,
        width:220,
        summaryType: function (data, prop) {
            let sum = 0.00;
            data.forEach((row) => {
                sum += parseFloat(row[prop]);
            });
            return parseFloat(sum).toFixed(2);
        },
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
    },
    {
        prop: "taxRate",
        label: "税率",
        required: true,
        formatter:function (val) {
            return val == 0 ? 0 : parseInt(parseFloat(val) * 100) + '%'
        }
    },
    {
        prop: "taxDiff",
        label: "税额",
        required: true,
        summaryType: function (data, prop) {
            let sum = 0.00;
            data.forEach((row) => {
                sum += parseFloat(row[prop]);
            });
            return parseFloat(sum).toFixed(2);
        },
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
    },
    {
        prop: "reconOrderCode",
        label: "对账单据编号",
        required: true,
        sortable: false,
    },
    {
        prop: "sourceCode",
        label: "来源单据号",
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
        prop: "reconTaxPrice",
        label: "对账单单价（含税）",
        required: true,
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
    },
    {
        prop: "reconTaxVerifyAmount",
        label: "对账单本次核销金额（含税）",
        required: true,
        sortable: false,
        width:200,
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
        prop: "reconNoTaxPrice",
        label: "对账单单价（不含税）",
        required: true,
        sortable: false,
        formatter: function(val){
            return parseFloat(val).toFixed(2);
        },
    },
    {
        prop: "reconNotaxVerifyAmount",
        label: "对账单本次核销金额（不含税）",
        required: true,
        width:220,
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
        required: true,
        sortable: false,
        width:200,
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
        },
    },
    {
        prop: "sourceOrderTypeName",
        label: "对账单单据类型 ",
        required: true,
        sortable: false,
    },
];
