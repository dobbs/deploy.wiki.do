"use strict";

(function () {
  /*
   * Federated Wiki : Rollup Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-rollup/blob/master/LICENSE.txt
   */
  window.plugins.rollup = {
    emit: function emit(div, item) {},
    bind: function bind(div, item) {
      var $row, $table, _asValue, attach, delay, display, i, len, _perform, radar, recalculate, reference, reindex, remaining, results, results1, row, rows, slug, state, timeout;

      div.dblclick(function () {
        return wiki.textEditor(div, item);
      });
      div.append("<style>\n  td.material {overflow:hidden;}\n  td.score {text-align:right; width:25px}\n</style>");

      _asValue = function asValue(obj) {
        if (obj == null) {
          return 0 / 0;
        }

        switch (obj.constructor) {
          case Number:
            return obj;

          case String:
            return +obj;

          case Array:
            return _asValue(obj[0]);

          case Object:
            return _asValue(obj.value);

          case Function:
            return obj();

          default:
            return 0 / 0;
        }
      };

      attach = function attach(search) {
        var elem, i, len, ref, source;
        wiki.log('attach', wiki.getDataNodes(div));
        ref = wiki.getDataNodes(div);

        for (i = 0, len = ref.length; i < len; i++) {
          elem = ref[i];
          wiki.log('attach loop', $(elem).data('item').text);

          if ((source = $(elem).data('item')).text.indexOf(search) >= 0) {
            return source;
          }
        }

        throw new Error("can't find dataset with caption ".concat(search));
      };

      reference = attach("Materials Summary");

      display = function display(calculated, state) {
        var $row, col, color, e, errors, i, label, len, now, old, ref, results1, row, title;
        row = state.row;
        $row = state.$row;
        ref = reference.columns;
        results1 = [];

        for (i = 0, len = ref.length; i < len; i++) {
          col = ref[i];

          if (col === 'Material') {
            label = wiki.resolveLinks("[[".concat(row.Material, "]]"));

            if (calculated) {
              if (state.errors.length > 0) {
                errors = function () {
                  var j, len1, ref1, results2;
                  ref1 = state.errors;
                  results2 = [];

                  for (j = 0, len1 = ref1.length; j < len1; j++) {
                    e = ref1[j];
                    results2.push(e.message.replace(/"/g, "'"));
                  }

                  return results2;
                }().join("\n");

                results1.push($row.append("<td class=\"material\">".concat(label, " <span style=\"color:red;\" title=\"").concat(errors, "\">\u2718</span></td>")));
              } else {
                results1.push($row.append("<td class=\"material\">".concat(label, "</td>")));
              }
            } else {
              results1.push($row.append("<td class=\"material\">".concat(label, "</td>")));
            }
          } else {
            old = _asValue(row[col]);
            now = _asValue(state.input[col]);

            if (calculated && now != null) {
              color = old.toFixed(4) === now.toFixed(4) ? 'green' : old.toFixed(0) === now.toFixed(0) ? 'orange' : 'red';
              title = "".concat(row.Material, "\n").concat(col, "\nold ").concat(old.toFixed(4), "\nnow ").concat(now.toFixed(4));
              results1.push($row.append("<td class=\"score\" title=\"".concat(title, "\" data-thumb=\"").concat(col, "\" style=\"color:").concat(color, ";\">").concat(old.toFixed(0), "</td>")));
            } else {
              title = "".concat(row.Material, "\n").concat(col, "\n").concat(old.toFixed(4));
              results1.push($row.append("<td class=\"score\" title=\"".concat(title, "\" data-thumb=\"").concat(col, "\">").concat(old.toFixed(0), "</td>")));
            }
          }
        }

        return results1;
      };

      _perform = function perform(state, plugin, done) {
        if (state.methods.length > 0) {
          return plugin.eval(state, state.methods.shift(), state.input, function (state, output) {
            state.output = output;

            _.extend(state.input, output);

            return _perform(state, plugin, done);
          });
        } else {
          return done(state);
        }
      };

      timeout = function timeout(delay, done) {
        return setTimeout(done, delay);
      };

      recalculate = function recalculate(delay, state, done) {
        return timeout(delay, function () {
          return wiki.getPlugin('method', function (plugin) {
            return $.getJSON("/".concat(state.slug, ".json"), function (data) {
              state.methods = _.filter(data.story, function (item) {
                return item.type === 'method';
              });
              return _perform(state, plugin, done);
            });
          });
        });
      };

      radar = function radar() {
        var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var candidates, elem, i, len, output;
        candidates = $(".item:lt(".concat($('.item').index(div), ")"));
        output = _.extend({}, input);

        for (i = 0, len = candidates.length; i < len; i++) {
          elem = candidates[i];
          elem = $(elem);

          if (elem.hasClass('radar-source')) {
            _.extend(output, elem.get(0).radarData());
          } else if (elem.hasClass('data')) {
            _.extend(output, elem.data('item').data[0]);
          }
        }

        return output;
      };

      reindex = function reindex(results) {
        var i, index, j, len, len1, results1, sorted, state;
        wiki.log('reindex', results);
        sorted = _.sortBy(results, function (state) {
          return -_asValue(state.input['Total Score']);
        });

        for (index = i = 0, len = sorted.length; i < len; index = ++i) {
          state = sorted[index];
          state.input.Rank = "".concat(index + 1);
        }

        results1 = [];

        for (j = 0, len1 = results.length; j < len1; j++) {
          state = results[j];
          state.$row.empty();
          results1.push(display(true, state));
        }

        return results1;
      };

      div.append($table = $("<table/>"));
      rows = _.sortBy(reference.data, function (row) {
        return -_asValue(row['Total Score']);
      });
      delay = 0;
      results = [];
      remaining = rows.length;
      results1 = [];

      for (i = 0, len = rows.length; i < len; i++) {
        row = rows[i];
        slug = wiki.asSlug(row.Material);
        $table.append($row = $("<tr class=\"".concat(slug, "\">")));
        state = {
          $row: $row,
          row: row,
          slug: slug,
          input: radar(),
          errors: []
        };
        display(false, state);
        delay += 200;
        results1.push(recalculate(delay, state, function (state) {
          state.$row.empty();
          state.input.Rank = state.row.Rank;
          display(true, state);
          results.push(state);
          remaining -= 1;

          if (!remaining) {
            return reindex(results);
          }
        }));
      }

      return results1;
    }
  };
}).call(void 0);
//# sourceMappingURL=rollup.js.map
