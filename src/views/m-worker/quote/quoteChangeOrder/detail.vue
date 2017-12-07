/**
* Created by tomy.li on 2017/9/11.
*/
<template>
    <div class="quoteChangeOrderDetail">
        <el-dialog size="full" class="t8t-full-dialog2 dialog-new quoteChangeOrderDetailDialog" v-model="quoteChangeOrderDialogVisible" @close="closeQuoteChangeOrderDialog" :show-close="false" :close-on-press-escape="false" :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog2-container">

                <!--顶部操作区-->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <div>
                            <el-button @click="closeQuoteChangeOrderDialog()">返回</el-button>
                        </div>
                        <!--"TEMP-SAVE","EDIT-SUBMIT","PRINT","ANTI-AUDITING","APPROVAL-FLOW"-->
                        <t8t-toolbar ref="topToolbar"
                                 :symbolList="symbilListTop"
                                 :disabledSymbols="disabledSymbolsTop"
                                     @TEMP-SAVE="tempSave()"
                                     @EDIT-SUBMIT="submit()"
                                     @PRINT="print()"
                                     @ANTI-AUDITING="unSubmit()"
                                     @APPROVAL-FLOW="flowBtn()"
                                     @AUDITING-SUBMIT="checkSubmit()"
                                     @VOID="voidFun()"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <!--顶部操作区 end-->

                <div class="dialog2-main-container" :class="{'isHide': isTopHide}">

                    <!--审核-->
                    <div class="full-dialog-form-container" v-if="isInWorkFlow">
                        <t8t-audit
                            ref="t8tAudit"
                        >
                        </t8t-audit>
                    </div>
                    <!--审核 end-->

                    <!--顶部表单-->
                    <div class="full-dialog-form-container">
                        <t8t-form-panel
                            ref="headForm"
                            :dataSource="orderInfo"
                            :commonData="formCommonData"
                            :fields="formFields"
                            class="headerForm"
                        >
                        </t8t-form-panel>
                    </div>
                    <!--顶部表单 end-->

                    <!--头部收缩-->
                    <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>

                    <!--表格操作区-->
                            <t8t-toolbar ref="bodyToolbar"
                                 :symbolList="['ADD-PLUSITEM','ADD-SUBTRACTITEM']"
                                 :disabledSymbols="isCanEdit() ? [] : ['ADD-PLUSITEM','ADD-SUBTRACTITEM']"
                                 @ADD-PLUSITEM="addPlusItem()"
                                 @ADD-SUBTRACTITEM="addSubTractItem()"
                            >
                            </t8t-toolbar>
                    <!--表格操作区 end-->

                    <!--变更单详情列表-->
                    <div class="quoteChangeOrderItemPanel">

                        <t8t-grid
                            :columns="mainTableColumns"
                            :dataSource="orderItems"
                            :commonData="formCommonData"
                            :editable="isCanEdit()"
                            :indexCol="false"
                            :selectCol="false"
                            :showHeader="!index"
                            :pageBar="false"
                            :stripe="false"
                            :preLoad="false"
                            :style="!index ? 'border-top: 1px solid #dfe6ec' : ''"
                            :templateData="templateData"
                            @headerDragend="headerDragend"
                            @cell-click="cellClick"
                            @cell-editor-change="cellEditorChange"
                            ref="t8ttable"
                        >
                            <template scope="scope" slot="qiName">
                                <div class="cell-text" style="float: left;">
                                    <el-button type="" size="mini" class="remove-item" :name="removeItem" @click.stop="removeItem(scope)" title="删除报价项" :disabled="!isCanEdit()"><i class="el-icon-delete el-icon&#45;&#45;left"></i>删除</el-button>
                                </div>
                                <span>{{scope.row.qiName}}</span>
                            </template>

                            <template scope="scope" slot="craftDetails">
                                <el-popover trigger="hover" placement="bottom">
                                    <div class="craftDetails-popover">{{scope.row.craftDetails}}</div>
                                    <div slot="reference" class="name-wrapper">
                                        <div class="cell-text">{{scope.row.craftDetails}}</div>
                                    </div>
                                </el-popover>
                            </template>

                            <template scope="scope" slot="totalMoney">
                                <span >{{(scope.row.amount && !isNaN(scope.row.amount)) ? (+scope.row.price * +scope.row.amount).toFixed(2) * (scope.row.addOrSubItemType == 1 ? 1 : -1) : 0}}</span>
                            </template>

                        </t8t-grid>
                    </div>

                    <!--
                汇总面板
            -->
                    <div class="summaryMoney">
                            <t8t-grid
                                :columns="summaryColumns"
                                :dataSource="summaryData"
                                :indexCol="false"
                                :selectCol="false"
                                :editable="false"
                                :pageBar="false"
                                :showHeader="false"
                                :preLoad="false"
                                ref="summarytable"
                            >
                            </t8t-grid>

                    </div>

                </div>

            </div>
        </el-dialog>
        <addChangeOrderItemDialog
            ref="addChangeOrderItemDialog"
            v-if="addItemDialogVisible"
            @close="addItemDialogVisible = false"
            :addItemType="addItemType"
            :tempCode="orderInfo.tempCode"
            :orgId="orderInfo.orgId"
            :spaces="formCommonData.spaces"
            :places="formCommonData.places"
            :yid="yid"
        >
        </addChangeOrderItemDialog>
        <t8t-step-page
            v-if="isShowFlow"
            :method="flowMethod"
            :service="flowService"
            :args="flowArgs"
            :dataSource="flowData"
            @close="closeStepPage"
        >
        </t8t-step-page>
    </div>

