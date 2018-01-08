<template>
    <div class="g-main-container-column" v-bind="trusteeFeeList">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
        >
        </t8t-search>

        <t8t-grid
            :columns="columns"
            :commonData="selectSource"
            :service="service"
            :args="args"
            :method="method"
            :selectCol="false"
            :pageBar="true"
            ref="t8tTable"
            @cell-click="cellClick"
        >
            <template scope="scope" slot="applyAble">
                <el-button type="primary" :disabled="scope.row.applyAble === 0" size="small">申请返款</el-button>
                <!-- <a v-if="scope.row.applyAble ===1" style="color:blue;cursor: pointer;"> 申请返款 </a> -->
                <!-- <a v-if="scope.row.applyAble ===0" style="color:gray;cursor: pointer;"> 不可申请返款 </a> -->
            </template>
        </t8t-grid>

        <el-dialog title="申请返款" v-model="dialogFormVisible">
            <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
                <div v-for="trusteeFee in trusteeFees" style="margin:auto;width:80%">
                    <el-checkbox :label="trusteeFee.type" :disabled="!trusteeFee.enable" >
                            <span v-html="trusteeFee.content"></span>
                        </el-checkbox>
                    <br><br>
                </div>
            </el-checkbox-group>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('checkList')">提交</el-button>
                <el-button @click="resetForm('checkList')">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import Service from 'src/services/finance/Service.js'
    import Cookie from 'js-cookie'
    import * as config from './config.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import Methods from 'src/services/finance/refundOrder.js'
    import TemplateOperator1 from 'src/services/delivery/pcm.js'

    export default {
        name: 'trusteeFeeList',
        components: {},
        data() {
            return {
                breadcrumbData: [{title: '财务'}, {title: '返款管理'}, {title: '托管款'}],
                fields: [
                    {type: 'input', label: '项目ID', name: 'sourceProjectId',},
                    // {type: 'input', label: '业主称呼', name: 'ownerName',},
                    {type: 'input', label: '楼盘地址', name: 'estateName',},
                    {type: 'select', label: '项目状态', name: 'orderMainStatus', selectSourceKey: 'orderMainStatus',},
                ],
                selectSource: {
                    //验收状态:0-默认,1-合格,2-不合格
                    checkStatus: [
                        {text: '默认', value: 0},
                        {text: '合格', value: 1},
                        {text: '不合格', value: 2},
                    ],
                    //项目状态
                    orderMainStatus: [],
                    //返款状态 1.全部 2.无返款状态 3.返款申请中 4.待定 5.已返款 6.返款被驳回
                    reFundStatuses: [
                        {text: '全部', value: 1},
                        {text: '无返款状态', value: 2},
                        {text: '返款申请中', value: 3},
                        {text: '待定', value: 4},
                        {text: '已返款', value: 5},
                        {text: '返款被驳回', value: 6}
                    ],
                },

                columns: [
                    {"prop": "sourceProjectId", "label": "项目ID"},
                    {"prop": "applyAble", "label": "操作", "width": "100"},
                    {"prop": "checkTypeName", "label": "验收类型"},
                    {"prop": "houseAddress", "label": "项目地址"},
                    {"prop": "appellation", "label": "业主称呼"},
                    {"prop": "checkTypeName", "label": "返款节点"},
                    {"prop": "projectManagerName", "label": "项目经理"},
                    {"prop": "checkStatus", "label": "验收结果", "list": "checkStatus"},
                    {
                        "prop": "expectCheckTime", "label": "申请验收时间",
                        formatter: function (v, r) {
                            let expectTimeStr = "";
                            if (!r.expectStartTime) {
                                expectTimeStr = ""
                            } else if (0 == r.expectStartTime) {
                                expectTimeStr += ""
                            } else {
                                let date = new Date(r.expectStartTime * 1000)
                                expectTimeStr += DateUtils(date, 'yyyy-mm-dd HH:MM:ss');
                            }
                            expectTimeStr += "<br/>"
                            if (!r.expectCheckTime) {
                                expectTimeStr = ""
                            } else if (0 == r.expectCheckTime) {
                            } else {
                                let date2 = new Date(r.expectCheckTime * 1000)
                                expectTimeStr += DateUtils(date2, 'yyyy-mm-dd HH:MM:ss');
                            }
                            return expectTimeStr
                        }
                    },
                    {
                        "prop": "checkTime", "label": "实际验收时间",
                        formatter: function (v, r) {
                            let expectTimeStr = "";
                            if (!r.checkStartTime) {
                                expectTimeStr = ""
                            } else if (0 == r.checkStartTime) {
                                expectTimeStr += ""
                            } else {
                                let date = new Date(r.checkStartTime * 1000)
                                expectTimeStr += DateUtils(date, 'yyyy-mm-dd HH:MM:ss');
                            }
                            expectTimeStr += "<br/>"
                            if (!r.checkTime) {
                                expectTimeStr = ""
                            } else if (0 == r.checkTime) {
                            } else {
                                let date2 = new Date(r.checkTime * 1000)
                                expectTimeStr +=  DateUtils(date2, 'yyyy-mm-dd HH:MM:ss');
                            }
                            return expectTimeStr
                        }
                    }
                ],
                service: Service.REFUND_MANAGE_CONFIG.name,
                method: Service.REFUND_MANAGE_CONFIG.methods.TRUSTEE_FEE_REFUND,
                args: {
                    dto: {
                        projectId: null,
                        appellation: null,
                        estateName: null,
                        orderMainStatus: null
                    },
                    accountId: +Cookie.get('t8t-tc-uid')
                },
                trusteeFees: [],
                checkList: [],
                checkConstant: [0, 1, 2],
                checks: ['默认', '合格', '不合格'],

                //弹框--查询托管款详情
                searchArgs: {
                    sourceProjectId: null,
                    accountId: +Cookie.get('t8t-tc-uid')
                },

                //弹框--提交原因
                submitArgs: {
                    dto: {
                        projectId: 0,
                        sourceProjectId: 0,
                        applyTypes: [],
                    },
                    accountId: +Cookie.get('t8t-tc-uid')
                },
                dialogFormVisible: false,
                reasonText: '',
                formLabelWidth: '20%',

            }
        },
        created() {
            this.submitSearch(this.args);
            //获取装修公司项目主状态的辅助资料
            TemplateOperator1.queryPropertyUnion({page: 1, size: 200, search: {pPropertyCode: "810"}}).then((res) => {
                if (res.data.status === 200) {
                    let searchList = [];
                    let rows = res.data.result;
                    for (let i in rows) {
                        searchList.push({text: rows[i]['propertyName'], value: rows[i]['propertyCode']});
                    }
                    this.selectSource.orderMainStatus = searchList;
                }
            });
        },
        methods: {
            submitSearch(objForm) {
                let obj = Object.assign({}, objForm);
                let argsObj = Object.assign({}, this.args)
                argsObj.dto = obj;
                this.args = argsObj;
            }
            ,
            //行点击行为--申请返款
            cellClick: function (row, column, cell, event) {
                if (column.property === 'applyAble') {
                    if (row.applyAble === 1) {
//                        debugger
                        this.getTrusteeFeeInfo(row.sourceProjectId)
                        //申请托管款的参数
                        this.submitArgs.dto.projectId = row.projectId
                        this.submitArgs.dto.sourceProjectId = row.sourceProjectId
                    }
                }
            },
            getTrusteeFeeInfo(sourceProjectId) {
                //请求托管款信息参数
                this.searchArgs.sourceProjectId = sourceProjectId
                let _this = this
                Methods.queryTrusteeFeeInfo(_this.searchArgs).then(res => {
//                    debugger
                    if (res.data.status == 200) {
                        _this.dialogFormVisible = true
                        _this.trusteeFees = res.data.result

                    } else {
                        _this.$msgbox({
                            'type': 'error',
                            'message': '请求失败，请重试',
                            'title': '',
                        })
                    }
                }).catch(e => {
                    _this.$msgbox({
                        'type': 'error',
                        'message': '请求失败，请重试',
                        'title': '',
                    })
                });

            },
            // 提交托管款
            submitRoundOrder () {
                let _this = this;
                Methods.backTrusteeFees(_this.submitArgs).then((res) => {
//                    debugger
                    if (res.data.status == 200) {
                        _this.$msgbox({
                            'type': 'success',
                            'message': '提交成功',
                            'title': '',
                        })
                        this.$refs['t8tTable'].reloadTable()
                    } else {
                        _this.$msgbox({
                            'type': 'error',
                            'message': '提交失败，请重试',
                            'title': '',
                        })
                    }
                }).catch(e => {
                    _this.$msgbox({
                        'type': 'error',
                        'message': '请求失败，请重试',
                        'title': '',
                    })
                });
            },
            submitForm (formName) {
                if (this.checkList.length > 0) {
                    this.dialogFormVisible = false
                    this.submitArgs.dto.applyTypes = this.checkList;
                    this.submitRoundOrder();
                } else {
                    console.log('至少选择一项再提交！！');
                    return false;
                }
            },
            resetForm (formName) {
                this.dialogFormVisible = false
            },
            handleCheckedCitiesChange (value) {
                let checkedCount = value.length;
            }
        }
    }
</script>
