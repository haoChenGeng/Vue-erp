<!--
 * File: picDeal.vue
 * Comment:banner 图片插件
 * Created by WebStorm.
 * User: tony.huang
 * Date: 2018/1/17
 * Time: 13:45
 -->
<template>
    <div class="banner-pic-box">
        <div
            v-if="!imageUrl"
            class="pic-box">
            <el-upload
                v-loading.body="picLoading"
                class="avatar-uploader"
                :action="uploadURL"
                :data="uploadParams"
                :file-list="imgList"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
            >
                <i class="el-icon-picture avatar-uploader-icon">
                    <p style="font-size: 12px">上传{{fields.title}}</p>
                </i>
            </el-upload>
        </div>
        <div
            v-else
            class="pic-box"
             v-loading.body="picLoading || deleteDisabled">
            <img  :src="imageUrl" class="avatar">
            <div>
                <div class="pic-infos">
                    <h5>{{fields.title}}</h5>
                    <p v-if="fields.status !== null">审核状态：<span :class="statusType">{{statusInfo}}</span></p>
                    <p v-if="fields.status !== null">审核备注：<span class="remarks" :title="fields.verifyRemark">{{fields.verifyRemark}}</span></p>
                </div>
            </div>
            <div class="pic-icons" v-if="fields.status !== 0">
                <el-upload
                    class="pic-icons-item"
                    :action="uploadURL"
                    :data="uploadParams"
                    :accept="acceptImg"
                    :file-list="imgList"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :on-success="handleSuccess"
                >
                    <i class="el-icon-upload avatar-icon">上传</i>
                </el-upload>
                <div class="pic-icons-item">
                    <i class="el-icon-view avatar-icon" @click="showPic">放大</i>
                </div>
                <div class="pic-icons-item">
                    <i class="el-icon-delete2 avatar-icon"
                       @click="deletePic"
                    >删除</i>
                </div>
            </div>
            <div class="pic-icons disabled" v-else>
                <div class="pic-icons-item">
                    <i class="el-icon-upload disabled-icon">上传</i>
                </div>
                <div class="pic-icons-item">
                    <i class="el-icon-view avatar-icon" @click="showPic">放大</i>
                </div>
                <div class="pic-icons-item">
                    <i class="el-icon-delete2 disabled-icon">删除</i>
                </div>
            </div>
        </div>
        <div class="append-info">
            <el-button type="info" v-if="imgChage && imageUrl"
                       @click="submit"
                       v-loading.body.lock="submitDisabled"
                       :disabled="submitDisabled">提交
            </el-button>
        </div>
        <el-dialog v-model="dialogVisible"
                   size="large">
            <img width="100%"
                 :src="imageUrl"
                 alt="">
        </el-dialog>
    </div>
