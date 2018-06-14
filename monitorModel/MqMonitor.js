
/**
 * mq监控模块
 * 
 */
var MqMonitor = function () {
    this.xData = [];
    this.yData = [];
    this.timer = null;
    this.data = null;
    //this.init();
    
}

MqMonitor.prototype.init = function () {
    var me = this;
    var info = me.data;
    me.mqchart = echarts.init(document.getElementById('chart'), 'dark');

    var xData = [];
    for (var i = 60; i >= 0; i--) {
        xData.push(i);
    }
    xData = xData.sort(function (a, b) {
        return a - b;
    })
    
    chartOption = {
        backgroundColor: "#252b34",
        grid: {
            left: 0,
            top: 40,
            right: 30,
            bottom: 0,
            containLabel: true
        },
        title: {
            text: 'MQ状态',
            x: 'left',
            y: '6%',
            textStyle: {
                fontSize: '12',
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#000'
                }
            },
            backgroundColor: 'rgba(255,255,255,1)',
            padding: [5, 10],
            textStyle: {
                color: '#7588E4',
            },
            extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
        },
        legend: {
            right: 20,
            orient: 'vertical',
            data: ['MQ剩余总数', 'MQ出队总数']
        },
        xAxis: {
            name: '秒',
            type: 'category',
            boundaryGap: false,
            data: xData
        },
        yAxis: {
            type: 'value',
            name: '',
            splitLine: {
                show: false,
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#609ee9'
                }
            },
            axisLabel: {
                margin: 10,

                textStyle: {
                    fontSize: 14
                }
            }
        },
        series: [{
            name: 'MQ剩余总数',
            type: 'line',
            smooth: true,
            show: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 6,
            data: [8, 8, 5, 9.5, 7, 8.5, 7.8, 8.1, 7.95, 8, 8, 8, 8, 8, 8],

            itemStyle: {
                normal: {
                    color: '#f7b851'
                }
            },
            lineStyle: {
                normal: {
                    width: 3
                }
            }
        }, {
            name: 'MQ出队总数',
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 6,
            data: [15, 15, 14.8, 15.2, 14.95, 15.02, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],

            itemStyle: {
                normal: {
                    color: '#58c8da'
                }
            },
            lineStyle: {
                normal: {
                    width: 3
                }
            }
        }]
    };
    me.mqchart.setOption(chartOption);
    var NetInDate = [];//以太网读入
    var NetOutDate = [];//以太网写入

    me.timer = setInterval(function () {
        var info = me.data;
        //以太网
        if (NetInDate && NetInDate.length >= 60) {
            NetInDate.shift();
            NetInDate.push(info.total);
        } else {
            NetInDate.push(info.total);
        }
        if (NetOutDate && NetOutDate.length >= 60) {
            NetOutDate.shift();
            NetOutDate.push(info.surplus);
        } else {
            NetOutDate.push(info.surplus);
        }

        me.mqchart.setOption({
            series: [{
                data: NetInDate
            },{
                data: NetOutDate
            }],
        });


        //table初始化
        $('#table').bootstrapTable({
            // method: 'post',
            // url: baseUrl + 'device/interfere/findByWallId',
            // queryParams: function (params) {
            //     return {
            //         wallId: me.wallId
            //     }
            // },
            data: info.mqlist,
            height: 230,
            columns: [{
                field: 'fid',
                title: '序号',
                align: 'center',
                valign: 'middle',
                width: '50',
                
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'name',
                title: '消息队列名称',
                align: 'center',
                valign: 'middle'
            } ,{
                field: 'surplus',
                title: '队列剩余数',
                align: 'center',
                valign: 'middle'
            }, {
                field: 'consume',
                title: '消费者数',
                align: 'center',
                valign: 'middle'
                
            }, {
                field: 'out',
                title: '出队数',
                align: 'center',
                valign: 'middle'
            }, ],
        });

    },1000)
}