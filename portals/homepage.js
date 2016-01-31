/**
 * Created by vengean on 15/11/13.
 */

define(['event', 'tool', 'homeCards', 'juicer', 'fancyBox', 'popdown'], function(globalEvent, _ , homeCards) {


	var $cardWall 			= $('.cardWall');
	var $cardWall_center 	= $cardWall.find('.cardWall-center');
	var $cardWall_li 		= $cardWall_center.find('.cardWall__ul__li');
	var $cardWall_leftBtns	= $('.cardWall-left a');
	var $cardWall_rightBtns	= $('.cardWall-right a');

	var isAllowClick 		= false;	// 是否允许点击

	var home = {
		// 事件绑定
		eventHandle: function() {
			// 窗口改变时调整布局
			$(window).resize(_.debounce(function() {
				cardWall.layout();
			}, 200));
		},

		init: function() {
			//globalEvent.hover();
			this.eventHandle();
		}
		

	};

	/**
	 * 卡片墙对象
	 * 包括对卡片墙的初始化，事件绑定，以及部分卡片模板的储存
	 */
	var cardWall = {

		// 卡片墙左右导航按钮预定css样式
		leftNavItemCss: [
			{'top':'34px','left':'30px','opacity':1,'visibility':'visible','z-index':2},
			{'top':'20px','left':'60px','opacity':1,'visibility':'visible','z-index':3},
			{'top':'20px','left':'130px','opacity':0,'visibility':'hidden','z-index':4},
			{'top':'58px','left':'-12px','opacity':0,'visibility':'hidden','z-index':1},
			{'top':'58px','left':'-12px','opacity':0,'visibility':'hidden','z-index':1}
		],
		rightNavItemCss: [
			{'top':'34px','left':'50px','opacity':1,'visibility':'visible','z-index':2},
			{'top':'58px','left':'92px','opacity':0,'visibility':'hidden','z-index':1},
			{'top':'20px','left':'-50px','opacity':0,'visibility':'hidden','z-index':4},
			{'top':'20px','left':'20px','opacity':1,'visibility':'visible','z-index':3},
			{'top':'34px','left':'50px','opacity':1,'visibility':'visible','z-index':2}
		],

		nextIndex: 1,		// 为自动轮播服务的按钮坐标
		count: 0,			// 初始化轮播时间
		size: 4,			// 轮播窗口个数

		// 事件绑定
		eventHandle: function() {

			isAllowClick = true;	// 一开始卡片墙的导航按钮是允许点击的

			/**
			 * 点击导航按钮
			 */
			$cardWall.on('click', '.cardWall-nav-item', function(e) {

				if (!isAllowClick) return false;
				isAllowClick = false;

				// 初始化轮播时间
				cardWall.count = 0;

				var $this 		= $(this);
				var	dir 		= $this.data('dir'),	// 是左边的按钮还是右边的按钮
					type 		= $this.data('type'),	// 按钮类型
					index 		= $this.index(),
					newElems 	= [],
					oldElems 	= [];
				// 点击左右两边不同的按钮加载不同的卡片切换动画
				var animate = dir === 'left' ? ['moveToBack_right', 'moveToFront_right'] : ['moveToBack_left', 'moveToFront_left'];

				// 导航按钮样式切换
				for (var i = 0; i < cardWall.size; i++) {
					$cardWall_leftBtns.eq((index + cardWall.size + i - 2) % cardWall.size).css(cardWall.leftNavItemCss[i]);
					$cardWall_rightBtns.eq((index + cardWall.size + i - 2) % cardWall.size).css(cardWall.rightNavItemCss[i]);
				}

				cardWall.nextIndex = (index + cardWall.size - 1) % cardWall.size;

				$cardWall_li.each(function(_index) {
					var $this = $(this);

					oldElems[_index] = newElems[_index] ? newElems[_index] : $this.children();
					newElems[_index] = _index === 0 ? homeCards[type].firstCard : homeCards[type].cards[_index - 1];
					oldElems[_index].addClass(animate[0]);
					$this.append(newElems[_index].addClass(animate[1]));
					setTimeout(function() {
						oldElems[_index].remove().removeClass(animate[0]);
						newElems[_index].removeClass(animate[1]);
						isAllowClick = true;
					}, 1200);
				});

				if(type === 'exercise') {
					$('.popdown').popdown();
				}
			});
		},

	init: function() {

			var compiled_tpl;	// 缓存模板
			cardWall.layout();		// 初始化布局

			$.ajax({
				type: 'GET',
		        url: 'static/data/photo.json',
		        dataType: 'json',
		        async: false,
		        success : function(data) {
		    		compiled_tpl = juicer(homeCards.photo.tpl);
		    		$cardWall_li.eq(0).append(homeCards.photo.firstCard);
		    		for (var i = 0; i < data.length; i++) {
		    			homeCards.photo.cards[i] = $(compiled_tpl.render(data[i]));
		    			$cardWall_li.eq(i+1).append(homeCards.photo.cards[i]);
		    		}
					$('.fancybox').fancybox();
		        },
		        error : function() {}
			});

			$.ajax({
				type: 'GET',
				url: 'static/data/blog.json',
				dataType: 'json',
				success : function(data) {
					compiled_tpl = juicer(homeCards.blog.tpl);
					for (var i = 0; i <data.length; i++) {
						homeCards.blog.cards[i] = $(compiled_tpl.render(data[i]));
					}
				},
				error : function(jqXHR) { }
			});

			$.ajax({
				type: 'GET',
				url: 'static/data/vendor.json',
				dataType: 'json',
				success : function(data) {
					compiled_tpl = juicer(homeCards.framework.tpl);
					for (var i = 0; i <data.length; i++) {
						homeCards.framework.cards[i] = $(compiled_tpl.render(data[i]));
					}
				},
				error : function(jqXHR) { }
			});

			$.ajax({
				type: 'GET',
				url: 'static/data/exercise.json',
				dataType: 'json',
				success : function(data) {
					compiled_tpl = juicer(homeCards.exercise.tpl);
					for (var i = 0; i <data.length; i++) {
						homeCards.exercise.cards[i] = $(compiled_tpl.render(data[i]));
					}
				},
				error : function(jqXHR) { }
			});

			this.eventHandle();

			// 自动轮播
			// setInterval(function() {
			// 	cardWall.count++;
			// 	if (cardWall.count == 3) {
			// 		$cardWall_leftBtns.eq(cardWall.nextIndex).click();
			// 	}
			// }, 2000);

		},

		// 窗口变小时容纳6张卡片，变大时容纳8张
		layout: function() {
			var win_w = $(window).width();
			if (win_w < 900) {
				$cardWall_center.width(288);
				$cardWall.width(588);
				$cardWall_li.slice(4, 8).hide();
				$('.home__sharebar, .home__foot-left').hide();
			} else if (win_w < 1200) {
				$cardWall_center.width(586);
				$cardWall.width(886);
				$cardWall_li.slice(4, 8).hide();
				$('.home__sharebar, .home__foot-left').hide();
			} else if(win_w < 1550) {
				$cardWall_center.width(884);
				$cardWall.width(1184);
				$cardWall_li.slice(4, 6).show();
				$cardWall_li.slice(6, 8).hide();
				$('.home__sharebar, .home__foot-left').show();
			} else {
				$cardWall_center.width(1182);
				$cardWall.width(1482);
				$cardWall_li.slice(4, 8).show();
				$('.home__sharebar, .home__foot-left').show();
			}
		}

	};


	return {

		run: function() {
			cardWall.init();
			home.init();
		}

	};


});

