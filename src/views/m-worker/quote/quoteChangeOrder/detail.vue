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
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <!--顶部操作区 end-->

                <div class="dialog2-main-container" :class="{'isHide': isTopHide}">

                    <!--顶部表单-->
                    <div class="full-dialog-form-container">
                        <t8t-form-panel
                            ref="headForm"
                            :dataSource="detailInfo"
                            :commonData="formCommonData"
                            :fields="formFields"
                            class="headerForm"
                        >
                        </t8t-form-panel>
                    </div>
                    <!--顶部表单 end-->

                    <!--头部收缩-->
                    <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>

                    <!--变更单详情列表-->
                    <div class="quoteChangeOrderItemPanel">
                        <t8t-grid
                            :columns="mainTableColumns"
                            :dataSource="detailItems"
                            :commonData="formCommonData"
                            :editable="isCanEdit()"
                            :indexCol="false"
                            :selectCol="false"
                            :showHeader="!index"
                            :pageBar="false"
                            :stripe="false"
                            :preLoad="false"
                            :style="!index ? 'border-top: 1px solid #dfe6ec' : ''"
                            ref="t8ttable"
                        >

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
                    <div>
                        <el-upload
                            class="avatar-uploader"
                            :action="uploadURL"
                            :data="uploadParams"
                            :accept="acceptType"
                            :show-file-list="false"
                            :on-success="handleAvatarScucess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <div>
                            <span>  &nbsp;&nbsp;水电增项图 </span>
                            <span v-show="'' != imageUrl">
                            <a class="hrefa" @click="download(imageUrl)">下载 </a>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label v-if="isCanEdit()" class="hrefa" title="删除文件"  @click="removeFile()"> 删除 </label>
                        </span>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>

