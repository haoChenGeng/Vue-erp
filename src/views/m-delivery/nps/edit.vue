<template>
    <div class="nps-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2" :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                            @EDIT-SUBMIT="submitForm"
                            @CALL="handleCall"
                            @PROJECT="handleProject"
                            :disabledSymbols="disabledSymbols"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container">
                    <!-- 收缩按钮 -->
                    <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container">
                        <el-form class="dialog2-form-container" :model="formData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
                            <div class="dialog2-form-item-container">
                                <el-form-item label="项目ID：">
                                    <el-input v-model="formData.projectId" :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="城市：">
                                    <el-input v-model="formData.city" :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="评分日期：">
                                    <el-date-picker
                                        class="date-editor_time"
                                        v-model="formData.createTime"
                                        type="datetime"
                                        :disabled="true"
                                    ></el-date-picker>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="实际竣工日期：">
                                    <el-date-picker
                                        class="date-editor_time"
                                        v-model="formData.completedTime"
                                        type="datetime"
                                        :disabled="true"
                                    ></el-date-picker>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="单据编号：">
                                    <el-input v-model="formData.billCode" :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="单据状态：">
                                    <el-select v-model="formData.billStatus" placeholder="--请选择--" :disabled="true">
                                        <el-option v-for="item in commonOptionsConfig.billStatus" :label="item.text" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="业务类型：">
                                    <el-select v-model="formData.bizTypeId" placeholder="--请选择--" :disabled="true">
                                        <el-option v-for="item in commonOptionsConfig.bizType" :label="item.text" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="是否自动关闭：">
                                    <el-select v-model="formData.autoClose" placeholder="--请选择--" :disabled="true">
                                        <el-option v-for="item in commonOptionsConfig.autoClose" :label="item.text" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="关闭日期：">
                                    <el-date-picker
                                        class="date-editor_time"
                                        v-model="formData.closeTime"
                                        type="datetime"
                                        :disabled="true"
                                    ></el-date-picker>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="选择土巴兔原因：">
                                    <el-select v-model="formData.chosenReason" placeholder="--请选择--" :disabled="!editable">
                                        <el-option v-for="item in commonOptionsConfig.chosenReason" :label="item.text" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="修改人：">
                                    <el-input v-model="formData.updateName" :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="修改时间：">
                                    <el-date-picker
                                        class="date-editor_time"
                                        v-model="formData.updateTime"
                                        type="datetime"
                                        :disabled="true"
                                    ></el-date-picker>
                                </el-form-item>
                            </div>
                        </el-form>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <t8t-table
                            :columns="columns"
                            :indexCol="true"
                            :pageBar="false"
                            :editable="editable"
                            :commonData="commonOptionsConfig"
                            :dataSource="formData.billItemContentList"
                        ></t8t-table>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 另一个el-dialog放这里 -->
    </div>
