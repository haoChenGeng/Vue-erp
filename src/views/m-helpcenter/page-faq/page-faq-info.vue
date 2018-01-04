<template>
    <div class="t8t-detail-view">
        <el-dialog v-model="dialogVisible" @close="closeDialog" size="full" class="t8t-full-dialog2 dialog-new">
            <div class="t8t-full-dialog2-container faq-wrapper">
                <h2 class="faq-title">{{title}}</h2>
                <div v-html="content"></div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Api from 'src/services/helpcenter/faq.js'

    export default {
        name: 'faq-info',
        data() {
            return {
                // 弹窗是否显示
                dialogVisible: true,
                // 关闭弹窗跳转的路由
                goBackRoute: '/helpcenter/page-faq',
                // 记录id
                recordId: null,
                // 内容
                content: ''
            }
        },
        computed: {

        },
        created() {
            this.recordId = this.$route.query.id
            this.getInfoById()
        },
        methods: {
            // 关闭弹窗
            closeDialog()
            {
                this.$router.push({
                    path: this.goBackRoute,
                    query: {
                        tab: this.$route.query.tab
                    }
                })
            },
            // 获取记录详情
            getInfoById()
            {
                if (this.recordId) {
                    const args = {
                        id: this.recordId
                    }
                    Api.getDetailById(args)
                        .then(res => {
                            if (res.data.status === 200) {
                                this.content = res.data.result.content ? res.data.result.content : ''
                                this.title = res.data.result.title ? res.data.result.title : ''
                            }
                        })
                }
            }
        }
    }
</script>

<style lang="css">
    .t8t-detail-view .full-dialog-form-container, .container-center {
        padding-top: 60px;
    }

    .t8t-detail-view .t8t-table, .t8t-table-container, .normal {
        height: 400px;
    }
    .t8t-detail-view .el-dialog__body {
        overflow: scroll !important;
    }
    .t8t-detail-view .faq-wrapper {
        width: 80% !important;
        padding-left: 10% !important;
        overflow: initial;
    }

    .t8t-detail-view .faq-title {
        text-align: center;
    }
</style>
