"use strict";

(function () {
  var bind, context, delete_file, emit, expand, fetch_list, get_file, ignore, post_upload;

  expand = function expand(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  ignore = function ignore(e) {
    e.preventDefault();
    return e.stopPropagation();
  };

  context = function context($item) {
    var action, i, journal, len, ref, remote, sites;
    sites = [location.host];

    if (remote = $item.parents('.page').data('site')) {
      if (remote !== location.host) {
        sites.push(remote);
      }
    }

    journal = $item.parents('.page').data('data').journal;
    ref = journal.slice(0).reverse();

    for (i = 0, len = ref.length; i < len; i++) {
      action = ref[i];

      if (action.site != null && !sites.includes(action.site)) {
        sites.push(action.site);
      }
    }

    return sites;
  };

  post_upload = function post_upload($item, item, form) {
    var $progress, tick;
    $progress = $item.find('.progress-bar');

    tick = function tick(e) {
      var percentComplete;

      if (!e.lengthComputable) {
        return;
      }

      percentComplete = e.loaded / e.total;
      percentComplete = parseInt(percentComplete * 100);
      $progress.text("".concat(percentComplete, "%"));
      return $progress.width("".concat(percentComplete, "%"));
    };

    return $.ajax({
      url: '/plugin/assets/upload',
      type: 'POST',
      data: form,
      processData: false,
      contentType: false,
      success: function success() {
        $item.empty();
        emit($item, item);
        return bind($item, item);
      },
      error: function error(e) {
        console.log('error', e);
        $progress.text("upload error: ".concat(e.statusText, " ").concat(e.responseText || ''));
        return $progress.width('100%');
      },
      xhr: function xhr() {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', tick, false);
        return xhr;
      }
    });
  };

  get_file = function get_file($item, item, url, success) {
    var assets, filename;
    assets = item.text.match(/([\w\/-]*)/)[1];
    filename = url.split('/').reverse()[0];
    return fetch(url).then(function (response) {
      return response.blob();
    }).then(function (blob) {
      var file, form;
      file = new File([blob], filename, {
        type: blob.type
      });
      form = new FormData();
      form.append('assets', assets);
      form.append('uploads[]', file, file.name);
      return success(form);
    })["catch"](function (e) {
      var $progress;
      $progress = $item.find('.progress-bar');
      $progress.text("Copy error: ".concat(e.message));
      return $progress.width('100%');
    });
  };

  delete_file = function delete_file($item, item, url) {
    var assets, file;
    file = url.split('/').reverse()[0];
    assets = item.text;
    return $.ajax({
      url: "/plugin/assets/delete?file=".concat(file, "&assets=").concat(assets),
      type: 'POST',
      success: function success() {
        $item.empty();
        emit($item, item);
        return bind($item, item);
      },
      error: function error(e) {
        var $progress;
        $progress = $item.find('.progress-bar');
        $progress.text("Delete error: ".concat(e.statusText, " ").concat(e.responseText || ''));
        return $progress.width('100%');
      }
    });
  };

  fetch_list = function fetch_list($item, item, $report, assets, remote, assetsData) {
    var assetsURL, link, render, requestSite, trouble;
    requestSite = remote != null ? remote : null;
    assetsURL = wiki.site(requestSite).getDirectURL('assets');

    if (assetsURL === '') {
      $report.text("site not currently reachable.");
      return;
    }

    link = function link(file) {
      var act, href;
      href = "".concat(assetsURL, "/").concat(assets === '' ? "" : assets + "/").concat(encodeURIComponent(file)); // todo: no action if not logged on

      act = !isOwner ? '' : remote !== location.host ? '<button class="copy">⚑</button> ' : '<button class="delete">✕</button> ';
      return "<span>".concat(act, "<a href=\"").concat(href, "\" target=_blank>").concat(expand(file), "</a></span>");
    };

    render = function render(data) {
      var file, files;
      assetsData[assets] || (assetsData[assets] = {});

      if (data.error) {
        if (data.error.code === 'ENOENT') {
          return $report.text("no files");
        }

        return $report.text("plugin reports: ".concat(data.error.code));
      }

      files = data.files;
      assetsData[assets][assetsURL] = files;

      if (files.length === 0) {
        return $report.text("no files");
      }

      $report.html(function () {
        var i, len, results;
        results = [];

        for (i = 0, len = files.length; i < len; i++) {
          file = files[i];
          results.push(link(file));
        }

        return results;
      }().join("<br>"));
      $report.find('button.copy').click(function (e) {
        var href;
        href = $(e.target).parent().find('a').attr('href');
        return get_file($item, item, href, function (form) {
          return post_upload($item, item, form);
        });
      });
      return $report.find('button.delete').click(function (e) {
        var href;
        href = $(e.target).parent().find('a').attr('href');
        return delete_file($item, item, href);
      });
    };

    trouble = function trouble(e) {
      return $report.text("plugin error: ".concat(e.statusText, " ").concat(e.responseText || ''));
    };

    return $.ajax({
      url: wiki.site(requestSite).getURL('plugin/assets/list'),
      data: {
        assets: assets
      },
      dataType: 'json',
      success: render,
      error: trouble
    });
  };

  emit = function emit($item, item) {
    var $report, assets, assetsData, i, len, ref, results, site, uploader;

    uploader = function uploader() {
      if ($item.parents('.page').hasClass('remote')) {
        return '';
      }

      return "<div style=\"background-color:#ddd;\" class=\"progress-bar\" role=\"progressbar\"></div>\n<center><button class=\"upload\">upload</button></center>\n<input style=\"display: none;\" type=\"file\" name=\"uploads[]\" multiple=\"multiple\">";
    };

    $item.append("<div style=\"background-color:#eee;padding:15px; margin-block-start:1em; margin-block-end:1em;\">\n  <dl style=\"margin:0;color:gray\"></dl>\n  ".concat(uploader(), "\n</div>"));
    assetsData = {};
    $item.addClass('assets-source');

    $item.get(0).assetsData = function () {
      return assetsData;
    };

    assets = item.text.match(/([\w\/-]*)/)[1];
    ref = context($item);
    results = [];

    for (i = 0, len = ref.length; i < len; i++) {
      site = ref[i];
      $report = $item.find('dl').prepend("<dt><img width=12 src=\"".concat(wiki.site(site).flag(), "\"> ").concat(site, "</dt>\n<dd style=\"margin:8px;\"></dd>"));
      results.push(fetch_list($item, item, $report.find('dd:first'), assets, site, assetsData));
    }

    return results;
  };

  bind = function bind($item, item) {
    var $button, $input, assets, upload;
    assets = item.text.match(/([\w\/-]*)/)[1];
    $item.dblclick(function () {
      return wiki.textEditor($item, item);
    }); // https://coligo.io/building-ajax-file-uploader-with-node/

    $button = $item.find('.upload');
    $input = $item.find('input');
    $button.click(function (e) {
      return $input.click();
    });
    $input.on('change', function (e) {
      return upload($(this).get(0).files);
    });
    $item.on('dragover', ignore);
    $item.on('dragenter', ignore);
    $item.on('drop', function (e) {
      var ref;
      ignore(e);
      return upload((ref = e.originalEvent.dataTransfer) != null ? ref.files : void 0);
    });
    return upload = function upload(files) {
      var file, form, i, len;

      if (!(files != null ? files.length : void 0)) {
        return;
      }

      form = new FormData();
      form.append('assets', assets);

      for (i = 0, len = files.length; i < len; i++) {
        file = files[i];
        form.append('uploads[]', file, file.name);
      }

      return post_upload($item, item, form);
    };
  };

  if (typeof window !== "undefined" && window !== null) {
    window.plugins.assets = {
      emit: emit,
      bind: bind
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = {
      expand: expand
    };
  }
}).call(void 0);
//# sourceMappingURL=assets.js.map