</template>
<script>
    import config from 'src/views/m-worker/quote/quoteChangeOrder/config.js'
    import service from 'src/services/worker/quoteChangeOrder/Service.js'
    import methods from 'src/services/worker/quoteChangeOrder/methods.js'
    import workFlowMethods from 'src/services/procenter/workflow.js'
    import addChangeOrderItemDialog from 'src/views/m-worker/quote/quoteChangeOrder/addChangeOrderItemDialog.vue'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import T8tAudit from 'src/components/t8t-audit/t8t-audit.vue'
    import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'
    import printPDFUtils from 'src/utils/printPDF.js'
    import Cookie from 'js-cookie'
    export default {
        components: {addChangeOrderItemDialog,T8tAudit,T8tStepPage},
        name: "quoteChangeOrderDetail",
        created() {
            this.getCommonOptions(30003,'places')
        },
        mounted:function (){
            this.initParams()
            this.initOrderData()
        },
        data() {
            return {
                yid:null,
                orderId:null,
                tempCode:null,
                orgId:null,
                isTopHide:false,
                orderItems:[], //变更单明细内容
                orderItemsClone:[],
                orderInfo:{}, //变更单基本数据
                addItemDialogVisible: false, //增项及减项的选择弹框
                quoteChangeOrderDialogVisible:true,
                accountId:null,
                addItemType:'',//增加的项目类型， plus:增项 sub:减项
                delVariationItemIds:[], //删除的变更单条目id集合
                changeOrderPrice:0,
                projectManagerPrice:0,
                tax:0,

                /////工作流相关
                procInsId:0,//工作流实例id
                taskId:0,//工作流任务id
                isInWorkFlow:false, //是否处在工作流审核任务中
                flowArgs: {},
                flowService: service.workFlow.name, //获取审批流的服务 TODO补齐接口及服务
                flowMethod: service.workFlow.methods.getBusinessKeyDetail, //获取审批流的接口
                flowData: [],
                isShowFlow: false, //审批流是否展示

                symbilListTop:['TEMP-SAVE','VOID','EDIT-SUBMIT','PRINT','ANTI-AUDITING','AUDITING-SUBMIT','APPROVAL-FLOW'],//顶部工具条展示的按钮列表
                symbilListTopDefault:['TEMP-SAVE','VOID','EDIT-SUBMIT','PRINT','ANTI-AUDITING','AUDITING-SUBMIT','APPROVAL-FLOW'],//顶部工具条默认展示的按钮列表
                symbilListTopWorkFlow:['AUDITING-SUBMIT','APPROVAL-FLOW'],//顶部工具条审核时展示的按钮列表
                disabledSymbolsTopDefault:['TEMP-SAVE','EDIT-SUBMIT','VOID','PRINT','ANTI-AUDITING','AUDITING-SUBMIT'], //默认禁用的操作
                disabledSymbolsTop:['TEMP-SAVE','EDIT-SUBMIT','VOID','PRINT','ANTI-AUDITING','AUDITING-SUBMIT'], //禁用的顶部操作按钮列表， 默认全部禁用
                formCommonData:{
                    'order_status': config.datas.order_status,
                    'houseTypes':[],
                    'addOrSubItemTypes':config.datas.addOrSubItemTypes,
                    'spaces': [],
                },
                formFields: config.formFields,
                mainTableColumns:config.mainTableColumns,
                templateData:{
                    spaceId:null,
                    placeId:null,
                    amount:0,
                    price:0,
                    totalMoney:0,
                    addOrSubItemType:null,
                    orderSpaceId:null,
                },
                summaryColumns:config.summaryColumns,
                summaryData:[
                    {
                        columnsProp:'changeOrderTotalPrice',
                        spaceName:'',
                        placeName:'',
                        qiName:'变更金额合计',
                        amount:'',
                        qiUnit:'',
                        price:'',
                        totalMoney: '',
                        addOrSubItem:'',
                        craftDetails:''
                    },
                    {
                        columnsProp:'projectManagerPrice',
                        spaceName:'',
                        placeName:'',
                        qiName:'项目管理费',
                        amount:'',
                        qiUnit:'',
                        price:'',
                        totalMoney: '',
                        addOrSubItem:'',
                        craftDetails:''
                    },
                    {
                        columnsProp:'tax',
                        spaceName:'',
                        placeName:'',
                        qiName:'税金',
                        amount:'',
                        qiUnit:'',
                        price:'',
                        totalMoney: '',
                        addOrSubItem:'',
                        craftDetails:''
                    },
                    {
                        columnsProp:'changeOrderPrice',
                        spaceName:'',
                        placeName:'',
                        qiName:'变更单金额',
                        amount:'',
                        qiUnit:'',
                        price:'',
                        totalMoney: '',
                        addOrSubItem:'',
                        craftDetails:''
                    },
                ]

            }
        },
        methods: {

            addItem: function (data){
                let tableObj = this.$refs.t8ttable
                let templateData =  Object.assign({},tableObj.templateData);
                let newData = Object.assign(templateData,data);
                tableObj.addNewRow(newData,'back')
            },

            //增加增项
            addPlusItem: function (){
                this.addItemType = 'plus'
                this.showAddItemDialog()
            },

            //增加增项的回调
            handlerAddPlusItem: function (data){
                //up 2017年10月12日15:29 由于增项添加时候使用空间尚未确定，把增项的重复性验证放在选择使用空间后 参看function cellEditorChange，
                this.$TCS.addTag('red_11732_018003009009')
                let item = Object.assign({}, data)
                item.addOrSubItemType = 1 // 1.增项 2.减项
                this.addItem(item)
            },

            //增加减项
            addSubTractItem: function (){
                this.addItemType = 'sub'
                this.showAddItemDialog()
            },

            //增加减项的回调
            handlerAddSubTractItem: function (data){
                //同空间下不能存在多条相同的减项 (tempItemId orderSpaceId 相同)
                if( this.orderItems.length ){
                    if(this.orderItems.filter((item) =>{
                        return item.addOrSubItemType == 2
                            && item.tempItemId == data.tempItemId
                            && item.orderSpaceId == data.orderSpaceId
                    }).length > 0){
                        return this.$msgbox({
                            title:'',
                            type:'error',
                            message:'变更单已经存在相同的减项'
                        })
                    }
                }

                this.$TCS.addTag('red_11732_018003009010')
                let item = Object.assign({}, data)
                item.addOrSubItemType = 2 // 1.增项 2.减项
                this.addItem(item)
            },

            handlerAddItem(data){
                switch (this.addItemType){
                    case 'plus':
                        this.handlerAddPlusItem(data)
                        break;
                    case 'sub':
                        this.handlerAddSubTractItem(data)
                        break;
                    default:
                        this.$msgbox({
                            title:'',
                            type:'error',
                            message:'添加失败：未知操作'
                        })
                        break;

                }
                this.resizeGrid(0)
            },

            //增项、减项 弹框展示
            showAddItemDialog: function (){
              this.addItemDialogVisible = true
            },

            /**
             * 移除增减项
             */
            removeItem: function (scope){
                let index = scope.$index
                let row = scope.row
                this.orderItems.splice(index,1)
                if( row.hasOwnProperty('id') && !this.isEmpty(row.id) ) {
                    this.delVariationItemIds.push(row.id)
                }
                this.computeAmount();
                this.resizeGrid(0)
            },

            /**
             * 行编辑以后执行
             * @param cell
             * @param val
             * @param config
             * @param status
             */
            cellEditorChange: function (cell, val, config, status){
                let row = cell.row;
                let column = cell.column
                let property = column.property
                //降低计算频率，只有变更数量文本框时才更新
                if( property == 'amount' ){
                    this.computeAmount()
                }

                if( property === 'orderSpaceId' ){
                    if( this.orderItems.length ){

                        //同空间下不能存在多条相同的增项 (tempItemId orderSpaceId 相同)
                        let seamItems = []
                        seamItems = this.orderItems.filter((item) =>{
                            return row != item
                                && item.addOrSubItemType == 1
                                && item.tempItemId == row.tempItemId
                                && item.orderSpaceId == row.orderSpaceId
                        })
                        if(seamItems.length > 0){
                            row.orderSpaceId = null
                            return this.$msgbox({
                                title:'错误',
                                type:'error',
                                message:`同一使用空间不能存在相同的增项(第${cell.$index+1}行和第${this.orderItems.indexOf(seamItems[0])+1}行重复)`
                            })
                        }
                    }
                }

            },
            cellClick: function (row, column, cell, event){
                //选品
                if( column.property === 'orderSpaceId' ){

                    if( row.addOrSubItemType == 2 ){
                        this.$refs.t8ttable.handleFormItemBlur()
                    }

                }
            },

            //变更单金额总计
            computeAmount: function (){
                let changeOrderTotalPrice = 0;
                let orderItems = this.orderItems
                let orderInfo = this.orderInfo

                //增项、减项之和
                orderItems.forEach((item, index) => {
                    changeOrderTotalPrice += (item.amount && !isNaN(item.amount)) ? ( +(+item.price * +item.amount).toFixed(2) * (item.addOrSubItemType == 1 ? 1 : -1) ) : 0
                })

                changeOrderTotalPrice = +changeOrderTotalPrice.toFixed(2)

                //初始化、完成初稿、审核驳回 项目管理费=变更金额合计*项目管理费比率
                if( [0,2].indexOf(orderInfo['orderStatus']) > -1 || this.isEmpty(orderInfo['id']) ){
                    this.projectManagerPrice  = +(changeOrderTotalPrice * orderInfo['projectManagerPriceRate']).toFixed(2)

                    this.$set(this.summaryData.filter((item) => {
                        return item.columnsProp == 'projectManagerPrice'
                    })[0],'totalMoney',this.projectManagerPrice)
                }

                //初始化、完成初稿、审核驳回时 税金=（变更金额合计+项目管理费）* 税率(taxRate)
                if( [0,2].indexOf(orderInfo['orderStatus']) > -1 || this.isEmpty(orderInfo['id']) ){
                    this.tax  = +((changeOrderTotalPrice + this.projectManagerPrice) * orderInfo['taxRate']).toFixed(2)

                    this.$set(this.summaryData.filter((item) => {
                        return item.columnsProp == 'tax'
                    })[0],'totalMoney',this.tax)
                }

                this.$set(this.summaryData.filter((item) => {
                    return item.columnsProp == 'changeOrderTotalPrice'
                })[0],'totalMoney',changeOrderTotalPrice)

                //变更单金额 = 变更金额+项目管理费+税金
                this.$set(this.summaryData.filter((item) => {
                    return item.columnsProp == 'changeOrderPrice'
                })[0],'totalMoney',(changeOrderTotalPrice+this.tax+this.projectManagerPrice).toFixed(2))
            },

            tempSave: function (){
                let _this = this
                let tables = [this.$refs.t8ttable]
                this.validateData(tables,0, () => {

                    let orderItems = this.formatVariationOrderItemsCreateToSave()

                    //数据未变化
                    if( orderItems.length == 0 && this.delVariationItemIds.length == 0 ){
                        return this.$msgbox({
                            'type': 'error',
                            'title': '',
                            'message': '没有添加、修改或删除增(减)项',
                        })
                    }

                    _this.$TCS.addTag('red_11732_018003009002')
                    _this.addDisabledSymbol('TEMP-SAVE', _this.disabledSymbolsTop)

                    methods.create(
                        this.orderInfo.id || null,
                        this.orderInfo.yid,
                        +Cookie.get('t8t-tc-uid'),
                        this.delVariationItemIds,
                        orderItems
                    ).then(res => {
                        if( res.data.status == 200 ){
                            this.$msgbox({
                                'type': 'success',
                                'title': '',
                                'message': '暂存成功',
                            })

                            //第一次保存后，设置变更单id
                            if( !this.isEmpty(res.data.result) && this.isEmpty(this.orderId) ){
                                this.orderId = res.data.result

                                this.$router.push({path:'/tochat-worker/quote-changeorder-detail',query:{'yid':this.yid,'orderId':this.orderId}})
                                //this.$router.push({path:'/tochat-worker/quote-changeorder-list',query:{'yid':this.yid,'orderId':this.orderId}})
                            }

                            this.delVariationItemIds = []
                            this.initOrderData()
                            _this.removeDisabledSymbol('TEMP-SAVE',_this.disabledSymbolsTop)
                        }else{
                            this.$msgbox({
                                title:'',
                                type: 'error',
                                message: res.data.result || res.data.message
                            })
                            _this.removeDisabledSymbol('TEMP-SAVE',_this.disabledSymbolsTop)
                        }

                    }).catch(e => {
                        this.$msgbox({
                            title:'暂存出错',
                            type: 'error',
                            message: e
                        })
                        _this.removeDisabledSymbol('TEMP-SAVE',_this.disabledSymbolsTop)
                    })
                })
            },

            //数据保存前格式化
            formatVariationOrderItemsCreateToSave: function (){
                let list = []
                if(this.orderItems){
                    this.orderItems.forEach((item, index) => {
                        list.push({
                            id: item.id || null, //变更单行id
                            tempItemId: item.tempItemId, //产品包模板行id
                            itemPriceId: item.itemPriceId, //价格id
                            orderSpaceId: item.orderSpaceId, //变更单空间表id
                            serialNumber: index+1, //变更单行展示序号
                            amount: item.amount ? (item.amount * ( item.addOrSubItemType == 1 ? 1 : -1 )) : 0, //数量
                        })
                    })
                }
                return list
            },

            //校验数据合法性， 递归校验不定数的table对象
            validateData: function (tables,tableIndex,callback){

                if( tables.length == 0){
                    callback()
                }

                else{
                    //递归校验table数据
                    tables[tableIndex].validate((isValid) => {
                        if (isValid) {

                            if( tables.length == tableIndex+1 ){
                                callback()
                            }else{
                                this.validateData(tables,tableIndex+1, callback)
                            }

                        }else{
                            //只要有不通过的则不继续校验
                            return false
                        }

                    })
                }
            },

            submit: function (){
                let _this = this

                if( _this.orderItems.length == 0 ){
                    return this.$msgbox({
                        'type': 'error',
                        'title': '',
                        'message': '变更单中没有报价项',
                    })
                }

                this.$confirm('提交前请确认变更单内容无误。是否继续提交？','提示',{
                    type: 'warning',
                    confirmButtonText: '继续提交',
                    cancelButtonText: '先不提交',
                }).then(() => {

                    //提交前检测数据变化， 只有保存后才允许提交
                    if( JSON.stringify(this.orderItems) != JSON.stringify(this.orderItemsClone) ) {
                        this.$confirm(
                            '有数据变更，继续提交未保存的数据将丢失，是否继续提交？',
                            '提示',
                            {
                                type: 'warning',
                                confirmButtonText: '继续提交',
                                cancelButtonText: '先不提交',
                            }
                        ).then(() => {
                            _this.submitDo()
                        })
                    }else{
                        _this.submitDo()
                    }
                })
            },

            submitDo: function (){
                let _this = this
                _this.$TCS.addTag('red_11732_018003009003')
                _this.addDisabledSymbol('EDIT-SUBMIT', _this.disabledSymbolsTop)
                methods.submit(_this.orderId, +Cookie.get('t8t-tc-uid')).then(res => {
                    return this.$msgbox({
                        title: '消息',
                        type: 'success',
                        'message': '提交成功',
                        callback:function (){
                            _this.$router.push('/tochat-worker/quote-changeorder-list')
                        }
                    })
                }).catch(e => {
                    _this.removeDisabledSymbol('EDIT-SUBMIT', _this.disabledSymbolsTop)
                    return this.$msgbox({
                        title: '消息',
                        type: 'error',
                        'message': e
                    })

                })
            },

            //打印报价变更单
            print(){
                this.$TCS.addTag('red_11732_018003009004')
                printPDFUtils({
                    method: service.order.methods.print,
                    service: service.order.name,
                    args: {
                        'id':this.orderId,
                        'accountId': +Cookie.get('t8t-tc-uid')
                    },
                })
            },

            //反审核
            unSubmit(){
                let _this = this
                this.$TCS.addTag('red_11732_018003009005')
                this.addDisabledSymbol('ANTI-AUDITING', _this.disabledSymbolsTop)
                methods.unSubmit(this.orderId, +Cookie.get('t8t-tc-uid')).then(res => {
                    return this.$msgbox({
                        title: '消息',
                        type: 'success',
                        'message': '反审核成功',
                        callback:function (){
                            _this.initOrderData()
                        }
                    })
                }).catch(e => {
                    this.removeDisabledSymbol('ANTI-AUDITING', _this.disabledSymbolsTop)
                    return this.$msgbox({
                        title: '消息',
                        type: 'error',
                        'message': e
                    })
                })
            },

            //作废
            voidFun(){
                let _this = this
                _this.$confirm('作废后变更单将不可使用，是否确认作废','警告',{
                    type: 'warning',
                    confirmButtonText: '确认作废',
                    cancelButtonText: '取消',
                }).then(()=> {
                    this.$TCS.addTag('red_11732_018003009006')
                    this.addDisabledSymbol('VOID', _this.disabledSymbolsTop)
                    methods.void(this.orderId, +Cookie.get('t8t-tc-uid')).then(res => {
                        return this.$msgbox({
                            title: '消息',
                            type: 'success',
                            'message': '作废成功',
                            callback:function (){
                                _this.initOrderData()
                            }
                        })
                    }).catch(e => {
                        this.removeDisabledSymbol('VOID', _this.disabledSymbolsTop)
                        return this.$msgbox({
                            title: '消息',
                            type: 'error',
                            'message': e
                        })
                    })
                })
            },

            //审核提交
            checkSubmit() {
                let _self = this
                this.checkOrder(() => {
                    let verifyForm = _self.$refs.t8tAudit.ruleForm
                    _self.$TCS.addTag('red_11732_018003009007')
                    _self.addDisabledSymbol('AUDITING-SUBMIT',_self.disabledSymbolsTop);
                    methods.verify(_self.taskId, _self.procInsId, +Cookie.get('t8t-tc-uid'), verifyForm.idea, verifyForm.agree ).then((res) => {
                        if(res.data.status == 200) {
                            _self.$msgbox({
                                title: '消息',
                                message: "审核成功",
                                type: 'success',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain',
                                callback:function(){
                                    window.close()
                                }
                            })
                        }else {
                            _self.$msgbox({
                                title: '消息',
                                message: res.data.message || '审核失败',
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            _self.removeDisabledSymbol('AUDITING-SUBMIT',_self.disabledSymbolsTop);
                        }
                    }).catch((error) => {
                        _self.removeDisabledSymbol('AUDITING-SUBMIT',_self.disabledSymbolsTop);
                        _self.$msgbox({
                            title: '消息',
                            message: '审核失败',
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                    })
                })
            },


            //审核
            checkOrder(callback) {
                this.$refs.t8tAudit.validate(validate => {
                    if(validate){
                        this.removeDisabledSymbol('AUDITING-SUBMIT',this.disabledSymbolsTop);
                        let _self = this
                        let verifyForm = _self.$refs.t8tAudit.ruleForm
                        callback()
                    }
                })
            },

            //初始化页面参数
            initParams: function (){
                this.yid = this.$route.query.yid
                this.orderId = this.$route.query.orderId || null
                this.procInsId = this.$route.query.procInsId || null
                this.taskId = this.$route.query.taskId || null
                this.isInWorkFlow = this.procInsId && this.taskId

                //审核时头部展开
                if( this.isInWorkFlow ){
                    this.symbilListTop = this.symbilListTopWorkFlow
                    this.removeDisabledSymbol('AUDITING-SUBMIT', this.disabledSymbolsTop)
                    this.isTopHide = false
                }
            },

            //初始化变更单内容
            initOrderData: function (){

                //审核时头部展开
                if( this.isInWorkFlow ){

                    workFlowMethods.getBusinessKeyByProcInsId(this.procInsId).then(res => {
                        this.orderId = res
                        this.initOrderDataDO()
                    }).catch(e => {
                        this.orderId = e
                        this.initOrderDataDO()
                    })
                }else{
                    this.initOrderDataDO()
                }

            },

            initOrderDataDO: function (){
                let _this = this
                _this.disabledSymbolsTop = Object.assign([],_this.disabledSymbolsTopDefault)  //每次初始化默认禁用所有操作
                methods.orderDetail(this.yid || null, +Cookie.get('t8t-tc-uid'), this.orderId).then(res => {
                    if( res.data.status == 200 ){
                        let orderResult = res.data.result

                        _this.orderInfo = orderResult.order
                        _this.orderItems = orderResult.orderItems

                        //项目管理费
                        _this.projectManagerPrice = _this.orderInfo.projectManagerPrice || 0

                        //不可操作状态（审核中等）项目管理费=接口给出的projectManagerPrice字段
                        _this.$set(this.summaryData.filter((item) => {
                            return item.columnsProp == 'projectManagerPrice'
                        })[0],'totalMoney',_this.projectManagerPrice)

                        //设置税费的展示
                        _this.tax = _this.orderInfo.tax
                        _this.yid = _this.orderInfo.yid

                        //不可操作状态（审核中等）税金=接口给出的tax字段
                        _this.$set(this.summaryData.filter((item) => {
                            return item.columnsProp == 'tax'
                        })[0],'totalMoney',_this.tax)

                        //初始化变更单总额
                        this.computeAmount()

                        //获取项目报价单可用的空间列表
                        this.getSpaces()

                        //拷贝原有数据
                        _this.orderItemsClone = JSON.parse(JSON.stringify(_this.orderItems))

                        //完成初稿(审核驳回)或未初始化 可以暂存
                        if( [0,2].indexOf(_this.orderInfo['orderStatus']) > -1 || _this.isEmpty(_this.orderInfo['id']) ){
                            _this.removeDisabledSymbol('TEMP-SAVE', _this.disabledSymbolsTop)
                        }

                        //完成初稿  可以提交
                        if( [0].indexOf(_this.orderInfo['orderStatus']) > -1 &&  _this.orderInfo.id > 0 ){
                            _this.removeDisabledSymbol('EDIT-SUBMIT', _this.disabledSymbolsTop)
                        }

                        //保存后 可以打印
                        if( _this.orderInfo.id > 0 ){
                            _this.removeDisabledSymbol('PRINT', _this.disabledSymbolsTop)
                        }

                        //审核通过后(报价完成)，允许反审核
                        if( [6].indexOf(_this.orderInfo['orderStatus']) > -1 ){
                            _this.removeDisabledSymbol('ANTI-AUDITING', _this.disabledSymbolsTop)
                        }

                        //完成初稿(审核驳回)可以作废
                        if( [0,2].indexOf(_this.orderInfo['orderStatus']) > -1 &&  _this.orderInfo.id > 0 ){
                            _this.removeDisabledSymbol('VOID', _this.disabledSymbolsTop)
                        }

                        //审核中 可以提交审核
                        if( [1].indexOf(_this.orderInfo['orderStatus']) > -1 &&  _this.orderInfo.id > 0 && _this.isInWorkFlow ){
                            _this.removeDisabledSymbol('AUDITING-SUBMIT', _this.disabledSymbolsTop)
                            /*_this.procInsId = _this.orderInfo['proInsId']
                            _this.taskId = _this.orderInfo['taskId']
                            _this.isInWorkFlow = true

                            //审核时头部展开
                            _this.isTopHide = false*/
                        }

                        //保存后 可以查看审批流
                        if( _this.orderInfo.id > 0 ){
                            _this.removeDisabledSymbol('APPROVAL-FLOW', _this.disabledSymbolsTop)
                        }

                        _this.symbilListTop = _this.symbilListTopDefault
                        if( _this.isInWorkFlow ) {
                            _this.symbilListTop = _this.symbilListTopWorkFlow
                        }
                        //延时重置grid尺寸
                        setTimeout(_=>{
                            let grid = _this.$refs.t8ttable.$refs.table
                            let layout = grid.layout
                            grid.height = ( layout.rowHeight * (grid.data.length+2) ) + (grid.layout.showHeader ? grid.layout.headerHeight : 0)

                            this.resizeSummaryMoneyGrid()
                        },0)

                    }else{
                        return this.$msgbox({
                            title: '消息',
                            type:'error',
                            message: res.data.result || '初始化项目信息出错， 请重试'
                        })
                    }
                }).catch((e) => {
                    return this.$msgbox({
                        title: '消息',
                        type:'error',
                        message:'初始化项目信息出错， 请重试'
                    })
                })
            },

            //展示审批流
            flowBtn() {
                this.$TCS.addTag('red_11732_018003009008')
                this.flowArgs = {
                    "getBusinessKeyDetailDTO":{
                        "orderId":this.orderId   //业务键（一般为业务Id
                    }
                }//其他信息通过后台拼接传递给工作流
                this.isShowFlow = true
            },
            //关闭审批流
            closeStepPage(){
                this.isShowFlow = false
            },

            //获取户型列表
            getHouseTypes: function (){
                //this.getCommonOptions(30004,'houseTypes');
            },


            //收缩头部
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },

            //获取项目报价单可用的空间列表
            getSpaces(){
                methods.getQuoteOrderSpace(this.orderInfo['yid']).then(res => {
                    this.formCommonData['spaces'] = res
                })
            },

            //是否可编辑变更单
            isCanEdit: function (){
                //初始化失败等情况， 不允许后续操作
                return ( this.orderInfo.id == 0 || [0,2].indexOf(this.orderInfo['orderStatus']) > -1 )
            },

            closeQuoteChangeOrderDialog(){
                this.$router.push('/tochat-worker/quote-changeorder-list')
                //this.$emit('close')
            },

            /*
            * 重新设置grid的展示尺寸
            * bomIndex grid集合中的索引值
            * */
            resizeGrid(gridIndex){
                let _this = this

                //延时处理
                _this.$nextTick(_=>{
                    let  grid = this.$refs.t8ttable.$refs.table
                    let layout = grid.layout
                    grid.height = ( layout.rowHeight * (grid.data.length+2) ) + (grid.layout.showHeader ? grid.layout.headerHeight : 0)
                })
            },

            resizeSummaryMoneyGrid(){
                let grid = this.$refs.summarytable.$refs.table
                let layout = grid.layout
                grid.height = ( layout.rowHeight * (grid.data.length+1) ) + (grid.layout.showHeader ? grid.layout.headerHeight : 0)
            },

            addDisabledSymbol: function (symbol, disabledSymbolObj = ''){
                disabledSymbolObj = disabledSymbolObj || this.disabledSymbolsTop
                let _index = disabledSymbolObj.indexOf(symbol)
                if( _index == -1 ){
                    disabledSymbolObj.push(symbol)
                }
            },

            removeDisabledSymbol: function (symbol, disabledSymbolObj = ''){
                disabledSymbolObj = disabledSymbolObj || this.disabledSymbolsTop
                let _index = disabledSymbolObj.indexOf(symbol)
                if( _index > -1 ){
                    disabledSymbolObj.splice(_index,1)
                }

            },



            /**
             * 获取辅助资料
             * @param fatherCode 辅助资料分组code
             * @param selectName 被赋值的对象名
             * @param valueKey value的字段名
             * @param textKey text的字段名
             */
            getCommonOptions: function(fatherCode,selectName, valueKey='id', textKey='propertyName') {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                apiCommon.queryUnionParent(arg).then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus===1) {
                                list.push({
                                    value: item[valueKey],
                                    text: item[textKey],
                                    code: item["propertyCode"]
                                })
                            };
                        })
                        this.formCommonData[selectName] = list
                    }
                })
            },
            isEmpty(str){
                return str == null || str == 0 || str == '' || str == undefined || str == '0'
            },
            isNull(str){
                return str == null || str == '' || str == undefined
            },
        }

    }
