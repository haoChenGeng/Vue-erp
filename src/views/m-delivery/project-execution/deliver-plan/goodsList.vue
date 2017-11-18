<template>
	<div class="installation-goods">
		<el-dialog
            v-model="visible"
            :title="title"
            size="720px"
            @close="close"
        >
            <t8t-search
	            :fields="fields"
	            :selectSource="selectSource"
	            :showToggleBtn="false"
	            @submit="submitSearch"
        	>
        	</t8t-search>
            <div class="g-main-container">
            	<div class="list-container">
            		<t8t-table
            			ref="table"
			            :service="service"
			            :method="method"
			            :radioCol="true"
			            :columns="columns"
			            :args="goodsArgs"
                        @row-double-click="handleDobuleClick"
            		>
            		</t8t-table>
            	</div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm">确 定</el-button>
                <el-button @click="close">取 消</el-button>
            </div>
         </el-dialog>
	</div>
</template>
<script>
 import Utils from 'src/utils/Utils.js'
 import {Service, methods} from 'src/services/delivery/installation-schedule/Service.js'
	export default{
		name:'goodsListDialog',
		props:{
		},
		data(){
			return {
				visible:true,
				title:'商品查询',
				fields:[
					{type: 'input',label: 'SKU ID',name: 'skuId'},
					{type: 'input',label: '商品名称',name: 'goodsName'}
				],
                service:Service.INSTALLATION.name,
                method:Service.INSTALLATION.methods.queryInstallTask,
                columns:[
                	{
                        'prop': 'skuId',
                        'label': 'SKU ID'
                    },
                    {
                        'prop': 'goodsCode',
                        'label': '商品编码'
                    },
                    {
                        'prop': 'goodsName',
                        'label': '商品名称'
                    },
                    {
                        'prop': 'basicUnitName',
                        'label': '单位名称'
                    }
                ],
                selectSource:[],
                goodsArgs:{}
			}
		},
		created(){
		},
		methods:{
            confirm(){
            	let row = this.$refs.table.getSelectRows();
            	if(row.length < 1){
            		this.$message.error("请先选择商品！")
            		return
            	}
            	this.$parent.setGoodsTableRowData(row[0])
                this.$parent.showGoodsSearchDialog = false
            },
            submitSearch(obj){
                this.goodsArgs.search = {}
                this.goodsArgs.search.skuId = obj.skuId
                this.goodsArgs.search.goodsName = obj.goodsName
                this.goodsArgs = Object.assign({}, this.goodsArgs)
            },
            close(){
            	this.$parent.showGoodsSearchDialog = false
            },
            handleDobuleClick(row, event, selectable){
                this.$parent.setGoodsTableRowData(row)
                this.$parent.showGoodsSearchDialog = false
            }
		}
	}
</script>
<style lang="css">
	.installation-goods .dialog_tree{
		 height: 500px;
	}
	.installation-goods .table-container{
		height: 500px;
	}
	.installation-goods .t8t-tree .tree-header{
		padding: 0;
	}
    .installation-goods .el-dialog--720px{
        width: 820px;
    }
    .installation-goods .list-container{
        width: 100%;
    }
</style>
