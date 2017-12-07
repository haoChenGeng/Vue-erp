/**
* Created by tomy.li on 2017/08/25.
*/
<template>
    <div class="" v-loading.fullscreen.lock="isLoadingAmount" element-loading-text="正在预估用量，请稍候 ...">
        <div class="quoteSelectionList">
        <el-dialog size="full" class="my-el-dialog t8t-full-dialog quoteSelectionListDialog" v-model="quoteOrderDialogVisible" @close="closeQuoteOrderDialog" :show-close="false" :close-on-press-escape="false" :class="{'isHide': isTopHide}">

            <!--操作区-->
            <div class="full-dialog-toolbar-container">
                <!--['PREVIEW','TEMP-SAVE','EDIT-SUBMIT','UNDO','RESET','APPROVAL-FLOW','LOG-EDIT']-->
                <div class="toolbar-container">
                    <t8t-toolbar ref="topToolbar"
                                 class="headerToolbar"
                                 :symbolList="['PREVIEW','TEMP-SAVE','EDIT-SUBMIT']"
                                 :disabledSymbols="disabledSymbols"
                                 @TEMP-SAVE="tempSave()"
                                 @EDIT-SUBMIT="submit()"
                                 @PREVIEW="preview()"
                                 @SYNC-TEMP="syncDataFromTemp()"
                    >
                    </t8t-toolbar>
                    <div>
                        <el-button @click="jumpToQuoteOrderDetail()">报价单</el-button>
                        <el-button @click="selectQuoteDelivery()">添加组合</el-button>
                        <!--<el-button @click="syncAmountMain()">系统建议用量</el-button>-->
                    </div>
                </div>
            </div>
            <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
            <!--表头-->
            <t8t-form-panel
                :dataSource="quoteOrderInfo"
                :fields="formFields"
                :commonData="formCommonData"
                :disabled="!canProjectInfoEdit"
                class="headerForm"
                ref="quoteObjectForm">
            </t8t-form-panel>

            <!--
                空间报价项
            -->
            <div class="quoteSelectionItemPanel">
                <template>
                    <el-row v-for="(gdm, index) in gdmData">
                        <el-col :span="24">
                            <div class="space-content">
                                <el-row style="display: flex;flex-direction: row;">
                                    <el-col :span="2" class="spaceNameBox">
                                        <div class="space-data">
                                            <div v-if="!index" class="space-data-header">品类</div>

                                            <div class="space-data-body">
                                                <div class="space-name space-data-body-text" >
                                                    <div class="space-name-text">
                                                        {{gdm.gdmName}}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </el-col>
                                    <el-col :span="22" class="gridBox">

                                        <t8t-grid
                                            :class="{hideheader:index}"
                                            :columns="mainTableColumns"
                                            :dataSource="gdm['list']"
                                            :commonData="selectSource"
                                            :editable="true"
                                            :indexCol="false"
                                            :selectCol="false"
                                            :showHeader="!index"
                                            :pageBar="false"
                                            :row-style="rowStyle"
                                            :stripe="false"
                                            :preLoad="false"
                                            :style="!index ? 'border-top: 1px solid #dfe6ec' : ''"
                                            @headerDragend="headerDragend"
                                            @cell-click="cellClick"
                                            @cell-editor-change="cellEditorChange"
                                            ref="t8ttable"
                                        >

                                            <!-- 删除组合-->
                                            <template scope="scope" slot="spaceName" :class="cell-text">
                                                <div class="cell-text" style="float: left;">
                                                    <el-button type="danger" size="mini" class="remove-spaceitem" @click="deleteQuoteDelivery(scope)" title="删除组合" ><i class="el-icon-delete el-icon&#45;&#45;left"></i>删除</el-button>
                                                    <span class="selectDeliveryIdHand">{{scope.row.spaceName+'/'+scope.row.spaceAlias}}</span>
                                                </div>
                                            </template>

                                            <template scope="scope" slot="productName">
                                                <el-popover trigger="hover" placement="right" v-if="scope.row.deliveryId != 0 && scope.row.deliveryId != undefined">
                                                    <div class="skuinfo-popover">
                                                        <div class="skuinfo-popover-content">
                                                            <div class="skuImage">
                                                                <div>
                                                                   <img width="170" height="170" v-bind:src="'http://pic.to8to.com' + (scope.row.hasOwnProperty('goodsImgs') && scope.row.goodsImgs.length > 0 &&  (JSON.parse(scope.row.goodsImgs).length) ? JSON.parse(scope.row.goodsImgs)[0] : '') "/>
                                                                </div>
                                                            </div>

                                                            <div class="skuAttr">
                                                                颜色：    {{scope.row.colorName}}
                                                            </div>
                                                            <div class="skuAttr">
                                                                <!--尺寸：   910*127-->
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div slot="reference" class="name-wrapper">
                                                        <div class="cell-text" style="float: left;">
                                                            <el-button type="danger" size="mini" class="remove-delivery" :name="removeDelivery" @click.stop="removeDelivery(scope.row.qiName, scope.row, index, scope)" title="清除选品" :disabled="!isCanEdit(scope.row)"><i class="el-icon-circle-close el-icon&#45;&#45;left"></i> 选品</el-button>
                                                            <!--&& scope.row.tempItemType != 0 非标准品才选品 -->
                                                            <el-button
                                                                type="primary"
                                                                size="mini"
                                                                class="remove-delivery"
                                                                :name="addChildDelivery"
                                                                @click.stop="addChildDelivery(scope.row, index, scope)"
                                                                title="增加组件" :disabled="!isCanEdit(scope.row)"
                                                                v-if="isBomItem(scope)">
                                                                <i class="el-icon-plus el-icon-left"></i>组件
                                                            </el-button>
                                                        </div>
                                                        <span class="selectDeliveryIdHand">{{ scope.row.productName ? scope.row.productName : '*******'}}</span>
                                                    </div>
                                                </el-popover>
                                                <div slot="reference" class="name-wrapper" v-if="(scope.row.deliveryId == 0 || scope.row.deliveryId == undefined)">
                                                    <span class="selectDeliveryIdHand">*******</span>
                                                </div>
                                            </template>

                                            <template scope="scope" slot="craftDetails">
                                                <el-popover trigger="hover" placement="bottom">
                                                    <div class="craftDetails-popover">{{scope.row.craftDetails}}</div>
                                                    <div slot="reference" class="name-wrapper">
                                                        <div class="cell-text">{{scope.row.craftDetails}}</div>
                                                    </div>
                                                </el-popover>
                                            </template>

                                        </t8t-grid>

                                    </el-col>
                                </el-row>
                            </div>
                        </el-col>
                    </el-row>
                </template>
            </div>

        </el-dialog>

        </div>
        <transition name="back-top-fade">
            <div
                class="page-component-up"
                v-show="showBackToTop"
                @mouseenter="hover = true"
                @mouseleave="hover = false"
                @click="toTop">
                <i class="el-icon-caret-top" title="回到顶部"></i>
            </div>
        </transition>
        <selectSkuDialog
            v-if="selectSkuVisible"
            @close="closeSelectSkuDialog"
            @open="selectSkuVisible===true"
            :activeTableRef="selectSkuRef"
            :currentGdmId="currentGdmId"
            :currentCategoryId="currentCategoryId"
            :orgId="orgId"
            :breadcrumbData="breadcrumbData"
            :currentRow="currentRow"
            :isAddingChildBom="isAddingChildBom"
            :parentBomGdmId="hotParentBomGdmId"
        >
        </selectSkuDialog>

        <select-quote-delivery
            v-if="selectQuoteDeliveryVisible"
            @close="selectQuoteDeliveryVisible=false"
            @open="selectQuoteDeliveryVisible===true"
            :yid="yid"
        >
        </select-quote-delivery>
    </div>
