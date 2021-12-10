"use strict";

(function () {
  /*
   * Federated Wiki : Activity Pushpin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-pushpin/blob/master/LICENSE.txt
   */
  var brand, bu, display, fy, h, region, w;
  w = 426;
  h = 300;
  fy = "FY09"; // [ 'FY05', 'FY06', 'FY07', 'FY08', 'FY09' ]

  region = "N ASIA"; // [ 'N ASIA', 'S ASIA', 'AMERICAS', 'EMEA' ]

  brand = "NIKE"; // [ 'AFFILIATE', 'NIKE' ]

  bu = "APRL"; // [ 'EQUIP', 'FTWR', 'APRL', '_NA' ]s

  display = function display(div, item, vis, collection, locations, factories) {
    var countries, fill, force, node, path, states, xy; // Use a map projection to scale lat/lng data

    xy = d3.geo.mercator().scale(350).translate([-550, 300]);
    path = d3.geo.path().projection(xy);
    fill = d3.scale.category20();
    countries = {};
    factories = factories.filter(function (o) {
      return o.fy === fy && o.region === region && o.brand === brand && o.bu === bu;
    });
    factories = factories.map(function (f) {
      f.coordinates = [];
      f.coordinates[0] = locations[f.country].location.lng;
      f.coordinates[1] = locations[f.country].location.lat; // Set starting position

      f.x = 0;
      f.y = 0; // Set destination position for the circle

      f.fx = xy(f.coordinates)[0];
      f.fy = xy(f.coordinates)[1]; // Build hash of country coordinates for future use.

      countries[f.country] = xy(f.coordinates);
      return f;
    }); // Create force layout to give sense of charge.

    force = d3.layout.force().nodes(factories).links([]).size([w, h]).friction(.75).charge(-4).start(); // Create the paths for countries

    states = vis.append("svg:g").attr("id", "states");
    states.selectAll("path").data(collection.features).enter().append("svg:path").attr("d", path).append("title").text(function (d) {
      return d.properties.name;
    }); // Create the marks for factories
    // Get nodes that are entering stage.
    // Set attributes on entering nodes.

    node = vis.selectAll("circle.node").data(factories).enter().append("svg:circle").attr("opacity", 0).attr("class", "node").attr("cx", function (d) {
      return d.x;
    }).attr("cy", function (d) {
      return d.y;
    }).attr("r", 3).attr("title", function (d) {
      return d.crcode;
    }).style("fill", function (d, i) {
      return d3.rgb(fill(d.country)).darker(Math.random());
    }).call(force.drag).transition().duration(900).attr("opacity", 1);
    return force.on("tick", function (e) {
      var k; // Push nodes toward their designated focus.

      k = .3 * e.alpha;
      factories.forEach(function (o, i) {
        // Push nodes towards location set above.
        o.y += (o.fy - o.y) * k;
        return o.x += (o.fx - o.x) * k;
      }); // Move the marks to new location

      return vis.selectAll("circle.node").attr("cx", function (d) {
        return d.x;
      }).attr("cy", function (d) {
        return d.y;
      });
    });
  };

  window.plugins.pushpin = {
    emit: function emit(div, item) {
      return div.append("<style type=\"text/css\">\n  .pushpin path { fill: #ccc; stroke: #fff; }\n  .pushpin svg { border: solid 1px #ccc; background: #eee; }\n</style>");
    },
    bind: function bind(div, item) {
      return wiki.getScript('/js/d3/d3.min.js', function () {
        var vis;
        vis = d3.select(div.get(0)).append("svg:svg").attr("width", w).attr("height", h); //  wiki.getScript '/js/d3/d3.geo.js', ->
        //    wiki.getScript '/js/d3/d3.geom.js', ->
        //      wiki.getScript '/js/d3/d3.layout.js', ->

        return d3.json("/plugins/pushpin/world-countries.json", function (collection) {
          return d3.json("/plugins/pushpin/factories-locations.json", function (locations) {
            return d3.json("/plugins/pushpin/factories.json", function (factories) {
              return display(div, item, vis, collection, locations, factories);
            });
          });
        });
      });
    }
  };
}).call(void 0);
//# sourceMappingURL=pushpin.js.map
