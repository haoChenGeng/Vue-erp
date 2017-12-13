<template>
	<div class="projects-goodsDemands-list">
		<t8t-breadcrumb ref="list-breadcrumb"  :data="breadcrumbData" ></t8t-breadcrumb>
		<el-tabs v-model="activeTab">
			<el-tab-pane label="待下单项目" name="projects">
				<project-list class="flex1"></project-list>
			</el-tab-pane>
			<el-tab-pane label="已下要货单列表" name="goodsDemands">
				<goods-demand-list class="flex1"></goods-demand-list>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import ProjectList from './projectList.vue'
    import GoodsDemandList from './goodsDemand-list.vue'
	export default {
		name:'projects_goodsDemands_list',
		components: {ProjectList, GoodsDemandList},
		data(){
			return {
				activeTab: 'projects',
				// 面包屑
                breadcrumbData: [{title: '交付管理'}, {title: '项目计划'}, {title: '要货单'}]
			}
		}
	}
</script>
<style type="text/css">
	.projects-goodsDemands-list .el-tabs,
	.projects-goodsDemands-list .el-tabs__content,
	.projects-goodsDemands-list .el-tab-pane,
	.projects-goodsDemands-list .flex1{
		display: flex;
		flex: 1;
		flex-direction: column;
	}

</style>