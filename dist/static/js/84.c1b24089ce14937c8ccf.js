webpackJsonp([84,269],{9:function(e,t,a){e.exports=a(7)(105)},11:function(e,t,a){e.exports=a(7)(68)},13:function(e,t,a){"use strict";function n(e,t){for(e=String(e),t=t||2;e.length<t;)e="0"+e;return e}Object.defineProperty(t,"__esModule",{value:!0});var r=function(e){return e&&e.__esModule?e:{default:e}}(a(9)),o=function(){var e=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|'[^']*'|'[^']*'/g,t=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,a=/[^-+\dA-Z]/g;return function(s,l,u,d){if(1!==arguments.length||"string"!==function(e){return null===e?"null":void 0===e?"undefined":"object"!==(void 0===e?"undefined":(0,r.default)(e))?void 0===e?"undefined":(0,r.default)(e):Array.isArray(e)?"array":{}.toString.call(e).slice(8,-1).toLowerCase()}(s)||/\d/.test(s)||(l=s,s=void 0),(s=s||new Date)instanceof Date||(s=new Date(s)),isNaN(s))throw TypeError("Invalid date");var i=(l=String(o.masks[l]||l||o.masks.default)).slice(0,4);"UTC:"!==i&&"GMT:"!==i||(l=l.slice(4),u=!0,"GMT:"===i&&(d=!0));var m=u?"getUTC":"get",c=s[m+"Date"](),p=s[m+"Day"](),f=s[m+"Month"](),g=s[m+"FullYear"](),h=s[m+"Hours"](),y=s[m+"Minutes"](),T=s[m+"Seconds"](),v=s[m+"Milliseconds"](),b=u?0:s.getTimezoneOffset(),I=function(e){var t=new Date(e.getFullYear(),e.getMonth(),e.getDate());t.setDate(t.getDate()-(t.getDay()+6)%7+3);var a=new Date(t.getFullYear(),0,4);a.setDate(a.getDate()-(a.getDay()+6)%7+3);var n=t.getTimezoneOffset()-a.getTimezoneOffset();t.setHours(t.getHours()-n);var r=(t-a)/6048e5;return 1+Math.floor(r)}(s),M=function(e){var t=e.getDay();return 0===t&&(t=7),t}(s),S={d:c,dd:n(c),ddd:o.i18n.dayNames[p],dddd:o.i18n.dayNames[p+7],m:f+1,mm:n(f+1),mmm:o.i18n.monthNames[f],mmmm:o.i18n.monthNames[f+12],yy:String(g).slice(2),yyyy:g,h:h%12||12,hh:n(h%12||12),H:h,HH:n(h),M:y,MM:n(y),s:T,ss:n(T),l:n(v,3),L:n(Math.round(v/10)),t:h<12?"a":"p",tt:h<12?"am":"pm",T:h<12?"A":"P",TT:h<12?"AM":"PM",Z:d?"GMT":u?"UTC":(String(s).match(t)||[""]).pop().replace(a,""),o:(b>0?"-":"+")+n(100*Math.floor(Math.abs(b)/60)+Math.abs(b)%60,4),S:["th","st","nd","rd"][c%10>3?0:(c%100-c%10!=10)*c%10],W:I,N:M};return l.replace(e,function(e){return e in S?S[e]:e.slice(1,e.length-1)})}}();o.masks={default:"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:sso",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",expiresHeaderFormat:"ddd, dd mmm yyyy HH:MM:ss Z"},o.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]},t.default=o},62:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.getTextById=function(e,t,a){var n=e.filter(function(e){return e.value===t});return n[0]?n[0].hasOwnProperty(a)?n[0][a]:n[0].hasOwnProperty("text")?n[0].text:n[0].hasOwnProperty("label")?n[0].label:void 0:""},t.M={create:"提交",update:"编辑",delete:"删除",void:"作废",valid:"反作废"},t.mb=function(e,t){return{title:"消息",type:t||"success",message:e,showCancelButton:!1,confirmButtonText:"知道了",confirmButtonClass:"is-plain"}}},85:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default={template:{name:"xn8QzCUzoAE7KPVqAowQmXMFkFO90Ky",methods:{searchTemplate:"CNXZAq_UTBYDp9COKIC-kQAnFIgOKmlWRPJXgJl",createTemplate:"c3zjwjJL9eWIAcInQqzybOqqDP4tWPwn2aoZph6",updateTemplate:"S8xZvRwVjfRS6iRKnapLHgkpbwZUg1xngMtiMIx",checkTemplate:"ibbqkvRhUQO2fRLXki402wOrWsTczmh7orisg4F",forbiddenTemplate:"XiZhTXnJofGHcYCVPJsz9lVx_fLFU6xYkqxTmRQHCPq",copyTemplate:"VggaUzBzkX9GYQtlt9Ka6pjTwGcXM2pOzmnE4n9"}},tempItem:{name:"xn8QzCUzoAE7KPVqAowQmXMFkFO90Ky",methods:{updateTempItem:"LnUSpgz6fZCYfe0kwIbZ0ceGFnUFChh",checkTempItem:"7QBLR5i4fMgzMI5wWk3zlMCSNBDidhv",searchTempItemList:"vLnojOoObKzDxJBqiWbhxcdaTWNpR8t",forbiddenTempItem:"ktovV_QnU-ehl9s6hgAr1TgpHqgqebVRPJ3",copyTempItem:"M1UAC6T5be52FLLhASJBidGRaN69tnc",tempRecordQuery:"DIdYCqAfWpr3qnB2uc6qgY76sWQKGruDy6l"}},supply:{name:"8m7ufp84fb2V0f5Z0e1LiSKvI9wfWGyPcR5O8IydTmjLcK9YcKE",methods:{queryGoodsForSetSku:"1yvDQ5-lGkBG40OpMk61e9oxDjiPVvn9iKjCyrD7Ol3nucH",queryEffectGoodsByCity:"8PoySH4qiMN2F8IS6OYE5bKs0p1MUxUSVpZxjap8w2y",queryEffectGoodsByCityAndSalePrice:"HSmeFx6Fz1ztAEC-cwOBT0gAzFkU74kMkhrP8LG8zKC05LJdss0BN-dynXo"}},schedule:{name:"PHZ4wJ5NChyZm_bdgBuKFocGUCzQOjT",methods:{module:"i7i7ssrGiIWkCwyuNS8vsJrQ8YIvxaAWIZ-xlYS",getInfoQuotaion:"7lBW1onPuYVQ_lUM1lmsvuWwSEqVC2jCWxXkS5rTOAkEgxyYP69",queryModuleAndModuleItemById:"Z0FlRV4xWyTqaV6Q3EVniJfCtY-F0_V5jcTdMPM2iLT1jESsRRTQkYAZ2w4ITO4"}}}},95:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(a(1)),o=n(a(100));t.default={create:function(e){return(0,r.default)({method:o.default.TEMPLATE.methods.CREATE,service:o.default.TEMPLATE.name,args:e})},update:function(e){return(0,r.default)({method:o.default.TEMPLATE.methods.UPDATE,service:o.default.TEMPLATE.name,args:e})},setModuleStatus:function(e){return(0,r.default)({method:o.default.TEMPLATE.methods.SETMODULESTATUS,service:o.default.TEMPLATE.name,args:e})},queryModuleQuotaionById:function(e){return(0,r.default)({method:o.default.TEMPLATE.methods.queryModuleQuotaionById,service:o.default.TEMPLATE.name,args:e})},moduleItemQueryPage:function(e){return(0,r.default)({method:o.default.TEMPLATE.methods.QUERY,service:o.default.TEMPLATE.name,args:e})},searchProductPackage:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],n={};return e.length&&(n.search=e),t.length&&(n.sort=t),a.length&&(n.fields=a),(0,r.default)({method:o.default.TEMPLATE.methods.queryModuleQuotaionById,service:o.default.TEMPLATE.name,args:n})}}},96:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){return e&&e.__esModule?e:{default:e}}(a(13)),r={datas:{mould_status:[{text:"待启用",value:0},{text:"审核中",value:1},{text:"已启用",value:2},{text:"已驳回",value:3}],temp_item_status:[{text:"待启用",value:0},{text:"审核中",value:1},{text:"已启用",value:2},{text:"已驳回",value:3}],dosage_mapping_status:[{text:"待配置",value:0},{text:"待启用",value:1},{text:"审核中",value:2},{text:"已启用",value:3}],item_price_status:[{text:"待启用",value:0},{text:"审核中",value:1},{text:"已启用",value:2},{text:"已驳回",value:3}],gd_mapping_status:[{text:"待启用",value:0},{text:"审核中",value:1},{text:"已启用",value:2},{text:"已驳回",value:3}],settle_type:[{text:"不参与结算",value:0},{text:"工长结算",value:1}],gd_mapping_forbidden_status:[{text:"否",value:0},{text:"是",value:1}],needSelectSel:[{text:"不需要",value:0},{text:"需要",value:1}],isBomSel:[{text:"否",value:0},{text:"是",value:1}]},columns:[{prop:"tempCode",label:"产品包模板编码"},{prop:"tempName",label:"产品包模板名称",width:200},{prop:"orgId",label:"组织",width:100,list:"organizes"},{prop:"pkgId",label:"产品包",list:"productPackages"},{prop:"updateTime",label:"修改时间"},{prop:"effectTime",label:"生效时间",formatter:function(e){return e?(0,n.default)(new Date(e).getTime(),"yyyy-mm-dd HH:MM"):"--"}},{prop:"freezeTime",label:"冻结时间",formatter:function(e){return e?(0,n.default)(new Date(e).getTime(),"yyyy-mm-dd HH:MM"):"--"}},{prop:"forbiddenTime",label:"禁用时间",formatter:function(e){return e?(0,n.default)(new Date(e).getTime(),"yyyy-mm-dd HH:MM"):"--"}},{prop:"tempStatus",label:"模板状态",list:"mould_status"}]};t.default=r},99:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(a(1)),o=n(a(107)),s=n(a(108));t.default={getRelationStoragesByAccountId:function(e){return(0,r.default)({method:o.default.STORAGES.methods.getRelationStoragesByAccountId,service:o.default.STORAGES.name,args:{accountId:e}})},getAllBranchCompany:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return this.getOrganizationByTypeCode(s.default.typeCode.branchCompany,e)},getAllBranchCompanyAndStore:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return this.getOrganizationByTypeCode([s.default.typeCode.branchCompany,s.default.typeCode.store],e)},getAllStore:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return this.getOrganizationByTypeCode(s.default.typeCode.store,e)},getOrganizationByTypeCode:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],a={};return a="string"==typeof e?{typeCode_eq:e}:{typeCode_in:e},t&&(a.isDel=0),this.searchOrganization(a)},getAllStoreByCompanyId:function(e){var t={};return e&&(t={parentId_eq:e,typeCode_eq:s.default.typeCode.store}),this.searchOrganization(t)},searchOrganization:function(e){return(0,r.default)({method:o.default.STORAGES.methods.organizationQuery,service:o.default.STORAGES.name,args:{search:e}})},findOrgById:function(e){return(0,r.default)({method:o.default.STORAGES.methods.findOrgById,service:o.default.STORAGES.name,args:{id:e}})}}},100:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default={TEMPLATE:{name:"xn8QzCUzoAE7KPVqAowQmXMFkFO90Ky",methods:{QUERY:"oC89kQlF3OnLilu76dP70tlyxv0ASFpeh-3wfhWvcQDwoHZ",CREATE:"3Hxw2EmJ6VXHimux2PkDK5iYElw4DZ0l74vTNkgmaah",UPDATE:"Bg2FMBVtN_pbDpl5KEBTYUo20P238It5pAN3qsbqvkQ",queryModuleQuotaionById:"NHGSRqrdMxo8kd8nvJTQztg536fL1MVsa6Y5L5s"}},PROPERTY:{name:"8m7ufp84fb2V0f5Z0e1LiSKvI9wfWGyPcR5O8IydTmjLcK9YcKE",methods:{propertyQueryPage:"xxyFxYonI0x3Fv7Po3D98lC_z76"}}}},107:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default={STORAGES:{name:"L29ayPpC3PMWdg8tnQJNjYmuSEjMDZB",methods:{getRelationStoragesByAccountId:"6qpYf6GYaQS4mIzrd5co3UM36bDW6ZEJrX7U0iPIc1hxXfiz3DN",organizationQuery:"a-GBd1krF7w0DBvjMsd4F0orXdF",findOrgById:"n1EjEy1fY2s_QBnicLnD5DoAup7FqQi3fyx"}},INVORGS:{name:"XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI",methods:{orgQueryPage:"9C7rcd65dU6JnNd4kGqUpR_6QCAqFOtANDv9BpD85kG8d1j",orgQuery:"ObB7LfrK0M3VLALaE6xboHiffuTm4lgbkAxRdd0QS0F",storageQuery:"isWQivU5v8S4WStoLiUSpvTu31ya5h.swBH",goodsRecordList:"7EesjOInTJa7X_HMS-V-UCZCYNloSCuZjp6GdscyzGhQt1y",storageBinQuery:"99rdBMsbQptsCPGZfPbDEAo8qQJfjOG7dIcEgJ0",statusQuery:"hcULftT8j8fAoEUOShvgp8iNO30wd6yjmHd"}}}},108:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default={typeCode:{mainCompany:"001003001",company:"001003002",factory:"001003003",bu:"001003004",region:"001003005",branchCompany:"001003006",agency:"001003007",section:"001003008",storage:"001003009",store:"001003010",group:"001003011",others:"001003012",gallery:"001003014"}}},156:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(a(11)),o=n(a(1)),s=n(a(85));t.default={getTempInfoById:function(e){return(0,o.default)({method:s.default.template.methods.searchTemplate,service:s.default.template.name,args:{productPkgTemp:{tempId:e}}})},getTempInfoByCode:function(e){return(0,o.default)({method:s.default.template.methods.searchTemplate,service:s.default.template.name,args:{productPkgTemp:{tempCode:e}}})},getTempInfoByIds:function(e){return(0,o.default)({method:s.default.template.methods.searchTemplate,service:s.default.template.name,args:{productPkgTemp:{tempIds:e}}})},createTemp:function(e){return(0,o.default)({method:s.default.template.methods.createTemplate,service:s.default.template.name,args:{productPkgTemp:e}})},updateTemp:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],n=(0,r.default)({},e);return n.createTempItems=t,n.updateTempItems=a,(0,o.default)({method:s.default.template.methods.updateTemplate,service:s.default.template.name,args:{productPkgTemp:n}})},checkTemp:function(e,t,a){return(0,o.default)({method:s.default.template.methods.checkTemplate,service:s.default.template.name,args:{productPkgTemp:{id:e,updateUser:t,effectTime:a}}})},disableTemp:function(e,t){return(0,o.default)({method:s.default.template.methods.forbiddenTemplate,service:s.default.template.name,args:{productPkgTemp:{tempIds:e,updateUser:t}}})},copyTemp:function(e,t){return(0,o.default)({method:s.default.template.methods.copyTemplate,service:s.default.template.name,args:{id:e,createUser:t}})},checkTempItem:function(e,t,a){return(0,o.default)({method:s.default.tempItem.methods.checkTempItem,service:s.default.tempItem.name,args:{tempItem:{ids:e,tempItemStatus:t,updateUser:a}}})},forbiddenTempItems:function(e,t){return(0,o.default)({method:s.default.tempItem.methods.forbiddenTempItem,service:s.default.tempItem.name,args:{tempItem:{ids:e,updateUser:t}}})},copyTempItem:function(e,t){return(0,o.default)({method:s.default.tempItem.methods.copyTempItem,service:s.default.tempItem.name,args:{id:e,createUser:t}})},updateTempItem:function(e){return(0,o.default)({method:s.default.tempItem.methods.updateTempItem,service:s.default.tempItem.name,args:{tempItem:e}})},getTempItemsByTempId:function(e){return(0,o.default)({method:s.default.tempItem.methods.searchTempItemList,service:s.default.tempItem.name,args:{tempItem:{tempId:e}}})},getTempItemsByTempCode:function(e){return(0,o.default)({method:s.default.tempItem.methods.searchTempItemList,service:s.default.tempItem.name,args:{tempItem:{tempCode:e}}})},getInfoQuotaion:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;arguments.length>3&&void 0!==arguments[3]&&arguments[3],arguments.length>4&&void 0!==arguments[4]&&arguments[4],arguments.length>5&&void 0!==arguments[5]&&arguments[5];return(0,o.default)({method:s.default.schedule.methods.getInfoQuotaion,service:s.default.schedule.name,args:{moduleId:e,size:t,page:a}})},queryModuleAndModuleItemById:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;arguments.length>3&&void 0!==arguments[3]&&arguments[3];return(0,o.default)({method:s.default.schedule.methods.queryModuleAndModuleItemById,service:s.default.schedule.name,args:{moduleId:e,size:t,page:a}})}}},779:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(a(11)),o=n(a(21)),s=a(62),l=(n(a(1)),n(a(6))),u=(n(a(99)),n(a(95)),n(a(156))),d=n(a(85));n(a(96));t.default={props:["tempCode","organizes","productPackages"],name:"addTemp",components:{},data:function(){return{searchScheduleModuleDialog:{title:"查询排期模板",size:"large",searchForm:{fields:[{type:"input",label:"模板名",name:"name_like"}],resetBtnVisible:!1,showToggleBtn:!1},table:{columns:[{prop:"name",label:"模板名"}],radioCol:!0,service:d.default.schedule.name,method:d.default.schedule.methods.module,args:{}},onConfirm:function(e){}},userId:+l.default.get("t8t-tc-uid"),dialogVisible:!0,commonData:{organizes:this.organizes,productPackages:this.productPackages},formData:{tempName:"",orgId:null,pkgId:"",createUser:+l.default.get("t8t-tc-uid"),scheduleModuleId:1},rules:{tempName:[{type:"string",required:!0,message:"请正确填写产品包模板名称",trigger:"change"},{type:"string",min:1,max:20,message:"产品包模板名称最多50个字符",trigger:"change"}],orgId:[{type:"number",required:!0,message:"请选择组织",trigger:"change"}],pkgId:[{type:"number",required:!0,message:"请选择产品包",trigger:"change"}],scheduleModuleId:[{required:!0,message:"请选择排期模板"}]},formCommonData:{storageIds:[]},selectSource:{},currentRowData:{},dataSource:{},fields:[{prop:"tempName",label:"产品包模板名称",type:"input",rules:[{required:!0,message:"不能为空"}]},{prop:"orgId",label:"组织",type:"select",list:"organizes",rules:[{required:!0,message:"不能为空"}]},{prop:"pkgId ",label:"产品包",type:"select",list:"productPackages",rules:[{required:!0,message:"不能为空"}]}],canSubmit:!0}},created:function(){},methods:{submitSearchDialog:function(e){},closeDialog:function(){this.$emit("close")},handleCellClick:function(e,t){this.currentRowData=JSON.parse((0,o.default)(e))},submit:function(){var e=this;this.$refs.addTemplateForm.validate(function(t){if(!t)return!1;e.canSubmit=!1;var a=(0,r.default)({},e.formData);u.default.createTemp(a).then(function(t){if(200===t.data.status){var a=t.data.result;e.$router.push({path:"/worker/quote-packtemp-view",query:{tempCode:a}})}else e.canSubmit=!0,e.$msgbox((0,s.mb)(t.data.message,"error"))})})},cancel:function(){this.dialogVisible=!1}}}},781:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(a(11)),o=(n(a(13)),n(a(6))),s=n(a(99)),l=n(a(95)),u=n(a(156)),d=n(a(85)),i=n(a(2222)),m=n(a(96));t.default={name:"packtempindex",components:{addTemplateDialog:i.default},created:function(){var e=this;s.default.getAllStore().then(function(t){var a=[];200===t.data.status&&(t.data.result.rows.forEach(function(e){a.push({value:e.id,text:e.name})}),e.selectSource.organizes=a,e.commonData.organizes=a)}),s.default.getAllStore(!0).then(function(t){var a=[];200===t.data.status&&t.data.result.rows.forEach(function(t){a.push({value:t.id,text:t.name}),e.selectSource.organizesInUse=a})}),l.default.searchProductPackage().then(function(t){var a=[];200===t.data.status&&(t.data.result.forEach(function(e){a.push({value:e.id,text:e.pkgName})}),e.selectSource.productPackages=a,e.commonData.productPackages=a)})},methods:{floorDateFromStr:function(e){return this.isEmpty(e)?e:Math.floor(new Date(e).getTime()/1e3)},onDisable:function(){var e=this,t=this.$refs.t8ttable.getSelectRows();if(t.length<1)return this.$message({type:"warning",message:"请选择需要禁用的报价模板"}),!1;var a=[];for(var n in t){if(!this.isCanRowForbidden(t[n]))return this.$message({type:"warning",message:"不可禁用当前模板，请调整启用时间或冻结时间，须满足启用时间早于等于冻结时间，冻结时间早于等于禁用时间的条件。"}),!1;a.push(t[n].id)}u.default.disableTemp(a,this.accountId).then(function(t){200===t.data.status?(e.$message({type:"success",message:"操作成功"}),e.$refs.t8ttable.reloadTable()):e.$message({type:"error",message:t.data.result})})},onCopy:function(){var e=this,t=this.$refs.t8ttable.getSelectRows();if(t.length<1)return this.$message({type:"warning",message:"请选择需要复制的报价模板"}),!1;if(t.length>1)return this.$message({type:"warning",message:"仅可选择一个模板并进行复制，请将多余模板的选中项取消"}),!1;var a=t[0].id;u.default.copyTemp(a,this.accountId).then(function(t){200===t.data.status?(e.$message({type:"success",message:"复制成功"}),e.$refs.t8ttable.reloadTable()):e.$message({type:"error",message:t.data.result})})},onPreview:function(){return this.$message({type:"warning",message:"功能开发中 o(╯□╰)o"})},onVersion:function(){return this.$message({type:"warning",message:"功能开发中 o(╯□╰)o"})},onAdd:function(){this.dialogVisible=!0},onEdit:function(){var e=this.$refs.t8ttable.getSelectRows();if(e.length<1)return this.$message({type:"warning",message:"请选择需要修改的报价模板"}),!1;if(e.length>1)return this.$message({type:"warning",message:"仅可选择一个模板并进行修改，请将多余模板的选中项取消"}),!1;var t=e[0];if(!this.isRowCanEdit(t))return this.$message({type:"warning",message:"当前状态不可修改"}),!1;this.$router.push({path:"quote-packtemp-view",query:{tempCode:t.tempCode}})},onCheck:function(){var e=this,t=this.$refs.t8ttable,a=t.getSelectRows();if(a.length<1)return this.$message({type:"warning",message:"请选择需要提交的报价模板"}),!1;if(a.length>1)return this.$message({type:"warning",message:"一次只能提交一个模板"}),!1;var n=a[0];if(!this.isRowCanCheck(n))return this.$message({type:"warning",message:"仅可将状态为“待启用”的报价模板提交"}),!1;this.isEmpty(n.effectTime)?this.$confirm("当前模板未填写生效时间，提交审核通过后，该模板将自动生效，是否继续","提示",{type:"warning",confirmButtonText:"继续",cancelButtonText:"取消"}).then(function(){u.default.checkTemp(n.id,e.accountId,n.effectTime?e.floorDateFromStr(n.effectTime):null).then(function(a){200==a.data.status?(e.$message({type:"success",message:"提交成功"}),t.reloadTable()):e.$message({type:"error",message:a.data.result||"出错：服务错误"})})}).catch(function(){}):u.default.checkTemp(n.id,this.accountId,n.effectTime?this.floorDateFromStr(n.effectTime):null).then(function(a){200==a.data.status?(e.$message({type:"success",message:"提交成功"}),t.reloadTable()):e.$message({type:"error",message:a.data.result||"出错：服务错误"})})},isRowCanCheck:function(e){return 0==e.tempStatus},isRowCanEdit:function(e){return!0},isCanRowForbidden:function(e){return!0},closeAddTempDialog:function(){this.dialogVisible=!1},submitSearch:function(e){var t=(0,r.default)({},e),a=(0,r.default)({},this.args);a.productPkgTemp=t,this.args=a},isEmpty:function(e){return null==e||0==e||""==e||void 0==e}},data:function(){return{breadcrumbData:[{title:"工模售前"},{title:"配置管理"},{title:"产品包模板"}],mainTableService:d.default.template.name,mainTableMethod:d.default.template.methods.searchTemplate,mainTableColumns:m.default.columns,accountId:+o.default.get("t8t-tc-uid"),args:{productPkgTemp:null},commonData:{organizes:[],organizesInUse:[],mould_status:m.default.datas.mould_status,productPackages:[]},searchFileds:[{type:"select",name:"orgId",label:"组织",selectSourceKey:"organizes"},{type:"select",name:"pkgId",label:"产品包",selectSourceKey:"productPackages"},{type:"select",name:"tempStatus",label:"模板状态",selectSourceKey:"mould_status"},{type:"input",name:"tempCode",label:"产品包模板编码"},{type:"input",name:"tempName",label:"产品包模板名称"},{type:"datetime",name:"effectTimeStime",label:"生效时间起"},{type:"datetime",name:"effectTimeEtime",label:"生效时间至"},{type:"datetime",name:"freezeTimeStime",label:"冻结时间起"},{type:"datetime",name:"freezeTimeEtime",label:"冻结时间至"},{type:"datetime",name:"forbiddenTimeStime",label:"禁用时间起"},{type:"datetime",name:"forbiddenTimeEtime",label:"禁用时间至"},{type:"datetime",name:"updateTimeStime",label:"修改时间起"},{type:"datetime",name:"updateTimeEtime",label:"修改时间至"}],selectSource:{organizes:[],organizesInUse:[],mould_status:m.default.datas.mould_status,productPackages:[]},dialogVisible:!1}}}},1320:function(e,t,a){(e.exports=a(2)()).push([e.id,"\n.el-select-dropdown__wrap {\n    max-height: 185px !important;\n}\n.my-el-dialog .el-form-item__content {\n    width: 180px;\n}\n.my-el-dialog .el-select {\n    width: 100%;\n}\n",""])},1321:function(e,t,a){(e.exports=a(2)()).push([e.id,"\n.g-main-container-column[data-v-c3f8120e]{\n    min-height: 300px;\n}\n.my-el-dialog .el-dialog[data-v-c3f8120e]{width:1200px  !important;\n}\n\n",""])},1766:function(e,t,a){var n=a(1320);"string"==typeof n&&(n=[[e.id,n,""]]);a(3)(n,{});n.locals&&(e.exports=n.locals)},1767:function(e,t,a){var n=a(1321);"string"==typeof n&&(n=[[e.id,n,""]]);a(3)(n,{});n.locals&&(e.exports=n.locals)},2222:function(e,t,a){a(1767),a(1766);var n=a(4)(a(779),a(2557),"data-v-c3f8120e",null);e.exports=n.exports},2224:function(e,t,a){var n=a(4)(a(781),a(2267),null,null);e.exports=n.exports},2267:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"packtempindex"},[a("t8t-breadcrumb",{attrs:{data:e.breadcrumbData}}),e._v(" "),a("t8t-search",{attrs:{fields:e.searchFileds,selectSource:e.selectSource},on:{submit:e.submitSearch}}),e._v(" "),a("div",{staticClass:"g-main-container-column"},[a("t8t-toolbar",{on:{ADD:e.onAdd,EDIT:e.onEdit,"EDIT-SUBMIT":e.onCheck,DISABLE:e.onDisable,COPY:e.onCopy,PREVIEW:e.onPreview,VERSON:e.onVersion}}),e._v(" "),a("t8t-table",{ref:"t8ttable",attrs:{columns:e.mainTableColumns,service:e.mainTableService,method:e.mainTableMethod,commonData:e.commonData,args:e.args,indexCol:!0,pageBar:!0},scopedSlots:e._u([["tempName",function(t){return[a("a",{staticStyle:{"text-decoration":"none"},attrs:{href:"#/worker/quote-packtemp-view?tempCode="+t.row.tempCode}},[e._v(e._s(t.row.tempName))])]}]])})],1),e._v(" "),e.dialogVisible?a("addTemplateDialog",{attrs:{organizes:e.selectSource.organizesInUse,productPackages:e.selectSource.productPackages},on:{close:e.closeAddTempDialog,open:function(t){e.dialogVisible=!0}}}):e._e()],1)},staticRenderFns:[]}},2557:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-dialog",{staticClass:"g-w-460 my-el-dialog",attrs:{title:"新建产品包模板"},on:{close:e.closeDialog},model:{value:e.dialogVisible,callback:function(t){e.dialogVisible=t}}},[a("el-form",{ref:"addTemplateForm",attrs:{model:e.formData,"label-position":e.left,"label-width":"150px",rules:e.rules}},[a("el-form-item",{attrs:{label:"产品包模板名称：",prop:"tempName",size:e.small}},[a("el-input",{attrs:{size:e.small},model:{value:e.formData.tempName,callback:function(t){e.formData.tempName=t}}})],1),e._v(" "),a("el-form-item",{attrs:{label:"组织：",prop:"orgId"}},[a("el-select",{attrs:{placeholder:"--请选择--"},model:{value:e.formData.orgId,callback:function(t){e.formData.orgId=t}}},e._l(e.commonData.organizes,function(e){return a("el-option",{attrs:{label:e.text,value:e.value}})}))],1),e._v(" "),a("el-form-item",{attrs:{label:"产品包：",prop:"pkgId"}},[a("el-select",{attrs:{placeholder:"--请选择--"},model:{value:e.formData.pkgId,callback:function(t){e.formData.pkgId=t}}},e._l(e.commonData.productPackages,function(e){return a("el-option",{attrs:{label:e.text,value:e.value}})}))],1)],1),e._v(" "),a("div",{slot:"footer"},[a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:24}},[a("div",{staticClass:"grid-content"},[a("el-button",{attrs:{size:"small",type:"primary",disabled:!e.canSubmit},on:{click:function(t){e.submit()}}},[e._v("下一步")]),e._v(" "),a("el-button",{attrs:{size:"small"},on:{click:function(t){e.cancel()}}},[e._v("取消")])],1)])],1)],1)],1)],1)},staticRenderFns:[]}}});