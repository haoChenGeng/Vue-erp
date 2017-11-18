<template>
    <div class="whitelist-dialog">
        <el-dialog :title="title"
            @close="closeDialog"
            v-model="isShow"
            size="small">
            <el-form :model="data"
                ref="dialogForm"
                class="my-form"
                label-width="90px"
                :rules="formRules">

                <el-form-item label="白名单类型"
                    prop="type">
                    <el-select v-model="data.type"
                        placeholder="请选择">
                        <el-option v-for="(item, index) in commonData.stateOptions"
                            :key="index"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="url"
                    prop="url">
                    <el-input v-model="data.url"
                        type="textarea"
                        :autosize="{ minRows: 3}">
                    </el-input>
                </el-form-item>

            </el-form>

            <div class="dialog-footer">
                <el-button @click="btnOKClick"
                    type="primary">确定</el-button>
                <el-button @click="closeDialog">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import api from './api.js'
    import Service from './Service.js'
    export default {
        data() {
            return {
                isShow: true,
                title: '新增白名单',
                data: {
                    type: '',
                    url: '',
                },
                formRules: {
                    type: [
                        { type: 'number', required: true, message: "填写类型" }
                    ],
                    url: [
                        { type: 'string', required: true, message: "填写url" }
                    ]
                }
            }
        },
        props: {
            status: {
                type: String,
                default: 'view'
            },
            rowData: {
                type: Object,
                default: {}
            },
            commonData: {
                type: Object,
                default: {}
            }
        },
        methods: {
            closeDialog() {
                this.$emit('close');
            },
            btnOKClick() {
                this.$refs['dialogForm'].validate(valid => {
                    if (!valid) return
                    this.status === 'add' && this.onAdd()
                    this.status === 'edit' && this.onEdit()
                })

            },
            onAdd() {
                let args = {
                    whiteListRecord: {
                        type: this.data.type,
                        url: this.data.url,
                        createUser: Cookie.get('t8t-tc-username'),
                        updateUser: Cookie.get('t8t-tc-username')
                    }
                }

                api.insert(args)
                    .then(res => {
                        if (res.data.status === 200) {
                            this.$message.success("新增成功！")
                            this.closeDialog()
                            this.$emit('success')
                        } else {
                            this.$message.error("新增失败！")
                        }
                    })
            },
            onEdit() {
                let args = {
                    whiteListRecord: {
                        id: this.rowData.id,
                        type: this.data.type,
                        url: this.data.url,
                        updateUser: Cookie.get('t8t-tc-username')
                    }
                }

                api.update(args)
                    .then(res => {
                        if (res.data.status === 200 && res.data.result === 1) {
                            this.$message.success("修改成功！")
                            this.closeDialog()
                            this.$emit('success')
                        } else {
                            this.$message.error("修改失败！")
                        }
                    })
            },
        },
        created() {
            if (this.status === 'edit') {
                this.data.type = this.rowData.type
                this.data.url = this.rowData.url
                this.title = '修改白名单'
            }
        }
    }
</script>

<style lang="css"
    scoped>
    .dialog-footer {
        text-align: center;
    }

    .my-form {
        width: 300px;
        margin: 0 auto;
    }
</style>
