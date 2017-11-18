/**
* Created by tomy.li on 2017/5/9.
*/
<template>
    <div>
        <el-dialog title="批量导入报价项" class="g-w-460 my-el-dialog" v-model="importPriceVisible" @close="closeDialog">
            <div class="list-container">
                <el-upload
                    :data="params"
                    class="upload-demo"
                    :action="importURL"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-upload="handleBeforeUpload"
                    :auto-upload="false"
                    ref="upload"
                    :on-success="onSuccess"
                    :file-list="fileList"
                >

                    <el-button size="small" type="primary" icon="upload">上传文件</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传xls文件，且不超过1MB</div>
                </el-upload>
                <br>
                <el-button size="small" @click="downloadTemplate()">下载excel模板</el-button>
            </div>


            <div slot="footer">
                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <div class="grid-content">
                            <el-button  size="small" type="primary" @click="submitUpload()" :disabled="!canUploadSubmit">确认导入</el-button>
                            <el-button  size="small"  @click="closeDialog()">取消</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import { M, mb, getTextById } from 'src/components/t8t-table/utils/utils.js'
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
    import priceMethods from 'src/services/worker/IProductPkgTempPrice/methods.js'
    import priceServices from 'src/services/worker/IProductPkgTempPrice/Service.js'
    import Utils from 'src/utils/Utils.js'
    export default{
        props:['tempCode', "organizes", "productPackages"],
        name: 'addTemp',
        data(){
            return {
                params:{otherArgs:{}},
                importURL: Utils.getImportURL(priceServices.price.name, priceServices.price.methods.createPrice),
                userId:+Cookie.get('t8t-tc-uid'),
                importPriceVisible: true,
                canUploadSubmit:true
            }
        },
        created() {

            //额外的业务参数
            this.params.otherArgs = JSON.stringify({tempCode:this.tempCode,createUser:this.userId,startRow:0})
        },
        methods: {
            submitSearchDialog(obj) {
            },
            closeDialog() {
                this.$emit('close')
                this.importPriceVisible = false
            },
            submitUpload() {
                let uploadObj = this.$refs['upload']
                let fileList = uploadObj.fileList
                let uploadFiles = uploadObj.uploadFiles
                if( uploadFiles.length == 0 ){
                    return  this.$message({
                        'type': 'error',
                        'message': '未选择文件'
                    })
                }
                this.canUploadSubmit = false
                uploadObj.submit()
            },
            onSuccess(response, file, fileList){
                if( response.status == 200 ){
                    this.$message({
                        'type': 'success',
                        'message': '导入成功'
                    })
                    this.closeDialog();
                    this.$parent.$refs['mainTable'].reloadTable()
                    let router = this.$router
                    this.$parent.initTempInfo()
                    //this.$router.go(0)
                }else{

                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: response.result,
                    })

                    let uploadObj = this.$refs['upload']
                    //失败后清除掉文件列表， 避开submit事件只能提交status==ready文件的问题
                    uploadObj.clearFiles()
                    this.canUploadSubmit = true
                }
            },
            handlePreview(file){
            },
            handleRemove(file, fileList) {
            },
            handleBeforeUpload(file){
                const inAllowType = [
                    // ms office
                    'application/vnd.ms-excel',
                    'application/msexcel',
                    'application/excel',

                    //wps
                    'application/kswps',
                    'application/kset',
                    'application/ksdps',

                    //openoffice
                    'application/x-excel',//.xls
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',//.xlsx
                    'text/csv' //csv
                ].indexOf(file.type) > -1;

                const lessThenMaxSize = file.size / 1024 / 1024 < 1;

                if (!inAllowType) {
                    this.$message.error('只能上传excel文件， 请参考下载的模板!');
                }
                if (!lessThenMaxSize) {
                    this.$message.error('上传文件大小不能超过 1MB!');
                }
                return inAllowType && lessThenMaxSize;
            },

            downloadTemplate(){
                this.$parent.downloadTemplate()
            },

            cancel:function (){
                this.importPriceVisible = false
            },

        }
    }

</script>
