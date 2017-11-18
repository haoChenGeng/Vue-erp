<template>
    <div>
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2" :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                            @EDIT-SUBMIT="submitForm"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container">
                    <!-- 收缩按钮 -->
                    <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container">
                        <el-tabs v-model="activeInputTabName">
                            <el-tab-pane label="基本信息" name="basic">
                                <el-form class="dialog2-form-container" :model="formData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="计划ID：">
                                            <el-input v-model="formData.id" :disabled="eidtType"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="单据类型："><!--写死  配送安装计划单-->
                                            <el-input v-model="formData.documentsType" :disabled="eidtType"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="项目：">
                                            <el-input v-model="formData.applyId" :disabled="eidtType"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="状态：">
                                            <el-select v-model="formData.status"  :disabled="eidtType">
                                                <el-option v-for="item in commonOptionsConfig.statusOptions" :label="item.text" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                     <div class="dialog2-form-item-container">
                                        <el-form-item label="安装类型：">
                                            <el-input v-model="formData.planTypeName" :disabled="eidtType"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="安装节点ID：">
                                            <el-input v-model="formData.scheduleNodeId" :disabled="eidtType"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="工长姓名：">
                                            <el-input v-model="formData.workerName" :disabled="eidtType"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="业主姓名：">
                                            <el-input v-model="formData.projectOwnerName" :disabled="eidtType"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="详细地址" name="detalAddr">
                                <el-form class="dialog2-form-container distribution_addr" :model="formData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="工长姓名：">
                                            <el-input v-model="formData.workerName" :disabled="eidtType"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container addr_item">
                                        <el-form-item label="安装地址：">
                                            <t8t-division
                                                v-model="formData.townArr"
                                                :defaultValue="formData.townId"
                                                class="addr_detail"
                                                :disabled="eidtType"
                                            ></t8t-division>
                                        </el-form-item>
                                        <el-form-item >
                                            <el-input v-model="formData.address" :disabled="eidtType" class="address_detail"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="其他信息" name="other">
                                <el-form class="dialog2-form-container" :model="formData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="安装计划创建人：">
                                            <el-input v-model="formData.createName" :disabled="eidtType"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="安装调度提交人：">
                                            <el-input v-model="formData.deliverPlanUserName" :disabled="eidtType"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="确认安装人：">
                                            <el-input type="text" v-model="formData.confirmDeliverUserName" :disabled="eidtType"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="安装计划创建日期：">
                                            <el-date-picker
                                                class="date-editor_time"
                                                v-model="formData.createTime"
                                                type="datetime"
                                                :disabled="eidtType"
                                            ></el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="安装调度提交日期：">
                                            <el-date-picker
                                                class="date-editor_time"
                                                v-model="formData.insDispatchSubmit"
                                                type="datetime"
                                                :disabled="eidtType"
                                            ></el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="确认安装日期：">
                                            <el-date-picker
                                                class="date-editor_time"
                                                v-model="formData.logConfirmDeliver"
                                                type="datetime"
                                                :disabled="eidtType"
                                            ></el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="最后修改人：">
                                            <el-input type="text" v-model="formData.updateName" :disabled="eidtType"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="最后修改日期：">
                                            <el-date-picker
                                                class="date-editor_time"
                                                v-model="formData.updateTime"
                                                type="datetime"
                                                :disabled="eidtType"
                                            ></el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="返补需求：">
                                            <el-input type="textarea" v-model="formData.installResultRemark" :disabled="eidtType"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <el-tabs v-model="activeTabName">
                            <!--20170919 去除仓库信息展示
                            <el-tab-pane label="仓库信息" name="warehouseInfo">
                                <t8t-table
                                    :dataSource="warehouseDataSource"
                                    :columns="tableConfig.warehouseInfo.columns"
                                    :formatters="tableConfig.warehouseInfo.formatters"
                                    :pageBar="false"
                                ></t8t-table>
                            </el-tab-pane>
                            -->
                            <el-tab-pane label="安装人信息" name="installManInfo" class="installManInfo">
                                 <el-row :gutter="2">
                                    <el-col :span="5">
                                      <label class="el-form-item__label">安装人类型</label>
                                      <el-input v-model="installManInfo.installPeopleTypeName"  :disabled="eidtType" class="col_input"></el-input>
                                    </el-col>
                                    <el-col :span="5">
                                        <label class="el-form-item__label">安装人</label>
                                        <el-input v-model="installManInfo.installPeopleName"  :disabled="eidtType" class="col_input"></el-input>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="2">
                                    <el-col :span="5">
                                      <label class="el-form-item__label">预计安装时间</label>
                                      <el-date-picker
                                                class="date-editor_time"
                                                v-model="formData.insPlanStart"
                                                format="yyyy-MM-dd HH:mm"
                                                type="date"
                                                :disabled="eidtType"
                                        ></el-date-picker>
                                    </el-col>
                                    <el-col :span="5">
                                        <label class="el-form-item__label">预计安装结束时间</label>
                                        <el-date-picker
                                                class="date-editor_time"
                                                v-model="formData.insPlanEnd"
                                                format="yyyy-MM-dd HH:mm"
                                                type="date"
                                                :disabled="eidtType"
                                        ></el-date-picker>
                                    </el-col>
                                </el-row>
                                <h3>安装任务明细</h3>
                                <t8t-table
                                    :indexCol="true"
                                    :columns="tableConfig.installManInfo.columns"
                                    :dataSource="installManInfo.installItemVOList"
                                    :pageBar="false"
                                ></t8t-table>
                            </el-tab-pane>
                            <el-tab-pane label="附件信息" name="attachInfo">
                                <div class="dialog2-toolbar-container">
                                    <el-button type="primary" size="small" icon="plus" @click="showUploadDialog">新增附件</el-button>
                                </div>
                                <t8t-table
                                    ref="attachTable"
                                    :indexCol="true"
                                    :pageBar="false"
                                    :dataSource="attachDataSource"
                                    :columns="tableConfig.attachInfo.columns"
                                    @cell-click="handleCellClick"
                                ></t8t-table>
                            </el-tab-pane>
                            <el-tab-pane label="责任方" name="guiltyList">
                                <t8t-table
                                    :indexCol="true"
                                    :args="tableConfig.guiltyList.args"
                                    :service="tableConfig.guiltyList.service"
                                    :method="tableConfig.guiltyList.method"
                                    :columns="tableConfig.guiltyList.columns"
                                    :commonData="commonOptionsConfig"
                                ></t8t-table>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 另一个el-dialog放这里 -->
        <el-dialog title="上传附件" class="invoiceSales-edit-dialog" v-model="uploadDialogVisible" @close="uploadDialog = false" v-if="uploadDialog">
           <el-upload
                ref="upload"
                :action="uploadInfo.uploadURL"
                :data="{bucket:'scm', module: 'delivery'}"
                :show-file-list="true"
                :file-list="compList"
                :multiple="true"
                :on-preview="handlePictureCardPreview"
                list-type="picture-card"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                :on-remove="fileRemove"
                accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                >
                <i class="el-icon-plus"></i>
            </el-upload>
          <div slot="footer" class="dialog-footer">
            <el-button @click="uploadDialog = false">取 消</el-button>
            <el-button type="primary" @click="saveUpload" :loading="uploadSaveLoading">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog v-model="dialogImageVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <t8t-gallery
                v-model="galleryVisible"
                :data="galleryData"
        ></t8t-gallery>
    </div>
