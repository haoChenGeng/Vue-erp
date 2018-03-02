<template>
    <div class="all-list">
        <t8t-search :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
            ref="tableSearch">
        </t8t-search>
        <div class="g-main-container all-list-class">
            <div class="g-main-container-column">
                <t8t-toolbar :symbolList="symbolList"
                    @VIEW="showDetail"
                    @PASS="pass"
                    @REBUT="rebut"
                    @CANCEL="cancel"
                    @RECEIVE="receive"
                    @EXPORT="exportOrder"
                    ref="toolbar">
                </t8t-toolbar>
                <t8t-table class="all_list"
                    :columns="columns"
                    :service="service"
                    :method="method"
                    :args="args"
                    :pageBar="true"
                    :commonData="commonData"
                    :preLoad=false
                    :indexCol=true
                    ref="t8tTable"
                    @row-double-click="doubbleShowDetail">
                </t8t-table>
            </div>
        </div>
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
        <div @click="updateTabNum"></div>
    </div>
</template>

<script>
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
    import DateUtils from 'src/utils/DateUtils.js'
    import Service from 'src/services/delivery/goodsDemand/Service.js'
    import api from 'src/services/delivery/goodsDemand/surcharge.js'
    export default {
        name: 'all-list',
        components: {
            //嵌套页面如添加编辑详情
        },
        data() {
            let that = this;
            return {
                // opportunitiesAddRoute: 'sales-opportunities-add',
                symbolList: ['VIEW', 'PASS', 'REBUT', 'CANCEL', 'RECEIVE', 'EXPORT'],
                //搜索表单项配置
                fields: [
                    { type: 'select', label: '订单类型', name: 'orderSource', selectSourceKey: 'orderSource_arr', filterable: true },
                    { type: 'input', label: '订单编号', name: 'orderCode' },
                    { type: 'input', label: '详细地址', name: 'receiveAddress' },
                    { type: 'datetime', label: '下单日期', name: 'createTime', pickertype: 'daterange', startField: 'createStartTime', endField: 'createEndTime' },
                    { type: 'input', label: '项目ID', name: 'sourceProjectId' },
                    { type: 'input', label: '业主名称', name: 'ownerName' },
                    { type: 'input', label: '收货人', name: 'receiveName' },
                    { type: 'datetime', label: '收货日期', name: 'consigneeTime', pickertype: 'daterange', startField: 'consigneeStartTime', endField: 'consigneeEndTime' },
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    orderSource_arr: [
                        {
                            text: '平台辅材',
                            value: 1
                        },
                        {
                            text: '非平台辅材',
                            value: 2
                        },
                        // {
                        //     text: '批量采购',
                        //     value: 3
                        // },
                    ],
                },
                columns:
                [
                    {
                        "prop": "orderSource", "label": "订单类型", list: 'source_arr',
                    },
                    { "prop": "orderCode", "label": "订单编号", "width": "230px" },
                    {
                        "prop": "orderStatus", "label": "订单状态", list: 'status_arr',
                    },
                    { "prop": "receiveName", "label": "收货人" },
                    { "prop": "receiveAddress", "label": "收货地址" },
                    {
                        "prop": "sourceProjectId", "label": "项目ID", "formatter": function (val, row, col) {
                            return val == 0 ? "" : val;
                        }
                    },
                    { "prop": "ownerName", "label": "业主名称" },
                    { "prop": "totalMoney", "label": "订单总金额" },
                    {
                        "prop": "createTime", "label": "下单时间", "formatter": function (val, row, col) {
                            return that.dateParser(row.createTime)
                        }, "width": "130px"
                    },
                    {
                        "prop": "verifyTime", "label": "审核时间", "formatter": function (val, row, col) {
                            return that.dateParser(row.verifyTime)
                        },
                    },
                    {
                        "prop": "firstSendTime", "label": "发货时间", "formatter": this.dateParser,
                    },
                    {
                        "prop": "deliveryTime", "label": "送达时间", "formatter": this.dateParser
                    },
                    {
                        "prop": "consigneeTime", "label": "收货时间", "formatter": this.dateParser
                    },
                ],
                commonData: {
                    source_arr: [
                        {
                            text: '批量采购',
                            value: 3
                        },
                        {
                            text: '平台辅材',
                            value: 4
                        },
                        {
                            text: '非平台辅材',
                            value: 5
                        },
                        {
                            text: '平台辅材',
                            value: 6
                        },
                        {
                            text: '非平台辅材',
                            value: 7
                        },
                    ],
                    status_arr: [
                        {
                            text: '待发货',
                            value: 0
                        },
                        {
                            text: '已发货',
                            value: 1
                        },
                        {
                            text: '已收货',
                            value: 2
                        },
                        {
                            text: '取消',
                            value: 3
                        },
                        {
                            text: '待审核',
                            value: 4
                        },
                        {
                            text: '已驳回',
                            value: 5
                        },
                        {
                            text: '新建（暂存）',
                            value: 6
                        },
                        {
                            text: '待报备',
                            value: 7
                        },
                        {
                            text: '已送达',
                            value: 8
                        }
                    ],
                },
                formRule: {
                    remark: [
                        { required: true, message: "原因不能为空", trigger: "blur", whitespace: true },
                        { max: 50, min: 1, message: "原因不能超过50字符", trigger: "blur" }
                    ],
                },
                service: Service.DEMAND.name,
                method: Service.DEMAND.methods.OMQUERYPAGE,
                args: null,
                filterData: {},
                //弹窗dialog配置
                formRebut: {
                    remark: null,
                },
                dialogRebut: false,
                buttonType: false,
            }
        },
        created() {
            this.initTableInfo();
            // this.initOpportunitiesList();
            // this.initSelectSource();
            //   this.initOpportunitiesList();
        },
        activated() {
            let tab = Cookie.get('demand_list_tab');
            if (tab == 'allList') {
                this.updateTabNum();
                this.$refs['t8tTable'].reloadTable();
            }
        },
        methods: {
            updateTabNum() {
                this.$emit('updateTabNum'); //主动触发updateTabNum方法
            },
            dateParser(text) {
                let dateString;
                let objDate = new Date(text * 1000);
                if (text === 0 || text === null) {
                    dateString = ""
                } else {
                    dateString = DateUtils(objDate, 'yyyy-mm-dd HH:MM')
                }
                return dateString
            },
            initTableInfo() {
                if (this.$refs.tableSearch != undefined) {
                    this.$refs.tableSearch.resetForm();
                }
                let search = this.filterData;
                this.args = { search: search, sort: ["createTime_desc"] }
            },
            submitSearch(obj) {
                if (obj.sourceProjectId) {
                    if (!/^\d+$/.test(obj.sourceProjectId)) {
                        this.$message.error('请在项目ID框中输入数字！')
                        return
                    }
                }
                if (obj.orderSource != null) {
                    if (obj.orderSource == 1) {
                        obj.orderSource = [4, 6];
                    }
                    else if (obj.orderSource == 2) {
                        obj.orderSource = [5, 7];
                    }
                    else {
                        obj.orderSource = [3];
                    }
                }
                if (obj.createStartTime && obj.createEndTime) {
                    obj.createEndTime = obj.createEndTime + 86399
                }
                if (obj.consigneeStartTime && obj.consigneeEndTime) {
                    obj.consigneeEndTime = obj.consigneeEndTime + 86399
                }
                this.args = { search: Object.assign({}, this.filterData, obj), sort: ["createTime_desc"] }
                this.updateTabNum();
            },
            showDetail() {
                this.$TCS.addTag('red_20553_002003003001');
                let selections = this.$refs['t8tTable'].getSelectRows()
                let that = this
                if (selections.length < 1) {
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if (selections.length > 1) {
                    this.$message.error('只能选择一行进行操作')
                    return
                }
                let row = selections[0];
                this.$router.push({ path: '/tuchat-delivery/demand-view', query: { id: row.id, status: row.orderStatus } })
            },
            doubbleShowDetail(row, event, selectable) {
                this.$router.push({ path: '/tuchat-delivery/demand-view', query: { id: row.id, status: row.orderStatus } })
            },
            pass() {
                this.$TCS.addTag('red_20553_002003003002');
                let selections = this.$refs['t8tTable'].getSelectRows()
                let _this = this
                if (selections.length < 1) {
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if (selections.length > 1) {
                    this.$message.error('只能选择一行进行操作')
                    return
                }
                let row = selections[0];
                if (row.orderStatus != 4) {
                    this.$message.error('订单非“待审核”状态，不允许审核订单')
                    return
                }
                else if (row.isCheckUser != 1) {
                    this.$message.error('您无权限审核此订单!')
                    return
                }
                else {
                    _this.$confirm('确认审核通过？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let args = { goodsDemandId: row.id, isPass: 1 }
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
                                        _this.$refs['t8tTable'].reloadTable();
                                        _this.updateTabNum();
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
                    }).catch(() => {
                        _this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                    return;
                }
            },
            rebut() {
                this.$TCS.addTag('red_20553_002003003003');
                let selections = this.$refs['t8tTable'].getSelectRows()
                let that = this
                if (selections.length < 1) {
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if (selections.length > 1) {
                    this.$message.error('只能选择一行进行操作')
                    return
                }
                let row = selections[0];
                if (row.orderStatus != 4) {
                    this.$message.error('订单非“待审核”状态，不允许驳回订单')
                    return
                }
                else if (row.isCheckUser != 1) {
                    this.$message.error('您无权限审核此订单!')
                    return
                }
                else {
                    this.dialogRebut = true;
                }
            },
            confirmRebut() {
                this.buttonType = true;
                this.$refs.formRebut.validate((isValid) => {
                    if (isValid) {
                        let row = this.$refs['t8tTable'].getSelectRows()[0];
                        let args = { goodsDemandId: row.id, isPass: 2, remark: this.formRebut.remark };
                        api.approveOrderOM(args)
                            .then((res) => {
                                this.buttonType = false;
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
                                        _this.$refs['t8tTable'].reloadTable()
                                        _this.updateTabNum();
                                        _this.cancelRebut();
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
                this.$TCS.addTag('red_20553_002003003004');
                let selections = this.$refs['t8tTable'].getSelectRows()
                let that = this
                if (selections.length < 1) {
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if (selections.length > 1) {
                    this.$message.error('只能选择一行进行操作')
                    return
                }
                let row = selections[0];
                if (row.orderStatus != 4 && row.orderStatus != 0) {
                    this.$message.error('*订单非“待审核、待发货状态”,不允许取消订单')
                    return
                }
                else if (row.isCancelUser != 1) {
                    this.$message.error('您无权限取消此订单!')
                    return
                }
                else {
                    this.$confirm('确认取消订单？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let args = { goodsDemandId: row.id }
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
                                        that.$refs['t8tTable'].reloadTable();
                                        that.updateTabNum();
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
                                this.$msgbox({
                                    title: '提交失败',
                                    type: 'error',
                                    message: error || '服务器异常',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            })
                    })
                }
            },
            receive() {
                this.$TCS.addTag('red_20553_002003003005');
                let selections = this.$refs['t8tTable'].getSelectRows()
                let that = this
                if (selections.length < 1) {
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if (selections.length > 1) {
                    this.$message.error('只能选择一行进行操作')
                    return
                }
                let row = selections[0];
                if (row.orderStatus != 1 && row.orderStatus != 8) {
                    this.$message.error('请对已发货、已送达状态订单做收货操作')
                    return
                }
                else if (row.isReceiveUser != 1) {
                    this.$message.error('您无权限对此订单进行收货!')
                    return
                }
                else {
                    that.$confirm('确认完成收货？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let args = { goodsDemandId: row.id }
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
                                        that.$refs['t8tTable'].reloadTable()
                                        that.updateTabNum();
                                        that.closeDialog();
                                    })
                                } else {
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
                                that.toolbarDisabledSymbols.pop()
                                that.$msgbox({
                                    title: '提交失败',
                                    type: 'error',
                                    message: error || '服务器异常',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            })
                    })
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