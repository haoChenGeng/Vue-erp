<template>
	<div>
		<t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
		<div class="uoload-box" @click="showUploadDialog">
			<i class="el-icon-plus uploader-icon"></i>
		</div>
		<div>
			<p>注意事项：</p>
			<p>1、dwg格式，大小限制20M</p>
			<p>2、已上传文件，继续上传将会覆盖</p>
		</div>
		<div class="picture-list">
			<div class="list-item">
				<div class="item-img">
					<img src="./cad.png" width="100%" height="100%">
				</div>
				<div class="item-text">
					<p>
						地面铺装图样例
					</p>
					<a @click="showPicture" href="javascript:;">
						点击查看大图
					</a>
				</div>
			</div>
			<div class="list-item">
				<div class="item-img">
					<img src="./cad.png" width="100%" height="100%">
				</div>
				<div class="item-text">
					<p>
						地面铺装图样例
					</p>
					<a href="#">
						点击查看大图
					</a>
				</div>
			</div>
			<div class="list-item">
				<div class="item-img">
					<img src="./cad.png" width="100%" height="100%">
				</div>
				<div class="item-text">
					<p>
						地面铺装图样例
					</p>
					<a href="#">
						点击查看大图
					</a>
				</div>
			</div>
			<div class="list-item">
				<div class="item-img">
					<img src="./cad.png" width="100%" height="100%">
				</div>
				<div class="item-text">
					<p>
						地面铺装图样例
					</p>
					<a href="#">
						点击查看大图
					</a>
				</div>
			</div>
			<div class="list-item">
				<div class="item-img">
					<img src="./cad.png" width="100%" height="100%">
				</div>
				<div class="item-text">
					<p>
						地面铺装图样例
					</p>
					<a href="#">
						点击查看大图
					</a>
				</div>
			</div>
		</div>

		<el-dialog v-model="dialogVisible" :modal="false" size="large">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
	</div>
</template>

<script type="text/javascript">
	export default {
		data(){
			return {
		 		breadcrumbData: [{ title: '施工图' },{ title: '施工图' }],
		 		dialogVisible: false,
		 		dialogImageUrl: '',
			}
		},
		methods:{
			showUploadDialog(){
				alert('上传弹窗');
			},
			showPicture(){
				this.dialogVisible = true;
				this.dialogImageUrl = './cad.png';
			}
		}
	}
</script>

<style type="text/css" scoped>
	.uoload-box{
		margin: 30px 0 30px 50px;
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
		height: 200px;
		display: inline-block;
		margin: 0;
		padding: 0;
		overflow: hidden;
		margin: 0 15px 15px 0;
	}
	.picture-list .list-item .item-img{
		border: 1px solid #c0ccda;
		border-radius: 6px;
		box-sizing: border-box;
		width: 200px;
		height: 120px;
	}
	.picture-list .list-item .item-text{
		text-align: center;
	}
	.picture-list .list-item .item-text p{
		margin: 8px 0;
		font-size: 14px;
	}
</style>