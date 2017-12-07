<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :deleteMethod="deleteMethod"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="true"
            :tableColumns="tableColumns"
            :tableService="service"
            :tableArgs="tableArgs"
            :tableMethod="method"
            :tableCommonData="searchOptions"
            @list-view="doView"
            @list-delete="doDelete"
            @list-add="doAdd"
            @list-edit="doEdit"
            @search-submit="onSearchSubmit"
            @table-row-dobule-click="doView"
            :tableIndexCol="true"
            :beforeSearchSubmit="beforeSubmit"
        >
        </t8t-list-view>
    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import commonApi from 'src/services/commonApi/commonApi.js'

    export default {
        components: {T8tListView},
        watch: {
//            $route: function () {
//                this.$refs['list-view'].getTableInstance().reloadTable()
//            },
        },
        activated (){
            this.$refs['list-view'].getTableInstance().reloadTable()
        },
        data () {
            return {
                // 面包屑
                breadcrumbData: [{title: '财务'}, {title: '财务基础配置'}, {title: '凭证模版设置'}],
                // 详情页路由地址
                viewRoute:'/tochat-finance/page-voucher-template/view',// 查看按钮
                editRoute:'/tochat-finance/page-voucher-template/edit',// 编辑按钮
                addRoute:'/tochat-finance/page-voucher-template/add',// 新增按钮
                // service 和 method 目前需要加密
                service: '9wjmWM9cR44vZeERRK2R3Z4Tye3fdrq', // /biz/t8t-fi-fvg/app
                method: 'gZlVd8SuQ0q75b4TXdnXoOXxsddRYPlJ4bJ7k26WMIaZAAF', // views.voucherTemplate.queryPage
                deleteMethod: 'b1KIZGfnxzTk1cYSMscZmgjazkmrEXJnWI6TnR0', // voucherTemplate.deleteByIds
                tableArgs: {},
                // 表头描述
                tableColumns: [
                    {prop: 'organizationId', label: '财务组织', list: 'organizationId'},
                    {prop: 'code', label: '模板编码'},
                    {prop: 'name', label: '模板名称'},
                    {prop: 'status', label: '状态', list: 'status'},
                    {prop: 'createName', label: '创建人'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'},
                    {prop: 'updateName', label: '修改人'},
                    {prop: 'updateTime', label: '修改时间', formatter: 'dateParser'}
                ],
                // 搜索项配置
                searchFields: [
                    {type: 'select', label: '财务组织', name: 'organizationId', selectSourceKey: 'organizationId'},
                    {type: 'input', label: '模板编码', name: 'code_like'},
                    {type: 'input', label: '模板名称', name: 'name_like'},
                    {type: 'select', label: '状态', name: 'status', selectSourceKey: 'status'}
                ],

                // 搜索项对应值
                searchOptions: {
                    organizationId: [],
                    status: [
                        {value: 1, text: '启用'},
                        {value: 2, text: '停用'}
                    ],
                    dataSource: []
                }
            }
        },
        created() {
            this.getOrganizationOptions()
        },
        methods: {
            getOrganizationOptions() {
                // 法人职能和利润中心
                let arg = {
                    funcCodes: ["001004013", "001004014"]
                }
                let list = []
                commonApi.queryByFunctionCode(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.isDel !== 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.name
                                    })
                                }
                            })
                            this.searchOptions.organizationId = list
                        }
                    })
            },
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
            // 查看按钮
            doView () {
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows()
                if(selections.length === 0)
                {
                    this.$message.error('请勾选数据后再进行操作')
                    return false
                }
                if(selections.length>1)
                {
                    this.$message.error('请勾选单条数据操作')
                    return false
                }
                this.$refs['list-view'].doView(this.viewRoute)
            },
            //新增
            doAdd () {
                this.$refs['list-view'].doAdd(this.addRoute)
            },
            // 编辑
            doEdit () {
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows()
                if(selections.length === 0)
                {
                    this.$message.error('请勾选数据后再进行操作')
                    return false
                }
                if(selections.length>1)
                {
                    this.$message.error('请勾选单条数据操作')
                    return false
                }
                this.$refs['list-view'].doEdit(this.editRoute)
            }
        }
    }
</script>

<style lang="css" scoped>

</style>
