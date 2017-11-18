<template>
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog previewQuoteOrder">

        <!--操作区-->
        <div class="full-dialog-toolbar-container">
            <!--['PREVIEW','TEMP-SAVE','EDIT-SUBMIT','UNDO','RESET','APPROVAL-FLOW','LOG-EDIT']-->

            <div class="toolbar-container">
                <div>
                    <el-button @click="closeDialog()">返回</el-button>
                    <!--<el-button @click="share()">分享</el-button>-->
                </div>
                <t8t-toolbar ref="topToolbar"
                             class="headerToolbar"
                             @PRINT="print()"
                >
                </t8t-toolbar>

            </div>
        </div>

        <div class="t8t-full-dialog-container">

           <el-tabs v-model="activePane">
                    <el-tab-pane label="封面" name="baseInfo">
                        <div class="table-frame tab-baseInfo">
                            <div>
                                <img src="./u1357.png">
                            </div>
                            <div class="table-agreement">
                                <span>合同编号：{{quoteOrderData.title['number']}}</span>
                            </div>
                            <div class="table-title">
                                <h1>{{quoteOrderData.title['pkgName']}}</h1>
                                <h2>预算书</h2>
                            </div>
                            <div class="tab-body">
                                <div class="table-information">
                                    <p>
                                        <strong>业主姓名：</strong> <span></span>
                                    </p>
                                    <p>
                                        <strong>联系方式：</strong> <span></span>
                                    </p>
                                    <p>
                                        <strong>工程地址：</strong> <span></span>
                                    </p>
                                </div>
                                <div class="table-footer">
                                    <h2>土巴兔(深圳)装饰设计工程有限公司</h2>
                                    <p>总部地址：深圳市南山区高新园科研路9路比克科技大厦10楼</p>
                                    <p>龙岗店地址：深圳市龙岗区花样年华龙年大厦9楼</p>
                                    <p>全国咨询电话：4006-900-288</p>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="报价单" name="quoteOrderInfo" class="org-tab-pane city-pane">
                        <div class="table-frame tab-quoteOrderInfo">
                            <div class="table-header">
                                <img src="./u1357.png">
                                <h2>{{quoteOrderData.title['pkgName']}}报价单</h2>
                            </div>
                            <div class="table-list">
                                <span>工程地址：{{quoteOrderData.title['address']}}</span>
                                <span>设计师：{{quoteOrderData.title['designerName']}}</span>
                                <span>设计师电话：{{quoteOrderData.title['designerPhoneId']}}</span>
                                <span>业主称呼：{{quoteOrderData.title['yzName']}}</span>
                                <span>户型：{{quoteOrderData.title['houseType']}}</span>
                                <span>面积：{{quoteOrderData.title['area']}}</span>
                            </div>
                            <div class="tab-body">


                                <!-- 汇总面板 -->
                                <div class="summaryMoney">
                                    <div class="summary-header space-data-header">合计</div>
                                    <div class="summary-body">
                                        <t8t-table
                                            :columns="summaryColumns2"
                                            :dataSource="summaryData2"
                                            :indexCol="false"
                                            :selectCol="false"
                                            :editable="true"
                                            :pageBar="false"
                                            :showHeader="false"
                                            ref="summarytable2"
                                        >
                                            <template scope="scope" slot="name">
                                                <div class="cell-text">
                                                    {{scope.row.name}}&nbsp;:&nbsp;&nbsp;
                                                </div>
                                            </template>
                                        </t8t-table>
                                    </div>
                                </div>


                                <t8t-table
                                    :columns="quoteOrderInfoColumns"
                                    :dataSource="quoteOrderInfoData"
                                    :indexCol="false"
                                    :selectCol="false"
                                    :editable="false"
                                    :pageBar="false"
                                    ref="quoteOrderInfoTable"
                                >
                                </t8t-table>



                                <!--
                                    提示面板
                                -->
                                <div class="summaryMoney">
                                    <div class="summary-header space-data-header">温馨提示</div>
                                    <div class="summary-body">
                                        <el-row>
                                            <el-col :span="24">
                                                <t8t-table
                                                    :columns="summaryColumns3"
                                                    :dataSource="summaryData3"
                                                    :indexCol="false"
                                                    :selectCol="false"
                                                    :editable="true"
                                                    :pageBar="false"
                                                    :showHeader="false"
                                                    ref="summarytable3"
                                                >
                                                    <template scope="scope" slot="text">
                                                        <div class="cell-text">
                                                            &nbsp;{{scope.row.text}}
                                                        </div>
                                                    </template>
                                                </t8t-table>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>

                            </div>
                            <div class="signBox">
                                <el-row>
                                    <el-col :span="8">业主签字：</el-col>
                                    <el-col :span="8">设计师签字：</el-col>
                                    <el-col :span="8">设计师主管签字：</el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="项目清单" name="otherInfo">
                        <div class="table-frame tab-otherInfo">
                            <div class="table-header">
                                <img src="./u1357.png">
                                <h2>{{quoteOrderData.title['pkgName']}}项目清单</h2>
                            </div>
                            <div class="tab-body">
                                <div class="spaceQuoteItemPanel">
                                    <template>
                                        <el-row v-for="(space, index) in spacesData">
                                            <el-col :span="24">
                                                <div class="space-content">
                                                    <el-row style="display: flex;flex-direction: row;">
                                                        <el-col :span="2" class="spaceNameBox">
                                                            <div class="space-data">
                                                                <div v-if="!index" class="space-data-header">使用空间</div>

                                                                <div class="space-data-body">
                                                                    <div class="space-name space-data-body-text" >
                                                                        <div class="space-name-text">
                                                                            {{space.spaceName}}<br>
                                                                            <span class="space-number-input spaceAliasInput">（{{space['spaceAlias']}}）</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </el-col>
                                                        <el-col :span="1">
                                                            <div class="space-data">
                                                                <div v-if="!index" class="space-data-header">尺寸</div>
                                                                <div class="space-data-body">
                                                                    <div class="space-size space-data-body-text">
                                                                            <div class="space-data-body-input-box">面积：{{space['spaceArea']}}</span></div>
                                                                            <div class="space-data-body-input-box">周长：{{space['spaceGirth']}}</span></div>
                                                                            <div class="space-data-body-input-box">层高：{{space['spaceHeight']}}</span></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </el-col>
                                                        <el-col :span="21">

                                                            <t8t-table
                                                                :columns="mainTableColumns2"
                                                                :dataSource="space['quoteOrderItemList']"
                                                                :commonData="selectSource"
                                                                :indexCol="true"
                                                                :selectCol="false"
                                                                :showHeader="true"
                                                                :pageBar="false"
                                                                ref="t8ttable"
                                                            >
                                                                <template scope="scope" slot="qiName" :class="cell-text">
                                                                    <div class="cell-text" :title="scope.row.qiName">
                                                                        {{scope.row.qiName}}
                                                                    </div>
                                                                </template>

                                                                <!--
                                                                    临时版本。 展示sku颜色colorName，尺寸 size
                                                                -->
                                                                <template scope="scope" slot="deliveryId">
                                                                    <el-popover trigger="hover" placement="right" v-if="scope.row.deliveryId != 0 && scope.row.deliveryId != undefined">
                                                                        <div class="skuinfo-popover">
                                                                            <div class="skuinfo-popover-content">
                                                                                <div class="skuImage">
                                                                                    <div>
                                                                                        <img width="170" height="170" v-bind:src="'http://pic.to8to.com' + (JSON.parse(scope.row.goodsImgs).length ? JSON.parse(scope.row.goodsImgs)[0] : '') "/>
                                                                                    </div>

                                                                                </div>

                                                                                <div class="skuAttr">
                                                                                    颜色：    {{scope.row.colorName}}
                                                                                </div>
                                                                                <div class="skuAttr">
                                                                                    尺寸：   910*127
                                                                                </div>
                                                                            </div>

                                                                        </div>

                                                                        <div slot="reference" class="name-wrapper">
                                                                            <span class="selectDeliveryIdHand">{{ scope.row.deliveryName ? scope.row.deliveryName : '*******'}}</span>
                                                                        </div>
                                                                    </el-popover>
                                                                    <div slot="reference" class="name-wrapper" v-if="scope.row.deliveryId == 0 || scope.row.deliveryId == undefined">
                                                                        <span class="selectDeliveryIdHand">*******</span>
                                                                    </div>
                                                                </template>

                                                                <template scope="scope" slot="craftDetails">
                                                                    <el-popover trigger="hover" placement="bottom">
                                                                        <div class="craftDetails-popover">{{scope.row.craftDetails}}</div>
                                                                        <div slot="reference" class="name-wrapper">
                                                                            <div class="cell-text">{{scope.row.craftDetails}}</div>
                                                                        </div>
                                                                    </el-popover>
                                                                </template>

                                                            </t8t-table>

                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </template>
                                </div>

                                <!--
                                    汇总面板
                                -->
                                <div class="summaryMoney">
                                    <div class="summary-header space-data-header">平台统一配送主要辅料品牌</div>
                                    <div class="summary-body">
                                        <el-row>
                                            <el-col :span="24">
                                                <t8t-table
                                                    :columns="summaryColumns"
                                                    :dataSource="summaryData"
                                                    :indexCol="false"
                                                    :selectCol="false"
                                                    :editable="true"
                                                    :pageBar="false"
                                                    :showHeader="false"
                                                    ref="summarytable"
                                                >
                                                    <template scope="scope" slot="name">
                                                        <div class="cell-text">
                                                            {{scope.row.name}} :&nbsp;
                                                        </div>
                                                    </template>
                                                    <template scope="scope" slot="text">
                                                        <div class="cell-text">
                                                            &nbsp;{{scope.row.text}}
                                                        </div>
                                                    </template>
                                                </t8t-table>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>

                            </div>
                            <div class="signBox">
                                <el-row>
                                    <el-col :span="8">业主签字：</el-col>
                                    <el-col :span="8">设计师签字：</el-col>
                                    <el-col :span="8">设计师主管签字：</el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
        </div>
    </el-dialog>
