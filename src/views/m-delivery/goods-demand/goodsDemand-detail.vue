<template>
    <div class="t8t-detail-view demand-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new" >
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container" :class="{'isHide': isTopHide}">
                    <div class="toggle-btn-container">
                        <div class="toggle-btn el-icon-d-arrow-left" @click="onTopHide"></div>
                    </div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container container-center">

                        <el-form ref="mainTable"
                                 label-position="right"
                                 label-width="120px"
                                 :model="dataSource"
                        >

                            <el-tabs v-model="mainActiveTab">


                                <el-tab-pane :label="mainTable.tabs[0].label" :name="mainTable.tabs[0].name">

                                    <div class="field_container">
                                        <base-panel
                                            :dataSource="dataSource"
                                            :fields="mainTable.tabs[0].fields"
                                            :mode="mode"
                                            :disabled="disabled"
                                            :options="options || {}"
                                            :ref="mainTable.tabs[0].name"
                                            @click="handleClick"
                                            @blur="handleBlur"
                                            @focus="handleFocus"
                                            @change="handleChange"
                                            @select-change="handleSelectChange"
                                        ></base-panel>
                                    </div>

                                </el-tab-pane>

                                <el-tab-pane :label="mainTable.tabs[1].label" :name="mainTable.tabs[1].name">

                                    <div class="field_container">
                                        <base-panel
                                            :dataSource="dataSource"
                                            :fields="mainTable.tabs[1].fields"
                                            :mode="mode"
                                            :disabled="disabled"
                                            :options="options || {}"
                                            :ref="mainTable.tabs[1].name"
                                            @click="handleClick"
                                            @blur="handleBlur"
                                            @focus="handleFocus"
                                            @change="handleChange"
                                            @select-change="handleSelectChange"
                                        ></base-panel>
                                    </div>

                                </el-tab-pane>

                                <el-tab-pane :label="mainTable.tabs[2].label" :name="mainTable.tabs[2].name">

                                    <div class="field_container">
                                        <base-panel
                                            :dataSource="dataSource"
                                            :fields="mainTable.tabs[2].fields"
                                            :mode="mode"
                                            :disabled="disabled"
                                            :options="options || {}"
                                            :ref="mainTable.tabs[2].name"
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

                                <el-tab-pane :label="subTables[0].label" :name="subTables[0].name">
                                    <div class="sub-container">
                                        <!-- 查看模式才出现按钮 -->
                                        <div class="my-toolbar">
                                            <el-button
                                                type="primary"
                                                size="small"
                                                icon="plus"
                                                @click="remarking"
                                            >添加备注</el-button>
                                        </div>
                                        <!--table-->
                                        <t8t-table
                                            :radioCol=false
                                            :indexCol="true"

                                            :preLoad="false"
                                            :columns="subTables[0].fields"
                                            :service="subTables[0].service"
                                            :method="subTables[0].method"
                                            :args="subTables[0].args"
                                            :editable="true"
                                            :ref="subTables[0].name"
                                            :commonData="options || {}"
                                            @selection-change="selectionChange"
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
        <el-dialog title="添加备注" v-model="remarkShow" @close="remarkClose" ref="remarkRef" class="demandRemark">
            <el-form ref="remarkForm"
                     label-position="right"
                     label-width="120px"
                     :model="remarkSource"
            >
                <div class="textarea-container">
                    <el-input type="textarea" height="150px" v-model="remarkSource.remark"></el-input>
                </div>
            </el-form>

            <div slot="footer">
                <el-button type="primary" @click="remarkBtn" :loading="remarkLoading" :disabled="remarkDisabled">提交</el-button>
                <el-button @click="remarkClose">取消</el-button>
            </div>
        </el-dialog>
        <receipts-table-dialog
            v-if="receiptsTableDialogShow"
            :tableDialogSet="dialogSet"
            @close="closeReceiptsDialog"
        >
        </receipts-table-dialog>
    </div>
</template>

