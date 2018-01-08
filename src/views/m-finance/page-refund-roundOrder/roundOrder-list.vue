<template>
    <div class="g-main-container-column" v-bind="roundOrderList">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
        >
        </t8t-search>

        <el-collapse accordion>
            <el-collapse-item name="1">
                <template slot="title"> 有效项目扣费定义: <i class="header-icon el-icon-information"></i>
                </template>
                    <div>1、在自派出项目的二个半月内，有装修公司与业主见面或量房，正常扣费；</div>
                    <div>2、因装修公司自身原因（如联系不及时，口头报价等）造成未能见面，正常扣费；</div>
                    <div> &nbsp; </div>
                    <div>注明：若对扣除款项有疑义，请提交 “申请返款” 申请，提交申请期限为项目发布后的2个半月之内，逾期提交据不受理返款操作。如有问题，请联系运营人员。</div>
            </el-collapse-item>
        </el-collapse>
        <div class="g-main-container">
            <t8t-table
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

            </t8t-table>
        </div>

        <el-dialog title="申请返款" v-model="dialogFormVisible">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="20%" class="demo-ruleForm">
                <el-form-item label="返款原因" prop="desc">
                    <el-input
                        type="textarea"
                        :rows="4"
                        placeholder="申请返款只能操作两次，请填写项目的真实情况，如填写为无效信息，客服将不予处理，谢谢配合！"
                        v-model="ruleForm.desc">
                    </el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>

    import Service from 'src/services/finance/Service.js'
    import Cookie from 'js-cookie'
    import * as config from './config.js'
    import TemplateOperator1 from 'src/services/delivery/pcm.js'
    import Methods from 'src/services/finance/refundOrder.js'

    export default {
        name: "roundOrderList",
        components: {},
        data() {
            return {
                breadcrumbData: [{title: '财务'}, {title: '返款管理'}, {title: '轮单费'}],
                fields: [
                    {type: 'input', label: '项目ID', name: 'sourceProjectId',},
//                    {type: 'input', label: '业主称呼', name: 'appellation',},
                    {type: 'select', label: '项目状态', name: 'orderMainStatus', selectSourceKey: 'orderMainStatus',},
                ],

                selectSource: {
                    //项目状态
                    orderMainStatus: []
                },

                columns: [
                    {'prop': 'sourceProjectId', 'label': '项目ID'},
                    {'prop': 'applyAble', 'label': '操作', 'width': "100"},
                    {'prop': 'houseAddress', 'label': '项目地址'},
                    {'prop': 'appellation', 'label': '业主称呼'},
                    {'prop': 'decoratePatternName', 'label': '装修方式'},
                    {'prop': 'houseTypeName', 'label': '房屋类型'},
                    {'prop': 'houseArea', 'label': '面积'},
                    {'prop': 'dispatchFee', 'label': '轮单费'},
                    {'prop': 'orderMainStatusName', 'label': '项目状态'},
                    {'prop': 'dispatchFeeStatusName', 'label': '轮单费状态'},
                    {'prop': 'reFundStatusName', 'label': '返款状态'},
                ],
                service: Service.REFUND_MANAGE_CONFIG.name,
                method: Service.REFUND_MANAGE_CONFIG.methods.ROUND_ORDER_REFUNDS,
                args: {
                    dto: {
                        projectId: null,
                        appellation: null,
                        orderMainStatus: null
                    },
                    accountId: +Cookie.get('t8t-tc-uid')
                },
                //弹框--提交原因
                submitArgs: {
                    dto: {
                        projectId: 0,
                        sourceProjectId: 0,
                        record: '',
                    },
                    accountId: +Cookie.get('t8t-tc-uid')
                },
                dialogFormVisible: false,
                reasonText: '',
                formLabelWidth: '20%',

                ruleForm: {
                    desc: ""
                },
                rules: {
                    desc: [
                        {required: true, message: "请输入原因", trigger: "blur"},
                        {min: 30, max: 200, message: "输入字数在30到200字之间", trigger: "blur"}
                    ]
                }
            };
        },
        created() {
            this.submitSearch(this.args);
            //获取装修公司项目主状态的辅助资料
            TemplateOperator1.queryPropertyUnion({
                page: 1,
                size: 200,
                search: {pPropertyCode: "810"}
            }).then(res => {
                if (res.data.status === 200) {
                    let searchList = [];
                    let rows = res.data.result;
                    for (let i in rows) {
                        searchList.push({
                            text: rows[i]["propertyName"],
                            value: rows[i]["propertyCode"]
                        });
                    }
                    this.selectSource.orderMainStatus = searchList;
                }
            });
        },
        methods: {
            submitSearch(objForm) {
                let obj = Object.assign({}, objForm);
                let argsObj = Object.assign({}, this.args);
                argsObj.dto = obj;
                this.args = argsObj;
            },
            //行点击行为--申请返款
            cellClick: function (row, column, cell, event) {
                if (column.property === "applyAble") {
                    if (row.applyAble === 1) {
                        this.dialogFormVisible = true;
                        this.submitArgs.dto.projectId = row.projectId;
                        this.submitArgs.dto.sourceProjectId = row.sourceProjectId;
                    }
                }
            },
            // 提交轮单费
            submitRoundOrder() {
                let _this = this;
                Methods.backRoundOrders(_this.submitArgs)
                    .then(res => {
//                        debugger;
                        if (res.data.status == 200) {
                            _this.$msgbox({
                                type: "success",
                                message: "提交成功",
                                title: ""
                            });
                        this.$refs['t8tTable'].reloadTable()
                        } else {
                            _this.$msgbox({
                                type: "error",
                                message: "提交失败，请重试",
                                title: ""
                            });
                        }
                    })
                    .catch(e => {
                        _this.$msgbox({
                            type: "error",
                            message: "提交失败，请重试",
                            title: ""
                        });
                    });
            this.submitSearch(this.args);
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.submitArgs.dto.record = this.ruleForm.desc;
                        this.submitRoundOrder();
                    } else {
                        console.log("提交失败!!");
                        return false;
                    }
                });
                this.submitSearch(this.args);
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.dialogFormVisible = false;
            }
        }
    };
</script>

<style scoped>
    .el-alert__closebtn {
        font-size: 12px;
        color: #1f2d3d;
        opacity: 1;
        top: 12px;
        right: 15px;
        position: absolute;
        cursor: pointer;
    }
</style>
