<template>
    <div class="right-content-w" v-if="showB">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

        <div class="workbench-content">
            <div class="workbench" v-show="showWorkBench" :style="workbenchHeight">
                <div class="workbench-panel">
                    <div class="workbench-title">
                        <div class="workbench-subscribe">
                            <h3 class="workbench-panel-top-title" unselectable="on" onselectstart="return false;">我的订阅</h3>
                        </div>
                        <div class="workbench-more" unselectable="on" onselectstart="return false;" style="-moz-user-select:none;">
                            <p>
                                <!--<a title="数据中心入口" href="javascript:;">更多 &gt;&gt;</a>-->
                            </p>
                        </div>
                    </div>

                    <div class="workbench-body" ref="workbench">
                        <div class="workbench-carousel">
                            <el-carousel :indicatorPosition="'none'" :interval="8000" arrow="always" @change="changeChartIndex" :height="carouselHeight">
                                <template v-for="(chart, index) in switchCharts">
                                    <el-carousel-item>
                                        <div :style="chartWidthHeight">
                                            <To8toChart v-if="index===currentChartId||index===currentChartId-1||index===currentChartId+1" class="chart-picture" :data-link="chart.url" :option="chart.option" :loading="chart.loading" :resizable="true" :style="chartWidthHeight" ref="chartref"></To8toChart>
                                        </div>
                                    </el-carousel-item>
                                </template>
                            </el-carousel>
                        </div>
                    </div>
                </div>
            </div>

            <div class="user-space">
                <div class="workbench-panel">
                    <div class="workbench-title">
                        <div class="workbench-subscribe">
                            <div class="user-task-lists">
                                <template v-for="(task, $index) in taskLists">
                                    <div class="user-task" unselectable="on" onselectstart="return false;"
                                         :class="{'active': task.active}"
                                         @click="changeTabPage(task, $index)">
                                        {{task.name}}（{{task.count}}）
                                    </div>
                                    <div class="user-interval">|</div>
                                </template>
                            </div>
                        </div>
                        <div class="workbench-more" unselectable="on" onselectstart="return false;">
                            <p>
                                <a :href="linkToTask" v-if="linkToTask" target="_blank">更多 &gt;&gt;</a>
                            </p>
                        </div>
                    </div>
                    <div class="workbench-body">
                        <div v-for="task in listTask" >
                            <template v-if="active=='0'">
                                <p><span>您有 </span><a :href="urlBuilder(task.formKey,{procInsId:task.procInsId,taskId:task.taskId})" @click="clickHref" target="_blank">{{task.procName}}
                                    <template v-if="task.businessData || task.businessKey">
                                        (
                                        <template v-if="task.businessData">{{task.businessData}}, </template>
                                        <template v-if="task.businessKey">编号:{{task.businessKey}}</template>
                                        )
                                    </template>
                                </a><span> 需要处理,当前环节为{{task.nodeName}}，任务生成时间为：{{task.createTime | toDate}}.</span></p>
                            </template>

                            <template v-else-if="active=='1'">
                                 <p><span>您审批过的 </span>
                                     <a :href="urlBuilder('http://www.to8to.com/my/ProCenter/promanage/getApprovalProcess',{procInsId:task.procInsId,procDefId:task.procDefId})" target="_blank">{{task.procName}}
                                      <template v-if="task.businessKey">
                                         (编号:{{task.businessKey}})
                                       </template>
                                      </a>
                                      <span @mouseover="toggleShow(task.taskId)" @mouseout="toggleShow(task.taskId)" > ，当前环节为{{task.nowNode}}，（处理人：{{displayShortUserName(task.executableNames)}}）.
                                              <span v-show="task.taskId==node  & isShow" v-if="task.executableNames.length > 3" style="background-color:#f8f8f8 ; padding:5px" >{{displayAllUserName(task.executableNames)}}</span>
                                     </span>
                                </p>
                            </template>

                            <template v-else-if="active=='2'">
                                <p><span>您发起的 </span>
                                    <a :href="urlBuilder('http://www.to8to.com/my/ProCenter/promanage/getApprovalProcess',{procInsId:task.procInsId,procDefId:task.procDefId})" target="_blank">{{task.procName}}
                                        <template v-if="task.markKey">
                                        (编号:{{task.markKey}})
                                        </template>
                                        <template v-else-if="task.businessKey">
                                            (编号:{{task.businessKey}})
                                        </template>
                                    </a>
                                    <span @mouseover="toggleShow(task.taskId)" @mouseout="toggleShow(task.taskId)"> ，当前环节为{{task.nodeName}}，（处理人：{{displayShortUserName(task.candidateName)}}）.
                                             <span v-show="task.taskId==node  & isShow" v-if="task.candidateName.length > 3" style="background-color:#f8f8f8 ; padding:5px" >{{displayAllUserName(task.candidateName)}}</span>
                                      <!----->
                                    </span>
                                </p>
                            </template>
                            <template v-else-if="active=='3'">
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style type="text/css" scoped>
    div{
        -moz-user-select: none;
        -khtml-user-select: none;
        user-select: none;
    }
    .workbench-carousel .el-carousel__item{
        display: flex;
        justify-content: center;
    }
    .chart-picture{
        width: calc(100% - 120);
        height: 100%;
    }
    h3, p{
        margin: 0;
        font-weight: normal;
        font-family: 'Microsoft YaHei', 微软雅黑, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    .right-content-w{
        display: flex;
        flex-direction: column;
    }
    .workbench-content{
        width: calc(100% - 50px);
        height: calc(100% - 92px);
        min-height: 140px;
        min-width: 1101px;
        margin: 25px;
        flex: 1;
        display: flex;
        flex-flow: column;
    }
    .workbench{
        margin-bottom: 25px;
        position: relative;
    }
    .user-space{
        border: 1px solid #ddd;
        flex: 1;
        display: flex;
        min-height:120px;
        flex-direction: column;
    }
    .workbench .workbench-panel{
        border: 1px solid #ddd;
        height: calc(100% - 4px);
    }
    .workbench .workbench-panel .workbench-title{
        display: flex;
        position: relative;
        background-color: #fafafa;
        line-height: 45px;
        border-bottom: 1px solid #ddd;
    }
    .workbench .workbench-panel .workbench-title .workbench-more{
        width: 100px;
        line-height: 45px;
        text-align: center;
    }
    .workbench .workbench-panel .workbench-title .workbench-more p a,
    .user-space .workbench-panel .workbench-title .workbench-more p a{
        text-decoration: none;
        color: #888;
        font-size: 12px;
    }
    .workbench .workbench-panel .workbench-title .workbench-more p a:hover,
    .user-space .workbench-panel .workbench-title .workbench-more p a:hover{
        color: deepskyblue;
    }
    .workbench .workbench-panel .workbench-title .workbench-subscribe,
    .user-space .workbench-panel .workbench-title .workbench-subscribe{
        flex: 1;
    }
    .workbench .workbench-panel .workbench-title .workbench-subscribe .workbench-panel-top-title{
        padding-left: 15px;
        font-size: 14px;
    }
    .user-space .workbench-panel{
        display: flex;
        flex-direction: column;
    }
    .user-space .workbench-panel .workbench-title{
        display: flex;
        position: relative;
        background-color: #fafafa;
        line-height: 52px;
        height: 52px;
        min-height: 52px;
        border-bottom: 1px solid #ddd;
    }
    .user-space .workbench-panel .workbench-title .workbench-more{
        width: 100px;
        line-height: 52px;
        height: 52px;
        text-align: center;
    }
    .user-task-lists{
        display: flex;
    }
    .user-task-lists .user-task{
        font-size: 14px;
        padding: 0 15px;
        flex: row;
    }
    .user-task-lists .user-interval{
        flex: row;
        font-size: 14px;
        padding: 0;
    }
    .user-task-lists .user-interval:last-child{
        display: none;
    }
    .user-task-lists .user-task.active, .user-task-lists .user-task:hover{
        color: #338bed;
        border-bottom: 1px solid #338bed;
        cursor: pointer;
    }
    .user-space .workbench-panel .workbench-body{
        padding: 20px;
        overflow: auto;
        flex: 1;
        display: block;
    }
    .user-space .workbench-panel .workbench-body div p a{
        text-decoration: none;
        color: #428bca;
    }
    .user-space .workbench-panel .workbench-body div p{
        line-height: 26px;
        font-size: 14px;
    }
    .user-space-detail{
        padding: 5px;
        width: 100%;
        min-height: 100%;
        background-color: yellowgreen;
    }
    .chart-parent{
        width: calc(100% - 120px);
        height: 100%;
        position: relative;
        display: flex;
    }
    .vue-echarts{
        position: relative;
    }
    .el-carousel__item h3 {
        color: #475669;
        font-size: 18px;
        opacity: 0.75;
        margin: 0;
    }
    .el-carousel__item:nth-child(2n) {
        background-color: #ffffff;
    }
    .el-carousel__item:nth-child(2n+1) {
        background-color: rgba(211, 220, 230, 0.49);
    }
</style>

<script>
    import To8toChart from 'vue-echarts-v3'
    import WorkBench from 'src/services/workbench/workBench.js'
    import chartTransfer from 'src/services/workbench/chartTransfer.js'
    import Cookie from 'js-cookie'
    import AxiosSrc from 'axios'
import {
        debounce
    } from 'lodash'
    var sit
    var lookup
    export default{
        data(){
            return {
showB: false,
                carouselHeight: parseInt((document.body.clientHeight - 102) * this.chartRatio) + 'px',
                chartRatio: 0.3,
                chartWidthHeight: {
                    "width": "100%",
                    "height": "100%"
                },
                timeIsRunning: false,
                //设置刷新频率
                timeSet: 10*1000,
                //时间阈值
                timeMax: 1*60*1000,
                //刷新的次数
                timeCount: 0,
                currentChartId: 0,
                switchCharts: [],
                chartsMaxNumber: 80,
                chartsFinish: 0,
                chartsCatchTimes: 0,
                breadcrumbData: [{title: '首页'}],
                showWorkBench: false,
                firstPage: true,
                linkToTask: 'javascript:;',
                listTask: [],
                active: 1,
                isShow: false,
                node:'',
                taskLists:[
                    {
                        name: '待审批的',
                        count: 0,
                        active: true,
                        show: true,
                        link: '/#/tuchat-procenter/page-pro-del',
                        lists: []
                    },
                    {
                        name: '已审批的',
                        count: 0,
                        active: false,
                        show: true,
                        link: '/#/tuchat-procenter/page-pro-already',
                        lists: []
                    },
                    {
                        name: '我发起的',
                        count: 0,
                        active: false,
                        show: true,
                        link: '/#/tuchat-procenter/page-pro-starter',
                        lists: []
                    },
                    {
                        name: '待办任务',
                        count: 0,
                        active: false,
                        show: false,
                        //link: '/index.php/Flow/flow/deal',
                        link: '',
                        lists: []
                    }]
                }
            },
            computed: {
                showWorkBench: function() {
                    return this.switchCharts.length != 0;
                }
            },
            mounted() {
                this.$nextTick(_=>{
                    // 表格延迟渲染
                    setTimeout(() => {
                        this.showB = true;
                    }, 0);
                    setTimeout(()=>{
                        this.getChartStyle();
                        this.initChart();
                        this.initToDoTask();
                        this.initDoingTask();
                        this.initStarterTask();
                        this.initWaring();
                        window.addEventListener('resize', this.reflushChart, false)
                    }, 500)
                })
            },
            beforeDestroy() {
                window.removeEventListener('resize', this.reflushChart)
                clearInterval(sit)
                clearInterval(lookup)
            },
            created() {
                this.autoRation();
                this.changeCarouselHeight();
                this.changeWorkbenchHeight();
            },
            methods: {
                toggleShow(nowNode){
                    this.isShow = !this.isShow ;
                    this.node=nowNode;
                },
                reloadData() {
                    this.initToDoTask();
                    this.initDoingTask();
                    this.initStarterTask();
                },
                //点击待办，开始循环读取数据
                clickHref() {
                    let that = this
                    if (!that.timeIsRunning) {
                        that.timeIsRunning = true
                            //每Ns获取一次数据
                        sit = setInterval(() => {
                            that.timeCount += that.timeSet
                            if (that.timeCount > that.timeMax) {
                                clearInterval(sit)
                                that.timeCount = 0
                                that.timeIsRunning = false
                            }
                            that.reloadData();
                        }, that.timeSet)
                    }
                },

            autoRation(){
                if(document.body.clientHeight >= 900){
                    this.chartRatio = 0.35;
                } else {
                    this.chartRatio = 0.4;
                }
            },
            changeCarouselHeight(){
                this.carouselHeight = parseInt((document.body.clientHeight - 102) * this.chartRatio) + 'px';
            },
            changeWorkbenchHeight(){
                let height = parseInt((document.body.clientHeight - 102) * this.chartRatio) + 50 + 'px';
                this.workbenchHeight = {
                    "height": height,
                    "line-height": height
                };
            },
            changeChartIndex(index){
                this.currentChartId = index;
            },
            getChartStyle() {
                const element = document.getElementsByClassName('el-carousel__container')[0];
                let width = window.getComputedStyle(element).width;
                let height = parseInt((document.body.clientHeight - 102) * this.chartRatio) + 'px';
                this.chartWidthHeight = {
                    width: width,
                    height: height
                }
            },
            reflushChart(){
                this.autoRation();
                this.changeCarouselHeight();
                this.changeWorkbenchHeight();
                let currentId = this.currentChartId;
                this.refreshChart(currentId);
                this.refreshCurrentChart(currentId);
            },
            refreshChart: debounce(
                    function(currentId){
                        let compent = this.$refs.chartref;
                        compent && compent.forEach(function (e, i) {
                            if(i != currentId){
                                e.resize();
                            }
                        })
                    }, 500),
                refreshCurrentChart: debounce(
                    function(currentId) {
                        this.$refs.chartref && this.$refs.chartref[currentId] && this.$refs.chartref[currentId].resize && this.$refs.chartref[currentId].resize();
                    }, 100),
                changeTabPage(task, index) {
                    this.taskLists.forEach(function(task) {
                        task.active = false;
                    });
                    task.active = true;
                    this.linkToTask = task.link;
                    this.listTask = task.lists;
                    this.active = index;
                },
                initChart() {
                    let that = this;
                    let args = {
                        "fatherUrl": "#/tuchat-index/",
                        "accountID": Cookie.get('t8t-tc-uid')
                    };
                    WorkBench.queryWorkBenchByFatherUrl(args)
                        .then(function(response) {
                            if (response.status == 200) {
                                let result = response.data.result;
                                if (!result) {
                                    return;
                                }
                                that.switchCharts = [];
                                for (let i = 0; i < result.length; i++) {
                                    if (that.chartsMaxNumber <= that.switchCharts.length) {
                                        console.log('out of max chart count: ', that.chartsMaxNumber, 'total length: ', result.length);
                                        break;
                                    }
                                    let url = result[i]['url'];
                                    let obj = {
                                        url: url,
                                        loading: true,
                                        ready: false,
                                        option: {
                                            series: []
                                        }
                                    };
                                    that.switchCharts.push(obj);
                                }
                                if (that.switchCharts.length > 0) {
                                    that.obtainChartConfigure();
                                    that.showWorkBench = true;
                                } else {
                                    /* 无工作台时不显示数据 */
                                    that.showWorkBench = false;
                                }
                            } else {
                                that.showWorkBench = false;
                            }
                        })
                        .catch(function(error) {
                            console.log(error);
                        });
                },
                fetchDataFromDC(chartItems) {
                    if (!chartItems.length) {
                        return;
                    }
                    let that = this;
                    let base_url = WorkBench.getVisualURL();
                    let data = {
                        'uid': Cookie.get('t8t-tc-uid'),
                        'ticket': Cookie.get('t8t-tc-ticket'),
                        'action': 'dataCenter',
                        'appName': 'tuchat-pc',
                        'sort': 'WORKBENCH',
                        'chartItems': chartItems
                    };
                    AxiosSrc.get(
                        base_url, {
                            params: data
                        }
                    ).then(function(response) {
                        let data = response.data.result;
                        that.switchCharts.forEach(
                            function(item) {
                                let url = item['url'];
                                that.$set(item, 'loading', false);
                                if (data['result'] == 0) {
                                    console.log('data center no auth, ', data);
                                    return;
                                }
                                let configure = data[url];
                                if (configure) {
                                    let option = chartTransfer.displayChart(configure);
                                    let client_id = configure['clientId'];
                                    that.$set(item, 'option', option);
                                    that.$set(item, 'ready', true);
                                    that.chartsFinish += 1;
                                }
                            }
                        );
                        if (that.switchCharts.length > 0) {
                            document.getElementsByClassName('el-carousel__item')[0].style.display = 'block';
                        }
                    }).catch(function(error) {
                        that.switchCharts.forEach(
                            function(item) {
                                that.$set(item, 'loading', false);
                            }
                        );
                        console.log(error);
                    });
                },
                checkSwitchData(lookup = null) {
                    let that = this;
                    let chartItems = [];
                    let surplus = 0;
                    this.switchCharts.forEach(function(cfg, index) {
                        if (!cfg.ready) {
                            if (chartItems.length == 5) {
                                surplus += 1;
                                return;
                            }
                            let item = cfg['url'] + '__' + index;
                            chartItems.push(item);
                        }
                    });
                    this.fetchDataFromDC(chartItems);
                    this.chartsCatchTimes += chartItems.length;
                    if (lookup) {
                        if ((this.chartsFinish == this.switchCharts.length) ||
                            (2 * this.switchCharts.length < this.chartsCatchTimes) ||
                            (this.chartsFinish > this.chartsMaxNumber)) {
                            /* 默认加载100张 */
                            that.chartWidthHeight = {
                                width: '100%',
                                height: '100%'
                            }
                            clearInterval(lookup);
                        }
                    }
                },
                obtainChartConfigure() {
                    let that = this;
                    that.checkSwitchData();

                lookup = setInterval(function () {
                    that.checkSwitchData(lookup);
                }, 3000);
            },
            initToDoTask(){
                /* 初始化 待办任务 */
                let that = this;
                let args = {
                    "query": {
                        "candidate": Cookie.get('t8t-tc-uid')
                    },
                    "page": 1,
                    "size": 10
                };
                WorkBench.queryUserTaskWeb(args)
                    .then(function (response) {
                        let status = response.status;
                        if (status != 200){
                            console.log(response.statusText);
                        }
                        let result = response.data.result;
                        if(!result){
                            return;
                        }
                        let rows = result.rows;
                        let total = result.total;
                        let needDeal = that.taskLists[0];
                        if(rows){
                            that.$set(needDeal, 'lists', rows);
                            that.$set(needDeal, 'count', total);
                        } else {
                            that.$set(needDeal, 'count', 0);
                        }
                        if(that.firstPage){
                            that.changeTabPage(needDeal, 0);
                        } else {
                            that.firstPage = false;
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                    });
            },
            initDoingTask(){
                /* 初始化 已办进行中任务 */
                let that = this;
                let args = {
                    "query" : {
                        "involved": Cookie.get('t8t-tc-uid'),
                        "finish":false
                    },
                    "page": 1,
                    "size": 10
                };
                WorkBench.getProcessInstsWeb(args)
                    .then(function (response) {
                        let status = response.status;
                        if (status != 200){
                            console.log(response.statusText);
                        }
                        let result = response.data.result;
                        if(!result){
                            return;
                        }
                        let rows = result.rows;
                        let total = result.total;
                        let needDeal = that.taskLists[1];
                        if(rows){
                            that.$set(needDeal, 'lists', rows);
                            that.$set(needDeal, 'count', total);
                        } else {
                            that.$set(needDeal, 'count', 0);
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                    });
            },
            initStarterTask(){
                /* 初始化 在办任务 */
                let that = this;
                let args = {
                    "query" : {
                        "starter": Cookie.get('t8t-tc-uid'),
                    },
                    "page": 1,
                    "size": 10
                };
                WorkBench.queryUserTaskByStart(args)
                    .then(function (response) {
                        let status = response.status;
                        if (status != 200){
                            console.log(response.statusText);
                        }
                        let result = response.data.result;
                        if(!result){
                            return;
                        }
                        let rows = result.rows;
                        let total = result.total;
                        let needDeal = that.taskLists[2];
                        if(rows){
                            that.$set(needDeal, 'lists', rows);
                            that.$set(needDeal, 'count', total);
                        } else {
                            that.$set(needDeal, 'count', 0);
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                    });
            },
            showUserName(){
                if(i==0){

                }
            },
            displayShortUserName(usernames){
                let name = Cookie.get('t8t-tc-username');
                let nameList = [];
                if(!usernames){
                    return '无';
                } else if(usernames.length >3){
                    usernames.forEach(function (element) {
                        if(nameList.length < 3){
                            if(element != name){
                                nameList.push(element);
                            }
                        }
                    });
                    nameList.push("...");
                    return nameList.join(', ');
                } else{
                    return usernames.join(', ');
                }
            },
            displayAllUserName(usernames){
                return usernames.join(', ');
            },
            initWaring(){
                /* 初始化 告警任务接口 */
            },
            urlBuilder(path,obj) {
                let _search
                let _link = "?"
                if(path) {
                    let _path = path.match(/([^\?])+/g)
                    if(_path.length > 1) {
                        if(_path.length > 2) {
                            console.log("URL warning:" + path)
                        }
                        _link = "&"
                    }
                }
                _search = Object.keys(obj).map(i=>i+'='+obj[i]).join('&')
                return path + _link + _search
            }

        },
        components: {
            To8toChart
        },
        name: 'workbench'
    }
</script>
