<template>
    <div>
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog foremanworker_edit">
            <div class="t8t-full-dialog-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                            @TEMP-SAVE="on_Save(1)"
                            @SUBMIT="on_Save(2)"
                            @EDIT="on_edit"
                            @APPROVAL-FLOW="on_approval_flow"
                            @ANTI-AUDITING="on_anti_auditing"
                            @JIEYUE="on_jieYue"
                            @BACK="on_back"
                            @CANCEL-JIEYUE="on_cancel_jieYue"
                            ref="toolbar"
                        >
                    </t8t-toolbar>
                    </div>
                </div>
                <!-- 表单区 -->
                <div class="full-dialog-form-container container-center foremanworker">
                    <el-form :model="formData" :rules="formRule" ref="baseInfo" label-position="right" label-width="120px">
                        <div class="form-item-container" v-if="formData.id">
                            <el-form-item label="ID：" prop="id">
                                <el-input v-model="formData.id"  :disabled="true"></el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="姓名：" prop="workerName">
                                <el-input v-model="formData.workerName" placeholder="请输入姓名" :disabled="eidtType"></el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="性别：" prop="workerSex">
                                <el-select v-model="formData.workerSex" placeholder="--请选择--" :disabled="eidtType">
                                    <el-option v-for="item in options_workerSex" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="form-item-container" v-if="type != 'add' && id">
                            <el-form-item label="状态：" prop="workerStatus">
                                <el-select v-model="formData.workerStatus" :disabled="true">
                                    <el-option v-for="item in options_workerStatus" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="从属组织：" prop="subOrgId">
                                <el-select v-model="formData.subOrgId" placeholder="--请选择--" :disabled="eidtType" :filterable="true">
                                    <el-option v-for="item in options_subOrgId" :label="item.label" :value="item.value" >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="form-item-container isProjectManager">
                            <el-form-item label="是否是项目经理：" prop="isProjectManager">
                                <el-select v-model="formData.isProjectManager" placeholder="--请选择--" :disabled="eidtType">
                                    <el-option v-for="item in options_isProjectManager" :label="item.label" :value="item.value" >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="从属交付经理：" prop="payManagerId">
                                <el-select
                                    v-model="formData.payManagerId"
                                    placeholder="--请选择--"
                                    :disabled="eidtType"
                                    :loading="payManagerLoading"
                                    @visible-change="handlePayManager"
                                    :filterable="true"
                                >
                                    <el-option v-for="item in options_payManagerId" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="从业时间：" prop="workStime" >
                                <el-date-picker
                                    class="date-editor_time"
                                   v-model="formData.workStime"
                                   type="date" placeholder="请选择从业时间"
                                   :picker-options="work_pickerOptions"
                                   :disabled="eidtType"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="加入时间：" prop="joinTime">
                                <el-date-picker
                                        class="date-editor_time"
                                        v-model="formData.joinTime"
                                        type="date"
                                        placeholder="请选择加入时间"
                                        :disabled="eidtType"
                                        :picker-options="join_pickerOptions"
                                        ></el-date-picker>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="身份证号：" prop="idCard">
                                <el-input v-model="formData.idCard" placeholder="请输入身份证号" :disabled="eidtType"></el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="出生日期：" prop="birthdate">
                                <el-date-picker
                                    class="date-editor_time"
                                    v-model="formData.birthdate"
                                    type="date"
                                    placeholder="请选择出生日期"
                                    :picker-options="birthdate_pickerOptions"
                                    :disabled="eidtType"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="手机号码：" prop="phone_org">
                                <input-phone
                                  :disabled="eidtType"
                                  v-model="formData.phoneEncode"
                                  :defaultValue="formData.phoneDecode"
                                  @blur="phone_blur"
                                >
                                </input-phone>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
                <!-- 标签页区 -->
                <div class="full-dialog-tabs-container">
                    <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
                        <el-tab-pane label="工人信息" name="tab1" v-if="formData.isProjectManager>0 && $route.params.type == 'view'">
                            <add-tab-1 ref="tab1"></add-tab-1>
                        </el-tab-pane>
                        <el-tab-pane label="联系信息" name="tab3">
                            <add-tab-3 ref="tab3" :eidtType="eidtType"></add-tab-3>
                        </el-tab-pane>
                        <el-tab-pane label="业务信息" name="tab2">
                            <add-tab-2 ref="tab2" :eidtType="eidtType" :isProjectManager="formData.isProjectManager"></add-tab-2>
                        </el-tab-pane>
                        <el-tab-pane label="紧急联系人信息" name="tab4">
                            <add-tab-4 ref="tab4" :eidtType="eidtType"></add-tab-4>
                        </el-tab-pane>
                        <el-tab-pane label="银行卡信息" name="tab5">
                            <add-tab-5 @uploadDialogShow="handUploadDialog" ref="tab5" :eidtType="eidtType"></add-tab-5>
                        </el-tab-pane>
                        <el-tab-pane label="图片附件" name="tab6">
                            <add-tab-6 @uploadDialogShow="handUploadDialog" @showImage="handShowImages" ref="tab6" :eidtType="eidtType"></add-tab-6>
                        </el-tab-pane>
                        <el-tab-pane label="冻结信息" name="tab7">
                            <add-tab-7 ref="tab7" :eidtType="eidtType"></add-tab-7>
                        </el-tab-pane>
                        <el-tab-pane label="其他信息" name="tab8">
                            <add-tab-8 ref="tab8"></add-tab-8>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-dialog>
           <el-dialog title="上传附件" class="invoiceSales-edit-dialog" v-model="uploadDialogVisible" @close="add_btnCancleClick">
               <el-upload
                    ref="upload"
                    :action="uploadInfo.uploadURL"
                    :data="{bucket:'scm', module: 'delivery'}"
                    :show-file-list="true"
                    :file-list="uploadInfo.fileList"
                    :on-change="companyCertificationChange"
                    :on-success="handleSuccess"
                    :before-upload="beforeUpload"
                    :on-remove="fileRemove"
                    accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                    >
                    <el-button  size="small">上传文件</el-button>
                </el-upload>
              <div slot="footer" class="dialog-footer">
                <el-button @click="uploadDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveUpload">确 定</el-button>
              </div>
            </el-dialog>
            <el-dialog title="工人解约" class="invoiceSales-edit-dialog" v-model="dimissionDialogVisible" >
                <el-form :model="dimissionFormData" :rules="dimissionFormRule" ref="dimissionInfo" label-position="right" label-width="100px">
                    <div class="form-item-container">
                        <el-form-item label="解约原因：" prop="reason">
                            <el-input type="textarea" v-model="dimissionFormData.reason"></el-input>
                        </el-form-item>
                     </div>
                     <div class="form-item-container">
                            <el-form-item label="解约单：" prop="pic">
                                <el-upload
                                    ref="upload"
                                    :action="uploadInfo.uploadURL"
                                    :data="{bucket:'scm', module: 'delivery'}"
                                    :show-file-list="true"
                                    :on-success="dimissionUploadSuccess"
                                    :before-upload="dimissionBeforeUpload"
                                    :on-remove="dimissionFileRemove"
                                    :multiple="true"
                                    accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                                >
                                    <el-button  size="small">上传解约单</el-button>
                                 </el-upload>
                            </el-form-item>
                     </div>
                </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dimissionDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveDimission" :loading="dimissionButtonLoading">确 定</el-button>
              </div>
            </el-dialog>
                 <el-dialog title="工长取消解约" class="invoiceSales-edit-dialog" v-model="cancelDimissionDialogVisible" >
                <el-form :model="cancelDimissionFormData" :rules="cancelDimissionFormRule" ref="cancelDimissionInfo" label-position="right" label-width="100px">
                    <div class="form-item-container">
                        <el-form-item label="取消原因：" prop="cancelReason">
                            <el-input type="textarea" v-model="cancelDimissionFormData.cancelReason"></el-input>
                        </el-form-item>
                     </div>
                </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="cancelDimissionDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveCancelDimission" :loading="cancelDimissionButtonLoading">确 定</el-button>
              </div>
            </el-dialog>
            <t8t-gallery
                v-model="galleryVisible"
                :data="galleryData"
            ></t8t-gallery>
              <t8t-step-page
                v-if="isShowFlow"
                :method="flowMethod"
                :service="flowService"
                :args="flowArgs"
                @close="isShowFlow=false"
            >
            </t8t-step-page>
    </div>
