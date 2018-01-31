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
                <el-button type="primary" :disabled="scope.row.applyAble !== 1" size="small">
                    {{scope.row.applyAble === 0?'系统自动返款':'申请返款'}}
                    </el-button>
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
                <el-button type="primary" :disabled="submitAble" @click="submitForm('checkList')">提交</el-button>
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
    import commonApi from 'src/services/commonApi/commonApi.js'

    export default {
        name: 'trusteeFeeList',
        components: {},
        data() {
            return {
                breadcrumbData: [{title: '财务'}, {title: '返款管理'}, {title: '托管款'}],
                fields: [
                    {type: 'input', label: '业主电话号码', name: 'phoneNumber',},
                    {type: 'input', label: '项目ID', name: 'sourceProjectId',},
                    // {type: 'input', label: '业主称呼', name: 'ownerName',},
                    {type: 'input', label: '楼盘地址', name: 'estateName',},
                    {type: 'select', label: '项目状态', name: 'orderSubStatus', selectSourceKey: 'orderSubStatus',},
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
                    orderSubStatus: [],
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
                    {"prop": "projectId", "label": "返款状态", "width": "100",
                        formatter(val, row) {
                            return `<a href="javascript:;">返款详情</a>`
                        }
                    },
                    {"prop": "houseAddress", "label": "项目地址"},
                    {"prop": "appellation", "label": "业主称呼"},
                    {"prop": "cPrice", "label": "合同金额"},
                    /**
                    {"prop": "appellation", "label": "返款状态"},
                    {"prop": "appellation", "label": "倒计时"},
                    */
                    {"prop": "comment", "label": "备注"},
                    {"prop": "checkTypeName", "label": "验收类型"},
                    {"prop": "checkStatus", "label": "验收结果", "list": "checkStatus"},
                ],
                service: Service.REFUND_MANAGE_CONFIG.name,
                method: Service.REFUND_MANAGE_CONFIG.methods.TRUSTEE_FEE_REFUND,
                args: {
                    dto: {
                        projectId: null,
                        appellation: null,
                        estateName: null,
                        orderMainStatus: null,
                        orderSubStatus: null
                    },
                    accountId: +Cookie.get('t8t-tc-uid')
                },
                trusteeFees: [],
                submitAble:false, //是否可以提交标志
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
                        if (rows[i]['propertyCode'] > '81005') {
                            searchList.push({text: rows[i]['propertyName'], value: rows[i]['propertyCode']});
                        }
                    }
                    this.selectSource.orderMainStatus = searchList;
                }
            });

            //获取装修公司项目主状态的辅助资料
//            debugger
            commonApi.queryChildrenByWholeCode("8!810", 3).then((res) => {
            //    debugger
                if (res.data.status === 200) {
                    let searchList = [];
                    let rows = res.data.result;
                    for (let i in rows) {
                        if (rows[i]['propertyCode'] > '8100601') {
                            searchList.push({text: rows[i]['propertyName'], value: rows[i]['propertyCode']});
                        }
                    }
                    this.selectSource.orderSubStatus = searchList;
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
                else if (column.property === 'projectId') {
                  debugger
                    this.$router.push({path: '/tuchat-sale-manage/page-project-detail',
                    query: {
                        id: row.projectId,
                        goBackRoute: '/tuchat-finance/page-refund-trusteeFee',
                        tab:'financeForm'
                    }})
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
                        this.getSubmitAble();

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
            },
            getSubmitAble() {
                debugger
                let _submitAble = true;
                if(null != this.trusteeFees || 0 < this.trusteeFees.size) {
                    this.trusteeFees.forEach(element => {
                        if (1 == element.enable) {
                            _submitAble = false;
                        }
                    });
                }
                this.submitAble = _submitAble;
            }
        }
    }
</script>
