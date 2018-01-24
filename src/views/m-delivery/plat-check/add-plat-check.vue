<template>
    <div>
        <el-dialog :title="title" class="add-plat-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-row>
                <el-col :span="11" class="from-border" style="border:none;border-right:1px solid #d1dbe5">
                    <el-form v-loading.lock="formLoading" :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth"
                        ref="form" @keyup.enter.native="btnOKClick()">
                        <el-form-item label="项目ID:" prop="sourceProjectId">
                            <el-input v-model="formData.sourceProjectId" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="业主姓名:" prop="ownerName">
                            <el-input v-model="formData.ownerName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="详细地址:" prop="addressDetail">
                            <el-input type="textarea" rows="2" v-model="formData.addressDetail" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="工长姓名:" prop="projectManagerName">
                            <el-input v-model="formData.projectManagerName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="工长电话:" prop="projectManagerPhone">
                            <el-input v-model="formData.projectManagerPhone" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="实际开工日期:" prop="startTime">
                            <!-- <el-input type="textarea" rows="3" v-model="formData.startTime" disabled></el-input> -->
                            <el-date-picker v-model="formData.startTime" placeholder="" type="date" disabled>
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="验收节点:" prop="sheduleNodeId">
                            <el-select v-model="formData.sheduleNodeId" filterable :allow-create="false" placeholder="请选择验收节点">
                                <el-option v-for="item in projectNodeVOs" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <div v-if="inspectionNodeIds.indexOf(formData.sheduleNodeId)!=-1" class="isInspection">
                            <el-checkbox v-model="isInspection">申请免检</el-checkbox>
                        </div>
                        <el-form-item v-if="isInspection==false" label="验收日期:" prop="expectStartTime">
                            <el-date-picker v-model="formData.expectStartTime" placeholder="" type="date" :picker-options="pickerOptions0">
                            </el-date-picker>
                        </el-form-item>
                        <!-- <el-form-item v-if="isInspection==false" label="验收时间:" prop="expectCheckTime">
                            <el-date-picker v-model="formData.expectCheckTime" placeholder="" type="datetime" :picker-options="pickerOptions0">
                            </el-date-picker>
                        </el-form-item> -->
                        <el-form-item v-if="isInspection==false" label="验收时间:" prop="time">
                            <el-select v-model="formData.time" filterable :allow-create="false" placeholder="请选择验收时间">
                                <el-option v-for="item in times" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div style="text-align: center;" class="dialog-footer">
                        <el-button @click="btnOKClick()" type="primary" :loading="isLoading">确定</el-button>
                        <el-button @click="btnCancleClick()">取消</el-button>
                    </div>
                </el-col>
                <el-col :span="1">&nbsp;</el-col>
                <el-col :span="12">
                    <!-- <div>
                        <span style="font-size:200 ">验收记录:</span>
                    </div> -->
                    <div class='checkRecords'>
                        <span>验收记录:</span>
                        <div v-if="checkRecords != ''" class="noteBox" v-html="checkRecords"></div>
                    </div>
                    <!-- <div class="dialog2-main-container"> -->
                    <!-- 表单区 -->
                    <!-- <div class="full-dialog-tabs-container full-dialog-form-container">
                            <template>
                                <el-table :data="platCheckVOs" border>
                                    <el-table-column prop="checkTypeName" label="验收类型" width="100">
                                    </el-table-column>
                                    <el-table-column prop="billStatus" label="验收状态" :formatter="transferStatus" width="60">
                                    </el-table-column>
                                    <el-table-column prop="expectStartTime" label="申请时间" :formatter="formatterExpectTime" width="200">
                                    </el-table-column>
                                    <el-table-column prop="createUserName" label="申请人" width="100">
                                    </el-table-column>
                                    <el-table-column prop="checkStartTime" label="验收时间" :formatter="formatterCheckTime" width="200">
                                    </el-table-column>
                                </el-table>
                            </template>
                        </div>
                    </div> -->
                    <div v-if="reminder != ''" class='reminder'>
                        <span style="font:200 ">温馨提示:</span>
                        <div class="noteBoxReminder" v-html="reminder"></div>
                    </div>
                </el-col>
            </el-row>

        </el-dialog>
    </div>
