<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="commonOptionsConfig"
            @submit="submitSearch"
        >
        </t8t-search>
        <t8t-toolbar
            @ADD="on_add"
            @AUDITI="on_audit"
            @REJECT="on_reject"
            @VIEW="on_view"
            @ANTI-AUDITING="on_antiAuditi"
            @EXPORT="btnDownloadClick"
            ref="toolbar"
        >
        </t8t-toolbar>
        <t8t-table
            ref="listTable"
            :columns="columns"
            :service="service"
            :method="method"
            :args="args"
            :pageBar="true"
            :commonData="commonOptionsConfig"
            @row-double-click="doubleClick"
        >
            <template slot="bankAddress" scope="scope" >
                 <span>
                    {{scope.row.bankAddress}}&nbsp;&nbsp;&nbsp;
                    {{scope.row.bankAccount}}
                 </span>
            </template>
            <template slot="registeredAddress" scope="scope" >
                 <span>
                    {{scope.row.registeredAddress}}&nbsp;&nbsp;&nbsp;
                    {{scope.row.registeredPhone == 0 ? '' : scope.row.registeredPhone}}
                 </span>
            </template>
            <template slot="companyCertificationUrl" scope="scope" >
                <el-button
                    v-if="scope.row.companyCertificationUrl && scope.row.invoiceType == 2"
                    size="small"
                    @click="showImgDialog(scope.row, 0, scope.column.label)"
                >查看</el-button>
                <span v-else-if="scope.row.invoiceType == 2" >未上传</span>
            </template>
            <template slot="customerInvoiceInfoUrl" scope="scope" >
                <el-button
                    v-if="scope.row.customerInvoiceInfoUrl && scope.row.invoiceType == 2"
                    size="small"
                    @click="showImgDialog(scope.row, 1,  scope.column.label)"
                >查看</el-button>
                <span v-else-if="scope.row.invoiceType == 2" >未上传</span>
            </template>
            <template slot="businessLicenceUrl" scope="scope" >
                <el-button
                    v-if="scope.row.businessLicenceUrl && scope.row.invoiceType == 2"
                    size="small"
                    @click="showImgDialog(scope.row, 2,  scope.column.label)"
                >查看</el-button>
                <span v-else-if="scope.row.invoiceType == 2" >未上传</span>
            </template>
            <template slot="entrustedCertificateUrl" scope="scope" >
                <el-button
                    v-if="scope.row.entrustedCertificateUrl && scope.row.invoiceType == 2"
                    size="small"
                    @click="showImgDialog(scope.row, 3,  scope.column.label)"
                >查看</el-button>
                <span v-else-if="scope.row.invoiceType == 2" >未上传</span>
            </template>
        </t8t-table>
        <t8t-gallery
            ref="gallery"
            v-model="galleryVisible"
            :data="galleryData"
        ></t8t-gallery>
    </div>
