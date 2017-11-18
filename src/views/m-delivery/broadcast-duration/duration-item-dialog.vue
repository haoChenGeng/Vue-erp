<template>
    <div class="durationItemDialog">
        <el-dialog :title="title" size="small" class="t8t-full-dialog durationItemDialog"
                   v-model="durationDialogVisible" @close="btnCancleClick">
            <div class="duration-item-dialog-container">
                <el-form :label-position="labelPosition"
                         :model="formData"
                         :label-width="formLabelWidth"
                         :rules="rules"
                         v-loading.body.lock="durationDetailLoading"
                         ref="durationForm">
                    <el-form-item prop="goodsId" label="SKU ID">
                        <el-select
                            v-model="formData.skuId"
                            filterable
                            remote
                            placeholder="请选择商品"
                            @change="handleSelect"
                            :remote-method="querySearchAsync">
                            <el-option
                                v-for="item in searchOptions"
                                :key="item.value"
                                :label="item.value"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                        <el-input v-model="formData.goodsId" style="display: none"></el-input>
                    </el-form-item>
                    <el-form-item label="所属工期">
                        <el-input v-model="formData.durations" disabled="true"></el-input>
                        <el-input v-model="formData.durationId" disabled="true" style="display: none"></el-input>
                    </el-form-item>
                    <el-form-item label="工期天数">
                        <el-input v-model="formData.manHour" disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="施工阶段" prop="taskStatus">
                        <el-select v-model="formData.taskStatus" placeholder="请选择施工阶段">
                            <el-option v-for="item in dataSource.taskStatus" :label="item.text" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="goodsName" label="商品名称">
                        <el-input v-model="formData.goodsName" disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item prop="startTime" label="开始时间">
                        <el-input v-model="formData.startTime"></el-input>
                    </el-form-item>
                    <el-form-item prop="endTime" label="完工时间">
                        <el-input v-model="formData.endTime"></el-input>
                    </el-form-item>
                    <el-form-item prop="startPictureLabel" label="开工图片">
                        <el-tag
                            class="duration-tag"
                            :key="tag"
                            v-for="tag in startTags"
                            :closable="true"
                            :close-transition="false"
                            @close="handleClose(tag,'start')"
                        >
                            {{tag}}
                        </el-tag>
                        <el-input
                            class="duration-new-tag"
                            v-if="startInputVisible"
                            v-model="startInputValue"
                            ref="startTagInput"
                            size="mini"
                            @keyup.enter.native="handleInputConfirm('start')"
                            @blur="handleInputConfirm('start')"
                        >
                        </el-input>
                        <el-button v-else-if="startTags.length < 9"class="button-new-tag" size="small" @click="showInput('start')"><i
                            class="el-icon-plus"></i></el-button>
                    </el-form-item>
                    <el-form-item prop="endPictureLabel" label="完工图片">
                        <el-tag
                            class="duration-tag"
                            :key="tag"
                            v-for="tag in endTags"
                            :closable="true"
                            :close-transition="false"
                            @close="handleClose(tag,'end')"
                        >
                            {{tag}}
                        </el-tag>
                        <el-input
                            class="duration-new-tag"
                            v-if="endInputVisible"
                            v-model="endInputValue"
                            ref="endTagInput"
                            size="mini"
                            @keyup.enter.native="handleInputConfirm('end')"
                            @blur="handleInputConfirm('end')"
                        >
                        </el-input>

                        <el-button v-else-if="endTags.length < 9" class="button-new-tag" size="small" @click="showInput('end')">
                            <i class="el-icon-plus"></i>
                        </el-button>
                    </el-form-item>
                </el-form>
                <div class="my-button">
                    <el-button
                        type="primary"
                        @click="btnOKClick"
                        :disabled="submitAble"
                        v-loading.body.lock="submitAble"
                    >确定
                    </el-button>
                    <el-button
                        @click="btnCancleClick"
                    > 取消
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </div>

