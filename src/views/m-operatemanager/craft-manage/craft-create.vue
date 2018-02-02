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
                                                @click="add(key)"
                                                class="add-pic-btn"
                                            >
                                                新增图片
                                            </el-button>

                                            <upload @blur="getBlur" @delete="deleteUploadPic" :key="index1" :index="index1" :item="item1" v-for="(item1,index1) in value"></upload>

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
        addTab(targetName) {
            let newTabName = ++this.tabIndex + '';
            if (Object.keys(this.craftTabs).length > 14) {
                return '子标题数不能超过15个'
            }else {
                this.$prompt('请输入子标题名称','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValidator: (value) => {
                        let reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,15}$/g;
                        if (!reg.test(value)) {
                            return '请输入正确子标题(数字，字母，中文),不超过15字'
                        }
                        if (value === null) {
                            return '子标题不能为空'
                        }
                    },
                    inputErrorMessage: '请输入正确子标题名，不超过15字'
                }).then(({value}) => {
                    this.$set(this.craftTabs,value,[]);
                    // this.technologyInfo.technologyInfoMaps[value] = [];
                    // this.$set(this.technologyInfo.technologyInfoMaps,value,[]);
                    this.editableTabsValue = value;
                })
            }
        },
        removeTab(targetName) {
            let activeName = this.editableTabsValue;
            this.editableTabsValue = activeName;
            this.$delete(this.craftTabs,targetName);
        },
        add(title) {
            if (this.craftTabs[title].length > 10) {
                this.$message.error('图片不能超过10张')
            }else {
                this.craftTabs[title].push({
                    detailDescribe: '',
                    imageUrl: '',
                    detailTitle: title
                })
            }
            console.log(this.craftTabs);
        },
        getBlur(index,title) {
            let des = this.craftTabs[title][index].detailDescribe;
            if (des.length > 300 || des.length < 15) {
                this.$message.error('图片描述为15-300字');
            }

        },
        validateRemark(item,index) {
            if (item.imageUrl === '') {
                this.$message.error('子标题:' + item.detailTitle + '下有图片未添加');
                return false;
            }else if (item.detailDescribe.length > 300 || item.detailDescribe.length < 15) {
                this.$message.error('子标题' + item.detailTitle + '下有描述应为15-300字');
                return false;
            }else {
                return true;
            }
        },
        deleteUploadPic(index,title) {
            this.$delete(this.craftTabs[title],index);
        },
        SubmitBtn() {
            let args = this.craftTabs;
console.log(args)

            if (this.technologyInfo.technologyName == '') {
                this.$message.error('请输入工艺标题');
            }else {
                let pass = true;
                for (const key in args) {
                    if (args.hasOwnProperty(key)) {
                        const element = args[key];
                        if (element.length === 0) {
                            this.$message.error('子标题' + key + '没有图片');
                            pass = false;
                        }
                        element.forEach((item,index) => {
                            if (!this.validateRemark(item,index)) {
                                pass = false;
                            }
                        });
                    }
                }
                if (pass) {
                    this.technologyInfo['technologyInfoMaps'] = this.craftTabs;
                    let technologyArgs = {technologyInfo: this.technologyInfo} ;
console.log(technologyArgs);
                    this.$http.fetch(this.createPath,technologyArgs).then( res => {
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
