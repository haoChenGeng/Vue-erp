<template>
    <!-- 需要另一个el-dialog时并列，不要嵌套 -->
    <!--<el-dialog title="审批流程" size="full" class="my-el-dialog" v-model="isDialogShow" @close="closeDialog">-->
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 steps-container" :class="{'isHide': isTopHide}">
        <div class="t8t-full-dialog2-container">
        <!-- 顶部按钮区 -->
            <!-- 顶部按钮区 -->
            <div class="full-dialog-toolbar-container">
                <div class="toolbar-container">

                </div>
            </div>
            <div class="dialog2-main-container">
                <h1 class="tc">审批流程</h1>
                <!-- 表单区 -->
                <div class="full-dialog-tabs-container">
                    <el-tabs v-model="activeInputTabName">
                        <el-tab-pane label="处理中" name="basic">
                            <div class="steps-wrap" v-if="stepsData.length > 0">
                                <t8t-steps
                                    :stepsData="stepsData"
                                >
                                </t8t-steps>
                            </div>
                            <div class="my-no-flow" v-else>
                                暂无流程
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="已结束" name="other">
                            <div v-if="endStepsData.length > 0">
                                <div class="steps-wrap1" v-for="(endSteps, index) in endStepsData" :class="{active: activeIndex === index}">
                                    <div class="header">
                                        <el-row class="step-page-header">
                                            <el-col :span="23">
                                                <div class="title">
                                                        <el-col :span="6" v-for="(spanText, index2) in endSteps[0].span">{{spanText.text}}</el-col>
                                                </div>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="24">
                                                <el-button type="primary" class="btn" @click="onClick(index)">查看详情</el-button>
                                            </el-col>
                                        </el-row>
                                    </div>
                                    <t8t-steps
                                        :stepsData="endSteps"
                                    >
                                    </t8t-steps>
                                </div>
                            </div>
                            <div class="my-no-flow" v-else>
                                暂无流程
                            </div>

                        </el-tab-pane>
                    </el-tabs>
                </div>
                <!-- 标签页区 -->
            </div>
        <!-- 表单区 -->
        </div>
    </el-dialog>
    <!-- 另一个el-dialog放这里 -->
</template>

