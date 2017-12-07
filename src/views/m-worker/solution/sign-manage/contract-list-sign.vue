<template>
    <!-- 签约管理-已签约 -->
    <div class="list-wrapper">
        <!-- 搜索区域 -->
        <t8t-search
            ref="list-search"
            v-if="searchFields.length > 0"
            :fields="searchFields"
            :selectSource="searchOptions"
            :formData="searchFormData"
            @submit="submitSearch"
        >
        </t8t-search>
        <!-- tab标签页 -->
        <div class="g-main-container-column">
            <!-- 工具条 -->
            <t8t-toolbar
                @VIEW_PAPER="view_paper"
                @VIEW_SELECTION="view_selection"
                @ADD="add"
                :symbolList="symbolList"
            ></t8t-toolbar>

            <!-- table -->
            <t8t-table
                ref="list-table"
                :columns="tableColumns"
                :service="service"
                :method="method"
                :args="tableArgs"
                :commonData="searchOptions"
                :radioCol="true"
            >
            </t8t-table>
        </div>
    </div>
</template>

<script>
    import Service from 'src/services/worker/solution/Service.js'
    import Api from 'src/services/worker/solution/signManage.js'
    import Cookie from 'js-cookie'
    import PDFObject from 'src/utils/pdfobject.js'
    import { orderStatusArray } from './config'

    export default {
        name: 'contract-list-unsign',
        data () {
            return {
                mainActiveTab: 'tab1',
                searchFormData: {},
                // 面包屑
                breadcrumbData: [{ title: '设计管理' },{ title: '方案' },{ title: '签约管理' }],
                // 编辑页路由地址
                editRoute: '',
                // service 和 method 目前需要加密
                service: Service.SIGN_MANAGE.name,
                method: Service.SIGN_MANAGE.methods.CONTRACT_LIST,
                tableArgs: { search: {id: null, orderStatus_eq: 7}, userId: Cookie.get('t8t-tc-uid'), sort:["id_desc"] },
                // 表头描述
                tableColumns: [
                    {prop: 'yid', label: '项目ID'},
                    {prop: 'owner', label: '业主称呼'},
                    {prop: 'cityName', label: '城市'},
                    {prop: 'townName', label: '区域'},
                    {prop: 'estateName', label: '楼盘名称'},
                    {prop: 'houseStyle', label: '户型'},
                    {prop: 'area', label: '计价面积'},
                    {prop: 'pkgPrice', label: '报价'},
                    {prop: 'orderStatus', label: '报价单状态', list: 'orderStatusArray'},
                    {prop: 'orderSubStatusName', label: '项目状态'}
                ],
                // 搜索项配置
                searchFields: [
                    { type: 'input', label: '项目ID', name: 'yid' }
                ],
                // 搜索项对应值
                searchOptions: {
                    orderStatusArray: orderStatusArray
                },
                // 路由地址
                viewPaperRouter: '/tochat-projectlist/preview',
                viewSelectionRouter: '/tochat-worker/quote-order-detail',
                addRouter: '/tochat-worker/sign-manage/add',
                // 去除合同信息按钮
                symbolList: ['VIEW_PAPER', 'VIEW_SELECTION']
            }
        },
        created() {
            this.mainActiveTab = this.$route.query.tab ? this.$route.query.tab : 'sign'
        },
        methods: {
            // 搜索
            submitSearch(obj) {
                // 报价单状态 7：报价完成
                obj.orderStatus_eq = 7
                this.searchFormData = {...obj}
                this.tableArgs = { search: obj, sort:["id_desc"], userId: Cookie.get('t8t-tc-uid')}
            },
            // 施工图纸
            view_paper()
            {
                const row = this.getLastSelectRow()
                if(row) {
                    this.$router.push({
                        path: this.viewPaperRouter,
                        query: {
                            yid: row[0].yid
                        }
                    })
                }
            },
            // 选材报价单
            view_selection()
            {
                const row = this.getLastSelectRow()
                if(row) {
                    const url = '#' + this.viewSelectionRouter + '?yid=' + row[0].yid
                    window.open(url)
                }
            },
            add()
            {
                const row = this.getLastSelectRow()
                if (row) {
                    this.$router.push({
                        path: this.addRouter,
                        query: {
                            tab: this.mainActiveTab,
                            id: row[0].id
                        }
                    })
                }
            },
            // 获取选中的最后一条数据
            getLastSelectRow()
            {
                const row = this.$refs['list-table'].getSelectRows()
                if (!row || row.length === 0) {
                    this.$message.error('请勾选数据后再操作')
                }
                else if (row.length > 1) {
                    this.$message.error('请对单条数据进行操作')
                } else {
                    return row
                }
            },
            // 返回表格实例
            getTableInstance()
            {
                return this.$refs['list-table']
            }
        }
    }
</script>

<style lang="css">
    .el-tabs__content, .list-wrapper {
        display: flex;
        flex: 1;
        flex-direction: column;
        height: 100%;
    }
</style>
