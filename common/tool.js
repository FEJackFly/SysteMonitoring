/**
 * jQuery 扩展
 */
(function ($) {
  $.fn.extend({
    /**
     * 目标为任意对象元素
     * 同时绑定单击和双击事件
     */
    bindClick: function (click, dblClick, el) {
      el = el || $(this);
      var _time = null;
      el.dblclick(function (e) {
        clearTimeout(_time);
        if (dblClick)
          dblClick.apply(e.target, [e]);
      }).click(function (e) {
        clearTimeout(_time);
        _time = setTimeout(function () {
          if (click)
            click.apply(e.target, [e]);
        }, 250);
      });
    },//bindClick

    /**
     * url 请求地址
     * convert 是否将参数字符串化 配合controller请求使用 默认false
     * opts 为ajax请求对象
     *        opts.data 为请求参数
     *        opts.success 和 opts.error
     *      分别为请求成功或失败时回调函数function 或对话框内容
     *        对话框时举例: {message:'对话框内容',title:'对话框标题'}
     */
    exajax: function (url, opts, convert) {
      var ajaxParam = {
        url: url,
        async: false,	// 同步
        type: 'POST',  	// 请求类型
        cache: false, 	// 不缓存
        dataType: 'json',
        success: '',
        error: ''
      };
      opts = opts || {};
      for (var k in opts) {
        if (ajaxParam.hasOwnProperty(k) || 'data' == k) {
          if (k == 'data') {
            try {
              var params = opts['data'];
              if (!convert) {
                params = JSON.stringify(params);
                ajaxParam.contentType = 'application/json';
              }
              ajaxParam.data = params;
            } catch (e) {
            }
          } else if (k == 'success') {
            var success = opts[k];
            ajaxParam[k] = function (data) {
              if (success) {
                if (typeof success == 'function') {
                  success.apply(success, [data]);
                } else {
                  if (success.message) {
                    $().dialog({
                      data: success.message || "操作成功!",
                      title: success.title
                    }).modal('show');
                  }
                }
              }
            }
          } else if (k == 'error') {
            var error = opts[k];
            ajaxParam[k] = function (e) {
              if (error) {
                if (typeof error == 'function') {
                  error.apply(error, [e]);
                } else {
                  if (error.message) {
                    toastr.error("系统未知错误！" + error.message);
                  }
                }
              }
            }
          } else {
            ajaxParam[k] = opts[k];
          }
        }
      }
      $.ajax(ajaxParam);
    },//exajax


    /**
     * opts{data:data,init:{
		 * 		startDate:new Date()
		 * 	},format:{
		 *		endDate:new Date(),//function(){return ...}
		 *		isLeader:function(val){ if(val==1){
		 *			return true;	else{
		 *			return false;
		 *		}
		 *		}}
		 * 	}}
     * 1.赋值
     *    目标元素为form表单
     *    opts.data 为和表单字段对应的数据对象 会自动根据数据进行字段值填充
     *    opts.init 为表单初始化值或初始化回调方法
     *    opts.format 为表单赋值格式化回调函数
     *    支持input select checkbox radio等表单元素的赋值
     * 2.取值
     *    当opts.data不存在时 方法作用变为返回封装了目标表单的所有字段值的数据对象
     */
    formVals: function (opts, el) {
      el = el || $(this);
      if (!el || !el.get(0).elements) {
        return;
      }
      opts = opts || {};
      var format = opts.format;
      var init = opts.init;
      var data = opts.data;
      var elementsObj = el.get(0).elements;
      var val;
      if (data != undefined) {//赋值
        if (init) {//整合默认值
          data = _.defaults(data, init);
        }
        var obj;
        if (elementsObj) {
          _.each(elementsObj, function (obj) {
            if (obj.tagName == "INPUT" || obj.tagName == "SELECT") {
              val = null;
              if (data[obj.name] != undefined) {
                var func = data[obj.name];
                if (typeof (func) == 'function') {
                  val = func.apply(func, [val, obj, elementsObj]);
                } else {
                  val = func;
                }
              }
              if (obj.type == "select-multiple" && obj.multiple) {
                val = $(obj).val(val);
              }
              if (format && format[obj.name] != undefined) {
                func = format[obj.name];
                if (typeof (func) == 'function') {
                  val = func.apply(func, [val, obj, data]);
                } else {
                  val = func;
                }
              }
              if (obj.type == 'checkbox' || obj.type == 'radio') {
                if (obj.value != undefined && (val instanceof Array)) {
                  for (var v in val) {
                    if (val[v] == obj.value) {
                      $(obj).prop("checked", true);
                    }
                  }
                } else {
                  if (null != val && val != undefined && (val == obj.value)) {
                    $(obj).prop("checked", true);
                  } else {
                    $(obj).prop("checked", false);
                  }
                }
              } else if (obj.type == 'file') {
                //do nothing;
              } else {
                obj.value = val;
              }
            }
          });
        }
      } else {//取值
        var ret = {};
        if (elementsObj) {
          _.each(elementsObj, function (obj) {
            val = null;
            if (obj.tagName == "INPUT" || obj.tagName == "SELECT") {//
              val = obj.value;
              if (obj.type == "select-multiple" && obj.multiple) {
                val = $(obj).val();
              }
              if (obj.name == "id" && obj.value == "") {
                val = null;
              }
              if (obj.type == 'checkbox' || obj.type == 'radio') {
                if ($(obj).is(':checked')) {
                  var result;
                  if (typeof obj.value != undefined) {
                    result = obj.value;
                  }
                  if (obj.type == 'radio') {
                    ret[obj.name] = result;
                  } else {
                    if (!ret[obj.name]) {
                      ret[obj.name] = [];
                    }
                    ret[obj.name].push(result);
                  }
                }
              }
              if (format && format[obj.name] != undefined) {
                func = format[obj.name];
                if (typeof (func) == 'function') {
                  val = func.apply(func, [val, obj]);
                } else {
                  val = func;
                }
              }
              if (obj.type != 'checkbox' && obj.type != 'radio') {
                ret[obj.name] = val;
              }
            }
          });
          return ret;
        }
      }
      return el;
    },//formVals


    /**
     * 目标对象表单
     * 作用为重置表单
     * opts.init 为数据对象 定义字段的初始化默认值或初始化回调方法
     */
    formReset: function (opts, el) {
      el = el || $(this);
      if (!el || !el.get(0).elements) {
        return;
      }
      opts = opts || {};
      var elementsObj = el.get(0).elements;
      var obj;
      if (elementsObj) {
        var init = opts.init;
        for (var i = 0; i < elementsObj.length; i += 1) {
          obj = elementsObj[i];
          if (obj.tagName == "INPUT" || obj.tagName == "SELECT") {
            var val = obj.initValue || '';
            if (init) {
              if (undefined != init[obj.name] && null != init[obj.name]) {
                var func = init[obj.name];
                if (typeof (func) == 'function') {
                  val = func.apply(func, [val, obj, elementsObj]);
                } else {
                  val = func;
                }
              }
            }
            if (obj.type == 'checkbox' || obj.type == 'radio') {
              if (val == true || val == 1) {
                $(obj).prop("checked", true);
              } else {
                $(obj).prop("checked", false);
              }
            } else {
              obj.value = val;
            }
          }
        }
      }
      return el;
    },//formReset

  });

  //禁止后退键 作用于IE、Chrome
  // document.onkeydown=banBackSpace;
  //禁止后退键 作用于Firefox、Opera
  //document.onkeypress=banBackSpace;
})(jQuery);

