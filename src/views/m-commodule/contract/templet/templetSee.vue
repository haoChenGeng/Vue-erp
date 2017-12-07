<template>
    <!-- 新增 -->
    <div>
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="templet-see-t8t-full-dialog t8t-full-dialog">
        <div class="t8t-full-dialog-container">
            <!-- 顶部按钮区 -->
            <div class="full-dialog-toolbar-container">
                <div class="toolbar-container">
                </div>
            </div>
            <!-- 表单区 -->
            <div class="full-dialog-form-container container-center">
                <el-form :model="hFormData"  ref="formRef" label-position="right" label-width="120px">
                    <div class="form-item-container">
                        <el-form-item label="业务类型：" prop="templetType">
                            <el-input v-model="hFormData.businessType" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="合同名称：" prop="templetName">
                            <el-input v-model="hFormData.contractName" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="单据名称：" prop="billName">
                            <el-input v-model="hFormData.billName" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="组织：" prop="templetOrganize">
                            <el-input v-model="hFormData.organize" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="编码规则：" prop="templetCode">
                            <el-input v-model="hFormData.codeRule" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="属性：" prop="templetProperty">
                            <el-input v-model="hFormData.contractKind" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="类型：" prop="receiptStyle">
                           <el-input v-model="hFormData.contractType" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container" v-if="(this.styleValue=='02')||(this.styleValue=='03')||(this.styleValue=='04')">
                        <el-form-item label="甲方：" prop="receiptFirst">
                            <el-input v-model="hFormData.firstRoleStr" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container" v-if="(this.styleValue=='03')||(this.styleValue=='04')">
                        <el-form-item label="乙方：" prop="receiptSecond">
                            <el-input v-model="hFormData.secondRoleStr" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container" v-if="(this.styleValue=='04')">
                        <el-form-item label="丙方：" prop="receiptThird">
                            <el-input v-model="hFormData.thirdRoleStr" disabled></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <!-- 标签页区 -->
            <div class="full-dialog-tabs-container">
                <el-tabs v-model="activeTabName" @tab-click="handleClick">
                    <el-tab-pane label="基本信息" name="one" class="tableDebitType">
                            <div class="my-container">
                                <t8t-toolbar
                                    @VERSION-OVERLAY="version"
                                    @DISABLE="disable"
                                    @ANTI-DISABLE="nodisable"
                                    @fileUpload = "fileUpload"
                                    @fileDownload = "fileDownload"
                                >
                                </t8t-toolbar>
                                <t8t-table
                                        ref="t8ttable"
                                        :columns="columns"
                                        :selectCol="true"
                                        :args="argsBasic"
                                        :service="serviceBasic"
                                        :method="methodBasic"
                                        :expandCol = "true"
                                    >
                                    <template slot="expand" scope="props">
                                        <div class="expandBox">
                                            <div class="firstPosition" v-for="(item,k,$index) in props.row.signPositionJSON ">
                                            <span class="ruleTitle">{{$index | nameList }}方位置信息：</span>
                                            <span class="positionm">页码：{{item.pagenum}}</span>
                                            <span class="positionm">X轴：{{item.pageX}}</span>
                                            <span class="positionm">Y轴：{{item.pageY}}</span>
                                            </div>
                                            <div class="rule" v-for="(item,index) in props.row.ruleList ">
                                            <span class="ruleTitle">规则{{index+1}}</span>
                                            <span class="rulename">名称：{{ typeof item.parentName ==='undefined'? '':item.parentName }}</span>
                                            <span class="rulename">内容：{{ typeof item.name ==='undefined'? '':item.name}}</span>
                                            <span class="rulename">描述：{{typeof item.description ==='undefined'? '':item.description}}</span></div>
                                        </div>
                                    </template>

                                </t8t-table>
                            </div>
                    </el-tab-pane>
                    <el-tab-pane label="字库" name="two" class="removeLog" >
                        <div class="my-container">
                            <div class="my-toolbar">
                                <el-button
                                    type="primary"
                                    size="small"
                                    icon="plus"
                                    @click="addWord()"
                                >新增字段</el-button>
                            </div>
                            <t8t-table
                                ref="zikutable"
                                :columns="wordColumns"
                                :service="wordService"
                                :method="wordMethod"
                                :selectCol="false"
                                :args="wordArgs"
                                :commonData="selectSource"
                            >
                            </t8t-table>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </el-dialog>
    <version-dialog
        v-if="versionVisible"
        @close="versionVisible=false"
        :basicId = "basicId"
        :firstRoleId = "firstRoleId"
        :secondRoleId = "secondRoleId"
        :thirdRoleId = "thirdRoleId"
        :contractTypeId = "contractTypeId"
        @success="getTableData"
    >
    </version-dialog>
    <el-dialog title="新增字段" v-model="addDialog" @close="closeAddDialog" ref="addDialogRef">
            <div class="textarea-container">
                <el-input type="text" v-model="addText"  placeholder="请输入字段"></el-input>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="onAddBtn" :loading="isLoading">确认</el-button>
                <el-button @click="closeAddDialog">关闭</el-button>
            </div>
    </el-dialog>
    <el-dialog title="附件上传" v-model="uploadDialog" @close="closeUploadDialog" ref="uploadDialogRef">
                <el-form ref="formUpload" :rules="uploadRule" :model="formData">
                <div class="fileDiv">
                    <div class="form-item-container">
                            <el-form-item label="附件：" prop="versionUrl">
                                <el-upload
                                     ref="imgRef"
                                    :action="uploadURL"
                                    :data="{bucket:'scm', module: 't8t-esm/commodule'}"
                                    :show-file-list="true"
                                    :on-remove="handleRemove"
                                    :on-success="handleSuccess"
                                    :before-upload="beforeAvatarUpload"
                                    v-model="formData.versionUrl"
                                    >
                                    <el-button size="small">上传文件</el-button>
                                </el-upload>
                            </el-form-item>

                    </div>
                </div>
                </el-form>
                <div slot="footer">
                    <el-button type="primary" @click="onUploadBtn" :loading="isLoading">确认</el-button>
                    <el-button @click="closeUploadDialog">关闭</el-button>
                </div>

    </el-dialog>

    </div>
