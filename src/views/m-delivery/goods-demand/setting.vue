<template>
    <div>
        <t8t-breadcrumb></t8t-breadcrumb>
        <t8t-search
            ref="t8t-search"
            :fields="fields"
            :selectSource="commonData"
            @submit="submitSearch"
        >
        </t8t-search>
        <div class="g-main-container">
            <t8t-tree
                :data="treeData"
                :props="treeProps"
                @node-click="onTreeClick"
            >
            </t8t-tree>
            <div class="g-main-container-column">
                <t8t-toolbar
                    @SYNC_SKU="syncSku"
                    ref="toolbar"
                >
                </t8t-toolbar>
                <t8t-grid
                    :columns="columns"
                    :service="service"
                    :method="method"
                    :args="args"
                    :commonData="commonData"
                    :editable="true"
                    :selectCol="false"
                    ref="t8tTable"
                    :page-sizes="[5,20,50,100]"
                    @selection-change="selectionChange"
                    @data-loaded="dataLoaded"
                >
                </t8t-grid>
            </div>
        </div>
    </div>
</template>

<script>
    import Model from 'src/services/delivery/model.js'
    import Service from 'src/services/delivery/Service.js'
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
    export default {
        data(){
            let that = this;
            return {
                fields: [
                    {
                        type: 'select',
                        label: '要货批次',
                        name: 'goodsDemandBatch',
                        selectSourceKey: 'goodsDemandBatch'
                    },
                    {
                        type: 'select',
                        label: '品类',
                        name: 'categoryId',
                        selectSourceKey: 'category'
                    },
                    {
                        type: 'input',
                        label: '商品名称',
                        name: 'goodsName'
                    },
                    {
                        type: 'input',
                        label: '商品ID',
                        name: 'goodsId'
                    },
                    {
                        type: 'input',
                        label: 'SKUID',
                        name: 'skuId'
                    }
                ],
                commonData: {
                    "goodsDemandBatch": [],
                    "category": []
                },
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                columns: [
                    {
                        prop: 'goodsId',
                        label: '商品ID'
                    },
                    {
                        prop: 'skuId',
                        label: 'SKUID'
                    },
                    {
                        prop: 'goodsName',
                        label: '商品名称'
                    },
                    {
                        prop: 'goodsDemandBatchName',
                        label: '要货批次',
                        onClick(val,row,column,table){
                            //重置搜索参数
                            table.columns[3].editor.args = {};
                        },
                        onChange(val,row,column,table){
                            table.$nextTick(()=>{
                                if(val){
                                    row.goodsDemandBatch = val.value;
                                    row.goodsDemandBatchName = val.text;
                                }else{
                                    row.goodsDemandBatch = 0;
                                    row.goodsDemandBatchName = '';
                                }
                                that.updateBatch(row.id,row.goodsDemandBatch);
                            })
                        },
                        editor:{
                            type: 'lookup',
                            service: Service.YANSHOU.name,
                            method: Service.YANSHOU.methods.batchConfigQueryBatchConfig,
                            args:{},
                            columns: [
                                {
                                    prop: 'value',
                                    label: 'ID',
                                },
                                {
                                    prop: 'text',
                                    label: '要货批次'
                                },
                            ],
                            placeholder: '搜索要货批次名称',
                            filterMethod:(val,args)=>{
                                args['name'] = val;
                                return args
                            }
                        }
                    },
                    {
                        prop: 'categoryName',
                        label: '品类'
                    },
                    {
                        prop: 'brandName',
                        label: '品牌'
                    },
                    {
                        prop: 'standard',
                        label: '规格'
                    },
                    {
                        prop: 'model',
                        label: '型号'
                    }
                ],
                service: Service.YANSHOU.name,
                method: Service.YANSHOU.methods.batchConfigQueryBatchPage,
                args: {
                    search: {
                        "pkgTmpId": 0
                    }
                },
                selectedRows: [],
                currentPkgTmpId: null
            }
        },
        created(){
            //产品包模板树
            this.getPkgTmpTree();
            //获取品类
            this.getCategory();
            //要货批次下拉数据
            this.queryBatchConfig();
        },
        methods: {
            dataLoaded(data){
                data.forEach((item,index)=>{
                    if(!item.goodsDemandBatchName){
                        this.$set(item,'goodsDemandBatchName','')
                    }
                })
            },
            getPkgTmpTree(){
                axios({
                    service: Service.YANSHOU.name,
                    method: Service.YANSHOU.methods.batchConfigQueryPkgTmpTree,
                    args: {}
                }).then((res)=>{
                    if(res.data.status === 200){
                        this.treeData = [res.data.result];
                    }
                }).catch((error)=>{

                })
            },
            getCategory(){
                this.commonData.category = Model.getCommonOptions({ pPropertyCode: '11006' });
            },
            queryBatchConfig(){
                axios({
                    service: Service.YANSHOU.name,
                    method: Service.YANSHOU.methods.batchConfigGetBatchProperty,
                    args: {}
                }).then((res)=>{
                    if(res.data.status === 200){
                        this.commonData.goodsDemandBatch = res.data.result.demandBatchList;
                    }
                }).catch((error)=>{

                })
            },
            submitSearch(obj){
                if(this.currentPkgTmpId != null){
                    obj.pkgTmpId = this.currentPkgTmpId;
                }
                this.args = { search: obj }
            },
            onTreeClick(nodeData){
                if(typeof nodeData.code !== 'undefined'){
                    this.currentPkgTmpId = null;
                    this.args = { search: {pkgTmpId:0} }
                }else{
                    this.currentPkgTmpId = nodeData.id;
                    this.args = { search: {pkgTmpId:nodeData.id} }
                }
            },
            selectionChange(rows){
                this.selectedRows = rows;
            },
            syncSku(){
                if(this.currentPkgTmpId == null){
                    this.$message.error('请先选择产品包模板！');
                    return;
                }
                axios({
                    service: Service.YANSHOU.name,
                    method: Service.YANSHOU.methods.batchConfigSyncPkgTmpGoods,
                    args: {
                        "pkgTmpId": this.currentPkgTmpId, //产品包模板id
                        "createUser": +Cookie.get('t8t-tc-uid') //创建人
                    }
                }).then((res)=>{
                    if(res.data.status === 200){
                        this.$refs['t8tTable'].reloadTable();
                        this.$message.success('同步成功！');
                    }else{
                        this.$message.error('同步失败！');
                    }
                }).catch((error)=>{
                    this.$message.error('请求失败，请重试！');
                })
            },
            updateBatch(id,goodsDemandBatch){
                axios({
                    service: Service.YANSHOU.name,
                    method: Service.YANSHOU.methods.batchConfigUpdateBatch,
                    args: {
                        "id": id,
                        "goodsDemandBatch": goodsDemandBatch,
                        "updateUser": +Cookie.get('t8t-tc-uid') //创建人
                    }
                }).then((res)=>{
                    if(res.data.status === 200){
                        this.$message.success('更新成功！');
                    }else{
                        this.$message.error('更新失败！');
                    }
                }).catch((error)=>{
                    this.$message.error('请求失败，请重试！');
                })
            }
        }
    }
</script>
