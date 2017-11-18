<template>
    <div>
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 master-reported" :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                            ref="toolbar"
                            @EDIT-SUBMIT="submitForm"
                            @CANCEL="closeDialog"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container">
                    <!-- 收缩按钮 -->
                    <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container">
                        <el-form class="dialog2-form-container" :model="formData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
                            <div class="dialog2-form-item-container">
                                <el-form-item label="项目ID：" prop="applyId">
                                     <t8t-form-popup
                                        v-if="showProjectDialog"
                                        :dialog="projectDialog"
                                        textValue="applyId"
                                        filedValue="applyId"
                                        :useQuery="true"
                                        :remote="true"
                                        remoteQueryKey="id_like"
                                        :bindValue="formData.applyId"
                                        name="id"
                                        :triggerOnFocus="false"
                                        :remoteArgs="projectArgs"
                                        :service="projectServer"
                                        :method="projectMethod"
                                        @change="onChange"
                                        >
                                        </t8t-form-popup>
                                </el-form-item>

                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="排期节点：" prop="scheduleNodeId">
                                    <el-select v-model="formData.scheduleNodeId" placeholder="--请选择--" @visible-change="handScheduleNodeClick">
                                        <el-option v-for="item in commonOptionsConfig.scheduleNodeList" :label="item.text" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="品类：" prop="categoryId">
                                    <el-select v-model="formData.categoryId" multiple placeholder="--请选择--" :disabled="true">
                                        <el-option v-for="item in commonOptionsConfig.categoryList" :label="item.text" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="工长报备时间：" prop="workerReportTime">
                                    <el-date-picker
                                        class="date-editor_time"
                                       v-model="formData.workerReportTime"
                                       type="date" placeholder="请选择可安装日期"
                                       :picker-options="pickerOptions"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container" >
                                <el-form-item label="备注：" prop="reportRemark">
                                    <el-input v-model="formData.reportRemark" ></el-input>
                                </el-form-item>
                            </div>
                        </el-form>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <div class="dialog2-toolbar-container">
                            <el-button type="primary" size="small" icon="plus" @click="showUploadDialog">上传附件</el-button>
                            <el-button type="danger" size="small" icon="close" @click="delRow">删除行</el-button>
                        </div>
                        <t8t-table
                            ref="attachTable"
                            :columns="columns"
                            :indexCol="true"
                            :pageBar="false"
                            :editable="true"
                            :templateData="tableTemplateData"
                            @cell-click="handleCellClick"
                        ></t8t-table>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 另一个el-dialog放这里 -->
        <el-dialog title="上传附件" class="master-reported-edit-dialog" v-model="uploadDialogVisible" @close="uploadDialog = false" v-if="uploadDialog">
           <el-upload
                ref="upload"
                :action="uploadInfo.uploadURL"
                :data="{bucket:'scm', module: 'delivery'}"
                :show-file-list="true"
                :multiple="true"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                :on-remove="fileRemove"
                accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                >
                <i class="el-icon-plus"></i>
            </el-upload>
          <div slot="footer" class="dialog-footer">
            <el-button @click="uploadDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveUpload">确 定</el-button>
          </div>
        </el-dialog>
        <t8t-gallery
                v-model="galleryVisible"
                :data="galleryData"
        ></t8t-gallery>
        <el-dialog v-model="dialogImageVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
