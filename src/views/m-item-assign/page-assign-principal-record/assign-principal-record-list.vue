<template>
    <!-- 标签页区 -->
    <div class="full-dialog-tabs-container">
        <t8t-list-view
            ref="list-view"
            :deleteMethod="deleteMethod"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="true"
            :tableColumns="tableColumns"
            :tablePageSize="50"
            :tableService="service"
            :tableArgs="tableArgs"
            :tableMethod="method"
            :tableCommonData="searchOptions"
            @search-submit="onSearchSubmit"
        >
        </t8t-list-view>
    </div>
</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'
    import itemAssignApi from 'src/services/itemAssign/API.js'
    import itemAssignService from 'src/services/itemAssign/Service.js'

    export default {
        created () {
            // 派工类型
            this.getCommonOptions('82301', 'assignTypes')
        },
        data () {
            return {
                // 列表服务配置
                service: itemAssignService.ITEM_ASSIGN.name,
                method: itemAssignService.ITEM_ASSIGN.methods.LIST_ASSIGN_RECORD,
                tableArgs: {
                },
                // 表头描述
                tableColumns: [
                    {prop: 'rootOrgName', label: '装修公司'},
                    {prop: 'sourceProjectId', label: '项目ID'},
                    {prop: 'bizType', label: '业务类型'},
                    {prop: 'reason', label: '派工原因'},
                    {prop: 'assignType', label: '派工类型'},
                    {prop: 'principalName', label: '负责人'},
                    {prop: 'state', label: '单据状态', list: 'assignState'},
                    {prop: 'assignerName', label: '操作人'},
                    {prop: 'assignTime', label: '操作时间', formatter: 'dateParser'}
                ],
                // 搜索项配置
                searchFields: [
                    {type: 'input', label: '项目ID', name: 'sourceProjectId'},
                    {type: 'select', label: '派单类型', name: 'typeId', selectSourceKey: 'assignTypes'},
                    {
                        type: 'datetime', label: '派单时间', name: 'checkTime', pickertype: 'datetimerange',
                        startField: 'updateTime_gte',
                        endField: 'updateTime_lte',
                        inputWidth:'200'
                    },
                ],
                // 面包屑
                breadcrumbData: [
                    {title: '工程管理'},
                    {title: '工程派单'},
                    {title: '工程派单'}
                ],
                // 搜索项对应值
                searchOptions: {
                    "updateTime_gte":null,
                    "updateTime_lte":null,
                    assignTypes: [],
                    assignState: [
                        {value: 0, text: '未完成'},
                        {value: 1, text: '生效'},
                        {value: 2, text: '作废'}
                    ]
                }
            }
        },
        methods: {
            onSearchSubmit: function () {
            },
            // 调用辅助资料接口
            getCommonOptions: function(fatherCode, selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                commonApi.queryUnionParent(arg).then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus === 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName,
                                        code: item.propertyCode
                                    })
                                };
                            })

                            this.searchOptions[selectName] = list
                        }
                    })
            },
            // 弹窗提示抽离方法
            showMsg: function (state, msg) {
                this.$msgbox({
                    title: '消息',
                    type: state,
                    message: msg,
                    showCancelButton: false,
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
            }
        }
    }
</script>

<style lang="css" scoped>

</style>
