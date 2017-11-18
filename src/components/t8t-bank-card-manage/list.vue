<template>
	<div>
		<el-dialog title="管理银行卡" v-model="dialogVisible" size="large-700" @close="closeDialog">
			<div class="t8t-toolbar">
				<el-button
					size="toolbar"
					@click="addCard"
				>
					新增银行卡
				</el-button>
				<el-button
					size="toolbar"
					@click="setDefaultCard"
				>
					设为默认银行卡
				</el-button>
				<el-button
					size="toolbar"
					@click="showCardDetail"
				>
					查看详情
				</el-button>
			</div>
		    <t8t-table
		    	ref="cardTable"
		        :style="{height:'350px'}"
		        :columns="columns"
		        :pageBar="true"
		        :editable="false"
		        :radioCol="true"
		        :service="service"
		        :method="method"
		        :args="args"
		        @current-row-change="currentRowChange"
		    >
		    </t8t-table>
		</el-dialog>
		<t8t-bank-card-manage
		    v-if="cardDialogShow"
		    :title="dialogTitle"
		    :editType="editType"
		    :rowId="cardId"
		    :additionalData="additionalData"
		    @after-edit="onAfterEdit"
		    @close="cardDialogShow = false"
		>
		</t8t-bank-card-manage>
	</div>
</template>

<script>
	import T8tBankCardManage from 'src/components/t8t-bank-card-manage/detail.vue'
	import Service from 'src/services/delivery/Service.js'
	import Cookie from 'js-cookie'
	import axios from 'src/utils/axios.js'

	export default {
		components:{
			T8tBankCardManage
		},
		data(){
			return {
				cardDialogShow: false,
				dialogTitle: '',
				editType: '',
				columns:[
					{
						prop: 'bankAccount',
						label: '银行账号'
					},
					{
						prop: 'openingAccountName',
						label: '账户名称'
					},
					{
						prop: 'bankName',
						label: '银行'
					},
					{
						prop: 'isDefault',
						label: '是否默认',
						formatter: function(val){
							return val == 1 ? '是' : '否';
						}
					}
				],
				service: Service.PSSET.name,
				method: Service.PSSET.methods.bankManageQueryPage,
				cardId: null,
				currentRow: null
			}
		},
		props:['args','additionalData'],
		computed: {
		    dialogVisible() {
		        return true
		    },
		},
		methods: {
			closeDialog(){
				this.dialogVisible = false;
				this.$emit('close');
			},
			addCard(){
				this.dialogTitle = '新增银行卡';
				this.editType = 'add';
				this.cardDialogShow = true;
			},
			setDefaultCard(){
				let currentRow = this.currentRow;
				if(currentRow === null){
					this.$message.error('请选择需要设为默认的银行卡！');
				} else if(currentRow.isDefault == 1){
					this.$message.error('该银行卡已是默认银行卡！');
				} else{
					let data = {
			            "id": currentRow.id,     //需修改的银行卡对应主键id
			            "roleTypeCode": this.additionalData.roleTypeCode,     //账号类型编码
			            "userId": this.additionalData.userId,      //关联对象id
			            "verifyUser": +Cookie.get('t8t-tc-uid'),        //修改人
			            "isDefault": 1     //是否默认
			        }
			        this.$confirm('是否确认把该银行卡设为默认银行卡？','提示',{
			        	type: 'warning'
			        }).then(()=>{
			        	axios({
			        		service: Service.PSSET.name,
			        		method: Service.PSSET.methods.bankManageSetOneDefault,
			        		args:{
			        			bankDefaultDTO: data
			        		}
			        	}).then((res)=>{
			        		if(res.data.status === 200){
			        			this.$msgbox({
			        				title: '',
			        				type: 'success',
			        				message: '操作成功',
			        				callback: ()=>{
			        					this.$refs['cardTable'].reloadTable();
			        				}
			        			})
			        		}else{
			        			this.$msgbox({
			        				title: '',
			        				type: 'error',
			        				message: res.data.message ? res.data.message : '操作失败'
			        			})
			        		}
			        	})
			        })
				}
			},
			showCardDetail(){
				let currentRow = this.currentRow;
				if(currentRow === null){
					this.$message.error('请选择需要查看的银行卡！');
				}else{
					this.cardId = currentRow.id;
					this.dialogTitle = '查看银行卡';
					this.editType = 'view';
					this.cardDialogShow = true;
				}
			},
			currentRowChange(row){
				this.currentRow = row;
			},
			onAfterEdit(){
				this.$refs['cardTable'].reloadTable();
			}
		}
	}
</script>

<style lang="css" scoped>
    .t8t-toolbar {
        padding: 13px;
        height: 24px;
    }

    .t8t-toolbar .el-button--toolbar:first-child {
        margin-left: 8px;
    }

    .t8t-toolbar .el-button--toolbar {
        padding: 5px 11px;
        font-size: 12px;
        border-radius: 2px;
        border-color: rgb(232, 237, 241);
        color: rgb(50, 139, 239);
        margin-right: 5px;
    }

    .t8t-toolbar .el-button--toolbar:focus {
        border-color: rgb(191, 201, 217)
    }

    .t8t-toolbar .el-button--toolbar:hover {
        border-color: rgb(50, 139, 239)
    }

    .t8t-toolbar .is-disabled {
        color: rgb(191, 203, 217);
        border-color: rgb(209, 219, 229);
    }

    .t8t-toolbar .is-disabled:hover {
        border-color: rgb(209, 219, 229);
    }

    .t8t-toolbar .el-button--success.is-plain {
        color: rgb(19, 206, 102)
    }

    .t8t-toolbar .el-button--danger.is-plain {
        color: rgb(255, 86, 97)
    }

    .t8t-toolbar .el-button + .el-button {
        margin-left: 0px;
    }
    /* 深色皮肤 */
    .t8t-toolbar.t8t-dark .el-button--toolbar{
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .t8t-toolbar.t8t-dark .el-button--toolbar:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }
</style>
<style>
	.el-dialog--large-700{
		width: 700px;
	}
</style>
