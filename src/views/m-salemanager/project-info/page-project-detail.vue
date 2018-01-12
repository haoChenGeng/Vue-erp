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
                    name: 'baseForm',
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
                {
                    label: '邀约信息',
                    name: 'inviteForm',
                    method: 'appointQuery',
                    args: { search: { projectId: '@id' } },
                },
                {
                    label: '量房信息',
                    name: 'measureForm',
                    method: 'measureQueryMeasureRecordPage',
                    args: { projectId: '@id' },
                },
                {
                    label: '签约信息',
                    name: 'contractForm',
                    method: 'contractPreview',
                    args: { projectId: '@id' },
                }, //crazyking
                {
                    label: '财务信息',
                    name: 'financeForm',
                    method: 'orderGetProjectMoneyInfo',
                    args: { projectId: '@id' },
                }, //amos
                {
                    label: '工程派单信息',
                    name: 'projectForm',
                    method: 'decorationOrderFindProjectAssignById',
                    args: { id: '@id' },
                },
                {
                    label: '工程验收信息',
                    name: 'platCheckForm',
                    method: 'platCheckQueryPage',
                    args: { search: { projectId: '@id' }, page: 1, size: 100 },
                },
                {
                    label: '辅材下单信息',
                    name: 'goodsDemandForm',
                    method: 'goodsQueryPage',
                    args: { search: { projectId: '@id' }, page: 1, size: 200 },
                }, //dana
            ],
            //页签数据源
            dataSource: {
                baseForm: {},
                customForm: {},
                sellForm: {},
                inviteForm: {},
                measureForm: {},
                contractForm: {},
                financeForm: {},
                projectForm: {},
                platCheckForm: {},
                goodsDemandForm: {},
            },
            isDialogShow: true,
            goBackRoute: '/tuchat-sale-manage/page-project-list',
            mainActiveTab: 'baseForm',
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

        let goBackRoute = this.$route.query.goBackRoute
        if(goBackRoute){
            this.goBackRoute = goBackRoute
        }
        setTimeout(this.setForm('baseForm'), 2000)
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
                        if (
                            res.data.status != 200
                        ) {
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
        setForm(val) {
            let _option = {}
            let _dataSource = this.dataSource[val]
            if (JSON.stringify(_dataSource) != '{}') return
            this.formLoading = true
            this.getDetail(val, res => {
                this.formLoading = false
                if (!res || JSON.stringify(res) == '{}') return
                switch (val) {
                    case 'baseForm':
                        _option = {
                            tables: {
                                followRecord: res.decorationOrderRecordVOS,
                            },
                            ...res,
                        }
                        break
                    case 'measureForm':
                        let _picList = []
                        if (Array.isArray(res.savePictureAddrList)) {
                            res.savePictureAddrList.forEach(item => {
                                if (item)
                                    _picList.push({
                                        src: Utils.getFullURL(item),
                                    })
                            })
                        }
                        _option = { fileList: _picList, ...res }
                        break
                    case 'sellForm':
                        // 前置
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
                    case 'contractForm':
                        _option = {
                            pdf: Utils.getPreviewURL(res)
                           }
                        break
                    case 'inviteForm':
                        _option = {
                            tables: {
                                inviteInfo: Array.isArray(res) ? res : [],
                            },
                        }
                        break
                    case 'projectForm':
                        _option = {
                            tables: {
                                followPerson: Array.isArray(res.followPersonVOS)
                                    ? res.followPersonVOS
                                    : [],
                                assignRecord: Array.isArray(res.assignRecordVOS)
                                    ? res.assignRecordVOS
                                    : [],
                            },
                        }
                        break
                    case 'platCheckForm':
                        _option = {
                            tables: {
                                platCheckList: Array.isArray(res.rows)
                                    ? res.rows.map(item => ({
                                          ...item,
                                          ...{
                                              expectTime:
                                                  DateUtils(
                                                      1000 *
                                                          item.expectStartTime,
                                                      'yyyy-mm-dd HH:MM:ss'
                                                  ) +
                                                  '-' +
                                                  DateUtils(
                                                      1000 *
                                                          item.expectCheckTime,
                                                      'yyyy-mm-dd HH:MM:ss'
                                                  ),
                                              checkTime:
                                                  DateUtils(
                                                      1000 *
                                                          item.checkStartTime,
                                                      'yyyy-mm-dd HH:MM:ss'
                                                  ) +
                                                  '-' +
                                                  DateUtils(
                                                      1000 * item.checkTime,
                                                      'yyyy-mm-dd HH:MM:ss'
                                                  ),
                                          },
                                      }))
                                    : [],
                            },
                        }
                        break
                    case 'goodsDemandForm':
                        if (Array.isArray(res.rows) && res.rows.length > 0) {
                            _option = {
                                tables: {
                                    goodsDemand: res.rows,
                                },
                            }
                        }
                        break
                    case 'financeForm':
                        let [_trustee, _nodeMoney, _xiaohao, _iscostName] = [
                            [],
                            [],
                            '',
                            '',
                        ]
                        if (res.trusteeInfo) {
                            Object.keys(res.trusteeInfo).forEach(item => {
                                _trustee.push({
                                    type: item,
                                    status: res.trusteeInfo[item].status,
                                    money: res.trusteeInfo[item].money,
                                })
                            })
                        }
                        if (res.nodeMoneyInfo) {
                            Object.keys(res.nodeMoneyInfo).forEach(item => {
                                _nodeMoney.push({
                                    type: item,
                                    status: res.nodeMoneyInfo[item].status,
                                    money: res.nodeMoneyInfo[item].money,
                                })
                            })
                        }
                        if (res.reFoundInfo) {
                            _xiaohao = res.reFoundInfo.xiaohao
                            _iscostName = res.reFoundInfo.iscostName
                        }
                        _option = {
                            tables: {
                                trusteeInfo: _trustee,
                                nodeMoneyInfo: _nodeMoney,
                            },
                            xiaohao:_xiaohao,
                            iscostName:_iscostName
                        }
                        break
                }
                this.dataSource[val] = { ..._dataSource, ..._option }
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
