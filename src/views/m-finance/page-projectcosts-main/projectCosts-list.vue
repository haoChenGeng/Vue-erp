<template>
    <div v-bind="projectCosts-list">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="searchFields"
            :selectSource="selectSource"
            @submit="submitSearch"
        >
        </t8t-search>
        <t8t-grid
            :selectCol="false"
            :customColumn="true"
            :columns="columns"
            :service="service"
            :args="args"
            :method="method"
            :isLoading="isLoading"
            ref="t8tTable"
            :indexCol="true"
            @row-double-click="btnView"
        >
            <!--<template slot="projectId" scope="scope">-->
            <!--<a :href="'#/finance/projectCosts-detail?id='+scope.row['id']+'&projectId=' + scope.row['projectId']+'&editType=view'" style="text-decoration: none;">{{ scope.row['projectId'] }}</a>-->
        <!--</template>-->
        </t8t-grid>
    </div>
</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/finance/Service.js'
    import Cookie from 'js-cookie'
    import * as config from './config'

    export default {
        name: 'projectCosts-list',
        components: {},
        watch: {
            $route: function () {
                this.$refs['t8tTable'].reloadTable()
            },
        },
        data () {
            return {
                //表格
                columns: config.columns,
                isLoading: false,
                // 详情页路由地址
                detailRoute: '/tochat-finance/projectCosts-detail',
                // service 和 method 目前需要加密
                service: Service.PROJECT_COSTS.name, // /biz/t8t-fi-pca/app
                method: Service.PROJECT_COSTS.methods.projectCostsQueryPage, // views.projectCosts.queryPage
                args: {
                    "search": {
                        "id_gt": 0
                    },
                    "sort": [
                        "projectId_asc"
                    ]
                },
                searchCache: {
                    "projectId": null,
                    "organizationId": null,
                    "bizTypeId": null,
                    "startTime": null,
                    "completedTime": null
                },

                // 搜索项配置
                searchFields: [
                    {
                        type: 'input',
                        label: '项目ID',
                        name: 'projectId_eq'
                    },
                    {
                        type: 'select',
                        label: '组织',
                        name: 'organizationId',
                        selectSourceKey: 'orgOptions'
                    },
                    {
                        type: 'select',
                        label: '业务类型',
                        name: 'bizTypeId',
                        selectSourceKey: 'bizTypeIdOptions'
                    },
                    {
                        type: 'datepicker',
                        label: '项目开工时间',
                        name: 'startTime',
                        pickertype: 'daterange',
                        startField: 'startTime_gte',
                        endField: 'startTime_lte'
                    },
                    {
                        type: 'datepicker',
                        label: '项目竣工时间',
                        name: 'completedTime',
                        pickertype: 'daterange',
                        startField: 'completedTime_gte',
                        endField: 'completedTime_lte'
                    }
                ],
                // 搜索项对应值
                selectSource: {
                    bizTypeIdOptions: [],
                    orgOptions:[]
                }
            }
        },
        methods: {
            btnView(){
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                } else if (selections.length > 1) {
                    this.$message.error('请对单条数据进行操作。')
                } else {
                    let selectRow = this.$refs['t8tTable'].getSelectRows()[0]
                    this.$router.push({
                        path: '/tochat-finance/projectCosts-detail',
                        query: {
                            id: selectRow.id,
                            projectId:selectRow.projectId,
                            editType: "view"
                        }
                    })
                }
            },
            submitSearch(obj) {
                this.searchCache = obj
                this.args = {search: obj}
            },
            getCommonOptions: function (fatherCode) {
                let arg = {
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
                                if (item.propertyStatus === 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            })
                            this.selectSource.bizTypeIdOptions = list
                        }
                        console.log(this.selectSource.bizTypeIdOptions)
                    })

            },

            getOrganization(){
                let organizationArgs = {
                    page: 1,
                    size:0,
                    fields:["id","name","isDel"],
                    search: {
                        id_gt: 0,
                        typeCode_eq:"001003010", //取组织形态为“门店”
                    }
                }
                commonApi.queryAll(organizationArgs)
                    .then((res => {
                        let list = []
                        console.log(res)
                        if (res.data.status === 200) {
                            res.data.result.rows.forEach((item) => {
                                if (item.isDel === 0) {
                                    list.push({
                                        value: item.id,
                                        text: item.name
                                    })
                                }
                                this.selectSource.orgOptions = list
                            })
                        }
                        console.log(this.selectSource.bizTypeIdOptions)
                    }))

            }
        },
    created() {
        this.getCommonOptions('11008')
        this.getOrganization()
    },
    mounted(){
        setTimeout(_=>{
            this.$refs.t8tTable.$el.querySelector('.el-pagination').__vue__.pageSizes=[5,10,20,50,100]
        },3000)
    }
    }
</script>

<style lang="css" scoped>
    .t8t-table-container .table-container .el-table table tr td div.cell{
        display: block;
    }
</style>
