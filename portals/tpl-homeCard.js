/**
 * Created by vengean on 15/11/13.
 */

define([], function() {

	/**
	 * 放置卡片的html代码，其中
	 * firstCard 为每种类型卡片的第一张卡片
	 * tpl 为每种类型卡片的模板
	 * cards 用来缓存卡片经渲染之后的html代码
	 */
	return {

		photo: {
			firstCard: $('<div class="homeCard_first" style="background-color:#FD989A;">' +
							'<h1>美图</h1>' +
							'<p>我是摄影爱好者,也喜欢铅笔画和平面设计,这些是我的作品</p>' +
						 '</div>'),

			tpl: '<a href="${imgUrl}" class="homeCard_B homeCard_init fancybox">' +
                '<div class="image-1"><div class="inner"><img src="${imgUrl}"></div></div>' +
                '<h2 class="text-1">${title}</h2>' +
                '<p class="text-2"></p>' +
                '<p class="text-3">{@if(describe)}${describe}{@else}暂无简介{@/if}</p>' +
                '</a>',
			cards: []
		},

		blog: {
			firstCard: $('<div class="homeCard_first" style="background-color:#F2D169;">' +
				'<h1>博文</h1>' +
				'<p>一些自己写的或是值得推荐一看的博文</p>' +
				'</div>'),

			tpl: '<a href="${url}" class="homeCard_B homeCard_init" target="_blank">' +
			'<h2 class="text-1">${title}</h2>' +
			'<p class="text-2"></p>' +
			'<p class="text-3">{@if(describe)}${describe}{@else}暂无简介{@/if}</p>' +
			'</a>',
			cards: []
		},

		framework: {
			firstCard: $('<div class="homeCard_first" style="background-color:#8c78e0;">' +
				'<h1>框架</h1>' +
				'<p>前端技术发展突飞猛进,要想前端工程化,是离不开框架的</p>' +
				'</div>'),

			tpl: '<a href="${url}" class="homeCard_B homeCard_init" target="_blank">' +
			'<div class="image-2"><div class="vendor-img-div"><img src="${icon}" class="vendor-img"></div></div>' +
			'<h2 class="text-1">${title}</h2>' +
			'<p class="text-2"></p>' +
			'<p class="text-3">{@if(describe)}${describe}{@else}暂无简介{@/if}</p>' +
			'</a>',
			cards: []
		},

		exercise: {
			firstCard: $('<div class="homeCard_first" style="background-color:#66CCFF">' +
				'<h1>练习</h1>' +
				'<p>不积硅步无以至千里,每天学习进步一点点,必有所成</p>' +
				'</div>'),

			tpl: '<a href="${url}" class="homeCard_B homeCard_init popdown" target="_blank">' +
			'<h2 class="text-1">${title}</h2>' +
			'<p class="text-2"></p>' +
			'<p class="text-3">{@if(describe)}${describe}{@else}暂无简介{@/if}</p>' +
			'</a>',
			cards: []
		}
	};

});
