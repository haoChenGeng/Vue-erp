/**
* Created by tomy.li on 2017/6/15.
*/
<template>
    <div class="selectQuoteTemp">
        <el-dialog title="选择报价模板" :class="from == 'workflowProDel' ? '' : 'g-w-1000'" :size="from == 'workflowProDel' ? 'full' : ''" class="my-el-dialog selectQuoteItemdialog" v-model="dialogVisible" @close="closeSelectQuoteDialog" :close-on-press-escape="from==null" :show-close="from==null">

            <!--表头-->
            <t8t-form-panel
                :dataSource="projectInfo"
                :fields="formFields"
                :commonData="formCommonData"
                ref="selectQuoteTempForm">
            </t8t-form-panel>
            <div>
                <el-row type="flex" justify="left">
                    <el-col :span="24">
                        <el-alert
                            title="请谨慎设置户型及计价面积，报价单生成后将不可修改！（如需修改，请通过报价单的‘新建’功能操作）"
                            type="error"
                            :closable="false"
                            show-icon>
                        </el-alert>
                    </el-col>
                </el-row>
                <br>
            </div>
            <t8t-table
                :columns="selectQuoteTempColumns"
                :service="mainTableService"
                :method="mainTableMethod"
                :commonData="commonData"
                :args="args"
                :indexCol="false"
                :radioCol="true"
                :selectable="selectable"
                style=""
                ref="selectQuoteItemTable"
                :pageBar="true"
                @row-double-click="submit"
                @current-row-change="handleCurrentRowChange"
                @data-loaded="tableLoaded"
            >
            </t8t-table>

            <div slot="footer">
                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <div class="grid-content">
                            <el-button  size="small"  @click="dialogVisible = false" v-if="from==null">取消</el-button>
                            <el-button  size="small"  type="primary" @click="submit()" :disabled="!submitAble">确认</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Cookie from 'js-cookie'
    import packtempServices from 'src/services/worker/packtemp/Service.js'
    import productPackage from 'src/services/worker/productpackage/base-method.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import methods from 'src/services/worker/quoteorder/methods.js'
    import projectNode from 'src/services/projectNode/methods.js'
    export default {
        props:['tempId','yid','orgId'],
        name: "selectQuoteTemp",
        components: {},
        created(){
            let procInsId = this.$route.query.procInsId

            //来自待办
            if( procInsId ){
                this.from = 'workflowProDel' //来自待办
                projectNode.projectNodeGetByProcessId(procInsId).then(res => {
                    if( res.data.status == 200 ){
                        this.yid = res.data.result.projectId
                        this.initData()
                    }
                })
            }else{
                this.initData()
            }

            //动态获取产品包
            productPackage.searchProductPackage().then((res) => {
                let list = []
                if( res.data.status === 200 ){
                    res.data.result.forEach((item) => {
                        list.push({
                            value: item.id,
                            text: item.pkgName
                        })
                    })

                    this.commonData['productPackages'] = list
                }
            })



            this.getHouseTypes();//houseTypes
        },
        methods: {
            getHouseTypes: function (){

                this.getCommonOptions(30004,'houseTypes');

            },
            initData: function(){
                //获取项目信息
                methods.findOrderDetailByIds([this.yid]).then((res) =>{
                    if( res.data.status == 200 && res.data.result.length){
                        let  data = res.data.result[0]
                        this.projectInfo.area = data.decorationOrderHouseVO.houseArea
                        this.projectInfo.houseAddress = data.decorationOrderHouseVO.houseAddress
                        this.projectInfo.id = this.yid
                        this.submitAble = true
                    }else{

                    }
                })
            },

            tableLoaded: function (){

            },
            closeSelectQuoteDialog: function (){
                this.$emit('close')
            },
            submit: function (){
                let tabObj = this.$refs['selectQuoteItemTable']
                let selectedRow = tabObj.getSelectRow()
                let _this = this

                if( !this.yid ){
                    return this.$message({
                        'type' : 'warning',
                        'message': '没有查询到项目信息'
                    })
                }
                let selection = selectedRow || this.currentRow
                if( selection.length  == 0 ){
                    return this.$message({
                        'type' : 'warning',
                        'message': '请选择报价模板'
                    })
                }

                this.$refs['selectQuoteTempForm'].validate(validateStatus => {
                    if(validateStatus){

                        //探测可不可以报价
                        methods.initQuoteOrderDetail(this.yid, selection.id, this.projectInfo.area, this.projectInfo.houseTypeId, +Cookie.get('t8t-tc-uid')).then((res) => {
                            _this.$router.push({
                                path:'/tochat-worker/quote-order-detail',
                                query:{
                                    'area': _this.projectInfo.area,
                                    'houseTypeId': _this.projectInfo.houseTypeId,
                                    'tempId':selection.id,
                                    'yid':_this.yid,
                                    't':new Date().getTime()
                                }
                            })
                            _this.closeSelectQuoteDialog()
                        }).catch((res) => {
                            if( res.status == 1 ){
                                //对请求的结果做校验，如字段是否缺失、数值是否准确， 不符合的也不允许做后续操作

                                let houseTypes = _this.formCommonData['houseTypes'].filter(i => {return i.value == _this.projectInfo.houseTypeId})

                                let houseType = houseTypes.length ? houseTypes[0].text : _this.houseTypeId

                                return _this.$msgbox({
                                    title:' ',
                                    type:'error',
                                    message:`未获取到项目标配套餐价（计价面积：${_this.projectInfo.area || '未设置'} 户型：${houseType || '未设置'} ）`
                                })
                            }else{
                                _this.$msgbox({
                                    title:' ',
                                    type:'error',
                                    message: res.message
                                })
                            }
                        })

                    }else{
                        return this.$message({
                            'type' : 'warning',
                            'message': '请完善户型和面积'
                        })
                    }
                })

            },
            cellClick: function (a,b,c,d,e,f){
                //debugger
            },
            handleCurrentRowChange: function(row,oldRow){
                this.currentRow = row
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
                        this.formCommonData[selectName].push({
                                    value: item.id,
                                    text: item.propertyName
                                })
                            }
                        })


                    }
                })
            },

        },
        data(){
            return {
                tempId:null,
                yid:null,
                orgId:null,
                from:null,
                projectInfo:{
                    area:0,
                    houseTypeId:0,
                    houseAddress:'',
                    id:0
                }, //项目信息
                formCommonData: {
                    'houseTypes':[
                        {
                            value: 0,
                            text: '请选择户型'
                        }
                    ],
                },
                formFields:[
                    {
                        prop: 'id',
                        label: '项目ID',
                        type: 'input',
                        disabled:true
                    },
                    {
                        prop: 'houseAddress',
                        label: '项目地址',
                        type: 'input',
                        disabled:true
                    },
                    {
                        prop: 'area',
                        label: '计价面积',
                        type:'input',
                        rules:[
                            {
                                pattern: /^((0|[1-9]\d{0,6})((\.[0-9]{1,2})?))$/, message: '最大7位，最多保留两位的数字'
                            },
                            {
                                required: true ,message: "请填写计价面积"
                            }
                        ],
                    },
                    {
                        prop: 'houseTypeId',
                        label: '户型',
                        type: 'select',
                        list: 'houseTypes',
                        rules:[
                            {
                                type: 'number',
                                min:1 ,message: "请选择户型"
                            }
                        ],
                    },
                ],

                dialogVisible: true,
                mainTableService: packtempServices.template.name,
                mainTableMethod: packtempServices.template.methods.searchTemplate,
                args: {
                    'productPkgTemp':{
                        effectTime:Math.ceil(new Date().getTime() / 1000),
                        freezeTime:Math.ceil(new Date().getTime() / 1000),
                        forbiddenTime:Math.ceil(new Date().getTime() / 1000),
                        "tempStatus":2,//已启用
                        orgId: this.orgId
                    }
                },
                gopath: 'quote-order-detail',
                commonData:{
                    productPackages:[]
                },
                selectQuoteTempColumns: [
                    {
                        "prop": "tempCode",
                        "label": "产品包模板编码"
                    },
                    {
                        "prop": "tempName",
                        "label": "产品包模板名称",
                        "width":200
                    },
                    {
                        "prop": "pkgId",
                        "label": "产品包",
                        "list": "productPackages"
                    },
                ],
                currentRow:[],
                submitAble:false

            }
        }

    }
</script>
<style>
    .selectQuoteTemp .t8t-table-container .table-container{
        min-height: 300px;
        max-height: 350px;
    }

    .selectQuoteTemp .my-el-dialog .el-form-item__content{
        width:120px;
    }
</style>
