"use strict";

(function () {
  /*
   * Federated Wiki : Scatter Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-scatter/blob/master/LICENSE.txt
   */
  window.plugins.scatter = {
    bind: function bind(div, item) {},
    emit: function emit(div, item) {
      return wiki.getScript('/js/d3/d3.min.js', function () {
        var data, extent, fill, h, horz, p, round, title, _value, vert, vis, w, who, x, xdat, y, ydat;

        div.append(" <style>\n svg {\n   font: 10px sans-serif;\n   background: #eee;\n }\n circle {\n   fill: gray;\n   stroke: white;\n }\n</style>");

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

        who = $('.chart,.data,.calculator').last();
        data = who.data('item').data;
        horz = "Water / Land Intensity Total";
        vert = "Total Score";

        xdat = function xdat(d) {
          return _value(d[horz]);
        };

        ydat = function ydat(d) {
          return _value(d[vert]);
        };

        title = function title(d) {
          return "".concat(d.Material, "\n").concat(horz, ": ").concat(round(xdat(d)), "\n").concat(vert, ": ").concat(round(ydat(d)), "\nRank: ").concat(_value(d['Rank']));
        };

        who.bind('thumb', function (e, thumb) {
          var x;

          if (thumb === horz) {
            return;
          }

          wiki.log('thumb', thumb);
          horz = thumb;
          x = d3.scale.linear().domain(extent(xdat)).range([0, w]);
          return d3.selectAll("circle").transition().duration(500).delay(function (d, i) {
            return i * 10;
          }).attr("cx", function (d) {
            return x(xdat(d));
          }).selectAll("title").text(title);
        });

        extent = function extent(f) {
          var hi, lo, step;
          var _ref = [d3.min(data, f), d3.max(data, f)];
          lo = _ref[0];
          hi = _ref[1];
          step = Math.pow(10, Math.floor(Math.log(hi - lo) / Math.log(10)));
          return [step * Math.floor(lo / step), step * Math.ceil(hi / step)];
        };

        w = 360;
        h = 275;
        p = 20;
        x = d3.scale.linear().domain(extent(xdat)).range([0, w]);
        y = d3.scale.linear().domain(extent(ydat)).range([h, 0]);
        fill = d3.scale.category20();
        vis = d3.select(div.get(0)).data([data]).append("svg:svg").attr("width", w + p * 2).attr("height", h + p * 2).append("svg:g").attr("transform", "translate(" + p + "," + p + ")");
        return vis.selectAll("circle").data(data).enter().append("svg:circle").attr("cx", function (d) {
          return x(xdat(d));
        }).attr("cy", function (d) {
          return y(ydat(d));
        }).style("fill", function (d, i) {
          return fill(d.Cluster || d.Material.split(/\s+/).reverse()[0]);
        }).style("cursor", 'pointer').attr("r", 10).on("click", function (d) {
          return wiki.doInternalLink(d.Material, div.parents('.page'));
        }).append("svg:title").text(title);
      });
    }
  };
}).call(void 0);
//# sourceMappingURL=scatter.js.map