</template>
<script>
    import Utils from 'src/utils/Utils.js'
    export default {
        name: 'pic-box',
        data() {
            return {
                submitDisabled: false,
                deleteDisabled: false,
                dialogVisible: false,
                show: true,
                picLoading: false,
                acceptImg: '.jpg,.jpeg,.png,.bmp',
                uploadURL: Utils.getUploadURL(),
                uploadParams: {
                    bucket: 'scm',
                    module: 'pic/dcs/banner'
                },
                statusList: [
                    {value: 0, text: '待审核'},
                    {value: 1, text: '审核通过'},
                    {value: 2, text: '审核不通过'}
                ],
                statusType: 'pic-status',
                statusInfo: '',
                viewsType: '',
                imageUrl: '',
                imgChage: false
            }
        },
        props: {
            fields: {
                type: Object,
                default: {
                    title: '',
                    imageUrl: '',
                    status: null,
                    id: null,
                    verifyRemark: null
                }
            },
            maxWidth: {
                type: Number,
                default: 1080
            },
            maxHeight: {
                type: Number,
                default: 320
            },
            maxSizeImg: {
                type: Number,
                default: 2 * 1024 * 1024
            }
        },
        created() {
            this.setStatus()
        },
        watch: {
            fields(val) {
                if (val.imageUrl) this.imageUrl = Utils.getFullURL(val.imageUrl)
                this.setStatus()
            },
            imgList(val) {
                if (val && val.length > 1) {
                    this.viewsType = 'el-upload-full'
                }
            }
        },
        methods: {
            setStatus() {
                let _statusType
                let statusName = this.statusList.find(item => item.value === this.fields.status)
                this.statusInfo = statusName ? statusName.text : ''
                switch (this.fields.status) {
                    case 1:
                        _statusType = 'pic-status-pass'
                        break
                    case 2:
                        _statusType = 'pic-status-refuse'
                        break
                    default:
                        _statusType = ''
                }
                this.statusType = _statusType
            },
            showPic() {
                this.dialogVisible = true
            },
            handleSuccess(response, file, fileList) {
                this.picLoading = false
                if (response.status === 200) {
                    this.fields = {...this.fields, ...{imageUrl: response.result.filePath, status: null}}
                    this.imageUrl = Utils.getFullURL(response.result.filePath)
                }
                this.imgChage = true

            },
            beforeUpload(file) {
                let _this = this
                if (['image/jpg', 'image/x-png', 'image/png', 'image/bmp', 'image/jpeg', 'image/jpeg'].indexOf(file.type) < 0) {
                    this.$message.error('上传格式错误！')
                    return false
                }
                if (file.size > this.maxSizeImg) {
                    _this.$message.error(`图片大于${_this.maxSizeImg / (1024 * 1024)}M，请重新上传`)
                    return false
                }
                this.picLoading = true
                // return new Promise(function (resolve, reject) {
                //     var reader = new FileReader()
                //     reader.readAsDataURL(file)
                //     var img = new Image()
                //     img.onload = function (e) {
                //         let height = e.path[0]['height']
                //         let width = e.path[0]['width']
                //         if (height > _this.maxHeight || width > _this.maxWidth) {
                //             _this.picLoading = false
                //             _this.$message.error(`图片尺寸错误,请上传不超过${_this.maxWidth}*${_this.maxHeight}像素的图片`)
                //             reject(new Error(`图片尺寸错误,请上传不超过${_this.maxWidth}*${_this.maxHeight}像素的图片`))
                //         } else {
                //             resolve(true)
                //         }
                //     }
                //     reader.onload = function (oFREvent) {
                //         img.src = oFREvent.target.result
                //     }
                // })
            },
            deletePic() {
                this.$confirm(
                    `确认删除${this.fields.title}的广告图片？`,
                    '提示',
                    {
                        type: 'warning',
                        confirmButtonText: '确认',
                        cancelButtonText: '取消'
                    }
                ).then(_ => {
                    if (!this.fields.id) {
                        this.imageUrl = null
                        return
                    }
                    this.deleteDisabled = true
                    this.$emit('delete', this.fields, res => {
                        this.deleteDisabled = false
                        if (res) {
                            this.imageUrl = null
                            this.fields = {...this.fields, ...{imageUrl: '', status: null, id: null}}
                        }
                    })
                }).catch(_ => {
                })
            },
            submit() {
                this.submitDisabled = true
                this.$emit('submit', this.fields, res => {
                    this.submitDisabled = false
                    if (res) {
                        this.fields = {...this.fields, ...{id: res, status: 0}}
                        this.imgChage = false
                    }
                })
            }
        }
    }