</template>
<script>
    import CheckCommon from 'src/services/delivery/check/checkCommon.js'
    import Utils from 'src/utils/Utils.js'
    import Cookie from 'js-cookie'
    import DateUtils from 'src/utils/DateUtils.js'
    export default {
        name: 'add-start-bill',
        data() {
            // let validateExpectCheckTime = (rule, value, callback) => {
            //     if (!value) {
            //         return callback(new Error('请选择申请结束时间'));
            //     }
            //     if (this.formData.expectStartTime && +this.formData.expectStartTime >= +this.formData.expectCheckTime) {
            //         return callback(new Error('结束时间必须大于开始时间'));
            //     }
            //     callback();
            // }
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                dialogVisible: true,
                tab_detail: 'template',
                rules: {
                    // sourceProjectId: [
                    //     { required: true, message: "请填写项目ID" },
                    //     {
                    //         // type: 'string', message: "请输入正确的项目ID", transform: function (varable) {
                    //         //     //checkNumber(varable);
                    //         //     return varable.length >= 1 && varable.length <= 64 ? varable : varable
                    //         // },
                    //         pattern: /^\d{1,64}$/,
                    //         message: '请输入正确的项目ID(项目id需为数字)'
                    //     }
                    // ],
                    sheduleNodeId: [
                        { type: 'string', required: true, message: "请选择验收节点", trigger: 'change' },
                    ],
                    expectStartTime: [
                        { type: 'date', required: true, message: "请选择验收日期", trigger: 'change' },
                    ],
                    time: [
                        { type: 'number', required: true, message: "请选择验收时间", trigger: 'change' },
                    ],
                },
                //表单
                formData: {
                    sourceProjectId: null,
                    projectId: null,
                    ownerName: '',
                    addressDetail: '',
                    projectManagerName: '',
                    projectManagerPhone: '',
                    startTime: null,
                    sheduleNodeId: null,
                    expectStartTime: null,
                    expectCheckTime: null,
                    projectStar: null,
                    time: null,
                },
                isLoading: false,
                projectNodeVOs: [],
                inspectionNodeIds: [],
                platCheckVOs: [],
                formLoading: false,
                reminder: '',//温馨提示
                isInspection: false,
                //isShow: false,
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    }
                },
                times: [
                    { label: "9:00-12:00", value: 1 },
                    { label: "13:00-15:00", value: 2 },
                    { label: "15:00-17:00", value: 3 },
                ],
                //tableData: [],
                billStatuList: [
                    {
                        text: '待验收',
                        value: 1
                    },
                    {
                        text: '合格',
                        value: 2
                    },
                    {
                        text: '不合格',
                        value: 3
                    }],
                checkRecords: '',//验收记录
            }
        },
        props: {
            editType: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
            projectId: {
                type: String,
                default: ''
            }
        },
        computed: {
            editable() {
                return this.editType === 'see'
            }
        },
        created() {
            if (this.editType == 'add') {
                this.formData.projectId = this.projectId;
                this.getProjectInfo();
            }
            //请求所选行的数据
        },
        methods: {
            getProjectInfo() {
                let projectId = this.projectId
                if (typeof projectId != 'string' || projectId.length < 1 || projectId.length > 64 || /^\d{1,64}$/.test(projectId) == false) {
                    // this.$message({
                    //     type: 'error',
                    //     message: '请输入正确的项目ID(项目id需为数字)'
                    // })
                    return;
                }
                this.formLoading = true;
                CheckCommon.getOrderInfo({ projectId: projectId })
                    .then((res) => {
                        let resStatus = [211512, 211514, 211502];
                        //let inspectionStages = ["水电验收", "泥木（中期）验收", "油漆验收"];
                        let message = '';
                        let completeMessage = '';
                        //let inspectionFlag = false;
                        if (res.data.status === 200) {
                            this.projectNodeVOs = [];
                            this.inspectionNodeIds = [];
                            let list = [];
                            let inspectionsIds = [];
                            res.data.result.projectNodeVOs.forEach(function (item, i) {
                                list.push({ label: item.nodeTypeName, value: item.id });
                                if (item.inspectionFlag == true) {
                                    // inspectionFlag = true;
                                    inspectionsIds.push(item.id);
                                }
                            });
                            this.platCheckVOs = Object.assign(this.platCheckVOs, res.data.result.platCheckVOs);
                            if (this.platCheckVOs.length > 0) {
                                let checkRecord = '';
                                for (let index = 0; index < this.platCheckVOs.length; index++) {
                                    let checkVO = this.platCheckVOs[index];
                                    checkRecord = checkRecord.concat('<a style="color:blue;text-decoration:none;">').concat(index + 1).concat(".").concat(checkVO.checkTypeName);
                                    let record = '';
                                    if (checkVO.billStatus === 1)//1-待验收,2-合格,3-不合格
                                    {
                                        record = record.concat("(待验收)").concat("</a><br>申请时间:").concat(this.formatterExpectTime(checkVO, null))
                                            .concat(" , 申请人:").concat(checkVO.createUserName).concat("。<br>");
                                    } else if (checkVO.billStatus === 2) {
                                        record = record.concat("(合格)").concat("</a><br>申请时间:").concat(this.formatterExpectTime(checkVO, null))
                                            .concat(" , 申请人:").concat(checkVO.createUserName).concat(" , 验收时间:").concat(this.formatterCheckTime(checkVO, null)).concat("。<br>");
                                    } else if (checkVO.billStatus === 3) {
                                        record = record.concat("(不合格)").concat("</a><br>申请时间:").concat(this.formatterExpectTime(checkVO, null))
                                            .concat(" , 申请人:").concat(checkVO.createUserName).concat(" , 验收时间:").concat(this.formatterCheckTime(checkVO, null)).concat("。<br>");
                                    }
                                    checkRecord = checkRecord.concat(record);
                                }
                                this.checkRecords = checkRecord;
                            }
                            this.projectNodeVOs = list;
                            this.inspectionNodeIds = inspectionsIds;
                            this.formData = Object.assign(this.formData, res.data.result)
                            let _this = this
                            setTimeout(function () {
                                _this.formData.sheduleNodeId = list.length > 0 ? list[0].value : "";
                                _this.formData.startTime = _this.formData.startTime > 0 ? _this.formData.startTime * 1000 : null;
                            }, 1)
                            let projectStar = this.formData.projectStar;
                            // if (projectStar != null && 5 == projectStar && inspectionFlag) {
                            //     //动态添加一个el-form-item
                            //     this.isShow = true;
                            // }
                            if (null == this.projectNodeVOs || list.length <= 0) {
                                completeMessage = "请检查是否已开工确认或所有验收阶段已申请验收!";
                            }

                        }
                        else if (resStatus.indexOf(res.data.status) != -1) {
                            message = res.data.result == null ? (res.data.message == null ? '系统异常,请稍后再试！' : res.data.message) : res.data.result
                        }
                        else {
                            message = '未获取到数据,请稍后再试!';
                        }

                        if (message != '') {
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: message,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            });
                        }
                        if (completeMessage != '') {
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: completeMessage,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            });
                        }
                        this.formLoading = false;
                    });
            },
            btnOKClick() {
                let that = this;
                that.$refs['form'].validate(valid => {
                    if (valid) {
                        let editType = that.editType;
                        if (editType === 'add') {
                            if (null == that.formData.projectId || 0 == that.formData.projectId) {
                                that.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: '此项目信息不存在！',
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                });
                                return;
                            }
                            that.isLoading = true;
                            let expectStartTime = 0;
                            let expectCheckTime = 0;
                            if (that.isInspection == true) {
                                expectStartTime = Math.round(new Date().getTime() / 1000);
                                expectCheckTime = Math.round(new Date().getTime() / 1000);
                            } else {
                                expectStartTime = this.dateTransfer(this.formData.expectStartTime, this.formData.time, 1);
                                expectCheckTime = this.dateTransfer(this.formData.expectStartTime, this.formData.time, 2);
                            }
                            let platCheckCreateDTO = {
                                projectId: that.formData.projectId,
                                sourceProjectId: that.formData.sourceProjectId,
                                sheduleNodeId: that.formData.sheduleNodeId,
                                expectStartTime: expectStartTime,
                                expectCheckTime: expectCheckTime,
                                createUser: +Cookie.get('t8t-tc-uid'),
                                isInspection: that.isInspection == true ? 1 : 0,
                            }
                            CheckCommon.createCheck({ check: platCheckCreateDTO })
                                .then((res) => {
                                    let resStatus = [211514, 211501, 211502, 211503, 211509, 211507, 211511, 211500, 211520, 211521, 211517];
                                    let message = '';
                                    if (res.data.status === 200) {
                                        that.$message({
                                            type: 'success',
                                            message: '新增成功！'
                                        })
                                        that.btnCancleClick()
                                        that.$emit('getTableData')
                                    } else if (res.data.status === 211501) {
                                        let result = res.data.result;
                                        if (typeof result == "object" && result.length > 0) {
                                            for (let index = 0; index < res.data.result.length; index++) {
                                                message = message.concat(index + 1).concat(". ").concat(res.data.result[index]).concat("<br>");
                                            }
                                        }
                                        else {
                                            message = result == null ? res.data.message : result;
                                        }
                                    }
                                    else if (res.data.status === 211509) {
                                        let reminder = '';
                                        let result = res.data.result;
                                        if (typeof result == "object" && result.length > 0) {
                                            for (let index = 0; index < res.data.result.length; index++) {
                                                reminder = reminder.concat(index + 1).concat(".").concat(res.data.result[index]).concat("<br>");
                                            }
                                        }
                                        else {
                                            reminder = result == null ? res.data.message : result;
                                        }
                                        that.reminder = reminder
                                    } else if (resStatus.indexOf(res.data.status) != -1) {
                                        message = res.data.result == null ? (res.data.message == null ? '系统异常,请稍后再试！' : res.data.message) : res.data.result;
                                    } else {
                                        message = '系统异常,请稍后再试！';
                                    }
                                    if (message != '') {
                                        this.$msgbox({
                                            title: '消息',
                                            type: 'error',
                                            message: message,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        });
                                    }
                                    that.isLoading = false;
                                })
                        }
                    }
                    else {
                        return false
                    }
                })
            },
            btnCancleClick() {
                this.$refs['form'].resetFields()
                this.dialogVisible = false
                this.$emit('close')
            },
            checkNumber(value) {
                var reg = /^\d{1,64}$/;
                if (reg.test(value)) {
                    return false;
                }
                return true;
            },
            dateParser(text) {
                let dateString;
                let objDate = new Date(text * 1000);
                if (text === 0 || text === null) {
                    dateString = ""
                } else {
                    dateString = DateUtils(objDate, 'yyyy-mm-dd HH:MM:ss')
                }
                return dateString
            },
            dateParserDate(text) {
                let dateString;
                let objDate = new Date(text * 1000);
                if (text === 0 || text === null) {
                    dateString = ""
                } else {
                    dateString = DateUtils(objDate, 'yyyy-mm-dd')
                }
                return dateString
            },
            dateTransfer(expectStartTime, time, optType) {
                if (1 == optType && 1 == time) {
                    expectStartTime.setHours(9);
                } else if (1 == optType && 2 == time) {
                    expectStartTime.setHours(13);
                } else if (1 == optType && 3 == time) {
                    expectStartTime.setHours(15);
                } else if (2 == optType && 1 == time) {
                    expectStartTime.setHours(12);
                } else if (2 == optType && 2 == time) {
                    expectStartTime.setHours(15);
                } else if (2 == optType && 3 == time) {
                    expectStartTime.setHours(17);
                }

                return (+Date.parse(expectStartTime).toString().substr(0, 10))
            },
            formatterExpectTime(val, row) {
                if (val.expectStartTime) {
                    return this.dateParserDate(val.expectStartTime);
                } else {
                    return "  ";
                }
            },
            formatterCheckTime(val, row) {
                if (val.checkStartTime) {
                    return this.dateParserDate(val.checkStartTime);
                } else {
                    return "  ";
                }
            },
            transferStatus(val, row) {
                let billStatusRes = this.billStatuList;
                for (var i in billStatusRes) {
                    let result = billStatusRes[i];
                    if (result.value === val.billStatus) {
                        return result.text;
                    }
                }
            }
        }
    }

</script>

<style lang="css" scoped>
    .reminder {
        color: red;
        text-decoration: none;
        margin-left: 10px;
        line-height: 20px;
        font-size: 12px;
    }

    .noteBoxReminder {
        /* margin-left: 2em; */
        color: red;
        padding: 10px;
        line-height: 25px;
        overflow: scroll;
        max-height: 200px;
    }
</style>

<style lang="css" scoped>
    .checkRecords {
        color: blue;
        text-decoration: none;
        margin-left: 10px;
        line-height: 20px;
        font-size: 12px;
    }

    .noteBox {
        /* margin-left: 2em; */
        color: #48576a;
        padding: 10px;
        line-height: 25px;
        overflow: scroll;
        max-height: 200px;
    }
</style>
<style lang="css" scoped>
    .isInspection {
        margin-left: 42px;
        line-height: 15px;
        margin-bottom: 12px;
    }
</style>
<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css">
    .add-plat-dialog .el-dialog {
        width: 1000px;
    }

    .el-select-dropdown__wrap {
        max-height: 185px !important;
    }

    .add-plat-dialog .el-form-item__content {
        width: 250px;
    }

    .add-plat-dialog .el-select {
        width: 100%;
    }
</style>