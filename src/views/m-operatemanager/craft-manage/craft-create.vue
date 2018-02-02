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
                                    name="changeContent">
                                    <el-form class="dialog2-form-container"
                                        :model="formData"
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
                                    <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" >
                                        <el-tab-pane
                                            v-for="(value, key, index) in craftTabs"
                                            :label="key"
                                            :name="key"
                                            :key="index"
                                            class="create-title-tab"
                                        >
                                            <el-button
                                                size="small"
                                                @click="add('Upload', '11',$event)"
                                                class="add-pic-btn"
                                            >
                                                新增图片
                                            </el-button>
                                            <ul>
                                                <li :is="item.component" @blur="getComponentValue" @delete="deleteUploadPic" @picSuccess="picUpload" :key='item.index' :title="key" :text="item.text" v-for="item in value"></li>
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
                v-model="dialogVisible"></t8t-gallery>
        </div>
    </div>
</template>

<script>
import Cookie from "js-cookie";
import Upload from './upload.vue'
import Service from 'src/services/craftmanager/Service.js'
export default {
    name: "craft-check",
    created() {
    },
    mounted() {
    },
    components: {
        Upload
    },
    data() {
        return {
            createPath: 'dcs/TechnologyInfo/create',
            editableTabsValue: '0',
            craftTabs: {

            },
            tabIndex: 0,
            isDialogShow: true,
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
            mark: []
        };
    },
    props: {
    },
    methods: {
        changeRadio() {},
        handleTabsEdit() {

        },
        addTab(targetName) {
            let newTabName = ++this.tabIndex + '';
            this.$prompt('请输入子标题名称','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                // inputPattern: /^[0-9a-zA-Z\u4e00-\u9fa5]{1,15}$/g,
                inputValidator: (value) => {
                    let reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,15}$/g;
                    if (!reg.test(value)) {
                        return '请输入正确子标题(数字，字母，中文),不超过15字'
                    }
                    if (value === null) {
                        return '子标题不能为空'
                    }
                    if (Object.keys(this.craftTabs).length > 14) {
                        return '子标题数不能超过15个'
                    }
                },
                inputErrorMessage: '请输入正确子标题名，不超过15字'
            }).then(({value}) => {
                this.$set(this.craftTabs,value,[]);
                this.technologyInfo.technologyInfoMaps[value] = [];
                this.editableTabsValue = value;
            })
        },
        removeTab(targetName) {
// console.log(targetName);
            let tabs = this.craftTabs;
            let activeName = this.editableTabsValue;
            this.editableTabsValue = activeName;
            this.$delete(this.craftTabs,targetName);
            this.$delete(this.technologyInfo.technologyInfoMaps,targetName);
        },
        add(component, text,event) {
// console.log(event);
            let name = event.target.parentNode.parentNode.parentNode.parentNode.firstElementChild.querySelector('.el-tabs__item.is-active.is-closable').innerText;
            let mark = new Date().getTime();

            if (this.craftTabs[name].length > 10) {
                this.$message.error('上传图片不能超过10张');
            }else {
                this.craftTabs[name].push({
                    'component': component,
                    'text': mark,
                })
            }
        },
        picUpload(that,data) {
            if (data.picRemark !== '' && this.mark.indexOf(data.mark) === -1) {
                this.mark.push(data.mark);
                let item = {
                    detailTitle: data.title,
                    detailDescribe: data.picRemark,
                    imageUrl: data.picUrl
                }
                this.technologyInfo.technologyInfoMaps[data.title].push(item);
            }
        },
        getComponentValue(data) {
            let moduleName = data.$parent.$options.propsData.label;
            let picData = data.picData;
            if (picData.picRemark.length > 300 || picData.picRemark.length < 15) {
                this.$message.error('图片描述为15-300字');
            }else if (picData.picRemark === '') {
                this.$message.error('请填写图片描述');
                let index = this.mark
                if (this.mark.indexOf(picData.mark) !== -1) {
                    this.$delete(this.mark,picData.mark);
                    let i = null
                    this.technologyInfo.technologyInfoMaps[moduleName].forEach((item,index) => {
                        if (item.imageUrl === picData.picUrl) {
                            i = index;
                        }
                    })
                    this.$delete(this.technologyInfo.technologyInfoMaps[moduleName],i);
                }
            }else if (picData.picUrl === '') {
                this.$message.error('请添加图片')
                if (this.mark.indexOf(picData.mark) !== -1) {
                    this.$delete(this.mark,picData.mark);
                }
            }else {
                if (this.mark.indexOf(picData.mark) === -1) {
                    this.mark.push(picData.mark);
                    let item = {
                        detailTitle: moduleName,
                        detailDescribe: picData.picRemark,
                        imageUrl: picData.picUrl
                    }
                    this.technologyInfo.technologyInfoMaps[moduleName].push(item);
                }
            }
console.log(this.technologyInfo);
        },
        deleteUploadPic(that,picData) {
            let mark = picData.mark;
            let title = picData.title;
            let i = null;
            this.craftTabs[title].forEach((item,index) => {
                if (item.text === mark) {
                    i = index;
                }
            });
            this.$delete(this.mark,mark);
            this.$delete(this.craftTabs[title],i);
            this.technologyInfo.technologyInfoMaps[title] = this.craftTabs[title];
        },
        SubmitBtn() {
// console.log(this.technologyInfo);
            let values = Object.values(this.technologyInfo.technologyInfoMaps);
            let keys = Object.keys(this.technologyInfo.technologyInfoMaps);
            let module = this.technologyInfo.technologyInfoMaps;
            for (const key in module) {
                if (module.hasOwnProperty(key)) {
                    const element = module[key];
                    if (element.length === 0) {
                        this.$delete(module,key);
                    }
                }
            }
// console.log(this.technologyInfo.technologyName.length);
            if (values.length < 1) {
                this.$message.error('请上传图片');
                return false;
            }else if (keys.length > 15 || keys < 1) {
                this.$message.error('子标题数为1到15个');
                return false;
            }else if (this.technologyInfo.technologyName === '') {
                this.$message.error('请输入工艺标题');
                return false;
            }else if (this.technologyInfo.technologyName.length > 5) {
                this.$message.error('工艺标题不能超过5个字');
            }else {
                let technologyInfo = Object.assign({},this.technologyInfo)
                let args = {technologyInfo: technologyInfo} ;
                this.$http.fetch(this.createPath,args).then( res => {
                    if (res.data.status === 200) {
                        this.$message.success('创建工艺成功');
                        this.$router.push({
                            path: '/tuchat-craft-manage/craft-manage'
                        })
                    }else {
                        this.$message.error('创建失败')
                    }
                })
            }
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
</style>
