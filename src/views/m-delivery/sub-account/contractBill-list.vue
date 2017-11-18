<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :deleteMethod="deleteMethod"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="true"
            :showTree="true"
            :treeData="treeData"
            :treeProps="treeProps"
            :tableColumns="tableColumns"
            :tableService="service"
            :tableArgs="tableArgs"
            :tableMethod="method"
            @table-data-loaded="dataLoaded"
            @list-view="doView"
            @list-delete="doDelete"
            @list-add="doAdd"
            @list-edit="doEdit"
            @search-submit="onSearchSubmit"
            @tree-node-click="onTreeClick"
            :beforeSearchSubmit="beforeSubmit"
        >
        </t8t-list-view>
    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import TemplateOperator from 'src/services/delivery/pcm.js'
    import TemplateBase from 'src/services/delivery/template-base.js'
    import Service from 'src/services/delivery/Service.js'
    export default {
        components: {T8tListView},
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
                detailRoute: '/delivery/sub-account/contractBill-detail',
                service: Service.PSSUB.name,
                method: Service.PSSUB.methods.contractBillQueryPage,
                deleteMethod: 'g8BjoP9pcua5Rdf5fUcTthKK_hIR9JNofIq',
                tableArgs: {},
                // 表头描述
                tableColumns: [
                    {prop: 'billCode', label: '单据编码'},
                    {prop: 'projectId', label: '项目ID'},
                    {prop: 'organizationName', label: '组织'},
                    {prop: 'productPkgName', label: '产品包'},
                    {prop: 'bizTypeName', label: '业务类型'},
                    {prop: 'objectTypeName', label: '发包对象类型'},
                    {prop: 'objectName', label: '发包对象'},
                    {prop: 'contractMoney', label: '发包金额'},
                    {prop: 'contractTime', label: '发包时间', formatter: 'dateParser'}
                ],
                // 搜索项配置
                searchFields: [
                    {type: 'input', label: '单据编码', name: 'billCode'},
                    {type: 'input', label: '项目ID', name: 'projectId'},
                    {
                        type: 'select',
                        label: '项目业务类型',
                        name: 'bizTypeId',
                        selectSourceKey: 'bizTypeList',
                        filterable: true
                    },
                    {
                        type: 'popup',
                        label: '产品包',
                        name: 'productPkgId',
                        textValue: 'pkgName',
                        filedValue: 'id',
                        triggerOnFocus: false,
                        dialog: {
                            title: '产品包',
                            size: 'large',
                            searchForm: {
                                showToggleBtn: false,
                                fields: [
                                    {type: 'input', label: '产品包名称', name: 'pkgName_like'},
                                ]
                            },
                            table: {
                                service: Service.PRSPQM.name,
                                method: Service.PRSPQM.methods.productPackageQueryPage,
                                args: {},
                                radioCol: true,
                                columns: [
                                    {
                                        prop: 'id',
                                        label: 'ID',
                                    },
                                    {
                                        prop: 'pkgName',
                                        label: '产品包名称'
                                    }
                                ]
                            }
                        }
                    },
                ],
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                // 面包屑
                breadcrumbData: [{title: '交付管理'}, {title: '发包管理'}, {title: '核算发包'}],
                // 搜索项对应值
                searchOptions: {
                    bizTypeList: [],
                }
            }
        },
        created (){
            //查询业务类型
            TemplateOperator.queryPropertyUnion({page: 1, size: 200, search: {pPropertyCode: "11008"}}).then((res) => {
                if (res.data.status === 200) {
                    let list = [];
                    let rows = res.data.result;
                    for (let i in rows) {
                        list.push({text: rows[i]['propertyName'], value: rows[i]['id']});
                    }
                    this.searchOptions.bizTypeList = list;
                }
            });
            //组织树
            TemplateBase.queryTreeByType({typeCodes: ['001003010']}).then((res) => {
                if (res.data.status === 200) {

                    this.treeData = [res.data.result];
                }
            })
        },
        methods: {
            dataLoaded(data){

            },
            onSearchSubmit (obj) {
                this.tableArgs = { search: obj };
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
            doView () {
                //this.$refs['list-view'].doView(this.detailRoute)
                let selectedId = null;
                let billCode = '';
                let selectedRows = this.$refs['list-view'].getTableInstance().getSelectRows()

                selectedRows.forEach((row) => {
                    if (row['id']) {
                        selectedId = row['id']
                        billCode = row['billCode']
                    }
                })

                if (!selectedId) {
                    let msg = '没有选中需要查看的行！';
                    this.$message.error(msg)
                    return
                }

                this.$router.push({
                    query: {id: selectedId, billCode: billCode, mode: 'view'},
                    path: this.detailRoute
                })
            },
            doAdd () {
                console.log(this.detailRoute)
                this.$refs['list-view'].doAdd(this.detailRoute)
            },
            doEdit () {
                this.$refs['list-view'].doEdit(this.detailRoute)
            },
            //组织树的click事件
            onTreeClick (nodeData){
                this.tableArgs = {page: 1, size: 20, search: {organizationId: nodeData.id}}
            },
        }
    }
</script>

<style lang="css" scoped>

</style>
