<template>
	<div>
		<t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
		<div class="picture-list">
			<div class="list-item" v-for="(item,index) in fileList">
				<div class="item-img">
					<img v-if="item.photoeType == 1" :src="item.src" width="100%" height="100%" @click="showPicture1($event.target.src)">
					<img v-else :src="item.src" width="100%" height="100%">
					<label class="item-status-label" title="删除文件" @click="removeFile(item.id,index)">
						<i class="el-icon-close"></i>
					</label>
				</div>
				<div class="item-text">
					<p>
						{{ item.photoName }}
					</p>
					<a @click="showPicture($event)" v-if="item.photoeType == 1" href="javascript:;">
						点击查看大图
					</a>
					<a v-if="item.photoeType == 0" :href="item.url">
						下载
					</a>
				</div>
			</div>
			<div class="uoload-box" @click="showUploadDialog">
				<i class="el-icon-plus uploader-icon"></i>
			</div>
		</div>
		<div>
			<p>注意事项：</p>
			<p>1、源文件为dwg格式，大小限制16M</p>
			<p>2、图片类型文件只允许上传PDF格式</p>
		</div>
		<div class="picture-list">
			<div class="list-item">
				<div class="item-img">
					<img src="./1.jpg" width="100%" height="100%" @click="showPicture1($event.target.src)">
				</div>
				<div class="item-text">
					<p>
						地面铺装图（样例）
					</p>
					<a @click="showPicture($event)" href="javascript:;">
						点击查看大图
					</a>
				</div>
			</div>
			<div class="list-item">
				<div class="item-img">
					<img src="./4.jpg" width="100%" height="100%" @click="showPicture1($event.target.src)">
				</div>
				<div class="item-text">
					<p>
						天花布置图（样例）
					</p>
					<a @click="showPicture($event)" href="javascript:;">
						点击查看大图
					</a>
				</div>
			</div>
			<div class="list-item">
				<div class="item-img">
					<img src="./3.jpg" width="100%" height="100%" @click="showPicture1($event.target.src)">
				</div>
				<div class="item-text">
					<p>
						天花尺寸放样图（样例）
					</p>
					<a @click="showPicture($event)" href="javascript:;">
						点击查看大图
					</a>
				</div>
			</div>
			<div class="list-item">
				<div class="item-img">
					<img src="./5.jpg" width="100%" height="100%" @click="showPicture1($event.target.src)">
				</div>
				<div class="item-text">
					<p>
						开关控制点位图（样例）
					</p>
					<a @click="showPicture($event)" href="javascript:;">
						点击查看大图
					</a>
				</div>
			</div>
			<div class="list-item">
				<div class="item-img">
					<img src="./6.jpg" width="100%" height="100%" @click="showPicture1($event.target.src)">
				</div>
				<div class="item-text">
					<p>
						插座点位控制图（样例）
					</p>
					<a @click="showPicture($event)" href="javascript:;">
						点击查看大图
					</a>
				</div>
			</div>
			<div class="list-item">
				<div class="item-img">
					<img src="./2.jpg" width="100%" height="100%" @click="showPicture1($event.target.src)">
				</div>
				<div class="item-text">
					<p>
						给水平面示意图（样例）
					</p>
					<a @click="showPicture($event)" href="javascript:;">
						点击查看大图
					</a>
				</div>
			</div>
            <div class="list-item">
                <div class="item-img">
                    <img src="./7.jpg" width="100%" height="100%" @click="showPicture1($event.target.src)">
                </div>
                <div class="item-text">
                    <p>
                        原始结构图（样例）
                    </p>
                    <a @click="showPicture($event)" href="javascript:;">
                        点击查看大图
                    </a>
                </div>
            </div>
            <div class="list-item">
                <div class="item-img">
                    <img src="./8.jpg" width="100%" height="100%" @click="showPicture1($event.target.src)">
                </div>
                <div class="item-text">
                    <p>
                        平面布置图（样例）
                    </p>
                    <a @click="showPicture($event)" href="javascript:;">
                        点击查看大图
                    </a>
                </div>
            </div>
            <div class="list-item">
                <div class="item-img">
                    <img src="./9.jpg" width="100%" height="100%" @click="showPicture1($event.target.src)">
                </div>
                <div class="item-text">
                    <p>
                        拆图墙体尺寸图（样例）
                    </p>
                    <a @click="showPicture($event)" href="javascript:;">
                        点击查看大图
                    </a>
                </div>
            </div>
            <div class="list-item">
                <div class="item-img">
                    <img src="./10.jpg" width="100%" height="100%" @click="showPicture1($event.target.src)">
                </div>
                <div class="item-text">
                    <p>
                        新建墙体尺寸图（样例）
                    </p>
                    <a @click="showPicture($event)" href="javascript:;">
                        点击查看大图
                    </a>
                </div>
            </div>
		</div>

		<el-dialog title="上传文件" v-model="uploadDialogVisible" :modal="false" class="projectlist-upload-dialog" @close="btnCancleClick">
            <el-form :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="form" @keyup.enter.native="btnOKClick()">
                <el-form-item label="文件类型：" prop="photoeType">
                    <el-radio-group @change="switchPhotoType" v-model="formData.photoeType">
                    	<el-radio :label="1">图片</el-radio>
                    	<el-radio :label="0">源文件</el-radio>
                    </el-radio-group>
                </el-form-item>
               	<el-form-item label="类别：" prop="type" v-show="formData.photoeType === 1">
                    <el-select
                        v-model="formData.type"
                        filterable
                        placeholder="请选择类型">
                        <el-option
                            v-for="item in typeList"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文件：" prop="name">
                	<div :style="{textAlign:'center'}">
                		<el-upload
		                	class="file-uploader"
		                	v-loading="imgLoading"
		                	:action="uploadURL"
	                        :data="uploadParams"
	                        :accept="acceptType"
		                	:show-file-list="false"
		                	:before-upload="beforeUpload"
		                	:on-success="handleUploadSuccess"
		                	:on-error="handleUploadError"
		                	:on-progress="handleUploadProgress"
                		>
                		<img v-if="imageUrl" :src="imageUrl" class="show-image">
                		<i v-else class="el-icon-plus file-uploader-icon"></i>
                		</el-upload>
                	</div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading">保存</el-button>
                <el-button @click="btnCancleClick()">取消</el-button>
            </div>
        </el-dialog>

		<el-dialog v-model="dialogVisible" :modal="false" class="projectlist-showimg-dialog" size="full">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

        <el-dialog v-model="pdfDialogVisible" class="g-pdf-dialog">
            <div id="pdf"></div>
        </el-dialog>
	</div>
