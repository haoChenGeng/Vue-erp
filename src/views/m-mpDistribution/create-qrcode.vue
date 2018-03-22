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
                        slot="path">
                        <a class="viewqrCode"
                            @click="viewCode(scope.row)">查看</a>
                        <a style="color:blue;"
                            :href="scope.row.qrImgUrl"
                            @click="downloadCode(scope.row)">下载</a>
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
            size="large"
            @close="closeViewCode">
            <img width="100%"
                :src="imageUrl"
                alt="">
        </el-dialog>
    </div>
</template>

<script>
// import Service from 'src/services/craftmanager/Service.js'
import Utils from 'src/utils/Utils.js'
import Cookie from 'js-cookie'
import Download from 'src/utils/download.js'
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
            historyArgs: {
                search: {
                    // companyId: Cookie.get('t8t-tc-comid'),
                    companyId: 0,
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
                    prop: 'channel',
                    label: '渠道',
                },
                {
                    prop: 'lacation',
                    label: '页面',
                },
                { prop: 'path', label: '二维码' },
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
    created() {
        this.getMemberList()
        this.getCase()
        this.getConstructionList()
    },
    activated() {
        // this.$refs['list-view'].getTableInstance().reloadTable()
    },
    methods: {
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
                        value: 2,
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
                        value: 1,
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
        handleChange(val) {},
        submitChannelCode() {
            this.channelSubmit = true
            this.$refs['channelForm'].validate(valid => {
                if (valid) {
                    let qrId = 0
                    let name = ''
                    if (this.channelForm.location[0] == 1) {
                        qrId = this.companyId
                    } else if (this.channelForm.location[0] == 2) {
                        qrId = this.channelForm.location[2].split('!')[0]
                    } else {
                        qrId = this.channelForm.location[1].split('!')[0]
                    }
                    if (this.channelForm.location[0] == 2) {
                        name = this.channelForm.location[2].split('!')[1]
                    } else if (this.channelForm.location[0] == 3) {
                        name = this.channelForm.location[1].split('!')[1]
                    }
                    console.log(this.channelForm)
                    let args = {
                        dto: {
                            qrType: this.channelForm.location[0], // 进入页面类型  1、主页 2、团队成员 3、案例
                            qrTypeId: qrId, //进入页面类型ID
                            channelType: 1, // 生成二维码类型 1、渠道二维码    2、施工团队二维码   3、设计团队二维码
                            companyName: this.companyName,
                            companyId: this.companyId,
                        },
                        dto1: {
                            threeChannel: 1, // 生成二维码类型 1、生成渠道二维码 2、生成成员二维码
                            fourChannel: this.channelForm.site, // 生成渠道二维码，填写的位置信息
                            qrCodeTypeDTO: {
                                type: this.channelForm.location[0], //  进入页面类型 1、主页 2、团队成员 3、案例
                                yid: 0, // 项目id,没有传0
                                scene_id:
                                    this.channelForm.location[0] == 3
                                        ? this.channelForm.location[1].split(
                                              '!'
                                          )[0]
                                        : 0, // 案例id
                                tid:
                                    this.channelForm.location[0] == 2
                                        ? this.channelForm.location[2].split(
                                              '!'
                                          )[0]
                                        : 0, // 设计师id
                                roleName: name, // 设计师职位+名字
                            },
                        },
                    }
                    this.$http
                        .fetch(this.createCodePath, args)
                        .then(res => {
                            console.log(res.data.result.result, res.data.status)
                            this.channelSubmit = false
                            if (
                                res.data.status === 200 &&
                                res.data.result.result === 1
                            ) {
                                console.log(Download)
                                Download(res.data.result.url)
                                this.$message.success('创建渠道二维码成功')
                                this.$refs.channelForm.resetFields()
                                this.$refs.channelCodeDialog.close()
                                this.$refs['list-view']
                                    .getTableInstance()
                                    .reloadTable()
                            } else {
                                this.$message.error(res.data.result.error)
                            }
                        })
                        .catch(err => {
                            this.$message.error(err)
                        })
                } else {
                    console.log('error')
                    return false
                }
            })
        },
        submitMemberCode() {
            console.log(this.memberForm)
            this.channelSubmit = true
            this.$refs['memberForm'].validate(valid => {
                if (valid) {
                    let qrId = 0
                    let name = ''
                    if (this.memberForm.location[0] == 1) {
                        qrId = this.companyId
                    } else if (this.memberForm.location[0] == 2) {
                        qrId = this.memberForm.location[2].split('!')[0]
                    } else {
                        qrId = this.memberForm.location[1].split('!')[0]
                    }
                    if (this.memberForm.location[0] == 2) {
                        name = this.memberForm.location[2].split('!')[1]
                    } else if (this.memberForm.location[0] == 3) {
                        name = this.memberForm.location[1].split('!')[1]
                    }
                    let args = {
                        dto: {
                            qrType: this.memberForm.location[0], // 进入页面类型  1、主页 2、团队成员 3、案例
                            qrTypeId: qrId, //进入页面类型ID
                            channelType: this.memberForm.member[0] == 1 ? 2 : 3, // 生成二维码类型 1、渠道二维码    2、施工团队二维码   3、设计团队二维码
                            companyName: this.companyName,
                            companyId: this.companyId,
                        },
                        dto1: {
                            threeChannel: 2, // 生成二维码类型 1、生成渠道二维码 2、生成成员二维码
                            fourChannel: this.memberForm.member[1].split(
                                '!'
                            )[0], // 生成成员二维码，填写的成员id
                            qrCodeTypeDTO: {
                                type: this.memberForm.location[0], //  进入页面类型 1、主页 2、团队成员 3、案例
                                yid: 0, // 项目id,没有传0
                                scene_id:
                                    this.memberForm.location[0] == 3
                                        ? this.memberForm.location[1].split(
                                              '!'
                                          )[0]
                                        : 0, // 案例id
                                tid:
                                    this.memberForm.location[0] == 2
                                        ? this.memberForm.location[2].split(
                                              '!'
                                          )[0]
                                        : 0,
                                roleName: name,
                            },
                        },
                    }
                    this.$http
                        .fetch(this.createCodePath, args)
                        .then(res => {
                            this.channelSubmit = false
                            if (
                                res.data.status === 200 &&
                                res.data.result.result === 1
                            ) {
                                Download(res.data.result.result)
                                this.$message.success('创建成员二维码成功')
                                this.$refs.memberForm.resetFields()
                                this.$refs.memberCodeDialog.close()
                                this.$refs['list-view']
                                    .getTableInstance()
                                    .reloadTable()
                            } else {
                                this.$message.error(res.data.result.error)
                            }
                        })
                        .catch(err => {
                            this.$message.error(err)
                        })
                } else {
                    console.log('error')
                    return false
                }
            })
        },
        viewCode(row) {
            console.log(row)
            this.imageUrl = row.qrImgUrl
        },
        downLoadCode(row) {
            console.log(row)
        },
        closeViewCode() {
            this.imageUrl = ''
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
.viewqrCode {
    color: blue;
}
.viewqrCode:hover {
    cursor: pointer;
}
</style>
