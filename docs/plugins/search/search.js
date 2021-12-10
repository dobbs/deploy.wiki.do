"use strict";

(function () {
  var bind, emit, expand;

  expand = function expand(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\*(.+?)\*/g, '<i>$1</i>');
  };

  emit = function emit($item, item) {
    var flag, handle, keystroke, parse, report, search, status, success, twins;

    flag = function flag(slug, site) {
      return "<img class=\"remote\"\n  title=\"".concat(site, "\"\n  src=\"http://").concat(site, "/favicon.png\"\n  data-site=\"").concat(site, "\"\n  data-slug=\"").concat(slug, "\">");
    };

    twins = function twins(slug, sites) {
      var site;
      return "".concat(slug.replace(/-/g, ' '), "<br>").concat(function () {
        var i, len, results;
        results = [];

        for (i = 0, len = sites.length; i < len; i++) {
          site = sites[i];
          results.push(flag(slug, site));
        }

        return results;
      }().join(' '));
    };

    report = function report(result) {
      var sites, slug;
      return function () {
        var results;
        results = [];

        for (slug in result) {
          sites = result[slug];
          results.push(twins(slug, sites));
        }

        return results;
      }().join('<br>');
    };

    $item.append(item.result != null ? "<div class=report>".concat(report(item.result), "</div>") : "<div style=\"width:93%; background:#eee; padding:16px; margin-bottom:5px; text-align: center;\">\n  <span>".concat(expand(item.text), "<br></span>\n  <p class=\"caption\">ready</p>\n  <div class=report style=\"text-align:left;\"></div>\n</div>"));

    status = function status(text) {
      return $item.find('p.caption').text(text);
    };

    success = function success(data, elapsed) {
      status("".concat(Object.keys(data.result).length, " titles, ").concat(elapsed, " sec"));
      return $item.find('.report').append(report(data.result));
    };

    search = function search(request) {
      var quickly, url;
      url = "http://".concat(item.site || 'search.fed.wiki.org:3030', "/match");
      console.log('search', request);

      quickly = function quickly() {
        var start;
        start = Date.now();
        return function (data) {
          var stop;
          stop = Date.now();
          return success(data, (stop - start) / 1000.0);
        };
      };

      $.post(url, request, quickly(), 'json').fail(function (e) {
        return status("search failed: ".concat(e.responseText || e.statusText));
      });
      $item.find('.report').empty();
      return status("searching");
    };

    keystroke = function keystroke(e) {
      var input, request;

      if (e.keyCode === 13) {
        input = $item.find('input').val();

        if (input.match(/\w/)) {
          request = $.extend({}, $item.request);
          request.query += " ".concat(input);
          return search(request);
        }
      }
    };

    handle = function handle(request) {
      if (request.input) {
        $item.request = request;
        return $item.find('span').append('<input type=text style="width: 95%;"></input>').keyup(keystroke);
      } else if (request.search) {
        $item.request = request;
        return $item.find('span').append('<button>search</button>').click(function () {
          return search(request);
        });
      } else {
        return search(request);
      }
    };

    parse = function parse(text) {
      var request;
      request = {};
      text = text.replace(/\b(AND|OR)\b/g, function (op) {
        request.match = op.toLowerCase();
        return '';
      });
      text = text.replace(/\b(ALL)\b/, function (op) {
        request.match = 'and';
        return '';
      });
      text = text.replace(/\b(ANY)\b/, function (op) {
        request.match = 'or';
        return '';
      });
      text = text.replace(/\b(WORDS|LINKS|SITES|SLUGS|ITEMS|PLUGINS)\b/g, function (op) {
        request.find = op.toLowerCase();
        return '';
      });
      text = text.replace(/\b(INPUT)\b/, function (op) {
        request.input = true;
        return '';
      });
      text = text.replace(/\b(SEARCH)\b/, function (op) {
        request.search = true;
        return '';
      });
      request.query = text;
      return request;
    };

    if (item.text != null) {
      return handle(parse(item.text));
    }
  };

  bind = function bind($item, item) {
    $item.dblclick(function () {
      return wiki.textEditor($item, item);
    });
    return $item.find('input').dblclick(function () {
      return false;
    });
  };

  if (typeof window !== "undefined" && window !== null) {
    window.plugins.search = {
      emit: emit,
      bind: bind
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = {
      expand: expand
    };
  }
}).call(void 0);
//# sourceMappingURL=search.js.map
