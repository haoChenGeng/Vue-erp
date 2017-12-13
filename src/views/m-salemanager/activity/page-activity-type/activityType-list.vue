<template>
    <div>
        <!-- 面包屑 -->
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <div class="g-main-container-column">
            <t8t-toolbar
                @ADD="onAdd"
                @EDIT="onEdit"
                @DELETE="onDelete"
            ></t8t-toolbar>
            <t8t-table
                :columns="columns"
                :service="service"
                :method="method"
                :args="args"
                ref="t8tTable"
            ></t8t-table>
            <add-dialog
                v-if="dialogVisible"
                :dialogTitle="dialogTitle"
                :editType="editType"
                :rowId="rowId"
                @close="dialogVisible=false"
                @reloadTableData="reloadTableData"
            ></add-dialog>
        </div>
    </div>
</template>

<script>
    import * as config from './activityType-schema'
    import Service from 'src/services/salemanager/Service.js'
    import AddDialog from './activityType-add.vue'
    import { mb } from 'src/components/t8t-table/utils/utils.js'

    export default {
        name: 'activityType-list',
        components: {
            AddDialog
        },
        data() {
            return {
                breadcrumbData: config.breadcrumbData,
                columns: config.columns,
                service: Service.ACTIVITY_TYPE.name,
                method: Service.ACTIVITY_TYPE.methods.QUERY_PAGE,
                args: {sort:['id_desc']},
                dialogVisible: false,
                dialogTitle: '新增活动类型',
                editType: 'add',
                rowId: null
            }
        },
        created() {

        },
        methods: {
            onAdd() {
                this.editType = 'add'
                this.dialogTitle = '新增活动类型'
                this.dialogVisible = true
            },
            onEdit() {
                let rows = this.$refs.t8tTable.getSelectRows()
                if (!rows || rows.length === 0) {
                    this.$message.error('请勾选数据后再操作')
                }
                else if (rows.length > 1) {
                    this.$message.error('请对单条数据进行操作')
                }
                else {
                    this.editType = 'edit'
                    this.dialogTitle = '编辑活动类型'
                    this.dialogVisible = true
                    this.rowId = rows[0].id
                }
            },
            onDelete() {
                let rows = this.$refs.t8tTable.getSelectRows()
                this.$msgbox(mb('删除成功', 'success'))
            },
            reloadTableData() {
                this.$refs.t8tTable.reloadTable()
            }
        }
    }
</script>

<style lang="css" scoped>

</style>
