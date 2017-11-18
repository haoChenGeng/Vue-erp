<template>
	<div class="receive-goods">
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
    import api from 'src/services/delivery/foremanworker.js'
    import Service from 'src/services/delivery/Service.js'
	export default{
		name:'goodsListDialog',
		props:{
			activeRow:Number,
            goodsArgs:Object,
		},
		data(){
			return {
				visible:true,
				title:'商品查询',
				fields:[
					{type: 'input',label: 'SKU ID',name: 'skuId'},
					{type: 'input',label: '商品名称',name: 'goodsName'}
				],
                service:Service.DEMAND.name,
                method:Service.DEMAND.methods.QUERYTOOKGOODS,
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
                        'prop': 'model',
                        'label': '商品型号'
                    },
                    {
                        'prop': 'standard',
                        'label': '商品规格'
                    },
                    {
                        'prop': 'brandName',
                        'label': '品牌'
                    }
                ],
                selectSource:[]
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
            	this.$parent.setGoodsTableRowData(this.activeRow, row[0])
                this.$parent.showGoodsSearchDialog = false
            },
            submitSearch(obj){
                this.goodsArgs.goodsSearchDTO.skuId = obj.skuId
                this.goodsArgs.goodsSearchDTO.goodsName = obj.goodsName
                this.goodsArgs = Object.assign({}, this.goodsArgs)
            },
            close(){
            	this.$parent.showGoodsSearchDialog = false
            },
            handleDobuleClick(row, event, selectable){
                this.$parent.setGoodsTableRowData(this.activeRow, row)
                this.$parent.showGoodsSearchDialog = false
            }
		}
	}
</script>
<style lang="css">
	.receive-goods .dialog_tree{
		 height: 500px;
	}
	.receive-goods .table-container{
		height: 500px;
	}
	.receive-goods .t8t-tree .tree-header{
		padding: 0;
	}
</style>
