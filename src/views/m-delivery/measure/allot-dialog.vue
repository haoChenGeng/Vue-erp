<template>
    <div>
        <el-dialog :title="title" class="allotDialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form @validate="myValidate" :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="form" @keyup.enter.native="btnOKClick()">
                <el-form-item label="测量单编号：" prop="groupName">
                    <el-input v-model="formData.groupName" disabled></el-input>
                </el-form-item>

                <el-form-item label="项目ID：" prop="content">
                    <el-input v-model="formData.content"></el-input>
                </el-form-item>

                <el-form-item label="项目地址：" prop="detail">
                    <el-input v-model="formData.detail" disabled></el-input>
                </el-form-item>
                <el-form-item label="排期节点：" prop="detail">
                    <el-input v-model="formData.detail" disabled></el-input>
                </el-form-item>
                <el-form-item label="预计测量日期：" prop="widgetType">
                    <t8t-datetime-picker
                        width="250px"
                        v-model="timeSelect"
                        type="datetime"
                        @change="changeTime"
                        :bindValue="dfv"
                        endFormater="yyyy"
                        disabled>
                    </t8t-datetime-picker>
                </el-form-item>
                <el-form-item label="测量人类型：" prop="configStatus">
                    <el-select
                        v-model="formData.configStatus"
                        filterable
                        :allow-create="false"
                        placeholder="请选择">
                        <el-option
                            v-for="item in configStatus"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="测量人员：" prop="configStatus">
                    <el-select
                        v-model="formData.configStatus"
                        filterable
                        :allow-create="false"
                        placeholder="请选择">
                        <el-option
                            v-for="item in configStatus"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading">确定</el-button>
                <el-button @click="btnCancleClick()">取消</el-button>
            </div>
    </el-dialog>
    </div>
</template>
<script>
    import T8tDatetimePicker from 'src/components/t8t-form/dateTimePicker.vue'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Cookie from 'js-cookie'
    export default {
        name: 'allot-dialog',
        components: {
            T8tDatetimePicker
        },
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: {
//                    groupName: [
//                        {type:'string', required: true},
//                    ],
//                    content: [
//                        {type: 'string', required: true , message: "请输入条目问题",trigger: 'change'},
//                    ],
//                    detail: [
//                        {type: 'string'},
//                    ],
//                    configStatus: [
//                        {type: 'number',required: true , message: "请选择启用状态",trigger: 'change'},
//                    ],
//                    widgetType: [
//                        {type :'number' ,required: true , message: "请选择控件类型",trigger: 'change'},
//                    ],
                },
                //表单
                formData: {
                    id:null,
                    groupId: null,
                    groupName: '',
                    content: '',
                    detail:  '',
                    configStatus:  '',
                    widgetType:  '',
                    answerList: [],
                    maxScore: ''
                },
                deleteAnswerIdList: [],
                isLoading: false,
                widgetType: [],
                widgetTypeRelation: {}, //控件类型id-code关系
                configStatus: [
                    {
                        text: '启用',
                        value: 0
                    },
                    {
                        text: '禁用',
                        value: 1
                    }
                ],
                addBtnText: '',
                itemLabel: '',
                addBtnVisible: false,
                scoreVisible: false
            }
        },
        props: ['rowId','data','title'],
        computed: {
            dialogVisible() {
                return true
            },
        },
        created () {
            let arg =  {
                page: 1,
                search: {
                    pPropertyCode: 41701
                },
                size: 100
            }
            let list = [];
        },
        methods: {
            btnCancleClick() {
                this.$refs['form'].resetFields()
                this.$emit('close')
            },

            loadFormData(args) {
                TemplateOperator.questionFindDetailById(args)
                .then((res) => {
                    if (res.data.status === 200) {
                        //this.formData =  res.data.result; //错误写法，莫踩坑
                        this.formData = Object.assign(this.formData,res.data.result);
                        this.formData.answerList = res.data.result.answerBriefVOList;
                        //this.$set(this.formData, 'answerList', res.data.result.answerBriefVOList)
                    }
                })
            }
        }
    }

</script>

<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css">
    .allotDialog .el-dialog{
        width: 450px;
    }
    .allotDialog .el-select-dropdown__wrap {
        max-height: 185px !important;
    }
    .allotDialog .el-form-item__content {
        width: 250px;
    }
    .allotDialog .el-select {
        width: 100%;
    }
    .allotDialog .t8t-datetime-picker .el-date-editor--datetime{
        width: 100%;
    }
</style>
