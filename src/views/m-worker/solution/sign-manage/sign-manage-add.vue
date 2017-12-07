<template>
    <div class="t8t-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new sign-manage-add-dialog" >
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <div>
                            <el-button @click="closeDialog()">返回</el-button>
                        </div>
                        <t8t-toolbar
                            class="t8t-dark"
                            @EDIT-SUBMIT="submit"
                            @PRINT="print"
                            @CANCEL="cancel"
                            @PREVIEW="preview"
                            :symbolList="symbolList"
                            :disabledSymbols="disabledSymbols"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <!-- 表单区 -->
                <div class="full-dialog-form-container container-center">
                    <!-- 卡片页 -->
                    <el-tabs v-model="mainActiveTab">
                        <el-tab-pane label="电子签" name="tab1" v-if="lineVisible">
                            <!-- 添加电子签表单 -->
                            <contract-form
                                ref="contractForm"
                                :isReadonly="isReadonly"
                            ></contract-form>
                        </el-tab-pane>
                        <el-tab-pane label="补录合同信息" name="tab2" v-if="offlineVisible">
                            <!-- 补充信息合同表单 -->
                            <complete-contract-form
                                ref="completeContractForm"
                                :isReadonly="isReadonly"
                            ></complete-contract-form>
                        </el-tab-pane>
                    </el-tabs>

                    <div class="form-item-container">
                        <el-form
                            label-position="right"
                            :model="uploadFormData"
                            label-width="110px"
                            :rules="uploadFormrRules"
                            ref="uploadForm"
                            v-if="uploadVisible"
                        >
                            <el-form-item label="合同图片：" prop="attachmentGalleryData">
                                <el-button size="small" @click="onClickAttachment">查看</el-button>
                                <el-upload
                                    ref="imgRef"
                                    :multiple="true"
                                    :action="attachmentConfig.uploadURL"
                                    :data="attachmentConfig.data"
                                    :on-remove="handleRemoveAttachment"
                                    :on-success="handleSuccessAttachment"
                                    :before-upload="handlebeforeUploadAttachment"
                                    accept="image/*"
                                    :list-type="picture"
                                    :file-list="attachmentGalleryData"
                                    style="display: inline">
                                    <el-button size="small">上传图片(不超过9张)</el-button>
                                </el-upload>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 作废合同 -->
        <el-dialog
            v-if="dialogVisible"
            :title="dialogTitle"
            v-model="dialogModel"
            @close="dialogClose"
        >
            <el-form
                label-position="right"
                :model="cancelFormData"
                label-width="110px"
                :rules="cancelFormrRules"
                ref="cancelForm"
            >
                <el-form-item label="作废原因" prop="remark">
                    <el-input type="textarea" v-model.trim="cancelFormData.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelOKClick" type="primary" :loading="isLoading">确定</el-button>
                <el-button @click="dialogClose">取消</el-button>
            </div>
        </el-dialog>
        <!-- 补充协议 -->
        <complement-agreement
            v-show="false"
            id="complementAgreement"
            class="complement-agreement"
            :projectId="projectId"
            :contractCode="contractCode"
            :ownerPhone="ownerPhone"
            :projectAddress="projectAddress"
        ></complement-agreement>
        <!-- 查看合同图片 -->
        <t8t-gallery
            v-model="attachmentGalleryVisible"
            :data="attachmentGalleryDatas"
        ></t8t-gallery>
        <!-- 预览合同 -->
        <agreement-preview
            v-if="previewDialog"
            :contractNameId="contractNameId"
            :businessId="projectId"
            :contractId="contractId"
            @previewClose="previewClose"
        ></agreement-preview>
    </div>
</template>

