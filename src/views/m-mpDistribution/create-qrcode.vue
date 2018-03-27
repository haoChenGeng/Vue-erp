<template>
    <div>
        <t8t-breadcrumb :breadcrumbData="breadcrumbData"></t8t-breadcrumb>
        <div class="g-main-container">

            <!-- 树 -->
            <!-- <t8t-tree></t8t-tree> -->

            <div class="g-main-container-column">
                <!-- 工具条 -->
                <t8t-toolbar @channel-qrcode="createChannelCode"
                    @member-qrcode="createMemberCode"></t8t-toolbar>

                <!-- table -->
                <t8t-table ref="list-view"
                    :columns="tableColumns"
                    :tableCommonData="tableCommonData"
                    :path="getHistoryPath"
                    :selectCol="false"
                    :radioCol="true"
                    :args="historyArgs">
                    <template scope="scope"
                        slot="qrImgUrl">
                        <a class="view-code"
                            @click="viewCode(scope.row)">查看</a>
                        <a class="download-code"
                            :dataUrl="getFull(scope.row.qrImgUrl)"
                            @click="downloadImg(scope.row.qrImgUrl)">下载</a>
                    </template>
                </t8t-table>
            </div>
        </div>
        <el-dialog title="生成渠道分销二维码"
            ref="channelCodeDialog"
            v-model="channelVisible"
            @close="closeDialog">
            <el-form ref="channelForm"
                :model="channelForm"
                :rules="channelRules"
                class="create-codeForm">
                <p>第一步：输入渠道名称</p>
                <el-form-item class="channelName"
                    prop="site">
                    <el-input type="text"
                        v-model="channelForm.site"
                        placeholder="例如：雅豪轩201工地"
                        auto-complete="off"
                        class="channel-input">
                    </el-input>
                </el-form-item>
                <p>第二部：选择扫码后进入的页面</p>
                <el-form-item prop="location">
                    <el-cascader :options="locationOptions"
                        v-model="channelForm.location"
                        @change="handleChange"
                        @active-item-change="activeChange"
                        @blur="handleBlur">
                    </el-cascader>
                </el-form-item>
                <el-button type="primary"
                    :disabled="channelSubmit"
                    @click="submitChannelCode">
                    生成码
                </el-button>
            </el-form>
        </el-dialog>
        <el-dialog ref="memberCodeDialog"
            @close="closeDialog"
            v-model="memberVisible"
            title="生成成员分销二维码">
            <el-form ref="memberForm"
                :model="memberForm"
                :rules="memberRules"
                class="create-codeForm">
                <p>第一步：选择要分销的人员</p>
                <el-form-item class="channelName"
                    prop="member">
                    <el-cascader :options="memberOptions"
                        v-model="memberForm.member"
                        @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <p>第二部：选择扫码后进入的页面</p>
                <el-form-item prop="location">
                    <el-cascader :options="locationOptions"
                        v-model="memberForm.location"
                        @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-button type="primary"
                    :disabled="memberSubmit"
                    @click="submitMemberCode('memberForm')">
                    生成码
                </el-button>
            </el-form>
        </el-dialog>
        <el-dialog v-model="viewCodeVisible"
            size="small"
            @close="closeViewCode">
            <img width="100%"
                :src="imageUrl"
                alt="小程序二维码">
        </el-dialog>
    </div>
</template>

