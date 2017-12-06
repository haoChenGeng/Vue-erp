<template>
    <div class="t8t-toolbar">
        <el-button
            size="toolbar"
            v-show="!isEditable"
            @click="btnInsertClick()"
        >新增</el-button>
        <el-button
            size="toolbar"
            v-show="!isEditable"
            :disabled="isEditable"
            @click="btnEditClick()"
        >编辑</el-button>
        <el-button
            size="toolbar"
            v-show="!isEditable"
            @click="btnInvalidClick()"
        >作废</el-button>
        <!--<el-button
                size="toolbar"
                @click="btnDeleteClick()"
            >删除</el-button>-->
        <!--<el-button
                size="toolbar"
                v-show="!isEditable"
                :disabled="isEditable"
                @click="btnViewClick()"
            >查看</el-button>-->
    </div>
</template>

<script>
    import * as types from 'src/store/mutation-types.js'
    export default {
        name: 'T8tToolbar',
        data() {
            return {
            }
        },
        methods: {
            btnInsertClick() {

            },
            btnEditClick() {

            },
            btnInvalidClick() {

            },



            //显示对话框
            showEditDialog(formData, editType) {
                var data = {}
                data.formData = formData
                data.editType = editType
                this.$store.commit('PAYMETHODS_SET_DIALOG', data)
            },
            btnInsertClick() {
                //this.localData.unshift(this.blankData)
                var formData = {
                    code: '003005',
                    name: null,
                    organizationCode: null,
                    channelType: null,
                    status: 1,
                    createUser: null
                }
                this.showEditDialog(formData, '新增')
            },
            btnEdit() {
                // 编辑
                if (this.selection.length === 0) {
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '请选择要处理的行。',
                        showCancelButton: false,
                        confirmButtonText: '确定',
                        confirmButtonClass: 'is-plain'
                    })
                    return
                } else {
                    var currentRow = this.currentRow;
                    var formData = {
                        code: currentRow.code,
                        name: currentRow.name,
                        organizationCode: currentRow.organizationCode,
                        channelType: currentRow.channelType,
                        updateUser: null,
                        createUser: currentRow.createUser,
                        status: currentRow.status
                    }
                    this.showEditDialog(formData, '编辑')
                }
            },
            btnLook() {
                // 查看
                if (this.selection.length === 0) {
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '请选择要处理的行。',
                        showCancelButton: false,
                        confirmButtonText: '确定',
                        confirmButtonClass: 'is-plain'
                    })
                    return
                } else {
                    this.showEditDialog('retrieve')
                }
            },
            btnInvalidClick() {
                let index
                let selectedIndex = []
                if (this.selection.length === 0) {
                    this.$message.error('请选择要处理的行。')
                } else {
                    this.$confirm('确认对所选数据进行作废处理？', '作废确认', {
                        type: 'warning'
                    }).then(() => {
                        this.selection.forEach((item) => {
                            item.status = 0
                        })
                        this.$store.commit(types.COM_SET_TAB_VIEW_SELECTEDROWS, this.selection)
                        this.$message({
                            type: 'success',
                            message: '已作废'
                        })
                    })
                }
            },
            //点击删除按钮
            btnDeleteClick() {
                let index
                let selectedIndex = []
                if (this.selection.length === 0) {
                    this.$message.error('请选择要处理的行。')
                } else {
                    this.$confirm('确定删除此项吗？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        this.selection.forEach((item) => {
                            selectedIndex.push(item.id)
                        })
                        if (!this.isEditable) {
                            this.$store.commit(types.COM_DEL_TAB_ROW, selectedIndex)
                        }
                        this.$message({
                            type: 'success',
                            message: '删除成功！'
                        })
                    })
                }
            },
        }
    }

</script>
<style
    scoped
    lang="css"
>
    .t8t-toolbar {
        margin: 13px;
    }
    
    .t8t-toolbar .el-button--toolbar:first-child {
        margin-left: 8px;
    }
    
    .t8t-toolbar .el-button--toolbar {
        padding: 5px 11px;
        font-size: 12px;
        border-radius: 2px;
        border-color: rgb(232, 237, 241);
        color: rgb(50, 139, 239);
    }
    
    .t8t-toolbar .el-button--toolbar:focus {
        border-color: rgb(191, 201, 217)
    }
    
    .t8t-toolbar .el-button--toolbar:hover {
        border-color: rgb(50, 139, 239)
    }
    
    .t8t-toolbar .el-button--success.is-plain {
        color: rgb(19, 206, 102)
    }
    
    .t8t-toolbar .el-button--danger.is-plain {
        color: rgb(255, 86, 97)
    }
    
    .t8t-toolbar .el-button + .el-button {
        margin-left: 0px;
    }
</style>