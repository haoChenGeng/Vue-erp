<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            :formData="searchFormData"
            :ref="t8tSearch"
            @submit="submitSearch"
            @change="onChange"
            @visible-change="visibleChange"
        ></t8t-search>
        <div class="g-main-container-column">
            <t8t-toolbar
                @ADD="add"
                @EDIT="edit"
                @ENABLE="enable"
                @DISABLE="disable"
            ></t8t-toolbar>
            <t8t-table
                :columns="columns"
                :service="service"
                :method="method"
                :commonData="selectSource"
                :args="args"
                ref="t8tTable"
            >
                <!-- 自定义列模板样式 begin -->
                <template slot="secretKeyType" scope="scope">
                    <el-button type="text" @click.stop="showKeyDialog(scope.row)">{{scope.row.secretKeyType | keyTypeToStr}}</el-button>
                </template>
                <!-- end -->
            </t8t-table>
            <!-- 添加、编辑弹窗 -->
            <add-dialog
                v-if="dialogVisible"
                :dialogTitle="dialogTitle"
                :editType="editType"
                :rowId="rowId"
                :selectSource="selectSource"
                @close="dialogVisible=false"
                @getTableData="getTableData"
            ></add-dialog>
            <!-- end -->
            <!-- 查看密钥弹窗 -->
            <el-dialog title="查看密钥" v-model="keyDialog" @close="closeDialog">
                <div class="viewChannelKey">
                    <div style="word-wrap:break-word;" v-if="secretKeyType == 1">{{md5keyStr}}</div>
                    <div style="word-wrap:break-word;" v-if="secretKeyType == 2">公钥：{{RSAPubStr}}</div>
                    <div style="word-wrap:break-word;" v-if="secretKeyType == 2">私钥：{{RSAPriStr}}</div>
                </div>
            </el-dialog>
            <!-- end -->
        </div>
    </div>
</template>

