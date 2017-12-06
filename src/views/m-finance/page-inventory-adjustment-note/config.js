import Cookie from 'js-cookie'

import Supply from 'src/services/supply/Service.js'
import DateUtils from 'src/utils/DateUtils.js'

//面包屑
export const breadcrumbData = [
    {title: '财务'},
    {title: '应付核算'},
    {title: '入库调整单'}
];

export const searchFields =  [
    {type: 'input',label: '单据编号',name: 'code'},
    {type: 'date',label: '记账日期',name: 'recordTime'},
    {type: 'select',label: '调整类型',name: 'adjustType', selectSourceKey:'adjustType'},
    {type: 'popup',
        label: '供应商',
        name: 'shopId',
        textValue:'shopName',
        filedValue:'id',
        dialog:{
            dialogWidth:'780px',
            title: "供应商搜索",
            size: 'large',
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
                //请求参数配置
                radioCol:true,
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
    {type: 'select',label: '单据状态',name: 'orderStatus', selectSourceKey:'orderStatus'},
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
        label: "供应商"
    },
    {
        prop: "adjustType",
        label: "调整类型",
        list:"adjustType"
    },
    {
        prop: "notaxAdjustAmount",
        label: "调整金额（不含税）"
    },
    {
        prop: "orderStatus",
        label: "单据状态",
        list: "orderStatus"
    },
    {
        prop: "createName",
        label: "创建人"
    },
    {
        prop: "createTime",
        label: "创建时间",
        formatter: "dateParser"
    }

];

//所有下拉菜单静态配置项
export const  selectSource = {
    adjustType:[
        {
            text: '采购价格差异',
            value: 1
        },
        {
            text: '发票价格差异',
            value: 2
        },
    ],
    orderStatus:[
        {
            text: '已审核',
            value: 1
        },
        {
            text: '已作废',
            value: 2
        },
    ],
    //财务组织
    orgOptions:[]
}


//修改详情页面表单列名
export const createColumns = [
    {
        type:"index",
        label:"行号",
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
        prop: "notaxAdjustAmount",
        label: "调整金额（不含税）",
        sortable: false,
    },
];


