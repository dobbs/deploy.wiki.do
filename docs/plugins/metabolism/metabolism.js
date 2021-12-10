"use strict";

(function () {
  /*
   * Federated Wiki : Metabolism Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-metabolism/blob/master/LICENSE.txt
   */
  window.plugins.metabolism = {
    emit: function emit(div, item) {},
    bind: function bind(div, item) {
      var annotate, attach, avg, calculate, data, input, output, query, round, sum;
      data = [];
      input = {};
      output = {};
      div.addClass('radar-source');

      div.get(0).radarData = function () {
        return output;
      };

      div.mousemove(function (e) {
        return $(div).triggerHandler('thumb', $(e.target).text());
      }); // http://stella.laurenzo.org/2011/03/bulletproof-node-js-coding/

      attach = function attach(search) {
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
        var elem, i, len, new_data, ref, source;
        ref = wiki.getDataNodes(div);

        for (i = 0, len = ref.length; i < len; i++) {
          elem = ref[i];

          if ((source = $(elem).data('item')).text.indexOf(search) >= 0) {
            new_data = _.select(source.data, function (row) {
              return row.Activity != null;
            });
            return callback(new_data);
          }
        }

        return $.get("/data/".concat(search), function (page) {
          var j, len1, obj, ref1;

          if (!page) {
            throw new Error("can't find dataset '".concat(s, "'"));
          }

          ref1 = page.story;

          for (j = 0, len1 = ref1.length; j < len1; j++) {
            obj = ref1[j];

            if (obj.type === 'data' && obj.text != null && obj.text.indexOf(search) >= 0) {
              new_data = _.select(obj.data, function (row) {
                return row.Activity != null;
              });
              return callback(new_data);
            }
          }

          throw new Error("can't find dataset '".concat(s, "' in '").concat(page.title, "'"));
        });
      };

      query = function query(s) {
        var choices, i, k, keys, len, n;
        keys = $.trim(s).split(' ');
        choices = data;

        for (i = 0, len = keys.length; i < len; i++) {
          k = keys[i];

          if (k === ' ') {
            next;
          }

          n = choices.length;
          choices = _.select(choices, function (row) {
            return row.Activity.indexOf(k) >= 0 || row.Category.indexOf(k) >= 0;
          });

          if (choices.length === 0) {
            throw new Error("Can't find ".concat(k, " in remaining ").concat(n, " choices"));
          }
        }

        return choices;
      };

      sum = function sum(v) {
        return _.reduce(v, function (s, n) {
          return s += n;
        });
      };

      avg = function avg(v) {
        return sum(v) / v.length;
      };

      round = function round(n) {
        if (n == null) {
          return '?';
        }

        if (n.toString().match(/\.\d\d\d/)) {
          return n.toFixed(2);
        } else {
          return n;
        }
      };

      annotate = function annotate(text) {
        if (text == null) {
          return '';
        }

        return " <span title=\"".concat(text, "\">*</span>");
      };

      calculate = function calculate(item) {
        var allocated, _dispatch, lines, list, report;

        list = [];
        allocated = 0;
        lines = item.text.split("\n");
        report = [];

        _dispatch = function dispatch(list, allocated, lines, report, done) {
          var args, color, comment, err, hours, line, next_dispatch, result, row, value;
          color = '#eee';
          value = comment = null;
          hours = '';
          line = lines.shift();

          if (line == null) {
            return done(report);
          }

          next_dispatch = function next_dispatch() {
            if (value != null && !isNaN(+value)) {
              list.push(+value);
            }

            report.push("<tr style=\"background:".concat(color, ";\"><td style=\"width: 70%;\">").concat(line).concat(annotate(comment), "<td>").concat(hours, "<td><b>").concat(round(value), "</b>"));
            return _dispatch(list, allocated, lines, report, done);
          };

          try {
            if (args = line.match(/^USE ([\w ]+)$/)) {
              color = '#ddd';
              value = ' ';
              return attach(line = args[1], function (new_data) {
                data = new_data;
                return next_dispatch();
              });
            } else if (args = line.match(/^([0-9.]+) ([\w ]+)$/)) {
              allocated += hours = +args[1];
              result = query(line = args[2]);
              output[line] = value = (input = result[0]).MET * hours;

              if (result.length > 1) {
                comment = function () {
                  var i, len, results;
                  results = [];

                  for (i = 0, len = result.length; i < len; i++) {
                    row = result[i];
                    results.push("".concat(row.Category, " (").concat(row.MET, "): ").concat(row.Activity));
                  }

                  return results;
                }().join("\n\n");
              }
            } else if (input[line] != null) {
              value = input[line];
              comment = input["".concat(line, " Assumptions")] || null;
            } else if (line.match(/^[0-9\.-]+$/)) {
              value = +line;
            } else if (line === 'REMAINDER') {
              value = 24 - allocated;
              allocated += value;
            } else if (line === 'SUM') {
              color = '#ddd';
              var _ref = [sum(list), []];
              value = _ref[0];
              list = _ref[1];
            } else if (line === 'AVG') {
              color = '#ddd';
              var _ref2 = [avg(list), []];
              value = _ref2[0];
              list = _ref2[1];
            } else {
              color = '#edd';
            }
          } catch (error) {
            err = error;
            color = '#edd';
            value = null;
            comment = err.message;
          }

          return next_dispatch();
        };

        return _dispatch(list, allocated, lines, report, function (report) {
          var table, text;
          text = report.join("\n");
          table = $('<table style="width:100%; background:#eee; padding:.8em;"/>').html(text);
          div.append(table);
          return div.dblclick(function () {
            return wiki.textEditor(div, item);
          });
        });
      };

      return calculate(item);
    }
  };
}).call(void 0);
//# sourceMappingURL=metabolism.js.map
