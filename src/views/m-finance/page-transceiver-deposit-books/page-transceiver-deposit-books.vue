<template>
    <div v-bind="transceiver-deposit-books">
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
    // import t8tFormPopUp from 'src/components/t8t-form-popup/t8t-form-popup.vue'
    import exportUtils from 'src/utils/export.js'


    export default {
        name: 'page-transceiver-deposit-books',
        components: {
            // t8tFormPopUp
        },
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
            },
            btnDownloadClick(){

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
                    method: Service.INVENTORY_ACCOUNTING.methods.transceiverDepositBooksQueryPage,
                    args:  this.exportParams,
                    title:'收发存账簿',
                    headers: '成本域,会计期间,仓库分组,商品类别,商品编码,商品名称,基本单位,期初数量,期初不含税单价,期初不含税金额,本期采购入库数量,本期采购入库金额,本期调拨入库数量,本期调拨入库金额,本期其它入库数量,本期其它入库金额,本期销售出库数量,本期销售出库金额,本期调拨出库数量,本期调拨出库金额,本期其它出库数量,本期其它出库金额,本期结存数量,本期结存不含税单价,本期结存不含税金额',
                    sorts: 'costDomainName,accountingTimeStr,warhouseOrgName,goodsCategoryName,goodsCode,goodsName,basicUnitName,goodsInitialCount,initialNoTaxPrice,initialNoTaxAmount,purchaseInstorageCount,purchaseInstorageAmount,allocateInstorageCount,allocateInstorageAmount,otherInstorageCount,otherInstorageAmount,salesOutstorageCount,salesOutstorageAmount,allocateOutstorageCount,allocateOutstorageAmount,otherOutstorageCount,otherOutstorageAmount,goodsUltimateCount,ultimatePrice,ultimateAmount'
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
                        type: 'popup',
                        label: '商品',
                        name: 'goodsId',
                        textValue: 'goodsName', filedValue: 'id',
                        dialog: {
                            dialogWidth:'780px',
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
                                args: {
                                }
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
                    }
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    costDomainConfigOptions: []
                },
                breadcrumbData: config.breadcrumbData,
                //表格
                columns: config.columns,
                isLoading: false,
                service: Service.INVENTORY_ACCOUNTING.name,
                method: Service.INVENTORY_ACCOUNTING.methods.transceiverDepositBooksQueryPage,
                rowId: null
            }
        },
        created() {

            let args ={
                search:{
                    status:1
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
        },
    };
</script>

<style>

</style>