</script>
<style>
    .banner-pic-box .pic-infos {
        text-align: left;
        padding:10px;
        min-height: 40px;
    }
    .banner-pic-box .pic-infos h5{
        margin: 2px 5px;
        font-size: 14px;
        color: #666666;
    }
     .banner-pic-box .el-dialog--large {
        width: auto !important;
    }
    .banner-pic-box .el-upload--picture-card {
        position: relative !important;
        width: 250px;
    }

    .banner-pic-box div.el-upload-disabled > .el-upload--picture-card {
        display: none !important;
    }

    .banner-pic-box div.el-upload-full > .el-upload--picture-card {
        display: none !important;
    }

    .banner-pic-box div.el-upload-disabled span.el-upload-list__item-delete {
        display: none !important;
    }

    .banner-pic-box .pic-box {
        border: 1px solid #d4dde7;
        width: 250px;
        /*height: 230px;*/
        display: block;
        /*border-radius: 6px;*/
        position: relative;
        /*margin: 0 auto;*/
        min-height: 200px;
    }
    .pic-infos p{
        padding: 5px;
        margin: unset;
        font-size: 12px;
        line-height: 13px;
        color: #666;
    }
    .pic-infos p span{
        display: inline-block;
        width: 154px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
        vertical-align: middle;
    }

    .banner-pic-box .pic-box .avatar {
        /*position: absolute;*/
        width: 100%;
        height: 100px;
        display: block;
        /*z-index: -1;*/
        /*border-radius: 6px;*/
    }

    .banner-pic-box .pic-box .pic-icons {
        text-align: center;
        /*border-radius: 6px;*/
        vertical-align: middle;
        display: flex;
        padding: 5px 10px;
        border-top: 1px solid #d4dde7;
        line-height: 26px;
        /*z-index: 2;*/
        /*opacity: 0.8;*/
    }

    .banner-pic-box .pic-box .pic-icons .pic-icons-item {
        flex:1;
        vertical-align: middle;
        display: inline-block;
    }
    .banner-pic-box .pic-box .pic-icons .pic-icons-item .avatar-icon{
        font-size: 14px;
        letter-spacing: 4px;
        color: #666;
        vertical-align: middle;

    }
    .banner-pic-box .pic-box .pic-icons .pic-icons-item:hover .avatar-icon{
        color: #85c2ff;
        cursor: pointer;
    }

    .banner-pic-box .pic-box .pic-icons .pic-icons-item:hover .el-icon-delete2{
        color: #ff5660;
    }

    .banner-pic-box .pic-box .pic-icons .pic-icons-item .disabled-icon {
        cursor: not-allowed;
        color: #d4dde7;
        font-size: 14px;
    }

    .banner-pic-box .pic-box .disabled .pic-icons-item .disabled-icon {
        color: #d4dde7 !important;
    }

    .banner-pic-box .avatar-uploader .el-upload {
        cursor: pointer;
        position: relative;
        overflow: hidden;
        line-height:200px
    }

    .banner-pic-box .avatar-uploader {
        height: 200px;
    }

    .banner-pic-box .avatar-uploader .avatar-uploader-icon {
        font-size: 28px;
        text-align: center;
        cursor: pointer;
        color: #d4dde7;
        vertical-align: middle;
    }
    .banner-pic-box .avatar-uploader:hover .avatar-uploader-icon{
        color: #85c2ff;
    }


</style>

<style scoped>
    .banner-pic-box {
        width: 240px;
        height: 240px;
        flex: 1;
        text-align: center;
    }
    .append-info{
        margin-top: 8px;
        width: 250px;
    }
    .append-info p {
        margin: 5px;
        font-size: 14px;
    }

    .append-info .el-button {
        padding: 5px 15px;
    }

    /*.pic-status {*/
        /*position: absolute;*/
        /*top: 0px;*/
        /*right: 0px;*/
        /*color: #fff;*/
        /*z-index: 2;*/
        /*width: 85px;*/
        /*height: 20px;*/
        /*line-height: 20px;*/
        /*font-size: 14px;*/
        /*!*border-radius: 0 6px 0 6px;*!*/
    /*}*/

    .pic-status-pass {
        color: #00b964;
    }

    .pic-status-refuse {
        color: #ff5660;
    }


</style>
