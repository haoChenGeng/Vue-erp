<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="selectSource"
            :showSearchToggleBtn="true"
            :tableColumns="tableColumns"
            :tableCommonData="selectSource"
            @list-view="onView"
            @search-submit="onSearchSubmit"
            :tableService="tableService"
            :tableMethod="tableMethod"
            :tableArgs="tableArgs"
            :tableIndexCol="true"
            @table-current-row-change="onTableCRC"
            @table-row-dobule-click="onTableRDC"
        >
        </t8t-list-view>
        <view-dialog
            v-if="isShow"
            @close="isShow=false"
            :id="showId"
        >
        </view-dialog>
    </div>

</template>

<script>
    import * as Config from './config'
    import ViewDialog from './view-dialog.vue'
    import PurchaseInvoice from 'src/services/finance/purchaseInvoice.js'
    import Service from 'src/services/finance/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    export default {
        components: { ViewDialog },
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
                tableMethod: Service.PURCHASE_INVOICE.methods.ADJUST_ORDER_QUERY,
                breadcrumbData: Config.breadcrumbData,
                searchFields: Config.searchFields,
                tableColumns: Config.queryPageColumns,
                selectSource: Config.selectSource,
                curRow:null,
                isShow:false,
                showId:null,
                tableArgs:{
                    sort:[
                        "createTime_desc"
                    ]
                },
                searchCache:{}
            }
        },
        methods: {
            // table当前行改变
            onTableCRC(curRow,oldRow) {
                this.curRow = curRow
            },
            // table 双击
            onTableRDC(row) {
                this.curRow = row
                this.showId = this.curRow.id
                this.showDialog('view')
//                this.$router.push({path: '/tuchat-finance/page-inventory-adjustment-note/view', query: {id: this.curRow.id}})
            },
            onView(symbol, event) {
                this.$TCS.addTag('erp_finance_007008009001')
                if(!this.curRow){
                    return this.$message("请选择一行数据！")
                }
                this.showId = this.curRow.id
                this.showDialog('view')
            },
            showDialog(status) {
                this.isShow = true
            },
//            onView (symbol, event) {
//                if(!this.curRow){
//                    return this.$message("请选择一行数据！")
//                }
//                this.showDialog('view')
//                debugger
//                if (this.checkSelection() === false) return false
//                let selectRow = this.$refs['list-view'].getTableInstance().getSelectRows()[0]
//                this.$router.push({path: '/tuchat-finance/page-purchase-verification-sheet/view', query: {id: selectRow.id}})
//            },
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
