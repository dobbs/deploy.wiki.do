"use strict";

(function () {
  /*
   * Federated Wiki : Data Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-data/blob/master/LICENSE.txt
   */
  var summary,
      thumbs,
      hasProp = {}.hasOwnProperty; // lots of cases, ward will try these
  // http://nmsi.localhost:1111/view/cotton-in-the-field/view/tier-1-material-summary/cotton.localhost:1111/talk-about-wool/view/cotton-fabric

  window.plugins.data = {
    emit: function emit(div, item) {
      $('<p />').addClass('readout').appendTo(div).text(summary(item));
      return $('<p />').addClass('label').appendTo(div).html(wiki.resolveLinks(item.text || 'data'));
    },
    bind: function bind(div, item) {
      var average, label, lastThumb, readout, refresh, _value;

      lastThumb = null;
      div.find('.readout').mousemove(function (e) {
        var offset, thumb;

        if (e.offsetX === void 0) {
          offset = e.pageX - $(this).offset().left;
        } else {
          offset = e.offsetX;
        }

        thumb = thumbs(item)[Math.floor(thumbs(item).length * offset / e.target.offsetWidth)];

        if (thumb === lastThumb || null === (lastThumb = thumb)) {
          return;
        }

        refresh(thumb);
        return $(div).trigger('thumb', thumb);
      }).dblclick(function (e) {
        return wiki.dialog("JSON for ".concat(item.text), $('<pre/>').text(JSON.stringify(item, null, 2)));
      });
      div.find('.label').dblclick(function () {
        return wiki.textEditor(div, item);
      });
      $(".main").on('thumb', function (evt, thumb) {
        if (!(thumb === lastThumb || -1 === thumbs(item).indexOf(thumb))) {
          return refresh(thumb);
        }
      });

      _value = function value(obj) {
        if (obj == null) {
          return 0 / 0;
        }

        switch (obj.constructor) {
          case Number:
            return obj;

          case String:
            return +obj;

          case Array:
            return _value(obj[0]);

          case Object:
            return _value(obj.value);

          case Function:
            return obj();

          default:
            return 0 / 0;
        }
      };

      average = function average(thumb) {
        var result, values;
        values = _.map(item.data, function (obj) {
          return _value(obj[thumb]);
        });
        values = _.reject(values, function (obj) {
          return isNaN(obj);
        });
        result = _.reduce(values, function (m, n) {
          return m + n;
        }, 0) / values.length;
        return result.toFixed(2);
      };

      readout = function readout(thumb) {
        var field;

        if (item.columns != null) {
          return average(thumb);
        }

        if (item.data.object == null) {
          return summary(item);
        }

        field = item.data[thumb];

        if (field.value != null) {
          return "".concat(field.value);
        }

        if (field.constructor === Number) {
          return "".concat(field.toFixed(2));
        }

        return 0 / 0;
      };

      label = function label(thumb) {
        if (item.columns != null && item.data.length > 1) {
          return "Averaged:<br>".concat(thumb);
        }

        return thumb;
      };

      return refresh = function refresh(thumb) {
        div.find('.readout').text(readout(thumb));
        return div.find('.label').html(label(thumb));
      };
    }
  };

  summary = function summary(item) {
    if (item.columns != null) {
      return "".concat(item.data.length, "x").concat(item.columns.length);
    }

    if (item.data != null && item.data.nodes != null && item.data.links != null) {
      return "".concat(item.data.nodes.length, "/").concat(item.data.links.length);
    }

    return "1x".concat(thumbs(item).length);
    return "data";
  };

  thumbs = function thumbs(item) {
    var key, ref, results;

    if (item.columns != null) {
      return item.columns;
    }

    ref = item.data;
    results = [];

    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      results.push(key);
    }

    return results;
  };
}).call(void 0);
//# sourceMappingURL=data.js.map
