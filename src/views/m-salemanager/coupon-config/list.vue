<!--
 * File: list.vue
 * Comment:优惠券
 * Created by WebStorm.
 * User: tony.huang
 * Date: 2018/1/17
 * Time: 16:16
 -->
<template>
    <div>
        <t8t-breadcrumb></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            @submit="submitSearch"
            :selectSource="selectSource"
            ref="searchBar"></t8t-search>
        <t8t-toolbar
            ref="couponToolbar"
            @CREATE="dialogDeal('create')"
            @SHOW="showBtn"
            @CANCEL="cancelBtn"
            @EDIT="dialogDeal('edit')"
            @DELETE="deleteBtn"
            :disabledSymbols="toolbarDisabledSymbols">
        </t8t-toolbar>
        <t8t-grid
            :path="path"
            :columns="columns"
            :commonData="selectSource"
            :args="args"
            ref="couponTable"
            @selection-change="selectionChange"
            :pageSizes="[5,10,20,50,100]">
        </t8t-grid>
        <el-dialog :title="dialogTitle" class="g-w-460 coupon-config-dialog" v-model="showDialog" @close="cancel">
            <el-form v-if="showDialog" :model="formData" :label-position="left" label-width="100px" :rules="rules"
                     ref="couponForm">
                <el-form-item label="有效时间：" prop="times">
                    <el-date-picker
                        v-model.trim="formData.times"
                        type="daterange"
                        align="left"
                        placeholder="选择日期范围">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="优惠内容：" prop="discountsContent" :size="small">
                    <el-input
                        type="textarea"
                        :size="small"
                        :rows="4"
                        placeholder="优惠内容不可带手机号码，QQ等联系方式，字数在6-36之间"
                        v-model.trim="formData.discountsContent">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <div class="grid-content">
                    <el-button size="small" type="primary" @click="submit" :disabled="formLoading"
                               v-loading.body="formLoading">保存
                    </el-button>
                    <el-button size="small" @click="cancel">取消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import Service from 'src/services/salemanager/stores/Service.js'
    import Api from 'src/services/salemanager/stores/storeApi.js'
    import dateUtils from 'src/utils/DateUtils.js'

    export default {
        name: 'coupon-config',
        data() {
            return {
                path: Service.PROMOTION.DISCOUNTSQUERYPAGE,
                args: {discounts: {}},
                toolbarDisabledSymbols: [],
                formLoading: false,
                selectSource: {
                    verifyStatus: [
                        {value: 0, text: '待审核 '},
                        {value: 1, text: '审核通过'},
                        {value: 2, text: '审核不通过'}
                    ],
                    showStatus: [
                        {value: 0, text: '首页不展示'},
                        {value: 1, text: '首页展示'}
                    ]
                },
                showDialog: false,
                dialogType: null,
                dialogTitle: '',
                formData: {
                    discountsContent: '',
                    value: null
                },
                rules: {
                    discountsContent: [
                        {required: true, message: '请输入服务内容', trigger: 'blur'},
                        {min: 6, message: '优惠内容至少6个字符', trigger: 'blur'},
                        {max: 36, message: '优惠内容最多36个字符', trigger: 'blur'},
                        {pattern: /^[^\n\r]+$/, message: '优惠内容不能包含换行符'}
                    ],
                    times: [
                        {type: 'array', required: true, message: '请选择有效时间'}
                    ]
                },
                fields: [
                    {
                        type: 'datetime',
                        label: '创建时间',
                        name: 'createTime',
                        pickertype: 'daterange',
                        startField: 'createTimeStart',
                        endField: 'createTimeEnd',
                        size: '300px'
                    },
                    {
                        type: 'select',
                        label: '审核结果',
                        name: 'verifyStatus',
                        selectSourceKey: 'verifyStatus',
                        filterable: true
                    }
                ],
                columns: [
                    {
                        prop: 'createTime',
                        label: '创建时间',
                        formatter: 'dateParser'
                    },
                    {
                        prop: 'discountsContent',
                        label: '优惠内容'
                    },
                    {
                        label: '有效时间',
                        formatter(val, row) {
                            return `${dateUtils(row.startTime * 1000, 'yyyy-mm-dd')}~${dateUtils(row.endTime * 1000, 'yyyy-mm-dd')}`
                        }
                    },
                    {
                        prop: 'verifyStatus',
                        label: '状态',
                        formatter ( val, row, event, obj) {
                            val = val || 0
                            let statusName = obj.commonData.verifyStatus.find(item => item.value === val)
                            switch (val) {
                                case 1:
                                    return `<label style="color:green">${statusName.text}</label>`
                                case 2:
                                    return `<label style="color:red">${statusName.text}</label>`
                                default:
                                    return statusName.text
                            }
                        }
                    },
                    {
                        prop: 'showStatus',
                        label: '展示',
                        list: 'showStatus'

                    },
                    {
                        prop: 'verifyRemark',
                        label: '备注'
                    }
                ]
            }
        },
        created() {
        },
        activated() {
            this.reloadTable()
        },
        methods: {
            submit() {
                if (this.formData.times) {
                    if (!this.formData.times[0] || !this.formData.times[1]) {
                        this.formData.times = null
                    }
                }
                this.$refs.couponForm.validate(_isvalid => {
                    if (_isvalid) {
                        let args
                        let serv
                        switch (this.dialogType) {
                            case 'create':
                                args = {
                                    discounts: {
                                        discountsContent: this.formData.discountsContent,
                                        startTime: Date.parse(this.formData.times[0]) / 1000,
                                        endTime: Date.parse(this.formData.times[1]) / 1000 + 24 * 3600 - 1
                                    }
                                }
                                serv = 'create'
                                break
                            case 'edit':
                                args = {
                                    discounts: {
                                        id: this.formData.id,
                                        discountsContent: this.formData.discountsContent,
                                        startTime: Date.parse(this.formData.times[0]) / 1000,
                                        endTime: Date.parse(this.formData.times[1]) / 1000 + 24 * 3600 - 1
                                    }
                                }
                                serv = 'update'
                                break
                            default:
                                this.$message.error('系统异常')
                                return
                        }
                        this.formLoading = true
                        Api.DISCOUNTS[serv](args).then(res => {
                            this.formLoading = false
                            if (res.data.status === 200) {
                                this.$message.success('操作成功')
                                this.showDialog = false
                                this.reloadTable()
                            } else {
                                this.$message.error(res.data.result || res.data.error || res.data.message || '操作失败')
                            }
                        }).catch(_ => {
                            this.formLoading = false
                            this.$message.error('操作失败')
                            return
                        })
                    }
                })
            },
            cancel() {
                this.formData = {
                    discountsContent: '',
                    times: null
                }
                this.showDialog = false
                this.dialogType = null
            },
            dialogDeal(type) {
                let formData = {
                    discountsContent: '',
                    times: null
                }
                switch (type) {
                    case 'create':
                        this.dialogTitle = '创建优惠券'
                        break
                    case 'edit':
                        this.dialogTitle = '编辑优惠券'
                        let dealRow = this.getSelects(true)
                        if (!dealRow || dealRow.length === 0) {
                            this.$message.error('请选择要操作的记录')
                            return
                        }
                        if (dealRow.verifyStatus === 0) {
                            this.$message.error('审核中的记录不可编辑')
                            return
                        }
                        let _time = [new Date(dealRow.startTime * 1000), new Date(dealRow.endTime * 1000)]
                        formData = {
                            id: dealRow.id,
                            discountsContent: dealRow.discountsContent,
                            times: _time
                        }
                        break
                }
                this.formData = {...formData}
                this.showDialog = true
                this.dialogType = type
            },
            cancelBtn() {
                let row = this.getSelects(true)
                if (!row) {
                    this.$message.error('请选择要操作的记录')
                    return
                }
                let args = {discounts: {id: row.id, showStatus: 0}}
                Api.DISCOUNTS.setShow(args).then(res => {
                    if (res.data.status === 200) {
                        this.$message.success('操作成功')
                        this.reloadTable()
                    } else {
                        this.$message.error(res.data.result || res.data.error || res.data.message || '操作失败')
                        return
                    }
                }).catch(_ => {
                    this.$message.error('操作失败')
                })
            },
            showBtn() {
                let row = this.getSelects(true)
                if (!row) {
                    this.$message.error('请选择要操作的记录')
                    return
                }
                let args = {discounts: {id: row.id, showStatus: 1}}
                Api.DISCOUNTS.setShow(args).then(res => {
                    if (res.data.status === 200) {
                        this.$message.success('操作成功')
                        this.reloadTable()
                    } else {
                        this.$message.error(res.data.result || res.data.error || res.data.message || '操作失败')
                        return
                    }
                }).catch(_ => {
                    this.$message.error('操作失败')
                })
            },
            deleteBtn() {
                let row = this.getSelects(true)
                if (!row) {
                    this.$message.error('请选择要操作的记录')
                    return
                }
                if (row.verifyStatus === 0) {
                    this.$message.error('审核中的记录不能删除')
                    return
                }
                this.$confirm(
                    '确认删除该条优惠券？',
                    '提示',
                    {
                        type: 'warning',
                        confirmButtonText: '确认',
                        cancelButtonText: '取消'
                    }
                ).then(_ => {
                    Api.DISCOUNTS.delete({discounts: {id: row.id}}).then(res => {
                        if (res.data.status === 200) {
                            this.$message.success('操作成功')
                            this.reloadTable()
                        } else {
                            this.$message.error(res.data.result || res.data.error || res.data.message || '操作失败')
                            return
                        }
                    }).catch(_ => {
                        this.$message.error('操作失败')
                    })
                })
            },
            getSelects(getRow = false) {
                let selections = this.$refs.couponTable.getSelectRows()
                return getRow ? selections[0] : selections
            },
            selectionChange(slts) {
                let _toolbarDisabled = []
                if (slts.length > 0) {
                    if (slts.length > 1) {
                        _toolbarDisabled = ['SHOW', 'CANCEL', 'EDIT', 'DELETE']
                    } else {
                        if (slts[0].verifyStatus === 0) {
                            _toolbarDisabled = ['EDIT', 'DELETE']
                        }
                        if (slts[0].verifyStatus !== 1) {
                            _toolbarDisabled = [..._toolbarDisabled, ...['SHOW', 'CANCEL']]
                        } else if (slts[0].showStatus && slts[0].showStatus === 1) {
                            _toolbarDisabled.push('SHOW')
                        } else {
                            _toolbarDisabled.push('CANCEL')
                        }
                    }
                }
                this.toolbarDisabledSymbols = _toolbarDisabled
            },
            reloadTable() {
                this.$refs.couponTable.reloadTable()
            },
            submitSearch(obj) {
                delete obj['times']
                if(obj.createTimeEnd) obj.createTimeEnd += 24 * 3600 - 1
                this.args = {...this.args, ...{discounts: obj}}
            }
        }
    }
</script>

<style>
    .coupon-config-dialog .el-dialog .el-dialog__body {
        padding: 15px 40px 15px 15px !important;
    }

    .coupon-config-dialog .el-dialog .el-date-editor--daterange {
        width: 100% !important;
    }


</style>
