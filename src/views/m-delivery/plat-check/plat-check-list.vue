<template>
	<div class="plat-check-list">
	     <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
		 <el-tabs v-model="tab" @tab-click="handleTabClick">
		 	<el-tab-pane label="提交验收申请" name="deal">
		 		<apply-check-list class="flex1"></apply-check-list>
		 	</el-tab-pane>
		 	<el-tab-pane label="查看验收记录" name="view">
		 		<complete-check-list class="flex1"></complete-check-list>
		 	</el-tab-pane>
		 </el-tabs>
	</div>
</template>

<script type="text/javascript">
	import ApplyCheckList from './apply-check-list.vue'
	import CompleteCheckList from './complete-check-list.vue'
	import Cookie from 'js-cookie'
	export default {
		components:{
			ApplyCheckList,
			CompleteCheckList
		},
		created(){
			
		},
		data(){
			return {
				//breadcrumbData: [{ title: '兔信' },{ title: '施工管理' },{ title: '验收管理' }],
				tab: 'deal'
			}
		},
		methods:{
			handleTabClick(tab){
			
			}
		}
	}
</script>
<style type="text/css">
	.plat-check-list .el-tabs,
	.plat-check-list .el-tabs__content,
	.plat-check-list .el-tab-pane,
	.plat-check-list .flex1{
		display: flex;
		flex: 1;
		flex-direction: column;
	}

</style>