</template>

<script>
    import api from 'src/services/system/organization.js'
    // import GeoUtils from 'src/utils/Geo.js'
    import methods from 'src/services/worker/quoteorder/methods.js'
    import service from 'src/services/worker/quoteorder/Service.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import axios from 'src/utils/axios.js'
    import printPDFUtils from 'src/utils/printPDF.js'
    import Cookie from 'js-cookie'
    export default {
        data () {
            return {
                tempId:'', //模板
                yid:'', //户型
                orderId:'',//报价单ID
                childSpacesList:[], //可选的子空间
                quoteOrderData:{},//预览报价单全量数据, 包含报价单头信息及各个tab的数据
                quoteItemsUnstandard:[], //可选的个性化报价项
                quoteOrderInfo:{}, //报价单基本信息
                quoteOrderDialogVisible:true,
                title: '报价单预览',
                activePane: 'baseInfo',
                data: {
                    contactEmployee: {},
                    functionCodes: []
                },
                isDialogShow: true,
                empName: [],
                loading: false,
                requestTime: 0,
                submitLoading: false,
                cities: [],
                cityNames: [],
                quoteInfo:{
                    pkgName:'土巴兔精品美家'
                },
                selectSource:{
                    'places': []
                },
                quoteOrderInfoColumns:[
                    {
                        "prop": "qiName",
                        "label": "项目名",
                        "width":250,
                        "resizable": false
                    },
                    {
                        "prop": "amount",
                        "label": "数量",
                        "width":80,
                        "resizable": false
                    },
                    {
                        "prop": "qiUnit",
                        "label": "单位",
                        "width":80,
                        "resizable": false
                    },
                    {
                        "prop": "price",
                        "label": "单价",
                        "width":80,
                        "resizable": false
                    },
                    {
                        "prop": "totalMoney",
                        "label": "金额",
                        "width":120,
                        "resizable": false,
                        formatter(val, row) {
                            return val > 0 ? val : row.tempItemType == 0 ? '-' : row.amount ? (+row.price * +row.amount).toFixed(2) : 0
                        }
                    },
                    {
                        "prop": "craftDetails",
                        "label": "备注",
                        "resizable": false
                    },
                ],
                quoteOrderInfoData:[],
                summaryColumns3:[
                    {
                        "prop": "text",
                        "label": "提示信息",
                        "resizable": false,
                        "align":'left',
                    }
                ],
                summaryData3:[
                    {
                        text:'  1.  所有套餐内的项目不拆分、不抵扣、不折现',
                    },
                    {
                        text:'  2.  如果您先做预算（指尚未出施工图纸），此报价仅供您参考或作为您于公司签定施工合同的参考依据，我公司保留依据施工图纸所用材料和加工件复杂系数、修订项目单价的权利。',
                    },
                    {
                        text:'  3.  套餐适用于单层商品房项目（不含公寓及复式）。若非平层户型选用本套餐，则计价面积等于套内实测总面积（不含楼梯）乘以1.15。'
                    },
                    {
                        text:'  4.  本报价不含物业管理处各项收费（物业公司要求的装修押金、施工相关费用、管理费、垃圾费等均由业主承担并交纳）、因施工违反物业规定施工造成的业主损失'
                    },
                    {
                        text:'  5.  依据天然气单位相关规定，厨房不能做开放式，必须安装门且有自然通风窗口，方可开通煤气。在装修前和进场装修时需业主自行解决天然气单位开通事宜，若后期不能开通煤气由业主自行承担。'
                    },
                    {
                        text:'  6.  施工项目依照本预算所立项目为依据，预算外项目应按实际发生计算，具体费用参照个性化另外计取。'
                    },
                    {
                        text:'  7.  本报价所规定材料的品牌、规格、型号如遇市场断货、缺货、产品升级等情况，公司有权选用不低于原材料档次的其他品牌、规格、型号材料作为替代。'
                    }
                ],
                summaryColumns2:[
                    {
                        "prop": "name",
                        "label": "项目名",
                        "width":490, //宽度为报价单表格前几列的总和
                        "resizable": false,
                        align: 'right'
                    },
                    {
                        "prop": "total",
                        "label": "金额",
                        "width":120,
                        "resizable": false
                    },
                    {
                        "prop": "detail",
                        "label": "描述",
                        "resizable": false
                    },
                ],
                summaryData2:[
                ],
                summaryData:[
                    {
                        name:'板材类',
                        text:'紫珊瑚生态板、可耐福石膏板、可耐福轻钢龙骨'
                    },
                    {
                        name:'电线类',
                        text:'美国金貂阻燃电线   弱电：飞利浦牌超五类双屏蔽网络线，飞利浦牌96编高清数字电视线，飞利浦牌四芯电话线'
                    },
                    {
                        name:'管材类',
                        text:'保利PVC电管（红蓝双色线管）、保利PP-R热水管（橘红）、联塑PVC排水管、保利PVC排水管'
                    },
                    {
                        name:'膏粉类',
                        text:'莱恩斯界面剂、莱恩斯内墙腻子'
                    },
                    {
                        name:'防水类',
                        text:'东方雨虹'
                    },
                    {
                        name:'乳胶漆',
                        text:'多乐士内墙环保乳胶漆（底漆：多乐士至尊抗碱无添加底漆5L装，面漆：多乐士至尊五合一无添加面漆5L装）'
                    },
                    {
                        name:'胶类',
                        text:'龙马白乳胶'
                    },
                    {
                        name:'水泥/砂',
                        text:'32.5#水泥和中性水洗砂'
                    }
                ],
                summaryColumns:[
                    {
                        "prop": "name",
                        "label": "项目名",
                        "resizable": false,
                        "align": 'right',
                        width:100
                    },
                    {
                        "prop": "text",
                        "label": "项目信息",
                        "resizable": false,
                        "align": 'left',
                    }


                ],
                mainTableColumns:[
                    {
                        "prop": "spaceId",
                        "label": "使用空间",
                        width:120
                    },
                    {
                        "prop": "size",
                        "label": "尺寸",
                        width:120
                    },
                    {
                        "prop": "placeId",
                        "label": "",
                    },
                ],
                mainTableColumns2:[
                    {
                        type: 'index',
                        label: '序号',
                        minWidth:40,
                    },
                    {
                        "prop": "placeId",
                        "label": "位置",
                        "width": 80,
                        "list":'places',
                        "resizable": false,

                    },
                    /*{
                     "prop": "serialNumber",
                     "label": "序号",
                     "width": 80,
                     "resizable": false
                     },*/
                    {
                        "prop": "qiName",
                        "label": "报价项名称",
                        "width": 250,
                        "resizable": false
                    },
                    {
                        "prop": "amount",
                        "label": "数量",
                        "width": 80,
                        "resizable": false,
                        editor:{
                            type:'input',
                            rules:
                                function(val, row , col, tab){
                                    //匹配多于两位的小数
                                    let exp = new RegExp('^[0-9]+(\\.\\d{3,})$')

                                    return [{
                                        type:'number',
                                        'validator': (rule, value, callback, source, options) => {

                                        //最多精确到两位小数
                                        if(exp.test(+value)){
                                        callback(false)
                                    }
                                    else if( (+value >=row.lowerLimit && +value <= row.upperLimit) || +value === 0){
                                        callback()
                                    }else{
                                        callback(false)
                                    }
                                },
                                    //pattern: exp,
                                    message: `请输入${row.lowerLimit}-${row.upperLimit}之间的数字, 精确到两位小数`,
                                    /*transform (val) {
                                     return +val;
                                     },*/
                                },
                                    /*{
                                     type:'number',
                                     min: row.lowerLimit,
                                     max: row.upperLimit,
                                     transform (val) {
                                     return +val;
                                     },
                                     message: `请输入${row.lowerLimit}-${row.upperLimit}之间的数字`
                                     }*/
                                    ]
                                },
                        },
                        formatter(val, row) {
                            return val ? +val : 0
                        }
                    },
                    {
                        "prop": "qiUnit",
                        "label": "单位",
                        "width": 80,
                        "resizable": false
                    },
                    {
                        "prop": "price",
                        "label": "单价",
                        "width": 80,
                        "resizable": false,
                        formatter(val, row) {
                            return row.tempItemType == 0 ? '-' : +row.price
                        }
                    },
                    {
                        "prop": "totalMoney",
                        "label": "金额",
                        "width": 120,
                        "resizable": false,
                        formatter(val, row) {
                            return row.tempItemType == 0 ? '-' : row.amount ? (+row.price * +row.amount).toFixed(2) : 0
                        }
                    },
                    {
                        "prop": "tempItemType",
                        "label": "是否标准",
                        "width": 80,
                        "resizable": false,
                        formatter(val, row) {
                            return row.tempItemType == 0 ? '是' : '否'
                        }
                    },

                    {
                        "prop": "deliveryId",
                        "label": "SKU",
                        "width": 150,
                        formatter(){
                            return `<span class="selectDeliveryIdHand">*******</span>`
                        },
                        "resizable": false
                    },
                    {
                        "prop": "craftDetails",
                        "label": "工艺详情",
                        "resizable": false,
                        "minWidth":300
                    },

                ],
            }
        },
        methods: {
            //初始化页面参数， 从路由抽取参数
            initParams: function (){
                this.tempId = this.$route.query.tempId //模板
                this.yid = this.$route.query.yid //户型
                this.orderId = this.$route.query.orderId //报价单id
            },
            //清除掉页面数据,  避免路由参数变化后历史数据有所遗留
            cleanPageData: function (){
                this.spacesData = []
                this.quoteOrderInfo = {}
                this.directProjectFee = 0 //直接工程费
                this.pkgPrice = 0 //标准套餐价
                this.totalPrice = 0 //合同总价
            },
            closeDialog() {
                this.$router.go(-1)
            },

            handleClose(city) {
                this.cities.splice(this.cities.indexOf(city), 1);
                this.buildCityNames()
            },

            //打印报价单
            print(){
                printPDFUtils({
                    method: service.order.methods.printOrder,
                    service: service.order.name,
                    args: {
                        "quoteOrderPrintDTO":{
                            'id':this.quoteOrderInfo.id
                        }
                    },
                })
            },
            //初始化项目信息及报价单详情
            initQuoteOrderDetail: function (){
                /*debugger
                 let tempId = this.$route.query.tempId
                 let yid = this.$route.query.yid*/
                methods.quoteOrderInfo(this.yid, this.tempId, 0, 0, +Cookie.get('t8t-tc-uid') ).then((res) => {
                    let _topToolbar = this.$refs['topToolbar']
                    if( res.data.status == 200 ){

                        let quoteOrder = res.data.result.quoteOrder

                        //对请求的结果做校验，如字段是否缺失、数值是否准确， 不符合的也不允许做后续操作
                        if(!quoteOrder.hasOwnProperty('pkgPrice')){
                            return this.$msgbox({
                                title:' ',
                                type:'error',
                                message:'未获取到项目标配套餐价'
                            })
                            return false;
                        }


                        //初始化报价单基本信息
                        this.quoteOrderInfo = Object.assign({},quoteOrder)

                        this.spacesData = []
                        if(res.data.result.quoteOrderSpaceList){

                            let quoteOrderSpaceList = res.data.result.quoteOrderSpaceList.quoteOrderSpaceList
                            quoteOrderSpaceList.forEach((item,index) => {
                                let isParent = item.parentOrderSpaceId == undefined || item.parentOrderSpaceId <= 0
                                if( !isParent ){

                                    //标记子空间的父空间在空间列表中的位置
                                    let parentSpaceIndex = quoteOrderSpaceList.indexOf(quoteOrderSpaceList.filter((i) => {return i.id == item.parentOrderSpaceId})[0])
                                }
                                //报价单行
                                let data_temp = this.formatDataForSpacesData(item, isParent )

                                this.spacesData.push(data_temp)
                            })
                        }


                    }else{
                        this.$msgbox({
                            title:' ',
                            type:'error',
                            message:res.data.result || '出错：未匹配到错误信息, 请重试'
                        })
                        this.cleanPageData()
                    }
                }).catch((e) => {
                    this.$message.error('出错，请求失败请重试')
                    this.cleanPageData()
                })
            },
            previewQuoteOrder: function (){
                methods.previewQuoteOrder(this.orderId).then((res) => {
                    if( res.data.status == 200 ){
                        this.quoteOrderData = res.data.result

                        this.summaryData2 = [
                            {
                                name:'直接工程费',
                                total: this.quoteOrderData.title.directProjectFee,
                                //detail:'标配套餐项目+个性化项目',
                            },
                            {
                                name:'项目管理费',
                                total: this.quoteOrderData.title.projectManagerFee,
                                //detail:'按直接工程费的8%计算',
                            },
                            {
                                name:'税金',
                                total: this.quoteOrderData.title.taxes,
                                //detail:'按直接工程费加上项目管理费总和的3%计算',
                            },
                            {
                                name:'优惠',
                                total: this.quoteOrderData.title.discountAmount,
                                //detail:'按直接工程费加上项目管理费总和的3%计算',
                            },
                            {
                                name:'总价',
                                total: this.quoteOrderData.title.totalMoney,
                               //detail:'合同金额 = 直接工程费+项目管理费+税金-合同优惠 //(直接工程费加了个性化总价，如果不加，则合同金额需要加上个性化总价)',
                            },
                        ]
                        this.quoteOrderInfoData = res.data.result.tables.quoteOrder
                        this.quoteOrderInfoData.splice(0,0,{
                            "qiName": this.quoteOrderData.title['pkgName'],
                            "amount": 1,
                            "qiUnit":'项',
                            "price": '--',
                            'totalMoney':this.quoteOrderData.title.pkgPrice,
                            'craftDetails':''
                        })
                    }
                    else{

                    }
                })
            },
            /**
             * 格式化空间及报价项数据
             * @item 元数据
             * @isParent 是否为一级空间(即标准空间)
             */
            formatDataForSpacesData(item, isParent = false){
                let data_temp = {
                    'spaceName': item.spaceName, // 空间名
                    'spaceAlias': item.spaceAlias, //空间别名
                    'spaceId': item.spaceId, //空间(类型)id
                    "orderSpaceId": item.id,//报价单空间表id
                    'spaceRowId': item.spaceRowId, //空间自增id
                    //'spaceIndex': index+1, //空间行编号
                    'spaceArea': item.spaceArea, //空间面积
                    'spaceHeight': item.spaceHeight, //空间周长
                    'spaceGirth': item.spaceGirth, //空间层高
                    'isParent':isParent,
                }

                //报价单行
                data_temp['quoteOrderItemList']  = item.rows
                return data_temp
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
                        this.selectSource[selectName] = list
                    }
                })
            },
        },
        created(){
            this.initParams()
            this.previewQuoteOrder()
            this.initQuoteOrderDetail()
            this.getCommonOptions(30003, 'places')
        }
    }