</template>
<script>
    import Service from 'src/services/finance/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Utils from 'src/utils/Utils.js'
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
    import exportUtils from 'src/utils/export.js'

    export default {
        name: 'invoiceInfo-list',
        data(){
            return {
                exportParams:{
                    search: {
                        id_gt: 0
                    },
                    page:1,
                    size:5000
                },//导出传参
                ids: [],//导出时id
                breadcrumbData:[{ title: '财务' },{ title: '应收核算' },{ title: '开票信息' }],
                fields:[
                    {type: 'select',label: '客户',name: 'customerTypeId_eq', selectSourceKey:'customerTypeList'},
                    {type: 'input',label: '客户ID',name: 'customerId_eq'},
                    {type: 'select',label: '发票类型',name: 'invoiceType_eq',selectSourceKey:'invoiceTypeList'},
                    {type: 'select',label: '纳税人类型',name: 'taxPayerType_eq', selectSourceKey:'taxpayerTypeList'},
                    {type: 'select',label: '状态',name: 'status_eq', selectSourceKey:'statusList'}
                ],
                service:Service.RECEIVABLE.name,
                method:Service.RECEIVABLE.methods.customerInvoiceInfoListInfo,
                args:{search:null, sort:['createTime_desc']},
                commonOptionsConfig:{
                    customerTypeList:[],
                    invoiceTypeList:[
                        {
                            text: '增值税普通发票',
                            value: 1
                        },
                        {
                            text: '增值税专用发票',
                            value: 2
                        }
                    ],
                    taxpayerTypeList:[
                        {
                            text: '个人',
                            value: 1
                        },
                        {
                            text: '一般纳税人公司',
                            value: 2
                        },
                        {
                            text: '小规模纳税人公司',
                            value: 3
                        }
                    ],
                    statusList:[
                        {
                            text: '暂存',
                            value: 0
                        },
                        {
                            text: '审核中',
                            value: 1
                        },
                        {
                            text: '已审核',
                            value: 2
                        }
                    ]
                },
                columns:[
                    { "prop": "customerTypeId", "label": "客户", "list":"customerTypeList" },
                    { "prop": "customerId", "label": "客户ID" },
                    { "prop": "invoiceType", "label": "发票类型", "list":"invoiceTypeList" },
                    { "prop": "taxPayerType", "label": "纳税人类型", "list":"taxpayerTypeList" },
                    { "prop": "invoiceTitle", "label": "发票抬头" },
                    { "prop": "registrationNumber", "label": "纳税人识别号" },
                    { "prop": "bankAddress", "label": "开户行及银行账号" },
                    { "prop": "registeredAddress", "label": "注册地址及电话" },
                    { "prop": "companyCertificationUrl", "label": "一般纳税人公司证明" },
                    { "prop": "customerInvoiceInfoUrl", "label": "公司客户开票信息表" },
                    { "prop": "businessLicenceUrl", "label": "公司营业执照复印件" },
                    { "prop": "entrustedCertificateUrl", "label": "公司委托个人付款证明" },
                    { "prop": "status", "label": "状态", "list":"statusList" },
                    { "prop": "createTime", "label": "创建时间", "formatter": "dateParser" },
                    { "prop": "createUserName", "label": "创建人" },
                    { "prop": "updateTime", "label": "修改时间", "formatter": "dateParser" },
                    { "prop": "updateUserName", "label": "修改人" }
                ],
                galleryVisible:false,
                galleryData:[]

            }
        },
        created (){
            this.getCommonOptions('61004', 'customerTypeList')
        },
        methods:{

            btnDownloadClick(){
                this.$msgbox({
                    title: '消息',
                    type: 'success',
                    message: '正在导出中,请勿重复操作,请注意左下方,稍后有导出的文件',
                    showCancelButton: false,
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })

                this.ids = []
                this.checkArray = this.$refs['listTable'].getSelectRows()
                if (this.checkArray.length > 0) {
                    this.checkArray.forEach((item) => {
                        this.ids.push(item.id)
                    })
                    this.exportParams = {
                        search: {
                            id_in: this.ids
                        },
                        page: 1,
                        size: 5000
                    }
                }

                let paramsExport = this.exportParams.search
                let objectFlag = false
                objectFlag = this.isEmptyObjectParams(paramsExport)
                if (!objectFlag) {
                    this.exportParams = {
                        search: {
                            id_gt: 0
                        },
                        page: 1,
                        size: 5000
                    }
                }

                exportUtils({
                    service:Service.RECEIVABLE.name,
                    method:Service.RECEIVABLE.methods.customerInvoiceInfoListInfo,
                    args: this.exportParams,
                    title: '开票信息',
                    headers: '客户,客户ID,客户名称,发票类型,纳税人类型,发票抬头,纳税人识别号,开户行及银行账号,注册地址及电话,状态,邮寄地址,联系人,联系电话,创建人,创建时间,修改人,修改时间',
                    sorts: 'customerTypeName,customerId,customerName,invoiceTypeStr,taxPayerTypeStr,invoiceTitle,registrationNumber,bankMessage,registerMessage,statusStr,postMessage,contactPerson,contactPhone,createUserName,createTimeStr,updateUserName,updateTimeStr'
                })
            },

            getExportArgs(param){
                let exportP = {...param}

                for (let i in exportP) {
                    if (exportP[i] === null) {
                        delete exportP[i]
                    }
                }
                this.exportParams = {
                    search: exportP,
                    page: 1,
                    size: 5000

                }
            },
            isEmptyObjectParams(data)
            {
                let objectFlags = false
                for (let i in data) {
                    objectFlags = true
                }
                return objectFlags
            },
            submitSearch(obj) {
                if(!obj.customerTypeId_eq && obj.customerId_eq){
                    this.$message({
                        type: 'error',
                        message: '请先选择客户'
                    });
                    return
                }
                this.args = { search: obj, sort:['createTime_desc']}

                this.getExportArgs(obj)
            },
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
                                }
                            });
                            this.commonOptionsConfig[selectName] = list;
                        }
                    })
            },
            on_view(){
                let rows = this.$refs['listTable'].getSelectRows()
                if(rows.length < 1){
                    this.$message({
                        type: 'error',
                        message: '请勾选数据后再操作'
                    });
                    return
                }
                if(rows.length > 1){
                    this.$message({
                        type: 'error',
                        message: '请对单条数据进行操作'
                    });
                    return
                }
                this.$router.push({
                    path: '/tuchat-finance/invoice-info/view',
                    query:{id: rows[0]['id']}
                })
            },
            on_add(){
                this.$router.push({
                    path: '/tuchat-finance/invoice-info/edit'
                })
            },
            showImgDialog(data, index, name){
                this.galleryData = []
                let list = ['companyCertificationUrl', 'customerInvoiceInfoUrl', 'businessLicenceUrl', 'entrustedCertificateUrl']
                list.forEach((item) => {
                    if( data[item]){
                        this.galleryData.push({
                            title:item,
                            src:Utils.getFullURL(data[item])
                        })
                    }
                })
                this.$refs['gallery'].setActiveItem(index)
                this.galleryVisible = true
            },
            doubleClick(row, event){
                this.$router.push({
                    path: '/tuchat-finance/invoice-info/view',
                    query:{id: row.id}
                })
            },
            on_audit(){
                let rows = this.$refs['listTable'].getSelectRows()
                if(rows.length < 1){
                    this.$message({
                        type: 'error',
                        message: '请勾选数据后再操作'
                    });
                    return
                }
                var args = {verifyUserId:Cookie.get('t8t-tc-uid'), verifyIds:[]}
                var flage = true
                rows.forEach((item) =>{
                    if(item.status == 1){
                        args.verifyIds.push(item.id)
                    }else{
                        flage = false
                    }
                })
                if(!flage){
                    this.$message({
                        type: 'error',
                        message: '非审核中数据不可进行审核操作'
                    });
                    return
                }
                this.$confirm('确认对所选开票信息审核通过？', '审核确认', {
                    confirmButtonText: '审核',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs['toolbar'].disableBySymbol('AUDITI');
                    axios({
                        method: Service.RECEIVABLE.methods.customerInvoiceInfoVerifyProcess,
                        service: this.service,
                        args: args
                    }).then((res) => {
                            this.$refs['toolbar'].unDisableBySymbol('AUDITI');
                            if (res.data.status === 200) {
                                this.$msgbox({
                                    title: '已审核',
                                    type: 'success',
                                    message: '',
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                },function(){
                                });
                                this.$refs['listTable'].reloadTable()
                            }else{
                                this.$msgbox({
                                    title: '审核失败',
                                    type: 'error',
                                    message: res.data.message,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                },function(){

                                });
                            }
                        }
                    )
                })


            },
            on_reject(){
                let rows = this.$refs['listTable'].getSelectRows()
                if(rows.length < 1){
                    this.$message({
                        type: 'error',
                        message: '请勾选数据后再操作'
                    });
                    return
                }
                var args = {verifyUserId:Cookie.get('t8t-tc-uid'), rejectIds:[]}
                var flage = true
                rows.forEach((item) =>{
                    if(item.status == 1){
                        args.rejectIds.push(item.id)
                    }else{
                        flage = false
                    }
                })
                if(!flage){
                    this.$message({
                        type: 'error',
                        message: '非审核中数据不可进行驳回操作'
                    });
                    return
                }
                this.$confirm('确认对所选开票信息进行驳回操作？', '驳回确认', {
                    confirmButtonText: '驳回',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs['toolbar'].disableBySymbol('REJECT');
                    axios({
                        method: Service.RECEIVABLE.methods.customerInvoiceInfoRejectProcess,
                        service: this.service,
                        args: args
                    }).then((res) => {
                            this.$refs['toolbar'].unDisableBySymbol('REJECT');
                            if (res.data.status === 200) {
                                this.$msgbox({
                                    title: '已驳回',
                                    type: 'success',
                                    message: '',
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                },function(){
                                });
                                this.$refs['listTable'].reloadTable()
                            }else{
                                this.$msgbox({
                                    title: '驳回失败',
                                    type: 'error',
                                    message: res.data.message,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                },function(){

                                });
                            }
                        }
                    )
                })
            },
            on_antiAuditi(){
                let rows = this.$refs['listTable'].getSelectRows()
                if(rows.length < 1){
                    this.$message({
                        type: 'error',
                        message: '请勾选数据后再操作'
                    });
                    return
                }
                var args = {updateUserId:Cookie.get('t8t-tc-uid'), antiVerifyIds:[]}
                var flage = true
                rows.forEach((item) =>{
                    if(item.status == 2){
                        args.antiVerifyIds.push(item.id)
                    }else{
                        flage = false
                    }
                })
                if(!flage){
                    this.$message({
                        type: 'error',
                        message: '非已审核数据不可进行反审核操作'
                    });
                    return
                }
                this.$confirm('确认对所选开票信息进行反审核？', '反审核确认', {
                    confirmButtonText: '反审核',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs['toolbar'].disableBySymbol('ANTI-AUDITING');
                    axios({
                        method: Service.RECEIVABLE.methods.customerInvoiceInfoAntiVerify,
                        service: this.service,
                        args: args
                    }).then((res) => {
                            this.$refs['toolbar'].unDisableBySymbol('ANTI-AUDITING');
                            if (res.data.status === 200) {
                                this.$msgbox({
                                    title: '已反审核',
                                    type: 'success',
                                    message: '',
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                },function(){
                                });
                                this.$refs['listTable'].reloadTable()
                            }else{
                                this.$msgbox({
                                    title: '反审核失败',
                                    type: 'error',
                                    message: res.data.message,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                },function(){

                                });
                            }
                        }
                    )
                })
            },
        }
    }
</script>
<style scoped>
    .cell span {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