/* 提示全局设置 */
toastr.options = {
  "debug": false,
  "newestOnTop": false,
  "positionClass": "toast-bottom-right",
  "closeButton": true,
  "progressBar": true
};
/* 时间格式化控件地区设置 */
moment.locale('zh-cn');

/**
 * [createElement 创建HTML文本]
 * @param  {[array]}  data [数组]
 * @param  {[string]} type [类型eg:form,text]
 * @return {[string]}      [返回html文本]
 */
function createElement(data, type) {
  var strTmp = '';
  if (type == 'form') {
    var form = $('<form>');
    form.attr('id', 'formDialog');
    $.each(data, function (index, item) {
      if (item.type == 'file') {
        strTmp +=
          `<div class="form-group">
                      <label for="${item.name}" class="col-sm-3 control-label">${item.displayName}</label>
                      <div class="col-sm-9">
              						<label class="btn btn-default" for="${item.name}">
              							<input id="${item.name}" type="${item.type}" style="display:none;"
              							onchange="$('#upload-file-info').html($(this).val());">
              							${item.displayName}
              						</label>
              						<span class='label label-default' id="upload-file-info"></span>
                          </div>
              					</div>`;
      } else if (item.type == 'hidden') {
        strTmp +=
          `<div">
            <input type="hidden" id="${item.name}" name="${item.name}" value="${item.value}">
          </div>`;
      } else if (item.type == 'textarea') {
        strTmp +=
          `<div class="form-group has-feedback">
            <label for="${item.name}" control-label">${item.displayName}</label>
            <textarea name="${item.name}" class="form-control" id="${item.name}" placeholder="${item.displayName}"></textarea>
          </div>`;
      } else if (item.type == 'select') {
        strTmp +=
          `<div class="form-group">
                          <label for="${item.name}" class="col-sm-3 control-label">${item.displayName}</label>
                            <div class="col-sm-9">
                              <select id="${item.name}" class="select2_demo_1 form-control" style="width: 100%">
                                <option value="1">分层1</option>
                                <option value="2">分层2</option>
                                <option value="3">分层3</option>
                                <option value="4">分层4</option>
                                <option value="5">分层5</option>
                              </select>
                            </div>
													</div>`;
      } else if (item.type == 'radio') {
        strTmp +=
          `<div class="form-group has-feedback">
            <label for="${item.name}">${item.displayName}</label>
             <div>`;
        $.each(item.child, function (i, e) {
          if (i == 0) {
            strTmp += `
          <div class="radio radio-info radio-inline">
            <input type="radio" id="radio${i}" value="${e.value}" name="${item.type}" checked="true">
            <label for="radio${i}">${e.name}</label>
            </div>
          `;
          } else {
            strTmp += `
          <div class="radio radio-info radio-inline">
            <input type="radio" id="radio${i}" value="${e.value}" name="${item.type}">
            <label for="radio${i}">${e.name}</label>
            </div>
          `;
          }
        });
        strTmp += `
            </div>
          </div>`;
      } else {
        strTmp +=
          `<div class="form-group has-feedback">
            <label for="${item.name}" control-label">${item.displayName}</label>
            <input type="${item.type}" name="${item.name}" class="form-control" ${item.disabled ? 'disabled' : ''} id="${item.name}" value="${item.value ? item.value : ''}">
          </div>`;
      }
    })
    form.append(strTmp);
    return form;
  } else if (type == 'text') {
    strTmp += `<p>${data[0]}</p>`;

    strTmp += '<div class="row">'
    $.each(data, function (index, item) {
      if (index !== 0) {
        strTmp += `<p style="font-size:12px;margin-top:10px;" class="col-sm-4">${item}</p>`
      }
    })
    strTmp += '</div>'
    return strTmp;
  }
}