</template>

<script type="text/javascript">
	import dwg from './dwg.jpg'
	import Utils from 'src/utils/Utils.js'
	import Server from 'src/config/server.js'
	import axios from 'src/utils/axios.js'
	import Cookie from 'js-cookie'
	import commonApi from 'src/services/commonApi/commonApi.js'
    import PDFObject from 'src/utils/pdfobject.js'
	export default {
		data(){
			return {
		 		breadcrumbData: [{ title: '施工图' }, { title: '施工图' }],
		 		uploadDialogVisible: false,
		 		dialogVisible: false,
                pdfDialogVisible: false,
		 		dialogImageUrl: '',
		 		labelPosition: 'right',
                formLabelWidth: '120px',
                formData: {
                	name: '',
                	type: null,
                	photoeType: 1,
                	photoPath: '',
                },
                rules:{},
                typeList:[ // todo 辅助资料获取
                	{
                		text: '地面铺装图',
                		value: 1
                	},
                	{
                		text: '天花布置图',
                		value: 2
                	}
                ],
                imageUrl: '',
                uploadURL: Utils.getUploadURL(),
                uploadParams: {
                    bucket: 'scm',
                    module: 'delivery'
                },
                acceptType: ".pdf",//默认上传图片
                fileList:[],
                isLoading: false,
                uploadFlag: false,
                imgLoading: false
			}
		},
		props:{
			photoesId: {
				type: Number
			},
			photoesStatus: {
				type: Number
			}
		},
		created(){
			this.getFileList();
			this.getTypeList({ pPropertyCode: 30102});
		},
		methods:{
		    getTypeList(args){
		        let arg =  {
		            page: 1,
		            search: args, // { pPropertyCode: code}
		            size: 100
		        }
		        let list = [];
		        commonApi.queryUnionParent(arg).then((res) => {
		            if (res.data.status === 200) {
		                res.data.result.forEach((item) => {
		                    if (item.propertyStatus===1) {
		                        list.push({
		                            value: item.id,
		                            text: item.propertyName
		                        })
		                    }
		                });
		            }
		        });
		        this.typeList = list;
		    },
			getFileList(){
				axios({
					service: 'hMNCl9S9hJbGkcd4dsaHxWWo3cOZFd3', // /biz/dsp-prs-pqm/app
					method: 'w649sMeGrciF1ZT5t44pHtpM9xpct0yo7axrV5fKkDasvcerYPW', // views.photoesItem.queryByPhotoesId
					args:{ photoesId: this.photoesId, sort:[ 'photoeType_desc' ]} // todo 替换动态数据
				}).then((res)=>{
					if(res.data.status === 200){
						let uid = Cookie.get('t8t-tc-uid');
                		let ticket = Cookie.get('t8t-tc-ticket');
						this.fileList = res.data.result;
						this.fileList.forEach((item)=>{
							item.url = Server.gatewayAddr + '/?path='+ item.photoPath +'&action=file&uid='+ uid + '&ticket=' + ticket;
							if(item.photoeType == 1){
								item.src = item.url;
							}else{
								item.src = dwg;
							}
						})
					}
				}).catch((error)=>{

				})
			},
			removeFile(id,index){
				if(this.photoesStatus == 2){
					this.$message.error('当前图册状态为已完成，不能进行此操作！');
					return false;
				}
				this.$confirm('是否确认删除？','提示',{
					type:'warning'
				}).then(()=>{
					axios({
						service: 'hMNCl9S9hJbGkcd4dsaHxWWo3cOZFd3', // /biz/dsp-prs-pqm/app
						method: 'ipaXTOANij4V0jH9lPU1su5cLmkiHJzLLWrRnl8aHFD', // views.photoesItem.deleteById
						args: {id: id,updateName: Cookie.get('t8t-tc-username'), updateBy: Cookie.get('t8t-tc-username'),updateUser: Cookie.get('t8t-tc-uid')}
					}).then((res)=>{
						if(res.data.status === 200){
							this.fileList.splice(index,1);
						}else{
							this.$message.error('删除失败！');
						}
					}).catch((error)=>{
						this.$message.error('请求出错！');
					})
				}).catch(()=>{

				})
			},
			showUploadDialog(){
				if(this.photoesStatus == 2){
					this.$message.error('当前图册状态为已完成，不能进行此操作！');
					return false;
				}
				this.formData.photoPath = '';
				this.imageUrl = '';
				this.uploadDialogVisible = true;
			},
			showPicture(e){
				let url = e.target.parentNode.parentNode.firstChild.firstChild.src;
				this.dialogVisible = true;
				this.dialogImageUrl = url;
			},
			showPicture1(url){
				this.dialogVisible = true;
				this.dialogImageUrl = url;
			},
            showPdf(url){
                this.pdfDialogVisible=true
                this.$nextTick(()=>{
                    PDFObject.embed(url, "#pdf");
                })
            },
			btnOKClick(){
				if(this.photoesStatus == 2){
					this.$message.error('当前图册状态为已完成，不能进行此操作！');
					return false;
				}
				if(this.uploadFlag){
					this.$message.error('请先等待文件上传完成！');
					return false;
				}
				//数据校验
				if(([0,1].indexOf(this.formData.photoeType)) == -1){
					this.$message.error('文件类型选择错误！');
					return false;
				}
				if(!this.formData.photoPath){
					this.$message.error('请先上传文件！');
					return false;
				}
				//获得名称
				let photoName = '';
				if(this.formData.photoeType === 1){
					this.typeList.forEach((item)=>{
						if(item.value == this.formData.type){
							photoName = item.text;
						}
					})
					if(!photoName){
						this.$message.error('请选择图片类别！');
						return false;
					}
				}else if(this.formData.photoeType === 0){
					photoName = '方案源文件';
				}
				let params = {
					"photoesId":this.photoesId,
					"photoName": photoName,
					"photoPath":this.formData.photoPath,
					"photoeType":this.formData.photoeType,
					"createName":Cookie.get('t8t-tc-username'),
					"createBy":Cookie.get('t8t-tc-username'),
					"createUser": +Cookie.get('t8t-tc-uid')
				};
				this.isLoading = true;
				axios({
					service: 'hMNCl9S9hJbGkcd4dsaHxWWo3cOZFd3', // /biz/dsp-prs-pqm/app
					method: 'pxte8i6D1UPtmS71aorbAketzbuQTdEhjIa', // views.photoesItem.create
					args: {photoesItem: params}
				}).then((res)=>{
					this.isLoading = false;
					if(res.data.status === 200){
						this.$msgbox({
                            title: '消息',
                            type: 'success',
                            message: '保存成功',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain',
                            callback:()=>{
                            	//刷新文件列表
                            	this.getFileList();
                            	//关闭上传弹窗
                            	this.btnCancleClick();
                            }
                        })
					}else{
						this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: res.data.message ? res.data.message : '保存失败！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain',
                            callback:()=>{
                            	//todo 后续处理
                            }
                        })
					}
				}).catch((error)=>{
					this.isLoading = false;
					this.$msgbox({
						title: '消息',
						type: 'error',
						message: '请求出错！',
						confirmButtonText: '知道了',
						confirmButtonClass: 'is-plain',
                    })
				})
			},
			btnCancleClick() {
				if(this.uploadFlag){
					this.$message.error('请先等待文件上传完成！');
					return false;
				}else{
					this.$refs['form'].resetFields()
	                this.formData.photoeType = 1;
	                this.imageUrl = '';
	               	this.uploadDialogVisible = false;
	               	this.imgLoading = false;
				}
            },
            beforeUpload(file){
            	this.uploadFlag = true;
            	this.imgLoading = true;
            },
            handleUploadSuccess(response,file,fileList){
            	this.uploadFlag = false;
            	this.imgLoading = false;
            	let uid = Cookie.get('t8t-tc-uid');
                let ticket = Cookie.get('t8t-tc-ticket');
            	if(response.status === 200){
            		this.formData.photoPath = response.result.filePath;
            		if(this.formData.photoeType === 1){
            			this.imageUrl = Server.gatewayAddr + '/?path='+ response.result.filePath +'&action=file&uid='+ uid + '&ticket=' + ticket;
            		}else if(this.formData.photoeType === 0){
            			this.imageUrl = dwg;
            		}
            	}else{
            		this.$message.error(response.message);
            	}
            },
            handleUploadError(err, file, fileList){
            	this.uploadFlag = false;
            	this.imgLoading = false;
            },
            handleUploadProgress(event, file, fileList){

            },
            switchPhotoType(val){
            	//清空已上传图片
            	this.formData.photoPath = '';
            	this.imageUrl = '';
            	if(val === 1){ //上传图片
                    //施工图纸 文件类型仅支持pdf
                    this.acceptType = '.pdf';
            	}else if(val === 0){ //上传源文件
            		this.acceptType = '.dwg';
            	}
            }
		}
	}
