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
                            @EDIT="editTab"
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
                                <el-tab-pane
                                    label="工艺展示"
                                    name="changeContent"
                                    v-model="technologyInfo"
                                >
                                    <el-form class="dialog2-form-container"
                                        :model="formData"
                                        ref="formRef"
                                        :rules="formRules"
                                        label-position="right"
                                        label-width="100px">
                                        <div class="dialog2-form-item-container">
                                            <el-form-item label="工艺名称：">
                                                <el-input v-model="technologyInfo.technologyName" :disabled="true"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-form>
                                    <!-- <div style="margin: 20px auto;width:1220px">
                                        <el-button
                                            size="small"
                                            @click="editTab"
                                        >
                                            继续上传
                                        </el-button>
                                    </div> -->
                                    <el-tabs type="card" >
                                        <el-tab-pane
                                            v-for="(value, key, index) in technologyInfo.technologyInfoMaps"
                                            :label="key"
                                            :name="index"
                                            :key="index"
                                            style="width:1220px;margin:auto;"
                                        >
                                        <!-- <upload /> -->
                                            <div class="craft-module" v-for="(item,index) in value" :key="item.id">
                                                <img
                                                    v-bind:src="item.imageUrl"
                                                    style="vertical-align:8px;width:138px;height:138px;cursor:pointer;"
                                                    @click="showPicture($event.target.src)">
                                                <el-input
                                                    type="textarea"
                                                    :rows="7"
                                                    placeholder="请输入内容"
                                                    :disabled="true"
                                                    v-model="item.detailDescribe"
                                                    class="pic-remark"
                                                    @blur="handleBlur"
                                                    @change="handleChange"
                                                >
                                                </el-input>
                                            </div>
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
import Server from "src/config/server.js";
import axios from "src/utils/axios.js";
import commonApi from "src/services/commonApi/commonApi.js";
import Upload from './upload.vue'
export default {
    name: "craft-check",
    created() {
        this.initPrams();
        this.getTechnologyInfo();
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
            technologyInfo: {},
            id: null,
            // editableTabsValue: '2',
            craftTabs: [],
            tabIndex: 2,
            isDialogShow: true,
            dialogVisible: false,
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
            dialogImageUrl: []
        };
    },
    props: {
    },
    methods: {
        changeRadio() {},
        handleTabsEdit() {

        },
        editTab() {
            this.$router.push({
                path: '/tuchat-craft-manage/craft-edit',
                query: {
                    id: this.id
                }
            })
        },
        editCraft() {
            this.$router.push({
                path: '/tuchat-craft-manage/craft-edit',
                query: {
                    id: this.id
                }
            })
        },
        getTechnologyInfo() {
            let args = {
                id: this.id
            }
            this.$http.fetch(this.getDetailUrl, args).then(res => {
                if (res.data.status === 200) {
                    console.log(res.data.result)
                    this.technologyInfo = res.data.result;
                }
            })
        },
        showPicture(url) {
            this.dialogVisible = true;

            this.dialogImageUrl = [
                { src: url }
            ]
        },
        initPrams: function () {
            //公司id
            this.id = this.$route.query.id
            console.log(this.id);
        },
        closeDialog() {
            this.$router.push({
                path: '/tuchat-craft-manage/craft-manage'
            })
        }
    },
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
.craft-module {
    margin-top: 20px;
}


</style>
