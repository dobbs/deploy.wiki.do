"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(function () {
  /*
   * Federated Wiki : Reduce Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-reduce/blob/master/LICENSE.txt
   */
  var bind, code, compile, emit, emitrow, find, format, generate, parse, _performMethod, _performTitle, prefetch, recalculate; // interpret item's markup


  parse = function parse(text) {
    var j, len, line, program, ref, words;
    program = {};
    ref = text.split(/\n/);

    for (j = 0, len = ref.length; j < len; j++) {
      line = ref[j];
      words = line.match(/\S+/g);

      if (words === null || words.length < 1) {// ignore it
      } else if (words[0] === 'FOLD') {
        program.find = words.slice(1).join(' ');
      } else if (words[0] === 'WATCH') {
        program.watch = words.slice(1).join(' ');
      } else if (words[0] === 'SLIDE') {
        program.slide = words.slice(1).join(' ');
      } else {
        program.error = {
          line: line,
          message: "can't make sense of line"
        };
      }
    }

    return program;
  };

  find = function find(program, page) {
    var item, j, k, len, len1, link, links, parsing, ref, titles;
    titles = [];

    if (program.find) {
      ref = page.story;

      for (j = 0, len = ref.length; j < len; j++) {
        item = ref[j];

        if (item.type === 'pagefold') {
          parsing = item.text === program.find;
        } else if (parsing && item.type === 'paragraph') {
          if (links = item.text.match(/\[\[.*?\]\]/g)) {
            for (k = 0, len1 = links.length; k < len1; k++) {
              link = links[k];
              titles.push({
                title: link.substr(2, link.length - 4)
              });
            }
          }
        }
      }
    }

    return titles;
  };

  format = function format(program, titles) {
    var j, len, rows, title;
    rows = [];

    if (program.error) {
      rows.push("<tr><td><p class=\"error\">".concat(program.error.line, " <span title=\"").concat(program.error.message, "\">*"));
    }

    for (j = 0, len = titles.length; j < len; j++) {
      title = titles[j];
      rows.push("<tr><td>".concat(title.title, "<td style=\"text-align:right;\">50"));
    }

    return rows.join("\n");
  }; // translate to functional form (excel)


  emitrow = function emitrow(context, label, funct) {
    if (label) {
      context.vars[label] = context.ops.length;
    }

    return context.ops.push("".concat(label || '', "\t").concat(funct || ''));
  };

  generate = function generate(context, text) {
    var args, j, len, line, loc, ref, results;
    loc = context.ops.length + 1;
    ref = text.split(/\n/);
    results = [];

    for (j = 0, len = ref.length; j < len; j++) {
      line = ref[j];
      console.log(line, context);

      if (args = line.match(/^([0-9.eE-]+) +([\w \/%(){},&-]+)$/)) {
        results.push(emitrow(context, args[2], args[1]));
      } else if (args = line.match(/^([A-Z]+) +([\w \/%(){},&-]+)$/)) {
        emitrow(context, args[2], "=".concat(args[1], "(B").concat(loc, ":B").concat(context.ops.length, ")"));
        results.push(loc = context.ops.length);
      } else if (args = line.match(/^([A-Z]+)$/)) {
        emitrow(context, null, "=".concat(args[1], "(B").concat(loc, ":B").concat(context.ops.length, ")"));
        results.push(loc = context.ops.length);
      } else if (args = line.match(/^([0-9\.eE-]+)$/)) {
        results.push(emitrow(context, null, args[1]));
      } else if (args = line.match(/^ *([\w \/%(){},&-]+)$/)) {
        results.push(emitrow(context, args[1], "=B".concat(context.vars[args[1]] + 1)));
      } else {
        results.push(emitrow(context, "can't parse '".concat(line, "'")));
      }
    }

    return results;
  };

  compile = function compile(program, titles, done) {
    var _$;

    var fetch, title;

    fetch = function () {
      var j, len, results;
      results = [];

      for (j = 0, len = titles.length; j < len; j++) {
        title = titles[j];
        results.push($.getJSON("/".concat(wiki.asSlug(title.title), ".json")));
      }

      return results;
    }();

    return (_$ = $).when.apply(_$, _toConsumableArray(fetch)).then(function () {
      var context, item, j, k, len, len1, ref, xhr;
      context = {
        ops: [],
        vars: {}
      };

      if (program.slide) {
        emitrow(context, program.slide, 50);
      }

      for (var _len = arguments.length, xhrs = new Array(_len), _key = 0; _key < _len; _key++) {
        xhrs[_key] = arguments[_key];
      }

      for (j = 0, len = xhrs.length; j < len; j++) {
        xhr = xhrs[j];
        emitrow(context);
        emitrow(context, xhr[0].title);
        ref = xhr[0].story;

        for (k = 0, len1 = ref.length; k < len1; k++) {
          item = ref[k];

          switch (item.type) {
            case 'method':
              generate(context, item.text);
          }
        }
      }

      console.log(context);
      return done(context.ops.join("\n"));
    });
  };

  code = function code($item, item, done) {
    var page, program, titles;
    program = parse(item.text);
    page = $item.parents('.page').data('data');
    titles = find(program, page);
    return compile(program, titles, done);
  };

  prefetch = function prefetch(titles, done) {
    var _$2;

    var fetch, title;

    fetch = function () {
      var j, len, results;
      results = [];

      for (j = 0, len = titles.length; j < len; j++) {
        title = titles[j];
        results.push($.getJSON("/".concat(wiki.asSlug(title.title), ".json")));
      }

      return results;
    }();

    return (_$2 = $).when.apply(_$2, _toConsumableArray(fetch)).then(function () {
      var i, item, j, k, len, ref, ref1, xhr;

      for (var _len2 = arguments.length, xhrs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        xhrs[_key2] = arguments[_key2];
      }

      for (i = j = 0, ref = titles.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        title = titles[i];
        xhr = xhrs[i];
        title.items = [];
        ref1 = xhr[0].story;

        for (k = 0, len = ref1.length; k < len; k++) {
          item = ref1[k];

          switch (item.type) {
            case 'method':
              title.items.push(item);
          }
        }
      }

      return done(titles);
    });
  };

  _performMethod = function performMethod(state, done) {
    if (state.methods.length > 0) {
      state.plugin.eval(state, state.methods.shift(), state.input, function (state, output) {
        return state.output = output;
      });

      _.extend(state.input, output);

      return _performMethod(state, done);
    } else {
      return done(state);
    }
  };

  _performTitle = function performTitle(state, done) {
    var item;

    if (state.titles.length > 0) {
      state.methods = function () {
        var j, len, ref, results;
        ref = state.titles[0].items;
        results = [];

        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          results.push(item);
        }

        return results;
      }();

      return _performMethod(state, function (state) {
        var value;
        value = state.input[state.program.watch || state.program.slide];
        state.titles[0].row.find('td:last').text(value.toFixed(2));
        state.titles.shift();
        return _performTitle(state, done);
      });
    } else {
      return done(state);
    }
  };

  recalculate = function recalculate(program, input, titles, done) {
    return wiki.getPlugin('method', function (plugin) {
      var state, t;
      state = {
        program: program,
        plugin: plugin,
        input: input,
        titles: function () {
          var j, len, results;
          results = [];

          for (j = 0, len = titles.length; j < len; j++) {
            t = titles[j];
            results.push(t);
          }

          return results;
        }(),
        errors: []
      };
      return _performTitle(state, done);
    });
  }; // render in the wiki page


  emit = function emit($item, item) {
    var candidates, elem, input, j, k, len, len1, nominal, output, page, program, row, sign, slider, title, titles;
    program = parse(item.text);
    page = $item.parents('.page').data('data');
    titles = find(program, page);
    input = {};
    output = {};
    candidates = $(".item:lt(".concat($('.item').index($item), ")"));

    for (j = 0, len = candidates.length; j < len; j++) {
      elem = candidates[j];
      elem = $(elem);

      if (elem.hasClass('radar-source')) {
        _.extend(input, elem.get(0).radarData());
      } else if (elem.hasClass('data')) {
        _.extend(input, elem.data('item').data[0]);
      }
    }

    $item.append(slider = $('<div class=slider />'));

    if (program.slide) {
      nominal = output[program.slide] = +input[program.slide] || 50;
      sign = nominal < 0 ? -1 : 1;
      $item.addClass('radar-source');

      $item.get(0).radarData = function () {
        return output;
      };

      slider.slider({
        animate: 'fast',
        value: Math.abs(nominal),
        max: Math.abs(nominal) * 2,
        slide: function slide(event, ui) {
          var value;
          input[program.slide] = output[program.slide] = value = ui.value * sign;
          $item.find('tr:first td:last').text(value);
          return recalculate(program, input, titles, function () {
            return $item.trigger('thumb', ui.value * sign);
          });
        }
      });
    }

    $item.append("<table style=\"width:100%; background:#eee; padding:.8em; margin-bottom:5px;\">\n  <tr><td>".concat(program.slide, "<td style=\"text-align:right;\">").concat(nominal, "\n</table>"));

    for (k = 0, len1 = titles.length; k < len1; k++) {
      title = titles[k];
      title.row = row = $("<tr><td>".concat(title.title, "<td style=\"text-align:right;\">"));
      $item.find('table').append(title.row);
    }

    return prefetch(titles, function (titles) {
      input[program.slide] = nominal;
      return recalculate(program, input, titles, function () {
        return console.log('emit/prefetch/recalculate complete');
      });
    });
  };

  bind = function bind($item, item) {
    $item.find('table').dblclick(function () {
      return wiki.textEditor($item, item);
    });
    return $item.find('.slider').dblclick(function () {
      return code($item, item, function (formula) {
        return wiki.dialog("Slider Computation", "<pre>".concat(formula, "</pre>"));
      });
    });
  };

  if (typeof window !== "undefined" && window !== null) {
    window.plugins.reduce = {
      emit: emit,
      bind: bind
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = {
      parse: parse
    };
  }
}).call(void 0);
//# sourceMappingURL=reduce.js.map
