<template>
    <div>
        <t8t-list-view ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="commonData"
            :tableService="service"
            :tableMethod="method"
            :tableColumns="tableColumns"
            :tableCommonData="commonData"
            :tableRadioCol="true"
            @list-delete="onDelete"
            @list-edit="onEdit"
            @list-add="onAdd"
            @table-current-row-change="onTableCRC"
            @table-row-dobule-click="onTableRDC"
            @table-data-loaded="tableDataLoaded">
        </t8t-list-view>

        <my-dialog v-if="isShow"
            :status="dialogStatus"
            :rowData="formData"
            :commonData="commonData"
            @close="isShow=false"
            @success="onSuccess">
        </my-dialog>
    </div>
</template>

<script>
    import api from './api.js'
    import Service from './Service.js'
    import MyDialog from './dialog.vue'
    export default {
        components: {
            MyDialog
        },
        data() {
            return {
                service: Service.pem.name,
                method: Service.pem.methods.query,
                tableColumns: [
                    { "prop": "id", "label": "ID", "width": 100 },
                    { "prop": "type", "label": "白名单类型", "list": "stateOptions", "width": 150 },
                    { "prop": "url", "label": "url" },
                    { "prop": "createUser", "label": "创建人", "width": 150 },
                    { "prop": "createTime", "label": "创建时间", "formatter": "dateParser", "width": 200 },
                    { "prop": "updateUser", "label": "修改人", "width": 150 },
                    { "prop": "updateTime", "label": "修改时间", "formatter": "dateParser", "width": 200 },
                ],
                commonData: {
                    stateOptions: [
                        { text: '服务', value: 0 },
                        { text: '接口', value: 1 }
                    ]
                },
                breadcrumbData: [
                    { title: '系统管理' },
                    { title: '主数据' },
                    { title: '权限白名单' }
                ],
                searchFields: [
                    { type: 'select', label: '白名单类型', name: 'type', selectSourceKey: 'stateOptions' },
                    { type: 'input', label: 'url', name: 'url' }
                ],
                isShow: false,
                curRow: null,
                formData: null,
                dialogStatus: ''
            }
        },
        methods: {
            // table当前行改变
            onTableCRC(curRow, oldRow) {
                this.curRow = curRow
            },
            // table 双击
            onTableRDC(row) {
                this.curRow = row
                this.formData = this.curRow
                // this.showDialog('view')
            },
            onDelete(symbol, event) {
                if (!this.curRow) {
                    return this.$message("请选择一行数据！")
                }

                this.$confirm('删除数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let args = {
                        id: this.curRow.id
                    }

                    api.delete(args)
                        .then(res => {
                            if (res.data.status === 200 && res.data.result === 1) {
                                this.onSuccess()
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                })
                            }
                        })
                }).catch(() => {

                })

            },
            onAdd(symbol, event) {
                this.showDialog('add')
            },
            onEdit(symbol, event) {
                if (!this.curRow) {
                    return this.$message("请选择一行数据！")
                }
                this.formData = this.curRow
                this.showDialog('edit')
            },
            showDialog(status) {
                this.dialogStatus = status
                this.isShow = true
            },
            onSuccess(data) {
                this.$refs['list-view'].getTableInstance().reloadTable()
            }
        },
        created() {

        }
    }
</script>

<style lang="css"
    scoped>
</style>
