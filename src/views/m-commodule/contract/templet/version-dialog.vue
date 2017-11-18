<template>
    <div>
        <el-dialog title="版本叠加" class="version-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :label-position="labelPosition" :model="formData" :label-width="formLabelWidth" :rules="rules" ref="createForm" @keyup.enter.native="btnOKClick()">
                <el-form-item label="描述" prop="discrible">
                    <el-input class="miaoshu" v-model="formData.discrible" maxlength="30" placeholder="请输入描述(30字内)"></el-input>
                </el-form-item>
                <div class="firstbox">
                <el-form-item label="超时作废周期" prop="cycle" class="week">
                    <el-input v-model="formData.cycle" class="endtime"> </el-input> 天
                </el-form-item>
                <el-form-item label="启用时间" prop="startTime" class="time" >
                    <el-date-picker v-model="formData.startTime" type="date" class="startTime" placeholder="请选择启用时间" :picker-options="pickerOptions"></el-date-picker>
                </el-form-item>
                </div>
                 <div class="secondbox"  v-if="(styleValue==02)||(styleValue==03)||(styleValue==04)">
                    <div class="secondposition">甲方签署位置：</div>
                    <el-form-item label="页码" prop="secondym" class="secondym">
                        <el-input v-model="formData.secondym" class="endtime"></el-input>
                    </el-form-item>
                    <el-form-item label="X轴"  prop="secondxz" class="secondxz" >
                        <el-input  v-model="formData.secondxz" class="endtime"> </el-input>
                    </el-form-item>
                    <el-form-item label="Y轴"  prop="secondyz" class="secondyz" >
                        <el-input v-model="formData.secondyz" class="endtime"> </el-input>
                    </el-form-item>
                </div>
                <div class="thirdbox" v-if="(styleValue==03)||(styleValue==04)">
                    <div class="thirdposition">乙方签署位置：</div>
                    <el-form-item label="页码" prop="thirdym" class="thirdym">
                        <el-input  v-model="formData.thirdym" class="endtime" > </el-input>
                    </el-form-item>
                    <el-form-item label="X轴" prop="thirdxz" class="thirdxz">
                        <el-input  v-model="formData.thirdxz" class="endtime"> </el-input>
                    </el-form-item>
                    <el-form-item label="Y轴" prop="thirdyz" class="thirdyz">
                        <el-input  v-model="formData.thirdyz" class="endtime"> </el-input>
                    </el-form-item>
                </div>
                <div class="thirdbox" v-if="styleValue==04">
                    <div class="thirdposition">丙方签署位置：</div>
                    <el-form-item label="页码" prop="fourym" class="thirdym">
                        <el-input  v-model="formData.fourym" class="endtime" > </el-input>
                    </el-form-item>
                    <el-form-item label="X轴" prop="fourxz" class="thirdxz">
                        <el-input  v-model="formData.fourxz" class="endtime"> </el-input>
                    </el-form-item>
                    <el-form-item label="Y轴" prop="fouryz" class="thirdyz">
                        <el-input  v-model="formData.fouryz" class="endtime"> </el-input>
                    </el-form-item>
                </div>

                <div class="tishi">
                页码为签章页，X为图片左边距和宽度占比，Y为图片上边距和高度占比。
                </div>

                <div class="my-container">
                    <div class="my-toolbar">
                        <el-button
                            type="primary"
                            size="small"
                            icon="plus"
                            @click="add()"
                        >新增行</el-button>
                        <el-button
                            type="danger"
                            size="small"
                            icon="close"
                            @click="del()"
                        >删除行</el-button>
                    </div>
                        <t8t-table
                            ref="t8ttable"
                            :columns="columns"
                            :commonData="commonOptionsConfig"
                            :templateData="templateData"
                            :selectCol="true"
                            :indexCol="true"
                            :editable="true"
                            :pageBar="false"
                            @cell-form-item-change="getValue"
                            @cell-click="clickValue"
                        >
                        </t8t-table>
                </div>
                <div class="form-item-container upload">
                    <el-form-item label="附件：" prop="versionUrl">
                        <el-upload
                            ref="fileRef"
                            :action="uploadURL"
                            :data="{bucket:'scm', module: 't8t-esm/commodule'}"
                            :show-file-list="true"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            v-model="formData.versionUrl"
                            :before-upload="beforeAvatarUpload"
                        >
                             <el-button size="small">上传附件</el-button>
                        </el-upload>
                    </el-form-item>
                </div>
            </el-form>

            <div slot="footer" class="dialog-footer" v-if="!editable">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading">确定</el-button>
                <el-button @click="btnCancleClick()">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import Utils from 'src/utils/Utils.js'
    import Cookie from 'js-cookie'
    import Service from 'src/services/commodule/Service.js'
    import apiTempletSee from 'src/services/commodule/templet.js'
    export default {
        name: 'version-dialog',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                fileUrl:null,
                isLoading: false,
                code:'',
                styleValue:null,
                fileName:null,
                fileNum:0,
                pickerOptions: {
                    disabledDate(time) {
                    return time.getTime() < Date.now() + 24*60*60;
                        }
                },
                rules: {
                    discrible: [
                        {required: true , message: "请输入描述"},

                    ],
                    cycle:[
                        {pattern: /^[1-9]\d{0,2}$/,message: "1-999整数"}
                    ],
                    startTime: [
                        {required: true , message: "请选择启用时间"}
                    ],
                    secondym: [
                        {required: true , message: "请输入页码"},
                        {pattern: /^[1-9]\d{0,4}$/,message: "1-999整数"}
                    ],
                    secondxz: [
                        {required: true , message: "请输入X轴"},
                        {pattern: /^[01]$|^[0]\.[0-9]{1,3}$/,message: "0-1三位小数"}
                    ],
                    secondyz: [
                        {required: true , message: "请输入Y轴"},
                        {pattern: /^[01]$|^[0]\.[0-9]{1,3}$/,message: "0-1三位小数"}
                    ],
                    thirdym: [
                        {required: true , message: "请输入页码"},
                        {pattern: /^[1-9]\d{0,2}$/,message: "1-999的整数"}
                    ],
                    thirdxz: [
                        {required: true , message: "请输入X轴"},
                        {pattern: /^[01]$|^[0]\.[0-9]{1,3}$/,message: "0-1三位小数"}
                    ],
                    thirdyz: [
                        {required: true , message: "请输入Y轴"},
                        {pattern: /^[01]$|^[0]\.[0-9]{1,3}$/,message: "0-1三位小数"}
                    ],
                    fourym: [
                        {required: true , message: "请输入页码"},
                        {pattern: /^[1-9]\d{0,2}$/,message: "1-999的整数"}
                    ],
                    fourxz: [
                        {required: true , message: "请输入X轴"},
                        {pattern: /^[01]$|^[0]\.[0-9]{1,3}$/,message: "0-1三位小数"}
                    ],
                    fouryz: [
                        {required: true , message: "请输入Y轴"},
                        {pattern: /^[01]$|^[0]\.[0-9]{1,3}$/,message: "0-1三位小数"}
                    ],
                    versionUrl: [
                        {required: true , message: "请上传附件"}
                    ]
                },
                //辅助资料配置
                commonOptionsConfig: {
                    rule: [], // 业务类型
                    _ruleContent:[],
                    ruleContent:[],
                    ruleAndContent:[{
                        value: 'zhinan',
                        label: '指南',
                        children: [{
                            value: 'shejiyuanze',
                            label: '设计原则',
                            children: [{
                            value: 'yizhi',
                            label: '一致'
                            }, {
                            value: 'fankui',
                            label: '反馈'
                            }]
                        }, {
                            value: 'daohang',
                            label: '导航',
                            children: [{
                            value: 'cexiangdaohang',
                            label: '侧向导航'
                            }, {
                            value: 'dingbudaohang',
                            label: '顶部导航'
                            }]
                        }]
                    }],
                nameList:{},
                },
                templateData: {
                    "rule": null,
                    "ruleContent": null,
                },
                //表单
                formData: {
                    discrible: null,
                    cycle : null,
                    startTime: null,
                },
                columns:[{
                    "prop": "rule",
                    "label": "规则",
                    "list": "rule",
                    "sortable": false,
                    "editor": {
                        "type": "select",
                        "rules": [{
                            "required": true,
                            "message": "不能为空"
                        }]
                    }
                }, {
                    "prop": "ruleContent",
                    "label": "规则内容",
                    "list": "ruleContent",
                    "sortable": false,
                    "editor": {
                        "list":"_ruleContent",
                        "type": "select",
                        "rules": [{
                            "required": true,
                            "message": "不能为空"
                        }]
                    }
                }],
                uploadURL: Utils.getUploadURL()
            }
        },
        props: ['basicId','firstRoleId','secondRoleId','thirdRoleId','contractTypeId'],
        computed: {
            dialogVisible() {
                return true
            },
        },
        created() {
            // 规则
            this.getCommonOptions('393','rule')
            this.getCommonOptions('39301','ruleContent',true)
            this.getCommonOptions('39302','ruleContent',true)
            this.getCommonOptions('39303','ruleContent',true)
            this.getNameList('39103')
            this.isFileNum();
        },
        mounted() {

        },
        methods: {
            changeOrganizationName(value) {
                for(let i = 0; i < this.organizationCode.length;i++) {
                    if (value===this.organizationCode[i].value) {
                        this.formData.organizationName = this.organizationCode[i].text
                    };
                }
            },
            btnOKClick(createForm) {
                this.$refs['createForm'].validate(valid=>{
                    if (valid) {
                        this.isLoading = true
                        var formData = this.formatFormData()
                        var rows = this.fromatRows()
                        var firstRoleId = this.firstRoleId
                        var secondRoleId = this.secondRoleId
                        var thirdRoleId = this.thirdRoleId
                        var basicId = this.basicId
                        var args = {
                            'modelVersion':{
                                'basicId':basicId,
                                'description':formData.discrible,
                                'overTime':formData.cycle,
                                'state':1,
                                'useTime':formData.startTime,
                                'addName':this.fileName,
                                'addUrl':formData.versionUrl,
                                'ruleIds':rows,
                                'createUser':Cookie.get('t8t-tc-uid'),
                            }
                        }
                        args['modelVersion']['signPosition'] = {}
                        if((this.styleValue=='02')||(this.styleValue=='03')||(this.styleValue=='04')){
                            args['modelVersion']['signPosition'][firstRoleId] = {
                                        'pagenum':formData.secondym,
                                        'pageX':formData.secondxz,
                                        'pageY':formData.secondyz,
                                    }
                        }
                        if((this.styleValue=='03')||(this.styleValue=='04')){
                            args['modelVersion']['signPosition'][secondRoleId] = {
                                        'pagenum':formData.thirdym,
                                        'pageX':formData.thirdxz,
                                        'pageY':formData.thirdyz,
                                    }
                        }
                        if(this.styleValue=='04'){
                            args['modelVersion']['signPosition'][thirdRoleId] = {
                                        'pagenum':formData.fourym,
                                        'pageX':formData.fourxz,
                                        'pageY':formData.fouryz,
                                    }
                        }
                        apiTempletSee.createModelVersion(args)
                        .then((res) => {
                        if(res.data.status === 200 && res.data.result === 1){
                            // 新增成功
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '提交成功',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.isLoading = false
                            this.btnCancleClick()
                            this.$emit('success')
                        }else if(res.data.status === 200 && res.data.result === 2){

                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '提交成功但附件字段有问题',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.isLoading = false
                            this.btnCancleClick()
                            this.$emit('success')

                        }else if(res.data.status === 200 && res.data.result === 3){

                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '提交成功,但附件中变量多于字库中变量，请检查词库后补充附件',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.isLoading = false
                            this.btnCancleClick()
                            this.$emit('success')

                        }else if(res.data.status === 200 && res.data.result === -1){

                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '提交失败',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.isLoading = false
                            this.btnCancleClick()
                            this.$emit('success')

                        }
                        else{
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: res.data.message,
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.isLoading = false
                            this.btnCancleClick()
                            this.$emit('success')
                        }
                    })
                    }
                    else {
                        return false
                    }
                })
            },
            btnCancleClick() {
                this.$refs['createForm'].resetFields();
                this.$emit('close')
            },
             //辅助资料
            getCommonOptions: function(fatherCode,selectName,assign=false) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                apiCommon.queryUnionParent(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus===1) {

                                if (assign) {
                                        this.commonOptionsConfig[selectName].push({
                                        pid:fatherCode,
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                } else {
                                        list.push({
                                        value: item.propertyCode,
                                        text: item.propertyName
                                    })
                                    this.commonOptionsConfig[selectName] = list
                                }

                            };
                        })


                    }
                })
            },
            getNameList: function(fatherCode) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                apiCommon.queryUnionParent(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus===1) {
                                this.commonOptionsConfig.nameList[item.id] = item.propertyCode

                            };
                        })
                        this.styleValue =  this.commonOptionsConfig.nameList[this.contractTypeId]
                    }
                })
            },
            handleSuccess(res, fileList) {
                if(res.status === 200){
                    this.fileNum ++
                    this.formData.versionUrlId = res.result.id
                    this.formData.versionUrl = res.result.filePath

                    /*let fileUrl = res.result.filePath
                    let args = {
                        'fileUrl' : fileUrl
                    }
                    apiTempletSee.getSaveFile(args)
                    .then((fileres) => {
                    if (fileres.data.status === 200) {
                        this.formData.versionUrl = fileres.data.result
                        this.$refs['createForm'].validateField('versionUrl')
                        }
                    })*/
                }else if(res.status === 613){
                    this.$refs['fileRef'].clearFiles()
                    this.$message.error('请检查文件后缀(小写)！')
                }
                this.isFileNum()
            },
            beforeAvatarUpload(file)
            {

                this.fileName = file.name
                let strr = file.name
                let str = strr.substring(strr.lastIndexOf('.')+1)
                if( str !== 'docx')
                {
                    this.$refs['fileRef'].clearFiles()
                    this.$message.error('只能上传docx文件！')
                }
            },

            formatFormData(){
                var ret = Object.assign({}, this.formData)
                ret.startTime = +Date.parse(ret.startTime).toString().substr(0,10)
                return ret
            },
            fromatRows(){
                let str = ""
                let addedRows = this.$refs['t8ttable'].getActionLog(false).addedRows
                let rows = [].concat(addedRows)
                for(let i = 0; i < rows.length; i++){

                    str = rows[i]['ruleContent'] + ',' + str
                }
                if(str.length > 0)
                {
                    str = str.substr(0,str.length - 1)
                }
                return str
            },
            handleRemove(file, fileList)
            {
                if(file)
                {
                    this.fileNum --
                }
                this.isFileNum()
            },


                //处理选择行变化
            add() {
                this.$refs['t8ttable'].addNewRow()
            },

            del() {
                this.$refs['t8ttable'].delRows()
            },

            clickValue(row, column,cell) {
                let rule = row.rule
                let ruleContent = this.commonOptionsConfig.ruleContent
                this.commonOptionsConfig._ruleContent=ruleContent.filter((item)=>{
                    return item.pid==rule
                })

            },
            isFileNum()
            {
                if(this.fileNum >= 2){
                    this.$refs['imgRef'].clearFiles()
                    this.$message.error('只能上传一个文件！')
                    this.fileNum = 0
                }
            }

        }
    }

