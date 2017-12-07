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
            @list-keepaccount="doKeepAccount"
            @search-submit="onSearchSubmit"
            @table-row-dobule-click="doView"
            :tableIndexCol="true"
            @list-void="doVoid"
        >
        </t8t-list-view>
    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import voucherOrderApi from 'src/services/finance/voucherOrder.js'
    import Cookie from 'js-cookie'

    export default {
        components: {T8tListView},
        watch: {
//            $route: function () {
//                this.$refs['list-view'].getTableInstance().reloadTable()
//            },
        },
        activated(){
            this.$refs['list-view'].getTableInstance().reloadTable()
        },
        data () {
            return {
                // 面包屑
                breadcrumbData: [{title: '财务'}, {title: '财务月结'}, {title: '凭证查询'}],
                // 详情页路由地址
                detailRoute: '/tochat-finance/page-voucher-order/detail',
                // service 和 method 目前需要加密
                service: 'N7MleTA0MHTcaUUxIqAYpQ5BwNDA-dv', // /biz/t8t-fi-fvg/app
                method: 'JFijjU.0FoZektStIbBZc5eVETpIg_xR-BzLt7kRMs8', // voucherOrder.queryPage
                deleteMethod: '8BZi2g93B6-XkEgHh0D-E2i7CSDwlXHswDe', // voucherOrder.deleteByIds
                updateName: Cookie.get('t8t-tc-username'),
                updateBy: Cookie.get('t8t-tc-username'),
                updateUser: parseInt(Cookie.get('t8t-tc-uid')),
                tableArgs: {
                    search: {
                        id_gt: 0
                    }
                },
                // 表头描述
                tableColumns: [
                    {prop: 'voucherCode', label: '凭证单据号'},
                    {prop: 'organizationName', label: '财务组织'},
                    {
                        prop: 'generatedAccountingTime',
                        label: '会计期间',
                        formatter: function (val) {
                            if (val > 0) {
                                var date = new Date(val * 1000)
                                return date.getFullYear() + "-" + (date.getMonth() + 1)
                            }
                        }
                    },
                    {prop: 'status', label: '状态', list: 'status'},
                    {prop: 'templateCode', label: '模版编码'},
                    {prop: 'templateName', label: '模版名称'},
                    {prop: 'k3No', label: 'K3凭证号'},
                    {prop: 'createName', label: '创建人'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'}
                ],
                // 搜索项配置
                searchFields: [
                    {type: 'select', label: '财务组织', name: 'organizationId', selectSourceKey: 'organizationId'},
                    {type: 'datepicker', label: '会计期间', name: 'generatedAccountingTime', pickertype: 'month'},
                    {type: 'input', label: '凭证单据号', name: 'voucherCode_like'},
                    {type: 'select', label: '状态', name: 'status', selectSourceKey: 'status'},
                    {type: 'input', label: 'K3凭证号', name: 'k3No_like'},
                    {type: 'input', label: '模版编码', name: 'templateCode_like'}
                ],
                // 搜索项对应值
                searchOptions: {
                    status: [
                        {value: 1, text: '有效'},
                        {value: 2, text: '作废'},
                        {value: 3, text: '记账'}
                    ],
                    organizationId: []
                }
            }
        },
        created () {
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
            doView: function() {
                this.checkArray = this.$refs['list-view'].getTableInstance().getSelectRows()
                if (this.checkArray.length > 1) {
                    this.$message.error('请勾选单条数据操作')
                    return
                }else if(this.checkArray.length===0)
                {
                    this.$message.error('没有选中需要查看的行!')
                    return
                }
                this.$refs['list-view'].doView(this.detailRoute)
            },

            doAdd () {

            },
            doEdit () {
                this.ids = []
                this.checkArray = this.$refs['list-view'].getTableInstance().getSelectRows()
                let ErrorCount = 0
                if (this.checkArray.length > 0) {
                    let status = 0
                    this.checkArray.forEach((item) => {
                        status = item.status
                        if (status !== 1) {
                            ErrorCount++
                        } else {
                            this.ids.push(item.id)
                        }
                    })
                    if (ErrorCount) {
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '作废、记账状态的数据，不可进行操作',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        return false
                    }
                } else {
                    this.$message.error('请先勾选数据后再进行凭证作废操作')
                    return
                }
                let invalidArg = {
                    voucherOrder: {
                        ids: this.ids,
                        updateName: this.updateName,
                        updateBy: this.updateBy,
                        updateUser: this.updateUser
                    }
                }
                voucherOrderApi.voucherInvalid(invalidArg).then((res) => {
                    if (res.data.status === 200) {

                        let failNum = res.data.result.fail
                        let successNum = res.data.result.success
                        let message = "本次成功作废" + successNum + "条数据," + "失败" + failNum + "条"

                        this.$msgbox({
                            title: '消息',
                            message: message,
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        this.$refs['list-view'].getTableInstance().reloadTable()
                    } else {
                        this.isLoading = false
                        this.$message.error(res.data.message)
                    }
                })
            },
            doKeepAccount () {
                this.ids = []
                this.checkArray = this.$refs['list-view'].getTableInstance().getSelectRows()
                let ErrorCount = 0
                if (this.checkArray.length > 0) {
                    let status = 0
                    this.checkArray.forEach((item) => {
                        status = item.status
                        if (status !== 1) {
                            ErrorCount++
                        } else {
                            this.ids.push(item.id)
                        }
                    })
                    if (ErrorCount) {
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '作废、记账状态的数据，不可进行记账操作',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        return false
                    }
                } else {
                    this.$message.error('请先勾选凭证后再进行记账操作')
                    return
                }
                let accountArg = {
                    ids: this.ids,
                    updateUser: this.updateUser
                }

                voucherOrderApi.keepAccount(accountArg).then((res) => {
                    if (res.data.status === 200) {
                        let message = '记账成功' + res.data.result.successCount + '条，失败' + res.data.result.failedCount + '条,' + res.data.result.failedBillMsg
                        this.$msgbox({
                            title: '消息',
                            message: message,
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        this.$refs['list-view'].getTableInstance().reloadTable()
                    } else {
                        this.isLoading = false
                        this.$message.error(res.data.message)
                    }
                })
            }
        }
    }
</script>

<style lang="css" scoped>

</style>