</template>

<script>
import addTab1 from  './add-tab-1.vue'
import addTab2 from  './add-tab-2.vue'
import addTab3 from  './add-tab-3.vue'
import addTab4 from  './add-tab-4.vue'
import addTab5 from  './add-tab-5.vue'
import addTab6 from  './add-tab-6.vue'
import addTab7 from  './add-tab-7.vue'
import addTab8 from  './add-tab-8.vue'
import foremanworkerConfig from './foremanworker-config.json'
import DateUtils from 'src/utils/DateUtils.js'
import isIdCard from 'src/utils/isIdCard.js'
import ZZ from 'src/config/delivery/common-regular-expression.js'
import api from 'src/services/delivery/foremanworker.js'
import service from 'src/services/delivery/Service.js'
import InputPhone from 'src/components/t8t-form/inputPhone.vue'
import Cookie from 'js-cookie'
import Utils from 'src/utils/Utils.js'
import apiCommon from 'src/services/commonApi/commonApi.js'
import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'
export default {
    name: 'page-foremanworker-add',
    components: {
        addTab1,
        addTab2,
        addTab3,
        addTab4,
        addTab5,
        addTab6,
        addTab7,
        addTab8,
        InputPhone,
        T8tStepPage
    },
    data () {
        var checkIdCard = function(rule, value, callback){
                     if(!value){
                        return callback(new Error('身份证号码不能为空'));
                     }
                     if(! isIdCard(value)){
                          return callback(new Error('身份证号码填写错误'));
                      }
                      callback()
                };
        var checkUserName = function(rule, value, callback){
               if(!value){
                        return callback(new Error('请填写姓名'));
                 }
                if(value.length > 20){
                    return callback(new Error('姓名长度不能超过20个字符'));
                }
                if(!ZZ.username.test(value)){
                    return callback(new Error('请填写正确的姓名'));
                }
                // let args = {name:value}
                // return api.accountFindByName(args).then((res) => {
                //     if(res.data.status == 200 && res.data.result){
                //         return callback(new Error('姓名重复'))
                //     }else{
                //         return callback()
                //     }
                // }).PromiseValue
                callback()
        }
        return {
            id : null,
            isLoading: false,
            isDialogShow: true,
            activeTabName: 'tab3',
            workerStatus:0,
            type:'',
            eidtType:false,
            payManagerLoading:false,
            formData: {
                workerName: '',
                workerSex: '',
                subOrgId: null,
                isProjectManager: '',
                payManagerId: null,
                workStime: '',
                joinTime: '',
                idCard: '',
                birthdate: '',
                phoneDecode: '',
                phoneEncode: '',
                phone_org:'',
            },
            formRule: {
                workerName: [
                    { "validator": checkUserName, required: true , trigger:"blur"}
                ],
                workerSex: [{ type: 'number', required: true, message: '请选择性别', trigger:"change"}],
                subOrgId: [{ type: 'number', required: true, message: '请选择从属组织', trigger:"change" }],
                isProjectManager: [{ type: 'number', required: true, message: '请选择是否有资格成为项目经理', trigger:"change"}],
                joinTime: [{ type: 'date', required: true, message: '请选择加入时间', trigger:"blur"}],
                idCard: [{ "validator": checkIdCard,  required: true, trigger:"blur"}],
                birthdate: [{ type: 'date', required: true, message: '请选择出生日期', trigger:"blur"}],
                phone_org: [
                    { required: true, message: '请输入手机号码', trigger:"blur"},
                    {pattern: ZZ.phone, message: '请输入正确的手机号码', trigger:"blur"}
                ],
            },
            options_workerSex: foremanworkerConfig.options_workerSex,
            options_workerStatus: foremanworkerConfig.options_workerStatus,
            options_isProjectManager: foremanworkerConfig.options_isProjectManager,
            options_subOrgId:[],
            options_payManagerId:[],
            uploadDialogVisible:false,
            uploadInfo:{
                 uploadURL:Utils.getUploadURL(),
                 fileName:'',
                 filePath:'',
                 fileId:'',
                 fileList:[],
                 rowNum:-1,
                 fromTab:''
            },
             birthdate_pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e7 || time.getTime() < 8.64e7*365*10*-1;
                   }
            },
            work_pickerOptions:{
                disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e7 || time.getTime() < 0;
                   }
            },
            join_pickerOptions:{
                disabledDate(time) {
                        return time.getTime() > Date.now() + 365*8.64e7 || time.getTime() < 0;
                   }
            },
            otherValidateRes:false,
            dimissionDialogVisible:false,
            dimissionFileList:{},
            dimissionFormData:{
                    reason:'',
                    pic:'',
                    picList:[],
            },
            dimissionFormRule:{
                reason:[
                    { required: true, message: '请输入解约原因', trigger:"blur"},
                    { max:200, min:1, message: '解约原因最多填写200个字', trigger:"blur"}
                ],
                pic:[
                    { required: true, message: '请至少上传一张解约单图片'},
                    { max:5, min:1, message: '最多上传5张图片'}
                ]
            },
            cancelDimissionDialogVisible:false,
            cancelDimissionFormData:{
                cancelReason:''
            },
            cancelDimissionFormRule:{
                cancelReason:[
                    { required: true, message: '请输入取消解约原因', trigger:"blur"},
                    { max:200, min:1, message: '取消解约原因最多填写200个字', trigger:"blur"}
                ]
            },
            isShowFlow:false,
            flowService:null,
            flowMethod:null,
            flowArgs:null,
            dimissionButtonLoading:false,
            cancelDimissionButtonLoading:false,
            galleryVisible:false,
            galleryData:[],
            workerAttachTypeId:null,
            workerAttachTypeValId:null
        }
    },
    created() {
        var type = this.$route.params.type
        if(!['view', 'edit', 'add'].find((n) => n == type)){
                   this.$msgbox({
                    title: '路由错误！',
                    type: 'error',
                    message: '',
                    showCancelButton: false,
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                }).then(() => {
                     this.$router.go(-1)
                });
        }
        this.type = type
        this.id = this.$route.query.id
        if(this.type != 'add' && !this.id){
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
        if(this.id)
            this.initBaseInfo(this.id)
        if(type == 'view')
            this.eidtType = true
        this.set_optionsSubOrg()
    },
    watch:{
        "formData.subOrgId":function(value, oldValue){
            this.set_payManager()
            if(oldValue){
                this.formData.payManagerId = ''
            }
        },
        "otherValidateRes":function(){
            this.otherValidateResChange()
        },
        "$route.params.type":function(value){
            if(value == 'view'){
                this.eidtType = true
            }else{
                this.eidtType = false
            }
        }
    },
    filters:{
            dateParser(text) {
                let dateString = '';
                 if (text !== 0 && text !== null && text !== undefined) {
                        let objDate = new Date(text * 1000);
                        dateString = DateUtils(objDate, 'yyyy-mm-dd HH:MM:ss')
                 }
                return dateString
            }

        },
    methods: {
        //关闭当前页面
        closeDialog() {
            this.$router.go(-1)
        },
        handlePayManager(type){
            if(type && !this.formData.subOrgId){
                 this.$message.error('请先选择从属组织')
            }
        },
        handleTabClick(tab){
            let tabName = tab.name
            var that = this
            if(this.$refs[tabName].$refs.tableDebitType){
                this.$nextTick(function(){
                    that.$refs[tabName].$refs.tableDebitType.$refs.table.doLayout()
                })

            }
        },
        handUploadDialog(path, name, index, tab){
            this.uploadInfo.filePath = path
            this.uploadInfo.fileName = name
            this.uploadInfo.rowNum = index
            this.uploadInfo.fromTab = tab
            if(path){
                this.uploadInfo.fileList = [
                    {name:name, url:this.getFullURL(path, null)}
                ]
            }else{
               this.uploadInfo.fileList = []
            }
            this.uploadDialogVisible = true
        },
        saveUpload(){
              this.$refs[this.uploadInfo.fromTab].setfile(this.uploadInfo)
              this.uploadDialogVisible = false
        },
        phone_blur(value){
             this.formData.phone_org = value
             this.$refs['baseInfo'].validateField('phone_org')
             return true
        },
        handShowImages(imagePath, imageName, row){
            this.galleryVisible = true
            this.galleryData = [
                    {title:imageName, src: this.getFullURL(imagePath, row['attachPath'])}
                    ]
        },
        getFullURL(path, attachPath){
            if(attachPath){
                return Utils.getFullURL(path)
            }else{
                return 'http://pic.to8to.com/' + path
            }
        },
        beforeUpload(file){
                if(file.size > 1024*1024*5){
                    this.$message.error('文件大小超过5M！')
                    return false
                }
        },
        handleSuccess(response, file, fileList){
             if(response.status == 200){
                  this.uploadInfo.filePath = response.result.filePath
                  this.uploadInfo.fileName = file.name
                  this.uploadInfo.fileId = response.result.id
             }else{
                this.$message.error('上传失败')
                fileList.shift()
             }
             if(fileList.length > 1)
                fileList.shift()
        },
        fileRemove(){
            this.uploadInfo.filePath = ''
            this.uploadInfo.fileName = ''
        },
        on_edit(){
            if(this.formData.workerStatus != 0 && this.formData.workerStatus != 3){
                            this.$message.error('只有暂存或审核被驳回的工人、工长才能进行编辑')
                            return
             }
            this.$router.replace({ path: '/delivery/foremanworker/edit',query:{id: this.$route.query.id} })
        },
        dimissionUploadSuccess(response, file, fileList){
            if(response.status == 200){
                    this.dimissionFormData.pic = '1'
                    this.dimissionFileList[file.name] = {filePath :response.result.filePath, attachName:file.name, attachPath:response.result.id}
             }else{
                this.$message.error('上传失败')
                fileList.shift()
             }
             if(fileList.length > 5){
                    this.dimissionFormData.pic='111111'
             }
             this.$refs.dimissionInfo.validateField('pic')
        },
        dimissionBeforeUpload(file){
                if(file.size > 1024*1024*5){
                    this.$message.error('文件大小超过5M！')
                    return false
                }
                if(this.dimissionFileList[file.name]){
                    this.$message.error('请不要上传重复图片！')
                    return false
                }
        },
        dimissionFileRemove(file, fileList){
              if(this.dimissionFileList[file.name]){
                        delete this.dimissionFileList[file.name]
                }

                if(!this.dimissionFileList || Object.values(this.dimissionFileList).length < 1){
                    this.dimissionFormData.pic = ''
                }else if(Object.values(this.dimissionFileList).length > 5){
                    this.dimissionFormData.pic = '111111'
                }else{
                    this.dimissionFormData.pic = '1'
                }
                this.$refs.dimissionInfo.validateField('pic')
        },
        on_jieYue(){
            if(this.formData.workerStatus != 4 && this.formData.workerStatus != 7){
                  this.$message.error('只有合作中的工人、工长才能进行申请解约')
                    return false
              }
              this.getAuxDataId({propertyCode:'41003'}).then((res) => {
                     if(res.data.status == 200 && res.data.result.length == 1){
                            this.workerAttachTypeId = res.data.result[0]['id']
                     }else{
                        this.$message.error('获取附件类型失败请重试')
                        this.dimissionDialogVisible = false
                     }
                }).catch((res) => {
                        this.$message.error('获取附件类型失败请重试')
                        this.dimissionDialogVisible = false
                })
                this.getAuxDataId({propertyCode:'06', pPropertyCode:'41003'}).then((res) => {
                     if(res.data.status == 200 && res.data.result.length == 1){
                            this.workerAttachTypeValId = res.data.result[0]['id']
                     }else{
                        this.$message.error('获取附件类型失败请重试')
                        this.dimissionDialogVisible = false
                     }
                }).catch((res) => {
                        this.$message.error('获取附件类型失败请重试')
                        this.dimissionDialogVisible = false
                })
            this.dimissionDialogVisible = true
        },
        getAuxDataId(search){
             let arg =  {
                search: search,
                 page: 1,
                 size: 1
            }
            var id = false
           return apiCommon.queryUnionParent(arg)
        },
        saveDimission(){
             this.$refs.dimissionInfo.validate((isValid)=>{
                   if(isValid){
                        let args = {
                            dimission:{
                                workerId:this.$route.query.id,
                                reason:this.dimissionFormData.reason,
                                pic:'',
                                createUser:Cookie.get('t8t-tc-uid'),
                                workerAttach:[]
                            }
                        }
                        var picArr = []
                        Object.values(this.dimissionFileList).forEach((item) => {
                            picArr.push(item.filePath)
                        })
                        args.dimission.workerAttach = Object.values(this.dimissionFileList)
                        args.dimission.pic = picArr.toString()
                        args.dimission.workerAttach.map((item) =>{
                            item.createUser = Cookie.get('t8t-tc-uid')
                            item.attachTypeId = this.workerAttachTypeId
                            item.attachTypeValueId = this.workerAttachTypeValId
                        })
                        this.$refs['toolbar'].disableBySymbol('JIEYUE');
                        this.dimissionButtonLoading = true
                        api.workerDimissionServiceCreate(args).then((res) => {
                            this.$refs['toolbar'].unDisableBySymbol('JIEYUE');
                            this.dimissionButtonLoading = false
                             if(res.data.status == 200){
                                  this.$msgbox({
                                            title: '申请解约成功',
                                            type: 'success',
                                            message: '',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                  this.dimissionDialogVisible = false
                                  this.initBaseInfo(this.id)
                             }else{
                                 this.$msgbox({
                                    title: '申请解约失败',
                                    type: 'error',
                                    message: res.data.result,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                  })
                             }
                        }).catch( (res) =>{
                            this.$refs['toolbar'].unDisableBySymbol('JIEYUE');
                            this.$msgbox({
                                    title: '申请解约失败',
                                    type: 'error',
                                    message: '服务器未知错误，请重试!',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                            })
                        })
                   }
             })
        },
        on_anti_auditing(){
              if(this.formData.workerStatus != 2 && this.formData.workerStatus != 4){
                  this.$message.error('只有审核通过或合作中的工人、工长才能进行反审核')
                    return false
              }
              let args = {ids:[this.$route.query.id], updateUser: Cookie.get('t8t-tc-uid')}
              this.$refs['toolbar'].disableBySymbol('ANTI-AUDITING');
              api.workerBaseServiceApprovalAnew(args).then((res) =>{
                    this.$refs['toolbar'].unDisableBySymbol('ANTI-AUDITING');
                   if(res.data.status == 200){
                              this.$msgbox({
                                        title: '反审核成功',
                                        type: 'success',
                                        message: '',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                              this.initBaseInfo(this.id)
                         }else{
                             this.$msgbox({
                                title: '反审核失败',
                                type: 'error',
                                message: res.data.result,
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                              })
                        }
                    }).catch( (res) =>{
                            this.$refs['toolbar'].unDisableBySymbol('ANTI-AUDITING');
                            this.$msgbox({
                                    title: '反审核失败',
                                    type: 'error',
                                    message: '服务器未知错误，请重试!',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                            })
                        })
        },
        on_back(){
            if(this.formData.workerStatus != 6){
                  this.$message.error('只有已解约的工人、工长才能进行重新入职')
                    return false
              }
            let args = {id:this.$route.query.id, updateUser: Cookie.get('t8t-tc-uid')}
            this.$refs['toolbar'].disableBySymbol('BACK');
            api.workerBaseServiceAnew(args).then((res) => {
                this.$refs['toolbar'].unDisableBySymbol('BACK');
                if(res.data.status == 200){
                          this.$msgbox({
                                    title: '重新入职成功',
                                    type: 'success',
                                    message: '',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                          this.initBaseInfo(this.id)
                     }else{
                         this.$msgbox({
                            title: '重新入职失败',
                            type: 'error',
                            message: res.data.result,
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                          })
                    }
            }).catch( (res) =>{
                            this.$refs['toolbar'].unDisableBySymbol('BACK');
                            this.$msgbox({
                                    title: '重新入职失败',
                                    type: 'error',
                                    message: '服务器未知错误，请重试!',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                            })
             })
        },
        on_cancel_jieYue(){
            if(this.formData.workerStatus != 7){
                  this.$message.error('只有解约驳回的工人、工长才能进行取消解约')
                    return false
              }
            this.cancelDimissionDialogVisible = true
        },
        saveCancelDimission(){
            this.$refs.cancelDimissionInfo.validate((isValid) =>{
                  if(isValid){
                       let args = {
                                    "dimission": {
                                        "idList":[this.$route.query.id],
                                        "updateUser":Cookie.get('t8t-tc-uid'),
                                        "cancelReason":this.cancelDimissionFormData.cancelReason
                                        }
                                    }
                        this.$refs['toolbar'].disableBySymbol('CANCEL-JIEYUE');
                        this.cancelDimissionButtonLoading = true
                        api.workerDimissionServiceCancel(args).then((res) =>{
                            this.$refs['toolbar'].unDisableBySymbol('CANCEL-JIEYUE');
                            this.cancelDimissionButtonLoading = false
                            if(res.data.status == 200){
                                  this.$msgbox({
                                            title: '取消解约成功',
                                            type: 'success',
                                            message: '',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                  this.cancelDimissionDialogVisible = false
                                  this.initBaseInfo(this.id)
                             }else{
                                 this.$msgbox({
                                    title: '取消解约失败',
                                    type: 'error',
                                    message: res.data.result,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                  })
                            }
                        }).catch( (res) =>{
                            this.$refs['toolbar'].unDisableBySymbol('CANCEL-JIEYUE');
                            this.$msgbox({
                                    title: '取消解约失败',
                                    type: 'error',
                                    message: '服务器未知错误，请重试!',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                            })
             })

                  }
            })
        },
        on_approval_flow(){
            this.isShowFlow = true
            if(this.formData.processId){
                this.flowArgs = {workerId:this.formData.id}
                this.flowMethod = service.FOREMANWORKER.methods.getProcessDetail
                this.flowService = service.FOREMANWORKER.name
            }
        },
        on_Save(type) {
            this.$refs['baseInfo'].validate((isValid) => {
                if (!isValid){
                    return false
                }
               this.otherValidate().then((result) => {
                    this.otherValidateRes = false
                    var args = {}
                   if(this.id > 0){
                       var args = {
                        'info' : this.mkUdpData(),
                        'type' : type
                       }
                   }else{
                        var args = {
                        'info' : this.mkCreaterData(),
                       }
                    }
                    var msg = type == 1 ? '暂存' : '提交'
                    var button = type == 1 ? 'TEMP-SAVE' : 'SUBMIT'
                    this.$refs['toolbar'].disableBySymbol(button);
                    if(this.id > 0){
                        if(this.formData.workerStatus != 0 && this.formData.workerStatus != 3){
                            this.$message.error('只有暂存或审核被驳回的工人、工长才能进行修改')
                            return
                        }
                        api.workerServiceUpdate(args).then((res) => {
                                this.$refs['toolbar'].unDisableBySymbol(button);
                                if(res.data.status === 200){
                                        if(type == 2){
                                            this.eidtType = true
                                            this.formData.workerStatus = 1
                                        }
                                      var _this = this
                                       this.$msgbox({
                                            title: msg + '成功',
                                            type: 'success',
                                            message: '',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        }).then((val) =>{
                                            if(type == 2){
                                              _this.$router.go(-1)
                                            }else{
                                                _this.$refs.tab2.$refs.tableDebitType.resetActionLog()
                                                _this.$refs.tab2.$refs.tableDebitType.reloadTable()
                                                _this.$refs.tab4.$refs.tableDebitType.resetActionLog()
                                                _this.$refs.tab4.$refs.tableDebitType.reloadTable()
                                                _this.$refs.tab5.$refs.tableDebitType.resetActionLog()
                                                _this.$refs.tab5.$refs.tableDebitType.reloadTable()
                                                _this.$refs.tab6.$refs.tableDebitType.resetActionLog()
                                                _this.$refs.tab6.$refs.tableDebitType.reloadTable()
                                                _this.$refs.tab7.$refs.tableDebitType.resetActionLog()
                                                _this.$refs.tab7.$refs.tableDebitType.reloadTable()
                                            }
                                        })
                                }else{
                                   this.$msgbox({
                                    title: msg + '失败',
                                    type: 'error',
                                    message: res.data.result || res.data.message,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                  })
                                }
                        }).catch( (error) =>{
                            this.$refs['toolbar'].unDisableBySymbol(button);
                            this.$msgbox({
                                    title:  msg + '失败',
                                    type: 'error',
                                    message: '服务器未知错误，请重试!',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                            })
                    })
                    }else{
                        if(type == 2){
                            this.$message.error('请先进行暂存')
                            this.$refs['toolbar'].unDisableBySymbol(button);
                            return false
                        }
                        api.create(args)
                            .then((res) => {
                                this.$refs['toolbar'].unDisableBySymbol(button);
                                if(res.data.status === 200){
                                 this.formData.id = this.id = res.data.result
                                 this.formData.workerStatus = 0
                                        var _this = this
                                       this.$msgbox({
                                            title: '暂存成功',
                                            type: 'success',
                                            message: '',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        }).then((val) =>{
                                              _this.$router.replace({ path: 'edit',query:{id: res.data.result} })
                                              _this.$refs.tab2.$refs.tableDebitType.resetActionLog()
                                                _this.$refs.tab2.$refs.tableDebitType.reloadTable()
                                                _this.$refs.tab4.$refs.tableDebitType.resetActionLog()
                                                _this.$refs.tab4.$refs.tableDebitType.reloadTable()
                                                _this.$refs.tab5.$refs.tableDebitType.resetActionLog()
                                                _this.$refs.tab5.$refs.tableDebitType.reloadTable()
                                                _this.$refs.tab6.$refs.tableDebitType.resetActionLog()
                                                _this.$refs.tab6.$refs.tableDebitType.reloadTable()
                                                _this.$refs.tab7.$refs.tableDebitType.resetActionLog()
                                                _this.$refs.tab7.$refs.tableDebitType.reloadTable()
                                        })
                                        this.id = res.data.result
                                        //银行卡添加失败
                                }else if(res.data.status === 30202){
                                    var _this = this
                                   this.$msgbox({
                                    title: '暂存失败',
                                    type: 'error',
                                    message:  res.data.message,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                  }).then((val) =>{
                                        _this.$router.replace({ path: 'edit',query:{id: res.data.result} })
                                        _this.$refs.tab2.$refs.tableDebitType.resetActionLog()
                                        _this.$refs.tab2.$refs.tableDebitType.reloadTable()
                                        _this.$refs.tab4.$refs.tableDebitType.resetActionLog()
                                        _this.$refs.tab4.$refs.tableDebitType.reloadTable()
                                        _this.$refs.tab5.$refs.tableDebitType.resetActionLog()
                                        _this.$refs.tab5.$refs.tableDebitType.reloadTable()
                                        _this.$refs.tab6.$refs.tableDebitType.resetActionLog()
                                        _this.$refs.tab6.$refs.tableDebitType.reloadTable()
                                        _this.$refs.tab7.$refs.tableDebitType.resetActionLog()
                                        _this.$refs.tab7.$refs.tableDebitType.reloadTable()
                                        _this.initBaseInfo(res.data.result);
                                        _this.activeTabName = 'tab5'
                                   })
                                    this.id = res.data.result
                                }else{
                                    this.$msgbox({
                                        title: '暂存失败',
                                        type: 'error',
                                        message:  res.data.result || res.data.message,
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                }
                            }).catch( (res) =>{
                            this.$refs['toolbar'].unDisableBySymbol(button);
                            this.$msgbox({
                                    title: '暂存失败',
                                    type: 'error',
                                    message: '服务器未知错误，请重试!',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                            })
                    })
                    }

               })
            })
        },
        otherValidate(){
          var that = this
           return new Promise(function(resolve, reject) {
                    that.$refs.tab3.validate(that.tab2Validate)
                    that.otherValidateResChange=function(){
                        if(that.otherValidateRes){
                            resolve(true);
                        }
                    }
                })
        },
        tab2Validate(type){
            if(type){
               this.$refs.tab2.validate(this.tab4Validate)
            }else{
                this.activeTabName = 'tab3'
                this.otherValidateRes = false
            }
        },
        tab4Validate(type){
            if(type){
                this.$refs.tab4.validate(this.tab5Validate)
            }else{
                this.activeTabName = 'tab2'
                var that = this
                setTimeout(function(){
                    that.$refs.tab2.$refs.tableDebitType.$refs.table.doLayout()
                }, 100)
                this.otherValidateRes = false
            }
        },
        tab5Validate(type){
            if(type){
                this.$refs.tab5.validate(this.tab6Validate)
            }else{
                this.activeTabName = 'tab4'
                var that = this
                 setTimeout(function(){
                    that.$refs.tab4.$refs.tableDebitType.$refs.table.doLayout()
                }, 100)
                 this.otherValidateRes = false
            }
        },
        tab6Validate(type){
            if(type){
                this.$refs.tab6.validate(this.tab7Validate)
            }else{
                this.activeTabName = 'tab5'
                var that = this
                setTimeout(function(){
                    that.$refs.tab5.$refs.tableDebitType.$refs.table.doLayout()
                }, 100)
                this.otherValidateRes = false
            }
        },
        tab7Validate(type){
            if(type){
                this.$refs.tab7.validate(this.tab8Validate)
            }else{
                var that = this
                setTimeout(function(){
                    that.$refs.tab6.$refs.tableDebitType.$refs.table.doLayout()
                },100)
                this.activeTabName = 'tab6'
                this.otherValidateRes = false
            }
        },
        tab8Validate(type){
            if(!type){
                this.activeTabName = 'tab7'
                var that = this
                setTimeout(function(){
                    that.$refs.tab7.$refs.tableDebitType.$refs.table.doLayout()
                },100)
                this.otherValidateRes = false
            }else{
                this.otherValidateRes = true
            }
        },
        otherValidateResChange(){

        },
        //表单数据处理
        formatFormData(){
            var ret = Object.assign({}, this.formData)
            ret.workStime = +Date.parse(ret.workStime).toString().slice(0, -3)
            ret.joinTime = +Date.parse(ret.joinTime).toString().slice(0, -3)
            ret.birthdate = +Date.parse(ret.birthdate).toString().slice(0, -3)
            return ret
        },
        mkCreaterData(){
            let baseData = this.formatFormData();
            baseData.createUser = Cookie.get('t8t-tc-uid')
            return {
                workerBase:Object.assign(this.$refs.tab3.mkRquestData(), baseData),
                workerEmergency:this.$refs.tab4.getDataForCreater(),
                workerIdentity:this.$refs.tab2.getDataForCreater(),
                workerAttach:this.$refs.tab6.getDataForCreater(),
                workerBankAccount:this.$refs.tab5.getDataForCreater(),
                workerFrozen:this.$refs.tab7.getDataForCreater()
            }
        },
        mkUdpData(){
            let baseData = this.formatFormData();
            baseData.updateUser = Cookie.get('t8t-tc-uid')
            return {
                workerBase:Object.assign(this.$refs.tab3.mkRquestData(), baseData),
                workerEmergency:this.$refs.tab4.getDataForUpd(),
                workerIdentity:this.$refs.tab2.getDataForUpd(),
                workerAttach:this.$refs.tab6.getDataForUpd(),
                workerBankAccount:this.$refs.tab5.getDataForUpd(),
                workerFrozen:{addList:this.$refs.tab7.getDataForCreater()}
            }
        },
        initBaseInfo(id){
           let args = {base:{id:id},page:1,size:1,sort:[]}
           api.getBaseInfoById(args).then((res) => {
                if(res.data.status == 200){
                     let data = res.data.result.rows[0] ? res.data.result.rows[0] : {}
                        this.formData.id = data.id
                        this.formData.workerName = data.workerName
                        this.formData.workerSex = data.workerSex
                        this.formData.subOrgId = data.subOrgId && data.subOrgId > 0 ? data.subOrgId : null
                        this.formData.isProjectManager = data.isProjectManager
                        this.formData.payManagerId = data.payManagerId && data.payManagerId > 0 && data.subOrgId ? data.payManagerId : null
                        this.formData.workStime = data.workStime
                        this.formData.joinTime = data.joinTime
                        this.formData.idCard = data.idCard
                        this.formData.birthdate = data.birthdate
                        this.formData.phoneDecode = data.phoneDecode
                        this.formData.workStime = this.formData.workStime ? new Date(this.formData.workStime * 1000) : null;
                        this.formData.joinTime = this.formData.joinTime ? new Date(this.formData.joinTime * 1000) : null;
                        this.formData.birthdate = this.formData.birthdate ? new Date(this.formData.birthdate * 1000) : null;
                        this.formData.phone_org = this.formData.phoneDecode
                        this.formData.workerStatus = data.workerStatus
                        this.formData.processId = data.processId
                }
           })
        },
       set_optionsSubOrg(){
             let args = {"search":{"typeCode":'001003006'}}
            return api.organizationQuery(args).then((res) => {
                      if (res.data.status === 200) {
                            this.options_subOrgId = []
                              res.data.result.rows.forEach((item) => {
                                if(item.isDel != 1){
                                       this.options_subOrgId.push({
                                            value: item.id,
                                            label: item.name
                                       })
                                  }
                              })

                          }
             })
       },
       set_payManager(){
            this.options_payManagerId = []
            if(this.formData.subOrgId){
                let args = {subOrgId: this.formData.subOrgId}
                api.queryUserBySubOrgAndRole(args).then((res) => {
                    if(res.data.status == 200){
                        res.data.result.forEach((item) => {
                             this.options_payManagerId.push({
                                            value: item.id,
                                            label: item.name
                                       })
                        })
                    }
                })

            }
       }
   }

};
</script>

<style lang="css" scoped>
    .t8t-full-dialog{

    }
    .date-editor_time{
        width: 180px;
    }
    .foremanworker_edit .child_tab{
        display: flex;
        flex: 1;
    }
    .foremanworker_edit .child_tab div{
        display: flex;
        flex: 1;
    }
</style>
<style>
        .foremanworker .isProjectManager .el-form-item__label{
        width: 121px !important;
    }
    .t8t-full-dialog .el-dialog__header{
        padding: 0;
    }
    .t8t-full-dialog .el-dialog__body{
        padding: 0;
        height: 100%;
    }
    .t8t-full-dialog .t8t-full-dialog-container{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .t8t-full-dialog .full-dialog-tabs-container{
        flex: 1;
        margin-bottom: 20px;
    }
    .t8t-full-dialog .full-dialog-toolbar-container{
        height: 38px;
        background-color: #1e3046;
    }
    .t8t-full-dialog .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }
    .t8t-full-dialog .toolbar-container .toolbar-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .t8t-full-dialog .toolbar-container .toolbar-button:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }
    .t8t-full-dialog .container-center{
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }
    .t8t-full-dialog .el-form{
        display: flex;
        flex-wrap: wrap;
    }
    .t8t-full-dialog .form-item-container{
        width: 25%;
    }
    .t8t-full-dialog .full-dialog-form-container{
        margin-top: 22px;
    }
    .t8t-full-dialog .full-dialog-form-container .el-form-item__content{
        width: 180px;
    }
    .t8t-full-dialog .full-dialog-tabs-container{
        display: flex;
    }
    .t8t-full-dialog .el-tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .t8t-full-dialog .el-tabs__header{
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }
    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar{
        height: 1px;
    }
    .t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }
    .t8t-full-dialog .el-tabs__nav-wrap{
        width: 1220px;
        margin: 0 auto;
    }
    .t8t-full-dialog .el-tabs__content{
        flex: 1;
        display: flex;
    }
    .t8t-full-dialog .el-tab-pane{
        flex: 1;
        overflow: auto;
    }
    .el-carousel__container .el-carousel__item{
        overflow:auto;
    }
</style>
