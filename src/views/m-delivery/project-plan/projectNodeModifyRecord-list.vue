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
            @search-submit="onSearchSubmit"
            :beforeSearchSubmit="beforeSubmit"
        >
        </t8t-list-view>
    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import TemplateOperator from 'src/services/delivery/pcm.js'
    export default {
        components: { T8tListView },
        // watch: {
        //     $route: function () {
        //         this.$refs['list-view'].getTableInstance().reloadTable()
        //     },
        // },
        activated(){
            this.$refs['list-view'].getTableInstance().reloadTable()
        },
        data () {
            return {
                // 详情页路由地址
                detailRoute: '/test/resume/view',
                // service 和 method 目前需要加密
                service: '-rNbirB8ZP7VjkJPuQOSgA630lvEIIB', // /biz/t8t-ps-psm/app
                method: '1gM2qfEutqxIRyyaYj1KqCyqsXhuUDg-THwa0r_wA-pbdit', // projectNodeModifyRecord.queryPage
                deleteMethod: 'OrrP_eK3HOmsnO5N_7YrIb9JF394xg-ZIjM-HM7ODJyH2Kt7r9i', // projectNodeModifyRecord.deleteByIds
                tableArgs: {},
                // 表头描述
                tableColumns: [
                    {prop: 'id', label: '主键ID'},
                    {prop: 'projectId', label: '项目ID'},
                    {prop: 'nodeTypeName', label: '项目节点类型'},
                    {prop: 'moduleName', label: '排期模板'},
                    {prop: 'billTypeName', label: '单据类型'},
                    {prop: 'modifyField', label: '变更字段'},
                    {prop: 'originValue', label: '原值'},
                    {prop: 'newValue', label: '新值'},
                    {prop: 'createBy', label: '变更人'},
                    {prop: 'createTime', label: '变更时间', formatter: 'dateParser'}
                ],
                // 搜索项配置
                searchFields: [
                    {type: 'input', label: '项目ID', name: 'projectId'},
                    {type: 'input', label: '节点ID', name: 'nodeId'},
                    {type: 'input', label: '排期模板ID', name: 'moduleId'},
                    {type: 'input', label: '模板节点ID', name: 'moduleItemId'},
                    {
                        type: 'select',
                        label: '单据类型',
                        name: 'billType',
                        selectSourceKey: 'billTypeList',
                        filterable: true
                    }
                ],
                // 面包屑
                breadcrumbData: [
                    { title: '交付' },{ title: '项目计划' },{ title: '节点变更记录查询' }
                ],
                // 搜索项对应值
                searchOptions: {
                    billTypeList: [], //单据类型list
                }
            }
        },
        created (){

            TemplateOperator.queryPropertyUnion({page: 1, size: 200, search: {pPropertyCode: "11605"}}).then((res) => {
                if (res.data.status === 200) {
                    let list = [];
                    let rows = res.data.result;
                    for (let i in rows) {
                        list.push({text: rows[i]['propertyName'], value: rows[i]['id']});
                    }
                    this.searchOptions.billTypeList = list;
                }
            });
        },
        methods: {
            onSearchSubmit (obj) {
                this.tableArgs = { search: obj };
            },
            onchange (val) {

            }
        }
    }
</script>

<style lang="css" scoped>

</style>
