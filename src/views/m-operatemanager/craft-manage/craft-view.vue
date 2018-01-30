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
                                <el-tab-pane label="工艺展示"
                                    name="changeContent">
                                    <el-form class="dialog2-form-container"
                                        :model="formData"
                                        ref="formRef"
                                        :rules="formRules"
                                        label-position="right"
                                        label-width="100px">
                                        <div class="dialog2-form-item-container">
                                            <el-form-item label="工艺名称：">
                                                <el-input v-model="craft.name"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-form>
                                    <div style="margin: 20px auto;width:65%">
                                        <el-button
                                            size="small"
                                            @click="editTab(editableTabsValue)"
                                        >
                                            继续上传
                                        </el-button>
                                    </div>
                                    <el-tabs v-model="editableTabsValue" type="card" >
                                        <el-tab-pane
                                            v-for="(item, index) in craftTabs"
                                            :label="item.title"
                                            :name="item.name"
                                            :key="item.index"
                                        >
                                        <!-- <upload /> -->
                                            {{item.content}}
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
        editTab(val) {

        },

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
