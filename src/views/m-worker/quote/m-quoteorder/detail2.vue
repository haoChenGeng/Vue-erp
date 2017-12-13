/**
* Created by tomy.li on 2017/6/1.
*/
<template>
    <div class="" v-loading.fullscreen.lock="isLoadingAmount" element-loading-text="正在预估用量，请稍候 ...">
        <div class="quoteOrderDetail">
        <el-dialog size="full" class="my-el-dialog t8t-full-dialog quoteOrderDetailDialog" v-model="quoteOrderDialogVisible" @close="closeQuoteOrderDialog" :show-close="false" :close-on-press-escape="false" :class="{'isHide': isTopHide}">

            <!--操作区-->
            <div class="full-dialog-toolbar-container">
                <!--['PREVIEW','TEMP-SAVE','EDIT-SUBMIT','UNDO','RESET','APPROVAL-FLOW','LOG-EDIT']-->
                <div class="toolbar-container">
                    <div>
                        <el-button @click="goBack()">返回</el-button>
                    </div>
                    <t8t-toolbar ref="topToolbar"
                                 class="headerToolbar"
                                 :symbolList="['PREVIEW','TEMP-SAVE','EDIT-SUBMIT','RESET','ANTI-AUDITING']"
                                 :disabledSymbols="disabledSymbols"
                                 @TEMP-SAVE="tempSave()"
                                 @EDIT-SUBMIT="submit()"
                                 @RESET="reset()"
                                 @PREVIEW="preview()"
                                 @ANTI-AUDITING="recheck()"
                                 @SYNC-TEMP="syncDataFromTemp()"
                    >
                    </t8t-toolbar>
                    <div>
                        <!--<el-button @click="syncDataFromTemp()" :disabled="quoteOrderInfo.id != 0 && quoteOrderInfo.id != undefined">同步产品包模板</el-button>-->
                        <el-button @click="jumpToSelectionList()" :disabled="quoteOrderInfo.id == 0 || quoteOrderInfo.id == undefined">选品单</el-button>
                    </div>
                </div>
            </div>

            <!--表头-->
            <t8t-form-panel
                :dataSource="quoteOrderInfo"
                :fields="formFields"
                :commonData="formCommonData"
                :disabled="!canProjectInfoEdit"
                class="headerForm"
                ref="quoteObjectForm">
            </t8t-form-panel>
            <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
            <!--
                空间报价项
            -->
            <div class="spaceQuoteItemPanel">
                <template>
                    <el-row v-for="(space, index) in spacesData">
                        <el-col :span="24">
                            <div class="space-content">
                                <el-row style="display: flex;flex-direction: row;">
                                    <el-col :span="2" class="spaceNameBox">
                                        <div class="space-data">
                                            <div v-if="!index" class="space-data-header">使用空间</div>

                                            <div class="space-data-body">
                                                <div class="space-name space-data-body-text" >
                                                    <div class="space-name-text">
                                                        {{space.spaceName}}<br>
                                                        <el-form :model="{'spaceAlias':space['spaceAlias']}" ref="spaceAliasForm">
                                                            <el-form-item
                                                                prop="spaceAlias"
                                                                :rules="[{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },{required: true,message: '不能为空'}]"
                                                            >
                                                                <el-input class="space-number-input spaceAliasInput" v-model="space['spaceAlias']" :disabled="!isCanEdit()"></el-input>
                                                            </el-form-item>
                                                        </el-form>
                                                    </div>
                                                </div>
                                                <div class="space-plus" v-if="space.isParent">
                                                    <el-dropdown @command="handleCommand">
                                                        <el-button type="primary" size="mini" class="add-space" @click="handlerAddSpace(space, index)" :disabled="!isCanEdit()"><i class="el-icon-plus el-icon--left"></i>子空间</el-button>
                                                        <el-dropdown-menu slot="dropdown">
                                                            <el-dropdown-item v-for="(spaceItem, spaceIndex) in childSpacesList" :command="spaceItem.spaceId +'_'+ index">{{spaceItem.spaceName}}</el-dropdown-item>
                                                        </el-dropdown-menu>
                                                    </el-dropdown>
                                                </div>
                                                <div class="space-remove" v-if="!space.isParent">
                                                    <el-button type="danger" size="mini" class="remove-space" @click="removeSpace(space, index)" :disabled="!isCanEdit()" title="删除子空间"><i class="el-icon-delete el-icon--left"></i>删除</el-button>
                                                </div>
                                            </div>

                                        </div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="space-data">
                                            <div v-if="!index" class="space-data-header">尺寸</div>
                                            <div class="space-data-body">
                                                <div class="space-size space-data-body-text">

                                                    <el-form :model="{'spaceArea':space['spaceArea'],'spaceHeight':space['spaceHeight'],'spaceGirth':space['spaceGirth']}"  ref="spaceSizeForm">
                                                        <el-form-item
                                                            prop="spaceArea"
                                                            :rules="spaceSizeRules.spaceArea"
                                                        >
<!--
                                                            <div class="space-data-body-input-box"><span>面积</span><el-input class="space-number-input" :value="space['spaceArea'] ? space['spaceArea'] : ''" @input="changeSpaceArea(spaceArea,space,index)" :disabled="!isCanEdit()"></el-input></div>
