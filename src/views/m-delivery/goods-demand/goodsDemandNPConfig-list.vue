<template>
    <div>
        <t8t-list-view ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="true"
            :toolbarSymbolList="toolbarSymbolList"
            :toolbarDisabledSymbols="toolbarDisabledSymbols"
            :tableColumns="tableColumns"
            :tableService="service"
            :tableArgs="tableArgs"
            :tableMethod="method"
            :tableCommonData="searchOptions"
            :defaultTreeExpandedKeys="[0]"
            @list-add="doAdd"
            @list-edit="doEdit"
            @list-disable="switchAble"
            @list-anti-disable="switchAble"
            @search-submit="onSearchSubmit"
            @table-selection-change="selectionChange">
        </t8t-list-view>
        <el-dialog v-model="dialogFlag"
            :title="title"
            @close="closeDialogEvent"
            size="small">
            <el-form label-position="right"
                label-width="120px">
                <el-form-item label="下单人"
                    prop="orderUserId">
                    <el-select v-model="formData.orderUserId"
                        :allow-create="false"
                        filterable
                        placeholder="请选择下单人"
                        :disabled="orderUserBtnDisFlag">
                        <el-option v-for="item in userConfigList"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否需要审核"
                    prop="autoCheck">
                    <el-select v-model="formData.autoCheck"
                        :allow-create="false"
                        @change="autoCheckChangeEvent"
                        placeholder="是否需要审核">
                        <el-option v-for="item in autoCheckoptions"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核人"
                    prop="checkUserId">
                    <el-select v-model="formData.checkUserId"
                        :allow-create="false"
                        filterable
                        placeholder="请选择审核人"
                        :disabled="checkUserBtnDisFlag">
                        <el-option v-for="item in userConfigFilterList"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer"
                class="dialog-footer">
                <el-button @click="btnOKClick()"
                    type="primary"
                    :loading="edit_isLoading"
                    v-if="type != 'view'">确定</el-button>
                <el-button @click="closeDialogEvent()">取消</el-button>
            </div>
            <div style=color:#990099>
                温馨提示：</br>
                非土巴兔平台项目，可配置公司成员作为下单人通过app下辅材零售订单。</br>
                选择需要审核，辅材订单需要审核员审核后才能生效；</br>
                选择不需要审核，辅材订单无需审核直接生效；</br>
                生效后的订单才会安排配送，并且由贵公司承担结算。</br>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import Service from 'src/services/delivery/goodsDemand/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'

    export default {
        components: { T8tListView },
        data() {
            return {
                formData: {
                    "id": null,
                    "orderUserId": null,
                    "checkUserId": null,
                    "autoCheck": null
                },
                tableColumns: [
                    { prop: 'orderUserName', label: '下单人' },
                    {
                        prop: 'autoCheck', label: '是否需审核', formatter(autoCheck) {
                            if (autoCheck == 0) {
                                return '是'
                            } else {
                                return '否'
                            }
                            return autoCheck
                        }
                    },
                    { prop: 'checkUserName', label: '审核人' },
                    {
                        prop: 'isDel', label: '是否禁用', formatter(isDel) {
                            if (isDel == 0 || isDel == '0') {
                                return '否'
                            } else {
                                return '是'
                            }
                        }
                    },
                    {
                        prop: 'createTime', label: '创建日期',
                        formatter(text) {
                            let dateString
                            if (text === 0 || text === null || text === '') {
                                dateString = ''
                            } else {
                                let objDate = new Date(text * 1000)
                                dateString = formatDate(objDate)
                            }
                            return dateString
                        }
                    },
                    { prop: 'createName', label: '创建人' },
                    {
                        prop: 'updateTime', label: '修改日期',
                        formatter(text) {
                            let dateString
                            if (text === 0 || text === null || text === '') {
                                dateString = ''
                            } else {
                                let objDate = new Date(text * 1000)
                                dateString = formatDate(objDate)
                            }
                            return dateString
                        }
                    },
                    { prop: 'updateName', label: '修改人' }
                ],
                searchFields: [
                    { type: 'input', label: '下单人', name: 'orderUserName', placeholder: '模糊搜索' },
                    { type: 'input', label: '审核人', name: 'checkUserName', placeholder: '模糊搜索' }
                ],
                toolbarSymbolList: ["ADD", "EDIT", "DISABLE", "ANTI-DISABLE"],
                service: Service.DEMAND.name,
                method: Service.DEMAND.methods.QUERY_RETAIL_CONFIG_PAGE,
                tableArgs: {
                    search: {
                        orderUserName: null,
                        checkUserName: null,
                    },
                    sort: ['createTime_desc']
                },
                userConfigList: [],
                userConfigFilterList: [],
                dialogFlag: false,
                checkUserBtnDisFlag: false,
                orderUserBtnDisFlag: false,
                title: null,
                autoCheckoptions: [
                    { value: 0, text: '是' },
                    { value: 1, text: '否' }
                ]
            }
        },
        created() {

        },
        methods: {
            onSearchSubmit(obj) {
                this.tableArgs = { search: obj, sort: ['createTime_desc'] }
            },
            doAdd() {
                this.queryConfigUserList(false, 0, 1)
                this.queryConfigUserFilterList()
                this.formData.orderUserId = null
                this.formData.checkUserId = null
                this.formData.autoCheck = null
                this.formData.id = null
                this.checkUserBtnDisFlag = false
                this.orderUserBtnDisFlag = false
                this.title = '新增下单人'
                this.dialogFlag = true
            },
            doEdit(val1) {
                let rows = this.$refs['list-view'].getTableInstance().getSelectRows()
                console.log(rows)
                if (null == rows || rows == '') {
                    this.$message.error('请选择一行进行操作')
                    return
                }
                if (rows.length > 1) {
                    this.$message.error('只能选择一行进行操作')
                    return
                }
                this.title = '编辑下单人'
                this.orderUserBtnDisFlag = true
                this.formData = Object.assign({}, rows[0])
                this.dialogFlag = true
                this.queryConfigUserList(true, this.formData.orderUserId, 0)
                this.queryConfigUserFilterList()
                if (this.formData.autoCheck == 1) {
                    this.checkUserBtnDisFlag = true
                }
                if (this.formData.checkUserId == 0) {
                    this.formData.checkUserId = null
                }
            },
            closeDialogEvent() {
                this.dialogFlag = false
            },
            autoCheckChangeEvent(val) {
                if (val == 1) {
                    this.formData.checkUserId = null
                    this.checkUserBtnDisFlag = true
                    this.formData.autoCheck = 1
                } else {
                    this.checkUserBtnDisFlag = false
                    this.formData.autoCheck = 0
                }
            },
            switchAble(val) {
                let rows = this.$refs['list-view'].getTableInstance().getSelectRows()
                if (rows.length < 1) {
                    this.$message.error('请选择需要操作的行')
                    return
                }
                let idList = [];
                rows.forEach((item) => {
                    idList.push(item.id)
                })
                if (val == "DISABLE") {
                    let isDel = rows.every((item) => {
                        return item.isDel == 0
                    })
                    if (!isDel) {
                        this.$message.error('只能对未禁用的行进行操作')
                        return
                    } else {
                        this.doSwitchAble(1, idList)
                    }
                } else {
                    let isDel = rows.every((item) => {
                        return item.isDel == 1
                    })
                    if (!isDel) {
                        this.$message.error('只能对禁用的行进行操作')
                        return
                    } else {
                        this.doSwitchAble(0, idList)
                    }
                }
            },
            btnOKClick() {
                debugger
                var autoCheck = this.formData.autoCheck
                var orderUserId = this.formData.orderUserId;
                if (orderUserId == null || orderUserId == '' || orderUserId < 1) {
                    this.$message.error('请配置下单人')
                    return
                }
                if (autoCheck != 0 && autoCheck != 1) {
                    this.$message.error('请选择是否需要审核')
                    return
                }
                var checkUserId = this.formData.checkUserId;
                if (autoCheck != 1 && (checkUserId == null || checkUserId == '' || checkUserId < 1)) {
                    this.$message.error('请配置审核人')
                    return
                }
                let retailConfig = this.formData
                if (null == this.formData.id || this.formData.id < 1) {
                    retailConfig.createName = Cookie.get('t8t-tc-username')
                    retailConfig.createBy = Cookie.get('t8t-tc-username')
                    let args = { retailConfig: retailConfig }
                    axios({
                        service: Service.DEMAND.name,
                        method: Service.DEMAND.methods.ADD_RETAIL_CONFIG,
                        args: args
                    }).then((res) => {
                        this.dealResponseResult(res)
                    })
                } else {
                    retailConfig.updateName = Cookie.get('t8t-tc-username')
                    retailConfig.updateBy = Cookie.get('t8t-tc-username')
                    let args = { retailConfig: retailConfig }
                    console.log(args)
                    axios({
                        service: Service.DEMAND.name,
                        method: Service.DEMAND.methods.UPDATE_RETAIL_CONFIG,
                        args: args
                    }).then((res) => {
                        this.dealResponseResult(res)
                    })
                }
            },
            queryConfigUserList(flag, accountId, isFilter) {
                let args = { isFilter: isFilter }
                if (flag) {
                    args.accountId = accountId
                }
                this.loading = true
                axios({
                    service: Service.DEMAND.name,
                    method: Service.DEMAND.methods.QUERY_CONFIG_USER_LIST,
                    args: args
                }).then((res) => {
                    if (res.data.status === 200) {
                        this.userConfigList = []
                        res.data.result.forEach((item) => {
                            this.userConfigList.push({
                                value: item.orderUserId,
                                text: item.orderUserName
                            })
                        });
                    }
                })
            },
            queryConfigUserFilterList() {
                let args = { isFilter: 0 }
                this.loading = true
                axios({
                    service: Service.DEMAND.name,
                    method: Service.DEMAND.methods.QUERY_CONFIG_USER_LIST,
                    args: args
                }).then((res) => {
                    if (res.data.status === 200) {
                        this.userConfigFilterList = []
                        res.data.result.forEach((item) => {
                            this.userConfigFilterList.push({
                                value: item.orderUserId,
                                text: item.orderUserName
                            })
                        });
                    }
                })
            },
            dealResponseResult(res) {
                if (res.data && res.data.status == 200) {
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.dialogFlag = false;
                    this.$refs['list-view'].getTableInstance().reloadTable()
                } else {
                    var message = res.data.message;
                    if (null == message || message == '') {
                        message = '操作失败'
                    }
                    this.$message({
                        message: message,
                        type: 'error'
                    });
                }
            },
            doSwitchAble(isDel, idList) {
                let args = {
                    isDel: isDel, idList: idList, updateName: Cookie.get('t8t-tc-username'), updateBy: Cookie.get('t8t-tc-username')
                }
                axios({
                    service: Service.DEMAND.name,
                    method: Service.DEMAND.methods.ENABLE_RETAIL_CONFIG,
                    args: args
                }).then((res) => {
                    this.dealResponseResult(res)
                })
            }
        }
    }
    function formatDate(inputTime) {
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    }
</script>