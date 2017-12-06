<template>
    <div>
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new e-receipt-dialog" >
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                            @PRINT="print"
                            @DOWNLOAD="download"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <!-- 表单区 -->
                <div class="full-dialog-form-container container-center">
                    <el-tabs v-model="mainActiveTab" class="e-receipt-tab">
                        <el-tab-pane label="电子收据" name="tab1">
                            <h1>单据编号：{{receiptInfo.code}}</h1>
                        </el-tab-pane>
                    </el-tabs>
                    <div class="e-receipt" id="e-receipt">
                        <el-row>
                            <el-col :span="18">
                                <el-row>
                                    <el-col :span="24" class="e-receipt-header">
                                        <h2>电子收款回单</h2>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <label for="">到账时间：{{receiptInfo.arriveTime}}</label>
                                    </el-col>
                                    <el-col :span="12">
                                        <label for="">支付金额（小写）：RMB {{receiptInfo.arriveAmount}}</label>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <label for="">单据编号：{{receiptInfo.code}}</label>
                                    </el-col>
                                    <el-col :span="12">
                                        <label for="">支付金额（大写）：{{receiptInfo.arriveAmountName}}</label>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <label for="">项目ID：{{receiptInfo.projectId}}</label>
                                    </el-col>
                                    <el-col :span="12">
                                        <label for="">付款人姓名：{{receiptInfo.receiptorName}}</label>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <label for="">支付方式：{{receiptInfo.receiptModeName}}</label>
                                    </el-col>
                                    <el-col :span="12">
                                        <label for="">开户账号：</label>
                                        <img v-if="showPic==1" class="e-receipt-img" width="200px" height="145px" alt="" src="./img/szbx_pic.png"/>
                                        <img v-if="showPic==2" class="e-receipt-img" width="200px" height="145px" alt="" src="./img/t8t_pic.png"/>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="6">
                                <img class="e-receipt-img" width="210px" height="125px" alt="" src="./img/logo.png"/>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import api from 'src/services/finance/bills.js'
    import nzh from 'nzh/cn'
    import html2canvas from 'html2canvas'
    import DateUtils from 'src/utils/DateUtils.js'

    export default {
        name: 'electronic-receipt',
        data() {
            return {
                isDialogShow: true,
                mainActiveTab: 'tab1',
                code: null,
                receiptInfo: {},
                showPic: null
            }
        },
        created() {
            this.code = this.$route.query.code
            this.getReceiptInfo()
        },
        methods: {
            // 打印
            print()
            {
                window.print()
            },
            // 下载
            download()
            {
                html2canvas(document.getElementById("e-receipt"), {
                    onrendered: canvas => {
                        this.exportCanvasAsPNG(canvas, '电子收据')
                    }
                })
            },
            // 关闭页面
            closeDialog()
            {
                window.close();
            },
            // 将 canvas 转为图片
            exportCanvasAsPNG(canvas, fileName) {
                let MIME_TYPE = "image/png";
                let imgURL = canvas.toDataURL(MIME_TYPE);
                let dlLink = document.createElement('a');
                dlLink.download = fileName;
                dlLink.href = imgURL;
                dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
                document.body.appendChild(dlLink);
                dlLink.click();
                document.body.removeChild(dlLink);
            },
            // 获取电子收据信息
            getReceiptInfo()
            {
                if (!this.code) {
                    return
                }
                let args = {
                    page: 1,
                    size: 1,
                    receiptLeftJoinQueryDTO: {
                        code: this.code
                    }
                }
                api.queryFlat(args)
                    .then((res) => {
                        if (res.data.status === 200) {
                            let list = res.data.result.rows ? {...res.data.result.rows[0]}: {}
                            list.arriveAmountName = list.arriveAmount ? nzh.encodeB(list.arriveAmount) : ''
                            list.arriveTime = list.arriveTime>0 ? DateUtils(list.arriveTime*1000, 'isoDate')+' '+DateUtils(list.arriveTime*1000, 'isoTime') : ''
                            this.getImageUrl(list.receiptOrgName)
                            this.receiptInfo = list
                        }
                    })
            },
            getImageUrl(receiptOrgName)
            {
                this.showPic = null
                if (!receiptOrgName) {
                    return ''
                }
                if (receiptOrgName.search(/彬讯/) !== -1) {
                    this.showPic = 1
                }
                else if (receiptOrgName.search(/土巴兔/) !== -1){
                    this.showPic = 2
                }
            }
        }
    }
</script>

<style lang="css">
    .full-dialog-form-container,.container-center {
        padding-top: 60px;
    }
    .e-receipt-dialog .e-receipt {
        width: 750px;
        height: 300px;
        border: 1px solid;
        padding: 0 20px 20px 20px;
        font-size: 14px;
    }
    .e-receipt-dialog .e-receipt-header {
        margin-left: 312px;
    }
    .e-receipt-dialog .e-receipt label {
        height: 30px;
        line-height: 30px;
    }
    @media print {
        body {
            margin: 0
        }
        .e-receipt-tab, .el-dialog__close.el-icon.el-icon-close, .full-dialog-toolbar-container {
            display: none;
        }
    }
    .e-receipt-dialog .e-receipt-img {
        position: absolute;
    }
</style>
