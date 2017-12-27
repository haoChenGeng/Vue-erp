<template>
    <div>
        <el-dialog :title="title" class="pay-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form v-loading.lock="formLoading" :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth"
                ref="form" @keyup.enter.native="btnOKClick()">
                <el-form-item label="项目ID：" prop="sourceProjectId">
                    <el-input v-model="formData.sourceProjectId" disabled></el-input>
                </el-form-item>
                <el-form-item label="业主姓名：" prop="ownerName">
                    <el-input v-model="formData.ownerName" disabled></el-input>
                </el-form-item>
                <el-form-item label="详细地址：" prop="addressDetail">
                    <el-input type="textarea" rows="3" v-model="formData.addressDetail" disabled></el-input>
                </el-form-item>
                <el-form-item label="验收节点：" prop="sheduleNodeId">
                    <el-select v-model="formData.sheduleNodeId" filterable :allow-create="false" placeholder="请选择验收节点">
                        <el-option v-for="item in projectNodeVOs" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开工时间" prop="startTime">
                    <el-date-picker v-model="formData.startTime" placeholder="" type="datetime">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="上传图片" name="uploadPic">
                    <div class="list-container">
                        <el-upload :action="uploadURL" :data="uploadParams" multiple list-type="picture-card" accept=".jpg,.jpeg,.png,.bmp" :file-list="imgList"
                            :on-preview="handlePictureCardPreview" :on-success="handleSuccess" :on-remove="handleRemove" :before-upload="beforeUpload">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading" :disabled="isLoading">确定</el-button>
                <el-button @click="btnCancleClick()">取消</el-button>
            </div>
        </el-dialog>
        <!--class=g-w-1000  size="full"-->
        <el-dialog v-model="picDialogVisible" class="g-w-1000">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
