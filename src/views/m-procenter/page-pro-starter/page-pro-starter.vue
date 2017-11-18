<template>
    <div class="page-pro-starter">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
            >
        </t8t-search>
        <t8t-toolbar
            @REPEAL_BTN = "repealBtn"
            :disabledSymbols = "disabledSymbols"
             ref="toolbar"
        >
        </t8t-toolbar>
        <t8t-table
            :columns="columns"
            :service="service"
            :method = "method"
            :commonData = "commonData"
            :customColumn="true"
            :args = "args"
            ref="T8tTable"
            @select=" checkRepeal"
            @row-double-click="handleRowDbClick"
            @selection-change="checkRepeal"
            @cell-click="handleCeClick"
     ></t8t-table>
    </div>
</template>
<script>
    import Service from 'src/services/procenter/Service.js'
    import apiProCenter from 'src/services/procenter/proCenterApi.js'
    import Cookie from 'js-cookie'
    import config from './config.json'
    export default({
        name:'page-pro-starter',
        data(){
            return{
                breadcrumbData:config.breadcrumbData, //面包屑
                fields:config.fields,//搜索表单项配置
                columns:config.columns, //列表字段配置
                commonData:config.commonData, //过滤字字段配置
                selectSource:config.selectSource, //下拉框搜索来源
                disabledSymbols:['REPEAL_BTN'] ,//禁用撤销按钮
                //请求服务、接口配置
                service: Service.PROCENTERDEPLOYLIST.name,
                method: Service.PROCENTERDEPLOYLIST.methods.QUERYPROCINFOBYSTARTER,
                args:{},//请求参数
            }
        },
        created(){
            this.args.query = {starter: Cookie.get('t8t-tc-uid')}
             // 获取流程分类
            this.getProcNames()
        },
        methods:{
              // 获取流程名
            getProcNames(){
                let processNames = [];
                apiProCenter.getProcNames(null).then((res)=>{
                    if(res.data.status == 200){
                        res.data.result.forEach((item)=>{
                            if(item.procName != null){
                                processNames.push({value:item.procName,text:item.procName})
                            }
                        })
                    }
                    this.selectSource.procNames = processNames
                })

            },

            //获取流程名
            getCategoryList(procNameArr){
                this.commonOptionsConfig.procName = procNameArr
            },
            //处理任务
            repealBtn(){
                let selectDatas = this.checkSelection()
                if(selectDatas.formKey.length >1 || selectDatas.formKey.length ==0){
                    this.$message.error("请勾选单条数据进行操作")
                    return false
                }
                var procInsId=selectDatas.procInsId[0]
                apiProCenter.deleteProcess({procInsId}).then((res)=>{
                    if(res.data.status===200)
                    {
                        //隐藏正在加载
                        this.isLoading = false
                        this.$emit('close')
                        this.$msgbox({
                            title: '消息',
                            type: 'success',
                            message: '流程撤销成功',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                       this.getTableData()
                    }
                    else {
                        this.isLoading = false;
                        this.$message.error(res.data.message)
                    }
                })

            },
            //校验是否显示撤销按钮
            checkRepeal(){
                let selectDatas = this.checkSelection()
                let repeal = false
                selectDatas.repeal.forEach(function(item){
                    repeal =repeal | item
                })
                if(repeal){
                    this.disabledSymbols=[]
                }else{
                    this.disabledSymbols=['REPEAL_BTN']
                }

            },
            //获取选择的数据
            checkSelection(){
                let selections  = this.$refs['T8tTable'].getSelectRows()
                let selectDatas = {procInsId:[],formKey:[],repeal:[]}
                selections.forEach(function(item){
                    selectDatas.procInsId.push(item.procInsId)
                    selectDatas.formKey.push(item.formKey)
                    selectDatas.repeal.push(item.repeal)
                })

                return selectDatas
            },
            submitSearch(searchValConfig){
                    let params = {query:{starter:Cookie.get('t8t-tc-uid')}}

                    if (searchValConfig.staticType == 2) {
                        params.query.finish = true
                        this.columns=config.columns2
                    }else{
                        params.query.finish = false
                        this.columns=config.columns
                    }

                    if (searchValConfig.procName!=null){
                            params.query.procName = searchValConfig.procName
                    }

                    if (searchValConfig.startTime) {
                        params.query.startTime = searchValConfig.startTime * 1000
                    }
                    if (searchValConfig.endTime) {
                        params.query.endTime = searchValConfig.endTime * 1000
                    }
                    if (searchValConfig.procDefId != null) {
                        params.query.procDefId = searchValConfig.procDefId
                    }
                    this.args = params
            },
            //获取表单数据
            getTableData(){
                this.$refs['T8tTable'].reloadTable()
            },
            //双击处理任务
            handleRowDbClick(){
            }
        }
    })
</script>
<style
    lang="css"
    scoped
>
</style>

