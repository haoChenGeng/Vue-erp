import Cookie from 'js-cookie'
export const breadcrumbData = [
    {
        title: '财务'
    },
    {
        title: '存货核算'
    },
    {
        title: '成本单价'
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
        formatter:function(val){
            var date = new Date(val * 1000)
            return date.getFullYear() + "-" + (date.getMonth() + 1);
        }
    },
    {
        prop: 'goodsCode',
        label: '商品编码'
    },
    {
        prop: 'goodsName',
        label: '商品名称'
    },{
        prop: 'goodsCategoryName',
        label: '商品类别'
    }, {
        prop: 'goodsStandard',
        label: '规格'
    }, {
        prop: 'goodsModel',
        label: '型号'
    }, {
        prop: 'basicUnitName',
        label: '基础单位'
    },
    {
        prop: 'costPrice',
        label: '不含税单价',
        align: 'right',
        formatter:function(val,a){
            return parseFloat(val).toFixed(2)
        }
    },
    {
        prop: 'calculateTime',
        label: '计算时间',
        formatter: "dateParser"

    }
];