/**
 * [给jquery validate 添加验证规则]
 * @param  {[type]} value   [description]
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
jQuery.validator.addMethod("moreZero", function (value, element) {
  var moreZero = /^\+?[0-9]*$/; // 大于等于0的数字'
  return moreZero.test(value);
}, "大于等于0的数字");
jQuery.validator.addMethod("checkIp", function (value, element) {
  var checkIp = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/;//ip格式验证
  return !!value.match(checkIp)
}, "请填写正确ip地址")
jQuery.validator.addMethod("checkPicSize", function (value, element) {
  var fileSize = element.files[0].size;
  var maxSize = 5 * 1024 * 1024;
  if (fileSize > maxSize) {
    return false;
  } else {
    return true;
  }
}, "请上传大小在5M一下的文件");
jQuery.validator.addMethod("checkPicsuffix", function (value, element, param) {
  if (param) {
    if (value == '') {
      return true;
    }
    var length = value.length;
    var suffixArray = param.split('|');
    var suffix = value.substr(length - 3, length);
    for (var i = 0; i < suffixArray.length; i++) {
      if (suffixArray[i] == suffix) {
        return true;
      }
    }
  }
  return false;
}, "请上传符合格式的文件");

jQuery.validator.addMethod("password", function (value, element) {
  var tel = /^[a-zA-Z0-9]{4,20}$/;
  return this.optional(element) || (tel.test(value));
}, "只能由4-20位字母或数字组成");


jQuery.fn.slideLeftHide = function (speed, callback) {
  this.animate({
    width: "hide",
    paddingLeft: "hide",
    paddingRight: "hide",
    marginLeft: "hide",
    marginRight: "hide"
  }, speed, callback);
};
jQuery.fn.slideLeftShow = function (speed, callback) {
  this.animate({
    width: "show",
    paddingLeft: "show",
    paddingRight: "show",
    marginLeft: "show",
    marginRight: "show"
  }, speed, callback);
};
// 全局设置AJAX
function setAjaxGlobalOptions() {
  //设置AJAX的全局默认选项
  $.ajaxSetup({
    async: true,//同步请求
    timeout: 5000,//超时时间
    complete: function (XMLHttpRequest, textStatus) {
      // 未授权返回登录界面
      if (XMLHttpRequest.status == 401) {
        window.open('/ut-web', '_top');
      }
    }
  });
}

$(function () {
  setAjaxGlobalOptions();
});

//时间戳转年月日时分秒
Date.prototype.toLocaleString = function () {
  return this.getFullYear() + "/" + (this.getMonth() + 1) + "/" + this.getDate() + "/ " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
};
//格式化时间
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds(),            //毫秒
    "w+": this.getDay()            //星期
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

// 时间控件全局设置语言
$.datetimepicker.setLocale('ch');

// tool 全局配置
var tool = {
  //获取当前视图高 如果传入节点，获取节点高度
  getClientHeight: function (node) {
    if (typeof node != 'undefined') {
      return $(node).height();
    }
    return document.body.clientHeight;
  },
  //获取url中的参数
  getUrlParam: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
  },
  /*
   * 封装jquery validate方法
   * 参数 id string form表单ID,jquery获取dom元素一样
   * 参数 relus object 参考jquery validate relus
   * 参数 messages object 参考 jquery validate
   * 返回 无
   * */
  validate: function (id, rules, messages) {
    var validate = $(id).validate({
      rules: rules,
      messages: messages,
      errorPlacement: function (error, element) {
        element.next().remove();
        // 加上x 图标
        element.after('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
        element.closest('.form-group').append(error);
      },
      // 给未通过的元素进行处理
      highlight: function (element) {
        $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
      },
      // 验证通过的处理
      success: function (label) {
        var el = label.closest('.form-group').find('input');
        el.next().remove();
        el.after('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
        label.closest('.form-group').removeClass('has-error').addClass('has-success');
        label.remove();

      }
    });
    return validate;
  },
  /**
   * niceScroll.js 滚动条样式修改
   * @param node id，class jquery获取dom元素一样
   * @return niceScroll 对象
   */
  changeScroll: function (node, obj) {
    var scroll = $(node).mCustomScrollbar(obj);
    return scroll;
  },
  /*
   * 把constant.js 变量转成select2下拉框格式
   * */
  formatSelectData: function (item) {
    var newArr = [];
    $.each(item, function (i, ele) {
      newArr.push({
        id: i,
        text: ele
      })
    })
    return newArr.reverse();
  },
  /**
   * 时间控件
   */
  datetimepicker: function (node, obj) {
    var obj = obj || {};
    obj.theme = 'dark';
    $(node).datetimepicker(obj);
  },
  /**
   *  Search
   */
  searchInput: function (node) {
    var ele = $(node);
    var input = ele.find('input');
    var clear = ele.find('.searchClear');
    input.on('input change', function () {
      if ($(this).val().length != 0) {
        clear.css('display', 'block');
      } else {
        clear.css('display', 'none');
      }
    });
    clear.on('click', function () {
      input.val('').trigger('input').trigger('change');
      $(this).css('display', 'none');
    })
  },
  /**
   * select2()
   */
  select2: function (node, obj) {
    obj.language = 'zh-CN';
    var select = $(node).select2(obj);
    return select;
  },
  /**
   * 创建表格
   * @param opts {
   *    tableName: '',
   *    height: 100,
   *    columns: [],
   *    url: '',
   *    onClickRow: method
   * }
   * @return table
   */
  createTable: function (opts) {
    var table = $(opts.tableName).bootstrapTable({
      height: opts.height || undefined,
      columns: opts.columns || [],
      formatLoadingMessage: function () {
        return "请稍等，正在加载中...<i class='fa fa-spinner fa-spin fa-fw'></i>";
      },
      url: opts.url || '',
      method: 'get',
      cache: false,
      dataType: 'json',
      onClickRow: opts.onClickRow || function () { },
      data: opts.data || [],
      rowStyle: opts.rowStyle || undefined
    });
    return table;
  },
  /**
   * 获取预览图地址
   * @param file 文件
   */
  getObjectURL: function (file) {
    var url = null;
    if (window.createObjectURL != undefined) {
      url = window.createObjectURL(file)
    } else if (window.URL != undefined) {
      url = window.URL.createObjectURL(file)
    } else if (window.webkitURL != undefined) {
      url = window.webkitURL.createObjectURL(file)
    }
    return url;
  },
  /**
   * 获取用户信息
   * @return {null}
   */
  getUserInfo: function () {
    if (typeof localStorage.userInfo != 'undefined') {
      return JSON.parse(localStorage.userInfo);
    } else {
      return null;
    }
  },
  objIndexOf: function (list, obj) {
    var offOn = false;
    _.each(list, function (item, index) {
      // if()
    })
  }
}
//table输入页数跳转+返回
function tablePage(tableId) {
  //输入制定页数跳转
  preNumber = parseInt(localStorage.preNumber);
  if (preNumber != $(tableId).bootstrapTable('getOptions').pageNumber) {
    localStorage.preNumber = $(tableId).bootstrapTable('getOptions').pageNumber
  }
  $(".numberBtn").on('click', function () {
    var number = parseInt($(".numberInput").val());
    $('#table').bootstrapTable('selectPage', number);
  })
  $(".preNumberBtn").on('click', function () {
    $('#table').bootstrapTable('selectPage', preNumber);
  })
}

/*
 * 滚轮改变input值----兼容火狐.chrome.Ie
 * 直接传入节点命调用
 * */
var EventUtil = {

  addHandler: function (element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + type, handler);
    } else {
      element["on" + type] = handler;
    }
  },

  removeHandler: function (element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
      element.detachEvent("on" + type, handler);
    } else {
      element["on" + type] = null;
    }
  },

  getEvent: function (event) {
    return event ? event : window.event;
  },

  getTarget: function (event) {
    return event.target || event.srcElement;
  },

  getWheelDelta: function (event) {
    if (event.wheelDelta) {
      return event.wheelDelta;
    } else {
      return -event.detail * 40;
    }
  },

  preventDefault: function (event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  }

};

function onWheel(event) {

  event = EventUtil.getEvent(event);
  var curElem = EventUtil.getTarget(event);
  var curVal = parseInt(curElem.value);
  var delta = EventUtil.getWheelDelta(event);

  if (delta > 0) {
    curElem.value = curVal + 1;
  } else {
    if (curVal == "0") {
      return
    } else {
      curElem.value = curVal - 1;
    }


  }

  EventUtil.preventDefault(event);

}

function slideInput(node) {
  $(node).hover(function () {
    EventUtil.addHandler(document, 'mousewheel', onWheel);
    EventUtil.addHandler(document, 'DOMMouseScroll', onWheel);
  },
    function () {
      EventUtil.removeHandler(document, 'mousewheel', onWheel);
      EventUtil.removeHandler(document, 'DOMMouseScroll', onWheel);
    });
}