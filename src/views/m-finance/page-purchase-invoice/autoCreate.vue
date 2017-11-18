<template>
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog title="" size="full" class="t8t-full-dialog2" v-model="isDialogShowAuto" @close="closeDialog">
                <!-- 顶部按钮区 -->
            <div class="my-dialog2-container">
                    <h1 class="my-title">对账单查询</h1>
                    <!-- 表单区 -->
                    <t8t-search
                        :fields="searchFields"
                        :selectSource="selectSource"
                        :showToggleBtn="true"
                        @submit="submitSearch"
                    >
                    </t8t-search>
                    <!-- 标签页区 -->
                    <t8t-table
                        class="my-table"
                        :columns="columns"
                        :service="service"
                        :method="method"
                        :commonData="selectSource"
                        :args="args"
                        ref="t8tTable"
                        @row-double-click="submitBtn()"
                    >
                    </t8t-table>

                <div class="my-button">
                    <el-button
                        type="primary"
                        @click="submitBtn"
                    >确定</el-button>
                    <el-button
                        @click="closeDialog"
                    > 取消</el-button>
                </div>
            </div>

        </el-dialog>
        <!-- 另一个el-dialog放这里 -->
</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'

    import * as Config from './config'

    import Cookie from 'js-cookie'

    //    import Utils from 'src/utils/Utils.js'

    import PurchaseInvoice from 'src/services/finance/purchaseInvoice.js'
    import Reconciliation from 'src/services/supply/reconciliation/Service.js'
    import Supply from 'src/services/supply/Service.js'

    import Service from 'src/services/finance/Service.js'

    export default {

        name: 'page-purchase-invoice-dialog',
        components: {
        },
        beforeCreate() {
//            let routeNodes = this.$route.path.split('/')
//            pageType = routeNodes[routeNodes.length - 1]
        },
        created() {
            let invoiceId = this.$route.query.id
            //财务组织（付款组织，付款主体）（001004013-法人职能，001004014-利润中心）
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
                //搜索表单项配置
                searchFields: [
                    {type: 'input',label: '单据编号',name: 'code'},
                    {type: 'popup',
                        label: '供应商',
                        name: 'supplierName',
                        textValue:'shopName',
                        filedValue:'shopName',
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
                    {type: 'select',label: '结算组织',name: 'settleOrgId', selectSourceKey:'orgOptions'},
                    {type: 'datepicker',label: '对账开始时间',name: 'reconciliationStartTime',pickertype:"date"},
                    {type: 'datepicker',label: '对账结束期间',name: 'reconciliationEndTime',pickertype:"date"},
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: Config.reconciliationSelectSource,
                isTopHide: false,
                isLoading: false,
                isDialogShowAuto: true,
                columns: Config.autoCreateSearchColumns,
                service: Reconciliation.RECONCILIATION.name,
                method: Reconciliation.RECONCILIATION.methods.REC_ORDER_QUERY_PAGE_LATEST_VERSION,
                args: {
                    search: {
                        writeOffStatus_in: [1,2],//0-无状态，1-待核销，2-核销中，3-已核销   核销状态不等于已核销
                        verifyStatus: 6,//0-无状态 1-暂存(新生成) 2-待商家审核 3-暂存(商家驳回) 4-审核中 5-暂存(重新审核) 6-已审核 7-已关闭
                        settleStatus: 1,//0-无状态 1-待结算 2-结算中 3-已结算
                    }
                }
            };
        },
        methods: {
            submitBtn(){
                if (this.checkSelections() === false) return false
                let selectRow = this.$refs['t8tTable'].getSelectRows()

                let supplierId = [];
                let shopObj = {};
                for(let i = 0;i<selectRow.length;i++) {
                    if(i > 0) {
                        if(supplierId.includes(selectRow[i].supplierId) && shopObj[selectRow[i].supplierId] == selectRow[i].settleOrgId ){
                            shopObj[selectRow[i].supplierId] = selectRow[i].settleOrgId
                            supplierId.push(selectRow[i].supplierId);
                        }else{
                            this.$message.error('供应商或者结算组织不统一');
                            return false
                        }
                    }else{
                        shopObj[selectRow[i].supplierId] = selectRow[i].settleOrgId
                        supplierId.push(selectRow[i].supplierId);
                    }
                }
                for(let i = 0;i<selectRow.length;i++) {
                    shopObj[selectRow[i].supplierId] = selectRow[i].settleOrgId
                }
                let ids = [];
                selectRow.forEach(function (res) {
                    ids.push(res.id)
                })
                this.$emit('getReconIds', ids);
            },
            closeDialog() {
                this.$router.push({ path: '/finance/page-purchase-invoice'})
                this.$emit('close')
            },
            submitSearch(obj){
                this.searchCache = obj
                let supplierName = this.searchCache.supplierName || '';
                let settleOrgId = this.searchCache.settleOrgId || 0;
                if(supplierName || settleOrgId) {
                    if(!supplierName || !settleOrgId){
                        this.$message.error('供应商和结算组织必须同时选择。')
                        return false
                    }
                }
                if(this.searchCache.reconciliationEndTime !== null) {
                    this.searchCache.reconciliationEndTime = (this.searchCache.reconciliationEndTime + 3600 * 24) - 1
                }
                this.searchCache.writeOffStatus_in = [1,2], //0-无状态，1-待核销，2-核销中，3-已核销   核销状态不等于已核销
                this.searchCache.verifyStatus = 6 //6-已审核
                this.searchCache.settleStatus = 1 //1-待结算
                this.args = { search: this.searchCache }
            },
            checkSelection() {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if(selections.length===0){
                    this.$message.error('请勾选收款单后再试。')
                    return false
                }else if(selections.length>1){
                    this.$message.error('请对单条数据进行操作。')
                    return false
                }
                return true
            },
            checkSelections() {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if(selections.length===0){
                    this.$message.error('请勾选收款单后再试。')
                    return false
                }
                return true
            },
            onPopupConfirm: function(selectedRows){
                this.$refs['search'].updateRecord(name,selectedRows)
            }

        }
    };
</script>
<style lang="css" scoped>
    .my-title{
        text-align: center;
    }
    .my-dialog2-container{
        width: 100%;
        height: 100%;
        display: flex;
        flex: 1;
        flex-direction: column;
    }
    .my-table{
        display: flex;
        flex:1;
    }
    .my-button{
        text-align: center;
        margin: 10px;
    }
    .t8t-search{
         overflow: visible;
    }
</style>
