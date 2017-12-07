<template>
    <div>
        <!-- 面包屑 -->
        <t8t-breadcrumb></t8t-breadcrumb>
        <!-- 搜索区域 -->
        <t8t-search
        	:fields="fields"
            :selectSource="commonData"
        	@submit="handleSubmit"
        	>
        </t8t-search>

        <!-- 内容区 -->
        <div class="g-main-container">

            <div class="g-main-container-column">
                <!-- 工具条 -->
                <t8t-toolbar
                    @VIEW="onView"
                    @AGAIN="onAgain"
                    @REPLENISH="onReplenish"
                    @DETAILVIEW="onDetailview"
                    @EXPORT="onExport"
                    @REPDEMAND="onRepdemand"
                    @CLOSE="onClose"
                ></t8t-toolbar>

                <!-- table -->
                <t8t-table
                    :columns="columns"
                    :method="method"
                    :service="service"
                    :args="args"
                    :commonData="commonData"
                    :editable="false"
                    ref="list-view"
                    @row-double-click="handleRowDblclick"
                >
                </t8t-table>
            </div>
        </div>
         <el-dialog title="返补需求"  v-model="showReplenishResonDialog" v-if="replenishResonDialog" @close="handleCloseReplenishResonDialog">
            <el-form :model="replenishResonFormData" :rules="replenishResonFormRule" ref="replenishReson" label-position="right" label-width="100px">
                <div class="form-item-container">
                    <el-form-item label="需求信息：" prop="installResultRemark">
                        <el-input type="textarea" v-model="replenishResonFormData.installResultRemark"></el-input>
                    </el-form-item>
                 </div>
            </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleCloseReplenishResonDialog">取 消</el-button>
            <el-button type="primary" @click="saveReplenishReson" :loading="replenishResonButtonLoading">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
    import { formatDate } from './dateLib.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Services from 'src/services/delivery/Service.js'
    import {Service as installationService, methods as installationMethods} from 'src/services/delivery/installation-schedule/Service.js'
	import exportUtils from 'src/utils/export.js'
	export default{
		name:"installation-list",
		data(){
            var isTimestamp = function(date){
                  if (typeof date === 'string') {
                    return !date.match(/^\d{13}$/)
                } else if (typeof date === 'number') {
                    return !(date + "").match(/^\d{13}$/)
                }
                return true
            };
			return {
				fields:[
                    {type:"popup", label:"项目ID",name: 'applyId',
                        dialog:{
                            table:{
                                columns:[
                                    {prop:'applyId', label:'项目ID'},
                                    {prop:'ownerName', label:'业主姓名'},
                                    {prop:'houseAddress', label:'项目地址'}
                                ],
                                method:Services.DISTRIBUTION.methods.getApplyInfo,
                                service:Services.DISTRIBUTION.name,
                                args:{fields:['id', 'houseAddress']},
                                radioCol:true,
                                dialogWidth:'720px'

                            },
                            searchForm:{
                                fields:[
                                    {type: 'input',label: '项目ID',name: 'id'},
                                ],
                                showToggleBtn:false,
                            }
                        },
                        remoteQueryKey:'id_like',
                        textValue:'applyId',
                        filedValue:'applyId',
                        useQuery:true,
                        remote:true,
                        remoteArgs:{page:1,size:20},
                        service:Services.DISTRIBUTION.name,
                        method:Services.DISTRIBUTION.methods.getApplyInfo
                    },
                    {type:"input", label:"安装明细ID",name: 'id'},
                    {type:"select", label:"调度状态",name: 'status',selectSourceKey:"statusOptions"},
                    {type:"input", label:"安装工人",name: 'installName_like'},
                    {type:"select", label:"调度类型",name: 'planType', selectSourceKey:'planType'},
                    {type:"datetime", label:"安装调度提交日期自",name:"insDispatchSubmit_gte"},
                    {type:"datetime", label:"安装调度提交日期至",name:"insDispatchSubmit_lte"},
                    {type:"datetime", label:"提交安装结果日期自",name:"logConfirmDeliver_gte"},
                    {type:"datetime", label:"提交安装结果日期至",name:"logConfirmDeliver_lte"},
                    {type:"datetime", label:"提交返补日期自",name:"returnInstallSubmit_gte"},
                    {type:"datetime", label:"提交返补日期至",name:"returnInstallSubmit_lte"},
                ],
                service: '2ut6bUIvrvApAgRqxlP3eQCn3mCy3Kh', // /biz/t8t-ps-pim/app
                method: 'MUPP8Spbz10JKzzC6RQUddKh7A2jeqKIlienBiTGC4n-wkC29av', // views.deliverInstallPlan.queryPage
                args:{search:{type_eq:1}},
                columns:[
                    {prop: 'id', label: '安装明细ID'},
                    {prop: 'organizationName', label: '组织'},
                    {prop: 'applyId', label: '项目ID'},
                    {prop: 'address', label: '详细地址'},
                    {prop: 'planType', label: '调度类型',list:"planType"},
                    {prop: 'workerReportTime', label: '工长报备日期', formatter: function(text){
                        let dateString
                        let objDate = new Date(text * 1000)
                        if (text === 0 || text === null) {
                            dateString = ""
                        } else {
                            let _newObj = isTimestamp(text) ? objDate : new Date(text)
                            dateString = formatDate(_newObj, 'yyyy-MM-dd')
                        }
                        return dateString
                    }},
                    {prop: 'insDispatchSubmit', label: '安装调度提交日期', formatter:'dateParser'},
                    {prop: 'logConfirmDeliver', label: '安装结果提交日期',formatter:'dateParser'},
                    {prop: 'returnInstallSubmit', label: '提交返补日期',formatter:'dateParser'},
                    {prop: 'installName', label: '安装人'},
                    {prop: 'status', label: '调度状态',list:"statusOptions"},
                    {prop: 'createTime', label: '创建日期', formatter: 'dateParser'},
                    {prop: 'createName', label: '创建人'}

                ],
                commonData:{
                    statusOptions:[
                        {text:'待调度', value:1},
                        {text:'待完成', value:2},
                        {text:'已完成', value:3},
                        {text:'异常结束', value:4},
                        {text:'异常关闭', value:5},
                        {text:'手动关闭', value:6}
                        ],
                    planType:[]
                },
                replenishResonDialog:false,
                showReplenishResonDialog:true,
                replenishResonFormData:{
                    installResultRemark:null
                },
                replenishResonFormRule:{
                    installResultRemark:[
                        {required: true, message: '请填写需求信息'}
                    ]
                },
                replenishResonButtonLoading:false,
                activeId:null,
                fullscreenLoading:false,
			}
		},
        created(){
            this.getCommonOptions('42601','planType')
        },
        // watch:{
        //     "$route.path":function(val){
        //         this.$refs["list-view"].reloadTable()
        //     }
        // },
        activated(){
            this.$refs["list-view"].reloadTable()
        },
        methods:{
            handleSubmit(obj){
                obj.type_eq = 1;
                this.args.search = obj;
                this.args = Object.assign({}, this.args);
            },
            //查看
            onView(){
                let rows = this.$refs['list-view'].getSelectRows()
                if(rows.length < 1){
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if(rows.length > 1){
                     this.$message.error('只能选择一行进行操作')
                     return
                }
                let row = rows[0]
                this.$router.push({ path: "/delivery/installation-view",query:{id: row['id']} })
            },
            //再次安装
            onAgain(){
                let rows = this.$refs['list-view'].getSelectRows()
                if(rows.length < 1){
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if(rows.length > 1){
                     this.$message.error('只能选择一行进行操作')
                     return
                }

                let row = rows[0]
                let args = {id:row['id']}
                installationMethods.validateInstallPlan(args).then((res) => {
                    if(res.data.status == 200){
                        if(res.data.result){
                            this.$router.push({ path: "/delivery/again-installation",query:{id: row['id']} })
                        }else{
                            this.$message.error('异常结束的安装调度才能制定再次安装')
                        }
                    }else{
                        this.$message.error(res.data.message)
                    }
                }).catch(()=>{
                    this.$message.error('验证安装调度状态失败')
                })
            },
            //反补安装
            onReplenish(){
                let rows = this.$refs['list-view'].getSelectRows()
                if(rows.length < 1){
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if(rows.length > 1){
                     this.$message.error('只能选择一行进行操作')
                     return
                }
                let row = rows[0]
                let args = {id:row['id']}
                installationMethods.validateInstallPlan(args).then((res) => {
                   if(res.data.status == 200){
                       if(res.data.result){
                            this.$router.push({ path: "/delivery/replenish-installation",query:{id: row['id']} })
                       }else{
                           this.$message.error('异常结束的安装调度才能制定反补安装')
                       }
                   }else{
                       this.$message.error(res.data.message)
                   }
               }).catch(()=>{
                   this.$message.error('验证安装调度状态失败')
               })

            },
            //关闭安装调度
            onClose()
            {
                this.$TCS.addTag('red_12527_010006008007') //点击流
                let rows = this.$refs['list-view'].getSelectRows()
                if(rows.length < 1){
                     this.$message.error('请选择需要操作的行')
                     return
                }
                if(rows.length > 1){
                    this.$message.error('只能选择一行进行操作')
                    return
                }
                let row = rows[0]
                if(row['status'] == 4)
                {
                    this.$confirm('此操作将把异常结束的安装计划关闭, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        let uid = Cookie.get('t8t-tc-uid')
                        let args = {id:row['id'],status:6,updateUser:uid}
                        installationMethods.updateStatusById(args).then((res) => {
                          if(res.data.status == 200){
                            this.$message({
                                type: 'success',
                                message: '关闭成功!'
                            });
                            this.handleSubmit({});
                          }else{
                            this.$message.error('关闭安装计划失败！')
                          }
                        }).catch(()=>{
                           this.$message.error('关闭安装计划异常')
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消关闭'
                         });
                    });
                }
                else
                {
                    this.$message.error('只有异常结束的安装计划才能进行关闭')
                }
            },
            //查看安装详情
            onDetailview(){
                let rows = this.$refs['list-view'].getSelectRows()
                if(rows.length < 1){
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if(rows.length > 1){
                     this.$message.error('只能选择一行进行操作')
                     return
                }
                let row = rows[0]
                this.$router.push({ path: '/tochat-delivery/installation-ducuments-view' ,query:{planId: row['id']}})
            },
            handleRowDblclick(row){
                this.$router.push({ path: "/delivery/installation-view",query:{id: row['id']} })
            },
            //导出
            onExport(){
                this.fullscreenLoading = true;
                let args = {
                        "page": 1,
                        "size": 5000
                    };
                let formData = this.$refs['list-view'].args.search;
                formData.type = 1;
                args.search = formData;
                exportUtils({
                    service:"UtVjoo4vY9I5lCC0V9yK2CC_6iT774K", ///biz/t8t-ps-pim/app
                    method:"xNN8IeiGCu8EBA_NFN-CDfozMCcJ5DtdV0M9phFfRZXFXrn",//views.deliverInstallPlan.export
                    args : args,
                    headers: 'ID,项目ID,组织,业务类型,工长姓名,产品包名称,业主姓名,排期节点ID,安装人类型,安装人,安装预计开始时间,安装预计结束时间,安装实际开始时间,安装实际结束时间,调度类型,状态,配送调度ID,创建人,创建日期,提交人,提交安装日期,完成人,完成日期,提交返补日期,最后修改人,最后修改日期',
                    sorts: 'id,applyId,organizationName,bizTypeName,workerName,productPkgName,projectOwnerName,scheduleNodeId,installerTypeName,installName,insPlanStart,insPlanEnd,insRealPlanStart,insRealPlanEnd,planTypeName,statusName,deliverId,createName,createTime,deliverPlanUserName,insDispatchSubmit,confirmDeliverUserName,logConfirmDeliver,returnInstallSubmit,updateName,updateTime',
                    title: "安装调度数据"
                })
                setTimeout(()=>{
                    this.fullscreenLoading = false;
                },1000);
            },
            //反补需求
            onRepdemand(){
                let rows = this.$refs['list-view'].getSelectRows()
                if(rows.length < 1){
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if(rows.length > 1){
                     this.$message.error('只能选择一行进行操作')
                     return
                }
               let row = rows[0]
               let args = {id:row['id']}
               installationMethods.validateInstallPlan(args).then((res) => {
                   if(res.data.status == 200){
                       if(res.data.result){
                                this.showReplenishResonDialog = true
                                this.replenishResonDialog = true
                                this.activeId = row['id']
                                this.replenishResonFormData.installResultRemark = row.installResultRemark ? row.installResultRemark : null
                       }else{
                           this.$message.error('异常结束的安装调度才能添加反补需求')
                       }
                   }else{
                       this.$message.error(res.data.message)
                   }
               }).catch(()=>{
                   this.$message.error('验证安装调度状态失败')
               })
            },
            handleCloseReplenishResonDialog(){
                this.replenishResonFormData.installResultRemark = null
                this.replenishResonDialog = false
            },
            saveReplenishReson(){
                this.$refs.replenishReson.validate((isValid) =>{
                    if(isValid){
                        let args = {
                            addReturnMemoDTO:{
                                id:this.activeId,
                                installResultRemark:this.replenishResonFormData.installResultRemark,
                                updateUser:Cookie.get('t8t-tc-uid'),
                                updateName:Cookie.get('t8t-tc-username')
                            }
                        }
                        this.replenishResonButtonLoading = true
                        installationMethods.addReturnMemoDTO(args).then((res) =>{
                            this.replenishResonButtonLoading = false
                            if(res.data.status == 200){
                                    let _this = this
                                     this.$msgbox({
                                            title: '提交成功',
                                            type: 'success',
                                            message: '',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        }).then(() =>{
                                            _this.handleCloseReplenishResonDialog()
                                            _this.$refs['list-view'].reloadTable()
                                        })
                            }else{
                                this.$msgbox({
                                        title: '提交失败',
                                        type: 'error',
                                        message: res.data.message,
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                            }
                        }).catch((error) => {
                             this.replenishResonButtonLoading = false
                             this.$msgbox({
                                    title: '提交失败' ,
                                    type: 'error',
                                    message: error || '服务器异常',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                        })
                    }
                })
            },
            getCommonOptions: function(fatherCode,selectName) {
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
                                }
                            });
                            this.commonData[selectName] = list;
                        }
                    })
            }
        }
	}
</script>
