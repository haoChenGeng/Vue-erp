<template>
    <div class="faq-wrapper">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <el-tabs v-model="mainActiveTab" @tab-click="changeTab" class="faq-tab">
            <el-tab-pane label="公告" name="01">
            </el-tab-pane>
            <el-tab-pane label="操作说明" name="02">
            </el-tab-pane>
            <el-tab-pane label="常见问题" name="03">
            </el-tab-pane>
        </el-tabs>
        <t8t-list-view
            :searchFields="searchFields"
            :showSearchToggleBtn="false"
            :searchDataSource="searchFormData"
            :treeData="treeData"
            :showTree="showTree"
            :tableColumns="tableColumns"
            :tableService="tableService"
            :tableMethod="tableMethod"
            :tableArgs="tableArgs"
            :showToolbar="showToolbar"
            :tableSelectCol="tableSelectCol"
            @search-submit="searchSubmit"
            @tree-node-click="handleNodeClick"
            @table-row-click="rowClick"
            ref="t8t-list-view"
        ></t8t-list-view>
    </div>
</template>

<script>
    import axios from 'src/utils/axios'
    import Service from 'src/services/helpcenter/Service.js'
    import Cookie from 'js-cookie'
    import Api from 'src/services/helpcenter/faq.js'

    // 帮助类型辅助资料编码
    const TYPE_FATHER_CODE = '10801'
    // 常见问题
    const QUESTION_TYPE_FATHER_CODE = '10804'
    // 适用平台
    const PLATFORM_FATHER_CODE = '10803'
    // 数据类型
    const DATATYPE_FATHER_CODE = '10802'

    export default {
        name: 'page-faq',
        data() {
            return {
                // 面包屑
                breadcrumbData: [{title: '帮助'}],
                mainActiveTab: '01',
                tableColumns1: [
                    {prop: 'title', label: '标题'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser', width: 250},
                ],
                tableColumns2: [
                    {prop: 'title', label: '标题'}
                ],
                searchFields1: [
                    { type: 'input', label: '', name: 'title' },
                ],
                treeData: [],
                searchFields: [],
                tableColumns: [
                    {prop: 'title', label: '标题'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser', width: 250},
                ],
                tableService: Service.FAQ_MANAGE.name,
                tableMethod: Service.FAQ_MANAGE.methods.QUERY_PAGE,
                tableArgs: { search: { state: 10 } },
                showTree: false,
                showToolbar: false,
                tableSelectCol: false,
                curPage: 1,
                pgSize: 20,
                // 帮助类型和key的对应关系
                codeMapKey: {},
                // 适用平台的code对应key
                platformCodeMapKey: {},
                // faq 信息路由
                faqInfoRouter: 'page-faq/info',
                // 当前页路由
                currRouter: 'page-faq',
                searchFormData: {
                    title: null
                },
                clickNode: null
            }
        },
        created() {
            this._initData()
        },
        methods: {
            // 搜索
            onSearchSubmit(obj)
            {
                let searchFormData = { ...obj }
                this.tableArgs = { search: searchFormData }
            },
            changeTab(tab)
            {
                this.clickNode = null
                const name = tab.name
                let obj = null
                switch (name) {
                    case '01':
                        this.tableColumns = this.tableColumns1;
                        this.showTree = false;
                        this.searchFields = []
                        break
                    case '02':
                        this.tableColumns = this.tableColumns2;
                        this.showTree = false;
                        this.searchFields = []
                        break
                    case '03': this.tableColumns = this.tableColumns2;
                        this.showTree = true;
                        this.searchFields = this.searchFields1
                        obj = {isHot: 1}
                        break
                    default:
                        this.tableColumns = []
                        this.searchFields = []
                        this.showTree = false

                }
                this.$refs['t8t-list-view'].getTableInstance().curPage = 1
                this.searchFormData = {title: null}
                this.reloadData(obj)
            },
            _initData()
            {
                const promise1 = Api.query_faq_property({parentCode: TYPE_FATHER_CODE})

                //适用平台为装修公司
                const promise2 = Api.query_faq_property({parentCode: PLATFORM_FATHER_CODE, prefixCode: '02002'})

                //装修公司后台PC类别的常见问题, 如果想增加问题类别请在 供应链 》 配置管理 》 业务辅助资料 =》帮助中心 》常见问题类型中修改或者增加编码为02002XXX的条目
                const promise3 = Api.query_faq_property({parentCode: QUESTION_TYPE_FATHER_CODE, prefixCode: '02002'})

                //数据类型为装修公司后台
                const promise4 = Api.query_faq_property({parentCode: DATATYPE_FATHER_CODE, prefixCode: '02'})

                Promise.all([promise1, promise2, promise3, promise4])
                    .then(res => {
                        if (res[0].data.status === 200) {
                            let list = {}
                            res[0].data.result.forEach((item) => {
                                list[item.propertyCode] = item.id
                            })
                            this.codeMapKey = list
                        }

                        if (res[1].data.status === 200) {
                            let list = {}
                            res[1].data.result.forEach((item) => {
                                list[item.propertyCode] = item.id
                            })
                            this.platformCodeMapKey = list
                        }

                        let treeData = [
                            {
                                id: 1,
                                label: '热点问题',
                                name: 'isHot',
                                children: []
                            },
                            {
                                id: 2,
                                label: '全部问题',
                                name: 'type',
                                code: '03',
                                children: []
                            }
                        ]
                        if (res[2].data.status === 200) {
                            res[2].data.result.forEach((item) => {
                                if (item.propertyStatus===1) {
                                    treeData[1].children.push({
                                        id: item.id,
                                        label: item.propertyName,
                                        name: 'questionType'
                                    })
                                }
                            })
                            this.treeData = treeData
                        }

                        if (res[3].data.status === 200) {
                            this.erpDataType = res[3].data.result[0] ? res[3].data.result[0].id : 0
                        }
                        this.reloadData()
                    })
            },
            // 加载数据
            reloadData(obj)
            {
                let search = obj || {}
                search.type = this.codeMapKey[this.mainActiveTab]
                search.dataType = this.erpDataType
                search.state = 1

                if (this.mainActiveTab == '03') {
                    search.platform = this.platformCodeMapKey['02002']
                }
                else {
                    search.platform = null
                    search.isHot = null
                }
                if (!search.dataType) {
                    return
                }
                if (!search.type) {
                    return
                }
                if (this.mainActiveTab == '03' && !search.platform) {
                    return
                }
                this.onSearchSubmit(search)
            },
            handleNodeClick(data)
            {
                const name = data.name
                let tableArgs = {}
                switch (name) {
                    case 'isHot':
                        this.clickNode = 1
                        tableArgs = {
                            search: {
                                isHot: data.id
                            }
                        }
                        break
                    case 'type':
                        this.clickNode = null
                        tableArgs = {
                            search: {
                                type: this.codeMapKey[data.code],
                                isHot: null
                            }
                        }
                        break
                    case 'questionType':
                        this.clickNode = null
                        tableArgs = {
                            search: {
                                type: this.codeMapKey['03'],
                                questionType: data.id,
                                platform: this.platformCodeMapKey['02002'],
                                isHot: null
                            }
                        }
                        break
                }
                this.reloadData(tableArgs.search)
            },
            searchSubmit(obj) {
                obj.title_like = obj.title
                obj.title = null
                obj.isHot = null
                this.reloadData(obj)
            },
            rowClick(row)
            {
                this.$router.push({
                    path: this.faqInfoRouter,
                    query: {
                        id: row.id,
                        tab: this.mainActiveTab
                    }
                })
            },
        }
    }
</script>

<style lang="css">
</style>
