<template>
    <div class="t8t-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" size="full" v-model="isDialogShow" class="t8t-full-dialog2 dialog-new">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            ref="durationToolbar"
                            class="t8t-dark"
                            @SUBMIT="submitBtn"
                            :symbolList="durationToolbarList"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container" :class="{'isHide': isTopHide}">
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container container-center">
                        <el-form ref="mainTable"
                                 label-position="right"
                                 label-width="120px"
                                 :model="dataSource">
                            <el-tabs v-model="mainActiveTab">
                                <el-tab-pane label="工期配置" name="detail">
                                    <div class="field_container">
                                        <base-panel
                                            :options="options"
                                            :dataSource="dataSource"
                                            :fields="fields"
                                            :disabled="disabled"
                                            v-loading.body.lock="detailLoading"
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
                                <el-tab-pane label="工序配置" name="item">
                                    <div class="sub-container">
                                        <div class="my-toolbar" v-if="editable">
                                            <el-button
                                                type="primary"
                                                size="small"
                                                icon="plus"
                                                @click="doAdd()"
                                            >新增
                                            </el-button>
                                            <el-button
                                                type="danger"
                                                size="small"
                                                icon="close"
                                                @click="doEdit()"
                                            >修改
                                            </el-button>
                                            <el-button
                                                type="danger"
                                                size="small"
                                                icon="close"
                                                @click="doDel()"
                                            >删除
                                            </el-button>
                                        </div>
                                        <t8t-table
                                            ref="durationItemTable"
                                            :dataSource="subdataSource"
                                            :preLoad="false"
                                            :columns="subTablesFields"
                                            v-loading.body.lock="TableLoading"
                                            :pageBar="false"
                                        ></t8t-table>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <duration-item-dialog
            v-if="addDialogVisible"
            @close="closeAdd"
            :durationInfos="durationInfos"
            :formInfos="formInfos"
            @reload="reloadTable"
        ></duration-item-dialog>
    </div>
</template>

