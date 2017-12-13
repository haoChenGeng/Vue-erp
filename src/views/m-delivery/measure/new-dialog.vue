<template>
    <div>
        <el-dialog :title="title" class="newDialog" v-model="dialogVisible" @close="btnCancleClick()" >
            <el-form @validate="myValidate" :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="form" @keyup.enter.native="btnOKClick()">
                <el-form-item label="测量单编号：" prop="billCode">
                    <el-input v-model="formData.billCode"
                              placeholder="新增自动生成"
                              disabled></el-input>
                </el-form-item>
                <el-form-item label="项目ID：" prop="projectId">
                    <el-input v-model="formData.projectId"
                              @focus="setProjectId"
                              @blur="setedProjectId"
                              :disabled="projectDisable"
                    ></el-input>
                </el-form-item>
                <el-form-item label="工长姓名：" prop="workName" >
                    <el-input v-model="formData.workName" disabled ></el-input>
                </el-form-item>
                <el-form-item label="详细地址：" prop="address">
                    <el-input type="textarea" v-model="formData.address" disabled ></el-input>
                </el-form-item>

                <el-form-item label="排期节点：" prop="scheduleNodeId">
                    <el-select
                        v-model="formData.scheduleNodeId"
                        filterable
                        :allow-create="false"
                        placeholder="请选择" :loading="newDialogLoding"
                        @visible-change="checkProjectId"
                        :disabled="projectDisable"
                        >
                        <el-option
                            v-for="item in scheduleNodeOption"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="预计测量日期：" prop="planMeasureTime">
                    <el-date-picker
                        width="250px"
                        v-model="formData.planMeasureTime"
                        type="date"
                        >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading" >确定</el-button>
                <el-button @click="btnCancleClick()">取消</el-button>
            </div>
    </el-dialog>
    </div>