import Utils from 'src/utils/Utils.js'
import Services from 'src/services/delivery/Service.js'
import api from 'src/services/delivery/distribution.js'
import Cookie from 'js-cookie'
    export default {
        name:'master-reported',
        data () {
            return {
                isTopHide: false,
                isDialogShow: true,
                activeTabName: "one",
                projectDialog:{
                    table:{
                        columns:[
                            {prop:'applyId', label:'项目ID'},
                            {prop:'ownerName', label:'业主姓名'},
                            {prop:'houseAddress', label:'项目地址'}
                        ],
                        method:Services.DISTRIBUTION.methods.getApplyInfo,
                        service:Services.DISTRIBUTION.name,
                        args:{fields:['id', 'houseAddress']},
                        radioCol:true,
                        dialogWidth:'720px'

                    },
                    searchForm:{
                        fields:[
                            {type: 'input',label: '项目ID',name: 'id_eq'},
                        ],
                        showToggleBtn:false
                    }
                },
                projectServer: Services.DISTRIBUTION.name,
                projectMethod:Services.DISTRIBUTION.methods.getApplyInfo,
                projectArgs:{page:1, size:20},
                showProjectDialog:true,
                formData:{
                    applyId:'',
                    scheduleNodeId:'',
                    categoryId:[],
                    insPlanStart:null,
                    workerReportTime:null,
                    reportRemark:''

                },
                commonOptionsConfig:{
                    orgOptions:[],
                    scheduleNodeList:[],
                    categoryList:[]
                },
                formRule:{
                    applyId:[
                            {type:'number', required: true,message: "请选择项目", trigger:"blur"}
                        ],
                    scheduleNodeId:[
                        {type:'number', required: true,message: "请选择排期节点", trigger:"change"}
                        ],
                     workerReportTime:[
                        {type: 'date', required: true,message: "请选择工长报备时间", trigger:"blur"}
                        ]
                },
                columns:[
                    {prop:'attachName', label:'附件名称', readonly:true},
                    {prop:'projectId', label:'上传时间', readonly:true, formatter: "dateParser"},
                    {prop:'remark', label:'备注', editor:{
                        type:'input',
                        rules:[
                                { type:"string", max: 20, min:1, message: '备注长度不能超过20个字符'}
                        ]
                    }},
                    {prop:'createName', label:'上传人', readonly:true}
                ],
                tableTemplateData:{
                    attachName:null,
                    projectId:null,
                    remark:null,
                    createName:null
                },
                uploadDialogVisible:false,
                uploadInfo:{
                    uploadURL:Utils.getUploadURL(),
                    fileList:[],
                },
                applyList:null,
                pickerOptions:{
                    disabledDate(time) {
                        return time.getTime() < Date.now() + 8.64e7*3  || time.getTime() < 8.64e7*365*10*-1;
                   }
                },
                galleryVisible:false,
                galleryData:[],
                uploadDialog:false,
                categoryInfo:{},
                dialogImageUrl: '',
                dialogImageVisible: false
            }
        },
        watch:{
            "formData.scheduleNodeId":function(val){
                if(!val) return
                this.commonOptionsConfig.categoryList = []
                this.formData.categoryId = []
                this.categoryInfo[val].forEach((el) => {
                    this.formData.categoryId.push(el.categoryId)
                    this.commonOptionsConfig.categoryList.push({
                        text:el.category,
                        value:el.categoryId
                    })
                })
            }
        },
        methods: {
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },
            showUploadDialog(){
                this.uploadDialog = true
                this.uploadDialogVisible = true
                this.uploadInfo.fileList = []
            },
            closeDialog() {
                // 填写对应的路由
                this.$router.push({ path: '/delivery/distribution-plan' })
            },
            onChange(val, name){
                this.formData.applyId= val
                this.formData.scheduleNodeId = null
                this.$refs.formRef.validateField('applyId')
                let args = {applyId:val}
                api.getScheduleOptions(args).then((res) =>{
                     if(res.data.status == 200){
                            this.applyList = res.data.result
                            this.commonOptionsConfig.scheduleNodeList = []
                            this.formData.categoryId = []
                           this.applyList && this.applyList.forEach((item) =>{
                                this.commonOptionsConfig.scheduleNodeList.push({
                                        text:item.scheduleName,
                                        value:item.scheduleId
                                })
                                this.categoryInfo[item.scheduleId] = item.categoryInfo
                            })
                     }
                })
            },
            handleCellClick(row, column, cell, event){
                if(column.property =="attachName"){
                    this.galleryVisible = true
                    this.galleryData = [
                        {title:row.attachName, src: Utils.getFullURL(row.filePath)}
                    ]
                }
            },
            addRow(){
                this.$refs.attachTable.addNewRow()
            },
            delRow(){
                if(this.$refs['attachTable'].selectedRows.length < 1){
                        this.$message.error('请选择需要删除的行！')
                  }
                  var flage = true
                 this.$refs['attachTable'].selectedRows.forEach((item) => {
                    if(item.id){
                         flage = false
                         return false
                    }
                 })
                 if(!flage){
                    this.$message.error('只能删除未保存的行！')
                    return false
                 }
                this.$refs['attachTable'].delRows()
            },
            handleSuccess(response, file, fileList){
                 if(response.status == 200){
                  this.uploadInfo.fileList[file.name] = {path:response.result.filePath, fileName:file.name,fileId: response.result.id}
                }else{
                    this.$message.error('上传失败')
                    fileList.shift()
                }
            },
            beforeUpload(file){
                if(file.size > 1024*1024*5){
                    this.$message.error('文件大小超过5M！')
                    return false
                }
                if(this.uploadInfo.fileList[file.name]){
                    this.$message.error('请不要上传重复图片！')
                    return false
                }
            },
            handlePictureCardPreview(file){
                this.dialogImageUrl = file.url;
                this.dialogImageVisible = true;
            },
            fileRemove(file, fileList){
                if(this.uploadInfo.fileList[file.name]){
                        delete this.uploadInfo.fileList[file.name]
                }
            },
            saveUpload(){
                Object.values(this.uploadInfo.fileList).forEach((item) =>{
                   this.$refs.attachTable.dataSource.push({
                        attachName:item.fileName,
                        filePath:item.path,
                        attachPath:item.fileId,
                        remark:null,
                        createUser:Cookie.get('t8t-tc-uid')
                   })
                })
                this.uploadDialogVisible = false

            },
            submitForm(){
                this.$refs.formRef.validate((isValid) =>{
                    if(isValid){
                        this.formData.createUser = Cookie.get('t8t-tc-uid')
                        this.formData.createName = Cookie.get('t8t-tc-username')
                        this.formData.attachNum = this.$refs.attachTable.dataSource.length
                        this.formData.workerReportTime = +Date.parse(this.formData.workerReportTime).toString().slice(0, -3)
                        this.$confirm('确认提交么？', '提交确认', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            type: 'warning'
                         }).then(() => {
                                        let args = {
                                             deliverInstallPlan:this.formData,
                                             imgs:this.$refs.attachTable.dataSource
                                        }
                                        this.$refs['toolbar'].disableBySymbol('EDIT-SUBMIT');
                                        api.planWorkerCreate(args).then((res) =>{
                                                this.$refs['toolbar'].unDisableBySymbol('EDIT-SUBMIT');
                                               if(res.data.status == 200){
                                                  var _this = this
                                                   this.$msgbox({
                                                            title: '提交成功',
                                                            type: 'success',
                                                            message: '',
                                                            showCancelButton: false,
                                                            confirmButtonText: '知道了',
                                                            confirmButtonClass: 'is-plain'
                                                        }).then(() =>{
                                                            _this.closeDialog()
                                                        })
                                               }else{
                                                    this.$msgbox({
                                                    title: '提交失败',
                                                    type: 'error',
                                                    message: res.data.message,
                                                    showCancelButton: false,
                                                    confirmButtonText: '知道了',
                                                    confirmButtonClass: 'is-plain'
                                                  })
                                               }
                                        }).catch(() => {
                                            this.$refs['toolbar'].unDisableBySymbol('EDIT-SUBMIT');
                                            this.$msgbox({
                                                    title: '提交失败',
                                                    type: 'error',
                                                    message: '服务器异常',
                                                    showCancelButton: false,
                                                    confirmButtonText: '知道了',
                                                    confirmButtonClass: 'is-plain'
                                                })
                                        })
                        })
                    }
                })

            }
        }
    }
</script>

<style lang="css" >
.master-reported-edit-dialog .el-dialog--small{
    width: 508px;
}
</style>
