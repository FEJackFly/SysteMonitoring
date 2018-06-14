
/**
 * mp监控模块
 * 
 */
var MpMonitor = function () {
    this.xData = [];
    this.yData = [];
    this.timer = null;
    this.data = null;
    //this.init();
    
}
/**
 * 获取数据
 * 
 */
MpMonitor.prototype.getData = function () {
    var me = this;
    //每秒请求1次



};

/**
 * mp图表初始化
 * 
 */
MpMonitor.prototype.init = function () {
    
    var me = this;
    

    me.cpuChart = echarts.init(document.getElementById('main'), 'dark');
    me.memoryChart = echarts.init(document.getElementById('main1'), 'dark');
    me.diskChart = echarts.init(document.getElementById('main2'), 'dark');
    me.netChart = echarts.init(document.getElementById('main3'), 'dark');

    me.MpCpuChart = echarts.init(document.getElementById('main4'), 'dark');
    me.MpmemoryChart = echarts.init(document.getElementById('main5'), 'dark');

    var xData = [];
    for (var i = 60; i >= 0; i--) {
        xData.push(i);
    }
    xData = xData.sort(function (a, b) {
        return a - b;
    })


    MpCpuOption = {
        title: {
            text: 'MP CPU占用率',
            textStyle: {
                fontSize: '14',
                fontWeight:'500',
                color:'#fff'
            },
            left:'5px'

        },
        tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
        },
        series: [
            {
                name: 'CPU占用',
                type: 'gauge',
                detail: { formatter: '{value}%' },
                splitLine: {           // 分隔线
                    length: 15,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 10,
                        shadowBlur: 0,
                        color: [[0.3, '#6ced91'], [0.7, '#06a8fd'], [1, '#fe6b7d']]
                    },
                },
                "detail": {
                    "formatter": "{value}%",
                    "offsetCenter": [0, "80%"],
                    "textStyle": {
                        "fontSize": 16,
                        "color": "#fff"
                    }
                },
                textStyle: {
                    fontSize: '12',
                },
                data: [10]
            }
        ]
    };
    MpmemoryOption = {
        title: {
            text: 'MP 内存占用率',
            textStyle: {
                fontSize: '14',
                fontWeight:'500',
                color:'#fff'
            },
            left:'5px'

        },
        tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
        },
        series: [
            {
                name: '内存占用',
                type: 'gauge',
                detail: { formatter: '{value}%' },
                splitLine: {           // 分隔线
                    length: 15,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 10,
                        shadowBlur: 0,
                        color: [[0.3, '#6ced91'], [0.7, '#06a8fd'], [1, '#fe6b7d']]
                    },
                },
                "detail": {
                    "formatter": "{value}%",
                    "offsetCenter": [0, "80%"],
                    "textStyle": {
                        "fontSize": 16,
                        "color": "#fff"
                    }
                },
                textStyle: {
                    fontSize: '12',
                },
                data: [10]
            }
        ]
    };
    cpuOption = {
        backgroundColor: "#252b34",
        animation: false,
        title: {
            text: 'CPU占用率',
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
        },
        xAxis: [{
            name: '秒',
            type: 'category',
            boundaryGap: false,
            data: xData
        }],
        yAxis: {
            name: '',
            type: 'value',
            max: 100,
            splitLine: {
                show: false
            }
        },
        series: {
            name:'CPU占用',
            
            type: 'line',
            symbol: 'none',
            tooltip: {
                trigger: 'axis'
                // formatter: '{a} <br/>{b}日: {c}元'
            },
            smooth: true,
            itemStyle: {
                normal: {
                    color: "#39B7CE"
                }
            },
            lineStyle: {
                normal: {
                    color: "#39B7CE"
                }
            },
            areaStyle: {
                normal: {
                    color: "#39B7CE",
                    opacity: 0.2
                }
            },
            data: [0]
        }
    };
    memoryOption = {
        backgroundColor: "#252b34",
        animation: false,
        title: {
            text: '内存占用率',
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
            //formatter: "<span class='box-shadow'></span>内存占用： {c}%",
            extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
        },
        xAxis: [{
            name: '秒',
            type: 'category',
            boundaryGap: false,
            data: xData
        }],
        yAxis: {
            name: '',
            type: 'value',
            max: 100,
            splitLine: {
                show: false
            }
        },
        series: {
            name:'内存占用',
            type: 'line',
            symbol: 'none',
            tooltip: {
                trigger: 'axis'
            },
            smooth: true,
            itemStyle: {
                normal: {
                    color: "#FF9900"
                }
            },
            lineStyle: {
                normal: {
                    color: "#FF9900"
                }
            },
            areaStyle: {
                normal: {
                    color: "#FF9900",
                    opacity: 0.2
                }
            },
            data: [0]
        }
    };
    diskOption = {
        backgroundColor: "#252b34",
        title: {
            text: '硬盘使用率',
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
            data: ['硬盘使用状态']
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
            name: '硬盘使用状态',
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
        }]
    };
    netOption = {
        backgroundColor: "#252b34",
        title: {
            text: '网络传输速度',
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
            data: ['读入速度', '写入速度']
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
            name: '读入速度',
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
            name: '写入速度',
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


    me.cpuChart.setOption(cpuOption);
    me.memoryChart.setOption(memoryOption);
    me.diskChart.setOption(diskOption);
    me.netChart.setOption(netOption);

    me.MpCpuChart.setOption(MpCpuOption);
    me.MpmemoryChart.setOption(MpmemoryOption);

    var cpuDate = [];
    var memoryDate = [];
    var HDDate = [];
    var NetInDate = [];//以太网读入
    var NetOutDate = [];//以太网写入

    var MpCpuDate = [];
    var MpmemoryDate = [];
    clearInterval(me.timer);
    me.timer = setInterval(function () {
        console.log(me.data)
        var info = me.data;
        $('.cpuUsage').text(info.cpuUsage ? info.cpuUsage : "-")
        $('.cpuSpeed').text(info.cpuSpeed ? info.cpuSpeed : "-");
        $('.processSum').text(info.processSum ? info.processSum : "-");
        $('.systemRuntime').text(info.systemRuntime ? info.systemRuntime : "-");
        // 运行内存
        $('.memoryTotal').text(info.memoryTotal ? info.memoryTotal : "-");
        $('.memoryUsed').text(info.memoryUsed ? info.memoryUsed : "-");
        $('.memoryFree').text(info.memoryTotal ? info.memoryTotal - info.memoryUsed : "-");
        // 磁盘
        $('.diskUsed').text(info.usedHD ? info.usedHD : "-");
        $('.diskFree').text(info.totalHD ? info.totalHD - info.usedHD : "-");
        $('.diskTotal').text(info.diskTotal ? info.diskTotal : "-");
        // 以太网
        $('.inSize').text(info.inSize ? info.inSize : "-");
        $('.outSize').text(info.outSize ? info.outSize : "-");
        $('.ipAddr').text(info.ipAddr ? info.ipAddr : "-");

        //cpu
        if (cpuDate && cpuDate.length >= 60) {
            cpuDate.shift();
            cpuDate.push(info.cpuUsage);
        } else {
            cpuDate.push(info.cpuUsage);
        }

        me.cpuChart.setOption({
            series: [{
                data: cpuDate
            }],
        });

        //内存
        if (memoryDate && memoryDate.length >= 60) {
            memoryDate.shift();
            memoryDate.push(info.memoryUsage);
        } else {
            memoryDate.push(info.memoryUsage);
        }

        me.memoryChart.setOption({
            series: [{
                data: memoryDate
            }],
        });

        //硬盘
        if (HDDate && HDDate.length >= 60) {
            HDDate.shift();
            HDDate.push(info.usedHD);
        } else {
            HDDate.push(info.usedHD);
        }

        me.diskChart.setOption({
            series: [{
                data: memoryDate
            }],
        });

        //以太网
        if (NetInDate && NetInDate.length >= 60) {
            NetInDate.shift();
            NetInDate.push(info.inSize);
        } else {
            NetInDate.push(info.inSize);
        }
        if (NetOutDate && NetOutDate.length >= 60) {
            NetOutDate.shift();
            NetOutDate.push(info.outSize);
        } else {
            NetOutDate.push(info.outSize);
        }

        me.netChart.setOption({
            series: [{
                data: NetInDate
            },{
                data: NetOutDate
            }],
        });

        //MP Cpu
        
        me.MpCpuChart.setOption({
            series: [{
                data: info.MpcpuUsage
            }],
        });


        //MP 内存

        me.MpmemoryChart.setOption({
            series: [{
                data: info.MpmemoryUsage
            }],
        });
    }, 1000)
}