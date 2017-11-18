<template>

		<div class="page-pro-already">
			  <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
			  {{starterId}}
			  <t8t-search
	            :fields="fields"
                :selectSource="selectSource"
                :formData = "formData"
                @submit="submitSearch"
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
	                :args = "args"
            		:commonData = "commonData"
	                ref="T8tTable"
	                @row-double-click="handleRowDbClick"
			  >
			  </t8t-table>

		</div>

</template>
<script>
	import apiProCenter from 'src/services/procenter/proCenterApi.js'
	import Service from 'src/services/procenter/Service.js'
	import config from './config.json'
	import Cookie from 'js-cookie'
	export default({
		name:'page-pro-already',
		data(){
			return{
				breadcrumbData:config.breadcrumbData,
				columns:config.columns, //列表项配置
				fields:config.fields,//搜索表单配置
				selectSource:config.selectSource, //下拉框搜索来源
				commonData:config.commonData,// 过滤字典配置

				args:{},
				 //请求配置
                service: Service.PROCENTERDEPLOYLIST.name,
                method: Service.PROCENTERDEPLOYLIST.methods.PROCESSINSTSWEB,

                starterId:null //发起人id
			}
		},

		created(){
			this.args.query = {involved:Cookie.get('t8t-tc-uid')}
			//获取流程名
            this.getProcNames()
        },
		methods:{
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
                let selections = this.$refs['T8tTable'].getSelectRows()
                if(selections.length >1 || selections == 0){
                    this.$message.error("请勾选单条数据进行操作")
                    return false
                }
                let taskFormKey = selections[0].taskFormKey
                let procInsId = selections[0].procInsId
                let taskId = selections[0].taskId
                let url = taskFormKey + "?procInsId=" + procInsId + "&taskId=" + taskId
                window.open(url)

            },
			submitSearch(searchValConfig){
                let params = {query:{involved:Cookie.get('t8t-tc-uid')}}
                if(searchValConfig.staticType == 2){
                    params.query.finish=true;
                    this.columns=config.columns2;
                }else if(searchValConfig.staticType == 1) {
                    params.query.finish=false;
                    this.columns=config.columns1;
                }else{
                    this.columns=config.columns;
                }
                if(searchValConfig.procName!=null){
                    let searchProcName = searchValConfig.procName.split('_tenantId_')
                    if(searchProcName.length == 2){
                        params.query.procKey = searchProcName[0]
                        params.query.tenantId = searchProcName[1]

                    }else{
                        params.query.procKey = searchValConfig.procName
                    }
                }
                if(searchValConfig.procInsId!=null){
                    params.query.procInsId = searchValConfig.procInsId
                }
                if(searchValConfig.starter != null){
                	//this.getUserinfoByName(searchValConfig.starter)
                	params.query.starterName = searchValConfig.starter
                }

                if(searchValConfig.startTime){
                    params.query.startTime = searchValConfig.startTime*1000
                }

                if(searchValConfig.endTime){
                    params.query.endTime = searchValConfig.endTime*1000
                }
               this.args = params

			},
			getUserinfoByName(starter){ //通过用户名获取uid
				let args = {name:starter}
				apiProCenter.getUserinfoByName(args).then((res)=>{
            		if(res.data.status == 200){
            			this.starterId = res.data.result.id
            		}else{
            			this.starterId  = null
            		}
                })

			},
			resetSearch(){
				let searchValConfig = this.searchValConfig
				for(let p in searchValConfig ){
					searchValConfig[p] = null
				}
				this.args.params = searchValConfig
			},
			 //双击处理任务
            handleRowDbClick(){
                this.dealTask()
            }
		}

	})
</script>