</template>

<script>

import commonApi from 'src/services/commonApi/commonApi.js'
import VersionDialog from './version-dialog.vue'
import Service from 'src/services/commodule/Service.js'
import apiTempletSee from 'src/services/commodule/templet.js'
import Cookie from 'js-cookie'
import Utils from 'src/utils/Utils.js'
import download from 'src/utils/download.js'
export default {

    name: 'templetSee',
    components: {
        VersionDialog
    },
    data () {
        return {
            isDialogShow: true,
            activeTabName: 'one',
            dialogVisible: false,
            versionVisible: false,
            uploadDialog:false,
            basicId: null,
            firstRoleId:null,
            secondRoleId:null,
            thirdRoleId:null,
            addDialog:false,
            contractTypeId:null,
            hFormData: {},
            formData:{
                versionUrl:null,
            },
            wordColumns:[],
            expandColumns:[],
            addText:'',
            styleValue:null,
            fileName:null,
            fileNum:0,
            isLoading: false,
            uploadURL: Utils.getUploadURL(),
            uploadRule:{
                versionUrl: [{ required: true, message: '请上传附件'}],
            },
            selectSource: {
                    nameList:{},
                    trafficStatus:[{
                        text: '√',
                        value: 1
                    },{
                        text: '×',
                        value: 0
                    }],
                },
            columns: [{
                    prop: 'id',
                    label: '序号',
                }, {
                    prop: 'version',
                    label: '版本',
                }, {
                    prop: 'description',
                    label: '描述',
                }, {
                    prop: 'overTime',
                    label: '超时作废周期',
                    formatter:this.fmtInvalidTime,
                }, {
                    prop: 'stateStr',
                    label: '状态',
                }, {
                    prop: 'useTimeStr',
                    label: '启用时间',
                }, {
                    prop: 'createUserStr',
                    label: '添加人',
                },{
                    prop: 'createTimeStr',
                    label: '添加时间',
                }, {
                    prop: 'addName',
                    label: '附件名称',
                    width:350
                }],
            //请求参数配置
                wordService:Service.TEMPLETRECORD.name,
                wordMethod:Service.TEMPLETRECORD.methods.REPLACE_GET_CONTENT,
                wordArgs:{
                    basicId:parseInt(this.$route.query.rowId),

                },
                serviceBasic: Service.TEMPLETRECORD.name,
                methodBasic: Service.TEMPLETRECORD.methods.MODEL_VERSION_QUERY,
                argsBasic: {
                    search:{
                        basicId:parseInt(this.$route.query.rowId),
                    },
                },

        }
    },
    created() {
        let id = parseInt(this.$route.query.rowId)
        this.getFormData(id)
        this.getNameList('39103');
        this.isFileNum();
    },
    filters: {
        nameList:function(val){
            let name = val ;
            if(val==0)
            {
                name  = '甲'
            }else if(val == 1)
            {
                name  =  '乙'
            }else if( val == 2)
            {
                name  =  '丙'
            }
            return name
        },
    },
    methods: {
        fmtInvalidTime(val){
            return val + '天'
        },

        getNameList: function(fatherCode,code) {
            let arg =  {
                page: 1,
                search: {
                    pPropertyCode: fatherCode
                },
                size: 100
            }
            commonApi.queryUnionParent(arg)
            .then((res) => {
                if (res.data.status === 200) {
                    res.data.result.forEach((item) => {
                        if (item.propertyStatus===1) {
                            this.selectSource.nameList[item.id] = item.propertyCode
                        };
                    })
                    this.styleValue =  this.selectSource.nameList[code]

                }
            })
        },

        getTableData() {
                this.$refs['t8ttable'].reloadTable()
                this.handleClick()
                this.$refs['zikutable'].reloadTable()
            },
        submitForm(formRef) {
            var formFlag = false;
            var tableFlag = false;

        },
        closeDialog() {
            this.$router.push({path: '/tochat-commodule/templet'})
        },
        version()
        {
            this.versionVisible = true
            this.basicId = parseInt(this.$route.query.rowId)
            this.firstRoleId = this.hFormData.firstRoleId
            this.secondRoleId = this.hFormData.secondRoleId
            this.thirdRoleId = this.hFormData.thirdRoleId
            this.contractTypeId = this.hFormData.contractTypeId
        },
        //辅助资料
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
                                text: item.propertyName,
                            })
                        };
                    })
                    this.commonOptionsConfig[selectName] = list
                }
            })
        },
        //获取版本上面信息
        getFormData(rowId) {
            let args = {
                id: rowId
            }
            apiTempletSee.findById(args)
                .then((res) => {
                    if (res.data.status === 200) {
                        this.hFormData = res.data.result
                        this.getNameList('39103',this.hFormData.contractTypeId)
                    }
                })
        },

         //禁用
        disable(){
            // 单行判断
            if(this.checkSelection() === false) return false
             let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
            // 勾选数据不是启用
            if((selectRow.state !== 2) && (selectRow.state !== 1)) {
                this.$msgbox({
                    title: '消息',
                    type: 'warning',
                    message: '启用状态才能进行禁用操作',
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
                return false
            }else {
                // 禁用状态弹窗确认审核
                this.$confirm('确认将所选版本禁用？', '禁用确认', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                .then(() => {
                    // 点击确定按钮
                    var idsArr = [] ;
                    idsArr.push(selectRow.id)
                    let args = {
                        ids: idsArr,
                        state:3,
                    }
                    apiTempletSee.updateVersion(args)
                    .then((res) => {
                        if(res.data.status === 200 && res.data.result === 1){
                            // 成功弹窗
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '禁用成功',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.$refs['t8ttable'].reloadTable()
                        } else {
                            // 失败弹窗
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: '禁用失败，请重试。',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                        }
                    })
                })
                .catch(() => {
                    // 关闭弹窗
                })
            }
        },
        //反禁用
        nodisable(){
              // 单行判断
            if(this.checkSelection() === false) return false
             let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
            // 勾选数据不是禁用
            if(selectRow.state !== 3){
                this.$msgbox({
                    title: '消息',
                    type: 'warning',
                    message: '禁用状态才能进行启用操作',
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
                return false
            }else {
                // 待审核状态弹窗确认审核
                this.$confirm('确认将所选版本启用？', '启用确认', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                .then(() => {
                    // 点击确定按钮
                    var idsArr = [] ;
                    idsArr.push(selectRow.id)
                    let args = {
                        ids: idsArr,
                        state:2,
                    }
                    apiTempletSee.updateVersion(args)
                    .then((res) => {
                        if(res.data.status === 200 && res.data.result === 1){
                            // 成功弹窗
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '启用成功',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.$refs['t8ttable'].reloadTable()
                        } else {
                            // 失败弹窗
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: '启用失败，请重试。',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                        }
                    })
                })
                .catch(() => {
                    // 关闭弹窗
                })
            }
        },

        checkSelection() {
            let selections = this.$refs['t8ttable'].getSelectRows()
            if(selections.length===0){
                this.$message.error('请勾选记录后再试。')
                return false
            }else if(selections.length > 1){
                this.$message.error('请对单条数据进行操作。')
                return false
            }
            return true
        },
        handleClick(tab, event)
        {
            let args = {
                "basicId": this.$route.query.rowId
            }
            let list = []
            apiTempletSee.getTitle(args)
                .then((res) => {
                    if (res.data.status === 200) {
                        for(let k in  res.data.result.rows[0])
                        {
                            if(res.data.result.rows[0][k] == '版本')
                            {
                                list.push({
                                    prop: k,
                                    label: res.data.result.rows[0][k],
                                })
                            }else{
                                list.push({
                                    prop: k,
                                    label: res.data.result.rows[0][k],
                                    list:'trafficStatus'
                                })
                            }


                        }
                        this.wordColumns = list
                    }
                })

        },
        handleSuccess(file, fileList) {
            if(file.status === 200){
                this.fileNum ++
                this.formData.versionUrl = file.result.filePath
                this.$refs['formUpload'].validateField('versionUrl')
            }
            this.isFileNum()
        },

        beforeAvatarUpload(file)
        {

            this.fileName = file.name
            let strr = file.name
            let str = strr.substring(strr.lastIndexOf('.')+1)
            if( str !== 'docx')
            {
                this.$refs['imgRef'].clearFiles()
                this.$message.error('只能上传docx文件！')
            }
        },
        fileUpload()
        {
            // 单行判断
            if(this.checkSelection() === false) return false
            this.uploadDialog = true
        },
        fileDownload()
        {
            if(this.checkSelection() === false) return false
            let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
            download(selectRow.addUrl)

        },
        addWord()
        {
            this.addDialog = true
        },
        closeAddDialog()
        {
            this.addDialog = false
            this.addText = ''
            this.isLoading = false;
        },
        closeUploadDialog()
        {
            this.uploadDialog = false
            this.$refs['imgRef'].clearFiles()
            this.isLoading = false;
            this.$refs['formUpload'].resetFields();
            this.fileNum = 0;
        },
        onUploadBtn()
        {
            var formFlag = false;
            this.$refs['formUpload'].validate((isValid) => {
                if (isValid){
                    formFlag = true
                    this.isLoading = true
                    let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
                    let args = {
                        basicId : this.$route.query.rowId ,
                        versionId : selectRow.id,
                        version : selectRow.version,
                        addUrl : this.formData.versionUrl,
                        addName:this.fileName,
                    }
                    apiTempletSee.uploadAndWord(args)
                        .then((res) => {
                            if(res.data.status === 200 && res.data.result === 1){
                                // 操作成功
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '操作成功',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.closeUploadDialog()
                                this.$refs['t8ttable'].reloadTable()
                                this.handleClick()
                                this.$refs['zikutable'].reloadTable()
                            }else if(res.data.status === 200 && res.data.result === 2){

                                // 操作成功
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '提交成功但附件字段有问题',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.closeUploadDialog()
                                this.$refs['t8ttable'].reloadTable()

                            }else if(res.data.status === 200 && res.data.result === 3){

                                // 操作成功
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '提交成功,但附件中变量多于字库中变量，请检查词库后补充附件',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.closeUploadDialog()
                                this.$refs['t8ttable'].reloadTable()

                            }else if(res.data.status === 200 && res.data.result === -1){

                                // 操作成功
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '提交失败',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.closeUploadDialog()
                                this.$refs['t8ttable'].reloadTable()

                            }else{
                                // 操作失败
                                this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: res.data.message,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.closeUploadDialog()
                            }
                        })
                }

            })
        },
        onAddBtn()
        {
            let word = /\{|\}/g
            let addText = this.addText
            if(addText ===''){
                this.$message.warning('请输入字段')
            }else if(word.test(addText)){
                this.$message.error('字段不能包含{**}')
            }else{
                    this.isLoading = true
                    // 驳回
                    let args = {
                        contractreplace:{
                            createUser: +Cookie.get('t8t-tc-uid'),
                            basicId:parseInt(this.$route.query.rowId),
                            keyword: this.addText
                        }
                    }
                    apiTempletSee.createWord(args)
                    .then((res) => {
                        if(res.data.status === 200){
                            // 驳回成功
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '操作成功',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.closeAddDialog()
                            this.handleClick()
                            this.$refs['zikutable'].reloadTable()
                        }else{
                            // 驳回失败
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: res.data.message,
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.closeAddDialog()
                        }
                    })
                }
        },
        getCode(value)
        {
            if(value){
                this.styleValue = this.commonOptionsConfig.nameList[value]
            }
        },
        handleRemove(file, fileList)
        {
            if(file)
            {
                this.fileNum --
                this.$refs['formUpload'].resetFields();
            }
            this.isFileNum()
        },
        isFileNum()
        {
            if(this.fileNum >= 2){
                this.$refs['imgRef'].clearFiles()
                this.$message.error('只能上传一个文件！')
                this.fileNum = 0
            }
        }
    },

};
</script>

<style lang="css" scoped>
    .templet-see-t8t-full-dialog .my-container{
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 0 30px;
    }
    .templet-see-t8t-full-dialog .my-toolbar{
        margin-bottom: 15px;
    }
    .fileDiv .form-item-container
    {
        margin-left: 100px;
        width: 250px;
    }
    .textarea-container
    {
        width: 180px;
        margin-left: 100px;
    }
    .ruleTitle
    {
        font-weight: bold;
        color: #111;
        font-size: 13px;
    }
    .firstPosition
    {
        margin-top: 5px;
        margin-bottom: 20px;
    }
    .secondPosition
    {
        margin-top: 15px;
        margin-bottom: 25px;
    }
    .rule
    {
        margin-top: 15px;
    }
    .positionm
    {
        margin-left: 50px;
    }
    .rulename
    {
        margin-left: 105px;
        display: inline-block;
        width: 170px;
    }
    .rulename:last-child{
        width: 500px;
    }
</style>
<style>
    .templet-see-t8t-full-dialog .el-dialog__header{
        padding: 0;
    }
    .templet-see-t8t-full-dialog .el-dialog__body{
        padding: 0;
        height: 100%;
    }
    .templet-see-t8t-full-dialog .t8t-full-dialog-container{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .templet-see-t8t-full-dialog .full-dialog-tabs-container{
        flex: 1;
        display: flex;
        margin-bottom: 20px;
    }
    .templet-see-t8t-full-dialog .full-dialog-toolbar-container{
        height: 38px;
        background-color: #1e3046;
    }
    .templet-see-t8t-full-dialog .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        background-color: #1e3046;
    }
    .templet-see-t8t-full-dialog .toolbar-container .toolbar-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .templet-see-t8t-full-dialog .toolbar-container .toolbar-button:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }
    .templet-see-t8t-full-dialog .container-center{
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }
    .templet-see-t8t-full-dialog .el-form{
        display: flex;
        flex-wrap: wrap;
    }
    .templet-see-t8t-full-dialog .form-item-container{
        width: 25%;
    }
    .templet-see-t8t-full-dialog .full-dialog-form-container{
        margin-top: 22px;
    }
    .templet-see-t8t-full-dialog .full-dialog-form-container .el-form-item__content{
        width: 180px;
    }
    .templet-see-t8t-full-dialog .full-dialog-tabs-container{
        display: flex;
    }
    .templet-see-t8t-full-dialog .el-tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .templet-see-t8t-full-dialog .full-dialog-tabs-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .templet-see-t8t-full-dialog .el-tabs__header{
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }
    .templet-see-t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar{
        height: 1px;
    }
    .templet-see-t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }
    .templet-see-t8t-full-dialog .el-tabs__nav-wrap{
        width: 1220px;
        margin: 0 auto;
    }
    .templet-see-t8t-full-dialog .el-tabs__content{
        flex: 1;
        display: flex;
        width: 100%;
        height: 100%;
        position: relative;
    }
    .templet-see-t8t-full-dialog .el-tab-pane{
        display: flex;
        flex: 1;
        overflow: auto;
    }
    .templet-see-t8t-full-dialog .el-tab-pane {
        flex: none !important;
        width: 100% !important;
        height: 100% !important;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }

    .templet-see-t8t-full-dialog .el-tab-pane .t8t-toolbar {
        position: absolute;
        left: 30px;
        right: 30px;
        padding: 10px 0!important;
        margin: 0 auto!important;
    }

    .templet-see-t8t-full-dialog .el-tab-pane .t8t-toolbar .el-button--small {
        padding: 7px 9px!important;
        font-size: 12px;
    }

    .templet-see-t8t-full-dialog  .el-dialog .el-button--small {
        padding: 7px 9px!important;
        font-size: 12px;
    }

    .templet-see-t8t-full-dialog .t8t-table {
        /*width: 1200px;*/
        flex: none !important;
        margin: 0 auto;
        position: absolute;
        left: 30px;
        bottom: 30px;
        right: 30px;
    }

    .templet-see-t8t-full-dialog .t8t-table .pagenav-container {
        border: 1px solid #D3DDE6;
    }

    .templet-see-t8t-full-dialog .t8t-table .pagenav-container {
        border: 1px solid #D3DDE6;
    }

    .templet-see-t8t-full-dialog  .tableDebitType .t8t-table {
        top: 50px;
    }

    .templet-see-t8t-full-dialog  .removeLog .t8t-table{
        top: 50px;
    }

    .templet-see-t8t-full-dialog .t8t-table .table-container {
        margin-left: 0;
    }
</style>
