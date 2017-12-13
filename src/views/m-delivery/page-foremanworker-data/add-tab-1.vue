<template>
    <div class="add-tab-1">
        <t8t-table
            ref="tableDebitType"
            :args="args"
            :service="service"
            :method="method"
            :columns="columns"
            :selectCol="true"
            :indexCol="true"
            :commonData="commonData"
        >
        </t8t-table>
    </div>
</template>

<script>
import apiCommon from 'src/services/commonApi/commonApi.js'
import service from 'src/services/delivery/Service.js'
import tableConfig from './add-tab-1.js'

let orderId
let pageType
export default {
    name: 'add-tab-1',
    data() {
        return {
            service: null,
            method: null,
            args: null,
            columns:tableConfig.tableDebitType,
            commonData:{
                workerStatusList:[
                    {
                        text: '暂存',
                        value: 0
                    },
                    {
                        text: '信息待审核',
                        value: 1
                    },
                    {
                        text: '信息审核通过',
                        value: 2
                    },
                    {
                        text: '信息审核被驳回',
                        value: 3
                    },
                    {
                        text: '合作中',
                        value: 4
                    },
                    {
                        text: '待清退',
                        value: 5
                    },
                    {
                        text: '已清退',
                        value: 6
                    },
                    {
                        text: '工长解约被驳回',
                        value: 7
                    }
                ],
                isWorkerBankAccountList:[
                    {
                        text: '否',
                        value: 0
                    },
                    {
                        text: '是',
                        value: 1
                    }
                ]
            },
        }
    },
    created() {
        if(this.$route.query.id){
                this.args = {info:{projectManagerId:this.$route.query.id}, sort:['id_desc']}
                this.service = service.FOREMANWORKER.name
                this.method = service.FOREMANWORKER.methods.queryWorkerSub
         }
    },
    methods: {
    }
};
</script>

<style lang="css" scoped>
	.my-toolbar{
	    position: absolute;
		left: 50px;
	}
	.t8t-full-dialog .t8t-table{
		top: 10px;
		bottom: 10px;
		left: 50px;
		right: 50px;
		position: absolute;
	}
</style>