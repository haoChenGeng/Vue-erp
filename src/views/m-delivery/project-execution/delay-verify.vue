<template>
    <div>
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog v-loading.fullscreen.lock="fullscreenLoading" @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 yanshou-detail-dialog dialog-new" :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                    </div>
                </div>
                <div class="dialog2-main-container">
                    <!-- 收缩按钮 -->
                    <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container">
                        <el-tabs v-model="tab_info">
                            <el-tab-pane label="项目信息" name="basic">
                                <div class="base">
                                    <p>项目ID：{{detailInfo.projectId}}</p>
                                    <p>业主姓名：xxx</p>
                                    <p>工地地址：广东省 深圳市 南山区 比克大厦25楼</p>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <el-tabs v-model="tab_detail">
                            <el-tab-pane label="延期信息" name="lockout_info">
                                <div style="padding-top: 20px;">
                                    <el-form ref="form" :model="detailInfo" label-width="100px">
                                        <el-form-item label="状态：">
                                            {{status_arr[detailInfo.delayStatus]}}
                                        </el-form-item>
                                        <el-form-item label="延期天数：">
                                            {{detailInfo.delayDays}}天
                                        </el-form-item>
                                        <el-form-item label="延期原因：">
                                            {{detailInfo.delayReasonName}}
                                        </el-form-item>
                                        <el-form-item label="延期原因描述：">
                                            <el-input :style="{width:'300px'}" disabled type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="detailInfo.reasonDetail"></el-input>
                                        </el-form-item>
                                        <el-form-item v-if="detailInfo.delayStatus == 0" label="审批意见：">
                                            <el-input :style="{width:'300px'}" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="reason"></el-input>
                                        </el-form-item>
                                        <el-form-item v-if="detailInfo.delayStatus == 0">
                                            <el-button type="primary" @click="verify(1)" :loading="isLoading_1">通过</el-button>
                                            <el-button @click="verify(0)" :loading="isLoading_0">驳回</el-button>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="受影响节点" name="delay_effect" :style="{paddingTop:'20px'}">
                                <t8t-table
                                    :columns="effectColumns"
                                    :service="service"
                                    :method="effectMethod"
                                    :args="effectArgs"
                                    :commonData="effectCommonData"
                                    :selectCol="false"
                                >
                                </t8t-table>
                            </el-tab-pane>
                            <el-tab-pane label="操作记录" name="lockout_log" :style="{paddingTop:'20px'}">
                                <t8t-table
                                    :columns="columns"
                                    :service="service"
                                    :method="method"
                                    :args="args"
                                    :selectCol="false"
                                >
                                </t8t-table>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 另一个el-dialog放这里 -->
    </div>
</template>

<script>
    import Service from 'src/services/delivery/Service.js'
    import TemplateOperator from 'src/services/delivery/template-base.js'
    import Cookie from 'js-cookie'
    import DateUtils from 'src/utils/DateUtils.js'
    export default{
        data(){
            return {
                fullscreenLoading: false,
                isDialogShow: true,
                isTopHide: false,
                tab_info: 'basic',
                tab_detail: 'lockout_info',
                isLoading_0: false,
                isLoading_1: false,
                reason: '',
                detailInfo:{
                    id:null,
                    projectId:null,
                    reasonDetail: '',
                    delayDays: 0,
                    delayReason:'',
                    delayReasonName: '',
                    delayStatus: null
                },
                columns:[
                    { "prop": "remark", "label": "修改内容" },
                    { "prop": "opTime", "label": "修改时间", "formatter": this.dateParser},
                    { "prop": "username", "label": "修改人" }
                ],
                service: Service.YANSHOU.name,
                method: Service.YANSHOU.methods.projectDelayBillListRecord,
                args:{},
                effectColumns:[
                    { "prop": "nodeTypeName", "label": "节点类型" },
                    { "prop": "timeType", "label": "时间类型", "list": 'timeType'},
                    { "prop": "originTime", "label": "原值", "formatter": this.dateParser},
                    { "prop": "newTime", "label": "新值", "formatter": this.dateParser},
                    { "prop": "createUserName", "label": "操作人" },
                    { "prop": "createTime", "label": "操作时间", "formatter": this.dateParser}
                ],
                effectCommonData:{
                    timeType:[
                        {
                            text:'预计完成时间',
                            value: 1
                        },
                        {
                            text:'实际完成时间',
                            value: 2
                        }
                    ]
                },
                effectMethod: Service.YANSHOU.methods.projectDelayNodeQueryPage,
                effectArgs:null,
                status_arr:{
                    '0': '审核中',
                    '1': '已停工',
                    '2': '已驳回',
                    '3': '已复工'
                }
            }
        },
        created(){
            let procInsId = this.$route.query.procInsId;
            TemplateOperator.projectDelayBillFindDetailByProcessId({processId: procInsId}).then((res) => {
                if(res.data.status === 200){
                    this.detailInfo = Object.assign({},res.data.result);
                    this.effectArgs = {delayId: this.detailInfo.id};
                    this.args = {
                        billCode: res.data.result.billCode
                    }
                }
            })
        },
        methods:{
            closeDialog(){
                this.$router.push({
                    path: '/delivery/delay-bill'
                });
            },
            onTopHide(){
                this.isTopHide = !this.isTopHide;
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
            verify(type){
                if(type === 1 && this.isLoading_0 == false){
                    this.isLoading_1 = true;
                }else if(type === 0 && this.isLoading_1 == false){
                    if(this.reason.trim() === ''){
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '请填写审核意见！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        });
                        return false;
                    }
                    this.isLoading_0 = true;
                }else{
                    return false;
                }
                let data = {
                    id: this.detailInfo.id,
                    approve:type,
                    updateUser: +Cookie.get('t8t-tc-uid'),
                    reason: this.reason,
                    procInsId: this.$route.query.procInsId,
                    taskId: this.$route.query.taskId
                }
                TemplateOperator.projectDelayBillApprove(data).then((res)=>{
                    if(res.data.status === 200){
                        let _this = this;
                        this.$msgbox({
                            title: '消息',
                            type: 'success',
                            message: '操作成功！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain',
                            callback:function(action,instance){
                                _this.closeDialog();
                            }
                        })
                    }else{
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '操作失败！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                    }
                    this.isLoading_1 = false;
                    this.isLoading_0 = false;
                })
            },
        }
    }
</script>

<style lang="css" scoped>
    .full-dialog-tabs-container{ width: 1220px; margin: 0 auto}
    .base{
        padding: 10px;
    }
    .base p{
        display: inline-block;
        width: 300px;
    }
</style>
