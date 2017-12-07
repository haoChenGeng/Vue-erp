<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="true"

            :tableColumns="tableColumns"
            :tableService="service"
            :tableArgs="tableArgs"
            :tableMethod="method"
            :tableCommonData="searchOptions"

            :showTree="true"
            :treeData="treeData"
            :treeProps="treeProps"
            @tree-node-click="treeClick"

            @list-view="doView"

            @list-add="doAdd"

            :beforeSearchSubmit="beforeSubmit"
            @table-row-dobule-click="doView"
            @table-selection-change="selectionChange"
            @search-submit="onSearchSubmit"

            :tableRadioCol="true"
            :tableSelectCol="false"
        >
        </t8t-list-view>
        <duration-dialog
            v-if="addDialogVisible"
            @close="closeAdd"
            @reload="reloadTable"
        ></duration-dialog>


    </div>

</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import DateUtils from 'src/utils/DateUtils.js'
    import broadcastApi from 'src/services/delivery/broadcast.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/delivery/Service.js'
    import Cookie from 'js-cookie'
    import DurationDialog from './duration-dialog.vue'

    export default {
        components: {T8tListView,DurationDialog},
        data () {
            return {
                // 面包屑
                breadcrumbData: [{title: '工程管理'}, {title: '播报基础配置'}, {title: '工期配置'}],

                orderCode:null,

                // 详情页路由地址
                detailRoute: '/tuchat-delivery/page-duration-detail',
                // service 和 method 目前需要加密
                service: Service.BROADCAST.name,
                method: Service.BROADCAST.methods.BROADCASTDURATIONQUERYPAGE,
                tableArgs: {
                    search:{
                        id_gt:0
                    },
                    sort:["id_desc"]
                },
                // 表头描述
                tableColumns: [
                    {prop: 'id', label: '工期ID'},
                    {prop: 'bizTypeId', label: '业务类型', formatter:function(val,row){return row.bizTypeName || ''}},
                    {prop: 'pkgId', label: '产品包', formatter:function(val,row){return row.pkgName || ''}},
                    {prop: 'manHour', label: '工时'},
                    {prop: 'broadcastTimes', label: '日播报次数'},
                    {prop: 'firstTime', label: '一次播报时限',formatter:function(val){return val + ':00' }},
                    {prop: 'secondTime', label: '二次播报时限',formatter:function(val){return val + ':00' }},
                    {prop: 'effectTime', label: '生效时间',formatter(val){
                            let _time = ''
                            if (val) {
                                let objDate = new Date(val * 1000);
                                _time = DateUtils(objDate, 'yyyy-mm-dd')
                            }
                            return _time}}
                ],
                // 搜索项配置
                searchFields: [
                    {type: 'input', label: '工期ID', name: 'id'},
                ],

                treeProps: {
                    label: 'name',
                    children: 'children'
                },

                treeData: [],

                // 搜索项对应值
                searchOptions: {
                    bizTypeId:[]
                },


                dealer: Cookie.get('t8t-tc-username'),
                dealerId:Cookie.get('t8t-tc-uid'),
                addDialogVisible:false
            }
        },
        created(){
            let _self = this
            //TODO 获取业务类型、产品包并拼接树
            this.getProperties()
        },
        methods: {
            getProperties() {
                commonApi.queryUnionParent({search:{pPropertyCode:11008},page:1,size:100}).then(res=>{
                    if(res.data.status === 200) {
                        let _list = []
                        let _tree = []
                        res.data.result.forEach(item => {
                            _list.push({text:item.propertyName,value:item.id})
                            _tree.push({name:item.propertyName,value:item.id,children:[],type:"biz"})
                        })
                        this.searchOptions.bizTypeId = _list
                        this.treeData = _tree
                        this.getPkg()
                    }else {
                        this.$message.error("业务类型获取失败")
                        return
                    }
                }).catch(error => {
                    console.log(error)
                })
            },

            getPkg(){
                let args = {
                    "args": {
                        "search": {
                            id_gt:0
                        },
                        "sort": [
                            "createTime"
                        ],
                        "fields": [
                            "id",
                            "pkgName",
                            "bizType",
                            "createTime"
                        ]
                    }
                }
                broadcastApi.pkgQuery(args).then(res => {
                    if(res.data.status == 200) {
                        res.data.result.forEach(item =>{
                            let parents = this.treeData.filter(function(items){
                                return items.value === parseInt(item.bizType);
                            });
                            if(parents.length > 0) {
                                parents[0].children.push({name:item.pkgName,value:item.id,type:"pkg"})
                            }
                        })
                    }
                })
            },

            onSearchSubmit (obj) {
                if(this.sltOrg) {
                    obj.storeIdIn = this.sltOrg
                }
                this.tableArgs = {"search": obj,sort:["id_desc"]}
            },
            treeClick(data){
                if(data.type == 'biz') {
                    this.tableArgs = {
                        search : {
                            bizType:data.value
                        }
                    }
                }else{
                    this.tableArgs = {
                        search : {
                            pkgId:data.value
                        }
                    }
                }
            },
            doView(val) {
                if(typeof (val) === 'object') {
                    this.$router.push({path: this.detailRoute, query: {id:val.id}})
                    return
                }
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    this.$router.push({
                        path: this.detailRoute,
                        query: {id: selections[0].id}
                    })
                } else {
                    this.$message.error("请选择操作单据后重试")
                }
            },
            doAdd() {
                this.addDialogVisible = true

            },
            reloadTable(){
                this.$refs['list-view'].getTableInstance().reloadTable()
            },
            closeAdd(){
                this.addDialogVisible = false
            },
        }
    }
</script>
