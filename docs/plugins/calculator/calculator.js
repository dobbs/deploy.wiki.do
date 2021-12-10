"use strict";

(function () {
  /*
   * Federated Wiki : Calculator Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-calculator/blob/master/LICENSE.txt
   */
  var calculate;
  window.plugins.calculator = {
    emit: function emit(div, item) {
      var field, pre, text;

      item.data = function () {
        var results;
        results = [];

        for (field in wiki.getData()) {
          results.push(field);
        }

        return results;
      }();

      wiki.log('calculator', item);
      text = calculate(item).join("\n");
      pre = $('<pre style="font-size: 16px;"/>').text(text);
      return div.append(pre);
    },
    bind: function bind(div, item) {
      return div.dblclick(function () {
        return wiki.textEditor(div, item);
      });
    }
  };

  calculate = function calculate(item) {
    var col, i, len, line, ref, results, sum;
    sum = 0;
    ref = item.text.split("\n");
    results = [];

    for (i = 0, len = ref.length; i < len; i++) {
      line = ref[i];
      col = line.split(/\s+/);
      col[0] = col[0].replace(/^[A-Z]+$/, function (x) {
        if (!(item.data[x] != null && x !== 'SUM')) {
          var _ref = [sum, 0];
          item.data[x] = _ref[0];
          sum = _ref[1];
        }

        return item.data[x].toFixed(2);
      });
      col[0] = col[0].replace(/^\-?[0-9\.]+$/, function (x) {
        sum = sum + function () {
          switch (col[1]) {
            case 'CR':
            case 'DB':
              return x / -1;

            case '*':
              return x * col[2];

            case '/':
              return x / col[2];

            default:
              return x / 1;
          }
        }();

        return (x / 1).toFixed(2);
      });

      if (line.match(/^\s*$/)) {
        sum = 0;
      }

      results.push(col.join(' '));
    }

    return results;
  };
}).call(void 0);
//# sourceMappingURL=calculator.js.map
