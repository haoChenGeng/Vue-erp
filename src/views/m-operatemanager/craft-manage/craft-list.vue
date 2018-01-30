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
        @list-view="onView"
        @search-submit="onSearchSubmit"
        @create-craft="onCreateCraft"
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
                tableColumns: [
                    { prop: "createTime", label: "创建时间", formatter: "dateParser" },
                    { prop: "craftName", label: "工艺名称" },
                    { prop: "verifyResult", label: "审核结果", list: "bizStatusMap" },
                    { prop: "verifyComment", label: "备注" }
                ],
                searchFields: [
                    { type: "input", label: "工艺名称", name: "craftName" },
                    {
                        type: "select",
                        label: "审核结果",
                        name: "verifyResult",
                        selectSourceKey: "bizStatusMap"
                    }
                ],
                searchOptions: {
                    bizStatusMap: [
                        { text: "全部", value: 1 },
                        { text: "审核中", value: 2 },
                        { text: "审核通过", value: 3 },
                        { text: "审核不通过", value: 4 }
                    ]
                },
            }
        },
        created() {
            this.getCraftList();
        },
        methods: {
            onView (symbol, event) {
                console.log(this.$TCS);
                this.$refs['list-view'].disableBySymbol(symbol)
            },
            onSearchSubmit (formData) {
                console.log(formData)
            },
            onCreateCraft() {
                const row = this.getLastSelectRow();
                console.log(row)
                if (row) {
                    this.$router.push({
                        path: '/tuchat-craft-manage/craft-create',
                        query: {
                            uid: row[0].uid
                        }
                    })
                }
            },
            getCraftList() {
                // console.log(122);
                let args = {
                    technologyInfo: {
                        technologyName: '',
                        verifyStatus: null
                    },
                    page: 1,
                    pageSize: 12
                }
                // console.log(Service)
                this.$http.fetchOld(Service.CRAFT.name, Service.CRAFT.queryCraftList, args).then(res => {
                    console.log(res)
                    if (res.data.status === 200) {
                        console.log(res)
                    }
                })
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
