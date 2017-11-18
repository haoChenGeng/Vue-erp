<template>
    <div class="import-owner-dialog">
        <el-dialog title="" size="small" class="t8t-full-dialog2" v-model="addDialogVisible" @close="btnCancleClick">
            <div class="my-dialog2-container">
                <h1 class="my-title">批量创建业主</h1>
                <el-form :label-position="labelPosition"
                         :model="formData"
                         :label-width="formLabelWidth"
                         :rules="rules"
                         ref="addForm"
                         @keyup.enter.native="btnOKClick()">
                    <el-form-item label="">
                        温馨提示：导入文件信息的顺序是称呼、电话、房号、QQ；
                    </el-form-item>

                    <el-form-item label="区域" prop="townIdArray">
                        <t8t-division-old
                            :changeOnSelect="true"
                            :filterable="true"
                            :clearable="true"
                            v-model="formData.townIdArray"
                            :placeholder="选择区域"
                            @change="onDivisionChange"
                        >
                        </t8t-division-old>
                    </el-form-item>
                    <el-form-item label="楼盘" prop="estateId" class="import-owner-dialog-popup">
                        <el-col :span="22">
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
                                :icon="false"
                                @change="onChange"
                                @select="onSelect"
                            ></t8t-form-popup>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="跟进人" prop="auditId">
                        <el-col :span="22">
                            <el-select v-model="formData.auditId" placeholder="--请选择--">
                                <el-option v-for="item in flowUserList" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-col :span="22">
                            <el-upload
                                :data="params"
                                class="upload-demo"
                                :action="importURL"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :before-upload="handleBeforeUpload"
                                :on-success="handleSuccess"
                                :on-error="handleError"
                                :auto-upload="true"
                                ref="upload"
                                :file-list="fileList"
                            >
                                <el-button
                                    size="small" type="primary">选择上传文件
                                </el-button>
                                <div slot="tip" class="el-uplad__tip">注意：文件格式为xlsx文件，大小不超过16M；</div>
                            </el-upload>
                        </el-col>
                    </el-form-item>
                </el-form>
                <div class="my-button">
                    <el-button
                        type="primary"
                        @click="btnOKClick"
                        :loading="isLoading"
                    >确定</el-button>
                    <el-button
                        @click="btnCancleClick"
                    > 取消</el-button>
                </div>
            </div>

    </el-dialog>
    </div>
</template>
<script>
    import Cookie from 'js-cookie'
    import Utils from 'src/utils/Utils.js'
    import ServiceApi from 'src/services/salemanager/Service.js'
    import Status from 'src/status/salemanager/Status.js'
    import Service from 'src/services/salemanager/salemanager.js'

    export default {
        name: 'receipt-dialog',
        data() {
            return {
                params:{
                    columns:['appellation','phone','houseAddress','qq']
                },
                importURL: Utils.getImportURL(ServiceApi.SALES.name, ServiceApi.SALES.methods.VERIFY_IMPORT_ORDER),
                importTableData:[],
                labelPosition: 'right',
                formLabelWidth: '80px',
                isLoading:false,
                addDialogVisible:true,
                formData:{
                    townIdArray: [],
                    estateId: null,
                    auditId: null,
                    fileList:null,
                    createUser: Cookie.get('t8t-tc-uid'),
                },
                item: {
                    label: '楼盘名称',
                    name: 'estateId', //需要传递给后台查询的数据
                    textValue: 'sname',  //需要展示出来的名称
                    filedValue: 'id',    //选中那条数据的ID
                    //自动补全
                    remote: true,
                    service: ServiceApi.SALES.name,
                    method: ServiceApi.SALES.methods.QUERY_ESTATE_PAGE,
                    remoteQueryKey: "estateName",
                    remoteArgs: {
                        page: 1,
                        size: 10
                    }
                },
                rules: {
                    townIdArray:[
                        {
                            required: true,
                            validator: (rule, value, callback) => {
                                if(value.length > 2) {
                                    callback()
                                }else{
                                    callback(false)
                                }
                            },
                            message: '请选择业主所住区域',
                        },
                    ],
                    estateId: [
                        {
                            required: true,
                            message: '请选择楼盘',
                        },
                    ],
                    auditId: [
                        {
                            required: true,
                            message: '请选择跟进人',
                        },
                    ],
                },
            }
        },
        created() {
        },

        props: {
            flowUserList:Array,
        },
        methods: {
            onChange: function (value, name) {
                this.formData[name] = value
            },
            onSelect: function (value, name) {
                this.formData[name] = value;
            },
            handleRemove(file, fileList) {
                this.importTableData = []
                this.$refs['upload'].clearFiles()
            },
            handlePreview(file) {
            },
            handleSuccess(response, file, fileList) {
                let _this = this
                if(!response.status) {
                    this.$message.error('上传失败')
                    _this.$refs['upload'].clearFiles();
                    return false
                }
                if(response.status != 200) {
                    let errMsg = "第"+response.result+"行"+Status[response.status];
                    if(response.status <= 30000) {
                        errMsg = response.message;
                    }
                    this.$message({
                        'type': 'error',
                        'message': errMsg
                    })
                    _this.$refs['upload'].clearFiles();
                    return false;
                }
                this.importTableData = response.result
            },
            handleError(file) {
            },
            btnOKClick() {
                let _this = this
                this.$refs['addForm'].validate(valid => {
                    if (valid) {
                        let uploadObj = this.$refs['upload']
                        let uploadFiles = uploadObj.uploadFiles
                        if (uploadFiles.length == 0) {
                            return this.$message({
                                'type': 'error',
                                'message': '未选择文件'
                            })
                        }
                        let args = this.importTableData
                        args.cityId = _this.formData.townIdArray[1]
                        args.townId = _this.formData.townIdArray[2]
                        args.estateId = _this.formData.estateId
                        args.auditId = _this.formData.auditId
                        args.createUser = Cookie.get('t8t-tc-uid')
                        this.isLoading = true
                        Service.importOrder(args)
                            .then((res) => {
                                if (res.data.status === 200) {
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'success',
                                        message: '新增成功',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                    this.isLoading = false
                                    _this.btnCancleClick()
                                    this.$emit('success')
                                }
                                else {
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'error',
                                        message: res.data.message,
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                }
                            })
                    }else{
                        return false
                    }
                })
            },
            btnCancleClick(){
                this.$emit('close')
            }
        }
    }

</script>

<style lang="css" scoped>
    .my-title{
        padding:10px;
        text-align: center;
    }
    .my-dialog2-container{
        width: 100%;
        height: 100%;
        height: 100%;
        display: flex;
        flex: 1;
        flex-direction: column;
    }
    .my-table{
        display: flex;
        flex:1;
    }
    .my-button{
        padding:10px;
        text-align: center;
        margin: 10px;
    }
    .t8t-search{
        overflow: visible;
    }

</style>
<style>
    .import-owner-dialog-popup .t8t-form-popup .el-autocomplete{
        width:180px;
    }
</style>
