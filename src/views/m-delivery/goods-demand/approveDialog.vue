<template>
    <div class="t8t-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                            @SUBMIT="submit()"
                            @APPROVAL-FLOW="flowBtn()"
                            ref="approveToolbar"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container" :class="{'isHide': isTopHide}">
                    <div class="toggle-btn-container">
                        <div class="toggle-btn el-icon-d-arrow-left" @click="onTopHide"></div>
                    </div>
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
                                    <div class="field_container">
                                        <base-panel
                                            :dataSource="dataSource"
                                            :fields="mainTable.fields"
                                            :disabled="disabled"
                                            :options="options || {}"
                                            :ref="mainTable.name"
                                            @click="handleClick"
                                            @blur="handleBlur"
                                            @focus="handleFocus"
                                            @change="handleChange"
                                            @select-change="handleSelectChange"
                                        ></base-panel>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </el-form>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">

                        <div class="t8t-detail">
                            <el-tabs v-model="subActiveTab" class="t8t-detail">

                                <el-tab-pane :label="subTables.label" :name="subTables.name">
                                    <div class="sub-container">
                                        <!--table-->
                                        <t8t-table
                                            :preLoad="false"
                                            :columns="subTables.fields"
                                            :service="subTables.service"
                                            :method="subTables.method"
                                            :args="subTables.args"
                                            :ref="subTables.name"
                                            :commonData="options || {}"
                                            @row-double-click="rowDbClick"
                                            @current-row-change="currentRowChange"
                                            @current-page-change="currentPageChange"
                                            @size-change="sizeChange"
                                            @sort-change="sortChange"
                                            @row-click="rowClick"
                                            @cell-editor-change="onEditorChange"
                                            @cell-click="onCellClick"
                                        ></t8t-table>

                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <receipts-table-dialog
            v-if="receiptsTableDialogShow"
            :tableDialogSet="dialogSet"
            @close="closeReceiptsDialog"
        >
        </receipts-table-dialog>
        <t8t-step-page
            :args="flowArgs"
            :service="flowService"
            :method="flowMethod"
            :dataSource="flowData"
            v-if="isShowFlow"
            @close="closeStepPage"
        >
        </t8t-step-page>

    </div>
</template>

