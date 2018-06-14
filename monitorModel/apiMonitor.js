
/**
 * mp监控模块
 * 
 */
var ApiMonitor = function () {
    this.timer = null;
    this.data = null;
}
/**
 * 获取数据
 * 
 */
ApiMonitor.prototype.getData = function () {
    var me = this;
    //每秒请求1次



};

/**
 * mp图表初始化
 * 
 */
ApiMonitor.prototype.init = function () {
    
    var me = this;
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds(), //毫秒
            "w+": this.getDay() //星期
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k])
                    .length)));
        return fmt;
    }
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'), 'dark');
    option = {
        title: {
            text: 'HTTP请求监控',
            textStyle: { //标题内容的样式
                //color:'#e4393c',//京东红
                // fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
                //fontWeight:"lighter",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
                //fontFamily:"san-serif",//主题文字字体，默认微软雅黑
                fontSize: 14 //主题文字字体大小，默认为18px
            },

        },
        backgroundColor: {

        },
        legend: {
            data: ['最小响应时间', '平均响应时间', '最大响应时间'],
            x: "right"
        },
        tooltip: {
            trigger: 'axis',
            textStyle: {
                formatter: 'parseInt({value})'
            }
        },
        grid: {
            left: 6,
            top: 60,
            right: 20,
            bottom: 20,
            containLabel: true
        },


        toolbox: {
            show: false,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {
                    readOnly: false
                },
                magicType: {
                    type: ['line', 'bar']
                },
                restore: {},
                saveAsImage: {}
            }
        },

        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: (function () {
                var now = new Date();
                var res = [];
                var len = 10;
                while (len--) {
                    res.unshift(now.format('hh:mm:ss'));
                    now = new Date(now - 2000);
                }
                return res;
            })()
        },

        yAxis: {
            type: 'value',
            splitLine: {
                show: false
            }
        },

        series: [


            {
                name: '最小响应时间',
                type: 'line',
                data: ['22', '10', '20', '2', '33', '10', '20', '2', '33', '22', '10', '20', '2', '33',
                    '22', '10', '20', '2'
                ],
                itemStyle: {
                    normal: {
                        color: '#85B546'
                    }
                }
            },
            {
                name: '平均响应时间',
                type: 'line',
                data: ['30', '30', '20', '51', '35', '15', '25', '4', '45', '33', '15', '20', '4', ],
                itemStyle: {
                    normal: {
                        color: '#FF9900'
                    }
                }
            },
            {
                name: '最大响应时间',
                type: 'line',
                data: ['44', '40', '20', '100', '44', '20', '30', '5', '66', '44', '20', '40', '5'],
                itemStyle: {
                    normal: {
                        color: '#CD3E4A'
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
    var myChart1 = echarts.init(document.getElementById('main1'), 'dark');
    option1 = {
        title: {
            text: 'HTTP请求统计',
            x: 'left',
            textStyle: { //标题内容的样式
                //color:'#e4393c',//京东红
                // fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
                //fontWeight:"lighter",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
                //fontFamily:"san-serif",//主题文字字体，默认微软雅黑
                fontSize: 14 //主题文字字体大小，默认为18px
            },
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            data: ['请求快速', '请求缓慢', '请求失败'],
        },
        series: [{
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [{
                    value: 335,
                    name: '请求快速',
                    itemStyle: {
                        normal: {
                            color: '#85B546'
                        }
                    }
                },
                {
                    value: 310,
                    name: '请求缓慢',
                    itemStyle: {
                        normal: {
                            color: '#FF9900'
                        }
                    }
                },
                {
                    value: 234,
                    name: '请求失败',
                    itemStyle: {
                        normal: {
                            color: '#CD3E4A'
                        }
                    }
                },

            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    myChart1.setOption(option1);
     var tableheight = $('#apiTableHeight').height()-20;
    $('#apitable').bootstrapTable({
        columns: [{
            field: 'url',
            title: '请求地址',
            align: 'left',
            width:400
        }, {
            field: 'ip',
            title: 'IP',
            align: 'left',
        }, {
            field: 'status',
            title: '状态',
        }, {
            field: 'size',
            title: '文件大小',
        }, {
            field: 'time',
            title: '时间',
        }],
        data: [{
                url: 'https://www.baidu.com/home/xman/data/tipspluslist.baidu.com/',
                ip: '192.168.1.1',
                status: '200',
                size: '2kb',
                time: '82.78ms'
            },
            {
                url: 'https://www.baidu.com/home/xman/data/tipspluslist.baidu.com/',
                ip: '192.168.1.1',
                status: '200',
                size: '4kb',
                time: '8002.78ms'
            },
            {
                url: 'https://www.baidu.com/home/xman/data/tipspluslist.baidu.com/',
                ip: '192.168.1.1',
                status: '500',
                size: '6kb',
                time: '100.78ms'
            }
        ],
        height:tableheight
    });

}