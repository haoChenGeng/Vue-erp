/**
* Created by tomy.li on 2017/12/4.
*/
<template>
    <div class="contractDesignerDetail" :center="true">
        <el-dialog title="" size="full" class="my-el-dialog contractDetailDialog"
                   :close-on-press-escape="false"
                   :show-close="false"
                   v-model="contractDetailVisible"
                   @close="contractDetailDialogClose"
        >
            <el-row>
                <el-col :span="14" :offset="5">
            <el-row>
                <el-col :span="6">
                    <span>项目ID：{{sourceProjectId}}</span>
                </el-col>
                <el-col :span="6">
                    <span>业主称呼：{{contractInfo.ownerCall}}</span>
                </el-col>
                <el-col :span="6">
                    <span>业主电话：{{contractInfo.ownerCallPhone}}</span>
                </el-col>
                <el-col :span="6">
                    <span>项目地址：{{contractInfo.projectAddress}}</span>
                </el-col>
            </el-row>
            <el-tabs v-if="pageLoaded">
                <el-tab-pane label="签约人信息">
                    <el-form ref="userInfoForm"
                             class="userInfoForm"
                             label-position="right"
                             label-width="140px"
                             :model="userInfo">
                        <el-row :gutter="0">
                            <el-col :span="12">
                                <el-row>
                                    <el-col
                                            v-for="field in formFields">
                                        <el-form-item :label="field.label?field.label+'：':''"
                                                      :prop="field.prop"
                                                      :rules="field.rules || []">
                                            <el-input v-if="field.type==='input'"
                                                      v-model="userInfo[field.prop]"
                                                      :disabled="userChecked && disabledFields.includes(field.prop)"
                                                      :icon="userChecked ? 'edit': ''"
                                                      @on-icon-click="handleIconClick(field.prop)"
                                            >
                                                <el-button slot="append" icon="edit" v-show="userChecked" @click="handleIconClick(field.prop)" :style="{color:'#20a0ff'}"></el-button>
                                            </el-input>

                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>

                            <el-col :span="12">
                                <el-row>
                                    <el-col
                                        v-for="field in formFieldsNote">
                                        <div class="el-form-item">
                                            <div class="el-form-item__content" style="margin-left:50px">
                                                {{field}}
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>

                    </el-form>
                    <div style="text-align: center; padding: 15px ">
                        <el-button @click="userInfoValidate" type="primary" v-show="!userChecked" :loading="submitting" :disabled="submitting">提交验证</el-button>
                        <el-button @click="contractDetailDialogClose()" v-if="!userChecked">签约列表</el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <el-tabs v-if="userChecked && pageLoaded">
                <el-tab-pane label="合同信息">
                        <el-form :label-position="labelPosition" label-width="160px" :model="contractInfo" ref="contractInfoForm"
                                 class="contractInfoForm">
                            <el-row v-for="field in formFieldsOrder">
                                <el-col :span="field.autoWidth ? '' : 12">
                            <el-form-item :label="field.label?field.label+'：':''"
                                          :prop="field.prop"
                                          :rules="field.rules || []"
                                          >


                                <el-input v-if="field.type==='input' && field.prop == 'moreWaterPlat'"
                                          v-model="contractInfo[field.prop]"
                                          :placeholder="field.placeholder"
                                          :disabled="moreWaterPlatDisabled">
                                    <template slot="append" v-if="field.append">{{field.append}}</template>
                                </el-input>

                                <el-input v-else-if="field.type==='input'"
                                          v-model="contractInfo[field.prop]"
                                          :placeholder="field.placeholder"
                                          :disabled="disabled || field.disabled || false">
                                    <template slot="append" v-if="field.append">{{field.append}}</template>
                                </el-input>
                                <el-input v-else-if="field.type==='number'"
                                          v-model.number="contractInfo[field.prop]"
                                          :disabled="disabled || field.disabled || false"></el-input>

                                <el-select v-else-if="field.type==='select' && field.prop === 'decoratePattern'"
                                           v-model="contractInfo[field.prop]"
                                           placeholder="请选择"
                                           :style="{width:'100%'}"
                                           :disabled="disabled || field.disabled || false"
                                           @change="onSelectChange">
                                    <el-option v-for="item in commonData[field.list]"
                                               :label="item.text"
                                               :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-else-if="field.type==='select'"
                                           v-model="contractInfo[field.prop]"
                                           placeholder="请选择"
                                           :style="{width:'100%'}"
                                           :disabled="disabled || field.disabled || false">
                                    <el-option v-for="item in commonData[field.list]"
                                               :label="item.text"
                                               :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-date-picker v-else-if="field.type==='datetime'||field.type==='date'||field.type==='time'||field.type==='daterange'"
                                                v-model="contractInfo[field.prop]"
                                                :style="{width:'100%'}"
                                                placeholder="请选择"
                                                :type="field.type || 'date'"
                                                :disabled="disabled || field.disabled || false">
                                </el-date-picker>

                                <el-input-number v-else-if="field.type==='input-number'"
                                                 v-model="contractInfo[field.prop]"
                                                 :style="{width:'100%'}"
                                                 :disabled="disabled || field.disabled || false">
                                </el-input-number>
                                <t8t-form-popup v-else-if="field.type==='popup'"
                                                :bindValue="value"
                                                :ref="field.prop"
                                                :records="field.records"
                                                :textValue="field.textValue"
                                                :defaultValue="contractInfo.defaultValue[field.prop]"
                                                :filedValue="field.filedValue"
                                                :name="field.prop"
                                                :placeholder="field.placeholder"
                                                :disabled="field.disabled"
                                                :readonly="field.readonly"
                                                :icon="field.icon"
                                                :onIconClick="field.onIconClick"
                                                :dialog="field.dialog"
                                                :style="{width:'100%',height:'100%'}"
                                                @change="onChange"
                                                @pop-input="onPopInput">
                                </t8t-form-popup>
                                <!-- 搜索面板 -->
                                <t8t-lookup v-else-if="field.type==='lookup'"
                                            :style="{width:'100%',height:'100%'}"
                                            :value="value"
                                            :size="field.size"
                                            :placeholder="field.placeholder"
                                            :searchPlaceholder="field.searchPlaceholder"
                                            :disabled="field.disabled"
                                            :readonly="field.readonly"
                                            :service="field.service"
                                            :method="field.method"
                                            :dataSource="field.dataSource"
                                            :args="field.args"
                                            :columns="field.columns"
                                            :searchExpr="field.searchExpr"
                                            :valueExpr="field.valueExpr"
                                            :toolbar="field.toolbar"
                                            :multiple="field.multiple"
                                            :filter-method="field.filterMethod"
                                            :selectable="field.selectable">
                                </t8t-lookup>
                                <t8t-division-old :style="{width:'100%'}" v-else-if='field.prop === "townIds"' v-model="contractInfo.townIds" :defaultValue="contractInfo.townId" class="addr_detail" filterable="true" :changeOnSelect="true"
                                              :clearable="true"
                                @change="onChangeRelated"></t8t-division-old>

                                <div v-else-if='field.prop === "orderImg"'>

                                            <div class="upload-box" @click="uploadBoxClick('cover')">
                                                <el-upload
                                                    class="avatar-uploader"
                                                    :data="uploadParams"
                                                    :accept="acceptImg"
                                                    :action="uploadURL"
                                                    :show-file-list="false"
                                                    :on-progress="onProgress"
                                                    :on-success="handleUploadScucess"
                                                    :before-upload="beforeUpload">
                                                    <img width="100" height="100" v-if="contractInfo['orderImg']['cover']" :src="'http://pic.to8to.com/'+contractInfo['orderImg']['cover']" class="avatar">
                                                    <i v-else class="el-icon-plus uploader-icon"></i>
                                                </el-upload>
                                                <div>合同封面</div>
                                            </div>
                                            <div class="upload-box" @click="uploadBoxClick('first')">
                                                <el-upload
                                                    class="avatar-uploader"
                                                    :data="uploadParams"
                                                    :accept="acceptImg"
                                                    :action="uploadURL"
                                                    :show-file-list="false"
                                                    :on-progress="onProgress"
                                                    :on-success="handleUploadScucess"
                                                    :before-upload="beforeUpload">
                                                    <img width="100" height="100" v-if="contractInfo['orderImg']['first']" :src="'http://pic.to8to.com/'+contractInfo['orderImg']['first']" class="avatar">
                                                    <i v-else class="el-icon-plus uploader-icon"></i>
                                                </el-upload>
                                                <div>合同第一页</div>
                                            </div>
                                            <div class="upload-box" @click="uploadBoxClick('last')">
                                                <el-upload
                                                    class="avatar-uploader"
                                                    :data="uploadParams"
                                                    :accept="acceptImg"
                                                    :action="uploadURL"
                                                    :show-file-list="false"
                                                    :on-success="handleUploadScucess"
                                                    :on-progress="onProgress"
                                                    :before-upload="beforeUpload">
                                                    <img width="100" height="100" v-if="contractInfo['orderImg']['last']" :src="'http://pic.to8to.com/'+contractInfo['orderImg']['last']" class="avatar">
                                                    <i v-else class="el-icon-plus uploader-icon"></i>
                                                </el-upload>
                                                <div>合同最后一页</div>
                                            </div>
                                </div>
                                    <el-row v-else-if='field.prop === "pqmImg" '>
                                        <el-col :span="6">
                                                <el-upload
                                                    class=""
                                                    :data="uploadParams"
                                                    :accept="acceptZip"
                                                    :action="uploadURL"
                                                    :show-file-list="false"
                                                    :on-success="handleUploadScucess"
                                                    :on-progress="onProgress"
                                                    :before-upload="beforeUploadZip">
                                                    <el-button size="small" type="primary" @click="uploadBoxClick('pqmImg')">选择文件</el-button>

                                                    <a target="_blank" v-if="contractInfo.pqmImg" @click.stop="" :href="'http://pic.to8to.com/'+contractInfo.pqmImg" class="avatar">报价单</a>
                                                    &nbsp;<span slot="tip" class="el-upload__tip">请将报价单拍照后，上传zip，rar格式压缩包文件</span>
                                                </el-upload>

                                        </el-col>
                                    </el-row>
                            </el-form-item>
                                </el-col>
                            </el-row>

                        </el-form>

                    <div style="text-align: center; padding: 15px ">
                        <el-button @click="createContract" type="primary" :loading="submitting2" :disabled="submitting2">提交</el-button>
                        <el-button @click="contractDetailDialogClose()">签约列表</el-button>
                    </div>

                </el-tab-pane>
            </el-tabs>
                </el-col>
            </el-row>
        </el-dialog>

        <!--合同预览-->
        <el-dialog v-model="showPdfView" title="预览合同" size="full" class="g-pdf-dialog" :close-on-press-escape="false"
                   :show-close="false">
            <div id="pdf" v-loading.fullscreen.lock="!contractPdfUrl" element-loading-text="正在生成合同，请稍候 ..."></div>
            <div style="text-align: center; padding: 15px ">
                <div style="margin: 5px;"><el-checkbox v-model="contractChecked">我已阅读完全部装修保合同，确定合同内容无误</el-checkbox></div>
                <el-button @click="againCreateOrder" :loading="resigning" :disabled="resigning">重新发起</el-button>
                <el-button @click="sign" type="primary" :loading="signing" :disabled="signing || !contractChecked">签约</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import contractDesigner from 'src/services/salemanager/contractDesigner.js'
    import config from 'src/views/m-salemanager/contract-designer/config.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import Utils from 'src/utils/Utils.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import Cookie from 'js-cookie'
    import PDFObject from 'src/utils/pdfobject.js'
   var pingStarTime = 0;
  export default {
    name: "contractDesignerDetail",
    props: [],
    components: {},
    data () {
      return {
        moreWaterPlatDisabled:false,//超水电增项最大比例是否禁用
        pageLoaded :false,
        userCheckStep: 0,//校验用户的要素标示 //3：三要素校验 4：四要素校验
        userChecked:true, //用户信息是否已经校验通过
        disabledFields:[
          "phone","identityCard" ,"name","email","bankcard"
        ],//用户信息中禁止编辑的字段列表
        projectId:null,//项目id
        sourceProjectId:null,//源项目id
        contractId:null,//合同id
        ownerId:null,//业主id
        contractPdfUrl:null,//合同pdf地址
        showPdfView:false,//展示合同预览
        contractChecked:false,//是否已阅读合同

        //业主信息
        userInfo:{

        },
        userInfo3:{
          phone:'',//电话号
          identityCard :'',//身份证号
          name:'',//业主名
          email:'',//邮箱\
        },
        userInfo4:{
          phone:'',//电话号
          identityCard :'',//身份证号
          name:'',//业主名
          email:'',//邮箱\
          bankcard:'',//银行卡号
        },
        // 合同信息
        contractInfo:{
            ownerCall:'',//业主称呼
            ownerCallPhone:'',//业主电话
            realSignedTime:'',//签约时间
            times:[],//施工日期
            contractOffer:'',//装修总价
            decorateType:'',//装修类型
            decoratePattern:'',//装修方式
            paymentMode:'',//支付方式
            contactName:'',//公司联系人
            contactPhone:'',//联系人电话
            contactEmail:'',//联系人邮箱
            moreWaterPlat:'',//超水电增项最大比例
            moreOtherPlat:'',//超其他增项最大比例
            projectAddress:'',//装修地址
            townIds:'',//省市区集合
            townId:'',//省/市/区的值
            estateId:'',//楼盘id
            estateName:'',//楼盘名
            houseAddr:'',//房号
            orderImg:{
                cover:'',//封面
                first:'',//第一张
                last:''//最后一张
            },//合同照片
            pqmImg:'',//报价单
            defaultValue:{}//各种默认值
        },
        estateText:'',//楼盘的默认值
        formFields:[],
        formFieldsNote:[],
        //三要素字段
        formFields3:config.formFields3,

        //四要素字段
        formFields4:config.formFields4,
        formFieldsNote3:config.formFieldsNote3,
        formFieldsNote4:config.formFieldsNote4,

        //合同字段
        formFieldsOrder:config.formFieldsOrder,
        uploadURL: Utils.getUploadURL(),
        uploadParams:{
          bucket: 'scm',
          module: 'pic/zxgs' //TODO 上传路径要参考（/my/gs_make_contract.php做到兼容老数据）上传文件的MFS目标目录名。上传成功后文件服务返回路径会是pic/xxxx，存储只取xxx的部分，访问方式为:pic.to8to.com/xxx
        },
        acceptImg:'image/jpeg,image/jpg,image/png',
        acceptZip:'application/x-zip-compressed,application/octet-stream,application/zip',
        maxSizeImg: 1024 * 1024 * 2,// 2M
        maxSizeZip: 1024 * 1024 * 8,// 8M
        uploadModel:'',
        commonData:{
          decorateType:[], //供应链业务辅助资料：售前->项目->家装工装( 583 33004)
          decoratePattern:[], //供应链业务辅助资料：售前->项目->半包全包 (583 33002)
          paymentMode:[
            {
                text:"全额支付",
                value:1
            },
            {
                text:"分期支付",
                value:2
            },
            {
                text:"建行支付",
                value:3
            }
          ],
        },
        submitting:false,//正在提交用户校验表单
        submitting2:false,//正在提交合同
        signing:false,//正在签署
          resigning:false,//正在重新签署
        uploadingImg: false,
        intervalPdf : '',
        contractDetailVisible: true//控制页面展示隐藏
      }
    },
    created () {
        this.projectId = this.$route.query.yid
        this.getCommonOptions(81104,'decorateType')
        this.getCommonOptions(81102,'decoratePattern')
        this.getContractDetail()
    },
    methods: {

        getContractDetail: function (){
            let _this = this
            if( this.projectId == "" || Number.isNaN(this.projectId) || this.projectId <= 0 ){
                return this.$msgbox({type:"error",message:"请输入项目ID"});
            }else{
                contractDesigner.getContractDetail(this.projectId).then(res => {
                        //业主id可能不存在也可能存在
                        _this.ownerId = res.ownerId
                        _this.sourceProjectId = res.sourceProjectId
                        _this.contractId = res.contractId || null
                        //let orderImg = res.orderImg.split(';')
                        _this.contractInfo = Object.assign(_this.contractInfo,{
                            ownerCall:res.ownerCall || '',
                            ownerCallPhone:res.ownerCallPhone || '',
                            realSignedTime: res.realSignedTime  ? new Date(res.realSignedTime * 1000)  : '',//签约时间
                            times: res.startTime && res.endTime ? [new Date(res.startTime * 1000), new Date(res.endTime * 1000)] : [],//施工日期
                            contractOffer: res.contractOffer,//装修总价
                            decorateType: res.decorateType,//装修类型
                            decoratePattern: res.decoratePattern,//装修方式
                            paymentMode: res.paymentMode,//支付方式
                            contactName: res.contactName,//公司联系人
                            contactPhone: res.contactPhone,//联系人电话
                            contactEmail: res.contactEmail,//联系人邮箱
                            moreWaterPlat: res.moreWaterPlat,//超水电增项最大比例
                            moreOtherPlat: res.moreOtherPlat,//超其他增项最大比例
                            projectAddress: res.projectAddress,//装修地址
                            townIds:[res.provinceId,res.cityId,res.townId],//省市区id集合
                            townId: res.townId || res.cityId || res.provinceId || null,//省或市或区的id，组件根据此值渲染默认选中
                            estateId:res.estateId,//楼盘id
                            estateName:res.estateName,
                            houseAddr:res.houseAddr || '',//房号
                            defaultValue:{
                                estateId:{
                                    filedValue:res.estateId,
                                    textValue:res.estateName,
                                }
                            },
                            /*orderImg:{
                                cover: orderImg[0] || "",//封面
                                first:orderImg[1] || "",//第一张
                                last:orderImg[2] || ""//最后一张
                            },//合同照片
                            pqmImg: res.pqmImg,//报价单*/
                        })

                        let decoratePattern = _this.commonData['decoratePattern'].filter(item => {
                            return res.decoratePattern == item.value
                        })
                        if( decoratePattern.length && decoratePattern[0].text == '全包' ){
                            _this.moreWaterPlatDisabled = true
                            _this.contractInfo.moreWaterPlat = 0
                        }
                        _this.userInfo3 = {
                            phone:res.ownerPhone,//电话号
                            identityCard :res.ownerIdNumber,//身份证号
                            name:res.ownerName,//业主名
                            email:res.ownerEmail,//邮箱
                        }

                        _this.userInfo4 = {
                            phone:res.ownerPhone,//电话号
                            identityCard :res.ownerIdNumber,//身份证号
                            name:res.ownerName,//业主名
                            email:res.ownerEmail,//邮箱
                            bankcard:res.ownerBankNumber,//银行卡号
                        }

                        _this.userCheckStep = _this.isEmpty(res.ownerBankNumber) ? 3 : 4
                        _this.formFields = (_this.userCheckStep == 3) ? _this.formFields3  : _this.formFields4
                        _this.formFieldsNote = (_this.userCheckStep == 3) ? _this.formFieldsNote3 : _this.formFieldsNote4
                        _this.userInfo = (_this.userCheckStep == 3) ? _this.userInfo3 : _this.userInfo4

                        _this.userChecked = res.isCheck == 1
                        _this.pageLoaded = true

                }).catch(e => {
                    this.$msgbox({type:'error',title:'查询项目信息出错',message:e});
                })
            }

        },

        //创建合同
        createContract: function (){
            let _this = this
            let form = this.$refs['contractInfoForm']
            let townIdsComp = form.fields.filter(i => {return i.prop=='townIds'})
            let citysLabel = '';
            if( townIdsComp.length ){
                let labels = townIdsComp[0].$children[0].$children[0].currentLabels

                if( labels.length == 3 ){
                    citysLabel = [labels[0],labels[1],labels[2].replace(labels[1],'')].join('')
                }else if(labels.length>0){
                    citysLabel = labels.currentLabels.join('')
                }

            }

            form.validate(r => {

                if (r) {
                    _this.submitting2 = true
                    let contractInfo = this.contractInfo
                    let orderImg = contractInfo.orderImg
                    let times = contractInfo.times
                    let args = {
                        realSignedTime:this.floorDateFromStr(contractInfo.realSignedTime),//签约时间
                        startTime:this.floorDateFromStr(times[0]),//施工日期
                        endTime:this.floorDateFromStr(times[1]),//施工日期
                        contractOffer:+contractInfo.contractOffer,//装修总价
                        decorateType:contractInfo.decorateType,//装修类型
                        decoratePattern:contractInfo.decoratePattern,//装修方式
                        paymentMode:contractInfo.paymentMode,//支付方式
                        contactName:contractInfo.contactName,//公司联系人
                        contactPhone:contractInfo.contactPhone,//联系人电话
                        contactEmailInfo:contractInfo.contactEmail,//联系人邮箱
                        moreWaterPlat:+contractInfo.moreWaterPlat,//超水电增项最大比例
                        moreOtherPlat:+contractInfo.moreOtherPlat,//超其他增项最大比例
                        projectAddress:citysLabel+contractInfo.houseAddr,//装修地址
                        provinceId:+contractInfo.townIds[0],//省id
                        cityId:+contractInfo.townIds[1],//城市id
                        townId:+contractInfo.townIds[2],//区id
                        estateId:+contractInfo.estateId,//楼盘id
                        estateName:contractInfo.estateName,//楼盘名
                        houseAddr:contractInfo.houseAddr,//房号
                        orderImg:[orderImg.cover,orderImg.first,orderImg.last].join(";"),//contractInfo.orderImg,//合同照片
                        pqmImg:contractInfo.pqmImg,//报价单
                        updateUser:+Cookie.get('t8t-tc-uid'),
                        type:2,//单据类型|枚举类型:0-无 1:补录合同 2:电子签
                        projectId:_this.projectId,
                    }
                    contractDesigner.createContract(args).then(res => {
                        //返回token，轮询判断合同pdf是否已经生成
                        _this.$msgbox({
                            type:'success',
                            title:'您的合同已提交成功',
                            message:"请在<front style='color:red'>1-2分钟后查看并签署生成的合同</front>",
                            closeOnPressEscape:false,
                            confirmButtonText: '我知道了',
                            callback:function(action, instance){
                                //展示预览合同并轮询生成结果
                                _this.showPdfView = true
                                _this.pingContractPdf(res)

                            }
                        })



                    }).catch(e => {
                        _this.$msgbox({
                            type:'error',
                            title:'合同提交失败',
                            message:e,
                        })
                        _this.submitting2 = false
                    })
                }
            })

        },

        //重新发起（编辑合同）
        againCreateOrder:function () {
            let _this = this
            this.$confirm('您确认要重新发起合同吗？', '重新发起确认', {
                type: 'warning',
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            }).then(() => {
                _this.resigning  = true
                contractDesigner.againCreateOrder(
                    _this.projectId,
                    _this.sourceProjectId,
                    +Cookie.get('t8t-tc-uid')
                ).then(res => {

                    _this.userChecked = false//重新校验用户
                    _this.submitting2 = false
                    _this.showPdfView = false //取消pdf预览显示
                    _this.resigning = false
                    _this.contractInfo.orderImg = {
                        cover:'',//封面
                            first:'',//第一张
                            last:''//最后一张
                    },//合同照片
                     _this.contractInfo.pqmImg = ''//报价单
                }).catch(e => {
                    _this.resigning = false
                    this.$msgbox({
                        type: 'error',
                        title: '不能重新发起合同',
                        message: e
                    })
                })

            }).catch(() => {

            })
        },

        //异步检测合同pdf是否生成
        pingContractPdf: function (){

            let _this = this
            _this.intervalPdf = setInterval(function (){

                contractDesigner.preview(_this.projectId).then(res => {
                        pingStarTime += 3000
                        //state 1创建中 2创建成功 3创建失败    //url 预览合同pdf
                        if( !_this.isEmpty(res) ){
                            clearInterval(_this.intervalPdf)
                            _this.contractPdfUrl = res
                            //let _url = 'https://scmgw.to8to.com/?path=' +res.data.result.url+ '&uid=' + Cookie.get('t8t-tc-uid') + '&ticket=' + Cookie.get('t8t-tc-ticket')
                            PDFObject.embed(Utils.getPreviewURL(res), "#pdf")
                           //PDFObject.embed('http://wiki.we.com:8090/download/attachments/46107173/Java%E8%AF%AD%E8%A8%80%E8%A7%84%E8%8C%83%E4%B8%AD%E6%96%87%E7%89%88%28%E7%AC%AC%E4%B8%89%E7%89%88%29.pdf?version=1&modificationDate=1471436595000&api=v2', "#pdf")

                        }else if( pingStarTime >= 3000 * 20  ){

                            clearInterval(_this.intervalPdf)

                            _this.contractPdfUrl = 'demo' //取消loading蒙层

                            _this.$msgbox({
                                type:'error',
                                title:'生成合同预览失败',
                                callback:function(action, instance){

                                    //跳转到合同列表
                                    _this.showPdfView = false //取消pdf预览显示
                                    _this.contractDetailDialogClose()
                                }
                            })

                        }else{

                        }


                }).catch(e => {

                })
            }, 3000)
        },

        //校验用户
        userInfoValidate: function (){
            let form = this.$refs['userInfoForm']
            let _this = this

            form.validate(r => {
                if(r){
                    _this.submitting = true
                    let step = _this.userCheckStep
                    contractDesigner.validateUserInfo(
                        this.projectId,
                        +Cookie.get('t8t-tc-uid'),
                        _this.userInfo.name,
                        _this.userInfo.phone,
                        _this.userInfo.identityCard,
                        _this.userInfo.email,
                        _this.userInfo.bankcard || '',
                        _this.ownerId || ''
                    ).then(res => {
                        _this.userChecked = true

                        //用户信息校验成功后，全部信息文本框禁用
                        _this.disabledFields = [
                            "phone","identityCard" ,"name","email","bankcard"
                        ]
                        _this.submitting = false
                        _this.$msgbox({
                           type:'success',
                           title:'签署人信息校验通过',
                           message:'请继续完善合同信息',
                           //closeOnPressEscape:false,
                           callback:function(action, instance){

                           }
                       })
                    }).catch(e => {
                        _this.submitting = false
                         _this.$msgbox({
                            type:'error',
                            title:'签署人信息校验出错',
                            message:e,
                            confirmButtonText: step == 3 ? '填写银行卡' : '修改用户信息' ,
                            cancelButtonText: '知道了',
                            closeOnPressEscape: false,
                            showCancelButton: true,
                            callback:function(action, instance){
                                //确认按钮（@Warning 为保证点取消按钮和点叉叉的行为一致，此处选用了确认按钮来触发反向行为，不要更改）, 三要素失败就进行四要素，反之亦然，
                                if( action == 'confirm' ){
                                    _this.formFields = step == 3 ? _this.formFields4 : _this.formFields3
                                    _this.userInfo = step == 3 ? _this.userInfo4 : _this.userInfo3
                                    _this.formFieldsNote = 3 ? _this.formFieldsNote4 : _this.formFieldsNote3
                                    _this.userCheckStep = step == 3 ? 4 : 3
                                }
                            }
                        })

                    })
                }else{
                }
            })
        },

        //签署合同
        sign:function (){
            let _this = this
            _this.signing = true
            contractDesigner.sign(this.sourceProjectId,this.projectId,  +Cookie.get('t8t-tc-uid')).then(res => {

                _this.$msgbox({
                    type:'success',
                    title:'签署成功',
                    message:'装修公司签署合同成功',
                    callback:function(action, instance){

                        //返回合同列表
                        _this.showPdfView = false
                        _this.contractDetailDialogClose()
                    }
                })

            }).catch(e => {
                _this.signing = false
                return _this.$msgbox({
                    type: 'error',
                    title: '合同签署失败',
                    message: e
                })
            })
        },

        //上传时执行
        onProgress:function (event, file, fileList){
            this.uploadingImg = true
        },

        //上传成功回调
        handleUploadScucess: function (response, file, fileList){
            if( response.status == 200 ){
                this.uploadingImg = false
                let file = response.result.filePath.replace('pic\/','')

                //报价单压缩包上传
                if( this.uploadModel == 'pqmImg' ){
                    this.contractInfo.pqmImg = file
                }
                else{
                    this.contractInfo.orderImg[this.uploadModel] = file
                }
                this.uploadingImg = false
            }else{
                return this.$message.error(response.result || response.message || '上传出错');
            }
        },
        //上传前执行
        beforeUpload: function (file){
            let _this = this
            if( this.uploadingImg ){
                return false
            }
            const inAllowType = [
                'image/jpeg',
                'image/jpg',
                'image/png',
            ].indexOf(file.type) > -1;

            const lessThenMaxSize = file.size < this.maxSizeImg;

            if (!inAllowType) {
                this.$message.error('只能上传jpg/png类型的图片文件!');
                return false
            }
            if (!lessThenMaxSize) {
                this.$message.error('上传文件大小不能超过 2MB!');
                return false
            }

            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                var img = new Image()
                img.onload = function (e) {

                    //上传图片尺寸应该限制最小100*100，最大1200*1200
                    let height = e.path[0]['height']
                    let width = e.path[0]['width']

                    if ( 100 <= width && width <= 1200 && 100 <= height &&  height <= 1200 ) {
                        resolve(true);
                    } else {
                        _this.$message.error('图片尺寸错误,请上传100*1200内的图片');
                        reject(new Error('图片尺寸错误,请上传100*1200内图片'));
                    }


                }
                reader.onload = function (oFREvent) {
                    img.src = oFREvent.target.result
                }
            })
//            return inAllowType && lessThenMaxSize;
        },

        //zip上传前执行
        beforeUploadZip: function (file){
            if( this.uploadingImg ){
                return false
            }
            let ext = file.name.split('.').pop().toLowerCase();//文件后缀。 由于file.type无法获得压缩文件信息，这里直接用后缀处理(zip, rar 压缩包 mime：'application/x-zip-compressed', 'application/octet-stream','application/zip')
            const inAllowType = [
                'rar', 'zip'
            ].indexOf(ext) > -1;

            const lessThenMaxSize = file.size < this.maxSizeZip;

            if (!inAllowType) {
                this.$message.error('只能上传zip,rar类型的文件!');
            }
            if (!lessThenMaxSize) {
                this.$message.error('上传文件大小不能超过 8MB!');
            }
            return inAllowType && lessThenMaxSize;
        },

        //选择文件时
        uploadBoxClick: function (model){
            if( !this.uploadingImg ){
                this.uploadModel = model
            }
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

        //关闭窗口
        contractDetailDialogClose: function () {
            this.$emit('close')
            this.$router.push({
                path:'/tuchat-sale-manage/contract-designer-list',
                query:{t:new Date().getTime()}
            })
        },

        //
        onChange: function(value,name) {
            this.contractInfo[name] = value
        },
        onSelect: function(value,name){
            this.contractInfo[name] = value;
        },
        onPopInput:function (value,filed,text) {
            if( filed == 'estateId' ){
                this.contractInfo.estateName = text;
            }
        },
        onSelectChange: function (value){
            let decoratePattern = this.commonData['decoratePattern'].filter(item => {
                return value == item.value
            })
            if( decoratePattern.length && decoratePattern[0].text == '全包' ){
                this.contractInfo.moreWaterPlat = 0
                this.moreWaterPlatDisabled = true
            }else{
                this.moreWaterPlatDisabled = false
            }
        },
        onChangeRelated (value,value2) {
    //        this.relatedSize = value.length
            //this.relatedId = value[value.length - 1]
        },
        //格式化时间转换为时间戳 精确到秒
        floorDateFromStr(str){
            return  this.isEmpty(str) ? str : Math.floor(new Date(str).getTime()/1000)
        },
        isEmpty(str){
            return str == null || str == 0 || str == '' || str == undefined || str == '0'
        },
        handleIconClick: function (prop){
            if( this.disabledFields.includes(prop) ){
                this.disabledFields.splice(this.disabledFields.indexOf(prop),1)
                this.userChecked = false //重新验证用户信息 TODO 精细化控制需要编辑的文本域
            }
        }
    }
  }
</script>

<style type="text/css">
    .contractDesignerDetail .userInfoForm{
        /*width:350px;*/
    }
    .contractDesignerDetail .contractInfoForm{
        /*width:350px;*/
    }
    .contractDesignerDetail .upload-box{
        margin: 5px;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        cursor: pointer;
        /*overflow: hidden;*/
        display: inline-block;
        text-align: center;
        width: 100px;
        height: 100px;
    }

    .avatar-uploader .el-upload {
        display: inline-block;
        text-align: center;
        cursor: pointer;
        width: 100%;
        height: 100%;
    }
    .contractDesignerDetail .upload-box .uploader-icon{
        font-size: 28px;
        color: #8c939d;
        text-align: center;
        line-height: 100px;
    }
    .contractDesignerDetail .upload-box .avatar-uploader{
        width: 100px;
        height: 100px;
    }
    .contractDesignerDetail .el-cascader{
        width: 100% !important;
    }
    .contractDesignerDetail .el-autocomplete{width: 100%}
    .contractDesignerDetail .el-input-group__append{border: none}
    .contractDesignerDetail #pdf{
       height: 700px;
    }
    @media screen and (max-height: 900px) {
        .contractDesignerDetail #pdf{
            height: 400px;
        }
    }
</style>