<script>
    import CheckCommon from 'src/services/delivery/check/checkCommon.js'
    import Utils from 'src/utils/Utils.js'
    import Cookie from 'js-cookie'
    export default {
        name: 'add-start-bill',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                dialogVisible: true,
                activeName: "uploadPic",
                uploadURL: Utils.getUploadURL(),
                uploadParams: {
                    bucket: 'scm',
                    module: 'pic/delivery',
                },
                dialogImageUrl: '',
                picDialogVisible: false,
                fileList: [],
                imgList: [],
                attachRelation: {}, //附件id及upload组件uid之前的关联关系，只为移除已上传的图片
                rules: {
                    sheduleNodeId: [
                        { type: 'string', required: true, message: "请选择验收节点", trigger: 'change' },
                    ],
                    startTime: [
                        { type: 'date', required: true, message: "请选择开工时间", trigger: 'change' },
                    ]
                },
                //表单
                formData: {
                    sourceProjectId: null,
                    projectId: null,
                    ownerName: '',
                    addressDetail: '',
                    sheduleNodeId: null,
                    startTime: '',
                },
                isLoading: false,
                projectNodeVOs: [],
                formLoading: false
            }
        },
        props: {
            projectId: {
                type: String,
                default: 0
            },
            editType: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            }
        },
        computed: {
            editable() {
                return this.editType === 'see'
            }
        },
        created() {
            if (this.projectId && this.editType == 'add') {
                this.formData.projectId = this.projectId;
                this.getProjectInfo();
            }
            //请求所选行的数据
        },
        methods: {
            getProjectInfo() {
                this.formLoading = true;
                CheckCommon.getCheckProject({ projectId: this.formData.projectId })
                    .then((res) => {
                        let resStatus = [211514, 211502, 211507];
                        let message = '';
                        if (res.data.status === 200) {
                            this.projectNodeVOs = [];
                            let list = [];
                            res.data.result.projectNodeVOs.forEach(function (item, i) {
                                list.push({ label: item.nodeTypeName, value: item.id });
                            });
                            this.projectNodeVOs = list;
                            this.formData = Object.assign(this.formData, res.data.result);
                        } else if (resStatus.includes(res.data.status)) {
                            message = res.data.result == null ? (res.data.message == null ? '系统异常,请稍后再试！' : res.data.message) : res.data.result
                        }
                        else {
                            message = '系统异常,请稍后再试！';
                        }
                        if (message != '') {
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: message,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            });
                        }
                        this.formLoading = false;
                    });
            },
            btnOKClick() {
                let _this = this
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        let editType = _this.editType;
                        if (editType === 'add') {
                            if (_this.fileList.length === 0) {
                                _this.$message.error('请先上传图片！');
                                _this.tab_detail = 'uploadPic';
                                return false;
                            }
                            _this.isLoading = true;
                            let startCreateDTO = {
                                projectId: _this.formData.projectId,
                                sheduleNodeId: _this.formData.sheduleNodeId,
                                startTime: +Date.parse(_this.formData.startTime).toString().substr(0, 10),
                                createUser: +Cookie.get('t8t-tc-uid'),//TODO 待改
                                attachDTOs: _this.handleUploadFiles(_this.fileList)
                            }
                            CheckCommon.createStartCheck({ check: startCreateDTO })
                                .then((res) => {
                                    let resStatus = [211514, 211502, 211508, 211501, 211500];
                                    let reminder = '';
                                    if (res.data.status === 200) {
                                        _this.$message({
                                            type: 'success',
                                            message: '新增成功！'
                                        })
                                        _this.btnCancleClick()
                                        _this.$emit('getTableData')
                                    } else if (resStatus.includes(res.data.status)) {
                                        if (res.data.result) {
                                            for (let index = 0; index < res.data.result.length; index++) {
                                                reminder = reminder.concat(index + 1).concat(".").concat(res.data.result[index]);
                                            }
                                        }
                                        reminder = reminder == '' ? (res.data.message == null ? '系统异常,请稍后再试！' : res.data.message) : reminder
                                    } else {
                                        reminder = '系统异常,请稍后再试！';
                                    }
                                    if (reminder != '') {
                                        // _this.$message({
                                        //     type: 'error',
                                        //     message: reminder,
                                        // })
                                        this.$msgbox({
                                            title: '消息',
                                            type: 'error',
                                            message: reminder,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        });
                                    }


                                    _this.isLoading = false;
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
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.picDialogVisible = true;
            },
            beforeUpload(file) {
                let len = this.fileList.length;
                if (len > 9) {
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: '最多只能上传9张图片！',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    this.imgList = this.fileList.slice(0, 9);
                    return false;
                }
            },
            handleSuccess(response, file, fileList) {
                if (response.status != 200) {
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: '图片上传失败,稍后再试！',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    return false;
                }
                let _this = this;
                _this.fileList = fileList;
                _this.attachRelation[file.uid] = response.result;
                if (_this.fileList.length > 9) {
                    _this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: '最多只能上传9张图片！',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    _this.fileList = _this.fileList.slice(0, 9);
                    _this.imgList = _this.fileList.slice(0, 9);
                }
            },
            handleRemove(file, fileList) {
                if (file && typeof this.attachRelation[file.uid] !== 'undefined') {
                    delete (this.attachRelation[file.uid]);
                }
                this.fileList = fileList;
            },
            handleUploadFiles(fileList) {
                if (fileList.length === 0) {
                    _this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: '图片上传失败,稍后再试！',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    return [];
                }
                let _this = this;

                return fileList.map(function (item, index, array) {
                    if (typeof item.id !== 'undefined' && item.id > 0) {
                        return item;
                    } else {

                        let obj = {
                            id: "",
                            attachName: item.name,
                            attachPath: _this.attachRelation[item.uid].id,
                            filePath: _this.attachRelation[item.uid].filePath,
                        }
                        return obj;
                    }
                })
            }
        }
    }

</script>

<style lang="css" scoped>

</style>
<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css">
    .pay-dialog .el-dialog {
        width: 450px;
    }

    @media screen and (max-height: 900px) {
        .pay-dialog .el-dialog--small {
            top: 1% !important;
        }
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

    .el-upload-list--picture-card .el-upload-list__item {
        width: 100px !important;
        height: 100px !important;
        margin: 10px;
    }

    .el-upload--picture-card {
        width: 100px !important;
        height: 100px !important;
        line-height: 100px !important;
        margin: 10px;
    }

    .el-progress-circle {
        width: 100% !important;
        height: 100% !important;
    }

    .el-upload-list__item .el-progress {
        width: 100% !important;
    }
    /* .list-container{width: 50px;height: 50px;} */
</style>