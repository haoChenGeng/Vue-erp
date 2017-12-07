<template>
    <div class="t8t-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 projectcosts" >
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                            @EDIT-SUBMIT="submit()"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container" :class="{'isHide': isTopHide}">
                    <!--<div class="toggle-btn-container">-->
                        <!--<div class="toggle-btn el-icon-d-arrow-left" @click="onTopHide"></div>-->
                    <!--</div>-->
                    <!-- 表单区 -->
                    <!-- 表单区 -->
                    <t8t-breadcrumb ref="list-breadcrumb" v-if="breadcrumbData.length > 0"
                                    :data="breadcrumbData"></t8t-breadcrumb>

                    <div class="full-dialog-form-container">
                        <el-tabs v-model="activeTabName">
                            <el-tab-pane label="项目成本" name="main">
                                <t8t-form-panel ref="fp"
                                                class="projectCosts-form-panel"
                                                :dataSource="formData"
                                                :fields="fields"
                                                :commonData="commonData"
                                                @field-button-click="handleFieldButtonClick()">
                                </t8t-form-panel>
                            </el-tab-pane>
                        </el-tabs>
                    </div>

                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">

                        <div class="t8t-detail">
                            <el-tabs v-model="subActiveTab" class="t8t-detail" name="one">

                                <el-tab-pane :label="subTables[0].label" :name="subTables[0].name">
                                    <div class="sub-container">
                                        <div class="my-toolbar">
                                            <div class="my-toolbar">
                                                <!--TODO-->
                                                <h5>中期结算实际金额合计:{{this.larborMidSum}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;竣工结算实际金额合计:{{this.larborFiniSum}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                </h5>
                                            </div>
                                        </div>
                                        <t8t-grid
                                            :selectCol="false"
                                            :columns="laborColumns"
                                            :service="service1"
                                            :method="method1"
                                            :args="args1"
                                            :editable="(mode === 'edit') ? true : (mode !== 'view' && !disabled)"
                                            :ref="laborCosts"
                                            :commonData="options || {}"
                                            :indexCol="true"
                                            @selection-change="selectionChange"
                                            @row-double-click="rowDbClick"
                                            @current-row-change="currentRowChange"
                                            @current-page-change="currentPageChange"
                                            @size-change="sizeChange"
                                            @sort-change="sortChange"
                                            @row-click="rowClick"
                                            @cell-editor-change="onEditorChange"
                                            @cell-click="onCellClick"
                                            @data-loaded="dataLoadedLar"
                                        ></t8t-grid>

                                    </div>
                                </el-tab-pane>

                                <el-tab-pane :label="subTables[1].label" :name="subTables[1].name">
                                    <div class="sub-container">
                                        <div class="my-toolbar">
                                            <div class="my-toolbar">
                                                <!--TODO-->
                                                <h5>主材计划金额合计:{{this.mianPlanMaterSum}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;辅材计划金额合计:{{this.subPlanMaterSum}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                主材实际金额合计:{{this.mianMaterSum}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;辅材实际金额合计:{{this.subMaterSum}}</h5>
                                            </div>
                                        </div>
                                        <t8t-grid
                                            :selectCol="false"
                                            :columns="matColumns"
                                            :service="service2"
                                            :method="method2"
                                            :args="args1"
                                            :editable="(mode === 'edit') ? true : (mode !== 'view' && !disabled)"
                                            :ref="materialCosts"
                                            :commonData="options || {}"
                                            :indexCol="true"
                                            @selection-change="selectionChange"
                                            @row-double-click="rowDbClick"
                                            @current-row-change="currentRowChange"
                                            @current-page-change="currentPageChange"
                                            @size-change="sizeChange"
                                            @sort-change="sortChange"
                                            @row-click="rowClick"
                                            @cell-editor-change="onEditorChange"
                                            @cell-click="onCellClick"
                                            @data-loaded="dataLoaded"
                                        ></t8t-grid>

                                    </div>
                                </el-tab-pane>

                            </el-tabs>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import BasePanel from 'src/components/t8t-base-panel/t8t-base-panel.vue'
    import axios from 'src/utils/axios.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import schema from './projectCosts-schema.js'
    import Service from 'src/services/finance/Service.js'

    let projectId
    export default {
        name: 't8t-dt-view',
        components: {BasePanel},
        data () {
            return {
                service1: Service.PROJECT_COSTS.name, // /biz/t8t-fi-pca/app
                method1: Service.PROJECT_COSTS.methods.laborCostsQueryPage, // views.laborCosts.queryPage
                args1: {
                    "size": 20,
                    "search": {
                        "projectId": projectId
                    },
                    "page": 1
                },
                service2: Service.PROJECT_COSTS.name, // /biz/t8t-fi-pca/app
                method2: Service.PROJECT_COSTS.methods.materialCostsQueryPage, // views.materialCosts.queryPage

                id: null,
                mode: "",
                formData:[],
                // 附表绑定数据源，只有panel（一对一）形式展示的需要绑定，table（一对多）的不需要
                subDataSource: {
                },
                // 所有配置全部初始化在这里
                options: {
                settleObjectTypeOptions:[
                    {
                        text: '项目经理',
                        value: 1
                    },
                    {
                        text: '装修公司',
                        value: 2
                    },
                    {
                        text: '安装公司',
                        value: 3
                    }
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
                activeTabName: 'main',
                // 附表tab默认激活页
                subActiveTab: 'laborCosts',
                // 点击关闭后的返回route
                goBackRoute: '/tochat-finance/projectCosts',
                sourceMap: {},
                columns: {},
                mianMaterSum: null,
                subMaterSum: null,
                mianPlanMaterSum: null,
                subPlanMaterSum: null,

                larborMidSum: null,
                larborFiniSum: null,

                laborColumns: schema.subTables[0].fields,
                matColumns: schema.subTables[1].fields,
                laborCosts: schema.subTables[0].name,
                materialCosts: schema.subTables[1].name,

                fields: [
                    {
                        type: 'input',
                        label: '工费计划金额',
                        prop: 'workPlanAmount',
                        align: 'right',
                        disabled: true
                    },
                    {
                        type: 'input',
                        label: '工费实际金额',
                        align: 'right',
                        prop: 'workActualAmount',
                        disabled: true
                    },
                    {
                        type: 'input',
                        label: '劳务管理费计划金额',
                        prop: 'laborPalnAmount',
                        align: 'right',
                        width: 300,
                        disabled: true
                    },
                    {
                        type: 'input',
                        label: '劳务管理费实际金额',
                        prop: 'laborActualAmount',
                        align: 'right',
                        width: 300,
                        disabled: true
                    },
                    {
                        type: 'input',
                        label: '材料领用计划金额',
                        prop: 'materialsPlanAmount',
                        align: 'right',
                        formatter: function (val, a) {
                            return parseFloat(val).toFixed(2)
                        },
                        disabled: true
                    },
                    {
                        type: 'input',
                        label: '材料领用实际金额',
                        prop: 'materialsActualAmount',
                        align: 'right',
                        formatter: function (val, a) {
                            return parseFloat(val).toFixed(2)
                        },
                        disabled: true
                    },
                    {
                        type: 'input',
                        label: '安装费计划金额',
                        prop: 'installPlanAmount',
                        align: 'right',
                        formatter: function (val, a) {
                            return parseFloat(val).toFixed(2)
                        },
                        disabled: true
                    },
                    {
                        type: 'input',
                        label: '安装费实际金额',
                        prop: 'installActualAmount',
                        align: 'right',
                        formatter: function (val, a) {
                            return parseFloat(val).toFixed(2)
                        },
                        disabled: true
                    }
                ],

                breadcrumbData:[
                    {title: '财务'},
                    {title: '成本核算'},
                    {title: '项目成本查看'}
                ]
            }
        },

        beforeCreate() {
            projectId = this.$route.query.projectId
        },
        created () {
            // 初始化通用query
            this.id = this.$route.query.id
//            this.mode = this.$route.query.mode || 'add'
            // 初始化主附表
           this.getFormData()
//            this.initSubTable()
        },
        methods: {
            dataLoaded() {
                let dataSource = this.$refs[this.materialCosts].dataSource
                //主材
                let mianSum = 0
                let mianPlanSum = 0
                //辅材
                let subSum = 0
                let subPlanSum = 0
                dataSource.forEach((item) => {
                    if(item.materialName === '主材'){
                        if(item.orderType===1){
                            mianSum += item.actualAmount
                            mianPlanSum += item.planAmount
                        } else{
                            if(item.actualAmount>0){
                                mianSum -= item.actualAmount
                                mianPlanSum -= item.planAmount
                            } else{
                                mianSum += item.actualAmount
                                mianPlanSum += item.planAmount
                            }
                        }
                    } else{
                        if(item.orderType===1){
                            subSum += item.actualAmount
                            subPlanSum += item.planAmount
                        } else{
                            if(item.actualAmount>0){
                                subSum -= item.actualAmount
                                subPlanSum -= item.planAmount
                            } else{
                                subSum += item.actualAmount
                                subPlanSum += item.planAmount
                            }
                        }
                    }
                })
                this.mianMaterSum = mianSum.toFixed(2)
                this.subMaterSum = subSum.toFixed(2)
                this.mianPlanMaterSum = mianPlanSum.toFixed(2)
                this.subPlanMaterSum = subPlanSum.toFixed(2)
            },

            dataLoadedLar(){
                let dataSource = this.$refs[this.laborCosts].dataSource
                let midSum = 0
                let finiSum = 0
                dataSource.forEach((item) => {
                    //中期结算
                    if(item.settleTypeWholeCode === '4!427!42702!42702001'){
                        //收入
                        if(item.receiptsType===1){
                            midSum += item.actualAmount
                        } else{
                            if(item.actualAmount>0){
                                midSum -= item.actualAmount
                            } else{
                                mianSum += item.actualAmount
                            }
                        }
                    } else{
                        if(item.receiptsType===1){
                            finiSum += item.actualAmount
                        } else{
                            if(item.actualAmount>0){
                                finiSum -= item.actualAmount
                            } else{
                                finiSum += item.actualAmount
                            }
                        }
                    }
                })
                this.larborMidSum = midSum.toFixed(2)
                this.larborFiniSum = finiSum.toFixed(2)
            },
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
                        console.log(item)
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

                        if (!that.columns[item.name]) fieldCache = that.columns[item.name] = {}

                        if (item.field_groups) {
                            item.field_groups.forEach((group) => {
                                if (group.fields) {
                                    group.fields.forEach((field) => {
                                        fieldCache[field.prop] = {
                                            labal: field.prop,
                                            type: field.type
                                        }
                                    })
                                }

                            })
                        } else if (item.fields) {
                            item.fields.forEach((field) => {
                                fieldCache[field.prop] = {
                                    labal: field.prop,
                                    type: item.type === 'table' ? (field.editor.type || null) : field.type
                                }
                            })
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

                // 在查看和修改模式下需要初始化加载数据
                if (this.mode == 'view' || this.mode == 'edit') this.loadMainTable()
            },
            /**
             * 加载主表数据
             */
            loadMainTable () {
                let self = this
                let mainTableSchema = schema.mainTable, args = mainTableSchema.args || {}
                debugger
                if (mainTableSchema.service && mainTableSchema.method) {
                    debugger
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
                                this.dataSource = Object.assign({}, schema.mainTable.dataSource, response.result)
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

                if (!this.mode == 'view' || !this.mode =='edit') return

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
                        } else {
                            args.page = 1;
                            args.size = 1;
                            axios({
                                service: service,
                                method: method,
                                args: args
                            })
                                .then((res) => {
                                    let response = res.data
                                    if (response && response.status == 200) {
                                        self.subDataSource[key] = response.result
//                                        self.schema[key].dataSource = response.result
                                    }
                                })
                                .catch((res) => {
                                    // TODO 数据加载失败
                                    console.error("load data failed.", res)
                                    // self.$message.error('表格数据加载失败')
                                })
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
                this.$router.push({ path: this.goBackRoute})
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
             * 通过不同的mode获取不同的方法，用于不同场景的提交数据
             * @returns {*}
             */
            getMethod () {
                if (this.mode === 'add') {
                    return this.mainTable.createMethod
                } else if (this.mode === 'edit') {
                    return this.mainTable.updateMethod
                } else {
                    return this.mainTable.method
                }
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
            /**
             * 组装提交参数（将主表和附表数据以后台标准协议组装）
             */
            formatParams () {
                let args = {}, subDto = {}
                let mainDto = this.dataSource

                if (this.mode === 'edit') {
                    subDto = this.getEditForm()
                } else if (this.mode === 'add') {
                    subDto = this.getAddForm()
                } else {

                }

                args[this.mainTable.name] = Object.assign({}, mainDto, subDto)

                return args
            },
            getAddForm () {
                let key, map, formData = {}, actionLog, beanName

                for (key in this.sourceMap) {
                    map = this.sourceMap[key]
                    beanName = this.sourceMap[key].name

                    // 表格是一对多，有增删改
                    if (map.type == 'table') {
                        actionLog = this.$refs[key].getActionLog(false, true)
                        formData[beanName + 'List'] = actionLog.addedRows;
                    }
                    // 一对一只有改
                    else {
                        formData[beanName] = this.subDataSource[map.name]
                    }
                }

                return formData
            },
            getEditForm () {
                let key, map, formData = {}, actionLog, beanName
                for (key in this.sourceMap) {
                    map = this.sourceMap[key]
                    beanName = this.sourceMap[key].name

                    // 表格是一对多，有增删改
                    if (map.type == 'table') {
                        actionLog = this.$refs[key].getActionLog(false, true)
                        formData[beanName+'List'] = [].concat(actionLog.addedRows, actionLog.editedRows);
                        formData[beanName+'DeleteIds'] = actionLog.deletedIDs;
                    }
                    // 一对一只有改
                    else {
                        formData[beanName] = this.subDataSource[map.name]
                    }
                }

                return formData
            },
            getFormData() {
                let args = {
                    "page": 1,
                    "search": {
                        "id": this.id
                    },
                    "size": 10,
                }
                axios({
                    service: Service.PROJECT_COSTS.name, // /biz/t8t-fi-pca/app
                    method: Service.PROJECT_COSTS.methods.projectCostsQueryPage, // views.projectCosts.queryPage
                    args: args
                })
                    .then((res) => {
                        let response = res.data
                        // 数据加载成功
                        if (response && response.status == 200) {
                            let row = response.result.rows[0]
                            row.workPlanAmount = parseFloat(row.workPlanAmount).toFixed(2)
                            row.workActualAmount = parseFloat(row.workActualAmount).toFixed(2)
                            row.laborPalnAmount = parseFloat(row.laborPalnAmount).toFixed(2)
                            row.laborActualAmount = parseFloat(row.laborActualAmount).toFixed(2)
                            row.materialsPlanAmount = parseFloat(row.materialsPlanAmount).toFixed(2)
                            row.materialsActualAmount = +(row.materialsActualAmount.toFixed(2))
                            row.installPlanAmount = parseFloat(row.installPlanAmount).toFixed(2)
                            row.installActualAmount = parseFloat(row.installActualAmount).toFixed(2)
                            this.formData = row
                        }
                    })
                    .catch((res) => {
                        // TODO 数据加载失败
                        console.error("panel load data failed.", res)
                        // self.$message.error('表格数据加载失败')
                    })
            },
        }
    };
</script>

<style lang="css" scoped>
    /*.full-dialog-form-container {*/
        /*position: relative;*/
    /*}*/

</style>

<style>
    .projectcosts .projectCosts-form-panel{
        width: 1340px;
        max-width: 1340px;
    }
    .projectcosts .projectCosts-form-panel .el-form-item__label{
        width: 135px!important;
    }
    .projectcosts .projectCosts-form-panel .el-form-item__content{
        margin-left: 135px!important;
    }
    .projectcosts.t8t-full-dialog2 .full-dialog-form-container{
        width: 1340px;
    }
    .projectcosts .t8t-table-container .table-container .el-table table tr td div.cell {
        display: block;
    }
</style>
