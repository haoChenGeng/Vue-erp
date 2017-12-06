<template>
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
        :tableEditable="false"
        @list-view="doView"
        @list-delete="doDelete"
        @list-add-row="doAdd"
        @list-edit-row="doEdit"
        @list-void-row="doVoid"
        @list-view-row="doView"
        @search-submit="onSearchSubmit"
        :beforeSearchSubmit="beforeSubmit"
    >
    </t8t-list-view>

</template>

<script>

    import commonApi from 'src/services/commonApi/commonApi.js'
    import itemAssignService from 'src/services/itemAssign/Service.js'
    import itemAssignAPI from 'src/services/itemAssign/API.js'
    import Cookie from 'js-cookie'

    export default {
        created () {
            // 辅助资料初始化
            // 评分执行频率
            this.getCommonOptions('42002', 'assessHzs')
            // 评分对象
            this.getCommonOptions('42001', 'assessObject')

            this.searchFields[2].value = 0
        },
        data () {
            return {
                // service 和 method 目前需要加密
                service: itemAssignService.ITEM_ASSIGN.name,
                // /biz/t8t-ps-pim/app  assessObj.queryPage
                method: itemAssignService.ITEM_ASSIGN.methods.ASSESSOBJ_QUERY_PAGE,
                // assessObj.deleteByIds
                deleteMethod: itemAssignService.ITEM_ASSIGN.methods.ASSESSOBJ_DELETE_BY_IDS,
                tableArgs: {},
                // 表头描述
                tableColumns: [
                    {prop: 'id', label: 'ID'},
                    {prop: 'objId', label: '考核对象', list: 'assessObject', editor: { type: 'select' }},
                    {prop: 'assessHz', label: '执行频率', list: 'assessHzs', editor: {type: 'select'}},
                    {prop: 'state', label: '状态', list: 'settingStatus', editor: {type: 'select'}},
                    {prop: 'createName', label: '创建人名称'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'},
                    {prop: 'updateName', label: '修改人名称'},
                    {prop: 'updateTime', label: '修改时间', formatter: 'dateParser'}
                ],
                // 面包屑
                breadcrumbData: [
                    {title: '交付管理'},
                    {title: '交付基础配置'},
                    {title: '综合评分配置'}
                ],
                // 搜索项配置
                searchFields: [
                    {type: 'select', label: '考核对象', name: 'objId', selectSourceKey: 'assessObject'},
                    {type: 'select', label: '执行频率', name: 'assessHz', selectSourceKey: 'assessHzs'},
                    {type: 'select', label: '状态', name: 'state', selectSourceKey: 'settingStatus', defaultValue: 1}
                ],

                // 搜索项对应值
                searchOptions: {
                    assessObject: [],
                    assessHzs: [],
                    settingStatus: [
                        {
                            text: '启用',
                            value: 1
                        },
                        {
                            text: '作废',
                            value: 2
                        }
                    ]
                }
            }
        },
        // watch: {
        //     $route: function () {
        //         this.$refs['t8ttable'].reloadTable()
        //     }
        // },
        activated() {
            this.$refs['t8ttable'].reloadTable()
        },
        methods: {
            onSearchSubmit (data) {

            },
            doView () {
                let row = this.getSelectRowId()
                if (row == null) {
                    return
                }
                this.$refs['list-view'].doView('/itemAssign/page-synthesis-grade-set/view')
            },
            doAdd () {
                this.$refs['list-view'].doAdd('/itemAssign/page-synthesis-grade-set/create')
            },
            doEdit () {
                let row = this.getSelectRowId()
                if (row == null) {
                    return
                }
                this.$refs['list-view'].doEdit('/itemAssign/page-synthesis-grade-set/edit')
            },
            doVoid: function () {
                // 弃用
                let deleteIds = []
                let selectedRows = this.$refs['list-view'].getTableInstance().getSelectRows()
                selectedRows.forEach((row) => {
                    if (row['id']) deleteIds.push(row['id'])
                })
                let args = {ids: deleteIds, updateUser: +Cookie.get('t8t-tc-uid')}
                itemAssignAPI.assessObjectVoid(args).then((res) => {
                    if (res.data.status === 200) {
                        if (res.data.result > 0) {
                            this.showMsg('success', '操作成功！')
                        } else {
                            this.showMsg('error', '操作失败！')
                        }
                        this.$refs['list-view'].getTableInstance().reloadTable()
                    } else {
                        this.$message.error('操作失败！' + res.data.message)
                    }
                })
            },
            getSelectRowId: function () {
                let rows = this.$refs['list-view'].getTableInstance().getSelectRows()
                if (rows.length !== 1) {
                    this.$message.error('请勾选一行数据后再试。')
                    return
                }
                return rows[0]
            },
            // 调用辅助资料接口
            getCommonOptions: function (fatherCode, selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item['propertyStatus'] === 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                };
                            })

                            this.searchOptions[selectName] = list
                        }
                    })
            },
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