</template>
<script>
    import download from 'src/utils/download.js'
    import Utils from 'src/utils/Utils.js'
    import config from 'src/views/m-worker/quote/quoteChangeOrder/config.js'
    import methods from 'src/services/worker/quoteChangeOrder/methods.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import T8tAudit from 'src/components/t8t-audit/t8t-audit.vue'
    import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'
    import Cookie from 'js-cookie'
    export default {
        components: {T8tAudit,T8tStepPage},
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
                isTopHide:false,
                orderItems:[], //变更单明细内容
                orderItemsClone:[],
                orderInfo:{}, //变更单基本数据

                submitDTO:{},

                detailInfo:{}, //水电增项页面
                detailItems:[],
                imageUrl: '',
                uploadURL: Utils.getUploadURL(),
                uploadParams: {
                    bucket: 'scm',
                    module: 'delivery'
                },
                acceptType: ".jpg,.jpeg,.png,.bmp",

                quoteChangeOrderDialogVisible:true,

                symbilListTop:['EDIT-SUBMIT'],//顶部工具条展示的按钮列表
                disabledSymbolsTopDefault:['EDIT-SUBMIT'], //默认禁用的操作
                disabledSymbolsTop:[], //禁用的顶部操作按钮列表， 默认全部禁用 'EDIT-SUBMIT'
                formCommonData:{
                    'statusConfirms': [
                        { 'text': '待确认', 'value': 0 },
                        { 'text': '已确认', 'value': 1 },
                        { 'text': '装修公司申请', 'value': 2 },
                        { 'text': '业主驳回', 'value': 3 },
                    ],
                    'order_status': config.datas.order_status,
                    'houseTypes':[],
                    'addOrSubItemTypes':config.datas.addOrSubItemTypes,
                    'spaces': [],
                },
                formFields: [
                    {
                        prop: 'sourceProjectId',
                        label: '项目ID',
                        type: 'input',
                        disabled:true
                    },
                    {
                        prop: 'projectAddress',
                        label: '项目地址',
                        type: 'input',
                        disabled:true
                    },
                    {
                        prop: 'ownerName',
                        label: '业主姓名',
                        type: 'input',
                        disabled:true
                    },
                    {
                        prop: 'houseTypeName',
                        label: '户型',
                        type: 'input',
                        disabled:true,
                    },
                    {
                        prop: 'lbfy',
                        label: '水电增项金额',
                        type: 'input',
                        disabled:true
                    },
                    {
                        prop: 'realSignedTime',
                        label: '签约时间',
                        type: 'datetime',
                        disabled:true,
                    },
                    {
                        prop: 'statusConfirm',
                        label: '水电增项状态',
                        type: 'select',
                        list: 'statusConfirms',
                        disabled: true
                    },
                ],
                mainTableColumns:config.mainTableColumns,
                dialogVisible:false,//是否预览图片
                dialogImageUrl:'',//预览图片路径
            }
        },
        methods: {
          //删除图片
            removeFile: function () {
                this.$confirm('是否确认删除？','提示',{
                    type:'warning'
                }).then(()=>{
                  this.imageUrl = '';
                  this.detailInfo.filename = '';
                  this.dialogImageUrl = '';
                  this.dialogVisible = false;
                }).catch(e => {
                    _this.removeDisabledSymbol('TEMP-SAVE',_this.disabledSymbolsTop)
               })
            },
            //提交水电增项
            submit: function (){
                let _this = this
               debugger
               /** 项目金额为0的时候允许不传图片
                */
               if (0 ==  _this.detailItems[0].lbfy && (null == _this.detailInfo.filename || 'null' == _this.detailInfo.filename || '' == _this.detailInfo.filename)) {
                   _this.detailInfo.filename = "#"
               }
                if(null == _this.detailInfo.filename || '' == _this.detailInfo.filename || 'null' == _this.detailInfo.filename) {
                    return this.$message.error('请先上传图片')
                }

                this.$confirm('提交前请确认变更单内容无误。是否继续提交？','提示',{
                    type: 'warning',
                    confirmButtonText: '继续提交',
                    cancelButtonText: '先不提交',
                }).then(() => {
                    _this.submitDo()
                })
            },
            getSubmitDTO () {
                let dto = this.submitDTO;
                dto.projectId=this.detailInfo.projectId;
                dto.sourceProjectId=this.detailInfo.sourceProjectId;
                dto.designerName=this.detailInfo.designerName;
                dto.lbfy=this.detailItems[0].lbfy||0;
                dto.zid=this.detailInfo.zid||0;
                dto.pid=this.detailInfo.pid||0;
                dto.filename=this.detailInfo.filename||'';
            },
            submitDo: function (){
                // debugger
                let _this = this
                _this.$TCS.addTag('red_11732_018003009003')
                _this.addDisabledSymbol('EDIT-SUBMIT', _this.disabledSymbolsTop)
                this.getSubmitDTO()
                methods.submitDetail(this.submitDTO, +Cookie.get('t8t-tc-uid')).then(res => {
                  if (res.data.status == 200) {
                   _this.detailInfo['statusConfirm'] = 2;
                   _this.detailInfo['lbfy'] = _this.detailItems[0].lbfy||0;
                    return this.$msgbox({
                        title: '消息',
                        type: 'success',
                        'message': '提交审核成功',
                   })
                  } else {
                    _this.removeDisabledSymbol('EDIT-SUBMIT', _this.disabledSymbolsTop)
                      return this.$msgbox({
                          title: '消息',
                          type: 'error',
                          'message': '提交审核失败'
                      })
                  }
                }).catch(e => {
                    _this.removeDisabledSymbol('EDIT-SUBMIT', _this.disabledSymbolsTop)
                    return this.$msgbox({
                        title: '消息',
                        type: 'error',
                        'message': '提交审核失败'
                    })
                })
            },

            //初始化页面参数
            initParams: function (){
                this.yid = this.$route.query.projectId
            },

            //初始化变更单内容
            initOrderData: function (){
                let _this = this
//                debugger
//                _this.disabledSymbolsTop = Object.assign([],_this.disabledSymbolsTopDefault) //每次初始化默认禁用所有操作


                methods.createdDetail(this.yid, +Cookie.get('t8t-tc-uid'),).then(res => {
                  if (res.data.status == 200) {
                      let orderResult = res.data.result
                      _this.detailInfo = orderResult
                      _this.detailInfo.realSignedTime *= 1000

                      /**
                       *  确认状态 0.待确认；1.已确认: 2.装修公司申请：3.业主驳回
                       *   确认状态 0.待确认；1.已确认: 2.装修公司申请：3.业主驳回
                       *   crm可以提交水电增项的条件是：确认状态 0.待确认 3.业主驳回
                       */
                      if (orderResult.statusConfirm != 0 && orderResult.statusConfirm != 3) {
                          _this.addDisabledSymbol('EDIT-SUBMIT', _this.disabledSymbolsTop)
                      }
                    //   debugger

                      //获取路径
                      if("null" == orderResult.filename || '' == orderResult.filename || '#' == orderResult.filename) {
                         this.imageUrl = '';

                      } else {
                        this.imageUrl = Utils.getFullURL(orderResult.filename);
                      }

                      let detailItem = {}
                      detailItem.orderSpaceId = 0
                      detailItem.placeId = 0
                      detailItem.qiName = '水电增项'
                      detailItem.amount = null
                      detailItem.qiUnit = null
                      detailItem.price = null
                      detailItem.lbfy = orderResult.lbfy || 0
                      detailItem.addOrSubItemType = 1
                      detailItem.craftDetails = ''
                      _this.detailItems =[];

                      _this.detailItems.push(detailItem);
                  } else {
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
            //收缩头部
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },
            //是否可编辑水电增项
            isCanEdit: function (){
                //初始化失败等情况， 不允许后续操作
                return (this.detailInfo.projectId != 0 && [0,3].indexOf(this.detailInfo['statusConfirm']) > -1 );
            },

            closeQuoteChangeOrderDialog(){
                this.$router.push('/tuchat-worker/quote-changeorder-list')
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

            //上传下载图片
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
            showPic(url) {
                this.dialogImageUrl = url
                this.dialogVisible = true
            },
            handleAvatarScucess(response, file) {
                if (response.status === 200){
                    this.detailInfo.filename = response.result.filePath;
                    this.imageUrl =  Utils.getFullURL(response.result.filePath);
                } else {
                    this.$message.error(response.message);
                }
            },
            beforeAvatarUpload(file) {
                // debugger

                if (!this.isCanEdit()) {
                    this.$message.error('不能修改图片!');
                    return this.isCanEdit();
                }

                const isLt4M = file.size / 1024 / 1024 < 4 ;

                if (!isLt4M) {
                    this.$message.error('图片大小不能超过4M!');
                }
                return isLt4M;
            },
            download(imageUrl){
                if (imageUrl != undefined){
                    download(imageUrl)
                }
             },

            dateParser(text) {
                let dateString;
                if (!text) {
                    dateString = ""
                } else {
                    let objDate = new Date(text * 1000);
                    dateString = DateUtils(objDate, 'yyyy-mm-dd')
                }
                return dateString
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
    .picture_1{
        overflow: hidden;
        border: 1px solid #c0ccda;
        border-radius: 6px;
        box-sizing: border-box;
        width: 200px;
        height: 120px;
        position: relative;
    }
    .picture_2{
        width:100%;
        heigth:100%;
        text-align: center;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .hrefa{
        cursor: pointer;
        text-decoration: underline;
        color: blue;
    }
</style>
