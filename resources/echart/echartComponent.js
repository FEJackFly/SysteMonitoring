/**
 * [echartComponent.js 基于echarts 封装, 需要依赖echart]
 * @author ZCC
 */

(function(nsitd) {
  // nsitd 公司简写
  var utEchart = {
    theme: 'dark', //黑色主题，可以修改
    barLineResize: null,
    ringResize: null,
    pieResize: null,
    radarResize: null,
    /**
     *[barLine 柱状图、折线图]
     * @param  {[object]} obj [传一个对象 ,
     *  {
     *    ele: '', // 指定显示的位置元素ID string require
     *    name: '', // 图表的名称 string
     *    type: '', // 指定图表的类型 string require (柱状图：bar,折线图：line,饼图/环形图：pie,雷达图：radar)
     *    YName: '', // Y轴的名称 string require
     *    XName: [], // X轴的名称 array require
     *    XData: [], // X轴的数据 array requrie
     *    backgroundColor: '' // 图表背景颜色 string #000
     *    textStyle: {} // 图表文本颜色配置包括（color、fontStyle、fontWeight、fontFamily、fontSize）
     *    click: function, // 点击事件 params为点击返回的内容
     *  }]
     * @return [无]
     */
    barLine: function(obj) {
      var echartObj = {
        ele: obj.ele,
        name: obj.name || '',
        YName: obj.YName.split(',') || ['数量'],
        XName: obj.XName || [],
        XData: obj.XData || [],
        type: obj.type || 'bar',
        backgroundColor: obj.backgroundColor || null,
        textStyle: obj.textStyle || {},
        click: obj.click
      }
      // 指定显示元素
      var node = document.getElementById(echartObj.ele);
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: echartObj.name
        },
        // 背景颜色
        backgroundColor: echartObj.backgroundColor,
        // 文本配置
        textStyle: echartObj.textStyle,
        tooltip: {},
        legend: {
          data: echartObj.YName
        },
        xAxis: {
          data: echartObj.XName
        },
        yAxis: {},
        series: [{
          name: echartObj.YName,
          type: echartObj.type,
          data: echartObj.XData
        }]
      };
      // 显示图表
      var echart = echarts.init(node, this.theme);
      echart.setOption(option);
      echart.on('click', function(params) {
        echartObj.click(params);
      })
      return echart;
      // this.barLineResize = echart;
    },
    /**
     *[ring 环形图]
     * @param  {[object]} obj [传一个对象 ,
     *  {
     *    ele: '', // 指定显示的位置元素ID string require
     *    name: '', // 图表的名称 string
     *    type: '', // 指定图表的类型 string require (柱状图：bar,折线图：line,饼图/环形图：pie,雷达图：radar)
     *    sidebar: bool //是否显示侧边栏标题 bool require（true, false）
     *    data: [], // 数据（value为真实值，name为名称） array require eg:[{value: 1,name: ''}]
     *    backgroundColor: '' // 图表背景颜色 string #000
     *    textStyle: {} // 图表文本颜色配置包括（color[eg:'#fff']、fontStyle[eg:'italic']、fontWeight[eg:'bold']、fontFamily[eg:'sans-serif']、fontSize[eg:12]）
     *    click: function, // 点击事件 params为点击返回的内容
     *  }]
     * @return [无]
     */
    ring: function(obj) {
      var echartObj = {
        ele: obj.ele,
        name: obj.name || '',
        type: obj.type || 'pie',
        sidebar: obj.sidebar,
        data: obj.data || [],
        percentage: function(){
          return echartObj.name;
        },
        dataName: function() {
          var len = obj.data.length,
            arr = [];
          for (var i = 0; i < len; i++) {
            arr.push(obj.data[i].name);
          }
          return arr;
        },
        backgroundColor: obj.backgroundColor || null,
        textStyle: obj.textStyle || {},
        click: obj.click
      }
      // 指定显示元素
      var node = document.getElementById(echartObj.ele);
      var option = {
        title: [{
          text: echartObj.percentage(),
          left: '69%',
          top: '46%',
          textAlign: 'center',
          textBaseline: 'middle',
          textStyle: {
            color: '#f8ac59',
            fontWeight: 'normal',
            fontSize: 26
          }
        }],
        tooltip: {
          trigger: 'item',
          formatter: function(params){
            if(typeof (params.data.error) != "undefined" && params.data.error){
              return params.seriesName + "<br/>" + params.name + ": " + 0 + " (" + 0 +"%)"
            }else{
              return params.seriesName + "<br/>" + params.name + ": " + params.value + " (" + params.percent +"%)"
            }
          },
          show: true
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: echartObj.dataName(),
          show: echartObj.sidebar,
          textStyle: {
            color: '#8b9ec4'
          },
          formatter: function(name) {
            var index = 0;
            echartObj.data.forEach(function(value,i){
              if(value.name == name){
                index = i;
              }
            });
            if (name.length == 2) {
              name += "   ";
            }
            // 特殊处理入侵统计
            if ( echartObj.ele == "invasion") {
              return name + '  ' + echartObj.data[index].value1 + ' | ' + echartObj.data[index].value2;
            }
            return name + '  ' + echartObj.data[index].value;
          }
        },
        // 背景颜色
        backgroundColor: echartObj.backgroundColor,
        // 文本配置
        textStyle: echartObj.textStyle,
        series: [{
          name: echartObj.name,
          type: echartObj.type,
          center: ['70%', '50%'],
          radius: ['70%', '85%'],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: function() {
                return '';
              }
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: echartObj.data
        }]
      };

      var echart = echarts.init(node, this.theme);
      echart.setOption(option);
      echart.on('click', function(params) {
        echartObj.click(params);
      })
      return echart;
    },
    /**
     *[ring 雷达图]
     * @param  {[object]} obj [传一个对象 ,
     *  {
     *    ele: '', // 指定显示的位置元素ID string require
     *    name: '', // 图表的名称 string
     *    type: '', // 指定图表的类型 string require (柱状图：bar,折线图：line,饼图/环形图：pie,雷达图：radar)
     *    data: [], // 数据（value为真实值，name为名称，max为类型最大值） array require eg:[{value: 0,name: '',max 10}]
     *    backgroundColor: '' // 图表背景颜色 string #000
     *    textStyle: {} // 图表文本颜色配置包括（color、fontStyle、fontWeight、fontFamily、fontSize）
     *    click: function, // 点击事件 params为点击返回的内容
     *  }]
     * @return [无]
     */
    radar: function(obj) {
      var echartObj = {
        ele: obj.ele,
        name: obj.name || '',
        type: obj.type || 'radar',
        data: obj.data || [],
        dataValue: function() {
          var len = obj.data.length,
            arr = [];
          for (var i = 0; i < len; i++) {
            arr.push(obj.data[i].value)
          }
          return arr;
        },
        backgroundColor: obj.backgroundColor || null,
        textStyle: obj.textStyle || {},
        click: obj.click
      }
      var node = document.getElementById(echartObj.ele);
      var option = {
        title: {
          text: echartObj.name
        },
        tooltip: {},
        radar: {
          shape: 'circle',
          indicator: echartObj.data
        },
        // 背景颜色
        backgroundColor: echartObj.backgroundColor,
        // 文本配置
        textStyle: echartObj.textStyle,
        series: [{
          name: echartObj.name,
          type: 'radar',
          areaStyle: {
            normal: {}
          },
          data: [{
            value: echartObj.dataValue(),
            name: echartObj.name
          }]
        }]
      }
      var echart = echarts.init(node, this.theme);
      echart.setOption(option);
      echart.on('click', function(params) {
        echartObj.click(params);
      })
      return echart;
    },
    /**
     *[ring 饼图]
     * @param  {[object]} obj [传一个对象 ,
     *  {
     *    ele: '', // 指定显示的位置元素ID string require
     *    name: '', // 图表的名称 string
     *    type: '', // 指定图表的类型 string require (柱状图：bar,折线图：line,饼图/环形图：pie,雷达图：radar)
     *    data: [], // 数据（value为真实值，name为名称） array require eg:[{value: 0,name: ''}]
     *    backgroundColor: '' // 图表背景颜色 string #000
     *    textStyle: {} // 图表文本颜色配置包括（color、fontStyle、fontWeight、fontFamily、fontSize）
     *    click: function, // 点击事件 params为点击返回的内容
     *  }]
     * @return [无]
     */

    pie: function(obj) {
      var echartObj = {
        ele: obj.ele,
        name: obj.name || '',
        type: obj.type || 'pie',
        dataName: function() {
          var len = obj.data.length,
            arr = [];
          for (var i = 0; i < len; i++) {
            arr.push(obj.data[i].name);
          }
          return arr;
        },
        data: obj.data || [],
        backgroundColor: obj.backgroundColor || null,
        textStyle: obj.textStyle || {},
        click: obj.click
      }
      // 指定显示元素
      var node = document.getElementById(echartObj.ele);
      var option = {
        title: {
          text: echartObj.name,
          subtext: '实时更新',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: echartObj.dataName()
        },
        // 背景颜色
        backgroundColor: echartObj.backgroundColor,
        // 文本配置
        textStyle: echartObj.textStyle,
        series: [{
          name: echartObj.name,
          type: echartObj.type,
          radius: '55%',
          center: ['50%', '60%'],
          data: echartObj.data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };

      var echart = echarts.init(node, this.theme);
      echart.setOption(option);
      echart.on('click', function(params) {
        echartObj.click(params);
      });
      return echart;
    }
  }
  // 导出
  nsitd.utEchart = utEchart;
})(window)
