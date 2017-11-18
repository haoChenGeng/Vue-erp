import Cookie from 'js-cookie'
export const breadcrumbData = [
    {
        title: '财务'
    },
    {
        title: '存货核算'
    },
    {
        title: '收发存账簿'
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
            return date.getFullYear() + "-" + (date.getMonth() + 1);
        }
    },
    {
        prop: 'warhouseOrgName',
        label: '仓库分组'
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
        prop: 'goodsInitialCount',
        align: 'right',
        label: '期初数量',
        formatter:function(val,a){
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
        prop: 'initialNoTaxPrice',
        align: 'right',
        label: '期初不含税单价',
        formatter:function(val,a){
            return parseFloat(val).toFixed(2)
        }
    },
    {
        prop: 'initialNoTaxAmount',
        align: 'right',
        label: '期初不含税金额',
        formatter:function(val,a){
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
        prop: 'purchaseInstorageCount',
        align: 'right',
        label: '本期采购入库数量',
        formatter:function(val,a){
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
        prop: 'purchaseInstorageAmount',
        align: 'right',
        label: '本期采购入库金额',
        formatter:function(val,a){
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
        prop: 'allocateInstorageCount',
        align: 'right',
        label: '本期调拨入库数量',
        formatter:function(val,a){
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
        prop: 'allocateInstorageAmount',
        align: 'right',
        label: '本期调拨入库金额',
        formatter:function(val,a){
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
        prop: 'otherInstorageCount',
        align: 'right',
        label: '本期其它入库数量',
        formatter:function(val,a){
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
        prop: 'otherInstorageAmount',
        align: 'right',
        label: '本期其它入库金额',
        formatter:function(val,a){
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
        prop: 'salesOutstorageCount',
        align: 'right',
        label: '本期销售出库数量',
        formatter:function(val,a){
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
        prop: 'salesOutstorageAmount',
        align: 'right',
        label: '本期销售出库金额',
        formatter:function(val,a){
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
        prop: 'allocateOutstorageCount',
        align: 'right',
        label: '本期调拨出库数量',
        formatter:function(val,a){
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
        prop: 'allocateOutstorageAmount',
        align: 'right',
        label: '本期调拨出库金额',
        formatter:function(val,a){
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
        prop: 'otherOutstorageCount',
        align: 'right',
        label: '本期其它出库数量',
        formatter:function(val,a){
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
        prop: 'otherOutstorageAmount',
        align: 'right',
        label: '本期其它出库金额',
        formatter:function(val,a){
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
        prop: 'goodsUltimateCount',
        align: 'right',
        label: '本期结存数量',
        formatter:function(val,a){
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
        prop: 'ultimatePrice',
        align: 'right',
        label: '本期结存不含税单价',
        formatter:function(val,a){
            return parseFloat(val).toFixed(2)
        }
    },
    {
        prop: 'ultimateAmount',
        align: 'right',
        label: '本期结存不含税金额',
        formatter:function(val,a){
            return parseFloat(val).toFixed(2)
        },
        summaryType: function (data, prop) {
            let sum = Number(0);
            data.forEach((row) => {
                sum += Number(row[prop]);
            });
            return sum.toFixed(2);
        }
    }
];

