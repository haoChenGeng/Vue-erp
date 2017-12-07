<template>
    <div class="receiptsTableDialog">
        <el-dialog @close="closeDialog()"
                   v-model="dialogVisible"
                   class="receipts-table-dialog"
                   :title="dialogSet.title">
            <div class="page-pay-plan">
                <div class="g-main-container-column">
                    <t8t-table
                        :columns="dialogSet.columns"

                        ref="receiptsTables"
                        :commonData="selectSource"

                        :service="dialogSet.service"
                        :method="dialogSet.method"
                        :args="dialogSet.args"

                        :dataSource="dialogSet.dataSource"
                        :pageBar="dialogSet.pageBar"
                        :selectCol="dialogSet.selectCol"
                        :indexCol="dialogSet.indexCol"
                        :editable="dialogSet.editable"
                        @data-loaded="checkData"

                    ></t8t-table>
                </div>
            </div>
            <div slot="footer">
                <el-button v-if="dialogSet.btns.receive" type="primary" @click="receiveBtn" :isLoading="btnLoading"
                           :disabled="btnDisabled">确认收货
                </el-button>
                <el-button v-if="dialogSet.btns.confirmclose" type="primary" @click="closeBtn" :isLoading="btnLoading"
                           :disabled="btnDisabled">确认关闭
                </el-button>
                <el-button v-if="dialogSet.btns.cancels" @click="closeDialog">取消</el-button>
                <el-button v-if="dialogSet.btns.back" @click="closeDialog">返回</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import schema from './goodsDemand-schema.js'
    import Service from 'src/services/delivery/Service.js'
    import DemandApi from 'src/services/delivery/demand.js'
    import Cookie from 'js-cookie'
    //todo 接口引入

    export default {
        name: "receipts-table-dialog",
        data() {
            return {
                btns: {
                    confirmclose: true,
                    cancels: true,
                    back: true,
                    receive: true,
                },
                selectArr: [],
                selectSource: {
                    statusOptions: [],
                    orderStatusOption:[
                        {text: "待发货", value: 0},
                        {text: "已发货", value: 1},
                        {text: "已收货", value: 2},
                        {text: "取消", value: 3},
                        {text: "待审核", value: 4},
                        {text: "已驳回", value: 5},
                        {text: "新建（暂存）", value: 6},
                        {text: "待报备", value: 7}
                    ],
                },
                checkboxSet: false,
                dialogVisible: true,
                columns: schema.receiveTable,
                testData: [],
                receiptData: [],
                repeatArrOrigin: [],
                title: '',
                closeAfter:false,
                dialogSet: {

                    selectCol: true,
                    pageBar: true,
                    indexCol: true,
                    title: '',
                    btns: {
                        confirmclose: true,
                        cancels: true,
                        back: true,
                        receive: true
                    },
                    service: '',
                    method: '',
                    args: {},
                    columns: '',
                    dataSource: [],
                    editable: false
                },
                btnLoading: false,
                btnDisabled: false,
            }
        },
        props: ["tableDialogSet"],
        created() {
            this.selectSource.statusOptions = this.statusOptions
            let dialogSet = this.tableDialogSet
            if (dialogSet) {
                switch (dialogSet.type) {
                    case 'receive':
                        this.dialogSet = {
                            selectCol: false,
                            pageBar: false,
                            indexCol: true,
                            editable: true,
                            title: "确认收货",
                            btns: {
                                cancels: true,
                                receive: true
                            },
                            service: Service.DEMAND.name,
                            method: Service.DEMAND.methods.ITEMQUERYORDERALLITEM,
                            args: dialogSet.args,
                            columns: schema.dialogCommonTable,
                            dataSource: dialogSet.dataSource
                        }
                        this.dialogSet.columns[7].width = 124
                        break
                    case 'close':
                        this.dialogSet = {
                            selectCol: true,
                            pageBar: true,
                            indexCol: true,
                            editable: false,
                            title: "关闭要货",
                            btns: {
                                confirmclose: true,
                                cancels: true
                            },
                            service: Service.DEMAND.name,
                            method: Service.DEMAND.methods.ITEMQUERYPAGEALLITEM,
                            args: dialogSet.args,
                            columns: schema.dialogCommonTable,
                            dataSource: dialogSet.dataSource
                        }
                        break
                    case 'detail':
                        this.dialogSet = {
                            selectCol: false,
                            pageBar: false,
                            indexCol: true,
                            editable: false,
                            title: "要货明细",
                            btns: {
                                back: true
                            },
                            service: Service.DEMAND.name,
                            method: Service.DEMAND.methods.ITEMQUERYDETAIL,
                            args: dialogSet.args,
                            columns: schema.dialogDetailTable,
                        }
                        break
                    case 'demand':
                        this.dialogSet = {
                            selectCol: false,
                            pageBar: true,
                            indexCol: true,
                            editable: false,
                            title: "要货明细",
                            btns: {
                                back: true
                            },
                            service: Service.DEMAND.name,
                            method: Service.DEMAND.methods.ITEMQUERYDETAIL,
                            args: dialogSet.args,
                            columns: schema.dialogDemandTable
                        }
                        break
                    default:
                        return false
                }
            } else {
                return false
            }


        },
        methods: {
            onPayBtn(){
                this.SelectArr = this.$refs['t8ttable1'].getSelectRows();
                if (!this.SelectArr.length) {
                    this.$message.error('请勾选数据后再试')
                    return false
                }
                this.$emit('checkRemit', this.SelectArr)

            },
            onReject(){
                this.SelectArr = this.$refs['t8ttable1'].getSelectRows();
                if (!this.SelectArr.length) {
                    this.$message.error('请勾选数据后再试')
                    return false;
                }
                this.$emit('rejectRemit', this.SelectArr)
                this.$emit('close')
            },
            onView() {
                let selections = this.$refs['t8ttable1'].getSelectRows()
                let that = this
                if (selections.length !== 1) {
                    this.$message.error('请勾选一行数据后再试。')
                    return
                }
                // 弹窗查看
                this.$router.push()
            },
            checkData(){
                if(this.closeAfter && this.tableDialogSet.type == 'close' && this.$refs['receiptsTables'].dataSource.length < 1){
                    this.$parent.$refs['list-view'].getTableInstance().reloadTable()
                    this.closeDialog()
                }
            },
            closeDialog() {
//                this.$router.push({ path: '/tochat-delivery/demand-list'})
                this.$emit('close')
            },
            closeBtn() {
                let _self = this
                let _select = this.$refs['receiptsTables'].getSelectRows()
                let _list = []
                if (_select.length > 0) {
                    for (let item in _select) {
                        _list.push(_select[item].id)
                    }
                } else {
                    this.$message.error("请选择要关闭的单据后重试")
                    return false
                }
                this.$confirm('是否确认关闭要货单？', '关闭确认', {
                    type: 'warning',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then((confirm) => {
                    _self.setBtn("disabled")
                    DemandApi.closeOrder({
                        ids: _list,
                        updateBy: Cookie.get('t8t-tc-username'),
                        updateUser: Cookie.get('t8t-tc-uid')
                    })
                        .then((res) => {
                            _self.setBtn("unDisabled")
                            if (res.data && res.data.status == 200) {
                                _self.$msgbox({
                                    title: '消息',
                                    message: '操作成功',
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                }).then(() =>{
                                        _self.closeAfter = true
                                        _self.$refs['receiptsTables'].reloadTable()
                                })
                                return false
                            } else {
                                _self.$msgbox({
                                    title: '消息',
                                    message: res.data.message || '关闭失败',
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                return false
                            }
                        })
                        .catch((error) => {
                            _self.setBtn("unDisabled")
                            _self.$msgbox({
                                title: '消息',
                                message: error || '关闭失败',
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            return false
                        })
                }).catch(() => {
                    // 关闭弹窗
                    return
                })
            },
            receiveBtn() {
                let _self = this
                if(_self.$refs['receiptsTables'].dataSource.length  <=0){
                    this.$message.error("物品读取错误！")
                    return false
                }
                if(_self.$refs['receiptsTables'].dataSource.every((element, index, array) => element.realReceiptAmount == 0)){
                    this.$message.error("请输入收货数量")
                    return false
                }
                this.$refs['receiptsTables'].validate((validate) => {
                    if (validate) {
                        let _params = []
                        let _rows = _self.$refs['receiptsTables'].dataSource
                        if (_rows.length > 0) {
                            _rows.forEach((item) => {
                                _params.push({lineId: item.id, realReceiptAmount: item.realReceiptAmount})
                            })
                        }
                        let args = {
                            confirmDTOS: _params,
                            updateUser:Cookie.get('t8t-tc-uid')
                        }
                        _self.setBtn("disabled")
                        DemandApi.confirmReceipt(args).then((res) => {
                            if (res.data && res.data.status == 200) {
                                _self.setBtn("unDisabled")
                                _self.$msgbox({
                                    title: '消息',
                                    message: '操作成功',
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                }).then((res) =>{
                                    _self.closeDialog()
                                    _self.$parent.$refs['list-view'].getTableInstance().reloadTable()
                                })

                            } else {
                                _self.$msgbox({
                                    title: '消息',
                                    message: res.data.message || '操作失败',
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                return
                            }
                        }).catch((error) => {
                            _self.setBtn("unDisabled")
                            _self.$msgbox({
                                title: '消息',
                                message: error || '操作失败',
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            return
                        })
                    }
                }, true)
            },
            setBtn(type) {
                switch (type) {
                    case "disabled":
                        this.btnLoading = true
                        this.btnDisabled = true
                        break;
                    case "unDisabled":
                        this.btnLoading = false
                        this.btnDisabled = false
                        break;
                }
            }
        }
    }
</script>

<style lang="css" scope>
    .receiptsTableDialog .receipts-table-dialog .el-dialog--small {
        width: 800px;
    }

    .receiptsTableDialog .receipts-table-dialog .table-container {
        min-height: 360px;
    }

</style>
