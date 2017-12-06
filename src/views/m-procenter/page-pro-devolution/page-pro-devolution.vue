<template>
    <div class="page-pro-devolution">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-toolbar
            @AUTHORIZE = "authorize"
            @VIEW = 'view_detail'
            @ANTI-AUTHORIZE = 'anti_authorize'
        >
        </t8t-toolbar>

         <t8t-table
            :columns="columns"
            :service="service"
            :method = "method"
            :commonData = "commonData"
            :args   = "args"
            ref="T8tTable"
            @row-double-click="handleRowDbClick"
         ></t8t-table>

          <view-devolution-dialog
            v-if="viewDialogVisible"
            @close = "viewDialogVisible = false"
            :detailData="detailData"
         ></view-devolution-dialog>

    </div>
</template>

<script>
    import Service from 'src/services/procenter/Service.js'
    import apiProCenter from 'src/services/procenter/proCenterApi.js'
    import Cookie from 'js-cookie'
    import config from './config.json'
    import ViewDevolutionDialog from './view-devolution-dialog.vue'
    export default({
        name:'page-pro-devolution',
        components:{
            ViewDevolutionDialog
        },
        data(){
            return {
                breadcrumbData:config.breadcrumbData, //导航条
                columns:config.columns, //列表表单配置
                commonData:config.commonData,//过滤字段配置

                //请求服务、接口配置
                service: Service.IMPOWERSERVICE.name,
                method: Service.IMPOWERSERVICE.methods.IMPOWERLIST,
                args:{},//请求参数

                dialogVisible:false,
                viewDialogVisible:false,
                detailData:[],
                treeData:[]
            }
        },
        created(){
             this.getProTreeData()
             this.args.req = {principal:parseInt(Cookie.get('t8t-tc-uid'))}

        },
        watch: {
            // $route: function () {
            //     this.$refs['T8tTable'].reloadTable()
            // }
        },
        activated() {
            this.$refs['T8tTable'].reloadTable()
        },
        methods:{
            authorize(){
                this.$router.push({path:'/procenter/page-pro-devolution/create',query:{treeData:JSON.stringify(this.treeData)}})
            },
            view_detail(){ //查看授权详情

                let selections  = this.$refs['T8tTable'].getSelectRows()
                if(selections.length == 0 || selections.length >1){
                    this.$message.error("请勾选单条记录进行操作！")
                    return
                }
                this.detailData = selections[0]
                this.viewDialogVisible = true
            },
            anti_authorize(){

                let selections  = this.$refs['T8tTable'].getSelectRows()
                if(selections.length == 0 || selections.length >1){
                    this.$message.error("请勾选单条记录进行操作！")
                    return
                }
                let args = {}
                    args.uId = parseInt(Cookie.get('t8t-tc-uid'))
                    args.id = selections[0].id
                    args.isBackGround = 1
                let _this = this
                this.$msgbox({
                    title: '警告',
                    type: 'warning',
                    message: '此操作授权人将无法处理此流程,请慎重操作!',
                    confirmButtonText: '确定',
                    confirmButtonClass: 'is-plain',
                    showCancelButton: true,
                    callback:function(flag){
                        if(flag == 'confirm'){
                            apiProCenter.cancelImpowerByRid(args).then((res)=>{
                                if(res.data.status == 200){
                                    _this.$msgbox({
                                        title: '消息',
                                        type: 'success',
                                        message: '解除授权成功',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                    _this.getTableData()
                                }else{
                                     _this.$message.error("解除授权失败")
                                }

                            })

                        }
                    }
                })

            },

            //获取分类树
            getProTreeData(){
                let that = this;
                let proTreeData = [];
                apiProCenter.listCategory({}).then((res)=>{
                    if(res.status == 200){
                        let a = 0
                        let b = 0
                       res.data.result.forEach((item,i)=>{
                            let children = [];
                            a = a+b+1
                            let c = a+2
                            item.processDefMsg.forEach((val,key)=>{
                                b = c+key
                                children.push({parentId:a+1,code:val.procKey,tenantId:val.tenantId,id:b,label:val.procName,open:true,visible:true,checked:false,})
                            })
                            proTreeData.push({parentId:1,code:item.category,tenantId:item.tenantId,id:a+1,label:item.category,open:false,visible:true,checked:false,children:children});
                       })
                     that.treeData = proTreeData
                    }

                });

            },
            //获取表单数据
            getTableData(){
                this.$refs['T8tTable'].reloadTable()
            },
            //双击查看任务
            handleRowDbClick(){
                this.view_detail()
            }
        }
    })

</script>