</template>
<script>
    import config from './config.js'
    import methods from 'src/services/worker/quoteorder/methods.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import selectSkuDialog from 'src/views/m-worker/quote/m-quoteorder/selectSku.vue'
    import selectQuoteDelivery from 'src/views/m-worker/quote/m-quoteorder/selectQuoteDelivery.vue'
    import Cookie from 'js-cookie'
    import formula from 'src/services/formula/methods.js'
    import organization from 'src/services/system/organization.js'
    import throttle from 'throttle-debounce/throttle';
    export default {
        name: "quoteSelectionList",
        components: {selectSkuDialog,selectQuoteDelivery},
        created() {
        },
        watch:{
            "$route.query": function (val,oldval){
                this.initQuoteSelectionList()
            }
        },
        mounted:function(){

            function scroll(fn) {
                document.querySelector('.el-dialog--full').addEventListener('scroll', () => {
                    fn();
                }, false);
            }
            scroll(() => {
            });
            this.throttledScrollHandler = throttle(300, this.handleScroll);
            document.querySelector('.el-dialog--full').addEventListener('scroll', this.throttledScrollHandler);

            this.initParams()
            this.initQuoteSelectionList()
            this.getHouseTypes()
        },
        data(){
            return {
                mainIndex:1,
                tempId:'', //模板
                yid:'', //户型
                orgId:'',//组织id
                area:'',
                houseTypeId:'',
                childSpacesList:[], //可选的子空间
                quoteItemsUnstandard:[], //可选的个性化报价项
                quoteOrderInfo:{}, //报价单基本信息
                quoteOrderDialogVisible:true,
                selectQuoteTempItemVisible:false,
                selectSkuVisible:false,
                selectQuoteDeliveryVisible:false,
                currentGdmId:null,
                currentCategoryId:null,
                breadcrumbData:[],
                hotGdmIndex:null,
                hotBomIndex:null,
                hotParentBomGdmId:0,  //父bomId
                currentRow:null,
                formFields: config.formFields,
                deleteList:[],
                skuInfo:{},
                skuInfoLoading: false,
                dialogVisible:false,
                canProjectInfoEdit:true, //是否可编辑
                isAddingChildBom:false, //是否为添加组件操作
                disabledSymbols:['PREVIEW','TEMP-SAVE','EDIT-SUBMIT'],
                isLoadingAmount:false,
                isTopHide: false,
                formCommonData: {
                    'order_status': config.datas.order_status,
                    'houseTypes':[],
                },
                selectSource:{
                    'places': [],
                    'detailStatus': config.datas.detailStatus,
                },
                gdmData:[
                ],
                gdmDataClone:[],
                mainTableColumns:[
                    {
                        "prop": "spaceName",
                        "label": "空间",
                        "resizable": false,
                        formatter(val, row, col, tab) {
                            return row.spaceName+'/'+row.spaceAlias
                        }
                    },
                    {
                        'prop': 'placeName',
                        label: '位置',
                        "resizable": false,
                    },
                    {
                        "prop": "qiName",
                        "label": "报价项",
                        "resizable": false,
                    },
                    {
                        "prop": "productName",
                        "label": "SKU名称",
                        width:300,
                        "resizable": false,
                      /*  onClick: function (a,b,c,d,e,f){

                        }*/
                    },
                    {
                        "prop": "productBrandName",
                        "label": "品牌",
                        "resizable": false
                    },
                    {
                        "prop": "productModel",
                        "label": "型号",
                        "resizable": false
                    },
                    {
                        "prop": "productFormat",
                        "label": "规格（mm）",
                        "resizable": false
                    },
                    {
                        "prop": "actualAmount",
                        "label": "数量",
                        "resizable": false,
                        trigger:'blur',
                        editor:{
                            type:'input',
                            rules:
                                function(val, row , col, tab){
                                    //匹配多于两位的小数
                                    let exp = new RegExp('^[0-9]+(\\.\\d{3,})$')
                                    let max = 100000
                                    return [
                                        {
                                            type:'number',
                                            'validator': (rule, value, callback, source, options) => {

                                                if( typeof(value) != 'number' ){
                                                    callback(false)
                                                }

                                                else if( +value > max ){
                                                    callback(false)
                                                }

                                                //最多精确到两位小数
                                                else if(exp.test(+value)){
                                                    callback(false)
                                                }
                                                else{
                                                    callback()
                                                }
                                            },
                                            //pattern: exp,
                                            message: `请输入${max}以内的数量, 最多精确到两位小数`,
                                            transform (val) {
                                                return +val;
                                            },
                                            trigger:'blur',
                                        },
                                        {type:'number',message:'必须为数值', trigger:'blur'},
                                    ]
                                },
                        },
                        formatter(val, row, col, tab) {
                                return isNaN(val*1) ? val : +val
                        }
                    },
                    /*{
                        "prop": "estimateAmount",
                        "label": "系统建议数量",
                        "resizable": false,
                        formatter(val, row, col, tab) {
                            return val ? +val : 0
                        }
                    },*/
                    {
                        "prop": "tempItemType",
                        "label": "个性化",
                        "resizable": false,
                        formatter(val, row, col, tab) {
                            return row.tempItemType == 1 ? '是' : '否'
                        }
                    },
                    {
                        "prop": "detailStatus",
                        "label": "用量明细状态",
                        "list": 'detailStatus',
                    },

                ],
                hover: false,
                showBackToTop: false
            }

        },
        methods: {

            //是否为成品行
            isBomItem(scope) {
                return (scope.row.isBom == 1
                    && scope.row.needSelect == 1
                    &&  scope.row.bomGdmId == 0
                    && scope.row.deliveryId != null
                    && scope.row.deliveryId != 0
                    && scope.row.deliveryId != undefined)
            },

            //行点击行为
            cellClick: function (row, column, cell, event) {
                //选品
                if( column.property === 'productName' ){

                    if( !this.isCanEdit(row)){
                        return false
                    }

                    this.selectDelivery(row)
                }

                if(column.property === 'actualAmount'){
                    if( !this.isCanEdit(row)){
                        return false
                    }
                }
            },

            /**
             * 添加组件
             * @param row bom所在对象
             * @param gdmIndex bom所在组合的位置索引
             * @param bomIndex bom 在所在组合的位置索引
             */
            addChildDelivery: function (row, hotGdmIndex, hotBomIndex, scope){

                this.hotGdmIndex = hotGdmIndex
                this.hotBomIndex = this.gdmData[hotGdmIndex].list.indexOf(row)
                this.selectDelivery(row, true)
            },

            /**
             * 选品
             * @param row
             * @param isAddChild 是否是增加组件操作
             * @returns {*}
             */
            selectDelivery: function (row, isAddChild = false){
                this.isAddingChildBom = isAddChild
                let gdmId = row.gdmId
                let categoryId = row.categoryId
                //报价项下必须设置了组合用量关系才能继续选择sku
                if( gdmId > 0 && categoryId > 0 && this.isCanEdit(row) ){
                    this.currentGdmId = gdmId
                    this.currentCategoryId = categoryId
                    this.currentRow = row
                    this.breadcrumbData = [{title:row.spaceName+'/'+row.spaceAlias},{title:row.placeName},{title:row.qiName}]
                    this.selectSkuVisible = true

                    /**
                     * 如果是增加组件就设置为当前成品的组合用量关系自增id,
                     * 如果是编辑成品或者编辑组件就设置为当前行对应个bomGdmId，
                     */
                    this.hotParentBomGdmId = isAddChild ? row.gdmItemId : row.bomGdmId
                }else{
                    return this.$message({
                        title: '消息',
                        type: 'warning',
                        'message': '没有匹配到SKU',
                    })
                }
            },

            //组件的确认添加事件 data新增的组件， 多选
            handleChildDelivery: function (data){
                let _this = this
                if( data.length ){
                    let hotGdmData = _this.gdmData[_this.hotGdmIndex]

                    //查找当前成品下的组件个数
                    let bomChildDelivery = hotGdmData.list.filter(i => {
                        return i.detailId == _this.currentRow.dosageDetailId
                    })

                    let bomChildDeliveryLength = bomChildDelivery.length

                    //循环增加组件
                    data.forEach((item, index) => {
                        let temp_data = Object.assign({},item)
                        //在bom的指定位置插入组件
                        _this.gdmData[_this.hotGdmIndex].list.splice(_this.hotBomIndex+bomChildDeliveryLength+index+1,0,temp_data)
                    })

                    this.resizeGrid(_this.hotGdmIndex)
                }
            },

            /*
            *修改了bom之后触发
            * dosageDetailId 成品的用量明细id
            * */
            handlerChangeBom: function (bomDosageDetailId, row){
                //当前组件的子组件

                //获取当前成品所处的tab
                let hotGdmIndex = null
                this.gdmData.forEach((i,index) => { if(i.list.includes(row)){hotGdmIndex = index} })

                if( hotGdmIndex !== null ){
                    let table = this.$refs.t8ttable[hotGdmIndex]
                    //当前组件的子组件
                    let childBom = table.dataSource.filter(i => {
                        return i.detailId == bomDosageDetailId
                    })

                    if(childBom.length){
                        childBom.forEach(i => {
                            table.dataSource.splice(table.dataSource.indexOf(i),1)
                            if( !this.isEmpty(i.dosageDetailId) ){
                                this.deleteList.push(i.dosageDetailId)
                            }
                        })
                        this.resizeGrid(hotGdmIndex)
                    }
                }else{
                    return
                }

            },

            /*
            * 重新设置grid的展示尺寸
            * bomIndex grid集合中的索引值
            * */
            resizeGrid(bomIndex){
                let _this = this

                //延时处理
                _this.$nextTick(_=>{
                    let  grid = this.$refs.t8ttable[bomIndex].$refs.table
                    let layout = grid.layout
                    grid.height = ( layout.rowHeight * (grid.data.length+2) ) + (grid.layout.showHeader ? grid.layout.headerHeight : 0)
                })
            },
            //清除选品
            removeDelivery: function (val, row, tableIndex, scope){
               let table = this.$refs.t8ttable[tableIndex]

                //如果是成品
                if( row.bomGdmId == 0 ){

                    //当前组件的子组件
                    let childBom = table.dataSource.filter(i => {
                        return i.bomGdmId == row.gdmItemId
                    })

                    if(childBom.length){

                        childBom.forEach(i => {
                            table.dataSource.splice(table.dataSource.indexOf(i),1)
                            if( !this.isEmpty(i.dosageDetailId) ){
                                this.deleteList.push(i.dosageDetailId)
                            }
                        })
                        this.resizeGrid(tableIndex)
                    }

                }else{
                    if( !this.isEmpty(row.dosageDetailId) ){
                        this.deleteList.push(row.dosageDetailId)
                    }

                    table.dataSource.splice(table.dataSource.indexOf(row),1)
                    this.resizeGrid(tableIndex)
                }

                this.cleanDeliveryData(row)
            },

            //清除一行选品的数据
            cleanDeliveryData(row){
                row.deliveryId = 0
                row.deliveryName = ''
                row.colorName = ''
                row.goodsImgs = ''
                row.basicUnit = 0
                row.productName = '';
                row.productBrandName = '';
                row.isBom = '';
                row.needSelect = '';
                row.productFormat = '';
                row.productModel = '';
                row.gdmItemId = '';
                row.estimateAmount = 0
                row.actualAmount = 0

            },

            //获取被删除的选品行列表
            getDeleteList(){
                return this.deleteList
            },

            //保存前整理数据
            formatSelectionItemListToSave(){
                let list = []
                this.gdmData.forEach(i => {
                    i.list.forEach(item => {
                        list.push({
                            id: item.dosageDetailId || null,
                            deliveryId:item.deliveryId,
                            estimateAmount:item.estimateAmount || 0,
                            actualAmount:item.actualAmount || 0,
                            basicUnit:item.basicUnit,
                            detailId:item.detailId || null, //父组件id
                        })
                    })
                })

                return list
            },

            hideSkuInfo: function (scope){
                this.skuInfoLoading = false
            },
            //是否可进行数据编辑
            isCanEdit: function (row){
                //用量明细状态需要是待提交审核或者待要货时才可编辑选品
                return [0,3].indexOf(row.detailStatus) > -1 || this.isEmpty(row.dosageDetailId)
            },

            //添加组件
            selectQuoteDelivery: function (){
                this.selectQuoteDeliveryVisible = true

                this.$TCS.addTag('red_13152_018003005013')
            },
            tempSave: function (){
                let tables = this.$refs.t8ttable
                this.validateData(tables, 0)
            },

            //暂存报价单(新建及编辑)
            tempSaveDo: function (){
                this.$TCS.addTag('red_10483_018003008002')
                this.addDisabledSymbol('TEMP-SAVE', this.disabledSymbols);

                let orderInfo  = this.quoteOrderInfo
                let data = {
                    "projectId": orderInfo.yid, //项目ID
                    "deleteList":this.getDeleteList(),//删除的用量明细id集合
                    "list": this.formatSelectionItemListToSave(),//增加及修改的用量明细
                }
                methods.saveSelectionList(data,+Cookie.get('t8t-tc-uid')).then((res) => {
                    if(res.data.status == 200){
                        this.$message({
                            type: 'success',
                            message: '暂存成功'
                        })
                        this.initQuoteSelectionList()
                    }else{
                        this.removeDisabledSymbol('TEMP-SAVE', this.disabledSymbols)
                        this.$msgbox({
                            title:'',
                            type: 'error',
                            message: res.data.result || res.data.message
                        })
                    }
                })

            },

            //删除选品
            deleteQuoteDelivery: function (scope){

                let quoteOrderItemId =scope.row.orderItemId
                let accountId =+Cookie.get('t8t-tc-uid')
                methods.deleteQuoteDelivery(quoteOrderItemId,accountId).then(res=>{
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    //刷新页面
                    this.initQuoteSelectionList()
                }).catch(e=>{
                    return this.$message({
                        title: '消息',
                        type: 'warning',
                        'message': e,
                    })
                })

                this.$TCS.addTag('red_13152_018003008005')

            },

            //校验数据合法性， 递归校验不定数的table对象
            validateData: function (tables,tableIndex){
                if( tables.length == 0 ){
                    this.tempSaveDo()
                }else{
                    //递归校验table数据
                    tables[tableIndex].validate((isValid) => {
                        if (isValid) {

                            if( tables.length == tableIndex+1 ){
                                this.tempSaveDo()
                            }else{
                                this.validateData(tables, tableIndex+1)
                            }

                        }else{
                            //只要有不通过的则不继续校验
                            return false
                        }

                    })
                }
            },


            //初始化页面参数， 从路由抽取参数
            initParams: function (){
                this.yid = this.$route.query.yid //户型
            },

            //初始化项目信息及报价单详情
            initQuoteSelectionList: function (){

                this.initParams()
                this.gdmData = []
                let _this = this
                methods.initQuoteSelectionList(this.yid, +Cookie.get('t8t-tc-uid')).then(res => {
                    let _topToolbar = _this.$refs['topToolbar']

                    let quoteOrder = res.quoteOrder

                    //初始化报价单基本信息
                    _this.quoteOrderInfo = Object.assign({},quoteOrder)
                    _this.orgId = quoteOrder.orgId

                    //创建了报价单才能点击暂存
                    if( _this.quoteOrderInfo.hasOwnProperty('id') && _this.quoteOrderInfo.id > 0 ){
                        _this.removeDisabledSymbol('TEMP-SAVE', _this.disabledSymbols)
                    }

                    //创建了报价单不为完成初稿才能点击提交
                    if( _this.quoteOrderInfo.hasOwnProperty('id') && _this.quoteOrderInfo.id > 0 && ([0].indexOf(_this.quoteOrderInfo['orderStatus']) == -1) ){
                        _this.removeDisabledSymbol('EDIT-SUBMIT', _this.disabledSymbols)
                    }

                    //“完成初稿”、“主管审核驳回”、“核算审核驳回” 可以编辑项目信息
                    if( [0,2,5].indexOf(_this.quoteOrderInfo['orderStatus']) > -1 ){
                        _this.canProjectInfoEdit = true
                    }

                    if( _this.quoteOrderInfo.hasOwnProperty('id') ){
                        _this.removeDisabledSymbol('PREVIEW', _this.disabledSymbols)
                    }

                    _this.gdmData = res.list

                    //延时处理
                    setTimeout(_=>{
                        let grids = _this.$refs.t8ttable
                        if( grids && grids.length ){
                            grids.forEach((gridItem,index) => {
                                let grid = grids[index].$refs.table
                                let layout = grid.layout
                                grid.height = ( layout.rowHeight * (grid.data.length+2) ) + (grid.layout.showHeader ? grid.layout.headerHeight : 0)
                            })
                        }
                    },0)

                    //拷贝原有数据
                    _this.gdmDataClone = JSON.parse(JSON.stringify(_this.gdmData))
                }).catch(res => {

                })

            },

            //提交选品单
            submit: function (){
                let _this = this
                let _topToolbar = _this.$refs['topToolbar']

                this.$confirm('提交前请确认选品信息完整无误。是否继续提交？','提示',{
                    type: 'warning',
                    confirmButtonText: '继续提交',
                    cancelButtonText: '先不提交',
                }).then(() => {

                    //提交前检测数据变化， 只有保存后才允许提交
                    if( JSON.stringify(this.gdmData) != JSON.stringify(this.gdmDataClone) ) {
                        this.$confirm(
                            '有数据变更，继续提交未保存的数据将丢失，是否继续提交？',
                            '提示',
                            {
                                type: 'warning',
                                confirmButtonText: '继续提交',
                                cancelButtonText: '先不提交',
                            }
                        ).then(() => {
                            _this.$TCS.addTag('red_10483_018003008003')
                            _this.addDisabledSymbol('EDIT-SUBMIT', _this.disabledSymbols)

                            methods.submitSelectionList(this.yid, +Cookie.get('t8t-tc-uid')).then(res => {
                                if( res.data.status == 200 && res.data.result == 1 ){
                                    _topToolbar.unDisableBySymbol('EDIT-SUBMIT')
                                    return this.$msgbox({
                                        title: '消息',
                                        type: 'success',
                                        'message': '提交成功',
                                        callback:function (){
                                            _this.initQuoteSelectionList()
                                        }
                                    })
                                }else{
                                    _this.removeDisabledSymbol('EDIT-SUBMIT', _this.disabledSymbols)
                                    return this.$message({
                                        title: '消息',
                                        type: 'warning',
                                        'message': '提交失败',
                                    })
                                }
                            }).catch(e => {
                                _this.removeDisabledSymbol('EDIT-SUBMIT', _this.disabledSymbols)
                                return this.$message({
                                    title: '消息',
                                    type: 'warning',
                                    'message': '提交失败，请重试',
                                })
                            })
                        })
                    }

                    //直接提交
                    else{
                        _this.$TCS.addTag('red_10483_018003008003')
                        _this.addDisabledSymbol('EDIT-SUBMIT', _this.disabledSymbols)

                        methods.submitSelectionList(this.yid, +Cookie.get('t8t-tc-uid')).then(res => {
                            if( res.data.status == 200 && res.data.result == 1 ){
                                _this.removeDisabledSymbol('EDIT-SUBMIT', _this.disabledSymbols)
                                return this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    'message': '提交成功',
                                    callback:function (){
                                        _this.initQuoteSelectionList()
                                    }
                                })
                            }else{
                                _this.removeDisabledSymbol('EDIT-SUBMIT', _this.disabledSymbols)
                                return this.$message({
                                    title: '消息',
                                    type: 'warning',
                                    'message': '提交失败',
                                })
                            }
                        }).catch(e => {
                            _this.removeDisabledSymbol('EDIT-SUBMIT', _this.disabledSymbols)

                            return this.$message({
                                title: '消息',
                                type: 'warning',
                                'message': '提交失败，请重试',
                            })
                        })
                    }
                })

            },

            //预估用量
            syncAmount_back: function (index){
                let _this = this
                let spaceSizeForms = this.$refs.spaceSizeForm
                spaceSizeForms[index].validate((isValid) => {

                    if(isValid){
                        let constantValues = []
                        let space = this.gdmData[index]
                        let spaceHeight = space.spaceHeight || 0 //空间层高
                        let spaceArea = space.spaceArea || 0 //空间面积
                        let spaceGirth = space.spaceGirth || 0 //空间周长
                        let variable = {} //业务涉及到的变量集合

                        if( !spaceArea || !spaceGirth || !spaceHeight ){
                            return this.$message({
                                title: '消息',
                                type: 'warning',
                                'message': '请填写空间的层高、周长、面积',
                            })
                        }
                        _this.isLoadingAmount = true
                        return new Promise((resolve, reject) => {
                            //获取有效期类型的ID
                            organization.sysGetByCode('003002001').then(r => {
                                if( r.data.status == 200 ){
                                    //有效期类型id
                                    let validTimeType = r.data.result.id
                                    //104代表业务类型是产品包模板，在后台服务硬编码
                                    let useRange = '104-'+_this.quoteOrderInfo.tempId.toString()+'104,'

                                    //常量
                                    let constants = ['墙砖铺贴高度','标准门洞宽度','吊顶扣板空间常量','吊顶扣板面积常量','常量1','常量2','常量3'];

                                    //收集全部常量
                                    return Promise.all(constants.map((constant,index) => {

                                        return formula.getUseInConstant(constant, useRange, validTimeType, Math.round(new Date().getTime()/1000)).then(res=>{

                                            if( res.length ){
                                                let constantValue = res[0].constantValue

                                                constantValues[constant] = constantValue

                                                return constantValues
                                            }else{
                                                return constantValues
                                            }

                                        }).catch(res => {
                                            return constantValues
                                        })


                                    })).then(constantsRes => {
                                        let variable = constantsRes.length ? constantsRes[0]: {}
                                        //收集变量(由于计算公式有一定的不确定性，此处把所有可能影响报价结果的变量统一收集齐全， 由公式自行决定是否引用。
                                        // 如果明确知道某项变量和报价无关请不要传值，否则方式计算会出错)
                                        /*
                                        * 空间个数、报价空间周长、 用量比例、 正常浮动比例 、报价空间面积
                                        * */

                                        if(space.quoteOrderItemList && space.quoteOrderItemList.length ){

                                            let quoteOrderItems = space.quoteOrderItemList.filter(item => {
                                                //已选公式, 且为报价项行
                                                return item.hasOwnProperty('amountEquationId') && !this.isEmpty(item.amountEquationId)
                                            })

                                            let itemCount = quoteOrderItems.length
                                            let syncNumber = 0

                                            if( itemCount ){
                                                quoteOrderItems.forEach((item) => {
                                                    variable["报价项数量"] = item.amount //报价单中填写的数量
                                                    variable["商品长"] = ''//来源为商品属性 （已选品后才能知道商品长，提交后后端接口自行计算）
                                                    variable["商品宽"] = ''//来源为商品属性
                                                    variable["用量比例"] = '' //用量比例 （报价项用不到比例， 提交后后端自行计算）

                                                    //公式ID是报价项的ID
                                                    this.computeAmount(variable, item.amountEquationId).then(res => {
                                                        item.amount = res
                                                        syncNumber ++;
                                                        if( syncNumber == itemCount){
                                                            _this.isLoadingAmount = false
                                                        }
                                                    }).catch(e => {
                                                        syncNumber++;
                                                        if( syncNumber == itemCount){
                                                            _this.isLoadingAmount = false
                                                        }
                                                    })


                                                })
                                            }else{
                                                _this.isLoadingAmount = false
                                            }

                                        }else{
                                            _this.isLoadingAmount = false
                                        }
                                    }).catch(e => {
                                        //TODO 预估用量失败是警告还是默认不做反应
                                        _this.isLoadingAmount = false
                                        return ;
                                    })

                                }else{
                                    reject('预估用量失败(查询有效期类型辅助资料失败)， 请重试')
                                }
                            }).catch(e => {
                                reject('预估用量失败(查询有效期类型辅助资料异常)， 请重试')
                            })

                        })

                    }else{
                        //只要有不通过的则不继续校验
                        return false
                    }

                })

            },

            syncAmountMain: function (){
                let gdmData = this.gdmData
                if( gdmData.length ){
                    gdmData.forEach((item, index) => {
                        this.syncAmount(item, index);
                    })
                }
            },
            //预估用量
            syncAmount: function (items, index){
                let _this = this
                let constantValues = [] //常量集合
                let gdmData = this.gdmData[index]

                let variable = {} //业务涉及到的变量集合
                _this.isLoadingAmount = true
                return new Promise((resolve, reject) => {
                    //有效期类型CODE 创建时间
                    let validTimeTypeCode = '003002001'
                    //104代表业务类型是产品包模板，在后台服务硬编码
                    let useRange = '104-'+_this.tempId.toString()+'104,'

                    //常量
                    let constants = ['墙砖铺贴高度','标准门洞宽度','吊顶扣板空间常量','吊顶扣板面积常量','常量1','常量2','常量3'];

                    //收集全部常量
                    return Promise.all(constants.map((constant,index) => {

                        return formula.getUseInConstant(constant, useRange, validTimeTypeCode, Math.round(new Date().getTime()/1000)).then(res=>{

                            if( res.length ){
                                let constantValue = res[0].constantValue

                                constantValues[constant] = constantValue

                                return constantValues
                            }else{
                                return constantValues
                            }

                        }).catch(res => {
                            return constantValues
                        })


                    })).then(constantsRes => {
                        let variable = constantsRes.length ? constantsRes[0]: {}

                        if( gdmData.list.length ){

                            let selectionItems = gdmData.list.filter(item => {
                                //已选公式, 且为报价项行
                                return item.hasOwnProperty('dosageEquationId') && !this.isEmpty(item.dosageEquationId)
                            })

                            let itemCount = selectionItems.length

                            //已同步的数量
                            let syncNumber = 0

                            if( itemCount ){
                                selectionItems.forEach((item) => {

                                    //空间个数、报价空间周长、 用量比例、 正常浮动比例 、报价空间面积
                                    variable["空间个数"] = item.mainHouseSpaceCount || 0
                                    variable["报价空间周长"] = item.spaceGirth || 0
                                    variable["用量比例"] = item.dosagePercent || 0
                                    variable["正常浮动比例"] = item.floatPercent || 0
                                    variable["报价空间面积"] = item.spaceGirth || 0

                                    //公式ID是报价项的ID
                                    this.computeAmount(variable, item.dosageEquationId).then(res => {
                                        item.estimateAmount = res
                                        syncNumber ++;
                                        if( syncNumber == itemCount){
                                            _this.isLoadingAmount = false
                                        }
                                    }).catch(e => {
                                        syncNumber++;
                                        if( syncNumber == itemCount){
                                            _this.isLoadingAmount = false
                                        }
                                    })


                                })
                            }else{
                                _this.isLoadingAmount = false
                            }

                        }else{
                            _this.isLoadingAmount = false
                        }
                    }).catch(e => {
                        //TODO 预估用量失败是警告还是默认不做反应
                        _this.isLoadingAmount = false
                        return ;
                    })


                })


            },

            //请求服务计算用量
            computeAmount: function (variable,amountEquationId){

                return new Promise(function (resolve, reject){
                    let variableTemp = {};
                    //获取公式的详情
                    formula.findById(amountEquationId).then(res => {
                        if(res.data.status === 200){
                            let formulaInfo = res.data.result
                            //从变量集合中取出公式需要用到的变量, 多传漏传公式都会报错
                            if( formulaInfo.hasOwnProperty('paramMap') ){
                                Object.keys(formulaInfo.paramMap).forEach(i => {
                                    if( Object.keys(variable).indexOf(i) > -1 ){
                                        variableTemp[i] = variable[i]
                                    }
                                })
                            }

                            resolve(variableTemp)
                        }else{
                            reject()
                        }

                    })
                }).then(variableTemp => {

                    return new Promise(function (resolve, reject){
                        formula.formulaGetResult(amountEquationId, variableTemp).then(res => {
                            if( res.data.status == 200 ){
                                resolve(res.data.result)
                            }else{
                                reject()
                            }
                        })
                    })

                }).catch(e => {
                    return 0
                })
            },

            isEmpty(str){
                return str == null || str == 0 || str == '' || str == undefined || str == '0'
            },
            isNull(str){
                return str == null || str == '' || str == undefined
            },
            rowStyle(row,index){
                //return row.dataType == 1 ? [{'background-color':'rgb(245, 245, 250)'}] : [{'background-color':'#ffffff'}]
            },

            //获取全局唯一index
            getMainIndex(){
                return ++this.mainIndex
            },

            //清除掉页面数据,  避免路由参数变化后历史数据有所遗留
            cleanPageData: function (){
                this.gdmData = []
                this.quoteOrderInfo = {}
            },
            closeQuoteOrderDialog: function (){
                this.$router.push('/tuchat-worker/quote-project-list')
            },
            closeSelectSkuDialog: function (){
                this.selectSkuVisible = false
            },
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },

            jumpToQuoteOrderDetail: function (){
                this.$router.push({path:'/tuchat-worker/quote-order-detail',query:{'yid':this.yid}})
            },
            //获取户型数据
            getHouseTypes: function (){
                this.getCommonOptions(30004,'houseTypes');
            },

            //获取辅助资料
            getCommonOptions: function(fatherCode,selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                apiCommon.queryUnionParent(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus === 1) {
                                list.push({
                                    value: item.id,
                                    text: item.propertyName
                                })
                            }
                        })
                        this.selectSource[selectName] = list
                        this.formCommonData[selectName] = list
                    }
                })
            },
            syncDataFromTemp: function (){
                let _this = this
                methods.syncTempToQuoteAndSelection(this.quoteOrderInfo.id, +Cookie.get('t8t-tc-uid')).then( res => {
                    _this.initQuoteSelectionList()
                }).catch(e => {
                    return _this.$msgbox({
                        'type' : 'error',
                        'message': e || '同步失败',
                        'title':'',
                    })
                })
            },

            addDisabledSymbol: function (symbol, disabledSymbolObj = ''){
                disabledSymbolObj = disabledSymbolObj || this.disabledSymbols
                let _index = disabledSymbolObj.indexOf(symbol)
                if( _index == -1 ){
                    disabledSymbolObj.push(symbol)
                }
            },

            removeDisabledSymbol: function (symbol, disabledSymbolObj = ''){
                disabledSymbolObj = disabledSymbolObj || this.disabledSymbols
                let _index = disabledSymbolObj.indexOf(symbol)
                if( _index > -1 ){
                    disabledSymbolObj.splice(_index,1)
                }

            },

            //新增组合回调
            handleCommandQuoteItemForAddDosageDetail(data){
                //调用后台接口，新增组合
                let accountId = +Cookie.get('t8t-tc-uid')
                let dto =data
                dto.orgId=this.quoteOrderInfo.orgId

                dto.yid=this.quoteOrderInfo.yid
                dto.sourceOrderId=this.quoteOrderInfo.id
                dto.createUser=accountId
                dto.orderId=this.quoteOrderInfo.id
                dto.tempItemCode=data.itemCode
                methods.insertSingeQuoteItemAndDosageDetail(dto,accountId).then(res=>{
                            //重新加载选品页面
                            this.initQuoteSelectionList()
                        } ).catch(e=>{
                            this.$msgbox({
                                title:'',
                                type: 'error',
                                message: e
                            })
                })

                this.$TCS.addTag('red_13152_018003008006')
            },

            /*回到顶部*/
            toTop() {
                debugger
                this.hover = false;
                this.showBackToTop = false;
                document.querySelector('.el-dialog--full').scrollTop = 0
            },
            handleScroll() {
                this.showBackToTop = (document.querySelector('.el-dialog--full').scrollTop) >= 50;
            }
        },

        beforeDestroy() {
            document.querySelector('.el-dialog--full').removeEventListener('scroll', this.throttledScrollHandler);
        },
    }