</script>
<style lang="css">
	.projectlist-upload-dialog .el-dialog__header{
		padding: 30px 0;
	}
	.projectlist-upload-dialog .el-form-item__content {
    	width: 250px;
    }
    .projectlist-upload-dialog .el-select {
    	width: 100%;
	}
	.file-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.file-uploader .el-upload:hover {
		border-color: #20a0ff;
	}
	.file-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}
	.show-image {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>
<style type="text/css" scoped>
	.uoload-box{
		margin: 30px 0 30px 0;
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		display: inline-block;
    	text-align: center;
	}
	.uoload-box .uploader-icon{
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}
	.picture-list{
		margin-top: 30px;
	}
	.picture-list .list-item{
		width: 200px;
		height: 188px;
		display: inline-block;
		margin: 0;
		padding: 0;
		overflow: hidden;
		margin: 0 15px 15px 0;
	}
	.picture-list .list-item img{
		cursor: pointer;
	}
	.picture-list .list-item .item-img{
		overflow: hidden;
		border: 1px solid #c0ccda;
		border-radius: 6px;
		box-sizing: border-box;
		width: 200px;
		height: 120px;
		position: relative;
	}
	.picture-list .list-item .item-img .item-status-label{
		position: absolute;
		right: -16px;
		top: -6px;
		width: 40px;
		height: 24px;
		background: #13ce66;
		color: #fff;
		text-align: center;
		transform: rotate(45deg);
    	box-shadow: 0 0 1pc 1px rgba(0,0,0,.2);
    	cursor: pointer;
	}
	.picture-list .list-item .item-img .item-status-label i{
		font-size: 12px;
		margin-top: 11px;
		-ms-transform: rotate(-45deg) scale(.8);
		transform: rotate(-45deg) scale(.8);
		color: #fff;
	}
	.picture-list .list-item .item-text{
		text-align: center;
	}
	.picture-list .list-item .item-text p{
		margin: 8px 0;
		font-size: 14px;
	}
</style>
