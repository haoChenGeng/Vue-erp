import Cookie from 'js-cookie'
export const breadcrumbData = [
    {
        title: '财务'
    },
    {
        title: '存货核算'
    },
    {
        title: '库存明细账'
    }
];
export const columns = [
    {
        prop: 'costDomainName',
        label: '成本域'
    },
    {
        prop: 'accountingTime',
        label: '会计期间',
        formatter: function (val) {
            var date = new Date(val * 1000)
            return date.getFullYear() + "-" + (date.getMonth() + 1)
        }
    },
    {
        prop: 'storageTime',
        label: '记账日期',
        formatter: "dateParser"
    },
    {
        prop: 'businessTypeId',
        label: '业务类型',
        list: 'businessTypeId'
    },
    {
        prop: 'businessSubTypeId',
        label: '源单业务类型',
        list: 'businessSubTypeId'
    },
    {
        prop: 'sourceOrderType',
        label: '源单据类型',
        list: 'sourceOrderType'
    },
    {
        prop: 'warhouseOrgName',
        label: '仓库分组'
    },
    {
        prop: 'warhouseName',
        label: '仓库'
    },
    {
        prop: 'goodsGroupName',
        label: '商品分组'
    },
    {
        prop: 'goodsCategoryName',
        label: '商品类别'
    },
    {
        prop: 'goodsCode',
        label: '商品编码'
    },
    {
        prop: 'goodsName',
        label: '商品名称'
    },
    {
        prop: 'basicUnitName',
        label: '基本单位'
    },
    {
        prop: 'basicCount',
        label: '数量',
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
        prop: 'noTaxUnitPrice',
        label: '不含税单价',
        align: 'right',
        formatter: function (val, a) {
            return parseFloat(val).toFixed(2)
        }
    },
    {
        prop: 'noTaxAmount',
        label: '不含税金额',
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
        prop: 'taxRate',
        label: '税率',
        align: 'right',
        formatter: function (val, a) {
            return parseFloat(val) * 100 + "%"
        }
    },
    {
        prop: 'taxUnitPrice',
        label: '含税单价',
        align: 'right',
        formatter: function (val, a) {
            return parseFloat(val).toFixed(2)
        }
    },
    {
        prop: 'taxAmount',
        label: '含税金额',
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
        prop: 'ultimateSourceOrderCode',
        label: '源头单据号'
    },
    {
        prop: 'ultimateSourceLineNo',
        label: '源头单据行'
    },
    {
        prop: 'directSourceOrderCode',
        label: '来源单据号'
    },
    {
        prop: 'directSourceLineNo',
        label: '来源单据行'
    },
    {
        prop: 'projectId',
        label: '项目ID',
        formatter: function (val, a) {
            return val == '0' ? "" : val;
        }
    },
    {
        prop: 'bizTypeName',
        label: '项目业务类型'
    },
    {
        prop: 'customerName',
        label: '客户'
    },
    {
        prop: 'supplierName',
        label: '供应商'
    },
    {
        prop: 'financeOrgName',
        label: '财务组织'
    },
    {
        prop: 'createTime',
        label: '创建时间',
        formatter: "dateParser"
    }
];

export const commonData = {
    businessTypeId: [
        {
            text: '入库调整',
            value: 9
        }, {
            text: '调拨入库',
            value: 8
        }, {
            text: '其它入库',
            value: 7
        },
        {
            text: '其它出库',
            value: 6
        }, {
            text: '调拨出库',
            value: 5
        }, {
            text: '采购退出库',
            value: 4
        }, {
            text: '销售出库',
            value: 3
        }, {
            text: '销售退入库',
            value: 2
        }, {
            text: '采购入库',
            value: 1
        }],

    businessSubTypeId: [],
    sourceOrderType: []
};