-->
                                                            <div class="space-data-body-input-box" ><span>面积</span><el-input @blur="onBlur($event, index, 'spaceArea')"  class="space-number-input"  v-model.number="space['spaceArea']" :disabled="!isCanEdit()"></el-input></div>
                                                        </el-form-item>

                                                        <el-form-item
                                                            prop="spaceGirth"
                                                            :rules="spaceSizeRules.spaceGirth"
                                                        >
                                                            <div class="space-data-body-input-box"><span>周长</span><el-input @blur="onBlur($event, index, 'spaceGirth')" class="space-number-input" v-model.number="space['spaceGirth']" :disabled="!isCanEdit()"></el-input></div>
                                                        </el-form-item>

                                                        <el-form-item
                                                            prop="spaceHeight"
                                                            :rules="spaceSizeRules.spaceHeight"
                                                        >
                                                            <div class="space-data-body-input-box"><span>层高</span><el-input @blur="onBlur($event, index, 'spaceHeight')" class="space-number-input" v-model.number="space['spaceHeight']" :disabled="!isCanEdit()"></el-input></div>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                                <div class="space-plus">
                                                    <el-button type="primary" size="mini" class="add-individuation" @click="openSelectQuoteTempItemDialog(index, space)" :disabled="!isCanEditQuoteOrderItem()"><i class="el-icon-plus el-icon--left"></i>个性化</el-button>
                                                    <el-button type="primary" size="mini" class="add-individuation" @click="addStandardQuoteItem(index,space)" :disabled="!isCanEditQuoteOrderItem()"><i class="el-icon-plus el-icon--left"></i>标配</el-button>
                                                    <el-button type="primary" size="mini" class="add-individuation" @click="syncAmount(index)" :disabled="!isCanEdit()"><i class="el-icon-setting el-icon--left"></i>预估</el-button>
                                                </div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="19">

                                        <t8t-table
                                            :class="{hideheader:index}"
                                            :columns="mainTableColumns2"
                                            :dataSource="space['quoteOrderItemList']"
                                            :commonData="selectSource"
                                            :indexCol="false"
                                            :selectCol="false"
                                            :showHeader="!index"
                                            :editable="isCanEdit()"
                                            :pageBar="false"
                                            :row-style="rowStyle"
                                            :stripe="false"
                                            :style="!index ? 'border-top: 1px solid #dfe6ec' : ''"
                                            @headerDragend="headerDragend"
                                            @cell-click="cellClick"
                                            @cell-editor-change="cellEditorChange"
                                            ref="t8ttable"
                                        >
                                            <template scope="scope" slot="qiName" :class="cell-text">

                                                <!--删除个性化-->
                                                <div class="cell-text" style="float: left;">
                                                    <el-button type="danger" size="mini" class="remove-spaceitem" @click="removeUnStandardQuoteItem(scope.row.qiName, scope.row, index, scope)" title="删除报价项" v-if="scope.row.tempItemType != 0 && scope.row.dataType == 1" :disabled="!isCanEditQuoteOrderItem()"><i class="el-icon-delete el-icon&#45;&#45;left"></i>删除</el-button>
                                                </div>

                                                <!--删除报价项-->
                                                <div class="cell-text" style="float: left;">
                                                    <el-button type="danger" size="mini" class="remove-spaceitem" @click="removeStandardQuoteItem(scope.row.qiName, scope.row, index, scope)" title="删除报价项" v-if="scope.row.tempItemType == 0 && scope.row.dataType == 1" :disabled="!isCanEditQuoteOrderItem()"><i class="el-icon-delete el-icon&#45;&#45;left"></i>删除</el-button>
                                                </div>


                                                <div class="cell-text" :title="scope.row.qiName">
                                                    {{scope.row.qiName}}
                                                </div>

                                                <!--<div class="cell-text" :title="scope.row.qiName">
                                                    {{scope.row.tempItemType == 0 ? scope.row.qiName : ''}}<el-button type="danger" size="mini" class="remove-spaceitem" @click="removeQuoteItem(scope.row.qiName, scope.row, index, scope)" title="删除报价项" v-if="scope.row.tempItemType != 0"><i class="el-icon-delete el-icon&#45;&#45;left"></i>删除</el-button>  {{scope.row.tempItemType == 0 ? '' : scope.row.qiName}}
                                                </div>-->
                                            </template>

                                            <!--
                                                临时版本。 展示sku颜色colorName，尺寸 size
                                            -->
                                            <template scope="scope" slot="deliveryId">
                                                <el-popover trigger="hover" placement="right" v-if="scope.row.deliveryId != 0 && scope.row.deliveryId != undefined && scope.row.dataType==2">
                                                    <div class="skuinfo-popover">
                                                        <div class="skuinfo-popover-content">
                                                            <div class="skuImage">
                                                                <div>
                                                                   <img width="170" height="170" v-bind:src="'http://pic.to8to.com' + (scope.row.hasOwnProperty('goodsImgs') && (JSON.parse(scope.row.goodsImgs).length) ? JSON.parse(scope.row.goodsImgs)[0] : '') "/>
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
                                                            <el-button type="" size="mini" class="remove-delivery" :name="removeDelivery" @click.stop="removeDelivery(scope.row.qiName, scope.row, index, scope)" title="清除选品" :disabled="!isCanEdit()"><i class="el-icon-delete el-icon&#45;&#45;left"></i>删除</el-button>
                                                        </div>
                                                        <span class="selectDeliveryIdHand">{{ scope.row.deliveryName ? scope.row.deliveryName : '*******'}}</span>
                                                    </div>
                                                </el-popover>
                                                <div slot="reference" class="name-wrapper" v-if="(scope.row.deliveryId == 0 || scope.row.deliveryId == undefined) && scope.row.dataType==2">
                                                    <span class="selectDeliveryIdHand">*******</span>
                                                </div>
                                            </template>

                                            <!--
                                                结构化后展示sku信息的版本
                                            -->
                                            <template scope="scope" slot="deliveryIds">
                                                <el-popover trigger="hover" placement="right" @show="showSkuInfo(scope)" @hide="hideSkuInfo(scope)" v-if="scope.row.deliveryId != 0 && scope.row.dataType==2">
                                                    <div class="skuinfo-popover">
                                                        <div class="skuinfo-popover-content" v-if="!skuInfoLoading">
                                                            <div class="skuImage">
                                                                {{skuInfo.image}}
                                                            </div>
                                                            <template v-for="si in skuInfo.attrs">
                                                                <div class="skuAttr">
                                                                    {{si.name}}:{{si.value}}
                                                                </div>
                                                            </template>
                                                        </div>

                                                        <div class="skuLoading" v-if="skuInfoLoading">
                                                            加载中...
                                                        </div>
                                                    </div>

                                                    <div slot="reference" class="name-wrapper">
                                                        <span class="selectDeliveryIdHand">{{ scope.row.goodsName ? scope.row.goodsName : '*******'}}</span>
                                                    </div>
                                                </el-popover>
                                                <div slot="reference" class="name-wrapper" v-if="scope.row.deliveryId == 0 && scope.row.dataType==2">
                                                    <span class="selectDeliveryIdHand">*******</span>
                                                </div>
                                            </template>


                                            <template scope="scope" slot="craftDetails">
                                                <el-popover trigger="hover" placement="bottom"  v-if="scope.row.dataType==1">
                                                    <div class="craftDetails-popover">{{scope.row.craftDetails}}</div>
                                                    <div slot="reference" class="name-wrapper">
                                                        <div class="cell-text">{{scope.row.craftDetails}}</div>
                                                    </div>
                                                </el-popover>
                                            </template>

                                        </t8t-table>

                                    </el-col>
                                </el-row>
                            </div>
                        </el-col>
                    </el-row>
                </template>
            </div>

            <!--
                汇总面板
            -->
            <div class="summaryMoney">
                <div class="summary-header space-data-header">合计</div>
                <div class="summary-body">

                    <el-row>
                        <el-col :span="5">

                            <t8t-table
                                :columns="summaryLeftColumns"
                                :dataSource="summaryLeftData"
                                :indexCol="false"
                                :selectCol="false"
                                :editable="true"
                                :pageBar="false"
                                :showHeader="false"
                                ref="summarylefttable"
                            >
                            </t8t-table>

                        </el-col>
                        <el-col :span="19">
                            <t8t-table
                                :columns="summaryColumns"
                                :dataSource="summaryData"
                                :indexCol="false"
                                :selectCol="false"
                                :editable="true"
                                :pageBar="false"
                                :showHeader="false"
                                ref="summarytable"
                            >
                            </t8t-table>
                        </el-col>
                    </el-row>

                </div>
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
        >
        </selectSkuDialog>

        <selectQuoteTempItemDialog
            v-if="selectQuoteTempItemVisible"
            @close="closeSelectQuoteTempItemDialog"
            @open="selectQuoteTempItemVisible===true"
            :activeTableRef="selectQuoteTempItemVisibleRef"
            :orderSpaceId="selectedSpaceId"
            :orderId=this.quoteOrderInfo.id
        >
        </selectQuoteTempItemDialog>

        <select-quoteTemp
            v-if="dialogVisible"
            @close="dialogVisible=false"
            :yid="yid"
            :orgId="orgId"
        >
        </select-quoteTemp>

        <select-standard-quote-item
            v-if="selectStandardQuoteItemVisible"
            @close="selectStandardQuoteItemVisible=false"
            @open="selectStandardQuoteItemVisible===true"
            :activeTableRef="selectQuoteTempItemVisibleRef"
            :orderSpaceId="selectedSpaceId"
            :orderId=this.quoteOrderInfo.id
        >
        </select-standard-quote-item>



    </div>
