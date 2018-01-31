<template>
    <t8t-list-view
        ref="list-view"
        :breadcrumbData="breadcrumbData"
        :searchFields="searchFields"
        :searchOptions="searchOptions"
        :showSearchToggleBtn="true"
        :showTree="false"
        :tableColumns="tableColumns"
        :tableIndexCol="true"
        :tableCommonData="tableCommonData"
        :tablePath="tablePath"
        :tableArgs="tableArgs"
        @list-craft-view="onView"
        @search-submit="onSearchSubmit"
        @list-craft-create="onCreateCraft"
        @list-craft-edit="onEdit"
        @list-craft-delete="onDelete"
        @table-selection-change="selectionChange"
    >
    </t8t-list-view>
</template>

<script>
    import Service from 'src/services/craftmanager/Service.js'
    export default {
        name: 'craft-manager',
        components: {  },
        data () {
            return {
                tablePath: 'dcs/TechnologyInfo/queryPage',
                deletePath: 'dcs/TechnologyInfo/delete',
                tableColumns: [
                    { prop: "createTime", label: "创建时间", formatter: "dateParser" },
                    { prop: "technologyName", label: "工艺名称" },
                    { prop: "verifyStatus", label: "审核结果", list: "bizStatusMap" },
                    { prop: "verifyRemark", label: "备注" }
                ],
                searchFields: [
                    { type: "input", label: "工艺名称", name: "technologyName" },
                    {
                        type: "select",
                        label: "审核结果",
                        name: "verifyStatus",
                        selectSourceKey: "bizStatusMap"
                    }
                ],
                searchOptions: {
                    bizStatusMap: [
                        { text: "全部", value: null },
                        { text: "审核中", value: 0 },
                        { text: "审核通过", value: 1 },
                        { text: "审核不通过", value: 2 }
                    ]
                },
                tableCommonData: {
                    bizStatusMap: [
                        { text: "全部", value: null },
                        { text: "审核中", value: 0 },
                        { text: "审核通过", value: 1 },
                        { text: "审核不通过", value: 2 }
                    ]
                },
                selectedRows: [],
                selIds: null,
                tableArgs: {
                    technologyInfo: {
                        technologyName: null,
                        verifyStatus: null
                    },
                    page: 1,
                    size: 20
                }
            }
        },
        created() {
            // this.getCraftList();
        },
        methods: {
            onView (symbol, event) {
// console.log(22222222)
                // this.$refs['list-view'].disableBySymbol(symbol)
                const row = this.getLastSelectRow();
                if (row) {
                    this.$router.push({
                        path: '/tuchat-craft-manage/craft-view',
                        query: {
                            id: row[0].id
                        }
                    })
                }
            },
            onEdit() {
                const row = this.getLastSelectRow();
                if (row) {
                    this.$router.push({
                        path: '/tuchat-craft-manage/craft-edit',
                        id: row[0].id
                    })
                }
            },
            onSearchSubmit (formData) {
// console.log(formData)
                let args = Object.assign({},formData);
                this.tableArgs = { technologyInfo: args };
            },
            onCreateCraft() {
// console.log(1111111)
                    this.$router.push({path: '/tuchat-craft-manage/craft-create'})


            },
            onDelete() {
                let row = this.getLastSelectRow();
                let args = {technologyInfo: {id: row[0].id}}
                if (row) {
                    this.$http.fetch(this.deletePath, args).then(res => {
                        if (res.result.status === 200) {
                            this.$message.success('删除成功');
                            this.$refs['list-view'].getTableInstance().reloadTable()
                        }else {
                            this.$message.error('删除失败，'+res.result.result)
                        }
                    })
                }
            },
            selectionChange(rows, selIds) {
                //已选择行
                this.selectedRows = rows;
                this.selIds = selIds;
            },
            getLastSelectRow() {

                let row = this.selectedRows
                if (!row || row.length === 0) {
                    this.$message.error('请勾选数据后再操作')
                }
                else if (row.length > 1) {
                    this.$message.error('请对单条数据进行操作')
                } else {
                    return row
                }
            },
        },

    }
</script>

<style lang="css" scoped>

</style>
