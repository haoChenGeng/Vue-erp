<template>
    <div class="upload-remark" :picData="picData">
        <el-upload
            :class="{ 'class-a': uploadVisible, 'upload-pic':true}"
            :action="uploadURL"
            list-type="picture-card"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-progress="handelProgress"
            :file-list="uploadPicUrl"
            :data="uploadParams"
            accept=".png,.jpg,.jpeg"
            :multiple="false"
            :auto-upload="true"
            >
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog v-model="dialogVisible" @close="closeDialog" :modal="false" :before-close="handleClose" size="tiny">
            <img width="100%" v-if="dialogImageUrl" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-input
            type="textarea"
            :rows="7"
            placeholder="请输入内容"
            v-model="item.detailDescribe"
            class="pic-remark"
            @blur="handleBlur"
            @change="handleChange"
        >
        </el-input>
    </div>
</template>

<script>
import Utils from 'src/utils/Utils.js'
export default {
    // props: ['uploadVisible','fileList2'],
    props: {
        item: Object,
        index: Number,
    },
    created() {
        // debugger
console.log(this.fileList2);
    },
    data() {
        return {
            // fileList2: [],
            picData: {
                picUrl: '',
                picRemark: '',
                upId: null
            },
            dialogVisible: false,
            uploadURL: Utils.getPicUploadURL(),
            dialogImageUrl: '',
            textarea: '',
            uploadParams: {
                bucket: 'scm',
                module: 'pic/dcs/technology'
            },
            pictureCard: 'picture-card',
            isProgress: false
            // uploadVisible: false
        };
    },
    watch: {

    },
    computed: {
        uploadPicUrl: function() {
            if (this.item.imageUrl === '') {
                return []
            }else {
                return [{id: this.item.id,url: Utils.getFullURL(this.item.imageUrl)}]
            }
        },
        uploadVisible: function() {
            if (this.isProgress) {
                return true;
            }
            if (this.item.imageUrl !== '') {
                return true;
            }
        }
    },
    methods: {
        handleRemove(file, fileList) {
console.log()
            this.fileList2 = [];
            this.$emit('delete',this.index,this.item.detailTitle);
        },
        // getUrl(item) {
        //     return [{id: item.id,url: Utils.getFullURL(item.imageUrl)}]
        // },
        handlePreview(file) {
console.log(file);
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleClose(done) {
            done();
        },
        handleError(file) {
            // this.uploadVisible = false;
        },
        handelProgress(file) {
            this.isProgress = true;
            // this.uploadVisible = true;
        },
        closeDialog() {
            console.log(this);
        },
        handleSuccess(response, file, fileList){
console.log(response)
            if (fileList.length > 1) {
                fileList.length = 1;
            }
            this.item.imageUrl = response.result.filePath;
            // this.picData.picUrl = response.result.filePath;
            // this.picData.mark = this.text;
            // this.picData.title = this.title;
            this.$emit("picSuccess",this,this.picData);
        },
        handleBlur(event) {
            this.picData.mark = this.text;
            this.picData.title = this.title;
            this.$emit("blur", this.index,this.item.detailTitle);
        },
        handleChange(value) {
// console.log(value);
            this.picData.picRemark = event.target.value;
            this.$emit("change", this, this.picData);
        }
    }
}

</script>
<style lang="css">
.upload-pic {
    display: inline-block;
}
.pic-remark {
    width: 40%;
    margin-left: 20px;
    height: 148px;
}
.upload-remark {
    margin-top: 20px;
}
.upload-pic .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .upload-pic .el-upload:hover {
    border-color: #20a0ff;
  }
  .upload-pic-icon {
    font-size: 28px;
    color: #8c939d;
    width: 168px;
    height: 168px;
    line-height: 168px;
    text-align: center;
  }
  .pic {
    width: 168px;
    height: 168px;
    display: block;
  }
  .class-a .el-upload--picture-card {
      display: none;
  }
  .el-upload--picture-card {
      height: 138px;
      vertical-align: 7px;
  }
</style>
