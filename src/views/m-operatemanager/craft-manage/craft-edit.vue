<template>
    <div class="check-details">
        <el-dialog @close="closeDialog"
            v-model="isDialogShow"
            size="full"
            class="t8t-full-dialog2 dialog-new operate-view"
            :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">

                        <t8t-toolbar class="t8t-dark"
                            @SUBMIT="SubmitBtn"
                            :symbolList="symbolList"
                            ref="indexToolbar">
                        </t8t-toolbar>
                    </div>
                </div>

                <div class="dialog2-main-container">
                    <!-- 表单区 -->

                    <div class="full-dialog-form-container">
                    </div>

                    <div class="table-list-container">
                        <el-tabs v-model="activeTabName"
                            @tab-click="clickTab">

                            <div class="table-list">
                                <el-tab-pane label="工艺信息"
                                    name="changeContent"
                                    v-model="technologyInfo"
                                >
                                    <el-form class="dialog2-form-container"
                                        ref="formRef"
                                        :rules="formRules"
                                        label-position="right"
                                        label-width="100px">
                                        <div class="dialog2-form-item-container">
                                            <el-form-item label="工艺标题：">
                                                <el-input v-model="technologyInfo.technologyName"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-form>
                                    <div class="create-title">
                                        <el-button
                                            size="small"
                                            @click="addTab(editableTabsValue)"
                                        >
                                            新建子标题
                                        </el-button>
                                    </div>
                                    <el-tabs type="card" closable @tab-remove="removeTab" >
                                        <el-tab-pane
                                            v-for="(item,index) in craftTabs"
                                            :label="item.title"
                                            :name="index"
                                            :key="index"
                                            class="create-title-tab"
                                        >
                                            <el-button
                                                size="small"
                                                @click="add('Upload', '123')"
                                                class="add-pic-btn"
                                            >
                                                新增图片
                                            </el-button>
                                            <div v-for="(item,index) in item.content" :key="item.id">
                                                <div class="upload-remark edit-upload">
                                                    <el-upload
                                                        :class="{ 'class-a': editUploadVisible, 'upload-pic':true}"
                                                        :action="uploadURL"
                                                        list-type="picture-card"
                                                        :on-preview="handlePreview"
                                                        :on-remove="handleRemove"
                                                        :on-success="handleSuccess"
                                                        :data="uploadParams"
                                                        accept=".png,.jpg,.jpeg"
                                                        :multiple="false"
                                                        :auto-upload="true"
                                                        :file-list="getPicUrl(item.imageUrl,item.id)"
                                                        >
                                                        <i class="el-icon-plus"></i>
                                                    </el-upload>
                                                    <el-dialog v-model="dialogVisible" size="tiny">
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
                                            </div>
                                            <ul>
                                                <li :is="item.component" @blur="getComponentValue" :key='item.index' :text="item.text" v-for="item in picLists"></li>
                                            </ul>
                                        </el-tab-pane>
                                    </el-tabs>
                                </el-tab-pane>
                            </div>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </el-dialog>
        <div id="picDiv">
            <t8t-gallery ref="gallery"
                :data="dialogImageUrl"
                v-model="dialogVisible">
            </t8t-gallery>
        </div>
    </div>
</template>