</script>

<style>
    html,body
    {
        height: 100%;
    }
    .quoteSelectionList .t8t-form-panel{
        margin:0 auto;
    }
    .quoteSelectionItemPanel .space-content{
        border-bottom: 1px solid #dfe6ec;
        text-align: center;
        min-height: 80px;
    }

    .quoteSelectionItemPanel .t8t-table{
        height: auto
    }

    /*表格最后一行不需要border-bottom*/
    /*.quoteSelectionItemPanel table tbody tr:last-child  td{
        border-bottom: none;
    }*/

    .quoteSelectionItemPanel .el-table{
        border-bottom: none !important;
        border-top: none !important;
        border: none !important;
    }

    /*第一个table需要border-top*/
    /*.quoteSelectionItemPanel .el-table:first-child {
        border-top: 1px solid #dfe6ec;
    }*/

    .quoteSelectionItemPanel .space-data-header{
        height: 40px;
        line-height: 40px;
        background-color: #f5f5fa;
        border-top: 1px solid #dfe6ec;
        border-bottom: 1px solid #dfe6ec;
        text-align: center;
        text-overflow: ellipsis;
        vertical-align: middle;
        box-sizing: border-box;
        font-size: 12px;
        color: #1f2d3d;
        /*border: 1px solid #dfe6ec;*/
        margin: 0;
        /*border-right: none;*/
        font-weight: bolder;
    }

    @media screen and (max-height: 900px) {
        .quoteSelectionItemPanel .space-data-header {
            height: 32px;
            line-height: 32px;
        }
    }
    .quoteSelectionItemPanel .space-data-body{
        min-height: 80px;
       /* height: 100%;*/
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .quoteSelectionItemPanel .space-data-body-text{
        height:60px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .quoteSelectionItemPanel .space-data-body-input-box{
        /*margin: 5px;*/
    }
    .quoteSelectionItemPanel .space-data{
        border-right: 1px solid #dfe6ec;
        height:100%;
    }
    .quoteSelectionList .summary-header{
        text-align: left;
        padding-left:20px;
    }
    .selectDeliveryIdHand{
        cursor: pointer;
    }
    .remove-spaceitem{
        margin: auto 5px;
    }
    .remove-delivery{
        margin: auto 5px;
    }
    .craftDetails-popover{
        max-width:350px;
        line-height: 25px;
    }

    .quoteSelectionList .el-table__body-wrapper{
        /*height:auto !important;*/
    }

    /*解决小屏幕出现小表格横向滚动条问题*/

    @media screen and (max-height: 900px) {
        body{
            min-width:1800px;
        }
        .quoteSelectionList{
            min-width: 1800px;
        }
        .quoteSelectionList .el-col-3{
            min-width: 180px;
        }
        .quoteSelectionList .el-col-2{
            min-width: 120px;
        }
        .quoteSelectionList .el-col-6{
            min-width: 360px;
        }
        .quoteSelectionList .el-col-18{
            min-width: 1294px;
        }
        .quoteSelectionList .el-col-22{
            min-width: 1580px;
        }
        .quoteSelectionListDialog .el-dialog__body{
            min-width: 1800px;
        }
        .t8t-full-dialog .toolbar-container{
            width:100%;
        }
        .quoteSelectionList .quoteSelectionItemPanel{
            min-width: 1800px;
        }
        .quoteSelectionList .quoteSelectionItemPanel .el-row {

        }
        .quoteSelectionList .space-content .el-table {
            overflow: initial;
            width: initial;
            max-width:none;
        }
        .quoteSelectionList .space-content .el-table__body{
            width:100% !important;
        }

        .quoteSelectionList .summaryMoney{
            min-width: 1654px;
        }
        .quoteSelectionList .summaryMoney .el-table__body{
            width:100% !important;
        }
        .quoteSelectionList .summaryMoney .el-table {
             max-width:100%;
        }
        .quoteSelectionList .summaryMoney .el-row {
            display: flex;
        }
        .quoteSelectionList .headerForm {
           /* min-width:1654px;*/
        }



        /*.quoteSelectionList .el-table__body-wrapper {
               overflow: hidden;
           }
           .quoteSelectionList .el-table__body {
               width:auto !important;
           }*/

    }


    /*end*/

    .quoteSelectionListDialog .top-hide{
        position: absolute;
        top: 48px;
        right: 10px;
        z-index: 1;
        transform: rotate(90deg);
        cursor: pointer;
    }
    .quoteSelectionListDialog.isHide .top-hide{
        transform: rotate(-90deg);
    }
    .quoteSelectionListDialog.isHide .headerForm{
        height: 0;
        padding-top: 0;
        overflow: hidden;
    }

    .quoteSelectionListDialog  .gridBox{
        display: flex;
    }
    .quoteSelectionListDialog  .gridBox .el-table{
        flex:1;
    }
</style>
<style>
    /*.quoteSelectionList .hideheader .el-table__header-wrapper{
        display:none;
    }*/
    .t8t-full-dialog{height: 100%;}
    .t8t-full-dialog .el-dialog__header{
        padding: 0;
    }
    .t8t-full-dialog .el-dialog__body{
        padding: 0;
        height: 100%;
    }
    .t8t-full-dialog .t8t-full-dialog-container{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .t8t-full-dialog .full-dialog-tabs-container{
        flex: 1;
        margin-bottom: 20px;
    }
    .t8t-full-dialog .full-dialog-toolbar-container{
        height: 38px;
        background-color: #1e3246;
    }
    .t8t-full-dialog .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3246;
    }
    .t8t-full-dialog .toolbar-container .el-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3246;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .t8t-full-dialog .toolbar-container .el-button:hover{
        color: #1e3246;
        background-color: #d2deeb;
    }
    .t8t-full-dialog .container-center{
        width: 1320px;
        margin-left: auto;
        margin-right: auto;
    }
    .t8t-full-dialog .el-form{
       /* display: flex;*/
        flex-wrap: wrap;
    }
    .t8t-full-dialog .form-item-container{
        width: 32%;
    }
    .t8t-full-dialog .full-dialog-form-container{
        margin-top: 0px;
    }
    .t8t-full-dialog .full-dialog-form-container .el-form-item__content{
        width: 180px;
    }
    .t8t-full-dialog .full-dialog-tabs-container{
        display: flex;
    }
    .t8t-full-dialog .el-tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .t8t-full-dialog .el-tabs__header{
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }
    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar{
        height: 1px;
    }
    .t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }
    .t8t-full-dialog .el-tabs__nav-wrap{
        width: 1220px;
        margin: 0 auto;
    }
    .t8t-full-dialog .el-tabs__content{
        flex: 1;
        display: flex;
        /*        width: 1220px;
                margin: 0 auto;*/
    }
    .t8t-full-dialog .el-tab-pane{
        flex: 1;
        overflow: auto;
    }
    .t8t-full-dialog .t8t-table .table-container {
        margin-left: 0;
    }
    .t8t-table{
        border-bottom: 1px solid rgb(223, 230, 236);
    }

    .el-table::after, .el-table::before {
        background-color: #FFFFFF;
    }

    .page-component-up {
        background-color: #58b7ff;
        position: fixed;
        right: 50px;
        bottom: 50px;
        size: 50px;
        width: 50px;
        height: 50px;
        border-radius: 25px;
        cursor: pointer;
        opacity: 0.4;
        transition: .3s;
        z-index:10000
    }
    .back-top-fade-enter,
    .back-top-fade-leave-active {
        transform: translateY(-30px);
        opacity: 0;
    }

    .page-component-up i{
        color: #fff;
        display: block;
        line-height: 50px;
        text-align: center;
        font-size: 22px;
    }

    .page-component-up:hover{
        opacity: 1;
    }


</style>
