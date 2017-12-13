/**
* Created by tomy.li on 2017/6/16.
*/
<template>
    <div class="desageDetailindex">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            ref="searchForm"
            :fields="fields"
            :selectSource="commonData"
            :showToggleBtn="false"
            @submit="submitSearch"
        >
        </t8t-search>

        <div class="g-main-container">
          <t8t-toolbar ref="topToolbar"
                         :symbolList="['EXPORT']"
                         @EXPORT="exportExcel()"
            >
            </t8t-toolbar>
            <t8t-table
                :columns="columns"
                :service="service"
                :method="method"
                :args="args"
                :pageBar="true"
                :commonData="commonData"
                :selectCol="false"
                ref="t8tTable"
                @data-loaded="handleDataLoaded"
            >
            <template slot="id" scope="scope">
                <span v-if="scope.row['detailId']==0">
                <a  href="javascript:;" @click="showDetail(scope.row['id'])">{{scope.row['id']}}</a>
                </span>
                <span v-else>{{scope.row['id']}}</span>
            </template>
            </t8t-table>
        </div>
       <show-bom
            v-if="dialogVisible"
            :rowId="rowId"
            :title="dialogTitle"
            @close="dialogVisible=false"
            @getTableData="getTableData">
        </show-bom>

    </div>
</template>

