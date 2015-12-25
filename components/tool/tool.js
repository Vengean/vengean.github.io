/**
 * Created by vengean on 15/11/13.
 */

define([], function() {


    /**
     * 重写jquery ajax方法
     * 若用户未登录则执行ajax配置参数里的offline方法
     * 若用户已登录则执行ajax配置参数里的success方法
     */
    var _ajax = $.ajax;    
    $.ajax = function(opt){  
        var _success = opt && opt.success || function(a, b){};
        var _offline = opt && opt.offline || function(){};
        var _opt = $.extend(opt, {  
            success:function(data, textStatus){  
                // 如果后台将请求重定向到了登录页，则data里面存放的就是登录页的源码，这里需要找到data是登录页的证据(标记)  
                if(typeof data === 'string' && data.indexOf('<html>') != -1) {  
                    _offline();
                    return;  
                }  
                _success(data, textStatus);    
            }
        });  
        _ajax(_opt);  
    };  


    /**
     * 下拉组件
     */
    $.fn.dropdown = function(action) {
        var $this = this;
        if ($this.length > 1) return false;
        switch(action) {
            case 'open':
                _open();
                break;
            case 'close':
                _close();
                break;
            default:
                $this.hasClass('t-open') ? _close() : _open();
                break;
        }

        function _open() {
            $this.addClass('t-open');
        }

        function _close() {
            $this.removeClass('t-open');
        }

        return this;
    }




    /**
     * 模板渲染
     * tpl_name 模板请求路径
     * tpl_data 数据
     */
    function render(tpl_name, tpl_data) {
        // 创建模板缓存对象
        if ( !render.tpl_cache ) {
            render.tpl_cache = {};
        }
        if ( !render.tpl_cache[tpl_name] ) {
            $.ajax({
                url: 'templates/' + tpl_name,
                method: 'GET',
                async: false,
                success: function(data) {
                    render.tpl_cache[tpl_name] = juicer(data);
                },
                error: function(){
                    //showErrorMsg("加载失败，请刷新页面");
                }
            });
        }
        return render.tpl_cache[tpl_name].render(tpl_data);
    }




    /**
     * [debounce 函数两次的调用时间不能小于指定时间]
     * @param  {[function]} func      [待执行函数]
     * @param  {[number]}   wait      [时间间隔]
     * @param  {[boolean]}  immediate [为true时会在wait时间之前先执行一次函数]
     * @return {[function]}           [加工后的函数]
     */
    function debounce(func, wait, immediate) {
        var timeout, args, context, timestamp, result;

        var later = function() {
          var last = new Date() - timestamp;

          if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
          } else {
            timeout = null;
            if (!immediate) {
              result = func.apply(context, args);
              context = args = null;
            }
          }
        };

        return function() {
          context = this;
          args = arguments;
          timestamp = new Date();
          var callNow = immediate && !timeout;
          if (!timeout) timeout = setTimeout(later, wait);
          if (callNow) {
            result = func.apply(context, args);
            context = args = null;
          }

          return result;
        };
    }




    /**
     * 显示提示信息
     * @param  {[type]} _text [description]
     * @return {[type]}       [description]
     */
    function showTip(_text, time) {
        var _time = time ? time : 2000;
        var d = dialog({
            content: _text,
            padding: 50,
            quickClose: true,
            autofocus: false
        });
        d.show();
        setTimeout(function() {
            if (d.open) {
                d.close().remove();
            }
        }, _time);
    }


    /**
     * 显示错误信息
     * @param  {[string]} _text [错误信息]
     */
    function showErropTip(_text, time) {
        var _time = time ? time : 2000;
        var d = dialog({
            content: '<span style="color:#f00;">'+ _text + '</span>',
            padding: 50,
            quickClose: true,
            autofocus: false
        });
        d.show();
        setTimeout(function() {
            if (d.open) {
                d.close().remove();
            }
        }, _time);
    }


    /**
     * 显示获得微币提示
     * @param  {[string]} _text [获得微币原因]
     * @param  {[number]} _vb   [微币数量]
     */
    function getVbTip(_text, _vb) {
        var d = dialog({
            content: _text + '获得'+ _vb +'微币',
            padding: 50,
            quickClose: true,
            autofocus: false
        });
        d.show();
        setTimeout(function() {
            if (d.open) {
                d.close().remove();
            }
        }, 2000);
    }


    /**
     * 幻灯片生成器
     * @param {[string]} _jqSelector [jquery选择器字符串]
     * @param {[object]} _options    [配置对象，目前只有fullScreen（全屏查看）]
     */
    function MyBxslider(_jqSelector, _options) {

        var self = this;                                          // 缓存自身

        var $grandfather  = $(_jqSelector);                       // 根元素
        var $viewport     = $grandfather.find('.main-viewport');  // 主窗口
        var $slides       = $grandfather.find('.slide');          // 图片包容器
        var $pictures     = $grandfather.find('.slide img');      // 图片



        if ($pictures.length == 0) return false;

        /**
         * 当幻灯片只有一个图片时禁止自动轮播
         */
        var bxOption = $pictures.length == 1 ? {
                slideWidth: 0,
                controls:false
            } : {
                slideWidth: 0,
                auto:true,
                pause:3000,
                controls:false
            };
        /**
         * 获取图片容器的宽高
         */
        var slide_w = $slides.eq(0).width(),
            slide_h = $slides.eq(0).height();


        /**
         * 存放图片路径的数组
         */
        self.picsPath = [];

        $pictures.each(function() {
            self.picsPath.push($(this).attr('src'));
        });

        

        /**
         * 调整图片尺寸
         */
        function _resizePics(_elem) {
            var $elem = $(_elem);

            var img_w = $elem.width(),
                img_h = $elem.height();

            if (img_w > slide_w || img_h > slide_h) {
                if (img_w / img_h < slide_w / slide_h) {
                    $elem.height(slide_h);
                } else {
                    $elem.width(slide_w - 3);
                }
            }
        }
        $pictures.each(function(i, elem) {
            if (elem.complete) {
                _resizePics(elem);

            } else {
                elem.onload = function() {
                    _resizePics(elem);
                }
            }
        });


        /**
         * 调用bxslider插件
         */
        self.slide = $viewport.bxSlider(bxOption);

        $grandfather.css('opacity', '1');



        /**
         * 全屏查看轮播图
         */
        if (_options && _options.fullScreen === true) {

            // 添加幻灯片图标
            $grandfather.append('<div class="full-screen"><i class="icon36 i36-2-5"></i></div>');
            var $fullScreen = $grandfather.find('.full-screen');

            // 事件交互
            $viewport.on('mouseenter', function() {
                $fullScreen.show();
            });
            $fullScreen.on('mouseleave', function() {
                $(this).hide();
            }).on('click', function() {

                // 组合幻灯片代码
                var code = '';
                $.each(self.picsPath, function(_index, _val) {
                    code += '<div class="slide"><img src="'+ _val +'"></div>';
                });

                // 全屏幻灯片弹窗
                var bxSliderDialog = dialog({

                    skin      : 'for-fullbox',
                    autofocus : false,
                    fixed     : true,
                    onshow    : function() {

                        var win_w = $(window).width(),
                            win_h = $(window).height();

                        var $fullBxsliderBox = $('.fullBxsliderBox');

                        $fullBxsliderBox.width(win_w - 40);
                        $fullBxsliderBox.find('.slide').height(win_h - 82);

                        var mySlide = new MyBxslider('.fullBxsliderBox');       // 调用本身

                        bxSliderDialog.reset();

                        $fullBxsliderBox.find('.close').on('click', function() {
                            bxSliderDialog.close().remove();
                            mySlide.slide.destroySlider();
                        });

                    },
                    content:  '<div class="bxsliderBox fullBxsliderBox">' +
                                  '<div class="main-viewport">'+ code +'</div>' +
                                  '<a href="javascript:;" class="close"><img src="images/close.png"></a>' +
                              '</div>'

                });
                bxSliderDialog.showModal();
            });

            
        }

    }




    /**
     * 计时器构造器
     * @param {[object]} _params [配置参数]
     * _params = {
     *
     *     numWrapper : [jqObject]  存放数字的jQuery对象
     *     firstNum   : [number]    起点
     *     lastNum    : [number]    终点
     *     step       : [number]    计时频率（毫秒）
     *     reverse    : [boolean]   是否反向计时
     *     startOrder : [function]  计时开始时执行该函数
     *     endOrder   : [function]  计时结束时执行该函数
     *     stepOrder  : [function]  每次跳频时执行该函数
     *     
     * }
     */
    function Countdown(_params) {

        /**
         * 参数校验
         */
        if (!_params || typeof _params.firstNum !== 'number' || typeof _params.lastNum !== 'number') return false;


        /**
         * 初始化变量
         */
        var firstNum  = Math.floor(_params.firstNum),
            lastNum   = Math.floor(_params.lastNum),
            step      = _params.step >= 100 ? _params.step : 1000,
            reverse   = _params.reverse === true ? true : false;

        if (!reverse && firstNum >= lastNum || reverse && firstNum <= lastNum) {
            console.log('Countdown错误：firstNum,lastNum,reverse 参数配置错误');
            return false;
        }

        var interval        = null,
            count           = firstNum,
            isHasNumWrapper = _params.numWrapper.length > 0;


        /**
         * 计时开始
         */
        this.run = function() {
            // 最先执行的函数
            if (_params.startOrder)
                _params.startOrder();

            count = firstNum;
            
            if (isHasNumWrapper) {
                _params.numWrapper.html(count);
            }

            interval = setInterval(function() {

                if (_params.stepOrder)
                    _params.stepOrder();
                
                count = reverse ? count - 1 : count + 1;
                if (isHasNumWrapper) {
                    _params.numWrapper.html(count);
                }

                if (!reverse && count >= lastNum || reverse && count <= lastNum) {
                    clearInterval(interval);
                    if (_params.endOrder) {
                        _params.endOrder();
                    }
                }

            }, step);

        };

        /**
         * 停止计时
         */
        this.stop = function() {

            clearInterval(interval);
            if (_params.endOrder) {
                _params.endOrder();
            }

        };

    }


    /**
     * 时间格式化函数
     * @param  {str/obj} oldStr [旧时间字符串，格式为 "YYYY-MM-dd hh:mm:ss"，其中 “-” 可以是其他符号]
     * @param  {string}  model  [格式化模型：年(YY/YYYY)、月(MM)、日(dd/DD)、时(hh)、分(mm)、秒(ss)。【默认为："YYYY-MM-dd hh:mm:ss"】]
     * @param  {number}  type   [格式化模式切换，默认为0，为0时部分时间返回【XX分钟前】【XX小时前】【昨天】【明天】字样，为 “1” 时强制按照str参数的模式进行格式化]
     * @return {string}         [格式化后的字符串]
     * 应用场景：
     * var oldStr  = '1991-12-22 12:00:00';	// 1991/12/22 12:00:00 也可以，也可以是Date实例对象！
     * var newStr1 = _.timeFormat(oldStr);	// 默认时间格式为【YYYY-MM-dd hh:mm:ss】
     * var newStr2 = _.timeFormat(oldStr, 'YY年MM月dd日');	// 将输出【91年12月22日】，假设现在的时间是1991年12月22日13点，将输出【1小时前】
     * var newStr2 = _.timeFormat(oldStr, 'YY年MM月dd日', 1);	// 将输出【91年12月22日】，即使现在的时间是1991年12月22日13点，还是输出【91年12月22日】
     */
    function timeFormat(oldStr, model, type) {
        
        var _oldStr = oldStr;
        if (!_oldStr) return;
        
        if (_oldStr instanceof Date) {
        	var YYYY 	= _oldStr.getFullYear();	// 年
	        var MM 		= _oldStr.getMonth() + 1;	// 月
	        var dd 		= _oldStr.getDate();		// 日
	        var hh 		= _oldStr.getHours();		// 时
	        var mm 		= _oldStr.getMinutes();		// 分
	        var ss 		= _oldStr.getSeconds();		// 秒
        }else {
			// 分割字符串
	        var splitStr 	= _oldStr.charAt(4);
	        var _array1 	= _oldStr.split(' ');
	        var _array1_1 	= _array1[0].split(splitStr);
	        var _array1_2 	= _array1[1].split(':');

	        YYYY 	= parseInt(_array1_1[0]);		// 年
	        MM 		= parseInt(_array1_1[1]);		// 月
	        dd 		= parseInt(_array1_1[2]);		// 日
	        hh 		= parseInt(_array1_2[0]);		// 时
	        mm 		= parseInt(_array1_2[1]);		// 分
	        ss 		= parseInt(_array1_2[2]);		// 秒
        }
        

        var _model = model ? model : 'YYYY-MM-dd hh:mm:ss';
        var _type  = type ? type : 0;

        if (_type == 0) {

        	var time = new Date(YYYY, MM-1, dd, hh, mm, ss);
	        var now  = new Date();
	        var diff = now - time;

	        if (time.getDate() - now.getDate() == 1) return '明天';

	        if (diff >= 0 && diff < 60000) return '刚刚';
	        if (diff >= 60000 && diff < 3600000) return Math.floor(diff/60000) + '分钟前';
	        if (diff >= 3600000 && diff < 43200000) return Math.floor(diff/3600000) + '小时前';

	        if (time.getDate() == now.getDate()) return '今天';
	        if (time.getDate() - now.getDate() == -1) return '昨天';

	        return _fixed();

        }else {
        	return _fixed();
        }

        // 内部函数，返回固定格式
        function _fixed() {
        	var reg = /(YYYY)|(YY)|(MM)|(dd)|(DD)|(hh)|(mm)|(ss)/g;
        	return _model.replace(reg, function(t) {
				switch(t) {
					case 'YYYY':
						return YYYY;
					case 'YY':
						return YYYY % 100;
					case 'MM':
						return MM < 10 ? '0'+MM : MM;
					case 'dd':
						return dd < 10 ? '0'+dd : dd;
					case 'DD':
						return dd < 10 ? '0'+dd : dd;
					case 'hh':
						return hh < 10 ? '0'+hh : hh;
					case 'mm':
						return mm < 10 ? '0'+mm : mm;
					case 'ss':
						return ss < 10 ? '0'+ss : ss;
					default:
						return 'XX';
				}
			});
        }

    }


    /**
     * 返回分页代码
     * @param  {object} param [分页参数]
     * {
     *     offset   [当前第一条信息位置]
     *     unit     [一页最多容纳信息数]
     *     count    [信息总条数]
     * }
     * @return {string}       [html code]
     */
    function pageControl(param) {

        var html    = '<div class="pageControl">';          // 代码字符串

        var _offset = param.offset ? param.offset : 0,
            _unit   = param.unit ? param.unit : 10,
            _count  = param.count ? param.count : 0;

        var _prevOffset = _offset - _unit,
            _nextOffset = _offset + _unit;

        var pageCount   = Math.ceil(_count / _unit);

        var currentPage = Math.floor(_offset / _unit) + 1;

        if (_count == 0) {
            html += '</div>';
        } else {
            html += '<a class="prev '+ (_offset <= 0 ? 'disable' : '') +'" href="javascript:;" title="上一页" data-offset="'+ (_prevOffset > 0 ? _prevOffset : 0) +'"></a>';

            if (pageCount <= 9) {
                for (var i = 1; i <= pageCount; i++) {
                    html += '<a class="page-num '+ (i == currentPage ? 'on' : '') +'" href="javascript:;" data-offset="'+ (i-1)*_unit +'">'+ i +'</a>';
                }
            } else if (currentPage <= 5) {
                for (var i = 1; i < 9; i++) {
                    html += '<a class="page-num '+ (i == currentPage ? 'on' : '') +'" href="javascript:;" data-offset="'+ (i-1)*_unit +'">'+ i +'</a>';
                }
                html += '<span>...</span><a class="page-num" href="javascript:;" data-offset="'+ (pageCount-1)*_unit +'">'+ pageCount +'</a>';
            } else if (pageCount - currentPage < 5) {
                html += '<a class="page-num" href="javascript:;" data-offset="0">1</a><span>...</span>';
                for (var i = pageCount - 7; i <= pageCount; i++) {
                    html += '<a class="page-num '+ (i == currentPage ? 'on' : '') +'" href="javascript:;" data-offset="'+ (i-1)*_unit +'">'+ i +'</a>';
                }
            } else {
                html += '<a class="page-num" href="javascript:;" data-offset="0">1</a><span>...</span>';
                for (var i = currentPage - 3; i <= currentPage + 3; i++) {
                    html += '<a class="page-num '+ (i == currentPage ? 'on' : '') +'" href="javascript:;" data-offset="'+ (i-1)*_unit +'">'+ i +'</a>';
                }
                html += '<span>...</span><a class="page-num" href="javascript:;" data-offset="'+ (pageCount-1)*_unit +'">'+ pageCount +'</a>';
            }

            html += '<a class="next '+ (_nextOffset >= _count ? 'disable' : '') +'" href="javascript:;" title="下一页" data-offset="'+ _nextOffset +'"></a></div>';
        }
        return html;

    }






    return {

        render        : render,
        debounce      : debounce,
        showTip       : showTip,
        showErropTip  : showErropTip,
        getVbTip      : getVbTip,
        MyBxslider    : MyBxslider,
        Countdown     : Countdown,
        timeFormat    : timeFormat,
        pageControl   : pageControl

    };

});