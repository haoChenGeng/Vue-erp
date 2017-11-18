<template>
    <div class="durationDialog">
        <el-dialog title="新增工期" size="small" class="t8t-full-dialog durationDialog" v-model="durationDialogVisible" @close="btnCancleClick">
            <div class="my-dialog-container">
                <el-form :label-position="labelPosition"
                         :model="formData"
                         :label-width="formLabelWidth"
                         :rules="rules"
                         ref="durationForm"
                         v-loading.body.lock="durationDialogLoading"
                         @keyup.enter.native="btnOKClick()">
                    <el-form-item prop="id" label="工期ID">
                        <el-input v-model="formData.id" disabled="true" placeholder="系统自动生成"></el-input>
                    </el-form-item>
                    <el-form-item label="业务类型" prop="bizType">
                        <el-select v-model="formData.bizType" placeholder="请选择业务类型" @change="bizTypeChange">
                            <el-option v-for="item in dataSource.bizType" :label="item.text" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="产品包" prop="pkgId">
                        <el-select v-model="formData.pkgId" placeholder="请选择产品包" @focus="pkgClick">
                            <el-option v-for="item in dataSource.pkg" :label="item.text" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="工期天数" prop="manHour">
                        <el-input v-model="formData.manHour" style="width: 70px !important;padding-right: 10px"></el-input>
                        <el-select v-model="formData.manHourType" style="width: 110px">
                            <el-option v-for="item in dataSource.manHourType" :label="item.text" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="日播报次数" prop="broadcastTimes">
                        <el-select v-model="formData.broadcastTimes">
                            <el-option v-for="item in dataSource.broadcastTimes" :label="item.text" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="firstTime" label="早播报时限">
                        <el-input v-model="formData.firstTime"></el-input>
                    </el-form-item>
                    <el-form-item prop="secondTime" label="晚播报时限" v-if="formData.broadcastTimes == 2">
                        <el-input v-model="formData.secondTime"></el-input>
                    </el-form-item>
                    <el-form-item prop="effectTime" label="生效时间">
                        <t8t-datetime-picker v-model="formData.effectTime"></t8t-datetime-picker>
                    </el-form-item>
                </el-form>
                <div class="my-button">
                    <el-button type="primary" @click="btnOKClick" :disabled="submitAble" v-loading.body.lock="submitAble">确定</el-button>
                    <el-button @click="btnCancleClick">取消</el-button>
                </div>
            </div>
    </el-dialog>
    </div>

