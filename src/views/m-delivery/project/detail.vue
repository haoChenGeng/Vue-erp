<template>
<div>
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2" :class="{'isHide': isTopHide}">
        <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
             <div class="full-dialog-toolbar-container">
                 <div class="toolbar-container">
                 </div>
             </div>
             <div class="dialog2-main-container">
	            <div class="full-dialog-tabs-container full-dialog-form-container">
	                <el-tabs v-model="tab_detail">
	                  	<el-tab-pane label="基本信息" name="base_info">
                            <div class="pd20">
                                <h3>项目信息</h3>
                                <el-row>
                                  <el-col :span="6"><div>项目ID：{{detailInfo.decorationOrderVO.id || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>项目主状态：{{detailInfo.decorationOrderVO.orderMainStatusName || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>项目子状态：{{detailInfo.decorationOrderVO.orderSubStatusName || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>项目地址：{{detailInfo.decorationOrderVO.cityName}}{{detailInfo.decorationOrderVO.standardTownName}}{{detailInfo.decorationOrderVO.estateName}}{{detailInfo.decorationOrderVO.houseAddress}}</div></el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="6"><div>产品包：{{detailInfo.decorationOrderVO.productPkgName || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>户型：{{detailInfo.decorationOrderHouseVO.houseStyle || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>居住人口：暂无</div></el-col>
                                  <el-col :span="6"><div>风格：暂无</div></el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="6"><div>套内面积：{{detailInfo.decorationOrderHouseVO.houseArea || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>计价面积：{{detailInfo.decorationOrderHouseVO.houseValuationArea || '暂无'}}</div></el-col>
                                </el-row>
                                <h3>业主信息</h3>
                                <el-row>
                                  <el-col :span="6"><div>业主ID：{{detailInfo.decorationOrderVO.ownerId || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>业主电话ID：{{detailInfo.decorationOrderVO.phoneId || '暂无'}} <a v-show="detailInfo.decorationOrderVO.phoneId" class="el-button el-button--primary el-button--mini" @click="showOwnerPhone(detailInfo.decorationOrderVO.phoneId)">查看</a> {{phoneInfo.ownerPhone}}</div></el-col>
                                  <el-col :span="6"><div>业主姓名：{{detailInfo.decorationOrderVO.ownerName || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>业主昵称：{{detailInfo.decorationOrderVO.ownerNick || '暂无'}}</div></el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="6"><div>年龄：暂无</div></el-col>
                                  <el-col :span="6"><div>性别：暂无</div></el-col>
                                  <el-col :span="6"><div>教育程度：暂无</div></el-col>
                                  <el-col :span="6"><div>生日：暂无</div></el-col>
                                </el-row>
                            </div>
	                  	</el-tab-pane>
                        <el-tab-pane label="跟进记录" name="follow_record">
                            <t8t-table
                                :style="{marginTop: '30px'}"
                                :service="service5"
                                :method="method5"
                                :args="args5"
                                :columns="columns5"
                                :commonData="commonData"
                                :selectCol="false"
                            ></t8t-table>
                        </el-tab-pane>
	                  	<el-tab-pane label="审核信息" name="verify_info">
                            <div class="pd20">
                                <h3>审核信息</h3>
                                <el-row>
                                  <el-col :span="6"><div>登记时间：{{detailInfo.decorationOrderVO.createTime | dateParser}}</div></el-col>
                                  <el-col :span="6"><div>审核通过时间：{{detailInfo.decorationOrderOtherVO.auditTime | dateParser}}</div></el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="8"><div>审核通过录音时间：  {{detailInfo.decorationOrderOtherVO.auditRecordTime | dateParser}}
                                  <button :style="{marginLeft: '10px'}" @click="play" class="el-button el-tooltip el-button--primary el-button--small" v-show="detailInfo.decorationOrderOtherVO.auditRecordVedio"><i class="el-icon-caret-right"></i><span>播放录音</span></button>
                                  </div></el-col>
                                  <el-col :span="16"><div><audio v-show="showPlayer" :autoplay="false" :src="detailInfo.decorationOrderOtherVO.auditRecordVedio" controls="controls"></audio></div></el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="24"><div>审核通过小计：{{detailInfo.decorationOrderOtherVO.auditInfo || '暂无'}}</div></el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="24"><div>装修要求：{{detailInfo.decorationOrderExtVO.remarks || '暂无'}}</div></el-col>
                                </el-row>
                            </div>
	                  	</el-tab-pane>
                        <el-tab-pane label="营销派单信息" name="yxpd_info">
                            <div class="pd20" :style="{flex: 'none'}">
                                <h3>负责人</h3>
                                <el-row>
                                  <el-col :span="6"><div>审核客服：{{detailInfo.decorationOrderVO.auditName || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>销售主管：{{detailInfo.decorationOrderOtherVO.salesLeaderName || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>设计主管：{{detailInfo.decorationOrderOtherVO.designLeaderName || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>客户经理：{{detailInfo.decorationOrderVO.customerManagerName || '暂无'}}</div></el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="6"><div>客户经理电话：{{detailInfo.decorationOrderOtherVO.customerManagerPhoneId || '暂无'}} <a v-show="detailInfo.decorationOrderOtherVO.customerManagerPhoneId" class="el-button el-button--primary el-button--mini" @click="showPhone(detailInfo.decorationOrderOtherVO.customerManagerPhoneId,detailInfo.decorationOrderVO.customerManagerId,1,'customerManagerPhone')">查看</a> {{phoneInfo.customerManagerPhone}}</div></el-col>
                                  <el-col :span="6"><div>首席设计师：{{detailInfo.decorationOrderVO.chiefDesignerName || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>
                                    首席设计师电话：{{detailInfo.decorationOrderOtherVO.chiefDesignerPhoneId || '暂无'}}
                                    <a v-show="detailInfo.decorationOrderOtherVO.chiefDesignerPhoneId" class="el-button el-button--primary el-button--mini" @click="showPhone(detailInfo.decorationOrderOtherVO.chiefDesignerPhoneId,detailInfo.decorationOrderVO.chiefDesignerId,2,'chiefDesignerPhone')">查看</a> {{phoneInfo.chiefDesignerPhone}}
                                  </div></el-col>
                                </el-row>
                            </div>
                            <el-tabs v-model="tab_yxpd">
                                <el-tab-pane label="分派门店记录" name="mendian">
                                    <t8t-table
                                        :style="{marginTop: '20px'}"
                                        :service="service1"
                                        :method="method1"
                                        :args="args1"
                                        :columns="columns1"
                                        :commonData="commonData"
                                        :selectCol="false"
                                    ></t8t-table>
                                </el-tab-pane>
                                <el-tab-pane label="派工记录" name="paigong">
                                    <t8t-table
                                        :style="{marginTop: '20px'}"
                                        :service="service2"
                                        :method="method2"
                                        :args="args2"
                                        :columns="columns2"
                                        :commonData="commonData"
                                        :selectCol="false"
                                        :preLoad="false"
                                    ></t8t-table>
                                </el-tab-pane>
                            </el-tabs>
                        </el-tab-pane>
                        <el-tab-pane label="收款信息" name="sk_info">
                            <div class="pd20">
                                <h3>收款账号</h3>
                                <el-row>
                                  <el-col :span="8"><div>虚拟卡账号：{{detailInfo.decorationOrderOtherVO.virtualCard || '暂无'}}</div></el-col>
                                  <el-col :span="8"><div>财务组织：{{detailInfo.decorationOrderOtherVO.fiOrgName || '暂无'}}</div></el-col>
                                  <el-col :span="8"><div>开户行地址：{{detailInfo.decorationOrderOtherVO.branchBankName || '暂无'}}</div></el-col>
                                </el-row>
                                <h3>款项类型</h3>
                                <el-row>
                                  <el-col :span="6"><div>下定金额：{{detailInfo.decorationOrderOtherVO.depositAmount || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>下定缴款时间：{{detailInfo.decorationOrderOtherVO.depositTime | dateParser}}</div></el-col>
                                  <el-col :span="6"><div>预售金额：{{detailInfo.decorationOrderOtherVO.advanceAmount || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>预售缴款时间：{{detailInfo.decorationOrderOtherVO.advanceTime | dateParser}}</div></el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="6"><div>首期金额：{{detailInfo.decorationOrderOtherVO.contractAmount || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>首期缴款时间：{{detailInfo.decorationOrderOtherVO.contractTime | dateParser}}</div></el-col>
                                  <el-col :span="6"><div>二期金额：{{detailInfo.decorationOrderOtherVO.secondPayAmount || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>二期缴款时间：{{detailInfo.decorationOrderOtherVO.secondPayTime | dateParser}}</div></el-col>
                                </el-row>
                                <h3>收支流水</h3>
                                <t8t-table
                                    :service="service3"
                                    :method="method3"
                                    :args="args3"
                                    :columns="columns3"
                                    :commonData="commonData"
                                    :selectCol="false"
                                ></t8t-table>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="报价信息" name="bj_info">
                            <div class="pd20 wrap-position">
                                <div class="wrap-position">
                                    <h3>报价信息</h3>
                                    <a class="el-button el-button--primary el-button--mini" target="_blank" :href="bj_url">查看报价</a>
                                </div>
                                <el-row>
                                  <el-col :span="6"><div>标准套餐价：{{detailInfo.decorationOrderOtherVO.pkgAmount || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>合同总金额：{{detailInfo.decorationOrderOtherVO.contractTotalAmount || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>直接工程费：{{detailInfo.decorationOrderOtherVO.directProjectAmount || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>项目管理费：{{detailInfo.decorationOrderOtherVO.projectManageAmount || '暂无'}}</div></el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="6"><div>税金：{{detailInfo.decorationOrderOtherVO.taxAmount || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>优惠金额：{{detailInfo.decorationOrderOtherVO.discountAmount || '暂无'}}</div></el-col>
                                </el-row>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="选品信息" name="xp_info">
                            <div class="pd20">
                                <div class="wrap-position">
                                    <h3>选品信息</h3>
                                    <a class="el-button el-button--primary el-button--mini" target="_blank" :href="xp_url">查看选品</a>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="工程派单信息" name="gcpd_info">
                            <div class="pd20">
                                <h3>负责人</h3>
                                <el-row>
                                  <el-col :span="6"><div>工程管家：{{detailInfo.decorationOrderVO.projectManagerName || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>
                                  工程管家电话：{{detailInfo.decorationOrderOtherVO.projectManagerPhoneId || '暂无'}}
                                  <a v-show="detailInfo.decorationOrderOtherVO.projectManagerPhoneId" class="el-button el-button--primary el-button--mini" @click="showPhone(detailInfo.decorationOrderOtherVO.projectManagerPhoneId,detailInfo.decorationOrderVO.projectManagerId,6,'projectManagerPhone')">查看</a> {{phoneInfo.projectManagerPhone}}
                                  </div></el-col>
                                  <el-col :span="6"><div>项目经理：{{detailInfo.decorationOrderOtherVO.chiefWorkerName || '暂无'}}</div></el-col>
                                  <el-col :span="6"><div>
                                  项目经理电话：{{detailInfo.decorationOrderOtherVO.chiefWorkerPhoneId || '暂无'}}
                                  <a v-show="detailInfo.decorationOrderOtherVO.chiefWorkerPhoneId" class="el-button el-button--primary el-button--mini" @click="showPhone(detailInfo.decorationOrderOtherVO.chiefWorkerPhoneId,detailInfo.decorationOrderVO.chiefWorkerId,5,'chiefWorkerPhone')">查看</a> {{phoneInfo.chiefWorkerPhone}}
                                  </div></el-col>
                                </el-row>
                                <h3>派工记录</h3>
                                <t8t-table
                                    :service="service2"
                                    :method="method2"
                                    :args="args4"
                                    :columns="columns2"
                                    :commonData="commonData"
                                    :selectCol="false"
                                    :preLoad="false"
                                ></t8t-table>
                            </div>
                        </el-tab-pane>
	              	</el-tabs>
	            </div>
            </div>
        </div>
    </el-dialog>
</div>
</template>

<script>
    import Service from 'src/services/delivery/Service.js'
    import Model from 'src/services/delivery/model.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
	export default {
		data(){
			return {
				isDialogShow: true,
				isTopHide: false,
				tab_detail: 'base_info',
                tab_yxpd: 'mendian',
                projectId : this.$route.query.projectId,
                bj_url:'#',
                xp_url:'#',
				detailInfo: {
					decorationOrderVO:{},
                    decorationOrderExtVO: {},
                    decorationOrderHouseVO: {},
                    decorationOrderContactVOList:{},
                    decorationOrderOtherVO:{}
				},
                phoneInfo:{
                    ownerPhone: '',
                    customerManagerPhone: '',
                    chiefDesignerPhone: '',
                    projectManagerPhone: '',
                    chiefWorkerPhone: ''
                },
				commonData:{
					type: [],
                    allocationResult:[
                        {value:1,text:"分配装修公司失败"},
                        {value:2,text:"分配门店失败"},
                        {value:3,text:"分配成功"},
                    ],
                    assignState: [
                        {value: 0, text: '未完成'},
                        {value: 1, text: '生效'},
                        {value: 2, text: '作废'}
                    ],
                    orderStatus:[
                        {value: 1, text: '待审核'},
                        {value: 2, text: '审核通过'},
                        {value: 3, text: '审核不通过'}
                    ]
				},
                showPlayer: false,
                autoplay: false,
                service1: Service.COMPANYALLOCATION.name,
                method1: Service.COMPANYALLOCATION.methods.COMPANYALLOCATIONVIEWSQUERYPAGE,
                args1: { search: { projectId: this.$route.query.projectId } },
                columns1:[
                    {
                        prop: 'id',
                        label: '记录ID'
                    },
                    {
                        prop: 'bizTypeName',
                        label: '业务类型'
                    },
                    {
                        prop: 'allocationResult',
                        label: '分配结果',
                        list:"allocationResult"
                    },
                    {
                        prop: 'companyName',
                        label: '装修公司'
                    },
                    {
                        prop: 'allotCompanyTime',
                        label: '分配公司时间',
                        formatter: 'dateParser'
                    },
                    {
                        prop: 'storeName',
                        label: '门店'
                    },
                    {
                        prop: 'allotStoreTime',
                        label: '分配门店时间',
                        formatter: 'dateParser'
                    }
                ],
                service2: Service.ITEM_ASSIGN.name,
                method2: Service.ITEM_ASSIGN.methods.LIST_ASSIGN_RECORD,
                args2: {},
                columns2:[
                    {
                        prop: 'code',
                        label: '单据编码'
                    },
                    {
                        prop: 'subCompany',
                        label: '组织'
                    },
                    {
                        prop: 'reason',
                        label: '派工原因'
                    },
                    {
                        prop: 'assignType',
                        label: '派工类型'
                    },
                    {
                        prop: 'principalName',
                        label: '负责人'
                    },
                    {
                        prop: 'state',
                        label: '单据状态',
                        list: 'assignState'
                    },
                    {
                        prop: 'assignerName',
                        label: '派单人'
                    },
                    {
                        prop: 'assignTime',
                        label: '操作时间',
                        formatter: 'dateParser'
                    }
                ],
                service3: Service.FIRVM.name,
                method3: Service.FIRVM.methods.receiptOrderLeftJoinQuery,
                args3: { receiptLeftJoinQueryDTO:{projectId: this.$route.query.projectId }},
                //args3: {},
                columns3:[
                    {
                        prop: 'code',
                        label: '单据编码'
                    },
                    {
                        prop: 'type',
                        label: '单据类型',
                        formatter:function(){
                            return '收款单';
                        }
                    },
                    {
                        prop: 'receiptOrgName',
                        label: '财务组织'
                    },
                    {
                        prop: 'receiptModeName',
                        label: '收款方式'
                    },
                    {
                        prop: 'arriveAmount',
                        label: '到账金额'
                    },
                    {
                        prop: 'arriveTime',
                        label: '到账时间',
                        formatter: 'dateParser'
                    },
                    {
                        prop: 'orderStatus',
                        label: '单据状态',
                        list: 'orderStatus'
                    },
                    {
                        prop: 'updateName',
                        label: '操作人'
                    },
                    {
                        prop: 'updateTime',
                        label: '操作时间',
                        formatter: 'dateParser'
                    }
                ],
                args4:{ search:{ assignTypeId_in:[1259] } },
                service5: Service.PRSMDM.name,
                method5: Service.PRSMDM.methods.visitRecordStanDingBookQueryPage,
                args5: { search:{projectId: this.$route.query.projectId},sort:['createTime_desc'] },
                columns5:[
                    {
                        prop: 'createTime',
                        label: '记录时间',
                        formatter: 'dateParser'
                    },
                    {
                        prop: 'feedback',
                        label: '备注'
                    },
                    {
                        prop: 'clientManagerNames',
                        label: '记录人'
                    },
                    {
                        prop: 'orderSubStatusName',
                        label: '状态'
                    },
                    {
                        prop: 'typeName',
                        label: '类型'
                    }
                ],
			}
		},
        filters: {
            dateParser(text) {
                let dateString;
                if (!text) {
                    dateString = "暂无"
                } else {
                    let objDate = new Date(text * 1000);
                    dateString = DateUtils(objDate, 'yyyy-mm-dd HH:MM:ss')
                }
                return dateString
            }
        },
        created(){
            this.getAssignTypes();
            let projectId = this.$route.query.projectId;
            this.getProjectInfo(projectId);
            this.bj_url = 'http://scm.to8to.com/#/worker/quote-order-detail?yid=' + projectId;
            this.xp_url = 'http://scm.to8to.com/#/worker/quote-order-detail?yid=' + projectId;
        },
		methods: {
            closeDialog() {
                this.$router.go(-1)
            },
            play(){
                this.autoplay = true;
                this.showPlayer = true;
            },
            getAssignTypes(){
                let arg =  {
                    page: 1,
                    search: { pPropertyCode: '42101'},
                    size: 100
                }
                let gcAssignType = [];
                let yxAssignType = [];
                commonApi.queryUnionParent(arg).then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if(['01','06'].indexOf(item.propertyCode) > -1){
                                gcAssignType.push(item.id);
                            }else if(['02','03','04','05','07','08'].indexOf(item.propertyCode) > -1){
                                yxAssignType.push(item.id);
                            }
                        });
                    }
                    this.args2 = {search: { projectId: this.$route.query.projectId,assignTypeId_in:yxAssignType }}
                    this.args4 = {search: { projectId: this.$route.query.projectId,assignTypeId_in:gcAssignType }}
                }).catch((error)=>{
                    this.args2 = {search: { projectId: this.$route.query.projectId,assignTypeId_in:[0] }}
                    this.args4 = {search: { projectId: this.$route.query.projectId,assignTypeId_in:[0] }}
                });


            },
            getProjectInfo(projectId){
                Model.decorationOrderFindSheetById({id: projectId}).then((res)=>{
                    if(res.data.status === 200){
                        this.detailInfo = res.data.result;
                        if(typeof this.detailInfo.decorationOrderOtherVO.auditRecordId != 'undefined'){
                            Model.callRecordGetByUuid({uuid:this.detailInfo.decorationOrderOtherVO.auditRecordId}).then((res)=>{
                                if(res.data.status === 200){
                                    this.detailInfo.decorationOrderOtherVO.auditRecordVedio = res.data.result ? res.data.result : '';
                                }
                            })
                        }
                        if(typeof this.detailInfo.decorationOrderContactVOList != 'undefined'){
                            if(this.detailInfo.decorationOrderContactVOList.length > 0){
                                this.detailInfo.decorationOrderContactVOList.forEach((item)=>{
                                    if(item.isPrimary == 1){
                                        this.detailInfo.decorationOrderVO.ownerNick = item.appellation;
                                    }
                                })
                            }
                        }
                    }
                }).catch()
            },
            showOwnerPhone(phoneId){
                if(!this.phoneInfo.ownerPhone){
                    Model.sensitvieInfoGetPhone({search:{ projectId: this.$route.query.projectId, phoneId: phoneId }}).then((res)=>{
                        if(res.data.status === 200){
                            this.phoneInfo.ownerPhone = res.data.result;
                        }else if(res.data.status === 607){
                            this.$message.error('权限不足');
                        }else{
                            this.$message.error('查询失败');
                        }
                    })
                }
            },
            showPhone(phoneId,userId,type,name){
                if(!this.phoneInfo[name]){
                    Model.sensitvieInfoGetPhoneOfUser({search:{ phoneId: phoneId, userId: userId, userType: type }}).then((res)=>{
                        if(res.data.status === 200){
                            this.phoneInfo[name] = res.data.result;
                        }else if(res.data.status === 607){
                            this.$message.error('权限不足');
                        }else{
                            this.$message.error('查询失败');
                        }
                    })
                }
            }
        }
	}
</script>
<style scoped>
    .pd20{
        padding: 10px 20px 0 20px;
        flex: 1;
        display: flex;
        flex-direction: column
    }
    .pd20 h3{
        padding: 8px;
        text-align: center;
        width: 90px;
        height: 22px;
        line-height: 22px;
        margin-top: 10px;
        margin-bottom: 20px;
        border-bottom: 1px solid #20a0ff;
    }
    .wrap-position{
        position: relative;
    }
    .wrap-position a{
        position: absolute;
        top: 25px;
        left: 140px;
        text-decoration: none;
    }
</style>
<style>
    .el-row {
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
    }
</style>
