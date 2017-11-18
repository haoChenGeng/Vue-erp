/**
 * Created by organo.xia on 2017/4/2.
 */


function displayChart(information, name) {
    let config = information['config']['record'];
    let data = information['data'];
    let ctype = config['charType'];
    let result;
    switch (ctype){
        case "echartsPie":
            result = pieChart(config, data, name);
            break;
        case "echartsLine":
            result = lineChart(config, data, name);
            break;
        case "echartsBar":
            result = barChart(config, data, name);
            break;
        case "echartsScatter":
            result = scatterChart(config, data, name);
            break;
    }
    return result;
}

function scatterChart(config, data, name) {
    let xAxis = data['cols'][data['fields'][0]];
    let title;
    if (name) {
        /* 用户自定义图表标题 */
        title = name;
    } else {
        title = config['title'];
    }
    let option = {
        title : {
            text: title,
            padding: 8
        },
        tooltip : {
            trigger: 'axis',
            textStyle:{
                fontFamily: '微软雅黑'
            },
            showDelay : 0,
            axisPointer:{
                show: true,
                type : 'cross',
                crossStyle: {
                    width: 1,
                    type: 'dashed'
                }
            },
            formatter: function (params) {
                let value,
                    lists;
                lists = [];
                params.forEach(function (e, i) {
                    value = e['value'];
                    lists.push(value[1]);
                });
                return '(' + lists.join(', ') + ')';
            }
        },
        legend: {
            data: data['fields'].slice(1),
            y2: '8',
            textStyle:{
                fontFamily: '微软雅黑'
            }
        },
        calculable : true,
        xAxis : [
            {
                name: config['xAxis-name'],
                type : 'category',
                boundaryGap : false,
                data : xAxis
            }
        ],
        yAxis : [
            {
                name: config['yAxis-name'],
                type : 'value',
                axisLabel : {
                    formatter: '{value} ' + config['yAxis-unit'] ? config['yAxis-unit'] : ''
                }
            }
        ],
        series : (
            function(){
                let series = [];
                let item;
                let fields = data['fields'];
                data['fields'].forEach(function (field, i) {
                    if(i == 0){
                        return;
                    }
                    let dataLists;
                    let paired;
                    dataLists = [];
                    let yAxis = data['cols'][field];
                    let axisLength = yAxis.length;
                    for(let idx=0; idx<axisLength; idx++){
                        paired = (xAxis[idx], yAxis[idx]);
                        dataLists.push(paired);
                    }
                    item = {
                        symbol: 'circle',
                        name: field,
                        symbolSize: config['symbolSize'],
                        type: 'scatter',
                        data: dataLists
                    };
                    series.push(item);
                });
                return series;
            }
        )()
    };
    return option;
}

function barChart(config, data, name) {
    let barWidth = +config['barWidth'] || null;
    let title;
    if (name) {
        /* 用户自定义图表标题 */
        title = name;
    } else {
        title = config['title'];
    }
    let option = {
        title : {
            text: title,
            padding: 8
        },
        tooltip : {
            trigger: 'axis',
            formatter: function (params) {
                let value,
                    seriesName,
                    res = '',
                    name = '';
                params.forEach(function (params) {
                    name = params['name'];
                    value = params['value'];
                    seriesName = params['seriesName'];
                    res = res + seriesName + ': ' + value + '<br/>';
                })
                res = name + "<br>" + res;
                return res;
            },
            textStyle:{
                fontFamily: '微软雅黑'
            }
        },
        legend: {
            data: data['fields'].slice(1),
            y2: '8',
            textStyle:{
                fontFamily: '微软雅黑'
            }
        },
        calculable : true,
        xAxis : [
            {
                name: config['xAxis-name'],
                type : 'category',
                data : data['cols'][data['fields'][0]]
            }
        ],
        yAxis : [
            {
                name: config['yAxis-name'],
                type : 'value',
                axisLabel : {
                    formatter: '{value} ' + config['yAxis-unit'] ? config['yAxis-unit'] : ''
                }
            }
        ],
        series : (
            function(){
                let series = [];
                let item;
                let fields = data['fields'];

                data['fields'].forEach(function (field, i) {
                    if(i == 0){
                        return;
                    }
                    item = {
                        name: field,
                        type: 'bar',
                        barWidth: barWidth,
                        data: data['cols'][field]
                    };
                    series.push(item);
                });
                return series;
            }
        )()
    };
    return option;
}

function lineChart(config, data, name) {
    let title;
    if (name) {
        /* 用户自定义图表标题 */
        title = name;
    } else {
        title = config['title'];
    }
    let option = {
        title : {
            text: title,
            padding: [10, 8],
            textStyle: {
                fontWeight: 'bolder',
                fontFamily: '微软雅黑',
                fontSize: 16
            }
        },
        tooltip : {
            trigger: 'axis',
            textStyle:{
                fontFamily: '微软雅黑'
            },
            formatter: function (params) {
                let value,
                    seriesName,
                    res = '',
                    name = '';
                params.forEach(function (e, i) {
                    name = e['name'];
                    value = e['value'];
                    seriesName = e['seriesName'];
                    res = res + seriesName + ': ' + value + '<br/>';
                });

                res = name + "<br>" + res;
                return res;
            }
        },
        legend: {
            data: data['fields'].slice(1),
            y2: '8',
            textStyle:{
                fontFamily: '微软雅黑'
            }
        },
        calculable : true,
        xAxis : [
            {
                name: config['xAxis-name'],
                type : 'category',
                boundaryGap : false,
                data : data['cols'][data['fields'][0]]
            }
        ],
        yAxis : [
            {
                name: config['yAxis-name'],
                type : 'value',
                axisLabel : {
                    formatter: '{value} ' + config['yAxis-unit'] ? config['yAxis-unit'] : ''
                }
            }
        ],
        series : (
            function(){
                let series = [];
                let item;
                let fields = data['fields'];
                data['fields'].forEach(function (field, i) {
                    if (i == 0){
                        return;
                    }
                    item = {
                        symbol: 'circle',
                        name: field,
                        type: 'line',
                        data: data['cols'][field]
                    };
                    series.push(item);
                })
                return series;
            }
        )()
    };
    return option;
}

function pieChart(config, data, name) {
    let maxDemension = 31;
    let title;
    if (name) {
        /* 用户自定义图表标题 */
        title = name;
    } else {
        title = config['title'];
    }
    let option = {
        title : {
            text: title,
            padding: 8
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)",
            textStyle:{
                fontFamily: '微软雅黑'
            }
        },
        legend: {
            data: data['cols'][data['fields'][0]],
            orient: config['legend-orient'],
            x: config['legend-x'],
            y: config['legend-y']
        },
        calculable : true,
        series : (
            function(){
                let series = [];
                let obj = {};
                obj['name'] = data['fields'][0];
                obj['type'] = 'pie';
                // obj['radius'] = config['series-radius'] + '%';
                obj['center'] = [config['series-center-horizontal'] + '%', config['series-center-vertical'] + '%'];
                let objData = [];

                let subjectRows = data['cols'][data['fields'][0]];
                let dataRows = data['cols'][data['fields'][1]];
                subjectRows.forEach(function (name, index) {
                    if(index > maxDemension){
                        /* 饼图项目超过16个直接不显示 */
                        return;
                    }
                    let item = {
                        name: name,
                        value: dataRows[index]
                    };
                    objData.push(item);
                });

                obj['data'] = objData;
                series.push(obj);
                return series;
            }
        )()
    };
    return option;
}

export default {displayChart}

