<template>
    <div class="upload-remark" :picData="picData">
        <el-upload
            :class="{ 'class-a': uploadVisible, 'upload-pic':true}"
            :action="uploadURL"
            list-type="picture-card"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :file-list="fileList2"
            :data="uploadParams"
            accept=".png,.jpg,.jpeg"
            :multiple="false"
            :auto-upload="true"
            >
            <i class="el-icon-plus"></i>
        </el-upload>
        <!-- <el-dialog v-model="dialogVisible" size="tiny">
            <img width="100%" v-if="dialogImageUrl" :src="dialogImageUrl" alt="">
        </el-dialog> -->
        <el-input
            type="textarea"
            :rows="7"
            placeholder="请输入内容"
            v-model="textarea"
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
    props: ['text','title'],
    data() {
        return {
            fileList2: [],
            picData: {
                picUrl: '',
                picRemark: ''
            },
            dialogVisible: false,
            uploadURL: Utils.getPicUploadURL(),
            dialogImageUrl: '',
            textarea: '',
            uploadParams: {
                bucket: 'scm',
                module: 'delivery'
            },
            pictureCard: 'picture-card',
            uploadVisible: false
        };
    },
    methods: {
        handleRemove(file, fileList) {
// console.log(file, fileList);
            this.picData.mark = this.text;
            this.picData.title = this.title;
            this.$emit('delete',this,this.picData);
        },
        handlePreview(file) {
// console.log(file);
            this.dialogImageUrl = file.url;
            // this.dialogVisible = true;
        },
        handleSuccess(response, file, fileList){
// console.log(response)
            this.picData.picUrl = file.url;
            this.uploadVisible = true;
            this.$emit("picSuccess",this,this.picData);
        },
        handleBlur(event) {
// console.log(this.picData);
            this.picData.picRemark = event.target.value;
            this.picData.mark = this.text;
            this.picData.title = this.title;
            this.$emit("blur", this,  this.picData);
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