<script>
    import BasePanel from 'src/components/t8t-base-panel/t8t-base-panel.vue'
    import axios from 'src/utils/axios.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import schema from './goodsDemand-schema'
    import ReceiptsTableDialog from './tablesDialog.vue'
    import Service from 'src/services/delivery/Service.js'
    import DemandApi from 'src/services/delivery/demand.js'

    export default {
        name: 't8t-dt-view',
        components: {BasePanel,ReceiptsTableDialog},
        data () {
            return {
                id: null,
                // 主表绑定数据源
                dataSource: {
                    id: null,
                    orderCode: null,
                    scheduleNodeId: null,
                    projectId: null,
                    installDispatch: null,
                    materialType: null,
                    goodsDemandSource: null,
                    bizTypeId: null,
                    organizationId: null,
                    orderTime: null,
                    scheduleDemandTime: null,
                    goodsDemandTime: null,
                    goodsReceiptTime: null,
                    remark: null,
                    status: null,
                    createName: null,
                    createBy: null,
                    createTime: null,
                    updateName: null,
                    updateBy: null,
                    updateTime: null,
                    billType:'要货单',
                    workerName:null,
                    detailAddress:null
                },
                // 附表绑定数据源，只有panel（一对一）形式展示的需要绑定，table（一对多）的不需要
                subDataSource: {
                },
                // 所有配置全部初始化在这里
                options: {
                    orderStatusOption:[
                        {text: "待发货", value: 0},
                        {text: "已发货", value: 1},
                        {text: "已收货", value: 2},
                        {text: "取消", value: 3},
                        {text: "待审核", value: 4},
                        {text: "已驳回", value: 5},
                        {text: "新建（暂存）", value: 6},
                        {text: "待报备", value: 7}
                    ],
                    closeOption:[
                        {text:"未关闭", value:0},
                        {text:"已关闭", value:1}
                    ],
                    installDispatch: [
                    ],
                    materialType: [
                    ],
                    goodsDemandSource: [
                    ],
                    bizTypeId: [
                    ],
                    status: [
                    ]
                },
                schema: schema,
                subTables: JSON.parse(JSON.stringify(schema.subTables)),
                mainTable: schema.mainTable,
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
                remarkSource:{
                    remark:''
                },
                remarkShow: false,
                receiptsTableDialogShow:false,
                remarkDisabled:false,
                remarkLoading:false

            }
        },
        created () {
            // 初始化通用query
            this.id = this.$route.query.id
            this.mode = this.$route.query.mode || 'view'
            schema.mainTable.args.id = this.id
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
                if (schema && schema.length > 0) {
                    schema.forEach((item, key) => {
                        // 附表页签初始化选中项
                        if (item.isActive || key === 0) {
                            that.subActiveTab = item.name
                        }
                        that.sourceMap[item.name] = {
                            type: item.type,
                            service: item.service,
                            method: item.method,
                            index: key,
                            name: item.name || null
                        }
                    })
                }
            },
            /**
             * 初始化主表
             */
            initMainTable () {
                // 初始化tab页中的激活选项
                if (schema.mainTable.tabs && schema.mainTable.tabs.length > 0) {
                    schema.mainTable.tabs.forEach((item, key) => {
                        if (item.isActive || key === 0) {
                            this.mainActiveTab = item.name
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
                let mainTableSchema = schema.mainTable, args = mainTableSchema.args || {}

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
                                this.dataSource = Object.assign(this.dataSource, schema.mainTable.dataSource, response.result)
                                self.loadSubTable()
                            }
                        })
                        .catch((res) => {
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

                schema.forEach((subSchema, key) => {

                    service = subSchema.service
                    method = subSchema.method

                    if (service && method) {
                        args = subSchema.args || {}
                        argsString = JSON.stringify(args)
                        argsString = argsString.replace(/\@([a-zA-Z]+)/g, function(word, $1) {
                            return self.dataSource[$1]
                        })
                        eval(' temp =  ' + argsString)
                        args = temp

                        // 列表查询模式
                        if (subSchema.type === 'table') {
                            args.page = subSchema.page || 1
                            args.size = subSchema.pageSize || 20
                            schema[key].args = args
                        }
                    }

                });
            },
            /**
             * 主表表单校验
             * @param callback
             */
            validateMainTable(callback) {
                this.$refs['mainTable'].validate((isValid) => {
                    callback && callback(isValid)
                })
            },
             /**
             * 新增行
             * @param tabName
             */
            addLine (tabName) {
                this.$refs[tabName].addNewRow()
            },
            /**
             * 删除行
             * @param tabName
             */
            delLine (tabName) {
                this.$refs[tabName].delRows()
            },
            /**
             * 关闭弹窗
             */
            closeDialog () {
                //this.$router.push({ path: this.goBackRoute })
                this.$router.go(-1)

//                this.$emit('close')
            },
            /**
             * 点击提交后的动作处理
             */
            submit () {
                let that = this
                that.validate((isValid) => {
                    // 校验通过 提交
                    let method = that.getMethod()

                    if (isValid) {
                        axios({
                            service: that.mainTable.service,
                            method: method,
                            args: that.formatParams()
                        })
                            .then((res) => {
                                // TODO 修改提交后处理
                                if (res.data && res.data.status === 200) {
                                    this.$message({
                                        type:'success',
                                        message: '提交成功'
                                    })
                                } else {
                                    // TODO 失败处理
                                    this.$message.error('操作失败')
                                }
                            })
                            .catch((err) => {
                                // TODO 提交错误处理
                            })
                    }
                })
            },
            /**
             * 对整个页面数据进行校验
             * @param cb 校验完成后的回调函数，回调参数为校验结果（true|false）
             */
            validate (cb) {
                let that = this
                that.validateMainTable((isValid) => {
                    if (isValid) {
                        that.validateSubTables((isSubValid) => {
                            cb && cb(isSubValid)
                        })
                    } else {
                        cb && cb(isValid)
                    }
                })
            },
            /**
             * 附表参数校验
             * @param cb 回调函数
             * @param key
             */
            validateSubTables (cb, key) {
                let k = key || 0, that = this

                if (!this.subTables || !this.subTables.length) {
                    cb && cb(true)
                    return
                }

                // 通过schema中的定义的tab.name去递归遍历校验

                this.$refs[this.subTables[k].name].validate((isValid) => {
                    k++
                    if (k >= that.subTables.length || !isValid) {
                        cb(isValid)
                        return
                    }

                    that.validateSubTables(cb, k)
                })
            },
            rowDbClick(data){
                this.dialogSet = {
                    type:'detail',
                    args:{
                        id:data.id
                    }
                }
                this.receiptsTableDialogShow = true
            },
            closeReceiptsDialog () {
                this.receiptsTableDialogShow = false

//                this.$router.push({ path: this.goBackRoute })
//                this.$emit('close')
            },
            remarking() {
                if(this.$refs['goodsDemandItem'].getSelectRows()) {
                    if(this.$refs['goodsDemandItem'].getSelectRows().length < 1) {
                        this.$message.error("请选择单条物品后重试")
                        return false
                    }
                    let selectedRows = this.$refs['goodsDemandItem'].getSelectRows()
                    let minRowNum = 999
                    this.$refs['goodsDemandItem'].dataSource.forEach((item, index) => {
                         if(selectedRows.indexOf(item) > -1 && index < minRowNum){
                            minRowNum = index
                         }
                    })
                    let firstRow = this.$refs['goodsDemandItem'].dataSource[minRowNum]
                    this.remarkSource.remark = firstRow.remark
                    this.remarkShow = true
                }else{
                    this.$message.error("请选择物品后重试")
                    return false
                }

            },
            remarkClose() {
                this.remarkShow = false
            },
            remarkBtn(){
                //validate todo
                if(this.remarkSource.remark.length > 200) {
                    this.$message.error("备注不能超过200字！")
                    return false
                }
                this.remarkDisabled = true
                this.remarkLoading = true
                let _self = this
                let selectedRows = this.$refs['goodsDemandItem'].getSelectRows()
                let minRowNum = 999
                this.$refs['goodsDemandItem'].dataSource.forEach((item, index) => {
                     if(selectedRows.indexOf(item) > -1 && index < minRowNum){
                        minRowNum = index
                     }
                })
                let firstRow = this.$refs['goodsDemandItem'].dataSource[minRowNum]

                DemandApi.itemAddRemark({id:firstRow.id,remark:_self.remarkSource.remark})
                    .then((res) => {
                        _self.remarkDisabled = false
                        _self.remarkLoading = false
                        if(!res.data || res.data.status != 200) {
                            _self.$msgbox({
                                title: '消息',
                                message: res.data.message || '备注添加失败',
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            return false
                        }
                        else{
                            _self.$message.success("操作成功！")
                            _self.$refs['goodsDemandItem'].reloadTable()
                            _self.remarkClose()
                        }
                    })
                    .catch((error) => {
                        _self.remarkDisabled = false
                        _self.remarkLoading = false
                        _self.$msgbox({
                            title: '消息',
                            message: error || '备注添加失败',
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        return false
                        })
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
    .demand-detail-view .demandRemark .el-textarea__inner{
        height: 150px !important;
    }
</style>
