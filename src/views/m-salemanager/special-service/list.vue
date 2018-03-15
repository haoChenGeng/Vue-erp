<template>
	<div>
		<t8t-breadcrumb></t8t-breadcrumb>
		<t8t-toolbar ref="serverToolbar"
		    @CREATE="dialogDeal('create')"
		    @EDIT="dialogDeal('edit')"
		    @ADJUST="dialogDeal('adjust')"
		    @DELETE="deleteBtn">
		</t8t-toolbar>
		<t8t-grid :columns="columns"
		    :path="path"
		    :args="args"
		    :pageBar="false"
		    :selectCol="false"
		    :radioCol="true"
		    ref="serverTable"
		    @current-row-change="changeCurrentRow"
		    @data-loaded="dataLoaded">
			<template slot="verifyStatus"
			    scope="scope">
				<div>
					<div v-if="scope.row.verifyStatus == 1">
						<label style="color:green">审核通过
						</label>
					</div>
					<div v-else-if="scope.row.verifyStatus == 3">
						<label style="color:#ff9b00">待审核</label>
					</div>
					<div v-else-if="scope.row.verifyStatus == 2"
					    :title="'审核不通过原因:\n'+ scope.row.verifyFailReason">
						<label style="position: relative;color:red"
						    class="denied">审核不通过
						</label>
					</div>
					<div v-else>
						<label>缺省</label>
					</div>
				</div>
			</template>
		</t8t-grid>
		<el-dialog v-model="showDialog"
		    :title="dialogTitle"
		    :show-close="false">
			<i class="el-dialog__close el-icon el-icon-close"
			    @click="cancel"></i>
			<el-form :model="formData"
			    :label-position="right"
			    label-width="90px"
			    :rules="rules"
			    ref="serverForm">
				<el-form-item label="标题："
				    prop="title">
					<el-input v-model.trim="formData.title"
					    align="left"
					    placeholder="请输入1~6个字的内容">
					</el-input>
				</el-form-item>
				<el-form-item label="服务内容："
				    prop="description"
				    size="small">
					<el-input v-model.trim="formData.description"
					    type="textarea"
					    :size="small"
					    :rows="4"
					    placeholder="特色服务内容不可以包括手机号码、QQ等任意联系方式，请输入10~200个字的内容">
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
					<el-col :span="12">服务名称</el-col>
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
							<div class="">{{val.title}}</div>
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
import Service from 'src/services/salemanager/stores/Service.js';
import Api from 'src/services/salemanager/stores/storeApi.js';
import Cookie from 'js-cookie';