<script>
import Cookie from "js-cookie";
import Utils from 'src/utils/Utils.js'
import Upload from './upload.vue'
import Service from 'src/services/craftmanager/Service.js'
export default {
    name: "craft-check",
    created() {
        this.initPrams();
        this.getTechnologyInfo();
        console.log(this.technologyInfo);
    },
    mounted() {
        // console.log(222);
    },
    components: {
        Upload
    },
    data() {
        return {
            getDetailUrl: 'dcs/TechnologyInfo/findById',
            createPath: 'dcs/TechnologyInfo/create',
            picLists: [],
            uploadURL: Utils.getPicUploadURL(),
            editableTabsValue: '2',
            craftTabs: [],
            tabIndex: 2,
            isDialogShow: true,
            editUploadVisible: true,
            technologyInfo: {
                technologyName: "",
                technologyInfoMaps: {}
            },
            isPass: false,
            activeTabName: "changeContent",
            formData: {},
            formRules: {},
            tableList: {
                data08: {}
            },
            columns: [
                { props: "moduleName", label: "模块名称" },
                { props: "url", label: "图片" },
                { props: "des", label: "描述" }
            ],
            ruleForm: {
                agree: null,
                idea: false
            },
            rules: {
                agree: [
                    {
                        required: true,
                        message: "请选择审核方案",
                        trigger: "change"
                    }
                ],
                idea: [
                    {
                        required: true,
                        message: "请填写审批意见",
                        trigger: "blur"
                    },
                    {
                        max: 200,
                        message: "审批意见最多200字",
                        trigger: "blur"
                    }
                ]
            },

        };
    },
    props: {
    },
    methods: {
        changeRadio() {},
        handleTabsEdit() {

        },
        getPicUrl(url,id) {
            return [{name: id,url: url}]
        },
        addTab(targetName) {
            let newTabName = ++this.tabIndex + '';
            this.$prompt('请输入子标题名称','',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[0-9a-zA-Z\u4e00-\u9fa5]*$/,
                inputErrorMessage: '请输入正确格式标题'
            }).then(({value}) => {
                this.craftTabs.push({
                    title: value,
                    name: newTabName,
                });
                this.technologyInfo.technologyInfoMaps[value] = [];
                this.editableTabsValue = newTabName;
            })
        },
        removeTab(targetName) {
            let tabs = this.craftTabs;
            let activeName = this.editableTabsValue;
            if (activeName === targetName) {
            tabs.forEach((tab, index) => {
                if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                    activeName = nextTab.name;
                }
                }
            });
            }

            this.editableTabsValue = activeName;
            this.craftTabs = tabs.filter(tab => tab.name !== targetName);
        },
        add(component, text) {
            console.log(component);
            this.picLists.push({
                'component': component,
                'text': text,
            })
        },
        getComponentValue(data) {
            let moduleName = data.$parent.$options.propsData.label;
            let picData = data.picData;
// console.log(data.$parent.$options.propsData.label)
// console.log(data.picData);
// console.log(this.technologyInfo);
            if (picData.picRemark === '') {
                this.$message.error('请填写图片描述');
            }else if (picData.picUrl === '') {
                this.$message.error('请添加图片')
            }else {
                let item = {
                    detailTitle: moduleName,
                    detailDescribe: picData.picRemark,
                    imageUrl: picData.picUrl
                }
                this.technologyInfo.technologyInfoMaps[moduleName].push(item);
                console.log(this.technologyInfo);
            }
        },
        SubmitBtn() {
            if (this.technologyInfo.technologyName === '') {
                this.$message.error('请输入工艺标题');
            }else {
                let technologyInfo = Object.assign({},this.technologyInfo)
                let args = {technologyInfo: technologyInfo} ;
                console.log(33333);
                this.$http.fetch(this.createPath,args).then( res => {
                    console.log(res)
                    if (res.data.status === 200) {
                        this.$message.success('工艺成功');
                        this.$router.push({
                            path: '/tuchat-craft-manage/craft-manage'
                        })
                    }else {
                        this.$message.error('失败')
                    }
                })
            }
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
            this.uploadVisible = false;
            this.editUploadVisible = false;
        },
        handlePreview(file) {
            console.log(file);
            this.dialogImageUrl = file.url;
            // this.dialogVisible = true;
        },
        handleSuccess(response, file, fileList){
            console.log(response)
            this.picData.picUrl = file.url;
            this.uploadVisible = true;
        },
        handleBlur(event) {
            console.log(this.picData);
            this.picData.picRemark = event.target.value;
            this.$emit("blur", this,  this.picData);
        },
        handleChange(value) {
            console.log(value);
            this.picData.picRemark = event.target.value;
            this.$emit("change", this, this.picData);
        },
        initPrams: function () {
            //公司id
            this.id = this.$route.query.id
        },
        getTechnologyInfo() {
            let args = {
                id: this.id
            }
            this.$http.fetch(this.getDetailUrl, args).then(res => {
                if (res.data.status === 200) {
console.log(res.data.result)
                    this.technologyInfo = res.data.result;
console.log(this.technologyInfo);
                    let tabsArr = this.technologyInfo.technologyInfoMaps;
                    if (Object.keys(tabsArr) !== 0) {
                        for (const key in tabsArr) {

                                this.craftTabs.push({
                                    title: key,
                                    name: key,
                                    content: tabsArr[key]
                                });

                        }
                    }
console.log(this.craftTabs);
                }
            }).catch(error => {
                this.$message.error(error);
            })
        },
        closeDialog() {
            this.$router.push({
                path: '/tuchat-craft-manage/craft-manage'
            })
        }
    }
};
</script>


<style lang="css" scoped>
.check-table {
    width: 1220px;
    margin: 20px auto;
}
.dialog2-form-container {
    width: 1220px;
    margin: 20px auto;
}

.operate-view .el-textarea__inner {
    max-height: 100px;
}
.create-title {
    margin: 20px auto;
    width:1220px;

}
.add-pic-btn {
    margin-top: 20px;
}
.create-title-tab {
    width: 1220px;
    margin: auto;
}
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
  /* .el-upload-list--picture-card .el-upload-list__item {
      width: 138px;
      height: 138px;
  } */
  .edit-upload {
      margin-left: 40px;
  }
  .edit-upload .el-upload-list--picture-card .el-upload-list__item {
      height: 138px;
  }
</style>
