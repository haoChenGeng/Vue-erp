<template>
	<div class="confirm-list">
	     <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
		 <el-tabs v-model="tab" @tab-click="handleTabClick">
		 	<el-tab-pane label="待开工确认" name="deal">
		 		<unconfirmed-list class="flex1"></unconfirmed-list>
		 	</el-tab-pane>
		 	<el-tab-pane label="已开工确认" name="view">
		 		<confirmed-list class="flex1"></confirmed-list>
		 	</el-tab-pane>
		 </el-tabs>
	</div>
</template>

<script type="text/javascript">
	import UnconfirmedList from './unconfirmed-list.vue'
	import ConfirmedList from './confirmed-list.vue'
	import Cookie from 'js-cookie'
	export default {
		components:{
			UnconfirmedList,
			ConfirmedList
		},
		created(){
			
		},
		data(){
			return {
				//breadcrumbData: [{ title: '兔信' },{ title: '施工管理' },{ title: '开工确认' }],
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
	.confirm-list .el-tabs,
	.confirm-list .el-tabs__content,
	.confirm-list .el-tab-pane,
	.confirm-list .flex1{
		display: flex;
		flex: 1;
		flex-direction: column;
	}

</style>