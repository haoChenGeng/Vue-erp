<template>
    <div class="t8t-detail-view contract-detail">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            :symbolList="contractToolbarList"
                            class="t8t-dark"
                            ref="contractToolbar"
                            @SUBMIT = "submitBtn"
                            @AUDITING-SUBMIT = "auditingBtn"
                            @APPROVAL-FLOW="showFlow"
                        >
                        </t8t-toolbar>
                    </div>
                </div>

                <div class="dialog2-main-container" :class="{'isHide': isTopHide}">

                    <!-- 表单区 -->
                    <div class="full-dialog-form-container container-center">

                        <!--审批-->
                        <el-form v-if="showAppendForm"
                                 :model="appendForm.form"
                                 :rules="appendForm.rules"
                                 ref="appendForm"
                                 label-width="120px">
                            <el-form-item v-for="field in appendForm.fields" :label="field.label" :prop="field.prop"
                                          class="append-form-container">
                                <el-radio-group v-if="field.type === 'radio'" :prop="field.prop"
                                                v-model="appendForm.form[field.prop]"
                                                :disabled="appendForm.form[field.disabled] || false"
                                                @change="changeRadio">
                                    <el-radio v-for="item in appendForm.radioOption" :label="item.value">{{item.text}}
                                    </el-radio>
                                </el-radio-group>
                                <el-input
                                    v-else-if="field.type === 'textarea'"
                                    type="textarea"
                                    v-model="appendForm.form[field.prop]"
                                    :disabled="appendForm.form[field.disabled] || false"
                                    :placeholder="appendForm.form[field.placeholder] || ''"
                                    :autosize="{ minRows: field.minRows || 5, maxRows: field.maxRows || 8}"
                                ></el-input>
                            </el-form-item>
                        </el-form>


                        <el-form ref="mainTable"
                                 label-position="right"
                                 label-width="120px"
                                 :model="dataSource"
                                 :show-message="mode !== 'view'"
                        >
                            <el-tabs v-model="mainActiveTab">
                                <el-tab-pane :label="mainTable.tabs[0].label" :name="mainTable.tabs[0].name">
                                    <div class="field_container">
                                        <base-panel
                                            :dataSource="dataSource"
                                            :fields="mainTable.tabs[0].fields"
                                            :options="options || {}"
                                            :ref="mainTable.tabs[0].name"
                                            @click="handleClick"
                                            @blur="handleBlur"
                                            @focus="handleFocus"
                                            @change="handleChange"
                                            @select-change="handleSelectChange"
                                            v-loading.body.lock="mainTalbeLoading"
                                        ></base-panel>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </el-form>
                    </div>


                    <div class="toggle-btn-container">
                        <div class="toggle-btn el-icon-d-arrow-left" @click="onTopHide"></div>
                    </div>


                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">

                        <div class="t8t-detail">
                            <el-tabs v-model="subActiveTab" class="t8t-detail">

                                <!--pic-->
                                <el-tab-pane :label="subTables[0].label" :name="subTables[0].name" v-if="mode!='add'">
                                    <div class="sub-container" v-loading.body.lock="fileLoading">

                                        <div class="pic-container list-container" v-for="item in constructionPic">
                                            <span>{{item.label}}</span>
                                            <!--<el-upload-->
                                                <!--class="el-upload-disabled"-->
                                                <!--list-type="picture-card"-->
                                                <!--:file-list="item.fileList"-->
                                                <!--:on-preview="handlePictureCardPreview"-->
                                            <!--&gt;-->
                                            <!--</el-upload>-->
                                            <div class="picture-list">
                                                <div class="list-item" v-for="i in item.fileList">
                                                    <div class="item-img">
                                                        <img v-if="i.photoeType == 1" :src="i.url" width="100%" height="100%" @click="showPicture1($event.target.src)">
                                                        <img v-else src="./dwg.jpg" width="100%" height="100%">
                                                    </div>
                                                    <div class="item-text">
                                                        <a @click="showPicture($event)" v-if="i.photoeType == 1" href="javascript:;">
                                                            点击查看大图
                                                        </a>
                                                        <a v-if="i.photoeType == 0" :href="i.url">
                                                            下载
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </el-tab-pane>


                                <el-tab-pane :label="subTables[1].label" :name="subTables[1].name">
                                    <div class="spaceQuoteItemPanel" v-loading.body.lock="subTableLoading">
                                        <template>
                                            <el-row v-for="(space, index) in spacesData">
                                                <el-col :span="24">
                                                    <div class="space-content">
                                                        <el-row style="display: flex;flex-direction: row;">
                                                            <el-col :span="3" class="spaceNameBox">
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
                                                                                        <el-input class="space-number-input spaceAliasInput" v-model="space['spaceAlias']" :disabled="true"></el-input>
                                                                                    </el-form-item>
                                                                                </el-form>
                                                                            </div>
                                                                        </div>

                                                                        <div class="space-plus" v-if="space.isParent">
                                                                            <el-dropdown @command="handleCommand">
                                                                                <el-dropdown-menu slot="dropdown">
                                                                                    <el-dropdown-item v-for="(spaceItem, spaceIndex) in childSpacesList" :command="spaceItem.spaceId +'_'+ index">{{spaceItem.spaceName}}</el-dropdown-item>
                                                                                </el-dropdown-menu>
                                                                            </el-dropdown>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </el-col>

                                                            <el-col :span="3">
                                                                <div class="space-data">
                                                                    <div v-if="!index" class="space-data-header">尺寸</div>
                                                                    <div class="space-data-body">
                                                                        <div class="space-size space-data-body-text">

                                                                            <el-form :model="{'spaceArea':space['spaceArea'],'spaceHeight':space['spaceHeight'],'spaceGirth':space['spaceGirth']}" :rules="spaceSizeRules" ref="spaceSizeForm">
                                                                                <el-form-item
                                                                                    prop="spaceArea"
                                                                                >
                                                                                    <div class="space-data-body-input-box"><span>面积</span><el-input class="space-number-input" v-model.number="space['spaceArea']" :disabled="true"></el-input></div>
                                                                                </el-form-item>

                                                                                <el-form-item
                                                                                    prop="spaceGirth"
                                                                                >
                                                                                    <div class="space-data-body-input-box"><span>周长</span><el-input class="space-number-input" v-model.number="space['spaceGirth']" :disabled="true"></el-input></div>
                                                                                </el-form-item>

                                                                                <el-form-item
                                                                                    prop="spaceHeight"
                                                                                >
                                                                                    <div class="space-data-body-input-box"><span>层高</span><el-input class="space-number-input" v-model.number="space['spaceHeight']" :disabled="true"></el-input></div>
                                                                                </el-form-item>
                                                                            </el-form>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </el-col>


                                                            <el-col :span="18">
                                                                <t8t-table
                                                                    :class="{hideheader:index}"
                                                                    :columns="subTables[1].fields"
                                                                    :dataSource="space['rows']"
                                                                    :commonData="options"
                                                                    :indexCol="true"
                                                                    :selectCol="false"
                                                                    :showHeader="!index"
                                                                    :editable="false"
                                                                    :pageBar="false"
                                                                    :style="!index ? 'border-top: 1px solid #dfe6ec' : ''"
                                                                    @headerDragend="headerDragend"
                                                                    ref="t8ttable"
                                                                >
                                                                    <template scope="scope" slot="qiName" :class="cell-text">

                                                                        <div class="cell-text" :title="scope.row.qiName">
                                                                            {{scope.row.qiName}}
                                                                        </div>
                                                                    </template>

                                                                    <!--
                                                                        临时版本。 展示sku颜色colorName，尺寸 size
                                                                    -->
                                                                    <template scope="scope" slot="deliveryId">
                                                                        <el-popover trigger="hover" placement="right" v-if="scope.row.deliveryId != 0 && scope.row.deliveryId != undefined">
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
                                                                                        尺寸：   910*127
                                                                                    </div>
                                                                                </div>

                                                                            </div>

                                                                            <div slot="reference" class="name-wrapper">
                                                                                <span class="selectDeliveryIdHand" :title="scope.row.deliveryName || ''">{{ scope.row.deliveryName ? scope.row.deliveryName : '*******'}}</span>
                                                                            </div>
                                                                        </el-popover>
                                                                        <div slot="reference" class="name-wrapper" v-if="scope.row.deliveryId == 0 || scope.row.deliveryId == undefined">
                                                                            <span class="selectDeliveryIdHand">*******</span>
                                                                        </div>
                                                                    </template>

                                                                    <!--
                                                                        结构化后展示sku信息的版本
                                                                    -->
                                                                    <template scope="scope" slot="deliveryIds">
                                                                        <el-popover trigger="hover" placement="right" @show="showSkuInfo(scope)" @hide="hideSkuInfo(scope)" v-if="scope.row.deliveryId != 0">
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
                                                                                <span class="selectDeliveryIdHand" :title="scope.row.goodsName || ''">{{ scope.row.goodsName ? scope.row.goodsName : '*******'}}</span>
                                                                            </div>
                                                                        </el-popover>
                                                                        <div slot="reference" class="name-wrapper" v-if="scope.row.deliveryId == 0">
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

                                                                </t8t-table>

                                                            </el-col>
                                                        </el-row>
                                                    </div>
                                                </el-col>
                                            </el-row>
                                        </template>
                                    </div>
                                </el-tab-pane>

                                <!--pic-->
                                <el-tab-pane :label="subTables[2].label" :name="subTables[2].name" v-if="mode!='add'">
                                    <div class="sub-container" v-loading.body.lock="contractTableLoading">

                                        <div class="pic-container list-container">
                                            <span>{{contractDetail.label}}</span>
                                            <el-button
                                                v-if="contractDetail.type === 1"
                                                v-for="item in contractDetail.fileList"
                                                @click="viewPdf(item)">查看电子签</el-button>
                                            <el-upload
                                                v-if="contractDetail.type === 2"
                                                class="el-upload-disabled"
                                                list-type="picture-card"
                                                :file-list="contractDetail.fileList"
                                                :on-preview="handlePictureCardPreview"
                                            >
                                            </el-upload>
                                        </div>

                                    </div>
                                </el-tab-pane>

                            </el-tabs>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>


        <t8t-step-page
            :args="flowArgs"
            :service="flowService"
            :method="flowMethod"
            :dataSource="flowData"
            v-if="isShowFlow"
            @close="closeFlowShow"
        >
        </t8t-step-page>

        <el-dialog v-model="dialogVisible" size="preview" class="view-pic-dialog">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

        <el-dialog v-model="pdfVisible" size="preview" class="view-pic-dialog">
            <div id="pdf"></div>
        </el-dialog>
        <el-dialog v-model="dialogVisible" :modal="false" class="projectlist-showimg-dialog" size="full">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
    import BasePanel from 'src/components/t8t-base-panel/t8t-base-panel.vue'
    import axios from 'src/utils/axios.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import Utils from 'src/utils/Utils.js'
    import Cookie from 'js-cookie'

    import schema from './contract-schema'
    import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'
    import Service from 'src/services/salemanager/Service.js'
    import PDFObject from 'src/utils/pdfobject.js'

    import contractApi from 'src/services/salemanager/contract.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'

    export default {
        name: 't8t-dt-view',
        components: {BasePanel, T8tStepPage, PDFObject},
        data () {
            return {
                processId: null,
                fileList: [],
                attachRelation: [],
                uploadImgList: {},
                imgList: [],
                projectId: null,
                constructionPic:[],

                mainTalbeLoading:false,

                fileLoading:false,
                subTableLoading:false,
                contractTableLoading:false,


                dialogImageUrl: '',
                dialogVisible: false,
                pdfVisible:false,


                showAppendForm: true,
                appendForm: {},
                flowArgs: {id:null},
                flowService: Service.CONTRACT.name,
                flowMethod: Service.CONTRACT.methods.GETPROCESSDETAILBYID,
                flowData: [],
                isShowFlow: false,

                viewsType: '',
                contractToolbarList: [],
                contractDetail:{},
                mode: "",
                orderCode: null,
                // 主表绑定数据源
                dataSource: {
                    "area": null,
                    "areaName": "",
                    "cityName": "",
                    "contractPrice": null,
                    "houseStyle": "",
                    "projectId": null,
                    "estateName": "",
                    "yid":0
                },

                // 附表绑定数据源，只有panel（一对一）形式展示的需要绑定，table（一对多）的不需要
                subDataSource: {},
                // 所有配置全部初始化在这里
                options: {
                    places:[],
                    contractType:[
                    ]


                },
                schema: schema,
                subTables: schema.subTables,
                mainTable: schema.mainTable,
                // 控制主表区域收缩
                isTopHide: false,
                isDialogShow: true,
                // 主表tab默认激活页
                mainActiveTab: '',
                // 附表tab默认激活页
                subActiveTab: '',
                // 点击关闭后的返回route
                goBackRoute: '/tochat-sale-manage/contract-list',
                sourceMap: {},
                columns: {},

                dealer: Cookie.get('t8t-tc-username'),
                dealerId: Cookie.get('t8t-tc-uid'),
                spacesData:[],
            }
        },

        watch:{
            $route: function () {
                this.initPage()
            },
            subActiveTab:function(val){
                switch (val) {
                    case this.subTables[0].name:
                        if(!this.constructionPic.length && this.projectId) {
                            this.imgDeal()
                        }
                        break;
                    case this.subTables[1].name:
                        if(!this.spacesData || !this.spacesData.length) {
                            this.initQuoteTable()
                        }
                        break;
                    case this.subTables[2].name:
                        if(!this.contractDetail || !(this.contractDetail.fileList && this.contractDetail.fileList.length)) {
                            this.initContractPane()
                        }
                        break;
                }
            }
        },
        created () {
            this.getProperty()
            this.initPage()

        },
        methods: {
            showPicture(e){
                let url = e.target.parentNode.parentNode.firstChild.firstChild.src;
                this.dialogVisible = true;
                this.dialogImageUrl = url;
            },
            showPicture1(url){
                this.dialogVisible = true;
                this.dialogImageUrl = url;
            },
            showPicture(e){
                console.log(e)
                let url = e.target.parentNode.parentNode.firstChild.firstChild.src;
                this.dialogVisible = true;
                this.dialogImageUrl = url;
            },
            getProperty(){
                let _this = this
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: 30003
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
                            _this.$nextTick(function(){
                                _this.options['places'] = list
                            })
                        }
                    })
            },
            //页面初始化
            initPage() {
                this.projectId = this.$route.query.projectId
                this.mode = this.$route.query.mode || 'view'
                this.processId = this.$route.query.procInsId
                this.buttonSet()
                this.mainTable.args.projectId = this.projectId

                this.initMainTable()
            },

            //按钮及附加表单获取
            buttonSet() {
                switch (this.mode) {
                    case "create":
                        this.contractToolbarList = ['SUBMIT']
                        break;
                    case "verify":
                        this.contractToolbarList = ['AUDITING-SUBMIT', 'APPROVAL-FLOW']
                        this.appendForm = {
                            form: {
                                agree: 1,
                                message: null,
                                followTime: ''
                            },
                            rules: {
                                agree: [
                                    {
                                        required: true,
                                        message: '请选择审核意见'
                                    }
                                ]
                            },
                            fields: [
                                {
                                    label: '',
                                    prop: 'agree',
                                    type: 'radio'
                                },
                                {
                                    label: '审核意见',
                                    prop: 'message',
                                    type: 'textarea',
                                }],
                            radioOption: [
                                {value: 1, text: '同意'},
                                {value: 2, text: '不同意'},
                            ]
                        }
                        this.showAppendForm = true
                        break;
                    default:
                        this.contractToolbarList = [null]
                }
            },
            changeRadio(val) {
                if (val === 1) {
                    this.appendForm.rules = {
                        agree: [
                            {
                                required: true,
                                message: '请选择审核'
                            }
                        ]
                    }
                } else if (val === 2) {
                    this.appendForm.rules = {
                        agree: [
                            {
                                required: true,
                                message: '请选择审核'
                            }
                        ],
                        message: [
                            {
                                required: true,
                                message: '请输入审批意见'
                            }
                        ]
                    }
                }
            },
            onTopHide () {
                this.isTopHide = !this.isTopHide
            },
            /**
             * 加载报价单表
             */
            initQuoteTable () {
                let that = this, schema = this.subTables
                this.subTableLoading = true
                contractApi.showNoVerify({quoteOrderShowDTO: {
                    yid: that.projectId
                }}).then(res => {
                    this.subTableLoading = false
                    if(res.data.status == 200) {
                        let _spaceList = res.data.result.quoteOrderSpaceList
                        that.spacesData = _spaceList.quoteOrderSpaceList
                    }
                    else{
                        this.$message.error(res.data.message || "选品报价单获取失败")
                    }
                }).catch(error =>{
                    this.subTableLoading = false
                    console.log(error)
                })
            },
            initContractPane() {
                let self = this
                this.contractTableLoading = true
                contractApi.getValidContractUrl({projectId:parseInt(this.projectId)}).then(res =>
                {
                    self.contractTableLoading = false
                    if(res.data.status === 200 && res.data.result)
                    {
                        let response = res.data.result
                        let contractDetail = {
                            label:'',
                            fileList: [],
                            type:null
                        }
                        if(response.signType === '01') {
                            contractDetail.label = '电子签'
                            contractDetail.fileList = response.urlList
                            contractDetail.type = 1
                        }else if(response.signType === '02'){
                            let _fileList = []
                            contractDetail.label = '线下签约'
                            response.urlList.forEach(item => {
                                _fileList.push({filePath: item,url: Utils.getFullURL(item)})
                            })
                            contractDetail.fileList = _fileList
                            contractDetail.type = 2
                        }else {
                            this.$message.error("合同审核信息获取失败")
                            return
                        }
                        if(contractDetail.fileList &&contractDetail.fileList.length > 0) {
                            this.contractDetail = contractDetail
                        }
                    }else {
                        self.$message.error("合同审核信息获取失败")
                        return
                    }
                }).catch(error => {
                    self.contractTableLoading = false
                    self.$message.error("服务器异常")
                    return
                })
            },
            /**
             * 初始化主表
             */
            initMainTable () {
                let self = this
                // 初始化tab页中的激活选项
                if (this.mainTable.tabs && this.mainTable.tabs.length > 0) {
                    this.mainTable.tabs.forEach((item, key) => {
                        if (item.isActive || key === 0) {
                            this.mainActiveTab = item.name
                        }
                    })
                }
                self.subActiveTab = self.subTables[0].name
                // 在查看和修改模式下需要初始化加载数据
                if ((['view', 'create']).indexOf(this.mode) >= 0) this.loadMainTable()
                if (this.mode === 'verify') {
                    if (!this.processId) {
                        this.$message.error("获取流程信息失败")
                        return false
                    }
                    self.mainTalbeLoading = true
                    contractApi.getDetailByProcessId({
                        processId: this.processId
                    }).then((res) => {
                        self.mainTalbeLoading = false
                        let response = res.data
                        // 数据加载成功
                        if (response && response.status === 200) {
                            this.dataSource = Object.assign({}, this.mainTable.dataSource, response.result)
                            this.projectId = response.result.projectId
                            self.imgDeal()
                        }
                    })
                        .catch((res) => {
                            self.mainTalbeLoading =false
                            // TODO 数据加载失败
                            console.error("panel load data failed.", res)
                        })
                }
            },


            /**
             * 加载主表数据
             */
            loadMainTable () {
                let self = this
                let mainTableSchema = this.mainTable, args = mainTableSchema.args || {}

                if (mainTableSchema.service && mainTableSchema.method) {
                    this.mainTalbeLoading = true
                    axios({
                        service: mainTableSchema.service,
                        method: mainTableSchema.method,
                        args: args
                    })
                        .then((res) => {
                            this.mainTalbeLoading = false
                            let response = res.data
                            // 数据加载成功
                            if (response && response.status == 200) {
                                this.dataSource = Object.assign({}, this.mainTable.dataSource, response.result)
//                                self.loadSubTable()
                                self.imgDeal()
                            }
                        })
                        .catch((res) => {
                            this.mainTalbeLoading =false
                            // TODO 数据加载失败
                            console.error("panel load data failed.", res)
                            // self.$message.error('表格数据加载失败')
                        })
                } else {
                    // TODO 没有传service和method参数处理
                }
            },
            /**
             * 关闭弹窗
             */
            closeDialog () {
                this.$router.push({path: this.goBackRoute})
                this.$emit('close')
            },
            showFlow() {
                this.flowArgs = {id: this.dataSource.id}
                this.isShowFlow = true
            },
            closeFlowShow(){
                this.isShowFlow = false
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            viewPdf(url) {
                this.pdfVisible=true
                this.$nextTick(()=>{
                    PDFObject.embed(Utils.getPreviewURL(url), "#pdf")
                })
            },
            //图片处理
            imgDeal() {
                this.fileLoading = true
                contractApi.findPhotosByProjectId({projectId: parseInt(this.projectId)}).then(res => {
                    this.fileLoading = false
                    if (res.data.status === 200) {
                        let list = res.data.result
                        let attachVOList = list.sort((a,b) => {return a.photoesType > b.photoesType})
                        let typeList = []
                        for (let j = 0; j < attachVOList.length; j++) {
                            let _typeList = {
                                label:attachVOList[j].photoesName,
                                fileList:[]
                            }
                            let _fileList = []
                            if(attachVOList[j].items && attachVOList[j].items.length > 0) {
                                attachVOList[j].items.forEach(item => {
                                    _fileList.push({filePath: item.photoPath,url: Utils.getFullURL(item.photoPath),photoeType:item.photoeType})
                                })
                            }
                            if(_fileList.length > 0) {
                                _typeList.fileList = _fileList
                                typeList.push(_typeList)
                            }
                        }
                        this.constructionPic = typeList
                        console.log(this.constructionPic)
                    }else {
                        this.$message.error("图片信息获取失败")
                    }
                }).catch(error => {
                    this.fileLoading = false
                    console.log(error)
                })
            },
            submitBtn(){
                let _self = this
                let _args = {
                    verifyOrder:{
                        createUser:this.dealerId,
                        projectId : this.projectId
                    }
                }
                _self.$refs.contractToolbar.disableBySymbol('SUBMIT');
                contractApi.create(_args).then(res =>{
                    _self.$refs.contractToolbar.unDisableBySymbol('SUBMIT');
                    if(res.data.status == 200) {
                        _self.$message.success("操作成功！")
                        _self.closeDialog()
                    }else{
                        _self.$msgbox({
                            title: '消息',
                            message: res.data.message || '合同添加失败',
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                    }
                }).catch(error => {
                    console.log(error)
                    _self.$refs.contractToolbar.unDisableBySymbol('SUBMIT');
                })
            },
            auditingBtn(){
                let _self = this
                this.$refs.appendForm.validate(isValide => {
                    if(isValide) {
                        let _arg = {
                            verifyDTO: {
                                id: this.dataSource.id,
                                agreeType:this.appendForm.form.agree,
                                verifyUser:this.dealerId,
                                procInsId:this.processId,
                                disagreeReason:this.appendForm.form.message
                            }
                        }
                        _self.$refs.contractToolbar.disableBySymbol('AUDITING-SUBMIT');
                        contractApi.verify(_arg).then(res =>{
                            _self.$refs.contractToolbar.unDisableBySymbol('AUDITING-SUBMIT');
                            if(res.data.status == 200) {
                                _self.$message.success("操作成功！")
                                _self.closeDialog()
                            }else{
                                _self.$msgbox({
                                    title: '消息',
                                    message: res.data.message || '合同审核失败',
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            }
                        }).catch(error => {
                            console.log(error)
                            _self.$refs.contractToolbar.unDisableBySymbol('AUDITING-SUBMIT');
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="css" scoped>
    /*.full-dialog-form-container {*/
    /*position: relative;*/
    /*}*/
    .sub-container .pic-container {
        width: 1220px;
        margin: 10px auto;
    }
    .sub-container .pic-container span {
        margin: 0px 5px 10px;
        display: block;
        text-align: left;
        font-size: 14px;
    }
    .g-pdf-dialog .el-dialog{
        width: 1200px;
    }
    #pdf{
        height: 600px;
    }



</style>
<style type="text/css" scoped>
    .uoload-box{
        margin: 30px 0 30px 0;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        display: inline-block;
        text-align: center;
    }
    .uoload-box .uploader-icon{
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .picture-list{
        margin-top: 30px;
    }
    .picture-list .list-item{
        width: 200px;
        height: 188px;
        display: inline-block;
        margin: 0;
        padding: 0;
        overflow: hidden;
        margin: 0 15px 15px 0;
    }
    .picture-list .list-item img{
        cursor: pointer;
    }
    .picture-list .list-item .item-img{
        overflow: hidden;
        border: 1px solid #c0ccda;
        border-radius: 6px;
        box-sizing: border-box;
        width: 200px;
        height: 120px;
        position: relative;
    }
    .picture-list .list-item .item-img .item-status-label{
        position: absolute;
        right: -16px;
        top: -6px;
        width: 40px;
        height: 24px;
        background: #13ce66;
        color: #fff;
        text-align: center;
        transform: rotate(45deg);
        box-shadow: 0 0 1pc 1px rgba(0,0,0,.2);
        cursor: pointer;
    }
    .picture-list .list-item .item-img .item-status-label i{
        font-size: 12px;
        margin-top: 11px;
        -ms-transform: rotate(-45deg) scale(.8);
        transform: rotate(-45deg) scale(.8);
        color: #fff;
    }
    .picture-list .list-item .item-text{
        text-align: center;
    }
    .picture-list .list-item .item-text p{
        margin: 8px 0;
        font-size: 14px;
    }
</style>

<style>
    .t8t-detail-view .el-select-dropdown__item.is-disabled {
        font-size: 1px !important;
    }

    .append-form-container .el-form-item__content {
        width: 240px !important;
    }

    .set-form-container .el-form-item .el-form-item__content {
        width: 80% !important;
    }

    .sub-container .pic-container div.el-upload-disabled > .el-upload--picture-card {
        display: none !important;
    }

    .sub-container .pic-container div.el-upload-full > .el-upload--picture-card {
        display: none !important;
    }

    .sub-container .pic-container div.el-upload-disabled span.el-upload-list__item-delete {
        display: none !important;
    }

    html,body
    {
        height: 100%;
    }
    .contract-detail .t8t-form-panel{
        margin:0 auto;
    }
    .spaceQuoteItemPanel {
        height: 100%;
    }
    .spaceQuoteItemPanel .space-content{
        border-bottom: 1px solid #dfe6ec;
        text-align: center;
        min-height: 200px;
    }

    .spaceQuoteItemPanel .t8t-table{
        height: auto
    }

    .spaceQuoteItemPanel .el-table{
        border-bottom: none !important;
        border-top: none !important;
        border: none !important;
    }

    .spaceQuoteItemPanel .el-row .t8t-table div.cell span{
        overflow: hidden;

    }
    .spaceQuoteItemPanel .el-row .t8t-table div.cell span .name-wrapper span.selectDeliveryIdHand{
        overflow: hidden;
        height: 32px;
        display: block;
    }



    .space-data-header{
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
        .space-data-header {
            height: 32px;
            line-height: 32px;
        }
    }
    .space-data-body{
        min-height: 200px;
        /* height: 100%;*/
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .space-data-body-text{
        height:160px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .space-data-body-input-box{
        /*margin: 5px;*/
    }
    .space-number-input{
        width:120px;
        margin:2px;
        padding-left:2px;
    }
    .space-name{
        /*margin-top: 5px; *//*和space-data-body-input-box 的 margin一致*/
        font-size: 16px;
    }
    .space-name-text{
        /*padding: 25%;*/
    }
    .space-plus, .space-remove{
        text-align: right;
    }
    .space-plus button, .space-remove button{
        margin-right:5px;
    }
    .space-data{
        border-right: 1px solid #dfe6ec;
        height:100%;
    }
    .spaceAliasInput input{
        text-align: center;
    }


    .contract-detail .summary-header{
        text-align: left;
        padding-left:20px;
    }
    .selectDeliveryIdHand{
        cursor: pointer;
    }
    .remove-spaceitem{
        margin: 5px;
    }
    .craftDetails-popover{
        max-width:350px;
        line-height: 25px;
    }

    .contract-detail .el-table__body-wrapper{
        height:auto !important;
    }

    /*解决小屏幕出现小表格横向滚动条问题*/


    @media screen and (max-height: 900px) {
        .contract-detail{
            min-width: 1654px;
        }
        .contract-detail .el-col-3{
            min-width: 180px;
        }
        .contract-detail .el-col-6{
            min-width: 360px;
        }
        .contract-detail .el-col-18{
            min-width: 1294px;
        }
        .contract-detailDialog .el-dialog__body{
            min-width: 1654px;
        }

        .t8t-full-dialog .toolbar-container{
            width:100%;
        }

        .contract-detail .spaceQuoteItemPanel{
            min-width: 1654px;
        }
        .contract-detail .spaceQuoteItemPanel .el-row {

        }
        .contract-detail .space-content .el-table {
            overflow: initial;
            width: initial;
            max-width:none;
        }
        .contract-detail .space-content .el-table__body{
            width:100% !important;
        }

        .contract-detail .summaryMoney{
            min-width: 1654px;
        }
        .contract-detail .summaryMoney .el-table__body{
            width:100% !important;
        }
        .contract-detail .summaryMoney .el-table {
            max-width:100%;
        }
        .contract-detail .summaryMoney .el-row {
            display: flex;
        }

        .contract-detail .headerForm {
            /* min-width:1654px;*/
        }



        /*.contract-detail .el-table__body-wrapper {
               overflow: hidden;
           }
           .contract-detail .el-table__body {
               width:auto !important;
           }*/

    }
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
    .view-pic-dialog>.el-dialog--preview{
        min-width: 60% !important;
        max-width: 80% !important;
    }

</style>