</template>

<script>
import tableConfig from './table_config.js'
import api from 'src/services/delivery/distribution.js'
import {Service, methods} from 'src/services/delivery/installation-schedule/Service.js'
import commonApi from 'src/services/commonApi/commonApi.js'
import Cookie from 'js-cookie'
import Utils from 'src/utils/Utils.js'
    export default {
        name:'installPlanDetail',
        components:{
        },
        data () {
            return {
                isTopHide: false,
                isDialogShow: true,
                eidtType:true,
                id:null,
                activeInputTabName:'basic',
                activeTabName: "installManInfo",
                tableConfig:tableConfig,
                formData:{
                    townArr:[]
                },
                commonOptionsConfig:{
                    attachTypelist:[],
                    planType:[],
                    statusOptions: [
                    {text:'待调度', value:1},
                    {text:'待完成', value:2},
                    {text:'已完成', value:3},
                    {text:'异常结束', value:4},
                    {text:'异常关闭', value:5}
                    ],
                        categoryList:[],
                    userOrganizationList:[
                        {value:"001001003", text:"供应商"},
                        {value:"001001008", text:"安装商"},
                        {value:"001001005", text:"工长"}
                    ],
                },
                uploadDialogVisible:true,
                uploadDialog:false,
                uploadFileList:[],
                uploadInfo:{
                    uploadURL:Utils.getUploadURL(),
                    fileList:[],
                    compList:[]
                },
                attachType:{},
                attachDataSource:[],
                warehouseDataSource:[],
                uploadSaveLoading:false,
                galleryVisible:false,
                dialogImageUrl: '',
                dialogImageVisible: false,
                installManInfo:{}
            }
        },
        created(){
            this.id = this.$route.query.id
            if(!this.id){
                this.$msgbox({
                        title: '参数错误！',
                        type: 'error',
                        message: '',
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                }).then(() => {
                         this.$router.go(-1)
                });
            }
            this.setAttachType('07', '42501');
            this.getCommonOptions('42501', 'attachTypelist')
            this.initData(this.id);
            this.initInstallManInfo(this.id)
            this.tableConfig.guiltyList.args =  {search:{planId_eq:this.id}}
        },
        filters:{
        },
        methods: {
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },
            closeDialog() {
                // 填写对应的路由
                this.$router.push({ path: '/delivery/installtion-schedule-list' })
            },
            handleCellClick(row, column, cell, event){
                if(column.property =="attachName"){
                    this.galleryVisible = true
                    this.galleryData = [
                        {title:row.attachName, src: Utils.getFullURL(row.filePath)}
                    ]
                }
            },
            handlePictureCardPreview(file){
                this.dialogImageUrl = file.url;
                this.dialogImageVisible = true;
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
            showUploadDialog(){
                this.uploadInfo.fileList = []
                this.uploadDialog = true
                this.uploadDialogVisible = true
            },
            fileRemove(file, fileList){
                if(this.uploadInfo.fileList[file.name]){
                        delete this.uploadInfo.fileList[file.name]
                }
            },
            saveUpload(){
                if(Object.values(this.uploadInfo.fileList).length < 1){
                    this.$message.error('请先上传一张图片！')
                    return false
                }
                var args = {imgs:[], id:this.id};

                Object.values(this.uploadInfo.fileList).forEach((item) => {
                    args.imgs.push({
                            attachPath:item.fileId,
                            attachName:item.fileName,
                            remark:'',
                            filePath:item.path,
                            createUser:Cookie.get('t8t-tc-uid')
                        })
                    })
                this.uploadSaveLoading = true
                api.uploadImgs(args).then((res) =>{
                    this.uploadSaveLoading = false
                    if(res.data.status == 200){
                        var _this = this
                       this.$msgbox({
                                title: '新增成功',
                                type: 'success',
                                message: '',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            }).then(() =>{
                                _this.uploadDialog = false
                                _this.initData(_this.id)
                            })
                    }else{
                        this.$message.error(res.data.message)
                    }
                }).catch(() =>{
                    this.$message.error('服务器异常')
                    this.uploadSaveLoading = false
                })
            },
            setAttachType: function(code, pcode) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode:pcode,
                        propertyCode: code
                    },
                    size: 1
                }
                let list = []
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            if(res.data.result.length > 0){
                                this.attachType = res.data.result.length[0]
                            }
                        }
                    })
            },
            initData(id){
                let args = {id:id}
                api.getDeliverDispatchView(args).then((res) => {
                     if(res.data.status == 200){
                            this.attachDataSource = res.data.result.imgs ? res.data.result.imgs : []
                            this.warehouseDataSource = res.data.result.storageVOS ? res.data.result.storageVOS : []
                            this.formData = Object.assign(this.formData, res.data.result.deliverInstallPlanVO)
                            this.formData.insPlanStart = this.formData.insPlanStart ? this.formData.insPlanStart*1000:null;
                            this.formData.insPlanEnd = this.formData.insPlanEnd ? this.formData.insPlanEnd*1000:null;
                            this.formData.documentsType = '配送安装计划单'
                            this.commonOptionsConfig.categoryList = []
                            this.formData.categorys = []
                            this.formData.categoryInfo && this.formData.categoryInfo.forEach((item) => {
                                this.formData.categorys.push(item.categoryId)
                                this.commonOptionsConfig.categoryList.push({
                                     text:item.category,
                                     value:item.categoryId
                                })
                            })
                            this.formatterData(this.formData)
                     }
                })

            },
            initInstallManInfo(id){
                let args = {planId:id}
                methods.queryInstallItemByInstallPlanId(args).then((res)=>{
                    if(res.data.status == 200){
                        this.installManInfo = res.data.result[0]
                    }
                })
            },
            formatterData(data){
                data.insDispatchSubmit  = data.insDispatchSubmit ? data.insDispatchSubmit * 1000 : null
                data.disPlanDeliverMdf  = data.disPlanDeliverMdf ? data.disPlanDeliverMdf * 1000 : null
                data.logConfirmDeliver  = data.logConfirmDeliver ? data.logConfirmDeliver * 1000 : null
                data.updateTime = data.updateTime ? data.updateTime * 1000 : null
                data.createTime = data.createTime ? data.createTime * 1000 : null
            },
            getCommonOptions: function(fatherCode,selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus===1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            });
                            this.commonOptionsConfig[selectName] = list;
                        }
                    })
            }
        }
    }
</script>

<style lang="css" scoped>
.distribution_addr{
        flex-direction: column;
}
.distribution_addr .addr_input{
     width: 250px;
}

.distribution_addr .addr_item{
    width: 60%;
}
.distribution_addr .addr_item .addr_detail{
    width: 40%;
}
.distribution_addr .address_detail{
    width: 25%;
}
.col_input{
    width: 60%;
}
</style>
<style>
.distribution_addr .addr_item .el-form-item__content{
    width: 100%;
}
.distribution_addr .addr_input .el-cascader{
    width: 100%;
}
</style>
<style lang="css">
.invoiceSales-edit-dialog .el-dialog--small{
    width: 508px;
}
.distribution_addr .addr_item .addr_detail .el-cascader{
    width: 100%;
}
.installManInfo .el-col{
    margin-top: 10px;
}
</style>
