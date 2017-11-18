<template>
    <div class="t8t-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new" >
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                            :symbolList="symbolList"
                            @SAVE="save"
                            @EDIT-SUBMIT="submit"
                            @EDIT-ORDER="editOrder"
                            @CONFIRM="confirm"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <!-- 表单区 -->
                <div class="full-dialog-form-container container-center">
                    <!-- 审批 -->
                    <el-form
                        label-position="right"
                        label-width="110px"
                        :model="approveFormData"
                        :rules="approveFormRule"
                        ref="approveForm"
                        v-if="approveFormVisible"
                    >
                        <el-form-item label="审批结论:" prop="status">
                            <el-radio-group v-model="approveFormData.status">
                                <el-radio label="1">通过</el-radio>
                                <el-radio label="2">驳回</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="审批意见:" prop="comment">
                            <el-input type="textarea" v-model.trim="approveFormData.comment"></el-input>
                        </el-form-item>
                    </el-form>
                    <!--  -->
                    <el-form ref="ruleForm"
                             label-position="right"
                             label-width="110px"
                             :model="formData"
                             :inline="true"
                             :show-message="false"
                    >
                        <el-form-item label="优惠审批单编码:" prop="code">
                            <el-input v-model="orderCode" :placeholder="codeTips" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="项目ID:" prop="yid">
                            <el-input v-model="formData.yid" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="状态:" prop="statusName">
                            <el-input v-model="formData.statusName" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间:" prop="createTimeStr">
                            <el-input v-model="formData.createTimeStr" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="门店:" prop="organizationName">
                            <el-input v-model="formData.organizationName" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="业主称呼:" prop="ownerName">
                            <el-input v-model="formData.ownerName" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="详细地址:" prop="houseAddress">
                            <el-tooltip class="item" effect="dark" :content="formData.houseAddress" placement="bottom">
                                <el-input v-model="formData.houseAddress" readonly></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="计价面积:" prop="houseArea">
                            <el-input v-model="formData.houseArea" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="合同金额:" prop="totalPrice">
                            <el-input v-model="formData.totalPrice" readonly></el-input>
                        </el-form-item>

                        <t8t-table
                            :columns="columns"
                            :service="service"
                            :method="method"
                            :args="tableArgs"
                            :pageBar="false"
                            :preLoad="false"
                            :dataSource="tableDataSource"
                            :selectCol="tableSelectCol"
                            ref="t8tTable"
                            @data-loaded="tableLoaded"
                        ></t8t-table>
                    </el-form>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import DateUtils from 'src/utils/DateUtils.js'
    import Service from 'src/services/salemanager/Service.js'
    import Api from 'src/services/salemanager/approveDiscount.js'
    import { mb } from 'src/components/t8t-table/utils/utils.js'
    import Cookie from 'js-cookie'

    export default {
        name: 't8t-dt-view',
        data () {
            return {
                isDialogShow: true,
                /* 表单数据 */
                formData: {},
                mainActiveTab: 'tab1',
                /* 列表页路由 */
                goBackRoute: '/salemanager/discount-approve-bills',
                /* 优惠单列表路由 */
                orderRoute: '/salemanager/discount-bills',
                columns:[
                    {prop: 'code', label: '现金优惠单编码'},
                    {prop: 'templateName', label: '现金优惠券名称'},
                    {prop: 'privilegeAmount', label: '优惠金额'},
                    {prop: 'paymentName', label: '支付款项用途'},
                    {prop: 'createTime', label: '发放时间', formatter: 'dateParser'},
                    {prop: 'createBy', label: '发放人'}
                ],
                service: Service.CASHDISCOUNT.name,
                method: Service.CASHDISCOUNT.methods.PRIVILEGEORDERLIST,
                tableArgs:{
                    search: {
                        bindId: null, // 项目id
                        status: 0
                    }
                },
                /* 审配批表单数据 */
                approveFormData: {
                    status: '',
                    comment: ''
                },
                /* 审批表单校验规则 */
                approveFormRule: {
                    status: [{ required: true, message: '请选择审批结论', trigger: 'change' }],
                    comment: [{validator: this.adviceValidate, trigger: 'blur'}]
                },
                /* 操作数组 */
                mode: 'add',
                /* 选中的优惠单数组 */
                selectRows: [],
                /* 优惠审批单ID */
                orderId: null,
                /* 优惠审批单编码 */
                orderCode: '',
                /* 优惠审批单状态 */
                orderStatus: null,
                /* 表格参数 */
                tableDataSource: [],
                tableSelectCol: true,
                /* 流程Id */
                procInsId: null,
                /* 表格显示多少 */
                pageSize: 100
            }
        },
        computed: {
            /* 在有权限的情况下控制按钮显示 */
            symbolList () {
                let btns = []
                /* 审批页面 */

                if (this.approveFormVisible) {
                    if (this.orderStatus === 1) {
                        return ['CONFIRM']
                    }
                    else {
                        return ['']
                    }
                }
                /* 非审批页面 */
                else {
                    switch (this.orderStatus) {
                        case 0:
                            btns = ['SAVE', 'EDIT-SUBMIT', 'EDIT-ORDER']
                            break
                        case 1:
                            btns = ['']
                            break
                        case 2:
                            btns = ['']
                            break
                        default:
                            btns = ['SAVE', 'EDIT-SUBMIT', 'EDIT-ORDER']
                            break
                    }
                }
                return btns
            },
            /* 是否显示审批操作 */
            approveFormVisible () {
                return this.mode === 'approve' || this.$route.path === '/salemanager/discount-approve-bills/approve'
            },
            codeTips () {
                return this.orderCode ? this.orderCode : '编码自动生成'
            }
        },
        created () {
            this.mode = this.$route.query.mode
            /* 审批页 */
            if(this.$route.path === '/salemanager/discount-approve-bills/approve') {
                this.procInsId = this.$route.query.procInsId
            }
            if(this.mode !== 'add') {
                this.orderId = this.$route.query.id
            }
            /* 表单数据加载 */
            this.formDataLoad()
        },
        mounted () {
            this.$nextTick(() => {
                if (this.mode === 'add') {
                    this.tableArgs = {
                        search: {
                            bindId: this.$route.query.yid,
                            status: 0
                        }
                    }
                    this.$nextTick(() => {
                        this.$refs.t8tTable.reloadTable({
                            pageSize: this.pageSize
                        })
                    })
                }
            })

        },
        methods: {
            onTopHide ()
            {
                this.isTopHide = !this.isTopHide
            },
            /* 关闭弹窗 */
            closeDialog ()
            {
                this.$router.push({path: this.goBackRoute})
            },
            /* 保存 */
            save ()
            {
                let rows = this.$refs.t8tTable.getSelectRows()
                if (!rows || rows.length === 0) {
                    this.$message.error('请勾选优惠单')
                    return
                }
                let items = this.selectRowToItems(rows)
                if (this.mode === 'add') {
                    this.addSave(items)
                }
                else {
                    this.updateSave(items)
                }
            },
            /* 提交 */
            submit ()
            {
                let rows = this.$refs.t8tTable.getSelectRows()
                if (!rows || rows.length === 0) {
                    this.$message.error('请勾选优惠单')
                    return
                }
                let items = this.selectRowToItems(rows)
                if (this.orderId) {
                    this.updateSubmit(items)
                }
                else {
                    this.createSubmit(items)
                }
            },
            /* 新增提交 直接创建一条审核中的优惠单 */
            createSubmit(items = [])
            {
                let args = {
                    createDto: {
                        yid: this.formData.yid,
                        items: items
                    },
                    createUserId: Cookie.get('t8t-tc-uid')
                }
                Api.createSubmit(args)
                    .then(res => {
                        this.dialogTips(res, '提交成功')
                    })
            },
            /* 编辑提交 暂存状态变为审核中的优惠单 */
            updateSubmit(items = [])
            {
                let args = {
                    updateDto: {
                        id: this.orderId,
                        yid: this.formData.yid,
                        items: items
                    },
                    updateUserId: Cookie.get('t8t-tc-uid')
                }
                Api.updateSubmit(args)
                    .then(res => {
                        this.dialogTips(res, '提交成功')
                    })
            },
            /* 编辑优惠单 跳转到优惠单列表 */
            editOrder ()
            {
                window.location.href = '#' + this.orderRoute + '?bindId=' + this.formData.yid

                window.location.reload()
            },
            /* 表单数据加载 */
            formDataLoad ()
            {
                /* 设置页面数据 */
                let _that = this
                const setData = function (res) {
                    _that.selectRows = res.data.result.itemVos
                    _that.orderCode = res.data.result.code
                    _that.orderStatus = res.data.result.status
                    let yid = res.data.result.yid
                    _that.tableArgs = {
                        search: {
                            bindId: yid,
                            status: 0
                        }
                    }
                    _that.$nextTick(() => {
                        _that.$refs.t8tTable.reloadTable({
                            pageSize: _that.pageSize
                        })
                    })
                    _that.getItemInfoByYid(yid)
                }

                /* 添加操作 */
                if (this.mode === 'add') {
                    let yid = this.$route.query.yid
                    this.formData.yid = yid
                    this.getItemInfoByYid(yid)
                }
                /* 编辑或者审核操作 */
                else if(this.mode === 'edit' || this.mode === 'approve') {
                    let args = {
                        orderId: this.orderId
                    }
                    Api.findApproveOrderById(args)
                        .then(res => {
                            if(res.data.status === 200) {
                                setData(res)
                            }
                        })
                }
                /* 流程中心跳转过来审批操作 */
                else if(this.procInsId) {
                    let args = {
                        search: {
                            procInsId: this.procInsId
                        },
                        page: 1,
                        size: 1
                    }
                    Api.listApproveOrder(args)
                        .then(res => {
                            if (res.data.status === 200) {
                                let id = res.data.result.rows[0].id
                                this.orderId = id
                                let param = {
                                    orderId: id
                                }
                                return Api.findApproveOrderById(param)
                            }
                        })
                        .then(res => {
                            if(res.data.status === 200) {
                                setData(res)
                            }
                        })
                }
            },
            /* 表格数据加载事件 */
            tableLoaded (dataSource)
            {
                /* 下次事件循环进行数据回写 */
                this.$nextTick(() => {
                    let rowIds = []
                    for (let index in this.selectRows) {
                        rowIds.push(this.selectRows[index].orderId)
                    }
                    let rows = dataSource.filter((item) => {
                        return rowIds.indexOf(item.id) !== -1
                    })
                    /* 审批页和非暂存状态后只展示选中的优惠审批单 */
                    if (this.approveFormVisible || (this.orderStatus !== 0 && this.orderStatus !== null) ) {
                        this.tableDataSource = rows
                        this.tableSelectCol = false
                    }
                    else {
                        this.tableDataSource = dataSource
                        this.$refs.t8tTable.$refs.table.store.states.selection = rows
                        this.$refs.t8tTable.selectionChange(rows)
                    }
                })
            },
            getItemInfoByYid(yid)
            {
                let args = {
                    orderId: yid
                }
                Api.findItemInfoByYid(args)
                    .then(res => {
                        if (res.data.status === 200) {
                            let result = res.data.result
                            this.formData = {
                                yid: result.id,
                                statusName: result.statusName,
                                createTimeStr: result.createTime > 0 ? DateUtils(result.createTime*1000, 'isoDate')+' '+DateUtils(result.createTime*1000, 'isoTime') : '',
                                organizationName: result.organizationName,
                                ownerName: result.ownerName,
                                houseAddress: result.houseAddress,
                                houseArea: result.houseArea,
                                totalPrice: result.totalPrice
                            }
                        }
                        else {
                            this.$msgbox(mb('获取项目信息失败, 请刷新后重试', 'error'))
                        }
                    })
            },
            /* 审批意见校验 */
            adviceValidate(rule, value, callback)
            {
                let status = this.approveFormData.status
                if (status == 2) {
                    if (value === '' || value === undefined || value === null) {
                        callback(new Error('请填写审批意见'))
                    }
                }
                callback()
            },
            /* 审批确认 */
            confirm()
            {
                this.$refs.approveForm.validate(valid => {
                    if (valid) {
                        if (this.orderStatus !== 1) {
                            this.$message.error('该优惠审批单状态不为审核中，不能进行审核')
                            return
                        }
                        let status = this.approveFormData.status
                        /* 审批通过 */
                        if (status == 1) {
                            let args = {
                                verifyId : this.orderId,
                                verifyComment: this.approveFormData.comment,
                                verifyUserId: Cookie.get('t8t-tc-uid')
                            }
                            Api.verifyProcess(args)
                                .then(res => {
                                    this.dialogTips(res)
                                })
                        }
                        /* 审批驳回 */
                        else if(status == 2) {
                            let args = {
                                rejectId : this.orderId,
                                verifyComment: this.approveFormData.comment,
                                verifyUserId: Cookie.get('t8t-tc-uid')
                            }
                            Api.rejectProcess(args)
                                .then(res => {
                                    this.dialogTips(res)
                                })
                        }
                    }
                })

            },
            /* 新增保存 */
            addSave(items)
            {
                let createDto = {
                    yid: this.formData.yid,
                    items: items
                }
                let args = {
                    createDto: createDto,
                    createUserId: Cookie.get('t8t-tc-uid')
                }
                Api.createApprove(args)
                    .then(res => {
                        this.dialogTips(res, '新增成功')

                    })
            },
            /* 编辑保存 */
            updateSave(items)
            {
                let updateDto = {
                    id: this.orderId,
                    yid: this.formData.yid,
                    items: items
                }
                let args = {
                    updateDto: updateDto,
                    updateUserId: Cookie.get('t8t-tc-uid')
                }
                Api.updateApprove(args)
                    .then(res => {
                        this.dialogTips(res, '编辑成功')
                    })
            },
            /* 格式化选中的行数据 */
            selectRowToItems(rows)
            {
                let items = []
                for (let index in rows) {
                    items.push({
                        orderId: rows[index].id, // 优惠单ID
                        orderCode: rows[index].code, // 优惠单编码
                        templateId: rows[index].templateId, // 现金优惠券id
                        templateName: rows[index].templateName, // 现金优惠券模板名称
                        privilegeAmount: rows[index].privilegeAmount, // 优惠金额
                        payment: rows[index].payment, // 支付款项用途
                        approveId: this.orderId // 审批单ID
                    })
                }
                return items
            },
            /* 弹窗提示 */
            dialogTips(res, msg = '操作成功')
            {
                if (res.data.status === 200) {
                    this.$msgbox(mb(msg, 'success'), () => {
                        this.closeDialog()
                    })
                } else {
                    this.$msgbox(mb(res.data.message, 'error'))
                }
            }
        }
    };
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
</style>
