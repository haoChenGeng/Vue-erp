<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="true"
            :tableColumns="tableColumns"
            :tableService="service"
            :tableArgs="tableArgs"
            :tableMethod="method"
            :tableCommonData="searchOptions"
            @list-delete="doDelete"
            @list-add="doAdd"
            @list-edit="doEdit"
            @search-submit="onSearchSubmit"
            :beforeSearchSubmit="beforeSubmit"
        >
        </t8t-list-view>
    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    export default {
        components: { T8tListView },
        watch: {
            $route: function () {
                this.$refs['list-view'].getTableInstance().reloadTable()
            },
        },
        data () {
            return {
                // 面包屑
                breadcrumbData: [{ title: '销售管理' },{ title: '活动管理' },{ title: '活动内容' }],
                // 详情页路由地址
                detailRoute: '/salemanager/activity-list/add',
                // service 和 method 目前需要加密
                service: 'bCD7au9IAfXL2mSW_HkzAnMPdoSM.cR', // /biz/t8t-prs-mpm/app
                method: 'pqfIYlvsuSHiDtViTmf7mhsoxpj', // activity.queryPage
                tableArgs: {},
                // 表头描述
                tableColumns: [
                    {prop: 'code', label: '活动编码'},
                    {prop: 'name', label: '活动类型'},
                    {prop: 'title', label: '活动名称'},
                    {prop: 'beginTime', label: '活动开始时间'},
                    {prop: 'endTime', label: '活动结束时间'},
                    {prop: 'address', label: '活动地址'},
                    {prop: 'status', label: '活动状态'},
                    {prop: 'respPerson', label: '负责人'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'},
                ],
                // 搜索项配置
                searchFields: [
                    { type: 'input',label: '活动编码',name: 'code' },
                    { type: 'input',label: '活动类型',name: 'organizationId' },
                    { type: 'input',label: '活动名称',name: 'channelId' }
                ],
                // 搜索项对应值
                searchOptions: {
                }
            }
        },
        methods: {
            onSearchSubmit () {

            },
            onchange (val) {

            },
            doDelete () {
                let deletePromise = this.$refs['list-view'].doDelete()
                let that = this
                if (deletePromise) {
                    deletePromise.then((res) => {
                        if (res.data && res.data.status == 200 && res.data.result > 0) {
                            that.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            that.$refs['list-view'].getTableInstance().reloadTable()
                        }
                    })
                }
            },
            doAdd () {
                this.$refs['list-view'].doAdd(this.detailRoute)
            },
            doEdit () {
                this.$refs['list-view'].doEdit(this.detailRoute)
            }
        }
    }
</script>

<style lang="css" scoped>

</style>
