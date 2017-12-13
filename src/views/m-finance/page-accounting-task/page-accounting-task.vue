<template>
    <div v-bind="accounting-task">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
        >
        </t8t-search>
        <t8t-toolbar
            v-loading.body.lock="barLoading"
            @EXECUTE="btnExecuteClick"
            @CANCEL="btnCancelClick"
            @CLOSE="btnCloseClick"
            @VIEW="btnView">
        </t8t-toolbar>
        <t8t-table
            :columns="columns"
            :commonData="commonData"
            :service="service"
            :method="method"
            :args="args"
            :isLoading="isLoading"
            ref="t8tTable"
            :pageBar="false"
            @row-double-click="onView"
            @selection-change="selectionChange"
            :preLoad="false"
        >
        </t8t-table>

    </div>
</template>

<script>
    import Service from 'src/services/finance/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import apiAccountingTask from 'src/services/finance/accountingTask.js'
    import apiInventoryAccountingCostDomainConfig from 'src/services/finance/costDomainConfig.js'

    import Cookie from 'js-cookie'
    import * as config from './config'

    let costDomainId
    export default {
        name: 'page-accounting-task',
        components: {},
        methods: {
            selectionChange(selRows){
                this.indexes = selRows.map(i => this.$refs['t8tTable'].dataSource.indexOf(i))
            },
            // 双击查看
            onView(row) {
                this.$router.push({
                    path: '/tuchat-finance/page-accounting-task-item',
                    query: {taskId: row.id, costDomainId: row.costDomainId}
                })
            },
            getLastMonthFirstDay(){
                var nowDays = new Date()
                var year = nowDays.getFullYear()
                var month = nowDays.getMonth()
                month--
                if (month === 0) {
                    month = 12
                    year = year - 1
                }

                var lastMonthFirstDate = new Date(year, month, 1, 0, 0, 0)
                return lastMonthFirstDate.getTime() / 1000
            },
            submitSearch(obj) {
                if (obj.accountingTime === null) {
                    obj.accountingTime = this.getLastMonthFirstDay()
                }
                if (obj.costDomainId === null) {
                    obj.costDomainId = costDomainId
                }
                this.searchCache = obj
                this.args = {search: obj}
            },
            startWkf(selectedRow){
                let args = {
                    accountingTaskId: selectedRow.id,
                    updateUser: parseInt(Cookie.get('t8t-tc-uid'))
                }

                apiAccountingTask.startWkf(args)
                    .then((res) => {
                            if (res.data.status === 200) {
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '成功',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.isLoading = false
                                this.barLoading = false
                                this.$refs['t8tTable'].reloadTable()
                            }
                            else {
                                this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: res.data.message,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.isLoading = false
                                this.barLoading = false
                            }
                        }
                    )
            },
            executeWkf(selectedRow, chooseWay){
                var args
                if (selectedRow.taskStageName === '数据检查') {
                    if (chooseWay == 0 && selectedRow.status == 2) { //执行成功撤销
                        args = {
                            accountingTaskId: selectedRow.id,
                            updateUser: parseInt(Cookie.get('t8t-tc-uid')),
                            workFlow: {
                                chooseWayA: -1,
                                chooseWayB: chooseWay,
                                chooseWayC: -1,
                                chooseWayD: -1
                            }
                        }
                    }
                    else {
                        args = {
                            accountingTaskId: selectedRow.id,
                            updateUser: parseInt(Cookie.get('t8t-tc-uid')),
                            workFlow: {
                                chooseWayA: chooseWay,
                                chooseWayB: -1,
                                chooseWayC: -1,
                                chooseWayD: -1
                            }
                        }
                    }

                }
                else if (selectedRow.taskStageName === '计算全月平均单价') {
                    if (chooseWay == 0) {
                        args = {
                            accountingTaskId: selectedRow.id,
                            updateUser: parseInt(Cookie.get('t8t-tc-uid')),
                            workFlow: {
                                chooseWayC: chooseWay,
                                chooseWayB: -1,
                                chooseWayA: -1,
                                chooseWayD: -1
                            }
                        }
                    }
                    else {
                        args = {
                            accountingTaskId: selectedRow.id,
                            updateUser: parseInt(Cookie.get('t8t-tc-uid')),
                            workFlow: {
                                chooseWayB: chooseWay,
                                chooseWayC: -1,
                                chooseWayA: -1,
                                chooseWayD: -1
                            }
                        }
                    }
                }
                else if (selectedRow.taskStageName === '更新库存明细账') {
                    if (chooseWay == 0 && selectedRow.status == 2) {
                        args = {
                            accountingTaskId: selectedRow.id,
                            updateUser: parseInt(Cookie.get('t8t-tc-uid')),
                            workFlow: {
                                chooseWayD: chooseWay,
                                chooseWayB: -1,
                                chooseWayA: -1,
                                chooseWayC: -1
                            }
                        }
                    }
                    else {
                        args = {
                            accountingTaskId: selectedRow.id,
                            updateUser: parseInt(Cookie.get('t8t-tc-uid')),
                            workFlow: {
                                chooseWayC: chooseWay,
                                chooseWayB: -1,
                                chooseWayA: -1,
                                chooseWayD: -1
                            }
                        }
                    }
                }
                else if (selectedRow.taskStageName === '汇总收发存账簿') {
                    if (chooseWay == 0 && selectedRow.status == 2) { //当前步骤执行成功，但是需要撤销
                        args = {
                            accountingTaskId: selectedRow.id,
                            updateUser: parseInt(Cookie.get('t8t-tc-uid')),
                            workFlow: {
                                chooseWayD: 3,
                                chooseWayB: -1,
                                chooseWayA: -1,
                                chooseWayC: -1
                            }
                        }
                    }
                    else {
                        args = {
                            accountingTaskId: selectedRow.id,
                            updateUser: parseInt(Cookie.get('t8t-tc-uid')),
                            workFlow: {
                                chooseWayD: chooseWay,
                                chooseWayB: -1,
                                chooseWayA: -1,
                                chooseWayC: -1
                            }
                        }
                    }
                }

                apiAccountingTask.executeWkf(args)
                    .then((res) => {
                            if (res.data.status === 200) {
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '成功',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.barLoading = false
                                this.isLoading = false
                                this.$refs['t8tTable'].reloadTable()
                            }
                            else {
                                this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: res.data.message,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.isLoading = false
                                this.barLoading = false
                            }
                        }
                    )
            },
            //点击执行按钮
            btnExecuteClick() {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                } else if (selections.length > 1) {
                    this.$message.error('请对单条数据进行操作。')
                } else {
                    let selectedRow = selections[0]
                    var selectedIndex = this.indexes[0]
                    var lastRow = this.$refs['t8tTable'].dataSource[selectedIndex - 1]
                    var nextRow = this.$refs['t8tTable'].dataSource[selectedIndex + 1]

                    var wkfFlag = true
                    if (lastRow !== undefined) {
                        if (lastRow.status != 2) {
                            wkfFlag = false
                            this.$message.error('上一步骤未执行完成，请执行上一步骤！')
                        }
                        else if (nextRow !== undefined) {
                            if (nextRow.status == 2 || selectedRow.status == 2) {
                                wkfFlag = false
                                this.$message.error('流程已进入下一步，请执行下一步！')
                            }
                        }
                    }
                    if (wkfFlag) {

                        if (selectedRow.taskStageName === '数据检查') {
                            if (selectedRow.status === 3 || selectedRow.status === 4) { //3执行失败或者4已撤销
                                this.barLoading = true
                                this.executeWkf(selectedRow, 1);
                            }
                            else if (selectedRow.status === 1) {
                                //1执行中
                                this.$message.error('任务执行中，请勿进行操作。')
                            }
                            else {
                                this.barLoading = true
                                this.startWkf(selectedRow)
                            }
                        }
                        else {
                            if (selectedRow.status === 1) {
                                //1执行中
                                this.$message.error('任务执行中，请勿进行操作。')
                            }
                            else {
                                this.barLoading = true
                                this.executeWkf(selectedRow, 1);
                            }
                        }
                    }
                }

            }
            ,
            btnCancelClick()
            {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                } else if (selections.length > 1) {
                    this.$message.error('请对单条数据进行操作。')
                } else {
                    let selectedRow = selections[0]
                    var selectedIndex = this.indexes[0]
                    var lastRow = this.$refs['t8tTable'].dataSource[selectedIndex - 1]
                    var nextRow = this.$refs['t8tTable'].dataSource[selectedIndex + 1]

                    var wkfFlag = true
                    if (nextRow !== undefined) {
                        if (nextRow.status < 4 && nextRow.status > 1) {
                            wkfFlag = false
                            this.$message.error('下一步骤未执行撤销，请撤销下一步骤！')
                        }
                        else if (lastRow !== undefined) {
                            if (lastRow.status == 4) {
                                wkfFlag = false
                                this.$message.error('流程不在该步，请勿撤销！')
                            }
                        }
                    }
                    if (wkfFlag) {
                        if (selectedRow.status != 2) {
                            this.$message.error('非执行成功状态，无需撤销')
                        }
                        else {
                            this.barLoading = true
                            this.executeWkf(selectedRow, 0);
                        }
                    }
                }
            },
            btnCloseClick()
            {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                } else if (selections.length > 1) {
                    this.$message.error('请对单条数据进行操作。')
                } else {
                    let selectedRow = selections[0]
                    if (selectedRow.taskStageName !== '汇总收发存账簿') {
                        this.$message.error('请对最后一步进行关闭操作。')
                    }
                    else {
                        if (selectedRow.status != 2) {
                            this.$message.error('非执行成功不可关闭！')
                        }
                        else {
                            this.barLoading = true
                            this.executeWkf(selectedRow, 2);
                        }
                    }
                }
            }
            ,
            btnView()
            {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                } else if (selections.length > 1) {
                    this.$message.error('请对单条数据进行操作。')
                } else {
                    let selectedRow = selections[0]
                    this.$router.push({
                        path: '/tuchat-finance/page-accounting-task-item',
                        query: {taskId: selectedRow.id, costDomainId: selectedRow.costDomainId}
                    })
                }
            }
        },
        computed: {},
        watch: {},
        data() {
            return {
                indexes: [],
                barLoading: false,
                breadcrumbData: config.breadcrumbData,
                //表格
                columns: config.columns,
                commonData: config.commonData,
                isLoading: false,
                service: Service.INVENTORY_ACCOUNTING.name,
                method: Service.INVENTORY_ACCOUNTING.methods.accountingTaskQueryPage,
                args: {},
                searchCache: {
                    "costDomainId": null
                },
                //搜索表单项配置
                fields: [
                    {
                        type: 'select',
                        label: '成本域',
                        name: 'costDomainId',
                        selectSourceKey: 'costDomainConfigOptions'
                    },
                    {
                        type: 'datepicker',
                        label: '会计期间',
                        name: 'accountingTime',
                        pickertype: 'month'
                    }
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    costDomainConfigOptions: []
                }
            }
        },
        beforeCreate(){
        },
        created() {
            let args = {
                search: {
                    status: 1
                }
            };
            apiInventoryAccountingCostDomainConfig.query(args)
                .then((res => {
                    let list = []
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            list.push({
                                value: item.id,
                                text: item.name
                            })
                        })
                        this.selectSource.costDomainConfigOptions = list
                        costDomainId = this.selectSource.costDomainConfigOptions[0].value
                        this.args = {
                            search: {
                                costDomainId: costDomainId,
                                accountingTime: this.getLastMonthFirstDay()
                            }
                        }
                    }
                }))
        }
    };
</script>

<style>

</style>
