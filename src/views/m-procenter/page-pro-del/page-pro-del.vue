<template>
    <div class="page-pro-del">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
            ref="T8tSearch"
            >
        </t8t-search>
       <t8t-toolbar
            @DEAL_TASK = "dealTask"
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


    </div>
</template>
<script>
    import Service from 'src/services/procenter/Service.js'
    import apiProCenter from 'src/services/procenter/proCenterApi.js'
    import Cookie from 'js-cookie'
    import config from './config.json'
    export default({
        name:'page-pro-del',
        data(){
            return{
                breadcrumbData:config.breadcrumbData, //面包屑
                fields:config.fields,//搜索表单项配置
                columns:config.columns, //列表字段配置
                commonData:config.commonData, //过滤字字段配置
                selectSource:config.selectSource, //下拉框搜索来源

                //请求服务、接口配置
                service: Service.PROCENTERDEPLOYLIST.name,
                method: Service.PROCENTERDEPLOYLIST.methods.GETUSERTASKSWEB,
                args:{},//请求参数
            }
        },
        activated() {
            // 初始化 init
            this.init();
        },
        created(){
            this.args.query = {executableUser:Cookie.get('t8t-tc-uid')}
             //获取流程分类
             this.getProcNames()
        },
        methods:{
            init(){
                //搜索重置
                this.$refs['T8tSearch'].resetForm();
                //查询重置
                this.args.query = {executableUser:Cookie.get('t8t-tc-uid')}
                this.getTableData()
                this.getProcNames()
            },
              //获取流程名
            getProcNames(){
                let processNames = [];
                apiProCenter.getProcNames(null).then((res)=>{
                    if(res.data.status == 200){
                        res.data.result.forEach((item)=>{
                            if(item.tenantId){
                                item.procKey += '_tenantId_' + item.tenantId
                            }
                            processNames.push({value:item.procKey,text:item.procName})
                        })
                    }
                    this.selectSource.procNames = processNames
                })

            },

            //处理任务
            dealTask(){
                let selectDatas = this.checkSelection()
                if(selectDatas.formKey.length >1 || selectDatas.formKey.length ==0){
                    this.$message.error("请勾选单条数据进行操作")
                    return false
                }
                let formKey = selectDatas.formKey.join(',')
                let procInsId = selectDatas.procInsId.join(',')
                let taskId = selectDatas.taskId.join(',')
                let url = this.urlBuilder(formKey,{procInsId:procInsId,taskId:taskId})
                window.open(url)

            },

            //获取选择的数据
            checkSelection(){
                let selections  = this.$refs['T8tTable'].getSelectRows()
                let selectDatas = {procInsId:[],procDefId:[],formKey:[],taskId:[]}
                selections.forEach(function(item){
                    selectDatas.procInsId.push(item.procInsId)
                    selectDatas.procDefId.push(item.procDefId)
                    selectDatas.formKey.push(item.formKey)
                    selectDatas.taskId.push(item.taskId)
                })

                return selectDatas
            },
            //获取流程名
            getCategoryList(procNameArr){
                this.commonOptionsConfig.procName = procNameArr
            },
            submitSearch(searchValConfig){
                    let params = {query:{executableUser:Cookie.get('t8t-tc-uid')}}
                    if(searchValConfig.procName!=null){
                        let searchProcName = searchValConfig.procName.split('_tenantId_')
                        if(searchProcName.length == 2){
                            params.query.procKey = searchProcName[0]
                            params.query.tenantId = searchProcName[1]

                        }else{
                            params.query.procKey = searchValConfig.procName
                        }
                    }

                    if(searchValConfig.procInsId != null){
                        params.query.procInsId = searchValConfig.procInsId
                    }
                    if(searchValConfig.taskId != null){
                        params.query.taskId = searchValConfig.taskId
                    }
                    if(searchValConfig.startTime){
                        params.query.startTime = searchValConfig.startTime*1000
                    }
                    if(searchValConfig.endTime){
                        params.query.endTime = searchValConfig.endTime*1000
                    }
                    this.args = params
            },
            //获取表单数据
            getTableData(){
                this.$refs['T8tTable'].reloadTable()
            },
            //双击处理任务
            handleRowDbClick(){
                this.dealTask()
            },
            urlBuilder(path,obj) {
                let _search
                let _link = "?"
                if(path) {
                    let _path = path.match(/([^\?])+/g)
                    if(_path.length > 1) {
                        if(_path.length > 2) {
                            console.log("URL warning:" + path)
                        }
                        _link = "&"
                    }
                }
                _search = Object.keys(obj).map(i=>i+'='+obj[i]).join('&')
                return path + _link + _search
            }
        }
    })
</script>
<style
    lang="css"
    scoped
>
</style>