<script>
    import BasePanel from 'src/components/t8t-base-panel/t8t-base-panel.vue'
    import axios from 'src/utils/axios.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import schema from './goodsDemand-schema'
    import ReceiptsTableDialog from './tablesDialog.vue'
    import T8tAudit from 'src/components/t8t-audit/t8t-audit.vue'
    import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'
    import Cookie from 'js-cookie'
    import Service from 'src/services/delivery/Service.js'
    import DemandApi from 'src/services/delivery/demand.js'
    export default {
        name: 't8t-approve-view',
        components: {BasePanel, ReceiptsTableDialog, T8tAudit, T8tStepPage},
        data () {
            return {
                // 主表绑定数据源
                dataSource: {
                    id:null,
                    orderStatus:null,
                    processName:"",
                    startName:"",
                    startTime:null,
                    taskId:null,
                    projectId:null,
                    ownerName:null,
                    goodsDemandSourceName:null,
                    goodsDemandTime:null,
                    orderCode:null,
                    workerName:null,
                    workerPhone:null,
                    address:null,
                },
                // 附表绑定数据源，只有panel（一对一）形式展示的需要绑定，table（一对多）的不需要
                subDataSource: [],
                // 所有配置全部初始化在这里
                options: {
                    installDispatch: [],
                    materialType: [],
                    goodsDemandSource: [],
                    bizTypeId: [],
                    status: []
                },
                schema: schema,
                subTables: JSON.parse(JSON.stringify(schema.verifyTable)),
                mainTable: schema.verifyFiled,
                // 控制主表区域收缩
                isTopHide: false,
                isDialogShow: true,
                // 主表tab默认激活页
                mainActiveTab: '',
                // 附表tab默认激活页
                subActiveTab: '',
                // 点击关闭后的返回route
                goBackRoute: '/tochat-delivery/demand-list',
                sourceMap: {},
                columns: {},
                id: null,
                processId: null,


                remarkShow: false,
                receiptsTableDialogShow: false,
                flowArgs: {},
                flowService: Service.DEMAND.name,
                flowMethod: Service.DEMAND.methods.GETPROCESSDETAILBYID,
                flowData: [],
                isShowFlow: false,
                showAudit:false,
            }
        },
        created () {
            // 初始化通用query
            this.processId = this.$route.query.procInsId
            schema.verifyFiled.args.processId = this.processId

            // 初始化主附表
            this.initMainTable()
            this.initSubTable()
        },
        methods: {
            onTopHide () {
                this.isTopHide = !this.isTopHide
            },
            /**
             * 初始化附表
             */
            initSubTable () {
                let that = this, schema = this.subTables, fieldCache
                that.subActiveTab = schema.name
            },
            /**
             * 初始化主表
             */
            initMainTable () {
                this.mainActiveTab = this.mainTable.name
                this.loadMainTable()
            },
            /**
             * 加载主表数据
             */
            loadMainTable () {
                let self = this
                let mainTableSchema = schema.verifyFiled, args = mainTableSchema.args || {}

                if (mainTableSchema.service && mainTableSchema.method) {
                    this.loading = true

                    axios({
                        service: mainTableSchema.service,
                        method: mainTableSchema.method,
                        args: args
                    })
                        .then((res) => {
                            let response = res.data
                            // 数据加载成功
                            if (response && response.status == 200) {
                                this.dataSource = Object.assign({}, schema.verifyFiled.dataSource, response.result)
                                if(this.dataSource.orderStatus == 4) {
                                    this.showAudit = true
                                }
                                self.loadSubTable()
                            }else{
                                self.$message.error("数据加载失败")
                            }
                        })
                        .catch((res) => {
                            self.$message.error("数据加载失败")
                            // TODO 数据加载失败
                            console.error("panel load data failed.", res)
                            // self.$message.error('表格数据加载失败')
                        })
                } else {
                    // TODO 没有传service和method参数处理
                }
            },
            /**
             * 加载附表数据
             */
            loadSubTable () {
                let self = this
                let schema = this.subTables, args, service, method, temp, argsString

                service = schema.service
                method = schema.method

                if (service && method) {
                    args = schema.args || {}
                    argsString = JSON.stringify(args)
                    argsString = argsString.replace(/\@([a-zA-Z]+)/g, function (word, $1) {
                        return self.dataSource[$1]
                    })
                    eval(' temp =  ' + argsString)
                    args = temp

                    // 列表查询模式
                    if (schema.type === 'table') {
                        args.page = schema.page || 1
                        args.size = schema.pageSize || 20
                        schema.args = args
                    }
                }
            },

            /**
             * 关闭弹窗
             */
            closeDialog () {
                this.$router.push({path: this.goBackRoute})
            },

            rowDbClick(data){
                this.dialogSet = {
                    type: 'demand',
                    args: {
                        id: data.id
                    }
                }
                this.receiptsTableDialogShow = true
            },
            closeReceiptsDialog () {
                this.receiptsTableDialogShow = false
            },

            submit() {
                if(this.dataSource.orderStatus != 4) {
                    this.$message.error("当前状态不能审批!")
                    return false
                }
                 this.$TCS.addTag('red_5216_010002004002') //点击流
                let _self = this
                this.checkItem((pass) => {
                        let verifyForm = _self.$refs['t8taudit'].ruleForm
                        let args = {
                            "verifyDTO" : {
                                "id" : this.dataSource.id,
                                "disagreeReason" : verifyForm.idea,
                                "agreeType" : verifyForm.agree,
                                "verifyUser": Cookie.get('t8t-tc-uid')
                            }
                        }
                        DemandApi.verify(args).then((res) => {
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
                })
            },
            checkItem(callback) {
                this.$refs['t8taudit'].validate(validate => {
                    if(validate){
                        this.$refs['approveToolbar'].disableBySymbol('SUBMIT');
                        let _self = this
                        let verifyForm = _self.$refs['t8taudit'].ruleForm
                        if(verifyForm.agree == 1){
                            DemandApi.checkoutGoodsDosage({id:this.dataSource.id})
                                .then((res) => {
                                    _self.$refs['approveToolbar'].unDisableBySymbol('SUBMIT');
                                    if(res.data && res.data.status == 200) {
                                        if(res.data.result == 1){
                                            callback(true)
                                        }else if(res.data.result == 2){
                                            _self.$confirm('要货数量已超出系统上限用量，确认下单么？', '友情提示', {
                                                type: 'warning',
                                                confirmButtonText: '确定',
                                                cancelButtonText: '取消',
                                            }).then(() => {
                                                callback(true)
                                            })
                                        }else{
                                            _self.$msgbox({
                                                title: '消息',
                                                message: res.data.message || '校验上限失败',
                                                type: 'error',
                                                showCancelButton: false,
                                                confirmButtonText: '知道了',
                                                confirmButtonClass: 'is-plain'
                                            })
                                        }
                                    }else{
                                        _self.$msgbox({
                                            title: '消息',
                                            message: res.data.message || '校验上限失败',
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                    }
                                })
                                .catch((error) => {
                                    _self.$refs['approveToolbar'].unDisableBySymbol('SUBMIT')
                                })
                        }else{
                            callback(true)
                        }
                    }
                })
            },
            flowBtn() {
                this.flowArgs = {id: this.dataSource.id}
                this.isShowFlow = true
            },
            closeStepPage(){
                this.isShowFlow = false
            }
        }
    };
</script>

<style lang="css" scoped>
    /*.full-dialog-form-container {*/
    /*position: relative;*/
    /*}*/
</style>

<style>

</style>
