<template>
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2">
        <div class="t8t-full-dialog2-container">
            <h1 class="my-title">执行任务列表</h1>
            <t8t-search
                :fields="fields"
                :selectSource="selectSource"
                @submit="submitSearch"
            >
            </t8t-search>
            <t8t-toolbar
                @DOWNLOAD="btnDownloadClick">
            </t8t-toolbar>
            <t8t-table
                class="my-table"
                :columns="columns"
                :commonData="commonData"
                :service="service"
                :method="method"
                :args="args"
                :isLoading="isLoading"
                ref="t8tTable"
                :pageBar="true"
                :indexCol="true"
                @data-loaded="onDataLoaded"

            >
                <!--用于自定义列模板-->
                <template slot="statusForSign" scope="scope">
                <span
                    v-if="scope.row['statusForSign']===3"
                    style="color:red; font-size: 25px"
                >●</span>
                    <span
                        v-else-if="scope.row['statusForSign']===2"
                        style="color:green; font-size: 25px"
                    >●</span>
                    <span
                        v-else-if="scope.row['statusForSign']===1"
                        style="color:yellow; font-size: 25px"
                    >●</span>
                    <span
                        v-else-if="scope.row['statusForSign']===0"
                        style="color:grey; font-size: 25px"
                    >●</span>
                </template>

                <template slot="taskDurationTimeString" scope="scope">
                <span
                    v-text="(scope.row['status']===0||scope.row['status']===1) ? time : scope.row['taskDurationTimeString']"
                ></span>
                </template>
            </t8t-table>
        </div>
    </el-dialog>
</template>

<script>
    import Service from 'src/services/finance/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import apiInventoryAccountingInitialAccountingData from 'src/services/finance/initialAccountingData.js'
    import apiInventoryAccountingCostDomainConfig from 'src/services/finance/costDomainConfig.js'
    import exportUtils from 'src/utils/export.js'
    import Cookie from 'js-cookie'
    import * as config from './config'
    import countdown from 'src/utils/countdown.js'

    let taskId
    let defaultCostDomainId
    export default {
        name: 'page-accounting-task',
        components: {},
        methods: {
            closeDialog(){
                this.$router.push({path: '/finance/page-accounting-task'})
            },
            btnDownloadClick(){
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                } else if (selections.length > 1) {
                    this.$message.error('请对单条数据进行操作。')
                } else {
                    let selectedRow = selections[0]
                    let exportArgs = this.args
                    exportArgs.page = 1
                    exportArgs.size = 200
                    exportArgs.search = {
                        recordNo: selectedRow.code
                    }

                    this.barLoading = true;
                    exportUtils({
                        service: Service.LOG_SERVICE.name,
                        method: Service.LOG_SERVICE.methods.QUERY_PAGE,
                        args: exportArgs,
                        title: '执行日志',
                        headers: '任务ID,单据类型编号,备注',
                        sorts: 'recordNo,recordType,remark'
                    })
                    this.barLoading = false;
                }
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
            onDataLoaded(){
                countdown(new Date(this.$refs['t8tTable'].tableData[0].taskStartTime * 1000), (ts) => {
                    this.time = ""
                    if (ts.hours > 0) {
                        this.time += ts.hours
                        this.time += "H"
                    }
                    if (ts.minutes > 0) {
                        this.time += ts.minutes
                        this.time += "M"
                    }
                    if (ts.seconds > 0) {
                        this.time += ts.seconds
                        this.time += "S"
                    }
                })
            },
            submitSearch(obj) {
                this.searchCache = obj
                this.args = {search: obj}
            },
            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            }

        },
        computed: {},
        watch: {
//            $route: function () {
//                this.$refs['t8tTable'].reloadTable()
//            }
        },
        data() {
            return {
                isDialogShow: true,
                defaultCostDomainId: defaultCostDomainId,
                barLoading: false,
                taskId: taskId,
                time: "",
                breadcrumbData: config.breadcrumbData,
                //表格
                columns: config.columns,
                commonData: config.commonData,
                isLoading: false,
                service: Service.INVENTORY_ACCOUNTING.name,
                method: Service.INVENTORY_ACCOUNTING.methods.accountingTaskItemQueryPage,
                args: {
                    search: {
                        taskId_eq: taskId,
                        taskStartTime_gte: this.getLastMonthFirstDay()
                    }
                },
                //弹窗dialog配置
                editType: 'add',
                dialogVisible: false,
                rowId: null,
                searchCache: {
                    "costDomainId": null
                },
                //搜索表单项配置
                fields: [
                    {
                        type: 'select',
                        label: '成本域',
                        name: 'costDomainId',
                        selectSourceKey: 'costDomainConfigOptions',
                        defaultValue: defaultCostDomainId
                    },
                    {
                        type: 'datepicker',
                        label: '发起时间',
                        name: 'taskStartTime',
                        pickertype: 'datetimerange',
                        startField: 'taskStartTime_gte',
                        endField: 'taskStartTime_lte',
                        defaultValue: [new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0), new Date()]

                    },
                    {
                        type: 'select',
                        label: '状态',
                        name: 'status',
                        selectSourceKey: 'statusOptions'
                    }

                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    costDomainConfigOptions: [],
                    statusOptions: [
                        {
                            text: '执行成功',
                            value: 2
                        },
                        {
                            text: '执行失败',
                            value: 3
                        },
                        {
                            text: '已撤销',
                            value: 4
                        },
                        {
                            text: '执行中',
                            value: 1
                        }
                    ]
                }
            }
        },
        beforeCreate() {
            taskId = this.$route.query.taskId
            defaultCostDomainId = this.$route.query.costDomainId
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
                    }
                }))
        },
        mounted(){

        }
    };
</script>

<style lang="css" scoped>
    .my-title {
        text-align: center;
    }

    .my-table {
        display: flex;
        flex: 1;

        flex-direction: column;
    }

    .t8t-full-dialog2-container {
        display: flex;
        flex-direction: column;
    }
</style>
