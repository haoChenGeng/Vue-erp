<template>
	<div >
		        <!-- 新增、编辑弹窗 -->
        <el-dialog title="操作记录" class="operation-records" v-model="dialogVisible" @close="closeDialog" size="large">
          <t8t-table 
            :columns="columns"
            :args="args"
            :method="method"
            :service="service"
          >
              
          </t8t-table>
        </el-dialog>
	</div>
</template>

<script >
import Services from 'src/services/system/Service.js'
    export default{
        name:'operation-records',
        props:{
            id:{
                type:Number,
                default:null
            }
        },
        data(){
            return {
                dialogVisible:true,
                service:null,
                method:null,
                args:null,
                columns:[
                    {prop: 'remark', label: '修改内容'},
                    {prop: 'opTime', label: '修改时间', formatter: 'dateParser'},
                    {prop: 'username', label: '修改人'}
                ]
            }
        },
        created(){
            if(this.id){
                this.service = Services.OPL.name,
                this.method = Services.OPL.methods.queryPage,
                this.args = {search:{recordType:'APP权限管理', recordNo:this.id},"sort":["opTime_desc"]}
            }
        },
        methods:{
            closeDialog(){
                this.dialogVisible = false
                this.$parent.showOprationRecords = false
            }
        }
    }

</script>
<style lang="css">
.operation-records .t8t-table{
    height: 350px;
}
</style>