<template>
    <div>
        <el-dialog class="add-dialog" title= "工程维修保证金额度配置" v-model="dialogVisible" @close="close()">
            <el-form :model="formData" ref="payForm" :rules="rules" @keyup.enter.native="btnOKClick()"
                     :label-width="formLabelWidth">
                <el-form-item label="组织: " prop="orgId">
                    <el-col :span="13">
                        <t8t-form-popup
                            :disabled="item.disabled"
                            :defaultValue="item.defaultValue"
                            :ref="item.name"
                            :bindValue="formData[item.name]"
                            :textValue="item.textValue"
                            :filedValue="item.filedValue"
                            :name="item.name"
                            :placeholder="item.placeholder"
                            :dialog="item.dialog"
                            :remote="item.remote"
                            :service="item.service"
                            :method="item.method"
                            :remoteArgs="item.remoteArgs"
                            :remoteQueryKey="item.remoteQueryKey"
                            :autoText="item.autoText"
                            :autoValue="item.autoValue"
                            :icon="item.icon"
                            :onIconClick="item.onIconClick"
                            @change="onChange"
                            @select="onSelect"
                        ></t8t-form-popup>
                    </el-col>
                </el-form-item>
                <el-form-item label="总额:" prop="credit">
                    <el-input v-model.number="formData.credit" placeholder="请输入总额" :disabled="editable"></el-input>
                </el-form-item>
                <el-form-item label="固定保证金" prop="baseDeposit" :disabled="editable">
                    <el-input v-model.number="formData.baseDeposit" placeholder="请输入固定保障金"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading">提交</el-button>
                <el-button @click="close()">取消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/commonApi/Service.js'
    import depositAPI from 'src/services/finance/deposit.js'

    export default {
        components: {},
        data (){
            return {
                isLoading: false,
                formLabelWidth: '80px',
                dialogVisible: true,
                orgConfig: [],
                formData: {
                    orgId: null,
                    credit: null,
                    baseDeposit: null
                },
                rules: {
                    orgId: [{type: "integer", required: true, message: "请选择业务类型", trigger: 'change'}],
                    credit: [{
                        type:'integer',
                        min: 1,
                        max: 200000,
                        transform (val) {
                            return +val;
                        },
                        message: '请输入1-200000之间的整数'
                    }],
                    baseDeposit: [{
                        type:'integer',
                        min: 0,
                        max: 50000,
                        transform (val) {
                            return +val;
                        },
                        message: '请输入0-50000之间的整数'
                    }]
                },

                //item
                item: {
                    label: '组织',
                    prop: 'orgId',  //需要验证的参数
                    name: 'orgId', //需要传递给后台查询的数据
                    textValue:'name',  //需要展示出来的名称
                    filedValue:'id',    //选中那条数据的ID
                    dialog: {
                        dialogWidth: '780px',
                        title: "组织搜索",
                        size: 'large',
                        searchForm: {
                            fields: [
                                {
                                    type: 'input',
                                    label: '组织',
                                    name: 'name_like'
                                },
                                {
                                    type: 'input',
                                    label: '编码',
                                    name: 'code_like'
                                },
                            ],
                            resetBtnVisible: true,
                            showToggleBtn: false,
                            labelWidth: '100px'
                        },
                        table: {
                            //表格
                            columns: [{
                                prop: 'code',
                                label: '组织编码'
                            }, {
                                prop: 'name',
                                label: '组织'
                            }],
                            radioCol: true,
                            //请求参数配置
                            service: Service.ORGANIZATION.name,
                            method: Service.ORGANIZATION.methods.ORG_QUERY_WITHOUTDEL,
                            args: {
                                search:{
                                    id:null
                                }
                            }
                        }
                    },

                    //自动补全
                    remote: true,
                    service: Service.ORGANIZATION.name,
                    method: Service.ORGANIZATION.methods.ORG_QUERY_WITHOUTDEL,
                    remoteQueryKey: "name_like",
                    remoteArgs:{
                        search:{

                        }
                    }
                },

            }

        },

        methods: {
            onChange: function(value,name) {
                this.formData[name] = value
            },
            onSelect: function(value,name){
                this.formData[name] = value;
            },
            close(){
                this.$emit('closeDiaLog')
            },
            btnOKClick(){
                this.$refs['payForm'].validate(vaild => {
                    if (vaild) {
                        // 调用新增额度的接口
                        let args = {
                            creditCreateDTO: {
                                orgId: this.formData.orgId,
                                credit: this.formData.credit,
                                baseDeposit: this.formData.baseDeposit,
                                createUser: parseInt(Cookie.get('t8t-tc-uid'))
                            }
                        }
                        depositAPI.createDepositCredit(args)
                            .then((result) => {
                                if (result.data.status === 200 && result.data.result === 1) {
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'success',
                                        message: '提交成功',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                    this.close()
                                }
                                else {
                                    this.$alert(result.data.message, '提示', {
                                        confirmButtonText: '确定'
                                    })
                                }
                            })
                    }
                })
            },
        },

    }


</script>

<style lang="css" scoped>
</style>
<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css">
    .add-dialog .el-dialog {
        width: 450px;
    }

    .el-select-dropdown__wrap {
        max-height: 185px !important;
    }

    .add-dialog .el-form-item__content {
        width: 250px;
    }

    .add-dialog .el-select {
        width: 100%;
    }
</style>
