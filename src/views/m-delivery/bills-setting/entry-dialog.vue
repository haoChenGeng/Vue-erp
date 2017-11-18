<template>
    <div>
        <el-dialog :title="title" class="pay-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form @validate="myValidate" :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="form" @keyup.enter.native="btnOKClick()">
                <el-form-item label="分组：" prop="groupName">
                    <el-input v-model="formData.groupName" disabled></el-input>
                </el-form-item>
                <el-form-item label="条目问题：" prop="content">
                    <el-input v-model="formData.content" :disabled="editType == 'view'"></el-input>
                </el-form-item>
                <el-form-item label="问题详情：" prop="detail">
                    <el-input v-model="formData.detail" :disabled="editType == 'view'"></el-input>
                </el-form-item>
                <el-form-item label="是否禁用：" prop="configStatus">
                    <el-select
                        v-model="formData.configStatus"
                        filterable
                        :allow-create="false"
                        :disabled="editType == 'view'"
                        placeholder="请选择">
                        <el-option
                            v-for="item in configStatus"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="控件类型：" prop="widgetType">
                    <el-select
                        v-model="formData.widgetType"
                        filterable
                        :allow-create="false"
                        :disabled="editType == 'view' || editType == 'edit'"
                        @change="switchWidgetType"
                        placeholder="请选择控件类型">
                        <el-option
                            v-for="item in widgetType"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="scoreVisible" label="输入最高评分：" prop="maxScore" :rules="{
                                type:'number',required: true, message: '请输入评分', trigger: 'change'
                            }">
                    <el-input v-model.number="formData.maxScore"  :disabled="editType == 'view'"></el-input>
                </el-form-item>
                <el-form-item
                    v-for="(answer, index) in formData.answerList"
                    :label="itemLabel + (index+1)"
                    :prop="'answerList.'+index+'.content'"
                    :rules="{
                                required: true, message: '不能为空', trigger: 'change'
                            }"
                >
                    <el-input v-model="answer.content" :style="{width:'202px'}" :disabled="editType == 'view'"></el-input>
                    <el-button @click.prevent="removeItem(answer)" size="small" :disabled="editType == 'view'">删除</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="addItem" size="small" v-if="addBtnVisible" v-show="editType != 'view'">{{ addBtnText }}</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-show="editType != 'view'" @click="btnOKClick()" type="primary" :loading="isLoading">确定</el-button>
                <el-button @click="btnCancleClick()">取消</el-button>
            </div>
    </el-dialog>
    </div>
