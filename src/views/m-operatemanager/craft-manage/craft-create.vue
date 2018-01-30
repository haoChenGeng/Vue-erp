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
                            @AUDITING-SUBMIT="SubmitBtn"
                            :symbolList="symbolList"
                            ref="indexToolbar">
                        </t8t-toolbar>
                    </div>
                </div>

                <div class="dialog2-main-container">
                    <!-- 表单区 -->

                    <div class="full-dialog-form-container">
                        <!-- <el-form
                            :model="ruleForm"
                            :rules="rules"
                            ref="t8tAudit"
                            label-width="80px"
                            class="t8t-audit-form">
                            <div class="dialog2-form-item-container">
                                <el-form-item label="审批批注" prop="idea" v-show="isPass">
                                    <el-input type="text" v-model="ruleForm.idea"  :rows="4" placeholder="请输入内容" ></el-input>
                                </el-form-item>
                            </div>
                        </el-form> -->
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
                                                <el-input v-model="craft.name"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-form>
                                    <div style="margin: 20px auto;width:65%">
                                        <el-button
                                            size="small"
                                            @click="addTab(editableTabsValue)"
                                        >
                                            新建子标题
                                        </el-button>
                                    </div>
                                    <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" >
                                        <el-tab-pane
                                            v-for="(item, index) in craftTabs"
                                            :label="item.title"
                                            :name="item.name"
                                            :key="item.index"
                                        >
                                        <el-button
                                            size="small"
                                            @click="add('upload', '123')"
                                        >
                                            新增图片
                                        </el-button>
                                            <ul>
                                                <li :is="item.component" :key='item.index' :text="item.text" v-for="item in items"></li>
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
        <!-- <div id="picDiv">
            <t8t-gallery ref="gallery"
                :data="dialogImageUrl"
                v-model="dialogVisible"></t8t-gallery>
        </div> -->
    </div>
</template>

<script>
import Cookie from "js-cookie";
import Server from "src/config/server.js";
import axios from "src/utils/axios.js";
import commonApi from "src/services/commonApi/commonApi.js";
import Upload from './upload.vue'
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
            items: [],
            editableTabsValue: '2',
            craftTabs: [],
            tabIndex: 2,
            isDialogShow: true,
            craft: {
                name: ""
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
            scope: {
                row: {}
            },

        };
    },
    props: {
    },
    methods: {
        changeRadio() {},
        handleTabsEdit() {

        },
        addTab(targetName) {
            console.log(Upload);
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
                })
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
            this.items.push({
                'component': component,
                'text': text,
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


</style>