</template>
<script>
    import Cookie from 'js-cookie'
    import CommonService from 'src/services/commonApi/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import broadcastApi from 'src/services/delivery/broadcast.js'
    export default {
        name: 'duration-dialog',
        components: {
        },
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '100px',
                durationDialogVisible: true,
                formData:{
                    bizType:null,
                    pkgId:null,
                    manHour:null,
                    manHourType:1,
                    broadcastTimes:1,
                    firstTime:null,
                    secondTime:null,
                    effectTime:null,
                    createUser:+Cookie.get('t8t-tc-uid'),
                    createName:Cookie.get('t8t-tc-username'),
                },
                dataSource: {
                    bizType:[],
                    pkg:[],
                    manHourType:[
                        {text:'工作日',value:1},
                        {text:'自然日',value:2},
                    ],
                    broadcastTimes:[
                        {text:'1次',value:1},
                        {text:'2次',value:2},
                    ]
                },
                rules: {
                    bizType: [
                        {
                            required: true,
                            message: '请选择业务类型',
                        },
                    ],
                    pkgId: [
                        {
                            required: true,
                            message: '请选择产品包',
                        },
                    ],
                    manHour:[
                        {
                            type: "integer",
                            required: true,
                            min: 1,
                            transform (val) {
                                return +val;
                            },
                            message:'工期天数为大于0的整数'
                        }
                    ],
                    broadcastTimes:[
                        {
                            required: true,
                            message:'请选择播报次数'
                        }
                    ],
                    firstTime:[
                        {
                            type: "integer",
                            max: 24,
                            min: 1,
                            required: true,
                            transform (val) {
                                return +val;
                            },
                            message:'早播报时限的范围为1-24的整数'
                        }
                    ],
                    secondTime:[
                        {
                            type: "integer",
                            max: 24,
                            min: 1,
                            transform (val) {
                                return +val;
                            },
                            required: true,
                            message:'晚播报时限为1-24的整数'
                        }
                    ],
                    effectTime:[
                        {
                            required: true,
                            message:'请输入生效时间'
                        }
                    ]
                },
                submitAble:false,
                durationDialogLoading:false,
            }
        },
        computed: {},
        created() {
            this.getProperty()
        },
        methods: {
            getProperty(){
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: 11008
                    },
                    size: 100
                }
                let _list = []
                this.durationDialogLoading = true
                commonApi.queryUnionParent(arg).then(res=>{
                    this.durationDialogLoading = false
                    if(res.data.status == 200) {
                        res.data.result.forEach(item => {
                            if(item.propertyStatus) {
                                _list.push({text:item.propertyName,value:item.id})
                            }
                        })
                        this.dataSource.bizType = _list
                    }
                }).catch(error=>{
                    this.durationDialogLoading = false
                })
            },
            getPkg(){
                let args = {
                    "search": {
                        "bizType": this.formData.bizType
                    },
                    "page": 1,
                    "size": 20

                }
                this.durationDialogLoading = true
                broadcastApi.pkgQueryPage(args).then(res => {
                    this.durationDialogLoading = false
                    if(res.data.status == 200) {
                        let _list = []
                        res.data.result.rows.forEach(item =>{
                            _list.push({text:item.pkgName,value:item.id})
                        })
                        this.dataSource.pkg = _list
                    }
                }).catch(()=>{
                    this.durationDialogLoading = false
                })
            },
            btnOKClick(){
                let self = this
                this.$refs['durationForm'].validate(valid => {
                    if (valid) {
                        let formData = Object.assign({}, this.formData)
                        formData.effectTime = Date.parse(formData.effectTime)/1000
                        formData.manHour = parseInt(formData.manHour)
                        formData.firstTime = parseInt(formData.firstTime)
                        formData.secondTime = parseInt(formData.secondTime)
                        self.setSubmitBtn()
                        broadcastApi.broadcastDurationCreate({broadcastDuration: formData})
                            .then(res => {
                                self.setSubmitBtn()
                                if (res.data.status == 200) {
                                    self.$message({
                                        type: 'success',
                                        message: '操作成功'
                                    })
                                    self.$emit('close')
                                    self.$emit('reload')
                                } else {
                                    self.$message({
                                        type: "error",
                                        message: res.data.message || '操作失败'
                                    })
                                }
                            })
                            .catch(error => {
                                self.setSubmitBtn()
                                self.$message({type: "error", message: '服务异常'})
                            })
                    }
                })
            },
            btnCancleClick(){
                this.$emit('close')
            },
            bizTypeChange(val){
                this.dataSource.pkg = []
                this.formData.pkgId = null
                this.getPkg()
            },
            pkgClick(val){
                if(!this.formData.bizType) {
                    this.$message.error("请选择业务类型!")
                    return
                }
            },
            setSubmitBtn(){
                this.submitAble = !this.submitAble
            }

        }
    };
</script>
<style>
    .durationDialog .el-dialog--small {
        width: 350px !important;
    }
</style>
<style lang="css" scoped>
    .my-dialog2-container{
        width: 100%;
        height: 100%;
        height: 100%;
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .my-table{
        display: flex;
        flex:1;
    }
    .my-button{
        padding:10px;
        text-align: center;
        margin: 10px;
    }
    .t8t-search{
        overflow: visible;
    }
    .durationDialog .el-form-item .el-input,.el-select{
        width: 193px;
    }
</style>
