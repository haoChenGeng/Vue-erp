<template>
    <div class="t8t-detail-view demand-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog"
            v-model="isDialogShow"
            size="full"
            class="t8t-full-dialog2 dialog-new">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar class="t8t-dark"
                            :symbolList="symbolList"
                            @PASS="pass"
                            @REBUT="rebut"
                            @CANCEL="cancel"
                            @RECEIVE="receive"
                            @EXPORT="exportOrder"
                            :disabledSymbols="toolbarDisabledSymbols"
                            ref="t8t-dark">
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container"
                    :class="{'isHide': isTopHide}">
                    <div class="toggle-btn-container">
                        <div class="toggle-btn el-icon-d-arrow-left"
                            @click="onTopHide"></div>
                    </div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container container-center">
                        <el-form class="dialog2-form-container"
                            :model="formData"
                            ref="formRef"
                            v-model="mainActiveTab"
                            label-position="right"
                            label-width="120px">
                            <div class="dialog2-form-item-container">
                                <el-form-item label="订单类型："
                                    prop="billTypeName">
                                    <el-select v-model="formData.billTypeName"
                                        placeholder="--请选择--"
                                        disabled="true">
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="订单编号："
                                    prop="orderCode">
                                    <el-input v-model="formData.orderCode"
                                        :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="订单状态："
                                    prop="orderStatus">
                                    <el-select v-model="formData.orderStatus"
                                        placeholder="--请选择--"
                                        disabled="true">
                                        <el-option v-for="item in commonOptionsConfig.orderStatusList"
                                            :label="item.text"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="收货人："
                                    prop="orderCode">
                                    <el-input v-model="formData.receiveName"
                                        :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="手机号码："
                                    prop="receivePhone">
                                    <el-input v-model="formData.receivePhone"
                                        :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="项目ID："
                                    prop="sourceProjectId">
                                    <el-input v-model="formData.sourceProjectId"
                                        :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="业主名称："
                                    prop="ownerName">
                                    <el-input v-model="formData.ownerName"
                                        :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="订单总金额："
                                    prop="totalMoney">
                                    <el-input v-model="formData.totalMoney"
                                        :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="下单时间："
                                    prop="createTime">
                                    <el-date-picker class="date-editor_time"
                                        v-model="formData.createTime"
                                        type="datetime"
                                        :isZero="false"
                                        disabled="true"
                                        format="yyyy-MM-dd HH:mm">
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="下单人："
                                    prop="createUserName">
                                    <el-input v-model="formData.createUserName"
                                        :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="审核时间："
                                    prop="verifyTime">
                                    <el-date-picker class="date-editor_time"
                                        v-model="formData.verifyTime"
                                        type="datetime"
                                        :isZero="false"
                                        disabled="true"
                                        format="yyyy-MM-dd HH:mm">
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="审核人："
                                    prop="verifyUserName">
                                    <el-input v-model="formData.verifyUserName"
                                        :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="预计要货日期："
                                    prop="goodsDemandTime">
                                    <el-date-picker class="date-editor_time"
                                        v-model="formData.goodsDemandTime"
                                        type="datetime"
                                        :isZero="false"
                                        disabled="true"
                                        format="yyyy-MM-dd HH:mm">
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="发货时间："
                                    prop="firstSendTime">
                                    <el-date-picker class="date-editor_time"
                                        v-model="formData.firstSendTime"
                                        type="datetime"
                                        :isZero="false"
                                        disabled="true"
                                        format="yyyy-MM-dd HH:mm">
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="预计送达日期："
                                    prop="planDeliveryTime">
                                    <el-date-picker class="date-editor_time"
                                        v-model="formData.planDeliveryTime"
                                        type="datetime"
                                        :isZero="false"
                                        disabled="true"
                                        format="yyyy-MM-dd HH:mm">
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="送货员："
                                    prop="deliveryManName">
                                    <el-input v-model="formData.deliveryManName"
                                        :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="送货员电话："
                                    prop="deliveryManPhone">
                                    <el-input v-model="formData.deliveryManPhone"
                                        :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="实际送达时间："
                                    prop="deliveryTime">
                                    <el-date-picker class="date-editor_time"
                                        v-model="formData.deliveryTime"
                                        type="datetime"
                                        :isZero="false"
                                        disabled="true"
                                        format="yyyy-MM-dd HH:mm">
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="收货时间："
                                    prop="consigneeTime">
                                    <el-date-picker class="date-editor_time"
                                        v-model="formData.consigneeTime"
                                        type="datetime"
                                        disabled="true"
                                        :isZero="false"
                                        format="yyyy-MM-dd HH:mm">
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="备注："
                                    prop="remark">
                                    <el-input v-model="formData.remark"
                                        :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="收货地址："
                                    prop="receiveAddress">
                                    <el-input v-model="formData.receiveAddress"
                                        :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="驳回原因："
                                    prop="rejectReason">
                                    <el-input v-model="formData.rejectReason"
                                        :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                        </el-form>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <el-tabs v-model="activeTabName">
                            <el-tab-pane label="商品明细"
                                name="demandItem">
                                <t8t-table ref="demandTable"
                                    :columns="demandColumns"
                                    :pageBar="false"
                                    :indexCol="true"
                                    :dataSource="omItemGoodsVOS"
                                    :commonData="commonOptionsConfig"></t8t-table>
                            </el-tab-pane>
                            <el-tab-pane label="调色明细"
                                name="omItem">
                                <t8t-table ref="omItemTable"
                                    :columns="omItemColumns"
                                    :indexCol="true"
                                    :pageBar="false"
                                    :dataSource="omItemConfigVOS"
                                    :commonData="commonOptionsConfig"></t8t-table>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="审核驳回"
            v-model="dialogRebut">
            <el-form ref="formRebut"
                class="dialog2-form-container dialogRebut"
                :model="formRebut"
                :rules="formRule"
                label-position="center">
                <el-form-item required="true"
                    prop="remark">
                    <el-input type="textarea"
                        v-model="formRebut.remark"
                        :autosize="{ minRows: 6}"
                        :minlength="1"
                        size="large"
                        placeholder="请录入驳回原因"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="info"
                        size="small"
                        :disabled="buttonType"
                        @click="confirmRebut">确定</el-button>
                    <el-button type="info"
                        size="small"
                        @click="cancelRebut">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import api from 'src/services/delivery/goodsDemand/surcharge.js'

    export default {
        name: 't8t-dt-view',
        components: {},
        data() {
            return {
                symbolList: ['VIEW'],
                isDialogShow: true,
                id: null,
                activeTabName: "demandItem",
                dialogRebut: false,
                // 主表绑定数据源
                formData: {
                    billTypeName: null,
                    orderCode: null,
                    orderStatus: null,
                    orderCode: null,
                    receivePhone: null,
                    sourceProjectId: null,
                    ownerName: null,
                    totalMoney: null,
                    createTime: null,
                    createUserName: null,
                    verifyTime: null,
                    verifyUserName: null,
                    goodsDemandTime: null,
                    firstSendTime: null,
                    planDeliveryTime: null,
                    deliveryManName: null,
                    deliveryManPhone: null,
                    deliveryTime: null,
                    consigneeTime: null,
                    remark: null,
                    receiveAddress: null,
                    rejectReason: null,
                    isCheckUser: null,  //审核权限 0无 1有
                    isCancelUser: null,//取消权限 0无 1有
                    isReceiveUser: null//收货权限 0无 1有
                },
                commonOptionsConfig: {
                    orderStatusList: [
                        { value: 0, text: "待发货" },
                        { value: 1, text: "已发货" },
                        { value: 2, text: "已收货" },
                        { value: 3, text: "取消" },
                        { value: 4, text: "待审核" },
                        { value: 5, text: "已驳回" },
                        { value: 6, text: "新建（暂存）" },
                        { value: 7, text: "待报备" },
                        { value: 8, text: "已送达" },
                    ]
                },
                demandColumns: [
                    { prop: 'skuId', label: 'SKU ID' },
                    { prop: 'goodsName', label: '商品名称' },
                    { prop: 'firstTreeName', label: '一级品类' },
                    { prop: 'secondTreeName', label: '二级品类' },
                    { prop: 'brandName', label: '品牌' },
                    { prop: 'standard', label: '规格', },
                    { prop: 'model', label: '型号' },
                    { prop: 'saleUnitName', label: '单位', },
                    { prop: 'salePrice', label: '单价' },
                    { prop: 'goodsDemandAmount', label: '数量', },
                    { prop: 'itemTotalAmount', label: '金额' },
                    { prop: 'remark', label: '备注' },
                ],
                omItemColumns: [
                    { prop: 'skuId', label: 'SKU ID' },
                    { prop: 'goodsName', label: '商品名称' },
                    { prop: 'standard', label: '规格', },
                    { prop: 'colorNo', label: '色号' },
                    { prop: 'color', label: '色系' },
                    { prop: 'amount', label: '数量', },
                    { prop: 'fee', label: '调色费单价' },
                    { prop: 'itemTotalAmount', label: '金额' },
                ],
                formRule: {
                    remark: [
                        { required: true, message: "原因不能为空", trigger: "blur", whitespace: true },
                        { max: 50, min: 1, message: "原因不能超过50字符", trigger: "blur" }
                    ],
                },
                omItemGoodsVOS: [],
                omItemConfigVOS: [],
                formRebut: {
                    remark: null,
                },
                status: null,
                // 控制主表区域收缩
                isTopHide: false,
                mainActiveTab: '',
                // 点击关闭后的返回route
                goBackRoute: '/tuchat-delivery/demand-list',
                buttonType: false,
            }
        },
        created() {
            // 初始化通用query
            this.id = this.$route.query.id
            if (this.$route.query.status) {
                this.status = this.$route.query.status
                this.updateButton(this.status);
            }
            if (this.id > 0) {
                // 初始化
                this.initInfo()
            }
        },
        methods: {
            updateButton(status) {
                if (status == 3) {
                    this.symbolList = ['VIEW', 'EXPORT'];
                }
                else if (status == 8) {
                    this.symbolList = ['VIEW', 'RECEIVE', 'EXPORT']
                }
                else if (status == 5) {
                    this.symbolList = ['VIEW', 'EXPORT']
                }
                else if (status == 2) {
                    this.symbolList = ['VIEW', 'EXPORT']
                }
                else if (status == 1) {
                    this.symbolList = ['VIEW', 'RECEIVE', 'EXPORT']
                }
                else if (status == 4) {
                    this.symbolList = ['VIEW', 'PASS', 'REBUT', 'CANCEL', 'EXPORT']
                }
                else if (status == 0) {
                    this.symbolList = ['VIEW', 'CANCEL', 'EXPORT']
                }
            },
            onTopHide() {
                this.isTopHide = !this.isTopHide
            },
            /**
                 * 初始化参数
                 */
            initInfo() {
                let that = this;
                let args = { id: this.id };
                api.getOrderdetailOM(args)
                    .then((res) => {
                        if (res.data.status == 200) {
                            let result = res.data.result
                            that.formData = result.omOrderVO
                            that.formData.createTime = that.formData.createTime ? that.formData.createTime * 1000 : null
                            that.formData.verifyTime = that.formData.verifyTime ? that.formData.verifyTime * 1000 : null
                            that.formData.goodsDemandTime = that.formData.goodsDemandTime ? that.formData.goodsDemandTime * 1000 : null
                            that.formData.firstSendTime = that.formData.firstSendTime ? that.formData.firstSendTime * 1000 : null
                            that.formData.planDeliveryTime = that.formData.planDeliveryTime ? that.formData.planDeliveryTime * 1000 : null
                            that.formData.deliveryTime = that.formData.deliveryTime ? that.formData.deliveryTime * 1000 : null
                            that.formData.consigneeTime = that.formData.consigneeTime ? that.formData.consigneeTime * 1000 : null
                            that.omItemConfigVOS = result.omItemConfigVOS;
                            that.omItemGoodsVOS = result.omItemGoodsVOS;
                            if (!that.status || that.formData.orderStatus != that.status) {
                                that.updateButton(that.formData.orderStatus);
                                that.status = that.formData.orderStatus;
                            }
                        } else {
                            that.$msgbox({
                                title: '查询失败',
                                type: 'error',
                                message: error || '服务器异常',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            });
                        }
                    }).catch((error) => {
                        that.$msgbox({
                            title: '查询失败',
                            type: 'error',
                            message: error || '服务器异常',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        });
                    })
            },
            /**
             * 关闭弹窗
             */
            closeDialog() {
                this.$router.push({ path: this.goBackRoute })
                this.$emit('close')
            },
            pass() {
                this.$TCS.addTag('red_20553_002003004002');
                this.$refs['t8t-dark'].disableBySymbol('PASS');
                let status = this.formData.orderStatus
                if (status != 4) {
                    this.$message.error('订单非“待审核”状态，不允许审核订单')
                    this.$refs['t8t-dark'].unDisableBySymbol('PASS');
                    return
                }
                else if (this.formData.isCheckUser != 1) {
                    this.$message.error('您无权限审核此订单!')
                    return
                }
                else {
                    this.$confirm('确认审核通过？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let args = { goodsDemandId: this.id, isPass: 1 }
                        api.approveOrderOM(args)
                            .then((res) => {
                                if (res.data.status == 200) {
                                    this.$msgbox({
                                        title: '提交成功',
                                        type: 'success',
                                        message: '',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    }).then(() => {
                                        this.$refs['t8t-dark'].unDisableBySymbol('PASS');
                                        this.closeDialog();
                                    })
                                } else {
                                    this.$refs['t8t-dark'].unDisableBySymbol('PASS');
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
                                this.$refs['t8t-dark'].unDisableBySymbol('PASS');
                                this.$msgbox({
                                    title: '提交失败',
                                    type: 'error',
                                    message: error || '服务器异常',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            })
                    }).catch(() => {
                        this.$refs['t8t-dark'].unDisableBySymbol('PASS');
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                    return;
                }
            },
            rebut() {
                this.$TCS.addTag('red_20553_002003004003');
                let that = this
                let status = that.formData.orderStatus
                if (status != 4) {
                    this.$message.error('订单非“待审核”状态，不允许驳回订单')
                    return
                }
                else if (this.formData.isCheckUser != 1) {
                    this.$message.error('您无权限审核此订单!')
                    return
                }
                else {
                    this.dialogRebut = true;
                }
            },
            confirmRebut() {
                this.buttonType = true
                this.$refs.formRebut.validate((isValid) => {
                    if (isValid) {
                        let args = { goodsDemandId: this.id, isPass: 2, remark: this.formRebut.remark }
                        api.approveOrderOM(args)
                            .then((res) => {
                                this.buttonType = false
                                if (res.data.status == 200) {
                                    var _this = this
                                    this.$msgbox({
                                        title: '提交成功',
                                        type: 'success',
                                        message: '',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    }).then(() => {
                                        _this.cancelRebut();
                                        _this.closeDialog();
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
                    }
                    else {
                        this.buttonType = false;
                    }
                })
            },
            cancelRebut() {
                this.formRebut.remark = null;
                this.dialogRebut = false;
            },
            cancel() {
                this.$TCS.addTag('red_20553_002003004004');
                this.$refs['t8t-dark'].disableBySymbol('CANCEL');
                let that = this
                let status = that.formData.orderStatus
                if (status != 4 && status != 0) {
                    this.$message.error('*订单非“待审核、待发货状态”,不允许取消订单')
                    this.$refs['t8t-dark'].unDisableBySymbol('CANCEL');
                    return
                }
                else if (this.formData.isCancelUser != 1) {
                    this.$message.error('您无权限取消此订单!')
                    return
                }
                else {
                    this.$confirm('确认取消订单？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let args = { goodsDemandId: that.id }
                        api.cancelOrderOM(args)
                            .then((res) => {
                                if (res.data.status == 200) {
                                    var _this = this
                                    this.$msgbox({
                                        title: '提交成功',
                                        type: 'success',
                                        message: '',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    }).then(() => {
                                        _this.closeDialog();
                                        this.$refs['t8t-dark'].unDisableBySymbol('CANCEL');
                                    })
                                } else {
                                    this.$refs['t8t-dark'].unDisableBySymbol('CANCEL');
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
                                this.$refs['t8t-dark'].unDisableBySymbol('CANCEL');
                                this.$msgbox({
                                    title: '提交失败',
                                    type: 'error',
                                    message: error || '服务器异常',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            })
                    }).catch(() => {
                        this.$refs['t8t-dark'].unDisableBySymbol('CANCEL');
                    });
                    return;
                }
            },
            receive() {
                this.$TCS.addTag('red_20553_002003004005');
                this.$refs['t8t-dark'].disableBySymbol('RECEIVE');
                let that = this
                let status = that.formData.orderStatus
                if (status != 1 && status != 8) {
                    this.$message.error('请对已发货、已送达状态订单做收货操作')
                    this.$refs['t8t-dark'].unDisableBySymbol('RECEIVE');
                    return
                }
                else if (this.formData.isReceiveUser != 1) {
                    this.$message.error('您无权限对此订单进行收货!')
                    return
                }
                else {
                    that.$confirm('确认完成收货？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let args = { goodsDemandId: that.id }
                        api.confirmReceiptOM(args)
                            .then((res) => {
                                if (res.data.status == 200) {
                                    that.$msgbox({
                                        title: '提交成功',
                                        type: 'success',
                                        message: '',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    }).then(() => {
                                        that.closeDialog();
                                        that.$refs['t8t-dark'].unDisableBySymbol('RECEIVE');
                                    })
                                } else {
                                    that.$refs['t8t-dark'].unDisableBySymbol('RECEIVE');
                                    that.$msgbox({
                                        title: '提交失败',
                                        type: 'error',
                                        message: res.data.message,
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                }
                            }).catch((error) => {
                                that.$refs['t8t-dark'].unDisableBySymbol('RECEIVE');
                                that.$msgbox({
                                    title: '提交失败',
                                    type: 'error',
                                    message: error || '服务器异常',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            })
                    }).catch(() => {
                        this.$refs['t8t-dark'].unDisableBySymbol('RECEIVE');
                    });
                    return;
                }
            },
        }
    }

</script>

<style lang="css"
    scoped>
    .el-button+.el-button {
        margin-left: 2px;
    }

    .el-button--info {
        margin-left: 155px
    }
</style>