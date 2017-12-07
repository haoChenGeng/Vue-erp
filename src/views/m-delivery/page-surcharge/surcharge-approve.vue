<template>
    <div class="t8t-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new" >
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                            @SUBMIT="submit"
                            @APPROVAL-FLOW="flowBtn"
                            ref="approveToolbar"
                        >
                        </t8t-toolbar>
                    </div>
                </div>

                <div class="dialog2-main-container">
                    <div class="full-dialog-form-container" v-if="showAudit">
                            <t8t-audit
                                :auditForm="auditform"
                                ref="t8taudit">
                            </t8t-audit>
                    </div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container container-center">
                        <el-form ref="mainTable"
                                 label-position="right"
                                 label-width="120px"
                                 :model="dataSource"
                        >
                            <el-tabs v-model="mainActiveTab">
                                <el-tab-pane :label="mainTable.label" :name="mainTable.name">
                                    <div class="field_container" v-loading.body.lock="loading">
                                        <base-panel
                                            :dataSource="dataSource"
                                            :fields="mainTable.fields"
                                            :disabled="disabled"
                                            :options="options || {}"
                                            :ref="mainTable.name"
                                        ></base-panel>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </el-form>
                    </div>

                    <!-- 标签页区 -->
                    <div class="full-dialog-form-container container-center">
                        <el-form ref="subTable"
                                 label-position="right"
                                 label-width="120px"
                                 :model="dataSource"
                        >
                            <el-tabs v-model="subActiveTab">
                                <el-tab-pane :label="subTable.tabs[0].label" :name="subTable.tabs[0].name">
                                    <div class="field_container" v-loading.body.lock="loading">
                                        <base-panel
                                            :dataSource="dataSource"
                                            :fields="subTable.tabs[0].fields"
                                            :disabled="disabled"
                                            :options="options || {}"
                                            :ref="subTable.tabs[0].name"
                                        ></base-panel>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane :label="subTable.tabs[1].label" :name="subTable.tabs[1].name">
                                    <div class="field_container" v-loading.body.lock="loading">
                                        <base-panel
                                            :dataSource="dataSource"
                                            :fields="subTable.tabs[1].fields"
                                            :disabled="disabled"
                                            :options="options || {}"
                                            :ref="subTable.tabs[1].name"
                                        ></base-panel>
                                    </div>
                                </el-tab-pane>

                            </el-tabs>

                        </el-form>
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
            @close="closeStepPage">
        </t8t-step-page>
    </div>
</template>