</template>
<script>
    import Cookie from 'js-cookie'
    import DateUtils from 'src/utils/DateUtils.js'
    import CommonService from 'src/services/commonApi/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import broadcastApi from 'src/services/delivery/broadcast.js'
    import axios from 'src/utils/axios.js'

    export default {
        name: 'duration-item-dialog',
        data() {
            return {
                goodsList:[],
                title: "新增工序",
                labelPosition: 'right',
                formLabelWidth: '100px',
                durationDialogVisible: true,
                formData: {
                    id:null,
                    durationId:null,
                    goodsId:null,
                    taskStatus:null,
                    startTime:null,
                    endTime:null,
                    startPictureLabel:null,
                    endPictureLabel:null,
                    goodsName:null,
                    skuId:null,
                    manHour:null,
                    durations:null,
                },
                dataSource: {
                    taskStatus: [],
                },
                rules: {
                    goodsId: [
                        {
                            required: true,
                            message: '请选择正确的商品',
                        },
                    ],
                    taskStatus: [
                        {
                            required: true,
                            message: '请选择施工阶段',
                        },
                    ],
                    startTime: [
                        {
                            type: "integer",
                            min:1,
                            required: true,
                            message: '开始时间为大于0的整数',
                            transform (val) {
                                return +val;
                            },
                        }
                    ],
                    endTime: [
                        {
                            type: "integer",
                            min:1,
                            required: true,
                            message: '完工时间必须大于0的整数',
                            transform (val) {
                                return +val;
                            }
                        }
                    ]
                },
                startTags:[],
                endTags:[],
                startInputVisible:false,
                endInputVisible: false,
                startInputValue: '',
                endInputValue: '',
                durationDetailLoading:false,
                submitAble:false,
                searchOptions:[]


            }
        },
        props: ["durationInfos","formInfos"],
        watch:{
            startTags:function(item){
                this.formData.startPictureLabel = item.toString()
                if(this.$refs['durationForm']) {
                    this.$refs['durationForm'].validateField("startPictureLabel")
                }

            },
            endTags:function (item) {
                this.formData.endPictureLabel = item.toString()
                if(this.$refs['durationForm']) {
                    this.$refs['durationForm'].validateField("endPictureLabel")
                }
            }
        },
        created() {
            this.getProperty()
            this.init();
        },
        methods: {
            init(){
                let _form = JSON.parse(JSON.stringify(this.formData))
                _form.durations = this.durationInfos.durations
                _form.manHour = this.durationInfos.manHour
                _form.durationId = parseInt(this.durationInfos.durationId)
                this.title = this.durationInfos.title
                if(this.formInfos) {
                    Object.keys(this.formData).forEach(item => {
                        if(this.formInfos[item]) _form[item] = this.formInfos[item]
                    })
                    if(_form.startPictureLabel) {
                        this.startTags = _form.startPictureLabel.split(",")
                    }
                    if(_form.endPictureLabel) {
                        this.endTags = _form.endPictureLabel.split(",")
                    }
                }
                this.formData = _form
            },

            getProperty(){
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: 42801
                    },
                    size: 100
                }
                let _list = []
                commonApi.queryUnionParent(arg).then(res=>{
                    if(res.data.status == 200) {
                        res.data.result.forEach(item => {
                            _list.push({text:item.propertyName,value:item.id})
                        })
                        this.dataSource.taskStatus = _list
                    }
                })
            },

            btnOKClick(){
                let self = this
                this.$refs['durationForm'].validate(valid => {
                    if (valid) {
                        let formData = Object.assign({}, this.formData)
                        formData.startTime = parseInt(formData.startTime)
                        formData.endTime = parseInt(formData.endTime)
                        if(formData.startTime>formData.endTime) {
                            this.$message.error("开始时间不能大于完工时间")
                            return
                        }
                        if(formData.startTime>formData.manHour) {
                            this.$message.error("开始时间不能大于工期天数")
                            return
                        }
                        if(formData.endTime>formData.manHour) {
                            this.$message.error("完工时间不能大于工期天数")
                            return
                        }
                        if(this.startTags.length > 9 ) {
                            this.$message.error("开始图片标签不能超过9个")
                            return
                        }
                        if(this.endTags.length > 9 ){
                            this.$message.error("完工图片标签不能超过9个")
                            return
                        }
                       if(this.formInfos){
                            formData.updateUser = +Cookie.get('t8t-tc-uid')
                            formData.updateName = Cookie.get('t8t-tc-username')
                            self.loadingSet('submitAble')
                            broadcastApi.broadcastDurationItemUpdate({broadcastDurationItem:formData})
                                .then(res =>{
                                    self.loadingSet('submitAble')
                                    if(res.data.status == 200) {
                                        self.$message({
                                            type: 'success',
                                            message: '操作成功'
                                        })
                                        self.$emit('close')
                                        self.$emit('reload')
                                    }else{
                                        self.$message({
                                            type: "error",
                                            message: res.data.message || '操作失败'
                                        })
                                    }
                                }).catch(error =>{
                                    self.loadingSet('submitAble')
                                    self.$message({
                                        type: "error",
                                        message: '服务异常'
                                    })
                            })
                        }else{
                            formData.id = null
                            formData.createUser = +Cookie.get('t8t-tc-uid')
                            formData.createName = Cookie.get('t8t-tc-username')
                            self.loadingSet('submitAble')
                            broadcastApi.broadcastDurationItemCreate({broadcastDurationItem:formData})
                                .then(res =>{
                                    self.loadingSet('submitAble')
                                    if(res.data.status == 200) {
                                        self.$message({
                                            type: 'success',
                                            message: '操作成功'
                                        })
                                        self.$emit('close')
                                        self.$emit('reload')
                                    }else{
                                        self.$message({
                                            type: "error",
                                            message: res.data.message || '操作失败'
                                        })
                                    }
                                }).catch(error =>{
                                self.loadingSet('submitAble')
                                self.$message({
                                    type: "error",
                                    message: '服务异常'
                                })
                            })



                        }
                    }
                })
            },
            btnCancleClick(){
                this.$emit('close')
            },

            handleClose(tag,refs) {
                this[refs+'Tags'].splice(this[refs+'Tags'].indexOf(tag), 1);
            },

            showInput(refs) {
                this[refs + "InputVisible"] = true
                this.$nextTick(() => {
                    this.$refs[refs + 'TagInput'].$refs.input.focus();
                });
            },

            handleInputConfirm(refs) {
                let inputValue = this[refs + 'InputValue'];
                if (inputValue) {
                    this[refs + "Tags"].push(inputValue);
                }
                this[refs + 'InputValue'] = '';
                this[refs + 'InputVisible'] = false;
            },
            querySearchAsync(queryString) {
                let self = this
                queryString += ""
                let args = {
                    "page":1,
                    "size":20,
                    "search":{
                        "skuId_like":queryString,
                        "id_gt":0
                    },
                    "sort":[
                        "id_desc"
                    ]}
                axios({
                    service: CommonService.GOODS.name,
                    method: CommonService.GOODS.methods.QUERY_PAGE,
                    args: args
                }).then((res) => {
                        let response = res.data
                        if (response && response.status == 200) {
                            let list =[]
                            response.result.rows.forEach(item=>{
                                list.push({id:item.id,value:item.skuId,goodsName:item.goodsName})
                            })
                            this.searchOptions = list
//                            cb(list)
                        }
                    })
            },
            loadingSet(val){
                this[val] = !this[val]
            },
            handleSelect(val){
                let _selected = this.searchOptions.filter((item) => {
                    return item.value === val
                })
                if(_selected.length>0){
                    this.formData.goodsId = parseInt(_selected[0].id)
                    this.formData.goodsName = _selected[0].goodsName
                }
            }
        }
    };

</script>
<style>
    .durationItemDialog .el-dialog--small {
        width: 480px !important;
    }
</style>
<style lang="css" scoped>


    .my-table {
        display: flex;
        flex: 1;
    }

    .my-button {
        padding: 10px;
        text-align: center;
        margin: 10px;
    }

    .t8t-search {
        overflow: visible;
    }

    .durationItemDialog .el-form-item .el-input, .el-select,.el-autocomplete {
        width: 80%;
    }

    .durationItemDialog .el-form-item span.el-tag{
        margin-right: 10px;
        background-color: #20a0ff;
    }
    .durationItemDialog .el-form-item .duration-new-tag{
        width: 60px;
        height: 26px;
    }

</style>
