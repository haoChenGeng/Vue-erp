<template>
    <div class="sign-manage">
        <!-- 面包屑 -->
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <el-tabs v-model="mainActiveTab" @tab-click="changeTab">
            <el-tab-pane label="未签约" name="unsign">
                <!-- 未签约页面 -->
                <contract-list-unsign v-if="mainActiveTab == 'unsign'" ref="list-view"></contract-list-unsign>
            </el-tab-pane>
            <el-tab-pane label="已签约" name="sign">
                <!-- 已签约页面 -->
                <contract-list-sign v-if="mainActiveTab == 'sign'" ref="list-view"></contract-list-sign>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import ContractListUnsign from './contract-list-unsign.vue'
    import ContractListSign from './contract-list-sign.vue'

    export default {
        components: {
            ContractListUnsign,
            ContractListSign
        },
        watch: {
            $route: function () {
                this.$nextTick(() => {
                    this.$refs['list-view'].getTableInstance().reloadTable()
                })
            }
        },
        data () {
            return {
                // 默认激活的标签页
                mainActiveTab: 'unsign',
                // 面包屑
                breadcrumbData: [{ title: '设计管理' },{ title: '方案' },{ title: '签约管理' }],
                indexRoute: '/worker/sign-manage',
            }
        },
        created() {
            let tab = this.$route.query.tab
            this.mainActiveTab = tab ? tab : this.mainActiveTab
        },
        methods: {
            changeTab(tab) {
                this.$router.push({
                    path: this.indexRoute,
                    query: {
                        tab: tab.name
                    }
                })
            }
        }
    }
</script>

<style lang="css" scoped>
    .sign-manage .el-tabs, .el-tab-pane {
        display: flex;
        flex: 1;
        flex-direction: column;
        height: 100%;
    }
</style>