<script>
    import BasePanel from 'src/components/t8t-base-panel/t8t-base-panel.vue'
    import Service from 'src/services/delivery/surcharge/Service.js'
    import surchargeApi from 'src/services/delivery/surcharge/surcharge.js'
    import schema from './surcharge-schema.js'
    import T8tAudit from 'src/components/t8t-audit/t8t-audit.vue'
    import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'
    export default {
        name: 'surcharge-view',
        components: {BasePanel,T8tAudit,T8tStepPage},
        data () {
            return {
                id: null,
                processId: null,
                // 主表绑定数据源
                dataSource: {
                    applyAmount:null,
                    closeReason:null,
                    code:null,
                    createTime:null,
                    createUser:null,
                    currencyId:null,
                    currencyName:null,
                    id:null,
                    processId:null,
                    realAmount:null,
                    remark:null,
                    settleStatus:null,
                    sourceOrderCode:null,
                    sourceOrderLineNo:null,
                    sourceOrderType:null,
                    supplierId:null,
                    supplierName:null,
                    surchargeType:null,
                    surchargeTypeName:null,
                    updateTime:null,
                    updateUser:null,
                    verifyStatus:null,
                    verifyTime:null,
                    verifyUser:null,
                    taskId:null,
                    processName:null,
                    startName:null,
                    startTime:null
                },
                // 附表绑定数据源，只有panel（一对一）形式展示的需要绑定，table（一对多）的不需要
                subDataSource: {
                },
                // 所有配置全部初始化在这里
                options: {
                    verifyStatusOpt:[
                        {value:0,text:"无状态"},
                        {value:1,text:"暂存(新生成)"},
                        {value:2,text:"审核中"},
                        {value:3,text:"暂存(重新审核)"},
                        {value:4,text:"已审核"},
                        {value:5,text:"已关闭"}
                    ],
                    settleStatusOpt:[
                        {value:0,text:"无状态"},
                        {value:1,text:"待结算"},
                        {value:2,text:"结算中"},
                        {value:3,text:"已结算"}
                    ],
                    sourceOrderTypeOpt:[
                        {value:0,text:''},
                        {value:1,text:'直运采购订单'},
                        {value:2,text:'安装单'},
                        {value:3,text:'测量单'},
                        {value:4,text:'标准采购订单'},
                    ]
                },
                schema: schema,
                mainTable: schema.verifyFiled,
                subTable: schema.verifySub,


                isDialogShow: true,

                // 主表tab默认激活页
                mainActiveTab: '',
                subActiveTab:'',

                // 点击关闭后的返回route
                goBackRoute: '/tochat-delivery/page-surcharge-list',
                sourceMap: {},
                //审核相关
                showAudit:true,
                flowArgs: {},
                flowService: Service.SURCHARGE.name,
                flowMethod: Service.SURCHARGE.methods.GETPROCESSDETAILBYID,
                flowData: [],
                isShowFlow: false,
                loading:false
            }
        },

        created () {
            this.processId = this.$route.query.procInsId
            // 初始化主附表
            this.initMainTable()
        },
        methods: {
            /**
             * 初始化主表
             */
            initMainTable () {
                this.mainActiveTab = this.mainTable.name
                if (this.subTable.tabs && this.subTable.tabs.length > 0) {
                    this.subTable.tabs.forEach((item, key) => {
                        if (item.isActive || key === 0) {
                            this.subActiveTab = item.name
                        }
                    })
                }
                this.loadMainTable()
            },
            /**
             * 加载主表数据
             */
            loadMainTable () {
                let self = this
                this.loading = true
                surchargeApi.getDetailByProcessId({processId:this.processId})
                    .then(res => {
                        self.loading = false
                        let response = res.data
                        if (response && response.status == 200) {
                            this.dataSource = Object.assign(this.dataSource, response.result)
                        }else{
                            this.$message.error("信息获取失败")
                        }
                    }).catch(error => {
                        self.loading = false
                        this.$message.error("信息获取失败")
                    })
            },
            flowBtn() {
                this.$TCS.addTag('red_13937_010007011003') //点击流
                this.flowArgs = {id: this.dataSource.id}
                this.isShowFlow = true
            },
            closeStepPage(){
                this.isShowFlow = false
            },
            closeDialog(){
                this.$router.go(-1)
            },
            submit() {
                if(this.dataSource.verifyStatus != 2) {
                    this.$message.error("当前状态不能审批!")
                    return false
                }
                this.$TCS.addTag('red_13937_010007011002') //点击流
                let _self = this
                this.$refs['t8taudit'].validate(validate => {
                    if(validate) {
                        let verifyForm = _self.$refs['t8taudit'].ruleForm
                        let args = {
                            "id" : parseInt(this.dataSource.id),
                            "comment" : verifyForm.idea,
                            "approve" : parseInt(verifyForm.agree),
                            "verifyUser": parseInt(Cookie.get('t8t-tc-uid'))
                        }
                        _self.$refs['approveToolbar'].disableBySymbol('SUBMIT');
                        surchargeApi.verify(args).then((res) => {
                            _self.$refs['approveToolbar'].unDisableBySymbol('SUBMIT');
                            if(res.data.status == 200) {
                                _self.$msgbox({
                                    title: '消息',
                                    message: "提交成功",
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
                                    message: res.data.message || '提交失败',
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            }
                        }).catch((error) => {
                            _self.$refs['approveToolbar'].unDisableBySymbol('SUBMIT');
                            _self.$msgbox({
                                title: '消息',
                                message: '提交失败',
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            return
                    })
                    }
                })
            },
        }
    };
</script>
