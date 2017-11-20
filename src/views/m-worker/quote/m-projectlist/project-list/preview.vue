<template>
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog">
        <div class="t8t-full-dialog-container">

         <!-- 顶部按钮区 -->
            <div class="full-dialog-toolbar-container">
                <div class="toolbar-container">
                    <t8t-toolbar
                        v-show="activePane == 'cityInfo' && (type == 'mz' || type == 'sg')"
                        @FINISH="finish"
                        @RECALL="recall"
                        :symbolList="symbolList"
                        ref="toolbar"
                    >
                    </t8t-toolbar>
                </div>
            </div>

            <!-- 表单区 -->
            <div class="full-dialog-form-container container-center">
                <el-form :model="hFormData"  ref="formRef" label-position="right" label-width="120px">
                    <div class="form-item-container">
                        <el-form-item label="项目ID" prop="id">
                            <el-input v-model="hTypeData.id" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="工程地址" prop="houseAddress">
                            <el-input v-model="hTypeData.houseAddress" disabled  ></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="业主称呼" prop="ownerName">
                            <el-input v-model="hTypeData.ownerName" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="户型" prop="houseStyle">
                            <el-input v-model="hTypeData.houseStyle" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="风格" prop="preferStyleName">
                            <el-input v-model="hTypeData.preferStyleName" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="居住人口" prop="peopleNum">
                            <el-input v-model="hTypeData.peopleNum" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="计价面积" prop="houseValuationArea">
                           <el-input v-model="hTypeData.houseValuationArea" disabled></el-input>
                        </el-form-item>
                    </div>

                </el-form>
            </div>

           <el-tabs v-model="activePane">
                    <el-tab-pane label="图册" name="baseInfo" class="org-tab-pane">
                    <div class="Drawing-start">

                        <h1>原始户型图</h1>
                        <div v-if="photoes.startPic.length" v-for="item in photoes.startPic" class="yuanshi">
                        <img v-if="item.coverPath" @click="searchStart(item.id,0,item.tumaxSchemeid,item.photoesName)" :src="'http://file.to8to.com/'+item.coverPath" >
                        <img v-else  @click="searchStart(item.id,0,item.tumaxSchemeid,item.photoesName)" src="./cad.png">
                        <p>原始户型图<span>(采用)</span></p>
                        </div>

                        <div v-if="!photoes.startPic.length">
                        <img @click="searchStart(0,0)" src="./cad.png">
                        <p>未创建原始户型图册<span></span></p>
                        </div>
                    </div>

                    <div class="Drawing-start">
                        <h1>平面布置图</h1>
                        <div  class="Drawing-plane">
                            <ul>
                                <li v-for="item in photoes.planePic">
                                    <img v-if="item.coverPath" @click="searchStart(item.id,1,item.tumaxSchemeid,item.photoesName)" :src="'http://file.to8to.com/'+item.coverPath">
                                    <img v-else @click="searchStart(item.id,1,item.tumaxSchemeid,item.photoesName)" src="./cad.png">
                                    <p v-if="item.usedStatus==1">{{item.photoesName}}<span>(采用)</span></p>
                                    <p v-else>{{item.photoesName}}<span @click="adopt(item.id,1)" >(未采用)</span></p>
                                </li>
                                <li v-if="!photoes.planePic.length">
                                    <img @click="searchStart(0,1)" src="./cad.png">
                                    <p>未创建平面布置图册<span></span></p>
                                </li>
                            </ul>
                        </div>

                    </div>

                    <div class="Drawing-start">
                        <h1>3D效果图</h1>
                        <div class="Drawing-plane">
                            <ul>
                                <li v-for="item in photoes.ThreeDPic">
                                    <img v-if="item.coverPath" @click="jumpToTumax(item.tumaxSchemeid,1)" :src="'http://file.to8to.com/'+item.coverPath">
                                    <img v-else @click="jumpToTumax(item.tumaxSchemeid,1)" src="./cad.png">
                                    <p v-if="item.usedStatus==1">{{item.photoesName}}<span>(采用)</span></p>
                                    <p v-else>{{item.photoesName}}<span @click="adopt(item.id,2)">(未采用)</span></p>
                                </li>
                                <li v-if="!photoes.ThreeDPic.length">
                                    <img src="./cad.png">
                                    <p>未创建3D效果图册<span></span></p>
                                </li>
                            </ul>
                        </div>

                    </div>

                    <div class="Drawing-start">

                        <h1>施工图</h1>

                        <div v-if="photoes.workPic.length" v-for="item in photoes.workPic" @click="goDetail('sg',item.id,3,item.usedStatus)">
                            <img v-if="item.coverPath" :src="item.src">
                            <img v-else src="./cad.png">
                            <p>施工图<span v-if="item.usedStatus == 2">（已完成）</span><span v-else>（未完成）</span></p>
                        </div>

                    </div>

                    <div class="Drawing-start">

                        <h1>木作图</h1>
                        <div v-if="photoes.woodPic.length" v-for="item in photoes.woodPic" @click="goDetail('mz',item.id,4,item.usedStatus)">
                            <img v-if="item.coverPath" :src="item.src">
                            <img v-else src="./cad.png">
                            <p>木作图<span v-if="item.usedStatus == 2">（已完成）</span><span v-else>（未完成）</span></p>
                        </div>

                    </div>

                    </el-tab-pane>
                    <el-tab-pane label="图片" name="cityInfo" class="org-tab-pane city-pane">
                        <div v-if="photoesType==0" class="Drawing-detail">
                           <p>原始户型图 > 原始户型图</p>
                           <div v-if="photoInfos.length" class="start" v-for="item in photoInfos">
                               <img @click="showPicture($event)" v-if="item.photoPath" :src="'http://file.to8to.com/'+item.photoPath">
                               <p v-if="item.photoPath">{{item.photoName}}</p>
                               <button @click="jumpToTumax(tumaxSchemeid)" href="javascript:;">
                                   编辑
                                </button>
                           </div>

                           <div v-if="!photoInfos.length" class="start">
                           <img @click="jumpToTumax(0)" src="./create.png">
                           <p>原始户型图.jpg</p>
                           </div>

                        </div>

                        <div v-if="photoesType==1" class="Drawing-detail">
                           <p>平面布置图 > {{photoesName}}</p>
                           <div v-if="photoInfos.length" class="start" v-for="item in photoInfos">
                               <img @click="showPicture($event)" v-if="item.photoPath" :src="'http://file.to8to.com/'+item.photoPath">
                               <p v-if="item.photoPath">{{item.photoName}}</p>
                                <button @click="jumpToTumax(tumaxSchemeid)" href="javascript:;">
                                   编辑
                                </button>
                           </div>

                        </div>
                        <div v-if="photoesType == 3 || photoesType == 4" class="container-center">
                            <sg-upload-template :photoesStatus="photoesStatus" :photoesId="photoesId" v-if="type == 'sg'"></sg-upload-template>
                            <mz-upload-template :photoesStatus="photoesStatus" :photoesId="photoesId" v-if="type == 'mz'"></mz-upload-template>
                        </div>
                    </el-tab-pane>

                </el-tabs>
             <el-dialog v-model="dialogVisible" :modal="false" class="projectlist-showimg-dialog" size="full">
                <img width="100%" :src="dialogImageUrl" alt="">
             </el-dialog>
        </div>
    </el-dialog>
