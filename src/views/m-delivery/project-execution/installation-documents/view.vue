<template>
    <div>
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2" :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar class="t8t-dark" @EDIT-SUBMIT="submitForm" @CLOSE="closeDialog" :disabledSymbols="toolbarDisabledSymbols">
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
                                <el-form class="dialog2-form-container" :model="formData" :rules="formRule" ref="basicForm" label-position="right" label-width="120px">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="编号：">
                                            <el-input v-model="formData.installBillCode" :disabled="editable"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="项目ID：">
                                            <el-input v-model="formData.projectId" :disabled="editable"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="组织：">
                                            <el-input v-model="formData.organizationName" :disabled="editable"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="业主姓名：">
                                            <el-input v-model="formData.ownerName" :disabled="editable"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="安装状态：">
                                            <el-select v-model="formData.installStatus" placeholder="--请选择--" :disabled="editable">
                                                <el-option v-for="item in commonOptionsConfig.installStatus" :label="item.text" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="安装人：">
                                            <el-input v-model="formData.installPeopleName" :disabled="editable"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="安装人类型：">
                                            <el-input v-model="formData.installPeopleTypeName" :disabled="editable"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="安装开始时间：" prop="actualInstallStartTime">
                                            <el-date-picker v-model="formData.actualInstallStartTime" type="datetime" :disabled="isEdit" :picker-options="pickerOptions">
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="安装结束时间：" prop="actualInstallEndTime">
                                            <el-date-picker v-model="formData.actualInstallEndTime" type="datetime" :disabled="isEdit" :picker-options="pickerOptions">
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="详细地址" name="detalAddr">
                                <el-form class="dialog2-form-container distribution_addr" :model="formData" :rules="formRule" ref="formRef" label-position="right"
                                    label-width="120px">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="工长姓名：">
                                            <el-input v-model="formData.chiefWorkerName" :disabled="editable"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="业主姓名：">
                                            <el-input v-model="formData.ownerName" :disabled="editable"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container addr_item">
                                        <el-form-item label="安装地址：">
                                            <t8t-division v-model="formData.townArr" :defaultValue="formData.standardTownId" class="addr_detail" :disabled="editable"></t8t-division>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-input v-model="formData.address" :disabled="editable" class="address_detail"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="其他信息" name="other">
                                <el-form class="dialog2-form-container" :model="formData" label-position="right" label-width="120px">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="创建人：">
                                            <el-input v-model="formData.createName" :disabled="editable"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="提交人：">
                                            <el-input v-model="formData.updateName" :disabled="editable"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="创建时间：">
                                            <el-date-picker v-model="formData.createTime" type="datetime" :disabled="editable">
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="提交时间：">
                                            <el-date-picker v-model="formData.updateTime" type="datetime" :disabled="editable">
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <el-tabs v-model="activeTabName">
                            <el-tab-pane v-for="tab in tabList" :label="tab.tabLabel" :name="tab.tabName">
                                <div class="sub-install-contain">
                                    <el-form class="tab-container" :model="tab" :rules="formRule" :ref="tab.tabName" label-position="right" label-width="120px">
                                        <div class="dialog2-form-item-container">
                                            <el-form-item label="预计安装量：" prop="expectInstallNum">
                                                <el-input v-model="tab.expectInstallNum" :disabled="true"></el-input>
                                            </el-form-item>
                                        </div>
                                        <div class="dialog2-form-item-container">
                                            <el-form-item label="实际安装量：" prop="actualInstallNum" :rules="formRule.actualInstallNum">
                                                <el-input v-model="tab.actualInstallNum" :disabled="isEdit"></el-input>
                                            </el-form-item>
                                        </div>
                                        <div class="dialog2-form-item-container">
                                            <el-form-item label="使用空间：" prop="usedSpace">
                                                <el-input v-model="tab.usedSpace" :disabled="true"></el-input>
                                            </el-form-item>
                                        </div>
                                        <div class="dialog2-form-item-container">
                                            <el-form-item label="现场描述：" prop="remarks" :rules="formRule.remarks">
                                                <el-input type="textarea" v-model="tab.remarks" :disabled="isEdit"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-form>
                                    <div class="checkItem">
                                        <h3>上传图片</h3>
                                        <div class="checkItem_detail list-container" :class="{'installation-ducuments': isEdit}">
                                            <el-upload :action="uploadURL" :data="uploadParams" multiple list-type="picture-card" accept=".jpg,.jpeg,.png" :file-list="imgList[tab.id]"
                                                :on-success="handleSuccess(tab.id)" :on-preview="handlePictureCardPreview" :before-upload="beforeUpload(tab.id)"
                                                :on-remove="handleRemove(tab.id)">
                                                <i class="el-icon-plus"></i>
                                            </el-upload>
                                        </div>
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <div class="full-dialog-tabs-container">
                        <el-tabs v-model="activeViewTabName">
                            <el-tab-pane label="附加费" name="cost">
                                <t8t-table :service="installCostServer" :columns="columns" :pageBar="true" :indexCol="true" :commonData="tableCommonData"
                                :method="installCostMethod" :args="installCostArgs"></t8t-table>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 另一个el-dialog放这里 -->
        <el-dialog v-model="dialogVisible" size="large">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
    import { Service, methods } from 'src/services/delivery/installation-schedule/Service.js'
    import Utils from 'src/utils/Utils.js'
    export default {
        data() {
            return {
                isTopHide: false,
                isDialogShow: true,
                activeTabName: "1",
                activeInputTabName: 'basic',
                activeViewTabName: "cost",
                formData: {
                    installBillCode: null,
                    projectId: null,
                    organizationName: null,
                    ownerName: null,
                    installStatus: null,
                    installPeopleName: null,
                    installPeopleTypeName: null,
                    actualInstallStartTime: null,
                    actualInstallEndTime: null,
                    createName: null,
                    updateName: null,
                    createTime: null,
                    updateTime: null
                },
                columns: [
                    { prop: 'code', label: ' 单据编码' },
                    { prop: 'supplierName', label: '商家名称' },
                    { prop: 'surchargeTypeName', label: '附加费类别' },
                    { prop: 'applyAmount', label: '申请金额' },
                    { prop: 'realAmount', label: '实结金额' },
                    { prop: 'verifyStatus', label: '数据状态', list: 'verifyStatus' },
                    { prop: 'settleStatus', label: '结算状态', list: 'settleStatus' }
                ],
                tableCommonData: {
                    verifyStatus: [
                        { text: '无状态', value: 0 },
                        { text: '暂存(新生成)', value: 1 },
                        { text: '审核中', value: 2 },
                        { text: '暂存(重新审核)', value: 3 },
                        { text: '已审核', value: 4 },
                        { text: '已关闭', value: 5 },
                    ],
                    settleStatus: [
                        { text: '无状态', value: 0 },
                        { text: '待结算', value: 1 },
                        { text: '结算中', value: 2 },
                        { text: '已结算', value: 3 },
                    ]
                },
                tabList: [],
                commonOptionsConfig: {
                    installStatus: [
                        { text: '待安装', value: 0 },
                        { text: '未完成', value: 1 },
                        { text: '已完成', value: 2 },
                    ],
                },
                editable: true,
                validateList: [],
                validateRes: false,
                isEdit: true,
                formRule: {
                    actualInstallNum: [
                        { required: true, message: "请填写实际安装量", trigger: "blur" },
                        { pattern: /^[1-9]\d{0,4}$|^([1-9]\d{0,4}|\d)\.\d?[1-9]$/, message: "实际安装量格式错误", trigger: "blur" }
                    ],
                    remarks: [
                        { required: true, message: "请填写现场描述", trigger: "blur" },
                        { max: 200, min: 1, message: "现场描述不能超过200字符", trigger: "blur" }
                    ],
                    actualInstallStartTime: [
                        { type: 'date', required: true, message: "请选择安装开始时间", trigger: "change" }
                    ],
                    actualInstallEndTime: [
                        { type: 'date', required: true, message: "请选择安装结束时间", trigger: "change" }
                    ]
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    }
                },
                toolbarDisabledSymbols: [],
                uploadURL: Utils.getUploadURL(),
                uploadParams: {
                    bucket: 'scm',
                    module: 'delivery'
                },
                installCostServer: null,
                installCostMethod: null,
                installCostArgs: null,
                fileList: {},
                attachRelation: {},
                imgList: {},
                dialogVisible: false,
                dialogImageUrl: ''
            }
        },
        created() {
            let id = this.$route.query.id
            let planId = this.$route.query.planId
            if (!id && !planId) {
                let _this = this
                this.$msgbox({
                    title: '提示',
                    type: 'error',
                    message: '参数错误',
                    showCancelButton: false,
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                }).then(() => {
                    _this.$router.go(-1)
                })
            }
            if (this.$route.path.endsWith('edit')) {
                this.isEdit = false
            }
            if (id) {
                this.initDataById(id).then(() => {
                    this.activeTabName = this.tabList.length > 0 ? this.tabList[0]['tabName'] : null
                })
            } else if (planId) {
                this.initDataByPlanId(planId).then(() => {
                    this.activeTabName = this.tabList.length > 0 ? this.tabList[0]['tabName'] : null
                })
            }
        },
        watch: {
            validateRes: function (val) {
                if (val) {
                    this.validateSuccess()
                }
            }
        },
        methods: {
            onTopHide() {
                this.isTopHide = !this.isTopHide
            },
            closeDialog() {
                // 填写对应的路由
                //this.$router.push({ path: '/tochat-delivery/installation-ducuments-list' })
                if (this.$route.query.planId) {
                    this.$router.push({ path: '/tochat-delivery/installtion-schedule-list' })
                } else {
                    this.$router.push({ path: '/tochat-delivery/installation-ducuments-list' })
                }
            },
            initDataById(id) {
                let args = { id: id }
                let _this = this
                return methods.findInstallBillDetailById(args).then((res) => {
                    if (res.data.status == 200) {
                        _this.formData = res.data.result
                        _this.formData.createTime = _this.formData.createTime > 0 ? new Date(_this.formData.createTime * 1000) : null
                        _this.formData.updateTime = _this.formData.updateTime > 0 ? new Date(_this.formData.updateTime * 1000) : null
                        _this.formData.actualInstallStartTime = _this.formData.actualInstallStartTime > 0 ? new Date(_this.formData.actualInstallStartTime * 1000) : null
                        _this.formData.actualInstallEndTime = _this.formData.actualInstallEndTime > 0 ? new Date(_this.formData.actualInstallEndTime * 1000) : null
                        res.data.result.installItemVOList.forEach((item, key) => {
                            let imgList = [];
                            let fileList = [];
                            item.installBillAttachVOs.forEach((item1) => {
                                let temp = {
                                    id: item1.id,
                                    attachName: item1.attachName,
                                    attachPath: item1.attachPath,
                                    filePath: item1.filePath,
                                    name: item1.attachName,
                                    url: Utils.getFullURL(item1.filePath)
                                };
                                imgList.push(temp);
                                fileList.push(temp);
                            })
                            this.fileList[item.id] = fileList;
                            this.imgList[item.id] = imgList;
                            item.actualInstallNum = item.actualInstallNum.toString()
                            _this.tabList.push(Object.assign({ tabName: 'tab' + key, tabLabel: item.goodsName }, item))
                        })
                        this.getInstallBillCost(this.formData)
                    }
                })
            },
            getInstallBillCost(formData) {
                console.log(this);
                if (!formData.installBillCode)
                    return
                this.installCostArgs = { search: { sourceOrderCode: formData.installBillCode }, page: 1, size: 100 }
                this.installCostMethod = Service.PSODM.methods.queryPage
                this.installCostServer = Service.PSODM.name
            },
            initDataByPlanId(planId) {
                let args = { planId: planId }
                let _this = this
                return methods.queryInstallItemByInstallPlanId(args).then((res) => {
                    if (res.data.status == 200 && res.data.result.length > 0) {
                        _this.formData = res.data.result[0]
                        _this.formData.createTime = _this.formData.createTime > 0 ? new Date(_this.formData.createTime * 1000) : null
                        _this.formData.updateTime = _this.formData.updateTime > 0 ? new Date(_this.formData.updateTime * 1000) : null
                        _this.formData.actualInstallStartTime = _this.formData.actualInstallStartTime > 0 ? new Date(_this.formData.actualInstallStartTime * 1000) : null
                        _this.formData.actualInstallEndTime = _this.formData.actualInstallEndTime > 0 ? new Date(_this.formData.actualInstallEndTime * 1000) : null
                        res.data.result[0].installItemVOList.forEach((item, key) => {
                            let imgList = [];
                            let fileList = [];
                            item.installBillAttachVOs.forEach((item1) => {
                                let temp = {
                                    id: item1.id,
                                    attachName: item1.attachName,
                                    attachPath: item1.attachPath,
                                    filePath: item1.filePath,
                                    name: item1.attachName,
                                    url: Utils.getFullURL(item1.filePath)
                                };
                                imgList.push(temp);
                                fileList.push(temp);
                            })
                            this.fileList[item.id] = fileList;
                            this.imgList[item.id] = imgList;
                            item.actualInstallNum = item.actualInstallNum.toString()
                            _this.tabList.push(Object.assign({ tabName: 'tab' + key, tabLabel: item.goodsName }, item))
                        })
                    }
                })
            },
            submitForm() {
                this.$TCS.addTag('red_6788_010006012002') //点击流
                let _this = this
                this.tabList.forEach((item) => {
                    _this.validateList.push(item.tabName)
                })
                this.$refs.basicForm.validate((isValid) => {
                    if (this.validateList.length > 0 && isValid) {
                        let isAttach = true;
                        for (var i = 0; i < this.tabList.length; i++) {
                            var item = this.tabList[i]
                            if (this.fileList[item.id].length < 1) {
                                isAttach = false;
                                break;
                            }
                        }
                        if (isAttach == false) {
                            this.$message.error('有行未上传图片，请先上传一张图片！')
                            return;
                        }
                        for (var i = 0; i < _this.tabList.length; i++) {
                            var item = _this.tabList[i]
                            if (item.actualInstallNum != item.expectInstallNum) {
                                _this.$confirm('您输入的预计安装数量有不等于预计的安装数量的项！', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.validateCheck().then((res) => {
                                        if (res) {
                                            _this.updateInstallBill()
                                            return;
                                        }
                                    })
                                }).catch(() => {
                                    _this.$message({
                                        type: 'info',
                                        message: '已取消关闭'
                                    });
                                });
                                return;
                            }
                        }
                        this.validateCheck().then((res) => {
                            if (res) {
                                _this.updateInstallBill();
                            }
                        })
                    }
                })

            },
            updateInstallBill() {
                let _this = this;
                this.tabList.forEach((item, index) => {
                    debugger;
                    let attachDTOs = _this.handleUploadFiles(_this.fileList[item.id]);
                    _this.tabList[index].attachDTOs = attachDTOs;
                })
                let args = {
                    installBill: {
                        id: this.formData.id,
                        actualInstallStartTime: +Date.parse(this.formData.actualInstallStartTime).toString().slice(0, -3),
                        actualInstallEndTime: +Date.parse(this.formData.actualInstallEndTime).toString().slice(0, -3),
                        updateUser: +Cookie.get('t8t-tc-uid'),
                        updateName: Cookie.get('t8t-tc-username'),
                        installItemUpdateDTOList: this.tabList
                    }
                }
                this.toolbarDisabledSymbols.push('EDIT-SUBMIT')
                methods.updateInstallBill(args).then((res) => {
                    if (res.data.status == 200) {
                        this.toolbarDisabledSymbols.pop()
                        var _this = this
                        this.$msgbox({
                            title: '提交成功',
                            type: 'success',
                            message: '',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        }).then(() => {
                            _this.closeDialog()
                        })
                    } else {
                        this.$msgbox({
                            title: '提交失败',
                            type: 'error',
                            message: res.data.message,
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                    }
                }).catch((error) => {
                    this.toolbarDisabledSymbols.pop()
                    this.$msgbox({
                        title: '提交失败',
                        type: 'error',
                        message: error || '服务器异常',
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                })
            },
            validateCheck() {
                let _this = this
                return new Promise(function (resolve, reject) {
                    _this.validate(_this.validateList.shift(), _this.validate)
                    _this.validateSuccess = function () {
                        resolve(true);
                    }
                })
            },
            validate(name, func) {
                this.$refs[name][0].validate((isValid) => {
                    if (isValid) {
                        if (this.validateList.length > 0) {
                            func(this.validateList.shift(), this.validate)
                        } else {
                            this.validateRes = true
                        }
                    } else {
                        this.activeTabName = name
                    }
                })
            },
            validateSuccess() {
                return true
            },
            handleUploadFiles(fileList) {
                debugger;
                if (fileList.length === 0) {
                    return [];
                }
                let _this = this;
                return fileList.map(function (item, index, array) {
                    if (typeof item.id !== 'undefined' && item.id > 0) {
                        return item;
                    } else {
                        let obj = {
                            id: 0,
                            attachName: item.name,
                            attachPath: _this.attachRelation[item.uid].id,
                            filePath: _this.attachRelation[item.uid].filePath,
                        }
                        return obj;
                    }
                })
            },
            handleSuccess(checkItemId) {
                let _this = this;
                return function (response, file, fileList) {
                    if (response.status != 200) {
                        debugger;
                        console.log(fileList);
                        console.log(file);
                        let files = fileList.filter(function (item) {
                            return item.uid == file.uid
                        })
                        _this.$message.error('上传图片失败！');
                        let size = _this.fileList.length;
                        _this.imgList[checkItemId] = fileList.splice(fileList.indexOf(files[0]), 1);
                    }
                    else {
                        _this.fileList[checkItemId] = fileList;
                        _this.attachRelation[file.uid] = response.result;
                        if (_this.fileList[checkItemId].length > 9) {
                            _this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: '最多只能上传9张图片！',
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            });
                            _this.fileList[checkItemId] = _this.fileList[checkItemId].slice(0, 9);
                            _this.imgList[checkItemId] = _this.fileList[checkItemId].slice(0, 9);
                        }
                    }
                }
            },
            handleRemove(checkItemId) {
                let _this = this;
                return function (file, fileList) {
                    if (file && typeof _this.attachRelation[file.uid] !== 'undefined') {
                        delete (_this.attachRelation[file.uid]);
                    }
                    _this.fileList[checkItemId] = fileList;
                }
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            beforeUpload(checkItemId) {
                let _this = this;
                return function (file) {
                    let len = _this.fileList[checkItemId].length;
                    if (len > 9) {
                        _this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '最多只能上传9张图片！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        });
                        _this.imgList[checkItemId] = _this.fileList[checkItemId].slice(0, 9);
                        return false;
                    }
                }
            }
        }
    }

</script>

<style lang="css" scoped>
    .tab-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        margin-top: 15px;
    }

    .tab-container .dialog2-form-item-container {
        width: 50%;
        display: flex;
    }

    .sub-install-contain {
        margin-left: auto;
        margin-right: auto;
    }

    .checkItem {
        margin-bottom: 30px;
    }

    .checkItem h3 {
        margin-bottom: 15px;
        border-left: 4px solid #6b6b6b;
        padding-left: 6px;
        height: 20px;
        line-height: 20px;
    }

    .checkItem .checkItem_detail {
        padding-left: 20px;
    }
</style>
<style lang="css">
    .tab-container .el-form-item__content {
        width: 180px;
    }

    .installation-ducuments .el-upload {
        display: none;
    }

    .installation-ducuments .el-upload-list__item-actions .el-upload-list__item-delete {
        display: none;
        opacity: 0;
    }
</style>
