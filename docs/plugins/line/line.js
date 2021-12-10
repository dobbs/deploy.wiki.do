"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(function () {
  /*
   * Federated Wiki : Line Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-line/blob/master/LICENSE.txt
   */
  var extent;

  extent = function extent(data, f) {
    var hi, lo, step;
    var _ref = [d3.min(data, f), d3.max(data, f)];
    lo = _ref[0];
    hi = _ref[1];
    step = Math.pow(10, Math.floor(Math.log(hi - lo) / Math.log(10)));
    return [step * Math.floor(lo / step), step * Math.ceil(hi / step)];
  };

  window.plugins.line = {
    bind: function bind(div, item) {},
    emit: function emit(div, item) {
      return wiki.getScript('/js/d3/d3.min.js', function () {
        var candidates, choice, data, h, lastThumb, line, p, series, start, vis, w, who, x, xrules, y, yrules;
        w = 350;
        h = 275;
        p = 40;
        div.append("<style>\n  svg { font: 10px sans-serif; }\n  .rule line { stroke: #eee; shape-rendering: crispEdges; }\n  .rule line.axis { stroke: #000; }\n  .line { fill: none; stroke: steelblue; stroke-width: 1.5px; }\n  .line text { stroke-width: 1px; }\n  circle.line { fill: #fff; }\n</style>");
        candidates = $(".item:lt(".concat($('.item').index(div), ")"));

        if ((who = candidates.filter(".sequence-source")).length) {
          choice = who[who.length - 1];

          data = function () {
            var i, len, ref, results;
            ref = choice.getSequenceData();
            results = [];

            for (x = i = 0, len = ref.length; i < len; x = ++i) {
              y = ref[x];
              results.push({
                x: x,
                y: +y
              });
            }

            return results;
          }();

          x = d3.scale.linear().domain(extent(data, function (p) {
            return p.x;
          })).range([0, w]);
          y = d3.scale.linear().domain(extent(data, function (p) {
            return p.y;
          })).range([h, 0]);
        } else {
          series = wiki.getData();
          data = (start = series[0][0]) > 1000000000000 ? function () {
            // js time
            var i, len, results;
            results = [];

            for (i = 0, len = series.length; i < len; i++) {
              var _series$i = _slicedToArray(series[i], 2);

              x = _series$i[0];
              y = _series$i[1];
              results.push({
                t: new Date(x),
                x: x,
                y: y
              });
            }

            return results;
          }() : start > 1000000000 ? function () {
            // unix time
            var i, len, results;
            results = [];

            for (i = 0, len = series.length; i < len; i++) {
              var _series$i2 = _slicedToArray(series[i], 2);

              x = _series$i2[0];
              y = _series$i2[1];
              results.push({
                t: new Date(x * 1000),
                x: x,
                y: y
              });
            }

            return results;
          }() : function () {
            var i, len, results;
            results = [];

            for (i = 0, len = series.length; i < len; i++) {
              p = series[i];
              results.push({
                t: new Date(p.Date),
                y: p.Price * 1
              });
            }

            return results;
          }();
          x = d3.time.scale().domain(extent(data, function (p) {
            return p.t;
          })).range([0, w]);
          y = d3.scale.linear().domain(extent(data, function (p) {
            return p.y;
          })).range([h, 0]);
        }

        lastThumb = null;
        $('.main').bind('thumb', function (e, thumb) {
          if (thumb === lastThumb) {
            return;
          }

          lastThumb = thumb;
          return d3.selectAll("circle.line").attr('r', function (d) {
            if (d.x === thumb) {
              return 8;
            } else {
              return 3.5;
            }
          });
        });
        vis = d3.select(div.get(0)).data([data]).append("svg:svg").attr("width", w + p * 2).attr("height", h + p * 2).append("svg:g").attr("transform", "translate(".concat(p, ",").concat(p, ")"));
        xrules = vis.selectAll("g.xrule").data(x.ticks(5)).enter().append("svg:g").attr("class", "rule");
        xrules.append("svg:line").attr("x1", x).attr("x2", x).attr("y1", 0).attr("y2", h - 1);
        xrules.append("svg:text").attr("x", x).attr("y", h + 3).attr("dy", ".71em").attr("text-anchor", "middle").text(x.tickFormat(10));
        yrules = vis.selectAll("g.yrule").data(y.ticks(10)).enter().append("svg:g").attr("class", "rule");
        yrules.append("svg:line").attr("class", function (d) {
          if (d) {
            return null;
          } else {
            return "axis";
          }
        }).attr("y1", y).attr("y2", y).attr("x1", 0).attr("x2", w + 1);
        yrules.append("svg:text").attr("y", y).attr("x", -3).attr("dy", ".35em").attr("text-anchor", "end").text(y.tickFormat(10));
        line = d3.svg.line().x(function (d) {
          return x(d.t || d.x);
        }).y(function (d) {
          return y(d.y);
        });
        vis.append("svg:path").attr("class", "line").attr("d", line);
        vis.selectAll("circle.line").data(data).enter().append("svg:circle").attr("class", "line").attr("cx", function (d) {
          return x(d.t || d.x);
        }).attr("cy", function (d) {
          return y(d.y);
        }).attr("r", 3.5).on('mouseover', function (d) {
          div.trigger('thumb', lastThumb = d.x);
          return d3.select(this).attr('r', 8);
        }).on('mouseout', function () {
          return d3.select(this).attr('r', 3.5);
        });

        if (choice) {
          return $(choice).on('sequence', function (e, sequence) {
            var xx, yy;

            data = function () {
              var i, len, results;
              results = [];

              for (xx = i = 0, len = sequence.length; i < len; xx = ++i) {
                yy = sequence[xx];
                results.push({
                  x: xx,
                  y: +yy
                });
              }

              return results;
            }();

            vis.selectAll('circle.line').data(data).transition().attr("cy", function (d) {
              return y(d.y);
            });
            return vis.selectAll('path').data([data]).transition().attr("d", line);
          });
        }
      });
    }
  };
}).call(void 0);
//# sourceMappingURL=line.js.map