export default {
	name: 'special-service',
	components: {
		draggable
	},
	data() {
		return {
			path: Service.SPECIALSERVICE.QUERYPAGE,
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
			showDialog: false,
			showAdjustDialog: false,
			dialogType: '',
			dialogTitle: '',
			hasChanged: false,
			currentRow: null,
			formData: {
				description: '',
				title: ''
			},
			tempFormData: {
				description: '',
				title: ''
			},
			rules: {
				title: [
					{ required: true, message: '请输入服务标题', trigger: 'blur' },
					{ max: 6, message: '标题不超过6个字', trigger: 'blur' }
				],
				description: [
					{ required: true, message: '请输入服务内容', trigger: 'blur' },
					{ min: 10, message: '服务内容至少10个字', trigger: 'blur' },
					{ max: 200, message: '服务内容最多200个字', trigger: 'blur' }
				]
			},
			columns: [
				{
					prop: 'position',
					label: '网店展示位置'
				},
				{
					prop: 'title',
					label: '服务名称'
				},
				{
					prop: 'description',
					label: '服务说明'
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
					label: '最后更新时间',
					formatter: 'dateParser'
				},
				{
					prop: 'id',
					show: false
				},
				{
					prop: 'updateUser',
					show: false
				},
				{
					prop: 'sysDefault',
					show: false
				}
			]
		};
	},
	activityContent() {
		this.$refs.serverTable.reloadTable();
	},
	methods: {
		checkForm() {
			if (!this.formData.description || !this.formData.title) {
				return false;
			}
			return true;
		},
		submit() {
			if (!this.checkForm()) {
				return;
			}
			this.$refs.serverForm.validate(_isvalid => {
				if (_isvalid) {
					let args = {
						decSpecialService: {
							description: this.formData.description,
							title: this.formData.title
						}
					};

					this.formLoading = true;
					Api.SPECIALSERVICE
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
											title: '',
											description: ''
										};
										this.showDialog = false;
										done();
									},
									callback: () => {
										this.formData = {
											title: '',
											description: ''
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
		edit() {
			if (!this.checkForm()) {
				return;
			}
			let curRow = this.getSelects();
			this.$refs.serverForm.validate(_isvalid => {
				if (_isvalid) {
					let args = {
						decSpecialService: {
							id: curRow.id,
							updateUser: curRow.updateUser,
							description: this.formData.description,
							title: this.formData.title
						}
					};

					this.formLoading = true;
					Api.SPECIALSERVICE
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
											title: '',
											description: ''
										};
										this.showDialog = false;
										done();
									},
									callback: () => {
										this.formData = {
											title: '',
											description: ''
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
					(this.formData.title || this.formData.description)) ||
				(this.dialogType === 'edit' &&
					(this.tempFormData.title !== this.formData.title ||
						this.tempFormData.description !==
							this.formData.description))
			) {
				this.$confirm('确定不保存直接退出吗？', '提示', {
					type: 'warning',
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				})
					.then(() => {
						this.formData = {
							title: '',
							description: ''
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
				if (i <= 5) {
					tmp = '(首页展示)';
				} else {
					tmp = '(首页不展示)';
				}
				this.passedData[i].position = `第${i + 1}位${tmp}`;
				this.$set(this.passedData, i, this.passedData[i]);
			}
		},
		dialogDeal(type) {
			let formData = {
				decSpecialService: '',
				title: ''
			};
			switch (type) {
				case 'create':
					let totalRows = this.getTotalRows();
					if (totalRows >= 10) {
						this.$message.error('最多只可以有10个特色服务哦~');
						return;
					}
					this.dialogTitle = '创建特色服务';
					this.showDialog = true;
					break;
				case 'edit':
					this.dialogTitle = '编辑特色服务';
					let curRow = this.getSelects();
					if (!curRow) {
						this.$message.error('请选择要操作的记录');
						return;
					}

					if (curRow.sysDefault == 1) {
						this.$message.error('系统默认生成的特色服务不可以编辑哦~');
						return;
					}
					if (curRow.verifyStatus == 3) {
						this.$message.error('审核中的内容不可编辑哦~');
						return;
					}

					formData = {
						id: curRow.id,
						description: curRow.description,
						title: curRow.title
					};
					this.tempFormData = {
						description: curRow.description,
						title: curRow.title
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
			if (!row) {
				this.$message.error('请选择要操作的记录');
				return;
			}
			if (row.sysDefault == 1) {
				this.$message.error('系统默认生成的特色服务不可以删除哦~');
				return;
			}

			this.$confirm('删除后不可恢复，确定删除该特色服务吗？', '提示', {
				type: 'warning',
				confirmButtonText: '确定',
				cancelButtonText: '取消'
			})
				.then(_ => {
					Api.SPECIALSERVICE
						.deleteById({ id: row.id })
						.then(res => {
							if (res.data.status === 200) {
								this.$message.success('删除成功');
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
							this.$message.error('删除失败');
						});
				})
				.catch(() => {});
		},
		dataLoaded(data) {
			this.passedData = [];
			this.dataCopy = [];
			if (data && data.length) {
				for (let i = 0, len = data.length; i < len; i++) {
					if (data[i].sysDefault == 1) {
						data[i].updateName = data[i].createName;
					}
					if (data[i].verifyStatus == 1) {
						if (i >= 0 && i <= 5) {
							data[i].position = `第${i + 1}位(首页展示)`;
							if (data[i].verifyStatus == 1) {
								this.passedData.push({
									id: data[i].id,
									position: data[i].position,
									title: data[i].title
								});
								this.dataCopy.push({
									id: data[i].id,
									position: data[i].position,
									title: data[i].title
								});
							}
						} else {
							data[i].position = `第${i + 1}位(首页不展示)`;
							this.passedData.push({
								id: data[i].id,
								position: data[i].position,
								title: data[i].title
							});
							this.dataCopy.push({
								id: data[i].id,
								position: data[i].position,
								title: data[i].title
							});
						}
					} else {
						data[i].position = `第${i + 1}位(未审核通过的不展示)`;
					}
				}
			}
		},
		changeCurrentRow(curRow, oldRow) {
			this.currentRow = curRow;
		},
		getSelects() {
			return this.currentRow;
		},
		reloadTable() {
			this.$refs.serverTable.reloadTable();
		},
		getTotalRows() {
			return this.$refs.serverTable.totalRows;
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
						let tmp;
						for (
							let i = 0, len = this.passedData.length;
							i < len;
							i++
						) {
							if (i <= 5) {
								tmp = '(首页展示)';
							} else {
								tmp = '(首页不展示)';
							}
							this.dataCopy[i].position = `第${i + 1}位${tmp}`;
							this.$set(this.passedData, i, this.dataCopy[i]);
						}
					})
					.catch(() => {});
			} else {
				this.showAdjustDialog = false;
			}
		},
		resetForm() {
			this.$refs.serverForm.resetFields();
		}
	}
};
</script>

<style>
.adjust-dialog .el-dialog__body {
	padding: 30px;
}
.adjust-dialog .el-dialog__footer {
	padding-top: 0;
}
.el-dialog {
	box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.2);
}
</style>

<style scoped>
.el-dialog__close {
	position: absolute;
	right: 10px;
	top: 15px;
}
.el-row {
	text-align: center;
	height: 32px;
	line-height: 32px;
	border: 1px solid #e1e6ea;
}
.adjust-item.el-row {
	border-top-color: transparent;
	height: 34px;
	line-height: 34px;
}
.el-row.dragging {
	border-color: #6bc1ff;
	border-width: 2px;
}
.adjust-item.el-row:hover {
	cursor: grab;
}
.adjust-item.el-row:nth-of-type(2n + 1) {
	background-color: #fafafa;
}
.el-col {
	height: 32px;
}
.el-col:first-child {
	border-right: 1px solid #e1e6ea;
}
.adjust-title {
	background-color: #eff9ff;
	color: #333;
	font-size: 12px;
	font-weight: bold;
}
.denied::after {
	content: '';
	display: inline-block;
	width: 14px;
	height: 14px;
	background: url('./images/warning_icon.png') no-repeat;
	background-size: contain;
	position: absolute;
	top: 50%;
	left: 100%;
	margin-left: 2px;
	margin-top: -6px;
}
.tip {
	display: none;
	position: absolute;
	width: 200px;
	left: 80%;
	text-align: left;
	border: 1px solid #eee;
	background-color: #fffce9;
	padding: 4px 8px;
	z-index: 2;
	color: #000;
}
.tip p {
	margin: 0;
}
.denied:hover .tip {
	display: block;
}
.adjust-tip {
	color: #989898;
}
</style>