</template>
<script>
    import config from './config.js'
    import methods from 'src/services/worker/quoteorder/methods.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import selectQuoteTempItemDialog from 'src/views/m-worker/quote/m-quoteorder/selectQuoteTempItem.vue'
    import selectSkuDialog from 'src/views/m-worker/quote/m-quoteorder/selectSku.vue'
    import Cookie from 'js-cookie'
    import selectQuoteTemp from 'src/views/m-worker/quote/m-projectlist/project-list/selectQuoteTemp.vue'
    import selectStandardQuoteItem from 'src/views/m-worker/quote/m-quoteorder/selectStandardQuoteItem.vue'
    import formula from 'src/services/formula/methods.js'
    import organization from 'src/services/system/organization.js'
    import throttle from 'throttle-debounce/throttle';
    export default {
        name: "quoteOrderDetail",
        components: {selectQuoteTempItemDialog,selectSkuDialog,selectQuoteTemp,selectStandardQuoteItem},
        created() {
            this.initParams()
            //this.initChildSpaces()
            this.initQuoteOrderDetail()
            this.getCommonOptions(30003, 'places')
            this.getHouseTypes();//houseTypes
        },
        watch:{
            spacesData: {
                handler: function (val,oldval){
                    this.getdirectProjectFee()
                },
            },
            "$route.query": function (val,oldval){
                this.initQuoteOrderDetail()
            }
        },
        methods: {
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },
            onBlur (e, index, prop ) {
                  this.$refs['spaceSizeForm'][index].validateField(prop, function(valid) {
                      console.log(valid)
                  })
            },
            getHouseTypes: function (){
                this.getCommonOptions(30004,'houseTypes');
            },
            //初始化页面参数， 从路由抽取参数
            initParams: function (){
                this.tempId = this.$route.query.tempId || 1 //模板id.编辑时，路由query中没有tempId， 初始化为1只是为了保证请求接口参数一致
                this.yid = this.$route.query.yid //户型
                this.area = this.$route.query.area
                this.houseTypeId = this.$route.query.houseTypeId
            },
            //清除掉页面数据,  避免路由参数变化后历史数据有所遗留
            cleanPageData: function (){
                this.spacesData = []
                this.quoteOrderInfo = {}
                this.directProjectFee = 0 //直接工程费
                this.pkgPrice = 0 //标准套餐价
                this.totalPrice = 0 //合同总价
            },
            closeQuoteOrderDialog: function (){
                this.$router.push('/tuchat-worker/quote-project-list')
            },
            goBack: function (){
                //TODO 返回来源页面有bug
                // this.quoteOrderDialogVisible = false
                // this.$router.go(-1)
                this.$router.push('/tuchat-worker/quote-project-list')
            },
            closeSelectQuoteTempItemDialog: function (){
                this.selectQuoteTempItemVisible = false
            },
            openSelectQuoteTempItemDialog: function (index){
                this.hotSpaceIndex = index
                this.selectQuoteTempItemVisible = true
            },

            //新增个性化
            openSelectQuoteTempItemDialog: function (index, space){
                this.hotSpaceIndex = index
                this.selectedSpaceId = space.orderSpaceId
                this.selectQuoteTempItemVisible = true
            },
            closeSelectSkuDialog: function (){
                this.selectSkuVisible = false
            },

            //校验数据合法性， 递归校验不定数的table及form对象
            validateData: function (tables, spaceAliasForms, spaceSizeForms,tableIndex){
                return new Promise((resolve, reject) => {
                    var quoteObjectForm = this.$refs['quoteObjectForm']
                    quoteObjectForm.validate((isQuoteObjectFormValid) => {
                        if(isQuoteObjectFormValid){
                            if( tables.length == 0 &&  spaceAliasForms.length == 0 && spaceSizeForms.length == 0 ){
                                this.tempSaveDo().then(res => {
                                    resolve(res)
                                }).catch(e => {
                                    reject(e)
                                })
                            }else{
                                //递归校验table数据
                                tables[tableIndex].validate((isValid) => {
                                    if (isValid) {

                                        //递归校验空间别名数据
                                        spaceAliasForms[tableIndex].validate((isValid2) => {

                                            if(isValid2){

                                                //递归校验尺寸数据
                                                spaceSizeForms[tableIndex].validate((isValid3) => {

                                                    if(isValid3){
                                                        //最后一个
                                                        if( tables.length == tableIndex+1 ){
                                                            this.tempSaveDo().then(res => {
                                                                resolve(res)
                                                            }).catch(e => {
                                                                reject(e)
                                                            })
                                                        }else{
                                                            resolve(this.validateData(tables, spaceAliasForms, spaceSizeForms,tableIndex+1))
                                                        }

                                                    }else{
                                                        //只要有不通过的则不继续校验
                                                        reject('页面数据有错误，请检查')
                                                    }

                                                })

                                            }else{
                                                //只要有不通过的则不继续校验
                                                reject('页面数据有错误，请检查')
                                            }

                                        })

                                    }else{
                                        //只要有不通过的则不继续校验
                                        reject('页面数据有错误，请检查')
                                    }

                                })
                            }
                        }else{
                            reject('页面数据有错误，请检查')
                        }
                    })
                })
            },

            tempSave: function (isAutoSave = false){
                return new Promise((resolve, reject) => {
                    let tables = this.$refs.t8ttable
                    let spaceAliasForms = this.$refs.spaceAliasForm
                    let spaceSizeForms = this.$refs.spaceSizeForm
                    this.validateData(tables, spaceAliasForms, spaceSizeForms, 0).then(res => {
                        if( !isAutoSave ){
                            this.$message({
                                type: 'success',
                                message: res
                            })
                            this.initQuoteOrderDetail()
                        }else{
                            resolve(res)
                        }

                    }).catch(e => {
                        this.removeDisabledSymbol('TEMP-SAVE', this.disabledSymbols)
                        if( !isAutoSave ){
                            this.$msgbox({
                                title:'',
                                type: 'error',
                                message: e
                            })
                        }else{
                            reject(e)
                        }

                    })
                })

            },

            //暂存报价单(新建及编辑)
            tempSaveDo: function (){
                return new Promise((resolve, reject) => {
                    let orderInfo  = this.quoteOrderInfo

                    let data = {
                        "id": orderInfo.id ? orderInfo.id : '', //报价单头id
                        "yid": orderInfo.yid, //项目ID，来源待定
                        "orgId": orderInfo.orgId, //组织id
                        "tempId": orderInfo.tempId ? orderInfo.tempId : this.tempId, //产品包模板ID
                        "houseTypeId": orderInfo.houseTypeId, //户型ID——辅助资料
                        "area": orderInfo.area, //房屋面积
                        "pkgPrice": this.pkgPrice, //标配套餐价
                        "totalPrice": this.totalPrice, //合同金额
                        "directProjectFee": this.directProjectFee, //直接工程费
                        "operateUser": +Cookie.get('t8t-tc-uid'), //操作用户
                        "delSpaceIds":this.getDelSpaceIds(),//订单空间删除id列表 list[Integer]
                        "delQuoteItemIds":this.getDelQuoteItemIds(),//报价单行删除id列表 list[Integer]
                        "spaceOrderItemList": this.getSpaceOrderItemList(),//报价单上报数据list
                        /*"houseTypeId":this.quoteOrderInfo['houseTypeId'],
                        "area":this.quoteOrderInfo['area']*/
                    }

                    this.addDisabledSymbol('TEMP-SAVE', this.disabledSymbols)
                    this.$TCS.addTag('red_9475_018003005002')

                    methods.saveQuoteOrder(data,+Cookie.get('t8t-tc-uid')).then((res) => {
                        if(res.data.status == 200){
                            resolve('暂存成功')
                        }else{
                            reject(res.data.result || res.data.message)
                        }
                    })
                })

            },

            //新建
            reset: function (){
                this.$confirm('新建报价单，当前报价单将被清空，当前所有报价项信息将丢失，请确定是否新建。','提示',{
                    type: 'warning',
                    confirmButtonText: '新建',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.$TCS.addTag('red_9475_018003005005')
                    this.addDisabledSymbol('RESET' ,this.disabledSymbols)
                    methods.newCreateQuoteOrder(this.quoteOrderInfo.id, +Cookie.get('t8t-tc-uid')).then((res) => {

                        if( res.data.status == 200 ){
                            this.initQuoteOrderDetail()
                            //this.cleanPageData()
                            this.dialogVisible = true
                            this.$message.success('报价单清除完成，请重新选择报价模板')
                        }else{
                            this.$msgbox({
                                'type' : 'error',
                                'message': '新建失败，请重试',
                                'title':'',
                            })
                            this.removeDisabledSymbol('RESET' ,this.disabledSymbols)

                        }
                    })
                }).catch(() =>{

                })
            },

            preview: function (){
                this.$router.push({path:'/tuchat-worker/quote-order-preview',query:{tempId:this.tempId, yid: this.yid,orderId:this.quoteOrderInfo.id}})
            },

            //提交
            submit: function (){
                let _this = this

                this.$confirm('提交审核前请确认报价单信息完整无误。是否继续提交审核？','提示',{
                    type: 'warning',
                    confirmButtonText: '继续提交',
                    cancelButtonText: '先不提交',
                }).then(() => {
//                  debugger

                    if( _this.quoteOrderInfo.hasOwnProperty('id') && _this.quoteOrderInfo.id > 0 ){

                        _this.$TCS.addTag('red_9475_018003005003')
                        _this.addDisabledSymbol('EDIT-SUBMIT' ,_this.disabledSymbols)
                        _this.tempSave(true).then(res => {
                            methods.submitQuoteOrder(_this.quoteOrderInfo.id, +Cookie.get('t8t-tc-uid')).then((res) => {
                                if( res.data.status == 200 ){
                                    _this.$msgbox({
                                        'type' : 'success',
                                        'message': '提交成功',
                                        'title':'',
                                        callback:function (){
                                            _this.initQuoteOrderDetail()
                                        }
                                    })
                                }else{
                                    _this.$msgbox({
                                        'type' : 'error',
                                        'message': '提交失败，请重试',
                                        'title':'',
                                    })
                                    _this.removeDisabledSymbol('EDIT-SUBMIT' ,_this.disabledSymbols)
                                }
                            })
                        }).catch(e => {
                            _this.$msgbox({
                                'type' : 'error',
                                'message': '提交失败，'+e,
                                'title':'',
                            })
                            _this.removeDisabledSymbol('EDIT-SUBMIT' ,_this.disabledSymbols)
                        })


                    }
                }).catch(e => {

                })

            },

            getDelSpaceIds: function (){
                return this.delSpaceIds
            },
            getDelQuoteItemIds: function (){
                return this.delQuoteItemIds
            },

            //整理报价单空间及报价行数据， 并建立父子关系
            getSpaceOrderItemList: function (){

                //所有空间数据
                let data = this.spacesData
                //新的空间数据
                let newData = []

                let serialNumber = 0;
                let topSpaceIndex = 0;//顶级空间的自增索引
                for (let i in  data){
                    let temp_data = data[i]

                    let spaceDataformated = this.formatSpaceDataToSave(temp_data, serialNumber)

                    serialNumber += spaceDataformated.items.length

                    //把子空间往父空间插入
                    if( temp_data.isParent == false ){
                        newData[topSpaceIndex-1].childSpaces.push(spaceDataformated)
                    }else{
                        newData.push(spaceDataformated)
                        topSpaceIndex++
                    }
                }
                return newData
            },

            //整理保存前的空间数据结构
            formatSpaceDataToSave(data, serialNumber){
                let newData = {
                    "spaceAlias": data.spaceAlias,//空间别名
                    "spaceId": data.spaceId,//空间id(类别)
                    "orderSpaceId": data.orderSpaceId,//报价单空间表id
                    "spaceArea": data.spaceArea || 0,//空间面积
                    "spaceGirth": data.spaceGirth || 0,//空间周长
                    "spaceHeight": data.spaceHeight || 0,//空间层高
                    'items':[],  //一定要初始化， 没有数据可以为空数组
                    'childSpaces':[] //一定要初始化， 没有数据可以为空数组
                }
                let _serialNumber = 0
                data.quoteOrderItemList.forEach((item0, index1) => {
                    item0.groups.forEach((item, index) => {
                        _serialNumber++
                        //只有选品行需要存储  TODO 改变结构后，是否任然需要存储this.isEmpty(item.gdmId)的数据
                        if( item.dataType == 2 || this.isEmpty(item.gdmId)){

                            //和当前行相同报价项的行
                            let sameRow = data.quoteOrderItemList.filter(i => {
                                return i.dataType == 1 && item.mainIndex == i.mainIndex
                            })[0];

                            let amount = !sameRow.hasOwnProperty('amount') ? 0 : (sameRow.amount.toString().trim() ? +sameRow.amount : 0)

                            //只有非标配行需要计算总价
                            let totalMoney = (item.tempItemType == 1) ?  +(+item.price * amount).toFixed(2) : 0

                            newData.items.push({
                                "id": item.id, //报价单行id
                                "orderId": data.id, //报价单id
                                "tempItemId": item.tempItemId, //产品包模板行id
                                "itemPriceId": item.itemPriceId, //价格id
                                "orderSpaceId": item.orderSpaceId, //报价单空间表id
                                "serialNumber": _serialNumber+serialNumber, //报价单行展示序号，从1开始
                                "amount": amount, //数量
                                "totalMoney": totalMoney, //当前报价项金额合计
                                "dosageDetailId": item.dosageDetailId, //用量明细id
                                "itemCode": item.itemCode, //产品包模板行编码
                                "qiId": item.qiId, //报价项ID
                                "qiUnit": item.qiUnit, //报价项单位
                                "spaceId": item.spaceId, //空间ID
                                "spaceAlias": item.spaceAlias, //空间别名
                                "placeId": item.placeId, //位置ID——辅助资料
                                "tempItemType": item.tempItemType, //标配类型 0-标配 1-非标配
                                "price": item.price, //价格
                                "amountEquationId": item.amountEquationId, //数量计算公式id--公式管理
                                "deliveryId": item.deliveryId ? item.deliveryId : 0, //交付项id，主辅材对应goodsId，工费对应工费项id
                                "gdmId": item.gdmId ? item.gdmId : 0, //组合用量关系id
                                "gdType": item.gdType ? item.gdType : 0, //交付项类别
                                "categoryId": item.categoryId ? item.categoryId : 0, //品类id
                                "pkgId": item.pkgId,
                                "basicUnit": item.basicUnit, //SKU基本单位ID

                            })
                        }
                    })

                })
                return newData
            },

            /**
             * 初始化可选的子空间
             */
            initChildSpaces: function (){
                methods.getChildSpaces(this.tempId).then((res) => {
                    if( res.data.status == 200 ){
                        this.childSpacesList = res.data.result
                    }else{
                        this.childSpacesList = [{'spaceName':'无数据','spaceId':0}]
                    }
                })
            },


            /**
             * 新增空间的事件
             * @param space 目标空间：即增加的空间的父空间
             * @param index
             */
            handlerAddSpace: function (space, index){
                //获取可选的空间
                this.initChildSpaces()
            },

            //子空间选择事件
            handleCommand(command){
                //空间id_父空间在空间列表的索引号
                let commands = command.split('_')
                let parentSapceId = commands[0]
                let parentSpaceIndex = commands[1]

                //只有标准空间才能增加子空间
                if( parentSapceId > 0 && this.spacesData[parentSpaceIndex].isParent == true ){
                    methods.getQuoteTempItemBySpace(parentSapceId, this.tempId).then((res) => {
                        if( res.data.status == 200 ){
                            let childSpace = res.data.result

                            if( childSpace.rows != undefined ){
                                //指定位置插入子空间
                                this.spacesData.splice(parseInt(parentSpaceIndex)+1,0,this.formatDataForSpacesData(childSpace))
                            }

                        }else{
                            return this.$msgbox({
                                title: '消息',
                                type: 'error',
                                'message': '获取所选空间的报价项失败，请重试'
                            })
                        }
                    })
                }
            },

            //个性化选择事件
            handleCommandQuoteItem(data){
//              debugger

                let tempItemIds = [];
                data.forEach((element) => {
                    let mainIndex = null
                    mainIndex = this.getMainIndex()
                    let temp_data = Object.assign({},element)
                    //data.groups = null
                    element.mainIndex = mainIndex
                    element.groups.map(i => {
                        i.mainIndex = mainIndex
                        i.qiName = i.gdmName ? i.gdmName : ''
                        return i
                    })
                    tempItemIds.push(element.tempItemId)

                })


                let quoteOrderItemList = this.spacesData[this.hotSpaceIndex]['quoteOrderItemList']

                //同一空间中不能选择相同的报价项

                let sameTempItem = quoteOrderItemList.filter(i => {return tempItemIds.includes(i.tempItemId)})
                if( sameTempItem.length ){
                    return this.$msgbox({
                        title:' ',
                        type:'error',
                        message:`已经存在相同的报价项，不能重复选择`
                    })
                }else{

                    //分别设置报价行和选品行， 报价行需要在选品行前面设置
                    this.setQuoteItemData(data)

                    /*temp_data.groups.forEach(i => {
                        i.mainIndex = mainIndex
                        i.qiName = i.gdmName ? i.gdmName : ''
                        this.setQuoteItemData(i)
                    })*/
                }

            },


            setQuoteItemData: function (data){

              data.forEach((element) => {
                let newData = Object.assign({},element)
                newData.spaceName = this.spacesData[this.hotSpaceIndex].spaceName
                newData.spaceId = this.spacesData[this.hotSpaceIndex].spaceId
                //个性化索引号_空间索引号
                newData.price = newData.price || 0
                newData.amount = newData.amount || 0
                newData.deliveryId = '0'
                this.spacesData[this.hotSpaceIndex]['quoteOrderItemList'].push(newData)
            })
                //批量插入报价单行
                this.handleCommandQuoteItemAddDosageDetail(data)
            },

            handleCommandQuoteItemAddDosageDetail(data){

                let accountId = +Cookie.get('t8t-tc-uid')
                let dto = []

                let _this = this
                data.forEach((element) => {
                let item = {}
                    //调用后台接口，新增组合
                    item.orderId=_this.quoteOrderInfo.id
                    item.tempItemId=element.tempItemId
                    item.pkgId=element.pkgId
                    item.itemPriceId=element.itemPriceId || 0
                    item.orderSpaceId=_this.spacesData[_this.hotSpaceIndex].orderSpaceId

                    dto.push(item)
                });

                //调用后台接口，新增报价单行
                methods.insertQuoteItemAndDosageDetails(dto,accountId).then(res=>{
                    // 重新加载报价数据
                    _this.initQuoteOrderDetail()
                }).catch(e=>{
                    this.$msgbox({
                        title:'',
                        type: 'error',
                        message: e
                    })
                })
            },
            //标配选择事件
            handleCommandQuoteItemForStandard(data){
                let tempItemId = [];
                data.forEach((element, index) => {
                    let mainIndex = null
                    mainIndex = this.getMainIndex()
                    let temp_data = Object.assign({},element)
                    temp_data.dataType = 2
                    temp_data.mainIndex = mainIndex

                    element.dataType = 1 //标记为报价项行
                    element.mainIndex = mainIndex
                    element.groups = [temp_data]

                    //同一空间中不能选择相同的报价项
                    tempItemId.push(temp_data.tempItemId)
                })

                let quoteOrderItemList = this.spacesData[this.hotSpaceIndex]['quoteOrderItemList']

                let sameTempItem = quoteOrderItemList.filter(i => {return tempItemId.includes(i.tempItemId)})
                if( sameTempItem.length ){
                    return this.$msgbox({
                        title:' ',
                        type:'error',
                        message:`已经存在相同的报价项，不能重复选择`
                    })
                }else{

                    //设置报价行
                    this.setQuoteItemDataForStandard(data)

                }

            },

            setQuoteItemDataForStandard: function (data){

              let _this = this;
                data.forEach((element, index) => {
                    let newData = Object.assign({},element)
                    newData.spaceName = _this.spacesData[_this.hotSpaceIndex].spaceName
                    newData.spaceId = _this.spacesData[_this.hotSpaceIndex].spaceId
                    newData.price = newData.price || 0
                    newData.amount = newData.amount || 0
                    newData.deliveryId = '0'

                    _this.spacesData[_this.hotSpaceIndex]['quoteOrderItemList'].push(newData)
                });
                //批量插入报价单行
                this.handleCommandQuoteItemAddDosageDetail(data)
            },


            //初始化项目信息及报价单详情
            initQuoteOrderDetail: function (){

                this.initParams()
                this.spacesData = []
                let _this = this
                methods.initQuoteOrderDetail(this.yid, this.tempId, this.area, this.houseTypeId, +Cookie.get('t8t-tc-uid')).then(res => {
                    let _topToolbar = _this.$refs['topToolbar']

                    let quoteOrder = res.quoteOrder
                    _this.tempId = quoteOrder.tempId //编辑报价单时路由query中没有tempId， 一定要在此处初始化


                    //“完成初稿”、“主管审核驳回”、“核算审核驳回” 可以点击新建
                    if( [0,2,5].indexOf(quoteOrder['orderStatus']) > -1 ){
                        _this.removeDisabledSymbol('RESET', _this.disabledSymbols)
                    }

                    //初始化报价单基本信息
                    _this.quoteOrderInfo = Object.assign({},quoteOrder)

                    //“完成初稿”、“主管审核驳回”、“核算审核驳回” 可以点击提交
                    if( [0,2,5].indexOf(_this.quoteOrderInfo['orderStatus']) > -1 ){
                        _this.removeDisabledSymbol('EDIT-SUBMIT', _this.disabledSymbols)
                    }

                    //“完成初稿”、“主管审核驳回”、“核算审核驳回” 可以点击暂存
                    if( [0,2,5].indexOf(_this.quoteOrderInfo['orderStatus']) > -1 || (!_this.quoteOrderInfo.hasOwnProperty('id') || _this.quoteOrderInfo.id == 0 ) ){
                        _this.removeDisabledSymbol('TEMP-SAVE', _this.disabledSymbols)
                    }
                    //“报价完成” 可以点击反审核
                    if( [6].indexOf(_this.quoteOrderInfo['orderStatus']) > -1 ){
                        _this.removeDisabledSymbol('ANTI-AUDITING', _this.disabledSymbols)
                    }

                    //“完成初稿”、“主管审核驳回”、“核算审核驳回” 可以编辑项目信息
                    if( [0,2,5].indexOf(_this.quoteOrderInfo['orderStatus']) > -1 ){
                        _this.canProjectInfoEdit = true
                    }

                    _this.pkgPrice = quoteOrder.pkgPrice || 0
                    _this.projectManageFee = quoteOrder.projectManageFee || 0
                    _this.tax = quoteOrder.tax || 0
                    _this.discountAmount = (quoteOrder.discountAmount || 0) * -1

                    _this.$set(_this.summaryData.filter((item) => {
                        return item.columnsProp == 'pkgPrice'
                    })[0],'total',_this.pkgPrice)

                    _this.$set(_this.summaryData.filter((item) => {
                        return item.columnsProp == 'projectManageFee'
                    })[0],'total',_this.projectManageFee)

                    _this.$set(_this.summaryData.filter((item) => {
                        return item.columnsProp == 'tax'
                    })[0],'total',_this.tax)

                    _this.$set(_this.summaryData.filter((item) => {
                        return item.columnsProp == 'discountAmount'
                    })[0],'total',_this.discountAmount)

                    _this.pkgPrice = quoteOrder.pkgPrice
                    _this.orgId = quoteOrder.orgId

                    if( _this.quoteOrderInfo.hasOwnProperty('id') && _this.quoteOrderInfo.id > 0 ){
                        _this.removeDisabledSymbol('PREVIEW', _this.disabledSymbols)
                    }


                    if(res.quoteOrderSpaceList){

                        let quoteOrderSpaceList = res.quoteOrderSpaceList.quoteOrderSpaceList
                        quoteOrderSpaceList.forEach((item,index) => {
                            let isParent = item.parentOrderSpaceId == undefined || item.parentOrderSpaceId <= 0
                            if( !isParent ){

                                //标记子空间的父空间在空间列表中的位置
                                let parentSpaceIndex = quoteOrderSpaceList.indexOf(quoteOrderSpaceList.filter((i) => {return i.id == item.parentOrderSpaceId})[0])
                            }
                            //报价单行
                            let data_temp = _this.formatDataForSpacesData(item, isParent )

                            _this.spacesData.push(data_temp)
                        })
                    }

                    //拷贝原有数据
                    _this.spacesDataClone = JSON.parse(JSON.stringify(_this.spacesData))
                    _this.getdirectProjectFee()
                }).catch(res => {
                    if( res.status == 1 ){
                        //对请求的结果做校验，如字段是否缺失、数值是否准确， 不符合的也不允许做后续操作

                        let houseTypes = _this.selectSource['houseTypes'].filter(i => {return i.value == _this.houseTypeId})

                        let houseType = houseTypes.length ? houseTypes[0].text : _this.houseTypeId

                        return _this.$msgbox({
                            title:' ',
                            type:'error',
                            message:`未获取到项目标配套餐价（计价面积：${_this.area || '未设置'} 户型：${houseType || '未设置'} ）`
                        })
                        _this.cleanPageData()
                    }else{
                        _this.$msgbox({
                            title:' ',
                            type:'error',
                            message: res.message
                        })
                        _this.cleanPageData()
                    }
                })

            },

            /**
            * 格式化空间及报价项数据
             * @item 元数据
             * @isParent 是否为一级空间(即标准空间)
             */
            formatDataForSpacesData(item, isParent = false){
                let data_temp = {
                    'spaceName': item.spaceName, // 空间名
                    'spaceAlias': item.spaceAlias, //空间别名
                    'spaceId': item.spaceId, //空间(类型)id
                    "orderSpaceId": item.id,//报价单空间表id
                    'spaceRowId': item.spaceRowId, //空间自增id
                    //'spaceIndex': index+1, //空间行编号
                    'spaceArea': item.spaceArea, //空间面积
                    'spaceHeight': item.spaceHeight, //空间周长
                    'spaceGirth': item.spaceGirth, //空间层高
                    'isParent':isParent,
                }

                let datas = []
                if( item.rows != undefined ){
                    //给行设置默认属性， 防止异常行为
                    item.rows.map(i=>{

                        //初始化deliveryId属性避免选择sku后数据不能即时展示
                        if( !i.hasOwnProperty('deliveryId') ){
                            i.deliveryId = '0';
                        }

                        if( !i.hasOwnProperty('price') ){
                            i.price = '0';
                        }

                        if( !i.hasOwnProperty('basicUnit') ){
                            i.basicUnit = '';
                        }

                        if( !i.hasOwnProperty('amount') ){
                            i.amount = '';
                        }

                        i.dataType = 2 //行数据类型 1 报价项 2选品

                        return i
                    })

                    //1.把当前空间内所有的用量明细组合按照报价项分组
                    let dataMap = []
                    item.rows.forEach(i => {
                        dataMap[i.tempItemId] = [].concat(dataMap[i.tempItemId] ? dataMap[i.tempItemId] : [],i)
                    })

                    //2.从组合中提取出组合对应的报价项信息生成一个新的行, 组合排在报价项下面，形成视觉上的分组
                    dataMap.forEach(i => {
                        //提取新的行
                        let qiData = {}
                        let mainIndex = null
                        mainIndex = this.getMainIndex()
                        qiData = Object.assign({},i[0])
                        qiData.dataType = 1 //标记为报价项行
                        qiData.mainIndex = mainIndex

                        i.forEach((i1,index) => {
                            i1.mainIndex = mainIndex

                            //选品行的名称取的是组合别名
                            i1.qiName = i1.gdmName ? i1.gdmName : ''
                        })

                        qiData.groups = i

                        datas = [].concat(datas, qiData)

                    })
                }

                //报价单行
                data_temp['quoteOrderItemList']  = datas
                return data_temp
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

            //改变列宽
            headerDragend(newWidth, oldWidth, column, event){

                //this.$emit('header-dragend', newWidth, oldWidth, column, event)
            },

            //行点击行为
            cellClick: function (row, column, cell, event) {

                let gdmId = row.gdmId
                let categoryId = row.categoryId

                //选品
                if( column.property === 'deliveryId' ){

                    if( !this.isCanEdit() ||  row.dataType == 1 ){
                        return false
                    }

                    //报价项下必须设置了组合用量关系才能继续选择sku
                    if( gdmId > 0 && categoryId > 0 && this.isCanEdit() ){
                        this.currentGdmId = gdmId
                        this.currentCategoryId = categoryId
                        this.currentRow = row
                        let spaceText = ''
                        let rowSpace = this.selectSource.places.filter((item) => {return item.value==row.placeId})
                        if( rowSpace.length ){
                            spaceText = rowSpace[0].text
                        }

                        this.breadcrumbData = [{title:row.spaceName},{title:spaceText},{title:row.qiName}]
                        this.selectSkuVisible = true
                    }else{
                        return this.$message({
                            title: '消息',
                            type: 'warning',
                            'message': '没有匹配到SKU',
                        })
                    }

                }
            },

            //删除个性化选品行
            removeUnStandardQuoteItem: function(val, row, tableIndex, scope){
                this.removeQuoteItem(val, row, tableIndex, scope)
                this.getdirectProjectFee()
            },
            //删除报价项--报价单行、用量明细
            removeQuoteItem: function(val, row, tableIndex, scope){
                //删除包含两种情况，1：新添加未保存；2：已保存
                this.$confirm('报价项及其对应的选品都会被删除，是否确认继续？').then(res => {
                    methods.deleteStandardQuoteItem(row.id,+Cookie.get('t8t-tc-uid')).then(res=> {
                        let table = this.$refs.t8ttable[tableIndex]

                        //删除报价项行
                        table.dataSource.splice(scope.cell.$index,1)
                    }).catch(e=>{
                        return this.$message({
                            title: '消息',
                            type: 'warning',
                            'message': e,
                        })
                    })
                })

            },

            //新增标配
            addStandardQuoteItem: function (index, space){
                this.hotSpaceIndex = index
                this.selectedSpaceId = space.orderSpaceId
                this.selectStandardQuoteItemVisible = true

                this.$TCS.addTag('red_13152_018003005011')
            },

            //删除标配报价项
            removeStandardQuoteItem: function(val, row, tableIndex, scope){
                this.removeQuoteItem(val, row, tableIndex, scope)
                this.$TCS.addTag('red_13152_018003005012')
            },

            //清除选品
            removeDelivery: function (val, row, tableIndex, scope){
               // let table = this.$refs.t8ttable[tableIndex]
                row.deliveryId = 0
                row.deliveryName = ''
                row.colorName = ''
                row.goodsImgs = ''
                row.basicUnit = 0
            },

            removeSpace: function (space, index){

                //已经入库的空间
                if(space.hasOwnProperty('orderSpaceId') && space.orderSpaceId != undefined){


                    this.spacesData[index].quoteOrderItemList.forEach((item) => {

                        //删除空间时，包含的个性化报价项也需要删除
                        /*if( item.tempItemType == 1 && item.hasOwnProperty('id') && item.id != undefined){
                            this.delQuoteItemIds.push(item.id)
                        }*/
                    })
                    this.delSpaceIds.push(space.orderSpaceId)
                }
                this.spacesData.splice(index,1)
            },

            //异步获取sku信息并展示
            showSkuInfo: function (scope){
                this.skuInfo = []
                this.skuInfoLoading = true
                if( scope.row.hasOwnProperty('deliveryId') && scope.row.deliveryId != 0 ){

                    methods.getSkuInfo(scope.row.deliveryId).then((res) => {
                            this.skuInfoLoading = false
                            let response = res.data
                            if (response.status == 200) {
                                let skuInfo = {}
                                skuInfo.image = 'pic/a.jpg'
                                skuInfo.attrs = [{
                                    'name': 'name1',
                                    'value': 'value1'
                                }]
                                this.skuInfo = skuInfo

                            } else {

                            }
                        })
                        .catch((res) => {

                        })
                }
            },
            hideSkuInfo: function (scope){
                this.skuInfoLoading = false
            },

            getdirectProjectFee: function () {
                let pkgPrice = this.pkgPrice
                let spacesData = this.spacesData
                let total = 0 //个性化总价
                spacesData.forEach((space) => {
                    space.quoteOrderItemList.forEach((item) => {
                        total += (item.tempItemType == 1 && item.dataType == 1) ? +(+item.price * +item.amount).toFixed(2) : 0
                    })
                    total = +total.toFixed(2)
                } )

                //直接工程费 = 标配套餐金额 + 个性化总额
                this.directProjectFee  = +(total+pkgPrice).toFixed(2)

                this.$set(this.summaryData.filter((item) => {
                    return item.columnsProp == 'directProjectFee'
                })[0],'total',this.directProjectFee)


                //合同金额 = 直接工程费+项目管理费+税金-合同优惠 //(@warning 此处公式和直接工程费的公式有关：直接工程费加了个性化总价，如果不加，则合同金额需要加上个性化总价)
                this.totalPrice = (this.directProjectFee + this.projectManageFee + this.tax + this.discountAmount).toFixed(2)

                this.$set(this.summaryData.filter((item) => {
                    return item.columnsProp == 'totalPrice'
                })[0],'total',this.totalPrice)
            },
            cellEditorChange: function (cell, val, config, status){
                this.getdirectProjectFee()
            },

            //是否可进行数据编辑
            isCanEdit: function (){
                //“完成初稿”、“主管审核驳回”、“核算审核驳回”  或者没有创建报价单时可以编辑
                return [0,2,5].indexOf(this.quoteOrderInfo['orderStatus']) > -1 || (!this.quoteOrderInfo.hasOwnProperty('id') || this.quoteOrderInfo.id == 0)
            },
            //是否可编辑编辑个性化、标配
            isCanEditQuoteOrderItem: function (){
                //“完成初稿”、“主管审核驳回”、“核算审核驳回”
                return [0,2,5].indexOf(this.quoteOrderInfo['orderStatus']) > -1
            },

            //预估用量
            syncAmount: function (index){
                let _this = this
                let spaceSizeForms = this.$refs.spaceSizeForm
                spaceSizeForms[index].validate((isValid) => {

                    if(isValid){
                        let constantValues = []
                        let space = this.spacesData[index]
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

                            //有效期类型CODE
                            let validTimeTypeCode = '003002001'
                            //104代表业务类型是产品包模板，在后台服务硬编码
                            let useRange = '104-'+_this.tempId.toString()+'104,'

                            let constants = ['常量1','常量2','常量3','常量4','常量5','常量6','常量7','常量8','常量9','常量10','常量11','常量12','常量13','常量14'];

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
                                //收集变量(由于计算公式有一定的不确定性，此处把所有可能影响报价结果的变量统一收集齐全， 由公式自行决定是否引用。
                                // 如果明确知道某项变量和报价无关请不要传值，否则方式计算会出错)
                                variable["报价空间面积"] = spaceArea
                                variable["报价空间周长"] = spaceGirth
                                variable["报价空间层高"] = spaceHeight
                                variable["卫生间个数"] = this.spacesData.filter(i => { return i.spaceName=='卫生间' }).length,//报价单中的总个数
                                variable["厨房个数"] = this.spacesData.filter(i => { return i.spaceName=='厨房' }).length,//报价单中的总个数
                                variable["主卧个数"] = this.spacesData.filter(i => { return i.spaceName=='主卧' }).length,//报价单中的总个数
                                variable["次卧个数"] = this.spacesData.filter(i => { return i.spaceName=='次卧' }).length//报价单中的总个数
                                if(space.quoteOrderItemList && space.quoteOrderItemList.length ){

                                    let quoteOrderItems = space.quoteOrderItemList.filter(item => {
                                        //已选公式, 且为报价项行
                                        return item.hasOwnProperty('amountEquationId') && !this.isEmpty(item.amountEquationId) && item.dataType == 1
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
                        })

                    }else{
                        //只要有不通过的则不继续校验
                        return false
                    }

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
                            //从变量集合中取出公式需要用到的变量
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
                return row.dataType == 1 ? [{'background-color':'#ffffff'}] : [{'background-color':'#ffffff'}]
            },

            //获取全局唯一index
            getMainIndex(){
                return ++this.mainIndex
            },

            //反审核
            recheck(){
                let _this = this

                this.$confirm('请确认是否提交反审核','提示',{
                    type: 'warning',
                    confirmButtonText: '提交',
                    cancelButtonText: '取消',
                }).then(() => {
                    _this.$TCS.addTag('red_9475_018003005009')
                    _this.addDisabledSymbol('ANTI-AUDITING' ,_this.disabledSymbols)
                    methods.recheckQuoteOrder(_this.quoteOrderInfo.id, +Cookie.get('t8t-tc-uid')).then((res) => {
                        if( res.data.status == 200 ){
                            _this.$msgbox({
                                'type' : 'success',
                                'message': '反审核成功',
                                'title':'',
                                callback:function (){
                                    _this.initQuoteOrderDetail()
                                }
                            })
                        }else{
                            _this.$msgbox({
                                'type' : 'error',
                                'message': res.data.result || '提交失败，请重试',
                                'title':'',
                            })
                            _this.removeDisabledSymbol('ANTI-AUDITING' ,_this.disabledSymbols)
                        }
                    })
                })
            },

            jumpToSelectionList: function (){
                this.$router.push({path:'/tuchat-worker/quote-order-selectionList',query:{'yid':this.yid}})
            },
            syncDataFromTemp: function (){
                let _this = this
                methods.syncTempToQuoteAndSelection(this.quoteOrderInfo.id, +Cookie.get('t8t-tc-uid')).then( res => {
                    _this.initQuoteOrderDetail()
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
        mounted() {
            function scroll(fn) {
                document.querySelector('.el-dialog--full').addEventListener('scroll', () => {
                    fn();
                }, false);
            }
            scroll(() => {
            });
            this.throttledScrollHandler = throttle(300, this.handleScroll);
            document.querySelector('.el-dialog--full').addEventListener('scroll', this.throttledScrollHandler);

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
                selectStandardQuoteItemVisible:false,
                selectedSpaceId:null,
                selectSkuVisible:false,
                currentGdmId:null,
                currentCategoryId:null,
                breadcrumbData:[],
                hotSpaceIndex:null,
                currentRow:null,
                formFields: config.formFields,
                delSpaceIds:[],
                delQuoteItemIds:[],
                skuInfo:{},
                skuInfoLoading: false,
                directProjectFee: 0, //直接工程费
                pkgPrice:0,//标准套餐价
                totalPrice:0,//合同总价
                projectManageFee:0,//项目管理费
                tax:0,//税金
                discountAmount:0,//优惠金额
                dialogVisible:false,
                canProjectInfoEdit:true, //是否可编辑
                disabledSymbols:['PREVIEW','TEMP-SAVE','EDIT-SUBMIT','RESET','ANTI-AUDITING'],
                isLoadingAmount:false,
                isTopHide: false,
                summaryData:[
                    {
                        columnsProp:'pkgPrice',
                        name:'标配套餐价',
                        account:'',
                        unit:'',
                        price:'',
                        total: '',
                        detail:'-',
                    },
                    {
                        columnsProp:'directProjectFee',
                        name:'直接工程费',
                        account:'',
                        unit:'',
                        price:'',
                        total:'',
                        detail:'-',
                    },
                   /* {
                        name:'远程费',
                        account:'',
                        unit:'公里',
                        price:'-',
                        total:'',
                        detail:'直接工程费*0.01*（公里数-5）',
                    },*/
                    {
                        columnsProp:'projectManageFee',
                        name:'项目管理费',
                        account:'',
                        unit:'',
                        price:'-',
                        total:'',
                        detail:'-', //（直接工程费+远程费）*管理费比率
                    },
                    {
                        columnsProp:'tax',
                        name:'税金',
                        account:'',
                        unit:'',
                        price:'-',
                        total:'',
                        detail:'',//（直接工程费+远程费）*（1+管理费比率）*3%
                    },
                    {
                        columnsProp:'discountAmount',
                        name:'优惠',
                        account:'',
                        unit:'',
                        price:'-',
                        total:'',
                        detail:'',
                    },
                    {
                        columnsProp:'totalPrice',
                        name:'合同金额',
                        account:'',
                        unit:'',
                        price:'-',
                        total:'',
                        detail:'',
                    },
                ],
                summaryColumns:[
                    {
                        "prop": "name",
                        "label": "项目名",
                        "width":330, //宽度为空间表格前几列的总和
                        "resizable": false
                    },
                    {
                        "prop": "account",
                        "label": "数量",
                        "width":80,
                        "resizable": false
                    },
                    {
                        "prop": "unit",
                        "label": "单位",
                        "width":80,
                        "resizable": false
                    },
                    {
                        "prop": "price",
                        "label": "单价",
                        "width":80,
                        "resizable": false
                    },
                    {
                        "prop": "total",
                        "label": "总价",
                        "width":120,
                        "resizable": false
                    },
                    {
                        "prop": "detail",
                        "label": "描述",
                        "resizable": false
                    },
                ],
                summaryLeftData:[
                    {
                        name:'&nbsp;',
                    },
                    {
                        name:'&nbsp;',
                    },
                    {
                        name:'&nbsp;',
                    },
                    {
                        name:'&nbsp;',
                    },
                    {
                        name:'&nbsp;',
                    },
                    {
                        name:'&nbsp;',
                    },
                ],
                summaryLeftColumns:[
                    {
                        "prop": "name",
                        "label": "",
                        "resizable": false
                    },
                ],
                formCommonData: {
                    'order_status': config.datas.order_status,
                    'houseTypes':[],
                },
                selectSource:{
                    'places': [],
                    //行数据类型 1 报价项 2 选品
                    dataType:[
                        {
                            text:'报价项',
                            value:1
                        },
                        {
                            text:'选品',
                            value:2
                        }
                    ],
                },
                spacesData:[
                ],
                spacesDataClone:[],
                mainTableColumns:[
                    {
                        "prop": "spaceId",
                        "label": "使用空间",
                        width:120
                    },
                    {
                        "prop": "size",
                        "label": "尺寸",
                        width:120
                    },
                    {
                        "prop": "placeId",
                        "label": "",
                    },
                ],
                mainTableColumns2:[
                    {
                        "prop": "placeId",
                        "label": "位置",
                        "width": 80,
                        "list":'places',
                        "resizable": false,
                        formatter:function(val,row,col,tab){
                            let data = tab.commonData.places.filter(i => { return i.value == val })
                            return row.dataType == 1 ? (data.length ? data[0].text : '') : ''
                        }

                    },
                   /* {
                        'prop': 'dataType',
                        label: '类型',
                        width:80,
                        list:'dataType'
                    },*/
                    /*{
                        "prop": "serialNumber",
                        "label": "序号",
                        "width": 80,
                        "resizable": false
                    },*/
                    {
                        "prop": "qiName",
                        "label": "报价项名称",
                        "width": 250,
                        "resizable": false
                    },
                    {
                        "prop": "amount",
                        "label": "数量",
                        "width": 80,
                        "resizable": false,
                        onClick(val, row, col, tab) {
                            if( col.property == 'amount' ){
                                //组合不填写数量
                                if(row.dataType === 2) {
                                    tab.handleFormItemBlur()
                                }
                            }

                        },
                        editor:{
                            type:'input',
                            rules:
                                function(val, row , col, tab){
                                    //匹配多于两位的小数
                                let exp = new RegExp('^[0-9]+(\\.\\d{3,})$')
                                let upperLimit = row.upperLimit || 100000
                                return [{
                                        type:'number',
                                        'validator': (rule, value, callback, source, options) => {

                                            //最多精确到两位小数
                                            if(exp.test(+value)){
                                                callback(false)
                                            }
                                            else if( (+value >=row.lowerLimit && +value <= upperLimit) || +value === 0){
                                                callback()
                                            }else{
                                                callback(false)
                                            }
                                        },
                                        //pattern: exp,
                                        message: `请输入${row.lowerLimit}-${upperLimit}之间的数字, 精确到两位小数`,
                                        /*transform (val) {
                                            return +val;
                                        },*/
                                    },
                                    /*{
                                        type:'number',
                                        min: row.lowerLimit,
                                        max: row.upperLimit,
                                        transform (val) {
                                            return +val;
                                        },
                                        message: `请输入${row.lowerLimit}-${row.upperLimit}之间的数字`
                                    }*/
                                ]
                            },
                        },
                        formatter(val, row, col, tab) {
                            return row.dataType == 1 ? (val ? +val : 0) : ''
                        }
                    },
                    {
                        "prop": "qiUnit",
                        "label": "单位",
                        "width": 80,
                        "resizable": false,
                        formatter(val, row, col, tab) {
                            return row.dataType == 1 ? val : ''
                        }
                    },
                    {
                        "prop": "price",
                        "label": "单价",
                        "width": 80,
                        "resizable": false,
                        formatter(val, row, col, tab) {
                            return row.dataType == 1 ? (row.tempItemType == 0 ? '-' : +row.price ) : ''
                        }
                    },
                    {
                        "prop": "totalMoney",
                        "label": "金额",
                        "width": 120,
                        "resizable": false,
                        formatter(val, row, col, tab) {
                            return row.dataType == 1 ? (row.tempItemType == 0 ? '-' : row.amount ? (+row.price * +row.amount).toFixed(2) : 0 ) : ''
                        }
                    },
                    {
                        "prop": "tempItemType",
                        "label": "是否标准",
                        "width": 80,
                        "resizable": false,
                        formatter(val, row) {
                            return row.dataType == 1 ? (row.tempItemType == 0 ? '是' : '否') : ''
                        }
                    },

                   /* {
                        "prop": "deliveryId",
                        "label": "SKU",
                        "width": 150,
                        formatter(val, row){
                            return row.dataType == 1 ? '' : `<span class="selectDeliveryIdHand">*******</span>`
                        },
                        "resizable": false
                    },*/
                    {
                        "prop": "craftDetails",
                        "label": "工艺详情",
                        "resizable": false,
                        "minWidth":300,
                        "align": 'left',
                        formatter(val, row){
                            return row.dataType == 1 ? val : ''
                        },
                    },

                ],
                spaceSizeRules: {
                    spaceArea:[
                        {
                            type:'number',
                            trigger:'blur',
                            'validator': (rule, value, callback, source, options) => {

                                //匹配多于两位的小数
                                var exp = new RegExp('^[0-9]+(\\.\\d{3,})$')

                                if( typeof(value) != 'number' ){
                                    callback(false)
                                }
                                //最多精确到两位小数
                                else if(exp.test(+value)){
                                    callback(false)
                                }
                                else if( (+value >=0 && +value <= 200)){
                                    callback()
                                }else{
                                    callback(false)
                                }

                            },
                            message: '0-200, 精确到两位小数',
                            /*transform (val) {
                                return +val;
                            },*/
                        },
                        {type:'number',message:'必须为数值',trigger:'blur'},{type:'number',required: true ,message:'请填写面积',trigger:'blur'}



                    ],
                    spaceGirth:[
                        {
                            type:'number',
                            trigger:'blur',
                            'validator': (rule, value, callback, source, options) => {

                                //匹配多于两位的小数
                                var exp = new RegExp('^[0-9]+(\\.\\d{3,})$')

                                if( typeof(value) != 'number' ){
                                    callback(false)
                                }
                                //最多精确到两位小数
                                else if(exp.test(+value)){
                                    callback(false)
                                }
                                else if( (+value >=4 && +value <= 500)){
                                    callback()
                                }else{
                                    callback(false)
                                }


                            },
                            message: '4-500, 精确到两位小数',
                        },
                        {type:'number',message:'必须为数值', trigger:'blur'},
                        {type:'number',required: true ,message:'请填写周长', trigger:'blur'}
                    ],
                    spaceHeight:[
                        {

                            type:'number',
                            trigger:'blur',
                            'validator': (rule, value, callback, source, options) => {

                                //匹配多于两位的小数
                                var exp = new RegExp('^[0-9]+(\\.\\d{3,})$')

                                if( typeof(value) != 'number' ){
                                    callback(false)
                                }
                                //最多精确到两位小数
                                else if(exp.test(+value)){
                                    callback(false)
                                }
                                else if( (+value >=1.5 && +value <= 4)){
                                    callback()
                                }else{
                                    callback(false)
                                }

                            },
                            message: '1.5-4, 精确到两位小数',
                            /*transform (val) {
                                return +val;
                            },*/

                        },
                        {type:'number',message:'必须为数值', trigger:'blur'},
                        {type:'number',required: true ,message:'请填写层高',trigger:'blur'}
                    ]
                },
                hover: false,
                showBackToTop: false
            }
        }

    }
</script>

<style>
    html,body
    {
        height: 100%;
    }
    .quoteOrderDetail .t8t-form-panel{
        margin:0 auto;
    }
    .spaceQuoteItemPanel .space-content{
        border-bottom: 1px solid #dfe6ec;
        text-align: center;
        min-height: 200px;
    }

    .spaceQuoteItemPanel .t8t-table{
        height: auto
    }


    /*表格最后一行不需要border-bottom*/
    /*.spaceQuoteItemPanel table tbody tr:last-child  td{
        border-bottom: none;
    }*/

    .spaceQuoteItemPanel .el-table{
        border-bottom: none !important;
        border-top: none !important;
        border: none !important;
    }

    /*第一个table需要border-top*/
    /*.spaceQuoteItemPanel .el-table:first-child {
        border-top: 1px solid #dfe6ec;
    }*/



    .spaceQuoteItemPanel .space-data-header{
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
        .spaceQuoteItemPanel .space-data-header {
            height: 32px;
            line-height: 32px;
        }
    }
    .spaceQuoteItemPanel .space-data-body{
        min-height: 200px;
       /* height: 100%;*/
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .spaceQuoteItemPanel .space-data-body-text{
        height:160px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    /*.space-size .el-form-item__error {
        position: inherit !important;
    }*/

    /*.space-size .el-form-item{
        margin-bottom: 0px;
    }*/
    .spaceQuoteItemPanel .space-data-body-input-box{
        /*margin: 5px;*/
    }
    .spaceQuoteItemPanel .space-number-input{
        width:120px;
        margin:2px;
        padding-left:2px;
    }
    .spaceQuoteItemPanel .space-name{
        /*margin-top: 5px; *//*和space-data-body-input-box 的 margin一致*/
        font-size: 16px;
    }
    .spaceQuoteItemPanel .space-name-text{
        /*padding: 25%;*/
    }
    .spaceQuoteItemPanel .space-plus, .space-remove{
        text-align: right;
    }
    .spaceQuoteItemPanel .space-plus button, .space-remove button{
        margin-right:5px;
    }
    .spaceQuoteItemPanel .space-data{
        border-right: 1px solid #dfe6ec;
        height:100%;
    }
    .spaceQuoteItemPanel .spaceAliasInput input{
        text-align: center;
    }


    .quoteOrderDetail .summary-header{
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

    .quoteOrderDetail .el-table__body-wrapper{
        height:auto !important;
    }

    /*解决小屏幕出现小表格横向滚动条问题*/


    @media screen and (max-height: 900px) {
        body{
            min-width:1654px;
        }


        .quoteOrderDetail{
            min-width: 1654px;
        }
        .quoteOrderDetail .el-col-3{
            min-width: 180px;
        }
        .quoteOrderDetail .el-col-6{
            min-width: 360px;
        }
        .quoteOrderDetail .el-col-18{
            min-width: 1294px;
        }
        .quoteOrderDetailDialog .el-dialog__body{
            min-width: 1654px;
        }

        .t8t-full-dialog .toolbar-container{
            width:100%;
        }

        .quoteOrderDetail .spaceQuoteItemPanel{
            min-width: 1654px;
        }
        .quoteOrderDetail .spaceQuoteItemPanel .el-row {

        }
        .quoteOrderDetail .space-content .el-table {
            overflow: initial;
            width: initial;
            max-width:none;
        }
        .quoteOrderDetail .space-content .el-table__body{
            width:100% !important;
        }

        .quoteOrderDetail .summaryMoney{
            min-width: 1654px;
        }
        .quoteOrderDetail .summaryMoney .el-table__body{
            width:100% !important;
        }
        .quoteOrderDetail .summaryMoney .el-table {
             max-width:100%;
        }
        .quoteOrderDetail .summaryMoney .el-row {
            display: flex;
        }

        .quoteOrderDetail .headerForm {
           /* min-width:1654px;*/
        }



        /*.quoteOrderDetail .el-table__body-wrapper {
               overflow: hidden;
           }
           .quoteOrderDetail .el-table__body {
               width:auto !important;
           }*/

    }


    /*end*/

    .quoteOrderDetailDialog .top-hide{
        position: absolute;
        top: 48px;
        right: 10px;
        z-index: 1;
        transform: rotate(90deg);
        cursor: pointer;
    }
    .quoteOrderDetailDialog.isHide .top-hide{
        transform: rotate(-90deg);
    }
    .quoteOrderDetailDialog.isHide .headerForm{
        height: 0;
        padding-top: 0;
        overflow: hidden;
    }
</style>
<style>
    /*.quoteOrderDetail .hideheader .el-table__header-wrapper{
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