<script>

    import Cookie from 'js-cookie'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import axios from 'src/utils/axios'
    //    import Utils from 'src/utils/Utils.js'

    export default {

        name: 'page-purchase-invoice-dialog',
        components: {
        },
        beforeCreate() {
//            let routeNodes = this.$route.path.split('/')
//            pageType = routeNodes[routeNodes.length - 1]
        },
        created() {
            this.reloadTable()
//            let _this = this
        },
        data () {
            return {
                activeInputTabName: "basic",
                isDialogShow: true,
                stepsData: [],
                endStepsData: [],
                activeIndex: null,
                endFormater: "yyyy-mm-dd HH:MM:ss"
            };
        },
        props: {
            args: Object,
            service: String,
            method: String,
            dataSource: {
                type: Array,
                default() {
                    return []
                }
            },
        },
        methods: {
            onClick(index) {
                if(this.activeIndex === index) {
                    this.activeIndex = null
                    return
                }
                this.activeIndex = index
            },

            closeDialog() {
                this.isDialogShow = false
                this.$emit('close')
            },

            reloadTable() {
                let self = this
                let args = self.args || {}
                if (self.service && self.method && !self.isEmptyObject(args)) {
                    this.loading = true
                    axios({
                        service: self.service,
                        method: self.method,
                        args: args
                    })
                        .then((res) => {
                            this.loading = false
                            let response = res.data
                            if (response.status == 200) {
                                self.dataSource = res.data.result;
                                self.$emit('data-loaded', self.dataSource)
                            } else {
                                self.dataSource = []
                            }
                        })
                        .catch((res) => {
                            // TODO 数据加载失败
                            this.loading = false
                            console.log("Data load failed.", res)
                            // self.$message.error('表格数据加载失败')
                        })
                } else {
                    // TODO 没有传service和method参数处理
                    self.updateDataSource(self.dataSource);
                }
            },
            isEmptyObject(obj){
                for(var key in obj){
                    return false;
                }
                return true;
            },
            //遍历内容
            updateDataSource(dataSource = null){
                if(dataSource.length > 0){
                    dataSource.forEach((val)=>{
                        let endSteps = []
                        let markKey = val.markKey == undefined ? '' : val.markKey
                        let startName = val.startName == undefined ? val.starter : val.startName
                        let startTime = val.startTime > 0 ? DateUtils(val.startTime * 1000, this.endFormater) : ''
                        let top = {}
                        top.title = "流程起始"
                        top.span = [
                            {
                                text: '审批流程ID：' + val.insId
                            },
                            {
                                text: '发起时间：' + startTime
                            },
                            {
                                text: '单据编码：' + markKey
                            },
                            {
                                text: '发起人：' + startName
                            }
                        ];
                        val.end === true ? endSteps.push(top) : this.stepsData.push(top);

                        let tashLenght = val.taskDetail.length;
                        val.taskDetail.forEach((item,key)=>{
                            let detail = {}
                            detail.title = item.taskName
                            let executeName =  item.executeUser ? item.executeName && item.executeName.length ? item.executeName : item.executeUser : null
                            let assigneeName = item.assignee ? item.assigneeName ? item.assigneeName : item.assignee : null
                            executeName = executeName || assigneeName
                            let commentTime = item.commentTime > 0 ? DateUtils( item.commentTime * 1000, this.endFormater) : ''
                            let createTime = item.createTime > 0 ? DateUtils( item.createTime * 1000, this.endFormater) : ''
                            let comment = item.comment ? item.comment : ''
                            detail.span = [
                                {
                                    text: '流程任务ID：'+ item.taskId
                                },
                                {
                                    text: ' 生成时间：'+ createTime
                                },
                                {
                                    text: '处理时间：'+ commentTime
                                },
                                {
                                    text: '处理人：'+ executeName
                                },
                                {
                                    text: '审批意见：'+ comment
                                }
                            ]
                            if(val.end === true) {
                                if(val.audit === false) {
                                    detail.status = 'error'
                                }
                                endSteps.push(detail)
                            }else{
                                if(val.audit === false) {
                                    detail.status = 'error'
                                }
                                this.stepsData.push(detail)
                                if(key == tashLenght -1) {
                                    val.suspend === true ? detail.status = 'suspend' : detail.status = 'process'
                                }
                            }
                        })
                        let end = {}
                        end.title = "流程结束"
                        val.end === true ? endSteps.push(end) : '';
                        val.end === true ? this.endStepsData.push(endSteps) : '';
                    })
                }

            }

        },
        watch: {
            args(val) {
                this.reloadTable(val)
            },
            dataSource(val) {
                this.updateDataSource(val);
            }
        },
    };
</script>
<style lang="css" scoped>
    .tc{
        text-align: center;
    }
    .steps-wrap{
        width: 1200px;
        margin: 0 auto;
        word-break: break-all;
        word-wrap: break-word;
    }
    .steps-wrap1{
        width: 1200px;
        margin: 25px auto;
        border: 1px solid gray;
        padding: 20px 50px;

    }
    .steps-wrap1 .t8t-steps{
        display: none;
    }
    .steps-wrap1.active .t8t-steps{
        display: block;
    }
    .header{
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .btn{
        /*margin-right: 20px;*/
    }
    .title{
        font-size: 16px;
    }
    .my-no-flow{
        text-align: center;
        margin-top: 40px;
        font-size:20px;
        font-weight: bold;
    }
    .step-page-header{
        display: flex;
        align-items: center;
        min-height: 48px;
        width:1100px;
    }
</style>
<style>
    .steps-container.t8t-full-dialog2 .el-tabs__header {
        border-top: none;
    }
</style>