</script>
<style>

    .quoteChangeOrderDetail .top-hide{
        position: absolute;
        top: 48px;
        right: 10px;
        z-index: 1;
        transform: rotate(90deg);
        cursor: pointer;
    }
    .quoteChangeOrderDetail.isHide .top-hide{
        transform: rotate(-90deg);
    }
    .quoteChangeOrderDetail.isHide .headerForm{
        height: 0;
        padding-top: 0;
        overflow: hidden;
    }

    .quoteChangeOrderDetail .remove-item{
        margin: auto 5px;
    }

    /*解决表格数据过多导致头部隐藏问题*/
    .quoteChangeOrderDetail .full-dialog-form-container {
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
        overflow: initial;
    }

    /*解决小屏幕出现小表格横向滚动条问题*/

    @media screen and (max-height: 900px) {
        body{
            min-width:1360px;
        }
        .quoteChangeOrderDetailDialog{
            min-width: 1360px;
        }

        .quoteChangeOrderDetailDialog .el-dialog__body{
            min-width: 1360px;
        }

        .quoteChangeOrderDetailDialog .quoteChangeOrderItemPanel{
            min-width: 1360px;
        }

        .t8t-full-dialog .toolbar-container{
            width:100%;
        }

        /*.quoteChangeOrderDetailDialog .el-table {
            overflow: initial;
            width: initial;
            max-width:none;
        }*/
        .quoteChangeOrderDetailDialog .el-table__body{
            width:100% !important;
        }

        .quoteChangeOrderDetailDialog .summaryMoney{
            min-width: 1360px;
        }

        .quoteChangeOrderDetailDialog .summaryMoney .el-table {
            max-width:100%;
        }
        .quoteChangeOrderDetailDialog .summaryMoney .el-row {
            display: flex;
        }
    }
    t8t-full-dialog .full-dialog-toolbar-container{
        height: 38px;
        background-color: #1e3246;
    }
    .t8t-full-dialog2 .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3246;
    }
    .t8t-full-dialog2 .toolbar-container .el-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3246;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .t8t-full-dialog2 .toolbar-container .el-button:hover{
        color: #1e3246;
        background-color: #d2deeb;
    }
</style>
