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
                                                <li :is="item.component" @blur="getComponentValue" @delete="deleteUploadPic" :key='item.index' :title="key" :text="item.text" v-for="item in value"></li>
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
        // console.log(222);
    },
    components: {
        Upload
    },
    data() {
        return {
            createPath: 'dcs/TechnologyInfo/create',
            // picLists: [],
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
            this.$prompt('请输入子标题名称','',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[0-9a-zA-Z\u4e00-\u9fa5]*$/,
                inputErrorMessage: '请输入正确格式标题'
            }).then(({value}) => {
// this.craftTabs[value] = [];
                this.$set(this.craftTabs,value,[]);
// console.log(this.craftTabs)
                this.technologyInfo.technologyInfoMaps[value] = [];
                this.editableTabsValue = value;
// console.log(newTabName);
// console.log(this.editableTabsValue)
            })
        },
        removeTab(targetName) {

            let tabs = this.craftTabs;
            let activeName = this.editableTabsValue;
            this.editableTabsValue = activeName;
            this.$delete(this.craftTabs,targetName);
        },
        add(component, text,event) {
            let name = event.target.parentNode.parentNode.parentNode.parentNode.firstElementChild.querySelector('.el-tabs__item.is-active.is-closable').innerText;
            let mark = new Date().getTime();

// console.log(this.craftTabs);
            this.craftTabs[name].push({
                'component': component,
                'text': mark,
            })



        },
        getComponentValue(data) {
            let moduleName = data.$parent.$options.propsData.label;
            let picData = data.picData;
            // let mark = [];
// console.log(picData);
            if (picData.picRemark === '') {
                this.$message.error('请填写图片描述');
            }else if (picData.picUrl === '') {
                this.$message.error('请添加图片')
            }else {
// console.log(this.craftTabs)
                // mark.push(picData.mark);
                if (this.mark.indexOf(picData.mark) == -1) {
                    this.mark.push(picData.mark);
                    let item = {
                        detailTitle: moduleName,
                        detailDescribe: picData.picRemark,
                        imageUrl: picData.picUrl
                    }
                    this.technologyInfo.technologyInfoMaps[moduleName].push(item);
                }
// console.log(mark);
// console.log(this.technologyInfo);
            }
        },
        deleteUploadPic(that,picData) {
            let mark = picData.mark;
            let title = picData.title;
// console.log();
            let i = null;
            this.craftTabs[title].forEach((item,index) => {
                if (item.text === mark) {
                    i = index;
                }
            });
            this.$delete(this.mark,mark);
            this.$delete(this.craftTabs[title],i);
            this.technologyInfo.technologyInfoMaps[title] = this.craftTabs[title];
// console.log(this.technologyInfo);

        },
        SubmitBtn() {
            if (this.technologyInfo.technologyName === '') {
                this.$message.error('请输入工艺标题');
            }else {
                let technologyInfo = Object.assign({},this.technologyInfo)
                let args = {technologyInfo: technologyInfo} ;
                this.$http.fetch(this.createPath,args).then( res => {
                    if (res.result.status === 200) {
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
