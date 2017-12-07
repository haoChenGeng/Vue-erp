<template>
    <div class="page-pay-plan">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
            >
        </t8t-search>
        <div class="g-main-container-column">
            <t8t-toolbar
                v-on:VIEW="onView"
                v-on:EXPORT="onExport"
            ></t8t-toolbar>
            <t8t-table
                :columns="columns"
                :service="service"
                :method="method"
                :commonData="selectSource"
                :args="args"
                :indexCol="true"
                ref="t8ttable"
                @row-double-click="onView1"
            ></t8t-table>
        </div>
    </div>
</template>

<script>
    import columns from './columns.json'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import baseData from 'src/services/finance/baseData.js'
    import BankService from 'src/services/finance/Service.js'
    import exportUtils from 'src/utils/export.js'


    export default {
        data() {
            return {
                breadcrumbData: [{ title: '财务' }, { title: '财务基础数据' }, { title: '银行账号' }],
                columns: columns,
                service: BankService.FINA_BASEDATA.name,
                method: BankService.FINA_BASEDATA.methods.QUERY_PAGE,
                args: {sort:["id_desc"]},
                //搜索表单项配置
                fields: [
                    {type: 'input',label: '银行账号',name: 'bankAccount_like'},
                    {type: 'input',label: '账户名称',name: 'openingAccountName_like'},
                    {type: 'select',label: '银行',name: 'bankId', selectSourceKey:'bankOptions'},
                    {type: 'select',label: '状态',name: 'status', selectSourceKey:'statusOptions'},
                    {type: 'select',label: '账户对象',name: 'roleTypeId', selectSourceKey:'roleTypeOptions'},
                    {type: 'input',label: '关联对象',name: 'userName'},
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    bankOptions: [],
                    statusOptions: [{
                        text: '暂存',
                        value: 0
                    },{
                        text: '待审核',
                        value: 1
                    },{
                        text: '已审核',
                        value: 2
                    },{
                        text: '已作废',
                        value: 3
                    }],
                    roleTypeOptions: [],
                    defaultOptions: [
                        {text: '否', value: 0},
                        {text: '是', value: 1}
                    ]
                }
            }
        },
        created() {
            // 银行主数据
            this.getCommonOptions('61101','bankOptions')
            this.getCommonOptions('61004','roleTypeOptions')
        },
        methods: {
            onView() {
                let selections = this.$refs['t8ttable'].getSelectRows()
                let that = this
                if (selections.length !== 1) {
                    this.$message.error('请勾选一行数据后再试。')
                    return
                }
                // 弹窗查看
                this.$router.push({path: '/tuchat-finance/basedata/view', query: {id: selections[0].id}} )
            },
            onView1(row) {
                // let CurrentRow = this.$refs['t8ttable'].getCurrentRow()
                // 弹窗查看
                this.$router.push({path: '/tuchat-finance/basedata/view', query: {id: row.id}} )
            },
            onExport() {
                exportUtils({
                    service: BankService.FINA_BASEDATA.name,
                    method: BankService.FINA_BASEDATA.methods.EXCEL_QUERY,
                    args: this.args,
                    headers: '银行,开户支行,银行账号,账户名称,状态,是否默认,账户对象,关联对象,创建人,创建时间',
                    sorts: 'bankName,bankBranchName,bankAccount,openingAccountName,statusName,defaultName,roleTypeName,userName,createName,createDate'
                })
            },
            submitSearch(obj) {
                this.args = { search: obj, sort:["id_desc"]}
            },
            getCommonOptions: function(fatherCode,selectName) {
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
                            if (item.propertyStatus===1) {
                                list.push({
                                    value: item.id,
                                    text: item.propertyName
                                })
                            };
                        })
                        this.selectSource[selectName] = list
                    }
                })
            }
        }
    }

</script>

<style
    lang="css"
    scope
>
    .table-container {
        flex: 1;
        overflow: auto;
        margin-left: -1px;
    }
</style>
