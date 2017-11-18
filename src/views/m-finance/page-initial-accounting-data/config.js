import Cookie from 'js-cookie'
import supplyService from 'src/services/supply/purchase.js'

export const breadcrumbData = [
    {
        title: '财务'
    },
    {
        title: '财务基础配置'
    },
    {
        title: '期初核算数据'
    }
];
export const importColumns = [
    {"prop": "costDomainName", "label": "成本域"},
    {"prop": "warhouseCode", "label": "仓库编码"},
    {"prop": "goodsCode", "label": "商品编码"},
    {"prop": "goodsInitialCount", "label": "期初数量"},
    {"prop": "initialNoTaxPrice", "label": "期初单价"},
    {"prop": "remark", "label": "备注"}
]
export const columns = [

    {
        prop: 'costDomainId',
        label: '成本域',
        list: 'costDomainConfigOptions',
        editor: {
            type: "select",
            list: 'costDomainConfigOptions',
            rules: [{
                "required": true,
                "message": "成本域不能为空"
            }]
        }
    },
    {
        prop: 'warhouseOrgName',
        label: '仓库分组'
    },
    {
        prop: 'warhouseId',
        label: '仓库',

        list: "inventoryStorageOptions",
        editor: {
            type: 'lookup',
            //请求参数配置
            service: supplyService.InventoryStorage.name,
            method: supplyService.InventoryStorage.methods.inventoryStorageSearch,
            columns: [
                {label: '仓库编码', prop: 'code'},
                {label: '仓库名称', prop: 'name'},
                {label: '仓库分组', prop: 'orgName'},
            ],
            readonly: true,
            searchPlaceholder: "请输入仓库编码",

            dataSource: [],
            'filterMethod': function (val, args) {
                args['code'] = val
                return args
            },
            "rules": [{
                "required": true,
                "message": "仓库不能为空"
            }]
        }
    },
    {
        prop: 'goodsId',
        label: '商品编码',
        list: "goodsOptions",
        editor: {
            type: 'lookup',
            service: supplyService.Goods.name,
            method: supplyService.Goods.methods.goodsQueryPage,
            columns: [
                {label: '商品编码', prop: 'goodsCode'},
                {label: '商品名称', prop: 'goodsName'},
                {label: '类别', prop: 'goodsCategoryName'}
            ],
            readonly: true,
            dataSource: [],
            searchPlaceholder: "请输入商品编码",
            'filterMethod': function (val, args) {
                args['search'] = {
                    'goodsCode': val
                }
                return args
            },
            "rules": [{
                "required": true,
                "message": "商品不能为空"
            }]
        }
    }, {
        prop: 'goodsName',
        label: '商品名称',
        summaryType: function (data, prop) {
            return "合计：";
        }
    },
    {
        prop: 'goodsInitialCount',
        label: '期初数量',
        align: 'right',
        formatter: function (val, a) {
            return parseFloat(val).toFixed(2)
        },
        onChange(val, row) {
            row.goodsInitialCount = val
            row.initialNoTaxAmount = row.initialNoTaxPrice * row.goodsInitialCount
        },
        summaryType: function (data, prop) {
            let sum = Number(0);
            data.forEach((row) => {
                sum += Number(row[prop]);
            });
            return sum.toFixed(2);
        },
        editor: {
            type: "input",
            rules: [
                {
                    required: true,
                    message: "不能为空"
                },
                {
                    type: "number",
                    transform: function (varable) {
                        return +varable
                    },
                    required: true,
                    message: "必须为数字",
                },
                {
                    type: "number",
                    transform: function (varable) {
                        return +varable
                    },
                    message: "请输入-9999999.99到99999999.99的数",
                    max: 99999999.99,
                    min: -9999999.99
                },
                {
                    pattern: /^[+-]?((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/,
                    message: '请保留两位小数'
                }
            ]
        }
    },
    {
        prop: 'initialNoTaxPrice',
        label: '期初不含税单价',
        align: 'right',
        onChange(val, row) {
            row.initialNoTaxPrice = val
            row.initialNoTaxAmount = row.initialNoTaxPrice * row.goodsInitialCount
        },
        formatter: function (val, a) {
            return parseFloat(val).toFixed(2)
        },
        editor: {
            type: "input",
            rules: [
                {
                    required: true,
                    message: "不能为空"
                },
                {
                    type: "number",
                    transform: function (varable) {
                        return +varable
                    },
                    required: true,
                    message: "必须为数字",
                },
                {
                    type: "number",
                    transform: function (varable) {
                        return +varable
                    },
                    message: "请输入0.0000000000001到99999999.9999999999999的数",
                    max: 99999999.9999999999999,
                    min: 0.0000000000001
                },
                {
                    pattern: /^((0|[1-9]\d{0,})((\.[0-9]{1,13})?))$/,
                    message: '请保留十三位小数'
                }
            ]
        }
    },
    {
        prop: 'initialNoTaxAmount',
        label: '期初不含税金额',
        align: 'right',
        formatter: function (val, a) {
            return parseFloat(val).toFixed(2)
        },
        summaryType: function (data, prop) {
            let sum = Number(0);
            data.forEach((row) => {
                sum += Number(row[prop]);
            });
            return sum.toFixed(2);
        }
    },
    {
        prop: 'remark',
        label: '备注',
        editor: {
            type: "input"
        }
    },
    {
        prop: 'createUserName',
        label: '创建人'
    },
    {
        prop: 'createTime',
        label: '创建时间',
        formatter: "dateParser"
    },
    {
        prop: 'updateUserName',
        label: '修改人'
    },
    {
        prop: 'updateTime',
        label: '修改时间',
        formatter: "dateParser"
    }
];

export const selectSource = {
    costDomainConfigOptions: [],
    inventoryStorageOptions: [],
    goodsOptions: []
}

export const formData = {
    id: null,
    code: null,
    name: null,
    status: null,
    remark: null,
    createUser: parseInt(Cookie.get('t8t-tc-uid'))
};

