<template>
    <div class="record-list">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

        <t8t-search :fields="fields" @submit="submitSearch" :selectSource="selectSource"></t8t-search>
        <t8t-table
            :columns="columns"
            :service="service"
            :method="method"
            :commonData="selectSource"
            :args="args"
            ref="broadcastListTable"
            :selectCol="false"
            @row-double-click="viewBtn"
        >
            <template slot="projectId" scope="scope">
                <span style="color: blue;cursor: pointer"
                    @click="viewBtn(scope.row)"
                >{{scope.row['projectId']}}</span>
            </template>
        </t8t-table>
    </div>
</template>

<script>

    import Service from 'src/services/delivery/Service.js'
    import Cookie from 'js-cookie'

    import commonApi from 'src/services/commonApi/commonApi.js'

    import broadcastApi from 'src/services/delivery/broadcast.js'

    export default {
        name: 'page-broadcast-list',
        data() {
            return {
                service: Service.BROADCAST.name,
                method: Service.BROADCAST.methods.QUERYBROADCASTRECORDPROJECTINFOFORPC,
                args: {
                    page:1,
                    size:20
                },
                detailRoute:"/delivery/page-record-detail",
                selectSource:{
                    citys:[],
                    clientManagerList:[],
                    bizTypeId:[],
                    pkgList:[],
                    broadcastStatus:[
                        {value:null,text:''},
                        {value:1,text:'正常'},
                        {value:2,text:'延期'},
                        {value:3,text:'未播'},
                        {value:4,text:'待播'},
                    ]
                },
                fields: [
                    {type: 'input', label: '项目ID', name: 'projectId'},
                    {type: 'input', label: '项目经理ID', name: 'chiefWorkerId'},
                    {type: 'division',label: '城市',name: 'cityIdArr', selectSourceKey:'citys', props:{
                        value:'id',
                        label:'name',
                        children:'children'
                    },defaultValue:[]},
                    {
                        type: 'datepicker',
                        label: '创建时间',
                        name: 'createTime',
                        pickertype: 'daterange',
                        startField: 'startTime',
                        endField: 'endTime'
                    },
                    {type: "select", label:"产品包",name:"productPkgId",selectSourceKey:"pkgList",filterable:true},
                    {type: 'input', label: '项目管家ID', name: 'projectManagerId'},
                    {type: "select", label:"业务类型",name:"bizTypeId",selectSourceKey:"bizTypeId",filterable:true},
                ],
                columns: [
                    {
                        prop:"projectId",
                        label: "项目ID"
                    },
                    {
                        prop:"bizTypeName",
                        label: "业务类型"
                    },
                    {
                        prop:"productPkgName",
                        label: "产品包"
                    },
                    {
                        prop:"chiefWorkerName",
                        label: "项目经理"
                    },
                    {
                        prop:"standardCityName",
                        label: "城市"
                    },
                    {
                        prop:"broadcastRecordStatusName",
                        label: "播报情况"
                    },
                    {
                        prop:"projectManagerNick",
                        label: "项目管家/监理"
                    },
                    ]
            }
        },
        // watch: {
        //     $route: function () {
        //         this.getTableData()
        //     },
        // },
        activated(){
            this.getTableData()
        },
        created(){
            this.initAreaInfo()
            this.getProperties()
            this.getPkg()
        },
        methods: {
            initAreaInfo(){
                let args = {}
                broadcastApi.pctreeGetConfig(args).then((res) => {
                    if(res.data.status == 200){
                        this.selectSource.citys = res.data.result
                    }
                })
            },
            getProperties() {
                commonApi.queryUnionParent({search:{pPropertyCode:11008}, page:1, size:100}).then(res=>{
                    if(res.data.status === 200) {
                        let _bizList = []
                        res.data.result.forEach(item => {
                            _bizList.push({text:item.propertyName,value:item.id})
                        })
                        this.selectSource.bizTypeId = _bizList
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
                            "pkgName"
                        ]
                    }
                }
                broadcastApi.pkgQuery(args).then(res => {
                    if(res.data.status == 200) {
                        let _list = []
                        res.data.result.forEach(item =>{
                            _list.push({text:item.pkgName,value:item.id})
                        })
                        this.selectSource.pkgList = _list
                    }
                })
            },
            //表格刷新
            getTableData() {
                this.$refs['broadcastListTable'].reloadTable();
            },
            submitSearch (obj) {
                let _search = {}
                Object.keys(obj).forEach((item) => {
                    if(item == 'endTime' || item == 'startTime') {
                        if(!_search.recordCreateTime) _search["recordCreateTime"] = {}
                        _search.recordCreateTime[item] =  obj[item]
                    }else if(item == "cityIdArr") {
                        if(obj[item] && obj[item].length){
                            if(obj[item].length == 1) {
                                _search.proId = obj[item][0]
                            }else{
                                _search.proId = obj[item][0]
                                _search.cityId = obj[item][1]
                            }
                        }
                    }else{
                    _search[item] = obj[item]
                }
                })
                this.args = {"search": _search,sort:["id_desc"]}
            },
            viewBtn (row){
                this.$router.push({path: this.detailRoute, query: {id:row.projectId}})
            }
        }
    }
</script>