</template>
<script>
    import commonApi from 'src/services/commonApi/commonApi.js'
    import TemplateOperator from 'src/services/delivery/template-base.js'
    import Cookie from 'js-cookie'
    export default {
        name: 'entry-dialog',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: {
                    groupName: [
                        {type:'string', required: true},
                    ],
                    content: [
                        {type: 'string', required: true , message: "请输入条目问题",trigger: 'change'},
                    ],
                    detail: [
                        {type: 'string'},
                    ],
                    configStatus: [
                        {type: 'number',required: true , message: "请选择启用状态",trigger: 'change'},
                    ],
                    widgetType: [
                        {type :'number' ,required: true , message: "请选择控件类型",trigger: 'change'},
                    ],
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
        props: ['rowId','data','editType','title'],
        computed: {
            dialogVisible() {
                return true
            },
            editable() {
                return this.editType === 'see'
            }
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
            let widgetTypeRelation = this.widgetTypeRelation;
            commonApi.queryUnionParent(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus===1) {
                                widgetTypeRelation[item.id] = item.propertyCode;
                                list.push({
                                    value: item.id,
                                    text: item.propertyName
                                })
                            }
                        });
                        this.widgetType = list;
                    }

                    if (this.rowId) {
                        var args = {
                            id: this.rowId
                        };
                        this.loadFormData(args)
                    }else{
                        this.formData.groupId = this.data.id;
                        this.formData.groupName = this.data.groupName;
                    }

                });
        },
        methods: {
            btnOKClick() {
                this.$refs['form'].validate(valid=>{
                    if (valid) {
                        let editType = this.editType
                        if (editType==='add') {
                            let createContentList = [];
                            this.formData.answerList.forEach(function(item,index){
                                createContentList.push(item.content);
                            });
                            let formData = {
                                question: {
                                    questionCreateDTO: {
                                        groupId: parseInt(this.formData.groupId),
                                        content: this.formData.content,
                                        detail: this.formData.detail,
                                        widgetType: parseInt(this.formData.widgetType),
                                        configStatus: this.formData.configStatus,
                                        createUser: +Cookie.get('t8t-tc-uid')
                                    }
                                }
                            }
                            if(createContentList.length > 0){
                                formData.question.contentList = createContentList;
                            }else if(this.widgetTypeRelation[this.formData.widgetType] == '4'){
                                formData.question.questionCreateDTO.maxScore = this.formData.maxScore;
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: '请新增项'
                                });
                                return false;
                            }
                            TemplateOperator.questionAnswerCreate(formData)
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
                                })
                        }
                        else if (editType==='edit') {
                            let createContentList = [];
                            let updateAnswerList = [];
                            let updateUser = +Cookie.get('t8t-tc-uid');
                            //let testList = this.formData.answerBriefVOList;
                            this.formData.answerList.forEach(function(item,index){
                                if(item.id > 0){
                                    updateAnswerList.push({
                                        id: item.id,
                                        content: item.content,
                                        updateUser: updateUser
                                    });
                                }else{
                                    createContentList.push(item.content);
                                }
                            });
                            let formData = {
                                question: {
                                    questionAllowUpdateDTO: {
                                        id:this.formData.id,
                                        groupId: parseInt(this.formData.groupId),
                                        content: this.formData.content,
                                        detail: this.formData.detail,
                                        //widgetType: parseInt(this.formData.widgetType),
                                        configStatus: this.formData.configStatus,
                                        updateUser: updateUser
                                    }
                                }
                            }
                            if(createContentList.length > 0){
                                formData.question.createContentList = createContentList;
                            }
                            if(updateAnswerList.length > 0){
                                formData.question.updateAnswerList = updateAnswerList;
                            }
                            if(this.deleteAnswerIdList.length > 0){
                                formData.question.deleteAnswerIdList = this.deleteAnswerIdList;
                            }
                            if(this.widgetTypeRelation[this.formData.widgetType] == '4'){
                                formData.question.questionCreateDTO.maxScore = this.formData.maxScore;
                            }else if(createContentList.length == 0 && updateAnswerList.length == 0){
                                this.$message({
                                    type: 'error',
                                    message: '请新增项'
                                });
                                return false;
                            }
                            TemplateOperator.questionAnswerUpdate(formData)
                                .then((res) => {
                                    if (res.data.status === 200) {
                                        this.$message({
                                            type: 'success',
                                            message: '编辑成功！'
                                        })
                                        this.btnCancleClick()
                                        this.$emit('getTableData')
                                    }else{
                                        this.$message({
                                            type: 'error',
                                            message: res.data.message
                                        })
                                    }
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
            },
            switchWidgetType (val){
                if(this.editType == 'add'){
                    this.formData.answerList = [];
                }
                switch(this.widgetTypeRelation[val]){
                    case '1':
                        this.addBtnText = '新增';
                        this.itemLabel = '输入框标题';
                        this.addBtnVisible = true;
                        this.scoreVisible = false;
                        break;
                    case '2':
                    case '3':
                        this.addBtnText = '新增答案';
                        this.itemLabel = '参考答案';
                        this.addBtnVisible = true;
                        this.scoreVisible = false;
                        break;
                    case '4':
                        this.scoreVisible = true;
                    default:
                        this.itemLabel = '';
                        this.addBtnVisible = false;
                }
            },
            addItem() {
                this.formData.answerList.push({id:null,content:''});
            },
            removeItem(item) {
                if(item.id > 0){ //编辑模式下删除
                    this.deleteAnswerIdList.push(item.id);
                }
                let index = this.formData.answerList.indexOf(item);
                if (index !== -1) {
                    this.formData.answerList.splice(index, 1)
                }
            },
        }
    }

</script>

<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css" scoped>
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