<script>
    import BasePanel from 'src/components/t8t-base-panel/t8t-base-panel.vue'
    import Utils from 'src/utils/Utils.js'
    import broadcastApi from 'src/services/delivery/broadcast.js'
    import DateUtils from 'src/utils/DateUtils.js'


    import Service from 'src/services/salemanager/Service.js'
    import Cookie from 'js-cookie'


    import DurationItemDialog from './duration-item-dialog.vue'
    export default {
        name: 'company-allocation-view',
        components: {BasePanel, DurationItemDialog},
        data () {
            return {
                id: null,
                mainActiveTab: "detail",
                subActiveTab: "item",
                dataSource: {},
                subdataSource: [],
                subTablesFields: [
                    {prop: "skuId", label: "sku ID",width:100},
                    {prop: "startTime", label: "开始时间",width:100},
                    {prop: "endTime", label: "完工时间",width:100},
                    {prop: "goodsName", label: "商品名称",width:200},
                    {
                        prop: "taskStatus", label: "所属阶段",width:150,formatter: function (val, row) {
                        return row.taskStatusName ? row.taskStatusName : ""
                    }
                    },
                    {prop: "startPictureLabel", label: "开工图片"},
                    {prop: "endPictureLabel", label: "完工图片"},
                ],
                editable:false,
                fields: [
                    {
                        type: 'input',
                        label: '业务类型',
                        prop: 'bizTypeName',
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '产品包',
                        prop: 'pkgName',
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '工时',
                        prop: 'manHour',
                        disabled: "disabled"
                    }, {
                        type: 'select',
                        label: '工期状态',
                        prop: 'processStatus',
                        list: "durationStatus",
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '第一次播报时限',
                        prop: 'firstTime',
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '第二次播报时限',
                        prop: 'secondTime',
                        disabled: "disabled"
                    }],
                options:{
                    durationStatus:[
                        {value:0,text:"待提交"},
                        {value:1,text:"已提交"},
                    ]
                },
                detailLoading: false,
                isDialogShow: true,
                addDialogVisible: false,
                durationInfos: null,
                formInfos: null,
                userName: Cookie.get('t8t-tc-username'),
                durationToolbarList:[],
                TableLoading: false,
                isTopHide:false
            }
        },
        created(){
            this.id = this.$route.query.id;
            this.getMainTable();
        },
        methods: {
            getMainTable(){
                this.detailLoading = true
                broadcastApi.broadcastDurationFindById({id: this.id}).then(res => {
                    this.detailLoading = false
                    if (res.data.status == 200) {
                        this.dataSource = Object.assign({},res.data.result)
                        if(parseInt(this.dataSource.processStatus) === 1) {
                            this.durationToolbarList = [null]
                        }else{
                            this.editable = true
                        }
                        this.getSubTable();
                    } else {
                        this.$message.error("获取工期配置失败");
                    }
                }).catch(error => {
                    this.detailLoading = false
                    this.$message.error("获取工期配置失败")
                    console.log(error)
                })
            },
            getSubTable(){
                this.setSubLoading()
                broadcastApi.broadcastDurationItemFindByDurationId({
                    id: this.id,
                    page: 1,
                    size: 1000,
                    sort: ["id_asc"]
                }).then(res => {
                    this.setSubLoading()
                    if (res.data.status == 200) {
                        this.subdataSource = res.data.result.rows
                    } else {
                        this.$message.error("获取工序配置失败");
                    }
                }).catch(error => {
                    this.setSubLoading()
                    this.$message.error("获取工序失败")
                    console.log(error)
                })
            },
            closeDialog(){
                this.$router.push({path: "/delivery/page-duration-list"})
                this.$emit('close')
            },
            doAdd() {
                if (!this.dataSource.bizTypeName || !this.dataSource.pkgName) {
                    this.$message.error("工期配置获取错误！")
                    return
                }
                this.durationInfos = {
                    durationId: this.id,
                    durations: this.dataSource.bizTypeName + '--' + this.dataSource.pkgName,
                    title: "新增工序",
                    manHour: this.dataSource.manHour
                }
                this.formInfos = null
                this.addDialogVisible = true
            },
            doEdit(){
                if (!this.dataSource.bizTypeName || !this.dataSource.pkgName) {
                    this.$message.error("工期配置获取错误！")
                    return
                }
                let rows = this.$refs['durationItemTable'].getSelectRows();
                if (rows.length > 0) {
                    if (rows.length > 1) {
                        this.$message.error("请选择单条工序进行编辑")
                        return false
                    } else {
                        this.durationInfos = {
                            durationId: this.id,
                            durations: this.dataSource.bizTypeName + '--' + this.dataSource.pkgName,
                            title: "修改工序",
                            manHour: this.dataSource.manHour
                        }
                        this.formInfos = rows[0]
                        this.addDialogVisible = true
                    }
                } else {
                    this.$message.error("前选择需要编辑的工序")
                    return
                }
            },
            doDel(){
                let rows = this.$refs['durationItemTable'].getSelectRows();
                let self = this
                if (rows.length > 0) {
                    this.$confirm('确认删除选中工序？', '删除确认', {type: 'warning'})
                        .then(() => {
                            let idList = []
                            rows.forEach((item) => {
                                idList.push(item.id)
                            })
                            self.setSubLoading()
                            broadcastApi.broadcastDurationItemDeleteByIds({ids: idList, userName: self.userName})
                                .then(res => {
                                    self.setSubLoading()
                                    if (res.data.status === 200) {
                                        self.$message({
                                            type: 'success',
                                            message: '操作成功'
                                        })
                                        self.reloadTable()
                                    } else {
                                        self.$message({
                                            type: 'error',
                                            message: '操作失败'
                                        })
                                    }
                                }).catch(error => {
                                self.setSubLoading()
                                self.$message.error("操作失败")
                                console.log(error)
                            })
                        })
                } else {
                    this.$message.error("前选择需要删除的工序")
                    return
                }
            },
            closeAdd(){
                this.addDialogVisible = false
            },
            reloadTable(){
                this.getSubTable()
            },
            submitBtn(){
                let self = this
                if(!this.subdataSource.length){
                    this.$message.error("请添加工序后提交")
                    return
                }
                this.$confirm('提交后不允修改，确认提交？', '确认提交', {
                    type: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    self.$refs.durationToolbar.disableBySymbol('SUBMIT');
                    broadcastApi.broadcastDurationUpdateStatus({id: self.id, userName: self.userName})
                        .then(res => {
                            self.$refs.durationToolbar.unDisableBySymbol('SUBMIT');
                            if (res.data.status == 200) {
                                self.$message({
                                    type: 'success',
                                    message: "提交成功"
                                })
                                self.closeDialog()
                            } else {
                                self.$message({
                                    type: 'error',
                                    message: res.data.message || "提交失败"
                                })
                            }
                        }).catch(error => {
                        self.$refs.durationToolbar.unDisableBySymbol('SUBMIT');
                        self.$message({
                            type: 'error',
                            message: "网络异常"
                        })
                    })
                })
            },
            onTopHide () {
                this.isTopHide = !this.isTopHide
            },
            setSubLoading(){
                this.TableLoading = !this.TableLoading
            }

        }
    }
</script>
