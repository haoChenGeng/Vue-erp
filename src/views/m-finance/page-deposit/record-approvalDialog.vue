<template>
    <div>
        <t8t-step-page
            v-if="isShowFlow"
            :method="flowMethod"
            :service="flowService"
            :args="flowArgs"
            @close="backRoute"
        >
        </t8t-step-page>
    </div>
</template>
<script>
    import financeService from 'src/services/finance/Service.js'
    import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'
    export default{
        components: {T8tStepPage},
        data(){
            return {
                isShowFlow:true,
                flowArgs:'',
                flowService:financeService.DEPOSIT_MANAGEMENT.name,
                flowMethod:financeService.DEPOSIT_MANAGEMENT.methods.QUERY_WORKFLOW,
            }
        },
        methods: {
            backRoute(){
                this.$router.push({
                    path: '/finance/record-list'
                })
            },
        },
        created(){
            let query=this.$route.query
            this.flowArgs={recordId:query.id}
        }
    }
</script>
