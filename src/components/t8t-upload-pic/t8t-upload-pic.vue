<template>
  <div class="upload-picture" :picData="picData">
    <el-upload
      class="upload-pic"
      ref="my-upload"
      list-type="picture-card"
      :class="{ 'uploadVisible': uploadVisible}"
      :action="uploadURL"
      :on-preview="handlePreview"
      :on-remove="handleRemovePic"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-progress="handelProgress"
      :file-list="uploadPicUrl"
      :data="uploadParams"
      :accept="picType"
      :multiple="false"
      :auto-upload="true"
      :drag="drag"
      :headers="headers"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog v-model="dialogVisible" @close="closeDialog" :modal="false" :before-close="handleClose" size="tiny">
      <img width="100%" v-if="dialogImageUrl" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-input type="textarea" :rows="rows" :placeholder="placeholder" v-model.trim="item.detailDescribe" class="pic-desc" @blur="handleBlur" @change="handleChange">
    </el-input>
    <el-button size="small" @click="handleRemove" class="delete-pic-btn" v-if="hasDeleteBtn" >
      删除
    </el-button>
  </div>
</template>

<script>
import Utils from "src/utils/Utils.js";
export default {
  props: {
    headers: Object,

    imageUrl: {
      type: String,
      default: '',
    },
    drag: {
      type: Boolean,
      default: false
    },
    describe: {
      type: String,
      default: '',
    },
    picType: {
      type: String,
      default: '.png,.jpg,.jpeg'
    },
    uploadURL: {
      type: String,
      default: Utils.getPicUploadURL() || ''
    },
    rows: {
      type: Number,
      default: 7
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    hasDeleteBtn: {
      type: Boolean,
      default: true
    },
    uploadParams: Object
  },
  created() {},
  data() {
    return {
      picData: {
        picUrl: "",
        picRemark: "",
        uploadId: null
      },
      dialogVisible: false,
      // uploadURL: Utils.getPicUploadURL(),
      dialogImageUrl: "",
      textarea: "",
      // uploadParams: {
      //   bucket: "scm",
      //   module: "pic/dcs/technology"
      // },
      // pictureCard: "picture-card",
      isProgress: false
    };
  },
  watch: {},
  computed: {
    uploadPicUrl: function() {
      if (this.item.imageUrl === "") {
        return [];
      } else {
        return [{ id: this.item.id, url: Utils.getFullURL(this.item.imageUrl) }];
      }
    },
    uploadVisible: function() {
      console.log(this.item);
      if (this.isProgress || this.item.imageUrl !== "") {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.$emit("delete", this.index, this.item.detailTitle, this.tabIndex);
    },
    handleRemovePic(file, fileList) {
      this.isProgress = false;
      this.item.imageUrl = "";
      this.$emit("deletePic", this.index, this.item.detailTitle, this.tabIndex);
    },
    handlePreview(file) {
console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleClose(done) {
      done();
    },
    // 网络原因等上传失败
    handleError(err, file) {
// console.log(err);
      this.isProgress = false;
      this.$message.error("upload error");
    },
    handelProgress(file) {
      this.isProgress = true;
    },
    closeDialog() {
      // console.log(this);
    },
    // 图片已上传，根据response判断是否成功
    handleSuccess(response, file, fileList) {
      if (response.status !== 200) {
        this.$message.error(response["message"]);
        this.$refs["my-upload"].clearFiles();
      } else {
        if (fileList.length > 1) {
          fileList.length = 1;
        }
        this.isProgress = true;
        this.item.imageUrl = response.result.filePath;
        this.$emit("picSuccess", this, this.picData);
      }
    },
    handleBlur(event) {
      this.$emit("blur", this.index, this.item.detailTitle);
    },
    handleChange(value) {
// console.log(value);
      this.picData.picRemark = event.target.value;
      this.$emit("change", this, this.picData);
    }
  }
};
</script>
<style lang="css" scoped>
.upload-pic {
  display: inline-block;
}
.pic-desc {
  width: 40%;
  margin-left: 20px;
  height: 148px;
  vertical-align: 1px;
}
.upload-picture {
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
.uploadVisible .el-upload--picture-card {
  display: none;
}
.el-upload--picture-card {
  height: 148px;
  vertical-align: 7px;
  margin-right: 8px;
}
.delete-pic-btn {
  vertical-align: 65px;
  margin-left: 30px;
}
</style>
