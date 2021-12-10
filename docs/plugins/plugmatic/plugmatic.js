"use strict";

(function () {
  var any, bind, emit, escape, expand, parse, traffic;

  any = function any(array) {
    return array[Math.floor(Math.random() * array.length)];
  };

  traffic = function traffic(installed, published) {
    var color;
    color = {
      gray: '#ccc',
      red: '#f55',
      yellow: '#fb0',
      green: '#0e0'
    };

    if (installed != null && published != null) {
      if (installed === published) {
        return color.green;
      } else {
        return color.yellow;
      }
    } else {
      if (published != null) {
        return color.red;
      } else {
        return color.gray;
      }
    }
  };

  escape = function escape(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  expand = function expand(string) {
    var external, stash, stashed, unstash;
    stashed = [];

    stash = function stash(text) {
      var here;
      here = stashed.length;
      stashed.push(text);
      return "\u3016".concat(here, "\u3017");
    };

    unstash = function unstash(match, digits) {
      return stashed[+digits];
    };

    external = function external(match, href, protocol) {
      return stash("\"<a class=\"external\" target=\"_blank\" href=\"".concat(href, "\" title=\"").concat(href, "\" rel=\"nofollow\">").concat(escape(href), "</a>\""));
    };

    string = string.replace(/〖(\d+)〗/g, "〖 $1 〗").replace(/"((http|https|ftp):.*?)"/gi, external);
    return escape(string).replace(/〖(\d+)〗/g, unstash);
  };

  parse = function parse(text) {
    var i, len, line, lines, m, result;
    result = {
      columns: [],
      plugins: []
    };
    lines = (text || '').split(/\n+/);

    for (i = 0, len = lines.length; i < len; i++) {
      line = lines[i];

      if (line.match(/\bSTATUS\b/)) {
        result.columns.push('status');
      }

      if (line.match(/\bNAME\b/)) {
        result.columns.push('name');
      }

      if (line.match(/\bMENU\b/)) {
        result.columns.push('menu');
      }

      if (line.match(/\bPAGES\b/)) {
        result.columns.push('pages');
      }

      if (line.match(/\bSERVICE\b/)) {
        result.columns.push('service');
      }

      if (line.match(/\bBUNDLED\b/)) {
        result.columns.push('bundled');
      }

      if (line.match(/\bINSTALLED\b/)) {
        result.columns.push('installed');
      }

      if (line.match(/\bPUBLISHED\b/)) {
        result.columns.push('published');
      }

      if (m = line.match(/^wiki-plugin-(\w+)$/)) {
        result.plugins.push(m[1]);
      }
    }

    if (result.columns.length === 0) {
      result.columns = result.plugins.length === 0 ? ['name', 'pages', 'menu', 'bundled', 'installed'] : ['status', 'name', 'pages', 'bundled', 'installed', 'published'];
    }

    return result;
  };

  emit = function emit($item, item) {
    var markup, render, trouble;
    markup = parse(item.text);
    $item.append("<p style=\"background-color:#eee;padding:15px;\">\n  loading plugin details\n</p>");

    render = function render(data) {
      var bright, column, detail, format, installer, more, normal, pub, report, showdetail;
      column = 'installed';

      pub = function pub(name) {
        return data.publish.find(function (obj) {
          return obj.plugin === name;
        });
      };

      format = function format(markup, plugin, dependencies) {
        var i, len, months, name, ref, result, status;
        name = plugin.plugin;
        months = plugin.birth ? ((Date.now() - plugin.birth) / 1000 / 3600 / 24 / 31.5).toFixed(0) : '';

        status = function status() {
          var installed, published, ref, ref1;
          installed = (ref = plugin["package"]) != null ? ref.version : void 0;
          published = (ref1 = pub(name).npm) != null ? ref1.version : void 0;
          return traffic(installed, published);
        };

        result = ["<tr class=row data-name=".concat(plugin.plugin, ">")];
        ref = markup.columns;

        for (i = 0, len = ref.length; i < len; i++) {
          column = ref[i];
          result.push(function () {
            var ref1, ref2, ref3, ref4;

            switch (column) {
              case 'status':
                return "<td title=status style='text-align:center; color: ".concat(status(), "'>\u25C9");

              case 'name':
                return "<td title=name> ".concat(name);

              case 'menu':
                return "<td title=menu> ".concat(((ref1 = plugin.factory) != null ? ref1.category : void 0) || '');

              case 'pages':
                return "<td title=pages style='text-align:center;'>".concat(((ref2 = plugin.pages) != null ? ref2.length : void 0) || '');

              case 'service':
                return "<td title=service style='text-align:center;'>".concat(months);

              case 'bundled':
                return "<td title=bundled> ".concat(dependencies['wiki-plugin-' + name] || '');

              case 'installed':
                return "<td title=installed> ".concat(((ref3 = plugin["package"]) != null ? ref3.version : void 0) || '');

              case 'published':
                return "<td title=published> ".concat(((ref4 = pub(name).npm) != null ? ref4.version : void 0) || '');
            }
          }());
        }

        return result.join("\n");
      };

      report = function report(markup, plugins, dependencies) {
        var head, index, inventory, plugin, result, retrieve;

        retrieve = function retrieve(name) {
          var i, len, plugin;

          for (i = 0, len = plugins.length; i < len; i++) {
            plugin = plugins[i];

            if (plugin.plugin === name) {
              return plugin;
            }
          }

          return {
            plugin: name
          };
        };

        inventory = markup.plugins.length > 0 ? markup.plugins.map(retrieve) : plugins;

        head = function () {
          var i, len, ref, results;
          ref = markup.columns;
          results = [];

          for (i = 0, len = ref.length; i < len; i++) {
            column = ref[i];
            results.push("<td style='font-size:75%; color:gray;'>".concat(column));
          }

          return results;
        }().join("\n");

        result = function () {
          var i, len, results;
          results = [];

          for (index = i = 0, len = inventory.length; i < len; index = ++i) {
            plugin = inventory[index];
            results.push(format(markup, plugin, dependencies));
          }

          return results;
        }().join("\n");

        return "<center> <p><img src='/favicon.png' width=16> <span style='color:gray;'>".concat(window.location.host, "</span></p> <table style=\"width:100%;\"><tr> ").concat(head, " ").concat(result, "</table> <button class=restart>restart</button> </center>");
      };

      installer = function installer(row, npm) {
        var $row, array, choice, choices, installed, version;

        if (npm == null) {
          return "<p>can't find wiki-plugin-".concat(row.plugin, " in <a href=//npmjs.com target=_blank>npmjs.com</a></p>");
        }

        $row = $item.find("table [data-name=".concat(row.plugin, "]"));

        installed = function installed(update) {
          var index, ref, ref1, ref2;
          index = data.install.indexOf(row);
          data.install[index] = row = update.row;
          $row.find("[title=status]").css('color', traffic(update.installed, npm.version));
          $row.find("[title=menu]").text(((ref = row.factory) != null ? ref.category : void 0) || '');
          $row.find("[title=pages]").text(((ref1 = row.pages) != null ? ref1.length : void 0) || '');
          $row.find('[title=service]').text('0');
          $row.find("[title=installed]").text(((ref2 = row["package"]) != null ? ref2.version : void 0) || '');
          return $item.find('button.restart').removeAttr('disabled').show();
        };

        window.plugins.plugmatic.install = function (version) {
          $.ajax({
            type: 'POST',
            url: '/plugin/plugmatic/install',
            data: JSON.stringify({
              version: version,
              plugin: row.plugin
            }),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: installed,
            error: trouble
          }); // http://stackoverflow.com/questions/2933826/how-to-close-jquery-dialog-within-the-dialog

          $row.find("[title=status]").css('color', 'white');
          return $('.ui-dialog-content:visible').dialog('close');
        };

        array = function array(obj) {
          if (typeof obj === 'string') {
            return [obj];
          } else {
            return obj;
          }
        };

        choice = function choice(version) {
          var button, ref;

          button = function button() {
            return "<button onclick=window.plugins.plugmatic.install('".concat(version, "')> install </button>");
          };

          return "<tr> <td> ".concat(version, " <td> ").concat(version === ((ref = row["package"]) != null ? ref.version : void 0) ? 'installed' : button());
        };

        choices = function () {
          var i, len, ref, results;
          ref = array(npm.versions).reverse();
          results = [];

          for (i = 0, len = ref.length; i < len; i++) {
            version = ref[i];
            results.push(choice(version));
          }

          return results;
        }();

        return "<h3>".concat(npm.description, "</h3> <p>Choose a version to install.</p> <table>").concat(choices.join("\n"));
      };

      detail = function detail(name, done) {
        var birth, npmjs, pages, row, struct, text;
        row = data.install.find(function (obj) {
          return obj.plugin === name;
        });

        text = function text(obj) {
          if (!obj) {
            return '';
          }

          return expand(obj).replace(/\n/g, '<br>');
        };

        struct = function struct(obj) {
          if (!obj) {
            return '';
          }

          return "<pre>".concat(expand(JSON.stringify(obj, null, '  ')), "</pre>");
        };

        pages = function pages(obj) {
          return "<p><b><a href=#>".concat(obj.title, "</a></b><br>").concat(obj.synopsis, "</p>");
        };

        birth = function birth(obj) {
          if (obj) {
            return new Date(obj).toString();
          } else {
            return 'built-in';
          }
        };

        npmjs = function npmjs(more) {
          return $.getJSON("/plugin/plugmatic/view/".concat(name), more);
        };

        switch (column) {
          case 'status':
            return npmjs(function (npm) {
              return done(installer(row, npm));
            });

          case 'name':
            return done(text(row.authors));

          case 'menu':
            return done(struct(row.factory));

          case 'pages':
            return done(row.pages.map(pages).join(''));

          case 'service':
            return done(birth(row.birth));

          case 'bundled':
            return done(struct(data.bundle.data.dependencies));

          case 'installed':
            return done(struct(row["package"]));

          case 'published':
            return done(struct(pub(name).npm || ''));

          default:
            return done('unexpected column');
        }
      };

      showdetail = function showdetail(e) {
        var $parent, name;
        $parent = $(e.target).parent();
        name = $parent.data('name');
        return detail(name, function (html) {
          return wiki.dialog("".concat(name, " plugin ").concat(column), html || '');
        });
      };

      more = function more(e) {
        if (e.shiftKey) {
          return showdetail(e);
        }
      };

      bright = function bright(e) {
        more(e);
        return $(e.currentTarget).css('background-color', '#f8f8f8');
      };

      normal = function normal(e) {
        return $(e.currentTarget).css('background-color', '#eee');
      };

      $item.find('p').html(report(markup, data.install, data.bundle.data.dependencies));
      $item.find('.row').hover(bright, normal);
      $item.find('p td').click(function (e) {
        column = $(e.target).attr('title');
        return showdetail(e);
      });
      return $item.find('button.restart').hide().click(function (e) {
        $item.find('button.restart').attr("disabled", "disabled");
        return $.ajax({
          type: 'POST',
          url: '/plugin/plugmatic/restart',
          success: function success() {},
          // poll for restart complete, then ...
          // $item.find('button.restart').hide()
          error: trouble
        });
      });
    };

    trouble = function trouble(xhr) {
      var ref;
      return $item.find('p').html(((ref = xhr.responseJSON) != null ? ref.error : void 0) || 'server error');
    };

    if (markup.plugins.length) {
      return $.ajax({
        type: 'POST',
        url: '/plugin/plugmatic/plugins',
        data: JSON.stringify(markup),
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: render,
        error: trouble
      });
    } else {
      return $.ajax({
        url: '/plugin/plugmatic/plugins',
        dataType: 'json',
        success: render,
        error: trouble
      });
    }
  };

  bind = function bind($item, item) {
    return $item.dblclick(function () {
      return wiki.textEditor($item, item);
    });
  };

  if (typeof window !== "undefined" && window !== null) {
    window.plugins.plugmatic = {
      emit: emit,
      bind: bind
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = {
      parse: parse
    };
  }
}).call(void 0);
//# sourceMappingURL=plugmatic.js.map
