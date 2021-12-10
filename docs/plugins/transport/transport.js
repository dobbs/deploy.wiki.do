"use strict";

(function () {
  var beam, bind, emit, expand, graphData, graphStats, options, report;

  expand = function expand(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\*(.+?)\*/g, '<i>$1</i>');
  };

  beam = function beam(url) {
    return $.getJSON(url, function (page) {
      var resultPage;
      resultPage = wiki.newPage(page);
      return wiki.showResult(resultPage);
    });
  };

  graphData = function graphData($item) {
    var candidates, each, graphs, i, len;
    graphs = [];
    candidates = $(".item:lt(".concat($('.item').index($item), ")"));

    for (i = 0, len = candidates.length; i < len; i++) {
      each = candidates[i];

      if ($(each).hasClass('graph-source')) {
        graphs.push(each.graphData());
      }
    }

    return graphs;
  };

  graphStats = function graphStats($item) {
    var arc, arcs, candidates, each, graphs, i, len, node, nodes, ref;
    graphs = nodes = arcs = 0;
    candidates = $(".item:lt(".concat($('.item').index($item), ")"));

    for (i = 0, len = candidates.length; i < len; i++) {
      each = candidates[i];

      if ($(each).hasClass('graph-source')) {
        graphs += 1;
        ref = each.graphData();

        for (node in ref) {
          arc = ref[node];
          nodes += 1;
          arcs += arc.length;
        }
      }
    }

    return {
      graphs: graphs,
      nodes: nodes,
      arcs: arcs
    };
  };

  report = function report(object) {
    return "<pre style=\"text-align: left; background-color:#ddd; padding:8px;\"\">".concat(JSON.stringify(object, null, '  '), "</pre>");
  };

  options = function options(text) {
    var domain, graph, m, post;

    if (m = text.match(/(https?:\/\/.*?\/)/)) {
      domain = m[1];
    }

    if (m = text.match(/\bPOST\b\s*(.*)/)) {
      post = m[1];
    }

    graph = !!text.match(/\bGRAPH\b/);
    return {
      domain: domain,
      post: post,
      graph: graph
    };
  };

  emit = function emit($item, item) {
    var opt;
    opt = options(item.text);
    $item.append("<div style=\"background-color:#eee;padding:15px;text-align:center;\">\n  <div class=preview>\n  </div>\n  <p class=transport-action>\n    transporting through<br>\n    ".concat(expand(item.text), "\n  </p>\n  <p class=caption>\n    unavailable\n  </b>\n</div>"));

    if (opt.domain) {
      $.get(opt.domain, function () {
        return $item.find('.caption').text('ready');
      });
    }

    if (opt.graph) {
      $item.find('.preview').html(report(graphStats($item)));
      return $item.find('.transport-action').append("<p><button>Beam Up</button></p>");
    }
  };

  bind = function bind($item, item) {
    var opt, post;
    opt = options(item.text);
    $item.dblclick(function () {
      return wiki.textEditor($item, item);
    });
    $item.find('button').click(function (e) {
      return post(e, graphData($item));
    });
    $item.on('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      return post(e, {
        text: e.originalEvent.dataTransfer.getData("text"),
        html: e.originalEvent.dataTransfer.getData("text/html"),
        url: e.originalEvent.dataTransfer.getData("URL")
      });
    });
    return post = function post(e, params) {
      var $page, req;
      $item.find('.caption').text('waiting');

      if (!e.shiftKey) {
        $page = $item.parents('.page');
      }

      req = {
        type: "POST",
        url: opt.post,
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(params)
      };
      return $.ajax(req).done(function (page) {
        var resultPage;
        $item.find('.caption').text('ready');
        resultPage = wiki.newPage(page);
        return wiki.showResult(resultPage, {
          $page: $page
        });
      });
    };
  };

  if (typeof window !== "undefined" && window !== null) {
    window.plugins.transport = {
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
//# sourceMappingURL=transport.js.map
