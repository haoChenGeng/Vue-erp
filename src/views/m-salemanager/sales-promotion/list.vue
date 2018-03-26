<!--
 * File: list.vue
 * Comment:优惠促销
 * User: yolanda.yu
 * Date: 2018/3/14
 * Time: 14:45
 -->
<template>
	<div>
		<t8t-breadcrumb></t8t-breadcrumb>
		<t8t-toolbar ref="promotionToolbar"
		    @CREATE="dialogDeal('create')"
		    @EDIT="dialogDeal('edit')"
		    @ADJUST="dialogDeal('adjust')"
		    @DELETE="deleteBtn">
		</t8t-toolbar>
		<t8t-grid :columns="columns"
		    :path="path"
		    :args="args"
		    :selectCol="false"
		    :radioCol="true"
		    ref="promotionTable"
		    @current-row-change="changeCurrentRow"
		    @data-loaded="dataLoaded">
			<template slot="verifyStatus"
			    scope="scope">
				<div>
					<div v-if="scope.row.verifyStatus == 1">
						<label style="color:green">审核通过
						</label>
					</div>
					<div v-else-if="scope.row.verifyStatus == 0">
						<label style="color:#ff9b00">待审核</label>
					</div>
					<div v-else-if="scope.row.verifyStatus == 2"
					    :title="'审核不通过原因:\n'+ scope.row.verifyFailReason">
						<label style="position: relative;color:red"
						    class="denied">审核不通过
						</label>
					</div>
				</div>
			</template>
		</t8t-grid>
		<el-dialog :title="dialogTitle"
		    v-model="showDialog"
		    :show-close="false">
			<i class="el-dialog__close el-icon el-icon-close"
			    @click="cancel"></i>
			<el-form :model="formData"
			    :label-position="right"
			    label-width="90px"
			    :rules="rules"
			    ref="promotionForm">
				<el-form-item label="类型："
				    prop="activityType">
					<el-select v-model="formData.activityType"
					    placeholder="请选择优惠促销类型">
						<el-option v-for="item in typeOption"
						    :label="item.label"
						    :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="有效日期："
				    prop="date">
					<el-date-picker v-model="formData.date"
					    type="daterange"
					    align="left"
					    placeholder="有选择有效日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="优惠内容："
				    prop="activityContent"
				    size="small">
					<el-input v-model.trim="formData.activityContent"
					    type="textarea"
					    :size="small"
					    :rows="4"
					    placeholder="优惠内容不可以包括手机号码、QQ等任意联系方式，请输入6~36个字的内容">
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<div class="grid-content"
				    v-if="dialogType == 'create'">
					<el-button size="small"
					    type="primary"
					    @click="submit"
					    :disabled="formLoading"
					    v-loading.body="formLoading">创建并提交审核
					</el-button>
					<el-button size="small"
					    @click="cancel">取消</el-button>
				</div>
				<div class="grid-content"
				    v-else>
					<el-button size="small"
					    type="primary"
					    @click="edit"
					    :disabled="formLoading"
					    v-loading.body="formLoading">保存并提交审核
					</el-button>
					<el-button size="small"
					    @click="cancel">取消</el-button>
				</div>
			</div>
		</el-dialog>
		<el-dialog v-model="showAdjustDialog"
		    class="adjust-dialog"
		    :show-close="false"
		    title="调整网店展示位置">
			<i class="el-dialog__close el-icon el-icon-close"
			    @click="cancelAdjust"></i>
			<div>
				<el-row class="adjust-title">
					<el-col :span="12">网店展示位置</el-col>
					<el-col :span="12">优惠促销内容</el-col>
				</el-row>
				<draggable :list="passedData"
				    @sort="update"
				    @start="dragStart"
				    @end="dragEnd">
					<el-row v-for="val in passedData"
					    :key="val.id"
					    class="adjust-item">
						<el-col :span="12">
							<div class="">{{val.position}}</div>
						</el-col>
						<el-col :span="12">
							{{val.content}}
						</el-col>
					</el-row>
				</draggable>
			</div>
			<p class="adjust-tip">提示：直接拖动即可调整排序，调整完毕后保存即可生效。</p>
			<div slot="footer">
				<div class="grid-content">
					<el-button size="small"
					    type="primary"
					    @click="saveAdjust"
					    :disabled="formLoading"
					    v-loading.body="formLoading">保存
					</el-button>
					<el-button size="small"
					    @click="cancelAdjust">取消</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import draggable from 'vuedraggable';
