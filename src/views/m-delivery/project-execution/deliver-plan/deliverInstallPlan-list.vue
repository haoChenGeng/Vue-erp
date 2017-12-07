<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :deleteMethod="deleteMethod"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="true"
            :tableColumns="tableColumns"
            :tableService="service"
            :tableArgs="tableArgs"
            :tableMethod="method"
            :tableCommonData="searchOptions"
            @list-view="doView"
            @list-add="doAdd"
            @list-edit="doEdit"
            @list-reported="handWorkerReported"
            @list-installation="handInstallationSchedule"
            @list-close="doClose"
            @search-submit="onSearchSubmit"
            @list-export="doExport"
            @table-row-dobule-click="handleTableDobuleClick"
            :beforeSearchSubmit="beforeSubmit"
        >
        </t8t-list-view>
        <formulate-distribution
            v-if="formulateDistributionShow"
            :id="distributionId"
        >
        </formulate-distribution>
        <installation-schedule
            v-if="installationScheduleShow"
            :id="distributionId"
        >
        </installation-schedule>

    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import FormulateDistribution from './formulate_distribution.vue'
    import InstallationSchedule from './installation-schedule.vue'
    import Services from 'src/services/delivery/Service.js'
    import api from 'src/services/delivery/distribution.js'
    import {Service as installationService, methods as installationMethods} from 'src/services/delivery/installation-schedule/Service.js'
    import { formatDate } from './dateLib.js'
    import exportUtils from 'src/utils/export.js'
    export default {
        name:"deliverInstallPlan-list",
        components: { T8tListView, FormulateDistribution, InstallationSchedule},
        // watch: {
        //     $route: function () {
        //         this.$refs['list-view'].getTableInstance().reloadTable()
        //     },
        // },
        activated(){
            this.$refs['list-view'].getTableInstance().reloadTable()
        },
        data () {
            var isTimestamp = function(date){
                  if (typeof date === 'string') {
                    return !date.match(/^\d{13}$/)
                } else if (typeof date === 'number') {
                    return !(date + "").match(/^\d{13}$/)
                }
                return true
            };
            return {
                // 详情页路由地址
                detailRoute: '/test/resume/view',
                planDetailRoute: 'distribution-plan/detail',
                // service 和 method 目前需要加密
                service: '2ut6bUIvrvApAgRqxlP3eQCn3mCy3Kh', // /biz/t8t-ps-pim/app
                method: 'MUPP8Spbz10JKzzC6RQUddKh7A2jeqKIlienBiTGC4n-wkC29av', // views.deliverInstallPlan.queryPage
                tableArgs: {search:{type_eq:0}},
                // 表头描述
                tableColumns: [
                    {prop: 'id', label: '配送明细ID'},
                    {prop: 'organizationName', label: '组织'},
                    {prop: 'applyId', label: '项目ID'},
                    {prop: 'address', label: '详细地址'},
                    {prop: 'categoryName', label: '品类',formatter:function(val, row){
                            if(row.categoryInfo &&  row.categoryInfo.length > 0){
                                 let cateNames = []
                                 row.categoryInfo.forEach((item) => {
                                    cateNames.push(item.category)
                                 })
                                 return cateNames.toString()
                            }
                            return ''
                    }},
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
                    {prop: 'disPlanDeliverTime', label: '安排配送日期', formatter: function(text){
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
                    {prop: 'logConfirmDeliver', label: '配送送达日期',formatter: function(text){
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
                    {prop: 'reportRemark', label: '工长备注'},
                    {prop: 'status', label: '调度状态',list:"statusOptions"},
                    {prop: 'createTime', label: '创建日期', formatter: 'dateParser'},
                    {prop: 'createName', label: '创建人'}

                ],
                // 搜索项配置
                searchFields: [
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
                    {type: 'input',label: '配送明细ID',name: 'id'},
                    {type: 'select',label: '调度状态',name: 'status', selectSourceKey:'statusOptions'},
                    {type: 'select',label: '调度类型',name: 'planType',selectSourceKey:'planType'},
                    {type: 'date',label: '工长报备日期自',name: 'workerReportTime_gte'},
                    {type: 'date',label: '工长报备日期至',name: 'workerReportTime_lte'},
                    {type: 'date',label: '安排配送日期自',name: 'disPlanDeliverTime_gte'},
                    {type: 'date',label: '安排配送日期至',name: 'disPlanDeliverTime_lte'},
                    {type: 'date',label: '确认送达日期自',name: 'logConfirmDeliver_gte'},
                    {type: 'date',label: '确认送达日期至',name: 'logConfirmDeliver_lte'}
                ],
                // 面包屑
                breadcrumbData: [
                    {title:'交付'},
                    {title:'项目执行'},
                    {title:'配送调度'}
                ],
                // 搜索项对应值
                searchOptions: {
                    statusOptions: [
                        {
                            text: '待调度',
                            value: 1
                        },
                        {
                            text: '待完成',
                            value: 2
                        },
                        {
                            text: '已完成',
                            value: 3
                        },
                        {
                            text: '手动关闭',
                            value: 6
                        }
                        ],
                    typeOptions:[
                        {text:'正常安装',value:1},
                        {text:'反补安装',value:2},
                        {text:'补货安装',value:3}
                     ],
                     planType:[]

                },
                formulateDistributionShow:false,
                distributionId:null,
                installationScheduleShow:false,
                fullscreenLoading:false
            }
        },
        created(){
            this.getCommonOptions('42302','planType')
        },
        methods: {
            onSearchSubmit (obj) {
                obj.type_eq = 0
                this.tableArgs.search = obj
                this.tableArgs = Object.assign({}, this.tableArgs)
            },
            onchange (val) {

            },
            handleTableDobuleClick(row){
                 this.$router.push({ path: this.planDetailRoute,query:{id: row.id} })
            },
            doView () {
                let rows = this.$refs['list-view'].getTableInstance().getSelectRows()
                if(rows.length < 1){
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if(rows.length > 1){
                     this.$message.error('只能选择一行进行操作')
                     return
                }
               let row = rows[0]
                this.$router.push({ path: this.planDetailRoute,query:{id: row['id']} })
            },
            doAdd () {
                this.$TCS.addTag('red_6788_010006005002') //点击流
                let rows = this.$refs['list-view'].getTableInstance().getSelectRows()
                if(rows.length < 1){
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if(rows.length > 1){
                     this.$message.error('只能选择一行进行操作')
                     return
                }
               let row = rows[0]
               if(row['status'] == 1){
                    let args = {id:row['id']}
                    api.validateDeliverPlan(args).then((res) => {
                        if(res.data.status == 200){
                            if(res.data.result){
                                this.distributionId = row['id']
                                this.formulateDistributionShow = true
                            }else{
                               this.$message.error('该要货单还未下单或还未审核通过！')
                            }
                        }else{
                            this.$message.error('验证项目节点失败')
                          }
                    }).catch(()=>{
                        this.$message.error('验证要项目点失败')
                    })
               }else{
                  this.$message.error('只有待调度的项才能进行制定配送调度')
               }

            },
            doEdit () {
                this.$refs['list-view'].doEdit(this.detailRoute)
            },
            doClose (){
                this.$TCS.addTag('red_12527_010006005006') //点击流
                let rows = this.$refs['list-view'].getTableInstance().getSelectRows()
                if(rows.length < 1){
                     this.$message.error('请选择需要操作的行')
                     return
                }
                if(rows.length > 1){
                    this.$message.error('只能选择一行进行操作')
                    return
                }
                let row = rows[0]
                if(row['status'] == 3)
                {
                    this.$confirm('此操作将关闭配送计划, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        let uid = Cookie.get('t8t-tc-uid')
                        let args = {id:row['id'],status:6,updateUser:uid}
                        api.updateStatusById(args).then((res) => {
                          if(res.data.status == 200){
                            this.$message({
                                type: 'success',
                                message: '关闭成功!'
                            });
                            this.$refs['list-view'].getTableInstance().reloadTable()
                          }else{
                            this.$message.error('关闭配送计划失败！')
                          }
                        }).catch(()=>{
                           this.$message.error('关闭配送计划异常')
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
                    this.$message.error('只有已完成的项才能进行关闭')
                }
            },
            handWorkerReported () {
                this.$TCS.addTag('red_6788_010006005004') //点击流
                 this.$router.push({
                    path: '/tochat-delivery/distribution-plan/master-reported'
                })
            },
            handInstallationSchedule(){
                this.$TCS.addTag('red_6788_010006005005') //点击流
                let rows = this.$refs['list-view'].getTableInstance().getSelectRows()
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
                            this.distributionId = row['id']
                            this.installationScheduleShow = true
                        }else{
                            this.$message.error('只有已完成的配送调度才能制定安装调度')
                        }
                    }else{
                        this.$message.error('验证配送调度状态失败')
                    }
                }).catch(()=>{
                    this.$message.error('验证配送调度状态失败')
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
                            this.searchOptions[selectName] = list;
                        }
                    })
            },
            doExport()
            {
                this.fullscreenLoading = true;
                let args = {
                        "page": 1,
                        "size": 5000
                    };
                let formData = this.$refs['list-view'].getSearchInstance().getFormData();
                if(JSON.stringify(formData) !== '{}'){
                    args.search = formData;
                }
                args.search.type = 0;
                exportUtils({
                    service:"UtVjoo4vY9I5lCC0V9yK2CC_6iT774K", ///biz/t8t-ps-pim/app
                    method:"xNN8IeiGCu8EBA_NFN-CDfozMCcJ5DtdV0M9phFfRZXFXrn",//views.deliverInstallPlan.export
                    args : args,
                    headers: 'ID,项目ID,组织,业务类型,工长姓名,产品包名称,业主姓名,排期节点ID,调度类型,状态,创建人,创建日期,提交人,提交配送日期,完成人,完成日期,最后修改人,最后修改日期',
                    sorts: 'id,applyId,organizationName,bizTypeName,workerName,productPkgName,projectOwnerName,scheduleNodeId,planTypeName,statusName,createName,createTime,deliverPlanUserName,disPlanDeliverSubmit,confirmDeliverUserName,logConfirmDeliver,updateName,updateTime',
                    title: "配送调度数据"
                })
                setTimeout(()=>{
                    this.fullscreenLoading = false;
                },1000);
            }
        }
    }
</script>

<style lang="css" scoped>

</style>
