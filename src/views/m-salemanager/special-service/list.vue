<!--
 * File: list.vue
 * Comment:特色服务
 * Created by WebStorm.
 * User: tony.huang
 * Date: 2018/1/17
 * Time: 16:36
 -->
<template>
    <div class="uniqe-server">
        <t8t-breadcrumb></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            @submit="submitSearch"
            :selectSource="selectSource"
            ref="searchBar"></t8t-search>
        <t8t-toolbar
            ref="serverToolbar"
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
            ref="serverTable"
            @selection-change="selectionChange"
            :pageSizes="[5,10,20,50,100]">
        </t8t-grid>
        <el-dialog :title="dialogTitle" class="g-w-460 special-sever-dialog" v-model="showDialog" @close="cancel">
            <el-form v-if="showDialog" :model="formData" :label-position="left" label-width="100px" :rules="rules"
                     ref="serverForm">
                <el-form-item label="标题：" prop="title" :size="small">
                    <el-input placeholder="字数不超过6个字" :size="small" v-model.trim="formData.title"></el-input>
                </el-form-item>
                <el-form-item label="服务内容：" prop="description">
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="特色服务内容不可带手机号码，QQ等联系方式，字数在10-200之间"
                        v-model.trim="formData.description">
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

    export default {
        name: 'server-config',
        data() {
            return {
                path: Service.SPECIALSERVICE.QUERYPAGE,
                args: {
                    search: {
                        id_gt: 0,
                    },
                    page: 1,
                    size: 20
                },
                toolbarDisabledSymbols: [],
                formLoading: false,
                selectSource: {
                    select: [],
                    verifyStatus: [
                        {value: 1, text: '审核通过'},
                        {value: 2, text: '审核不通过'},
                        {value: 3, text: '待审核'}
                    ],
                    isRecommend: [
                        {value: 1, text: '首页展示'},
                        {value: 0, text: '首页不展示'}
                    ]
                },
                showDialog: false,
                dealType: null,
                dialogTitle: '',
                formData: {},
                rules: {
                    description: [
                        {required: true, message: '请输入服务内容', trigger: 'blur'},
                        {min: 10, message: '服务内容至少10个字', trigger: 'blur'},
                        {max: 200, message: '服务内容最多200个字', trigger: 'blur'}
                    ],
                    title: [
                        {required: true, message: '请输入服务标题', trigger: 'blur'},
                        {max: 6, message: '标题不超过6个字', trigger: 'blur'}
                    ]
                },
                fields: [
                    {
                        type: 'input',
                        label: '服务内容',
                        name: 'description'
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
                        prop: 'title',
                        label: '标题'
                    },
                    {
                        prop: 'description',
                        label: '服务内容'
                    },
                    {
                        prop: 'verifyStatus',
                        label: '状态',
                        list: 'verifyStatus'
                    },
                    {
                        prop: 'isRecommend',
                        label: '展示',
                        list: 'isRecommend'
                    },
                    {
                        prop: 'verifyFailReason',
                        label: '备注',

                    }
                ]
            }
        },
        created() {
            this.$set(this.formData, 'description', '')
            this.$set(this.formData, 'title', '')
        },
        activated() {
            this.$refs.serverTable.reloadTable()
        },
        methods: {
            submit() {
                this.$refs.serverForm.validate(_isvalid => {
                    if (_isvalid) {
                        let _args = {}
                        let serv
                        switch (this.dealType) {
                            case 'create':
                                _args = {
                                    decSpecialService: {
                                        description: this.formData.description,
                                        title: this.formData.title
                                    }
                                }
                                serv = 'create'
                                break
                            case 'edit':
                                _args = {
                                    decSpecialService: {
                                        id: this.formData.id,
                                        description: this.formData.description,
                                        title: this.formData.title
                                    }
                                }
                                serv = 'update'
                                break
                            default:
                                this.$message.error('参数异常')
                                return false
                        }
                        Api.SPECIALSERVICE[serv](_args).then(res => {
                            if (res.data.status === 200) {
                                this.$message.success('操作成功')
                                this.reloadTable()
                                this.showDialog = false
                            } else {
                                this.$message.error(res.data.error || res.data.message || '操作失败')
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
                    title: '',
                    description: ''
                }
                this.showDialog = false
            },
            dialogDeal(type) {
                let formData = {
                    title: '',
                    description: ''
                }
                switch (type) {
                    case 'create':
                        this.dialogTitle = '创建特色服务'
                        break
                    case 'edit':
                        this.dialogTitle = '编辑特色服务'
                        let dealRow = this.getSelects(true)
                        if (!dealRow) {
                            this.$message.error('请选择要操作的记录')
                            return
                        }
                        if (dealRow.verifyStatus === 3) {
                            this.$message.error('审核中的记录不可编辑')
                            return
                        }
                        formData = {
                            title: dealRow.title,
                            description: dealRow.description,
                            id: dealRow.id
                        }
                        break
                }
                this.formData = {...formData}
                this.showDialog = true
                this.dealType = type
            },
            cancelBtn() {
                let row = this.getSelects(true)
                if (!row) {
                    this.$message.error('请选择要操作的记录')
                    return
                }
                let args = {id: row.id}
                Api.SPECIALSERVICE.cancelRecomend(args).then(res => {
                    if (res.data.status === 200) {
                        this.$message.success('操作成功')
                        this.reloadTable()
                    } else {
                        this.$message.error(res.data.error || res.data.message || '操作失败')
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
                let args = {id: row.id}
                Api.SPECIALSERVICE.setRecommend(args).then(res => {
                    if (res.data.status === 200) {
                        this.$message.success('操作成功')
                        this.reloadTable()
                    } else {
                        this.$message.error(res.data.error || res.data.message || '操作失败')
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
                if (row.verifyStatus === 3) {
                    this.$message.error('审核中的记录不能删除')
                    return
                }
                this.$confirm(
                    '确认删除该特色服务？',
                    '提示',
                    {
                        type: 'warning',
                        confirmButtonText: '确认',
                        cancelButtonText: '取消'
                    }
                ).then(_ => {
                    Api.SPECIALSERVICE.deleteById({id: row.id}).then(res => {
                        if (res.data.status === 200) {
                            this.$message.success('操作成功')
                            this.reloadTable()
                        } else {
                            this.$message.error(res.data.error || res.data.message || '操作失败')
                            return
                        }
                    }).catch(_ => {
                        this.$message.error('操作失败')
                    })
                })
            },
            getSelects(getRow = false) {
                let selections = this.$refs.serverTable.getSelectRows()
                return getRow ? selections[0] : selections
            },
            selectionChange(slts) {
                let _toolbarDisabled = []
                if (slts.length > 0) {
                    if (slts.length > 1) {
                        _toolbarDisabled = ['SHOW', 'CANCEL', 'EDIT', 'DELETE']
                    } else {
                        if (slts[0].verifyStatus === 3) {
                            _toolbarDisabled = ['EDIT', 'DELETE']
                        }
                        if (slts[0].verifyStatus !== 1) {
                            _toolbarDisabled = [..._toolbarDisabled, ...['SHOW', 'CANCEL']]
                        } else if (slts[0].isRecommend && slts[0].isRecommend === 1) {
                            _toolbarDisabled.push('SHOW')
                        } else {
                            _toolbarDisabled.push('CANCEL')
                        }
                    }
                }
                this.toolbarDisabledSymbols = _toolbarDisabled
            },
            submitSearch(obj) {
                this.args = {...this.args, ...{search: obj}}
            },
            reloadTable() {
                this.$refs.serverTable.reloadTable()
            }
        }

    }
</script>

<style>
    .special-sever-dialog .el-dialog .el-dialog__body {
        padding: 15px 40px 15px 15px !important;
    }

</style>