</template>
<script>
    import {Service, methods} from 'src/services/delivery/nps.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import T8tTable from 't8t-element-ui/lib/t8t-grid'
    export default{
        name:'nps-edit',
        components: {
            T8tTable
         },
        data(){
            return {
                isTopHide: false,
                isDialogShow: true,
                id:31,
                commonOptionsConfig:{
                    status:[],
                    bizType:[],
                    autoClose:[
                        {text:'否', value:1},
                        {text:'是', value:2}
                    ],
                    billStatus:[
                        {text:'已关闭', value:1},
                        {text:'处理中', value:2}
                    ],
                    chosenReason:[],
                    roleType:[],
                    evaluateScore:[]
                },
                formData:{},
                columns:[
                    {prop:"roleType", label: "评分角色", list:"roleType"},
                    {prop:"evaluateName", label:'姓名'},
                    {prop:"evaluateScore", label: "评分", list:"evaluateScore",
                    editor: {
                        type: "select",
                    }},
                    {prop:"evaluateText", label: "备注",editor: {
                        type: "input",
                        rules:[
                            {max:200, min:0, message:"备注不能超过200字符"}
                        ]
                    }},
                ],
                editable:true,
                disabledSymbols:[]
            }
        },
        created(){
            if(this.$route.query.id){
                this.id = this.$route.query.id
            }else{
                this.$msgbox({
                    title: '参数错误！',
                    type: 'error',
                    message: '',
                    showCancelButton: false,
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                }).then(() => {
                     this.$router.go(-1)
                });
            }
            if(!this.$route.path.endsWith('edit')){
                this.editable = false
            }
            this.initData(this.id)
            this.getCommonData('11008', 'bizType')
            this.getCommonDataCode('42903', 'chosenReason')
            this.getCommonDataCode('42901', 'roleType')
            this.getCommonDataCode('42902', 'evaluateScore')
        },
        methods:{
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },
            closeDialog(){
                this.$router.push({ path: 'nps-list'})
            },
            submitForm(){
                this.$TCS.addTag('red_10654_016002002001') //点击流
                this.formData.updateName = Cookie.get('t8t-tc-username')
                this.formData.updateUser = Cookie.get('t8t-tc-uid')
                let args = {
                    npsBillItem:Object.assign({}, this.formData)
                }
                args.npsBillItem.createTime = args.npsBillItem.createTime ? +Date.parse(args.npsBillItem.createTime).toString().slice(0, -3) : null;
                args.npsBillItem.completedTime = args.npsBillItem.completedTime ? +Date.parse(args.npsBillItem.completedTime).toString().slice(0, -3) : null;
                args.npsBillItem.closeTime = args.npsBillItem.closeTime ? +Date.parse(args.npsBillItem.closeTime).toString().slice(0, -3) : null;
                args.npsBillItem.updateTime = args.npsBillItem.updateTime ? +Date.parse(args.npsBillItem.createTime).toString().slice(0, -3) : null;
                this.disabledSymbols.push('EDIT-SUBMIT')
                methods.itemConfirm(args).then((res)=>{
                    this.disabledSymbols.pop()
                    if(res.data.status == 200){
                        let _this = this
                        this.$msgbox({
                                  title: '提交成功',
                                  type: 'success',
                                  message: '',
                                  showCancelButton: false,
                                  confirmButtonText: '知道了',
                                  confirmButtonClass: 'is-plain'
                              }).then(()=>{
                                 _this.closeDialog()
                              })
                    }else{
                        this.$msgbox({
                           title: '提交失败',
                           type: 'error',
                           message: res.data.result || res.data.message,
                           showCancelButton: false,
                           confirmButtonText: '知道了',
                           confirmButtonClass: 'is-plain'
                         })
                    }
                }).catch((error) =>{
                    this.disabledSymbols.pop()
                    this.$msgbox({
                       title: '提交失败',
                       type: 'error',
                       message: error || '服务器异常',
                       showCancelButton: false,
                       confirmButtonText: '知道了',
                       confirmButtonClass: 'is-plain'
                     })
                })
            },
            initData(id){
                let args = {billId:id}
                methods.queryOne(args).then((res) =>{
                    if(res.data.status == 200){
                        console.info(res.data.result)
                            this.formData = res.data.result
                            this.formData.createTime = this.formData.createTime ? new Date(this.formData.createTime * 1000) : null;
                            this.formData.completedTime = this.formData.completedTime ? new Date(this.formData.completedTime * 1000) : null;
                            this.formData.closeTime = this.formData.closeTime ? new Date(this.formData.closeTime * 1000) : null;
                            this.formData.updateTime = this.formData.updateTime ? new Date(this.formData.updateTime * 1000) : null;

                    }
                })
            },
            handleCall(){
                this.$TCS.addTag('red_10654_016002002003') //点击流
                let args = {
                    uid:Cookie.get('t8t-tc-uid'),
                    phoneId: this.formData.phoneId
                }
                // let args = {
                //     uid:20568,
                //     phoneId:8213040
                // }
                this.disabledSymbols.push('CALL')
                methods.makeCall(args).then((res) =>{
                    this.disabledSymbols.pop()
                    if(res.data.status == 200){
                        this.$msgbox({
                                title: '呼叫成功',
                                type: 'success',
                                message: '',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                    }else{
                       this.$msgbox({
                           title: '提交失败',
                           type: 'error',
                           message: res.data.result || res.data.message,
                           showCancelButton: false,
                           confirmButtonText: '知道了',
                           confirmButtonClass: 'is-plain'
                         })
                    }
                }).catch((error) =>{
                    this.disabledSymbols.pop()
                    this.$msgbox({
                       title: '提交失败',
                       type: 'error',
                       message: error || '服务器异常',
                       showCancelButton: false,
                       confirmButtonText: '知道了',
                       confirmButtonClass: 'is-plain'
                     })
                })
            },
            handleProject(){
                window.open('http://scm.to8to.com/#/delivery/project/detail?projectId='+this.formData.projectId,'_blank')
            },
                   //辅助资料
             getCommonData(fatherCode,selectName) {
                 let arg =  {
                     page: 1,
                     search: {
                         pPropertyCode: fatherCode
                     },
                     size: 100
                 }
                 let list = []
                 commonApi.queryUnionParent(arg)
                 .then((res) => {
                     if (res.data.status === 200) {
                         res.data.result.forEach((item) => {
                             if (item.propertyStatus===1) {
                                 list.push({
                                     value: item.id,
                                     text: item.propertyName
                                 })
                             };
                         })
                         this.commonOptionsConfig[selectName] = list
                     }
                 })
             },
             getCommonDataCode(fatherCode,selectName){
                let arg =  {
                     page: 1,
                     search: {
                         pPropertyCode: fatherCode
                     },
                     size: 100
                 }
                 let list = []
                 methods.queryPropertyUnion(arg)
                 .then((res) => {
                     if (res.data.status === 200) {
                         res.data.result.forEach((item) => {
                             if (item.propertyStatus===1) {
                                 list.push({
                                     value: item.wholeCode,
                                     text: item.propertyName
                                 })
                             };
                         })
                         this.commonOptionsConfig[selectName] = list
                     }
                 })
             }
        }
    }
</script>
