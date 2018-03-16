<template>
	<div class="demand-list">
		<t8t-breadcrumb></t8t-breadcrumb>
		<el-tabs ref="listTab"
		 v-model="tab"
		 @tab-click="handleTabClick">
			<el-tab-pane label='全部订单'
			 name="allList">
				<all-list ref="allList"
				 class="flex1"
				 @updateTabNum="getTableNum"></all-list>
			</el-tab-pane>
			</el-tab-pane>
			<el-tab-pane v-model="waitAuditingTabs"
			 :label='waitAuditingTabs.title'
			 name="waitAuditingList">
				<wait-auditing-list ref="waitAuditingList"
				 class="flex1"
				 @updateTabNum="getTableNum"></wait-auditing-list>
			</el-tab-pane>
			<el-tab-pane v-model="waitSendTabs"
			 :label='waitSendTabs.title'
			 name="waitSendList">
				<wait-send-list ref="waitSendList"
				 class="flex1"
				 @updateTabNum="getTableNum"></wait-send-list>
			</el-tab-pane>
			<el-tab-pane v-model="sendTabs"
			 :label='sendTabs.title'
			 name="sendList">
				<send-list ref="sendList"
				 class="flex1"
				 @updateTabNum="getTableNum"></send-list>
			</el-tab-pane>
			<el-tab-pane v-model="deliverTabs"
			 :label='deliverTabs.title'
			 name="deliverList">
				<deliver-list ref="deliverList"
				 class="flex1"
				 @updateTabNum="getTableNum"></deliver-list>
			</el-tab-pane>
			<el-tab-pane label="已驳回"
			 name="rebutList">
				<rebut-list ref="rebutList"
				 class="flex1"
				 @updateTabNum="getTableNum"></rebut-list>
			</el-tab-pane>
			<el-tab-pane label="已取消"
			 name="cancelList">
				<cancel-list ref="cancelList"
				 class="flex1"
				 @updateTabNum="getTableNum"></cancel-list>
			</el-tab-pane>
			<el-tab-pane label="已收货"
			 name="receiveList">
				<receive-list ref="receiveList"
				 class="flex1"
				 @updateTabNum="getTableNum"></receive-list>
			</el-tab-pane>
		</el-tabs>
		<!-- //监听子组件触发的updateTabNum事件,然后调用change方法 -->
		<div>
			<child @updateTabNum="getTableNum"></child>
		</div>
	</div>
</template>