<script>
    import ShowBom from './showBom.vue'
    import api from 'src/utils/api.js'
    import Cookie from 'js-cookie'
    import service from 'src/services/delivery/dosageDetail/Service.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import exportUtils from 'src/utils/export.js'
    export default {
        name: 'index',
        components: {
            ShowBom
        },
        data(){
            return {
                breadcrumbData:[{title:'交付'},{title:'项目执行'},{title:'项目用量明细'}],
                service: service.home.name,
                method:  service.home.methods.QUERY,
                args: {dosageDetailDTO:null},

                //项目静态数据
                currentYid:null,
                //搜索表单项配置
                fields: [
                    {type: 'input',label: '项目ID',name: 'yid'},
                    {type: 'input',label: '商品ID',name: 'deliveryId'},
                    {type: 'select',label: '状态',name: 'detailStatus',selectSourceKey:'checkStatus'},
                    {type: 'select',label: '明细来源',name: 'detailSourceType',selectSourceKey:'detailSourceTypes'},
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {

                    moduleStatus: [

                    ],
                    forbiddenStatus: [
                        {
                            text: '否',
                            value: 0
                        },
                        {
                            text: '是',
                            value: 1
                        }
                    ],


                },
                columns:
                    [
                        {"prop": "id", "label": "用量明细ID"},
                        {"prop": "yid", "label": "项目ID",},
                        {"prop": "orgName", "label": "组织"},
                        {"prop": "bizType", "label": "业务类型",'list':'bizTypes'},
                        {"prop": "pkgName", "label": "产品包"},
                        {
                            "prop": "deliveryType", "label": "交付项类型", 'list':'deliveryTypes',
                        },
                        {"prop": "detailSourceType", "label": "明细来源类型",'list':'detailSourceTypes'},
                        {"prop": "deliveryId", "label": "商品ID"},
                        {"prop": "", "label": "商家名称"}, //WRANING 数据未返回
                        {"prop": "goodsName", "label": "商品名称"},
                        {"prop": "model", "label": "型号"},
                        {"prop": "standard", "label": "规格"},
                        {"prop": "brandName", "label": "品牌"},
                        {"prop": "spaceName", "label": "空间"},
                        {
                            "prop": "placeId", "label": "位置", 'list': 'places',
                        },
                        // {"prop": "isBom", "label": "是否BOM", 'list': 'isBom'},
                        // {"prop": "isStandard", "label": "是否标准品", 'list': 'isStandard'},
                        {"prop": "estimateAmount", "label": "预计用量"},
                        {"prop": "actualAmount", "label": "实际用量"},
                        {"prop": "basicUnit", "label": "单位",'list':'basicUnits'},
                        {"prop": "detailStatus", "label": "状态", 'list': 'detailStatus'},
                        {"prop": "startDate", "label": "合同开工时间"},
                    ],
                commonData: {

                    //用量明细状态  0-待提交审核 1-审核中 2-已驳回 3-待要货 4-待测量 5-测量中 6-已下单
                    detailStatus: [
                        {
                            text: '待提交审核',
                            value: 0
                        },
                        {
                            text: '审核中',
                            value: 1
                        },
                        {
                            text: '已驳回',
                            value: 2
                        },
                        {
                            text: '待要货',
                            value: 3
                        },
                        {
                            text: '待测量',
                            value: 4
                        },
                        {
                            text: '测量中',
                            value: 5
                        },
                        {
                            text: '已下单',
                            value: 6
                        }
                    ],
                    checkStatus:[
                        /*用量明细状态 0-待提交审核 1-审核中 2-已驳回 3-待要货 4-待测量 5-测量中 6-已下单   */
                        {
                            text: '待提交审核',
                            value: 0
                        },
                        {
                            text: '审核中',
                            value: 1
                        },
                        {
                            text: '已驳回',
                            value: 2
                        },
                        {
                            text: '待要货',
                            value: 3
                        },
                        {
                            text: '待测量',
                            value: 4
                        },
                        {
                            text: '测量中',
                            value: 5
                        },
                        {
                            text: '已下单',
                            value: 6
                        },

                    ],
                    isStandard:[],
                    isBom:[],
                    places:[],
                    deliveryTypes:[],
                    bizTypes:[],
                    basicUnits:[],
                    detailSourceTypes:[],
                    forbiddenStatus: [
                        {
                            text: '否',
                            value: 0
                        },
                        {
                            text: '是',
                            value: 1
                        }
                    ],
                },
                //弹窗dialog配置
                dialogVisible: false,
                rowId: null,
                dialogTitle : '',
                tableData: [],
                selectedRows:[]
            }
        },

        methods:{
            //搜素
            submitSearch(objForm) {
                let obj = Object.assign({},objForm);

                let argsObj = Object.assign({},this.args)
                argsObj.dosageDetailDTO = obj;
                this.args = argsObj;
            },

            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            },

            handleDataLoaded(data){
                data.map(item => {
                    item.placeId = +item.placeId
                    item.deliveryType = +item.deliveryType
                })
            },

            showDetail(id){
                this.dialogTitle = '查看BOM组件'
                this.dialogVisible = true
                this.rowId = id
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
                apiCommon.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus === 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            })
                            this.commonData[selectName] = list
                        }
                    })
            },

            //导出excel
            exportExcel: function (){
                if (this.$refs['t8tTable'].totalRows <= 10000) {
                    this.$TCS.addTag('red_6392_018009001002')
                    //获取当前搜索条件
                    let _form = this.$refs['searchForm']
                    let copySearch = _form.getFormData()
                    let obj = Object.assign({},copySearch);
                    let argsObj = Object.assign({},this.args)
                    argsObj.dosageDetailDTO = obj;
                    argsObj.accountId = Cookie.get("t8t-tc-uid")

                    let _args = argsObj

                    exportUtils({
                        service: service.home.name,
                        method: service.home.methods.export,
                        args: _args,
                        headers: '用量明细ID,项目ID,组织,业务类型,产品包,交付项类型,明细来源类型,商品ID,商品编码,skuID,商品名称,型号,规格,品牌,空间,位置,预计用量,实际用量,单位,状态,合同开工时间',
                        sorts: 'id,yid,orgName,bizTypeName,pkgName,deliveryTypeName,detailSourceTypeName,deliveryId,goodsCode,skuId,goodsName,model,standard,brandName,spaceName,placeName,estimateAmount,actualAmount,basicUnitName,detailStatusName,startDate',
                        title:'商品销售报表',
                    })
                }
                else {
                    this.$message.error('数据总条数超过10000条，请筛选后导出')
                }

            }
        },
        created(){
            this.getCommonOptions(30003,'places')
            this.getCommonOptions(42202,'deliveryTypes')
            this.getCommonOptions(42201,'detailSourceTypes')
            this.getCommonOptions(11008,'bizTypes')
            this.getCommonOptions(11003,'basicUnits')
        }

    }


</script>

<style lang="css" scope>
    .table-container {
        flex: 1;
        overflow: auto;
        margin-left: -1px;
    }

    .desageDetailindex .g-main-container{

        display: flex;
        flex-direction: column;

    }
</style>
