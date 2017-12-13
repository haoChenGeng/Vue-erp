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
                            <el-tab-pane label="停工信息" name="lockout_info">
                                <div style="padding-top: 20px;">
                                    <el-form ref="form" :model="detailInfo" label-width="100px">
                                        <el-form-item label="状态：">
                                            {{status_arr[detailInfo.shutdownStatus]}}
                                        </el-form-item>
                                        <el-form-item label="停工天数：">
                                            {{detailInfo.shutdownDays}}天
                                        </el-form-item>
                                        <el-form-item label="停工原因：">
                                            {{detailInfo.shutdownReasonName}}
                                        </el-form-item>
                                        <el-form-item label="停工原因描述：">
                                            <el-input :style="{width:'300px'}" disabled type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="detailInfo.reasonDetail"></el-input>
                                        </el-form-item>
                                    </el-form>
                                </div>
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
    export default{
        data(){
            return {
                fullscreenLoading: false,
                isDialogShow: true,
                isTopHide: false,
                tab_info: 'basic',
                tab_detail: 'lockout_info',
                detailInfo:{
                    id:null,
                    projectId:null,
                    reasonDetail: '',
                    shutdownDays: 0,
                    shutdownReason:'',
                    shutdownReasonName: '',
                    shutdownStatus: null
                },
                columns:[
                    { "prop": "remark", "label": "修改内容" },
                    { "prop": "opTime", "label": "修改时间", "formatter": 'dateParser'},
                    { "prop": "username", "label": "修改人" }
                ],
                service: Service.YANSHOU.name,
                method: Service.YANSHOU.methods.projectShutdownListRecord,
                args:{billCode: this.$route.query.billCode},
                status_arr:{
                    '0': '审核中',
                    '1': '已停工',
                    '2': '已驳回',
                    '3': '已复工'
                }
            }
        },
        created(){
            let billCode = this.$route.query.billCode;
            TemplateOperator.projectShutdownFindDetailByCode({billCode: billCode}).then((res) => {
                if(res.data.status === 200){
                    this.detailInfo = Object.assign({},res.data.result);
                }
            })
        },
        methods:{
            closeDialog(){
                this.$router.push({
                    path: '/tuchat-delivery/lockout-bill'
                });
            },
            onTopHide(){
                this.isTopHide = !this.isTopHide;
            }
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
