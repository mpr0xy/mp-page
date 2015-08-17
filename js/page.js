/**
 * Created by mcpr0xy on 15-7-25.
 */
(function(){
  var clickEvent = ('undefined' !== typeof document) && document.ontouchstart ? 'touchstart' : 'click';

  var page = function(path, option) {
    page.callback[path] = {}
    // 如果只有一个函数，就是启动函数
    if (isFunction(option)) {
      page.callback[path].start = option;
    }
    // 如果是对象，就提取开始函数和结束函数
    if (isObject(option)) {
      page.callback[path].start = option.start;
      page.callback[path].end = option.end;
    }
  }

  $(document).on(clickEvent, onClick);

  $(window).on("popstate", function(event) {
    console.log("popstate");
    console.log(location.hash);
    var lastPath = event.originalEvent.state.path;
    page.render(location.hash.slice(2), page.stateData[lastPath]);
  });

  page.callback = {};
  page.stateData = {};

  page.show = function(hash, path) {
    var _num = history.state ? ((history.state._num !== undefined) ? history.state._num + 1 : 0) : 0;

    if (page.stateData[path]) {
      page.stateData[path]._num = _num;
    } else {
      page.stateData[path] = {
        _num: _num
      }
    }
    history.pushState({"path": path}, "", hash);
    page.render(path, "");
  }

  page.render = function(path, data) {
    if (page.callback[path] && page.callback[path].start) {
      page.callback[path].start(data);
    } else if (page.defaultFunc) {
      page.defaultFunc();
    }
  }

  page.setData = function(path, data) {
    page.stateData[path] = data;
  }

  page.reset = function() {
    if (history.state && (history.state._num !== undefined)) {
      history.go(-(history.state._num + 1));
    }
  }

  page.start = function(fn) {
    if (fn) {
      page.defaultFunc = fn;
    }
    page.render(location.hash.slice(2));
  }

  function onClick(e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return;

    // ensure link
    var el = e.target;
    while (el && 'A' !== el.nodeName) el = el.parentNode;
    if (!el || 'A' !== el.nodeName) return;

    // Ignore if tag has
    // 1. "download" attribute
    // 2. rel="external" attribute
    // 3. has target
    if (el.hasAttribute('download')
      || el.getAttribute('rel') === 'external'
      || el.target) {
      return;
    }

    var link = el.getAttribute('href');
    // Check for mailto: in the href
    if (link && link.indexOf('mailto:') > -1) return;

    e.preventDefault();

    var pathIndex = el.hash.indexOf('#!');
    var path = ~pathIndex ? el.hash.slice(pathIndex + 2) : '';

    // 添加路由结束函数
    var currentHref = window.location.hash;
    var cPathIndex = currentHref.indexOf('#!');
    var cPath = ~cPathIndex ? currentHref.slice(cPathIndex + 2) : '';
    if (page.callback[cPath] && page.callback[cPath].end) {
      page.callback[cPath].end();
    }

    page.show(link, path);
  }

  function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }

  function isObject(object) {
    return object !== null && (typeof object === 'object')
  }

  window.mpPage = page;
})();
