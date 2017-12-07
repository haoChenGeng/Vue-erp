<template>
    <div >
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new" :class="{'isHide': isTopHide}">

                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                            @WRITE-OFF="writeClick"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <!-- 收缩按钮 -->
                <div class="dialog2-main-container">
                    <!-- 表单区 -->
                    <div class="table-container top-container">
                        <div class="full-dialog-form-container">
                            <el-tabs v-model="activeInputTabName">
                                <el-tab-pane label="基本信息" name="basic">
                                    <t8t-search
                                        ref="writeOffSearch"
                                        :fields="searchFields"
                                        :formData="searchFormData"
                                        @submit="reconBeforeVerifyQuery"
                                    >
                                    </t8t-search>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                        <div class="full-dialog-form-container">
                            </el-form-item>
                                <el-form
                                    class="dialog2-form-container"
                                    :model="formData"
                                    :rules="formRule"
                                    ref="formBasic"
                                    label-position="right"
                                    label-width="120px">

                                    <el-form-item label="采购发票" class="title-label">
                                    </el-form-item>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="本次核销数量合计：">
                                            <el-input v-model="totalCount.pendVerifyCountTop" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="本次核销金额合计：">
                                            <el-input v-model="totalCount.pendVerifyAmountTop" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-tabs>
                        </div>
                        <!-- 标签页区 -->
                        <!-- 收缩按钮 -->
                        <div class="table-all">
                            <div class="right-hide el-icon-d-arrow-right" @click="isShowTableTop=!isShowTableTop"></div>
                            <t8t-table
                                ref="t8tTableTop"
                                :columns="columnsTop"
                                :dataSource="dataSourceTop"
                                :commonData="selectSource"
                                @cell-click="handleFormItemBlurTop"
                                @cell-editor-change="cellEditorChangeTop"
                                @selection-change="selectionChangeTop"
                                :selectCol="true"
                                :indexCol="true"
                                :editable="true"
                                :pageBar="false"

                                :formatters = "{taxRateCallback:taxRateCallback}"
                            >
                            </t8t-table>
                            <div class="right-table" v-if="isShowTableTop">
                                <t8t-table
                                    ref="t8tTable"
                                    :columns="columnsTopRight"
                                    :dataSource="dataSourceTopRight"
                                    @cell-click="handleFormItemBlur"
                                    @cell-editor-change="cellEditorChange"
                                    :selectCol="false"
                                    :editable="false"
                                    :pageBar="false"
                                    :formatters = "{taxRateCallback:taxRateCallback}"
                                >
                                </t8t-table>
                            </div>
                        </div>
                    </div>
                    <div class="table-container">
                        <div class="full-dialog-form-container">
                                <el-form
                                    class="dialog2-form-container"
                                    :model="formData"
                                    :rules="formRule"
                                    ref="formBasic"
                                    label-position="right"
                                    label-width="120px">
                                        <el-form-item label="对账单列表" class="title-label">
                                        </el-form-item>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="本次核销数量合计：">
                                            <el-input v-model="totalCount.pendVerifyCountBottom" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="本次核销金额合计：">
                                            <el-input v-model="totalCount.pendVerifyAmountBottom" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-form>
                        </div>
                        <!-- 标签页区 -->
                        <div class="table-all">
                            <div class="right-hide el-icon-d-arrow-right" @click="isShowTableBottom=!isShowTableBottom"></div>
                            <t8t-table
                                ref="t8tTableBottom"
                                :columns="columnsBottom"
                                :dataSource="dataSourceBottom"
                                @cell-click="handleFormItemBlurBottom"
                                @cell-editor-change="cellEditorChangeBottom"
                                @select="handleSelect"
                                @selection-change="selectionChangeBottom"
                                :selectCol="true"
                                :indexCol="true"
                                :editable="true"
                                :pageBar="false"
                                :formatters = "{taxRateCallback:taxRateCallback}"
                            >
                            </t8t-table>
                            <div class="right-table" v-if="isShowTableBottom">
                                <t8t-table
                                    ref="t8tTable"
                                    :columns="columnsBottomRight"
                                    :dataSource="dataSourceBottomRight"
                                    @cell-click="handleFormItemBlur"
                                    @cell-editor-change="cellEditorChange"
                                    :selectCol="false"
                                    :editable="false"
                                    :pageBar="false"
                                    :formatters = "{taxRateCallback:taxRateCallback}"
                                >
                                </t8t-table>
                            </div>
                        </div>
                    </div>

                </div>

        </el-dialog>
        <!-- 另一个el-dialog放这里 -->
    </div>