<script>
// import Service from 'src/services/craftmanager/Service.js'
import Utils from 'src/utils/Utils.js'
import Cookie from 'js-cookie'
// import Download from 'src/utils/download.js'
export default {
    name: 'crate-qrcode',
    components: {},
    data() {
        let validateSite = (rule, value, callback) => {
            if (value.trim() === '') {
                callback(new Error('请输入渠道名称'))
            } else {
                let reg = /^[A-Za-z\u4e00-\u9fa5\d]{1,50}$/g
                if (!reg.test(value.trim())) {
                    callback(new Error('请输入正确渠道名称(数字中英文)'))
                } else if (!value.trim().length > 50) {
                    callback(new Error('渠道名称不能超过50个字'))
                }
                callback()
            }
        }
        let validateLocation = (rule, value, callback) => {
            // console.log(value)
            if (!value.length) {
                callback(new Error('请选择扫码后进入的页面'))
            } else {
                callback()
            }
        }
        let validateMember = (rule, value, callback) => {
            if (!value.length) {
                callback(new Error('请选择要分销的人员'))
            } else {
                callback()
            }
        }
        return {
            companyId: Cookie.get('t8t-tc-comid'),
            companyName: Cookie.get('t8t-tc-comname'),
            getHistoryPath: 'dcs/qrcode/getCodeList',
            getMemberPath: 'ppm/usergroup/list',
            createCodePath: 'dcs/qrcode/saveCodeAndCreate',
            getCasePath: 'ppm/syncScene/selectFixsiteId',
            memberSubmit: false,
            channelSubmit: false,
            imageUrl: '',
            // urlReg: /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)\/pic\//i,
            urlImg: 'http://pic.to8to.com/',
            historyArgs: {
                search: {
                    companyId: Cookie.get('t8t-tc-comid'),
                },
            },
            channelForm: {
                site: '',
                location: [],
            },
            channelRules: {
                site: [{ validator: validateSite, trigger: 'blur' }],
                location: [{ validator: validateLocation, trigger: 'blur' }],
            },
            memberForm: {
                member: [],
                location: [],
            },
            memberRules: {
                member: [{ validator: validateMember, trigger: 'blur' }],
                location: [{ validator: validateLocation, trigger: 'blur' }],
            },
            channelVisible: false,
            memberVisible: false,
            viewCodeVisible: false,
            tableColumns: [
                {
                    prop: 'createTime',
                    label: '创建时间',
                    formatter: 'dateParser',
                },
                {
                    prop: 'updateTime',
                    label: '修改时间',
                    formatter: 'dateParser',
                },
                {
                    prop: 'channelName',
                    label: '渠道',
                },
                {
                    prop: 'pageName',
                    label: '页面',
                },
                { prop: 'qrImgUrl', label: '二维码' },
            ],
            tableCommonData: {
                // bizStatusMap: [
                //     { text: '全部', value: null },
                //     { text: '审核中', value: 0 },
                //     { text: '审核通过', value: 1 },
                //     { text: '审核不通过', value: 2 },
                // ],
            },
            locationOptions: [
                {
                    value: '1',
                    label: '主页',
                },
            ],
            memberOptions: [],
            selectedRows: [],
        }
    },
    computed() {},
    created() {
        this.getMemberList()
        this.getCase()
        this.getConstructionList()
    },
    activated() {
        // this.$refs['list-view'].getTableInstance().reloadTable()
    },
    methods: {
        getFull(url) {
            return this.urlImg + url
        },
        getCase() {
            let args = {
                uid: this.companyId,
            }
            let arr = []
            this.$http.fetch(this.getCasePath, args).then(res => {
                if (res.data.status === 200) {
                    let data = res.data.result
                    data.map(item => {
                        let caseItem = {
                            value: item.gid + '!' + item.caseName,
                            label: item.caseName,
                        }
                        arr.push(caseItem)
                    })
                    // console.log(arr)
                    this.locationOptions.push({
                        value: 3,
                        label: '装修案例',
                        children: arr,
                    })
                } else {
                    this.$message.error(res.data.error)
                }
            })
        },
        getMemberList() {
            let designGroupArgs = {
                companyId: ~~this.companyId,
                groupType: 1,
            }

            let arr = []
            this.$http.fetch(this.getMemberPath, designGroupArgs).then(res => {
                if (res.data.status === 200) {
                    let data = res.data.result
                    data.map(item => {
                        let memberItem = {
                            value:
                                item.tid +
                                '!' +
                                item.jobsName +
                                '/' +
                                item.tname,
                            label: item.jobsName + '/' + item.tname,
                        }
                        arr.push(memberItem)
                    })
                    this.locationOptions.push({
                        value: 2,
                        label: '成员主页',
                        children: [
                            {
                                value: 3 - 1,
                                label: '设计团队',
                                children: arr,
                            },
                            {
                                value: 3 - 2,
                                label: '施工团队',
                                disabled: true,
                            },
                        ],
                    })
                    this.memberOptions.push({
                        value: 3,
                        label: '设计团队',
                        children: arr,
                    })
                } else {
                    this.$message.error(res.data.error)
                }
            })
        },
        getConstructionList() {
            let constructionArgs = {
                companyId: ~~this.companyId,
                groupType: 2,
            }
            let consArr = []
            this.$http.fetch(this.getMemberPath, constructionArgs).then(res => {
                if (res.data.status === 200) {
                    console.log('success')
                    let data = res.data.result
                    data.map(item => {
                        let memberItem = {
                            value:
                                item.tid +
                                '!' +
                                item.jobsName +
                                '/' +
                                item.tname,
                            label: item.jobsName + '/' + item.tname,
                        }
                        consArr.push(memberItem)
                    })
                    this.memberOptions.push({
                        value: 2,
                        label: '施工团队',
                        children: consArr,
                    })
                }
            })
        },
        createChannelCode() {
            this.channelVisible = true
        },
        createMemberCode() {
            this.memberVisible = true
        },
        handleChange(val) {
            console.log(val)
        },
        submitChannelCode() {
            this.$refs['channelForm'].validate(valid => {
                if (valid) {
                    this.channelSubmit = true
                    let qrId = 0
                    let name = ''
                    let locationType = this.channelForm.location[0]
                    let selectDesign = this.channelForm.location[2]
                    let selectCase = this.channelForm.location[1]
                    if (locationType == 1) {
                        qrId = this.companyId
                    } else if (locationType == 2) {
                        qrId = selectDesign.split('!')[0]
                    } else {
                        qrId = selectCase.split('!')[0]
                    }
                    if (locationType == 2) {
                        name = selectDesign.split('!')[1]
                    } else if (locationType == 3) {
                        name = selectCase.split('!')[1]
                    }
                    // console.log(this.channelForm)
                    let args = {
                        dto: {
                            qrType: locationType, // 进入页面类型  1、主页 2、团队成员 3、案例
                            qrTypeId: qrId, //进入页面类型ID
                            channelType: 1, // 生成二维码类型 1、渠道二维码    2、施工团队二维码   3、设计团队二维码
                            companyName: this.companyName,
                            companyId: this.companyId,
                        },
                        dto1: {
                            threeChannel: 1, // 生成二维码类型 1、生成渠道二维码 2、生成成员二维码
                            fourChannel: this.channelForm.site, // 生成渠道二维码，填写的位置信息
                            qrCodeTypeDTO: {
                                type: locationType, //  进入页面类型 1、主页 2、团队成员 3、案例
                                yid: 0, // 项目id,没有传0
                                scene_id:
                                    locationType == 3
                                        ? selectCase.split('!')[0]
                                        : 0, // 案例id
                                tid:
                                    locationType == 2
                                        ? selectDesign.split('!')[0]
                                        : 0, // 设计师id
                                roleName: name, // 设计师职位+名字
                            },
                        },
                    }
                    this.$http
                        .fetch(this.createCodePath, args)
                        .then(res => {
                            // console.log(res.data.result.result, res.data.status)
                            this.channelSubmit = false
                            if (
                                res.data.status === 200 &&
                                res.data.result.result === 1
                            ) {
                                let url = res.data.result.url
                                this.downloadImg(url)
                                this.$message.success('创建渠道二维码成功')
                                this.$refs.channelForm.resetFields()
                                this.$refs.channelCodeDialog.close()
                                this.$refs['list-view'].reloadTable()
                            } else {
                                this.$message.error(res.data.result.error)
                            }
                        })
                        .catch(err => {
                            this.$message.error(err)
                        })
                } else {
                    console.log('validate error')
                    return false
                }
            })
        },
        submitMemberCode() {
            // console.log(this.memberForm)
            this.$refs['memberForm'].validate(valid => {
                if (valid) {
                    this.memberSubmit = true
                    let qrId = 0
                    let name = ''
                    let locationType = this.memberForm.location[0]
                    let selectDesign = this.memberForm.location[2]
                    let selectCase = this.memberForm.location[1]
                    if (locationType == 1) {
                        qrId = this.companyId
                    } else if (locationType == 2) {
                        qrId = selectDesign.split('!')[0]
                    } else {
                        qrId = selectCase.split('!')[0]
                    }
                    if (locationType == 2) {
                        name = selectDesign.split('!')[1]
                    } else if (locationType == 3) {
                        name = selectCase.split('!')[1]
                    }
                    let args = {
                        dto: {
                            qrType: locationType, // 进入页面类型  1、主页 2、团队成员 3、案例
                            qrTypeId: qrId, //进入页面类型ID
                            channelType: this.memberForm.member[0], // 生成二维码类型 1、渠道二维码    2、施工团队二维码   3、设计团队二维码
                            companyName: this.companyName,
                            companyId: this.companyId,
                            width: 0,
                        },
                        dto1: {
                            threeChannel: 2, // 生成二维码类型 1、生成渠道二维码 2、生成成员二维码
                            fourChannel: this.memberForm.member[1].split(
                                '!'
                            )[0], // 生成成员二维码，填写的成员id
                            qrCodeTypeDTO: {
                                type: locationType, //  进入页面类型 1、主页 2、团队成员 3、案例
                                yid: 0, // 项目id,没有传0
                                scene_id:
                                    locationType == 3
                                        ? selectCase.split('!')[0]
                                        : 0, // 案例id
                                tid:
                                    locationType == 2
                                        ? selectDesign.split('!')[0]
                                        : 0,
                                roleName: name,
                            },
                        },
                    }
                    this.$http
                        .fetch(this.createCodePath, args)
                        .then(res => {
                            // console.log(res.data.status, res.data.result.result)
                            this.memberSubmit = false
                            if (
                                res.data.status === 200 &&
                                res.data.result.result === 1
                            ) {
                                // console.log('success')
                                let url = res.data.result.url
                                // debugger
                                this.downloadImg(url)
                                this.$message.success('创建成员二维码成功')
                                this.$refs.memberForm.resetFields()
                                this.$refs.memberCodeDialog.close()
                                this.$refs['list-view'].reloadTable()
                            } else {
                                this.$message.error(res.data.result.error)
                            }
                        })
                        .catch(err => {
                            this.$message.error(err)
                        })
                } else {
                    console.log('validate error')
                    return false
                }
            })
        },
        viewCode(row) {
            this.imageUrl = this.urlImg + row.qrImgUrl
            this.viewCodeVisible = true
            // console.log(this.imageUrl)
        },
        closeViewCode() {
            this.imageUrl = ''
            this.viewCodeVisible = false
            // console.log(this.imageUrl)
        },
        downloadImg(url) {
            // console.log(url)
            var $a = document.createElement('a')
            $a.setAttribute('href', this.urlImg + url)
            $a.setAttribute('download', '')
            // console.log($a)
            var evObj = document.createEvent('MouseEvents')
            evObj.initMouseEvent(
                'click',
                true,
                true,
                window,
                0,
                0,
                0,
                0,
                0,
                false,
                false,
                true,
                false,
                0,
                null
            )
            $a.dispatchEvent(evObj)
        },
    },
}
</script>

<style lang="css" scoped>
.create-codeForm {
    width: 70%;
    text-align: left;
    margin: auto;
}
.el-cascader {
    width: 100%;
}
.el-button--primary {
    display: block;
    margin: auto;
}
.view-code {
    color: blue;
}
.view-code:hover {
    cursor: pointer;
}
.download-code {
    color: blue;
    text-decoration: none;
}
.download-code:hover {
    cursor: pointer;
}
</style>
