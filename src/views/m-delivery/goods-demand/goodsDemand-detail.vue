<template>
    <div class="t8t-detail-view demand-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog"
            v-model="isDialogShow"
            size="full"
            class="t8t-full-dialog2 dialog-new">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar class="t8t-dark">
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container"
                    :class="{'isHide': isTopHide}">
                    <div class="toggle-btn-container">
                        <div class="toggle-btn el-icon-d-arrow-left"
                            @click="onTopHide"></div>
                    </div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container container-center">
                        <el-form ref="mainTable"
                            label-position="right"
                            label-width="120px"
                            :model="dataSource">
                            <el-tabs v-model="mainActiveTab">
                                <el-tab-pane :label="mainTable.tabs[0].label"
                                    :name="mainTable.tabs[0].name">
                                    <div class="field_container">
                                        <base-panel :dataSource="dataSource"
                                            :fields="mainTable.tabs[0].fields"
                                            :options="options || {}"
                                            :ref="mainTable.tabs[0].name"></base-panel>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane :label="mainTable.tabs[1].label"
                                    :name="mainTable.tabs[1].name">
                                    <div class="field_container">
                                        <base-panel :dataSource="dataSource"
                                            :fields="mainTable.tabs[1].fields"
                                            :options="options || {}"
                                            :ref="mainTable.tabs[1].name"></base-panel>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane :label="mainTable.tabs[2].label"
                                    :name="mainTable.tabs[2].name">
                                    <div class="field_container">
                                        <base-panel :dataSource="dataSource"
                                            :fields="mainTable.tabs[2].fields"
                                            :options="options || {}"
                                            :ref="mainTable.tabs[2].name"></base-panel>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </el-form>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <div class="t8t-detail">
                            <el-tabs v-model="subActiveTab"
                                class="t8t-detail">
                                <el-tab-pane :label="subTables[0].label"
                                    :name="subTables[0].name">
                                    <div class="sub-container">
                                        <!--table-->
                                        <t8t-table :radioCol=false
                                            :indexCol="true"
                                            :preLoad="false"
                                            :columns="subTables[0].fields"
                                            :service="subTables[0].service"
                                            :method="subTables[0].method"
                                            :args="subTables[0].args"
                                            :ref="subTables[0].name"
                                            :commonData="options || {}"></t8t-table>
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
import schema from './goodsDemand-schema'
import Service from 'src/services/delivery/goodsDemand/Service.js'
export default {
    name: 't8t-dt-view',
    components: { BasePanel },
    data() {
        return {
            id: null,
            // 主表绑定数据源
            dataSource: {
                id: null,
                orderCode: null,
                scheduleNodeId: null,
                sourceProjectId: null,
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
                billType: '要货单',
                workerName: null,
                detailAddress: null,
            },
            // 附表绑定数据源，只有panel（一对一）形式展示的需要绑定，table（一对多）的不需要
            subDataSource: {},
            // 所有配置全部初始化在这里
            options: {
                orderStatusOption: [
                    { text: '待发货', value: 0 },
                    { text: '已发货', value: 1 },
                    { text: '已收货', value: 2 },
                    { text: '取消', value: 3 },
                    { text: '待审核', value: 4 },
                    { text: '已驳回', value: 5 },
                    { text: '新建（暂存）', value: 6 },
                    { text: '待报备', value: 7 },
                ],
                closeOption: [
                    { text: '未关闭', value: 0 },
                    { text: '已关闭', value: 1 },
                ],
                installDispatch: [],
                materialType: [],
                goodsDemandSource: [],
                bizTypeId: [],
                status: [],
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
            goBackRoute: '/tuchat-delivery/demand-list',
            sourceMap: {},
        }
    },
    created() {
        // 初始化通用query
        this.id = this.$route.query.id
        schema.mainTable.args.search.id = this.id
        // 初始化主附表
        this.initMainTable()
        this.initSubTable()
    },
    methods: {
        onTopHide() {
            this.isTopHide = !this.isTopHide
        },
        /**
             * 初始化附表
             */
        initSubTable() {
            let that = this,
                schema = this.subTables,
                fieldCache
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
                        name: item.name || null,
                    }
                })
            }
        },
        /**
             * 初始化主表
             */
        initMainTable() {
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
        loadMainTable() {
            let self = this
            let mainTableSchema = schema.mainTable,
                args = mainTableSchema.args || {}
            if (mainTableSchema.service && mainTableSchema.method) {
                this.loading = true
                axios({
                    service: mainTableSchema.service,
                    method: mainTableSchema.method,
                    args: args,
                })
                    .then(res => {
                        let response = res.data
                        // 数据加载成功
                        if (
                            response &&
                            response.status == 200 &&
                            response.result.rows[0]
                        ) {
                            this.dataSource = {
                                ...this.dataSource,
                                ...schema.mainTable.dataSource,
                                ...response.result.rows[0],
                            }
                            self.loadSubTable()
                        }
                    })
                    .catch(res => {
                        // TODO 数据加载失败
                        console.error('panel load data failed.', res)
                        // self.$message.error('表格数据加载失败')
                    })
            } else {
                // TODO 没有传service和method参数处理
            }
        },
        /**
             * 加载附表数据
             */
        loadSubTable() {
            let self = this
            let schema = this.subTables,
                args,
                service,
                method,
                temp,
                argsString

            schema.forEach((subSchema, key) => {
                service = subSchema.service
                method = subSchema.method
                if (service && method) {
                    args = JSON.parse(JSON.stringify(subSchema.args).replace('\@id',self.id))
                    // 列表查询模式
                    if (subSchema.type === 'table') {
                        args.page = subSchema.page || 1
                        args.size = subSchema.pageSize || 20
                        schema[key].args = args
                    }
                }
            })
        },
        /**
             * 关闭弹窗
             */
        closeDialog() {
            this.$router.push({ path: this.goBackRoute })
            this.$emit('close')
        },
    },
}
</script>
<style lang="css" scoped>

</style>

<style>
.demand-detail-view .demandRemark .el-textarea__inner {
    height: 150px !important;
}
</style>
