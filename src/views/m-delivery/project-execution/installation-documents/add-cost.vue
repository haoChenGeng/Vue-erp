<template>
    <div>
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 master-reported" :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar class="t8t-dark" ref="toolbar" :disabledSymbols="toolbarDisabledSymbols" @SUBMIT="submit" @CLOSE="closeDialog">
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
                                <el-form-item label="商家名称：" prop="supplierId" :rules="formRule.supplierId">
                                    <el-select v-model="formData.supplierId" filterable placeholder="--请选择--" @visible-change="handShopClick">
                                        <el-option v-for="item in commonOptionsConfig.shopList" :label="item.text" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="附加费类别：" prop="surchargeType" :rules="formRule.surchargeType">
                                    <el-select v-model="formData.surchargeType" placeholder="--请选择--">
                                        <el-option v-for="item in commonOptionsConfig.surchargeTypes" :label="item.text" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="关联单据类型：" prop="sourceOrderTypeName">
                                    <el-select v-model="formData.sourceOrderTypeName" placeholder="--请选择--" :disabled="true">
                                        <el-option v-for="item in commonOptionsConfig.sourceOrderTypes" :label="item.text" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="关联单据：" prop="sourceOrderCode">
                                    <el-select v-model="formData.sourceOrderCode" :disabled="true">
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="关联单据行：" prop="sourceOrderLineNo" :rules="formRule.sourceOrderLineNo">
                                    <el-select v-model="formData.sourceOrderLineNo" placeholder="--请选择--">
                                        <el-option v-for="item in commonOptionsConfig.installItemVOs" :label="item.text" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="申请金额：" prop="applyAmount" :rules="formRule.applyAmount">
                                    <el-input v-model="formData.applyAmount"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="备注：" prop="remark" :rules="formRule.remark">
                                    <el-input type="textarea" autosize v-model="formData.remark" size="large"></el-input>
                                </el-form-item>
                            </div>
                        </el-form>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">

                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 另一个el-dialog放这里 -->
        <el-dialog v-model="dialogImageVisible" size="tiny">
        </el-dialog>
    </div>
</template>

<script>
    import Utils from 'src/utils/Utils.js'
    import Services from 'src/services/delivery/Service.js'
    import { Service, methods } from 'src/services/delivery/installation-schedule/Service.js'
    import api from 'src/services/delivery/distribution.js'
    import Cookie from 'js-cookie'
    export default {
        name: 'master-reported',
        data() {
            return {
                isTopHide: false,
                isDialogShow: true,
                formData: {
                    supplierId: null,
                    supplierName: '',
                    surchargeType: null,
                    sourceOrderType: null,
                    sourceOrderCode: null,
                    sourceOrderLineNo: null,
                    currencyId: null,
                    applyAmount: null,
                    remark: '',
                    createUser: null,
                    updateUser: null,
                    currencyId: null,
                    sourceOrderTypeName: '安装单'
                },
                commonOptionsConfig: {
                    surchargeTypes: [],
                    shopList: [],
                    installItemVOs: [],
                    sourceOrderTypes: []
                },
                formRule: {
                    surchargeType: [
                        { type: 'number', required: true, message: "请选择项目附加费类别", trigger: "change" }
                    ],
                    supplierId: [
                        { type: 'number', required: true, message: "请选择商家", trigger: "change" }
                    ],
                    sourceOrderLineNo: [
                        { type: 'number', required: true, message: "请选择关联单据行", trigger: "change" }
                    ],
                    applyAmount: [
                        { required: true, message: "请填写申请金额", trigger: "blur" },
                        { pattern: /^[1-9]\d{0,2}$|^([1-9]\d{0,4}|\d)\.\d?[1-9]$/, message: "申请金额格式错误", trigger: "blur" }
                    ],
                    remark: [
                        { required: true, message: "请填写描述", trigger: "blur" },
                        { max: 500, min: 1, message: "描述不能超过500字符", trigger: "blur" }
                    ]
                }
            }
        },
        created() {
            this.id = this.$route.query.id
            if (!this.id) {
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
            this.initData(this.id);
        },
        watch: {

        },
        methods: {
            onTopHide() {
                this.isTopHide = !this.isTopHide
            },
            closeDialog() {
                // 填写对应的路由
                this.$router.push({ path: '/tuchat-delivery/installation-ducuments-list' })
            },
            initData(id) {
                let args = { id: id }
                methods.addCostReview(args).then((res) => {
                    if (res.data.status == 200) {
                        this.formData.sourceOrderCode = res.data.result.sourceOrderCode
                        this.formData.currencyId = res.data.result.currencyId
                        this.formData.sourceOrderType = 2
                        this.commonOptionsConfig.shopList = []
                        res.data.result.installBillCostShopVOs.forEach((item) => {
                            this.commonOptionsConfig.shopList.push({
                                text: item.shopName,
                                value: item.shopId
                            })
                        })
                        this.commonOptionsConfig.surchargeTypes = []
                        res.data.result.surchargeTypes.forEach((item) => {
                            this.commonOptionsConfig.surchargeTypes.push({
                                text: item.propertyName,
                                value: item.id
                            })
                        })
                        this.commonOptionsConfig.sourceOrderTypes = []
                        this.commonOptionsConfig.sourceOrderTypes.push({
                            text: '安装单',
                            value: 2
                        })
                        this.commonOptionsConfig.installItemVOs = []
                        res.data.result.installItemVOs.forEach((item) => {
                            this.commonOptionsConfig.installItemVOs.push({
                                text: item.goodsName,
                                value: item.id
                            })
                        })
                    }
                    console.log(Number(null));
                })
            },
            submit() {
                this.$TCS.addTag('red_14253_010006015001') //点击流
                this.$refs.formRef.validate((isValid) => {
                    if (isValid) {
                        let _this = this
                        _this.formData.createUser = Cookie.get('t8t-tc-uid')
                        _this.formData.updateUser = Cookie.get('t8t-tc-uid')
                        _this.commonOptionsConfig.shopList.forEach((item) => {
                            if (_this.formData.supplierId == item.value) {
                                _this.formData.supplierName = item.text
                            }
                        })
                        let args = {
                            submitDTO: _this.formData
                        }
                        methods.submitByErp(args).then((res) => {
                            if (res.data.status == 200) {
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
                            }
                            else {
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
                            this.$msgbox({
                                title: '提交失败',
                                type: 'error',
                                message: error || '服务器异常',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                        })
                    }
                })
            }
        }
    }

</script>

<style lang="css">
    .master-reported-edit-dialog .el-dialog--small {
        width: 508px;
    }

    .dialog2-form-container .dialog2-form-item-container {
        width: 33.33%;
        display: flex;
    }
</style>
