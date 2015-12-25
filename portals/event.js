/**
 * Created by vengean on 15/11/13.
 */

define(['tool'], function(_) {
	var globalEvent;
	
	return globalEvent = {
		types : "",
		/**
		 * 鼠标悬浮于class为js-hover的元素时让该元素内部的data-target指定的内部元素显示或隐藏
		 */
		hover : function() {
			$(document).on('mouseenter mouseleave', '.js-hover', function(e) {
				var $this 	= $(this);
				var	$target = $this.find($this.data('target'));

				// 失去焦点的时候让元素渐隐
				if ($this.data('fade') === 'fade-out') {
					if (e.type == 'mouseenter') {
						$this.addClass('hover');
						$target.addClass('show');
					} else {
						$this.removeClass('hover');
						$target.removeClass('show');
					}
				} else {
					if (e.type == 'mouseenter') {
						$this.addClass('hover');
						// $target.css('display', 'block');
						$target.addClass('show');	// 让列表出现transition效果
						// setTimeout(function() { $target.addClass('show'); }, 20);	// 让列表出现transition效果
					} else {
						$this.removeClass('hover');
						// $target.css('display', 'none').removeClass('show');
						$target.removeClass('show');
					}
				}
			});
		},

		/**
		 * 标签点击切换样式
		 */
		tag : function(callback) {
			$.ajax({
				url: 	'portalIndex/industryinfo/list.html',
				type: 	'POST',
				data: 	{},
				success: function (data) {
					var tagHtml = '<a href="javascript:;" data-id=0 class="jsAll active">全部</a>';
					if(!data.code){
						for(var i=0;i<data.length;i++){
							tagHtml += '<a href="javascript:;" class="jsOption" data-id='+data[i].industryCode+'>'+data[i].industryName+'</a>';
						}
						$('.js-tag').html(tagHtml);
					}
				}
			});

			$('.js-tag').on('click', 'a', function(e) {
				if($(this).is('.jsAll')){
					$(this).addClass("active");
					$(".jsOption").removeClass("active");
					globalEvent.types="";
				}else{
					$(this).toggleClass('active');
					if($(".jsOption").hasClass("active")){
						$(".jsAll").removeClass("active");
					}else{
						$(".jsAll").addClass("active");
					}
					var param="types="+$(this).data("id")+"&";
					if($(this).is('.active')){
						globalEvent.types+=param;
					}else{
						globalEvent.types=globalEvent.types.replace(param,"");
					}
				}
				if(callback){
					callback(globalEvent.types);
				}
			});
		},
		
		/**
		 * 下拉组件元素点击事件
		 */
		dropdown : function() {
			$('.dropdown').on('click', 'a', function(e) {
				var $this 		 = $(this),
					$this_parent = $this.parents('.dropdown'),
					$sublist 	 = $this_parent.find('.dropdown-list');

				$this_parent.find('.dropdown-val').text($this.text());
				$sublist.removeClass('show');
				// $sublist.css('display', 'none').removeClass('show');
				// setTimeout(function() { $sublist.css('display', 'block'); }, 100);
			});
		},

		/**
		 * 侧边栏随窗口滚动而移动
		 */
		aside : function(height) {
			// var baseHeight = height && height > 0 ? height : 0;
			// $(window).scroll(_.debounce(function() {
			// 	var top = $(this).scrollTop();
			// 	if (top >= baseHeight) {
			// 		$('.aside').css('top', top - baseHeight);
			// 	} else {
			// 		$('.aside').css('top', 0);
			// 	}
			// }, 150));
		},

		/**
		 * 切换宽口
		 */
		switchBox : function() {
			$('.switch-header').on('click', '.switch-btn', function(e) {
				var $this = $(this);
				var $ownSwitch = $this.parents('.switchBox');

				$ownSwitch.find('.pages').removeClass('show');
				$ownSwitch.find($this.data('target')).addClass('show');
				$this.siblings().removeClass('active');
				$this.addClass('active');
			});
		}
	};
});