<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search :fields="fields" :selectSource="selectSource" @submit="submitSearch">
        </t8t-search>
        <t8t-toolbar @VIEW="view" @fileDownload="fileDownload" @VOID="concel" @ANTI-VOID="antiConcel" @END="end">
        </t8t-toolbar>
        <t8t-table :columns="columns" :service="service" :method="method" :args="args" ref="t8ttable" :commonData="selectSource" @row-double-click="view">
            <template slot="fatherContractCode" scope="scope">
                <span v-if="scope.row['fatherContractCode']===''">—— ——</span>
                <span v-else-if="scope.row['fatherContractCode']!==''">{{scope.row['fatherContractCode']}}</span>
            </template>
        </t8t-table>
        <!-- 作废确认弹窗 -->
        <el-dialog v-model="concelDialog" title="作废确认" @close="closeConcelDialog" ref="concelDialogRef">
            <div class="textarea-container">
                <el-input type="textarea" v-model="concelText" :autosize="{minRows: 6, maxRows: 6}" placeholder="请输入作废原因" maxlength="255"></el-input>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="onConcelBtn">确认</el-button>
                <el-button @click="closeConcelDialog">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog v-model="antiConcelDialog" title="反作废确认" @close="closeAntiConcelDialog" ref="antiConcelDialogRef">
            <div class="textarea-container">
                <el-input type="textarea" v-model="antiConcelText" :autosize="{minRows: 6, maxRows: 6}" placeholder="请输入反作废原因" maxlength="255"></el-input>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="onAntiConcelBtn">确认</el-button>
                <el-button @click="closeAntiConcelDialog">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog v-model="endDialog" title="终止确认" @close="closeEndDialog" ref="endDialogRef">
            <div class="textarea-container">
                <el-input type="textarea" v-model="endText" :autosize="{minRows: 6, maxRows: 6}" placeholder="请输入终止原因" maxlength="255"></el-input>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="onEndBtn">确认</el-button>
                <el-button @click="closeEndDialog">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/commodule/Service.js'
    import ApiTraffic from 'src/services/commodule/traffic.js'
    import Cookie from 'js-cookie'
    import api from 'src/services/commodule/templet.js'
    import columns from './trafficJson.json'
    import download from 'src/utils/download.js'

    export default {
        name: 'traffic',
        data() {
            return {
                //面包屑
                concelText: '',
                antiConcelText: '',
                endText: '',
                concelDialog: false,
                antiConcelDialog: false,
                endDialog: false,
                breadcrumbData: [{
                    title: '工模售前'
                }, {
                    title: '合同管理'
                }, {
                    title: '业务合同'
                }, ],
                //搜索表单项配置
                fields: [{
                        type: 'select',
                        label: '模板ID&名称',
                        name: 'basicId_eq',
                        selectSourceKey: 'ContrctName',
                        filterable: true
                    }, {
                        type: 'input',
                        label: '角色&ID',
                        name: 'authUid_eq',
                        slotPosition: 'prepend',
                        slotType: 'select',
                        slotName: 'authRoleId_eq',
                        selectSourceKey: 'roleType'
                    },
                    /*{ type: 'input' , label: '角色ID',name: 'authUid_eq'},*/
                    {
                        type: 'input',
                        label: '签署人名称',
                        name: 'authName_like'
                    }, {
                        type: 'input',
                        label: '合同编码',
                        name: 'contractCode_eq'
                    }, {
                        type: 'select',
                        label: '状态',
                        name: 'state_eq',
                        selectSourceKey: 'trafficStatus'
                    }, {
                        type: 'datepicker',
                        label: '发起时间',
                        name: 'startTime',
                        pickertype: 'datetimerange',
                        startField: 'startTime_gte',
                        endField: 'startTime_lte'
                    }, {
                        type: 'datepicker',
                        label: '生效时间',
                        name: 'effectiveTime',
                        pickertype: 'datetimerange',
                        startField: 'effectiveTime_gte',
                        endField: 'effectiveTime_lte'
                    }, {
                        type: 'datepicker',
                        label: '失效时间',
                        name: 'expirationTime',
                        pickertype: 'datetimerange',
                        startField: 'expirationTime_gte',
                        endField: 'expirationTime_lte'
                    },
                ],
                //搜索select类型下拉列表数据，对应searchFormConfig的commonOptionsName
                selectSource: {
                    roleType: [],
                    TypeCode: [],
                    StatusCode: [],
                    ContrctName: [],
                    trafficStatus: [{
                        text: '待签',
                        value: 1
                    }, {
                        text: '生效',
                        value: 2
                    }, {
                        text: '作废',
                        value: 3
                    }, {
                        text: '终止',
                        value: 4
                    }, {
                        text: '结束',
                        value: 5
                    }, ]
                },
                //表格
                columns: columns,
                //请求参数配置
                service: Service.TRAFFICRECORD.name,
                method: Service.TRAFFICRECORD.methods.QUERYLIST,
                args: {
                    search: {
                        'id_gt': 0
                    }
                }
            }
        },
        created() {
            //合同ID和名称
            this.getContent('ContrctName')
                // 角色
            this.getCommonOptions('39001', 'roleType')

        },
        methods: {
            //搜索，更新searchValConfig,提交搜索并且发起刷新表格数据的请求
            submitSearch(data) {

                if (data.startTime_lte < data.startTime_gte) {
                    this.$message.error('开始时间需小于结束时间！')
                    return false
                }
                if (data.effectiveTime_lte < data.effectiveTime_gte) {
                    this.$message.error('开始时间需小于结束时间！')
                    return false
                }
                if (data.expirationTime_lte < data.expirationTime_gte) {
                    this.$message.error('开始时间需小于结束时间！')
                    return false
                }
                this.args = {
                    search: data
                }
            },
            //查看
            view() {
                // 单行判断
                let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
                if (this.checkSelection() === false) return false
                this.$router.push({
                    path: 'traffic/see',
                    query: {
                        rowId: selectRow.id
                    }
                })
            },
            //合同ID和名称
            getContent: function(selectName) {
                let arg = {}
                let list = []
                api.queryModelBasic(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                list.push({
                                    value: item.id + '|' + item.contractName,
                                    text: item.id + '|' + item.contractName
                                })
                            })
                            this.selectSource[selectName] = list
                        }
                    })

            },
            //获取辅助资料
            getCommonOptions: function(fatherCode, selectName) {
                let arg = {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
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
                            this.selectSource[selectName] = list
                        }
                    })
            },
            //作废
            concel() {
                if (this.checkSelection() === false) return false
                let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
                if (selectRow.state !== 1) {
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '待签状态才能进行作废操作',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    return false
                } else {
                    this.concelDialog = true
                }
            },
            //反作废
            antiConcel() {
                if (this.checkSelection() === false) return false

                let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
                if (selectRow.state !== 3) {
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '作废状态才能进行反作废操作',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    return false
                } else {
                    this.antiConcelDialog = true
                }

            },
            //终止
            end() {
                if (this.checkSelection() === false) return false

                let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
                if (selectRow.state !== 2) {
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '生效状态才能进行终止操作',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    return false
                } else {
                    this.endDialog = true
                }

            },
            closeConcelDialog() {
                this.concelDialog = false
                this.concelText = ''
            },
            closeAntiConcelDialog() {
                this.antiConcelDialog = false
                this.antiConcelText = ''
            },
            closeEndDialog() {
                this.endDialog = false
                this.endText = ''
            },
            onConcelBtn() {
                if (this.concelText === '') {

                    this.$message.warning('请输入作废原因')
                } else if (this.concelText.length > 255) {
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: '作废原因字数不能超过255',
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    this.closeConcelDialog()
                } else {
                    // 驳回
                    let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
                    let args = {
                        update: {
                            updateUser: +Cookie.get('t8t-tc-uid'),
                            id: selectRow.id,
                            remark: this.concelText
                        }
                    }
                    ApiTraffic.concel(args)
                        .then((res) => {
                            if (res.data.status === 200 && res.data.result === 1) {
                                // 驳回成功
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '作废成功',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.closeConcelDialog()
                                this.$refs['t8ttable'].reloadTable()
                            } else {
                                // 驳回失败
                                this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: res.data.message,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.closeConcelDialog()
                            }
                        })
                }

            },
            onAntiConcelBtn() {
                if (this.antiConcelText === '') {
                    this.$message.warning('请输入反作废原因')
                } else if (this.antiConcelText.length > 255) {
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: '反作废原因字数不能超过255',
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    this.closeAntiConcelDialog()
                } else {
                    // 驳回
                    let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
                    let args = {
                        update: {
                            updateUser: +Cookie.get('t8t-tc-uid'),
                            id: selectRow.id,
                            remark: this.antiConcelText
                        }
                    }
                    ApiTraffic.antiConcel(args)
                        .then((res) => {
                            if (res.data.status === 200 && res.data.result === 1) {
                                // 驳回成功
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '反作废成功',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.closeAntiConcelDialog()
                                this.$refs['t8ttable'].reloadTable()
                            } else {
                                // 驳回失败
                                this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: res.data.message,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.closeAntiConcelDialog()
                            }
                        })
                }

            },
            onEndBtn() {
                if (this.endText === '') {
                    this.$message.warning('请输入终止原因')
                } else if (this.endText.length > 255) {
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: '终止原因字数不能超过255',
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    this.closeEndDialog()
                } else {
                    // 驳回
                    let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
                    let args = {
                        update: {
                            updateUser: +Cookie.get('t8t-tc-uid'),
                            id: selectRow.id,
                            remark: this.endText
                        }
                    }
                    ApiTraffic.termination(args)
                        .then((res) => {
                            if (res.data.status === 200 && res.data.result === 1) {
                                // 驳回成功
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '终止成功',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.closeEndDialog()
                                this.$refs['t8ttable'].reloadTable()
                            } else {
                                // 驳回失败
                                this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: res.data.message,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.closeEndDialog()
                            }
                        })
                }
            },

            fileDownload() {
                if (this.checkSelection() === false) return false

                let selectRow = this.$refs['t8ttable'].getSelectRows()[0]

                let args = {
                    docId: selectRow.docId,
                    contractId: selectRow.id
                }
                ApiTraffic.getContractUrl(args)
                    .then((res) => {
                        if (res.data.status === 200) {
                            download(res.data.result)
                        }
                    })

            },

            checkSelection() {
                let selections = this.$refs['t8ttable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选记录后再试。')
                    return false
                } else if (selections.length > 1) {
                    this.$message.error('请对单条数据进行操作。')
                    return false
                }
                return true
            },

        }
    }
</script>
<style lang="css" scoped>
    .img-container {
        display: flex;
        justify-content: center;
    }

    .textarea-container {
        margin: 0 30px;
    }

    .el-textarea__inner {
        maxlength: 300;
    }
</style>
