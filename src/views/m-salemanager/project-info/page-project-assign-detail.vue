<template>
    <div class="t8t-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog"
            v-model="isDialogShow"
            size="full"
            class="t8t-full-dialog2 dialog-new">
            <div class="project-detail-dialog">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar class="t8t-dark"
                            @EDIT-SUBMIT="submit"
                            @PRINT="print"
                            @CANCEL="cancel"
                            @PREVIEW="preview"
                            :disabledSymbols="disabledSymbols">
                        </t8t-toolbar>
                    </div>
                </div>
                <!-- 表单区 -->
                <div class="dialog2-main-container full-dialog-form-container container-center">
                    <el-tabs v-model="mainActiveTab"
                        class="tab-zone">
                        <el-tab-pane :label="tab.label"
                            :name="tab.name"
                            v-for="(tab,key) in tabList"
                            :key="key">
                            <project-base-form :tab="mainActiveTab"
                                :id="id"
                                :ref="tab.name"
                                :tabType='tab.name'
                                @handle-preview="handlePictureCardPreview"
                                :dataOption="dataSource[tab.name]"
                                :lock="formLoading">
                            </project-base-form>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-dialog>
        <el-dialog v-model="dialogVisible"
            size="large">
            <img width="100%"
                :src="dialogImageUrl"
                alt="">
        </el-dialog>
    </div>
</template>

<script>
import projectApi from 'src/services/salemanager/project/project.js'
import projectBaseForm from './project-base-form.vue'
import Utils from 'src/utils/Utils.js'
import commonApi from 'src/services/commonApi/commonApi.js'
import Cookie from 'js-cookie'
import DateUtils from 'src/utils/DateUtils.js'
export default {
    name: 't8t-dt-view',
    components: {
        projectBaseForm,
    },
    data() {
        return {
            tabList: [
                //页签获取及配置
                {
                    label: '基本信息',
                    name: 'assignForm',
                    method: 'decorationOrderFindOrderDetailSheetById',
                    args: { id: '@id' },
                },
                {
                    label: '土巴兔客服反馈',
                    name: 'customForm',
                    method: 'decorationOrderFindCrmRecordById',
                    args: { id: '@id' },
                },
                {
                    label: '销售派单信息',
                    name: 'sellForm',
                    method: 'decorationOrderFindSaleAssignById',
                    args: { id: '@id' },
                },
            ],
            //页签数据源
            dataSource: {
                assignForm: {},
                customForm: {},
                sellForm: {},
            },
            isDialogShow: true,
            goBackRoute: '/tuchat-sale-manage/project-assign-list',
            mainActiveTab: 'assignForm',
            id: null,
            projectId: null,
            formLoading: false,
            dialogVisible: false,
            dialogImageUrl: null,
        }
    },
    watch: {
        mainActiveTab(val) {
            this.setForm(val)
        },
    },
    created() {
        this.id = this.$route.query.id
        setTimeout(this.setForm('assignForm'), 1000)
    },
    methods: {
        // 关闭弹窗
        closeDialog() {
            this.$router.push({
                path: this.goBackRoute,
            })
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        getDetail(mode, cb) {
            let _mode = this.tabList.find(item => item.name === mode)
            let _args = JSON.parse(
                JSON.stringify(_mode).replace(/\@id/, this.id)
            ).args
            if (_mode.method && projectApi[_mode.method]) {
                projectApi[_mode.method](_args)
                    .then(res => {
                        if (res.data.status != 200) {
                            this.$message.error(`${_mode.label}获取失败`)
                            res.data.result = null
                        }
                        cb(res.data.result || {})
                    })
                    .catch(error => {
                        this.$message.error(`${_mode.label}获取失败`)
                        cb({})
                    })
            } else {
                cb({})
            }
        },
        getPhoneInfo() {
            let _dataSource = this.dataSource.assignForm
            if (
                _dataSource.fid &&
                _dataSource.sourceProjectId
            ) {
                const _args = {
                    fid: +_dataSource.fid,
                    uid: +Cookie.get('t8t-tc-uid'),
                    yid: +_dataSource.sourceProjectId,
                }
                projectApi
                    .getCall(_args)
                    .then(res => {
                        let response = res.data
                        if (
                            response.status === 200 &&
                            response.result &&
                            response.result.code === 1
                        ) {
                            _dataSource.phone = response.result.msg || '暂不支持查看'
                            this.$nextTick(_ => {
                                this.dataSource.assignForm = { ..._dataSource }
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },
        setForm(val) {
            let _option = {}
            let _dataSource = this.dataSource[val]
            if (JSON.stringify(_dataSource) != '{}') return
            this.formLoading = true
            this.getDetail(val, res => {
                this.formLoading = false
                if (!res || JSON.stringify(res) == '{}') return
                switch (val) {
                    case 'assignForm':
                        res.phone = '暂不支持查看'
                        _option = {
                            tables: {
                                followRecord: res.decorationOrderRecordVOS,
                            },
                            ...res,
                        }
                        break
                    case 'customForm':
                        if (Array.isArray(res) && res.length > 0) {
                            _option = {
                                tables: {
                                    customRecord: res.map(item => ({
                                        feedbackType: item.feedbackType,
                                        feedbackTypeName: item.feedbackTypeName,
                                        feedbackStageName:
                                            item.feedbackStageName,
                                        feedbackContent: item.feedbackContent,
                                        createTime: item.createTime,
                                        createUserName: item.createUserName,
                                    })),
                                },
                            }
                        }
                        break
                    case 'sellForm':
                    if (JSON.stringify(res) != '{}') {
                        _option = {
                            tables: {
                                followPerson: Array.isArray(
                                    res.followPersonVOS
                                )
                                    ? res.followPersonVOS
                                    : [],
                                assignCompany: Array.isArray(
                                    res.assignCompanyVOS
                                )
                                    ? res.assignCompanyVOS
                                    : [],
                                assignRecord: Array.isArray(
                                    res.assignRecordVOS
                                )
                                    ? res.assignRecordVOS
                                    : [],
                            },
                        }
                    }
                    break
                }
                this.dataSource[val] = { ..._dataSource, ..._option }
                if (val === 'assignForm') this.getPhoneInfo()
            })
        },
    },
}
</script>

<style lang="css" scoped>

</style>

<style>
.full-dialog-form-container,
.container-center {
    padding-top: 40px;
}
.project-detail-dialog {
    overflow: auto;
}

.project-detail-dialog .container-center {
    min-height: 720px;
}

.project-detail-dialog .toolbar-container .el-button {
    padding: 0 12px;
    height: 26px;
    font-size: 12px;
    background-color: #1e3046;
    color: #d1dde9;
    border: 1px solid #09131d;
}

.project-detail-dialog .toolbar-container .el-button:hover {
    color: #1e3046;
    background-color: #d2deeb;
}

.project-detail-dialog .tab-zone {
    display: flex;
    flex: 1;
    flex-direction: column;
}

.project-detail-dialog .tab-zone .el-tabs__content,
.el-tab-pane {
    flex: 1;
    display: flex;
    flex-direction: column;
}
</style>
