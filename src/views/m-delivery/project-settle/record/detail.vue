<template>
<div>
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2" :class="{'isHide': isTopHide}">
        <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
             <div class="full-dialog-toolbar-container">
                 <div class="toolbar-container">
                     <t8t-toolbar
                         @APPROVAL-FLOW="approvalFlow"
                         class="t8t-dark"
                     >
                     </t8t-toolbar>
                 </div>
             </div>
             <div class="dialog2-main-container">
                <!-- 表单区 -->
	            <div class="full-dialog-tabs-container full-dialog-form-container">
	                <el-tabs v-model="tab_detail">
	                  	<el-tab-pane label="结算明细" name="template">
          		    		<table class="my-table" cellpadding="8" cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <td align="center" width="10%">序号</td>
                                        <td align="center" width="30%">收支类型</td>
                                        <td align="center" width="30%">结算项</td>
                                        <td align="center" width="30%">金额</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in incomeData">
                                        <td align="center">{{++index}}</td>
                                        <td align="center">收入</td>
                                        <td align="center">{{item.settleItemName}}</td>
                                        <td align="center">{{item.settleAmount}}</td>
                                    </tr>
                                    <tr v-if="incomeData.length">
                                        <td></td>
                                        <td align="center">收入合计</td>
                                        <td></td>
                                        <td align="center">{{incomeSum}}</td>
                                    </tr>
                                    <tr v-for="(item,index) in expendData">
                                        <td align="center">{{index+incomeData.length+1}}</td>
                                        <td align="center">支出</td>
                                        <td align="center">{{item.settleItemName}}</td>
                                        <td align="center">{{item.settleAmount}}</td>
                                    </tr>
                                    <tr v-if="expendData.length">
                                        <td></td>
                                        <td align="center">支出合计</td>
                                        <td></td>
                                        <td align="center">{{expendSum}}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td align="center">结算金额</td>
                                        <td></td>
                                        <td align="center">{{settleSum}}</td>
                                    </tr>
                                </tbody>
                            </table>
	                  	</el-tab-pane>
	              	</el-tabs>
	            </div>
            </div>
        </div>
    </el-dialog>
</div>
</template>

<script>
    import Service from 'src/services/delivery/Service.js'
    import Model from 'src/services/delivery/model.js'
	export default {
		data(){
            let that = this;
			return {
                type: 'view',
				isDialogShow: true,
				tab_detail: 'template',
                incomeData: [],
                expendData: [],
                incomeSum: 0,
                expendSum: 0
			}
		},
        computed:{
            settleSum:function(){
                return parseFloat((this.incomeSum - this.expendSum).toFixed(2));
            }
        },
        created(){
            Model.settleBillItemQueryPage({page: 1, size: 1000, search:{ billCode: this.$route.query.billCode }}).then((res)=>{
                if(res.data.status === 200){
                    res.data.result.rows.forEach((item)=>{
                        if(item.receiptsType == 1){ //收入
                            this.incomeData.push(item);
                            this.incomeSum += item.settleAmount;
                        }else if(item.receiptsType == 2){ //支出
                            this.expendData.push(item);
                            this.expendSum += item.settleAmount;
                        }
                        this.incomeSum = parseFloat(this.incomeSum.toFixed(2));
                        this.expendSum = parseFloat(this.expendSum.toFixed(2));
                    })
                }
            })
        },
        methods: {
            closeDialog() {
                this.$router.go(-1)
            },
            approvalFlow(){
                this.$router.push({
                    path: '/delivery/settle-record/flow',
                    query: { id: this.$route.query.id }
                })
            }
        }
	}
</script>
<style lang="css" scoped>
    .my-table{
        margin: 20px 20px 0 0;
        border-left: 1px solid #dfe6ec;
        border-top: 1px solid #dfe6ec;
        font-size: 12px;
    }
    .my-table td{
        border-right: 1px solid #dfe6ec;
        border-bottom: 1px solid #dfe6ec;
    }
    .table-row{
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .my-table thead td{
        background-color: #eff9ff;
        font-weight: bold;
    }
</style>