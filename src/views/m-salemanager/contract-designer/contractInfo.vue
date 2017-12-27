/**
* Created by tomy.li on 2017/12/12.
*/
<template>
    <div class="contractInfo">
        <el-dialog title="合同详情"  class="g-w-1000 my-el-dialog contractInfoDialog"
                   v-model="contractInfoVisible"
                   @close="contractInfoDialogClose"
        >
            <el-row>
                <el-col :span="6">
                    <span>合同状态：{{contractInfo.contractStatusName}}</span>
                </el-col>

            </el-row>

            <el-tabs>
                <el-tab-pane label="施工合同">
                   <!-- <el-row :gutter="20">
                        <el-col :span="6"
                        v-for="item in contractInfo.orderImg.split(';')"><img width="100" height="100" :src="'http://pic.to8to.com/'+item" /></el-col>
                    </el-row>-->
                    <div class="hello">
                        <t8t-gallery :data="galleryData" :showThumb="true" :width="120"></t8t-gallery>
                    </div>
                </el-tab-pane>
            </el-tabs>

            <el-tabs>
                <el-tab-pane label="装修保合同">
                    <div id="pdf" class="contractInfoPdf"></div>
                </el-tab-pane>
            </el-tabs>
            <!--待签支持重新发起-->
            <div style="text-align: center; padding: 30px " >
                <!--<el-button @click="againCreateOrder">查看合同详情</el-button>-->
                <div style="margin: 5px;" v-if="contractInfo.isSign == 1"><el-checkbox  v-model="contractChecked">我已阅读完全部装修保合同，确定合同内容无误</el-checkbox></div>
                <el-button @click="againCreateOrder" v-if="contractInfo.contractStatus == 2 || isCanReCreate" :loading="resigning" :disabled="resigning">重新发起签约</el-button>
                <el-button @click="sign" :loading="signing" :disabled="signing || !contractChecked" v-if="contractInfo.isSign == 1" type="primary">签约</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import PDFObject from 'src/utils/pdfobject.js'
    import contractDesigner from 'src/services/salemanager/contractDesigner.js'
    import config from 'src/views/m-salemanager/contract-designer/config.js'
    import Cookie from 'js-cookie'
    import Utils from 'src/utils/Utils.js'
    export default {
        name: "contractInfo",
        props: ["projectId","sourceProjectId"],
        data () {
            return {
                projectId: null,
                sourceProjectId: null,
                contractInfo:{

                },
                galleryData:[],
                contractInfoVisible: true, //控制页面展示隐藏
                signing: false,//是否正在签署
                resigning: false,//是否正在重新签署
                contractChecked:false,//是否已阅读合同
                isCanReCreate: false,//是否可以重新发起合同。 查询电子签合同异常,未发现有效的电子签合同时，允许重新发起，不然没法闭环
            }
        },
        created () {
            this.getContractInfo()
        },
        methods: {
            //关闭窗口
            contractInfoDialogClose: function () {
                this.$emit('close')
            },
            getContractInfo: function () {
                contractDesigner.getImage(this.projectId).then(res => {
                    this.contractInfo = res
                    let contractStatus = config.contractStatus.filter(e => {
                        return e.value == res.contractStatus
                    })
                    if( contractStatus.length ){
                        this.contractInfo.contractStatusName = contractStatus[0].text
                    }


                    if( this.contractInfo.orderImg && this.contractInfo.orderImg.split(';').length > 0 ){
                        this.contractInfo.orderImg.split(';').forEach((item,index) => {
                            this.galleryData.push({
                                title: '', src: 'http://pic.to8to.com/'+item
                            })
                        })
                    }
                    PDFObject.embed(Utils.getPreviewURL(res.pdfImg), "#pdf")
                }).catch(e => {
                    this.isCanReCreate = true
                    this.$msgbox({
                        type: 'error',
                        title: '出错',
                        message: e.message
                    })
                })
            },
            againCreateOrder:function (){


                let _this = this
                this.$confirm('您确认要重新发起合同吗？', '重新发起确认', {
                    type: 'warning',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消'
                }).then(() => {

                    _this.resigning = true
                    contractDesigner.againCreateOrder(
                        _this.projectId,
                        _this.sourceProjectId,
                        +Cookie.get('t8t-tc-uid')).then(res => {
                        _this.contractInfoDialogClose()
                        _this.resigning = false
                        _this.$router.push({
                            'path':'/tuchat-sale-manage/contract-designer-detail',
                            query:{
                                yid:_this.projectId
                            }
                        })
                    }).catch(e => {
                        _this.resigning = false
                        _this.$msgbox({
                            type: 'error',
                            title: '不能重新发起合同',
                            message: e
                        })
                    })

                }).catch(() => {

                })

            },

            //签署合同
            sign:function (){
                let _this = this
                _this.signing = true
                contractDesigner.sign(this.sourceProjectId,this.projectId,  +Cookie.get('t8t-tc-uid')).then(res => {

                    _this.$msgbox({
                        type:'success',
                        title:'签署成功',
                        message:'装修公司签署合同成功',
                        callback:function(action, instance){

                            //返回合同列表
                            _this.signing = false
                            _this.$parent.$refs['t8tTable'].reloadTable()
                            _this.contractInfoDialogClose()
                        }
                    })
                }).catch(e => {
                    _this.signing = false
                    return _this.$msgbox({
                        type: 'error',
                        title: '不能发起合同',
                        message: e
                    })
                })
            },
        },


    }
</script>
<style>
  /*  .t8t-viewer-pic{
        width:100px;
        height:100px;
    }*/
    .contractInfoPdf{
        height:400px
    }
</style>
