<template>
	<div class="yanshou-list">
	     <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
		 <el-tabs v-model="tab" @tab-click="handleTabClick">
		 	<el-tab-pane label="待处理验收" name="deal">
		 		<yanshou-bill class="flex1"></yanshou-bill>
		 	</el-tab-pane>
		 	<el-tab-pane label="全部验收" name="all">
		 		<yanshou-bill-all class="flex1"></yanshou-bill-all>
		 	</el-tab-pane>
		 	<el-tab-pane label="负责项目" name="project">
		 		<yanshou-project class="flex1"></yanshou-project>
		 	</el-tab-pane>
		 </el-tabs>
	</div>
</template>

<script type="text/javascript">
	import YanshouBill from './yanshou-bill.vue'
	import YanshouBillAll from './yanshou-bill-all.vue'
	import YanshouProject from './yanshou-project.vue'
	import Cookie from 'js-cookie'
	export default {
		components:{
			YanshouBill,
			YanshouBillAll,
			YanshouProject
		},
		created(){
			let procInsId = this.$route.query.procInsId;
            if(procInsId){
            	this.tab = 'all';
            }
		},
		data(){
			return {
				breadcrumbData: [{ title: '交付' },{ title: '项目执行' },{ title: '验收单' }],
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
	.yanshou-list .el-tabs,
	.yanshou-list .el-tabs__content,
	.yanshou-list .el-tab-pane,
	.yanshou-list .flex1{
		display: flex;
		flex: 1;
		flex-direction: column;
	}

</style>