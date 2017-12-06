<template>
	<div>
		<t8t-search
			:fields="searchFields"
			@submit="handleSearchSubmit"
		>
		</t8t-search>
		<t8t-toolbar
			:symbolList="symbolList"
			:disabledSymbols="disabledSymbols"
			@ADD_DEMAND="handleAddDemand"
			@APPLY_DEMAND="handleApplyDemand"
			@VIEW_PROJECT="handleViewProject"
            ref="toolbar"
	        >
	    </t8t-toolbar>
	    <t8t-table
	    	ref="table"
            :service="service"
            :method="method"
            :columns="columns"
            :args="args"
            :commonData="selectSource"
            @row-double-click="handleRowDblclick"
            @selection-change="handleSelectionChange"
	    >
	    	<template slot="projectId" scope="scope">
                <a 
                	href="javascript:;"
                    @click="showDetail(scope.row['projectId'])"
                >
                {{scope.row['projectId']}}
                </a>
            </template>
	    </t8t-table>
	</div>
</template>

<script >
	import Service from 'src/services/delivery/Service.js'
	export default{
		name:'projectList',
		data(){
			return {
				searchFields:[
					{type: 'input',label: '项目ID',name: 'projectId'}
				],
				symbolList:['ADD_DEMAND', 'VIEW_PROJECT', 'APPLY_DEMAND'],
				service:Service.DEMAND.name,///biz/t8t-ps-pim/app
				method:Service.DEMAND.methods.queryProjectList, //views.goodsDemand.queryProjectList
				args:{},
				columns:[
					{ prop: 'projectId', label: '项目ID' ,width:'250'},
					{ prop: 'ownerName', label: '业主姓名',width:'250' },
					{ prop: 'organizationName', label: '组织',width:'250'  },
					{ prop: 'bizTypeName', label: '业务类型' ,width:'250' },
					{ prop: 'pkgName', label: '装修产品' ,width:'250' },
					{ prop: 'detailAddress', label: '工地地址' }
				],
				disabledSymbols:[]
			}
		},
		methods:{
			showDetail(projectId){
				this.$router.push({ path: 'demand-projects-detail',query:{projectId: projectId} })
			},
			handleSelectionChange(){
				if(this.$refs.table.getSelectRows().length > 1){
					this.disabledSymbols = ['ADD_DEMAND', 'VIEW_PROJECT', 'APPLY_DEMAND']
				}else{
					this.disabledSymbols = []
				}
			},
			handleSearchSubmit(data){
				this.args = data
			},
			handleAddDemand(){
				this.$TCS.addTag('red_5216_010002001010') //点击流
				let rows = this.$refs.table.getSelectRows()
				if(rows.length < 1){
					this.$message.error("请选择单条数据进行操作！")
					return
				}
				if(rows.length > 1){
					this.$message.error("请选择单条数据进行操作！")
					return
				}
				this.$router.push({ path: 'demand-receipts',query:{mode:'add', projectId: rows[0]['projectId']} })
			},
			handleApplyDemand(){
				let rows = this.$refs.table.getSelectRows()
				if(rows.length < 1){
					this.$message.error("请选择单条数据进行操作！")
					return
				}
				if(rows.length > 1){
					this.$message.error("请选择单条数据进行操作！")
					return
				}
				this.$router.push({ path: 'demand-receipts',query:{mode:'replenish', projectId: rows[0]['projectId']} })
			},
			handleViewProject(){
				let rows = this.$refs.table.getSelectRows()
				if(rows.length < 1){
					this.$message.error("请选择单条数据进行操作！")
					return
				}
				if(rows.length > 1){
					this.$message.error("请选择单条数据进行操作！")
					return
				}
				this.$router.push({ path: 'demand-projects-detail',query:{projectId: rows[0]['projectId']}})
			}
		}
	}
</script>