</template>
<script>
    import T8tDatetimePicker from 'src/components/t8t-form/dateTimePicker.vue'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Cookie from 'js-cookie'
    import Api from 'src/services/delivery/measure.js'
    import mapi from 'src/services/delivery/model.js'
    export default {
        name: 'new-dialog',
        components: {
            T8tDatetimePicker
        },
        data() {
                var checkProjectId = function(rule, value, callback){
                if(!value){
                        return callback(new Error('请填写项目ID'));
                }
                return Api.queryProject({projectId:value}).then((res) => {
                    if(res.data && res.data.status == 200) {
                        if(res.data.result.projectNodeVOList && res.data.result.projectNodeVOList.length > 0) {
                            return callback()
                        }else{
                            return callback(new Error('无效的项目ID'))
                        }

                    }else{
                        return callback(new Error('获取项目信息失败'))
                    }
                }).PromiseValue
        }
            return {
                newDialogLoding:false,
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: {
                    projectId: [
                        { "validator": checkProjectId, required: true , trigger:"blur"}
                    ],
                    scheduleNodeId: [
                        {type:'number', required: true, message: "请选择排期节点", trigger: 'change' },
                    ],
                    planMeasureTime: [
                        {type:'date', required: true, message: "请选择预计测量时间", trigger: 'change' },
                    ]
                },
                //表单
                formData: {
                    code:null,
                    projectId: null,
                    workName:null,
                    address:null,
                    scheduleNodeId:null,
                    planMeasureTime:null
                },
                deleteAnswerIdList: [],
                isLoading: false,
                widgetType: [],
                widgetTypeRelation: {}, //控件类型id-code关系
                scheduleNodeOption: [],
                addBtnText: '',
                itemLabel: '',
                addBtnVisible: false,
                scoreVisible: false,
                projectDisable:false
            }
        },
        props: ['rowId','data','title'],
        computed: {
            dialogVisible() {
                return true
            },
        },
        created () {
            if(this.$route.query.procInsId){
                mapi.projectNodeGetByProcessId({processId:this.$route.query.procInsId}).then((res) =>{
                      if(res.data.status == 200){
                            this.formData.projectId = res.data.result.projectId
                            this.formData.scheduleNodeId = res.data.result.id
                            this.projectDisable = true
                            this.scheduleNodeOption = []
                          Api.queryProject({projectId:this.formData.projectId}).then((res) => {
                                let optionList = []
                                if(res.data && res.data.status == 200) {
                                    this.formData.workName = res.data.result.workerName
                                    this.formData.address = res.data.result.detailAddress
                                    if(res.data.result.projectNodeVOList) {
                                        if(res.data.result.projectNodeVOList.length > 0) {
                                            res.data.result.projectNodeVOList.forEach((item) => {
                                                optionList.push({
                                                    value:item.id,
                                                    text:item.nodeTypeName
                                                })
                                            })
                                            this.scheduleNodeOption = optionList
                                        }
                                    }
                                }else{
                                    this.formData.workName = null
                                    this.formData.address = null
                                    this.formData.scheduleNodeId = null
                                    this.formData.planMeasureTime = null
                                    this.projectDisable = false
                                }
                            }).catch(()=>{
                                this.projectDisable = false
                            })
                      }
                })
            }
        },
        watch(){
        },
        methods: {
            setedProjectId(){
                //todo getInfo by projectId
                if(this.formData.projectId) {
                    this.newDialogLoding = true
                    this.scheduleNodeOption = []
                  Api.queryProject({projectId:this.formData.projectId}).then((res) => {
                        let optionList = []
                        this.newDialogLoding = false
                        if(res.data && res.data.status == 200) {
                            this.formData.workName = res.data.result.workerName
                            this.formData.address = res.data.result.detailAddress
                            this.formData.scheduleNodeId = null
                            this.formData.planMeasureTime = null
                            if(res.data.result.projectNodeVOList) {
                                if(res.data.result.projectNodeVOList.length > 0) {
                                    res.data.result.projectNodeVOList.forEach((item) => {
                                        optionList.push({
                                            value:item.id,
                                            text:item.nodeTypeName
                                        })
                                    })
                                    this.scheduleNodeOption = optionList
                                }
                            }
                        }else{
                            this.formData.workName = null
                            this.formData.address = null
                            this.formData.scheduleNodeId = null
                            this.formData.planMeasureTime = null
                        }
                    })
                }
            },
            btnOKClick(){
                this.$refs['form'].validate(valid=>{
                    if (valid) {
                        let formData = {
                            projectId: this.formData.projectId,
                            scheduleNodeId: this.formData.scheduleNodeId,
                            planMeasureTime: Date.parse(this.formData.planMeasureTime).toString().substr(0,10),
                            createUser:Cookie.get('t8t-tc-uid')
                        }
                        this.isLoading = true
                        Api.createOrder({createDTO:formData}).then((res) => {
                            this.isLoading = false
                            if(res.data && res.data.status == 200) {
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: "新增成功!",
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.btnCancleClick()
                                this.$emit('getTableData')
                            }else{
                                this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: res.data.message,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                return false
                            }
                        })
                    }
                    else {
                        return false
                    }
                })

            },

            btnCancleClick() {
                this.$refs['form'].resetFields()
                this.$emit('close')
            },
            checkProjectId(type){
                if(type && !this.formData.projectId){
                    this.$message.error('请先输入项目ID')
                }
            }
        }
    }

</script>

<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css" >
    .newDialog .el-dialog{
        width: 450px;
    }
    .allotDialog .el-select-dropdown__wrap {
        max-height: 185px !important;
    }
    .newDialog .el-form-item__content {
        width: 250px;
    }
    .newDialog .el-select {
        width: 100%;
    }
    .newDialog .t8t-datetime-picker .el-date-editor--datetime{
        width: 100%;
    }
   .newDialog .el-date-editor.el-input{
      width: 250px;
    }
</style>