<script>
    import contractForm from './contract-form.vue'
    import completeContractForm from './complete-contract-form.vue'
    import complementAgreement from './complement-agreement.vue'
    import agreementPreview from './agreenment-preview.vue'
    import Utils from 'src/utils/Utils.js'
    import commonApi from 'src/services/commonApi/commonApi.js'

    import Api from 'src/services/worker/solution/signManage.js'
    import { mb } from 'src/components/t8t-table/utils/utils.js'
    import Cookie from 'js-cookie'
    import DateUtils from 'src/utils/DateUtils.js'

    // 合同名称编码
    const CONTRACT_NAME_FATHER_CODE = '39104'
    // 合同名称--智享家
    const CONTRACT_NAME_CHILD_CODE = '06'

    export default {
        name: 't8t-dt-view',
        components: {
            contractForm,
            completeContractForm,
            complementAgreement,
            agreementPreview
        },
        data() {
            return {
                isDialogShow: true,
                goBackRoute: '/tuchat-worker/sign-manage',
                previewRoute: '/tuchat-worker/sign-manage/preview',
                mainActiveTab: 'tab1',
                id: null,
                projectId: null,
                tab: '',
                // 默认两个卡片页都显示
                lineVisible: true,
                offlineVisible: true,

                // 作废合同弹窗
                dialogVisible: false,
                dialogTitle: '作废合同',
                dialogModel: true,
                cancelFormData: {
                    remark: null
                },
                cancelFormrRules: {
                    remark: [
                        { required: true , message: "请填写作废原因", trigger: 'blur' },
                        { max: 255, message: "作废原因最多 255 个字", trigger: 'blur' },
                    ]
                },
                isLoading: false,

                // 附件信息
                attachmentGalleryVisible: false,
                attachmentGalleryData: [],
                attachmentGalleryDatas:[],
                // 附件路径
                attachmentConfig: {
                    uploadURL: Utils.getUploadURL(),
                    data: {bucket:'scm', module: 'worker/contract'}
                },
                uploadFormData: {attachmentGalleryData: null},
                uploadFormrRules: {
                    attachmentGalleryData: [
                        { type: 'array', required: true , message: "请上传合同图片", trigger: 'change' }
                    ],
                },
                uploadVisible: false,
                // 合同id
                contractId: null,
                // 合同名称id（取之辅助资料）
                contractNameId: null,
                // 合同状态
                state: null,
                // 线上签还是线下签 （signType）
                signType: null,
                // 合同编号
                contractCode: null,
                // 业主预留手机号
                ownerPhone: null,
                // 项目地址
                projectAddress: null,
                isReadonly: false,

                // 预览合同图片
                previewDialog: false,
                pewviewType: null,

                // 防重复提交
                disabledSymbols: []
            }
        },
        computed: {
            symbolList () {
                let btns = []
                switch (this.state) {
                    case 1:
                        btns = ['EDIT-SUBMIT', 'PRINT', 'CANCEL']
                        if (this.signType == 1) {
                            btns.push('PREVIEW')
                        }
                        break
                    default:
                        btns = ['EDIT-SUBMIT']
                        break
                }
                return btns
            },
        },
        created() {
            this.id = this.$route.query.id
            this.tab = this.$route.query.tab ? this.$route.query.tab : 'unsign'
            this.getContractNameId()
            this._initFormData()
        },
        methods: {
            // 关闭弹窗
            closeDialog()
            {
                let tab = this.$route.query.tab
                this.$router.push({
                    path: this.goBackRoute,
                    query: {
                        tab: tab
                    }
                })
            },
            // 提交
            submit()
            {
                this.$TCS.addTag('erp_scm_018003007001');
                if (this.uploadVisible && this.contractId) {
                    // 上传合同图片
                    this.uploadAgreementPic()
                }
                else {
                    if (this.mainActiveTab === 'tab1') {
                        // 提交电子签合同
                        this.contractFormSubmit()
                    }
                    else if (this.mainActiveTab === 'tab2') {
                        // 线下补录合同信息，生成代签合同
                        this.completeContractFormSubmit()
                    }
                }
            },
            // 电子签信息提交
            contractFormSubmit()
            {
                const contractFormRef = this.$refs.contractForm
                contractFormRef.$refs['form'].validate(value => {
                    if (value) {
                        this.disabledSymbols = ['EDIT-SUBMIT']
                        let formData = {...contractFormRef.formData}
                        if (formData.completionDate < formData.startDate) {
                            this.$message.error('竣工日期不能小于开工日期')
                            return
                        }
                        const args = {
                            contractInfo: {
                                replaceFields: {
                                    agentPhone: formData.agentPhone,
                                    address: formData.address,
                                    designerPhone: formData.designerPhone,
                                    agentIdNumber: formData.agentIdNumber,
                                    paymentMode: formData.paymentMode,
                                    contractOffer: formData.contractOffer,
                                    constructionPeriod: formData.constructionPeriod,
                                    drawOption: formData.drawOption,
                                    agentName: formData.agentName,
                                    ownerEmail: formData.ownerEmail,
                                    valuationArea: formData.valuationArea,
                                    projectAddress: formData.projectAddress,
                                    projectDesigner: formData.projectDesigner,
                                    completionDate: formData.completionDate ? DateUtils(formData.completionDate.getTime(), 'isoDate') : '',
                                    picDueTime: formData.picDueTime ? DateUtils(formData.picDueTime.getTime(), 'isoDate') : '',
                                    startDate: formData.startDate ? DateUtils(formData.startDate.getTime(), 'isoDate') : '',
                                },
                                authInfoDTO: {
                                    reservedMobile: formData.reservedMobile,
                                    realName: formData.realName,
                                    identity: formData.identity,
                                    bankCardNumber: formData.bankCardNumber,
                                    uid: formData.ownerId
                                },
                                id: this.id,
                                townId : formData.townIdArray[2] ||0,
                                cityId : formData.townIdArray[1] ||0,
                                estateId : formData.estateId,
                                projectId: this.projectId
                            },
                        }
                        Api.createContract(args)
                            .then((res) => {
                                this.disabledSymbols = []
                                if (res.data.status === 200) {
                                    if (res.data.result.success) {
                                        this.previewDialog = true
                                    }
                                    else {
                                        this.$msgbox(mb(res.data.result.reason, 'error'))
                                    }
                                } else {
                                    this.$msgbox(mb(res.data.message, 'error'))
                                }
                            })
                            .catch(err => {
                                console.log(err)
                                this.disabledSymbols = []
                            })
                    }
                })
            },
            // 补充合同信息提交
            completeContractFormSubmit()
            {
                const completeContractForm = this.$refs.completeContractForm || {}
                completeContractForm.$refs['form'].validate(value => {
                    if (value) {
                        this.disabledSymbols = ['EDIT-SUBMIT']
                        let formData = {...completeContractForm.formData}
                        if (formData.completionDate < formData.startDate) {
                            this.$message.error('竣工日期不能小于开工日期')
                            return
                        }

                        const args = {
                            contractOfflineDTO: {
                                replaceFields: {
                                    agentPhone: formData.agentPhone,
                                    address: formData.address,
                                    designerPhone: formData.designerPhone,
                                    agentIdNumber: formData.agentIdNumber,
                                    contractOffer: formData.contractOffer,
                                    constructionPeriod: formData.constructionPeriod,
                                    agentName: formData.agentName,
                                    valuationArea: formData.valuationArea,
                                    projectAddress: formData.projectAddress,
                                    projectDesigner: formData.projectDesigner,
                                    completionDate: formData.completionDate ? DateUtils(formData.completionDate.getTime(), 'isoDate') : '',
                                    startDate: formData.startDate ? DateUtils(formData.startDate.getTime(), 'isoDate') : '',
                                    ownerName: formData.realName,
                                    ownerPhone: formData.reservedMobile
                                },
                                townId : formData.townIdArray[2] ||0,
                                cityId : formData.townIdArray[1] ||0,
                                estateId : formData.estateId,
                                uid: formData.ownerId,
                                id: this.id,
                                projectId: this.projectId
                            },
                        }

                        Api.complementContractInfo(args)
                            .then((res) => {

                                this.disabledSymbols = []
                                if (res.data.status === 200) {
                                    if (res.data.result.success) {
                                        this.$msgbox(mb('合同创建成功', 'success'), () => {
                                            window.location.reload()
                                        })
                                    }
                                    else {
                                        this.$msgbox(mb(res.data.result.reason, 'error'))
                                    }
                                } else {
                                    this.$msgbox(mb(res.data.message, 'error'))
                                }
                            })
                            .catch(err => {
                                console.log(err)
                                this.disabledSymbols = []
                            })
                    }
                })
            },
            // 上传合同合同确认 更改合同状态为
            uploadAgreementPic()
            {
                console.log(this.uploadFormData)
                let contractUrl=[];
                Object.keys(this.uploadFormData.attachmentGalleryData).forEach(item => {
                    contractUrl.push(this.uploadFormData.attachmentGalleryData[item].path)
                })
                this.uploadFormData.attachmentGalleryData =contractUrl
                this.$refs.uploadForm.validate( value => {

                    if (value) {
                        this.disabledSymbols = ['EDIT-SUBMIT']

                        if (contractUrl.length == 0) {
                            this.$message.error('请上传合同图片')
                            return
                        }
                        let args = {
                            dto: {
                                id: this.contractId,
                                contractUrl: contractUrl,
                                uid: Cookie.get('t8t-tc-uid'),
                                projectId: this.projectId,
                                quotesId: this.id
                            }
                        }

                        Api.confirmOfflineSign(args)
                            .then(res => {
                                this.disabledSymbols = []
                                this.dialogTips(res, '上传成功')
                            })
                            .catch(err => {
                                console.log(err)
                                this.disabledSymbols = []
                            })
                    }
                })
            },
            // 弹窗提示
            dialogTips(res, msg = '操作成功')
            {
                if (res.data.status === 200) {
                    this.$msgbox(mb(msg, 'success'), () => {
                        this.closeDialog()
                    })
                } else {
                    this.$msgbox(mb(res.data.message, 'error'))
                }
            },
            // 初始化表单数据
            _initFormData()
            {
                // 如果有报价单id
                if (this.id) {
                    this.getContractInfo()
                        .then(res => {
                            if (res.data.status === 200) {
                                this.id = res.data.result && res.data.result.contractVO.id
                                this.projectId = res.data.result && res.data.result.contractVO.yid
                                this.state = res.data.result.state
                                // state 0 未签约 1 待签约
                                if (res.data.result.state === 0) {
                                    // 电子签合同信息
                                    let contract = res.data.result.contractVO || {}
                                    // 回显到电子签
                                    let formData = {
                                        realName: contract.owner,
                                        contractOffer: contract.totalPrice + '',
                                        valuationArea: contract.area + '',
                                        ownerId: contract.ownerId,
                                    }
                                    this.$refs.contractForm.formData = { ...this.$refs.contractForm.formData, ...formData }
                                    this.$refs.completeContractForm.formData = { ...this.$refs.completeContractForm.formData, ...formData }
                                }
                                else if (res.data.result.state === 1) {
                                    return res.data.result
                                }
                            }
                        })
                        // 处理待签约
                        .then(res => {
                            if (res && res.state === 1) {
                                this.isReadonly = true
                                const replaceFields = res.replaceFields || {}
                                // 显示上传图片按钮
                                this.uploadVisible = true
                                // 合同ID
                                this.contractId = res.contractId
                                this.contractCode = res.replaceFields.contractCode
                                this.projectAddress = replaceFields.projectAddress
                                this.ownerPhone = this.replacePhone(replaceFields.ownerPhone)

                                window.document.title = '签约管理--编辑 - 土巴兔ERP管理系统'

                                replaceFields.realName = replaceFields.ownerName
                                replaceFields.reservedMobile = this.ownerPhone
                                replaceFields.identity = replaceFields.ownerIdNumber
                                replaceFields.bankCardNumber = replaceFields.virtualCards

                                // 判断是线上还是线下签 signType 1 线上  2 线下
                                this.signType = res.signType
                                if (res.signType === 1) {
                                    // 电子签
                                    this.mainActiveTab = 'tab1'
                                    this.lineVisible = true
                                    this.offlineVisible = false
                                    this.$refs.contractForm.formData = { ...this.$refs.contractForm.formData, ...replaceFields }
                                }
                                else if (res.signType === 2) {
                                    // 补录合同信息
                                    this.mainActiveTab = 'tab2'
                                    this.lineVisible = false
                                    this.offlineVisible = true
                                    this.$refs.completeContractForm.formData = { ...this.$refs.completeContractForm.formData, ...replaceFields }
                                }
                            }
                        })
                }
            },
            // 通过报价单id获取合同信息 判断是否已发起合同、线上还是线下
            getContractInfo()
            {
                let args = {
                    id: this.id
                }
                return Api.contractDetail(args)
            },
            // 打印补充协议
            print()
            {
                // 合同编码为空
                if (!this.contractCode) {
                    this.$message.error('请先提交合同信息')
                    return
                }
               this.printAgreement()
            },
            //
            printAgreement()
            {
                //打开新窗口
                let newWindow = window.open("_blank")
                let headstr = "<html><head><title>打印补充协议</title></head><body>"
                let footstr = "</body>"
                //获取需要生成pdf页面的div代码
                let contentstr = document.getElementById("complementAgreement").innerHTML;
                let htmlStr = headstr + contentstr + footstr
                //向文档写入HTML表达式或者JavaScript代码
                newWindow.document.write(htmlStr)
                //关闭document的输出流, 显示选定的数据
                newWindow.document.close()
                //打印当前窗口
                newWindow.print()
                newWindow.close()
                return true;
            },
            // 关闭窗口
            dialogClose()
            {
                this.dialogVisible = false
            },
            // 作废接口
            cancel()
            {
                if (this.state !== 1) {
                    this.$message.error('只有待签约状态的合同可以作废')
                    return
                }
                this.dialogVisible = true
                this.dialogModel = true
            },
            // 确认作废
            cancelOKClick()
            {
                this.$refs['cancelForm'].validate( value => {
                    if (value) {
                        let args = {
                            id: this.contractId,
                            remark: this.cancelFormData.remark,
                            uid: Cookie.get('t8t-tc-uid')
                        }
                        Api.cancel(args)
                            .then( res => {
                                this.dialogTips(res, '作废成功')
                            })
                    }
                })
            },
            // 查看上传的图片
            onClickAttachment () {
                let _list = []
               console.log(this.attachmentGalleryData)
                let max=0
                Object.keys(this.attachmentGalleryData).forEach(item => {
                    max++
                    if(max <= 9){
                        _list.push({title:this.attachmentGalleryData[item].title, src: Utils.getFullURL(this.attachmentGalleryData[item].path)})
                    }
                })
                this.attachmentGalleryDatas = _list
                this.attachmentGalleryVisible = true
            },
            // 移除附件
            handleRemoveAttachment(res, file,fileList) {
                let _list = this.attachmentGalleryData.filter(item => {
                    return item.name === file.name
                })
                if(_list.length > 0) {
                    delete this.attachmentGalleryData[this.attachmentGalleryData.indexOf(_list[0])]
                }
//                let _file = this.attachmentGalleryData.filter(i => {
//                    return i.name === res.name;
//                })
//                console.log(this.attachmentGalleryData)
//                let _list = this.attachmentGalleryData
//
//                _list.splice(this.attachmentGalleryData.indexOf(_file[0]),1);
//                this.uploadFormData.attachmentGalleryData = _list
//                this.$set(this.uploadFormData, 'attachmentGalleryData', _list)
            },
            // 附件上传成功(图片)
            handleSuccessAttachment(res, file,fileList) {
                console.log(res)
                console.log(fileList)
                if(res.status === 200 ){
                    let i = {
                        title: res.result.id,
                        name: file.name,
                        src: Utils.getFullURLById(res.result.id),
                        path: res.result.filePath
                    }
                    this.attachmentGalleryData[res.result.id] = i
                    this.uploadFormData.attachmentGalleryData = this.attachmentGalleryData
                    this.$set(this.uploadFormData, 'attachmentGalleryData', this.attachmentGalleryData)
                }else if(res.status === 613){
                    this.$refs['imgRef'].clearFiles()
                    this.$message.error('请检查图片后缀(小写)！')
                }
                if(fileList.length > 9){
                    this.$message.error('图片超过9张！！')
                    fileList.pop()
                }

            },
            // 附件上传前
            handlebeforeUploadAttachment(file){
                if(file.size > 1024*1024*10){
                    this.$message.error('图片大小超过10M！')
                    this.$refs['imgRef'].clearFiles()
                    return false
                }
            },
            // 获取合同名称ID
            getContractNameId()
            {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: CONTRACT_NAME_FATHER_CODE
                    },
                    size: 100
                }
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyCode === CONTRACT_NAME_CHILD_CODE) {
                                    // 合同名称ID
                                    this.contractNameId = item.id
                                }
                            })
                        }
                    })
            },
            // 预览合同
            preview()
            {
                if ( this.state == 0 ) {
                    this.$message.error('未生成合同，请先提交合同信息')
                    return
                }
                this.previewDialog = true
            },
            // 预览合同关闭事件
            previewClose(flag)
            {
                if (flag) {
                    window.location.reload()
                }
                this.previewDialog = false
            },
            // 替换手机号码中间四位为*
            replacePhone(str)
            {
                if (str && str.length > 7) {
                    let arr = str.split('')
                    arr.splice(3,4,"****")
                    return arr.join('')
                }
                else {
                    return ''
                }
            },
        }
    }
</script>

<style lang="css" scoped>
    /*.full-dialog-form-container {*/
    /*position: relative;*/
    /*}*/
</style>

<style>
    .full-dialog-form-container,.container-center {
        padding-top: 60px;
    }
    .t8t-table,.t8t-table-container,.normal {
        height: 400px;
    }
    #complementAgreement {

    }
    .sign-manage-add-dialog .toolbar-container .el-button {
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .sign-manage-add-dialog .toolbar-container .el-button:hover {
        color: #1e3046;
        background-color: #d2deeb;
    }
</style>
