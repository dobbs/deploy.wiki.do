"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(function () {
  /*
   * Federated Wiki : Factory Plugin
   *
   * Licensed under the MIT license.
   * https://github.com/fedwiki/wiki-plugin-factory/blob/master/LICENSE.txt
   */
  var arrayToJson,
      csvToArray,
      indexOf = [].indexOf;
  window.plugins.factory = {
    emit: function emit(div, item) {
      var showMenu, showPrompt;
      div.append('<p>Double-Click to Edit<br>Drop Text or Image to Insert</p>');

      showMenu = function showMenu() {
        var i, info, len, menu, menuItem, name, ref, ref1;
        menu = div.find('p').append("<br>Or Choose a Plugin");

        menuItem = function menuItem(title, name) {
          return menu.append("<li><a class=\"menu\" href=\"#\" title=\"".concat(title, "\">").concat(name, "</a></li>"));
        };

        if (Array.isArray(window.catalog)) {
          ref = window.catalog; // deprecated

          for (i = 0, len = ref.length; i < len; i++) {
            info = ref[i];
            menuItem(info.title, info.name);
          }
        } else {
          ref1 = window.catalog;

          for (name in ref1) {
            info = ref1[name];
            menuItem(info.menu, name);
          }
        }

        return menu.find('a.menu').click(function (evt) {
          div.removeClass('factory').addClass(item.type = evt.target.text.toLowerCase());
          div.unbind();
          return wiki.textEditor(div, item);
        });
      };

      showPrompt = function showPrompt() {
        return div.append("<p>".concat(wiki.resolveLinks(item.prompt), "</b>"));
      };

      if (item.prompt) {
        return showPrompt();
      } else if (window.catalog != null) {
        return showMenu();
      } else {
        return $.getJSON('/system/factories.json', function (data) {
          window.catalog = data;
          return showMenu();
        });
      }
    },
    bind: function bind(div, item) {
      var syncEditAction;

      syncEditAction = function syncEditAction() {
        var err, pageElement;
        wiki.log('factory item', item);
        div.empty().unbind();
        div.removeClass("factory").addClass(item.type);
        pageElement = div.parents('.page:first');

        try {
          div.data('pageElement', pageElement);
          div.data('item', item);
          wiki.getPlugin(item.type, function (plugin) {
            plugin.emit(div, item);
            return plugin.bind(div, item);
          });
        } catch (error) {
          err = error;
          div.append("<p class='error'>".concat(err, "</p>"));
        }

        return wiki.pageHandler.put(pageElement, {
          type: 'edit',
          id: item.id,
          item: item
        });
      };

      div.dblclick(function () {
        div.removeClass('factory').addClass(item.type = 'paragraph');
        div.unbind();
        return wiki.textEditor(div, item);
      });
      div.bind('dragenter', function (evt) {
        return evt.preventDefault();
      });
      div.bind('dragover', function (evt) {
        return evt.preventDefault();
      });
      return div.bind("drop", function (dropEvent) {
        var dt, found, ignore, origin, punt, readFile, url;

        punt = function punt(data) {
          item.prompt = "<b>Unexpected Item</b><br>We can't make sense of the drop.<br>".concat(JSON.stringify(data), "<br>Try something else or see [[About Factory Plugin]].");
          data.userAgent = navigator.userAgent;
          item.punt = data;
          wiki.log('factory punt', dropEvent);
          return syncEditAction();
        };

        readFile = function readFile(file) {
          var majorType, minorType, reader;

          if (file != null) {
            var _file$type$split = file.type.split("/");

            var _file$type$split2 = _slicedToArray(_file$type$split, 2);

            majorType = _file$type$split2[0];
            minorType = _file$type$split2[1];

            if (file.name.toLowerCase().match(/\.csv$/)) {
              majorType = 'text';
              minorType = 'csv';
            }

            reader = new FileReader();

            if (majorType === "image") {
              reader.onload = function (loadEvent) {
                item.type = 'image';
                item.url = loadEvent.target.result;
                item.caption || (item.caption = "Uploaded image");
                return syncEditAction();
              };

              return reader.readAsDataURL(file);
            } else if (majorType === "text") {
              reader.onload = function (loadEvent) {
                var array, result;
                result = loadEvent.target.result;

                if (minorType === 'csv') {
                  item.type = 'data';
                  item.columns = (array = csvToArray(result))[0];
                  item.data = arrayToJson(array);
                  item.text = file.fileName;
                } else {
                  item.type = 'paragraph';
                  item.text = result;
                }

                return syncEditAction();
              };

              return reader.readAsText(file);
            } else {
              return punt({
                number: 1,
                name: file.fileName,
                type: file.type
              });
            }
          } else {
            return punt({
              number: 2,
              types: dropEvent.originalEvent.dataTransfer.types
            });
          }
        };

        dropEvent.preventDefault();

        if ((dt = dropEvent.originalEvent.dataTransfer) != null) {
          if (dt.types != null && (indexOf.call(dt.types, 'text/uri-list') >= 0 || indexOf.call(dt.types, 'text/x-moz-url') >= 0) && !(indexOf.call(dt.types, 'Files') >= 0)) {
            url = dt.getData('URL');

            if (found = url.match(/^https?:\/\/([a-zA-Z0-9:.-]+)(\/([a-zA-Z0-9:.-]+)\/([a-z0-9-]+(_rev\d+)?))+$/)) {
              wiki.log('factory drop url', found);
              var _found = found;

              var _found2 = _slicedToArray(_found, 6);

              ignore = _found2[0];
              origin = _found2[1];
              ignore = _found2[2];
              item.site = _found2[3];
              item.slug = _found2[4];
              ignore = _found2[5];

              if ($.inArray(item.site, ['view', 'local', 'origin']) >= 0) {
                item.site = origin;
              }

              return $.getJSON("//".concat(item.site, "/").concat(item.slug, ".json"), function (remote) {
                wiki.log('factory remote', remote);
                item.type = 'reference';
                item.title = remote.title || item.slug;
                item.text = wiki.createSynopsis(remote);
                syncEditAction();

                if (item.site != null) {
                  return wiki.registerNeighbor(item.site);
                }
              });
            } else {
              return punt({
                number: 4,
                url: url,
                types: dt.types
              });
            }
          } else if (indexOf.call(dt.types, 'Files') >= 0) {
            return readFile(dt.files[0]);
          } else {
            return punt({
              number: 5,
              types: dt.types
            });
          }
        } else {
          return punt({
            number: 6,
            trouble: "no data transfer object"
          });
        }
      });
    }
  }; // from http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
  // via http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data

  csvToArray = function csvToArray(strData, strDelimiter) {
    var arrData, arrMatches, objPattern, strMatchedDelimiter, strMatchedValue;
    strDelimiter = strDelimiter || ",";
    objPattern = new RegExp("(\\" + strDelimiter + "|\\r?\\n|\\r|^)" + "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" + "([^\"\\" + strDelimiter + "\\r\\n]*))", "gi");
    arrData = [[]];
    arrMatches = null;

    while (arrMatches = objPattern.exec(strData)) {
      strMatchedDelimiter = arrMatches[1];

      if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
        arrData.push([]);
      }

      if (arrMatches[2]) {
        strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
      } else {
        strMatchedValue = arrMatches[3];
      }

      arrData[arrData.length - 1].push(strMatchedValue);
    }

    return arrData;
  };

  arrayToJson = function arrayToJson(array) {
    var cols, i, len, results, row, rowToObject;
    cols = array.shift();

    rowToObject = function rowToObject(row) {
      var i, k, len, obj, ref, v;
      obj = {};
      ref = _.zip(cols, row);

      for (i = 0, len = ref.length; i < len; i++) {
        var _ref$i = _slicedToArray(ref[i], 2);

        k = _ref$i[0];
        v = _ref$i[1];

        if (v != null && v.match(/\S/) && v !== 'NULL') {
          obj[k] = v;
        }
      }

      return obj;
    };

    results = [];

    for (i = 0, len = array.length; i < len; i++) {
      row = array[i];
      results.push(rowToObject(row));
    }

    return results;
  };
}).call(void 0);
//# sourceMappingURL=factory.js.map