</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'

    import * as Config from './config'

    import Cookie from 'js-cookie'

    //    import Utils from 'src/utils/Utils.js'
    //    import InvoiceInput from './invoice-input.vue'

    import PurchaseInvoice from 'src/services/finance/purchaseInvoice.js'

    export default {

        name: 'page-purchase-invoice-dialog',
        components: {
        },
        beforeCreate() {
//            let routeNodes = this.$route.path.split('/')
//            pageType = routeNodes[routeNodes.length - 1]
        },
        mounted(){

        },
        created() {
            this.invoiceId = this.$route.query.id
            this.getDefaultData(this.invoiceId);

        },
        data () {
            return {
                count0:{},
                searchFormData: {
                    'orgId': null,
                    'orgName': null,
                    'shopId': null,
                    'shopName': null,
                    'startTime': null,
                    'endTime': null,
                },
                totalCount:{
                    pendVerifyCountTop:0,
                    pendVerifyAmountTop:0.00,
                    pendVerifyCountBottom:0,
                    pendVerifyAmountBottom:0.00
                },
                isShowTableTop:false,
                isShowTableBottom:false,
                isTopHide:false,
                invoiceId:null,
                isDialogShow: true,
                isLoading: false,
                activeInputTabName: 'basic',
                formData: {
                    //基本信息

                },
                columnsTop: Config.writeOffTopColumns,
                columnsTopRight: Config.writeOffRightColumns,
                columnsBottom: Config.writeOffBottomColumns,
                columnsBottomRight: Config.writeOffRightColumns,

                //辅助资料配置
                dataSourceTop:[],
                dataSourceBottom:[],
                dataSourceTopRight:[],
                dataSourceBottomRight:[],
                dataSource:[],
                selectSource: Config.selectSource,
                searchFields: [
                    {type: 'input',label: '财务组织',name: 'orgName',disabled:true},
                    {type: 'input',label: '供应商',name: 'shopName',disabled:true},
                    {type: 'datepicker',label: '对账开始时间',name: 'startTime',pickertype:"date"},
                    {type: 'datepicker',label: '对账结束期间',name: 'endTime',pickertype:"date"},
                ],
            };
        },
        methods: {
            updateTotalTaxAmount(totalTaxAmount){
                this.$refs['formBasic'].setTotalTaxAmount(totalTaxAmount);
            },
            getDefaultData(id) {
                if(id > 0) {
                    let args = {
                        id:id,
                    };
                    let _this = this
                    PurchaseInvoice.invoiceDetailQuery(args)
                        .then((res) => {
                            if (res.data.status === 200) {
                                let mainData = res.data.result.invoiceVO
                                let itemData = res.data.result.invoiceItemVOs
                                _this.searchFormData.orgId = mainData.orgId;
                                _this.searchFields[0].defaultValue = mainData.orgName;
                                _this.searchFields[1].defaultValue = mainData.shopName;
                                _this.searchFormData.orgName = mainData.orgName;
                                _this.searchFormData.shopId = mainData.shopId;
                                _this.searchFormData.shopName = mainData.shopName;
                                _this.dataSourceTop = itemData;
                            }
                        })
                        .then((res)=> {
                            _this.reconBeforeVerifyQuery();
                        })
                }

            },

            //手动核销
            writeClick(){
                let selectTopData = this.$refs['t8tTableTop'].getSelectRows()
                if(selectTopData.length===0){
                    this.$message.error('请勾选收采购发票列表')
                    return false
                }
                let selectBottomData = this.$refs['t8tTableBottom'].getSelectRows()
                if(selectBottomData.length===0){
                    this.$message.error('请勾选对账单列表')
                    return false
                }
                let topTable = this.$refs['t8tTableTop'];
                let bottomTable = this.$refs['t8tTableBottom'];
                let topTableFlag = false
                let bottomTableFlag = false
                topTable.validate((isValid) =>
                {
                    if (isValid) {
                        topTableFlag = true
                    }
                    bottomTable.validate((isValid) =>
                    {
                        if (isValid) {
                            bottomTableFlag = true
                        }
                        if(topTableFlag && bottomTableFlag){
                            let invoiceVerifyItems = [];
                            let reconVerifyItems = [];
                            selectTopData.forEach(function(val) {
                                let item = {}
                                item.id = val.id
                                item.thisVerifyCount = val.thisVerifyCount
                                invoiceVerifyItems.push(item)
                            })
                            selectBottomData.forEach(function(val) {
                                let item = {}
                                item.id = val.id
                                item.thisVerifyCount = val.thisVerifyCount
                                reconVerifyItems.push(item)
                            })
                            let args = {
                                "invoiceVerifyItems":invoiceVerifyItems,
                                "reconVerifyItems":reconVerifyItems,
                                "operId":parseInt(Cookie.get('t8t-tc-uid'))
                            }
                            PurchaseInvoice.manualVerify(args)
                                .then((res) => {
                                if(res.data.status === 200){
                                // 核销成功
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '核销成功',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.isLoading = false
                                this.closeDialog()
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
                        }
                    })
                })
            },
            closeDialog() {
                this.$router.push({ path: '/tuchat-finance/page-purchase-invoice'})
                this.$emit('close')
            },

            reconBeforeVerifyQuery(reconBeforeArgs){
                let args = reconBeforeArgs || {}
                args.orgId = this.searchFormData.orgId
                args.shopId = this.searchFormData.shopId
                args.operId = parseInt(Cookie.get('t8t-tc-uid'))
                if(reconBeforeArgs && reconBeforeArgs.endTime) {
                    //把结束日期变为当天的23::59:59秒
                    args.endTime = reconBeforeArgs.endTime + 24*3600 - 1
                }
                PurchaseInvoice.reconBeforeVerifyQuery(args)
                    .then((res) => {
                        if (res.data.status === 200) {
                            this.dataSourceBottom = res.data.result;
                        }else{
                            this.dataSourceBottom = []
                        }
                    })
            },
            handleFormItemBlurTop(row, column, cell, event) {
                if(column.property === 'thisVerifyCount') {
                    let Cfg = this.columnsTop.filter((item)=>{
                        return item.prop === column.property
                    })

                    this.updateCellValidateRules(Cfg[0], column.property, -9999999.99, parseFloat(row.pendVerifyCount));
                }
            },
            handleFormItemBlurBottom(row, column, cell, event) {
                if(column.property === 'thisVerifyCount') {
                    if (row.thisVerifyCount === 0) {
                        this.$refs.t8tTableBottom.handleFormItemBlur()
                    }
                    let Cfg = this.columnsBottom.filter((item) => {
                        return item.prop === column.property
                    })

                    this.updateCellValidateRules(Cfg[0], column.property, -9999999.99, parseFloat(row.pendVerifyCount));
                }
            },

            //操作核销单采购发票
            cellEditorChangeTop(cell, val, config, status){
                let column = cell.column;
                let row = cell.row;
                //当前变更列
                let cellNow = cell.column.property;

                //到货数量不能超过退货数量
                if(cellNow == 'thisVerifyCount')
                {
                    if(Number.isNaN(parseFloat(cell.row[cellNow]))) {
                        return false;
                    }
                    cell.row[cellNow] = parseFloat(cell.row[cellNow]);
                    if( parseFloat(row.thisVerifyCount) > parseFloat(row.pendVerifyCount)){
                        this.updateCellValidateRules(config, cellNow, -9999999.99, parseFloat(row.pendVerifyCount));
                    }else{
                        this.updateCellValidateRules(config, cellNow, -9999999.99, 99999999.99);
                    }
                    let selectRows = this.$refs['t8tTableTop'].getSelectRows();
                    this.updateTotalCountTop(selectRows)
                }
            },

            //操作核销单对账表
            cellEditorChangeBottom(cell, val, config, status){
                let column = cell.column;
                let row = cell.row;
                //当前变更列
                let cellNow = cell.column.property;

                //到货数量不能超过退货数量
                if(cellNow == 'thisVerifyCount')
                {
                    if(Number.isNaN(parseFloat(cell.row[cellNow]))) {
                        return false;
                    }
                    cell.row[cellNow] = parseFloat(cell.row[cellNow]);
                    if( parseFloat(row.thisVerifyCount) > parseFloat(row.pendVerifyCount)){
                        this.updateCellValidateRules(config, cellNow, -9999999.99, parseFloat(row.pendVerifyCount));
                    }else{
                        this.updateCellValidateRules(config, cellNow, -9999999.99, 99999999.99);
                    }
                    let selectRows = this.$refs['t8tTableBottom'].getSelectRows();
                    this.updateTotalCountBottom(selectRows)
                }
            },

            //动态更新列校验规则
            updateCellValidateRules(config, columnName, min, max) {

                let flag = false;

                config.editor.rules.forEach(function(item){

                    if(item.type == 'number')
                    {
                        item.min = min;
                        item.max = max;
                        item.message = "请输入"+min+"-"+max+"的数字";
                    }
                    else
                    {

                        flag = true;
                    }

                });

                if(flag)
                {
                    config.editor.rules.push({
                        type:'number',
                        max:max,
                        min:min,
                        message: "请输入"+min+"-"+max+"的数字",
                        transform:function(val){
                            return Number(val)
                        }
                    })
                }

            },

            selectionChangeTop(selRows, selIDs, selIndexes){
                this.dataSourceTopRight = selRows;

                this.updateTotalCountTop(selRows)
            },

            handleSelect(selection, row){
                let _this = this
                let isSelect = true

                if(row['basicCount'] === 0) {
                    let selectNull = selection.includes(row) ? false : true //判断数量为0 则不能选中，如果被选中了，则不能取消选中
                    _this.$refs['t8tTableBottom'].toggleRowSelection(row, selectNull)
                    return false;
                }
                //判断是否还选中的数量大于0的相同 的商品
                selection.forEach(function (val) {
                    if(val['goodsSku'] == row['goodsSku'] && parseFloat(val['basicCount']) > 0) {
                        isSelect = false;
                    }
                })
                this.dataSourceBottom.forEach(function(val,key,all){
                    if(selection.includes(row)) {
                        //如果选中商品有其他行，并且数量为0 则同时选中
                        if(parseFloat(val['basicCount']) === 0 && val['goodsSku'] == row['goodsSku']) {
                            _this.$refs['t8tTableBottom'].toggleRowSelection(val, true)
                        }
                    }else{
                        //如果取消选（最后一个，isSelect === false时 代表是否是最后一个）中商品有其他行，并且数量为0 则同时选中
                        if(parseFloat(val['basicCount']) === 0 && val['goodsSku'] == row['goodsSku'] && isSelect) {
                            _this.$refs['t8tTableBottom'].toggleRowSelection(val, false)
                        }
                    }

                })


            },
            selectionChangeBottom(selRows, selIDs, selIndexes){
                this.dataSourceBottomRight = selRows;
                this.updateTotalCountBottom(selRows)
            },
            updateTotalCountTop(selRows){
                let totalCount = 0;
                let totalAmount = 0;
                selRows.forEach((item)=> {
                    if(Number.isNaN(parseFloat(item.thisVerifyCount))) {
                        return false;
                    }
                    totalCount += parseFloat(item.thisVerifyCount);
                    totalAmount += parseFloat(item.thisVerifyCount) * parseFloat(item.taxPrice);
                })
                this.totalCount.pendVerifyCountTop = parseFloat(totalCount).toFixed(2);
                this.totalCount.pendVerifyAmountTop = parseFloat(totalAmount).toFixed(2);
            },
            updateTotalCountBottom(selRows){
                let totalCount = 0;
                let totalAmount = 0;
                selRows.forEach((item)=> {
                    if(Number.isNaN(parseFloat(item.thisVerifyCount))) {
                        return false;
                    }
                    totalCount += parseFloat(item.thisVerifyCount);
                    totalAmount += parseFloat(item.thisVerifyCount) * parseFloat(item.taxPrice);
                })
                this.totalCount.pendVerifyCountBottom = parseFloat(totalCount).toFixed(2);
                this.totalCount.pendVerifyAmountBottom = parseFloat(totalAmount).toFixed(2);
            },

        },

    };
</script>

<style lang="css" scoped>
    .table-all{
        position: relative;
    }
    .right-hide{
        width: 15px;
        height: 15px;
        position: absolute;
        right:0;
        top:0;
        cursor: pointer;
        z-index: 100000;
    }
    .right-table{
        width:450px;
        height:200px;
        position: absolute;
        top:0;
        right: 0;
    }
    .dialog2-main-container,.table-container,.table-all,.right-table{
        display:flex;
        flex-direction: column;
    }
    .table-container,.table-all,.t8t-table-container{
        flex:1
    }
    .title-label{
        font-weight: bold;;
    }
</style>