import Cookie from 'js-cookie';
import Service from 'src/services/salemanager/stores/Service.js';
import Api from 'src/services/salemanager/stores/storeApi.js';
import dateUtils from 'src/utils/DateUtils.js';

export default {
	name: 'promotion-config',
	data() {
		return {
			path: Service.PROMOTION.PROMOTIONQUERYPAGE,
			args: {
				search: {
					companyId: +Cookie.get('t8t-tc-comid')
				},
				page: 1,
				size: 10
			},
			passedData: [],
			dataCopy: [],
			formLoading: false,
			typeOption: [
				{ label: '优惠券', value: 1 },
				{ label: '促销活动', value: 2 }
			],
			showDialog: false,
			showAdjustDialog: false,
			dialogType: '',
			dialogTitle: '',
			hasChanged: false,
			currentRow: null,
			formData: {
				activityType: '',
				activityContent: '',
				date: []
			},
			tempFormData: {
				type: '',
				content: '',
				date: []
			},
			rules: {
				activityType: [
					{ required: true, message: '请选择优惠促销类型', trigger: 'change' }
				],
				activityContent: [
					{
						required: true,
						message: '请输入6~36个字的内容',
						trigger: 'blur'
					},
					{
						min: 6,
						max: 36,
						message: '请输入6~36个字的内容',
						trigger: 'blur'
					}
					// { pattern: /^[^\n\r]+$/, message: '促销内容不能包含换行符' }
				],
				date: [
					{
						type: 'array',
						required: true,
						message: '请选择有效日期',
						trigger: 'change'
					}
				]
			},
			columns: [
				{
					prop: 'position',
					label: '网店展示位置'
				},
				{
					prop: 'activityType',
					label: '类型'
				},
				{
					prop: 'activityContent',
					label: '优惠促销内容'
				},
				{
					label: '有效时间',
					formatter(val, row) {
						return `${dateUtils(
							row.startTime * 1000,
							'yyyy-mm-dd'
						)}~${dateUtils(row.endTime * 1000, 'yyyy-mm-dd')}`;
					}
				},
				{
					prop: 'verifyStatus',
					label: '审核状态'
				},
				{
					prop: 'updateName',
					label: '最后编辑人员'
				},
				{
					prop: 'updateTime',
					label: '最后编辑时间',
					formatter: 'dateParser'
				},
				{
					prop: 'createUser',
					show: false
				},
				{
					prop: 'id',
					show: false
				},
				{
					prop: 'updateUser',
					show: false
				}
			]
		};
	},
	created() {},
	activated() {
		this.$refs.promotionTable.reloadTable();
	},
	methods: {
		checkForm() {
			if (
				!this.formData.activityType ||
				!this.formData.activityContent ||
				!this.formData.date
			) {
				return false;
			}
			return true;
		},
		submit() {
			this.$refs.promotionForm.validate(_isvalid => {
				if (_isvalid) {
					let args = {
						activity: {
							activityType: this.formData.activityType,
							activityContent: this.formData.activityContent,
							startTime: Date.parse(this.formData.date[0]) / 1000,
							endTime:
								Date.parse(this.formData.date[1]) / 1000 +
								24 * 3600 -
								1
						}
					};
					this.formLoading = true;
					Api.PROMOTION
						['create'](args)
						.then(res => {
							this.formLoading = false;
							if (res.data.status === 200) {
								this.$msgbox({
									title: '创建成功',
									type: 'success',
									message: '审核通过后就可以展示在网店里了哦~',
									showCancelButton: false,
									confirmButtonText: '我知道了',
									confirmButtonClass: 'is-plain'
								}).then(() => {
									this.reloadTable();
									this.showDialog = false;
								});
							} else {
								this.$msgbox({
									title: '创建失败',
									type: 'error',
									showCancelButton: false,
									beforeClose: (action, instance, done) => {
										this.formData = {
											activityType: '',
											activityContent: '',
											date: []
										};
										this.showDialog = false;
										done();
									},
									callback: () => {
										this.formData = {
											activityType: '',
											activityContent: '',
											date: []
										};
										this.showDialog = false;
									},
									message:
										res.data.result ||
										res.data.error ||
										res.data.message
								});
							}
						})
						.catch(_ => {
							this.formLoading = false;
							this.$message.error('操作失败');
							return;
						});
				} else {
					console.log(this.formData);
				}
			});
		},
		edit() {
			if (!this.checkForm()) {
				return;
			}
			let curRow = this.getSelects()[0];
			this.$refs.serverForm.validate(_isvalid => {
				if (_isvalid) {
					let args = {
						activity: {
							id: curRow.id,
							activityType: this.formData.activityType,
							activityContent: this.formData.activityContent,
							startTime: Date.parse(this.formData.date[0]) / 1000,
							endTime:
								Date.parse(this.formData.date[1]) / 1000 +
								24 * 3600 -
								1
						}
					};

					this.formLoading = true;
					Api.PROMOTION
						['update'](args)
						.then(res => {
							this.formLoading = false;
							if (res.data.status === 200) {
								this.$msgbox({
									title: '编辑成功',
									type: 'success',
									message: '审核通过后新内容就可以展示在网店里了哦~',
									showCancelButton: false,
									confirmButtonText: '我知道了',
									confirmButtonClass: 'is-plain'
								}).then(() => {
									this.reloadTable();
									this.showDialog = false;
								});
							} else {
								this.$msgbox({
									title: '编辑失败',
									type: 'error',
									showCancelButton: false,
									beforeClose: (action, instance, done) => {
										this.formData = {
											activityType: '',
											activityContent: '',
											date: []
										};
										this.showDialog = false;
										done();
									},
									callback: () => {
										this.formData = {
											activityType: '',
											activityContent: '',
											date: []
										};
										this.showDialog = false;
									},
									message:
										res.data.result ||
										res.data.error ||
										res.data.message
								});
							}
						})
						.catch(_ => {
							this.formLoading = false;
							this.$message.error('操作失败');
							return;
						});
				}
			});
		},
		cancel() {
			if (
				(this.dialogType === 'create' &&
					(this.formData.date.length ||
						this.formData.activityContent ||
						this.formData.activityType)) ||
				(this.dialogType === 'edit' &&
					(this.tempFormData.type !== this.formData.activityType ||
						this.tempFormData.content !==
							this.formData.activityContent ||
						this.tempFormData.date[0] !== this.formData.date[0] ||
						this.tempFormData.date[1] !== this.formData.date[1]))
			) {
				this.$confirm('确定不保存直接退出吗？', '提示', {
					type: 'warning',
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				})
					.then(() => {
						this.formData = {
							activityType: '',
							activityContent: '',
							date: []
						};
						this.showDialog = false;
						this.resetForm();
					})
					.catch(() => {});
			} else {
				this.showDialog = false;
				this.resetForm();
			}
		},
		update() {
			this.hasChanged = true;
			let tmp;
			for (let i = 0, len = this.passedData.length; i < len; i++) {
				tmp = this.passedData[i].position.match(/(第\d+位)(.*)/);
				this.passedData[i].position = `第${i + 1}位${tmp[2]}`;
				this.$set(this.passedData, i, this.passedData[i]);
			}
		},
		dialogDeal(type) {
			let formData = {
				activityType: null,
				activityContent: '',
				date: []
			};
			switch (type) {
				case 'create':
					let totalRows = this.getTotalRows();
					if (totalRows >= 10) {
						this.$message.error('最多只可以有10个优惠促销哦~');
						return;
					}
					this.dialogTitle = '创建优惠促销';
					this.showDialog = true;
					break;
				case 'edit':
					this.dialogTitle = '编辑优惠促销';
					let curRow = this.getSelects();
					if (!curRow || curRow.length === 0) {
						this.$message.error('请选择要操作的记录');
						return;
					}

					if (curRow.length > 1) {
						this.$message.error('请选择单条记录');
						return;
					}
					if (curRow[0].verifyStatus === 0) {
						this.$message.error('审核中的内容不可以编辑哦~');
						return;
					}
					let _time = [
						new Date(curRow[0].startTime * 1000),
						new Date(curRow[0].endTime * 1000)
					];
					formData = {
						id: curRow[0].id,
						activityType: curRow[0].activityType,
						activityContent: curRow[0].activityContent,
						date: _time
					};
					this.showDialog = true;
					break;
				case 'adjust':
					this.hasChanged = false;
					this.showAdjustDialog = true;
					break;
			}
			this.formData = { ...formData };
			this.dialogType = type;
		},
		deleteBtn() {
			let row = this.getSelects();
			if (!row || row.length === 0) {
				this.$message.error('请选择要操作的记录');
				return;
			}

			this.$confirm('删除后不可恢复，确定删除该优惠促销吗？', '提示', {
				type: 'warning',
				confirmButtonText: '确定',
				cancelButtonText: '取消'
			})
				.then(_ => {
					Api.PROMOTION
						.delete({ id: row[0].id })
						.then(res => {
							if (res.data.status === 200) {
								this.$message.success('操作成功');
								this.reloadTable();
							} else {
								this.$message.error(
									res.data.result ||
										res.data.error ||
										res.data.message ||
										'操作失败'
								);
								return;
							}
						})
						.catch(_ => {
							this.$message.error('操作失败');
						});
				})
				.catch(() => {});
		},
		dataLoaded(data) {
			this.passedData = [];
			this.dataCopy = [];
			if (data && data.length) {
				for (let i = 0, len = data.length; i < len; i++) {
					if (data[i].verifyStatus == 1) {
						if (i == 0 || i == 1) {
							data[i].position = `第${i + 1}位(首页展示)`;
							if (data[i].verifyStatus == 1) {
								this.passedData.push({
									id: data[i].id,
									position: data[i].position,
									content: data[i].activityContent
								});
								this.dataCopy.push({
									id: data[i].id,
									position: data[i].position,
									content: data[i].activityContent
								});
							}
						} else if (data[i].isInvalid) {
							data[i].position = `第${i + 1}位(不在有效期内不展示)`;
							this.passedData.push({
								id: data[i].id,
								position: data[i].position,
								content: data[i].activityContent
							});
							this.dataCopy.push({
								id: data[i].id,
								position: data[i].position,
								content: data[i].activityContent
							});
						} else {
							data[i].position = `第${i + 1}位(网店不展示)`;
							this.passedData.push({
								id: data[i].id,
								position: data[i].position,
								content: data[i].activityContent
							});
							this.dataCopy.push({
								id: data[i].id,
								position: data[i].position,
								content: data[i].activityContent
							});
						}
					} else {
						data[i].position = `第${i + 1}位(未审核通过的不展示)`;
					}
				}
			}
		},
		getSelects(getRow = false) {
			let selections = this.$refs.promotionTable.getSelectRows();
			return getRow ? selections[0] : selections;
		},
		reloadTable() {
			this.$refs.promotionTable.reloadTable();
		},
		getTotalRows() {
			return this.$refs.promotionTable.totalRows;
		},
		dragStart(evt) {
			let item = evt.item;
			item.classList.add('dragging');
		},
		dragEnd(evt) {
			let item = evt.item;
			item.classList.remove('dragging');
		},
		saveAdjust() {
			let list = this.passedData.map((val, index) => {
				return { id: val.id, sort: index };
			});

			Api.SPECIALSERVICE
				.saveSort({ sortList: list })
				.then(res => {
					this.showAdjustDialog = false;
					if (res.data.status === 200) {
						this.$msgbox({
							title: '保存成功',
							type: 'success',
							message: '用户稍后就可以在网店看到刚刚调整的顺序了哦~',
							showCancelButton: false,
							confirmButtonText: '我知道了',
							confirmButtonClass: 'is-plain'
						}).then(() => {
							this.reloadTable();
						});
					} else {
						this.$msgbox({
							title: '保存失败',
							type: 'error',
							showCancelButton: false,
							message:
								res.data.result ||
								res.data.error ||
								res.data.message
						});
						return;
					}
				})
				.catch(_ => {
					this.$message.error('操作失败');
				});
		},
		cancelAdjust() {
			if (this.hasChanged) {
				this.$confirm('确定不保存直接退出吗？', '提示', {
					type: 'warning',
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				})
					.then(_ => {
						this.showAdjustDialog = false;
						this.passedData = this.dataCopy;
					})
					.catch(() => {});
			} else {
				this.showAdjustDialog = false;
			}
		},
		resetForm() {
			this.$refs.promotionForm.resetFields();
		}
	}
};
</script>

<style>
/* .sales-promotion-dialog .el-dialog .el-dialog__body {
	padding: 15px 40px 15px 15px !important;
} */

/* .sales-promotion-dialog .el-dialog .el-date-editor--daterange {
	width: 100% !important;
} */
</style>

<style scoped>
.el-dialog__close {
	position: absolute;
	right: 10px;
	top: 15px;
}
.el-date-editor--daterange,
.el-select {
	width: 100%;
}
.el-picker-panel {
	box-shadow: 5px 6px 20px 0px #6b6b6b;
}
</style>