"use strict";

(function () {
  /*
   * Federated Wiki : Map Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-map/blob/master/LICENSE.txt
   */
  var bind, emit, escape, feature, htmlDecode, lineup, marker, parse, resolve;

  escape = function escape(line) {
    return line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  resolve = function resolve(text) {
    if (typeof wiki !== "undefined" && wiki !== null) {
      return wiki.resolveLinks(text, escape);
    } else {
      return escape(text).replace(/\[\[.*?\]\]/g, '<internal>').replace(/\[.*?\]/g, '<external>');
    }
  };

  htmlDecode = function htmlDecode(escapedText) {
    var doc;
    doc = new DOMParser().parseFromString(escapedText, "text/html");
    return doc.documentElement.textContent;
  };

  marker = function marker(text) {
    var decimal, deg, m, nautical;

    deg = function deg(m) {
      var num;
      num = +m[0] + m[1] / 60 + (m[2] || 0) / 60 / 60;

      if (m[3].match(/[SW]/i)) {
        return -num;
      } else {
        return num;
      }
    };

    decimal = /^(-?\d{1,3}\.?\d*)[, ] *(-?\d{1,3}\.?\d*)\s*(.*)$/;
    nautical = /^(\d{1,3})°(\d{1,2})'(\d*\.\d*)?"?([NS]) (\d{1,3})°(\d{1,2})'(\d*\.\d*)?"?([EW]) (.*)$/i;

    if (m = decimal.exec(text)) {
      return {
        lat: +m[1],
        lon: +m[2],
        label: resolve(m[3])
      };
    }

    if (m = nautical.exec(text)) {
      return {
        lat: deg(m.slice(1, 5)),
        lon: deg(m.slice(5, 9)),
        label: resolve(m[9])
      };
    }

    return null;
  };

  lineup = function lineup($item) {
    var candidates, div, i, len, lineupMarkers, who;

    if (typeof wiki === "undefined" || wiki === null) {
      return [{
        lat: 51.5,
        lon: 0.0,
        label: 'North Greenwich'
      }];
    }

    lineupMarkers = [];
    candidates = $(".item:lt(".concat($('.item').index($item), ")"));

    if ((who = candidates.filter(".marker-source")).size()) {
      for (i = 0, len = who.length; i < len; i++) {
        div = who[i];
        lineupMarkers = lineupMarkers.concat(div.markerData());
      }
    }

    return lineupMarkers;
  };

  parse = function parse(item, $item) {
    var boundary, captions, hint, hints, i, len, line, lineupMarkers, m, markers, overlays, ref, result, text, tools, weblink;
    text = item.text; // parsing the plugin text in context of any frozen items

    captions = [];
    markers = [];
    lineupMarkers = null;
    overlays = null;
    boundary = null;
    weblink = null;
    tools = {};

    if (item.frozen) {
      markers = markers.concat(item.frozen);
    }

    ref = text.split(/\n/);

    for (i = 0, len = ref.length; i < len; i++) {
      line = ref[i];

      if (m = marker(line)) {
        if (weblink != null) {
          m.weblink = weblink;
        }

        markers.push(m);
      } else if (m = /^BOUNDARY *(.*)?$/.exec(line)) {
        hints = (hint = marker(m[1])) ? [hint] : [];

        if (boundary == null) {
          boundary = markers.concat([]);
        }

        boundary = boundary.concat(hints);
      } else if (/^LINEUP/.test(line)) {
        tools['freeze'] = true;
        lineupMarkers = lineup($item);

        if (!item.frozen) {
          markers = markers.concat(lineupMarkers);
        }
      } else if (m = /^WEBLINK *(.*)$/.exec(line)) {
        weblink = m[1];
      } else if (m = /^OVERLAY *(.+?) ([+-]?\d+\.\d+), ?([+-]?\d+\.\d+) ([+-]?\d+\.\d+), ?([+-]?\d+\.\d+)$/.exec(line)) {
        overlays = (overlays || []).concat({
          url: m[1],
          bounds: [[m[2], m[3]], [m[4], m[5]]]
        });
      } else if (/^LOCATE/.test(line)) {
        tools['locate'] = true;
      } else if (/^SEARCH/.test(line)) {
        tools['search'] = true;
      } else {
        captions.push(resolve(line));
      }
    } // remove any duplicate markers


    markers = Array.from(new Set(markers.map(JSON.stringify))).map(JSON.parse);

    if (lineupMarkers) {
      lineupMarkers = Array.from(new Set(lineupMarkers.map(JSON.stringify))).map(JSON.parse);
    }

    if (boundary == null) {
      boundary = markers;
    }

    result = {
      markers: markers,
      caption: captions.join('<br>'),
      boundary: boundary
    };

    if (lineupMarkers) {
      result.lineupMarkers = lineupMarkers;
    }

    if (Object.keys(tools).length > 0) {
      result.tools = tools;
    }

    if (weblink != null) {
      result.weblink = weblink;
    }

    if (overlays != null) {
      result.overlays = overlays;
    }

    return result;
  };

  feature = function feature(marker) {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [marker.lon, marker.lat],
        properties: {
          label: marker.label
        }
      }
    };
  };

  emit = function emit($item, item) {
    var boundary, caption, lineupMarkers, markers, overlays, showing, tools, weblink;

    var _parse = parse(item, $item);

    caption = _parse.caption;
    markers = _parse.markers;
    lineupMarkers = _parse.lineupMarkers;
    boundary = _parse.boundary;
    weblink = _parse.weblink;
    overlays = _parse.overlays;
    tools = _parse.tools;
    // announce our capability to produce markers in native and geojson format
    $item.addClass('marker-source');
    showing = [];

    $item.get(0).markerData = function () {
      var opened;
      opened = showing.filter(function (s) {
        return s.leaflet._popup._isOpen;
      });

      if (opened.length) {
        return opened.map(function (s) {
          return s.marker;
        });
      } else {
        return parse(item).markers;
      }
    };

    $item.get(0).markerGeo = function () {
      return {
        type: 'FeatureCollection',
        features: parse(item).markers.map(feature)
      };
    };

    if (!$("link[href='https://unpkg.com/leaflet@1.7.1/dist/leaflet.css']").length) {
      $('<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css">').appendTo("head");
    }

    if (!$("link[href='/plugins/map/map.css']").length) {
      $('<link rel="stylesheet" href="/plugins/map/map.css" type="text/css">').appendTo("head");
    }

    return wiki.getScript("https://unpkg.com/leaflet@1.7.1/dist/leaflet.js", function () {
      var bounds, freezeControl, i, len, map, mapDiv, mapId, o, openWeblink, p, ref, showMarkers, tile, tileCredits, update;
      mapId = "map-".concat(Math.floor(Math.random() * 1000000));
      $item.append("<figure style=\"padding: 8px;\">\n  <div id=\"".concat(mapId, "\" style='height: 300px;'></div>\n  <p class=\"caption\">").concat(caption, "</p>\n</figure>"));
      map = L.map(mapId, {
        scrollWheelZoom: false
      });

      update = function update() {
        wiki.pageHandler.put($item.parents('.page:first'), {
          type: 'edit',
          id: item.id,
          item: item
        });
        return wiki.doPlugin($item.empty(), item);
      }; // add locate control


      if (tools != null ? tools.locate : void 0) {
        if (!$("link[href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css']").length) {
          $('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">').appendTo("head");
        }

        if (!$("link[href='https://cdn.jsdelivr.net/npm/leaflet.locatecontrol@0.72.0/dist/L.Control.Locate.min.css'")) {
          $('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet.locatecontrol@0.72.0/dist/L.Control.Locate.min.css">').appendTo("head");
        }

        wiki.getScript("https://cdn.jsdelivr.net/npm/leaflet.locatecontrol@0.72.0/dist/L.Control.Locate.min.js", function () {
          return L.control.locate({
            position: 'topleft',
            flyTo: true,
            drawCircle: true,
            drawMarker: false
          }).addTo(map);
        });
      } // add search control


      if (tools != null ? tools.search : void 0) {
        if (!$("link[href='https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css']").length) {
          $('<link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />').appendTo("head");
        }

        wiki.getScript("https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js", function () {
          var geocoder;
          return geocoder = L.Control.geocoder({
            defaultMarkGeocode: false
          }).on('markgeocode', function (e) {
            var bounds, p;
            new L.marker([e.geocode.center.lat, e.geocode.center.lng], {
              title: e.geocode.name
            }).addTo(map);
            boundary.push({
              lat: e.geocode.center.lat,
              lon: e.geocode.center.lng
            });

            if (boundary.length > 1) {
              bounds = new L.LatLngBounds([function () {
                var i, len, results;
                results = [];

                for (i = 0, len = boundary.length; i < len; i++) {
                  p = boundary[i];
                  results.push([p.lat, p.lon]);
                }

                return results;
              }()]);
              map.flyToBounds(bounds);
            } else if (boundary.length === 1) {
              p = boundary[0];
              map.flyTo([p.lat, p.lon], item.zoom || 13);
            }

            item.text += "\n".concat(e.geocode.center.lat.toFixed(7), ", ").concat(e.geocode.center.lng.toFixed(7), " ").concat(e.geocode.name);
            return update();
          }).addTo(map);
        });
      }

      if (tools != null ? tools.freeze : void 0) {
        freezeControl = L.Control.extend({
          options: {
            position: 'topright'
          },
          onAdd: function onAdd(map) {
            var container, newMarkerGroup, newMarkers;
            container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            container.innerHTML = "<a class=\"leaflet-bar-part leaflet-bar-part-single\" href=\"#\" style=\"outline: currentcolor none medium;\">\n  <span style=".concat(typeof item.frozen === "function" ? item.frozen({
              'color: black;': 'color: blue;'
            }) : void 0, ">\u2744\uFE0E</span>\n</a>");
            newMarkers = [];
            newMarkerGroup = null;

            container.onclick = function (e) {
              var toFreeze;

              if (e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();

                if (item.frozen) {
                  delete item.frozen;
                  return update();
                }
              } else {
                toFreeze = [];

                if (item.frozen) {
                  toFreeze = Array.from(new Set(item.frozen.concat(lineupMarkers).map(JSON.stringify))).map(JSON.parse);
                } else {
                  toFreeze = lineupMarkers;
                } // only update if there realy is something new to freeze or it has changed...


                if (item.frozen && toFreeze.length !== item.frozen.length || !item.frozen && toFreeze.length > 0) {
                  //(!item.frozen and toFreeze.length > 0) or toFreeze.length != item.frozen.length
                  item.frozen = toFreeze;
                  return update();
                }
              }
            }; // mouse over will show any extra markers that will be added on a re-freeze.


            container.addEventListener('mouseenter', function (e) {
              var bounds, l, m, p, tmpBoundary;
              m = new Set(markers.map(JSON.stringify));
              l = new Set(lineupMarkers.map(JSON.stringify));
              newMarkers = Array.from(new Set(Array.from(l).filter(function (x) {
                return !m.has(x);
              }))).map(JSON.parse);

              if (newMarkers.length > 0) {
                newMarkerGroup = L.layerGroup().addTo(map);
                newMarkers.forEach(function (mark) {
                  return L.marker([mark.lat, mark.lon]).addTo(newMarkerGroup);
                });
                tmpBoundary = boundary.concat(newMarkers);
                bounds = new L.LatLngBounds([function () {
                  var i, len, results;
                  results = [];

                  for (i = 0, len = tmpBoundary.length; i < len; i++) {
                    p = tmpBoundary[i];
                    results.push([p.lat, p.lon]);
                  }

                  return results;
                }()]);
                return map.flyToBounds(bounds);
              }
            });
            container.addEventListener('mouseleave', function (e) {
              var bounds, p;

              if (newMarkers.length > 0) {
                newMarkerGroup.remove();

                if (boundary.length > 1) {
                  bounds = new L.LatLngBounds([function () {
                    var i, len, results;
                    results = [];

                    for (i = 0, len = boundary.length; i < len; i++) {
                      p = boundary[i];
                      results.push([p.lat, p.lon]);
                    }

                    return results;
                  }()]);
                  return map.flyToBounds(bounds);
                } else if (boundary.length === 1) {
                  p = boundary[0];
                  return map.flyTo([p.lat, p.lon], item.zoom || 13);
                } else {
                  return map.flyTo(item.latlng || item.latLng || [40.735383, -73.984655], item.zoom || 13);
                }
              }
            });
            return container;
          },
          onRemove: function onRemove(map) {}
        }); // Nothing to do here...

        map.addControl(new freezeControl());
      } // stop dragging the map from propagating and dragging the page item.


      mapDiv = L.DomUtil.get("".concat(mapId));
      L.DomEvent.disableClickPropagation(mapDiv);
      map.doubleClickZoom.disable();
      map.on('dblclick', function (e) {
        if (e.originalEvent.shiftKey) {
          e.originalEvent.stopPropagation();
          new L.marker(e.latlng).addTo(map);
          item.text += "\n".concat(e.latlng.lat.toFixed(7), ", ").concat(e.latlng.lng.toFixed(7));
          return update();
        }
      }); // select tiles, default to OSM

      tile = item.tile || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      tileCredits = item.tileCredits || '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      L.tileLayer(tile, {
        attribution: tileCredits
      }).addTo(map);
      ref = overlays || []; // add specialized map overlays

      for (i = 0, len = ref.length; i < len; i++) {
        o = ref[i];
        L.imageOverlay(o.url, o.bounds, {
          opacity: 0.6,
          interactive: true
        }).addTo(map);
      }

      openWeblink = function openWeblink(e) {
        var link;

        if (!(link = e.target.options.weblink)) {
          return;
        }

        return window.open(link.replace(/\{LAT}/, e.latlng.lat).replace(/\{(LON|LNG)}/, e.latlng.lng));
      };

      showMarkers = function showMarkers(markers) {
        var j, len1, markerLabel, mkr, p, results;

        if (!markers) {
          return;
        }

        results = [];

        for (j = 0, len1 = markers.length; j < len1; j++) {
          p = markers[j];
          markerLabel = htmlDecode(wiki.resolveLinks(p.label));
          mkr = L.marker([p.lat, p.lon], {
            weblink: p.weblink || weblink
          }).on('dblclick', openWeblink).bindPopup(markerLabel).openPopup().addTo(map);
          results.push(showing.push({
            leaflet: mkr,
            marker: p
          }));
        }

        return results;
      }; // add markers on the map


      showMarkers(markers); // center map on markers or item properties

      if (boundary.length > 1) {
        bounds = new L.LatLngBounds([function () {
          var j, len1, results;
          results = [];

          for (j = 0, len1 = boundary.length; j < len1; j++) {
            p = boundary[j];
            results.push([p.lat, p.lon]);
          }

          return results;
        }()]);
        map.fitBounds(bounds);
      } else if (boundary.length === 1) {
        p = boundary[0];
        map.setView([p.lat, p.lon], item.zoom || 13);
      } else {
        map.setView(item.latlng || item.latLng || [40.735383, -73.984655], item.zoom || 13);
      } // announce our capability to produce a region


      $item.addClass('region-source');
      return $item.get(0).regionData = function () {
        var region;
        region = map.getBounds();
        return {
          north: region.getNorth(),
          south: region.getSouth(),
          east: region.getEast(),
          west: region.getWest()
        };
      };
    });
  };

  bind = function bind($item, item) {
    return $item.dblclick(function () {
      return wiki.textEditor($item, item);
    });
  };

  if (typeof window !== "undefined" && window !== null) {
    window.plugins.map = {
      emit: emit,
      bind: bind
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = {
      marker: marker,
      parse: parse
    };
  }
}).call(void 0);
//# sourceMappingURL=map.js.map