</template>

<script>
    import Server from 'src/config/server.js'
    import api from 'src/services/system/organization.js'
    // import GeoUtils from 'src/utils/Geo.js'
    import axios from 'src/utils/axios.js'
    import Service from 'src/services/worker/projectlist/Service.js'
    import TemplateProjectlist from 'src/services/worker/projectlist/base-method.js'
    import TemplatePhoto from 'src/services/worker/projectlist/photo-method.js'
    import sgUploadTemplate from './sg-upload.vue'
    import mzUploadTemplate from './mz-upload.vue'
    import Cookie from 'js-cookie'
    import commonApi from 'src/services/commonApi/commonApi.js'
    export default {
        components: {
            sgUploadTemplate,
            mzUploadTemplate
        },
        data () {
            return {
                symbolList:[],
                dialogVisible: false,
                title: '查看组织',
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
                hTypeData:{},
                photoes:{
                    startPic:[],
                    planePic:[],
                    ThreeDPic:[],
                    workPic:[],
                    woodPic:[],
                },
                photoesId:null,
                photoesType:null,
                photoesName:null,
                photoesStatus: null,
                tumaxSchemeid:null,
                photoInfos:[],
                yid:this.$route.query.yid,
                type:'',
                typeList: {},
                params: { //跳转tumax需要必传参数
                    uid: '',
                    yid: '',
                    cid: '',
                    role: 4,
                    prosuid: '',
                    projuid: '',
                    prokuid: '',
                    ticket: '',
                    province_id: '',
                    city_id: '',
                    town_id: '',
                    province: '',
                    city: '',
                    town: '',
                    addr: '',
                    title: ''
                }
            }
        },
        props: {
            status: {
                type: String,
                default: 'view'
            },
            rowData: {
                type: Object,
                default: {}
            },
            commonData: {
                type: Array,
                default: []
            }
        },
        // created(){
        //     this.activePane = 'cityInfo';
        // },
        methods: {
            closeDialog() {
                this.$router.go(-1)
            },
            onSelectChange(contactUser) {
                // 初始化加载数据的时候也会触发onSelectChange事件
                if (this.requestTime > 0) this.data.contactUser = contactUser
            },

            searchStart(photoesId,photoesType,tumaxSchemeid,photoesName){

                this.activePane = 'cityInfo'
                this.photoesId = photoesId
                this.photoesType = photoesType
                this.photoesName = photoesName
                this.tumaxSchemeid = tumaxSchemeid
                this.photoInfos = [];
                this.getPhotoInfos(photoesId,this.yid);

                console.log(tumaxSchemeid);

                this.type = '';

            },


            getPhotoes(yid){
                let args={
                    "projectId" :yid,
                    "accountId": +Cookie.get('t8t-tc-uid')
                }

                TemplatePhoto.query(args).then((res)=>{
                    if(res.data.status === 200 && res.data.result !== null){
                        let uid = Cookie.get('t8t-tc-uid');
                        let ticket = Cookie.get('t8t-tc-ticket');
                        res.data.result.forEach((item)=>{

                            if(item.coverPath){
                                item.src = Server.gatewayAddr + '/?path='+ item.coverPath +'&action=file&uid='+ uid + '&ticket=' + ticket;
                            }
                            if(item.photoesType==1){

                                this.photoes['planePic'].push(item)

                            }else if(item.photoesType==2){

                                this.photoes['ThreeDPic'].push(item)
                            }else if(item.photoesType==3){

                                this.photoes['workPic'].push(item)
                            }else if(item.photoesType==4){

                                this.photoes['woodPic'].push(item)
                            }else if(item.photoesType==0){

                                this.photoes['startPic'].push(item)
                            }

                        })


                    }

                })



            },

            getProjectInfor(yid){
                let args ={
                    "ids":[yid]
                }
                TemplateProjectlist.queryPageByIds(args).then((res)=>{

                    if(res.data.status === 200 && res.data.result !== null){

                        res.data.result.forEach((item)=>{

                          this.hTypeData = item
                        })
                    }


                })

            },
            getPhotoInfos(photoesId,yid){

                let args={
                    "projectId":yid,
                    "photoesId":photoesId
                }

                TemplatePhoto.queryPhotoInfosById(args).then((res)=>{

                    let uid = Cookie.get('t8t-tc-uid');
                    let ticket = Cookie.get('t8t-tc-ticket');

                    if(res.data.status === 200 && res.data.result !== null){

                        res.data.result.forEach((item)=>{

                          if(item.photoPath){
                                item.src = Server.gatewayAddr + '/?path='+ item.photoPath +'&action=file&uid='+ uid + '&ticket=' + ticket;
                            }

                          this.photoInfos.push(item)
                        })
                    }


                })

            },
            goDetail(type,id, photoesType, photoesStatus){
                this.type = type;
                this.activePane = 'cityInfo';
                this.photoesId = id;
                this.photoesType = photoesType;
                this.photoesStatus = photoesStatus;
                if(photoesStatus == 2){ // 已完成
                    this.symbolList=['RECALL']
                }else{
                    this.symbolList=['FINISH']
                }
            },

            adopt(photoesId,photoesType){

                this.$confirm('是否确认采用？','提示',{
                    type:'warning'
                }).then(()=>{
                    axios({
                        service: 'hMNCl9S9hJbGkcd4dsaHxWWo3cOZFd3', // /biz/dsp-prs-pqm/app
                        method: '0pZ5re5e_fMzDtfCrdsD_MfaXifbYmYiIp0t8XiuNs2', // views.photoes.updateUsedStatus
                        args: {"statusUpdateDTO":{id: photoesId,projectId:this.yid,photoesType:photoesType,updateName: Cookie.get('t8t-tc-username'), updateBy: Cookie.get('t8t-tc-username'),updateUser:+Cookie.get('t8t-tc-uid')}
                    }}).then((res)=>{
                        if(res.data.status === 200){
                            this.$msgbox({
                            title: '消息',
                            type: 'success',
                            message: '操作成功',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain',
                            callback:()=>{
                                this.photoes['startPic']=[]
                                this.photoes['planePic']=[]
                                this.photoes['ThreeDPic']=[]
                                this.photoes['workPic']=[]
                                this.photoes['woodPic']=[]
                                this.getPhotoes(this.yid);
                            }
                        })
                        }else{
                            this.$message.error('采用失败！');
                        }
                    }).catch((error)=>{
                        this.$message.error('请求出错！');
                    })
                }).catch(()=>{

                })

            },
            initProjectData: function(){
                this.initDesigner()
                this.initProjectDecorationOrder()
            },
            initDesigner: function (){
                //let typeCodes = [] //派单类型ID （辅助资料（42101）：派工单=》派工类型）
                let p = new Promise((resolve,reject)=>{
                    let arg =  {
                        page: 1,
                        search: { pPropertyCode: 42101 }, // { pPropertyCode: code}
                        size: 100
                    }
                    commonApi.queryUnionParent(arg).then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus===1) {
                                    this.typeList[item.propertyCode] = item.id;
                                }
                            });
                        }
                        resolve();
                    });
                });
                p.then(()=>{
                    axios({
                        service: 'H0G51djQ1e-XdpYbGwKWTvavNgdaBoQ', // /biz/t8t-prs-ass/app
                        method: 'yyXSnyp6hMfoyU7xnFmicGHmxsy3Shw1jSZfhl529v-njyAciG80QF7zzWc',//assignPrincipal.selectByProjectIdAndTypes 单个项目信息和多个派单类型查询
                        args: {
                            'projectId': this.yid,
                            'typeCodes': ['02','03','04']
                        }
                    }).then((res)=>{
                        res.data.result.forEach((item)=>{
                            if(item.typeId == this.typeList['02']){ // 设计师主管id
                                this.params.projuid = item.principalId;
                            }else if(item.typeId == this.typeList['03']){ //首席设计师id
                                this.params.prosuid = item.principalId;
                            }else if(item.typeId == this.typeList['04']){ // 客户经理id
                                this.params.prokuid = item.principalId;
                            }
                        })
                    }).catch(()=>{

                    })
                })
            },
            initProjectDecorationOrder: function (){
                axios({
                    service: 'ulrHNCuhE6BgO4pp5MpbwHK0bQ84ty2', //  /biz/t8t-prs-mdm/app
                    method: 'bZYTg9pR0V7cKbTK7KUdHitOXr1LLb1Pt1kdY85SDTnLEoeZMIrfAvE',// views.decorationOrder.queryDetailPage
                    args: {
                        'search': {
                            'id':this.yid
                        },
                        'fields':['cityId','cityName','townId','townName','estateId','estateName','houseAddress'],
                        "page": 1,
                        "size": 1
                    }
                }).then((res) => {
                    if(res.data.status == 200){
                        if(res.data.result.rows.length > 0){
                            let data = res.data.result.rows[0]
                            this.params.city_id = data.cityId
                            this.params.town_id = data.townId
                            this.params.city = encodeURI(data.cityName)
                            this.params.town = encodeURI(data.townName)
                            this.params.addr = encodeURI(data.houseAddress)
                        }
                    }
                })
            },
            //跳转到tumax
            jumpToTumax:function (cid,flag){

                /*uid:登录用户id
                role:4 固定,设计师角色
                yid：项目id
                cid:图册id 只有平面布置图和3d效果图要传
                prosuid: intval($project['chief_id']) //首席设计师id
                prokuid:intval($project['manager_id']) //客户经理id
                projuid:intval($project['designer_id']) //设计师id
                ticket:身份认证标示，在cookie里
                $plans['addr'] = '';
                $plans['title'] = '';
                $plans['province_id'] = 14;
                $plans['province'] = '广东';
                $plans['city_id'] = 130;
                $plans['city'] = '深圳';
                $plans['town_id'] = 1124;*/

                this.params.projuid = Cookie.get('t8t-tc-uid');  //验证身份通过（临时的）
                if( this.params.projuid == '' && this.params.prosuid == '' && this.params.prokuid == '' ){
                    return this.$msgbox({title:'',message:'未获取到项目的首席设计师或客户经理或设计师信息， 请检查派工单',type:'error'})
                }

                if(flag==1){

                    this.params.is_photo=1;  //3d效果图跳转tumax页面所需参数

                }else{
                    this.params.is_photo=0;
                }

                let url = 'http://flashapi.to8to.com/erp/tumaxapi?'
                this.params.uid = Cookie.get('t8t-tc-uid');
                this.params.ticket = Cookie.get('t8t-tc-ticket');
                this.params.yid = this.yid;
                this.params.cid = cid;
                let arr = [];
                for(let key in this.params){
                    arr.push(key + '=' + this.params[key]);
                }
                url += arr.join('&');
                let a = document.createElement('a')
                a.href = url
                a.target = '_blank'
                a.click()
            },
            showPicture(e){
                let url = e.target.parentNode.firstChild.src;
                this.dialogVisible = true;
                this.dialogImageUrl = url;
            },
            finish(){ // 已完成操作
                if(['sg','mz'].indexOf(this.type) == -1){
                    this.$message.error('操作有误！');
                    return;
                }
                this.$refs['toolbar'].unDisableBySymbol('FINISH');

                this.$confirm('请确认图纸已完成', '提交确认', {
                    type: 'warning',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(() => {
                    let args = {
                        statusUpdateDTO:{
                            photoesType: this.type == 'sg' ? 3 : 4,
                            projectId: +this.yid,
                            id: +this.photoesId,
                            updateUser: +Cookie.get('t8t-tc-uid'),
                            updateName: Cookie.get('t8t-tc-username'),
                            updateBy: Cookie.get('t8t-tc-username')
                        }
                    };
                    axios({
                        service: 'hMNCl9S9hJbGkcd4dsaHxWWo3cOZFd3', //  /biz/dsp-prs-pqm/app
                        method: 'vhkkrCb6nGs9nSH4o8I1W10-mVhA_Ze8bOK', // views.photoes.complete
                        args:args
                    }).then((result)=>{
                        //debugger
                        this.$TCS.addTag('red_6608_018003002002')
                        if(result.data.status === 200 && result.data.result > 0){
                            this.$msgbox({
                                title:'',
                                message: '保存成功！',
                                type:'success',
                                callback:()=>{
                                    this.photoesStatus = 2;
                                    this.symbolList=['RECALL']
                                    //重新获取图册信息
                                    this.photoes['startPic']=[]
                                    this.photoes['planePic']=[]
                                    this.photoes['ThreeDPic']=[]
                                    this.photoes['workPic']=[]
                                    this.photoes['woodPic']=[]
                                    this.getPhotoes(this.yid);
                                }
                            })
                        }else{
                            let message = typeof result.data.result == 'string' && result.data.result ? result.data.result : result.data.message;
                            this.$msgbox({
                                title:'',
                                message: message,
                                type:'error',
                                callback:()=>{
                                     this.$refs['toolbar'].unDisableBySymbol('FINISH');
                                }
                            })
                        }
                    }).catch((error)=>{
                        this.$msgbox({
                            title:'',
                            message:'请求出错！',
                            type:'error',
                            callback:()=>{
                                this.$refs['toolbar'].unDisableBySymbol('FINISH');
                            }
                        });
                    })
                })
            },
            recall(){ // 撤销操作
                if (['sg', 'mz'].indexOf(this.type) == -1) {
                    this.$message.error('操作有误！');
                    return;
                }
                this.$refs['toolbar'].unDisableBySymbol('RECALL');
                this.$confirm('请确认图纸撤销图册', '提交确认', {
                    type: 'warning',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(() => {
                    let args = {
                        dto: {
                            photoesType: this.type == 'sg' ? 3 : 4,
                            projectId: +this.yid,
                            id: +this.photoesId,
                            updateUser: +Cookie.get('t8t-tc-uid'),
                            updateName: Cookie.get('t8t-tc-username'),
                            updateBy: Cookie.get('t8t-tc-username')
                        }
                    };
                    axios({
                        service: 'hMNCl9S9hJbGkcd4dsaHxWWo3cOZFd3', //  /biz/dsp-prs-pqm/app
                        method: 'OSWF_ngrQI7Sg7yuE5hntmHVtRL2jY1OICD', // views.photoes.unComplete
                        args: args
                    }).then((result) => {
                        this.$TCS.addTag('red_14907_018003002003')
                        if (result.data.status === 200 && result.data.result > 0) {
                            this.$msgbox({
                                title: '',
                                message: '撤回成功！',
                                type: 'success',
                                callback: () => {
                                    this.photoesStatus = 1;
                                    this.symbolList = ['FINISH']
                                    //重新获取图册信息
                                    this.photoes['startPic'] = []
                                    this.photoes['planePic'] = []
                                    this.photoes['ThreeDPic'] = []
                                    this.photoes['workPic'] = []
                                    this.photoes['woodPic'] = []
                                    this.getPhotoes(this.yid);
                                }
                            })
                        } else {
                            let message = typeof result.data.result == 'string' && result.data.result ? result.data.result : result.data.message;
                            this.$msgbox({
                                title: '',
                                message: message,
                                type: 'error',
                                callback: () => {
                                    this.$refs['toolbar'].unDisableBySymbol('RECALL');
                                }
                            })
                        }
                    }).catch((error) => {
                        this.$msgbox({
                            title: '',
                            message: '请求出错！',
                            type: 'error',
                            callback: () => {
                                this.$refs['toolbar'].unDisableBySymbol('RECALL');
                            }
                        })
                    })
                })
            }
        },
        created(){
            let procInsId = this.$route.query.procInsId;
            if(procInsId){ //待办入口
                axios({
                    service: 'U9PB33VOXPYLiiTF2dZT2S8dJx6YaSJ', //  /biz/t8t-ps-psm/app
                    method: 'rxiwxJLCwTb9l1-Shd_28mzc5dlx5pWXEj7EiHvVzj-Z_52',// views.project.node.getByProcessId
                    args: {
                        processId: procInsId
                    }
                }).then((res) => {
                    if(res.data.status == 200){
                        let nodeId = res.data.result.id;
                        let projectId = res.data.result.projectId;
                        axios({
                            service: 'U9PB33VOXPYLiiTF2dZT2S8dJx6YaSJ', //  /biz/t8t-ps-psm/app
                            method: 'i9P1lfObo6A1nDMuRd6K0xyRI_uVfNsVNcimSS2nzq2', // project.nodeBill.createVerify
                            args:{
                                projectId: projectId,
                                nodeId: nodeId
                            }
                        }).then((result)=>{
                            if(result.data.status === 200 && result.data.result > 0){
                                this.yid = projectId;
                                this.getPhotoes(this.yid)
                                this.getProjectInfor(this.yid)
                                this.initProjectData();
                            }else{
                                this.$msgbox({
                                    title:'',
                                    message:result.data.error,
                                    type:'error',
                                    callback:()=>{
                                        this.isDialogShow = false;
                                        window.close();
                                    }
                                })
                            }
                        }).catch((error)=>{
                            this.$msgbox({
                                title:'',
                                message:'请求出错！',
                                type:'error',
                                callback:()=>{
                                    this.isDialogShow = false;
                                    window.close();
                                }
                            })
                        })
                    }else{
                        this.$msgbox({
                            title:'',
                            message:'获取项目信息失败，请刷新重试！',
                            type:'error',
                            callback:()=>{
                                this.isDialogShow = false;
                                window.close();
                            }
                        })
                    }
                }).catch((error)=>{
                    this.$msgbox({
                        title:'',
                        message:'请求出错！',
                        type:'error',
                        callback:()=>{
                            this.isDialogShow = false;
                            window.close();
                        }
                    })
                })
            }else{
                this.getPhotoes(this.yid)
                this.getProjectInfor(this.yid)
                this.initProjectData();
            }
        }
    }
</script>

<style lang="css" scoped>

    .table-frame{
        width: 550px;
        margin:0 auto;
        min-height: 800px;
        border: 1px solid #ccc;
    }
    .Drawing-start{
        width: 100%;
        height: 150px;
        margin-left: 20%;
        clear: both;

    }
    .Drawing-start .yuanshi{
        float: left;
        margin-right: 30px;
    }

    .Drawing-start ul li{
        list-style: none;
        list-style-type: none;
    }
    .Drawing-start h1{
        opacity: 0.7;
    }
    .Drawing-start img{
        width: 110px;
        height: 70px;
        cursor: pointer;
    }

    .Drawing-start p{

        opacity: 0.6;
        font-size: 16px;
    }
    .Drawing-start p span{

        color: blue;
        cursor: pointer;
    }

    .Drawing-start .Drawing-plane{
        width: 100%;
        margin-left: -40px;
    }

    .Drawing-start .Drawing-plane ul li{
        /*flex-direction: column;*/
        float: left;
        width: 150px;
    }
    .Drawing-start .Drawing-plane ul li p {

        width: 110px;
    }

    .Drawing-detail{
        width: 100%;
        height: 350px;
        margin-left: 18%;

    }

    .Drawing-detail p{
        opacity: 0.6;
        font-size: 14px;
    }

    .Drawing-detail div.start{

        width: 200px;
        height: 150px;
        cursor: pointer;
        float: left;
        margin-right: 30px;

    }
    .Drawing-detail div.start img{

        width: 200px;
        height: 150px;
        cursor: pointer;
    }

    .Drawing-detail div.start button{
        cursor: pointer;
        color: blue;
    }


    .t8t-full-dialog{

    }
    .text-center{
        text-align: center;
    }
    .bt{
        border-top: 2px solid #eff7fa;
        margin: 0
    }
    .pd {
        padding: 0 30px;
        display: flex;
        flex: 1;
        flex-direction: column;
    }
    .footer{
        display: flex;
        height: 50px;
        -ms-align-items: center;
        align-items: center;
    }
    .footer .left{
        font-size: 14px;
        margin-left: 10px;
    }
    .footer .right{
        font-size: 14px;
        margin-left: 1415px;
    }
</style>
<style>
    .t8t-full-dialog .el-dialog__header{
        padding: 0;
    }
    .t8t-full-dialog .el-dialog__body{
        padding: 0;
        height: 100%;
    }
    .t8t-full-dialog .t8t-full-dialog-container{
        height: 100%;
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
        margin-bottom: 10px;
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
        display: flex;
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
        border-top: 2px solid #eff7fa;
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
        overflow: auto;
    }
    .t8t-full-dialog .t8t-table .table-container {
        margin-left: 0;
    }

</style>
