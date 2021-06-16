var ui = (function (document, undefined) {
	var readyRE = /complete|loaded|interactive/;
	var classSelectorRE = /^\.([\w-]+)$/;
	var $ = function (selector, context) {
		context = context || document;
		if (typeof selector === 'string') {
			try {
				selector = selector.trim();
				return wrap($.qsa(selector, context), selector);
			} catch (e) {}
		}

	};

	var wrap = function (dom, selector) {
		dom = dom || [];
		Object.setPrototypeOf(dom, $.fn);
		dom.selector = selector || '';
		return dom;
	};

	/**
	 * extend(simple)
	 * @param {type} target
	 * @param {type} source
	 * @param {type} deep
	 * @returns {unresolved}
	 */
	$.extend = function () { //from jquery2
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		if (typeof target === "boolean") {
			deep = target;

			target = arguments[i] || {};
			i++;
		}

		if (typeof target !== "object" && !$.isFunction(target)) {
			target = {};
		}

		if (i === length) {
			target = this;
			i--;
		}



		return target;
	};

	/**
	 * ui slice(array)
	 */
	$.slice = [].slice;
	/**
	 * ui filter(array)
	 */
	$.filter = [].filter;

	$.type = function (obj) {
		return obj == null ? String(obj) : class2type[{}.toString.call(obj)] || "object";
	};
	/**
	 * ui isArray
	 */


	/**
	 * ui isFunction
	 */
	$.isFunction = function (value) {
		return $.type(value) === "function";
	};
	/**
	 * ui querySelectorAll
	 * @param {type} selector
	 * @param {type} context
	 * @returns {Array}
	 */
	$.qsa = function (selector, context) {
		context = context || document;
		return $.slice.call(classSelectorRE.test(selector) ? context.getElementsByClassName(RegExp.$1) : tagSelectorRE.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
	};
	/**
	 * ready(DOMContentLoaded)
	 * @param {type} callback
	 * @returns {_L6.$}
	 */
	$.ready = function (callback) {
		if (readyRE.test(document.readyState)) {
			callback($);
		} else {
			document.addEventListener('DOMContentLoaded', function () {
				callback($);
			}, false);
		}
		return this;
	};
	/**
	 * 将 fn 缓存一段时间后, 再被调用执行
	 * 此方法为了避免在 ms 段时间内, 执行 fn 多次. 常用于 resize , scroll , mousemove 等连续性事件中;
	 * 当 ms 设置为 -1, 表示立即执行 fn, 即和直接调用 fn 一样;
	 * 调用返回函数的 stop 停止最后一次的 buffer 效果
	 * @param {Object} fn
	 * @param {Object} ms
	 * @param {Object} context
	 */
	$.buffer = function (fn, ms, context) {
		var timer;
		var lastStart = 0;
		var lastEnd = 0;
		var ms = ms || 150;

		function run() {
			if (timer) {
				timer.cancel();
				timer = 0;
			}
			lastStart = $.now();
			fn.apply(context || this, arguments);
			lastEnd = $.now();
		}

		return $.extend(function () {
			if (
				(!lastStart) || // 从未运行过
				(lastEnd >= lastStart && $.now() - lastEnd > ms) || // 上次运行成功后已经超过ms毫秒
				(lastEnd < lastStart && $.now() - lastStart > ms * 8) // 上次运行或未完成，后8*ms毫秒
			) {
				run();
			} else {
				if (timer) {
					timer.cancel();
				}
				timer = $.later(run, ms, null, arguments);
			}
		}, {
			stop: function () {
				if (timer) {
					timer.cancel();
					timer = 0;
				}
			}
		});
	};
	/**
	 * each
	 * @param {type} elements
	 * @param {type} callback
	 * @returns {_L8.$}
	 */
	$.each = function (elements, callback, hasOwnProperty) {
		if (!elements) {
			return this;
		}
		if (typeof elements.length === 'number') {
			[].every.call(elements, function (el, idx) {
				return callback.call(el, idx, el) !== false;
			});
		} else {

		}
		return this;
	};

	/**
	 * getStyles
	 * @param {type} element
	 * @param {type} property
	 * @returns {styles}
	 */
	$.getStyles = function (element, property) {
		var styles = element.ownerDocument.defaultView.getComputedStyle(element, null);
		if (property) {
			return styles.getPropertyValue(property) || styles[property];
		}
		return styles;
	};

	/**
	 * setTimeout封装
	 * @param {Object} fn
	 * @param {Object} when
	 * @param {Object} context
	 * @param {Object} data
	 */
	$.later = function (fn, when, context, data) {
		when = when || 0;
		var m = fn;
		var d = data;
		var f;
		var r;

		if (typeof fn === 'string') {
			m = context[fn];
		}



		r = setTimeout(f, when);

		return {
			id: r,
			cancel: function () {
				clearTimeout(r);
			}
		};
	};
	$.now = Date.now || function () {
		return +new Date();
	};
	var class2type = {};
	$.each(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'], function (i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});

	$.fn = {
		each: function (callback) {
			[].every.call(this, function (el, idx) {
				return callback.call(el, idx, el) !== false;
			});
			return this;
		}
	};


	return $;
})(document);

(function ($, window) {
	if ('ontouchstart' in window) {
		$.EVENT_MOVE = 'touchmove';
	} else {
		$.EVENT_MOVE = 'mousemove';
	}
	var CLASS_ACTIVE = 'active';
	var rgbaRegex = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/;
	var getColor = function (colorStr) {
		var matches = colorStr.match(rgbaRegex);
		if (matches && matches.length === 5) {
			return [
				matches[1],
				matches[2],
				matches[3],
				matches[4]
			];
		}
		return [];
	};

	var Transparent = function (element, options) {
		this.element = element;
		this.options = {
			top: 0, //距离顶部高度(到达该高度即触发)
			offset: 150, //滚动透明距离档设定top值后offset也会随着top向下延伸
			duration: 16, //过渡时间
			scrollby: window
		}, options || {};
    
		this.scrollByElem = this.options.scrollby || window;
		if (!this.scrollByElem) {
			throw new Error("监听滚动的元素不存在");
		}
		this.isNativeScroll = false;
		if (this.scrollByElem === window) {
			this.isNativeScroll = true;
		} else if (!~this.scrollByElem.className.indexOf('scroll-wrapper')) {
			this.isNativeScroll = true;
		}

		this._style = this.element.style;
		this._bgColor = this._style.backgroundColor;
		var color = getColor(ui.getStyles(this.element, 'backgroundColor'));
		console.log(this.options.duration)
		if (color.length) {
			this._R = color[0];
			this._G = color[1];
			this._B = color[2];
			this._A = parseFloat(color[3]);
			this.lastOpacity = this._A;
			this._bufferFn = $.buffer(this.handleScroll, this.options.duration, this);
			this.initEvent();
		} else {
			throw new Error("元素背景颜色必须为RGBA");
		}
	};

	Transparent.prototype.initEvent = function () {
		this.scrollByElem.addEventListener('scroll', this._bufferFn);
		if (this.isNativeScroll) { //原生scroll
			this.scrollByElem.addEventListener($.EVENT_MOVE, this._bufferFn);
		}
	}
	Transparent.prototype.handleScroll = function (e) {
		var y = window.scrollY;
		if (!this.isNativeScroll && e && e.detail) {
			y = -e.detail.y;
		}
		var opacity = (y - this.options.top) / this.options.offset + this._A; //实时变动
		opacity = Math.min(Math.max(this._A, opacity), 1);
		this._style.backgroundColor = 'rgba(' + this._R + ',' + this._G + ',' + this._B + ',' + opacity + ')';
		//alert (opacity)
		if (opacity > this._A) {
			this.element.classList.add(CLASS_ACTIVE);
		} else {
			this.element.classList.remove(CLASS_ACTIVE);
		}

	};
	Transparent.prototype.destory = function () {
		this.scrollByElem.removeEventListener('scroll', this._bufferFn);
		this.scrollByElem.removeEventListener($.EVENT_MOVE, this._bufferFn);
		this.element.style.backgroundColor = this._bgColor;
		this.element.ui_plugin_transparent = null;
	};
	$.fn.transparent = function (options) {
		options = options || {};
		var transparentApis = [];
		this.each(function () {
			var transparentApi = this.ui_plugin_transparent;
			if (!transparentApi) {
				var top = this.getAttribute('data-top');
				var offset = this.getAttribute('data-offset');
				var duration = this.getAttribute('data-duration');
				var scrollby = this.getAttribute('data-scrollby');
				if (top !== null && typeof options.top === 'undefined') {
					options.top = top;
				}
				if (offset !== null && typeof options.offset === 'undefined') {
					options.offset = offset;
				}
				if (duration !== null && typeof options.duration === 'undefined') {
					options.duration = duration;
				}
				if (scrollby !== null && typeof options.scrollby === 'undefined') {
					options.scrollby = document.querySelector(scrollby) || window;
				}
				transparentApi = this.ui_plugin_transparent = new Transparent(this, options);
			}
			transparentApis.push(transparentApi);
		});
		return transparentApis.length === 1 ? transparentApis[0] : transparentApis;
	};
})(ui, window);

	ui('.bar-transparent').transparent();
