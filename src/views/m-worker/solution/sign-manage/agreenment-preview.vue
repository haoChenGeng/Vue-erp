<template>
    <div class="t8t-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new agreement-preview-dialog">
            <div
                class="preview-tips"
                v-loading="loading"
                :element-loading-text="loadingText"
            ></div>
            <div id="pdf"></div>
        </el-dialog>
    </div>
</template>

<script>
    import PDFObject from 'src/utils/pdfobject.js'
    import Api from 'src/services/worker/solution/signManage.js'
    import { mb } from 'src/components/t8t-table/utils/utils.js'
    import Utils from 'src/utils/Utils.js'

    export default {
        name: 'agreement-preview',
        data() {
            return {
                isDialogShow: true,
                goBackRoute: '/tuchat-worker/sign-manage',
                // 合同名称id
                contractNameId: null,
                // 项目id
                businessId: null,
                // 轮询开始时间
                startTime: null,
                currentTime: null,
                maxTime: 5*60*1000,
                pdfUrl: '',
                loading: true,
                loadingText: '正在创建合同'
            }
        },
        props: {
            contractNameId: {
                type: Number,
                require: true
            },
            businessId: {
                type: Number,
                require: true
            },
            contractId: {}
        },
        created() {
            // 轮询查询是否生成合同
            if (this.contractId) {
                this.loadingText = '加载合同中'
            }
            this.startTime = Date.parse(new Date())
            this.pollingIsCreateContract()
        },
        methods: {
            closeDialog()
            {
                if (this.contractId) {
                    this.$emit('previewClose', false)
                }
                else {
                    this.$emit('previewClose', true)
                }
            },
            // 轮询是否已创建合同
            pollingIsCreateContract()
            {
                const currentTime = Date.parse(new Date())
                if ( (currentTime - this.startTime) > this.maxTime) {
                    this.$msgbox(mb('创建合同失败', 'error'))
                    return
                }
                let args = {
                    contractNameId: this.contractNameId,
                    businessId: this.businessId
                }
                Api.checkIsCreateContract(args)
                    .then(res => {
                        if (res.data.status === 200) {
                            if (res.data.result.success) {
                                this.loading = false
                                const pdfUrl = Utils.getPreviewURL(res.data.result.pdfUrl)
                                PDFObject.embed(pdfUrl, "#pdf")
                            }
                            else {
                                setTimeout(() => {
                                    this.pollingIsCreateContract()
                                }, 2000)
                            }
                        }
                        else {
                            this.loading = false
                            this.$msgbox(mb(res.data.message, 'error'), () => {
                                this.closeDialog()
                            })
                        }
                    })
            }
        }
    }
</script>

<style lang="css">
    .preview-tips {
        top: 50% !important;
    }
    .agreement-preview-dialog .el-dialog{
        width: 80%;
    }
    #pdf{
        height: 100%;
    }
</style>
