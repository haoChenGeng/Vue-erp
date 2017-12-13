<template>
    <div class="t8t-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" size="full" v-model="isDialogShow" class="t8t-full-dialog2 dialog-new">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                            @SUBMIT="submitBtn"
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
                                <el-tab-pane label="项目详情" name="detail">
                                    <div class="field_container">
                                        <base-panel
                                            :dataSource="dataSource"
                                            :fields="fields"
                                            :disabled="disabled"
                                            :options="options"
                                            v-loading.body.lock="detailLoading"
                                            @select-change="searchSub"
                                            @date-change="searchSub"
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
                                    <div class="sub-container record-detail">
                                        <!--table-->
                                        <t8t-table
                                            :dataSource="subdataSource"
                                            :columns="subdataFields"
                                            :commonData="options"
                                            ref="recordDetailTable"
                                            @row-click="viewBtn"
                                            :pageBar="false"
                                            :selectCol="false"
                                            v-loading.body.lock="tableLoading"
                                        >
                                        </t8t-table>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <record-detail-dialog
            v-if="showDetail"
            :projectInfo="dataSource"
            :recordInfo="recordInfo"
            @close="closeDetail"
        >
        </record-detail-dialog>
    </div>
</template>

<script>
    import BasePanel from 'src/components/t8t-base-panel/t8t-base-panel.vue'
    import Utils from 'src/utils/Utils.js'
    import broadcastApi from 'src/services/delivery/broadcast.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import Service from 'src/services/salemanager/Service.js'
    import Cookie from 'js-cookie'
    import RecordDetailDialog from './record-detail-dialog.vue'
    export default {
        name: 'company-allocation-view',
        components: {BasePanel, RecordDetailDialog},
        data () {
            return {
                id: null,
                mainActiveTab: "detail",
                subActiveTab: "item",
                dataSource: {
                    bizTypeName: null,
                    chiefWorkerName: null,
                    createTime: null,
                    productPkgName: null,
                    projectId: null,
                    id:null,
                    projectManagerNick: null,
                    standardCityName: null,
                    startTime: null,
                    wholeAddress: null,
                    recordType:0,
                    recordStatus:0,
                },
                subdataSource: [],
                subdataFields: [
                    {
                        prop: "createTime",
                        label: "日期",
                        formatter: function (val) {
                            let _time = ''
                            if (val) {
                                let objDate = new Date(val * 1000);
                                _time = DateUtils(objDate, 'yyyy-mm-dd')
                            }
                            return _time
                        }
                    },
                    {
                        prop: "recordType",
                        label: "播报类型",
                        formatter(val, row, event, tab){
                            let _typeName = ''
                            let _recordType = tab.commonData.recordType
                            if (_recordType[val]) {
                                _typeName = '<span class="blue">' + _recordType[val] + '<span>'
                            }
                            return _typeName
                        }
                    },
                    {
                        prop: "createTime",
                        label: "播报时间",
                        formatter: function (val,row) {
                            let _time = ''
                            if (val) {
                                let _data = new Date(val * 1000)
                                _time = DateUtils(_data, "HH:MM:ss")
                                let _spanClass = ''
                                switch (row.recordStatus) {
                                    case 2:
                                        _spanClass = "orange"
                                        break;
                                    case 3:
                                        _spanClass = "red"
                                        _time = "-"
                                        break;
                                    default:
                                        _spanClass = "normal"
                                }
                                _time = '<span class="'+_spanClass+'">'+ _time +'</span>'
                            }
                            return _time
                        }
                    },
                    {
                        prop: "recordStatus",
                        label: "播报情况",
                        formatter(val, row, event, tab){
                            let _typeName = ''
                            let _recordStatus = tab.commonData.recordStatus
                            if (_recordStatus[val]) {
                                let _spanClass = ''
                                switch (val) {
                                    case 2:
                                        _spanClass = "orange"
                                        break;
                                    case 3:
                                        _spanClass = "red"
                                        break;
                                    default:
                                        _spanClass = "normal"
                                }
                                _typeName = '<span class="' + _spanClass + '">' + _recordStatus[val] + '<span>'
                            }
                            return _typeName
                        }
                    }
                ],
                TableLoading: false,
                fields: [
                    {
                        type: 'input',
                        label: '项目ID',
                        prop: 'id',
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '项目经理',
                        prop: 'chiefWorkerName',
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '工程管家',
                        prop: 'projectManagerNick',
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '城市',
                        prop: 'standardCityName',
                        disabled: "disabled"
                    }, {
                        type: 'datetime',
                        label: '开工时间',
                        prop: 'startTime',
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '业务类型',
                        prop: 'bizTypeName',
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '产品包',
                        prop: 'productPkgName',
                        disabled: "disabled"
                    }, {
                        type: 'textarea',
                        label: '项目地址',
                        prop: 'wholeAddress',
                        disabled: "disabled"
                    }, {
                        type: 'select',
                        label: '播报情况',
                        list: 'broadcastStatus',
                        prop: 'recordStatus'
                    }, {
                        type: 'select',
                        label: '播报类型',
                        list: "broadcastType",
                        prop: "recordType"
                    }],
                options: {
                    broadcastType: [
                        {value: null, text: '全部'},
                        {value: 1, text: '早播'},
                        {value: 2, text: '晚播'},
                    ],
                    broadcastStatus: [
                        {value: null, text: '全部'},
                        {value: 1, text: '正常'},
                        {value: 2, text: '延期'},
                    ],
                    recordType: {
                        1: "早播",
                        2: "晚播"
                    },
                    recordStatus: {
                        1: "正常",
                        2: "延期",
                        3: "未播",
                        4: "待播"
                    },
                },
                detailLoading: false,
                tableLoading: false,
                isDialogShow: true,
                isTopHide: false,
                showDetail: false,
                recordInfo: null,
            }
        },
        created(){
            this.id = this.$route.query.id;
            this.init()
        },
        methods: {
            init(){
                let self = this
                self.setLoading("detail")
                broadcastApi.decorationOrderFindOrderById({id: this.id})
                    .then(res => {
                        self.setLoading("detail")
                        if (res.data.status == 200) {
                            let _data = res.data.result
                            _data.wholeAddress = (_data.standardCityName ? _data.standardCityName : "") + (_data.standardTownName ? "-" + _data.standardTownName : "") + (_data.estateName ? "-" + _data.estateName : "")
                            _data.recordType = null
                            _data.recordStatus = null
                            this.dataSource = Object.assign(this.dataSource,_data)
                        } else {
                            this.$message.error("播报信息获取失败")
                        }
                    }).catch(error => {
                        self.setLoading("detail")
                        this.$message.error("播报信息获取失败")
                        console.log(error)
                })
            },
            getSubTable(args){
                let self = this
                self.setLoading("table")
                broadcastApi.queryPage(args)
                    .then(res => {
                        self.setLoading("table")
                        if (res.data.status != 200) {
                            this.$message.error("工序获取失败")
                            return
                        }
                        this.$nextTick(()=>{
                            this.subdataSource = res.data.result.rows
                        })
                    }).catch(error => {
                    self.setLoading("table")
                    console.log(error)
                    this.$message.error("工序获取失败")
                })
            },
            closeDialog(){
                this.$router.push({path: "/delivery/page-record-list"})
                this.$emit('close')
            },
            onTopHide () {
                this.isTopHide = !this.isTopHide

            },
            closeDetail(){
                this.showDetail = false
            },
            viewBtn(row){
                this.recordInfo = row
                this.showDetail = true
            },
            searchSub(val, type){
                let args = {
                    search: {
                        projectId: this.id,
                        recordType:this.dataSource.recordType,
                        recordStatus:this.dataSource.recordStatus,
                    },
                    page:1,
                    size:1000
                }
                this.getSubTable(args)
                this.$nextTick(() => {
                    this.$refs['recordDetailTable'].reloadTable();
                })
            },
            setLoading(val){
                this[val + 'Loading'] = !this[val + 'Loading']
            }
        }
    }
</script>
<style>
    .record-detail .t8t-table td .cell-text span.orange {
        color: #f5a623 !important;
    }

    .record-detail .t8t-table td .cell-text span.normal {
        color: #999 !important;
    }

    .record-detail .t8t-table td .cell-text span.red {
        color: #fa6969 !important;
    }

    .record-detail .t8t-table td .cell-text span.blue {
        color: blue !important;
    }
    .record-detail .t8t-table table tr.el-table__row td{
        cursor: pointer;
    }


</style>