<script type="text/javascript">
	import Cookie from 'js-cookie'
	import allList from './all-list'
	import waitAuditingList from './waitAuditing-list'
	import waitSendList from './waitSend-list'
	import sendList from './send-list'
	import deliverList from './deliver-list'
	import rebutList from './rebut-list'
	import cancelList from './cancel-list'
	import receiveList from './receive-list'
	import api from 'src/services/delivery/goodsDemand/surcharge.js'
	export default {
		components: {
			allList,
			waitAuditingList,
			waitSendList,
			sendList,
			deliverList,
			rebutList,
			cancelList,
			receiveList
		},
		data() {
			let tab = Cookie.get('demand_list_tab')
			if (tab) {
				this.$refs["listTab"]
				return {
					tab: tab,
					waitAuditingTabs:
					{
						title: '待审核',
						base: '待审核'
					},
					waitSendTabs:
					{
						title: '待发货',
						base: '待发货',
					},
					sendTabs:
					{
						title: '已发货',
						base: '已发货',
					},
					deliverTabs:
					{
						title: '已送达',
						base: '已送达',
					},
				}
			} else {
				return {
					tab: 'allList',
					waitAuditingTabs:
					{
						title: '待审核',
						base: '待审核'
					},
					waitSendTabs:
					{
						title: '待发货',
						base: '待发货',
					},
					sendTabs:
					{
						title: '已发货',
						base: '已发货',
					},
					deliverTabs:
					{
						title: '已送达',
						base: '已送达',
					},
				}
			}
		},
		beforeUpdate() {

		},
		mounted() {
			let tab = this.$refs['listTab']
			let panes = tab.panes
			let nameMapPanesKey = {}
			if (!panes) {
				return
			}
			for (let key in panes) {
				nameMapPanesKey[panes[key].name] = key
			}
			let paneKey = nameMapPanesKey[tab.value]
			let onePane = panes[paneKey]

			this.handleTabClick(onePane)
		},
		created() {
		},
		methods: {
			handleTabClick(tab) {
				Cookie.set('demand_list_tab', tab.name)
				this.getTableNum();
				tab.$children[0].initTableInfo()
				// console.log(tab);
				// tab.$children[0].$refs[list-view].reloadTable();
			},
			getTableNum() {
				let args = {};
				let that = this;
				api.statOrderStatusOM(args)
					.then((res) => {
						if (res.data.status == 200) {
							var result = res.data.result
							var waitAuditingNum = 0;
							var waitSendNum = 0;
							var sendNum = 0;
							var deliverNum = 0;
							if (result) {
								result.forEach((item) => {
									if (item.orderStatus == 4) {
										waitAuditingNum = item.total
									}
									else if (item.orderStatus == 0) {
										waitSendNum = item.total
									}
									else if (item.orderStatus == 1) {
										sendNum = item.total
									}
									else if (item.orderStatus == 8) {
										deliverNum = item.total
									}
								})
							}
							that.waitAuditingTabs.title = that.waitAuditingTabs.base + '(' + waitAuditingNum + ")";
							that.waitSendTabs.title = that.waitSendTabs.base + '(' + waitSendNum + ")";
							that.sendTabs.title = that.sendTabs.base + '(' + sendNum + ")";
							that.deliverTabs.title = that.deliverTabs.base + '(' + deliverNum + ")";
						}
					}).catch((error) => {
						console.log(error)
						this.$msgbox({
							title: '系统异常',
							type: 'error',
							message: '请刷新页面',
							showCancelButton: false,
							confirmButtonText: '知道了',
							confirmButtonClass: 'is-plain'
						})
					})
			}
		}
	}

</script>
<style type="text/css">
	.demand-list .el-tabs,
	.demand-list .el-tabs__content,
	.demand-list .el-tab-pane,
	.demand-list .flex1 {
		display: flex;
		flex: 1;
		flex-direction: column;
	}
</style>
<!-- <template>
	<el-tabs v-model="editableTabsValue"
	 type="card"
	 editable
	 @edit="handleTabsEdit">
		<el-tab-pane v-for="(item, index) in editableTabs"
		 :label="item.title"
		 :name="item.name">
			
		</el-tab-pane>
	</el-tabs>
</template>
<script>
	export default {
		data() {
			return {
				editableTabsValue: '2',
				editableTabs: [{
					title: 'Tab 1',
					name: '1',
				}, {
					title: 'Tab 2',
					name: '2',
				}],
				tabIndex: 2
			}
		},
		methods: {
			handleTabsEdit(targetName, action) {
				// if (action === 'add') {
				// 	let newTabName = ++this.tabIndex + '';
				// 	this.editableTabs.push({
				// 		title: 'New Tab',
				// 		name: newTabName,
				// 		content: 'New Tab content'
				// 	});
				// 	this.editableTabsValue = newTabName;
				// }
				// if (action === 'remove') {
				// 	let tabs = this.editableTabs;
				// 	let activeName = this.editableTabsValue;
				// 	if (activeName === targetName) {
				// 		tabs.forEach((tab, index) => {
				// 			if (tab.name === targetName) {
				// 				let nextTab = tabs[index + 1] || tabs[index - 1];
				// 				if (nextTab) {
				// 					activeName = nextTab.name;
				// 				}
				// 			}
				// 		});
				// 	}

				// 	this.editableTabsValue = activeName;
				// 	this.editableTabs = tabs.filter(tab => tab.name !== targetName);
				// }
			}
		}
	}
</script> -->