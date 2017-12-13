<template>
    <div v-bind="inventory-accounting-item">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
        >
        </t8t-search>
        <t8t-toolbar
            @DOWNLOAD="btnDownloadClick">
        </t8t-toolbar>
        <t8t-table
            :columns="columns"
            :commonData="commonData"
            :service="service"
            :args="args"
            :method="method"
            :isLoading="isLoading"
            ref="t8tTable"
            :indexCol="true"
        >
        </t8t-table>

    </div>
</template>

<script>
    import Service from 'src/services/finance/Service.js'
    import supplyService from 'src/services/supply/purchase.js'
    import reportService from 'src/services/supply/report.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import apiInventoryAccounting from 'src/services/finance/inventoryAccountingItem.js'
    import Cookie from 'js-cookie'
    import * as config from './config'
    import apiInventoryAccountingCostDomainConfig from 'src/services/finance/costDomainConfig.js'
    import exportUtils from 'src/utils/export.js'

    export default {
        name: 'page-inventory-accounting-item',
        components: {},
        methods: {

        getExportArgs(param){
            let exportP = {...param}

            for (let i in exportP) {
                if (exportP[i] === null) {
                    delete exportP[i]
                }
            }
            this.exportParams = {
                search: exportP,
                page: 1,
                size: 10000

            }
        },btnDownloadClick(){

                this.$msgbox({
                    title: '消息',
                    type: 'success',
                    message: '正在导出中,请勿重复操作,请注意左下方,稍后有导出的文件',
                    showCancelButton: false,
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })

                this.ids = []
                this.checkArray = this.$refs['t8tTable'].getSelectRows()
                if (this.checkArray.length > 0) {
                    this.checkArray.forEach((item) => {
                        this.ids.push(item.id)
                    })
                    this.exportParams = {
                        search: {
                            id_in: this.ids
                        },
                        page: 1,
                        size: 10000
                    }
                }

                let paramsExport=this.exportParams.search
                let objectFlag=false
                objectFlag=this.isEmptyObjectParams(paramsExport)
                if(!objectFlag)
                {
                    this.exportParams={
                        search:{
                            id_gt:0
                        },
                        page:1,
                        size:10000
                    }
                }

                exportUtils({
                    service: Service.INVENTORY_ACCOUNTING.name,
                    method: Service.INVENTORY_ACCOUNTING.methods.inventoryAccountingItemQueryPage,
                    args: this.exportParams,
                    title:'库存明细账',
                    headers: '成本域,会计期间,记账日期,业务类型,源单业务类型,源单据类型,仓库分组,仓库,商品类别,商品编码,商品名称,基础单位,数量,不含税单价,不含税金额,税率,含税单价,含税金额,源头单据号,源头单据行,来源单据号,来源单据行,项目ID,项目业务类型,客户,供应商,财务组织',
                    sorts: 'costDomainName,accountingTimeStr,storageTimeStr,businessTypeName,businessSubTypeName,sourceOrderTypeName,warhouseOrgName,warhouseName,goodsCategoryName,goodsCode,goodsName,basicUnitName,basicCount,noTaxUnitPrice,noTaxAmount,taxRate,taxUnitPrice,taxAmount,ultimateSourceOrderCode,ultimateSourceLineNo,directSourceOrderCode,directSourceLineNo,projectId,bizTypeName,customerName,supplierName,financeOrgName'
                })
            },
            isEmptyObjectParams(data)
            {
                let objectFlags=false
                for(let i in data)
                {
                    objectFlags=true
                }
                return objectFlags
            },
            submitSearch(obj) {
                this.searchCache = obj
                this.args = {search: obj}
                this.getExportArgs(obj)
            },

            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            }

        },
        computed: {},
        watch: {},
        data() {
            return {
                exportParams:{
                    search: {
                        id_gt: 0
                    },
                    page:1,
                    size:10000
                },//导出传参
                ids: [],//导出时id
                args: {
                    search: {
                        id_gt: 0
                    }
                },
                //搜索表单项配置
                fields: [
                    {
                        type: 'select',
                        label: '成本域',
                        name: 'costDomainId',
                        selectSourceKey: 'costDomainConfigOptions'
                    },
                    {
                        type: 'datepicker',
                        label: '会计期间',
                        name: 'accountingTime',
                        pickertype: 'month'
                    },
                    {
                        type: 'datepicker',
                        label: '记账日期',
                        name: 'storageTime',
                        pickertype: 'daterange',
                        startField: 'storageTime_gte',
                        endField: 'storageTime_lte'
                    },
                    {
                        type: 'popup',
                        label: '商品',
                        name: 'goodsId',
                        textValue: 'goodsName', filedValue: 'id',
                        dialog: {
                            dialogWidth: '780px',
                            title: "查询商品",
                            size: 'large',
                            searchForm: {
                                fields: [
                                    {type: 'input', label: '商品编码', name: 'goodsCode'},
                                    {type: 'input', label: '商品名称', name: 'goodsName'}
                                ],
                                resetBtnVisible: false,
                                showToggleBtn: false,
                                labelWidth: '100px'
                            },
                            table: {
                                //表格
                                columns: [{
                                    prop: 'goodsCode',
                                    label: '商品编码'
                                }, {
                                    prop: 'goodsName',
                                    label: '商品名称'
                                }],
                                //请求参数配置
                                service: supplyService.Goods.name,
                                method: supplyService.Goods.methods.goodsQueryPage,
                                args: {}
                            }
                        },
                        //自动补全
                        remote: true,
                        service: supplyService.Goods.name,
                        method: supplyService.Goods.methods.goodsQueryPage,
                        remoteArgs: {
                            search: {},
                            page: 1,
                            size: 200
                        },
                        remoteQueryKey: "goodsName"
                    },
                    {
                        type: 'select',
                        label: '业务类型',
                        name: 'businessTypeId',
                        selectSourceKey: 'businessTypeIdOptions'
                    },
                    {
                        type: 'select',
                        label: '源单业务类型',
                        name: 'businessSubTypeId',
                        selectSourceKey: 'businessSubTypeIdOptions'
                    },
                    {
                        type: 'select',
                        label: '源单据类型',
                        name: 'sourceOrderType',
                        selectSourceKey: 'sourceOrderTypeOptions'
                    },
                    {
                        type: 'select',
                        label: '商品分组',
                        name: 'goodsGroupId',
                        selectSourceKey: 'goodsGroupIdOptions'
                    },
                    {
                        type: 'popup',
                        label: '仓库',
                        name: 'warhouseId',
                        textValue: 'name', filedValue: 'id',
                        dialog: {
                            dialogWidth: '780px',
                            title: "查询仓库",
                            size: 'large',
                            searchForm: {
                                fields: [
                                    {type: 'input', label: '仓库编码', name: 'code_like'},
                                    {type: 'input', label: '仓库名称', name: 'name_like'}
                                ],
                                resetBtnVisible: false,
                                showToggleBtn: false,
                                labelWidth: '100px'
                            },
                            table: {
                                //表格
                                columns: [{
                                    prop: 'code',
                                    label: '仓库编码'
                                }, {
                                    prop: 'name',
                                    label: '仓库名称'
                                }],
                                //请求参数配置
                                service: supplyService.InventoryStorage.name,
                                method: supplyService.InventoryStorage.methods.inventoryStorageQueryPage,
                                args: {}
                            }
                        },
                        //自动补全
                        remote: true,
                        service: supplyService.InventoryStorage.name,
                        method: supplyService.InventoryStorage.methods.inventoryStorageQueryPage,
                        remoteArgs: {
                            search: {},
                            page: 1,
                            size: 100
                        },
                        remoteQueryKey: "name_like"
                    },
                    {
                        type: 'popup',label: '仓库分组',name:'warhouseOrgId_eq',
                        textValue:'name',filedValue:'id',
                        labelWidth: '300px',
                        dialog:{
                            title: "选择仓库分组",
                            size: 'large',
                            dialogWidth: '670px',
                            searchForm: {
                                fields:[
                                    {type: 'input',name: 'code_like',placeholder:"仓库分组编码"},
                                    {type: 'input',name: 'name_like',placeholder:"仓库分组名称"},
                                ],
                                resetBtnVisible: false,
                                showToggleBtn: false
                            },
                            table: {
                                radioCol: true,
                                //表格
                                columns: [{
                                    prop: 'code',
                                    label: '编码'
                                }, {
                                    prop: 'name',
                                    label: '仓库分组'
                                }],
                                //请求参数配置
                                service: reportService.INVCOLLECTION.name,
                                method: reportService.INVCOLLECTION.methods.INVORGLIST,
                                args: {
                                    search: {
                                        code_like:null,name_like:null
                                    }
                                }
                            }
                        },

                        //自动补全
                        remote:true,
                        service: reportService.INVCOLLECTION.name,
                        method: reportService.INVCOLLECTION.methods.INVORGLIST,
                        remoteArgs: {
                            search: {code_like:null,name_like:null},
                            page:1,
                            size: 100
                        },
                        remoteQueryKey:"name_like"
                    },

                    {
                        type: 'input',
                        label: '来源单据号',
                        name: 'directSourceOrderCode_like'
                    },

                    {
                        type: 'datepicker',
                        label: '创建日期',
                        name: 'createTime',
                        pickertype: 'daterange',
                        startField: 'createTime_gte',
                        endField: 'createTime_lte'
                    }
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    costDomainConfigOptions: [],
                    businessTypeIdOptions: [
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
                    businessSubTypeIdOptions: [
                        {
                            text: '发票价格差异',
                            value: 2
                        }, {
                            text: '采购价格差异',
                            value: 1
                        }],
                    goodsGroupIdOptions: [
                        {
                            text: '辅材',
                            value: 2
                        }, {
                            text: '主材',
                            value: 1
                        }],
                    sourceOrderTypeOptions: []
                },
                breadcrumbData: config.breadcrumbData,
                commonData: config.commonData,
                //表格
                columns: config.columns,
                isLoading: false,
                service: Service.INVENTORY_ACCOUNTING.name,
                method: Service.INVENTORY_ACCOUNTING.methods.inventoryAccountingItemQueryPage,
                rowId: null
            }
        },
        created() {
            let args = {
                search: {
                    status: 1
                }
            };
            apiInventoryAccountingCostDomainConfig.query(args)
                .then((res => {
                    let list = []
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            list.push({
                                value: item.id,
                                text: item.name
                            })

                        })
                        this.selectSource.costDomainConfigOptions = list
                    }
                }))

            //源单业务类型
            apiInventoryAccounting.queryBizTypes(null).then((res => {
                let list = []
                if (res.data.status === 200) {
                    res.data.result.forEach((item) => {
                        this.selectSource.businessSubTypeIdOptions.push({
                            value: item.businessSubTypeId,
                            text: item.businessSubTypeName
                        })
                    })
//                    this.selectSource.businessSubTypeIdOptions=list
                    console.log(this.commonData.businessSubTypeId)
                }
            }))
            this.commonData.businessSubTypeId = this.selectSource.businessSubTypeIdOptions
            console.log(this.commonData.businessSubTypeId)
            //单据类型
            let arg = {
                page: 1,
                search: {
                    pPropertyCode: "11605"
                },
                size: 100
            }
            commonApi.queryUnionParent(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus === 1) {
                                let arr = ["标准采购订单", "样品采购订单", "代销采购订单", "直运采购订单",
                                    "主材要货单", "辅材要货单", "主材退货单", "辅材退货单",
                                    "直运采购退货", "采购退货单", "标准调拨单", "其他入库单",
                                    "其他出库单", "库内移动单"]
                                if (arr.indexOf(item.propertyName) !== -1) {
         //                           this.selectSource.businessSubTypeIdOptions.push({
                                    this.selectSource.sourceOrderTypeOptions.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            }
                        })
//                       //取业务类型数据
//                        let bizarg = {
//                            page: 1,
//                            search: {
//                                pPropertyCode: "11607"
//                            },
//                            size: 100
//                        }
//                        commonApi.queryUnionParent(bizarg)
//                            .then((res) => {
//                                if (res.data.status === 200) {
//                                    res.data.result.forEach((item) => {
//                                        if (item.propertyStatus === 1) {
//                                            this.selectSource.businessSubTypeIdOptions.push({
//                                                value: item.id,
//                                                text: item.propertyName
//                                            })
//                                        }
//                                    })
//                                }
//                            })
//                        this.commonData.businessSubTypeId = this.selectSource.businessSubTypeIdOptions
                    }
                })
            this.commonData.sourceOrderType = this.selectSource.sourceOrderTypeOptions
        },
    };
</script>

<style>

</style>
