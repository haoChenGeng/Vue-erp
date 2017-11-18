<template>
    <div>
        <el-dialog :title="title" class="pay-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form v-loading.lock="formLoading" :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="form" @keyup.enter.native="btnOKClick()">
                <el-form-item label="项目ID：" prop="name">
                    <el-input @blur="getProjectInfo" v-model.number="formData.projectId"></el-input>
                </el-form-item>
                <el-form-item label="业主姓名：" prop="name">
                    <el-input v-model="formData.ownerName" disabled></el-input>
                </el-form-item>
                <el-form-item label="详细地址：" prop="name">
                    <el-input type="textarea" rows="3" v-model="formData.addressDetail" disabled></el-input>
                </el-form-item>
                <el-form-item label="验收节点：" prop="sheduleNodeId">
                    <el-select
                        v-model="formData.sheduleNodeId"
                        filterable
                        :allow-create="false"
                        placeholder="请选择验收节点">
                        <el-option
                            v-for="item in projectNodeVOList"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="交付管家：" prop="payAdvisorId">
                    <el-select
                        v-model="formData.payAdvisorId"
                        filterable
                        :allow-create="false"
                        placeholder="请选择交付管家">
                        <el-option
                            v-for="item in payAdvisorMap"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请开始时间：" prop="expectStartTime">
                    <el-date-picker
                        v-model="formData.expectStartTime"
                        placeholder=""
                        type="datetime"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="申请结束时间：" prop="expectCheckTime">
                    <el-date-picker
                        v-model="formData.expectCheckTime"
                        placeholder=""
                        type="datetime"
                    >
                    </el-date-picker>
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
    import TemplateOperator from 'src/services/delivery/template-base.js'
    import Cookie from 'js-cookie'
    export default {
        name: 'add-bill',
        data() {
            let validateExpectCheckTime = (rule,value,callback)=>{
                if(!value){
                    return callback(new Error('请选择申请结束时间'));
                }
                if(this.formData.expectStartTime && +this.formData.expectStartTime >= +this.formData.expectCheckTime){
                    return callback(new Error('结束时间必须大于开始时间'));
                }
                callback();
            }
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                dialogVisible: true,
                rules: {
                    projectId: [
                        { type: 'integer', required: true , message: "请填写项目ID",trigger: 'change'},
                    ],
                    sheduleNodeId: [
                        { type: 'number', required: true , message: "请选择验收节点",trigger: 'change'},
                    ],
                    payAdvisorId: [
                        { type: 'number',required: true , message: "请选择交付管家",trigger: 'change'},
                    ],
                    expectStartTime: [
                        { type: 'date', required: true , message: "请选择申请开始时间",trigger: 'change'},
                    ],
                    expectCheckTime: [
                        { type: 'date', required: true, trigger: 'change', validator: validateExpectCheckTime},
                    ],
                },
                //表单
                formData: {
                    projectId: null,
                    ownerName:'',
                    addressDetail:'',
                    sheduleNodeId: null,
                    payAdvisorId: null,
                    expectStartTime: '',
                    expectCheckTime: ''
                },
                isLoading: false,
                projectNodeVOList: [],
                payAdvisorMap:[],
                formLoading: false
            }
        },
        props: {
            rowId:{
                type: Number,
                default: 0
            },
            editType:{
                type: String,
                default: ''
            },
            title:{
                type: String,
                default: ''
            },
            billData:{
                type: Object,
                default(){
                    return {}
                }
            }
        },
        computed: {
            editable() {
                return this.editType === 'see'
            }
        },
        created () {
            if(this.billData.projectId && this.editType == 'add'){
                this.formData.projectId = this.billData.projectId;
                this.getProjectInfo();
                this.formData.sheduleNodeId = this.billData.sheduleNodeId;
            }
            //请求所选行的数据
            if (this.rowId) {
                var args = {
                    page: 1,
                    size: 10,
                    //search: { id : this.rowId }
                    moduleId: this.rowId
                };
                this.loadFormData(args)
            }else{

            }
        },
        methods: {
            getProjectInfo(){
                this.formLoading = true;
                TemplateOperator.getCheckProject({projectId: this.formData.projectId})
                    .then((res) => {
                        if (res.data.status === 200) {
                            this.projectNodeVOList = [];
                            let list = [];
                            let list1 = [];
                            res.data.result.projectNodeVOList.forEach(function(item,i){
                                list.push({label: item.nodeTypeName, value: item.id});
                            });
                            this.projectNodeVOList = list
                            for(let item in res.data.result.payAdvisorMap){
                                list1.push({label: res.data.result.payAdvisorMap[item], value: +item});
                            }
                            this.payAdvisorMap = list1
                            this.formData =  Object.assign(this.formData,res.data.result)
                            this.formData.payAdvisorId = this.formData.payAdvisorId || ''
                        }
                        this.formLoading = false;
                });
            },
            btnOKClick() {
                this.$refs['form'].validate(valid=>{
                    if (valid) {
                        let formData = {
                            projectId: this.formData.projectId,
                            payAdvisorId: this.formData.payAdvisorId,
                            sheduleNodeId: this.formData.sheduleNodeId,
                            expectStartTime : +Date.parse(this.formData.expectStartTime).toString().substr(0,10),
                            expectCheckTime : +Date.parse(this.formData.expectCheckTime).toString().substr(0,10)
                        };
                        let editType = this.editType;
                        if (editType==='add') {
                            this.isLoading = true;
                            formData.createUser = +Cookie.get('t8t-tc-uid')
                            TemplateOperator.checkCreate({check:formData})
                                .then((res) => {
                                    if (res.data.status === 200) {
                                        this.$message({
                                            type: 'success',
                                            message: '新增成功！'
                                        })
                                        this.btnCancleClick()
                                        this.$emit('getTableData')
                                    }else{
                                        this.$message({
                                            type: 'error',
                                            message: res.data.message
                                        })
                                    }
                                    this.isLoading = false;
                                })
                        }
                    }
                    else {
                        return false
                    }
                })
            },
            btnCancleClick() {
                this.$refs['form'].resetFields()
                this.dialogVisible = false
                this.$emit('close')
            }
        }
    }

</script>

<style lang="css" scoped>
</style>
<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css">
.pay-dialog .el-dialog{
    width: 450px;
}
.el-select-dropdown__wrap {
    max-height: 185px !important;
}
.pay-dialog .el-form-item__content {
    width: 250px;
}
.pay-dialog .el-select {
    width: 100%;
}
</style>
