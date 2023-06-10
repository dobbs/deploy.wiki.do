(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

console.log("Window Name: " + window.name);
window.name = window.location.host;
window.wiki = require('./lib/wiki');

require('./lib/legacy');

require('./lib/bind');

require('./lib/plugins');

},{"./lib/bind":5,"./lib/legacy":13,"./lib/plugins":23,"./lib/wiki":37}],2:[function(require,module,exports){
"use strict";

// We use unicode characters as icons for actions
// in the journal. Fork and add are also button
// labels used for user actions leading to forks
// and adds. How poetic.
// Page keeps its own list of symbols used as journal
// action separators.
var add, fork, symbols;
symbols = {
  create: '☼',
  add: '+',
  edit: '✎',
  fork: '⚑',
  move: '↕',
  remove: '✕',
  copyIn: '⨭',
  copyOut: '⨵'
};
fork = symbols['fork'];
add = symbols['add'];
module.exports = {
  symbols: symbols,
  fork: fork,
  add: add
};

},{}],3:[function(require,module,exports){
"use strict";

// Wiki considers one page to be active. Use active.set to change which
// page this is. A page need not be active to be edited.
var active, findScrollContainer, scrollTo;
module.exports = active = {};
active.scrollContainer = void 0;

findScrollContainer = function findScrollContainer() {
  var scrolled;
  scrolled = $("body, html").filter(function () {
    return $(this).scrollLeft() > 0;
  });

  if (scrolled.length > 0) {
    return scrolled;
  } else {
    return $("body, html").scrollLeft(12).filter(function () {
      return $(this).scrollLeft() > 0;
    }).scrollTop(0);
  }
};

scrollTo = function scrollTo($page) {
  var bodyWidth, contentWidth, maxX, minX, scrollTarget, target, width;

  if ($page.position() == null) {
    return;
  }

  if (active.scrollContainer == null) {
    active.scrollContainer = findScrollContainer();
  }

  bodyWidth = $("body").width();
  minX = active.scrollContainer.scrollLeft();
  maxX = minX + bodyWidth;
  target = $page.position().left;
  width = $page.outerWidth(true);
  contentWidth = $(".page").outerWidth(true) * $(".page").length; // determine target position to scroll to...

  if (target < minX) {
    scrollTarget = target;
  } else if (target + width > maxX) {
    scrollTarget = target - (bodyWidth - width);
  } else if (maxX > $(".pages").outerWidth()) {
    scrollTarget = Math.min(target, contentWidth - bodyWidth);
  } // scroll to target and set focus once animation is complete


  return active.scrollContainer.animate({
    scrollLeft: scrollTarget
  }, function () {
    if (!$.contains($page[0], document.activeElement)) {
      // only set focus if focus is not already within the page to get focus
      return $page.focus();
    }
  });
};

active.set = function ($page, noScroll) {
  $('.incremental-search').remove();
  $page = $($page);
  $(".active").removeClass("active");
  $page.addClass("active");

  if (!noScroll) {
    return scrollTo($page);
  }
};

},{}],4:[function(require,module,exports){
"use strict";

// A wiki page has a journal of actions that have been completed.
// The addToJournal function is called when the origin server
// response that the network operation is complete.
var actionSymbols, util;
util = require('./util');
actionSymbols = require('./actionSymbols');

module.exports = function ($journal, action) {
  var $action, $page, controls, ref, ref1, title;
  $page = $journal.parents('.page:first');
  title = '';

  if (action.site != null) {
    title += "".concat(action.site, "\n");
  }

  title += action.type || 'separator';

  if (action.date != null) {
    title += " ".concat(util.formatElapsedTime(action.date));
  }

  if (((ref = action.attribution) != null ? ref.page : void 0) != null) {
    title += "\nfrom ".concat(action.attribution.page);
  }

  if (((ref1 = action.removedTo) != null ? ref1.page : void 0) != null) {
    title += "\nto ".concat(action.removedTo.page);
  }

  $action = $("<a href=\"#\" /> ").addClass("action").addClass(action.type || 'separator').text(action.symbol || actionSymbols.symbols[action.type]).attr('title', title).attr('data-id', action.id || "0").data('action', action);

  if (action.type === 'add' && action.attribution != null) {
    $action.text(actionSymbols.symbols['copyIn']);

    if (action.attribution.site != null) {
      $action.css("background-image", "url(".concat(wiki.site(action.attribution.site).flag(), ")"));
    }
  }

  if (action.type === 'remove' && action.removedTo != null) {
    $action.text(actionSymbols.symbols['copyOut']);
  }

  controls = $journal.children('.control-buttons');

  if (controls.length > 0) {
    $action.insertBefore(controls);
  } else {
    $action.appendTo($journal);
  }

  if (action.type === 'fork' && action.site != null) {
    return $action.css("background-image", "url(".concat(wiki.site(action.site).flag())).attr("href", "".concat(wiki.site(action.site).getDirectURL($page.attr('id')), ".html")).attr("target", "".concat(action.site)).data("site", action.site).data("slug", $page.attr('id'));
  }
};

},{"./actionSymbols":2,"./util":36}],5:[function(require,module,exports){
"use strict";

// Bind connects the searchbox and the neighbors, both views,
// to the neighborhood, the model that they use. This breaks
// a dependency loop that will probably dissapear when views
// are more event oriented.
// Similarly state depends on injection rather than requiring
// link and thereby breaks another dependency loop.
var link, neighborhood, neighbors, searchbox, state;
neighborhood = require('./neighborhood');
neighbors = require('./neighbors');
searchbox = require('./searchbox');
state = require('./state');
link = require('./link');
$(function () {
  searchbox.inject(neighborhood);
  searchbox.bind();
  neighbors.inject(neighborhood);
  neighbors.bind();

  if (window.seedNeighbors) {
    seedNeighbors.split(',').forEach(function (site) {
      return neighborhood.registerNeighbor(site.trim());
    });
  }

  return state.inject(link);
});

},{"./link":16,"./neighborhood":17,"./neighbors":18,"./searchbox":30,"./state":33}],6:[function(require,module,exports){
"use strict";

// Dialog manages a single <div> that is used to present a
// jQuery UI dialog used for detail display, usually on
// double click.
var $dialog, emit, open, resolve;
resolve = require('./resolve');
$dialog = null;

emit = function emit() {
  return $dialog = $('<div></div>').html('This dialog will show every time!').dialog({
    autoOpen: false,
    title: 'Basic Dialog',
    height: 600,
    width: 800
  });
};

open = function open(title, html) {
  $dialog.html(html);
  $dialog.dialog("option", "title", resolve.resolveLinks(title));
  return $dialog.dialog('open');
};

module.exports = {
  emit: emit,
  open: open
};

},{"./resolve":27}],7:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

// handle drops of wiki pages or thing that go on wiki pages
// (we'll move decoding logic out of factory)
var dispatch,
    isFile,
    isImage,
    isPage,
    isSvg,
    isUrl,
    isVideo,
    nurl,
    indexOf = [].indexOf;
nurl = require('url');

isFile = function isFile(event) {
  var dt;

  if ((dt = event.originalEvent.dataTransfer) != null) {
    if (indexOf.call(dt.types, 'Files') >= 0) {
      return dt.files[0];
    }
  }

  return null;
};

isUrl = function isUrl(event) {
  var dt, url;

  if ((dt = event.originalEvent.dataTransfer) != null) {
    if (dt.types != null && (indexOf.call(dt.types, 'text/uri-list') >= 0 || indexOf.call(dt.types, 'text/x-moz-url') >= 0)) {
      url = dt.getData('URL');

      if (url != null ? url.length : void 0) {
        return url;
      }
    }
  }

  return null;
};

isPage = function isPage(url) {
  var found, ignore, item, origin, ref;

  if (found = url.match(/^https?:\/\/([a-zA-Z0-9:.-]+)(\/([a-zA-Z0-9:.-]+)\/([a-z0-9-]+(_rev\d+)?))+$/)) {
    item = {};
    var _found = found;

    var _found2 = (0, _slicedToArray2["default"])(_found, 6);

    ignore = _found2[0];
    origin = _found2[1];
    ignore = _found2[2];
    item.site = _found2[3];
    item.slug = _found2[4];
    ignore = _found2[5];

    if ((ref = item.site) === 'view' || ref === 'local' || ref === 'origin') {
      item.site = origin;
    }

    return item;
  }

  return null;
};

isImage = function isImage(url) {
  var parsedURL;
  parsedURL = nurl.parse(url, true, true);

  if (parsedURL.pathname.match(/\.(jpg|jpeg|png)$/i)) {
    return url;
  }

  return null;
};

isSvg = function isSvg(url) {
  var parsedURL;
  parsedURL = nurl.parse(url, true, true);

  if (parsedURL.pathname.match(/\.(svg)$/i)) {
    return url;
  }

  return null;
};

isVideo = function isVideo(url) {
  var error, parsedURL;
  parsedURL = nurl.parse(url, true, true);

  try {
    // check if video dragged from search (Google)
    if (parsedURL.query.source === 'video') {
      parsedURL = nurl.parse(parsedURL.query.url, true, true);
    }
  } catch (error1) {
    error = error1;
  }

  switch (parsedURL.hostname) {
    case "www.youtube.com":
      if (parsedURL.query.list != null) {
        return {
          text: "YOUTUBE PLAYLIST ".concat(parsedURL.query.list)
        };
      } else {
        return {
          text: "YOUTUBE ".concat(parsedURL.query.v)
        };
      }

      break;

    case "youtu.be":
      // should redirect to www.youtube.com, but...
      if (parsedURL.query.list != null) {
        return {
          text: "YOUTUBE PLAYLIST ".concat(parsedURL.query.list)
        };
      } else {
        return {
          text: "YOUTUBE ".concat(parsedURL.pathname.substr(1))
        };
      }

      break;

    case "vimeo.com":
      return {
        text: "VIMEO ".concat(parsedURL.pathname.substr(1))
      };

    case "archive.org":
      return {
        text: "ARCHIVE ".concat(parsedURL.pathname.substr(parsedURL.pathname.lastIndexOf('/') + 1))
      };

    case "tedxtalks.ted.com":
      return {
        text: "TEDX ".concat(parsedURL.pathname.substr(parsedURL.pathname.lastIndexOf('/') + 1))
      };

    case "www.ted.com":
      return {
        text: "TED ".concat(parsedURL.pathname.substr(parsedURL.pathname.lastIndexOf('/') + 1))
      };

    default:
      return null;
  }
};

dispatch = function dispatch(handlers) {
  return function (event) {
    var file, handle, image, page, punt, ref, stop, svg, url, video;

    stop = function stop(ignored) {
      event.preventDefault();
      return event.stopPropagation();
    };

    if (url = isUrl(event)) {
      if (page = isPage(url)) {
        if ((handle = handlers.page) != null) {
          return stop(handle(page));
        }
      }

      if (video = isVideo(url)) {
        if ((handle = handlers.video) != null) {
          return stop(handle(video));
        }
      }

      if (image = isImage(url)) {
        if ((handle = handlers.image) != null) {
          return stop(handle(image));
        }
      }

      if (svg = isSvg(url)) {
        if ((handle = handlers.svg) != null) {
          return stop(handle(svg));
        }
      }

      punt = {
        url: url
      };
    }

    if (file = isFile(event)) {
      if ((handle = handlers.file) != null) {
        return stop(handle(file));
      }

      punt = {
        file: file
      };
    }

    if ((handle = handlers.punt) != null) {
      punt || (punt = {
        dt: event.dataTransfer,
        types: (ref = event.dataTransfer) != null ? ref.types : void 0
      });
      return stop(handle(punt));
    }
  };
};

module.exports = {
  dispatch: dispatch
};

},{"@babel/runtime/helpers/interopRequireDefault":40,"@babel/runtime/helpers/slicedToArray":43,"url":60}],8:[function(require,module,exports){
"use strict";

// Editor provides a small textarea for editing wiki markup.
// It can split and join paragraphs markup but leaves other
// types alone assuming they will interpret multiple lines.
var escape, getSelectionPos, itemz, link, pageHandler, plugin, random, setCaretPosition, spawnEditor, _textEditor;

plugin = require('./plugin');
itemz = require('./itemz');
pageHandler = require('./pageHandler');
link = require('./link');
random = require('./random'); // Editor takes a div and an item that goes in it.
// Options manage state during splits and joins.
// Options are available to plugins but rarely used.
//   caret: position -- sets the cursor at the point of join
//   append: true -- sets the cursor to end and scrolls there
//   after: id -- new item to be added after id
//   sufix: text -- editor opens with unsaved suffix appended
//   field: 'text' -- editor operates on this field of the item

escape = function escape(string) {
  return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

_textEditor = function textEditor($item, item) {
  var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var $textarea, enterCount, focusoutHandler, keydownHandler, original, ref, ref1;
  console.log('textEditor', item.id, option);

  if (item.type === 'markdown') {
    enterCount = 0;
  }

  if (!$('.editEnable').is(':visible')) {
    return;
  }

  keydownHandler = function keydownHandler(e) {
    var $page, $previous, caret, page, prefix, previous, sel, suffix, text;

    if (e.which === 27) {
      //esc for save
      e.preventDefault();
      $textarea.focusout();
      return false;
    }

    if ((e.ctrlKey || e.metaKey) && e.which === 83) {
      //ctrl-s for save
      e.preventDefault();
      $textarea.focusout();
      return false;
    }

    if ((e.ctrlKey || e.metaKey) && e.which === 73) {
      //ctrl-i for information
      e.preventDefault();

      if (!e.shiftKey) {
        page = $(e.target).parents('.page');
      }

      link.doInternalLink("about ".concat(item.type, " plugin"), page);
      return false;
    }

    if ((e.ctrlKey || e.metaKey) && e.which === 77) {
      //ctrl-m for menu
      e.preventDefault();
      $item.removeClass(item.type).addClass(item.type = 'factory');
      $textarea.focusout();
      return false;
    } // provides automatic new paragraphs on enter and concatenation on backspace


    if (item.type === 'paragraph' || item.type === 'markdown') {
      sel = getSelectionPos($textarea); // position of caret or selected text coords

      if (e.which === $.ui.keyCode.BACKSPACE && sel.start === 0 && sel.start === sel.end) {
        $previous = $item.prev();
        previous = itemz.getItem($previous);

        if (previous.type !== item.type) {
          return false;
        }

        caret = previous[option.field || 'text'].length;
        suffix = $textarea.val();
        $textarea.val(''); // Need current text area to be empty. Item then gets deleted.

        _textEditor($previous, previous, {
          caret: caret,
          suffix: suffix
        });

        return false;
      }

      if (e.which === $.ui.keyCode.ENTER) {
        if (!sel) {
          // console.log "Type: #{item.type}, enterCount: #{enterCount}"
          return false;
        }

        if (item.type === 'markdown') {
          enterCount++;
        } // console.log "Type: #{item.type}, enterCount: #{enterCount}"


        if (item.type === 'paragraph' || item.type === 'markdown' && enterCount === 2) {
          $page = $item.parents('.page');
          text = $textarea.val();
          prefix = text.substring(0, sel.start);
          suffix = text.substring(sel.end);

          if (prefix === '') {
            $textarea.val(suffix);
            $textarea.focusout();
            spawnEditor($page, $item.prev(), item.type, prefix);
          } else {
            $textarea.val(prefix);
            $textarea.focusout();
            spawnEditor($page, $item, item.type, suffix);
          }

          return false;
        }
      } else {
        if (item.type === 'markdown') {
          return enterCount = 0;
        }
      }
    }
  };

  focusoutHandler = function focusoutHandler() {
    var $page, index;
    $item.removeClass('textEditing');
    $textarea.unbind();
    $page = $item.parents('.page:first');

    if (item[option.field || 'text'] = $textarea.val()) {
      // Remove output and source styling as type may have changed.
      $item.removeClass("output-item");
      $item.removeClass(function (_index, className) {
        return (className.match(/\S+-source/) || []).join(" ");
      });
      plugin["do"]($item.empty(), item);

      if (option.after) {
        if (item[option.field || 'text'] === '') {
          return;
        }

        pageHandler.put($page, {
          type: 'add',
          id: item.id,
          item: item,
          after: option.after
        });
      } else {
        if (item[option.field || 'text'] === original) {
          return;
        }

        pageHandler.put($page, {
          type: 'edit',
          id: item.id,
          item: item
        });
      }
    } else {
      if (!option.after) {
        pageHandler.put($page, {
          type: 'remove',
          id: item.id
        });
      }

      index = $(".item").index($item);
      $item.remove();
      plugin.renderFrom(index);
    }

    return null;
  };

  if ($item.hasClass('textEditing')) {
    return;
  }

  $item.addClass('textEditing');
  $item.unbind();
  original = (ref = item[option.field || 'text']) != null ? ref : '';
  $textarea = $("<textarea>".concat(escape(original)).concat(escape((ref1 = option.suffix) != null ? ref1 : ''), "</textarea>")).focusout(focusoutHandler).bind('keydown', keydownHandler);
  $item.html($textarea);

  if (option.caret) {
    return setCaretPosition($textarea, option.caret);
  } else if (option.append) {
    // we want the caret to be at the end
    setCaretPosition($textarea, $textarea.val().length); //scrolls to bottom of text area

    return $textarea.scrollTop($textarea[0].scrollHeight - $textarea.height());
  } else {
    return $textarea.focus();
  }
};

spawnEditor = function spawnEditor($page, $before, type, text) {
  var $item, before, item;
  item = {
    type: type,
    id: random.itemId(),
    text: text
  };
  $item = $("<div class=\"item ".concat(item.type, "\" data-id=").concat(item.id, "></div>"));
  $item.data('item', item).data('pageElement', $page);
  $before.after($item);
  before = itemz.getItem($before);
  return _textEditor($item, item, {
    after: before != null ? before.id : void 0
  });
}; // If the selection start and selection end are both the same,
// then you have the caret position. If there is selected text,
// the browser will not tell you where the caret is, but it will
// either be at the beginning or the end of the selection
// (depending on the direction of the selection).


getSelectionPos = function getSelectionPos($textarea) {
  var el, iePos, sel;
  el = $textarea.get(0); // gets DOM Node from from jQuery wrapper

  if (document.selection) {
    // IE
    el.focus();
    sel = document.selection.createRange();
    sel.moveStart('character', -el.value.length);
    iePos = sel.text.length;
    return {
      start: iePos,
      end: iePos
    };
  } else {
    return {
      start: el.selectionStart,
      end: el.selectionEnd
    };
  }
};

setCaretPosition = function setCaretPosition($textarea, caretPos) {
  var el, range;
  el = $textarea.get(0);

  if (el != null) {
    if (el.createTextRange) {
      // IE
      range = el.createTextRange();
      range.move("character", caretPos);
      range.select(); // rest of the world
    } else {
      el.setSelectionRange(caretPos, caretPos);
    }

    return el.focus();
  }
}; // # may want special processing on paste eventually
// textarea.bind 'paste', (e) ->
//   console.log 'textedit paste', e
//   console.log e.originalEvent.clipboardData.getData('text')


module.exports = {
  textEditor: _textEditor
};

},{"./itemz":12,"./link":16,"./pageHandler":20,"./plugin":22,"./random":24}],9:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

// A Factory plugin provides a drop zone for desktop content
// destined to be one or another kind of item. Double click
// will turn it into a normal paragraph.
var active, arrayToJson, bind, csvToArray, drop, editor, emit, escape, neighborhood, pageHandler, plugin, resolve, synopsis;
neighborhood = require('./neighborhood');
plugin = require('./plugin');
resolve = require('./resolve');
pageHandler = require('./pageHandler');
editor = require('./editor');
synopsis = require('./synopsis');
drop = require('./drop');
active = require('./active');

escape = function escape(line) {
  return line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
};

emit = function emit($item, item) {
  var showMenu, showPrompt;
  $item.append('<p>Double-Click to Edit<br>Drop Text or Image to Insert</p>');

  showMenu = function showMenu() {
    var column, i, info, len, menu, ref;
    menu = $item.find('p').append("<br>Or Choose a Plugin\n<center>\n<table style=\"text-align:left;\">\n<tr><td><ul id=format><td><ul id=data><td><ul id=other>");
    ref = window.catalog;

    for (i = 0, len = ref.length; i < len; i++) {
      info = ref[i];

      if (info && info.category) {
        column = info.category;

        if (column !== 'format' && column !== 'data') {
          column = 'other';
        }

        menu.find('#' + column).append("<li><a class=\"menu\" href=\"#\" title=\"".concat(info.title, "\">").concat(info.name, "</a></li>"));
      }
    }

    return menu.find('a.menu').click(function (evt) {
      var catalogEntry, error, pluginName, pluginType;
      pluginName = evt.target.text;
      pluginType = pluginName.toLowerCase();
      $item.removeClass('factory').addClass(item.type = pluginType);
      $item.unbind();
      evt.preventDefault();
      active.set($item.parents(".page"));
      catalogEntry = window.catalog.find(function (entry) {
        return pluginName === entry.name;
      });

      if (catalogEntry.editor) {
        try {
          return window.plugins[pluginType].editor($item, item);
        } catch (error1) {
          error = error1;
          console.log("".concat(pluginName, " Plugin editor failed: ").concat(error, ". Falling back to textEditor"));
          return editor.textEditor($item, item);
        }
      } else {
        return editor.textEditor($item, item);
      }
    });
  };

  showPrompt = function showPrompt() {
    return $item.append("<p>".concat(resolve.resolveLinks(item.prompt, escape), "</b>"));
  };

  if (item.prompt) {
    return showPrompt();
  } else if (window.catalog != null) {
    return showMenu();
  } else {
    return wiki.origin.get('system/factories.json', function (error, data) {
      console.log('factory', data);
      window.catalog = data;
      return showMenu();
    });
  }
};

bind = function bind($item, item) {
  var addReference, addRemoteImage, addRemoteSvg, addVideo, punt, readFile, syncEditAction;

  syncEditAction = function syncEditAction() {
    var $page, err;
    $item.empty().unbind();
    $item.removeClass("factory").addClass(item.type);
    $page = $item.parents('.page:first');

    try {
      $item.data('pageElement', $page);
      $item.data('item', item);
      plugin.getPlugin(item.type, function (plugin) {
        plugin.emit($item, item);
        return plugin.bind($item, item);
      });
    } catch (error1) {
      err = error1;
      $item.append("<p class='error'>".concat(err, "</p>"));
    }

    return pageHandler.put($page, {
      type: 'edit',
      id: item.id,
      item: item
    });
  };

  punt = function punt(data) {
    item.prompt = "Unexpected Item\nWe can't make sense of the drop.\nTry something else or see [[About Factory Plugin]].";
    data.userAgent = navigator.userAgent;
    item.punt = data;
    return syncEditAction();
  };

  addReference = function addReference(data) {
    return wiki.site(data.site).get("".concat(data.slug, ".json"), function (err, remote) {
      if (!err) {
        item.type = 'reference';
        item.site = data.site;
        item.slug = data.slug;
        item.title = remote.title || data.slug;
        item.text = synopsis(remote);
        syncEditAction();

        if (item.site != null) {
          return neighborhood.registerNeighbor(item.site);
        }
      }
    });
  };

  addVideo = function addVideo(video) {
    item.type = 'video';
    item.text = "".concat(video.text, "\n(double-click to edit caption)\n");
    return syncEditAction();
  };

  addRemoteImage = function addRemoteImage(url) {
    // give some feedback, in case this is going to take a while...
    document.documentElement.style.cursor = 'wait';
    return fetch(url).then(function (response) {
      if (response.ok) {
        return response.blob();
      }

      throw new Error('Unable to fetch image');
    }).then(function (imageBlob) {
      var imageFileName, reader;
      imageFileName = url.split('/').pop().split('#')[0].split('?')[0]; // not sure if converting to file gives anything!
      // imageFile = new File([imageBlob], imageFileName, { type: imageBlob.type })

      reader = new FileReader();
      reader.readAsDataURL(imageBlob);
      return reader.onload = function (loadEvent) {
        var imageDataURL;
        imageDataURL = loadEvent.target.result;
        return window.plugins['image'].editor({
          imageDataURL: imageDataURL,
          filename: imageFileName,
          imageSourceURL: url,
          imageCaption: "Remote image [".concat(url, " source]"),
          $item: $item,
          item: item
        });
      };
    });
  };

  addRemoteSvg = function addRemoteSvg(url) {
    document.documentElement.style.cursor = 'wait';
    return fetch(url).then(function (response) {
      if (response.ok) {
        return response;
      }

      throw new Error('Unable to fetch svg');
    }).then(function (response) {
      return response.text();
    }).then(function (svgText) {
      document.documentElement.style.cursor = 'default';
      item.type = 'html';
      item.source = url;
      item.text = svgText + "<p>[".concat(url, " Source]</p>");
      return syncEditAction();
    });
  };

  readFile = function readFile(file) {
    var majorType, minorType, reader;

    if (file != null) {
      var _file$type$split = file.type.split("/");

      var _file$type$split2 = (0, _slicedToArray2["default"])(_file$type$split, 2);

      majorType = _file$type$split2[0];
      minorType = _file$type$split2[1];
      reader = new FileReader();

      if (majorType === "image") {
        // svg -> html plugin
        if (minorType.startsWith('svg')) {
          reader.onload = function (loadEvent) {
            var result;
            result = loadEvent.target.result;
            item.type = 'html';
            item.text = result;
            return syncEditAction();
          };

          return reader.readAsText(file);
        } else {
          reader.onload = function (loadEvent) {
            var imageDataURL;
            console.log('upload file', file);
            imageDataURL = loadEvent.target.result;
            return window.plugins['image'].editor({
              imageDataURL: imageDataURL,
              filename: file.name,
              imageCaption: "Uploaded image",
              $item: $item,
              item: item
            });
          };

          return reader.readAsDataURL(file);
        }
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
          name: file.name,
          type: file.type,
          size: file.size,
          fileName: file.fileName,
          lastModified: file.lastModified
        });
      }
    }
  };

  $item.dblclick(function (e) {
    if (!$('.editEnable').is(':visible')) {
      return;
    }

    if (e.shiftKey) {
      return editor.textEditor($item, item, {
        field: 'prompt'
      });
    } else {
      $item.removeClass('factory').addClass(item.type = 'paragraph');
      $item.unbind();
      return editor.textEditor($item, item);
    }
  });
  $item.bind('dragenter', function (evt) {
    return evt.preventDefault();
  });
  $item.bind('dragover', function (evt) {
    return evt.preventDefault();
  });
  return $item.bind("drop", drop.dispatch({
    page: addReference,
    file: readFile,
    video: addVideo,
    image: addRemoteImage,
    svg: addRemoteSvg,
    punt: punt
  }));
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
      var _ref$i = (0, _slicedToArray2["default"])(ref[i], 2);

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

module.exports = {
  emit: emit,
  bind: bind
};

},{"./active":3,"./drop":7,"./editor":8,"./neighborhood":17,"./pageHandler":20,"./plugin":22,"./resolve":27,"./synopsis":34,"@babel/runtime/helpers/interopRequireDefault":40,"@babel/runtime/helpers/slicedToArray":43}],10:[function(require,module,exports){
"use strict";

// A Future plugin represents a page that hasn't been written
// or wasn't found where expected. It recognizes template pages
// and offers to clone them or make a blank page.
var bind, emit, lineup, neighborhood, refresh, resolve;
resolve = require('./resolve');
neighborhood = require('./neighborhood');
lineup = require('./lineup');
refresh = require('./refresh');

emit = function emit($item, item) {
  var i, info, len, ref, ref1, ref2, results, transport;
  $item.append("".concat(item.text, "<br><br><button class=\"create\">create</button> new blank page"));

  if (transport = (ref = item.create) != null ? (ref1 = ref.source) != null ? ref1.transport : void 0 : void 0) {
    $item.append("<br><button class=\"transport\" data-slug=".concat(item.slug, ">create</button> transport from ").concat(transport));
    $item.append("<p class=caption> unavailable</p>");
    $.get('//localhost:4020', function () {
      return $item.find('.caption').text('ready');
    });
  }

  if ((info = neighborhood.sites[location.host]) != null && info.sitemap != null) {
    ref2 = info.sitemap;
    results = [];

    for (i = 0, len = ref2.length; i < len; i++) {
      item = ref2[i];

      if (item.slug.match(/-template$/)) {
        results.push($item.append("<br><button class=\"create\" data-slug=".concat(item.slug, ">create</button> from ").concat(resolve.resolveLinks("[[".concat(item.title, "]]")))));
      } else {
        results.push(void 0);
      }
    }

    return results;
  }
};

bind = function bind($item, item) {
  return $item.find('button.transport').click(function (e) {
    var params, req;
    $item.find('.caption').text('waiting'); // duplicatingTransport and Templage logic

    params = {
      title: $item.parents('.page').data('data').title,
      create: item.create
    };
    req = {
      type: "POST",
      url: item.create.source.transport,
      dataType: 'json',
      contentType: "application/json",
      data: JSON.stringify(params)
    };
    return $.ajax(req).done(function (page) {
      var $page, pageObject, resultPage;
      $item.find('.caption').text('ready');
      resultPage = wiki.newPage(page);
      $page = $item.parents('.page');
      pageObject = lineup.atKey($page.data('key'));
      pageObject.become(resultPage, resultPage);
      page = pageObject.getRawPage();
      return refresh.rebuildPage(pageObject, $page.empty());
    });
  });
};

module.exports = {
  emit: emit,
  bind: bind
};

},{"./lineup":15,"./neighborhood":17,"./refresh":26,"./resolve":27}],11:[function(require,module,exports){
"use strict";

// An Importer plugin completes the ghost page created upon drop of a site export file.
var bind, emit, escape, link, newPage, util;
util = require('./util');
link = require('./link');
newPage = require('./page').newPage;

escape = function escape(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

emit = function emit($item, item) {
  var render;

  render = function render(pages) {
    var date, line, page, result, slug;
    result = [];

    for (slug in pages) {
      page = pages[slug];
      line = "<a href=".concat(slug, ">").concat(escape(page.title) || slug, "</a>");

      if (page.journal) {
        if (date = page.journal[page.journal.length - 1].date) {
          line += " &nbsp; from ".concat(util.formatElapsedTime(date));
        } else {
          line += " &nbsp; from revision ".concat(page.journal.length - 1);
        }
      }

      result.push(line);
    }

    return result.join('<br>');
  };

  return $item.append("<p style=\"background-color:#eee;padding:15px;\">\n  ".concat(render(item.pages), "\n</p>"));
};

bind = function bind($item, item) {
  return $item.find('a').click(function (e) {
    var $page, pageObject, slug;
    slug = $(e.target).attr('href');

    if (!e.shiftKey) {
      $page = $(e.target).parents('.page');
    }

    pageObject = newPage(item.pages[slug]);
    link.showResult(pageObject, {
      $page: $page,
      rev: pageObject.getRevision()
    });
    return false;
  });
};

module.exports = {
  emit: emit,
  bind: bind
};

},{"./link":16,"./page":19,"./util":36}],12:[function(require,module,exports){
"use strict";

// The itemz module understands how we have been keeping track of
// story items and their corresponding divs. It offers utility
// functions used elsewere. We anticipate a more proper model eventually.
var createItem, getItem, pageHandler, plugin, random, removeItem, replaceItem, sleep;
pageHandler = require('./pageHandler');
plugin = require('./plugin');
random = require('./random');

sleep = function sleep(time, done) {
  return setTimeout(done, time);
};

getItem = function getItem($item) {
  if ($($item).length > 0) {
    return $($item).data("item") || $($item).data('staticItem');
  }
};

removeItem = function removeItem($item, item) {
  pageHandler.put($item.parents('.page:first'), {
    type: 'remove',
    id: item.id
  });
  return $item.remove();
};

createItem = function createItem($page, $before, item) {
  var $item, before;

  if ($page == null) {
    $page = $before.parents('.page');
  }

  item.id = random.itemId();
  $item = $("<div class=\"item ".concat(item.type, "\" data-id=\"\"</div>"));
  $item.data('item', item).data('pageElement', $page);

  if ($before != null) {
    $before.after($item);
  } else {
    $page.find('.story').append($item);
  }

  plugin["do"]($item, item);
  before = getItem($before);
  sleep(500, function () {
    return pageHandler.put($page, {
      item: item,
      id: item.id,
      type: 'add',
      after: before != null ? before.id : void 0
    });
  });
  return $item;
};

replaceItem = function replaceItem($item, type, item) {
  var $page, err, newItem;
  newItem = $.extend({}, item);
  $item.empty().unbind();
  $item.removeClass(type).addClass(newItem.type);
  $page = $item.parents('.page:first');

  try {
    $item.data('pageElement', $page);
    $item.data('item', newItem);
    plugin.getPlugin(item.type, function (plugin) {
      plugin.emit($item, newItem);
      return plugin.bind($item, newItem);
    });
  } catch (error) {
    err = error;
    $item.append("<p class='error'>".concat(err, "</p>"));
  }

  return pageHandler.put($page, {
    type: 'edit',
    id: newItem.id,
    item: newItem
  });
};

module.exports = {
  createItem: createItem,
  removeItem: removeItem,
  getItem: getItem,
  replaceItem: replaceItem
};

},{"./pageHandler":20,"./plugin":22,"./random":24}],13:[function(require,module,exports){
"use strict";

// The legacy module is what is left of the single javascript
// file that once was Smallest Federated Wiki. Execution still
// starts here and many event dispatchers are set up before
// the user takes control.
var active, asSlug, dialog, drop, license, lineup, link, newPage, pageHandler, plugin, preLoadEditors, refresh, state, target;
pageHandler = require('./pageHandler');
state = require('./state');
active = require('./active');
refresh = require('./refresh');
lineup = require('./lineup');
drop = require('./drop');
dialog = require('./dialog');
link = require('./link');
target = require('./target');
license = require('./license');
plugin = require('./plugin');
asSlug = require('./page').asSlug;
newPage = require('./page').newPage;

preLoadEditors = function preLoadEditors(catalog) {
  return catalog.filter(function (entry) {
    return entry.editor;
  }).forEach(function (entry) {
    console.log("".concat(entry.name, " Plugin declares an editor, so pre-loading the plugin"));
    return wiki.getPlugin(entry.name.toLowerCase(), function (plugin) {
      if (!plugin.editor || typeof plugin.editor !== 'function') {
        return console.log("".concat(entry.name, " Plugin ERROR.\nCannot find `editor` function in plugin. Set `\"editor\": false` in factory.json or\nCorrect the plugin to include all three of `{emit, bind, editor}`"));
      }
    });
  });
};

wiki.origin.get('system/factories.json', function (error, data) {
  window.catalog = data;
  return preLoadEditors(data);
});
$(function () {
  var LEFTARROW, RIGHTARROW, commas, deletePage, finishClick, getPluginReference, getTemplate, originalPageIndex, readFile;
  dialog.emit(); // FUNCTIONS used by plugins and elsewhere

  LEFTARROW = 37;
  RIGHTARROW = 39;
  $(document).keydown(function (event) {
    var direction, newIndex, pages;

    direction = function () {
      switch (event.which) {
        case LEFTARROW:
          return -1;

        case RIGHTARROW:
          return +1;
      }
    }();

    if (direction && !$(event.target).is(":input")) {
      pages = $('.page');
      newIndex = pages.index($('.active')) + direction;

      if (0 <= newIndex && newIndex < pages.length) {
        active.set(pages.eq(newIndex));
      }
    }

    if ((event.ctrlKey || event.metaKey) && event.which === 83) {
      //ctrl-s for search
      event.preventDefault();
      return $('input.search').focus();
    }
  }); // HANDLERS for jQuery events
  //STATE -- reconfigure state based on url

  $(window).on('popstate', state.show);
  $(document).ajaxError(function (event, request, settings) {
    if (request.status === 0 || request.status === 404) {
      return;
    }

    return console.log('ajax error', event, request, settings);
  }); // $('.main').prepend """
  //   <li class='error'>
  //     Error on #{settings.url}: #{request.responseText}
  //   </li>
  // """

  commas = function commas(number) {
    return "".concat(number).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  };

  readFile = function readFile(file) {
    var reader;

    if ((file != null ? file.type : void 0) === 'application/json') {
      reader = new FileReader();

      reader.onload = function (e) {
        var page, pages, result, resultPage, slug;
        result = e.target.result;
        pages = JSON.parse(result);
        resultPage = newPage();
        resultPage.setTitle("Import from ".concat(file.name));

        if (pages.title != null && pages.story != null && pages.journal != null) {
          slug = asSlug(pages.title);
          page = pages;
          pages = {};
          pages[slug] = page;
          resultPage.addParagraph("Import of one page\n(".concat(commas(file.size), " bytes)\nfrom a page-json file dated ").concat(file.lastModifiedDate, "."));
        } else {
          resultPage.addParagraph("Import of ".concat(Object.keys(pages).length, " pages\n(").concat(commas(file.size), " bytes)\nfrom an export file dated ").concat(file.lastModifiedDate, "."));
        }

        resultPage.addItem({
          type: 'importer',
          pages: pages
        });
        return link.showResult(resultPage);
      };

      return reader.readAsText(file);
    }
  };

  deletePage = function deletePage(pageObject, $page) {
    console.log('fork to delete');
    return pageHandler["delete"](pageObject, $page, function (err) {
      var futurePage;

      if (err != null) {
        return;
      }

      console.log('server delete successful');

      if (pageObject.isRecycler()) {
        // make recycler page into a ghost
        return $page.addClass('ghost');
      } else {
        futurePage = refresh.newFuturePage(pageObject.getTitle(), pageObject.getCreate());
        pageObject.become(futurePage);
        $page.attr('id', futurePage.getSlug());
        refresh.rebuildPage(pageObject, $page);
        return $page.addClass('ghost');
      }
    });
  };

  getTemplate = function getTemplate(slug, done) {
    if (!slug) {
      return done(null);
    }

    console.log('getTemplate', slug);
    return pageHandler.get({
      whenGotten: function whenGotten(pageObject, siteFound) {
        return done(pageObject);
      },
      whenNotGotten: function whenNotGotten() {
        return done(null);
      },
      pageInformation: {
        slug: slug
      }
    });
  };

  finishClick = function finishClick(e, name) {
    var page;
    e.preventDefault();

    if (!e.shiftKey) {
      page = $(e.target).parents('.page');
    }

    link.doInternalLink(name, page, $(e.target).data('site'));
    return false;
  };

  originalPageIndex = null;
  $('.main').sortable({
    handle: '.page-handle',
    cursor: 'grabbing'
  }).on('sortstart', function (evt, ui) {
    var noScroll;

    if (!ui.item.hasClass('page')) {
      return;
    }

    noScroll = true;
    active.set(ui.item, noScroll);
    return originalPageIndex = $(".page").index(ui.item[0]);
  }).on('sort', function (evt, ui) {
    var $page;

    if (!ui.item.hasClass('page')) {
      return;
    }

    $page = ui.item; // Only mark for removal if there's more than one page (+placeholder) left

    if (evt.pageY < 0 && $(".page").length > 2) {
      return $page.addClass('pending-remove');
    } else {
      return $page.removeClass('pending-remove');
    }
  }).on('sortstop', function (evt, ui) {
    var $page, $pages, firstItemIndex, index;

    if (!ui.item.hasClass('page')) {
      return;
    }

    $page = ui.item;
    $pages = $('.page');
    index = $pages.index($('.active'));
    firstItemIndex = $('.item').index($page.find('.item')[0]);

    if ($page.hasClass('pending-remove')) {
      if ($pages.length === 1) {
        return;
      }

      lineup.removeKey($page.data('key'));
      $page.remove();
      active.set($('.page')[index]);
    } else {
      lineup.changePageIndex($page.data('key'), index);
      active.set($('.active'));

      if (originalPageIndex < index) {
        index = originalPageIndex;
        firstItemIndex = $('.item').index($($('.page')[index]).find('.item')[0]);
      }
    }

    plugin.renderFrom(firstItemIndex);
    state.setUrl();
    return state.debugStates();
  }).delegate('.show-page-license', 'click', function (e) {
    var $page, title;
    e.preventDefault();
    $page = $(this).parents('.page');
    title = $page.find('h1').text().trim();
    return dialog.open("License for ".concat(title), license.info($page));
  }).delegate('.show-page-source', 'click', function (e) {
    var $page, page;
    e.preventDefault();
    $page = $(this).parents('.page');
    page = lineup.atKey($page.data('key')).getRawPage();
    return dialog.open("JSON for ".concat(page.title), $('<pre/>').text(JSON.stringify(page, null, 2)));
  }).delegate('.page', 'click', function (e) {
    if (!$(e.target).is("a")) {
      return active.set(this);
    }
  }).delegate('.internal', 'click', function (e) {
    var $link, title;
    $link = $(e.target);
    title = $link.text() || $link.data('pageName'); // ensure that name is a string (using string interpolation)

    title = "".concat(title);
    pageHandler.context = $(e.target).attr('title').split(' => ');
    return finishClick(e, title);
  }).delegate('img.remote', 'click', function (e) {
    var name, site; // expand to handle click on temporary flag

    if ($(e.target).attr('src').startsWith('data:image/png')) {
      e.preventDefault();
      site = $(e.target).data('site');
      return wiki.site(site).refresh(function () {});
    } else {
      // empty function...
      name = $(e.target).data('slug');
      pageHandler.context = [$(e.target).data('site')];
      return finishClick(e, name);
    }
  }).delegate('.revision', 'dblclick', function (e) {
    var $page, action, json, page, rev;
    e.preventDefault();
    $page = $(this).parents('.page');
    page = lineup.atKey($page.data('key')).getRawPage();
    rev = page.journal.length - 1;
    action = page.journal[rev];
    json = JSON.stringify(action, null, 2);
    return dialog.open("Revision ".concat(rev, ", ").concat(action.type, " action"), $('<pre/>').text(json));
  }).delegate('.action', 'click', function (e) {
    var $action, $page, key, name, rev, slug;
    e.preventDefault();
    $action = $(e.target);

    if ($action.is('.fork') && (name = $action.data('slug')) != null) {
      pageHandler.context = [$action.data('site')];
      return finishClick(e, name.split('_')[0]);
    } else {
      $page = $(this).parents('.page');
      key = $page.data('key');
      slug = lineup.atKey(key).getSlug();
      rev = $(this).parent().children().not('.separator').index($action);

      if (rev < 0) {
        return;
      }

      if (!e.shiftKey) {
        $page.nextAll().remove();
      }

      if (!e.shiftKey) {
        lineup.removeAllAfterKey(key);
      }

      link.createPage("".concat(slug, "_rev").concat(rev), $page.data('site')).appendTo($('.main')).each(function (_i, e) {
        return refresh.cycle($(e));
      });
      return active.set($('.page').last());
    }
  }).delegate('.fork-page', 'click', function (e) {
    var $page, action, i, j, len, p, pageObject, ref, ref1;
    $page = $(e.target).parents('.page');

    if ($page.find('.future').length) {
      return;
    }

    pageObject = lineup.atKey($page.data('key'));

    if ($page.attr('id').match(/_rev0$/)) {
      return deletePage(pageObject, $page);
    } else {
      action = {
        type: 'fork'
      };

      if ($page.hasClass('local')) {
        if (pageHandler.useLocalStorage()) {
          return;
        }

        $page.removeClass('local');
      } else if (pageObject.isRecycler()) {
        $page.removeClass('recycler');
      } else if (pageObject.isRemote()) {
        action.site = pageObject.getRemoteSite();
      }

      if ($page.data('rev') != null) {
        $page.find('.revision').remove();
      }

      $page.removeClass('ghost');
      $page.attr('id', $page.attr('id').replace(/_rev\d+$/, ''));
      state.setUrl();
      ref = $('.page');

      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        p = ref[i];

        if ($(p).data('key') !== $page.data('key') && $(p).attr('id') === $page.attr('id') && ((ref1 = $(p).data('site')) === void 0 || ref1 === null || ref1 === 'view' || ref1 === 'origin' || ref1 === 'local' || ref1 === 'recycler' || ref1 === location.host)) {
          $(p).addClass('ghost');
        }
      }

      return pageHandler.put($page, action);
    }
  }).delegate('button.create', 'click', function (e) {
    return getTemplate($(e.target).data('slug'), function (template) {
      var $page, page, pageObject;
      $page = $(e.target).parents('.page:first');
      $page.removeClass('ghost');
      pageObject = lineup.atKey($page.data('key'));
      pageObject.become(template);
      page = pageObject.getRawPage();
      refresh.rebuildPage(pageObject, $page.empty());
      return pageHandler.put($page, {
        type: 'create',
        id: page.id,
        item: {
          title: page.title,
          story: page.story
        }
      });
    });
  }).delegate('.score', 'mouseenter mouseleave', function (e) {
    console.log("in .score...");
    return $('.main').trigger('thumb', $(e.target).data('thumb'));
  }).delegate('a.search', 'click', function (e) {
    var $page, item, key, pageObject, resultPage;
    $page = $(e.target).parents('.page');
    key = $page.data('key');
    pageObject = lineup.atKey(key);
    resultPage = newPage();
    resultPage.setTitle("Search from '".concat(pageObject.getTitle(), "'"));
    resultPage.addParagraph("Search for pages related to '".concat(pageObject.getTitle(), "'.\nEach search on this page will find pages related in a different way.\nChoose the search of interest. Be patient."));
    resultPage.addParagraph("Find pages with links to this title.");
    resultPage.addItem({
      type: 'search',
      text: "SEARCH LINKS ".concat(pageObject.getSlug())
    });
    resultPage.addParagraph("Find pages with titles similar to this title.");
    resultPage.addItem({
      type: 'search',
      text: "SEARCH SLUGS ".concat(pageObject.getSlug())
    });
    resultPage.addParagraph("Find pages neighboring  this site.");
    resultPage.addItem({
      type: 'search',
      text: "SEARCH SITES ".concat(pageObject.getRemoteSite(location.host))
    });
    resultPage.addParagraph("Find pages sharing any of these items.");
    resultPage.addItem({
      type: 'search',
      text: "SEARCH ANY ITEMS ".concat(function () {
        var j, len, ref, results;
        ref = pageObject.getRawPage().story;
        results = [];

        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          results.push(item.id);
        }

        return results;
      }().join(' '))
    });

    if (!e.shiftKey) {
      $page.nextAll().remove();
    }

    if (!e.shiftKey) {
      lineup.removeAllAfterKey(key);
    }

    return link.showResult(resultPage);
  }).bind('dragenter', function (evt) {
    return evt.preventDefault();
  }).bind('dragover', function (evt) {
    return evt.preventDefault();
  }).bind("drop", drop.dispatch({
    page: function page(item) {
      return link.doInternalLink(item.slug, null, item.site);
    },
    file: function file(_file) {
      return readFile(_file);
    }
  }));
  $(".provider input").click(function () {
    $("footer input:first").val($(this).attr('data-provider'));
    return $("footer form").submit();
  });
  $('body').on('new-neighbor-done', function (e, neighbor) {
    return $('.page').each(function (index, element) {
      return refresh.emitTwins($(element));
    });
  }); // refresh backlinks??

  getPluginReference = function getPluginReference(title) {
    return new Promise(function (resolve, reject) {
      var slug;
      slug = asSlug(title);
      return wiki.origin.get("".concat(slug, ".json"), function (error, data) {
        return resolve({
          title: title,
          slug: slug,
          type: "reference",
          text: (error ? error.msg : data != null ? data.story[0].text : void 0) || ""
        });
      });
    });
  };

  $("<span>&nbsp; ☰ </span>").css({
    "cursor": "pointer"
  }).appendTo('footer').click(function () {
    var info, j, k, len, len1, ref, ref1, resultPage, title, titles;
    resultPage = newPage();
    resultPage.setTitle("Selected Plugin Pages");
    resultPage.addParagraph("Installed plugins offer these utility pages:");

    if (!window.catalog) {
      return;
    }

    titles = [];
    ref = window.catalog;

    for (j = 0, len = ref.length; j < len; j++) {
      info = ref[j];

      if (info.pages) {
        ref1 = info.pages;

        for (k = 0, len1 = ref1.length; k < len1; k++) {
          title = ref1[k];
          titles.push(title);
        }
      }
    }

    return Promise.all(titles.map(getPluginReference)).then(function (items) {
      items.forEach(function (item) {
        return resultPage.addItem(item);
      });
      return link.showResult(resultPage);
    });
  }); // $('.editEnable').is(':visible')

  $("<span>&nbsp; wiki <span class=editEnable>✔︎</span> &nbsp; </span>").css({
    "cursor": "pointer"
  }).appendTo('footer').click(function () {
    $('.editEnable').toggle();
    return $('.page').each(function () {
      var $page, pageObject;
      $page = $(this);
      pageObject = lineup.atKey($page.data('key'));
      return refresh.rebuildPage(pageObject, $page.empty());
    });
  });

  if (!isAuthenticated) {
    $('.editEnable').toggle();
  }

  target.bind();
  return $(function () {
    var pages, _renderNextPage;

    state.first();
    pages = $('.page').toArray(); // Render pages in order
    // Emits and "bind creations" for the previous page must be complete before we start
    // rendering the next page or plugin bind ordering will not work

    _renderNextPage = function renderNextPage(pages) {
      var $page;

      if (pages.length === 0) {
        active.set($('.page').last());
        return;
      }

      $page = $(pages.shift());
      return refresh.cycle($page).then(function () {
        return _renderNextPage(pages);
      });
    };

    return _renderNextPage(pages);
  });
});

},{"./active":3,"./dialog":6,"./drop":7,"./license":14,"./lineup":15,"./link":16,"./page":19,"./pageHandler":20,"./plugin":22,"./refresh":26,"./state":33,"./target":35}],14:[function(require,module,exports){
"use strict";

// The license module explains federated wiki license terms
// including the proper attribution of collaborators.
var authors, cc, info, lineup, provenance, resolve;
resolve = require('./resolve');
lineup = require('./lineup');

cc = function cc() {
  return "<p>\n  <a rel=\"license\" href=\"http://creativecommons.org/licenses/by-sa/4.0/\">\n  <img alt=\"Creative Commons License\" style=\"border-width:0\" src=\"https://i.creativecommons.org/l/by-sa/4.0/88x31.png\" /></a>\n</p><p>\n  This work is licensed under a\n  <a rel=\"license\" href=\"http://creativecommons.org/licenses/by-sa/4.0/\">\n    Creative Commons Attribution-ShareAlike 4.0 International License\n  </a>.\n</p><p>\n  This license applies uniformly to all contributions\n  by all authors. Where authors quote other sources\n  they do so within the terms of fair use or other\n  compatiable terms.\n</p>";
};

authors = function authors(page, site) {
  var action, done, i, len, list, ref, ref1, siteFlag, siteURL;

  if (page.journal == null) {
    return "";
  }

  done = {};
  list = [];
  ref = page.journal.slice(0).reverse();

  for (i = 0, len = ref.length; i < len; i++) {
    action = ref[i];

    if (action.site != null) {
      site = action.site;
    }

    if (((ref1 = action.attribution) != null ? ref1.site : void 0) != null) {
      site = action.attribution.site;
    }

    if (!(action.type === 'fork' || done[site] != null)) {
      siteURL = wiki.site(site).getDirectURL("");
      siteFlag = wiki.site(site).flag();
      list.push("<a href=\"".concat(siteURL, "\" target=\"_blank\"><img class=\"remote\" title=\"").concat(site, "\" src=\"").concat(siteFlag, "\"> ").concat(site, "</a>"));
      done[site] = true;
    }
  }

  if (!(list.length > 0)) {
    return "";
  }

  return "<p>\n  Author's Sites:\n</p><p>\n  ".concat(list.join("<br>"), "\n</p>");
};

provenance = function provenance(action) {
  if ((action != null ? action.provenance : void 0) == null) {
    return "";
  }

  return "<p>\n  Created From:\n</p><p>\n  ".concat(resolve.resolveLinks(action.provenance), "\n</p>");
};

info = function info($page) {
  var page, pageObject, site;
  pageObject = lineup.atKey($page.data('key'));
  page = pageObject.getRawPage();
  site = pageObject.getRemoteSite(location.hostname);
  return cc() + authors(page, site) + provenance(page.journal[0]);
};

module.exports = {
  info: info
};

},{"./lineup":15,"./resolve":27}],15:[function(require,module,exports){
"use strict";

// The lineup represents a sequence of pages with possible
// duplication. We maintain the lineup in parallel with
// the DOM list of .page elements. Eventually lineup will
// play a more central role managing calculations and
// display updates.
var addPage,
    atKey,
    bestTitle,
    changePageIndex,
    crumbs,
    debugKeys,
    debugReset,
    debugSelfCheck,
    keyByIndex,
    leftKey,
    pageByKey,
    random,
    removeAllAfterKey,
    removeKey,
    titleAtKey,
    indexOf = [].indexOf;
random = require('./random');
pageByKey = {};
keyByIndex = []; // Basic manipulations that correspond to typical user activity

addPage = function addPage(pageObject) {
  var key;
  key = random.randomBytes(4);
  pageByKey[key] = pageObject;
  keyByIndex.push(key);
  return key;
};

changePageIndex = function changePageIndex(key, newIndex) {
  var oldIndex;
  oldIndex = keyByIndex.indexOf(key);
  keyByIndex.splice(oldIndex, 1);
  return keyByIndex.splice(newIndex, 0, key);
};

removeKey = function removeKey(key) {
  if (indexOf.call(keyByIndex, key) < 0) {
    return null;
  }

  keyByIndex = keyByIndex.filter(function (each) {
    return key !== each;
  });
  delete pageByKey[key];
  return key;
};

removeAllAfterKey = function removeAllAfterKey(key) {
  var result, unwanted;
  result = [];

  if (indexOf.call(keyByIndex, key) < 0) {
    return result;
  }

  while (keyByIndex[keyByIndex.length - 1] !== key) {
    unwanted = keyByIndex.pop();
    result.unshift(unwanted);
    delete pageByKey[unwanted];
  }

  return result;
};

atKey = function atKey(key) {
  return pageByKey[key];
};

titleAtKey = function titleAtKey(key) {
  return atKey(key).getTitle();
};

bestTitle = function bestTitle() {
  if (!keyByIndex.length) {
    return "Wiki";
  }

  return titleAtKey(keyByIndex[keyByIndex.length - 1]);
}; // Debug access to internal state used by unit tests.


debugKeys = function debugKeys() {
  return keyByIndex;
};

debugReset = function debugReset() {
  pageByKey = {};
  return keyByIndex = [];
}; // Debug self-check which corrects misalignments until we get it right


debugSelfCheck = function debugSelfCheck(keys) {
  var have, keysByIndex, want;

  if ((have = "".concat(keyByIndex)) === (want = "".concat(keys))) {
    return;
  }

  console.log('The lineup is out of sync with the dom.');
  console.log(".pages:", keys);
  console.log("lineup:", keyByIndex);

  if ("".concat(Object.keys(keyByIndex).sort()) !== "".concat(Object.keys(keys).sort())) {
    return;
  }

  console.log('It looks like an ordering problem we can fix.');
  return keysByIndex = keys;
}; // Select a few crumbs from the lineup that will take us
// close to welcome-visitors on a (possibly) remote site.


leftKey = function leftKey(key) {
  var pos;
  pos = keyByIndex.indexOf(key);

  if (pos < 1) {
    return null;
  }

  return keyByIndex[pos - 1];
};

crumbs = function crumbs(key, location) {
  var adjacent, host, left, page, result, slug;
  page = pageByKey[key];
  host = page.getRemoteSite(location);
  result = ['view', slug = page.getSlug()];

  if (slug !== 'welcome-visitors') {
    result.unshift('view', 'welcome-visitors');
  }

  if (host !== location && (left = leftKey(key)) != null) {
    if (!(adjacent = pageByKey[left]).isRemote()) {
      result.push(location, adjacent.getSlug());
    }
  }

  result.unshift(host);
  return result;
};

module.exports = {
  addPage: addPage,
  changePageIndex: changePageIndex,
  removeKey: removeKey,
  removeAllAfterKey: removeAllAfterKey,
  atKey: atKey,
  titleAtKey: titleAtKey,
  bestTitle: bestTitle,
  debugKeys: debugKeys,
  debugReset: debugReset,
  crumbs: crumbs,
  debugSelfCheck: debugSelfCheck
};

},{"./random":24}],16:[function(require,module,exports){
"use strict";

// Here is where we attach federated semantics to internal
// links. Call doInternalLink to add a new page to the display
// given a page name, a place to put it an an optional site
// to retrieve it from.
var active, asSlug, asTitle, createPage, doInternalLink, lineup, pageEmitter, refresh, showPage, showResult;
lineup = require('./lineup');
active = require('./active');
refresh = require('./refresh');

var _require = require('./page');

asTitle = _require.asTitle;
asSlug = _require.asSlug;
pageEmitter = _require.pageEmitter;

createPage = function createPage(name, loc) {
  var title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var $page, site;

  if (loc && loc !== 'view') {
    site = loc;
  }

  if (!title) {
    title = asTitle(name);
  }

  $page = $("<div class=\"page\" id=\"".concat(name, "\" tabindex=\"-1\">\n  <div class=\"paper\">\n    <div class=\"twins\"> <p> </p> </div>\n    <div class=\"header\">\n      <h1> <img class=\"favicon\" src=\"").concat(wiki.site(site).flag(), "\" height=\"32px\"> ").concat(title, " </h1>\n    </div>\n  </div>\n</div>"));

  if (site) {
    $page.data('site', site);
  }

  return $page;
};

showPage = function showPage(name, loc) {
  var title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return createPage(name, loc, title).appendTo('.main').each(function (_i, e) {
    return refresh.cycle($(e));
  });
};

doInternalLink = function doInternalLink(title, $page) {
  var site = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var slug;
  slug = asSlug(title);

  if ($page != null) {
    $($page).nextAll().remove();
  }

  if ($page != null) {
    lineup.removeAllAfterKey($($page).data('key'));
  }

  showPage(slug, site, title);
  return active.set($('.page').last());
};

showResult = function showResult(pageObject) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var $page, slug;

  if (options.$page != null) {
    $(options.$page).nextAll().remove();
  }

  if (options.$page != null) {
    lineup.removeAllAfterKey($(options.$page).data('key'));
  }

  slug = pageObject.getSlug();

  if (options.rev != null) {
    slug += "_rev".concat(options.rev);
  }

  $page = createPage(slug).addClass('ghost');
  $page.appendTo($('.main'));
  refresh.buildPage(pageObject, $page);
  return active.set($('.page').last());
};

pageEmitter.on('show', function (page) {
  console.log('pageEmitter handling', page);
  return showResult(page);
});
module.exports = {
  createPage: createPage,
  doInternalLink: doInternalLink,
  showPage: showPage,
  showResult: showResult
};

},{"./active":3,"./lineup":15,"./page":19,"./refresh":26}],17:[function(require,module,exports){
"use strict";

// The neighborhood provides a cache of site maps read from
// various federated wiki sites. It is careful to fetch maps
// slowly and keeps track of get requests in flight.
var _,
    extractPageText,
    miniSearch,
    neighborhood,
    nextAvailableFetch,
    nextFetchInterval,
    populateSiteInfoFor,
    hasProp = {}.hasOwnProperty;

_ = require('underscore');
miniSearch = require('minisearch');
module.exports = neighborhood = {};
neighborhood.sites = {};
nextAvailableFetch = 0;
nextFetchInterval = 500;

populateSiteInfoFor = function populateSiteInfoFor(site, neighborInfo) {
  var fetchMap, now, transition;

  if (neighborInfo.sitemapRequestInflight) {
    return;
  }

  neighborInfo.sitemapRequestInflight = true;

  transition = function transition(site, from, to) {
    return $(".neighbor[data-site=\"".concat(site, "\"]")).find('div').removeClass(from).addClass(to);
  };

  fetchMap = function fetchMap() {
    transition(site, 'wait', 'fetch');
    wiki.site(site).get('system/sitemap.json', function (err, data) {
      neighborInfo.sitemapRequestInflight = false;

      if (!err) {
        neighborInfo.sitemap = data;
        transition(site, 'fetch', 'done');
        return $('body').trigger('new-neighbor-done', site);
      } else {
        transition(site, 'fetch', 'fail');
        return wiki.site(site).refresh(function () {});
      }
    }); // empty function
    // we use `wiki.site(site).getIndex` as we want the serialized index as a string.

    return wiki.site(site).getIndex('system/site-index.json', function (err, data) {
      var error;

      if (!err) {
        try {
          neighborInfo.siteIndex = miniSearch.loadJSON(data, {
            fields: ['title', 'content']
          });
          return console.log(site, 'index loaded');
        } catch (error1) {
          error = error1;
          return console.log('error loading index - not a valid index', site);
        }
      } else {
        return console.log('error loading index', site, err);
      }
    });
  };

  now = Date.now();

  if (now > nextAvailableFetch) {
    nextAvailableFetch = now + nextFetchInterval;
    return setTimeout(fetchMap, 100);
  } else {
    setTimeout(fetchMap, nextAvailableFetch - now);
    return nextAvailableFetch += nextFetchInterval;
  }
};

neighborhood.retryNeighbor = function (site) {
  var neighborInfo;
  console.log('retrying neighbor');
  neighborInfo = {};
  neighborhood.sites[site] = neighborInfo;
  return populateSiteInfoFor(site, neighborInfo);
};

neighborhood.registerNeighbor = function (site) {
  var neighborInfo;

  if (neighborhood.sites[site] != null) {
    return;
  }

  neighborInfo = {};
  neighborhood.sites[site] = neighborInfo;
  populateSiteInfoFor(site, neighborInfo);
  return $('body').trigger('new-neighbor', site);
};

neighborhood.updateSitemap = function (pageObject) {
  var date, entry, index, links, neighborInfo, site, sitemap, slug, synopsis, title;
  site = location.host;

  if (!(neighborInfo = neighborhood.sites[site])) {
    return;
  }

  if (neighborInfo.sitemapRequestInflight) {
    return;
  }

  slug = pageObject.getSlug();
  date = pageObject.getDate();
  title = pageObject.getTitle();
  synopsis = pageObject.getSynopsis();
  links = pageObject.getLinks();
  entry = {
    slug: slug,
    date: date,
    title: title,
    synopsis: synopsis,
    links: links
  };
  sitemap = neighborInfo.sitemap;
  index = sitemap.findIndex(function (slot) {
    return slot.slug === slug;
  });

  if (index >= 0) {
    sitemap[index] = entry;
  } else {
    sitemap.push(entry);
  }

  return $('body').trigger('new-neighbor-done', site);
};

neighborhood.deleteFromSitemap = function (pageObject) {
  var index, neighborInfo, site, sitemap, slug;
  site = location.host;

  if (!(neighborInfo = neighborhood.sites[site])) {
    return;
  }

  if (neighborInfo.sitemapRequestInflight) {
    return;
  }

  slug = pageObject.getSlug();
  sitemap = neighborInfo.sitemap;
  index = sitemap.findIndex(function (slot) {
    return slot.slug === slug;
  });

  if (!(index >= 0)) {
    return;
  }

  sitemap.splice(index);
  return $('body').trigger('delete-neighbor-done', site);
};

neighborhood.listNeighbors = function () {
  return _.keys(neighborhood.sites);
}; // Page Search


extractPageText = function extractPageText(pageText, currentItem) {
  var err, i, len, line, ref;

  try {
    if (currentItem.text != null) {
      switch (currentItem.type) {
        case 'paragraph':
          pageText += ' ' + currentItem.text.replace(/\[{2}|\[(?:[\S]+)|\]{1,2}/g, '');
          break;

        case 'markdown':
          // really need to extract text from the markdown, but for now just remove link brackets, urls...
          pageText += ' ' + currentItem.text.replace(/\[{2}|\[(?:[\S]+)|\]{1,2}|\\n/g, ' ');
          break;

        case 'html':
          pageText += ' ' + currentItem.text.replace(/<[^>]*>/g, '');
          break;

        default:
          if (currentItem.text != null) {
            ref = currentItem.text.split(/\r\n?|\n/);

            for (i = 0, len = ref.length; i < len; i++) {
              line = ref[i];

              if (!line.match(/^[A-Z]+[ ].*/)) {
                pageText += ' ' + line.replace(/\[{2}|\[(?:[\S]+)|\]{1,2}/g, '');
              }
            }
          }

      }
    }
  } catch (error1) {
    err = error1;
    throw new Error("Error extracting text from ".concat(currentIndex, ", ").concat(err));
  }

  return pageText;
};

neighborhood.updateIndex = function (pageObject, originalStory) {
  var err, neighborInfo, newText, originalText, rawStory, site, slug, title;
  console.log("updating ".concat(pageObject.getSlug(), " in index"));
  site = location.host;

  if (!(neighborInfo = neighborhood.sites[site])) {
    return;
  }

  originalText = originalStory.reduce(extractPageText, '');
  slug = pageObject.getSlug();
  title = pageObject.getTitle();
  rawStory = pageObject.getRawPage().story;
  newText = rawStory.reduce(extractPageText, '');

  try {
    // try remove original page from index
    neighborInfo.siteIndex.remove({
      'id': slug,
      'title': title,
      'content': originalText
    });
  } catch (error1) {
    err = error1;

    if (!err.message.includes('not in the index')) {
      // swallow error, if the page was not in index
      console.log("removing ".concat(slug, " from index failed"), err);
    }
  }

  return neighborInfo.siteIndex.add({
    'id': slug,
    'title': title,
    'content': newText
  });
};

neighborhood.deleteFromIndex = function (pageObject) {
  var err, neighborInfo, pageText, rawStory, site, slug, title;
  site = location.host;

  if (!(neighborInfo = neighborhood.sites[site])) {
    return;
  }

  slug = pageObject.getSlug();
  title = pageObject.getTitle();
  rawStory = pageObject.getRawPage().story;
  pageText = rawStory.reduce(extractPageText, '');

  try {
    return neighborInfo.siteIndex.remove({
      'id': slug,
      'title': title,
      'content': pageText
    });
  } catch (error1) {
    err = error1;

    if (!err.message.includes('not in the index')) {
      // swallow error, if the page was not in index
      return console.log("removing ".concat(slug, " from index failed"), err);
    }
  }
};

neighborhood.search = function (searchQuery) {
  var contentBoost, error, finds, indexSite, neighborInfo, neighborSite, origin, ref, ref1, searchResult, start, tally, tick, titleBoost;
  finds = [];
  tally = {};

  tick = function tick(key) {
    if (tally[key] != null) {
      return tally[key]++;
    } else {
      return tally[key] = 1;
    }
  };

  indexSite = function indexSite(site, siteInfo) {
    var siteIndex, timeLabel;
    timeLabel = "indexing sitemap ( ".concat(site, " )");
    console.time(timeLabel);
    console.log('indexing sitemap:', site);
    siteIndex = new miniSearch({
      fields: ['title', 'content']
    });
    neighborInfo.sitemap.forEach(function (page) {
      siteIndex.add({
        'id': page.slug,
        'title': page.title,
        'content': page.synopsis
      });
    });
    console.timeEnd(timeLabel);
    return siteIndex;
  };

  start = Date.now();
  ref = neighborhood.sites;

  for (neighborSite in ref) {
    if (!hasProp.call(ref, neighborSite)) continue;
    neighborInfo = ref[neighborSite];

    if (neighborInfo.sitemap) {
      // do we already have an index?
      if (neighborInfo.siteIndex == null) {
        // create an index using sitemap
        neighborInfo.siteIndex = indexSite(neighborSite, neighborInfo);
      }
    }
  }

  origin = location.host;
  ref1 = neighborhood.sites;

  for (neighborSite in ref1) {
    if (!hasProp.call(ref1, neighborSite)) continue;
    neighborInfo = ref1[neighborSite];

    if (neighborInfo.siteIndex) {
      tick('sites');

      try {
        if (tally['pages'] != null) {
          tally['pages'] += neighborInfo.sitemap.length;
        } else {
          tally['pages'] = neighborInfo.sitemap.length;
        }
      } catch (error1) {
        error = error1;
        console.info('+++ sitemap not valid for ', neighborSite);
        neighborInfo.sitemap = [];
      }

      if (neighborSite === origin) {
        titleBoost = 20;
        contentBoost = 2;
      } else {
        titleBoost = 10;
        contentBoost = 1;
      }

      try {
        searchResult = neighborInfo.siteIndex.search(searchQuery, {
          boost: {
            title: titleBoost,
            content: contentBoost
          },
          prefix: true,
          combineWith: 'AND'
        });
      } catch (error1) {
        error = error1;
        console.error('search index error', neighborSite, searchQuery, error);
        searchResult = [];
      }

      searchResult.forEach(function (result) {
        tick('finds');
        return finds.push({
          page: neighborInfo.sitemap.find(function (_ref) {
            var slug = _ref.slug;
            return slug === result.id;
          }),
          site: neighborSite,
          rank: result.score
        });
      });
    }
  } // sort the finds by rank


  finds.sort(function (a, b) {
    return b.rank - a.rank;
  });
  tally['msec'] = Date.now() - start;
  return {
    finds: finds,
    tally: tally
  };
};

neighborhood.backLinks = function (slug) {
  var finds, neighborInfo, neighborSite, ref, results;
  finds = [];
  ref = neighborhood.sites;

  for (neighborSite in ref) {
    if (!hasProp.call(ref, neighborSite)) continue;
    neighborInfo = ref[neighborSite];

    if (neighborInfo.sitemap) {
      neighborInfo.sitemap.forEach(function (sitemapData, pageSlug) {
        if (sitemapData.links != null && Object.keys(sitemapData.links).length > 0 && Object.keys(sitemapData.links).includes(slug)) {
          return finds.push({
            slug: sitemapData.slug,
            title: sitemapData.title,
            site: neighborSite,
            itemId: sitemapData.links[slug],
            date: sitemapData.date
          });
        }
      });
    }
  }

  results = {};
  finds.forEach(function (find) {
    slug = find['slug'];
    results[slug] = results[slug] || {};
    results[slug]['title'] = find['title'];
    results[slug]['sites'] = results[slug]['sites'] || [];
    return results[slug]['sites'].push({
      site: find['site'],
      date: find['date'],
      itemId: find['itemId']
    });
  });
  return results;
};

},{"minisearch":63,"underscore":64}],18:[function(require,module,exports){
"use strict";

// This module manages the display of site flags representing
// fetched sitemaps stored in the neighborhood. It progresses
// through a series of states which, when attached to the flags,
// cause them to animate as an indication of work in progress.
var bind, flag, hasLinks, inject, link, neighborhood, sites, totalPages, wiki;
link = require('./link');
wiki = require('./wiki');
neighborhood = require('./neighborhood');
sites = null;
totalPages = 0;

hasLinks = function hasLinks(element) {
  return element.hasOwnProperty('links');
};

flag = function flag(site) {
  // status class progression: .wait, .fetch, .fail or .done
  console.log('neighbor - flag');
  return "<span class=\"neighbor\" data-site=\"".concat(site, "\">\n  <div class=\"wait\">\n    <img src=\"").concat(wiki.site(site).flag(), "\" title=\"").concat(site, "\">\n  </div>\n</span>");
};

inject = function inject(neighborhood) {
  return sites = neighborhood.sites;
};

bind = function bind() {
  var $neighborhood;
  $neighborhood = $('.neighborhood');
  return $('body').on('new-neighbor', function (e, site) {
    return $neighborhood.append(flag(site));
  }).on('new-neighbor-done', function (e, site) {
    var error, img, pageCount;

    try {
      pageCount = sites[site].sitemap.length;
    } catch (error1) {
      error = error1;
      pageCount = 0;
    }

    img = $(".neighborhood .neighbor[data-site=\"".concat(site, "\"]")).find('img');

    try {
      if (sites[site].sitemap.some(hasLinks)) {
        img.attr('title', "".concat(site, "\n ").concat(pageCount, " pages with 2-way links"));
      } else {
        img.attr('title', "".concat(site, "\n ").concat(pageCount, " pages"));
      }
    } catch (error1) {
      error = error1;
      console.info('+++ sitemap not valid for ', site);
      sites[site].sitemap = [];
    }

    totalPages = Object.values(neighborhood.sites).reduce(function (sum, site) {
      try {
        if (site.sitemapRequestInflight) {
          return sum;
        } else {
          return sum + site.sitemap.length;
        }
      } catch (error1) {
        error = error1;
        console.log('failed in new neighbour done', site, error);
        return sum;
      }
    }, 0);
    return $('.searchbox .pages').text("".concat(totalPages, " pages"));
  }).delegate('.neighbor img', 'click', function (e) {
    var site; // add handling refreshing neighbor that has failed

    if ($(e.target).parent().hasClass('fail')) {
      $(e.target).parent().removeClass('fail').addClass('wait');
      site = $(e.target).attr('title');
      return wiki.site(site).refresh(function () {
        console.log('about to retry neighbor');
        return neighborhood.retryNeighbor(site);
      });
    } else {
      return link.doInternalLink('welcome-visitors', null, this.title.split("\n")[0]);
    }
  });
};

module.exports = {
  inject: inject,
  bind: bind
};

},{"./link":16,"./neighborhood":17,"./wiki":37}],19:[function(require,module,exports){
"use strict";

// Page provides a factory for pageObjects, a model that combines
// the json derrived object and the site from which it came.
var EventEmitter, _, asSlug, asTitle, formatDate, _newPage, nowSections, pageEmitter, random, revision, synopsis;

formatDate = require('./util').formatDate;
random = require('./random');
revision = require('./revision');
synopsis = require('./synopsis');
_ = require('underscore'); // http://pragprog.com/magazines/2011-08/decouple-your-apps-with-eventdriven-coffeescript

var _require = require('events');

EventEmitter = _require.EventEmitter;
pageEmitter = new EventEmitter(); // TODO: better home for asSlug

asSlug = function asSlug(name) {
  return name.replace(/\s/g, '-').replace(/[^A-Za-z0-9-]/g, '').toLowerCase();
};

asTitle = function asTitle(slug) {
  return slug.replace(/-/g, ' ');
};

nowSections = function nowSections(now) {
  return [{
    symbol: '❄',
    date: now - 1000 * 60 * 60 * 24 * 366,
    period: 'a Year'
  }, {
    symbol: '⚘',
    date: now - 1000 * 60 * 60 * 24 * 31 * 3,
    period: 'a Season'
  }, {
    symbol: '⚪',
    date: now - 1000 * 60 * 60 * 24 * 31,
    period: 'a Month'
  }, {
    symbol: '☽',
    date: now - 1000 * 60 * 60 * 24 * 7,
    period: 'a Week'
  }, {
    symbol: '☀',
    date: now - 1000 * 60 * 60 * 24,
    period: 'a Day'
  }, {
    symbol: '⌚',
    date: now - 1000 * 60 * 60,
    period: 'an Hour'
  }];
};

_newPage = function newPage(json, site) {
  var addItem, addParagraph, apply, become, getContext, getCreate, getDate, getItem, getLinks, getNeighbors, getRawPage, getRemoteSite, getRemoteSiteDetails, getRevision, getSlug, getSynopsis, getTimestamp, getTitle, isLocal, isPlugin, isRecycler, isRemote, merge, notDuplicate, page, seqActions, seqItems, setTitle, siteLineup;
  page = json || {};
  page.title || (page.title = 'empty');
  page.story || (page.story = []);
  page.journal || (page.journal = []);

  getRawPage = function getRawPage() {
    return page;
  };

  getContext = function getContext() {
    var action, addContext, context, j, len, ref;
    context = ['view'];

    if (isRemote()) {
      context.push(site);
    }

    addContext = function addContext(site) {
      if (site != null && !_.include(context, site)) {
        return context.push(site);
      }
    };

    ref = page.journal.slice(0).reverse();

    for (j = 0, len = ref.length; j < len; j++) {
      action = ref[j];
      addContext(action != null ? action.site : void 0);
    }

    return context;
  };

  isPlugin = function isPlugin() {
    return page.plugin != null;
  };

  isRemote = function isRemote() {
    return !(site === void 0 || site === null || site === 'view' || site === 'origin' || site === 'local' || site === 'recycler');
  };

  isLocal = function isLocal() {
    return site === 'local';
  };

  isRecycler = function isRecycler() {
    return site === 'recycler';
  };

  getRemoteSite = function getRemoteSite() {
    var host = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (isRemote()) {
      return site;
    } else {
      return host;
    }
  };

  getRemoteSiteDetails = function getRemoteSiteDetails() {
    var host = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var result;
    result = [];

    if (host || isRemote()) {
      result.push(getRemoteSite(host));
    }

    if (isPlugin()) {
      result.push("".concat(page.plugin, " plugin"));
    }

    return result.join("\n");
  };

  getSlug = function getSlug() {
    return asSlug(page.title);
  };

  getNeighbors = function getNeighbors(host) {
    var action, item, j, k, len, len1, neighbors, ref, ref1;
    neighbors = [];

    if (isRemote()) {
      neighbors.push(site);
    } else {
      if (host != null) {
        neighbors.push(host);
      }
    }

    ref = page.story;

    for (j = 0, len = ref.length; j < len; j++) {
      item = ref[j];

      if ((item != null ? item.site : void 0) != null) {
        neighbors.push(item.site);
      }
    }

    ref1 = page.journal;

    for (k = 0, len1 = ref1.length; k < len1; k++) {
      action = ref1[k];

      if ((action != null ? action.site : void 0) != null) {
        neighbors.push(action.site);
      }
    }

    return _.uniq(neighbors);
  };

  getTitle = function getTitle() {
    return page.title;
  };

  setTitle = function setTitle(title) {
    return page.title = title;
  };

  getRevision = function getRevision() {
    return page.journal.length - 1;
  };

  getDate = function getDate() {
    var action;
    action = page.journal[getRevision()];

    if (action != null) {
      if (action.date != null) {
        return action.date;
      }
    }

    return void 0;
  };

  getTimestamp = function getTimestamp() {
    var action;
    action = page.journal[getRevision()];

    if (action != null) {
      if (action.date != null) {
        return formatDate(action.date);
      } else {
        return "Revision ".concat(getRevision());
      }
    } else {
      return "Unrecorded Date";
    }
  };

  getSynopsis = function getSynopsis() {
    return synopsis(page);
  };

  getLinks = function getLinks() {
    var err, extractPageLinks, pageLinks, pageLinksMap;

    extractPageLinks = function extractPageLinks(collaborativeLinks, currentItem, currentIndex, array) {
      var err, linkRe, match;

      try {
        // extract collaborative links 
        // - this will need extending if we also extract the id of the item containing the link
        linkRe = /\[\[([^\]]+)\]\]/g;
        match = void 0;

        while ((match = linkRe.exec(currentItem.text)) !== null) {
          if (!collaborativeLinks.has(asSlug(match[1]))) {
            collaborativeLinks.set(asSlug(match[1]), currentItem.id);
          }
        }

        if ('reference' === currentItem.type) {
          if (!collaborativeLinks.has(currentItem.slug)) {
            collaborativeLinks.set(currentItem.slug, currentItem.id);
          }
        }
      } catch (error) {
        err = error;
        console.log("*** Error extracting links from ".concat(currentIndex, " of ").concat(JSON.stringify(array)), err.message);
      }

      return collaborativeLinks;
    };

    try {
      pageLinksMap = page.story.reduce(extractPageLinks, new Map());
    } catch (error) {
      err = error;
      console.log("+++ Extract links on ".concat(page.slug, " fails"), err);
    }

    if (pageLinksMap.size > 0) {
      pageLinks = Object.fromEntries(pageLinksMap);
    } else {
      pageLinks = {};
    }

    return pageLinks;
  };

  addItem = function addItem(item) {
    item = _.extend({}, {
      id: random.itemId()
    }, item);
    return page.story.push(item);
  };

  getItem = function getItem(id) {
    var item, j, len, ref;
    ref = page.story;

    for (j = 0, len = ref.length; j < len; j++) {
      item = ref[j];

      if (item.id === id) {
        return item;
      }
    }

    return null;
  };

  seqItems = function seqItems(each) {
    var promise;
    promise = new Promise(function (resolve, _reject) {
      var _emitItem;

      _emitItem = function emitItem(i) {
        if (i >= page.story.length) {
          return resolve();
        }

        return each(page.story[i] || {
          text: 'null'
        }, function () {
          return _emitItem(i + 1);
        });
      };

      return _emitItem(0);
    });
    return promise;
  };

  addParagraph = function addParagraph(text) {
    var type;
    type = "paragraph";
    return addItem({
      type: type,
      text: text
    });
  }; // page.journal.push {type: 'add'}


  seqActions = function seqActions(each) {
    var _emitAction, sections, smaller;

    smaller = 0;
    sections = nowSections(new Date().getTime());

    _emitAction = function emitAction(i) {
      var action, bigger, j, len, section, separator;

      if (i >= page.journal.length) {
        return;
      }

      action = page.journal[i] || {};
      bigger = action.date || 0;
      separator = null;

      for (j = 0, len = sections.length; j < len; j++) {
        section = sections[j];

        if (section.date > smaller && section.date < bigger) {
          separator = section;
        }
      }

      smaller = bigger;
      return each({
        action: action,
        separator: separator
      }, function () {
        return _emitAction(i + 1);
      });
    };

    return _emitAction(0);
  };

  become = function become(story, journal) {
    page.story = (story != null ? story.getRawPage().story : void 0) || [];

    if (journal != null) {
      return page.journal = journal != null ? journal.getRawPage().journal : void 0;
    }
  };

  siteLineup = function siteLineup() {
    var path, slug;
    slug = getSlug();
    path = slug === 'welcome-visitors' ? "view/welcome-visitors" : "view/welcome-visitors/view/".concat(slug);

    if (isRemote()) {
      // "//#{site}/#{path}"
      return wiki.site(site).getDirectURL(path);
    } else {
      return "/".concat(path);
    }
  };

  notDuplicate = function notDuplicate(journal, action) {
    var each, j, len;

    for (j = 0, len = journal.length; j < len; j++) {
      each = journal[j];

      if (each.id === action.id && each.date === action.date) {
        return false;
      }
    }

    return true;
  };

  merge = function merge(update) {
    var action, j, len, merged, ref;

    merged = function () {
      var j, len, ref, results;
      ref = page.journal;
      results = [];

      for (j = 0, len = ref.length; j < len; j++) {
        action = ref[j];
        results.push(action);
      }

      return results;
    }();

    ref = update.getRawPage().journal;

    for (j = 0, len = ref.length; j < len; j++) {
      action = ref[j];

      if (notDuplicate(page.journal, action)) {
        merged.push(action);
      }
    }

    merged.push({
      type: 'fork',
      site: update.getRemoteSite(),
      date: new Date().getTime()
    });
    return _newPage(revision.create(999, {
      title: page.title,
      journal: merged
    }), site);
  };

  apply = function apply(action) {
    revision.apply(page, action);

    if (action.site) {
      return site = null;
    }
  };

  getCreate = function getCreate() {
    var isCreate;

    isCreate = function isCreate(action) {
      return action.type === 'create';
    };

    return page.journal.reverse().find(isCreate);
  };

  return {
    getRawPage: getRawPage,
    getContext: getContext,
    isPlugin: isPlugin,
    isRemote: isRemote,
    isLocal: isLocal,
    isRecycler: isRecycler,
    getRemoteSite: getRemoteSite,
    getRemoteSiteDetails: getRemoteSiteDetails,
    getSlug: getSlug,
    getNeighbors: getNeighbors,
    getTitle: getTitle,
    getLinks: getLinks,
    setTitle: setTitle,
    getRevision: getRevision,
    getDate: getDate,
    getTimestamp: getTimestamp,
    getSynopsis: getSynopsis,
    addItem: addItem,
    getItem: getItem,
    addParagraph: addParagraph,
    seqItems: seqItems,
    seqActions: seqActions,
    become: become,
    siteLineup: siteLineup,
    merge: merge,
    apply: apply,
    getCreate: getCreate
  };
};

module.exports = {
  newPage: _newPage,
  asSlug: asSlug,
  asTitle: asTitle,
  pageEmitter: pageEmitter
};

},{"./random":24,"./revision":28,"./synopsis":34,"./util":36,"events":53,"underscore":64}],20:[function(require,module,exports){
"use strict";

// The pageHandler bundles fetching and storing json pages
// from origin, remote and browser local storage. It handles
// incremental updates and implicit forks when pages are edited.
var _, addToJournal, deepCopy, lineup, neighborhood, newPage, pageFromLocalStorage, pageHandler, pushToLocal, pushToServer, random, _recursiveGet, revision, state;

_ = require('underscore');
state = require('./state');
revision = require('./revision');
addToJournal = require('./addToJournal');
newPage = require('./page').newPage;
random = require('./random');
lineup = require('./lineup');
neighborhood = require('./neighborhood');
module.exports = pageHandler = {};

deepCopy = function deepCopy(object) {
  return JSON.parse(JSON.stringify(object));
};

pageHandler.useLocalStorage = function () {
  return $(".login").length > 0;
};

pageFromLocalStorage = function pageFromLocalStorage(slug) {
  var json;

  if (json = localStorage.getItem(slug)) {
    return JSON.parse(json);
  } else {
    return void 0;
  }
};

_recursiveGet = function recursiveGet(_ref) {
  var pageInformation = _ref.pageInformation,
      whenGotten = _ref.whenGotten,
      whenNotGotten = _ref.whenNotGotten,
      localContext = _ref.localContext;
  var adapter, localBeforeOrigin, rev, site, slug;
  slug = pageInformation.slug;
  rev = pageInformation.rev;
  site = pageInformation.site;
  localBeforeOrigin = {
    get: function get(slug, done) {
      return wiki.local.get(slug, function (err, page) {
        console.log([err, page]);

        if (err != null) {
          return wiki.origin.get(slug, done);
        } else {
          site = 'local';
          return done(null, page);
        }
      });
    }
  };

  if (site) {
    localContext = [];
  } else {
    site = localContext.shift();
  }

  if (site === window.location.host) {
    site = 'origin';
  }

  if (site === null) {
    site = 'view';
  }

  adapter = function () {
    switch (site) {
      case 'local':
        return wiki.local;

      case 'origin':
        return wiki.origin;

      case 'recycler':
        return wiki.recycler;

      case 'view':
        return localBeforeOrigin;

      default:
        return wiki.site(site);
    }
  }();

  return adapter.get("".concat(slug, ".json"), function (err, page) {
    var ref, text, trouble;

    if (!err) {
      console.log('got', site, page);

      if (rev) {
        page = revision.create(rev, page);
      }

      return whenGotten(newPage(page, site));
    } else {
      if (err.xhr.status === 404 || err.xhr.status === 0) {
        if (localContext.length > 0) {
          return _recursiveGet({
            pageInformation: pageInformation,
            whenGotten: whenGotten,
            whenNotGotten: whenNotGotten,
            localContext: localContext
          });
        } else {
          return whenNotGotten();
        }
      } else {
        text = "The page handler has run into problems with this request.\n<pre class=error>".concat(JSON.stringify(pageInformation), "</pre>\nThe requested url.\n<pre class=error>").concat(url, "</pre>\nThe server reported status.\n<pre class=error>").concat((ref = err.xhr) != null ? ref.status : void 0, "</pre>\nThe error message.\n<pre class=error>").concat(err.msg, "</pre>\nThese problems are rarely solved by reporting issues.\nThere could be additional information reported in the browser's console.log.\nMore information might be accessible by fetching the page outside of wiki.\n<a href=\"").concat(url, "\" target=\"_blank\">try-now</a>");
        trouble = newPage({
          title: "Trouble: Can't Get Page"
        }, null);
        trouble.addItem({
          type: 'html',
          text: text
        });
        return whenGotten(trouble);
      }
    }
  });
};

pageHandler.get = function (_ref2) {
  var whenGotten = _ref2.whenGotten,
      whenNotGotten = _ref2.whenNotGotten,
      pageInformation = _ref2.pageInformation;
  var localPage;

  if (!pageInformation.site) {
    if (localPage = pageFromLocalStorage(pageInformation.slug)) {
      if (pageInformation.rev) {
        localPage = revision.create(pageInformation.rev, localPage);
      }

      return whenGotten(newPage(localPage, 'local'));
    }
  }

  if (!pageHandler.context.length) {
    pageHandler.context = ['view'];
  }

  return _recursiveGet({
    pageInformation: pageInformation,
    whenGotten: whenGotten,
    whenNotGotten: whenNotGotten,
    localContext: _.clone(pageHandler.context)
  });
};

pageHandler.context = [];

pushToLocal = function pushToLocal($page, pagePutInfo, action) {
  var page, site;

  if (action.type === 'create') {
    page = {
      title: action.item.title,
      story: [],
      journal: []
    };
  } else {
    page = pageFromLocalStorage(pagePutInfo.slug);
    page || (page = lineup.atKey($page.data('key')).getRawPage());

    if (page.journal == null) {
      page.journal = [];
    }

    if ((site = action['fork']) != null) {
      page.journal = page.journal.concat({
        'type': 'fork',
        'site': site,
        'date': new Date().getTime()
      });
      delete action['fork'];
    }
  }

  revision.apply(page, action);
  return wiki.local.put(pagePutInfo.slug, page, function () {
    addToJournal($page.find('.journal'), action);
    return $page.addClass("local");
  });
};

pushToServer = function pushToServer($page, pagePutInfo, action) {
  var bundle, pageObject; // bundle rawPage which server will strip out

  bundle = deepCopy(action);
  pageObject = lineup.atKey($page.data('key'));

  if (action.type === 'fork') {
    bundle.item = deepCopy(pageObject.getRawPage());
  } // we need the original page so we can update the index


  return wiki.origin.get("".concat(pagePutInfo.slug, ".json"), function (err, originalPage) {
    var originalStory;

    if (err) {
      originalStory = [];
    } else {
      originalStory = originalPage.story || [];
    }

    return wiki.origin.put(pagePutInfo.slug, bundle, function (err) {
      var index;

      if (err) {
        action.error = {
          type: err.type,
          msg: err.msg,
          response: err.xhr.responseText
        };
        return pushToLocal($page, pagePutInfo, action);
      } else {
        if (pageObject != null ? pageObject.apply : void 0) {
          pageObject.apply(action);
        }

        neighborhood.updateSitemap(pageObject);
        neighborhood.updateIndex(pageObject, originalStory);
        addToJournal($page.find('.journal'), action);

        if (action.type === 'fork') {
          wiki.local["delete"]($page.attr('id'));
        }

        if (action.type !== 'fork' && action.fork) {
          // implicit fork, probably only affects image plugin
          if (action.item.type === 'image') {
            index = $page.find('.item').index($page.find('#' + action.item.id).context);
            return wiki.renderFrom(index);
          }
        }
      }
    });
  });
};

pageHandler.put = function ($page, action) {
  var checkedSite, forkFrom, pagePutInfo;

  checkedSite = function checkedSite() {
    var site;

    switch (site = $page.data('site')) {
      case 'origin':
      case 'local':
      case 'view':
        return null;

      case location.host:
        return null;

      default:
        return site;
    }
  }; // about the page we have


  pagePutInfo = {
    slug: $page.attr('id').split('_rev')[0],
    rev: $page.attr('id').split('_rev')[1],
    site: checkedSite(),
    local: $page.hasClass('local')
  };
  forkFrom = pagePutInfo.site;
  console.log('pageHandler.put', action, pagePutInfo); // detect when fork to local storage

  if (pageHandler.useLocalStorage()) {
    if (pagePutInfo.site != null) {
      console.log('remote => local');
    } else if (!pagePutInfo.local) {
      console.log('origin => local');
      action.site = forkFrom = location.host;
    }
  } // else if !pageFromLocalStorage(pagePutInfo.slug)
  //   console.log ''
  //   action.site = forkFrom = pagePutInfo.site
  //   console.log 'local storage first time', action, 'forkFrom', forkFrom
  // tweek action before saving


  action.date = new Date().getTime();

  if (action.site === 'origin') {
    delete action.site;
  } // update dom when forking


  $page.removeClass('plugin');

  if (forkFrom) {
    // pull remote site closer to us
    $page.find('h1').prop('title', location.host);
    $page.find('h1 img').attr('src', '/favicon.png');
    $page.find('h1 a').attr('href', "/view/welcome-visitors/view/".concat(pagePutInfo.slug)).attr('target', location.host);
    $page.data('site', null);
    $page.removeClass('remote'); //STATE -- update url when site changes

    state.setUrl();

    if (action.type !== 'fork') {
      // bundle implicit fork with next action
      action.fork = forkFrom;
      addToJournal($page.find('.journal'), {
        type: 'fork',
        site: forkFrom,
        date: action.date
      });
    }
  } // store as appropriate


  if (pageHandler.useLocalStorage() || pagePutInfo.site === 'local') {
    return pushToLocal($page, pagePutInfo, action);
  } else {
    return pushToServer($page, pagePutInfo, action);
  }
};

pageHandler["delete"] = function (pageObject, $page, done) {
  console.log('delete server-side');
  console.log('pageObject:', pageObject);

  if (pageObject.isRecycler()) {
    return wiki.recycler["delete"]("".concat(pageObject.getSlug(), ".json"), function (err) {
      var more;

      more = function more() {
        return done(err);
      };

      return setTimeout(more, 300);
    });
  } else {
    return wiki.origin["delete"]("".concat(pageObject.getSlug(), ".json"), function (err) {
      var more;

      more = function more() {
        if (err == null) {
          // err = null
          neighborhood.deleteFromSitemap(pageObject);
        }

        if (err == null) {
          neighborhood.deleteFromIndex(pageObject);
        }

        return done(err);
      };

      return setTimeout(more, 300); // simulate server turnaround
    });
  }
};

},{"./addToJournal":4,"./lineup":15,"./neighborhood":17,"./page":19,"./random":24,"./revision":28,"./state":33,"underscore":64}],21:[function(require,module,exports){
"use strict";

// The Paragraph plugin holds text that can be edited and rendered
// with hyperlinks. It will eventually escape html tags but for the
// moment we live dangerously.
var bind, editor, emit, itemz, resolve, type;
editor = require('./editor');
resolve = require('./resolve');
itemz = require('./itemz');

type = function type(text) {
  if (text.match(/<(i|b|p|a|h\d|hr|br|li|img|div|span|table|blockquote)\b.*?>/i)) {
    return 'html';
  } else {
    return 'markdown';
  }
};

emit = function emit($item, item) {
  var i, len, ref, results, text;
  ref = item.text.split(/\n\n+/);
  results = [];

  for (i = 0, len = ref.length; i < len; i++) {
    text = ref[i];

    if (text.match(/\S/)) {
      results.push($item.append("<p>".concat(resolve.resolveLinks(text), "</p>")));
    } else {
      results.push(void 0);
    }
  }

  return results;
};

bind = function bind($item, item) {
  return $item.dblclick(function (e) {
    if (e.shiftKey) {
      item.type = type(item.text);
      return itemz.replaceItem($item, 'paragraph', item);
    } else {
      return editor.textEditor($item, item, {
        'append': true
      });
    }
  });
};

module.exports = {
  emit: emit,
  bind: bind
};

},{"./editor":8,"./itemz":12,"./resolve":27}],22:[function(require,module,exports){
"use strict";

// The plugin module manages the dynamic retrieval of plugin
// javascript including additional scripts that may be requested.
// forward = require './forward'
var bind,
    emit,
    escape,
    getScript,
    loadScript,
    loadingScripts,
    plugin,
    scripts,
    indexOf = [].indexOf;
module.exports = plugin = {};

escape = function escape(s) {
  return ('' + s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
}; // define loadScript that allows fetching a script.
// see example in http://api.jquery.com/jQuery.getScript/


loadScript = function loadScript(url, options) {
  console.log("loading url:", url);
  options = $.extend(options || {}, {
    dataType: "script",
    cache: true,
    url: url
  });
  return $.ajax(options);
};

scripts = [];
loadingScripts = {};

getScript = plugin.getScript = function (url) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  if (indexOf.call(scripts, url) >= 0) {
    return callback();
  } else {
    return loadScript(url).done(function () {
      scripts.push(url);
      return callback();
    }).fail(function (_jqXHR, _textStatus, err) {
      console.log('getScript: Failed to load:', url, err);
      return callback();
    });
  }
};

plugin.renderFrom = function (notifIndex) {
  var $items, _emitNextItem, promise;

  $items = $(".item").slice(notifIndex);
  console.log("notifIndex", notifIndex, "about to render", $items.toArray());
  promise = Promise.resolve();

  _emitNextItem = function emitNextItem(itemElems) {
    var $item, item, itemElem;

    if (itemElems.length === 0) {
      return promise;
    }

    itemElem = itemElems.shift();
    $item = $(itemElem);

    if (!$item.hasClass('textEditing')) {
      item = $item.data('item');
      promise = promise.then(function () {
        return new Promise(function (resolve, reject) {
          $item.off();
          return plugin.emit($item.empty(), item, function () {
            return resolve();
          });
        });
      });
    }

    return _emitNextItem(itemElems);
  }; // The concat here makes a copy since we need to loop through the same
  // items to do a bind.


  promise = _emitNextItem($items.toArray()); // Binds must be called sequentially in order to store the promises used to order bind operations.
  // Note: The bind promises used here are for ordering "bind creation".
  // The ordering of "bind results" is done within the plugin.bind wrapper.

  promise = promise.then(function () {
    var _bindNextItem;

    promise = Promise.resolve();

    _bindNextItem = function bindNextItem(itemElems) {
      var $item, item, itemElem;

      if (itemElems.length === 0) {
        return promise;
      }

      itemElem = itemElems.shift();
      $item = $(itemElem);
      item = $item.data('item');
      promise = promise.then(function () {
        return new Promise(function (resolve, reject) {
          return plugin.getPlugin(item.type, function (plugin) {
            plugin.bind($item, item);
            return resolve();
          });
        });
      });
      return _bindNextItem(itemElems);
    };

    return _bindNextItem($items.toArray());
  });
  return promise;
};

emit = function emit(pluginEmit) {
  var fn;

  fn = function fn($item, item) {
    $item.addClass('emit');
    return pluginEmit($item, item);
  };

  return fn;
};

bind = function bind(name, pluginBind) {
  var fn;

  fn = function fn($item, item, oldIndex) {
    var consumes, deps, index, waitFor; // Clear out any list of consumed items.

    $item[0].consuming = [];
    index = $('.item').index($item);
    consumes = window.plugins[name].consumes;
    waitFor = Promise.resolve(); // Wait for all items in the lineup that produce what we consume
    // before calling our bind method.

    if (consumes) {
      deps = [];
      consumes.forEach(function (consuming) {
        var producers;
        producers = $(".item:lt(".concat(index, ")")).filter(consuming);
        console.log(name, "consumes", consuming);
        console.log(producers, "produce", consuming);

        if (!producers || producers.length === 0) {
          console.log('warn: no items in lineup that produces', consuming);
        }

        console.log("there are ".concat(producers.length, " instances of ").concat(consuming));
        return producers.each(function (_i, el) {
          var item_id, page_key;
          page_key = $(el).parents('.page').data('key');
          item_id = $(el).attr('data-id');
          $item[0].consuming.push("".concat(page_key, "/").concat(item_id));
          return deps.push(el.promise);
        });
      });
      waitFor = Promise.all(deps);
    }

    return waitFor.then(function () {
      var bindPromise;
      $item.removeClass('emit');
      bindPromise = pluginBind($item, item);

      if (!bindPromise || typeof bindPromise.then === 'function') {
        bindPromise = Promise.resolve(bindPromise);
      } // This is where the "bind results" promise for the current item is stored


      return $item[0].promise = bindPromise;
      /* 
           .then ->
       * If the plugin has the needed callback, subscribe to server side events
       * for the current page
             if window.plugins[name].processServerEvent
               console.log 'listening for server events', $item, item
               forward.init $item, item, window.plugins[name].processServerEvent 
            */
    })["catch"](function (e) {
      return console.log('plugin emit: unexpected error', e);
    });
  };

  return fn;
};

plugin.wrap = function (name, p) {
  p.emit = emit(p.emit);
  p.bind = bind(name, p.bind);
  return p;
};

plugin.get = plugin.getPlugin = function (name, callback) {
  if (loadingScripts[name]) {
    return loadingScripts[name].then(callback);
  }

  loadingScripts[name] = new Promise(function (resolve, _reject) {
    if (window.plugins[name]) {
      return resolve(window.plugins[name]);
    }

    return getScript("/plugins/".concat(name, "/").concat(name, ".js"), function () {
      var p;
      p = window.plugins[name];

      if (p) {
        plugin.wrap(name, p);
        return resolve(p);
      }

      return getScript("/plugins/".concat(name, ".js"), function () {
        p = window.plugins[name];

        if (p) {
          plugin.wrap(name, p);
        }

        return resolve(p);
      });
    });
  });
  loadingScripts[name].then(function (plugin) {
    delete loadingScripts[name];
    return callback(plugin);
  });
  return loadingScripts[name];
};

plugin["do"] = plugin.doPlugin = function ($item, item) {
  var done = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  var promise;
  $item.data('item', item);
  promise = plugin.renderFrom($('.item').index($item));
  return promise.then(function () {
    return done();
  });
};

plugin.emit = function (div, item) {
  var done = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  var error;

  error = function error(ex, script) {
    div.append("<div class=\"error\">\n  ".concat(escape(item.text || ""), "\n  <button>help</button><br>\n</div>"));

    if (item.text != null) {
      div.find('.error').dblclick(function (e) {
        return wiki.textEditor(div, item);
      });
    }

    return div.find('button').on('click', function () {
      wiki.dialog(ex.toString(), "<p> This \"".concat(item.type, "\" plugin won't show.</p>\n<li> Is it available on this server?\n<li> Is its markup correct?\n<li> Can it find necessary data?\n<li> Has network access been interrupted?\n<li> Has its code been tested?\n<p> Developers may open debugging tools and retry the plugin.</p>\n<button class=\"retry\">retry</button>\n<p> Learn more\n  <a class=\"external\" target=\"_blank\" rel=\"nofollow\"\n  href=\"http://plugins.fed.wiki.org/about-plugins.html\"\n  title=\"http://plugins.fed.wiki.org/about-plugins.html\">\n    About Plugins\n    <img src=\"/images/external-link-ltr-icon.png\">\n  </a>\n</p>"));
      return $('.retry').on('click', function () {
        if (script.emit.length > 2) {
          return script.emit(div, item, function () {
            return done();
          });
        } else {
          script.emit(div, item);
          return done();
        }
      });
    });
  };

  div.data('pageElement', div.parents(".page"));
  div.data('item', item);
  return plugin.get(item.type, function (script) {
    var err;

    try {
      if (script == null) {
        throw TypeError("Can't find plugin for '".concat(item.type, "'"));
      }

      if (script.emit.length > 2) {
        return script.emit(div, item, function () {
          if (bind) {
            script.bind(div, item);
          }

          return done();
        });
      } else {
        script.emit(div, item);
        return done();
      }
    } catch (error1) {
      err = error1;
      console.log('plugin error', err);
      error(err, script);
      return done();
    }
  });
};

plugin.registerPlugin = function (pluginName, pluginFn) {
  return window.plugins[pluginName] = pluginFn($);
};

},{}],23:[function(require,module,exports){
"use strict";

// This module preloads the plugins directory with a few
// plugins that we can't live without. They will be
// browserified along with the rest of the core javascript.
var plugin;
plugin = require('./plugin');
window.plugins = {
  reference: plugin.wrap('reference', require('./reference')),
  factory: plugin.wrap('factory', require('./factory')),
  paragraph: plugin.wrap('paragraph', require('./paragraph')),
  //image: plugin.wrap('image', require './image')
  future: plugin.wrap('future', require('./future')),
  importer: plugin.wrap('importer', require('./importer'))
};

},{"./factory":9,"./future":10,"./importer":11,"./paragraph":21,"./plugin":22,"./reference":25}],24:[function(require,module,exports){
"use strict";

// We create strings of hexidecimal digits representing a
// given number of random bytes. We use short strings for
// cache busting, medium strings for keys linking dom to
// model, and, longer still strings for lifetime identity
// of story elements.
var itemId, randomByte, randomBytes;

randomByte = function randomByte() {
  return ((1 + Math.random()) * 0x100 | 0).toString(16).substring(1);
};

randomBytes = function randomBytes(n) {
  return function () {
    var i, ref, results;
    results = [];

    for (i = 1, ref = n; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
      results.push(randomByte());
    }

    return results;
  }().join('');
};

itemId = function itemId() {
  return randomBytes(8);
};

module.exports = {
  randomByte: randomByte,
  randomBytes: randomBytes,
  itemId: itemId
};

},{}],25:[function(require,module,exports){
"use strict";

// The Reference plugin holds a site and page name to be
// found on that site. Search, for example, produces a page of
// references. Double click will edit the body of a reference
// but not the name and site.
var bind, editor, emit, page, resolve;
editor = require('./editor');
resolve = require('./resolve');
page = require('./page'); // see http://fed.wiki.org/about-reference-plugin.html

emit = function emit($item, item) {
  var site, slug;
  slug = item.slug;

  if (item.title != null) {
    slug || (slug = page.asSlug(item.title));
  }

  slug || (slug = 'welcome-visitors');
  site = item.site;
  return resolve.resolveFrom(site, function () {
    return $item.append("<p>\n  <img class='remote'\n    src='".concat(wiki.site(site).flag(), "'\n    title='").concat(site, "'\n    data-site=\"").concat(site, "\"\n    data-slug=\"").concat(slug, "\"\n  >\n  ").concat(resolve.resolveLinks("[[".concat(item.title || slug, "]]")), "\n  \u2014\n  ").concat(resolve.resolveLinks(item.text), "\n</p>"));
  });
};

bind = function bind($item, item) {
  return $item.dblclick(function () {
    return editor.textEditor($item, item);
  });
};

module.exports = {
  emit: emit,
  bind: bind
};

},{"./editor":8,"./page":19,"./resolve":27}],26:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

// Refresh will fetch a page and use it to fill a dom
// element that has been ready made to hold it.
// cycle: have a div, $(this), with id = slug
// whenGotten: have a pageObject we just fetched
// buildPage: have a pageObject from somewhere
// rebuildPage: have a key from saving pageObject in lineup
// renderPageIntoPageElement: have $page annotated from pageObject
// pageObject.seqItems: get back each item sequentially
// plugin.do: have $item in dom for item
// The various calling conventions are due to async
// requirements and the work of many hands.
var _, actionSymbols, addToJournal, aliasItem, asSlug, buildPage, changeMouseCursor, createFactory, createMissingFlag, cycle, editDate, emitBacklinks, emitControls, emitFooter, emitHeader, emitTimestamp, emitTwins, equals, getItem, getPageObject, getStoryItemOrder, handleDrop, handleHeaderClick, handleMerging, initAddButton, initDragging, initMerging, lineup, neighborhood, newFuturePage, newPage, pageEmitter, pageHandler, pageModule, plugin, random, rebuildPage, renderPageIntoPageElement, resolve, state;

_ = require('underscore');
pageHandler = require('./pageHandler');
plugin = require('./plugin');
state = require('./state');
neighborhood = require('./neighborhood');
addToJournal = require('./addToJournal');
actionSymbols = require('./actionSymbols');
lineup = require('./lineup');
resolve = require('./resolve');
random = require('./random');
pageModule = require('./page');
newPage = pageModule.newPage;
asSlug = pageModule.asSlug;
pageEmitter = pageModule.pageEmitter;

getItem = function getItem($item) {
  if ($($item).length > 0) {
    return $($item).data("item") || $($item).data('staticItem');
  }
};

aliasItem = function aliasItem($page, $item, oldItem) {
  var item, pageObject;
  item = $.extend({}, oldItem);
  $item.data('item', item);
  pageObject = lineup.atKey($page.data('key'));

  if (pageObject.getItem(item.id) != null) {
    item.alias || (item.alias = item.id);
    item.id = random.itemId();
    $item.attr('data-id', item.id);
    $item.data('id', item.id);
    $item.data('item').id = item.id;
  } else if (item.alias != null) {
    if (pageObject.getItem(item.alias) == null) {
      item.id = item.alias;
      delete item.alias;
      $item.attr('data-id', item.id);
    }
  }

  return item;
};

equals = function equals(a, b) {
  return a && b && a.get(0) === b.get(0);
};

getStoryItemOrder = function getStoryItemOrder($story) {
  return $story.children().map(function (_, value) {
    return $(value).attr('data-id');
  }).get();
};

handleDrop = function handleDrop(evt, ui, originalIndex, originalOrder) {
  var $before, $destinationPage, $item, $sourcePage, before, copying, destinationIsGhost, dragAttribution, index, item, moveBetweenDuplicatePages, moveWithinPage, order, removedTo, sourceIsReadOnly;
  $item = ui.item;
  item = getItem($item);
  $sourcePage = $item.data('pageElement');
  sourceIsReadOnly = $sourcePage.hasClass('ghost') || $sourcePage.hasClass('remote');

  if (!$sourcePage.hasClass('ghost')) {
    dragAttribution = {
      page: $sourcePage.data().data['title']
    };

    if ($sourcePage.data().site != null) {
      dragAttribution['site'] = $sourcePage.data().site;
    }
  }

  $destinationPage = $item.parents('.page:first');
  destinationIsGhost = $destinationPage.hasClass('ghost');
  moveWithinPage = equals($sourcePage, $destinationPage);
  moveBetweenDuplicatePages = !moveWithinPage && $sourcePage.attr('id') === $destinationPage.attr('id');
  removedTo = {
    page: $destinationPage.data().data['title']
  };

  if (destinationIsGhost || moveBetweenDuplicatePages) {
    $(evt.target).sortable('cancel');
    return;
  }

  if (moveWithinPage) {
    order = getStoryItemOrder($item.parents('.story:first'));

    if (!_.isEqual(order, originalOrder)) {
      $('.shadow-copy').remove();
      $item.empty();
      index = $(".item").index($item);

      if (originalIndex < index) {
        index = originalIndex;
      }

      plugin.renderFrom(index);
      pageHandler.put($destinationPage, {
        id: item.id,
        type: 'move',
        order: order
      });
    }

    return;
  }

  copying = sourceIsReadOnly || evt.shiftKey;

  if (copying) {
    // If making a copy, update the temp clone so it becomes a true copy.
    $('.shadow-copy').removeClass('shadow-copy').data($item.data()).attr({
      'data-id': $item.attr('data-id')
    });
  } else {
    pageHandler.put($sourcePage, {
      id: item.id,
      type: 'remove',
      removedTo: removedTo
    });
  } // Either way, record the add to the new page


  $item.data('pageElement', $destinationPage);
  $before = $item.prev('.item');
  before = getItem($before);
  item = aliasItem($destinationPage, $item, item);
  pageHandler.put($destinationPage, {
    id: item.id,
    type: 'add',
    item: item,
    after: before != null ? before.id : void 0,
    attribution: dragAttribution
  });
  $('.shadow-copy').remove();
  $item.empty();
  $before.after($item);
  index = $(".item").index($item);

  if (originalIndex < index) {
    index = originalIndex;
  }

  return plugin.renderFrom(index);
};

changeMouseCursor = function changeMouseCursor(e, ui) {
  var $destinationPage, $sourcePage, copying, destinationIsGhost, moveBetweenDuplicatePages, moveWithinPage, sourceIsReadOnly;
  $sourcePage = ui.item.data('pageElement');
  sourceIsReadOnly = $sourcePage.hasClass('ghost') || $sourcePage.hasClass('remote');
  $destinationPage = ui.placeholder.parents('.page:first');
  destinationIsGhost = $destinationPage.hasClass('ghost');
  moveWithinPage = equals($sourcePage, $destinationPage);
  moveBetweenDuplicatePages = !moveWithinPage && $sourcePage.attr('id') === $destinationPage.attr('id');
  copying = sourceIsReadOnly || e.shiftKey && !moveWithinPage;

  if (destinationIsGhost || moveBetweenDuplicatePages) {
    $('body').css('cursor', 'no-drop');
    return $('.shadow-copy').hide();
  } else if (copying) {
    $('body').css('cursor', 'copy');
    return $('.shadow-copy').show();
  } else {
    $('body').css('cursor', 'move');
    return $('.shadow-copy').hide();
  }
};

initDragging = function initDragging($page) {
  var $story, cancelDrag, dragCancelled, options, origCursor, originalIndex, originalOrder;
  origCursor = $('body').css('cursor');
  options = {
    connectWith: '.page .story',
    placeholder: 'item-placeholder',
    forcePlaceholderSize: true,
    delay: 150
  };
  $story = $page.find('.story');
  originalOrder = null;
  originalIndex = null;
  dragCancelled = null;

  cancelDrag = function cancelDrag(e) {
    if (e.which === 27) {
      dragCancelled = true;
      return $story.sortable('cancel');
    }
  };

  return $story.sortable(options).on('sortstart', function (e, ui) {
    var $item;
    $item = ui.item;
    originalOrder = getStoryItemOrder($story);
    originalIndex = $('.item').index($item);
    dragCancelled = false;
    $('body').on('keydown', cancelDrag); // Create a copy that we control since sortable removes theirs too early.
    // Insert after the placeholder to prevent adding history when item not moved.
    // Clear out the styling they add. Updates to jquery ui can affect this.

    return $item.clone().insertAfter(ui.placeholder).hide().addClass("shadow-copy").css({
      width: '',
      height: '',
      position: '',
      zIndex: ''
    }).removeAttr('data-id');
  }).on('sort', changeMouseCursor).on('sortstop', function (e, ui) {
    $('body').css('cursor', origCursor).off('keydown', cancelDrag);

    if (!dragCancelled) {
      handleDrop(e, ui, originalIndex, originalOrder);
    }

    return $('.shadow-copy').remove();
  });
};

getPageObject = function getPageObject($journal) {
  var $page;
  $page = $($journal).parents('.page:first');
  return lineup.atKey($page.data('key'));
};

handleMerging = function handleMerging(event, ui) {
  var drag, drop;
  drag = getPageObject(ui.draggable);
  drop = getPageObject(event.target);
  return pageEmitter.emit('show', drop.merge(drag));
};

initMerging = function initMerging($page) {
  var $journal;
  $journal = $page.find('.journal');
  $journal.draggable({
    revert: true,
    appendTo: '.main',
    scroll: false,
    helper: 'clone'
  });
  return $journal.droppable({
    hoverClass: "ui-state-hover",
    drop: handleMerging,
    accept: '.journal'
  });
};

initAddButton = function initAddButton($page) {
  return $page.find(".add-factory").on("click", function (evt) {
    if ($page.hasClass('ghost')) {
      return;
    }

    evt.preventDefault();
    return createFactory($page);
  });
};

createFactory = function createFactory($page) {
  var $before, $item, before, item;
  item = {
    type: "factory",
    id: random.itemId()
  };
  $item = $("<div />", {
    "class": "item factory"
  }).data('item', item).attr('data-id', item.id);
  $item.data('pageElement', $page);
  $page.find(".story").append($item);
  plugin["do"]($item, item);
  $before = $item.prev('.item');
  before = getItem($before);
  return pageHandler.put($page, {
    item: item,
    id: item.id,
    type: "add",
    after: before != null ? before.id : void 0
  });
};

handleHeaderClick = function handleHeaderClick(e) {
  var $page, crumbs, each, newWindow, prefix, target;
  e.preventDefault();
  lineup.debugSelfCheck(function () {
    var j, len, ref, results;
    ref = $('.page');
    results = [];

    for (j = 0, len = ref.length; j < len; j++) {
      each = ref[j];
      results.push($(each).data('key'));
    }

    return results;
  }());
  $page = $(e.target).parents('.page:first');
  crumbs = lineup.crumbs($page.data('key'), location.host);
  var _crumbs = crumbs;

  var _crumbs2 = (0, _slicedToArray2["default"])(_crumbs, 1);

  target = _crumbs2[0];

  var _wiki$site$getDirectU = wiki.site(target).getDirectURL('').split('/');

  var _wiki$site$getDirectU2 = (0, _slicedToArray2["default"])(_wiki$site$getDirectU, 1);

  prefix = _wiki$site$getDirectU2[0];

  if (prefix === '') {
    prefix = window.location.protocol;
  }

  newWindow = window.open("".concat(prefix, "//").concat(crumbs.join('/')), target);
  return newWindow.focus();
};

emitHeader = function emitHeader($header, $page, pageObject) {
  var remote, tooltip;

  if (pageObject.isRecycler()) {
    remote = 'recycler';
  } else {
    remote = pageObject.getRemoteSite(location.host);
  }

  tooltip = pageObject.getRemoteSiteDetails(location.host);
  $header.append("<h1 title=\"".concat(tooltip, "\">\n  <span>\n    <a href=\"").concat(pageObject.siteLineup(), "\" target=\"").concat(remote, "\">\n      <img src=\"").concat(wiki.site(remote).flag(), "\" height=\"32px\" class=\"favicon\"></a>\n    ").concat(resolve.escape(pageObject.getTitle()), "\n  </span>\n</h1>"));
  return $header.find('a').on('click', handleHeaderClick);
};

emitTimestamp = function emitTimestamp($header, $page, pageObject) {
  if ($page.attr('id').match(/_rev/)) {
    $page.addClass('ghost');
    $page.data('rev', pageObject.getRevision());
    return $header.append($("<h2 class=\"revision\">\n  <span>\n    ".concat(pageObject.getTimestamp(), "\n  </span>\n</h2>")));
  }
};

emitControls = function emitControls($journal) {
  return $journal.append("<div class=\"control-buttons\">\n  <a href=\"#\" class=\"button fork-page\" title=\"fork this page\">".concat(actionSymbols.fork, "</a>\n  <a href=\"#\" class=\"button add-factory\" title=\"add paragraph\">").concat(actionSymbols.add, "</a>\n</div>"));
};

emitBacklinks = function emitBacklinks($backlinks, pageObject) {
  var backlink, backlinks, flags, i, j, joint, len, linkBack, linkSlug, links, ref, ref1, site, slug;
  slug = pageObject.getSlug();
  backlinks = neighborhood.backLinks(slug);

  if (Object.keys(backlinks).length > 0) {
    links = [];

    for (linkSlug in backlinks) {
      backlink = backlinks[linkSlug];
      backlink.sites.sort(function (a, b) {
        return (a.date || 0) < (b.date || 0);
      });
      flags = [];
      ref = backlink.sites;

      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        site = ref[i];

        if (i < 10) {
          joint = ((ref1 = backlink.sites[i - 1]) != null ? ref1.date : void 0) === site.date ? "" : " ";
          flags.unshift(joint);
          flags.unshift("<img class=\"remote\"\n    src=\"".concat(wiki.site(site.site).flag(), "\"\n    data-slug=\"").concat(linkSlug, "\"\n    data-site=\"").concat(site.site, "\"\n    data-id=\"").concat(site.itemId, "\"\n    title=\"").concat(site.site, "\n").concat(wiki.util.formatElapsedTime(site.date), "\">"));
        } else if (i === 10) {
          flags.unshift(' ⋯ ');
        }
      }

      linkBack = resolve.resolveLinks("[[".concat(backlink.title, "]]"));
      links.push("<div style=\"clear: both;\">\n  <div style=\"float: left;\">".concat(linkBack, "</div>\n  <div style=\"text-align: right;\"> ").concat(flags.join(''), " </div>\n</div>"));
    }

    if (links) {
      return $backlinks.append("<details>\n  <summary>".concat(links.length, " pages link here:</summary>\n  ").concat(links.join("\n"), "\n</details>"));
    }
  }
};

emitFooter = function emitFooter($footer, pageObject) {
  var host, slug;
  host = pageObject.getRemoteSite(location.host);
  slug = pageObject.getSlug();
  return $footer.append("<a class=\"show-page-license\" href=\"https://creativecommons.org/licenses/by-sa/4.0/\" target=\"_blank\">CC BY-SA 4.0</a> .\n<a class=\"show-page-source\" href=\"".concat(wiki.site(host).getDirectURL(slug), ".json\" title=\"source\">JSON</a> .\n<a href= \"").concat(wiki.site(host).getDirectURL(slug), ".html\" date-slug=\"").concat(slug, "\" target=\"").concat(host, "\">").concat(host, " </a> .\n<a href= \"#\" class=search>search</a>"));
};

editDate = function editDate(journal) {
  var action, j, ref;
  ref = journal || [];

  for (j = ref.length - 1; j >= 0; j += -1) {
    action = ref[j];

    if (action.date && action.type !== 'fork') {
      return action.date;
    }
  }

  return void 0;
};

emitTwins = function emitTwins($page) {
  var bin, bins, flags, i, info, item, j, legend, len, page, ref, ref1, remoteSite, site, slug, twins, viewing;
  page = $page.data('data');

  if (!page) {
    return;
  }

  site = $page.data('site') || window.location.host;

  if (site === 'view' || site === 'origin') {
    site = window.location.host;
  }

  slug = asSlug(page.title);

  if (viewing = editDate(page.journal)) {
    bins = {
      newer: [],
      same: [],
      older: []
    };
    ref = neighborhood.sites; // {fed.wiki.org: [{slug: "happenings", title: "Happenings", date: 1358975303000, synopsis: "Changes here ..."}]}

    for (remoteSite in ref) {
      info = ref[remoteSite];

      if (remoteSite !== site && info.sitemap != null) {
        ref1 = info.sitemap;

        for (j = 0, len = ref1.length; j < len; j++) {
          item = ref1[j];

          if (item.slug === slug) {
            bin = item.date > viewing ? bins.newer : item.date < viewing ? bins.older : bins.same;
            bin.push({
              remoteSite: remoteSite,
              item: item
            });
          }
        }
      }
    }

    twins = []; // {newer:[remoteSite: "fed.wiki.org", item: {slug: ..., date: ...}, ...]}

    for (legend in bins) {
      bin = bins[legend];

      if (!bin.length) {
        continue;
      }

      bin.sort(function (a, b) {
        return a.item.date < b.item.date;
      });

      flags = function () {
        var k, len1, results;
        results = [];

        for (i = k = 0, len1 = bin.length; k < len1; i = ++k) {
          var _bin$i = bin[i];
          remoteSite = _bin$i.remoteSite;
          item = _bin$i.item;

          if (i >= 8) {
            break;
          }

          results.push("<img class=\"remote\"\nsrc=\"".concat(wiki.site(remoteSite).flag(), "\"\ndata-slug=\"").concat(slug, "\"\ndata-site=\"").concat(remoteSite, "\"\ntitle=\"").concat(remoteSite, "\">"));
        }

        return results;
      }();

      twins.push("".concat(flags.join('&nbsp;'), " ").concat(legend));
    }

    if (twins) {
      return $page.find('.twins').html("<p><span>".concat(twins.join(", "), "</span></p>"));
    }
  }
};

renderPageIntoPageElement = function renderPageIntoPageElement(pageObject, $page) {
  var $backlinks, $footer, $handleParent, $header, $journal, $pagehandle, $paper, $story, $twins, each, promise;
  $page.data("data", pageObject.getRawPage());

  if (pageObject.isRemote()) {
    $page.data("site", pageObject.getRemoteSite());
  }

  console.log('.page keys ', function () {
    var j, len, ref, results;
    ref = $('.page');
    results = [];

    for (j = 0, len = ref.length; j < len; j++) {
      each = ref[j];
      results.push($(each).data('key'));
    }

    return results;
  }());
  console.log('lineup keys', lineup.debugKeys());
  resolve.resolutionContext = pageObject.getContext();
  $page.empty();
  $paper = $("<div class='paper' />");
  $page.append($paper);

  var _map = ['handle-parent', 'twins', 'header', 'story', 'backlinks', 'journal', 'footer'].map(function (className) {
    if (className !== 'journal' || $('.editEnable').is(':visible')) {
      return $('<div />').addClass(className).appendTo($paper);
    }
  });

  var _map2 = (0, _slicedToArray2["default"])(_map, 7);

  $handleParent = _map2[0];
  $twins = _map2[1];
  $header = _map2[2];
  $story = _map2[3];
  $backlinks = _map2[4];
  $journal = _map2[5];
  $footer = _map2[6];
  $pagehandle = $('<div />').addClass('page-handle').appendTo($handleParent);
  emitHeader($header, $page, pageObject);
  emitTimestamp($header, $page, pageObject);
  promise = pageObject.seqItems(function (item, done) {
    var $item;
    $item = $("<div class=\"item ".concat(item.type, "\" data-id=\"").concat(item.id, "\">"));
    $story.append($item);
    $item.data('item', item);
    return done();
  });
  promise = promise.then(function () {
    var index, itemIndex;
    index = $(".page").index($page[0]);
    itemIndex = $('.item').index($($('.page')[index]).find('.item'));
    return plugin.renderFrom(itemIndex);
  }).then(function () {
    return $page;
  });

  if ($('.editEnable').is(':visible')) {
    pageObject.seqActions(function (each, done) {
      if (each.separator) {
        addToJournal($journal, each.separator);
      }

      addToJournal($journal, each.action);
      return done();
    });
  }

  emitTwins($page);
  emitBacklinks($backlinks, pageObject);

  if ($('.editEnable').is(':visible')) {
    emitControls($journal);
  }

  emitFooter($footer, pageObject);
  $pagehandle.css({
    height: "".concat($story.position().top - $handleParent.position().top - 5, "px")
  });
  return promise;
};

createMissingFlag = function createMissingFlag($page, pageObject) {
  if (!pageObject.isRemote()) {
    return $('img.favicon', $page).on('error', function () {
      return plugin.get('favicon', function (favicon) {
        return favicon.create();
      });
    });
  }
};

rebuildPage = function rebuildPage(pageObject, $page) {
  var promise;

  if (pageObject.isLocal()) {
    $page.addClass('local');
  }

  if (pageObject.isRecycler()) {
    $page.addClass('recycler');
  }

  if (pageObject.isRemote()) {
    $page.addClass('remote');
  }

  if (pageObject.isPlugin()) {
    $page.addClass('plugin');
  }

  promise = renderPageIntoPageElement(pageObject, $page);
  createMissingFlag($page, pageObject); //STATE -- update url when adding new page, removing others

  state.setUrl();

  if ($('.editEnable').is(':visible')) {
    initDragging($page);
    initMerging($page);
    initAddButton($page);
  }

  return promise;
};

buildPage = function buildPage(pageObject, $page) {
  $page.data('key', lineup.addPage(pageObject));
  return rebuildPage(pageObject, $page);
};

newFuturePage = function newFuturePage(title, create) {
  var hit, hits, info, j, len, pageObject, ref, result, site, slug;
  slug = asSlug(title);
  pageObject = newPage();
  pageObject.setTitle(title);
  hits = [];
  ref = neighborhood.sites;

  for (site in ref) {
    info = ref[site];

    if (info.sitemap != null) {
      result = _.find(info.sitemap, function (each) {
        return each.slug === slug;
      });

      if (result != null) {
        hits.push({
          "type": "reference",
          "site": site,
          "slug": slug,
          "title": result.title || slug,
          "text": result.synopsis || ''
        });
      }
    }
  }

  if (hits.length > 0) {
    pageObject.addItem({
      'type': 'future',
      'text': 'We could not find this page in the expected context.',
      'title': title,
      'create': create
    });
    pageObject.addItem({
      'type': 'paragraph',
      'text': "We did find the page in your current neighborhood."
    });

    for (j = 0, len = hits.length; j < len; j++) {
      hit = hits[j];
      pageObject.addItem(hit);
    }
  } else {
    pageObject.addItem({
      'type': 'future',
      'text': 'We could not find this page.',
      'title': title,
      'create': create
    });
  }

  return pageObject;
};

cycle = function cycle($page) {
  var promise;
  promise = new Promise(function (resolve, _reject) {
    var pageInformation, rev, slug, title, whenGotten, whenNotGotten;

    var _$page$attr$split = $page.attr('id').split('_rev');

    var _$page$attr$split2 = (0, _slicedToArray2["default"])(_$page$attr$split, 2);

    slug = _$page$attr$split2[0];
    rev = _$page$attr$split2[1];
    title = $page.find('.header h1').text().trim();
    pageInformation = {
      slug: slug,
      rev: rev,
      site: $page.data('site')
    };

    whenNotGotten = function whenNotGotten() {
      var create, key, link, pageObject, ref;
      link = $("a.internal[href=\"/".concat(slug, ".html\"]:last"));
      title = title || link.text() || slug;
      key = link.parents('.page').data('key');
      create = (ref = lineup.atKey(key)) != null ? ref.getCreate() : void 0;
      pageObject = newFuturePage(title);
      promise = buildPage(pageObject, $page);
      promise.then(function ($page) {
        return $page.addClass('ghost');
      });
      return resolve(promise);
    };

    whenGotten = function whenGotten(pageObject) {
      var j, len, ref, site;
      promise = buildPage(pageObject, $page);
      ref = pageObject.getNeighbors(location.host);

      for (j = 0, len = ref.length; j < len; j++) {
        site = ref[j];
        neighborhood.registerNeighbor(site);
      }

      return resolve(promise);
    };

    return pageHandler.get({
      whenGotten: whenGotten,
      whenNotGotten: whenNotGotten,
      pageInformation: pageInformation
    });
  });
  return promise;
};

module.exports = {
  cycle: cycle,
  emitTwins: emitTwins,
  buildPage: buildPage,
  rebuildPage: rebuildPage,
  newFuturePage: newFuturePage
};

},{"./actionSymbols":2,"./addToJournal":4,"./lineup":15,"./neighborhood":17,"./page":19,"./pageHandler":20,"./plugin":22,"./random":24,"./resolve":27,"./state":33,"@babel/runtime/helpers/interopRequireDefault":40,"@babel/runtime/helpers/slicedToArray":43,"underscore":64}],27:[function(require,module,exports){
"use strict";

// The function resolveLinks converts link markup to html syntax.
// The html will have a search path (the resolutionContext) encoded
// into the title of <a> tags it generates.
var asSlug, escape, resolve;
asSlug = require('./page').asSlug;
module.exports = resolve = {};
resolve.resolutionContext = [];

resolve.escape = escape = function escape(string) {
  return (string || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

resolve.resolveFrom = function (addition, callback) {
  resolve.resolutionContext.push(addition);

  try {
    return callback();
  } finally {
    resolve.resolutionContext.pop();
  }
}; // resolveLinks takes a second argument which is a substitute text sanitizer.
// Plugins that do their own markup should insert themselves here but they
// must escape html as part of their processing. Sanitizers must pass markers〖12〗.


resolve.resolveLinks = function (string) {
  var sanitize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : escape;
  var external, internal, stash, stashed, unstash;
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

  internal = function internal(match, name) {
    var slug;
    slug = asSlug(name);

    if (slug.length) {
      return stash("<a class=\"internal\" href=\"/".concat(slug, ".html\" data-page-name=\"").concat(slug, "\" title=\"").concat(resolve.resolutionContext.join(' => '), "\">").concat(escape(name), "</a>"));
    } else {
      return match;
    }
  };

  external = function external(match, href, protocol, rest) {
    return stash("<a class=\"external\" target=\"_blank\" href=\"".concat(href, "\" title=\"").concat(href, "\" rel=\"nofollow\">").concat(escape(rest), " <img src=\"/images/external-link-ltr-icon.png\"></a>"));
  }; // markup conversion happens in four phases:
  //   - unexpected markers are adulterated
  //   - links are found, converted, and stashed away properly escaped
  //   - remaining text is sanitized and/or escaped
  //   - unique markers are replaced with unstashed links


  string = (string || '').replace(/〖(\d+)〗/g, "〖 $1 〗").replace(/\[\[([^\]]+)\]\]/gi, internal).replace(/\[((http|https|ftp):.*?) (.*?)\]/gi, external);
  return sanitize(string).replace(/〖(\d+)〗/g, unstash);
};

},{"./page":19}],28:[function(require,module,exports){
"use strict";

// This module interprets journal actions in order to update
// a story or even regenerate a complete story from some or
// all of a journal.
var apply, create;

apply = function apply(page, action) {
  var add, after, index, item, order, remove;

  order = function order() {
    var i, item, len, ref, results;
    ref = page.story || [];
    results = [];

    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      results.push(item != null ? item.id : void 0);
    }

    return results;
  };

  add = function add(after, item) {
    var index;
    index = order().indexOf(after) + 1;
    return page.story.splice(index, 0, item);
  };

  remove = function remove() {
    var index;

    if ((index = order().indexOf(action.id)) !== -1) {
      return page.story.splice(index, 1);
    }
  };

  page.story || (page.story = []);

  switch (action.type) {
    case 'create':
      if (action.item != null) {
        if (action.item.title != null) {
          page.title = action.item.title;
        }

        if (action.item.story != null) {
          page.story = action.item.story.slice();
        }
      }

      break;

    case 'add':
      add(action.after, action.item);
      break;

    case 'edit':
      if ((index = order().indexOf(action.id)) !== -1) {
        page.story.splice(index, 1, action.item);
      } else {
        page.story.push(action.item);
      }

      break;

    case 'move':
      // construct relative addresses from absolute order
      index = action.order.indexOf(action.id);
      after = action.order[index - 1];
      item = page.story[order().indexOf(action.id)];
      remove();
      add(after, item);
      break;

    case 'remove':
      remove();
  }

  page.journal || (page.journal = []);

  if (action.fork) {
    // implicit fork
    page.journal.push({
      type: 'fork',
      site: action.fork
    });
  }

  return page.journal.push(action);
};

create = function create(revIndex, data) {
  var action, i, len, revJournal, revPage;
  revIndex = +revIndex;
  revJournal = data.journal.slice(0, +revIndex + 1 || 9e9);
  revPage = {
    title: data.title,
    story: []
  };

  for (i = 0, len = revJournal.length; i < len; i++) {
    action = revJournal[i];
    apply(revPage, action || {});
  }

  return revPage;
};

module.exports = {
  create: create,
  apply: apply
};

},{}],29:[function(require,module,exports){
"use strict";

// The search module invokes neighborhood's query function,
// formats the results as story items, and then opens a
// page to present them.
var active, createSearch, emit, escapeRegExp, finishClick, link, newPage, page, pageHandler, random, resolve;
pageHandler = require('./pageHandler');
random = require('./random');
link = require('./link');
active = require('./active');
newPage = require('./page').newPage;
resolve = require('./resolve');
page = require('./page'); // from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

escapeRegExp = function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}; // From reference.coffee


emit = function emit($item, item) {
  var site, slug;
  slug = item.slug;

  if (item.title != null) {
    slug || (slug = page.asSlug(item.title));
  }

  slug || (slug = 'welcome-visitors');
  site = item.site;
  return resolve.resolveFrom(site, function () {
    return $item.append("<p>\n  <img class='remote'\n    src='".concat(wiki.site(site).flag(), "'\n    title='").concat(site, "'\n    data-site=\"").concat(site, "\"\n    data-slug=\"").concat(slug, "\"\n  >\n  ").concat(resolve.resolveLinks("[[".concat(item.title || slug, "]]")), "\n  \u2014\n  ").concat(resolve.resolveLinks(item.text), "\n</p>"));
  });
};

finishClick = function finishClick(e, name) {
  e.preventDefault();

  if (!e.shiftKey) {
    page = $(e.target).parents('.page');
  }

  link.doInternalLink(name, page, $(e.target).data('site'));
  return false;
};

createSearch = function createSearch(_ref) {
  var neighborhood = _ref.neighborhood;
  var incrementalSearch, performSearch;

  incrementalSearch = function incrementalSearch(searchQuery) {
    var $item, $search, count, highlightText, i, item, len, max_results, offset, ref, result, results, searchHighlightRegExp, searchResults, searchTerms;

    if (searchQuery.length < 2) {
      $('.incremental-search').remove();
      return;
    }

    if ($('.incremental-search').length === 0) {
      offset = $('.searchbox').position();
      $('<div/>').css('left', "".concat(offset.left, "px")).css('bottom', "".concat(offset.top + $('.searchbox').height(), "px")).addClass('incremental-search').delegate('.internal', 'click', function (e) {
        var name;

        if (e.target.nodeName === 'SPAN') {
          e.target = $(e.target).parent()[0];
        }

        name = $(e.target).data('pageName'); // ensure that name is a string (using string interpolation)

        name = "".concat(name);
        pageHandler.context = $(e.target).attr('title').split(' => ');
        return finishClick(e, name);
      }).delegate('img.remote', 'click', function (e) {
        var name, site; // expand to handle click on temporary flag

        if ($(e.target).attr('src').startsWith('data:image/png')) {
          e.preventDefault();
          site = $(e.target).data('site');
          return wiki.site(site).refresh(function () {});
        } else {
          // empty function...
          name = $(e.target).data('slug');
          pageHandler.context = [$(e.target).data('site')];
          return finishClick(e, name);
        }
      }).appendTo($('.searchbox'));
    }

    searchResults = neighborhood.search(searchQuery);
    searchTerms = searchQuery.split(' ').map(function (t) {
      return t.toLowerCase();
    }).filter(String);
    searchHighlightRegExp = new RegExp("\\b(" + searchQuery.split(' ').map(function (t) {
      return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).filter(String).join('|') + ")", 'i');

    highlightText = function highlightText(text) {
      return text.split(searchHighlightRegExp).map(function (p) {
        if (searchTerms.includes(p.toLowerCase())) {
          return "{{".concat(p, "}}");
        } else {
          return p;
        }
      }).join('');
    };

    $search = $('.incremental-search').empty();

    if (!searchResults.finds || searchResults.finds.length === 0) {
      $('<div/>').text('No results found').addClass('no-results').appendTo($search);
    }

    count = 0;
    max_results = 100;
    ref = searchResults.finds;
    results = [];

    for (i = 0, len = ref.length; i < len; i++) {
      result = ref[i];
      count += 1;

      if (count === max_results + 1) {
        $('<div/>').text("".concat(searchResults.finds.length - max_results, " results omitted")).addClass('omitted-results').appendTo($search);
      }

      if (count > max_results) {
        continue;
      }

      $item = $('<div/>').appendTo($search);
      item = {
        id: random.itemId(),
        type: "reference",
        site: result.site,
        slug: result.page.slug,
        title: highlightText(result.page.title),
        text: highlightText(result.page.synopsis)
      };
      emit($item, item);
      results.push($item.html($item.html().split(new RegExp("(\{\{.*?\}\})", 'i')).map(function (p) {
        if (p.indexOf('{{') === 0) {
          return "<span class='search-term'>".concat(p.substring(2, p.length - 2), "</span>");
        } else {
          return p;
        }
      }).join('')));
    }

    return results;
  };

  performSearch = function performSearch(searchQuery) {
    var i, len, ref, result, resultPage, searchResults, tally;
    searchResults = neighborhood.search(searchQuery);

    if (searchResults.finds && searchResults.finds.length === 1) {
      $('.incremental-search').find('.internal').click();
      $('.incremental-search').remove();
      return;
    }

    $('.incremental-search').remove();
    tally = searchResults.tally;
    resultPage = newPage();
    resultPage.setTitle("Search for '".concat(searchQuery, "'"));
    resultPage.addParagraph("String '".concat(searchQuery, "' found on ").concat(tally.finds || 'none', " of ").concat(tally.pages || 'no', " pages from ").concat(tally.sites || 'no', " sites.\nText matched on ").concat(tally.title || 'no', " titles, ").concat(tally.text || 'no', " paragraphs, and ").concat(tally.slug || 'no', " slugs.\nElapsed time ").concat(tally.msec, " milliseconds."));
    ref = searchResults.finds;

    for (i = 0, len = ref.length; i < len; i++) {
      result = ref[i];
      resultPage.addItem({
        "type": "reference",
        "site": result.site,
        "slug": result.page.slug,
        "title": result.page.title,
        "text": result.page.synopsis || ''
      });
    }

    return link.showResult(resultPage);
  };

  return {
    incrementalSearch: incrementalSearch,
    performSearch: performSearch
  };
};

module.exports = createSearch;

},{"./active":3,"./link":16,"./page":19,"./pageHandler":20,"./random":24,"./resolve":27}],30:[function(require,module,exports){
"use strict";

// Handle input events from the search box. There is machinery
// here that anticipates incremental search that is yet to be coded.
// We use dependency injection to break dependency loops.
var bind, createSearch, inject, search;
createSearch = require('./search');
search = null;

inject = function inject(neighborhood) {
  return search = createSearch({
    neighborhood: neighborhood
  });
};

bind = function bind() {
  $('input.search').attr('autocomplete', 'off');
  $('input.search').on('keydown', function (e) {
    if (e.keyCode === 27) {
      return $('.incremental-search').remove();
    }
  });
  $('input.search').on('keypress', function (e) {
    var searchQuery;

    if (e.keyCode !== 13) {
      // 13 == return
      return;
    }

    searchQuery = $(this).val();
    search.performSearch(searchQuery);
    return $(this).val("");
  });
  $('input.search').on('focus', function (e) {
    var searchQuery;
    searchQuery = $(this).val();
    return search.incrementalSearch(searchQuery);
  });
  return $('input.search').on('input', function (e) {
    var searchQuery;
    searchQuery = $(this).val();
    return search.incrementalSearch(searchQuery);
  });
};

module.exports = {
  inject: inject,
  bind: bind
};

},{"./search":29}],31:[function(require,module,exports){
"use strict";

var plugin, security;
module.exports = security = {}; // make use of plugin getScript to load the security plugin's client code

plugin = require('./plugin');

module.exports = function (user) {
  return plugin.getScript("/security/security.js", function () {
    return window.plugins.security.setup(user);
  });
};

},{"./plugin":22}],32:[function(require,module,exports){
"use strict";

// The siteAdapter handles fetching resources from sites, including origin
// and local browser storage.
var credentialsNeeded, fetchTimeoutMS, findAdapter, findAdapterQ, findQueueWorkers, localForage, queue, routeStore, siteAdapter, sitePrefix, tempFlags, testWikiSite, withCredsStore;
queue = require('async/queue');
localForage = require('localforage');
module.exports = siteAdapter = {}; // we save the site prefix once we have determined it,

sitePrefix = {}; // and if the CORS request requires credentials...

credentialsNeeded = {}; // when asked for a site's flag, if we don't know the current prefix we create
// a temporary greyscale flag. We save them here, so we can replace them when
// we know how to get a site's flag

tempFlags = {}; // some settings

fetchTimeoutMS = 3000;
findQueueWorkers = 8;
console.log("siteAdapter: loading data");
routeStore = localForage.createInstance({
  name: "routes"
});
routeStore.iterate(function (value, key, iterationNumber) {
  sitePrefix[key] = value;
}).then(function () {
  return console.log("siteAdapter: data loaded");
})["catch"](function (err) {
  return console.log("siteAdapter: error loading data ", err);
});
withCredsStore = localForage.createInstance({
  name: "withCredentials"
});
withCredsStore.iterate(function (value, key, iterationNumber) {
  credentialsNeeded[key] = value;
}).then(function () {
  return console.log("siteAdapter: withCredentials data loaded");
})["catch"](function (err) {
  return console.log("siteAdapter: error loading withCredentials data ", err);
});

testWikiSite = function testWikiSite(url, good, bad) {
  var fetchTimeout, fetchURL, testRace;
  fetchTimeout = new Promise(function (resolve, reject) {
    var id;
    return id = setTimeout(function () {
      clearTimeout(id);
      return reject();
    }, fetchTimeoutMS);
  });
  fetchURL = new Promise(function (resolve, reject) {
    return $.ajax({
      type: 'GET',
      url: url,
      success: function success() {
        return resolve();
      },
      error: function error() {
        return reject();
      }
    });
  });
  return testRace = Promise.race([fetchTimeout, fetchURL]).then(function () {
    return good();
  })["catch"](function () {
    return bad();
  });
};

findAdapterQ = queue(function (task, done) {
  var site, testURL;
  site = task.site;

  if (sitePrefix[site] != null) {
    done(sitePrefix[site]);
  }

  testURL = "//".concat(site, "/favicon.png");
  return testWikiSite(testURL, function () {
    sitePrefix[site] = "//".concat(site);
    return done("//".concat(site));
  }, function () {
    switch (location.protocol) {
      case 'http:':
        testURL = "https://".concat(site, "/favicon.png");
        return testWikiSite(testURL, function () {
          sitePrefix[site] = "https://".concat(site);
          return done("https://".concat(site));
        }, function () {
          sitePrefix[site] = "";
          return done("");
        });

      case 'https:':
        testURL = "/proxy/".concat(site, "/favicon.png");
        return testWikiSite(testURL, function () {
          sitePrefix[site] = "/proxy/".concat(site);
          return done("/proxy/".concat(site));
        }, function () {
          sitePrefix[site] = "";
          return done("");
        });

      default:
        sitePrefix[site] = "";
        return done("");
    }
  });
}, findQueueWorkers); // start with just 1 process working on the queue

findAdapter = function findAdapter(site, done) {
  return routeStore.getItem(site).then(function (value) {
    console.log("findAdapter: ", site, value);

    if (value == null) {
      return findAdapterQ.push({
        site: site
      }, function (prefix) {
        sitePrefix[site] = prefix;
        return routeStore.setItem(site, prefix).then(function (value) {
          return done(prefix);
        })["catch"](function (err) {
          console.log("findAdapter setItem error: ", site, err);
          return done(prefix);
        });
      });
    } else {
      sitePrefix[site] = value;
      return done(value);
    }
  })["catch"](function (err) {
    console.log("findAdapter error: ", site, err);
    sitePrefix[site] = "";
    return done("");
  });
};

siteAdapter.local = {
  flag: function flag() {
    return "/favicon.png";
  },
  getURL: function getURL(route) {
    return "/".concat(route);
  },
  getDirectURL: function getDirectURL(route) {
    return "/".concat(route);
  },
  get: function get(route, callback) {
    var done, errMsg, page, parsedPage;

    done = function done(err, value) {
      if (callback) {
        return callback(err, value);
      }
    };

    console.log("wiki.local.get ".concat(route));

    if (page = localStorage.getItem(route.replace(/\.json$/, ''))) {
      parsedPage = JSON.parse(page);
      done(null, parsedPage);

      if (!callback) {
        return Promise.resolve(parsedPage);
      }
    } else {
      errMsg = {
        msg: "no page named '".concat(route, "' in browser local storage")
      };
      done(errMsg, null);
      console.log("tried to local fetch a page that isn't local");

      if (!callback) {
        return Promise.reject(errMsg);
      }
    }
  },
  put: function put(route, data, done) {
    console.log("wiki.local.put ".concat(route));
    localStorage.setItem(route, JSON.stringify(data));
    return done();
  },
  "delete": function _delete(route) {
    console.log("wiki.local.delete ".concat(route));
    return localStorage.removeItem(route);
  }
};
siteAdapter.origin = {
  flag: function flag() {
    return "/favicon.png";
  },
  getURL: function getURL(route) {
    return "/".concat(route);
  },
  getDirectURL: function getDirectURL(route) {
    return "/".concat(route);
  },
  get: function get(route, callback) {
    var done;

    done = function done(err, value) {
      if (callback) {
        return callback(err, value);
      }
    };

    console.log("wiki.origin.get ".concat(route));
    return $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "/".concat(route),
      success: function success(page) {
        return done(null, page);
      },
      error: function error(xhr, type, msg) {
        return done({
          msg: msg,
          xhr: xhr
        }, null);
      }
    });
  },
  getIndex: function getIndex(route, callback) {
    var done;

    done = function done(err, value) {
      if (callback) {
        return callback(err, value);
      }
    };

    console.log("wiki.origin.get ".concat(route));
    return $.ajax({
      type: 'GET',
      dataType: 'text',
      url: "/".concat(route),
      success: function success(page) {
        return done(null, page);
      },
      error: function error(xhr, type, msg) {
        return done({
          msg: msg,
          xhr: xhr
        }, null);
      }
    });
  },
  put: function put(route, data, done) {
    console.log("wiki.orgin.put ".concat(route));
    return $.ajax({
      type: 'PUT',
      url: "/page/".concat(route, "/action"),
      data: {
        'action': JSON.stringify(data)
      },
      success: function success() {
        return done(null);
      },
      error: function error(xhr, type, msg) {
        return done({
          xhr: xhr,
          type: type,
          msg: msg
        });
      }
    });
  },
  "delete": function _delete(route, done) {
    console.log("wiki.origin.delete ".concat(route));
    return $.ajax({
      type: 'DELETE',
      url: "/".concat(route),
      success: function success() {
        return done(null);
      },
      error: function error(xhr, type, msg) {
        return done({
          xhr: xhr,
          type: type,
          msg: msg
        });
      }
    });
  }
};
siteAdapter.recycler = {
  flag: function flag() {
    return "/recycler/favicon.png";
  },
  getURL: function getURL(route) {
    return "/recycler/".concat(route);
  },
  getDirectURL: function getDirectURL(route) {
    return "/recycler/".concat(route);
  },
  get: function get(route, callback) {
    var done;

    done = function done(err, value) {
      if (callback) {
        return callback(err, value);
      }
    };

    console.log("wiki.recycler.get ".concat(route));
    return $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "/recycler/".concat(route),
      success: function success(page) {
        return done(null, page);
      },
      error: function error(xhr, type, msg) {
        return done({
          msg: msg,
          xhr: xhr
        }, null);
      }
    });
  },
  "delete": function _delete(route, done) {
    console.log("wiki.recycler.delete ".concat(route));
    return $.ajax({
      type: 'DELETE',
      url: "/recycler/".concat(route),
      success: function success() {
        return done(null);
      },
      error: function error(xhr, type, msg) {
        return done({
          xhr: xhr,
          type: type,
          msg: msg
        });
      }
    });
  }
};

siteAdapter.site = function (site) {
  var createTempFlag;

  if (!site || site === window.location.host) {
    return siteAdapter.origin;
  }

  if (site === 'recycler') {
    return siteAdapter.recycler;
  }

  createTempFlag = function createTempFlag(site) {
    var c1, c2, color1, color2, ctx, gradient, myCanvas, x1, x2, y1, y2;
    console.log("creating temp flag for ".concat(site));
    myCanvas = document.createElement('canvas');
    myCanvas.width = 32;
    myCanvas.height = 32;
    ctx = myCanvas.getContext('2d');
    x1 = Math.random() * 32;
    y1 = x1;
    y2 = Math.random() * 32;
    x2 = 32 - y2;
    c1 = (Math.random() * 0xFF << 0).toString(16);
    c2 = (Math.random() * 0xFF << 0).toString(16);
    color1 = '#' + c1 + c1 + c1;
    color2 = '#' + c2 + c2 + c2;
    gradient = ctx.createRadialGradient(x1, y1, 32, x2, y2, 0);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    return myCanvas.toDataURL();
  };

  return {
    flag: function flag() {
      var tempFlag;

      if (sitePrefix[site] != null) {
        if (sitePrefix[site] === "") {
          if (tempFlags[site] != null) {
            return tempFlags[site];
          } else {
            return tempFlags[site] = createTempFlag(site);
          }
        } else {
          // we already know how to construct flag url
          return sitePrefix[site] + "/favicon.png";
        }
      } else if (tempFlags[site] != null) {
        // we already have a temp. flag
        return tempFlags[site];
      } else {
        // we don't know the url to the real flag, or have a temp flag
        //        findAdapterQ.push {site: site}, (prefix) ->
        findAdapter(site, function (prefix) {
          var realFlag, tempFlag;

          if (prefix === "") {
            return console.log("Prefix for ".concat(site, " is undetermined..."));
          } else {
            console.log("Prefix for ".concat(site, " is ").concat(prefix)); // replace temp flags

            tempFlag = tempFlags[site];
            realFlag = sitePrefix[site] + "/favicon.png"; // replace temporary flag where it is used as an image

            $('img[src="' + tempFlag + '"]').attr('src', realFlag); // replace temporary flag where its used as a background to fork event in journal

            $('a[target="' + site + '"]').attr('style', 'background-image: url(' + realFlag + ')');
            return tempFlags[site] = null;
          }
        }); // create a temp flag, save it for reuse, and return it

        tempFlag = createTempFlag(site);
        tempFlags[site] = tempFlag;
        return tempFlag;
      }
    },
    getURL: function getURL(route) {
      if (sitePrefix[site] != null) {
        if (sitePrefix[site] === "") {
          console.log("".concat(site, " is unreachable, can't link to ").concat(route));
          return "";
        } else {
          return "".concat(sitePrefix[site], "/").concat(route);
        }
      } else {
        // don't yet know how to construct links for site, so find how and fixup
        //findAdapterQ.push {site: site}, (prefix) ->
        findAdapter(site, function (prefix) {
          if (prefix === "") {
            return console.log("".concat(site, " is unreachable"));
          } else {
            console.log("Prefix for ".concat(site, " is ").concat(prefix, ", about to fixup links")); // add href to journal fork

            return $('a[target="' + site + '"]').each(function () {
              var thisPrefix, thisSite;

              if (/proxy/.test(prefix)) {
                thisSite = prefix.substring(7);
                thisPrefix = "http://".concat(thisSite);
              } else {
                thisPrefix = prefix;
              }

              return $(this).attr('href', "".concat(thisPrefix, "/").concat($(this).data("slug"), ".html"));
            });
          }
        });
        return "";
      }
    },
    getDirectURL: function getDirectURL(route) {
      var thisPrefix, thisSite;

      if (sitePrefix[site] != null) {
        if (sitePrefix[site] === "") {
          console.log("".concat(site, " is unreachable, can't link to ").concat(route));
          return "";
        } else {
          if (/proxy/.test(sitePrefix[site])) {
            thisSite = sitePrefix[site].substring(7);
            thisPrefix = "http://".concat(thisSite);
          } else {
            thisPrefix = sitePrefix[site];
          }

          return "".concat(thisPrefix, "/").concat(route);
        }
      } else {
        findAdapter(site, function (prefix) {
          if (prefix === "") {
            return console.log("".concat(site, " is unreachable"));
          } else {
            console.log("Prefix for ".concat(site, " is ").concat(prefix, ", about to fixup links")); // add href to journal fork

            return $('a[target="' + site + '"]').each(function () {
              if (/proxy/.test(prefix)) {
                thisSite = prefix.substring(7);
                thisPrefix = "http://".concat(thisSite);
              } else {
                thisPrefix = prefix;
              }

              return $(this).attr('href', "".concat(thisPrefix, "/").concat($(this).data("slug"), ".html"));
            });
          }
        });
        return "";
      }
    },
    get: function get(route, callback) {
      var done, errMsg, _getContent;

      done = function done(err, value) {
        if (callback) {
          return callback(err, value);
        }
      };

      _getContent = function getContent(route, done) {
        var url, useCredentials;
        url = "".concat(sitePrefix[site], "/").concat(route);
        useCredentials = credentialsNeeded[site] || false;
        return $.ajax({
          type: 'GET',
          dataType: 'json',
          url: url,
          xhrFields: {
            withCredentials: useCredentials
          },
          success: function success(data) {
            if (data.title === 'Login Required' && !url.includes('login-required') && credentialsNeeded[site] !== true) {
              credentialsNeeded[site] = true;
              return _getContent(route, function (err, page) {
                if (!err) {
                  withCredsStore.setItem(site, true);
                  return done(err, page);
                } else {
                  credentialsNeeded[site] = false;
                  return done(err, page);
                }
              });
            } else {
              done(null, data);

              if (!callback) {
                return Promise.resolve(data);
              }
            }
          },
          error: function error(xhr, type, msg) {
            done({
              msg: msg,
              xhr: xhr
            }, null);

            if (!callback) {
              return Promise.reject(msg);
            }
          }
        });
      };

      if (sitePrefix[site] != null) {
        if (sitePrefix[site] === "") {
          console.log("".concat(site, " is unreachable"));
          errMsg = {
            msg: "".concat(site, " is unreachable"),
            xhr: {
              status: 0
            }
          };
          done(errMsg, null);

          if (!callback) {
            return Promise.reject(errMsg);
          }
        } else {
          return _getContent(route, done);
        }
      } else {
        //findAdapterQ.push {site: site}, (prefix) ->
        return findAdapter(site, function (prefix) {
          if (prefix === "") {
            console.log("".concat(site, " is unreachable"));
            errMsg = {
              msg: "".concat(site, " is unreachable"),
              xhr: {
                status: 0
              }
            };
            done(errMsg, null);

            if (!callback) {
              return Promise.reject(errMsg);
            }
          } else {
            return _getContent(route, done);
          }
        });
      }
    },
    getIndex: function getIndex(route, callback) {
      var done, errMsg, _getContent2; // used for getting the serialized JSON file used by minisearch, needs to be a text string rather than an object.
      // This only differs from `get` by using dataType of text, rather than json.


      done = function done(err, value) {
        if (callback) {
          return callback(err, value);
        }
      };

      _getContent2 = function getContent(route, done) {
        var url, useCredentials;
        url = "".concat(sitePrefix[site], "/").concat(route);
        useCredentials = credentialsNeeded[site] || false;
        return $.ajax({
          type: 'GET',
          dataType: 'text',
          url: url,
          xhrFields: {
            withCredentials: useCredentials
          },
          success: function success(data) {
            if (data.title === 'Login Required' && !url.includes('login-required') && credentialsNeeded[site] !== true) {
              credentialsNeeded[site] = true;
              return _getContent2(route, function (err, page) {
                if (!err) {
                  withCredsStore.setItem(site, true);
                  return done(err, page);
                } else {
                  credentialsNeeded[site] = false;
                  return done(err, page);
                }
              });
            } else {
              done(null, data);

              if (!callback) {
                return Promise.resolve(data);
              }
            }
          },
          error: function error(xhr, type, msg) {
            done({
              msg: msg,
              xhr: xhr
            }, null);

            if (!callback) {
              return Promise.reject(msg);
            }
          }
        });
      };

      if (sitePrefix[site] != null) {
        if (sitePrefix[site] === "") {
          console.log("".concat(site, " is unreachable"));
          errMsg = {
            msg: "".concat(site, " is unreachable"),
            xhr: {
              status: 0
            }
          };
          done(errMsg, null);

          if (!callback) {
            return Promise.reject(errMsg);
          }
        } else {
          return _getContent2(route, done);
        }
      } else {
        //findAdapterQ.push {site: site}, (prefix) ->
        return findAdapter(site, function (prefix) {
          if (prefix === "") {
            console.log("".concat(site, " is unreachable"));
            errMsg = {
              msg: "".concat(site, " is unreachable"),
              xhr: {
                status: 0
              }
            };
            done(errMsg, null);

            if (!callback) {
              return Promise.reject(errMsg);
            }
          } else {
            return _getContent2(route, done);
          }
        });
      }
    },
    refresh: function refresh(done) {
      var realFlag, tempFlag; // Refresh is used to redetermine the sitePrefix prefix, and update the
      // stored value.

      console.log("Refreshing ".concat(site));

      if (tempFlags[site] == null) {
        // refreshing route for a site that we know the route for...
        // currently performed when clicking on a neighbor that we
        // can't retrieve a sitemap for.
        // replace flag with temp flags
        tempFlag = createTempFlag(site);
        tempFlags[site] = tempFlag;
        realFlag = sitePrefix[site] + "/favicon.png"; // replace flag with temporary flag where it is used as an image

        $('img[src="' + realFlag + '"]').attr('src', tempFlag); // replace temporary flag where its used as a background to fork event in journal

        $('a[target="' + site + '"]').attr('style', 'background-image: url(' + tempFlag + ')');
      }

      sitePrefix[site] = null;
      return routeStore.removeItem(site).then(function () {
        return findAdapterQ.push({
          site: site
        }, function (prefix) {
          return routeStore.setItem(site, prefix).then(function (value) {
            if (prefix === "") {
              console.log("Refreshed prefix for ".concat(site, " is undetermined..."));
            } else {
              console.log("Refreshed prefix for ".concat(site, " is ").concat(prefix)); // replace temp flags

              tempFlag = tempFlags[site];
              realFlag = sitePrefix[site] + "/favicon.png"; // replace temporary flag where it is used as an image

              $('img[src="' + tempFlag + '"]').attr('src', realFlag); // replace temporary flag where its used as a background to fork event in journal

              $('a[target="' + site + '"]').attr('style', 'background-image: url(' + realFlag + ')');
            }

            return done();
          })["catch"](function (err) {
            console.log("findAdapter setItem error: ", site, err);
            sitePrefix[site] = "";
            return done();
          });
        });
      })["catch"](function (err) {
        console.log('refresh error ', site, err);
        return done();
      });
    }
  };
}; // same as if delete worked?

},{"async/queue":52,"localforage":62}],33:[function(require,module,exports){
"use strict";

// The state module saves the .page lineup in the browser's location
// bar and history. It also reconstructs that state when the browser
// notifies us that the user has changed this sequence.
var active,
    lineup,
    link,
    state,
    indexOf = [].indexOf;
active = require('./active');
lineup = require('./lineup');
link = null;
module.exports = state = {}; // FUNCTIONS and HANDLERS to manage location bar and back button

state.inject = function (link_) {
  return link = link_;
};

state.pagesInDom = function () {
  return $.makeArray($(".page").map(function (_, el) {
    return el.id;
  }));
};

state.urlPages = function () {
  var i;
  return function () {
    var k, len, ref, results;
    ref = $(location).attr('pathname').split('/');
    results = [];

    for (k = 0, len = ref.length; k < len; k += 2) {
      i = ref[k];
      results.push(i);
    }

    return results;
  }().slice(1);
};

state.locsInDom = function () {
  return $.makeArray($(".page").map(function (_, el) {
    return $(el).data('site') || 'view';
  }));
};

state.urlLocs = function () {
  var j, k, len, ref, results;
  ref = $(location).attr('pathname').split('/').slice(1);
  results = [];

  for (k = 0, len = ref.length; k < len; k += 2) {
    j = ref[k];
    results.push(j);
  }

  return results;
};

state.setUrl = function () {
  var idx, locs, page, pages, url;
  document.title = lineup.bestTitle();

  if (history && history.pushState) {
    locs = state.locsInDom();
    pages = state.pagesInDom();

    url = function () {
      var k, len, results;
      results = [];

      for (idx = k = 0, len = pages.length; k < len; idx = ++k) {
        page = pages[idx];
        results.push("/".concat((locs != null ? locs[idx] : void 0) || 'view', "/").concat(page));
      }

      return results;
    }().join('');

    if (url !== $(location).attr('pathname')) {
      return history.pushState(null, null, url);
    }
  }
};

state.debugStates = function () {
  var each;
  console.log('a .page keys ', function () {
    var k, len, ref, results;
    ref = $('.page');
    results = [];

    for (k = 0, len = ref.length; k < len; k++) {
      each = ref[k];
      results.push($(each).data('key'));
    }

    return results;
  }());
  return console.log('a lineup keys', lineup.debugKeys());
};

state.show = function (e) {
  var idx, k, l, len, len1, matching, name, newLocs, newPages, old, oldLocs, oldPages;
  oldPages = state.pagesInDom();
  newPages = state.urlPages();
  oldLocs = state.locsInDom();
  newLocs = state.urlLocs();

  if (!location.pathname || location.pathname === '/') {
    return;
  }

  matching = true;

  for (idx = k = 0, len = oldPages.length; k < len; idx = ++k) {
    name = oldPages[idx];

    if (matching && (matching = name === newPages[idx])) {
      continue;
    }

    old = $('.page:last');
    lineup.removeKey(old.data('key'));
    old.remove();
  }

  matching = true;

  for (idx = l = 0, len1 = newPages.length; l < len1; idx = ++l) {
    name = newPages[idx];

    if (matching && (matching = name === oldPages[idx])) {
      continue;
    }

    console.log('push', idx, name);
    link.showPage(name, newLocs[idx]);
  }

  state.debugStates();
  active.set($('.page').last());
  return document.title = lineup.bestTitle();
};

state.first = function () {
  var firstUrlLocs, firstUrlPages, idx, k, len, oldPages, results, urlPage;
  state.setUrl();
  firstUrlPages = state.urlPages();
  firstUrlLocs = state.urlLocs();
  oldPages = state.pagesInDom();
  results = [];

  for (idx = k = 0, len = firstUrlPages.length; k < len; idx = ++k) {
    urlPage = firstUrlPages[idx];

    if (indexOf.call(oldPages, urlPage) < 0) {
      if (urlPage !== '') {
        results.push(link.createPage(urlPage, firstUrlLocs[idx]));
      } else {
        results.push(void 0);
      }
    }
  }

  return results;
};

},{"./active":3,"./lineup":15}],34:[function(require,module,exports){
"use strict";

// The synopsis module extracts a summary from the json derrived
// representation of a page. This might be from a "synopsys:" field,
// but more likely it comes from text found in the first or second item.
module.exports = function (page) {
  var p1, p2, synopsis;
  synopsis = page.synopsis;

  if (page != null && page.story != null) {
    p1 = page.story[0];
    p2 = page.story[1];

    if (p1 && p1.type === 'paragraph') {
      synopsis || (synopsis = p1.text);
    }

    if (p2 && p2.type === 'paragraph') {
      synopsis || (synopsis = p2.text);
    }

    if (p1 && p1.text != null) {
      synopsis || (synopsis = p1.text);
    }

    if (p2 && p2.text != null) {
      synopsis || (synopsis = p2.text);
    }

    synopsis || (synopsis = page.story != null && "A page with ".concat(page.story.length, " items."));
  } else {
    synopsis = 'A page with no story.';
  } // discard anything after the first line break, after trimming any at beginning


  synopsis = synopsis.trim().split(/\r|\n/, 1)[0];
  return synopsis.substring(0, 560);
};

},{}],35:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

// Target handles hovers over items and actions. Other visible
// items and actions with the same id will highlight. In some cases
// an event is generated inviting other pages to scroll the item
// into view. Target tracks hovering even when not requested so
// that highlighting can be immediate when requested.
var action, alignItem, bind, consumed, enterAction, enterBacklink, enterItem, item, itemElem, itemFor, leaveAction, leaveBacklink, leaveItem, pageFor, startTargeting, stopTargeting, targeting;
targeting = false;
item = null;
itemElem = null;
action = null;
consumed = null;

bind = function bind() {
  $(document).keydown(function (e) {
    if (e.keyCode === 16) {
      return startTargeting(e);
    }
  }).keyup(function (e) {
    if (e.keyCode === 16) {
      return stopTargeting(e);
    }
  });
  return $('.main').delegate('.item', 'mouseenter', enterItem).delegate('.item', 'mouseleave', leaveItem).delegate('.action', 'mouseenter', enterAction).delegate('.action', 'mouseleave', leaveAction).delegate('.page', 'align-item', alignItem).delegate('.backlinks .remote', 'mouseenter', enterBacklink).delegate('.backlinks .remote', 'mouseleave', leaveBacklink);
};

startTargeting = function startTargeting(e) {
  var id;
  targeting = e.shiftKey;

  if (targeting) {
    $('.emit').addClass('highlight');

    if (id = item || action) {
      $("[data-id=".concat(id, "]")).addClass('target');
    }

    if (itemElem) {
      consumed = itemElem.consuming;

      if (consumed) {
        return consumed.forEach(function (i) {
          return itemFor(i).addClass('consumed');
        });
      }
    }
  }
};

stopTargeting = function stopTargeting(e) {
  targeting = e.shiftKey;

  if (!targeting) {
    $('.emit').removeClass('highlight');
    $('.item, .action').removeClass('target');
    return $('.item').removeClass('consumed');
  }
};

pageFor = function pageFor(pageKey) {
  var $page;
  $page = $('.page').filter(function (_i, page) {
    return $(page).data('key') === pageKey;
  });

  if ($page.length === 0) {
    return null;
  }

  if ($page.length > 1) {
    console.log('warning: more than one page found for', key, $page);
  }

  return $page;
};

itemFor = function itemFor(pageItem) {
  var $item, $page, _item, pageKey;

  var _pageItem$split = pageItem.split('/');

  var _pageItem$split2 = (0, _slicedToArray2["default"])(_pageItem$split, 2);

  pageKey = _pageItem$split2[0];
  _item = _pageItem$split2[1];
  $page = pageFor(pageKey);

  if (!$page) {
    return null;
  }

  $item = $page.find(".item[data-id=".concat(_item, "]"));

  if ($item.length === 0) {
    return null;
  }

  if ($item.length > 1) {
    console.log('warning: more than one item found for', pageItem, $item);
  }

  return $item;
};

enterItem = function enterItem(e) {
  var $item, $page, key, place;
  item = ($item = $(this)).attr('data-id');
  itemElem = $item[0];

  if (targeting) {
    $("[data-id=".concat(item, "]")).addClass('target');
    key = ($page = $(this).parents('.page:first')).data('key');
    place = $item.offset().top;
    $('.page').trigger('align-item', {
      key: key,
      id: item,
      place: place
    });
    consumed = itemElem.consuming;

    if (consumed) {
      return consumed.forEach(function (i) {
        return itemFor(i).addClass('consumed');
      });
    }
  }
};

leaveItem = function leaveItem(e) {
  if (targeting) {
    $('.item, .action').removeClass('target');
    $('.item').removeClass('consumed');
  }

  item = null;
  return itemElem = null;
};

enterAction = function enterAction(e) {
  var key;
  action = $(this).data('id');

  if (targeting) {
    $("[data-id=".concat(action, "]")).addClass('target');
    key = $(this).parents('.page:first').data('key');
    return $('.page').trigger('align-item', {
      key: key,
      id: action
    });
  }
};

leaveAction = function leaveAction(e) {
  if (targeting) {
    $("[data-id=".concat(action, "]")).removeClass('target');
  }

  return action = null;
};

enterBacklink = function enterBacklink(e) {
  var $item, $page, key, place;
  item = ($item = $(this)).attr('data-id');
  itemElem = $item[0];

  if (targeting) {
    $("[data-id=".concat(item, "]")).addClass('target');
    key = ($page = $(this).parents('.page:first')).data('key');
    place = $item.offset().top;
    return $('.page').trigger('align-item', {
      key: key,
      id: item,
      place: place
    });
  }
};

leaveBacklink = function leaveBacklink(e) {
  if (targeting) {
    $('.item, .action').removeClass('target');
  }

  item = null;
  return itemElem = null;
};

alignItem = function alignItem(e, align) {
  var $item, $page, offset, place;
  $page = $(this);

  if ($page.data('key') === align.key) {
    return;
  }

  $item = $page.find(".item[data-id=".concat(align.id, "]"));

  if (!$item.length) {
    return;
  }

  place = align.place || $page.height() / 2;
  offset = $item.offset().top + $page.scrollTop() - place;
  return $page.stop().animate({
    scrollTop: offset
  }, 'slow');
};

module.exports = {
  bind: bind
};

},{"@babel/runtime/helpers/interopRequireDefault":40,"@babel/runtime/helpers/slicedToArray":43}],36:[function(require,module,exports){
"use strict";

// This module collects various functions that might belong
// better elsewhere. At one point we thought of uniformity
// of representations but that hasn't been a strong influency.
var util;
module.exports = util = {}; // for chart plug-in

util.formatTime = function (time) {
  var am, d, h, mi, mo;
  d = new Date(time > 10000000000 ? time : time * 1000);
  mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
  h = d.getHours();
  am = h < 12 ? 'AM' : 'PM';
  h = h === 0 ? 12 : h > 12 ? h - 12 : h;
  mi = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
  return "".concat(h, ":").concat(mi, " ").concat(am, "<br>").concat(d.getDate(), " ").concat(mo, " ").concat(d.getFullYear());
}; // for journal mouse-overs and possibly for date header


util.formatDate = function (msSinceEpoch) {
  var am, d, day, h, mi, mo, sec, wk, yr;
  d = new Date(msSinceEpoch);
  wk = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
  mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
  day = d.getDate();
  yr = d.getFullYear();
  h = d.getHours();
  am = h < 12 ? 'AM' : 'PM';
  h = h === 0 ? 12 : h > 12 ? h - 12 : h;
  mi = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
  sec = (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();
  return "".concat(wk, " ").concat(mo, " ").concat(day, ", ").concat(yr, "<br>").concat(h, ":").concat(mi, ":").concat(sec, " ").concat(am);
};

util.formatElapsedTime = function (msSinceEpoch) {
  var days, hrs, mins, months, msecs, secs, weeks, years;
  msecs = new Date().getTime() - msSinceEpoch;

  if ((secs = msecs / 1000) < 2) {
    return "".concat(Math.floor(msecs), " milliseconds ago");
  }

  if ((mins = secs / 60) < 2) {
    return "".concat(Math.floor(secs), " seconds ago");
  }

  if ((hrs = mins / 60) < 2) {
    return "".concat(Math.floor(mins), " minutes ago");
  }

  if ((days = hrs / 24) < 2) {
    return "".concat(Math.floor(hrs), " hours ago");
  }

  if ((weeks = days / 7) < 2) {
    return "".concat(Math.floor(days), " days ago");
  }

  if ((months = days / 31) < 2) {
    return "".concat(Math.floor(weeks), " weeks ago");
  }

  if ((years = days / 365) < 2) {
    return "".concat(Math.floor(months), " months ago");
  }

  return "".concat(Math.floor(years), " years ago");
};

},{}],37:[function(require,module,exports){
"use strict";

// We have exposed many parts of the core javascript to dynamically
// loaded plugins through bindings in the global "wiki". We expect
// to deprecate many of these as the plugin api matures. We once used
// the global to communicate between core modules but have now
// moved all of that responsibility onto browserify.
// We have canvased plugin repos in github.com/fedwiki to find
// the known uses of wiki globals. We notice that most entry
// points are used. We mark unused entries with ##.
var dialog, editor, itemz, link, neighborhood, pageHandler, plugin, resolve, siteAdapter, wiki;
wiki = {}; // known use: (eventually all server directed xhr and some tags)

siteAdapter = require('./siteAdapter');
wiki.local = siteAdapter.local;
wiki.origin = siteAdapter.origin;
wiki.recycler = siteAdapter.recycler;
wiki.site = siteAdapter.site; // known use: wiki.asSlug wiki-plugin-reduce/client/reduce.coffee:

wiki.asSlug = require('./page').asSlug;
wiki.newPage = require('./page').newPage; // known use: wiki.createItem wiki-plugin-parse/client/parse.coffee:
// known use: wiki.removeItem wiki-plugin-parse/client/parse.coffee:
// known use: wiki.getItem  wiki-plugin-changes/client/changes.coffee:

itemz = require('./itemz');
wiki.removeItem = itemz.removeItem;
wiki.createItem = itemz.createItem;
wiki.getItem = itemz.getItem; // known use: wiki.dialog wiki-plugin-changes/client/changes.coffee:
// known use: wiki.dialog wiki-plugin-chart/client/chart.coffee:
// known use: wiki.dialog wiki-plugin-data/client/data.coffee:
// known use: wiki.dialog wiki-plugin-efficiency/client/efficiency.coffee:
// known use: wiki.dialog wiki-plugin-linkmap/client/linkmap.coffee:
// known use: wiki.dialog wiki-plugin-method/client/method.coffee:
// known use: wiki.dialog wiki-plugin-radar/client/radar.coffee:
// known use: wiki.dialog wiki-plugin-reduce/client/reduce.coffee:
// known use: wiki.dialog wiki-plugin-txtzyme/client/txtzyme.coffee:

dialog = require('./dialog');
wiki.dialog = dialog.open; // known use: wiki.doInternalLink wiki-plugin-force/client/force.coffee:
// known use: wiki.doInternalLink wiki-plugin-radar/client/radar.coffee:

link = require('./link');
wiki.createPage = link.createPage; //#

wiki.doInternalLink = link.doInternalLink;
wiki.showResult = link.showResult; // known use: wiki.getScript  wiki-plugin-bars/client/bars.coffee:
// known use: wiki.getScript  wiki-plugin-code/client/code.coffee:
// known use: wiki.getScript  wiki-plugin-force/client/force.coffee:
// known use: wiki.getScript  wiki-plugin-line/client/line.coffee:
// known use: wiki.getScript  wiki-plugin-map/client/map.coffee:
// known use: wiki.getScript  wiki-plugin-mathjax/client/mathjax.coffee:
// known use: wiki.getScript  wiki-plugin-pushpin/client/pushpin.coffee:
// known use: wiki.getScript  wiki-plugin-radar/client/radar.coffee:
// known use: wiki.getPlugin  wiki-plugin-reduce/client/reduce.coffee:
// known use: wiki.doPlugin wiki-plugin-changes/client/changes.coffee:
// known use: wiki.registerPlugin wiki-plugin-changes/client/changes.coffee:

plugin = require('./plugin');
wiki.getScript = plugin.getScript;
wiki.getPlugin = plugin.getPlugin;
wiki.doPlugin = plugin.doPlugin;
wiki.registerPlugin = plugin.registerPlugin;
wiki.renderFrom = plugin.renderFrom; // known use: wiki.getData  wiki-plugin-bars/client/bars.coffee:
// known use: wiki.getData  wiki-plugin-calculator/client/calculator.coffee:
// known use: wiki.getData  wiki-plugin-force/client/force.coffee:
// known use: wiki.getData  wiki-plugin-line/client/line.coffee:

wiki.getData = function (vis) {
  var idx, who;

  if (vis) {
    idx = $('.item').index(vis);
    who = $(".item:lt(".concat(idx, ")")).filter('.chart,.data,.calculator').last();

    if (who != null) {
      return who.data('item').data;
    } else {
      return {};
    }
  } else {
    who = $('.chart,.data,.calculator').last();

    if (who != null) {
      return who.data('item').data;
    } else {
      return {};
    }
  }
}; // known use: wiki.getDataNodes wiki-plugin-metabolism/client/metabolism.coffee:
// known use: wiki.getDataNodes wiki-plugin-method/client/method.coffee:


wiki.getDataNodes = function (vis) {
  var idx, who;

  if (vis) {
    idx = $('.item').index(vis);
    who = $(".item:lt(".concat(idx, ")")).filter('.chart,.data,.calculator').toArray().reverse();
    return $(who);
  } else {
    who = $('.chart,.data,.calculator').toArray().reverse();
    return $(who);
  }
}; // known use: wiki.log  wiki-plugin-calculator/client/calculator.coffee:
// known use: wiki.log  wiki-plugin-calendar/client/calendar.coffee:
// known use: wiki.log  wiki-plugin-changes/client/changes.coffee:
// known use: wiki.log  wiki-plugin-efficiency/client/efficiency.coffee:
// known use: wiki.log  wiki-plugin-parse/client/parse.coffee:
// known use: wiki.log  wiki-plugin-radar/client/radar.coffee:
// known use: wiki.log  wiki-plugin-txtzyme/client/txtzyme.coffee:


wiki.log = function () {
  if ((typeof console !== "undefined" && console !== null ? console.log : void 0) != null) {
    var _console;

    return (_console = console).log.apply(_console, arguments);
  }
}; // known use: wiki.neighborhood wiki-plugin-activity/client/activity.coffee:
// known use: wiki.neighborhoodObject  wiki-plugin-activity/client/activity.coffee:
// known use: wiki.neighborhoodObject  wiki-plugin-roster/client/roster.coffee:


neighborhood = require('./neighborhood');
wiki.neighborhood = neighborhood.sites;
wiki.neighborhoodObject = neighborhood; // known use: wiki.pageHandler  wiki-plugin-changes/client/changes.coffee:
// known use: wiki.pageHandler  wiki-plugin-map/client/map.coffee:

pageHandler = require('./pageHandler');
wiki.pageHandler = pageHandler;
wiki.useLocalStorage = pageHandler.useLocalStorage; //#
// known use: wiki.resolveFrom  wiki-plugin-federatedwiki/client/federatedWiki.coffee:
// known use: wiki.resolveLinks wiki-plugin-chart/client/chart.coffee:
// known use: wiki.resolveLinks wiki-plugin-data/client/data.coffee:
// known use: wiki.resolveLinks wiki-plugin-efficiency/client/efficiency.coffee:
// known use: wiki.resolveLinks wiki-plugin-federatedwiki/client/federatedWiki.coffee:
// known use: wiki.resolveLinks wiki-plugin-logwatch/client/logwatch.coffee:
// known use: wiki.resolveLinks wiki-plugin-mathjax/client/mathjax.coffee:

resolve = require('./resolve');
wiki.resolveFrom = resolve.resolveFrom;
wiki.resolveLinks = resolve.resolveLinks;
wiki.resolutionContext = resolve.resolutionContext; //#
// known use: wiki.textEditor wiki-plugin-bytebeat/client/bytebeat.coffee:
// known use: wiki.textEditor wiki-plugin-calculator/client/calculator.coffee:
// known use: wiki.textEditor wiki-plugin-calendar/client/calendar.coffee:
// known use: wiki.textEditor wiki-plugin-code/client/code.coffee:
// known use: wiki.textEditor wiki-plugin-data/client/data.coffee:
// known use: wiki.textEditor wiki-plugin-efficiency/client/efficiency.coffee:
// known use: wiki.textEditor wiki-plugin-federatedwiki/client/federatedWiki.coffee:
// known use: wiki.textEditor wiki-plugin-mathjax/client/mathjax.coffee:
// known use: wiki.textEditor wiki-plugin-metabolism/client/metabolism.coffee:
// known use: wiki.textEditor wiki-plugin-method/client/method.coffee:
// known use: wiki.textEditor wiki-plugin-pagefold/client/pagefold.coffee:
// known use: wiki.textEditor wiki-plugin-parse/client/parse.coffee:
// known use: wiki.textEditor wiki-plugin-radar/client/radar.coffee:
// known use: wiki.textEditor wiki-plugin-reduce/client/reduce.coffee:
// known use: wiki.textEditor wiki-plugin-txtzyme/client/txtzyme.coffee:

editor = require('./editor');
wiki.textEditor = editor.textEditor; // known use: wiki.util wiki-plugin-activity/client/activity.coffee:

wiki.util = require('./util'); // known use: wiki.security views/static.html

wiki.security = require('./security'); // known use: require wiki-clint/lib/synopsis wiki-node-server/lib/page.coffee
// known use: require wiki-clint/lib/synopsis wiki-node-server/lib/leveldb.js
// known use: require wiki-clint/lib/synopsis wiki-node-server/lib/mongodb.js
// known use: require wiki-clint/lib/synopsis wiki-node-server/lib/redis.js

wiki.createSynopsis = require('./synopsis'); //#
// known uses: (none yet)

wiki.lineup = require('./lineup');
module.exports = wiki;

},{"./dialog":6,"./editor":8,"./itemz":12,"./lineup":15,"./link":16,"./neighborhood":17,"./page":19,"./pageHandler":20,"./plugin":22,"./resolve":27,"./security":31,"./siteAdapter":32,"./synopsis":34,"./util":36}],38:[function(require,module,exports){
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],39:[function(require,module,exports){
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],40:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],41:[function(require,module,exports){
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],42:[function(require,module,exports){
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],43:[function(require,module,exports){
var arrayWithHoles = require("./arrayWithHoles.js");

var iterableToArrayLimit = require("./iterableToArrayLimit.js");

var unsupportedIterableToArray = require("./unsupportedIterableToArray.js");

var nonIterableRest = require("./nonIterableRest.js");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./arrayWithHoles.js":39,"./iterableToArrayLimit.js":41,"./nonIterableRest.js":42,"./unsupportedIterableToArray.js":44}],44:[function(require,module,exports){
var arrayLikeToArray = require("./arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./arrayLikeToArray.js":38}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = asyncify;

var _initialParams = require('./internal/initialParams.js');

var _initialParams2 = _interopRequireDefault(_initialParams);

var _setImmediate = require('./internal/setImmediate.js');

var _setImmediate2 = _interopRequireDefault(_setImmediate);

var _wrapAsync = require('./internal/wrapAsync.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Take a sync function and make it async, passing its return value to a
 * callback. This is useful for plugging sync functions into a waterfall,
 * series, or other async functions. Any arguments passed to the generated
 * function will be passed to the wrapped function (except for the final
 * callback argument). Errors thrown will be passed to the callback.
 *
 * If the function passed to `asyncify` returns a Promise, that promises's
 * resolved/rejected state will be used to call the callback, rather than simply
 * the synchronous return value.
 *
 * This also means you can asyncify ES2017 `async` functions.
 *
 * @name asyncify
 * @static
 * @memberOf module:Utils
 * @method
 * @alias wrapSync
 * @category Util
 * @param {Function} func - The synchronous function, or Promise-returning
 * function to convert to an {@link AsyncFunction}.
 * @returns {AsyncFunction} An asynchronous wrapper of the `func`. To be
 * invoked with `(args..., callback)`.
 * @example
 *
 * // passing a regular synchronous function
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(JSON.parse),
 *     function (data, next) {
 *         // data is the result of parsing the text.
 *         // If there was a parsing error, it would have been caught.
 *     }
 * ], callback);
 *
 * // passing a function returning a promise
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(function (contents) {
 *         return db.model.create(contents);
 *     }),
 *     function (model, next) {
 *         // `model` is the instantiated model object.
 *         // If there was an error, this function would be skipped.
 *     }
 * ], callback);
 *
 * // es2017 example, though `asyncify` is not needed if your JS environment
 * // supports async functions out of the box
 * var q = async.queue(async.asyncify(async function(file) {
 *     var intermediateStep = await processFile(file);
 *     return await somePromise(intermediateStep)
 * }));
 *
 * q.push(files);
 */
function asyncify(func) {
    if ((0, _wrapAsync.isAsync)(func)) {
        return function (...args /*, callback*/) {
            const callback = args.pop();
            const promise = func.apply(this, args);
            return handlePromise(promise, callback);
        };
    }

    return (0, _initialParams2.default)(function (args, callback) {
        var result;
        try {
            result = func.apply(this, args);
        } catch (e) {
            return callback(e);
        }
        // if result is Promise object
        if (result && typeof result.then === 'function') {
            return handlePromise(result, callback);
        } else {
            callback(null, result);
        }
    });
}

function handlePromise(promise, callback) {
    return promise.then(value => {
        invokeCallback(callback, null, value);
    }, err => {
        invokeCallback(callback, err && err.message ? err : new Error(err));
    });
}

function invokeCallback(callback, error, value) {
    try {
        callback(error, value);
    } catch (err) {
        (0, _setImmediate2.default)(e => {
            throw e;
        }, err);
    }
}
module.exports = exports['default'];
},{"./internal/initialParams.js":47,"./internal/setImmediate.js":50,"./internal/wrapAsync.js":51}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Simple doubly linked list (https://en.wikipedia.org/wiki/Doubly_linked_list) implementation
// used for queues. This implementation assumes that the node provided by the user can be modified
// to adjust the next and last properties. We implement only the minimal functionality
// for queue support.
class DLL {
    constructor() {
        this.head = this.tail = null;
        this.length = 0;
    }

    removeLink(node) {
        if (node.prev) node.prev.next = node.next;else this.head = node.next;
        if (node.next) node.next.prev = node.prev;else this.tail = node.prev;

        node.prev = node.next = null;
        this.length -= 1;
        return node;
    }

    empty() {
        while (this.head) this.shift();
        return this;
    }

    insertAfter(node, newNode) {
        newNode.prev = node;
        newNode.next = node.next;
        if (node.next) node.next.prev = newNode;else this.tail = newNode;
        node.next = newNode;
        this.length += 1;
    }

    insertBefore(node, newNode) {
        newNode.prev = node.prev;
        newNode.next = node;
        if (node.prev) node.prev.next = newNode;else this.head = newNode;
        node.prev = newNode;
        this.length += 1;
    }

    unshift(node) {
        if (this.head) this.insertBefore(this.head, node);else setInitial(this, node);
    }

    push(node) {
        if (this.tail) this.insertAfter(this.tail, node);else setInitial(this, node);
    }

    shift() {
        return this.head && this.removeLink(this.head);
    }

    pop() {
        return this.tail && this.removeLink(this.tail);
    }

    toArray() {
        return [...this];
    }

    *[Symbol.iterator]() {
        var cur = this.head;
        while (cur) {
            yield cur.data;
            cur = cur.next;
        }
    }

    remove(testFn) {
        var curr = this.head;
        while (curr) {
            var { next } = curr;
            if (testFn(curr)) {
                this.removeLink(curr);
            }
            curr = next;
        }
        return this;
    }
}

exports.default = DLL;
function setInitial(dll, node) {
    dll.length = 1;
    dll.head = dll.tail = node;
}
module.exports = exports["default"];
},{}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (fn) {
    return function (...args /*, callback*/) {
        var callback = args.pop();
        return fn.call(this, args, callback);
    };
};

module.exports = exports["default"];
},{}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = onlyOnce;
function onlyOnce(fn) {
    return function (...args) {
        if (fn === null) throw new Error("Callback was already called.");
        var callFn = fn;
        fn = null;
        callFn.apply(this, args);
    };
}
module.exports = exports["default"];
},{}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = queue;

var _onlyOnce = require('./onlyOnce.js');

var _onlyOnce2 = _interopRequireDefault(_onlyOnce);

var _setImmediate = require('./setImmediate.js');

var _setImmediate2 = _interopRequireDefault(_setImmediate);

var _DoublyLinkedList = require('./DoublyLinkedList.js');

var _DoublyLinkedList2 = _interopRequireDefault(_DoublyLinkedList);

var _wrapAsync = require('./wrapAsync.js');

var _wrapAsync2 = _interopRequireDefault(_wrapAsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function queue(worker, concurrency, payload) {
    if (concurrency == null) {
        concurrency = 1;
    } else if (concurrency === 0) {
        throw new RangeError('Concurrency must not be zero');
    }

    var _worker = (0, _wrapAsync2.default)(worker);
    var numRunning = 0;
    var workersList = [];
    const events = {
        error: [],
        drain: [],
        saturated: [],
        unsaturated: [],
        empty: []
    };

    function on(event, handler) {
        events[event].push(handler);
    }

    function once(event, handler) {
        const handleAndRemove = (...args) => {
            off(event, handleAndRemove);
            handler(...args);
        };
        events[event].push(handleAndRemove);
    }

    function off(event, handler) {
        if (!event) return Object.keys(events).forEach(ev => events[ev] = []);
        if (!handler) return events[event] = [];
        events[event] = events[event].filter(ev => ev !== handler);
    }

    function trigger(event, ...args) {
        events[event].forEach(handler => handler(...args));
    }

    var processingScheduled = false;
    function _insert(data, insertAtFront, rejectOnError, callback) {
        if (callback != null && typeof callback !== 'function') {
            throw new Error('task callback must be a function');
        }
        q.started = true;

        var res, rej;
        function promiseCallback(err, ...args) {
            // we don't care about the error, let the global error handler
            // deal with it
            if (err) return rejectOnError ? rej(err) : res();
            if (args.length <= 1) return res(args[0]);
            res(args);
        }

        var item = q._createTaskItem(data, rejectOnError ? promiseCallback : callback || promiseCallback);

        if (insertAtFront) {
            q._tasks.unshift(item);
        } else {
            q._tasks.push(item);
        }

        if (!processingScheduled) {
            processingScheduled = true;
            (0, _setImmediate2.default)(() => {
                processingScheduled = false;
                q.process();
            });
        }

        if (rejectOnError || !callback) {
            return new Promise((resolve, reject) => {
                res = resolve;
                rej = reject;
            });
        }
    }

    function _createCB(tasks) {
        return function (err, ...args) {
            numRunning -= 1;

            for (var i = 0, l = tasks.length; i < l; i++) {
                var task = tasks[i];

                var index = workersList.indexOf(task);
                if (index === 0) {
                    workersList.shift();
                } else if (index > 0) {
                    workersList.splice(index, 1);
                }

                task.callback(err, ...args);

                if (err != null) {
                    trigger('error', err, task.data);
                }
            }

            if (numRunning <= q.concurrency - q.buffer) {
                trigger('unsaturated');
            }

            if (q.idle()) {
                trigger('drain');
            }
            q.process();
        };
    }

    function _maybeDrain(data) {
        if (data.length === 0 && q.idle()) {
            // call drain immediately if there are no tasks
            (0, _setImmediate2.default)(() => trigger('drain'));
            return true;
        }
        return false;
    }

    const eventMethod = name => handler => {
        if (!handler) {
            return new Promise((resolve, reject) => {
                once(name, (err, data) => {
                    if (err) return reject(err);
                    resolve(data);
                });
            });
        }
        off(name);
        on(name, handler);
    };

    var isProcessing = false;
    var q = {
        _tasks: new _DoublyLinkedList2.default(),
        _createTaskItem(data, callback) {
            return {
                data,
                callback
            };
        },
        *[Symbol.iterator]() {
            yield* q._tasks[Symbol.iterator]();
        },
        concurrency,
        payload,
        buffer: concurrency / 4,
        started: false,
        paused: false,
        push(data, callback) {
            if (Array.isArray(data)) {
                if (_maybeDrain(data)) return;
                return data.map(datum => _insert(datum, false, false, callback));
            }
            return _insert(data, false, false, callback);
        },
        pushAsync(data, callback) {
            if (Array.isArray(data)) {
                if (_maybeDrain(data)) return;
                return data.map(datum => _insert(datum, false, true, callback));
            }
            return _insert(data, false, true, callback);
        },
        kill() {
            off();
            q._tasks.empty();
        },
        unshift(data, callback) {
            if (Array.isArray(data)) {
                if (_maybeDrain(data)) return;
                return data.map(datum => _insert(datum, true, false, callback));
            }
            return _insert(data, true, false, callback);
        },
        unshiftAsync(data, callback) {
            if (Array.isArray(data)) {
                if (_maybeDrain(data)) return;
                return data.map(datum => _insert(datum, true, true, callback));
            }
            return _insert(data, true, true, callback);
        },
        remove(testFn) {
            q._tasks.remove(testFn);
        },
        process() {
            // Avoid trying to start too many processing operations. This can occur
            // when callbacks resolve synchronously (#1267).
            if (isProcessing) {
                return;
            }
            isProcessing = true;
            while (!q.paused && numRunning < q.concurrency && q._tasks.length) {
                var tasks = [],
                    data = [];
                var l = q._tasks.length;
                if (q.payload) l = Math.min(l, q.payload);
                for (var i = 0; i < l; i++) {
                    var node = q._tasks.shift();
                    tasks.push(node);
                    workersList.push(node);
                    data.push(node.data);
                }

                numRunning += 1;

                if (q._tasks.length === 0) {
                    trigger('empty');
                }

                if (numRunning === q.concurrency) {
                    trigger('saturated');
                }

                var cb = (0, _onlyOnce2.default)(_createCB(tasks));
                _worker(data, cb);
            }
            isProcessing = false;
        },
        length() {
            return q._tasks.length;
        },
        running() {
            return numRunning;
        },
        workersList() {
            return workersList;
        },
        idle() {
            return q._tasks.length + numRunning === 0;
        },
        pause() {
            q.paused = true;
        },
        resume() {
            if (q.paused === false) {
                return;
            }
            q.paused = false;
            (0, _setImmediate2.default)(q.process);
        }
    };
    // define these as fixed properties, so people get useful errors when updating
    Object.defineProperties(q, {
        saturated: {
            writable: false,
            value: eventMethod('saturated')
        },
        unsaturated: {
            writable: false,
            value: eventMethod('unsaturated')
        },
        empty: {
            writable: false,
            value: eventMethod('empty')
        },
        drain: {
            writable: false,
            value: eventMethod('drain')
        },
        error: {
            writable: false,
            value: eventMethod('error')
        }
    });
    return q;
}
module.exports = exports['default'];
},{"./DoublyLinkedList.js":46,"./onlyOnce.js":48,"./setImmediate.js":50,"./wrapAsync.js":51}],50:[function(require,module,exports){
(function (process,setImmediate){(function (){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fallback = fallback;
exports.wrap = wrap;
/* istanbul ignore file */

var hasQueueMicrotask = exports.hasQueueMicrotask = typeof queueMicrotask === 'function' && queueMicrotask;
var hasSetImmediate = exports.hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
var hasNextTick = exports.hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';

function fallback(fn) {
    setTimeout(fn, 0);
}

function wrap(defer) {
    return (fn, ...args) => defer(() => fn(...args));
}

var _defer;

if (hasQueueMicrotask) {
    _defer = queueMicrotask;
} else if (hasSetImmediate) {
    _defer = setImmediate;
} else if (hasNextTick) {
    _defer = process.nextTick;
} else {
    _defer = fallback;
}

exports.default = wrap(_defer);
}).call(this)}).call(this,require('_process'),require("timers").setImmediate)
},{"_process":54,"timers":59}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isAsyncIterable = exports.isAsyncGenerator = exports.isAsync = undefined;

var _asyncify = require('../asyncify.js');

var _asyncify2 = _interopRequireDefault(_asyncify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isAsync(fn) {
    return fn[Symbol.toStringTag] === 'AsyncFunction';
}

function isAsyncGenerator(fn) {
    return fn[Symbol.toStringTag] === 'AsyncGenerator';
}

function isAsyncIterable(obj) {
    return typeof obj[Symbol.asyncIterator] === 'function';
}

function wrapAsync(asyncFn) {
    if (typeof asyncFn !== 'function') throw new Error('expected a function');
    return isAsync(asyncFn) ? (0, _asyncify2.default)(asyncFn) : asyncFn;
}

exports.default = wrapAsync;
exports.isAsync = isAsync;
exports.isAsyncGenerator = isAsyncGenerator;
exports.isAsyncIterable = isAsyncIterable;
},{"../asyncify.js":45}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (worker, concurrency) {
  var _worker = (0, _wrapAsync2.default)(worker);
  return (0, _queue2.default)((items, cb) => {
    _worker(items[0], cb);
  }, concurrency, 1);
};

var _queue = require('./internal/queue.js');

var _queue2 = _interopRequireDefault(_queue);

var _wrapAsync = require('./internal/wrapAsync.js');

var _wrapAsync2 = _interopRequireDefault(_wrapAsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

/**
 * A queue of tasks for the worker function to complete.
 * @typedef {Iterable} QueueObject
 * @memberOf module:ControlFlow
 * @property {Function} length - a function returning the number of items
 * waiting to be processed. Invoke with `queue.length()`.
 * @property {boolean} started - a boolean indicating whether or not any
 * items have been pushed and processed by the queue.
 * @property {Function} running - a function returning the number of items
 * currently being processed. Invoke with `queue.running()`.
 * @property {Function} workersList - a function returning the array of items
 * currently being processed. Invoke with `queue.workersList()`.
 * @property {Function} idle - a function returning false if there are items
 * waiting or being processed, or true if not. Invoke with `queue.idle()`.
 * @property {number} concurrency - an integer for determining how many `worker`
 * functions should be run in parallel. This property can be changed after a
 * `queue` is created to alter the concurrency on-the-fly.
 * @property {number} payload - an integer that specifies how many items are
 * passed to the worker function at a time. only applies if this is a
 * [cargo]{@link module:ControlFlow.cargo} object
 * @property {AsyncFunction} push - add a new task to the `queue`. Calls `callback`
 * once the `worker` has finished processing the task. Instead of a single task,
 * a `tasks` array can be submitted. The respective callback is used for every
 * task in the list. Invoke with `queue.push(task, [callback])`,
 * @property {AsyncFunction} unshift - add a new task to the front of the `queue`.
 * Invoke with `queue.unshift(task, [callback])`.
 * @property {AsyncFunction} pushAsync - the same as `q.push`, except this returns
 * a promise that rejects if an error occurs.
 * @property {AsyncFunction} unshiftAsync - the same as `q.unshift`, except this returns
 * a promise that rejects if an error occurs.
 * @property {Function} remove - remove items from the queue that match a test
 * function.  The test function will be passed an object with a `data` property,
 * and a `priority` property, if this is a
 * [priorityQueue]{@link module:ControlFlow.priorityQueue} object.
 * Invoked with `queue.remove(testFn)`, where `testFn` is of the form
 * `function ({data, priority}) {}` and returns a Boolean.
 * @property {Function} saturated - a function that sets a callback that is
 * called when the number of running workers hits the `concurrency` limit, and
 * further tasks will be queued.  If the callback is omitted, `q.saturated()`
 * returns a promise for the next occurrence.
 * @property {Function} unsaturated - a function that sets a callback that is
 * called when the number of running workers is less than the `concurrency` &
 * `buffer` limits, and further tasks will not be queued. If the callback is
 * omitted, `q.unsaturated()` returns a promise for the next occurrence.
 * @property {number} buffer - A minimum threshold buffer in order to say that
 * the `queue` is `unsaturated`.
 * @property {Function} empty - a function that sets a callback that is called
 * when the last item from the `queue` is given to a `worker`. If the callback
 * is omitted, `q.empty()` returns a promise for the next occurrence.
 * @property {Function} drain - a function that sets a callback that is called
 * when the last item from the `queue` has returned from the `worker`. If the
 * callback is omitted, `q.drain()` returns a promise for the next occurrence.
 * @property {Function} error - a function that sets a callback that is called
 * when a task errors. Has the signature `function(error, task)`. If the
 * callback is omitted, `error()` returns a promise that rejects on the next
 * error.
 * @property {boolean} paused - a boolean for determining whether the queue is
 * in a paused state.
 * @property {Function} pause - a function that pauses the processing of tasks
 * until `resume()` is called. Invoke with `queue.pause()`.
 * @property {Function} resume - a function that resumes the processing of
 * queued tasks when the queue is paused. Invoke with `queue.resume()`.
 * @property {Function} kill - a function that removes the `drain` callback and
 * empties remaining tasks from the queue forcing it to go idle. No more tasks
 * should be pushed to the queue after calling this function. Invoke with `queue.kill()`.
 *
 * @example
 * const q = async.queue(worker, 2)
 * q.push(item1)
 * q.push(item2)
 * q.push(item3)
 * // queues are iterable, spread into an array to inspect
 * const items = [...q] // [item1, item2, item3]
 * // or use for of
 * for (let item of q) {
 *     console.log(item)
 * }
 *
 * q.drain(() => {
 *     console.log('all done')
 * })
 * // or
 * await q.drain()
 */

/**
 * Creates a `queue` object with the specified `concurrency`. Tasks added to the
 * `queue` are processed in parallel (up to the `concurrency` limit). If all
 * `worker`s are in progress, the task is queued until one becomes available.
 * Once a `worker` completes a `task`, that `task`'s callback is called.
 *
 * @name queue
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {AsyncFunction} worker - An async function for processing a queued task.
 * If you want to handle errors from an individual task, pass a callback to
 * `q.push()`. Invoked with (task, callback).
 * @param {number} [concurrency=1] - An `integer` for determining how many
 * `worker` functions should be run in parallel.  If omitted, the concurrency
 * defaults to `1`.  If the concurrency is `0`, an error is thrown.
 * @returns {module:ControlFlow.QueueObject} A queue object to manage the tasks. Callbacks can be
 * attached as certain properties to listen for specific events during the
 * lifecycle of the queue.
 * @example
 *
 * // create a queue object with concurrency 2
 * var q = async.queue(function(task, callback) {
 *     console.log('hello ' + task.name);
 *     callback();
 * }, 2);
 *
 * // assign a callback
 * q.drain(function() {
 *     console.log('all items have been processed');
 * });
 * // or await the end
 * await q.drain()
 *
 * // assign an error callback
 * q.error(function(err, task) {
 *     console.error('task experienced an error');
 * });
 *
 * // add some items to the queue
 * q.push({name: 'foo'}, function(err) {
 *     console.log('finished processing foo');
 * });
 * // callback is optional
 * q.push({name: 'bar'});
 *
 * // add some items to the queue (batch-wise)
 * q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
 *     console.log('finished processing item');
 * });
 *
 * // add some items to the front of the queue
 * q.unshift({name: 'bar'}, function (err) {
 *     console.log('finished processing bar');
 * });
 */
},{"./internal/queue.js":49,"./internal/wrapAsync.js":51}],53:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

},{}],54:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],55:[function(require,module,exports){
(function (global){(function (){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],56:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],57:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],58:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":56,"./encode":57}],59:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":54,"timers":59}],60:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"./util":61,"punycode":55,"querystring":58}],61:[function(require,module,exports){
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}],62:[function(require,module,exports){
(function (global){(function (){
/*!
    localForage -- Offline Storage, Improved
    Version 1.10.0
    https://localforage.github.io/localForage
    (c) 2013-2017 Mozilla, Apache License 2.0
*/
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.localforage = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
'use strict';
var Mutation = global.MutationObserver || global.WebKitMutationObserver;

var scheduleDrain;

{
  if (Mutation) {
    var called = 0;
    var observer = new Mutation(nextTick);
    var element = global.document.createTextNode('');
    observer.observe(element, {
      characterData: true
    });
    scheduleDrain = function () {
      element.data = (called = ++called % 2);
    };
  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
    var channel = new global.MessageChannel();
    channel.port1.onmessage = nextTick;
    scheduleDrain = function () {
      channel.port2.postMessage(0);
    };
  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
    scheduleDrain = function () {

      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var scriptEl = global.document.createElement('script');
      scriptEl.onreadystatechange = function () {
        nextTick();

        scriptEl.onreadystatechange = null;
        scriptEl.parentNode.removeChild(scriptEl);
        scriptEl = null;
      };
      global.document.documentElement.appendChild(scriptEl);
    };
  } else {
    scheduleDrain = function () {
      setTimeout(nextTick, 0);
    };
  }
}

var draining;
var queue = [];
//named nextTick for less confusing stack traces
function nextTick() {
  draining = true;
  var i, oldQueue;
  var len = queue.length;
  while (len) {
    oldQueue = queue;
    queue = [];
    i = -1;
    while (++i < len) {
      oldQueue[i]();
    }
    len = queue.length;
  }
  draining = false;
}

module.exports = immediate;
function immediate(task) {
  if (queue.push(task) === 1 && !draining) {
    scheduleDrain();
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
'use strict';
var immediate = _dereq_(1);

/* istanbul ignore next */
function INTERNAL() {}

var handlers = {};

var REJECTED = ['REJECTED'];
var FULFILLED = ['FULFILLED'];
var PENDING = ['PENDING'];

module.exports = Promise;

function Promise(resolver) {
  if (typeof resolver !== 'function') {
    throw new TypeError('resolver must be a function');
  }
  this.state = PENDING;
  this.queue = [];
  this.outcome = void 0;
  if (resolver !== INTERNAL) {
    safelyResolveThenable(this, resolver);
  }
}

Promise.prototype["catch"] = function (onRejected) {
  return this.then(null, onRejected);
};
Promise.prototype.then = function (onFulfilled, onRejected) {
  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
    typeof onRejected !== 'function' && this.state === REJECTED) {
    return this;
  }
  var promise = new this.constructor(INTERNAL);
  if (this.state !== PENDING) {
    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
    unwrap(promise, resolver, this.outcome);
  } else {
    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
  }

  return promise;
};
function QueueItem(promise, onFulfilled, onRejected) {
  this.promise = promise;
  if (typeof onFulfilled === 'function') {
    this.onFulfilled = onFulfilled;
    this.callFulfilled = this.otherCallFulfilled;
  }
  if (typeof onRejected === 'function') {
    this.onRejected = onRejected;
    this.callRejected = this.otherCallRejected;
  }
}
QueueItem.prototype.callFulfilled = function (value) {
  handlers.resolve(this.promise, value);
};
QueueItem.prototype.otherCallFulfilled = function (value) {
  unwrap(this.promise, this.onFulfilled, value);
};
QueueItem.prototype.callRejected = function (value) {
  handlers.reject(this.promise, value);
};
QueueItem.prototype.otherCallRejected = function (value) {
  unwrap(this.promise, this.onRejected, value);
};

function unwrap(promise, func, value) {
  immediate(function () {
    var returnValue;
    try {
      returnValue = func(value);
    } catch (e) {
      return handlers.reject(promise, e);
    }
    if (returnValue === promise) {
      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
    } else {
      handlers.resolve(promise, returnValue);
    }
  });
}

handlers.resolve = function (self, value) {
  var result = tryCatch(getThen, value);
  if (result.status === 'error') {
    return handlers.reject(self, result.value);
  }
  var thenable = result.value;

  if (thenable) {
    safelyResolveThenable(self, thenable);
  } else {
    self.state = FULFILLED;
    self.outcome = value;
    var i = -1;
    var len = self.queue.length;
    while (++i < len) {
      self.queue[i].callFulfilled(value);
    }
  }
  return self;
};
handlers.reject = function (self, error) {
  self.state = REJECTED;
  self.outcome = error;
  var i = -1;
  var len = self.queue.length;
  while (++i < len) {
    self.queue[i].callRejected(error);
  }
  return self;
};

function getThen(obj) {
  // Make sure we only access the accessor once as required by the spec
  var then = obj && obj.then;
  if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
    return function appyThen() {
      then.apply(obj, arguments);
    };
  }
}

function safelyResolveThenable(self, thenable) {
  // Either fulfill, reject or reject with error
  var called = false;
  function onError(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.reject(self, value);
  }

  function onSuccess(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.resolve(self, value);
  }

  function tryToUnwrap() {
    thenable(onSuccess, onError);
  }

  var result = tryCatch(tryToUnwrap);
  if (result.status === 'error') {
    onError(result.value);
  }
}

function tryCatch(func, value) {
  var out = {};
  try {
    out.value = func(value);
    out.status = 'success';
  } catch (e) {
    out.status = 'error';
    out.value = e;
  }
  return out;
}

Promise.resolve = resolve;
function resolve(value) {
  if (value instanceof this) {
    return value;
  }
  return handlers.resolve(new this(INTERNAL), value);
}

Promise.reject = reject;
function reject(reason) {
  var promise = new this(INTERNAL);
  return handlers.reject(promise, reason);
}

Promise.all = all;
function all(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var values = new Array(len);
  var resolved = 0;
  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    allResolver(iterable[i], i);
  }
  return promise;
  function allResolver(value, i) {
    self.resolve(value).then(resolveFromAll, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
    function resolveFromAll(outValue) {
      values[i] = outValue;
      if (++resolved === len && !called) {
        called = true;
        handlers.resolve(promise, values);
      }
    }
  }
}

Promise.race = race;
function race(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    resolver(iterable[i]);
  }
  return promise;
  function resolver(value) {
    self.resolve(value).then(function (response) {
      if (!called) {
        called = true;
        handlers.resolve(promise, response);
      }
    }, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
  }
}

},{"1":1}],3:[function(_dereq_,module,exports){
(function (global){
'use strict';
if (typeof global.Promise !== 'function') {
  global.Promise = _dereq_(2);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"2":2}],4:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getIDB() {
    /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
    try {
        if (typeof indexedDB !== 'undefined') {
            return indexedDB;
        }
        if (typeof webkitIndexedDB !== 'undefined') {
            return webkitIndexedDB;
        }
        if (typeof mozIndexedDB !== 'undefined') {
            return mozIndexedDB;
        }
        if (typeof OIndexedDB !== 'undefined') {
            return OIndexedDB;
        }
        if (typeof msIndexedDB !== 'undefined') {
            return msIndexedDB;
        }
    } catch (e) {
        return;
    }
}

var idb = getIDB();

function isIndexedDBValid() {
    try {
        // Initialize IndexedDB; fall back to vendor-prefixed versions
        // if needed.
        if (!idb || !idb.open) {
            return false;
        }
        // We mimic PouchDB here;
        //
        // We test for openDatabase because IE Mobile identifies itself
        // as Safari. Oh the lulz...
        var isSafari = typeof openDatabase !== 'undefined' && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);

        var hasFetch = typeof fetch === 'function' && fetch.toString().indexOf('[native code') !== -1;

        // Safari <10.1 does not meet our requirements for IDB support
        // (see: https://github.com/pouchdb/pouchdb/issues/5572).
        // Safari 10.1 shipped with fetch, we can use that to detect it.
        // Note: this creates issues with `window.fetch` polyfills and
        // overrides; see:
        // https://github.com/localForage/localForage/issues/856
        return (!isSafari || hasFetch) && typeof indexedDB !== 'undefined' &&
        // some outdated implementations of IDB that appear on Samsung
        // and HTC Android devices <4.4 are missing IDBKeyRange
        // See: https://github.com/mozilla/localForage/issues/128
        // See: https://github.com/mozilla/localForage/issues/272
        typeof IDBKeyRange !== 'undefined';
    } catch (e) {
        return false;
    }
}

// Abstracts constructing a Blob object, so it also works in older
// browsers that don't support the native Blob constructor. (i.e.
// old QtWebKit versions, at least).
// Abstracts constructing a Blob object, so it also works in older
// browsers that don't support the native Blob constructor. (i.e.
// old QtWebKit versions, at least).
function createBlob(parts, properties) {
    /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
    parts = parts || [];
    properties = properties || {};
    try {
        return new Blob(parts, properties);
    } catch (e) {
        if (e.name !== 'TypeError') {
            throw e;
        }
        var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : WebKitBlobBuilder;
        var builder = new Builder();
        for (var i = 0; i < parts.length; i += 1) {
            builder.append(parts[i]);
        }
        return builder.getBlob(properties.type);
    }
}

// This is CommonJS because lie is an external dependency, so Rollup
// can just ignore it.
if (typeof Promise === 'undefined') {
    // In the "nopromises" build this will just throw if you don't have
    // a global promise object, but it would throw anyway later.
    _dereq_(3);
}
var Promise$1 = Promise;

function executeCallback(promise, callback) {
    if (callback) {
        promise.then(function (result) {
            callback(null, result);
        }, function (error) {
            callback(error);
        });
    }
}

function executeTwoCallbacks(promise, callback, errorCallback) {
    if (typeof callback === 'function') {
        promise.then(callback);
    }

    if (typeof errorCallback === 'function') {
        promise["catch"](errorCallback);
    }
}

function normalizeKey(key) {
    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    return key;
}

function getCallback() {
    if (arguments.length && typeof arguments[arguments.length - 1] === 'function') {
        return arguments[arguments.length - 1];
    }
}

// Some code originally from async_storage.js in
// [Gaia](https://github.com/mozilla-b2g/gaia).

var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
var supportsBlobs = void 0;
var dbContexts = {};
var toString = Object.prototype.toString;

// Transaction Modes
var READ_ONLY = 'readonly';
var READ_WRITE = 'readwrite';

// Transform a binary string to an array buffer, because otherwise
// weird stuff happens when you try to work with the binary string directly.
// It is known.
// From http://stackoverflow.com/questions/14967647/ (continues on next line)
// encode-decode-image-with-base64-breaks-image (2013-04-21)
function _binStringToArrayBuffer(bin) {
    var length = bin.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < length; i++) {
        arr[i] = bin.charCodeAt(i);
    }
    return buf;
}

//
// Blobs are not supported in all versions of IndexedDB, notably
// Chrome <37 and Android <5. In those versions, storing a blob will throw.
//
// Various other blob bugs exist in Chrome v37-42 (inclusive).
// Detecting them is expensive and confusing to users, and Chrome 37-42
// is at very low usage worldwide, so we do a hacky userAgent check instead.
//
// content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
// 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
// FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
//
// Code borrowed from PouchDB. See:
// https://github.com/pouchdb/pouchdb/blob/master/packages/node_modules/pouchdb-adapter-idb/src/blobSupport.js
//
function _checkBlobSupportWithoutCaching(idb) {
    return new Promise$1(function (resolve) {
        var txn = idb.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
        var blob = createBlob(['']);
        txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');

        txn.onabort = function (e) {
            // If the transaction aborts now its due to not being able to
            // write to the database, likely due to the disk being full
            e.preventDefault();
            e.stopPropagation();
            resolve(false);
        };

        txn.oncomplete = function () {
            var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
            var matchedEdge = navigator.userAgent.match(/Edge\//);
            // MS Edge pretends to be Chrome 42:
            // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
            resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
        };
    })["catch"](function () {
        return false; // error, so assume unsupported
    });
}

function _checkBlobSupport(idb) {
    if (typeof supportsBlobs === 'boolean') {
        return Promise$1.resolve(supportsBlobs);
    }
    return _checkBlobSupportWithoutCaching(idb).then(function (value) {
        supportsBlobs = value;
        return supportsBlobs;
    });
}

function _deferReadiness(dbInfo) {
    var dbContext = dbContexts[dbInfo.name];

    // Create a deferred object representing the current database operation.
    var deferredOperation = {};

    deferredOperation.promise = new Promise$1(function (resolve, reject) {
        deferredOperation.resolve = resolve;
        deferredOperation.reject = reject;
    });

    // Enqueue the deferred operation.
    dbContext.deferredOperations.push(deferredOperation);

    // Chain its promise to the database readiness.
    if (!dbContext.dbReady) {
        dbContext.dbReady = deferredOperation.promise;
    } else {
        dbContext.dbReady = dbContext.dbReady.then(function () {
            return deferredOperation.promise;
        });
    }
}

function _advanceReadiness(dbInfo) {
    var dbContext = dbContexts[dbInfo.name];

    // Dequeue a deferred operation.
    var deferredOperation = dbContext.deferredOperations.pop();

    // Resolve its promise (which is part of the database readiness
    // chain of promises).
    if (deferredOperation) {
        deferredOperation.resolve();
        return deferredOperation.promise;
    }
}

function _rejectReadiness(dbInfo, err) {
    var dbContext = dbContexts[dbInfo.name];

    // Dequeue a deferred operation.
    var deferredOperation = dbContext.deferredOperations.pop();

    // Reject its promise (which is part of the database readiness
    // chain of promises).
    if (deferredOperation) {
        deferredOperation.reject(err);
        return deferredOperation.promise;
    }
}

function _getConnection(dbInfo, upgradeNeeded) {
    return new Promise$1(function (resolve, reject) {
        dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext();

        if (dbInfo.db) {
            if (upgradeNeeded) {
                _deferReadiness(dbInfo);
                dbInfo.db.close();
            } else {
                return resolve(dbInfo.db);
            }
        }

        var dbArgs = [dbInfo.name];

        if (upgradeNeeded) {
            dbArgs.push(dbInfo.version);
        }

        var openreq = idb.open.apply(idb, dbArgs);

        if (upgradeNeeded) {
            openreq.onupgradeneeded = function (e) {
                var db = openreq.result;
                try {
                    db.createObjectStore(dbInfo.storeName);
                    if (e.oldVersion <= 1) {
                        // Added when support for blob shims was added
                        db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                    }
                } catch (ex) {
                    if (ex.name === 'ConstraintError') {
                        console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                    } else {
                        throw ex;
                    }
                }
            };
        }

        openreq.onerror = function (e) {
            e.preventDefault();
            reject(openreq.error);
        };

        openreq.onsuccess = function () {
            var db = openreq.result;
            db.onversionchange = function (e) {
                // Triggered when the database is modified (e.g. adding an objectStore) or
                // deleted (even when initiated by other sessions in different tabs).
                // Closing the connection here prevents those operations from being blocked.
                // If the database is accessed again later by this instance, the connection
                // will be reopened or the database recreated as needed.
                e.target.close();
            };
            resolve(db);
            _advanceReadiness(dbInfo);
        };
    });
}

function _getOriginalConnection(dbInfo) {
    return _getConnection(dbInfo, false);
}

function _getUpgradedConnection(dbInfo) {
    return _getConnection(dbInfo, true);
}

function _isUpgradeNeeded(dbInfo, defaultVersion) {
    if (!dbInfo.db) {
        return true;
    }

    var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
    var isDowngrade = dbInfo.version < dbInfo.db.version;
    var isUpgrade = dbInfo.version > dbInfo.db.version;

    if (isDowngrade) {
        // If the version is not the default one
        // then warn for impossible downgrade.
        if (dbInfo.version !== defaultVersion) {
            console.warn('The database "' + dbInfo.name + '"' + " can't be downgraded from version " + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
        }
        // Align the versions to prevent errors.
        dbInfo.version = dbInfo.db.version;
    }

    if (isUpgrade || isNewStore) {
        // If the store is new then increment the version (if needed).
        // This will trigger an "upgradeneeded" event which is required
        // for creating a store.
        if (isNewStore) {
            var incVersion = dbInfo.db.version + 1;
            if (incVersion > dbInfo.version) {
                dbInfo.version = incVersion;
            }
        }

        return true;
    }

    return false;
}

// encode a blob for indexeddb engines that don't support blobs
function _encodeBlob(blob) {
    return new Promise$1(function (resolve, reject) {
        var reader = new FileReader();
        reader.onerror = reject;
        reader.onloadend = function (e) {
            var base64 = btoa(e.target.result || '');
            resolve({
                __local_forage_encoded_blob: true,
                data: base64,
                type: blob.type
            });
        };
        reader.readAsBinaryString(blob);
    });
}

// decode an encoded blob
function _decodeBlob(encodedBlob) {
    var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
    return createBlob([arrayBuff], { type: encodedBlob.type });
}

// is this one of our fancy encoded blobs?
function _isEncodedBlob(value) {
    return value && value.__local_forage_encoded_blob;
}

// Specialize the default `ready()` function by making it dependent
// on the current database operations. Thus, the driver will be actually
// ready when it's been initialized (default) *and* there are no pending
// operations on the database (initiated by some other instances).
function _fullyReady(callback) {
    var self = this;

    var promise = self._initReady().then(function () {
        var dbContext = dbContexts[self._dbInfo.name];

        if (dbContext && dbContext.dbReady) {
            return dbContext.dbReady;
        }
    });

    executeTwoCallbacks(promise, callback, callback);
    return promise;
}

// Try to establish a new db connection to replace the
// current one which is broken (i.e. experiencing
// InvalidStateError while creating a transaction).
function _tryReconnect(dbInfo) {
    _deferReadiness(dbInfo);

    var dbContext = dbContexts[dbInfo.name];
    var forages = dbContext.forages;

    for (var i = 0; i < forages.length; i++) {
        var forage = forages[i];
        if (forage._dbInfo.db) {
            forage._dbInfo.db.close();
            forage._dbInfo.db = null;
        }
    }
    dbInfo.db = null;

    return _getOriginalConnection(dbInfo).then(function (db) {
        dbInfo.db = db;
        if (_isUpgradeNeeded(dbInfo)) {
            // Reopen the database for upgrading.
            return _getUpgradedConnection(dbInfo);
        }
        return db;
    }).then(function (db) {
        // store the latest db reference
        // in case the db was upgraded
        dbInfo.db = dbContext.db = db;
        for (var i = 0; i < forages.length; i++) {
            forages[i]._dbInfo.db = db;
        }
    })["catch"](function (err) {
        _rejectReadiness(dbInfo, err);
        throw err;
    });
}

// FF doesn't like Promises (micro-tasks) and IDDB store operations,
// so we have to do it with callbacks
function createTransaction(dbInfo, mode, callback, retries) {
    if (retries === undefined) {
        retries = 1;
    }

    try {
        var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
        callback(null, tx);
    } catch (err) {
        if (retries > 0 && (!dbInfo.db || err.name === 'InvalidStateError' || err.name === 'NotFoundError')) {
            return Promise$1.resolve().then(function () {
                if (!dbInfo.db || err.name === 'NotFoundError' && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) {
                    // increase the db version, to create the new ObjectStore
                    if (dbInfo.db) {
                        dbInfo.version = dbInfo.db.version + 1;
                    }
                    // Reopen the database for upgrading.
                    return _getUpgradedConnection(dbInfo);
                }
            }).then(function () {
                return _tryReconnect(dbInfo).then(function () {
                    createTransaction(dbInfo, mode, callback, retries - 1);
                });
            })["catch"](callback);
        }

        callback(err);
    }
}

function createDbContext() {
    return {
        // Running localForages sharing a database.
        forages: [],
        // Shared database.
        db: null,
        // Database readiness (promise).
        dbReady: null,
        // Deferred operations on the database.
        deferredOperations: []
    };
}

// Open the IndexedDB database (automatically creates one if one didn't
// previously exist), using any options set in the config.
function _initStorage(options) {
    var self = this;
    var dbInfo = {
        db: null
    };

    if (options) {
        for (var i in options) {
            dbInfo[i] = options[i];
        }
    }

    // Get the current context of the database;
    var dbContext = dbContexts[dbInfo.name];

    // ...or create a new context.
    if (!dbContext) {
        dbContext = createDbContext();
        // Register the new context in the global container.
        dbContexts[dbInfo.name] = dbContext;
    }

    // Register itself as a running localForage in the current context.
    dbContext.forages.push(self);

    // Replace the default `ready()` function with the specialized one.
    if (!self._initReady) {
        self._initReady = self.ready;
        self.ready = _fullyReady;
    }

    // Create an array of initialization states of the related localForages.
    var initPromises = [];

    function ignoreErrors() {
        // Don't handle errors here,
        // just makes sure related localForages aren't pending.
        return Promise$1.resolve();
    }

    for (var j = 0; j < dbContext.forages.length; j++) {
        var forage = dbContext.forages[j];
        if (forage !== self) {
            // Don't wait for itself...
            initPromises.push(forage._initReady()["catch"](ignoreErrors));
        }
    }

    // Take a snapshot of the related localForages.
    var forages = dbContext.forages.slice(0);

    // Initialize the connection process only when
    // all the related localForages aren't pending.
    return Promise$1.all(initPromises).then(function () {
        dbInfo.db = dbContext.db;
        // Get the connection or open a new one without upgrade.
        return _getOriginalConnection(dbInfo);
    }).then(function (db) {
        dbInfo.db = db;
        if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
            // Reopen the database for upgrading.
            return _getUpgradedConnection(dbInfo);
        }
        return db;
    }).then(function (db) {
        dbInfo.db = dbContext.db = db;
        self._dbInfo = dbInfo;
        // Share the final connection amongst related localForages.
        for (var k = 0; k < forages.length; k++) {
            var forage = forages[k];
            if (forage !== self) {
                // Self is already up-to-date.
                forage._dbInfo.db = dbInfo.db;
                forage._dbInfo.version = dbInfo.version;
            }
        }
    });
}

function getItem(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.get(key);

                    req.onsuccess = function () {
                        var value = req.result;
                        if (value === undefined) {
                            value = null;
                        }
                        if (_isEncodedBlob(value)) {
                            value = _decodeBlob(value);
                        }
                        resolve(value);
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Iterate over all items stored in database.
function iterate(iterator, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.openCursor();
                    var iterationNumber = 1;

                    req.onsuccess = function () {
                        var cursor = req.result;

                        if (cursor) {
                            var value = cursor.value;
                            if (_isEncodedBlob(value)) {
                                value = _decodeBlob(value);
                            }
                            var result = iterator(value, cursor.key, iterationNumber++);

                            // when the iterator callback returns any
                            // (non-`undefined`) value, then we stop
                            // the iteration immediately
                            if (result !== void 0) {
                                resolve(result);
                            } else {
                                cursor["continue"]();
                            }
                        } else {
                            resolve();
                        }
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);

    return promise;
}

function setItem(key, value, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        var dbInfo;
        self.ready().then(function () {
            dbInfo = self._dbInfo;
            if (toString.call(value) === '[object Blob]') {
                return _checkBlobSupport(dbInfo.db).then(function (blobSupport) {
                    if (blobSupport) {
                        return value;
                    }
                    return _encodeBlob(value);
                });
            }
            return value;
        }).then(function (value) {
            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);

                    // The reason we don't _save_ null is because IE 10 does
                    // not support saving the `null` type in IndexedDB. How
                    // ironic, given the bug below!
                    // See: https://github.com/mozilla/localForage/issues/161
                    if (value === null) {
                        value = undefined;
                    }

                    var req = store.put(value, key);

                    transaction.oncomplete = function () {
                        // Cast to undefined so the value passed to
                        // callback/promise is the same as what one would get out
                        // of `getItem()` later. This leads to some weirdness
                        // (setItem('foo', undefined) will return `null`), but
                        // it's not my fault localStorage is our baseline and that
                        // it's weird.
                        if (value === undefined) {
                            value = null;
                        }

                        resolve(value);
                    };
                    transaction.onabort = transaction.onerror = function () {
                        var err = req.error ? req.error : req.transaction.error;
                        reject(err);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function removeItem(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    // We use a Grunt task to make this safe for IE and some
                    // versions of Android (including those used by Cordova).
                    // Normally IE won't like `.delete()` and will insist on
                    // using `['delete']()`, but we have a build step that
                    // fixes this for us now.
                    var req = store["delete"](key);
                    transaction.oncomplete = function () {
                        resolve();
                    };

                    transaction.onerror = function () {
                        reject(req.error);
                    };

                    // The request will be also be aborted if we've exceeded our storage
                    // space.
                    transaction.onabort = function () {
                        var err = req.error ? req.error : req.transaction.error;
                        reject(err);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function clear(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.clear();

                    transaction.oncomplete = function () {
                        resolve();
                    };

                    transaction.onabort = transaction.onerror = function () {
                        var err = req.error ? req.error : req.transaction.error;
                        reject(err);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function length(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.count();

                    req.onsuccess = function () {
                        resolve(req.result);
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function key(n, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        if (n < 0) {
            resolve(null);

            return;
        }

        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var advanced = false;
                    var req = store.openKeyCursor();

                    req.onsuccess = function () {
                        var cursor = req.result;
                        if (!cursor) {
                            // this means there weren't enough keys
                            resolve(null);

                            return;
                        }

                        if (n === 0) {
                            // We have the first key, return it if that's what they
                            // wanted.
                            resolve(cursor.key);
                        } else {
                            if (!advanced) {
                                // Otherwise, ask the cursor to skip ahead n
                                // records.
                                advanced = true;
                                cursor.advance(n);
                            } else {
                                // When we get here, we've got the nth key.
                                resolve(cursor.key);
                            }
                        }
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function keys(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.openKeyCursor();
                    var keys = [];

                    req.onsuccess = function () {
                        var cursor = req.result;

                        if (!cursor) {
                            resolve(keys);
                            return;
                        }

                        keys.push(cursor.key);
                        cursor["continue"]();
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function dropInstance(options, callback) {
    callback = getCallback.apply(this, arguments);

    var currentConfig = this.config();
    options = typeof options !== 'function' && options || {};
    if (!options.name) {
        options.name = options.name || currentConfig.name;
        options.storeName = options.storeName || currentConfig.storeName;
    }

    var self = this;
    var promise;
    if (!options.name) {
        promise = Promise$1.reject('Invalid arguments');
    } else {
        var isCurrentDb = options.name === currentConfig.name && self._dbInfo.db;

        var dbPromise = isCurrentDb ? Promise$1.resolve(self._dbInfo.db) : _getOriginalConnection(options).then(function (db) {
            var dbContext = dbContexts[options.name];
            var forages = dbContext.forages;
            dbContext.db = db;
            for (var i = 0; i < forages.length; i++) {
                forages[i]._dbInfo.db = db;
            }
            return db;
        });

        if (!options.storeName) {
            promise = dbPromise.then(function (db) {
                _deferReadiness(options);

                var dbContext = dbContexts[options.name];
                var forages = dbContext.forages;

                db.close();
                for (var i = 0; i < forages.length; i++) {
                    var forage = forages[i];
                    forage._dbInfo.db = null;
                }

                var dropDBPromise = new Promise$1(function (resolve, reject) {
                    var req = idb.deleteDatabase(options.name);

                    req.onerror = function () {
                        var db = req.result;
                        if (db) {
                            db.close();
                        }
                        reject(req.error);
                    };

                    req.onblocked = function () {
                        // Closing all open connections in onversionchange handler should prevent this situation, but if
                        // we do get here, it just means the request remains pending - eventually it will succeed or error
                        console.warn('dropInstance blocked for database "' + options.name + '" until all open connections are closed');
                    };

                    req.onsuccess = function () {
                        var db = req.result;
                        if (db) {
                            db.close();
                        }
                        resolve(db);
                    };
                });

                return dropDBPromise.then(function (db) {
                    dbContext.db = db;
                    for (var i = 0; i < forages.length; i++) {
                        var _forage = forages[i];
                        _advanceReadiness(_forage._dbInfo);
                    }
                })["catch"](function (err) {
                    (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
                    throw err;
                });
            });
        } else {
            promise = dbPromise.then(function (db) {
                if (!db.objectStoreNames.contains(options.storeName)) {
                    return;
                }

                var newVersion = db.version + 1;

                _deferReadiness(options);

                var dbContext = dbContexts[options.name];
                var forages = dbContext.forages;

                db.close();
                for (var i = 0; i < forages.length; i++) {
                    var forage = forages[i];
                    forage._dbInfo.db = null;
                    forage._dbInfo.version = newVersion;
                }

                var dropObjectPromise = new Promise$1(function (resolve, reject) {
                    var req = idb.open(options.name, newVersion);

                    req.onerror = function (err) {
                        var db = req.result;
                        db.close();
                        reject(err);
                    };

                    req.onupgradeneeded = function () {
                        var db = req.result;
                        db.deleteObjectStore(options.storeName);
                    };

                    req.onsuccess = function () {
                        var db = req.result;
                        db.close();
                        resolve(db);
                    };
                });

                return dropObjectPromise.then(function (db) {
                    dbContext.db = db;
                    for (var j = 0; j < forages.length; j++) {
                        var _forage2 = forages[j];
                        _forage2._dbInfo.db = db;
                        _advanceReadiness(_forage2._dbInfo);
                    }
                })["catch"](function (err) {
                    (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
                    throw err;
                });
            });
        }
    }

    executeCallback(promise, callback);
    return promise;
}

var asyncStorage = {
    _driver: 'asyncStorage',
    _initStorage: _initStorage,
    _support: isIndexedDBValid(),
    iterate: iterate,
    getItem: getItem,
    setItem: setItem,
    removeItem: removeItem,
    clear: clear,
    length: length,
    key: key,
    keys: keys,
    dropInstance: dropInstance
};

function isWebSQLValid() {
    return typeof openDatabase === 'function';
}

// Sadly, the best way to save binary data in WebSQL/localStorage is serializing
// it to Base64, so this is how we store it to prevent very strange errors with less
// verbose ways of binary <-> string data storage.
var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

var BLOB_TYPE_PREFIX = '~~local_forage_type~';
var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;

var SERIALIZED_MARKER = '__lfsc__:';
var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;

// OMG the serializations!
var TYPE_ARRAYBUFFER = 'arbf';
var TYPE_BLOB = 'blob';
var TYPE_INT8ARRAY = 'si08';
var TYPE_UINT8ARRAY = 'ui08';
var TYPE_UINT8CLAMPEDARRAY = 'uic8';
var TYPE_INT16ARRAY = 'si16';
var TYPE_INT32ARRAY = 'si32';
var TYPE_UINT16ARRAY = 'ur16';
var TYPE_UINT32ARRAY = 'ui32';
var TYPE_FLOAT32ARRAY = 'fl32';
var TYPE_FLOAT64ARRAY = 'fl64';
var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;

var toString$1 = Object.prototype.toString;

function stringToBuffer(serializedString) {
    // Fill the string into a ArrayBuffer.
    var bufferLength = serializedString.length * 0.75;
    var len = serializedString.length;
    var i;
    var p = 0;
    var encoded1, encoded2, encoded3, encoded4;

    if (serializedString[serializedString.length - 1] === '=') {
        bufferLength--;
        if (serializedString[serializedString.length - 2] === '=') {
            bufferLength--;
        }
    }

    var buffer = new ArrayBuffer(bufferLength);
    var bytes = new Uint8Array(buffer);

    for (i = 0; i < len; i += 4) {
        encoded1 = BASE_CHARS.indexOf(serializedString[i]);
        encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
        encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
        encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);

        /*jslint bitwise: true */
        bytes[p++] = encoded1 << 2 | encoded2 >> 4;
        bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
        bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }
    return buffer;
}

// Converts a buffer to a string to store, serialized, in the backend
// storage library.
function bufferToString(buffer) {
    // base64-arraybuffer
    var bytes = new Uint8Array(buffer);
    var base64String = '';
    var i;

    for (i = 0; i < bytes.length; i += 3) {
        /*jslint bitwise: true */
        base64String += BASE_CHARS[bytes[i] >> 2];
        base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
        base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
        base64String += BASE_CHARS[bytes[i + 2] & 63];
    }

    if (bytes.length % 3 === 2) {
        base64String = base64String.substring(0, base64String.length - 1) + '=';
    } else if (bytes.length % 3 === 1) {
        base64String = base64String.substring(0, base64String.length - 2) + '==';
    }

    return base64String;
}

// Serialize a value, afterwards executing a callback (which usually
// instructs the `setItem()` callback/promise to be executed). This is how
// we store binary data with localStorage.
function serialize(value, callback) {
    var valueType = '';
    if (value) {
        valueType = toString$1.call(value);
    }

    // Cannot use `value instanceof ArrayBuffer` or such here, as these
    // checks fail when running the tests using casper.js...
    //
    // TODO: See why those tests fail and use a better solution.
    if (value && (valueType === '[object ArrayBuffer]' || value.buffer && toString$1.call(value.buffer) === '[object ArrayBuffer]')) {
        // Convert binary arrays to a string and prefix the string with
        // a special marker.
        var buffer;
        var marker = SERIALIZED_MARKER;

        if (value instanceof ArrayBuffer) {
            buffer = value;
            marker += TYPE_ARRAYBUFFER;
        } else {
            buffer = value.buffer;

            if (valueType === '[object Int8Array]') {
                marker += TYPE_INT8ARRAY;
            } else if (valueType === '[object Uint8Array]') {
                marker += TYPE_UINT8ARRAY;
            } else if (valueType === '[object Uint8ClampedArray]') {
                marker += TYPE_UINT8CLAMPEDARRAY;
            } else if (valueType === '[object Int16Array]') {
                marker += TYPE_INT16ARRAY;
            } else if (valueType === '[object Uint16Array]') {
                marker += TYPE_UINT16ARRAY;
            } else if (valueType === '[object Int32Array]') {
                marker += TYPE_INT32ARRAY;
            } else if (valueType === '[object Uint32Array]') {
                marker += TYPE_UINT32ARRAY;
            } else if (valueType === '[object Float32Array]') {
                marker += TYPE_FLOAT32ARRAY;
            } else if (valueType === '[object Float64Array]') {
                marker += TYPE_FLOAT64ARRAY;
            } else {
                callback(new Error('Failed to get type for BinaryArray'));
            }
        }

        callback(marker + bufferToString(buffer));
    } else if (valueType === '[object Blob]') {
        // Conver the blob to a binaryArray and then to a string.
        var fileReader = new FileReader();

        fileReader.onload = function () {
            // Backwards-compatible prefix for the blob type.
            var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);

            callback(SERIALIZED_MARKER + TYPE_BLOB + str);
        };

        fileReader.readAsArrayBuffer(value);
    } else {
        try {
            callback(JSON.stringify(value));
        } catch (e) {
            console.error("Couldn't convert value into a JSON string: ", value);

            callback(null, e);
        }
    }
}

// Deserialize data we've inserted into a value column/field. We place
// special markers into our strings to mark them as encoded; this isn't
// as nice as a meta field, but it's the only sane thing we can do whilst
// keeping localStorage support intact.
//
// Oftentimes this will just deserialize JSON content, but if we have a
// special marker (SERIALIZED_MARKER, defined above), we will extract
// some kind of arraybuffer/binary data/typed array out of the string.
function deserialize(value) {
    // If we haven't marked this string as being specially serialized (i.e.
    // something other than serialized JSON), we can just return it and be
    // done with it.
    if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
        return JSON.parse(value);
    }

    // The following code deals with deserializing some kind of Blob or
    // TypedArray. First we separate out the type of data we're dealing
    // with from the data itself.
    var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
    var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);

    var blobType;
    // Backwards-compatible blob type serialization strategy.
    // DBs created with older versions of localForage will simply not have the blob type.
    if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
        var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
        blobType = matcher[1];
        serializedString = serializedString.substring(matcher[0].length);
    }
    var buffer = stringToBuffer(serializedString);

    // Return the right type based on the code/type set during
    // serialization.
    switch (type) {
        case TYPE_ARRAYBUFFER:
            return buffer;
        case TYPE_BLOB:
            return createBlob([buffer], { type: blobType });
        case TYPE_INT8ARRAY:
            return new Int8Array(buffer);
        case TYPE_UINT8ARRAY:
            return new Uint8Array(buffer);
        case TYPE_UINT8CLAMPEDARRAY:
            return new Uint8ClampedArray(buffer);
        case TYPE_INT16ARRAY:
            return new Int16Array(buffer);
        case TYPE_UINT16ARRAY:
            return new Uint16Array(buffer);
        case TYPE_INT32ARRAY:
            return new Int32Array(buffer);
        case TYPE_UINT32ARRAY:
            return new Uint32Array(buffer);
        case TYPE_FLOAT32ARRAY:
            return new Float32Array(buffer);
        case TYPE_FLOAT64ARRAY:
            return new Float64Array(buffer);
        default:
            throw new Error('Unkown type: ' + type);
    }
}

var localforageSerializer = {
    serialize: serialize,
    deserialize: deserialize,
    stringToBuffer: stringToBuffer,
    bufferToString: bufferToString
};

/*
 * Includes code from:
 *
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */

function createDbTable(t, dbInfo, callback, errorCallback) {
    t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' ' + '(id INTEGER PRIMARY KEY, key unique, value)', [], callback, errorCallback);
}

// Open the WebSQL database (automatically creates one if one didn't
// previously exist), using any options set in the config.
function _initStorage$1(options) {
    var self = this;
    var dbInfo = {
        db: null
    };

    if (options) {
        for (var i in options) {
            dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
        }
    }

    var dbInfoPromise = new Promise$1(function (resolve, reject) {
        // Open the database; the openDatabase API will automatically
        // create it for us if it doesn't exist.
        try {
            dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
        } catch (e) {
            return reject(e);
        }

        // Create our key/value table if it doesn't exist.
        dbInfo.db.transaction(function (t) {
            createDbTable(t, dbInfo, function () {
                self._dbInfo = dbInfo;
                resolve();
            }, function (t, error) {
                reject(error);
            });
        }, reject);
    });

    dbInfo.serializer = localforageSerializer;
    return dbInfoPromise;
}

function tryExecuteSql(t, dbInfo, sqlStatement, args, callback, errorCallback) {
    t.executeSql(sqlStatement, args, callback, function (t, error) {
        if (error.code === error.SYNTAX_ERR) {
            t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name = ?", [dbInfo.storeName], function (t, results) {
                if (!results.rows.length) {
                    // if the table is missing (was deleted)
                    // re-create it table and retry
                    createDbTable(t, dbInfo, function () {
                        t.executeSql(sqlStatement, args, callback, errorCallback);
                    }, errorCallback);
                } else {
                    errorCallback(t, error);
                }
            }, errorCallback);
        } else {
            errorCallback(t, error);
        }
    }, errorCallback);
}

function getItem$1(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function (t, results) {
                    var result = results.rows.length ? results.rows.item(0).value : null;

                    // Check to see if this is serialized content we need to
                    // unpack.
                    if (result) {
                        result = dbInfo.serializer.deserialize(result);
                    }

                    resolve(result);
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function iterate$1(iterator, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;

            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName, [], function (t, results) {
                    var rows = results.rows;
                    var length = rows.length;

                    for (var i = 0; i < length; i++) {
                        var item = rows.item(i);
                        var result = item.value;

                        // Check to see if this is serialized content
                        // we need to unpack.
                        if (result) {
                            result = dbInfo.serializer.deserialize(result);
                        }

                        result = iterator(result, item.key, i + 1);

                        // void(0) prevents problems with redefinition
                        // of `undefined`.
                        if (result !== void 0) {
                            resolve(result);
                            return;
                        }
                    }

                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function _setItem(key, value, callback, retriesLeft) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            // The localStorage API doesn't return undefined values in an
            // "expected" way, so undefined is always cast to null in all
            // drivers. See: https://github.com/mozilla/localForage/pull/42
            if (value === undefined) {
                value = null;
            }

            // Save the original value to pass to the callback.
            var originalValue = value;

            var dbInfo = self._dbInfo;
            dbInfo.serializer.serialize(value, function (value, error) {
                if (error) {
                    reject(error);
                } else {
                    dbInfo.db.transaction(function (t) {
                        tryExecuteSql(t, dbInfo, 'INSERT OR REPLACE INTO ' + dbInfo.storeName + ' ' + '(key, value) VALUES (?, ?)', [key, value], function () {
                            resolve(originalValue);
                        }, function (t, error) {
                            reject(error);
                        });
                    }, function (sqlError) {
                        // The transaction failed; check
                        // to see if it's a quota error.
                        if (sqlError.code === sqlError.QUOTA_ERR) {
                            // We reject the callback outright for now, but
                            // it's worth trying to re-run the transaction.
                            // Even if the user accepts the prompt to use
                            // more storage on Safari, this error will
                            // be called.
                            //
                            // Try to re-run the transaction.
                            if (retriesLeft > 0) {
                                resolve(_setItem.apply(self, [key, originalValue, callback, retriesLeft - 1]));
                                return;
                            }
                            reject(sqlError);
                        }
                    });
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function setItem$1(key, value, callback) {
    return _setItem.apply(this, [key, value, callback, 1]);
}

function removeItem$1(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function () {
                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Deletes every item in the table.
// TODO: Find out if this resets the AUTO_INCREMENT number.
function clear$1(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName, [], function () {
                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Does a simple `COUNT(key)` to get the number of items stored in
// localForage.
function length$1(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                // Ahhh, SQL makes this one soooooo easy.
                tryExecuteSql(t, dbInfo, 'SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function (t, results) {
                    var result = results.rows.item(0).c;
                    resolve(result);
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Return the key located at key index X; essentially gets the key from a
// `WHERE id = ?`. This is the most efficient way I can think to implement
// this rarely-used (in my experience) part of the API, but it can seem
// inconsistent, because we do `INSERT OR REPLACE INTO` on `setItem()`, so
// the ID of each key will change every time it's updated. Perhaps a stored
// procedure for the `setItem()` SQL would solve this problem?
// TODO: Don't change ID on `setItem()`.
function key$1(n, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function (t, results) {
                    var result = results.rows.length ? results.rows.item(0).key : null;
                    resolve(result);
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function keys$1(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName, [], function (t, results) {
                    var keys = [];

                    for (var i = 0; i < results.rows.length; i++) {
                        keys.push(results.rows.item(i).key);
                    }

                    resolve(keys);
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// https://www.w3.org/TR/webdatabase/#databases
// > There is no way to enumerate or delete the databases available for an origin from this API.
function getAllStoreNames(db) {
    return new Promise$1(function (resolve, reject) {
        db.transaction(function (t) {
            t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function (t, results) {
                var storeNames = [];

                for (var i = 0; i < results.rows.length; i++) {
                    storeNames.push(results.rows.item(i).name);
                }

                resolve({
                    db: db,
                    storeNames: storeNames
                });
            }, function (t, error) {
                reject(error);
            });
        }, function (sqlError) {
            reject(sqlError);
        });
    });
}

function dropInstance$1(options, callback) {
    callback = getCallback.apply(this, arguments);

    var currentConfig = this.config();
    options = typeof options !== 'function' && options || {};
    if (!options.name) {
        options.name = options.name || currentConfig.name;
        options.storeName = options.storeName || currentConfig.storeName;
    }

    var self = this;
    var promise;
    if (!options.name) {
        promise = Promise$1.reject('Invalid arguments');
    } else {
        promise = new Promise$1(function (resolve) {
            var db;
            if (options.name === currentConfig.name) {
                // use the db reference of the current instance
                db = self._dbInfo.db;
            } else {
                db = openDatabase(options.name, '', '', 0);
            }

            if (!options.storeName) {
                // drop all database tables
                resolve(getAllStoreNames(db));
            } else {
                resolve({
                    db: db,
                    storeNames: [options.storeName]
                });
            }
        }).then(function (operationInfo) {
            return new Promise$1(function (resolve, reject) {
                operationInfo.db.transaction(function (t) {
                    function dropTable(storeName) {
                        return new Promise$1(function (resolve, reject) {
                            t.executeSql('DROP TABLE IF EXISTS ' + storeName, [], function () {
                                resolve();
                            }, function (t, error) {
                                reject(error);
                            });
                        });
                    }

                    var operations = [];
                    for (var i = 0, len = operationInfo.storeNames.length; i < len; i++) {
                        operations.push(dropTable(operationInfo.storeNames[i]));
                    }

                    Promise$1.all(operations).then(function () {
                        resolve();
                    })["catch"](function (e) {
                        reject(e);
                    });
                }, function (sqlError) {
                    reject(sqlError);
                });
            });
        });
    }

    executeCallback(promise, callback);
    return promise;
}

var webSQLStorage = {
    _driver: 'webSQLStorage',
    _initStorage: _initStorage$1,
    _support: isWebSQLValid(),
    iterate: iterate$1,
    getItem: getItem$1,
    setItem: setItem$1,
    removeItem: removeItem$1,
    clear: clear$1,
    length: length$1,
    key: key$1,
    keys: keys$1,
    dropInstance: dropInstance$1
};

function isLocalStorageValid() {
    try {
        return typeof localStorage !== 'undefined' && 'setItem' in localStorage &&
        // in IE8 typeof localStorage.setItem === 'object'
        !!localStorage.setItem;
    } catch (e) {
        return false;
    }
}

function _getKeyPrefix(options, defaultConfig) {
    var keyPrefix = options.name + '/';

    if (options.storeName !== defaultConfig.storeName) {
        keyPrefix += options.storeName + '/';
    }
    return keyPrefix;
}

// Check if localStorage throws when saving an item
function checkIfLocalStorageThrows() {
    var localStorageTestKey = '_localforage_support_test';

    try {
        localStorage.setItem(localStorageTestKey, true);
        localStorage.removeItem(localStorageTestKey);

        return false;
    } catch (e) {
        return true;
    }
}

// Check if localStorage is usable and allows to save an item
// This method checks if localStorage is usable in Safari Private Browsing
// mode, or in any other case where the available quota for localStorage
// is 0 and there wasn't any saved items yet.
function _isLocalStorageUsable() {
    return !checkIfLocalStorageThrows() || localStorage.length > 0;
}

// Config the localStorage backend, using options set in the config.
function _initStorage$2(options) {
    var self = this;
    var dbInfo = {};
    if (options) {
        for (var i in options) {
            dbInfo[i] = options[i];
        }
    }

    dbInfo.keyPrefix = _getKeyPrefix(options, self._defaultConfig);

    if (!_isLocalStorageUsable()) {
        return Promise$1.reject();
    }

    self._dbInfo = dbInfo;
    dbInfo.serializer = localforageSerializer;

    return Promise$1.resolve();
}

// Remove all keys from the datastore, effectively destroying all data in
// the app's key/value store!
function clear$2(callback) {
    var self = this;
    var promise = self.ready().then(function () {
        var keyPrefix = self._dbInfo.keyPrefix;

        for (var i = localStorage.length - 1; i >= 0; i--) {
            var key = localStorage.key(i);

            if (key.indexOf(keyPrefix) === 0) {
                localStorage.removeItem(key);
            }
        }
    });

    executeCallback(promise, callback);
    return promise;
}

// Retrieve an item from the store. Unlike the original async_storage
// library in Gaia, we don't modify return values at all. If a key's value
// is `undefined`, we pass that value to the callback function.
function getItem$2(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var result = localStorage.getItem(dbInfo.keyPrefix + key);

        // If a result was found, parse it from the serialized
        // string into a JS object. If result isn't truthy, the key
        // is likely undefined and we'll pass it straight to the
        // callback.
        if (result) {
            result = dbInfo.serializer.deserialize(result);
        }

        return result;
    });

    executeCallback(promise, callback);
    return promise;
}

// Iterate over all items in the store.
function iterate$2(iterator, callback) {
    var self = this;

    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var keyPrefix = dbInfo.keyPrefix;
        var keyPrefixLength = keyPrefix.length;
        var length = localStorage.length;

        // We use a dedicated iterator instead of the `i` variable below
        // so other keys we fetch in localStorage aren't counted in
        // the `iterationNumber` argument passed to the `iterate()`
        // callback.
        //
        // See: github.com/mozilla/localForage/pull/435#discussion_r38061530
        var iterationNumber = 1;

        for (var i = 0; i < length; i++) {
            var key = localStorage.key(i);
            if (key.indexOf(keyPrefix) !== 0) {
                continue;
            }
            var value = localStorage.getItem(key);

            // If a result was found, parse it from the serialized
            // string into a JS object. If result isn't truthy, the
            // key is likely undefined and we'll pass it straight
            // to the iterator.
            if (value) {
                value = dbInfo.serializer.deserialize(value);
            }

            value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);

            if (value !== void 0) {
                return value;
            }
        }
    });

    executeCallback(promise, callback);
    return promise;
}

// Same as localStorage's key() method, except takes a callback.
function key$2(n, callback) {
    var self = this;
    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var result;
        try {
            result = localStorage.key(n);
        } catch (error) {
            result = null;
        }

        // Remove the prefix from the key, if a key is found.
        if (result) {
            result = result.substring(dbInfo.keyPrefix.length);
        }

        return result;
    });

    executeCallback(promise, callback);
    return promise;
}

function keys$2(callback) {
    var self = this;
    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var length = localStorage.length;
        var keys = [];

        for (var i = 0; i < length; i++) {
            var itemKey = localStorage.key(i);
            if (itemKey.indexOf(dbInfo.keyPrefix) === 0) {
                keys.push(itemKey.substring(dbInfo.keyPrefix.length));
            }
        }

        return keys;
    });

    executeCallback(promise, callback);
    return promise;
}

// Supply the number of keys in the datastore to the callback function.
function length$2(callback) {
    var self = this;
    var promise = self.keys().then(function (keys) {
        return keys.length;
    });

    executeCallback(promise, callback);
    return promise;
}

// Remove an item from the store, nice and simple.
function removeItem$2(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        localStorage.removeItem(dbInfo.keyPrefix + key);
    });

    executeCallback(promise, callback);
    return promise;
}

// Set a key's value and run an optional callback once the value is set.
// Unlike Gaia's implementation, the callback function is passed the value,
// in case you want to operate on that value only after you're sure it
// saved, or something like that.
function setItem$2(key, value, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = self.ready().then(function () {
        // Convert undefined values to null.
        // https://github.com/mozilla/localForage/pull/42
        if (value === undefined) {
            value = null;
        }

        // Save the original value to pass to the callback.
        var originalValue = value;

        return new Promise$1(function (resolve, reject) {
            var dbInfo = self._dbInfo;
            dbInfo.serializer.serialize(value, function (value, error) {
                if (error) {
                    reject(error);
                } else {
                    try {
                        localStorage.setItem(dbInfo.keyPrefix + key, value);
                        resolve(originalValue);
                    } catch (e) {
                        // localStorage capacity exceeded.
                        // TODO: Make this a specific error/event.
                        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                            reject(e);
                        }
                        reject(e);
                    }
                }
            });
        });
    });

    executeCallback(promise, callback);
    return promise;
}

function dropInstance$2(options, callback) {
    callback = getCallback.apply(this, arguments);

    options = typeof options !== 'function' && options || {};
    if (!options.name) {
        var currentConfig = this.config();
        options.name = options.name || currentConfig.name;
        options.storeName = options.storeName || currentConfig.storeName;
    }

    var self = this;
    var promise;
    if (!options.name) {
        promise = Promise$1.reject('Invalid arguments');
    } else {
        promise = new Promise$1(function (resolve) {
            if (!options.storeName) {
                resolve(options.name + '/');
            } else {
                resolve(_getKeyPrefix(options, self._defaultConfig));
            }
        }).then(function (keyPrefix) {
            for (var i = localStorage.length - 1; i >= 0; i--) {
                var key = localStorage.key(i);

                if (key.indexOf(keyPrefix) === 0) {
                    localStorage.removeItem(key);
                }
            }
        });
    }

    executeCallback(promise, callback);
    return promise;
}

var localStorageWrapper = {
    _driver: 'localStorageWrapper',
    _initStorage: _initStorage$2,
    _support: isLocalStorageValid(),
    iterate: iterate$2,
    getItem: getItem$2,
    setItem: setItem$2,
    removeItem: removeItem$2,
    clear: clear$2,
    length: length$2,
    key: key$2,
    keys: keys$2,
    dropInstance: dropInstance$2
};

var sameValue = function sameValue(x, y) {
    return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
};

var includes = function includes(array, searchElement) {
    var len = array.length;
    var i = 0;
    while (i < len) {
        if (sameValue(array[i], searchElement)) {
            return true;
        }
        i++;
    }

    return false;
};

var isArray = Array.isArray || function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
};

// Drivers are stored here when `defineDriver()` is called.
// They are shared across all instances of localForage.
var DefinedDrivers = {};

var DriverSupport = {};

var DefaultDrivers = {
    INDEXEDDB: asyncStorage,
    WEBSQL: webSQLStorage,
    LOCALSTORAGE: localStorageWrapper
};

var DefaultDriverOrder = [DefaultDrivers.INDEXEDDB._driver, DefaultDrivers.WEBSQL._driver, DefaultDrivers.LOCALSTORAGE._driver];

var OptionalDriverMethods = ['dropInstance'];

var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'].concat(OptionalDriverMethods);

var DefaultConfig = {
    description: '',
    driver: DefaultDriverOrder.slice(),
    name: 'localforage',
    // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
    // we can use without a prompt.
    size: 4980736,
    storeName: 'keyvaluepairs',
    version: 1.0
};

function callWhenReady(localForageInstance, libraryMethod) {
    localForageInstance[libraryMethod] = function () {
        var _args = arguments;
        return localForageInstance.ready().then(function () {
            return localForageInstance[libraryMethod].apply(localForageInstance, _args);
        });
    };
}

function extend() {
    for (var i = 1; i < arguments.length; i++) {
        var arg = arguments[i];

        if (arg) {
            for (var _key in arg) {
                if (arg.hasOwnProperty(_key)) {
                    if (isArray(arg[_key])) {
                        arguments[0][_key] = arg[_key].slice();
                    } else {
                        arguments[0][_key] = arg[_key];
                    }
                }
            }
        }
    }

    return arguments[0];
}

var LocalForage = function () {
    function LocalForage(options) {
        _classCallCheck(this, LocalForage);

        for (var driverTypeKey in DefaultDrivers) {
            if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
                var driver = DefaultDrivers[driverTypeKey];
                var driverName = driver._driver;
                this[driverTypeKey] = driverName;

                if (!DefinedDrivers[driverName]) {
                    // we don't need to wait for the promise,
                    // since the default drivers can be defined
                    // in a blocking manner
                    this.defineDriver(driver);
                }
            }
        }

        this._defaultConfig = extend({}, DefaultConfig);
        this._config = extend({}, this._defaultConfig, options);
        this._driverSet = null;
        this._initDriver = null;
        this._ready = false;
        this._dbInfo = null;

        this._wrapLibraryMethodsWithReady();
        this.setDriver(this._config.driver)["catch"](function () {});
    }

    // Set any config values for localForage; can be called anytime before
    // the first API call (e.g. `getItem`, `setItem`).
    // We loop through options so we don't overwrite existing config
    // values.


    LocalForage.prototype.config = function config(options) {
        // If the options argument is an object, we use it to set values.
        // Otherwise, we return either a specified config value or all
        // config values.
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
            // If localforage is ready and fully initialized, we can't set
            // any new configuration values. Instead, we return an error.
            if (this._ready) {
                return new Error("Can't call config() after localforage " + 'has been used.');
            }

            for (var i in options) {
                if (i === 'storeName') {
                    options[i] = options[i].replace(/\W/g, '_');
                }

                if (i === 'version' && typeof options[i] !== 'number') {
                    return new Error('Database version must be a number.');
                }

                this._config[i] = options[i];
            }

            // after all config options are set and
            // the driver option is used, try setting it
            if ('driver' in options && options.driver) {
                return this.setDriver(this._config.driver);
            }

            return true;
        } else if (typeof options === 'string') {
            return this._config[options];
        } else {
            return this._config;
        }
    };

    // Used to define a custom driver, shared across all instances of
    // localForage.


    LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
        var promise = new Promise$1(function (resolve, reject) {
            try {
                var driverName = driverObject._driver;
                var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');

                // A driver name should be defined and not overlap with the
                // library-defined, default drivers.
                if (!driverObject._driver) {
                    reject(complianceError);
                    return;
                }

                var driverMethods = LibraryMethods.concat('_initStorage');
                for (var i = 0, len = driverMethods.length; i < len; i++) {
                    var driverMethodName = driverMethods[i];

                    // when the property is there,
                    // it should be a method even when optional
                    var isRequired = !includes(OptionalDriverMethods, driverMethodName);
                    if ((isRequired || driverObject[driverMethodName]) && typeof driverObject[driverMethodName] !== 'function') {
                        reject(complianceError);
                        return;
                    }
                }

                var configureMissingMethods = function configureMissingMethods() {
                    var methodNotImplementedFactory = function methodNotImplementedFactory(methodName) {
                        return function () {
                            var error = new Error('Method ' + methodName + ' is not implemented by the current driver');
                            var promise = Promise$1.reject(error);
                            executeCallback(promise, arguments[arguments.length - 1]);
                            return promise;
                        };
                    };

                    for (var _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
                        var optionalDriverMethod = OptionalDriverMethods[_i];
                        if (!driverObject[optionalDriverMethod]) {
                            driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod);
                        }
                    }
                };

                configureMissingMethods();

                var setDriverSupport = function setDriverSupport(support) {
                    if (DefinedDrivers[driverName]) {
                        console.info('Redefining LocalForage driver: ' + driverName);
                    }
                    DefinedDrivers[driverName] = driverObject;
                    DriverSupport[driverName] = support;
                    // don't use a then, so that we can define
                    // drivers that have simple _support methods
                    // in a blocking manner
                    resolve();
                };

                if ('_support' in driverObject) {
                    if (driverObject._support && typeof driverObject._support === 'function') {
                        driverObject._support().then(setDriverSupport, reject);
                    } else {
                        setDriverSupport(!!driverObject._support);
                    }
                } else {
                    setDriverSupport(true);
                }
            } catch (e) {
                reject(e);
            }
        });

        executeTwoCallbacks(promise, callback, errorCallback);
        return promise;
    };

    LocalForage.prototype.driver = function driver() {
        return this._driver || null;
    };

    LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
        var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(new Error('Driver not found.'));

        executeTwoCallbacks(getDriverPromise, callback, errorCallback);
        return getDriverPromise;
    };

    LocalForage.prototype.getSerializer = function getSerializer(callback) {
        var serializerPromise = Promise$1.resolve(localforageSerializer);
        executeTwoCallbacks(serializerPromise, callback);
        return serializerPromise;
    };

    LocalForage.prototype.ready = function ready(callback) {
        var self = this;

        var promise = self._driverSet.then(function () {
            if (self._ready === null) {
                self._ready = self._initDriver();
            }

            return self._ready;
        });

        executeTwoCallbacks(promise, callback, callback);
        return promise;
    };

    LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
        var self = this;

        if (!isArray(drivers)) {
            drivers = [drivers];
        }

        var supportedDrivers = this._getSupportedDrivers(drivers);

        function setDriverToConfig() {
            self._config.driver = self.driver();
        }

        function extendSelfWithDriver(driver) {
            self._extend(driver);
            setDriverToConfig();

            self._ready = self._initStorage(self._config);
            return self._ready;
        }

        function initDriver(supportedDrivers) {
            return function () {
                var currentDriverIndex = 0;

                function driverPromiseLoop() {
                    while (currentDriverIndex < supportedDrivers.length) {
                        var driverName = supportedDrivers[currentDriverIndex];
                        currentDriverIndex++;

                        self._dbInfo = null;
                        self._ready = null;

                        return self.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
                    }

                    setDriverToConfig();
                    var error = new Error('No available storage method found.');
                    self._driverSet = Promise$1.reject(error);
                    return self._driverSet;
                }

                return driverPromiseLoop();
            };
        }

        // There might be a driver initialization in progress
        // so wait for it to finish in order to avoid a possible
        // race condition to set _dbInfo
        var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function () {
            return Promise$1.resolve();
        }) : Promise$1.resolve();

        this._driverSet = oldDriverSetDone.then(function () {
            var driverName = supportedDrivers[0];
            self._dbInfo = null;
            self._ready = null;

            return self.getDriver(driverName).then(function (driver) {
                self._driver = driver._driver;
                setDriverToConfig();
                self._wrapLibraryMethodsWithReady();
                self._initDriver = initDriver(supportedDrivers);
            });
        })["catch"](function () {
            setDriverToConfig();
            var error = new Error('No available storage method found.');
            self._driverSet = Promise$1.reject(error);
            return self._driverSet;
        });

        executeTwoCallbacks(this._driverSet, callback, errorCallback);
        return this._driverSet;
    };

    LocalForage.prototype.supports = function supports(driverName) {
        return !!DriverSupport[driverName];
    };

    LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
        extend(this, libraryMethodsAndProperties);
    };

    LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
        var supportedDrivers = [];
        for (var i = 0, len = drivers.length; i < len; i++) {
            var driverName = drivers[i];
            if (this.supports(driverName)) {
                supportedDrivers.push(driverName);
            }
        }
        return supportedDrivers;
    };

    LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
        // Add a stub for each driver API method that delays the call to the
        // corresponding driver method until localForage is ready. These stubs
        // will be replaced by the driver methods as soon as the driver is
        // loaded, so there is no performance impact.
        for (var i = 0, len = LibraryMethods.length; i < len; i++) {
            callWhenReady(this, LibraryMethods[i]);
        }
    };

    LocalForage.prototype.createInstance = function createInstance(options) {
        return new LocalForage(options);
    };

    return LocalForage;
}();

// The actual localForage object that we expose as a module or via a
// global. It's extended by pulling in one of our other libraries.


var localforage_js = new LocalForage();

module.exports = localforage_js;

},{"3":3}]},{},[4])(4)
});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],63:[function(require,module,exports){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.MiniSearch = factory());
})(this, (function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    /** @ignore */
    var ENTRIES = 'ENTRIES';
    /** @ignore */
    var KEYS = 'KEYS';
    /** @ignore */
    var VALUES = 'VALUES';
    /** @ignore */
    var LEAF = '';
    /**
     * @private
     */
    var TreeIterator = /** @class */ (function () {
        function TreeIterator(set, type) {
            var node = set._tree;
            var keys = Array.from(node.keys());
            this.set = set;
            this._type = type;
            this._path = keys.length > 0 ? [{ node: node, keys: keys }] : [];
        }
        TreeIterator.prototype.next = function () {
            var value = this.dive();
            this.backtrack();
            return value;
        };
        TreeIterator.prototype.dive = function () {
            if (this._path.length === 0) {
                return { done: true, value: undefined };
            }
            var _a = last$1(this._path), node = _a.node, keys = _a.keys;
            if (last$1(keys) === LEAF) {
                return { done: false, value: this.result() };
            }
            var child = node.get(last$1(keys));
            this._path.push({ node: child, keys: Array.from(child.keys()) });
            return this.dive();
        };
        TreeIterator.prototype.backtrack = function () {
            if (this._path.length === 0) {
                return;
            }
            var keys = last$1(this._path).keys;
            keys.pop();
            if (keys.length > 0) {
                return;
            }
            this._path.pop();
            this.backtrack();
        };
        TreeIterator.prototype.key = function () {
            return this.set._prefix + this._path
                .map(function (_a) {
                var keys = _a.keys;
                return last$1(keys);
            })
                .filter(function (key) { return key !== LEAF; })
                .join('');
        };
        TreeIterator.prototype.value = function () {
            return last$1(this._path).node.get(LEAF);
        };
        TreeIterator.prototype.result = function () {
            switch (this._type) {
                case VALUES: return this.value();
                case KEYS: return this.key();
                default: return [this.key(), this.value()];
            }
        };
        TreeIterator.prototype[Symbol.iterator] = function () {
            return this;
        };
        return TreeIterator;
    }());
    var last$1 = function (array) {
        return array[array.length - 1];
    };

    /**
     * @ignore
     */
    var fuzzySearch = function (node, query, maxDistance) {
        var results = new Map();
        if (query === undefined)
            return results;
        // Number of columns in the Levenshtein matrix.
        var n = query.length + 1;
        // Matching terms can never be longer than N + maxDistance.
        var m = n + maxDistance;
        // Fill first matrix row and column with numbers: 0 1 2 3 ...
        var matrix = new Uint8Array(m * n).fill(maxDistance + 1);
        for (var j = 0; j < n; ++j)
            matrix[j] = j;
        for (var i = 1; i < m; ++i)
            matrix[i * n] = i;
        recurse(node, query, maxDistance, results, matrix, 1, n, '');
        return results;
    };
    // Modified version of http://stevehanov.ca/blog/?id=114
    // This builds a Levenshtein matrix for a given query and continuously updates
    // it for nodes in the radix tree that fall within the given maximum edit
    // distance. Keeping the same matrix around is beneficial especially for larger
    // edit distances.
    //
    //           k   a   t   e   <-- query
    //       0   1   2   3   4
    //   c   1   1   2   3   4
    //   a   2   2   1   2   3
    //   t   3   3   2   1  [2]  <-- edit distance
    //   ^
    //   ^ term in radix tree, rows are added and removed as needed
    var recurse = function (node, query, maxDistance, results, matrix, m, n, prefix) {
        var e_1, _a;
        var offset = m * n;
        try {
            key: for (var _b = __values(node.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                if (key === LEAF) {
                    // We've reached a leaf node. Check if the edit distance acceptable and
                    // store the result if it is.
                    var distance = matrix[offset - 1];
                    if (distance <= maxDistance) {
                        results.set(prefix, [node.get(key), distance]);
                    }
                }
                else {
                    // Iterate over all characters in the key. Update the Levenshtein matrix
                    // and check if the minimum distance in the last row is still within the
                    // maximum edit distance. If it is, we can recurse over all child nodes.
                    var i = m;
                    for (var pos = 0; pos < key.length; ++pos, ++i) {
                        var char = key[pos];
                        var thisRowOffset = n * i;
                        var prevRowOffset = thisRowOffset - n;
                        // Set the first column based on the previous row, and initialize the
                        // minimum distance in the current row.
                        var minDistance = matrix[thisRowOffset];
                        var jmin = Math.max(0, i - maxDistance - 1);
                        var jmax = Math.min(n - 1, i + maxDistance);
                        // Iterate over remaining columns (characters in the query).
                        for (var j = jmin; j < jmax; ++j) {
                            var different = char !== query[j];
                            // It might make sense to only read the matrix positions used for
                            // deletion/insertion if the characters are different. But we want to
                            // avoid conditional reads for performance reasons.
                            var rpl = matrix[prevRowOffset + j] + +different;
                            var del = matrix[prevRowOffset + j + 1] + 1;
                            var ins = matrix[thisRowOffset + j] + 1;
                            var dist = matrix[thisRowOffset + j + 1] = Math.min(rpl, del, ins);
                            if (dist < minDistance)
                                minDistance = dist;
                        }
                        // Because distance will never decrease, we can stop. There will be no
                        // matching child nodes.
                        if (minDistance > maxDistance) {
                            continue key;
                        }
                    }
                    recurse(node.get(key), query, maxDistance, results, matrix, i, n, prefix + key);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };

    /**
     * A class implementing the same interface as a standard JavaScript
     * [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
     * with string keys, but adding support for efficiently searching entries with
     * prefix or fuzzy search. This class is used internally by [[MiniSearch]] as
     * the inverted index data structure. The implementation is a radix tree
     * (compressed prefix tree).
     *
     * Since this class can be of general utility beyond _MiniSearch_, it is
     * exported by the `minisearch` package and can be imported (or required) as
     * `minisearch/SearchableMap`.
     *
     * @typeParam T  The type of the values stored in the map.
     */
    var SearchableMap = /** @class */ (function () {
        /**
         * The constructor is normally called without arguments, creating an empty
         * map. In order to create a [[SearchableMap]] from an iterable or from an
         * object, check [[SearchableMap.from]] and [[SearchableMap.fromObject]].
         *
         * The constructor arguments are for internal use, when creating derived
         * mutable views of a map at a prefix.
         */
        function SearchableMap(tree, prefix) {
            if (tree === void 0) { tree = new Map(); }
            if (prefix === void 0) { prefix = ''; }
            this._size = undefined;
            this._tree = tree;
            this._prefix = prefix;
        }
        /**
         * Creates and returns a mutable view of this [[SearchableMap]], containing only
         * entries that share the given prefix.
         *
         * ### Usage:
         *
         * ```javascript
         * let map = new SearchableMap()
         * map.set("unicorn", 1)
         * map.set("universe", 2)
         * map.set("university", 3)
         * map.set("unique", 4)
         * map.set("hello", 5)
         *
         * let uni = map.atPrefix("uni")
         * uni.get("unique") // => 4
         * uni.get("unicorn") // => 1
         * uni.get("hello") // => undefined
         *
         * let univer = map.atPrefix("univer")
         * univer.get("unique") // => undefined
         * univer.get("universe") // => 2
         * univer.get("university") // => 3
         * ```
         *
         * @param prefix  The prefix
         * @return A [[SearchableMap]] representing a mutable view of the original Map at the given prefix
         */
        SearchableMap.prototype.atPrefix = function (prefix) {
            var e_1, _a;
            if (!prefix.startsWith(this._prefix)) {
                throw new Error('Mismatched prefix');
            }
            var _b = __read(trackDown(this._tree, prefix.slice(this._prefix.length)), 2), node = _b[0], path = _b[1];
            if (node === undefined) {
                var _c = __read(last(path), 2), parentNode = _c[0], key = _c[1];
                try {
                    for (var _d = __values(parentNode.keys()), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var k = _e.value;
                        if (k !== LEAF && k.startsWith(key)) {
                            var node_1 = new Map();
                            node_1.set(k.slice(key.length), parentNode.get(k));
                            return new SearchableMap(node_1, prefix);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            return new SearchableMap(node, prefix);
        };
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear
         */
        SearchableMap.prototype.clear = function () {
            this._size = undefined;
            this._tree.clear();
        };
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete
         * @param key  Key to delete
         */
        SearchableMap.prototype.delete = function (key) {
            this._size = undefined;
            return remove(this._tree, key);
        };
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries
         * @return An iterator iterating through `[key, value]` entries.
         */
        SearchableMap.prototype.entries = function () {
            return new TreeIterator(this, ENTRIES);
        };
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach
         * @param fn  Iteration function
         */
        SearchableMap.prototype.forEach = function (fn) {
            var e_2, _a;
            try {
                for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                    fn(key, value, this);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
        /**
         * Returns a Map of all the entries that have a key within the given edit
         * distance from the search key. The keys of the returned Map are the matching
         * keys, while the values are two-element arrays where the first element is
         * the value associated to the key, and the second is the edit distance of the
         * key to the search key.
         *
         * ### Usage:
         *
         * ```javascript
         * let map = new SearchableMap()
         * map.set('hello', 'world')
         * map.set('hell', 'yeah')
         * map.set('ciao', 'mondo')
         *
         * // Get all entries that match the key 'hallo' with a maximum edit distance of 2
         * map.fuzzyGet('hallo', 2)
         * // => Map(2) { 'hello' => ['world', 1], 'hell' => ['yeah', 2] }
         *
         * // In the example, the "hello" key has value "world" and edit distance of 1
         * // (change "e" to "a"), the key "hell" has value "yeah" and edit distance of 2
         * // (change "e" to "a", delete "o")
         * ```
         *
         * @param key  The search key
         * @param maxEditDistance  The maximum edit distance (Levenshtein)
         * @return A Map of the matching keys to their value and edit distance
         */
        SearchableMap.prototype.fuzzyGet = function (key, maxEditDistance) {
            return fuzzySearch(this._tree, key, maxEditDistance);
        };
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get
         * @param key  Key to get
         * @return Value associated to the key, or `undefined` if the key is not
         * found.
         */
        SearchableMap.prototype.get = function (key) {
            var node = lookup(this._tree, key);
            return node !== undefined ? node.get(LEAF) : undefined;
        };
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has
         * @param key  Key
         * @return True if the key is in the map, false otherwise
         */
        SearchableMap.prototype.has = function (key) {
            var node = lookup(this._tree, key);
            return node !== undefined && node.has(LEAF);
        };
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys
         * @return An `Iterable` iterating through keys
         */
        SearchableMap.prototype.keys = function () {
            return new TreeIterator(this, KEYS);
        };
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set
         * @param key  Key to set
         * @param value  Value to associate to the key
         * @return The [[SearchableMap]] itself, to allow chaining
         */
        SearchableMap.prototype.set = function (key, value) {
            if (typeof key !== 'string') {
                throw new Error('key must be a string');
            }
            this._size = undefined;
            var node = createPath(this._tree, key);
            node.set(LEAF, value);
            return this;
        };
        Object.defineProperty(SearchableMap.prototype, "size", {
            /**
             * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/size
             */
            get: function () {
                if (this._size) {
                    return this._size;
                }
                /** @ignore */
                this._size = 0;
                var iter = this.entries();
                while (!iter.next().done)
                    this._size += 1;
                return this._size;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Updates the value at the given key using the provided function. The function
         * is called with the current value at the key, and its return value is used as
         * the new value to be set.
         *
         * ### Example:
         *
         * ```javascript
         * // Increment the current value by one
         * searchableMap.update('somekey', (currentValue) => currentValue == null ? 0 : currentValue + 1)
         * ```
         *
         * If the value at the given key is or will be an object, it might not require
         * re-assignment. In that case it is better to use `fetch()`, because it is
         * faster.
         *
         * @param key  The key to update
         * @param fn  The function used to compute the new value from the current one
         * @return The [[SearchableMap]] itself, to allow chaining
         */
        SearchableMap.prototype.update = function (key, fn) {
            if (typeof key !== 'string') {
                throw new Error('key must be a string');
            }
            this._size = undefined;
            var node = createPath(this._tree, key);
            node.set(LEAF, fn(node.get(LEAF)));
            return this;
        };
        /**
         * Fetches the value of the given key. If the value does not exist, calls the
         * given function to create a new value, which is inserted at the given key
         * and subsequently returned.
         *
         * ### Example:
         *
         * ```javascript
         * const map = searchableMap.fetch('somekey', () => new Map())
         * map.set('foo', 'bar')
         * ```
         *
         * @param key  The key to update
         * @param defaultValue  A function that creates a new value if the key does not exist
         * @return The existing or new value at the given key
         */
        SearchableMap.prototype.fetch = function (key, initial) {
            if (typeof key !== 'string') {
                throw new Error('key must be a string');
            }
            this._size = undefined;
            var node = createPath(this._tree, key);
            var value = node.get(LEAF);
            if (value === undefined) {
                node.set(LEAF, value = initial());
            }
            return value;
        };
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values
         * @return An `Iterable` iterating through values.
         */
        SearchableMap.prototype.values = function () {
            return new TreeIterator(this, VALUES);
        };
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/@@iterator
         */
        SearchableMap.prototype[Symbol.iterator] = function () {
            return this.entries();
        };
        /**
         * Creates a [[SearchableMap]] from an `Iterable` of entries
         *
         * @param entries  Entries to be inserted in the [[SearchableMap]]
         * @return A new [[SearchableMap]] with the given entries
         */
        SearchableMap.from = function (entries) {
            var e_3, _a;
            var tree = new SearchableMap();
            try {
                for (var entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
                    var _b = __read(entries_1_1.value, 2), key = _b[0], value = _b[1];
                    tree.set(key, value);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return tree;
        };
        /**
         * Creates a [[SearchableMap]] from the iterable properties of a JavaScript object
         *
         * @param object  Object of entries for the [[SearchableMap]]
         * @return A new [[SearchableMap]] with the given entries
         */
        SearchableMap.fromObject = function (object) {
            return SearchableMap.from(Object.entries(object));
        };
        return SearchableMap;
    }());
    var trackDown = function (tree, key, path) {
        var e_4, _a;
        if (path === void 0) { path = []; }
        if (key.length === 0 || tree == null) {
            return [tree, path];
        }
        try {
            for (var _b = __values(tree.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var k = _c.value;
                if (k !== LEAF && key.startsWith(k)) {
                    path.push([tree, k]); // performance: update in place
                    return trackDown(tree.get(k), key.slice(k.length), path);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        path.push([tree, key]); // performance: update in place
        return trackDown(undefined, '', path);
    };
    var lookup = function (tree, key) {
        var e_5, _a;
        if (key.length === 0 || tree == null) {
            return tree;
        }
        try {
            for (var _b = __values(tree.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var k = _c.value;
                if (k !== LEAF && key.startsWith(k)) {
                    return lookup(tree.get(k), key.slice(k.length));
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
    };
    // Create a path in the radix tree for the given key, and returns the deepest
    // node. This function is in the hot path for indexing. It avoids unnecessary
    // string operations and recursion for performance.
    var createPath = function (node, key) {
        var e_6, _a;
        var keyLength = key.length;
        outer: for (var pos = 0; node && pos < keyLength;) {
            try {
                for (var _b = (e_6 = void 0, __values(node.keys())), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var k = _c.value;
                    // Check whether this key is a candidate: the first characters must match.
                    if (k !== LEAF && key[pos] === k[0]) {
                        var len = Math.min(keyLength - pos, k.length);
                        // Advance offset to the point where key and k no longer match.
                        var offset = 1;
                        while (offset < len && key[pos + offset] === k[offset])
                            ++offset;
                        var child_1 = node.get(k);
                        if (offset === k.length) {
                            // The existing key is shorter than the key we need to create.
                            node = child_1;
                        }
                        else {
                            // Partial match: we need to insert an intermediate node to contain
                            // both the existing subtree and the new node.
                            var intermediate = new Map();
                            intermediate.set(k.slice(offset), child_1);
                            node.set(key.slice(pos, pos + offset), intermediate);
                            node.delete(k);
                            node = intermediate;
                        }
                        pos += offset;
                        continue outer;
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
            // Create a final child node to contain the final suffix of the key.
            var child = new Map();
            node.set(key.slice(pos), child);
            return child;
        }
        return node;
    };
    var remove = function (tree, key) {
        var _a = __read(trackDown(tree, key), 2), node = _a[0], path = _a[1];
        if (node === undefined) {
            return;
        }
        node.delete(LEAF);
        if (node.size === 0) {
            cleanup(path);
        }
        else if (node.size === 1) {
            var _b = __read(node.entries().next().value, 2), key_1 = _b[0], value = _b[1];
            merge(path, key_1, value);
        }
    };
    var cleanup = function (path) {
        if (path.length === 0) {
            return;
        }
        var _a = __read(last(path), 2), node = _a[0], key = _a[1];
        node.delete(key);
        if (node.size === 0) {
            cleanup(path.slice(0, -1));
        }
        else if (node.size === 1) {
            var _b = __read(node.entries().next().value, 2), key_2 = _b[0], value = _b[1];
            if (key_2 !== LEAF) {
                merge(path.slice(0, -1), key_2, value);
            }
        }
    };
    var merge = function (path, key, value) {
        if (path.length === 0) {
            return;
        }
        var _a = __read(last(path), 2), node = _a[0], nodeKey = _a[1];
        node.set(nodeKey + key, value);
        node.delete(nodeKey);
    };
    var last = function (array) {
        return array[array.length - 1];
    };

    var _a;
    var OR = 'or';
    var AND = 'and';
    var AND_NOT = 'and_not';
    /**
     * [[MiniSearch]] is the main entrypoint class, implementing a full-text search
     * engine in memory.
     *
     * @typeParam T  The type of the documents being indexed.
     *
     * ### Basic example:
     *
     * ```javascript
     * const documents = [
     *   {
     *     id: 1,
     *     title: 'Moby Dick',
     *     text: 'Call me Ishmael. Some years ago...',
     *     category: 'fiction'
     *   },
     *   {
     *     id: 2,
     *     title: 'Zen and the Art of Motorcycle Maintenance',
     *     text: 'I can see by my watch...',
     *     category: 'fiction'
     *   },
     *   {
     *     id: 3,
     *     title: 'Neuromancer',
     *     text: 'The sky above the port was...',
     *     category: 'fiction'
     *   },
     *   {
     *     id: 4,
     *     title: 'Zen and the Art of Archery',
     *     text: 'At first sight it must seem...',
     *     category: 'non-fiction'
     *   },
     *   // ...and more
     * ]
     *
     * // Create a search engine that indexes the 'title' and 'text' fields for
     * // full-text search. Search results will include 'title' and 'category' (plus the
     * // id field, that is always stored and returned)
     * const miniSearch = new MiniSearch({
     *   fields: ['title', 'text'],
     *   storeFields: ['title', 'category']
     * })
     *
     * // Add documents to the index
     * miniSearch.addAll(documents)
     *
     * // Search for documents:
     * let results = miniSearch.search('zen art motorcycle')
     * // => [
     * //   { id: 2, title: 'Zen and the Art of Motorcycle Maintenance', category: 'fiction', score: 2.77258 },
     * //   { id: 4, title: 'Zen and the Art of Archery', category: 'non-fiction', score: 1.38629 }
     * // ]
     * ```
     */
    var MiniSearch = /** @class */ (function () {
        /**
         * @param options  Configuration options
         *
         * ### Examples:
         *
         * ```javascript
         * // Create a search engine that indexes the 'title' and 'text' fields of your
         * // documents:
         * const miniSearch = new MiniSearch({ fields: ['title', 'text'] })
         * ```
         *
         * ### ID Field:
         *
         * ```javascript
         * // Your documents are assumed to include a unique 'id' field, but if you want
         * // to use a different field for document identification, you can set the
         * // 'idField' option:
         * const miniSearch = new MiniSearch({ idField: 'key', fields: ['title', 'text'] })
         * ```
         *
         * ### Options and defaults:
         *
         * ```javascript
         * // The full set of options (here with their default value) is:
         * const miniSearch = new MiniSearch({
         *   // idField: field that uniquely identifies a document
         *   idField: 'id',
         *
         *   // extractField: function used to get the value of a field in a document.
         *   // By default, it assumes the document is a flat object with field names as
         *   // property keys and field values as string property values, but custom logic
         *   // can be implemented by setting this option to a custom extractor function.
         *   extractField: (document, fieldName) => document[fieldName],
         *
         *   // tokenize: function used to split fields into individual terms. By
         *   // default, it is also used to tokenize search queries, unless a specific
         *   // `tokenize` search option is supplied. When tokenizing an indexed field,
         *   // the field name is passed as the second argument.
         *   tokenize: (string, _fieldName) => string.split(SPACE_OR_PUNCTUATION),
         *
         *   // processTerm: function used to process each tokenized term before
         *   // indexing. It can be used for stemming and normalization. Return a falsy
         *   // value in order to discard a term. By default, it is also used to process
         *   // search queries, unless a specific `processTerm` option is supplied as a
         *   // search option. When processing a term from a indexed field, the field
         *   // name is passed as the second argument.
         *   processTerm: (term, _fieldName) => term.toLowerCase(),
         *
         *   // searchOptions: default search options, see the `search` method for
         *   // details
         *   searchOptions: undefined,
         *
         *   // fields: document fields to be indexed. Mandatory, but not set by default
         *   fields: undefined
         *
         *   // storeFields: document fields to be stored and returned as part of the
         *   // search results.
         *   storeFields: []
         * })
         * ```
         */
        function MiniSearch(options) {
            if ((options === null || options === void 0 ? void 0 : options.fields) == null) {
                throw new Error('MiniSearch: option "fields" must be provided');
            }
            this._options = __assign(__assign(__assign({}, defaultOptions), options), { searchOptions: __assign(__assign({}, defaultSearchOptions), (options.searchOptions || {})), autoSuggestOptions: __assign(__assign({}, defaultAutoSuggestOptions), (options.autoSuggestOptions || {})) });
            this._index = new SearchableMap();
            this._documentCount = 0;
            this._documentIds = new Map();
            // Fields are defined during initialization, don't change, are few in
            // number, rarely need iterating over, and have string keys. Therefore in
            // this case an object is a better candidate than a Map to store the mapping
            // from field key to ID.
            this._fieldIds = {};
            this._fieldLength = new Map();
            this._avgFieldLength = [];
            this._nextId = 0;
            this._storedFields = new Map();
            this.addFields(this._options.fields);
        }
        /**
         * Adds a document to the index
         *
         * @param document  The document to be indexed
         */
        MiniSearch.prototype.add = function (document) {
            var e_1, _a, e_2, _b;
            var _c = this._options, extractField = _c.extractField, tokenize = _c.tokenize, processTerm = _c.processTerm, fields = _c.fields, idField = _c.idField;
            var id = extractField(document, idField);
            if (id == null) {
                throw new Error("MiniSearch: document does not have ID field \"".concat(idField, "\""));
            }
            var shortDocumentId = this.addDocumentId(id);
            this.saveStoredFields(shortDocumentId, document);
            try {
                for (var fields_1 = __values(fields), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
                    var field = fields_1_1.value;
                    var fieldValue = extractField(document, field);
                    if (fieldValue == null)
                        continue;
                    var tokens = tokenize(fieldValue.toString(), field);
                    var fieldId = this._fieldIds[field];
                    var uniqueTerms = new Set(tokens).size;
                    this.addFieldLength(shortDocumentId, fieldId, this._documentCount - 1, uniqueTerms);
                    try {
                        for (var tokens_1 = (e_2 = void 0, __values(tokens)), tokens_1_1 = tokens_1.next(); !tokens_1_1.done; tokens_1_1 = tokens_1.next()) {
                            var term = tokens_1_1.value;
                            var processedTerm = processTerm(term, field);
                            if (processedTerm) {
                                this.addTerm(fieldId, shortDocumentId, processedTerm);
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (tokens_1_1 && !tokens_1_1.done && (_b = tokens_1.return)) _b.call(tokens_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (fields_1_1 && !fields_1_1.done && (_a = fields_1.return)) _a.call(fields_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        /**
         * Adds all the given documents to the index
         *
         * @param documents  An array of documents to be indexed
         */
        MiniSearch.prototype.addAll = function (documents) {
            var e_3, _a;
            try {
                for (var documents_1 = __values(documents), documents_1_1 = documents_1.next(); !documents_1_1.done; documents_1_1 = documents_1.next()) {
                    var document_1 = documents_1_1.value;
                    this.add(document_1);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (documents_1_1 && !documents_1_1.done && (_a = documents_1.return)) _a.call(documents_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
        };
        /**
         * Adds all the given documents to the index asynchronously.
         *
         * Returns a promise that resolves (to `undefined`) when the indexing is done.
         * This method is useful when index many documents, to avoid blocking the main
         * thread. The indexing is performed asynchronously and in chunks.
         *
         * @param documents  An array of documents to be indexed
         * @param options  Configuration options
         * @return A promise resolving to `undefined` when the indexing is done
         */
        MiniSearch.prototype.addAllAsync = function (documents, options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            var _a = options.chunkSize, chunkSize = _a === void 0 ? 10 : _a;
            var acc = { chunk: [], promise: Promise.resolve() };
            var _b = documents.reduce(function (_a, document, i) {
                var chunk = _a.chunk, promise = _a.promise;
                chunk.push(document);
                if ((i + 1) % chunkSize === 0) {
                    return {
                        chunk: [],
                        promise: promise
                            .then(function () { return new Promise(function (resolve) { return setTimeout(resolve, 0); }); })
                            .then(function () { return _this.addAll(chunk); })
                    };
                }
                else {
                    return { chunk: chunk, promise: promise };
                }
            }, acc), chunk = _b.chunk, promise = _b.promise;
            return promise.then(function () { return _this.addAll(chunk); });
        };
        /**
         * Removes the given document from the index.
         *
         * The document to delete must NOT have changed between indexing and deletion,
         * otherwise the index will be corrupted. Therefore, when reindexing a document
         * after a change, the correct order of operations is:
         *
         *   1. remove old version
         *   2. apply changes
         *   3. index new version
         *
         * @param document  The document to be removed
         */
        MiniSearch.prototype.remove = function (document) {
            var e_4, _a, e_5, _b, e_6, _c;
            var _d = this._options, tokenize = _d.tokenize, processTerm = _d.processTerm, extractField = _d.extractField, fields = _d.fields, idField = _d.idField;
            var id = extractField(document, idField);
            if (id == null) {
                throw new Error("MiniSearch: document does not have ID field \"".concat(idField, "\""));
            }
            try {
                for (var _e = __values(this._documentIds), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var _g = __read(_f.value, 2), shortId = _g[0], longId = _g[1];
                    if (id === longId) {
                        try {
                            for (var fields_2 = (e_5 = void 0, __values(fields)), fields_2_1 = fields_2.next(); !fields_2_1.done; fields_2_1 = fields_2.next()) {
                                var field = fields_2_1.value;
                                var fieldValue = extractField(document, field);
                                if (fieldValue == null)
                                    continue;
                                var tokens = tokenize(fieldValue.toString(), field);
                                var fieldId = this._fieldIds[field];
                                var uniqueTerms = new Set(tokens).size;
                                this.removeFieldLength(shortId, fieldId, this._documentCount, uniqueTerms);
                                try {
                                    for (var tokens_2 = (e_6 = void 0, __values(tokens)), tokens_2_1 = tokens_2.next(); !tokens_2_1.done; tokens_2_1 = tokens_2.next()) {
                                        var term = tokens_2_1.value;
                                        var processedTerm = processTerm(term, field);
                                        if (processedTerm) {
                                            this.removeTerm(fieldId, shortId, processedTerm);
                                        }
                                    }
                                }
                                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                                finally {
                                    try {
                                        if (tokens_2_1 && !tokens_2_1.done && (_c = tokens_2.return)) _c.call(tokens_2);
                                    }
                                    finally { if (e_6) throw e_6.error; }
                                }
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (fields_2_1 && !fields_2_1.done && (_b = fields_2.return)) _b.call(fields_2);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                        this._storedFields.delete(shortId);
                        this._documentIds.delete(shortId);
                        this._fieldLength.delete(shortId);
                        this._documentCount -= 1;
                        return;
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
                }
                finally { if (e_4) throw e_4.error; }
            }
            throw new Error("MiniSearch: cannot remove document with ID ".concat(id, ": it is not in the index"));
        };
        /**
         * Removes all the given documents from the index. If called with no arguments,
         * it removes _all_ documents from the index.
         *
         * @param documents  The documents to be removed. If this argument is omitted,
         * all documents are removed. Note that, for removing all documents, it is
         * more efficient to call this method with no arguments than to pass all
         * documents.
         */
        MiniSearch.prototype.removeAll = function (documents) {
            var e_7, _a;
            if (documents) {
                try {
                    for (var documents_2 = __values(documents), documents_2_1 = documents_2.next(); !documents_2_1.done; documents_2_1 = documents_2.next()) {
                        var document_2 = documents_2_1.value;
                        this.remove(document_2);
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (documents_2_1 && !documents_2_1.done && (_a = documents_2.return)) _a.call(documents_2);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
            }
            else if (arguments.length > 0) {
                throw new Error('Expected documents to be present. Omit the argument to remove all documents.');
            }
            else {
                this._index = new SearchableMap();
                this._documentCount = 0;
                this._documentIds = new Map();
                this._fieldLength = new Map();
                this._avgFieldLength = [];
                this._storedFields = new Map();
                this._nextId = 0;
            }
        };
        /**
         * Search for documents matching the given search query.
         *
         * The result is a list of scored document IDs matching the query, sorted by
         * descending score, and each including data about which terms were matched and
         * in which fields.
         *
         * ### Basic usage:
         *
         * ```javascript
         * // Search for "zen art motorcycle" with default options: terms have to match
         * // exactly, and individual terms are joined with OR
         * miniSearch.search('zen art motorcycle')
         * // => [ { id: 2, score: 2.77258, match: { ... } }, { id: 4, score: 1.38629, match: { ... } } ]
         * ```
         *
         * ### Restrict search to specific fields:
         *
         * ```javascript
         * // Search only in the 'title' field
         * miniSearch.search('zen', { fields: ['title'] })
         * ```
         *
         * ### Field boosting:
         *
         * ```javascript
         * // Boost a field
         * miniSearch.search('zen', { boost: { title: 2 } })
         * ```
         *
         * ### Prefix search:
         *
         * ```javascript
         * // Search for "moto" with prefix search (it will match documents
         * // containing terms that start with "moto" or "neuro")
         * miniSearch.search('moto neuro', { prefix: true })
         * ```
         *
         * ### Fuzzy search:
         *
         * ```javascript
         * // Search for "ismael" with fuzzy search (it will match documents containing
         * // terms similar to "ismael", with a maximum edit distance of 0.2 term.length
         * // (rounded to nearest integer)
         * miniSearch.search('ismael', { fuzzy: 0.2 })
         * ```
         *
         * ### Combining strategies:
         *
         * ```javascript
         * // Mix of exact match, prefix search, and fuzzy search
         * miniSearch.search('ismael mob', {
         *  prefix: true,
         *  fuzzy: 0.2
         * })
         * ```
         *
         * ### Advanced prefix and fuzzy search:
         *
         * ```javascript
         * // Perform fuzzy and prefix search depending on the search term. Here
         * // performing prefix and fuzzy search only on terms longer than 3 characters
         * miniSearch.search('ismael mob', {
         *  prefix: term => term.length > 3
         *  fuzzy: term => term.length > 3 ? 0.2 : null
         * })
         * ```
         *
         * ### Combine with AND:
         *
         * ```javascript
         * // Combine search terms with AND (to match only documents that contain both
         * // "motorcycle" and "art")
         * miniSearch.search('motorcycle art', { combineWith: 'AND' })
         * ```
         *
         * ### Combine with AND_NOT:
         *
         * There is also an AND_NOT combinator, that finds documents that match the
         * first term, but do not match any of the other terms. This combinator is
         * rarely useful with simple queries, and is meant to be used with advanced
         * query combinations (see later for more details).
         *
         * ### Filtering results:
         *
         * ```javascript
         * // Filter only results in the 'fiction' category (assuming that 'category'
         * // is a stored field)
         * miniSearch.search('motorcycle art', {
         *   filter: (result) => result.category === 'fiction'
         * })
         * ```
         *
         * ### Advanced combination of queries:
         *
         * It is possible to combine different subqueries with OR, AND, and AND_NOT,
         * and even with different search options, by passing a query expression
         * tree object as the first argument, instead of a string.
         *
         * ```javascript
         * // Search for documents that contain "zen" and ("motorcycle" or "archery")
         * miniSearch.search({
         *   combineWith: 'AND',
         *   queries: [
         *     'zen',
         *     {
         *       combineWith: 'OR',
         *       queries: ['motorcycle', 'archery']
         *     }
         *   ]
         * })
         *
         * // Search for documents that contain ("apple" or "pear") but not "juice" and
         * // not "tree"
         * miniSearch.search({
         *   combineWith: 'AND_NOT',
         *   queries: [
         *     {
         *       combineWith: 'OR',
         *       queries: ['apple', 'pear']
         *     },
         *     'juice',
         *     'tree'
         *   ]
         * })
         * ```
         *
         * Each node in the expression tree can be either a string, or an object that
         * supports all `SearchOptions` fields, plus a `queries` array field for
         * subqueries.
         *
         * Note that, while this can become complicated to do by hand for complex or
         * deeply nested queries, it provides a formalized expression tree API for
         * external libraries that implement a parser for custom query languages.
         *
         * @param query  Search query
         * @param options  Search options. Each option, if not given, defaults to the corresponding value of `searchOptions` given to the constructor, or to the library default.
         */
        MiniSearch.prototype.search = function (query, searchOptions) {
            var e_8, _a;
            if (searchOptions === void 0) { searchOptions = {}; }
            var combinedResults = this.executeQuery(query, searchOptions);
            var results = [];
            try {
                for (var combinedResults_1 = __values(combinedResults), combinedResults_1_1 = combinedResults_1.next(); !combinedResults_1_1.done; combinedResults_1_1 = combinedResults_1.next()) {
                    var _b = __read(combinedResults_1_1.value, 2), docId = _b[0], _c = _b[1], score = _c.score, terms = _c.terms, match = _c.match;
                    // Final score takes into account the number of matching QUERY terms.
                    // The end user will only receive the MATCHED terms.
                    var quality = terms.length;
                    var result = {
                        id: this._documentIds.get(docId),
                        score: score * quality,
                        terms: Object.keys(match),
                        match: match
                    };
                    Object.assign(result, this._storedFields.get(docId));
                    if (searchOptions.filter == null || searchOptions.filter(result)) {
                        results.push(result);
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (combinedResults_1_1 && !combinedResults_1_1.done && (_a = combinedResults_1.return)) _a.call(combinedResults_1);
                }
                finally { if (e_8) throw e_8.error; }
            }
            results.sort(byScore);
            return results;
        };
        /**
         * Provide suggestions for the given search query
         *
         * The result is a list of suggested modified search queries, derived from the
         * given search query, each with a relevance score, sorted by descending score.
         *
         * By default, it uses the same options used for search, except that by
         * default it performs prefix search on the last term of the query, and
         * combine terms with `'AND'` (requiring all query terms to match). Custom
         * options can be passed as a second argument. Defaults can be changed upon
         * calling the `MiniSearch` constructor, by passing a `autoSuggestOptions`
         * option.
         *
         * ### Basic usage:
         *
         * ```javascript
         * // Get suggestions for 'neuro':
         * miniSearch.autoSuggest('neuro')
         * // => [ { suggestion: 'neuromancer', terms: [ 'neuromancer' ], score: 0.46240 } ]
         * ```
         *
         * ### Multiple words:
         *
         * ```javascript
         * // Get suggestions for 'zen ar':
         * miniSearch.autoSuggest('zen ar')
         * // => [
         * //  { suggestion: 'zen archery art', terms: [ 'zen', 'archery', 'art' ], score: 1.73332 },
         * //  { suggestion: 'zen art', terms: [ 'zen', 'art' ], score: 1.21313 }
         * // ]
         * ```
         *
         * ### Fuzzy suggestions:
         *
         * ```javascript
         * // Correct spelling mistakes using fuzzy search:
         * miniSearch.autoSuggest('neromancer', { fuzzy: 0.2 })
         * // => [ { suggestion: 'neuromancer', terms: [ 'neuromancer' ], score: 1.03998 } ]
         * ```
         *
         * ### Filtering:
         *
         * ```javascript
         * // Get suggestions for 'zen ar', but only within the 'fiction' category
         * // (assuming that 'category' is a stored field):
         * miniSearch.autoSuggest('zen ar', {
         *   filter: (result) => result.category === 'fiction'
         * })
         * // => [
         * //  { suggestion: 'zen archery art', terms: [ 'zen', 'archery', 'art' ], score: 1.73332 },
         * //  { suggestion: 'zen art', terms: [ 'zen', 'art' ], score: 1.21313 }
         * // ]
         * ```
         *
         * @param queryString  Query string to be expanded into suggestions
         * @param options  Search options. The supported options and default values
         * are the same as for the `search` method, except that by default prefix
         * search is performed on the last term in the query, and terms are combined
         * with `'AND'`.
         * @return  A sorted array of suggestions sorted by relevance score.
         */
        MiniSearch.prototype.autoSuggest = function (queryString, options) {
            var e_9, _a, e_10, _b;
            if (options === void 0) { options = {}; }
            options = __assign(__assign({}, this._options.autoSuggestOptions), options);
            var suggestions = new Map();
            try {
                for (var _c = __values(this.search(queryString, options)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var _e = _d.value, score = _e.score, terms = _e.terms;
                    var phrase = terms.join(' ');
                    var suggestion = suggestions.get(phrase);
                    if (suggestion != null) {
                        suggestion.score += score;
                        suggestion.count += 1;
                    }
                    else {
                        suggestions.set(phrase, { score: score, terms: terms, count: 1 });
                    }
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_9) throw e_9.error; }
            }
            var results = [];
            try {
                for (var suggestions_1 = __values(suggestions), suggestions_1_1 = suggestions_1.next(); !suggestions_1_1.done; suggestions_1_1 = suggestions_1.next()) {
                    var _f = __read(suggestions_1_1.value, 2), suggestion = _f[0], _g = _f[1], score = _g.score, terms = _g.terms, count = _g.count;
                    results.push({ suggestion: suggestion, terms: terms, score: score / count });
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (suggestions_1_1 && !suggestions_1_1.done && (_b = suggestions_1.return)) _b.call(suggestions_1);
                }
                finally { if (e_10) throw e_10.error; }
            }
            results.sort(byScore);
            return results;
        };
        Object.defineProperty(MiniSearch.prototype, "documentCount", {
            /**
             * Number of documents in the index
             */
            get: function () {
                return this._documentCount;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Deserializes a JSON index (serialized with `JSON.stringify(miniSearch)`)
         * and instantiates a MiniSearch instance. It should be given the same options
         * originally used when serializing the index.
         *
         * ### Usage:
         *
         * ```javascript
         * // If the index was serialized with:
         * let miniSearch = new MiniSearch({ fields: ['title', 'text'] })
         * miniSearch.addAll(documents)
         *
         * const json = JSON.stringify(miniSearch)
         * // It can later be deserialized like this:
         * miniSearch = MiniSearch.loadJSON(json, { fields: ['title', 'text'] })
         * ```
         *
         * @param json  JSON-serialized index
         * @param options  configuration options, same as the constructor
         * @return An instance of MiniSearch deserialized from the given JSON.
         */
        MiniSearch.loadJSON = function (json, options) {
            if (options == null) {
                throw new Error('MiniSearch: loadJSON should be given the same options used when serializing the index');
            }
            return MiniSearch.loadJS(JSON.parse(json), options);
        };
        /**
         * Returns the default value of an option. It will throw an error if no option
         * with the given name exists.
         *
         * @param optionName  Name of the option
         * @return The default value of the given option
         *
         * ### Usage:
         *
         * ```javascript
         * // Get default tokenizer
         * MiniSearch.getDefault('tokenize')
         *
         * // Get default term processor
         * MiniSearch.getDefault('processTerm')
         *
         * // Unknown options will throw an error
         * MiniSearch.getDefault('notExisting')
         * // => throws 'MiniSearch: unknown option "notExisting"'
         * ```
         */
        MiniSearch.getDefault = function (optionName) {
            if (defaultOptions.hasOwnProperty(optionName)) {
                return getOwnProperty(defaultOptions, optionName);
            }
            else {
                throw new Error("MiniSearch: unknown option \"".concat(optionName, "\""));
            }
        };
        /**
         * @ignore
         */
        MiniSearch.loadJS = function (js, options) {
            var e_11, _a, e_12, _b;
            var index = js.index, documentCount = js.documentCount, nextId = js.nextId, documentIds = js.documentIds, fieldIds = js.fieldIds, fieldLength = js.fieldLength, averageFieldLength = js.averageFieldLength, storedFields = js.storedFields, serializationVersion = js.serializationVersion;
            if (serializationVersion !== 1 && serializationVersion !== 2) {
                throw new Error('MiniSearch: cannot deserialize an index created with an incompatible version');
            }
            var miniSearch = new MiniSearch(options);
            miniSearch._documentCount = documentCount;
            miniSearch._nextId = nextId;
            miniSearch._documentIds = objectToNumericMap(documentIds);
            miniSearch._fieldIds = fieldIds;
            miniSearch._fieldLength = objectToNumericMap(fieldLength);
            miniSearch._avgFieldLength = averageFieldLength;
            miniSearch._storedFields = objectToNumericMap(storedFields);
            miniSearch._index = new SearchableMap();
            try {
                for (var index_1 = __values(index), index_1_1 = index_1.next(); !index_1_1.done; index_1_1 = index_1.next()) {
                    var _c = __read(index_1_1.value, 2), term = _c[0], data = _c[1];
                    var dataMap = new Map();
                    try {
                        for (var _d = (e_12 = void 0, __values(Object.keys(data))), _e = _d.next(); !_e.done; _e = _d.next()) {
                            var fieldId = _e.value;
                            var indexEntry = data[fieldId];
                            // Version 1 used to nest the index entry inside a field called ds
                            if (serializationVersion === 1) {
                                indexEntry = indexEntry.ds;
                            }
                            dataMap.set(parseInt(fieldId, 10), objectToNumericMap(indexEntry));
                        }
                    }
                    catch (e_12_1) { e_12 = { error: e_12_1 }; }
                    finally {
                        try {
                            if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                        }
                        finally { if (e_12) throw e_12.error; }
                    }
                    miniSearch._index.set(term, dataMap);
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (index_1_1 && !index_1_1.done && (_a = index_1.return)) _a.call(index_1);
                }
                finally { if (e_11) throw e_11.error; }
            }
            return miniSearch;
        };
        /**
         * @ignore
         */
        MiniSearch.prototype.executeQuery = function (query, searchOptions) {
            var _this = this;
            if (searchOptions === void 0) { searchOptions = {}; }
            if (typeof query !== 'string') {
                var options_1 = __assign(__assign(__assign({}, searchOptions), query), { queries: undefined });
                var results_1 = query.queries.map(function (subquery) { return _this.executeQuery(subquery, options_1); });
                return this.combineResults(results_1, query.combineWith);
            }
            var _a = this._options, tokenize = _a.tokenize, processTerm = _a.processTerm, globalSearchOptions = _a.searchOptions;
            var options = __assign(__assign({ tokenize: tokenize, processTerm: processTerm }, globalSearchOptions), searchOptions);
            var searchTokenize = options.tokenize, searchProcessTerm = options.processTerm;
            var terms = searchTokenize(query)
                .map(function (term) { return searchProcessTerm(term); })
                .filter(function (term) { return !!term; });
            var queries = terms.map(termToQuerySpec(options));
            var results = queries.map(function (query) { return _this.executeQuerySpec(query, options); });
            return this.combineResults(results, options.combineWith);
        };
        /**
         * @ignore
         */
        MiniSearch.prototype.executeQuerySpec = function (query, searchOptions) {
            var e_13, _a, e_14, _b;
            var options = __assign(__assign({}, this._options.searchOptions), searchOptions);
            var boosts = (options.fields || this._options.fields).reduce(function (boosts, field) {
                var _a;
                return (__assign(__assign({}, boosts), (_a = {}, _a[field] = getOwnProperty(boosts, field) || 1, _a)));
            }, options.boost || {});
            var boostDocument = options.boostDocument, weights = options.weights, maxFuzzy = options.maxFuzzy;
            var _c = __assign(__assign({}, defaultSearchOptions.weights), weights), fuzzyWeight = _c.fuzzy, prefixWeight = _c.prefix;
            var data = this._index.get(query.term);
            var results = this.termResults(query.term, query.term, 1, data, boosts, boostDocument);
            var prefixMatches;
            var fuzzyMatches;
            if (query.prefix) {
                prefixMatches = this._index.atPrefix(query.term);
            }
            if (query.fuzzy) {
                var fuzzy = (query.fuzzy === true) ? 0.2 : query.fuzzy;
                var maxDistance = fuzzy < 1 ? Math.min(maxFuzzy, Math.round(query.term.length * fuzzy)) : fuzzy;
                if (maxDistance)
                    fuzzyMatches = this._index.fuzzyGet(query.term, maxDistance);
            }
            if (prefixMatches) {
                try {
                    for (var prefixMatches_1 = __values(prefixMatches), prefixMatches_1_1 = prefixMatches_1.next(); !prefixMatches_1_1.done; prefixMatches_1_1 = prefixMatches_1.next()) {
                        var _d = __read(prefixMatches_1_1.value, 2), term = _d[0], data_1 = _d[1];
                        var distance = term.length - query.term.length;
                        if (!distance) {
                            continue;
                        } // Skip exact match.
                        // Delete the term from fuzzy results (if present) if it is also a
                        // prefix result. This entry will always be scored as a prefix result.
                        fuzzyMatches === null || fuzzyMatches === void 0 ? void 0 : fuzzyMatches.delete(term);
                        // Weight gradually approaches 0 as distance goes to infinity, with the
                        // weight for the hypothetical distance 0 being equal to prefixWeight.
                        // The rate of change is much lower than that of fuzzy matches to
                        // account for the fact that prefix matches stay more relevant than
                        // fuzzy matches for longer distances.
                        var weight = prefixWeight * term.length / (term.length + 0.3 * distance);
                        this.termResults(query.term, term, weight, data_1, boosts, boostDocument, results);
                    }
                }
                catch (e_13_1) { e_13 = { error: e_13_1 }; }
                finally {
                    try {
                        if (prefixMatches_1_1 && !prefixMatches_1_1.done && (_a = prefixMatches_1.return)) _a.call(prefixMatches_1);
                    }
                    finally { if (e_13) throw e_13.error; }
                }
            }
            if (fuzzyMatches) {
                try {
                    for (var _e = __values(fuzzyMatches.keys()), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var term = _f.value;
                        var _g = __read(fuzzyMatches.get(term), 2), data_2 = _g[0], distance = _g[1];
                        if (!distance) {
                            continue;
                        } // Skip exact match.
                        // Weight gradually approaches 0 as distance goes to infinity, with the
                        // weight for the hypothetical distance 0 being equal to fuzzyWeight.
                        var weight = fuzzyWeight * term.length / (term.length + distance);
                        this.termResults(query.term, term, weight, data_2, boosts, boostDocument, results);
                    }
                }
                catch (e_14_1) { e_14 = { error: e_14_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_14) throw e_14.error; }
                }
            }
            return results;
        };
        /**
         * @ignore
         */
        MiniSearch.prototype.combineResults = function (results, combineWith) {
            if (combineWith === void 0) { combineWith = OR; }
            if (results.length === 0) {
                return new Map();
            }
            var operator = combineWith.toLowerCase();
            return results.reduce(combinators[operator]) || new Map();
        };
        /**
         * Allows serialization of the index to JSON, to possibly store it and later
         * deserialize it with `MiniSearch.loadJSON`.
         *
         * Normally one does not directly call this method, but rather call the
         * standard JavaScript `JSON.stringify()` passing the `MiniSearch` instance,
         * and JavaScript will internally call this method. Upon deserialization, one
         * must pass to `loadJSON` the same options used to create the original
         * instance that was serialized.
         *
         * ### Usage:
         *
         * ```javascript
         * // Serialize the index:
         * let miniSearch = new MiniSearch({ fields: ['title', 'text'] })
         * miniSearch.addAll(documents)
         * const json = JSON.stringify(miniSearch)
         *
         * // Later, to deserialize it:
         * miniSearch = MiniSearch.loadJSON(json, { fields: ['title', 'text'] })
         * ```
         *
         * @return A plain-object serializeable representation of the search index.
         */
        MiniSearch.prototype.toJSON = function () {
            var e_15, _a, e_16, _b;
            var index = [];
            try {
                for (var _c = __values(this._index), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var _e = __read(_d.value, 2), term = _e[0], fieldIndex = _e[1];
                    var data = {};
                    try {
                        for (var fieldIndex_1 = (e_16 = void 0, __values(fieldIndex)), fieldIndex_1_1 = fieldIndex_1.next(); !fieldIndex_1_1.done; fieldIndex_1_1 = fieldIndex_1.next()) {
                            var _f = __read(fieldIndex_1_1.value, 2), fieldId = _f[0], freqs = _f[1];
                            data[fieldId] = Object.fromEntries(freqs);
                        }
                    }
                    catch (e_16_1) { e_16 = { error: e_16_1 }; }
                    finally {
                        try {
                            if (fieldIndex_1_1 && !fieldIndex_1_1.done && (_b = fieldIndex_1.return)) _b.call(fieldIndex_1);
                        }
                        finally { if (e_16) throw e_16.error; }
                    }
                    index.push([term, data]);
                }
            }
            catch (e_15_1) { e_15 = { error: e_15_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_15) throw e_15.error; }
            }
            return {
                documentCount: this._documentCount,
                nextId: this._nextId,
                documentIds: Object.fromEntries(this._documentIds),
                fieldIds: this._fieldIds,
                fieldLength: Object.fromEntries(this._fieldLength),
                averageFieldLength: this._avgFieldLength,
                storedFields: Object.fromEntries(this._storedFields),
                index: index,
                serializationVersion: 2
            };
        };
        /**
         * @ignore
         */
        MiniSearch.prototype.termResults = function (sourceTerm, derivedTerm, termWeight, fieldTermData, fieldBoosts, boostDocumentFn, results) {
            var e_17, _a, e_18, _b, _c;
            if (results === void 0) { results = new Map(); }
            if (fieldTermData == null)
                return results;
            try {
                for (var _d = __values(Object.keys(fieldBoosts)), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var field = _e.value;
                    var fieldBoost = fieldBoosts[field];
                    var fieldId = this._fieldIds[field];
                    var fieldTermFreqs = fieldTermData.get(fieldId);
                    if (fieldTermFreqs == null)
                        continue;
                    var matchingFields = fieldTermFreqs.size;
                    var avgFieldLength = this._avgFieldLength[fieldId];
                    try {
                        for (var _f = (e_18 = void 0, __values(fieldTermFreqs.keys())), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var docId = _g.value;
                            var docBoost = boostDocumentFn ? boostDocumentFn(this._documentIds.get(docId), derivedTerm) : 1;
                            if (!docBoost)
                                continue;
                            var termFreq = fieldTermFreqs.get(docId);
                            var fieldLength = this._fieldLength.get(docId)[fieldId];
                            // NOTE: The total number of fields is set to the number of documents
                            // `this._documentCount`. It could also make sense to use the number of
                            // documents where the current field is non-blank as a normalisation
                            // factor. This will make a difference in scoring if the field is rarely
                            // present. This is currently not supported, and may require further
                            // analysis to see if it is a valid use case.
                            var rawScore = calcBM25Score(termFreq, matchingFields, this._documentCount, fieldLength, avgFieldLength);
                            var weightedScore = termWeight * fieldBoost * docBoost * rawScore;
                            var result = results.get(docId);
                            if (result) {
                                result.score += weightedScore;
                                assignUniqueTerm(result.terms, sourceTerm);
                                var match = getOwnProperty(result.match, derivedTerm);
                                if (match) {
                                    match.push(field);
                                }
                                else {
                                    result.match[derivedTerm] = [field];
                                }
                            }
                            else {
                                results.set(docId, {
                                    score: weightedScore,
                                    terms: [sourceTerm],
                                    match: (_c = {}, _c[derivedTerm] = [field], _c)
                                });
                            }
                        }
                    }
                    catch (e_18_1) { e_18 = { error: e_18_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                        }
                        finally { if (e_18) throw e_18.error; }
                    }
                }
            }
            catch (e_17_1) { e_17 = { error: e_17_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_17) throw e_17.error; }
            }
            return results;
        };
        /**
         * @ignore
         */
        MiniSearch.prototype.addTerm = function (fieldId, documentId, term) {
            var indexData = this._index.fetch(term, createMap);
            var fieldIndex = indexData.get(fieldId);
            if (fieldIndex == null) {
                fieldIndex = new Map();
                fieldIndex.set(documentId, 1);
                indexData.set(fieldId, fieldIndex);
            }
            else {
                var docs = fieldIndex.get(documentId);
                fieldIndex.set(documentId, (docs || 0) + 1);
            }
        };
        /**
         * @ignore
         */
        MiniSearch.prototype.removeTerm = function (fieldId, documentId, term) {
            if (!this._index.has(term)) {
                this.warnDocumentChanged(documentId, fieldId, term);
                return;
            }
            var indexData = this._index.fetch(term, createMap);
            var fieldIndex = indexData.get(fieldId);
            if (fieldIndex == null || fieldIndex.get(documentId) == null) {
                this.warnDocumentChanged(documentId, fieldId, term);
            }
            else if (fieldIndex.get(documentId) <= 1) {
                if (fieldIndex.size <= 1) {
                    indexData.delete(fieldId);
                }
                else {
                    fieldIndex.delete(documentId);
                }
            }
            else {
                fieldIndex.set(documentId, fieldIndex.get(documentId) - 1);
            }
            if (this._index.get(term).size === 0) {
                this._index.delete(term);
            }
        };
        /**
         * @ignore
         */
        MiniSearch.prototype.warnDocumentChanged = function (shortDocumentId, fieldId, term) {
            var e_19, _a;
            if (console == null || console.warn == null) {
                return;
            }
            try {
                for (var _b = __values(Object.keys(this._fieldIds)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var fieldName = _c.value;
                    if (this._fieldIds[fieldName] === fieldId) {
                        console.warn("MiniSearch: document with ID ".concat(this._documentIds.get(shortDocumentId), " has changed before removal: term \"").concat(term, "\" was not present in field \"").concat(fieldName, "\". Removing a document after it has changed can corrupt the index!"));
                        return;
                    }
                }
            }
            catch (e_19_1) { e_19 = { error: e_19_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_19) throw e_19.error; }
            }
        };
        /**
         * @ignore
         */
        MiniSearch.prototype.addDocumentId = function (documentId) {
            var shortDocumentId = this._nextId;
            this._documentIds.set(shortDocumentId, documentId);
            this._documentCount += 1;
            this._nextId += 1;
            return shortDocumentId;
        };
        /**
         * @ignore
         */
        MiniSearch.prototype.addFields = function (fields) {
            for (var i = 0; i < fields.length; i++) {
                this._fieldIds[fields[i]] = i;
            }
        };
        /**
         * @ignore
         */
        MiniSearch.prototype.addFieldLength = function (documentId, fieldId, count, length) {
            var fieldLengths = this._fieldLength.get(documentId);
            if (fieldLengths == null)
                this._fieldLength.set(documentId, fieldLengths = []);
            fieldLengths[fieldId] = length;
            var averageFieldLength = this._avgFieldLength[fieldId] || 0;
            var totalFieldLength = (averageFieldLength * count) + length;
            this._avgFieldLength[fieldId] = totalFieldLength / (count + 1);
        };
        /**
         * @ignore
         */
        MiniSearch.prototype.removeFieldLength = function (documentId, fieldId, count, length) {
            var totalFieldLength = (this._avgFieldLength[fieldId] * count) - length;
            this._avgFieldLength[fieldId] = totalFieldLength / (count - 1);
        };
        /**
         * @ignore
         */
        MiniSearch.prototype.saveStoredFields = function (documentId, doc) {
            var e_20, _a;
            var _b = this._options, storeFields = _b.storeFields, extractField = _b.extractField;
            if (storeFields == null || storeFields.length === 0) {
                return;
            }
            var documentFields = this._storedFields.get(documentId);
            if (documentFields == null)
                this._storedFields.set(documentId, documentFields = {});
            try {
                for (var storeFields_1 = __values(storeFields), storeFields_1_1 = storeFields_1.next(); !storeFields_1_1.done; storeFields_1_1 = storeFields_1.next()) {
                    var fieldName = storeFields_1_1.value;
                    var fieldValue = extractField(doc, fieldName);
                    if (fieldValue !== undefined)
                        documentFields[fieldName] = fieldValue;
                }
            }
            catch (e_20_1) { e_20 = { error: e_20_1 }; }
            finally {
                try {
                    if (storeFields_1_1 && !storeFields_1_1.done && (_a = storeFields_1.return)) _a.call(storeFields_1);
                }
                finally { if (e_20) throw e_20.error; }
            }
        };
        return MiniSearch;
    }());
    var getOwnProperty = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property) ? object[property] : undefined;
    };
    var combinators = (_a = {},
        _a[OR] = function (a, b) {
            var e_21, _a;
            try {
                for (var _b = __values(b.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var docId = _c.value;
                    var existing = a.get(docId);
                    if (existing == null) {
                        a.set(docId, b.get(docId));
                    }
                    else {
                        var _d = b.get(docId), score = _d.score, terms = _d.terms, match = _d.match;
                        existing.score = existing.score + score;
                        existing.match = Object.assign(existing.match, match);
                        assignUniqueTerms(existing.terms, terms);
                    }
                }
            }
            catch (e_21_1) { e_21 = { error: e_21_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_21) throw e_21.error; }
            }
            return a;
        },
        _a[AND] = function (a, b) {
            var e_22, _a;
            var combined = new Map();
            try {
                for (var _b = __values(b.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var docId = _c.value;
                    var existing = a.get(docId);
                    if (existing == null)
                        continue;
                    var _d = b.get(docId), score = _d.score, terms = _d.terms, match = _d.match;
                    assignUniqueTerms(existing.terms, terms);
                    combined.set(docId, {
                        score: existing.score + score,
                        terms: existing.terms,
                        match: Object.assign(existing.match, match)
                    });
                }
            }
            catch (e_22_1) { e_22 = { error: e_22_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_22) throw e_22.error; }
            }
            return combined;
        },
        _a[AND_NOT] = function (a, b) {
            var e_23, _a;
            try {
                for (var _b = __values(b.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var docId = _c.value;
                    a.delete(docId);
                }
            }
            catch (e_23_1) { e_23 = { error: e_23_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_23) throw e_23.error; }
            }
            return a;
        },
        _a);
    // https://en.wikipedia.org/wiki/Okapi_BM25
    // https://opensourceconnections.com/blog/2015/10/16/bm25-the-next-generation-of-lucene-relevation/
    var k = 1.2; // Term frequency saturation point. Recommended values are between 1.2 and 2.
    var b = 0.7; // Length normalization impact. Recommended values are around 0.75.
    var d = 0.5; // BM25+ frequency normalization lower bound. Recommended values are between 0.5 and 1.
    var calcBM25Score = function (termFreq, matchingCount, totalCount, fieldLength, avgFieldLength) {
        var invDocFreq = Math.log(1 + (totalCount - matchingCount + 0.5) / (matchingCount + 0.5));
        return invDocFreq * (d + termFreq * (k + 1) / (termFreq + k * (1 - b + b * fieldLength / avgFieldLength)));
    };
    var termToQuerySpec = function (options) { return function (term, i, terms) {
        var fuzzy = (typeof options.fuzzy === 'function')
            ? options.fuzzy(term, i, terms)
            : (options.fuzzy || false);
        var prefix = (typeof options.prefix === 'function')
            ? options.prefix(term, i, terms)
            : (options.prefix === true);
        return { term: term, fuzzy: fuzzy, prefix: prefix };
    }; };
    var defaultOptions = {
        idField: 'id',
        extractField: function (document, fieldName) { return document[fieldName]; },
        tokenize: function (text, fieldName) { return text.split(SPACE_OR_PUNCTUATION); },
        processTerm: function (term, fieldName) { return term.toLowerCase(); },
        fields: undefined,
        searchOptions: undefined,
        storeFields: []
    };
    var defaultSearchOptions = {
        combineWith: OR,
        prefix: false,
        fuzzy: false,
        maxFuzzy: 6,
        boost: {},
        weights: { fuzzy: 0.45, prefix: 0.375 }
    };
    var defaultAutoSuggestOptions = {
        combineWith: AND,
        prefix: function (term, i, terms) {
            return i === terms.length - 1;
        }
    };
    var assignUniqueTerm = function (target, term) {
        // Avoid adding duplicate terms.
        if (!target.includes(term))
            target.push(term);
    };
    var assignUniqueTerms = function (target, source) {
        var e_24, _a;
        try {
            for (var source_1 = __values(source), source_1_1 = source_1.next(); !source_1_1.done; source_1_1 = source_1.next()) {
                var term = source_1_1.value;
                // Avoid adding duplicate terms.
                if (!target.includes(term))
                    target.push(term);
            }
        }
        catch (e_24_1) { e_24 = { error: e_24_1 }; }
        finally {
            try {
                if (source_1_1 && !source_1_1.done && (_a = source_1.return)) _a.call(source_1);
            }
            finally { if (e_24) throw e_24.error; }
        }
    };
    var byScore = function (_a, _b) {
        var a = _a.score;
        var b = _b.score;
        return b - a;
    };
    var createMap = function () { return new Map(); };
    var objectToNumericMap = function (object) {
        var e_25, _a;
        var map = new Map();
        try {
            for (var _b = __values(Object.keys(object)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                map.set(parseInt(key, 10), object[key]);
            }
        }
        catch (e_25_1) { e_25 = { error: e_25_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_25) throw e_25.error; }
        }
        return map;
    };
    // This regular expression matches any Unicode space or punctuation character
    // Adapted from https://unicode.org/cldr/utility/list-unicodeset.jsp?a=%5Cp%7BZ%7D%5Cp%7BP%7D&abb=on&c=on&esc=on
    var SPACE_OR_PUNCTUATION = /[\n\r -#%-*,-/:;?@[-\]_{}\u00A0\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u1680\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2000-\u200A\u2010-\u2029\u202F-\u2043\u2045-\u2051\u2053-\u205F\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u3000-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]+/u;

    return MiniSearch;

}));


},{}],64:[function(require,module,exports){
(function (global){(function (){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('underscore', factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (function () {
    var current = global._;
    var exports = global._ = factory();
    exports.noConflict = function () { global._ = current; return exports; };
  }()));
}(this, (function () {
  //     Underscore.js 1.13.6
  //     https://underscorejs.org
  //     (c) 2009-2022 Jeremy Ashkenas, Julian Gonggrijp, and DocumentCloud and Investigative Reporters & Editors
  //     Underscore may be freely distributed under the MIT license.

  // Current version.
  var VERSION = '1.13.6';

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = (typeof self == 'object' && self.self === self && self) ||
            (typeof global == 'object' && global.global === global && global) ||
            Function('return this')() ||
            {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // Modern feature detection.
  var supportsArrayBuffer = typeof ArrayBuffer !== 'undefined',
      supportsDataView = typeof DataView !== 'undefined';

  // All **ECMAScript 5+** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create,
      nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;

  // Create references to these builtin functions because we override them.
  var _isNaN = isNaN,
      _isFinite = isFinite;

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  // The largest integer that can be represented exactly.
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  function restArguments(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  }

  // Is a given variable an object?
  function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || (type === 'object' && !!obj);
  }

  // Is a given value equal to null?
  function isNull(obj) {
    return obj === null;
  }

  // Is a given variable undefined?
  function isUndefined(obj) {
    return obj === void 0;
  }

  // Is a given value a boolean?
  function isBoolean(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  }

  // Is a given value a DOM element?
  function isElement(obj) {
    return !!(obj && obj.nodeType === 1);
  }

  // Internal function for creating a `toString`-based type tester.
  function tagTester(name) {
    var tag = '[object ' + name + ']';
    return function(obj) {
      return toString.call(obj) === tag;
    };
  }

  var isString = tagTester('String');

  var isNumber = tagTester('Number');

  var isDate = tagTester('Date');

  var isRegExp = tagTester('RegExp');

  var isError = tagTester('Error');

  var isSymbol = tagTester('Symbol');

  var isArrayBuffer = tagTester('ArrayBuffer');

  var isFunction = tagTester('Function');

  // Optimize `isFunction` if appropriate. Work around some `typeof` bugs in old
  // v8, IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  var isFunction$1 = isFunction;

  var hasObjectTag = tagTester('Object');

  // In IE 10 - Edge 13, `DataView` has string tag `'[object Object]'`.
  // In IE 11, the most common among them, this problem also applies to
  // `Map`, `WeakMap` and `Set`.
  var hasStringTagBug = (
        supportsDataView && hasObjectTag(new DataView(new ArrayBuffer(8)))
      ),
      isIE11 = (typeof Map !== 'undefined' && hasObjectTag(new Map));

  var isDataView = tagTester('DataView');

  // In IE 10 - Edge 13, we need a different heuristic
  // to determine whether an object is a `DataView`.
  function ie10IsDataView(obj) {
    return obj != null && isFunction$1(obj.getInt8) && isArrayBuffer(obj.buffer);
  }

  var isDataView$1 = (hasStringTagBug ? ie10IsDataView : isDataView);

  // Is a given value an array?
  // Delegates to ECMA5's native `Array.isArray`.
  var isArray = nativeIsArray || tagTester('Array');

  // Internal function to check whether `key` is an own property name of `obj`.
  function has$1(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  }

  var isArguments = tagTester('Arguments');

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  (function() {
    if (!isArguments(arguments)) {
      isArguments = function(obj) {
        return has$1(obj, 'callee');
      };
    }
  }());

  var isArguments$1 = isArguments;

  // Is a given object a finite number?
  function isFinite$1(obj) {
    return !isSymbol(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
  }

  // Is the given value `NaN`?
  function isNaN$1(obj) {
    return isNumber(obj) && _isNaN(obj);
  }

  // Predicate-generating function. Often useful outside of Underscore.
  function constant(value) {
    return function() {
      return value;
    };
  }

  // Common internal logic for `isArrayLike` and `isBufferLike`.
  function createSizePropertyCheck(getSizeProperty) {
    return function(collection) {
      var sizeProperty = getSizeProperty(collection);
      return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
    }
  }

  // Internal helper to generate a function to obtain property `key` from `obj`.
  function shallowProperty(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  }

  // Internal helper to obtain the `byteLength` property of an object.
  var getByteLength = shallowProperty('byteLength');

  // Internal helper to determine whether we should spend extensive checks against
  // `ArrayBuffer` et al.
  var isBufferLike = createSizePropertyCheck(getByteLength);

  // Is a given value a typed array?
  var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
  function isTypedArray(obj) {
    // `ArrayBuffer.isView` is the most future-proof, so use it when available.
    // Otherwise, fall back on the above regular expression.
    return nativeIsView ? (nativeIsView(obj) && !isDataView$1(obj)) :
                  isBufferLike(obj) && typedArrayPattern.test(toString.call(obj));
  }

  var isTypedArray$1 = supportsArrayBuffer ? isTypedArray : constant(false);

  // Internal helper to obtain the `length` property of an object.
  var getLength = shallowProperty('length');

  // Internal helper to create a simple lookup structure.
  // `collectNonEnumProps` used to depend on `_.contains`, but this led to
  // circular imports. `emulatedSet` is a one-off solution that only works for
  // arrays of strings.
  function emulatedSet(keys) {
    var hash = {};
    for (var l = keys.length, i = 0; i < l; ++i) hash[keys[i]] = true;
    return {
      contains: function(key) { return hash[key] === true; },
      push: function(key) {
        hash[key] = true;
        return keys.push(key);
      }
    };
  }

  // Internal helper. Checks `keys` for the presence of keys in IE < 9 that won't
  // be iterated by `for key in ...` and thus missed. Extends `keys` in place if
  // needed.
  function collectNonEnumProps(obj, keys) {
    keys = emulatedSet(keys);
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (isFunction$1(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (has$1(obj, prop) && !keys.contains(prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  function keys(obj) {
    if (!isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has$1(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  }

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  function isEmpty(obj) {
    if (obj == null) return true;
    // Skip the more expensive `toString`-based type checks if `obj` has no
    // `.length`.
    var length = getLength(obj);
    if (typeof length == 'number' && (
      isArray(obj) || isString(obj) || isArguments$1(obj)
    )) return length === 0;
    return getLength(keys(obj)) === 0;
  }

  // Returns whether an object has a given set of `key:value` pairs.
  function isMatch(object, attrs) {
    var _keys = keys(attrs), length = _keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = _keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  }

  // If Underscore is called as a function, it returns a wrapped object that can
  // be used OO-style. This wrapper holds altered versions of all functions added
  // through `_.mixin`. Wrapped objects may be chained.
  function _$1(obj) {
    if (obj instanceof _$1) return obj;
    if (!(this instanceof _$1)) return new _$1(obj);
    this._wrapped = obj;
  }

  _$1.VERSION = VERSION;

  // Extracts the result from a wrapped and chained object.
  _$1.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxies for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _$1.prototype.valueOf = _$1.prototype.toJSON = _$1.prototype.value;

  _$1.prototype.toString = function() {
    return String(this._wrapped);
  };

  // Internal function to wrap or shallow-copy an ArrayBuffer,
  // typed array or DataView to a new view, reusing the buffer.
  function toBufferView(bufferSource) {
    return new Uint8Array(
      bufferSource.buffer || bufferSource,
      bufferSource.byteOffset || 0,
      getByteLength(bufferSource)
    );
  }

  // We use this string twice, so give it a name for minification.
  var tagDataView = '[object DataView]';

  // Internal recursive comparison function for `_.isEqual`.
  function eq(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  }

  // Internal recursive comparison function for `_.isEqual`.
  function deepEq(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _$1) a = a._wrapped;
    if (b instanceof _$1) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    // Work around a bug in IE 10 - Edge 13.
    if (hasStringTagBug && className == '[object Object]' && isDataView$1(a)) {
      if (!isDataView$1(b)) return false;
      className = tagDataView;
    }
    switch (className) {
      // These types are compared by value.
      case '[object RegExp]':
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
      case '[object ArrayBuffer]':
      case tagDataView:
        // Coerce to typed array so we can fall through.
        return deepEq(toBufferView(a), toBufferView(b), aStack, bStack);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays && isTypedArray$1(a)) {
        var byteLength = getByteLength(a);
        if (byteLength !== getByteLength(b)) return false;
        if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
        areArrays = true;
    }
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(isFunction$1(aCtor) && aCtor instanceof aCtor &&
                               isFunction$1(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var _keys = keys(a), key;
      length = _keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = _keys[length];
        if (!(has$1(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  }

  // Perform a deep comparison to check if two objects are equal.
  function isEqual(a, b) {
    return eq(a, b);
  }

  // Retrieve all the enumerable property names of an object.
  function allKeys(obj) {
    if (!isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  }

  // Since the regular `Object.prototype.toString` type tests don't work for
  // some types in IE 11, we use a fingerprinting heuristic instead, based
  // on the methods. It's not great, but it's the best we got.
  // The fingerprint method lists are defined below.
  function ie11fingerprint(methods) {
    var length = getLength(methods);
    return function(obj) {
      if (obj == null) return false;
      // `Map`, `WeakMap` and `Set` have no enumerable keys.
      var keys = allKeys(obj);
      if (getLength(keys)) return false;
      for (var i = 0; i < length; i++) {
        if (!isFunction$1(obj[methods[i]])) return false;
      }
      // If we are testing against `WeakMap`, we need to ensure that
      // `obj` doesn't have a `forEach` method in order to distinguish
      // it from a regular `Map`.
      return methods !== weakMapMethods || !isFunction$1(obj[forEachName]);
    };
  }

  // In the interest of compact minification, we write
  // each string in the fingerprints only once.
  var forEachName = 'forEach',
      hasName = 'has',
      commonInit = ['clear', 'delete'],
      mapTail = ['get', hasName, 'set'];

  // `Map`, `WeakMap` and `Set` each have slightly different
  // combinations of the above sublists.
  var mapMethods = commonInit.concat(forEachName, mapTail),
      weakMapMethods = commonInit.concat(mapTail),
      setMethods = ['add'].concat(commonInit, forEachName, hasName);

  var isMap = isIE11 ? ie11fingerprint(mapMethods) : tagTester('Map');

  var isWeakMap = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester('WeakMap');

  var isSet = isIE11 ? ie11fingerprint(setMethods) : tagTester('Set');

  var isWeakSet = tagTester('WeakSet');

  // Retrieve the values of an object's properties.
  function values(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[_keys[i]];
    }
    return values;
  }

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of `_.object` with one argument.
  function pairs(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [_keys[i], obj[_keys[i]]];
    }
    return pairs;
  }

  // Invert the keys and values of an object. The values must be serializable.
  function invert(obj) {
    var result = {};
    var _keys = keys(obj);
    for (var i = 0, length = _keys.length; i < length; i++) {
      result[obj[_keys[i]]] = _keys[i];
    }
    return result;
  }

  // Return a sorted list of the function names available on the object.
  function functions(obj) {
    var names = [];
    for (var key in obj) {
      if (isFunction$1(obj[key])) names.push(key);
    }
    return names.sort();
  }

  // An internal function for creating assigner functions.
  function createAssigner(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  }

  // Extend a given object with all the properties in passed-in object(s).
  var extend = createAssigner(allKeys);

  // Assigns a given object with all the own properties in the passed-in
  // object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  var extendOwn = createAssigner(keys);

  // Fill in a given object with default properties.
  var defaults = createAssigner(allKeys, true);

  // Create a naked function reference for surrogate-prototype-swapping.
  function ctor() {
    return function(){};
  }

  // An internal function for creating a new object that inherits from another.
  function baseCreate(prototype) {
    if (!isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    var Ctor = ctor();
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  }

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  function create(prototype, props) {
    var result = baseCreate(prototype);
    if (props) extendOwn(result, props);
    return result;
  }

  // Create a (shallow-cloned) duplicate of an object.
  function clone(obj) {
    if (!isObject(obj)) return obj;
    return isArray(obj) ? obj.slice() : extend({}, obj);
  }

  // Invokes `interceptor` with the `obj` and then returns `obj`.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  function tap(obj, interceptor) {
    interceptor(obj);
    return obj;
  }

  // Normalize a (deep) property `path` to array.
  // Like `_.iteratee`, this function can be customized.
  function toPath$1(path) {
    return isArray(path) ? path : [path];
  }
  _$1.toPath = toPath$1;

  // Internal wrapper for `_.toPath` to enable minification.
  // Similar to `cb` for `_.iteratee`.
  function toPath(path) {
    return _$1.toPath(path);
  }

  // Internal function to obtain a nested property in `obj` along `path`.
  function deepGet(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  }

  // Get the value of the (deep) property on `path` from `object`.
  // If any property in `path` does not exist or if the value is
  // `undefined`, return `defaultValue` instead.
  // The `path` is normalized through `_.toPath`.
  function get(object, path, defaultValue) {
    var value = deepGet(object, toPath(path));
    return isUndefined(value) ? defaultValue : value;
  }

  // Shortcut function for checking if an object has a given property directly on
  // itself (in other words, not on a prototype). Unlike the internal `has`
  // function, this public version can also traverse nested properties.
  function has(obj, path) {
    path = toPath(path);
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (!has$1(obj, key)) return false;
      obj = obj[key];
    }
    return !!length;
  }

  // Keep the identity function around for default iteratees.
  function identity(value) {
    return value;
  }

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  function matcher(attrs) {
    attrs = extendOwn({}, attrs);
    return function(obj) {
      return isMatch(obj, attrs);
    };
  }

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indices.
  function property(path) {
    path = toPath(path);
    return function(obj) {
      return deepGet(obj, path);
    };
  }

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  function optimizeCb(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  }

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `_.identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  function baseIteratee(value, context, argCount) {
    if (value == null) return identity;
    if (isFunction$1(value)) return optimizeCb(value, context, argCount);
    if (isObject(value) && !isArray(value)) return matcher(value);
    return property(value);
  }

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only `argCount` argument.
  function iteratee(value, context) {
    return baseIteratee(value, context, Infinity);
  }
  _$1.iteratee = iteratee;

  // The function we call internally to generate a callback. It invokes
  // `_.iteratee` if overridden, otherwise `baseIteratee`.
  function cb(value, context, argCount) {
    if (_$1.iteratee !== iteratee) return _$1.iteratee(value, context);
    return baseIteratee(value, context, argCount);
  }

  // Returns the results of applying the `iteratee` to each element of `obj`.
  // In contrast to `_.map` it returns an object.
  function mapObject(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var _keys = keys(obj),
        length = _keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = _keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  }

  // Predicate-generating function. Often useful outside of Underscore.
  function noop(){}

  // Generates a function for a given object that returns a given property.
  function propertyOf(obj) {
    if (obj == null) return noop;
    return function(path) {
      return get(obj, path);
    };
  }

  // Run a function **n** times.
  function times(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  }

  // Return a random integer between `min` and `max` (inclusive).
  function random(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  // A (possibly faster) way to get the current timestamp as an integer.
  var now = Date.now || function() {
    return new Date().getTime();
  };

  // Internal helper to generate functions for escaping and unescaping strings
  // to/from HTML interpolation.
  function createEscaper(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  }

  // Internal list of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  // Function for escaping strings to HTML interpolation.
  var _escape = createEscaper(escapeMap);

  // Internal list of HTML entities for unescaping.
  var unescapeMap = invert(escapeMap);

  // Function for unescaping strings from HTML interpolation.
  var _unescape = createEscaper(unescapeMap);

  // By default, Underscore uses ERB-style template delimiters. Change the
  // following template settings to use alternative delimiters.
  var templateSettings = _$1.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `_.templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  function escapeChar(match) {
    return '\\' + escapes[match];
  }

  // In order to prevent third-party code injection through
  // `_.templateSettings.variable`, we test it against the following regular
  // expression. It is intentionally a bit more liberal than just matching valid
  // identifiers, but still prevents possible loopholes through defaults or
  // destructuring assignment.
  var bareIdentifier = /^\s*(\w|\$)+\s*$/;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  function template(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = defaults({}, settings, _$1.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    var argument = settings.variable;
    if (argument) {
      // Insure against third-party code injection. (CVE-2021-23358)
      if (!bareIdentifier.test(argument)) throw new Error(
        'variable is not a bare identifier: ' + argument
      );
    } else {
      // If a variable is not specified, place data values in local scope.
      source = 'with(obj||{}){\n' + source + '}\n';
      argument = 'obj';
    }

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(argument, '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _$1);
    };

    // Provide the compiled source as a convenience for precompilation.
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  }

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  function result(obj, path, fallback) {
    path = toPath(path);
    var length = path.length;
    if (!length) {
      return isFunction$1(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = isFunction$1(prop) ? prop.call(obj) : prop;
    }
    return obj;
  }

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  function uniqueId(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  }

  // Start chaining a wrapped Underscore object.
  function chain(obj) {
    var instance = _$1(obj);
    instance._chain = true;
    return instance;
  }

  // Internal function to execute `sourceFunc` bound to `context` with optional
  // `args`. Determines whether to execute a function as a constructor or as a
  // normal function.
  function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (isObject(result)) return result;
    return self;
  }

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. `_` acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  var partial = restArguments(function(func, boundArgs) {
    var placeholder = partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  partial.placeholder = _$1;

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally).
  var bind = restArguments(function(func, context, args) {
    if (!isFunction$1(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Internal helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var isArrayLike = createSizePropertyCheck(getLength);

  // Internal implementation of a recursive `flatten` function.
  function flatten$1(input, depth, strict, output) {
    output = output || [];
    if (!depth && depth !== 0) {
      depth = Infinity;
    } else if (depth <= 0) {
      return output.concat(input);
    }
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (isArray(value) || isArguments$1(value))) {
        // Flatten current level of array or arguments object.
        if (depth > 1) {
          flatten$1(value, depth - 1, strict, output);
          idx = output.length;
        } else {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  }

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  var bindAll = restArguments(function(obj, keys) {
    keys = flatten$1(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = bind(obj[key], obj);
    }
    return obj;
  });

  // Memoize an expensive function by storing its results.
  function memoize(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has$1(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  }

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  var delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  var defer = partial(delay, _$1, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var _now = now();
      if (!previous && options.leading === false) previous = _now;
      var remaining = wait - (_now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = _now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  }

  // When a sequence of calls of the returned function ends, the argument
  // function is triggered. The end of a sequence is defined by the `wait`
  // parameter. If `immediate` is passed, the argument function will be
  // triggered at the beginning of the sequence instead of at the end.
  function debounce(func, wait, immediate) {
    var timeout, previous, args, result, context;

    var later = function() {
      var passed = now() - previous;
      if (wait > passed) {
        timeout = setTimeout(later, wait - passed);
      } else {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
        // This check is needed because `func` can recursively invoke `debounced`.
        if (!timeout) args = context = null;
      }
    };

    var debounced = restArguments(function(_args) {
      context = this;
      args = _args;
      previous = now();
      if (!timeout) {
        timeout = setTimeout(later, wait);
        if (immediate) result = func.apply(context, args);
      }
      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = args = context = null;
    };

    return debounced;
  }

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  function wrap(func, wrapper) {
    return partial(wrapper, func);
  }

  // Returns a negated version of the passed-in predicate.
  function negate(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  }

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  function compose() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  }

  // Returns a function that will only be executed on and after the Nth call.
  function after(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  }

  // Returns a function that will only be executed up to (but not including) the
  // Nth call.
  function before(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  }

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  var once = partial(before, 2);

  // Returns the first key on an object that passes a truth test.
  function findKey(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = keys(obj), key;
    for (var i = 0, length = _keys.length; i < length; i++) {
      key = _keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  }

  // Internal function to generate `_.findIndex` and `_.findLastIndex`.
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a truth test.
  var findIndex = createPredicateIndexFinder(1);

  // Returns the last index on an array-like that passes a truth test.
  var findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  function sortedIndex(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  }

  // Internal function to generate the `_.indexOf` and `_.lastIndexOf` functions.
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), isNaN$1);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  var indexOf = createIndexFinder(1, findIndex, sortedIndex);

  // Return the position of the last occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  var lastIndexOf = createIndexFinder(-1, findLastIndex);

  // Return the first value which passes a truth test.
  function find(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? findIndex : findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  }

  // Convenience version of a common use case of `_.find`: getting the first
  // object containing specific `key:value` pairs.
  function findWhere(obj, attrs) {
    return find(obj, matcher(attrs));
  }

  // The cornerstone for collection functions, an `each`
  // implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  function each(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var _keys = keys(obj);
      for (i = 0, length = _keys.length; i < length; i++) {
        iteratee(obj[_keys[i]], _keys[i], obj);
      }
    }
    return obj;
  }

  // Return the results of applying the iteratee to each element.
  function map(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  }

  // Internal helper to create a reducing function, iterating left or right.
  function createReduce(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var _keys = !isArrayLike(obj) && keys(obj),
          length = (_keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[_keys ? _keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = _keys ? _keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  var reduce = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  var reduceRight = createReduce(-1);

  // Return all the elements that pass a truth test.
  function filter(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  }

  // Return all the elements for which a truth test fails.
  function reject(obj, predicate, context) {
    return filter(obj, negate(cb(predicate)), context);
  }

  // Determine whether all of the elements pass a truth test.
  function every(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  }

  // Determine if at least one element in the object passes a truth test.
  function some(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  }

  // Determine if the array or object contains a given item (using `===`).
  function contains(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return indexOf(obj, item, fromIndex) >= 0;
  }

  // Invoke a method (with arguments) on every item in a collection.
  var invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (isFunction$1(path)) {
      func = path;
    } else {
      path = toPath(path);
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `_.map`: fetching a property.
  function pluck(obj, key) {
    return map(obj, property(key));
  }

  // Convenience version of a common use case of `_.filter`: selecting only
  // objects containing specific `key:value` pairs.
  function where(obj, attrs) {
    return filter(obj, matcher(attrs));
  }

  // Return the maximum element (or element-based computation).
  function max(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null)) {
      obj = isArrayLike(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || (computed === -Infinity && result === -Infinity)) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  }

  // Return the minimum element (or element-based computation).
  function min(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null)) {
      obj = isArrayLike(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || (computed === Infinity && result === Infinity)) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  }

  // Safely create a real, live array from anything iterable.
  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  function toArray(obj) {
    if (!obj) return [];
    if (isArray(obj)) return slice.call(obj);
    if (isString(obj)) {
      // Keep surrogate pair characters together.
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return map(obj, identity);
    return values(obj);
  }

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `_.map`.
  function sample(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = values(obj);
      return obj[random(obj.length - 1)];
    }
    var sample = toArray(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  }

  // Shuffle a collection.
  function shuffle(obj) {
    return sample(obj, Infinity);
  }

  // Sort the object's values by a criterion produced by an iteratee.
  function sortBy(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return pluck(map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  }

  // An internal function used for aggregate "group by" operations.
  function group(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  }

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  var groupBy = group(function(result, value, key) {
    if (has$1(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `_.groupBy`, but for
  // when you know that your index values will be unique.
  var indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  var countBy = group(function(result, value, key) {
    if (has$1(result, key)) result[key]++; else result[key] = 1;
  });

  // Split a collection into two arrays: one whose elements all pass the given
  // truth test, and one whose elements all do not pass the truth test.
  var partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Return the number of elements in a collection.
  function size(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : keys(obj).length;
  }

  // Internal `_.pick` helper function to determine whether `key` is an enumerable
  // property name of `obj`.
  function keyInObj(value, key, obj) {
    return key in obj;
  }

  // Return a copy of the object only containing the allowed properties.
  var pick = restArguments(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (isFunction$1(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten$1(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the disallowed properties.
  var omit = restArguments(function(obj, keys) {
    var iteratee = keys[0], context;
    if (isFunction$1(iteratee)) {
      iteratee = negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = map(flatten$1(keys, false, false), String);
      iteratee = function(value, key) {
        return !contains(keys, key);
      };
    }
    return pick(obj, iteratee, context);
  });

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  function initial(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  }

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. The **guard** check allows it to work with `_.map`.
  function first(array, n, guard) {
    if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
    if (n == null || guard) return array[0];
    return initial(array, array.length - n);
  }

  // Returns everything but the first entry of the `array`. Especially useful on
  // the `arguments` object. Passing an **n** will return the rest N values in the
  // `array`.
  function rest(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  }

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  function last(array, n, guard) {
    if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return rest(array, Math.max(0, array.length - n));
  }

  // Trim out all falsy values from an array.
  function compact(array) {
    return filter(array, Boolean);
  }

  // Flatten out an array, either recursively (by default), or up to `depth`.
  // Passing `true` or `false` as `depth` means `1` or `Infinity`, respectively.
  function flatten(array, depth) {
    return flatten$1(array, depth, false);
  }

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  var difference = restArguments(function(array, rest) {
    rest = flatten$1(rest, true, true);
    return filter(array, function(value){
      return !contains(rest, value);
    });
  });

  // Return a version of the array that does not contain the specified value(s).
  var without = restArguments(function(array, otherArrays) {
    return difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  function uniq(array, isSorted, iteratee, context) {
    if (!isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  }

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  var union = restArguments(function(arrays) {
    return uniq(flatten$1(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  function intersection(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  }

  // Complement of zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  function unzip(array) {
    var length = (array && max(array, getLength).length) || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = pluck(array, index);
    }
    return result;
  }

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  var zip = restArguments(unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of `_.pairs`.
  function object(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  }

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](https://docs.python.org/library/functions.html#range).
  function range(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  }

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  function chunk(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  }

  // Helper function to continue chaining intermediate results.
  function chainResult(instance, obj) {
    return instance._chain ? _$1(obj).chain() : obj;
  }

  // Add your own custom functions to the Underscore object.
  function mixin(obj) {
    each(functions(obj), function(name) {
      var func = _$1[name] = obj[name];
      _$1.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_$1, args));
      };
    });
    return _$1;
  }

  // Add all mutator `Array` functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _$1.prototype[name] = function() {
      var obj = this._wrapped;
      if (obj != null) {
        method.apply(obj, arguments);
        if ((name === 'shift' || name === 'splice') && obj.length === 0) {
          delete obj[0];
        }
      }
      return chainResult(this, obj);
    };
  });

  // Add all accessor `Array` functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _$1.prototype[name] = function() {
      var obj = this._wrapped;
      if (obj != null) obj = method.apply(obj, arguments);
      return chainResult(this, obj);
    };
  });

  // Named Exports

  var allExports = {
    __proto__: null,
    VERSION: VERSION,
    restArguments: restArguments,
    isObject: isObject,
    isNull: isNull,
    isUndefined: isUndefined,
    isBoolean: isBoolean,
    isElement: isElement,
    isString: isString,
    isNumber: isNumber,
    isDate: isDate,
    isRegExp: isRegExp,
    isError: isError,
    isSymbol: isSymbol,
    isArrayBuffer: isArrayBuffer,
    isDataView: isDataView$1,
    isArray: isArray,
    isFunction: isFunction$1,
    isArguments: isArguments$1,
    isFinite: isFinite$1,
    isNaN: isNaN$1,
    isTypedArray: isTypedArray$1,
    isEmpty: isEmpty,
    isMatch: isMatch,
    isEqual: isEqual,
    isMap: isMap,
    isWeakMap: isWeakMap,
    isSet: isSet,
    isWeakSet: isWeakSet,
    keys: keys,
    allKeys: allKeys,
    values: values,
    pairs: pairs,
    invert: invert,
    functions: functions,
    methods: functions,
    extend: extend,
    extendOwn: extendOwn,
    assign: extendOwn,
    defaults: defaults,
    create: create,
    clone: clone,
    tap: tap,
    get: get,
    has: has,
    mapObject: mapObject,
    identity: identity,
    constant: constant,
    noop: noop,
    toPath: toPath$1,
    property: property,
    propertyOf: propertyOf,
    matcher: matcher,
    matches: matcher,
    times: times,
    random: random,
    now: now,
    escape: _escape,
    unescape: _unescape,
    templateSettings: templateSettings,
    template: template,
    result: result,
    uniqueId: uniqueId,
    chain: chain,
    iteratee: iteratee,
    partial: partial,
    bind: bind,
    bindAll: bindAll,
    memoize: memoize,
    delay: delay,
    defer: defer,
    throttle: throttle,
    debounce: debounce,
    wrap: wrap,
    negate: negate,
    compose: compose,
    after: after,
    before: before,
    once: once,
    findKey: findKey,
    findIndex: findIndex,
    findLastIndex: findLastIndex,
    sortedIndex: sortedIndex,
    indexOf: indexOf,
    lastIndexOf: lastIndexOf,
    find: find,
    detect: find,
    findWhere: findWhere,
    each: each,
    forEach: each,
    map: map,
    collect: map,
    reduce: reduce,
    foldl: reduce,
    inject: reduce,
    reduceRight: reduceRight,
    foldr: reduceRight,
    filter: filter,
    select: filter,
    reject: reject,
    every: every,
    all: every,
    some: some,
    any: some,
    contains: contains,
    includes: contains,
    include: contains,
    invoke: invoke,
    pluck: pluck,
    where: where,
    max: max,
    min: min,
    shuffle: shuffle,
    sample: sample,
    sortBy: sortBy,
    groupBy: groupBy,
    indexBy: indexBy,
    countBy: countBy,
    partition: partition,
    toArray: toArray,
    size: size,
    pick: pick,
    omit: omit,
    first: first,
    head: first,
    take: first,
    initial: initial,
    last: last,
    rest: rest,
    tail: rest,
    drop: rest,
    compact: compact,
    flatten: flatten,
    without: without,
    uniq: uniq,
    unique: uniq,
    union: union,
    intersection: intersection,
    difference: difference,
    unzip: unzip,
    transpose: unzip,
    zip: zip,
    object: object,
    range: range,
    chunk: chunk,
    mixin: mixin,
    'default': _$1
  };

  // Default Export

  // Add all of the Underscore functions to the wrapper object.
  var _ = mixin(allExports);
  // Legacy Node.js API.
  _._ = _;

  return _;

})));


}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
