!(function () {
    $(function () {
        var monitor = new Monitor;
    });
})();

/**
 * 监控服务控制
 * 
 */
var Monitor = function () {
    var me = this;
    me.mpMonitor = new MpMonitor();
    me.apiMonitor = new ApiMonitor();
    me.mqMonitor = new MqMonitor();
    me.redisMonitor = new RedisMonitor();
    me.mysqlMonitor = new MysqlMonitor();
    me._subscribe();
    me.init();
    me.event();

}

/**
 * 初始化
 * 
 */
Monitor.prototype.init = function () {
    var me = this;

    //默认加载mp
    // me.redisInit();
    // me.redisMonitor.init();
   // me.mpMonitor();
   me.mpInit();

}

Monitor.prototype._subscribe = function () {
     var me = this;

    //  MQ订阅
    // window.parent.JDMC.subscribe("monitorservice", window.parent.MessageType.MONITOR_SERVICE, function (data) {
    //     var data = JSON.parse(data);


    // 	me.mpMonitor.data = data.mpInfo?data.mpInfo:""
    // });


    //mock模拟

    //调用mock方法模拟数据
    Mock.mock(
        'http://mockjs', {
            data:{
                mpInfo:{
                    "cpuUsage|1-50":100,
                    "MpcpuUsage|1-50":100,
                    "cpuSpeed|1-100":100,
                    "processSum|1-100":100,
                    "systemRuntime":"@date('yyyy-MM-dd hh:ss')",
                    "memoryTotal|1-100":100,
                    "memoryUsage|1-100":100,
                    "MpmemoryUsage|1-100":100,
                    "usedHD|1-100":100,
                    "totalHD|1-100":100,
                    "diskTotal|1-100":100,
                    "inSize|1-50":100,
                    "outSize|50-100":100,
                    "ipAddr|1-100":100
                },
                redisInfo: {
                    "ipAddr":"192.168.1.1", //ip
                    "version":100,	//版本
                    "tcpPort":100,	//端口
                    "archBits":100,	//位数 64或32
                    "processId":100,	//进程ID
                    "secondTime":100,	//启动时长 秒
                    "connectedClients|1-100":100,	//连接客户端数
                    "blockedClients|1-100":100,	//阻塞客户端数
                    "hitRate|1-100":100, //命中率
                    "usedMemory|1-100":100,	//使用内存 	Mb
                    "commandsps|1-100":100,	//每秒处理次数
                },
                mysqlInfo: {
                    "ipAddr":"192.168.1.1", //ip
                    "version":100,	//版本
                    "tcpPort":100,	//端口
                    "archBits":100,	//位数 64或32
                    "processId":100,	//进程ID
                    "secondTime":100,	//启动时长 秒
                    "connectedClients|1-100":100,	//连接客户端数
                    "blockedClients|1-100":100,	//阻塞客户端数
                    "hitRate|1-100":100, //命中率
                    "usedMemory|1-100":100,	//使用内存 	Mb
                    "commandsps|1-100":100,	//每秒处理次数
                },
                mqInfo: {
                    total:100,//总数
                    surplus:66,//总剩余数
                    mqlist:[{
                        name:'test', //消息队列名称
                        surplus:'188',//队列剩余数
                        consume:'22',//消费者数
                        out:'44'//出队数
                    },{
                        name:'test1', //消息队列名称
                        surplus:'188',//队列剩余数
                        consume:'22',//消费者数
                        out:'44'//出队数
                    }]
                }
            }
        }
    );
     //ajax请求
     me.timer1 = setInterval(function() {
        $.ajax({
            url: "http://mockjs",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: {},    //参数值
            type: "GET",   //请求方式
            beforeSend: function () {
                //请求前的处理
            },
            success: function (data) {
                //请求成功时处理
                me.mpMonitor.data = data.data.mpInfo?data.data.mpInfo:"";
                me.mqMonitor.data = data.data.mqInfo?data.data.mqInfo:"";
                me.redisMonitor.data = data.data.redisInfo?data.data.redisInfo:""
                me.mysqlMonitor.data = data.data.mysqlInfo?data.data.mysqlInfo:""
            },
            complete: function () {
                //请求完成的处理
            },
            error: function () {
                //请求出错处理
            }
        });
    },1000) 
}

/**
 * 事件绑定
 * 
 */
Monitor.prototype.event = function () {
    var me = this;
    //点击切换模版
    $("#mpServer").click(function () {
        clearInterval(me.mpMonitor.timer);
        me.mpInit();
        
    })
    $("#apiServer").click(function () {
        // clearInterval(me.apiMonitor.timer);
        me.apiInit();
        
    })

    $("#mqServer").click(function () {
        clearInterval(me.mqMonitor.timer);
        me.mqInit();
        
    })

    $("#databaseServer").click(function () {
        clearInterval(me.mysqlMonitor.timer);
        me.mysqlInit();
    })
    $("#redisServer").click(function () {
        clearInterval(me.redisMonitor.timer);
        me.redisInit();
    })
}

/**
 * MP监控初始化
 * 
 */
Monitor.prototype.mpInit = function () {
    var me = this;
    var tpl = _.template($('#dynamicTpl').text())();
    $('#particular').html(tpl);
    me.mpMonitor.init();
}

/**
 *Api监控初始化
 *
 */
Monitor.prototype.apiInit = function() {
    var me = this;
    var tpl = _.template($('#apiTpl').text())();
    $('#particular').html(tpl);
    me.apiMonitor.init();
}

/**
 * MQ监控初始化
 * 
 */
Monitor.prototype.mqInit = function () {
    var me = this;
    var tpl = _.template($('#mqTpl').text())();
    $('#particular').html(tpl);
    me.mqMonitor.init();
}

/**
 * MySql监控初始化
 * 
 */
Monitor.prototype.mysqlInit = function () {
    var me = this;
    var tpl = _.template($('#database').text())();
    $('#particular').html(tpl);
    me.mysqlMonitor.init();
}

/**
 * Redis监控初始化
 * 
 */
Monitor.prototype.redisInit = function () {
    var me = this;
    var tpl = _.template($('#redisTpl').text())();
    $('#particular').html(tpl);
    me.redisMonitor.init();
}