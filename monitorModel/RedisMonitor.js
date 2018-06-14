
/**
 * redis监控模块
 * 
 */
var RedisMonitor = function () {
    this.xData = [];
    this.yData = [];
    this.timer = null;
    this.data = null;
    //this.init();
    
}

RedisMonitor.prototype.init = function() {
    var me = this;
    me.connectChart = echarts.init(document.getElementById('chart'), 'dark');
    me.BlockChart = echarts.init(document.getElementById('chart1'), 'dark');
    me.hitRateChart = echarts.init(document.getElementById('chart2'), 'dark');
    me.usedMemoryChart = echarts.init(document.getElementById('chart3'), 'dark');
    me.commandspsChart = echarts.init(document.getElementById('chart4'), 'dark');
    var xData = [];
    for (var i = 60; i >= 0; i--) {
        xData.push(i);
    }
    xData = xData.sort(function (a, b) {
        return a - b;
    })

    //客户连接数
    RedisconnectOption = {
        backgroundColor: "#252b34",
        animation: false,
        title: {
            text: '连接客户数',
            x: 'left',
            y: '0%',
            textStyle: {
                fontSize: '14',
            }

        },
        grid: {
            left: 0,
            top: 40,
            right: 30,
            bottom: 0,
            containLabel: true
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
            type: 'line',
            symbol: 'none',
            tooltip: {
                trigger: 'axis'
                // formatter: '{a} <br/>{b}日: {c}元'
            },
            smooth: false,
            itemStyle: {
                normal: {
                    color: "orange"
                }
            },
            lineStyle: {
                normal: {
                    color: "orange"
                }
            },
            areaStyle: {
                normal: {
                    color: "orange",
                    opacity: 0.2
                }
            },
            data: [1]
        }
    };
    me.connectChart.setOption(RedisconnectOption);
    var connectDate = [];

    //阻塞客户数
    RedisBlockOption = {
        backgroundColor: "#252b34",
        animation: false,
        title: {
            text: '阻塞客户数',
            x: 'left',
            y: '0%',
            textStyle: {
                fontSize: '14',
            }

        },
        grid: {
            left: 0,
            top: 40,
            right: 30,
            bottom: 0,
            containLabel: true
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
            type: 'line',
            symbol: 'none',
            tooltip: {
                trigger: 'axis'
                // formatter: '{a} <br/>{b}日: {c}元'
            },
            smooth: false,
            itemStyle: {
                normal: {
                    color: "orange"
                }
            },
            lineStyle: {
                normal: {
                    color: "orange"
                }
            },
            areaStyle: {
                normal: {
                    color: "orange",
                    opacity: 0.2
                }
            },
            data: [1]
        }
    };
    me.BlockChart.setOption(RedisBlockOption);
    var BlockDate = [];

    //命中率
    hitRateOption = {
        backgroundColor: "#252b34",
        animation: false,
        title: {
            text: '命中率（%）',
            x: 'left',
            y: '0%',
            textStyle: {
                fontSize: '14',
            }

        },
        grid: {
            left: 0,
            top: 40,
            right: 30,
            bottom: 0,
            containLabel: true
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
            splitLine: {
                show: false
            }
        },
        series: {
            type: 'line',
            symbol: 'none',
            tooltip: {
                trigger: 'axis'
                // formatter: '{a} <br/>{b}日: {c}元'
            },
            smooth: false,
            itemStyle: {
                normal: {
                    color: "orange"
                }
            },
            lineStyle: {
                normal: {
                    color: "orange"
                }
            },
            areaStyle: {
                normal: {
                    color: "orange",
                    opacity: 0.2
                }
            },
            data: [1]
        }
    };
    me.hitRateChart.setOption(hitRateOption);
    var hitRateDate = [];

    //内存占用
    usedMemoryOption = {
        backgroundColor: "#252b34",
        animation: false,
        title: {
            text: '内存占用',
            x: 'left',
            y: '0%',
            textStyle: {
                fontSize: '14',
            }

        },
        grid: {
            left: 0,
            top: 40,
            right: 30,
            bottom: 0,
            containLabel: true
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
            splitLine: {
                show: false
            }
        },
        series: {
            type: 'line',
            symbol: 'none',
            tooltip: {
                trigger: 'axis'
                // formatter: '{a} <br/>{b}日: {c}元'
            },
            smooth: false,
            itemStyle: {
                normal: {
                    color: "orange"
                }
            },
            lineStyle: {
                normal: {
                    color: "orange"
                }
            },
            areaStyle: {
                normal: {
                    color: "orange",
                    opacity: 0.2
                }
            },
            data: [1]
        }
    };
    me.usedMemoryChart.setOption(usedMemoryOption);
    var usedMemoryDate = [];

    //执行命令数（次/秒）
    commandspsOption = {
        backgroundColor: "#252b34",
        animation: false,
        title: {
            text: '执行命令数（次/秒）',
            x: 'left',
            y: '0%',
            textStyle: {
                fontSize: '14',
            }

        },
        grid: {
            left: 0,
            top: 40,
            right: 30,
            bottom: 0,
            containLabel: true
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
            splitLine: {
                show: false
            }
        },
        series: {
            type: 'line',
            symbol: 'none',
            tooltip: {
                trigger: 'axis'
                // formatter: '{a} <br/>{b}日: {c}元'
            },
            smooth: false,
            itemStyle: {
                normal: {
                    color: "orange"
                }
            },
            lineStyle: {
                normal: {
                    color: "orange"
                }
            },
            areaStyle: {
                normal: {
                    color: "orange",
                    opacity: 0.2
                }
            },
            data: [1]
        }
    };
    me.commandspsChart.setOption(commandspsOption);
    var commandspsDate = [];

    clearInterval(me.timer);
    me.timer = setInterval(function () {
        var info = me.data;

         //客户连接数
         if (connectDate && connectDate.length >= 60) {
            connectDate.shift();
            connectDate.push(info.connectedClients);
        } else {
            connectDate.push(info.connectedClients);
        }
        me.connectChart.setOption({
            series: [{
                data: connectDate
            }],
        });

        //阻塞客户数
        if (BlockDate && BlockDate.length >= 60) {
            BlockDate.shift();
            BlockDate.push(info.blockedClients);
        } else {
            BlockDate.push(info.blockedClients);
        }
        me.BlockChart.setOption({
            series: [{
                data: BlockDate
            }],
        });

        //命中率
        if (hitRateDate && hitRateDate.length >= 60) {
            hitRateDate.shift();
            hitRateDate.push(info.hitRate);
        } else {
            hitRateDate.push(info.hitRate);
        }
        me.hitRateChart.setOption({
            series: [{
                data: hitRateDate
            }],
        });

        //使用内存
        if (usedMemoryDate && usedMemoryDate.length >= 60) {
            usedMemoryDate.shift();
            usedMemoryDate.push(info.usedMemory);
        } else {
            usedMemoryDate.push(info.usedMemory);
        }
        me.usedMemoryChart.setOption({
            series: [{
                data: usedMemoryDate
            }],
        });

        //每秒处理次数
        if (commandspsDate && commandspsDate.length >= 60) {
            commandspsDate.shift();
            commandspsDate.push(info.commandsps);
        } else {
            commandspsDate.push(info.commandsps);
        }
        me.commandspsChart.setOption({
            series: [{
                data: commandspsDate
            }],
        });
    },1000)
}