<template>
    <div v-bind="accAccountBalance-list">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="searchFields"
            :selectSource="searchOptions"
            @submit="onSearchSubmit"
        >
        </t8t-search>
        <t8t-grid
            :indexCol="true"
            :selectCol="false"
            :customColumn="true"
            :columns="tableColumns"
            :service="service"
            :args="tableArgs"
            :method="method"
            :isLoading="isLoading"
            :commonData="searchOptions"
            ref="t8tTable"
            @row-double-click="handleRowDbClick"
        >
        </t8t-grid>
    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/finance/Service.js'
    import apiAccAccountConfig from 'src/services/finance/accAccountConfig.js'

    export default {
        components: {},
        watch: {
//            $route: function () {
//                this.$refs['list-view'].getTableInstance().reloadTable()
//            },
        },
        activated () {
            this.$refs['t8tTable'].reloadTable()
        },
        data () {
            return {
                // 面包屑
                breadcrumbData: [{ title: '财务' },{ title: '资金管理' },{ title: '账户余额' }],
                // 详情页路由地址
                detailRoute: '/tochat-finance/accAccountBalance-detail',
                // service 和 method 目前需要加密
                service: Service.ACC_ACCOUNT_CONFIG.name, // /biz/t8t-fi-acc/app
                method: Service.ACC_ACCOUNT_CONFIG.methods.BALANCE_QUERYPAGE, // views.account.queryPage
                tableArgs: {
                    search:{
                        aa: null
                    },
                    sort:["createTime_desc"],
                    size: 100,
                    page:1
                },
                // 表头描述
                tableColumns: [
                    {prop: 'financialName', label: '组织', show: true},
                    {prop: 'userTypeName', label: '用户类型', show: true},
                    {prop: 'userId', label: '用户ID', show: true},
                    {prop: 'userName', label: '用户名称', show: true},
                    {prop: 'accountTypeName', label: '账户类型', show: true},
                    {prop: 'balance', label: '余额', show: true},
                    {prop: 'createName', label: '创建人', show: false},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser', show: false},
                    {prop: 'updateName', label: '修改人', show: false},
                    {prop: 'updateTime', label: '修改时间', formatter: 'dateParser', show: false},
                    {prop: 'parentAccountTypeName', label: '上级账户类型', show: false}
                ],
                searchCache: {
                    "userTypeCode": null,
                    "userId": null,
                    "accountTypeCode": null
                },
                // 搜索项配置
                searchFields: [
                    {type: 'select', label: '用户类型', name: 'userTypeCode', selectSourceKey: 'userTypeCodeOptions'},
                    {type: 'input', label: '用户ID', name: 'userId'},
                    {type: 'select', label: '账户类型', name: 'accountTypeName', selectSourceKey: 'accountTypeCodeOptions'}
                ],
                // 搜索项对应值
                searchOptions: {
                    userTypeCodeOptions: [],
                    accountTypeCodeOptions: []
                }
            }
        },
        created() {
            //读取辅助资料 用户类型
            this.getCommonOptions('6!610!61016!', 'userTypeCodeOptions')
            //账户类型
            this.getAccountTypeByUserType()
        },

        methods: {
            onSearchSubmit (obj) {
                this.searchCache = obj
                this.tableArgs = {
                    search: obj,
                    sort:["createTime_desc"],
                    size: 100,
                    page:1
                }
            },
            //双击行查看
            handleRowDbClick(row) {
                debugger
                this.$router.push({
                    path: '/tochat-finance/accAccountBalance-detail',
                    query: {
                        //账户id
                        accountId: row.id,
                        accountLevel: row.accountLevel
                    }
                })
            },

            //辅助资料
            getCommonOptions: function(fatherCode,selectName) {
                let arg =  {
                    fields: [
                        "id",
                        "propertyName",
                        "propertyCode",
                        "propertyStatus",
                        "wholeCode"
                    ],
                    page: 1,
                    search: {
                        wholeCode_like: fatherCode
                    },
                    size: 1000
                }
                let list = []
                commonApi.queryPage(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.rows.forEach((item) => {
                                //启用
                                if (item.propertyStatus===1) {
                                    list.push({
                                        value: item.wholeCode,
                                        text: item.propertyName
                                    })
                                };
                            })
                            this.searchOptions[selectName] = list
                        }
                    })
            },

            //获取账户类型
            getAccountTypeByUserType(){
                let arg =  {
                    userTypeCode: null
                }
                let list = []
                apiAccAccountConfig.getAccountTypeByUserType(arg).then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            list.push({
                                value: item.name,
                                text: item.name
                            })
                        })
                        this.searchOptions['accountTypeCodeOptions'] = list
                    }
                })
            }
        }
    }
</script>

<style lang="css" scoped>

</style>
