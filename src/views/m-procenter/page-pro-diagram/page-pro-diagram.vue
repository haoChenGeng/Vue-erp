<template>
    <div class="page-pro-diagram" >
        <div class="g-main-container">
        <span @click="onClick($event,$index)" style="width:79% ;overflow:scroll" >
          <img id="nativeimage"  ></img>
        </span>
        <hr style="width:1px"></hr>
            <right-form  style="width:20%"
             :nodeId="nodeId"
             :nodeName="nodeName"
             :executableNamesStr="executableNamesStr"
             :createTime="createTime"
             :completeTime="completeTime"
                         :procName="procName"
         >
         </right-form>
        </div>
      </div>
  </template>

  <script>
      import Service from 'src/services/procenter/Service.js'
      import APICommon from 'src/services/procenter/proCenterApi.js'
      import Cookie from 'js-cookie'
      import RightForm from './right-form.vue'
      export default({
          name:'page-pro-diagram',
          components: {
              RightForm
          },
          data(){
              return{
                  //请求服务、接口配置
                  service: Service.PROCENTERDEPLOYLIST.name,
                  method: Service.PROCENTERDEPLOYLIST.methods.RETRIEVEPROCESSPICTURE,
                  args:{},//请求参数
                  data:'',
                  nodeId:'',
                  nodeName:'',
                  executableNamesStr:'',
                  createTime:'',
                  completeTime:'',
                  procName:''

              }
          },
          created(){
              this.args = {procInsId:this.$route.query.procInsId, procDefId: this.$route.query.procDefId}
          this.init()
          },
          methods:{
              init(){
                  this.getData();
              },
              getData(){
                  APICommon.retrieveProcessPicture(this.args).then((res) =>{
                      if (res.data.status === 200)
                      {
                          this.data= res.data.result
                          this.showImage()
                      }
                      else {
                          this.isLoading = false;
                          this.$message.error(res.data.message)
                      }
                  })
              },
              onClick(event){
                    event= event || window.event;
                    var target =event.target || event.srcElement,
                      style = target.currentStyle || window.getComputedStyle(target, null),
                      borderLeftWidth = parseInt(style['borderLeftWidth'], 10),
                      borderTopWidth = parseInt(style['borderTopWidth'], 10),
                      rect = target.getBoundingClientRect(),
                      offsetX = event.clientX - borderLeftWidth - rect.left,
                      offsetY = event.clientY - borderTopWidth - rect.top;
                  console.log("click")
                  console.log("坐标值："+offsetX+","+offsetY);

                  //拼接参数
                  let args = {x:offsetX,y:offsetY,procInsId:this.$route.query.procInsId}
                  APICommon.getActivityInfo(args).then((res) =>{
                      if (res.data.status === 200)
                      {//获取返回值
                         console.log(res.data.result);
                         this.nodeId=res.data.result.nodeId;
                         this.nodeName=res.data.result.nodeName;
                         this.executableNamesStr=res.data.result.executableNamesStr;
                         var createTime=res.data.result.createTime;
                         if(res.data.result.createTime !=null){
                             createTime= new Date(res.data.result.createTime).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
                         }
                          this.createTime=createTime;
                         var completeTime=res.data.result.completeTime;
                         if(res.data.result.completeTime!=null){
                             completeTime=new Date(res.data.result.completeTime).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
                         }
                         this.completeTime=completeTime;
                         console.log(this.nodeId);
                          console.log(this.nodeName);
                         // console.log(this.createTime);
                         // console.log(this.completeTime);
                          console.log(this.executableNamesStr);
                      }
                      else {
                          this.isLoading = false;
                          this.$message.error(res.data.message)
                      }
                  })
              },
              showImage(){
                  let data = this.data;
                 document.getElementById('nativeimage').src = 'data:image/png;base64,' + data;
              }
          }
      })
  </script>
  <style
      lang="css"
      scoped
  >
  </style>

