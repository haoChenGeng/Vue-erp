<template>
    <div>
        <t8t-step-page
                    v-if="isShowFlow"
                    :method="flowMethod"
                    :service="flowService"
                    :args="flowArgs"
                    @close="closeStepPage"
                >
        </t8t-step-page>
    </div>
</template>
<!-- <template>
    <div>
        <t8t-step-page
                    v-if="isShowFlow"
                    :dataSource="flowData"
                    @close="closeStepPage"
                >
        </t8t-step-page>
    </div>
</template> -->

<script>
    import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'
    import Service from 'src/services/delivery/Service.js'
    export default {
        name: 'page-purchase-invoice',
        components: {
            T8tStepPage
        },
        data () {
            return {
                isShowFlow: true,//是否显示审批流
                flowService: Service.PSSET.name,
                flowMethod: Service.PSSET.methods.settleBillQueryProcessDetail,
                flowArgs: {id: this.$route.query.id},
                flowData: [],//审批流需要的数据
            }
        },
        methods: {
            closeStepPage(){
                this.$router.go(-1);
            },
            //审批流
            flowClick(){
                if(selectRow.proInsId) {
                    //方法一
                    this.flowArgs = {
                        "proInsId": selectRow.proInsId
                    }
                }
                this.isShowFlow = true
            }
        }
    }
</script>