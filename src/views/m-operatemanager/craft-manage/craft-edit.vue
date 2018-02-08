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
                            @EDIT-SUBMIT="SubmitBtn"
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
                                    v-model="technologyInfo">
                                    <el-form class="dialog2-form-container"
                                        ref="formRef"
                                        :rules="formRules"
                                        label-position="right"
                                        label-width="100px">
                                        <div class="dialog2-form-item-container">
                                            <el-form-item label="工艺标题：">
                                                <el-input v-model.trim="technologyInfo.technologyName"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-form>
                                    <div class="create-title">
                                        <el-button size="small"
                                            @click="addTab(editableTabsValue)">
                                            新建子标题
                                        </el-button>
                                    </div>
                                    <el-tabs type="card"
                                        v-model="editableTabsValue"
                                        closable
                                        @tab-remove="removeTab">
                                        <el-tab-pane v-for="(item,index) in craftTabs"
                                            :label="item.title"
                                            :name="item.name"
                                            :key="index"
                                            class="create-title-tab">
                                            <el-button size="small"
                                                @click="add(item.title,index)"
                                                class="add-pic-btn">
                                                新增图片
                                            </el-button>
                                            <upload @blur="getBlur"
                                                @delete="deleteUpload"
                                                @deletePic="deleteUploadPic"
                                                :tabIndex="index"
                                                :key="index1"
                                                :fileList2="getPicUrl(item1.imageUrl,item1.id)"
                                                :index="index1"
                                                :item="item1"
                                                class="edit-upload"
                                                v-for="(item1,index1) in item.content"
                                            >
                                            </upload>
                                            <div style="margin-top:140px;visibility:hidden" id="msg_end"></div>
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
import Cookie from 'js-cookie'
import Utils from 'src/utils/Utils.js'
import Upload from './upload.vue'
import Service from 'src/services/craftmanager/Service.js'
export default {
    name: 'craft-check',
    created() {
        this.initPrams()
        this.getTechnologyInfo()
    },
    mounted() {
        // console.log(222);
    },
    components: {
        Upload,
    },
    data() {
        return {
            getDetailUrl: 'dcs/TechnologyInfo/findById',
            updatePath: 'dcs/TechnologyInfo/updateTechnologyInfoV2',
            uploadURL: Utils.getPicUploadURL(),
            editableTabsValue: '0',
            craftTabs: [],
            isDialogShow: true,
            editUploadVisible: true,
            technologyInfo: {
                technologyName: '',
                technologyInfoMaps: [],
            },
            isPass: false,
            activeTabName: 'changeContent',
            formData: {},
            formRules: {},
            tableList: {
                data08: {},
            },
            columns: [
                { props: 'moduleName', label: '模块名称' },
                { props: 'url', label: '图片' },
                { props: 'des', label: '描述' },
            ],
        }
    },
    props: {},
    computed: {
        tabIndex: function() {
            if (this.craftTabs.length) {
                return this.craftTabs.length
            }else {
                return 0
            }
        }
    },
    methods: {
        getPicUrl(url, id) {
            // console.log(url, id)
            return [{ name: id, url: Utils.getFullURL(url) }]
        },
        addTab(targetName) {
            let newTabName = ++this.tabIndex + '';
            let names = this.craftTabs.map((item,index) => { return item.title });
// console.log(names);
            if (this.craftTabs.length > 14) {
                this.$message.error('子标题数不能超过15个')
            }else {
                this.$prompt('请输入子标题名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValidator: value => {
                        let reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,15}$/g
                        if (!reg.test(value)) {
                            return '请输入正确子标题(数字，字母，中文),不超过15字'
                        }
                        if (value === null) {
                            return '子标题不能为空'
                        }
                    },
                    inputErrorMessage: '请输入正确子标题名，不超过15字',
                }).then(({ value }) => {
                    if (names.indexOf(value) !== -1) {
                        this.$message.error('已存在相同名字子标题');
                    }else {
                        this.craftTabs.push({
                            title: value,
                            name: newTabName,
                            content: []
                        })
                        this.editableTabsValue = newTabName;
                    }
// console.log(this.editableTabsValue);
                })
            }
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
// console.log(this.craftTabs);
        },
        add(title,index) {
            if (this.craftTabs[index].content.length > 9) {
                this.$message.error('图片不能超过10张')
            } else {
                this.craftTabs[index].content.push({
                    detailDescribe: '',
                    imageUrl: '',
                    detailTitle: title,
                })
                document.getElementById('msg_end').scrollIntoView(true);
            }
            // console.log(this.craftTabs)
        },
        getBlur(index, title) {
            let des = this.craftTabs.filter((item,index) => {
                return item.title === title
            })
            if (des[0].content[index].detailDescribe.length > 300 || des[0].content[index].detailDescribe.length < 15) {
                this.$message.error('图片描述为15-300字');
            }
        },
        deleteUpload(index,title,tabIndex) {
            this.$delete(this.craftTabs[tabIndex].content,index);
        },
        deleteUploadPic(index,title,tabIndex) {
            this.craftTabs[tabIndex].content[index].imageUrl = '';
        },
        validateRemark(item, index) {
            if (item.imageUrl === '') {
                this.$message.error(
                    '子标题:' + item.detailTitle + '下有图片未添加'
                )
                return false
            } else if (
                item.detailDescribe.length > 300 ||
                item.detailDescribe.length < 15
            ) {
                this.$message.error(
                    '子标题' + item.detailTitle + '下有描述应为15-300字'
                )
                return false
            } else {
                return true
            }
        },
        SubmitBtn() {
            let args = this.craftTabs;
            let reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,5}$/g;
            if (this.technologyInfo.technologyName === null) {
                this.$message.error('请输入工艺标题')
            } else if (!reg.test(this.technologyInfo.technologyName)) {
                this.$message.error('请输入正确工艺标题(数字，字母，中文)，不超过5个字')
            }else if (args.length === 0) {
                this.$message.error('请创建子标题');
            }else {
                let pass = true
                for (let i = 0; i < args.length; i++) {
                    const element = args[i];
                    if (element.content.length === 0) {
                        this.$message.error('子标题' + element.title + '没有图片');
                        pass = false;
                    }else if (element.content.length > 10) {
                        this.$message.error('子标题' + element.title + '图片超过10个')
                        pass = false;
                    }else {
                        element.content.forEach((item,index) => {
                            if (!this.validateRemark(item,index)) {
                                pass = false;
                            }
                        });
                    }
                }
                if (pass) {
                    for (let index = 0; index < args.length; index++) {
                        const element = args[index];
                        this.technologyInfo['technologyInfoMaps'].push(element.content);
                    }
                    let technologyArgs = {technologyInfo: this.technologyInfo,id: this.id} ;
// console.log(technologyArgs);
                    this.$http.fetch(this.updatePath,technologyArgs).then( res => {
                        if (res.data.status === 200) {
                            // debugger
                            this.$message.success('编辑工艺成功');
                            this.$router.push({
                                path: '/tuchat-craft-manage/craft-manage'
                            })
                        }else {
                            this.$message.error('编辑失败:'+ res.data.error || res.data.result)
                        }
                    })
                }
            }
        },
        closeDialog() {
            this.$router.push({
                path: '/tuchat-craft-manage/craft-manage',
            })
        },
        initPrams: function() {
            //公司id
            this.id = this.$route.query.id
        },
        getTechnologyInfo() {
            let args = {
                id: this.id,
            }
            this.$http
                .fetch(this.getDetailUrl, args)
                .then(res => {
                    if (res.data.status === 200) {
                        let data = res.data.result.technologyInfoMaps;
                        data.forEach((item,index) => {
                            this.craftTabs.push({
                                title: item[0].detailTitle,
                                name: index,
                                content: item
                            })
                        });
// console.log(this.craftTabs);
                        // this.editableTabsValue = this.craftTabs[0].name;
                        this.technologyInfo.technologyName = res.data.result.technologyName;
                    } else {
                        this.$message.error(res.data.result || res.data.error)
                    }
                })
                .catch(error => {
                    this.$message.error(error)
                })
        },
        closeDialog() {
            this.$router.push({
                path: '/tuchat-craft-manage/craft-manage',
            })
        },
    },
}
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
    width: 1220px;
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
.el-upload-list--picture-card .el-upload-list__item {
    margin: 0;
}
.edit-upload {
    /* margin-left: 40px; */
}

.edit-upload .el-upload-list--picture-card li.el-upload-list__item {
    height: 138px;
    margin-right: 0;
}
/* .upload-pic .el-upload-list--picture-card .el-upload-list__item {
    height: 138px;
} */
.upload-pic .is-success.el-upload-list__item {
    height: 138px;
}
</style>
