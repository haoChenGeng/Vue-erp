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
            :tableRadioCol="true"
            @list-add="doAdd"
            @list-edit="doEdit"
            @list-approve="doApprove"
            @search-submit="onSearchSubmit"
            :beforeSearchSubmit="beforeSubmit"
        >
        </t8t-list-view>
        <project-dialog
            v-if="dialogVisible"
            @close="dialogVisible=false"
        ></project-dialog>
    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import projectDialog from './project-dialog.vue'
    import Service from 'src/services/salemanager/Service.js'
    import { statusArray, orderStatusArray } from './config'

    export default {
        components: {
            T8tListView,
            projectDialog
        },
        activated(){
            this.$refs['list-view'].getTableInstance().reloadTable()
        },
        data () {
            return {
                // 面包屑
                breadcrumbData: [{ title: '销售管理' },{ title: '促销管理' },{ title: '优惠审批单' }],
                // 编辑页路由地址
                editRoute: '/salemanager/discount-approve-bills/add',
                // 审批页路由地址
                approveRoute: '/salemanager/discount-approve-bills/approve',
                // service 和 method 目前需要加密
                service: Service.DISCOUNT_APPROVE_BILLS.name,
                method: Service.DISCOUNT_APPROVE_BILLS.methods.QUERY_PAGE,
                tableArgs: { search: {id: null} },
                // 表头描述
                tableColumns: [
                    {prop: 'yid', label: '项目ID'},
                    {prop: 'code', label: '优惠审批单编码'},
                    {prop: 'orderMainStatusName', label: '项目状态'},
                    {prop: 'organizationName', label: '门店'},
                    {prop: 'ownerName', label: '业主称呼'},
                    {prop: 'orderStatus', label: '报价单状态', list: 'orderStatusArray'},
                    {prop: 'status', label: '状态', list: 'statusArray'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'},
                ],
                // 搜索项配置
                searchFields: [
                    { type: 'input', label: '项目ID', name: 'yid' },
                    { type: 'input', label: '优惠审批单编码', name: 'code' },
                    { type: 'select', label: '状态', name: 'status', selectSourceKey:'statusArray', filterable: true }
                ],
                // 搜索项对应值
                searchOptions: {
                    statusArray: statusArray,
                    orderStatusArray: orderStatusArray
                },
                /* 项目信息弹窗配置 */
                dialogVisible: false
            }
        },
        methods: {
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
                this.$TCS.addTag('erp_scm_015001007001');
                this.dialogVisible = true
            },
            doEdit () {
                this.$refs['list-view'].doEdit(this.editRoute)
            },
            doApprove () {
                let rows = this.$refs['list-view'].getTableInstance().getSelectRows()
                if (!rows || rows.length === 0) {
                    this.$message.error('请勾选数据后再操作')
                }
                else if (rows.length > 1) {
                    this.$message.error('请对单条数据进行操作')
                }
                else {
                    this.$router.push({
                        path: this.approveRoute,
                        query: {
                            mode: 'approve',
                            id: rows[0].id
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="css" scoped>

</style>