</script>

<style lang="css" scoped>
.el-form
{
    position: relative;
}
.miaoshu
{
    width: 450px !important;
}
.endtime
{
    width: 75px !important;
}
.time
{
    margin-left: 12px;
}
.startTime
{
    width: 180px !important;
}
.my-container
{
    margin-left: 80px;
    display: flex;
    flex: 1;
    flex-direction: column;
}
.firstbox
{
   width: 540px;
   height: 34px;
   margin-bottom: 22px;
   margin-left: 47px;
}
.firstbox .el-form-item
{
    float: left;
}
.secondbox
{
    width: 540px;
    height: 34px;
    margin-bottom: 22px;
    margin-left: 50px;
    position: relative;
}

.secondposition
{
    position: absolute;
    left: 32px;
    top:8px;
}
.secondym
{
    position: absolute;
    left: 125px;
    top:0px;
}
.secondxz
{
    position: absolute;
    left: 265px;
    top:0px;
}
.secondyz
{
    position: absolute;
    left: 395px;
    top:0px;
}
.thirdbox
{
    width: 540px;
    height: 34px;
    margin-bottom: 22px;
    margin-left: 50px;
    position: relative;
}
.thirdposition
{
    position: absolute;
    left: 32px;
    top:8px;
}
.thirdym
{
    position: absolute;
    left: 125px;
    top:0px;
}
.thirdxz
{
    position: absolute;
    left: 265px;
    top:0px;
}
.thirdyz
{
    position: absolute;
    left: 395px;
    top:0px;
}
.upload
{
    margin-left: 10px;
    margin-top: 10px;
    width: 557px;
}

.my-container
{
    min-height: 203px;
    max-height: 250px;
}
.tishi
{
    margin-left: 80px;
    margin-bottom: 22px;
    color: #8391a5;
}





</style>
<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css">
.version-dialog .el-dialog__header
{
    padding: 30px 20px 20px;
    text-align: center;
}
.version-dialog .el-dialog{
    width: 700px;
}
.version-dialog .secondbox .el-form-item .el-form-item__label
{
    width: 50px !important;
}
.version-dialog .secondbox .el-form-item .el-form-item__content
{
    margin-left: 50px !important;
}
.version-dialog .thirdbox .el-form-item .el-form-item__label
{
    width: 50px !important;
}
.version-dialog .thirdbox .el-form-item .el-form-item__content
{
    margin-left: 50px !important;
}
.version-dialog .table-container
{
    margin-top: 10px;
    width: 492px;
}



</style>
