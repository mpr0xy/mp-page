/**
 * Created by mcpr0xy on 15-7-25.
 */
(function(){
  var clickEvent = ('undefined' !== typeof document) && document.ontouchstart ? 'touchstart' : 'click';

  var page = function(path, fn) {
    page.callback[path] = fn;
  }

  $(document).on(clickEvent, onClick);

  $(window).on("popstate", function(event) {
    console.log("popstate");
    console.log(location.hash);
    page.render(location.hash.slice(2), event.originalEvent.state);
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
    history.pushState(page.stateData[path], "", hash);
    page.render(path, "");
  }

  page.render = function(path, data) {
    if (page.callback[path]) {
      page.callback[path](data);
    } else if (page.defaultFunc) {
      page.defaultFunc();
    }
  }

  page.setData = function(path, data) {
    page.stateData[path] = data;
  }

  page.reset = function() {
    var len = history.length;
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

    page.show(el.hash, path);
  }
  window.mpPage = page;
})();
