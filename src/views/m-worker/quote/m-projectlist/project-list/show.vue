<template>
    <div class="quoteconfig">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

        <el-tabs v-model="activeName" @tab-click="handleClickTabs">
            <el-tab-pane v-for="item in tabs" :label="item.name" :name="item.symbol"></el-tab-pane>
        </el-tabs>

        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
            v-bind:class="{hideSearchPlane:false}"
        >
        </t8t-search>

        <div class="g-main-container">

                <t8t-toolbar
                    @QUOTE-OFFER="quoteOffer"
                    ref="toolbar"
                    v-bind:class="{hideToolbar:this.activeName == 'hasPicList'}"
                >
                </t8t-toolbar>
                <t8t-table
                    :columns="columns"
                    :service="service"
                    :method="method"
                    :args="args"
                    :dataSource="projectDataSource"
                    :preLoad = "true"
                    :pageBar="true"
                    :commonData="commonData"
                    ref="t8tTable"
                    @selection-change="selectionChange"
                >
                </t8t-table>
            </div>

        <edit-template
            v-if="dialogVisible"
            :rowId="rowId"
            :editType="editType"
            :title="dialogTitle"
            @close="dialogVisible=false"
            @getTableData="getTableData">
        </edit-template>
    </div>
</template>

<script>

    //import EditTemplate from './edit.vue'
    import Service from 'src/services/worker/projectlist/Service.js'
    import TemplateProjectlist from 'src/services/worker/projectlist/base-method.js'
    import api from 'src/utils/api.js'
    import Cookie from 'js-cookie'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import axios from 'src/utils/axios.js'
    import storages from 'src/services/storages/storages.js'

    export default {
        name: 'show',
        // components: {
        //     EditTemplate
        // },
        data(){
            return {
                breadcrumbData:[{title:'设计管理'},{title:'方案'},{title:'方案图纸'}],
                tabs: [
                    {name:'未出方案',symbol:'noPicList'},
                    {name:'已出方案',symbol:'hasPicList'}
                ],
                activeName: 'noPicList',
                //搜索表单项配置
                fields: [
                    {type: 'input',label: '项目ID',name: 'id'},
                    {type: 'select',label: '组织',name: 'organizationId_eq',selectSourceKey:'organization',filterable:true},
                    {type: 'select',label: '业务类型',name: 'bizTypeId_eq',selectSourceKey:'biz_type',filterable:true},
                    {type: 'select',label: '城市',name: 'cityId_eq',selectSourceKey:'citys',filterable:true},
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    organization: [

                    ],
                    biz_type:[],
                    citys:[]

                },

                columns:[],
                noPicColumns:[
                    { "prop": "id", "label": "项目ID"  },
                    { "prop": "houseAddress", "label": "楼盘地址"  },
                    { "prop": "bizTypeName", "label": "装修业务类型" },
                    { "prop": "productPkgName", "label": "装修产品包"  },
                    { "prop": "orderPriceName", "label": "价位" },
                    { "prop": "decoratePatternName", "label": "装修模式" },
                    { "prop": "decorateRangeName", "label": "装修范围"  },
                    { "prop": "decorateTypeName", "label": "装修类型" },
                    { "prop": "ownerName", "label": "业主名" },
                    { "prop": "orderMainStatusName", "label": "订单主状态"  },
                    { "prop": "orderSubStatusName", "label": "订单细化状态"  },
                    { "prop": "orderSalesSourceName", "label": "订单销售来源"  },
                    // { "prop": "updateTime", "label": "最后更新时间" , "formatter": "dateParser"},
                ],
                hasPicColumns:[
                    { "prop": "id", "label": "项目ID"  },
                    { "prop": "houseAddress", "label": "楼盘地址"  },
                    { "prop": "bizTypeName", "label": "装修业务类型" },
                    { "prop": "productPkgName", "label": "装修产品包"  },
                    { "prop": "orderPriceName", "label": "价位" },
                    { "prop": "decoratePatternName", "label": "装修模式" },
                    { "prop": "decorateRangeName", "label": "装修范围"  },
                    { "prop": "decorateTypeName", "label": "装修类型" },
                    { "prop": "ownerName", "label": "业主名" },
                    { "prop": "orderMainStatusName", "label": "订单主状态"  },
                    { "prop": "orderSubStatusName", "label": "订单细化状态"  },
                    { "prop": "orderSalesSourceName", "label": "订单销售来源"  },
                    // { "prop": "updateTime", "label": "最后更新时间" , "formatter": "dateParser"},
                ],
                commonData: {

                },

                service: Service.TEMPLATE.name,
                method:  Service.TEMPLATE.methods.QUERY,
                args: {
                    accountId:+Cookie.get('t8t-tc-uid'),
                    isComplete:false,
                },
                //弹窗dialog配置
                editType: 'add',
                dialogVisible: false,
                rowId: null,
                dialogTitle : '',
                tableData: [],
                selectedRows:[],
            }
        },

        created(){
               this.columns = this.noPicColumns
               this.getCommonOptions('11008','biz_type')

                //动态获取形态为分公司、门店的组织
                storages.getAllStore().then((res) => {
                    let list = []
                    if( res.data.status === 200 ){
                        res.data.result.rows.forEach((item) => {
                            list.push({
                                value: item.id,
                                text: item.name
                            })
                        })

                        this.selectSource['organization'] = list
                    }
                })


               this.getCityList('citys')

        },



        methods:{
                handleClickTabs(event){
                    let tab = this.$refs['t8tTable']
                    let method = event.name
                    this[method]()
                    tab.reloadTable()

                },
                noPicList(){
                    this.columns = this.noPicColumns
                    this.args.isComplete = false
                    //TODO 进行条件搜索
                },
                hasPicList(){
                    this.columns = this.hasPicColumns
                    this.args.isComplete = true
                    //TODO 进行条件搜索
                },
            //搜素
                submitSearch(obj) {
                    let newArgs =  Object.assign({},this.args)
                    newArgs.search = obj
                    this.args = newArgs

                },

            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            },

            quoteOffer(){
                let rows = this.$refs['t8tTable'].getSelectRows();
                if(rows.length < 1){
                    this.$message.error('请选择要处理的行！')
                    return
                }
                if(rows.length > 1){
                    this.$message.error('只能查看一行！')
                    return
                }
                this.$router.push({path:'/projectlist/preview', query:{yid:rows[0]['id']}})
            },
            //获取辅助资料
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
                            };
                        })
                        this.selectSource[selectName] = list
                    }
                })
            },


            //获取城市列表
            getCityList:function (selectName){
                let list = []
                axios({
                    service: 'N1LVaNofN3AuWiYng5GP1cEpdGHyrs_', // /biz/t8t-sys-dst/app
                    method: '0BVKmyCRIcVwR2bWHn1mQkW-5ypdhzM',// configCity.list.get
                    args: {

                    }
                }).then((res) => {
                    if (res.data.status === 200) {
                     res.data.result.forEach((item)=>{
                           list.push({
                                    value: item.townId,
                                    text: item.townName
                                })

                        })
                    }
                    this.selectSource[selectName] = list

                })
            },


            // getDatas:function(){
            //     let arg= {
            //       page: this.currentPage,
            //       size: this.pageSize,
            //       fields:["bizTypeId","productPkgId","orderPriceId","houseAddress","decoratePattern","decorateRange","decorateType","ownerId","orderMainStatus","orderSubStatus","orderSalesSource"]
            //     }

            //     TemplateProjectlist.query(arg).then((res)=>{

            //         if(res.data.status === 200){

            //             res.data.result.rows.forEach((item)=>{

            //                 item.decorationOrderVO['houseAddress'] = item.decorationOrderHouseVO['houseAddress']
            //                 this.projectDataSource.push(item.decorationOrderVO)

            //             })
            //         }

            //     })


            // }

         },




    }


</script>

<style lang="css" scope>
    .table-container {
        flex: 1;
        overflow: auto;
        margin-left: -1px;
    }

    .quoteconfig .g-main-container{

        display: flex;
        flex-direction: column;

     }
    .hideSearchPlane{
        display: none;
    }
    .hideToolbar{
        /*display: none;*/
    }
</style>