<script>
    import AddDialog from './add-dialog.vue'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/finance/Service.js'
    import fundChannelApi from 'src/services/finance/fundChannelConfig.js'
    import * as config from './config'
    import Cookie from 'js-cookie'
    import { M, mb, getTextById } from 'src/components/t8t-table/utils/utils.js'

    export default {
        components: {
            AddDialog
        },
        data() {
            return {
                // 面包屑
                breadcrumbData: config.breadcrumbData,
                // 搜索表单项配置
                fields: [
                    { type: 'select',label: '收付类型',name: 'channelType', selectSourceKey:'channelTypeOptions' },
                    { type: 'select',label: '财务组织',name: 'organizationId', selectSourceKey:'financeOrganizationOptions' },
                    { type: 'select',label: '资金渠道',name: 'channelId', selectSourceKey:'channelOptions' },
                    { type: 'select',label: '二级渠道',name: 'secondChannelId', selectSourceKey:'secondChannelOptions' },
                    { type: 'input', label: '商户编号',name: 'partnerNo' },
                    { type: 'input', label: '商户账号',name: 'account' },
                    { type: 'select',label: '状态',name: 'status', selectSourceKey:'statusOptions' }
                ],
                selectSource: {
                    // 财务组织
                    financeOrganizationOptions: [],
                    // 收付类型
                    channelTypeOptions: [
                        { text: '收款', value: 1 },
                        { text: '付款', value: 2 }
                    ],
                    // 资金渠道
                    channelOptions: [],
                    // 二级渠道
                    secondChannelOptions: [],
                    // 状态
                    statusOptions: [
                        { text: '待启用', value: 0 },
                        { text: '启用', value: 1 },
                        { text: '禁用', value: 2 }
                    ],
                    // 密钥类型
                    secretKeyTypeOption: [
                        { text: 'MD5密钥', value: 1 },
                        { text: 'RSA公私钥', value: 2 },
                    ],
                },
                service: Service.FUND_CHANNEL_CONFIG.name,
                method: Service.FUND_CHANNEL_CONFIG.methods.QUERY_PAGE,
                args: {sort:["id_desc"]},
                // search表单数据
                searchFormData: {
                    channelType: null
                },
                // 表格列
                columns: config.columns,
                // 弹窗配置
                dialogTitle: '新增渠道管理配置',
                editType: 'add',
                dialogVisible: false,
                rowId: null,
                // 密钥弹窗配置
                keyDialog: false,
                md5keyStr: '',
                RSAPubStr:'',
                RSAPriStr:'',
                secretKeyType: ''
            }
        },
        filters: {
            keyTypeToStr(value) {
                if(value == 1) {
                    return 'MD5密钥'
                } else if(value == 2) {
                    return 'RSA公私钥'
                } else {
                    return ''
                }
            }
        },
        methods: {
            onChange(value, name) {
                // 如果是收付类型值改变
                if(name == "channelType") {
                    let searchFormData = {...this.searchFormData}
                    searchFormData.channelType = value
                    // 清空财务组织的值
                    this.selectSource.financeOrganizationOptions = []
                    searchFormData.organizationId = ''
                    // 清空资金渠道的值
                    this.selectSource.channelOptions = []
                    searchFormData.channelId = ''
                    // 清空二级渠道的值
                    this.selectSource.secondChannelOptions = []
                    searchFormData.secondChannelId = ''
                    this.searchFormData= searchFormData
                    // 根据收付类型获取资金渠道
                    this.getChannelOptions(value)
                    // 根据收付类型获取财务组织
                    this.getOrganizationOptions(value)
                }
                // 如果资金渠道的值改变
                if(name == 'channelId') {
                    let channelType = this.searchFormData.channelType
                    let searchFormData = {...this.searchFormData}
                    this.selectSource.secondChannelOptions = []
                    searchFormData.secondChannelId = ''
                    this.searchFormData= searchFormData
                    if(channelType && value) {
                        this.getSecondChannelOptions(channelType, value)
                    }
                }
            },
            // select类型下拉框出现和隐藏时触发
            visibleChange(value, name) {
                if(name == 'channelId') {
                    if(value === true) {
                        if(!('channelType' in this.searchFormData) || !this.searchFormData.channelType) {
                            this.$message.error('请先选择收付类型')
                        }
                    }
                }
                if(name == 'secondChannelId') {
                    if(value === true) {
                        if(!('channelId' in this.searchFormData) || !this.searchFormData.channelId) {
                            this.$message.error('请先选择资金渠道')
                        }
                    }
                }
                if(name == 'organizationId') {
                    if(value === true) {
                        if(!('channelType' in this.searchFormData) || !this.searchFormData.channelType) {
                            this.$message.error('请先选择收付类型')
                        }
                    }
                }
            },
            // 搜索
            submitSearch(obj) {
                this.searchFormData = {...obj}
                this.args = { search: obj, sort:["id_desc"]}
            },
            //新增
            add() {
                this.dialogTitle = '新增渠道管理配置'
                this.editType = 'add'
                this.dialogVisible = true
                this.rowId = null
            },
            //编辑
            edit() {
                // 获取选中的行
                let rows = this.$refs['t8tTable'].getSelectRows()
                if (!rows || rows.length === 0) {
                    this.$message.error('请勾选数据后再操作')
                } else if (rows.length > 1) {
                    this.$message.error('请对单条数据进行操作')
                }else{
                    if(rows[0].status == 1) {
                        this.$message.error('启用状态数据不允许编辑')
                        return
                    }
                    this.dialogTitle = '编辑渠道管理配置'
                    this.editType = 'edit'
                    this.dialogVisible = true
                    this.rowId = rows[0].id
                }
            },
            //启用
            enable() {
                let rows = this.$refs['t8tTable'].getSelectRows()
                let idsData = []
                let self = this
                let flag = true
                if(!rows || rows.length === 0) {
                    this.$message.error('请勾选数据后再操作')
                } else {
                    if(rows.length === 0) {
                        if(rows[0].status == 1) {
                            this.$message.error('该配置已处于启用状态，请勿重复操作')
                            flag = false
                            return
                        }
                    }
                    rows.forEach((item) => {
                        if(item.status === 1) {
                            this.$message.error('请勾选非启用状态的数据')
                            flag = false
                            return
                        }
                        idsData.push({
                            id: item.id,
                            status: 1,
                            channelNo: item.channelNo,
                            updateUser: parseInt(Cookie.get('t8t-tc-uid'))
                        })
                    })
                    if(idsData.length>0 && flag) {
                        let args = {
                            channelConfigs: idsData
                        }
                        fundChannelApi.batchUpdateStatus(args)
                            .then((res) => {
                                if (res.data.status === 200) {
                                    self.$msgbox(mb('启用成功', 'success'))
                                    this.$refs['t8tTable'].reloadTable()
                                } else {
                                    self.$msgbox(mb(res.data.message, 'error'))
                                }
                            })
                    }
                }
            },
            //停用
            disable() {
                let rows = this.$refs['t8tTable'].getSelectRows()
                let idsData = []
                let self = this
                let flag = true
                if(!rows || rows.length === 0) {
                    this.$message.error('请勾选数据后再操作')
                } else {
                    if(rows.length === 0) {
                        if(rows[0].status === 2) {
                            this.$message.error('该配置已处于禁用状态，请勿重复操作')
                            flag = false
                            return
                        }
                    }
                    rows.forEach((item) => {
                        if(item.status === 2) {
                            this.$message.error('请勾选非禁用状态的数据')
                            flag = false
                            return
                        }
                        idsData.push({
                            id: item.id,
                            status: 2,
                            channelNo: item.channelNo,
                            updateUser: parseInt(Cookie.get('t8t-tc-uid'))
                        })
                    })
                    if(idsData.length>0 && flag) {
                        let args = {
                            channelConfigs: idsData
                        }
                        fundChannelApi.batchUpdateStatus(args)
                            .then((res) => {
                                if (res.data.status === 200) {
                                    self.$msgbox(mb('禁用成功', 'success'))
                                    this.$refs['t8tTable'].reloadTable()
                                } else {
                                    self.$msgbox(mb(res.data.message, 'error'))
                                }
                            })
                    }
                }
            },
            //辅助资料
            getCommonData: function(fatherCode,selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus===1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            })
                            this.selectSource[selectName] = list
                        }
                    })
            },
            // 根据组织职能获取财务组织
            getOrganizationOptions(value) {
                if(value === 1) { // 收款读取的是法人职能和利润中心
                    // 法人职能和利润中心
                    let arg = {
                        funcCodes:["001004013", "001004014"]
                    }
                    let list = []
                    commonApi.queryByFunctionCode(arg)
                        .then((res) => {
                            if(res.data.status === 200) {
                                res.data.result.forEach((item) => {
                                    if(item.isDel !== 1) {
                                        list.push({
                                            value: item.id,
                                            text: item.name
                                        })
                                    }
                                })
                                this.selectSource.financeOrganizationOptions = list
                            }
                        })
                } else if(value === 2) { // 付款读取的是辅助资料付款主体：61007
                    this.getCommonData('61007', 'financeOrganizationOptions')
                }
            },
            // 获取资金渠道数据
            getChannelOptions(value) {
                let list = []
                let args = {
                    page: 1,
                    size: 1000,
                    search: {
                        status: 1 // 启用的配置
                    }
                }
                switch (value) {
                    case 1:
                        fundChannelApi.getReceiptChannelData(args)
                            .then((res) => {
                                if(res.data.status === 200 && res.data.result.rows) {
                                    res.data.result.rows.forEach((item) => {
                                        list.push({
                                            value: item.channelId,
                                            text: item.name
                                        })
                                    })
                                    this.selectSource.channelOptions = list
                                }
                            })
                        break
                    case 2:
                        fundChannelApi.getPayChannelData(args)
                            .then((res) => {
                                if(res.data.status === 200) {
                                    res.data.result.forEach((item) => {
                                        list.push({
                                            value: item.remitChannelId,
                                            text: item.name
                                        })
                                    })
                                    this.selectSource.channelOptions = list
                                }
                            })
                        break
                    default:
                        break
                }
            },
            // 查看密钥弹窗
            showKeyDialog(row) {
                row = {...row}
                let args = {
                    id: row.id
                }
                fundChannelApi.getChannelKey(args)
                    .then((res) => {
                        if(res.data.status === 200) {
                            this.keyDialog = true
                            this.secretKeyType = row.secretKeyType
                            this.md5keyStr = res.data.result.md5Key
                            this.RSAPubStr = res.data.result.rsaPublicKey
                            this.RSAPriStr = res.data.result.rsaPrivateKey
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
            },
            // 关闭密钥弹窗
            closeDialog() {
                this.keyDialog = false
                this.secretKeyType = ''
                this.md5keyStr = ''
                this.RSAPubStr = ''
                this.RSAPriStr = ''

            },
            // 表格数据重新拉取
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            },
            // 根据付款类型和资金渠道获取二级渠道筛选数据(获取现已添加的二级渠道数据)
            getSecondChannelOptions(channelType, channelId) {
                let args = {
                    page: 1,
                    size: 100,
                    search: {
                        channelType: channelType,
                        channelId: channelId
                    }
                }
                let self = this
                fundChannelApi.getList(args)
                    .then((res) => {
                        if(res.data.status === 200) {
                            let list = []
                            let idArr = []
                            res.data.result.rows.forEach((item) => {
                                if(item.secondChannelId !== 0 && item.secondChannelName !== '' && idArr.indexOf(item.secondChannelId) === -1) {
                                    list.push({
                                        value: item.secondChannelId,
                                        text: item.secondChannelName
                                    })
                                    idArr.push(item.secondChannelId)
                                }
                            })
                            this.selectSource.secondChannelOptions = list
                        }
                    })
            }
        }
    }
</script>

<style lang="css" scoped>
    .viewChannelKey {
        margin-top: -30px;
    }
</style>