</script>

<style lang="css" scoped>

    /*空间信息展示begin*/
    html,body
    {
        height: 100%;
    }
    .previewQuoteOrder .t8t-form-panel{
        margin:0 auto;
    }
    .previewQuoteOrder .space-content{
        border-bottom: 1px solid #dfe6ec;
        text-align: center;
        min-height: 200px;
    }

    /*表格最后一行不需要border-bottom*/
    /*.spaceQuoteItemPanel table tbody tr:last-child  td{
        border-bottom: none;
    }*/


    /*第一个table需要border-top*/
    /*.spaceQuoteItemPanel .el-table:first-child {
        border-top: 1px solid #dfe6ec;
    }*/

    .previewQuoteOrder .space-data-header{
        height: 40px;
        line-height: 40px;
        background-color: #f5f5fa;
      border-bottom: 1px solid #dfe6ec;
        /*border-right: 1px solid #dfe6ec;*/
        text-align: center;
        text-overflow: ellipsis;
        vertical-align: middle;
        box-sizing: border-box;
        font-size: 12px;
        color: #1f2d3d;
        margin: 0;
        font-weight: bolder;
    }

    .previewQuoteOrder .summary-header{
        text-align: left;
    }

    @media screen and (max-height: 900px) {
        .previewQuoteOrder .space-data-header {
            height: 32px;
            line-height: 32px;
        }
    }

    .previewQuoteOrder .space-data-body{
        min-height: 250px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .previewQuoteOrder .space-data-body-text{
        height:180px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
    .previewQuoteOrder .space-size .el-form-item__error {
        position: inherit !important;
    }

    .previewQuoteOrder .space-size .el-form-item{
        margin-bottom: 0px;
    }
    .previewQuoteOrder .space-data-body-input-box{
        /*margin: 5px;*/
    }
    .previewQuoteOrder .space-number-input{
        width:120px;
        margin:2px;
        padding-left:2px;
    }
    .previewQuoteOrder .space-name{
        /*margin-top: 5px; *//*和space-data-body-input-box 的 margin一致*/
        font-size: 16px;
    }
    .previewQuoteOrder .space-name-text{
        /*padding: 25%;*/
    }
    .previewQuoteOrder .space-plus, .space-remove{
        text-align: right;
    }
    .previewQuoteOrder .space-plus button, .space-remove button{
        margin-right:5px;
    }
    .previewQuoteOrder .space-data{
        border-right: 1px solid #dfe6ec;
        height:100%;
    }
    .previewQuoteOrder .spaceAliasInput input{
        text-align: center;
    }


    .previewQuoteOrder .summary-header{
        text-align: left;
        padding-left:20px;
    }
    .previewQuoteOrder .remove-spaceitem{
        margin: 5px;
    }
    .previewQuoteOrder .craftDetails-popover{
        max-width:350px;
        line-height: 25px;
    }

    .previewQuoteOrder .quoteOrderDetail .el-table__body-wrapper{
        height:auto !important;
    }

    /*解决小屏幕出现小表格横向滚动条问题*/


    @media screen and (max-height: 900px) {
        /*body{
            min-width:1654px;
        }


        .quoteOrderDetail{
            min-width: 1654px;
        }
        .quoteOrderDetail .el-col-3{
            min-width: 180px;
        }
        .quoteOrderDetail .el-col-6{
            min-width: 360px;
        }
        .quoteOrderDetail .el-col-18{
            min-width: 1294px;
        }
        .quoteOrderDetail .el-dialog__body{
            min-width: 1654px;
        }


        .spaceQuoteItemPanel{
            min-width: 1654px;
        }
        .spaceQuoteItemPanel .el-row {

        }
        .space-content .el-table {
            overflow: initial;
            width: initial;
            max-width:none;
        }
        .space-content .el-table__body{
            width:100% !important;
        }

        .summaryMoney{
            min-width: 1654px;
        }
        .summaryMoney .el-table__body{
            width:100% !important;
        }
        .summaryMoney .el-table {
             max-width:100%;
        }
        .summaryMoney .el-row {
            display: flex;
        }

        .headerForm {
            min-width:1654px;
        }*/



        /*.quoteOrderDetail .el-table__body-wrapper {
               overflow: hidden;
           }
           .quoteOrderDetail .el-table__body {
               width:auto !important;
           }*/

    }


    /*end*/
    /*空间信息展示end*/

    .previewQuoteOrder .table-frame{
        margin:0 auto;
        min-height: 800px;
    }
    .previewQuoteOrder .tab-baseInfo{
        width: 550px;
        border: 1px solid #ccc;
    }
    .previewQuoteOrder .tab-quoteOrderInfo{
        width:1220px;
    }
    .previewQuoteOrder .tab-quoteOrderInfo .tab-body{
        border: 1px solid #ccc;
    }

    .previewQuoteOrder .tab-otherInfo{
        width:1220px;
        width:95%;
    }
    .previewQuoteOrder .tab-otherInfo .tab-body{
        border: 1px solid #ccc;
    }
    .previewQuoteOrder .table-agreement{
       height: 150px;
       width: 100%;
    }
    .previewQuoteOrder .table-agreement span{
       display: inline-block;
       margin-left: 330px;
       margin-top: 60px;
       font-size: 16px;
       font-weight: 600;
    }
    .previewQuoteOrder .table-title{
      width: 100%;
      height: 150px;

    }
    .previewQuoteOrder .table-title h1{
        text-align: center;
    }
    .previewQuoteOrder .table-title h2{
        text-align: center;
    }
    .previewQuoteOrder .table-information{

        width: 100%;
        height: 250px;
    }
    .previewQuoteOrder .table-information p{
        text-align: center;
        height: 30px;
        float: left;
        width: 100%;
    }
    .previewQuoteOrder .table-information p strong{
        font-size: 16px;
        font-weight: 300;
    }
    .previewQuoteOrder .table-information p span{
        display: inline-block;
        width: 160px;
        height: 30px;
        border-bottom: 1px solid #333;
    }
    .previewQuoteOrder .table-footer{
        width: 100%;
        height: 170px;
        text-align: center;
        padding-top: 100px;
    }


    .previewQuoteOrder .table-header{
        width: 100%;
        height: 60px;
    }
    .previewQuoteOrder .table-header img{
        float: left;
    }
    .previewQuoteOrder .table-header h2{
        width: 50%;
        float: left;
        margin-left: 90px;
    }
    .previewQuoteOrder .table-list{
        clear: both;
        width: 100%;
        padding: 10px;

    }
    .previewQuoteOrder .table-list span {
        font-size: 14px;
        margin-right: 10px;
        display: inline-block;

    }


    .previewQuoteOrder .t8t-full-dialog{

    }
    .previewQuoteOrder .text-center{
        text-align: center;
    }
    .previewQuoteOrder .bt{
        border-top: 2px solid #eff7fa;
        margin: 0
    }
    .previewQuoteOrder .pd {
        padding: 0 30px;
        display: flex;
        flex: 1;
        flex-direction: column;
    }
    .previewQuoteOrder .footer{
        display: flex;
        height: 50px;
        -ms-align-items: center;
        align-items: center;
    }
    .previewQuoteOrder .footer .left{
        font-size: 14px;
        margin-left: 10px;
    }
    .previewQuoteOrder .footer .right{
        font-size: 14px;
        margin-left: 1415px;
    }
    .previewQuoteOrder .signBox{
        font-weight: bold;
        margin:10px auto;
    }

    .previewQuoteOrder .t8t-table{
        height: auto
    }
</style>
<style>
    .previewQuoteOrder .el-table{
        border-bottom: none !important;
        border-top: none !important;
        border: none !important;
    }

    .t8t-full-dialog .el-dialog__header{
        padding: 0;
    }
    .t8t-full-dialog .el-dialog__body{
        padding: 0;
        height: 100%;
    }
    .t8t-full-dialog .t8t-full-dialog-container{
        display: flex;
        flex-direction: column;
    }
    .t8t-full-dialog .full-dialog-tabs-container{
        flex: 1;
        margin-bottom: 20px;
    }
    .t8t-full-dialog .full-dialog-toolbar-container{
        height: 38px;
        background-color: #1e3046;
    }
    .t8t-full-dialog .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }
    .t8t-full-dialog .toolbar-container .el-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .t8t-full-dialog .toolbar-container .el-button:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }
    .t8t-full-dialog .container-center{
        width: 1250px;
        margin-left: auto;
        margin-right: auto;
    }
    .t8t-full-dialog .el-form{
        /*display: flex;*/
        flex-wrap: wrap;
    }
    .t8t-full-dialog .form-item-container{
        width: 25%;
    }
    .t8t-full-dialog .full-dialog-form-container{
        margin-top: 0px;
    }
    .t8t-full-dialog .full-dialog-form-container .el-form-item__content{
        width: 180px;
    }
    .t8t-full-dialog .full-dialog-tabs-container{
        display: flex;
    }
    .t8t-full-dialog .el-tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .t8t-full-dialog .el-tabs__header{

        border-bottom: 2px solid #eff7fa;
    }
    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar{
        height: 1px;
    }
    .t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }
    .t8t-full-dialog .el-tabs__nav-wrap{
        width: 1220px;
        margin: 0 auto;
    }
    .t8t-full-dialog .el-tabs__content{
        flex: 1;
        display: flex;
/*        width: 1220px;
        margin: 0 auto;*/
    }
    .t8t-full-dialog .el-tab-pane{
        flex: 1;
    }
    .t8t-full-dialog .t8t-table .table-container {
        margin-left: 0;
    }

</style>
