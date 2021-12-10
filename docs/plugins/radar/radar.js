"use strict";

(function () {
  /*
   * Federated Wiki : Radar Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-radar/blob/master/LICENSE.txt
   */
  window.plugins.radar = {
    bind: function bind(div, item) {},
    emit: function emit(div, item) {
      return wiki.getScript('/js/d3/d3.min.js', function () {
        var angle, c, candidates, centerXPos, centerYPos, circleAxes, circleConstraint, colorSelector, comments, complete, d, data, dimension, each, fill, h, heightCircleConstraint, hours, j, k, keys, l, lastThumb, len, len1, limit, limitsFromData, lineAxes, m, max, maxVal, merged, merging, minVal, n, o, p, parseText, percents, radialTicks, radius, radiusLength, ref, ref1, ref2, rotate, rows, ruleColor, series, translate, _value, viz, vizBody, vizPadding, w, who, widthCircleConstraint;

        div.append(" <style>\n svg { font: 10px sans-serif; }\n</style>");
        limit = {};
        keys = [];
        max = -2e308;

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

        parseText = function parseText(text) {
          var args, j, len, line, ref;
          ref = text.split("\n");

          for (j = 0, len = ref.length; j < len; j++) {
            line = ref[j];

            if (args = line.match(/^([0-9.eE-]+) +([\w \/%(){},&-]+)$/)) {
              keys.push(args[2]);
              limit[args[2]] = +args[1];
            } else if (args = line.match(/^([0-9\.eE-]+)$/)) {
              max = +args[1];
            } else if (args = line.match(/^ *([\w \/%(){},&-]+)$/)) {
              keys.push(args[1]);
            }
          }

          return wiki.log('radar parseText', keys, limit, max);
        };

        limitsFromData = function limitsFromData(data) {
          var d, j, k, len, v, vv;
          limit = {};

          for (j = 0, len = data.length; j < len; j++) {
            d = data[j];

            for (k in d) {
              v = d[k];
              vv = _value(v);

              if (!isNaN(vv)) {
                wiki.log('limits from data keys', k, v, vv);

                if (limit[k]) {
                  if (vv > limit[k]) {
                    limit[k] = vv;
                  }
                } else {
                  limit[k] = vv;
                }
              }
            }
          }

          return wiki.log('limits from data', limit);
        };

        candidates = $(".item:lt(".concat($('.item').index(div), ")"));

        if ((who = candidates.filter(".radar-source")).size()) {
          data = function () {
            var j, len, results;
            results = [];

            for (j = 0, len = who.length; j < len; j++) {
              d = who[j];
              results.push(d.radarData());
            }

            return results;
          }();
        } else if ((who = candidates.filter(".data")).size()) {
          rows = who.filter(function (d) {
            return $(this).data('item').data.length === 1;
          });

          if (rows.length > 0) {
            data = function () {
              var j, len, results;
              results = [];

              for (j = 0, len = rows.length; j < len; j++) {
                d = rows[j];
                results.push($(d).data('item').data[0]);
              }

              return results;
            }();
          } else {
            data = who.last().data('item').data;
          }
        } else {
          throw "Can't find suitable data";
        }

        wiki.log('radar data', data);

        if (item.text != null && item.text.match(/\S/)) {
          parseText(item.text);

          if (_.isEmpty(limit)) {
            if (max === -2e308) {
              limitsFromData(data);
            } else {
              if (_.isEmpty(keys)) {
                limitsFromData(data);
                keys = Object.keys(limit);
              }

              for (j = 0, len = keys.length; j < len; j++) {
                k = keys[j];
                limit[k] = max;
              }
            }
          }
        } else {
          limitsFromData(data);
          keys = Object.keys(limit);
        }

        wiki.log('radar limit', limit);

        complete = function complete(object) {
          var key, l, len1;

          for (l = 0, len1 = keys.length; l < len1; l++) {
            key = keys[l];

            if (object[key] == null) {
              return false;
            }
          }

          return true;
        };

        merged = [];
        merging = {};

        for (l = 0, len1 = data.length; l < len1; l++) {
          each = data[l];

          _.extend(merging, each);

          if (complete(merging)) {
            merged.push(merging);
            merging = {};
          }
        }

        data = merged;

        percents = function percents(obj) {
          var len2, len3, n, p, ref, results;

          for (n = 0, len2 = keys.length; n < len2; n++) {
            k = keys[n];

            if (obj[k] == null) {
              throw "Missing value for '".concat(k, "'");
            }
          }

          ref = keys.concat(keys[0]);
          results = [];

          for (p = 0, len3 = ref.length; p < len3; p++) {
            k = ref[p];
            results.push(100.0 * _value(obj[k]) / limit[k]);
          }

          return results;
        };

        div.dblclick(function (e) {
          if (e.shiftKey) {
            return wiki.dialog("JSON for Radar plugin", $('<pre/>').text(JSON.stringify(item, null, 2)));
          } else {
            if (!(item.text != null && item.text.match(/\S/))) {
              item.text = function () {
                var len2, n, results;
                results = [];

                for (n = 0, len2 = keys.length; n < len2; n++) {
                  k = keys[n];
                  results.push("".concat(limit[k], " ").concat(k));
                }

                return results;
              }().join("\n");
            }

            return wiki.textEditor(div, item);
          }
        }); // div.append "<p>#{JSON.stringify(keys)}</p>"
        // div.append "<p>#{JSON.stringify(limit)}</p>"
        // Adapted from https://gist.github.com/1630683

        w = 400;
        h = 400;
        vizPadding = {
          top: 10,
          right: 0,
          bottom: 15,
          left: 0
        };
        dimension = keys.length;
        ruleColor = "#EEE";

        angle = function angle(i) {
          return i / dimension * 2 * Math.PI;
        };

        rotate = function rotate(i) {
          return "rotate(".concat(i / dimension * 360 - 90, ")");
        };

        translate = function translate(percent) {
          return "translate(".concat(radius(maxVal * percent / 100), ")");
        };

        series = function () {
          var len2, n, results;
          results = [];

          for (n = 0, len2 = data.length; n < len2; n++) {
            d = data[n];
            results.push(percents(d));
          }

          return results;
        }();

        wiki.log('radar series', series);
        comments = [];

        for (m = n = 0, ref = data.length - 1; 0 <= ref ? n <= ref : n >= ref; m = 0 <= ref ? ++n : --n) {
          for (d = p = 0, ref1 = dimension - 1; 0 <= ref1 ? p <= ref1 : p >= ref1; d = 0 <= ref1 ? ++p : --p) {
            if ((o = data[m][keys[d]]) != null) {
              if ((c = o.comment) != null) {
                comments.push({
                  material: m,
                  dimension: d,
                  comment: c
                });
              }
            }
          }
        }

        hours = function () {
          var results = [];

          for (var q = 0, ref2 = dimension - 1; 0 <= ref2 ? q <= ref2 : q >= ref2; 0 <= ref2 ? q++ : q--) {
            results.push(q);
          }

          return results;
        }.apply(this);

        minVal = 0;
        maxVal = 100;
        viz = d3.select(div.get(0)).append("svg:svg").attr("width", w).attr("height", h).attr("class", "vizSvg");
        vizBody = viz.append("svg:g").attr("id", "body");
        heightCircleConstraint = h - vizPadding.top - vizPadding.bottom;
        widthCircleConstraint = w - vizPadding.left - vizPadding.right;
        circleConstraint = d3.min([heightCircleConstraint, widthCircleConstraint]);
        radius = d3.scale.linear().domain([minVal, maxVal]).range([0, circleConstraint / 2]);
        radiusLength = radius(maxVal);
        centerXPos = widthCircleConstraint / 2 + vizPadding.left;
        centerYPos = heightCircleConstraint / 2 + vizPadding.top;
        vizBody.attr("transform", "translate(".concat(centerXPos, ",").concat(centerYPos, ")") + rotate(0));
        lastThumb = null;
        who.bind('thumb', function (e, thumb) {
          var index;

          if (thumb === lastThumb || -1 === (index = keys.indexOf(lastThumb = thumb))) {
            return;
          }

          return vizBody.transition().duration(750).attr("transform", "translate(".concat(centerXPos, ",").concat(centerYPos, ")") + rotate(-index));
        });
        radialTicks = radius.ticks(5);
        circleAxes = vizBody.selectAll(".circle-ticks").data(radialTicks).enter().append("svg:g").attr("class", "circle-ticks");
        circleAxes.append("svg:circle").attr("r", function (d, i) {
          return radius(d);
        }).attr("class", "circle").style("stroke", ruleColor).style("fill", "none");
        circleAxes.append("svg:text").attr("text-anchor", "end").style("stroke", ruleColor).attr("dy", function (d) {
          return -1 * radius(d);
        }).text(String);
        lineAxes = vizBody.selectAll(".line-ticks").data(hours).enter().append("svg:g").attr("transform", function (d, i) {
          return rotate(i) + translate(100);
        }).attr("class", "line-ticks");
        lineAxes.append("svg:line").attr("x2", -1 * radius(maxVal)).style("stroke", ruleColor).style("fill", "none");
        lineAxes.append("svg:text").text(function (d, i) {
          return keys[i].slice(0, 20);
        }).attr('x', 5).attr('y', -5).attr("text-anchor", "start").style("stroke", ruleColor).style("cursor", 'pointer').style("font-size", "14px").attr("transform", "rotate(180)").on("click", function (d, i) {
          return wiki.doInternalLink(keys[i], $(div).parents('.page'));
        });
        fill = d3.scale.category10();

        colorSelector = function colorSelector(d, i) {
          return fill(i);
        };

        vizBody.selectAll(".series").data(series).enter().append("svg:g").attr("class", "series").append("svg:path").attr("class", "line").style("fill", colorSelector).style("stroke", colorSelector).style("stroke-width", 3).style("fill-opacity", .1).style("fill", colorSelector).attr("d", d3.svg.line.radial().radius(function (d) {
          return radius(d != null && !isNaN(d) ? d : 0);
        }).angle(function (d, i) {
          return angle(i);
        })).append("svg:title").text(function (d, i) {
          return data[i]["Material name"];
        });
        return vizBody.selectAll(".comments").data(comments).enter().append("svg:g").attr("class", "comments").append("svg:text").style("font-size", "40px").style("fill", colorSelector).attr("text-anchor", "mid").attr("transform", function (d) {
          var percent;
          percent = series[d.material][d.dimension];
          return rotate(d.dimension) + translate(percent);
        }).text('*').append("svg:title").text(function (d) {
          return d.comment;
        });
      });
    }
  };
}).call(void 0);
//# sourceMappingURL=radar.js.map
