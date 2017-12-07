<template>
    <t8t-list-view
        ref="list-view"
        :breadcrumbData="breadcrumbData"
        :searchFields="searchFields"
        :searchOptions="selectSource"
        :showSearchToggleBtn="true"
        :tableColumns="tableColumns"
        :tableCommonData="selectSource"
        @list-view="onView"
        @list-anti-verification="antiVerificationClick"
        @search-submit="onSearchSubmit"
        :tableService="tableService"
        :tableMethod="tableMethod"
        :tableArgs="tableArgs"
        :tableIndexCol="true"
        @table-current-row-change="onTableCRC"
        @table-row-dobule-click="onTableRDC"
        @table-selection-change="onTableSC"
    >
    </t8t-list-view>
</template>

<script>
    import * as Config from './config'
    import Cookie from 'js-cookie'
    import PurchaseInvoice from 'src/services/finance/purchaseInvoice.js'
    import Service from 'src/services/finance/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    export default {
        components: {  },
        created() {
            commonApi.queryByFunctionCode({"funcCodes":["001004013","001004014"]})
                .then((res => {
                    let list = []
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.isDel===0) {
                                list.push({
                                    value: item.id,
                                    text: item.name
                                })
                            }
                        })
                        this.selectSource.orgOptions = list

                    }
                }))
        },
        data () {
            return {
                tableService: Service.PURCHASE_INVOICE.name,
                tableMethod: Service.PURCHASE_INVOICE.methods.VERIFY_ORDER_QUERY,
                breadcrumbData: Config.breadcrumbData,
                searchFields: Config.searchFields,
                tableColumns: Config.queryPageColumns,
                selectSource: Config.selectSource,
                curRow:null,
                selRows:[],
                isShow:false,
                tableArgs:{
                    sort:[
                        "createTime_desc"
                    ]
                },
                searchCache:{}
            }
        },
        methods: {
            onTableSC (selRows, selIDs, selIndexes) {
                this.selRows = selRows;
            },
            // table当前行改变
            onTableCRC(curRow,oldRow) {
                this.curRow = curRow
            },
            // table 双击
            onTableRDC(row) {
                this.curRow = row
//                this.showDialog('view')
                this.$router.push({path: '/tuchat-finance/page-purchase-verification-sheet/view', query: {id: row.id}})
            },
//            onView(symbol, event) {
//                if(!this.selRows){
//                    return this.$message("请选择一行数据！")
//                }
//                this.showDialog('view')
//            },
            showDialog(status) {
                this.isShow = true
            },
            onView (symbol, event) {
                this.$TCS.addTag('erp_finance_007008006001')
                if(!this.curRow){
                    return this.$message("请勾选单据后再试。")
                }
                this.$router.push({path: '/tuchat-finance/page-purchase-verification-sheet/view', query: {id: this.curRow.id}})
            },
            antiVerificationClick (symbol, event) {
                this.$TCS.addTag('erp_finance_007008006002')
                // 判断是否选择
                if(!this.curRow){
                    return this.$message("请勾选单据后再试。")
                }

                if(this.curRow.verifyStatus != 2) {
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '请勾选状态为已核销的单据',
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    return false
                }

                this.$confirm('是否确定对所选单据做反核销？', '反核销确认', {
                    type: 'warning',
                    confirmButtonText: '反核销'
                }).then(() => {
                    let args = {
                        id : this.curRow.id,
                        operId : parseInt(Cookie.get('t8t-tc-uid'))
                    }

                    PurchaseInvoice.andiVerify(args)
                        .then((res) => {
                            if(res.data.status === 200){
                                // 核销成功
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '反核销成功',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.isLoading = false
                                this.getTableData();
                            }else{
                                this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: res.data.message,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.isLoading = false
                            }
                        })
                })

            },
            //表格
            getTableData() {
                let tableIns = this.$refs['list-view'].getTableInstance();
                tableIns.reloadTable()
            },
            //判断是否选中
            checkSelection() {
                if(this.selRows.length == 0){
                    this.$message("请勾选单据后再试。")
                    return false
                }
                if(this.selRows.length > 1){
                    this.$message("仅支持单选查看数据信息")
                    return false
                }
                return true
            },
            //判断是否选中多个
            checkSelections() {
                if(this.selRows.length == 0){
                    this.$message("请勾选单据后再试。")
                    return false
                }
                return true
            },
            //提交搜索
            onSearchSubmit(obj) {
                this.searchCache = this.isEmptyObject(obj) ? {'code': null} : obj;
                this.tableArgs = {
                    search: this.searchCache,
                    sort:[
                        "createTime_desc"  //根据创建时间排序
                    ]
                }
            },

            isEmptyObject(obj){
                for(var key in obj){
                    return false;
                }
                return true;
            }
        }
    }
</script>

<style lang="css" scoped>

</style>
