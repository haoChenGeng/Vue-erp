/**
* Created by amos.tong on 2017/11/7.
*/
<template>
    <div class="changeQuoteStatus">
        <el-dialog title="修改报价单状态" class="my-el-dialog selectStandardQuoteItemDialog"
                   v-model="changeQuoteStatusVisible"
                   @close="changeQuoteStatusDialogClose()"
                   size="small"
        >
            <t8t-form-panel
                :dataSource="changeQuoteStatusData"
                :fields="changeQuoteStatusFields"
                :commonData="changeQuoteStatusCommonData"
                ref="mainForm"
            >
            </t8t-form-panel>

            <div slot="footer">
                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <div class="grid-content">
                            <el-button  size="small"  @click="changeQuoteStatusVisible = false">取消</el-button>
                            <el-button  size="small"  type="primary" @click="submit()" >确认</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import projectNode from 'src/services/worker/quoteorder/methods.js'
    export default {
        props:["orderId"],//报价单id：orderId
        name: "changeQuoteStatus",
        components: {},
        data() {
            return {
                orderId:null,
                orderStatus:null,
                changeQuoteStatusVisible: true, //控制页面展示隐藏
//                service: service.order.name,
//                method:  service.order.methods.changeQuoteStatus,
                args:{"orderId":this.orderId,"orderStatus":this.orderStatus},
//                selectQuoteTempItemColumns: [
//                    { "prop":'qiName', "label":'报价项名',resizable:false},
//                    { "prop":'qiUnit', "label":'单位',resizable:false},
//                    { "prop":'craftDetails', "label":'工艺详情',resizable:false},
//                    { "prop":'gdmName', "label":'选品名称',resizable:false},
//                ],
                submitAble:false,
                changeQuoteStatusData:{
                    orderStatus:null
                },
                changeQuoteStatusCommonData:{
                    "orderStatuses":[
                        {
                            text:'完成初稿',
                            value:0
                        },
                        {
                            text:'报价完成',
                            value:6
                        },
                        {
                            text:'已签约',
                            value:7
                        }
                    ]

                },
                changeQuoteStatusFields:[
                    {
                        prop: 'orderStatus',
                        label: '报价单状态',
                        type: 'select',
                        list: 'orderStatuses',
                        rules: [{
                            required: true,
                            message: '请选择状态'
                        }]
                    }
                ]
            }
        },
        created() {

        },
        methods: {

            //关闭窗口
            changeQuoteStatusDialogClose: function () {
                this.$emit('close')
            },
            submit: function (){
                this.$refs['mainForm'].validate((valid)=>{
                    if(valid){
                        let tabObj = this.changeQuoteStatusData
                        let accountId=+Cookie.get('t8t-tc-uid')
                        projectNode.changeQuoteStatus(this.orderId,tabObj.orderStatus, accountId).then( (res) => {
                            //changeQuoteStatusDialogClose()
                            //this.$parent.getTableData()
                            this.changeQuoteStatusVisible=false
                            this.$parent.getTableData()
                        }).catch(e => {
                            debugger
                            return this.$msgbox({
                                'type' : 'error',
                                'message': e || '更新项目状态失败！',
                                'title':'',
                            })
                        })
                    }else{
                        return false
                    }
                })


            },
        }
    }
</script>

<style>
    .selectStandardQuoteItemDialog .el-form-item { width: 300px}
</style>
