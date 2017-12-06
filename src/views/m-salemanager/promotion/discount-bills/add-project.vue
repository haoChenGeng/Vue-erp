<template>
    <div>
        <el-dialog title="选择项目" v-model="addProject" @close="closeAddProject" ref="addDialogRef" class="addProject">
                    <t8t-search
                        :fields="fieldsData"
                        :selectSource="selectSourceData"
                        @submit="submitSearchData"
                        ref="t8tSearch"
                    >
                    </t8t-search>
                    <t8t-table
                        :columns="columnsData"
                        :service="serviceData"
                        :method="methodData"
                        :args="argsData"
                        ref="t8ttableData"
                        :commonData="selectSourceData"
                        :radioCol="true"
                        :total="totalRows"
                         @data-loaded="tableLoaded"
                    >
                    </t8t-table>
                    <div slot="footer">
                        <el-button type="primary" @click="onAddProject" :loading="isLoading">确认</el-button>
                        <el-button @click="closeAddProject">关闭</el-button>
                    </div>

        </el-dialog>
    </div>
</template>
<script>

    import Cookie from 'js-cookie'
    import cashDiscountApi from 'src/services/salemanager/cashDiscount.js'
    import Service from 'src/services/salemanager/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    
    export default{
        data(){
            return{
                isLoading:false,
                addProject:true,
                //搜索表单项配置
                fieldsData:[
                    { type: 'input' , label: '项目ID',name: 'id',defaultValue:''},
                    { type: 'select' , label: '门店',name: 'organizationId',selectSourceKey:'organization',filterable: true },
                ],
                //搜索select类型下拉列表数据，对应searchFormConfig的commonOptionsName
                selectSourceData: {
                    organization:[],
                },
                //表格

                columnsData: [{
                    prop: 'id',
                    label: '项目ID',
                }, {
                    prop: 'ownerName',
                    label: '业主称呼',
                }, {
                    prop: 'organizationName',
                    label: '门店',
                }, {
                    prop: 'houseAddress',
                    label: '详细地址'
                }],
                //请求参数配置
                serviceData: Service.CASHDISCOUNT.name,
                methodData: Service.CASHDISCOUNT.methods.LISTDECORATIONORDERINFO,
                argsData: {
                    search:{
                        id:null,
                    },
                    page:1,
                    size:20
                },
            }
        },
        props: ['projectId'],
        created() {
            this.getOrganization('organization')
            this.argsData.search.id = this.projectId

        },
        mounted () {  
            this.$nextTick(() => {
                if(this.projectId!=='')
                {
                    this.$refs.t8tSearch.setFormData({
                        id: this.projectId
                    })
                }
            })
        },
        methods:{
           
            submitSearchData(data)
            {
                this.argsData = {
                    search: data
                }
            },
            closeAddProject()
            {
                this.$emit('close')
                
            },
          
            onAddProject()
            {
                
                let selectRow = this.$refs['t8ttableData'].getSelectRows()[0]
                if(selectRow)
                {
                    this.isLoading = true
                    this.$emit('select', selectRow)
                    this.closeAddProject()

                }else{
                    this.$message.error("请选择项目")
                    return 
                }

            },
            getOrganization:function(selectName) 
            {
                let arg =  {
                    search:{
                        typeCode_eq:'001003010',
                        isDel:'0'
                    }
                }
                let list = []
                cashDiscountApi.queryOrg(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.rows.forEach((item) => {
                                list.push({
                                    value: item.id,
                                    text: item.name
                                })
                        })
                        this.selectSourceData[selectName] = list
                    }
                })

            },
            /*tableLoaded(dataSource)
            {
                console.log(this.projectId)
                this.$nextTick(() => {
                    let selectRows = [this.projectId];
                    let rows = dataSource.filter((item) => {
                        return selectRows.indexOf(item.id) !== -1
                    })
                    this.$refs.t8ttableData.$refs.table.store.states.selection = rows
                })

            }*/
                       
        }
        
    }
  
    
</script>
<style
    lang="css"
    scoped
>
    .addProject .el-dialog .el-dialog__body
    {
        height: 450px;
    }
    .addProject .el-dialog .el-dialog__body .t8t-table
    {
        height: 395px;
    }
</style>
<style>
    .addProject .el-dialog--small
    {
        width: 900px;

    }
</style>