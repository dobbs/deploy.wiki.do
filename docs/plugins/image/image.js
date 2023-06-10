(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// An Image plugin presents a picture with a caption. The image source
// can be any URL but we have been using "data urls" so as to get the
// proper sharing semantics if not storage efficency.
var bind, editor, emit, exifr, md5;
md5 = require('./md5');
exifr = require('exifr');

emit = function emit($item, item) {
  var alternates, img, ref, ref1;

  alternates = function alternates($item) {
    var action, j, journal, len, ref, ref1, remote, sites;
    sites = [];

    if (remote = $item.parents('.page').data('site')) {
      if (remote !== location.host) {
        sites.push(remote);
      }
    }

    journal = $item.parents('.page').data('data').journal;
    ref = journal.slice(0).reverse();

    for (j = 0, len = ref.length; j < len; j++) {
      action = ref[j];

      if (action.site != null && !sites.includes(action.site)) {
        sites.push(action.site);
      }

      if (((ref1 = action.attribution) != null ? ref1.site : void 0) != null && !sites.includes(action.attribution.site)) {
        sites.push(action.attribution.site);
      }
    }

    return sites.map(function (site) {
      return wiki.site(site).getURL(item.url.replace(/^\//, ''));
    });
  };

  item.text || (item.text = item.caption);
  $item.addClass(item.size || 'thumbnail');
  $item.append("<img class='".concat(item.size || 'thumbnail', "' src='").concat(item.url, "'> <p>").concat(wiki.resolveLinks(item.text), "</p>"));
  img = $item.children('img').first();

  if (item.width) {
    img.attr('width', item.width);
  }

  if (item.height) {
    img.attr('height', item.height);
  }

  img.data('sites', alternates($item));
  img.on('error', function () {
    var site, sites;
    sites = $(this).data('sites');
    site = sites.shift();
    $(this).data('sites', sites);
    $(this).attr('src', site);

    if (sites.length === 0) {
      return $(this).off('error');
    }
  });

  if (((ref = item.location) != null ? ref.latitude : void 0) && ((ref1 = item.location) != null ? ref1.longitude : void 0)) {
    $item.addClass('marker-source');

    $item.get(0).markerData = function () {
      return {
        lat: item.location.latitude,
        lon: item.location.longitude,
        label: wiki.resolveLinks(item.text)
      };
    };
  }

  if (isOwner) {
    return img.on('load', function () {
      var flag, flagURL, imgHost, overlay;

      if ($(this).attr('src') !== item.url) {
        imgHost = new URL($(this)[0].src).hostname;
        flagURL = wiki.site(imgHost).flag();
        overlay = document.createElement('a');
        overlay.setAttribute('href', '#');
        overlay.setAttribute('title', 'fork this image');
        overlay.setAttribute('class', 'overlay');
        flag = document.createElement('img');
        flag.setAttribute('src', flagURL);
        flag.setAttribute('class', 'overlay');
        overlay.append(flag);

        if ($(this)[0].nextSibling) {
          $(this)[0].parentNode.insertBefore(overlay, $(this)[0].nextSibling);
        } else {
          $(this)[0].parentNode.appendChild(overlay);
        }

        return $(flag).on('click', /*#__PURE__*/function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(e) {
            var archiveFilename, imageNode;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    e.preventDefault();
                    imageNode = e.target.parentNode.previousSibling;
                    archiveFilename = new URL(imageNode.src).pathname.split('/').pop();
                    _context.next = 5;
                    return fetch(imageNode.src).then(function (response) {
                      return response.blob();
                    }).then(function (blob) {
                      var file, form;
                      file = new File([blob], archiveFilename, {
                        type: blob.type
                      });
                      form = new FormData();
                      form.append('image', file, file.name);
                      return fetch("/plugin/image/upload/".concat(archiveFilename), {
                        method: 'POST',
                        body: form
                      }).then(function (response) {
                        if (response.ok) {
                          $(flag).off('click');
                          return overlay.parentNode.removeChild(overlay);
                        }
                      })["catch"](function (err) {
                        return console.log('image archive failed (save)', err);
                      });
                    })["catch"](function (err) {
                      return console.log('image archive failed', err);
                    });

                  case 5:
                    return _context.abrupt("return", _context.sent);

                  case 6:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }());
      }
    });
  }
};

bind = function bind($item, item) {
  // This only really works once the images have been rendered, so we know where we are...
  if ($item.hasClass('thumbnail')) {
    if ($item.offset().left - $item.parent().offset().left < 200) {
      $item.addClass('left');
    }
  }

  $item.dblclick(function () {
    return editor({
      $item: $item,
      item: item
    });
  });
  return $item.find('img').dblclick(function (event) {
    var dialogTitle, url;
    event.stopPropagation(); // somehow test for continued existnace? Maybe register an error handler?

    url = item.source != null ? item.source : $item.children('img').first().attr('src');
    dialogTitle = (item.text || '').replace(/\[\[([^\]]+)\]\]/gi, '').replace(/\[((http|https|ftp):.*?) (.*?)\]/gi, '').replace(/\<.*?\>/gi, '');
    return wiki.dialog(dialogTitle, "<img style=\"width:100%\" src=\"".concat(url, "\">"));
  });
};

editor = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(spec) {
    var $imageEditor, $item, escape, exifrAvailable, filename, focusoutHandler, imageCaption, imageDataURL, imageLocation, imageSize, imageSourceURL, imgCurrentSize, imgPossibleSize, imgURL, item, keydownHandler, newImage, original, pasteLocation, ref, ref1, resizeImage;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            escape = function escape(string) {
              return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            };

            imageSize = function imageSize(dataURL) {
              var img;
              img = new Image();
              img.src = dataURL;
              return img.decode().then(function () {
                if (img.width > 415) {
                  return "wide";
                } else {
                  return "thumbnail";
                }
              });
            };

            $item = spec.$item;
            item = spec.item;

            if ($('.editEnable').is(':visible')) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt("return");

          case 6:
            if (item.type === 'factory') {
              // if new image is being added we have some extra information
              imageDataURL = spec.imageDataURL;
              filename = spec.filename;
              imageSourceURL = spec.imageSourceURL;
              imageCaption = spec.imageCaption;
            }

            if (item.type === 'factory') {
              document.documentElement.style.cursor = 'default';
              $item.removeClass('factory').addClass(item.type = 'image');
              $item.unbind();
              newImage = true;
              item.source = imageSourceURL;
            } else {
              newImage = false;
            }

            keydownHandler = function keydownHandler(e) {
              var page;

              if (e.which === 27) {
                // esc for save
                e.preventDefault();
                $item.focusout();
                return false;
              }

              if ((e.ctrlKey || e.metaKey) && e.which === 83) {
                // ctrl-s for save
                e.preventDefault();
                $item.focusout();
                return false;
              }

              if ((e.ctrlKey || e.metaKey) && e.which === 73) {
                // ctrl-i for information
                e.preventDefault();

                if (!e.shiftKey) {
                  page = $(e.target).parents('.page');
                }

                wiki.doInternalLink("about image plugin", page);
                return false;
              }
            }; // lets not support ctrl-m, at least for now


            focusoutHandler = /*#__PURE__*/function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(event) {
                var $page, archiveFilename, archiveImage, captionChanged, editorDiv, index, locationChanged, ref, sizeChanged;
                return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        // need to test if focus is still within the imageEditor div
                        // $item.removeClass 'imageEditing'
                        editorDiv = document.querySelector('.imageEditing');

                        if (!editorDiv.contains(event.relatedTarget)) {
                          _context2.next = 3;
                          break;
                        }

                        return _context2.abrupt("return");

                      case 3:
                        $page = $item.parents('.page:first'); // if newImage
                        //   item.url = await resizeImage imageDataURL

                        $item.removeClass('imageEditing');
                        $item.unbind();

                        if (!($item.find('textarea').val().length > 0)) {
                          _context2.next = 33;
                          break;
                        }

                        captionChanged = item.text !== $item.find('textarea').val();
                        locationChanged = item.location != null && (item.location.latitude !== $item.find('#location-lat').val() || item.location.longitude !== $item.find('#location-lon').val());
                        sizeChanged = item.size != null && $item.find('#size-select').val() != null && item.size !== $item.find('#size-select').val();
                        item.text = $item.find('textarea').val();
                        item.size = (ref = $item.find('#size-select').val()) != null ? ref : 'thumbnail';

                        if (newImage || sizeChanged) {
                          item.width = $item.children('img')[0].width;
                          item.height = $item.children('img')[0].height;
                        }

                        if ($item.find('#location-lat').val() && $item.find('#location-lon').val()) {
                          item.location = {
                            latitude: $item.find('#location-lat').val(),
                            longitude: $item.find('#location-lon').val()
                          };
                        } else {
                          delete item.location;
                          $item.removeClass('marker-source');
                        } // only save if newImage , caption, location, or size has been changed.


                        if (!(newImage || captionChanged || locationChanged || sizeChanged)) {
                          _context2.next = 29;
                          break;
                        }

                        if (!newImage) {
                          _context2.next = 22;
                          break;
                        }

                        _context2.next = 18;
                        return resizeImage(imageDataURL, 'archive');

                      case 18:
                        archiveImage = _context2.sent;
                        archiveFilename = md5(imageDataURL) + '.jpg';
                        _context2.next = 22;
                        return fetch(archiveImage).then(function (response) {
                          return response.blob();
                        }).then(function (blob) {
                          var file, form;
                          file = new File([blob], archiveFilename, {
                            type: blob.type
                          });
                          form = new FormData();
                          form.append('image', file, file.name);
                          return fetch("/plugin/image/upload/".concat(archiveFilename), {
                            method: 'POST',
                            body: form
                          }).then(function (response) {
                            if (response.ok) {
                              return item.url = "/assets/plugins/image/" + archiveFilename;
                            }
                          })["catch"](function (err) {
                            return console.log('image archive failed (save)', err);
                          });
                        })["catch"](function (err) {
                          return console.log('image archive failed', err);
                        });

                      case 22:
                        wiki.doPlugin($item.empty(), item);

                        if (!(item === original)) {
                          _context2.next = 25;
                          break;
                        }

                        return _context2.abrupt("return");

                      case 25:
                        if (item.hasOwnProperty('caption')) {
                          delete item.caption;
                        }

                        wiki.pageHandler.put($page, {
                          type: 'edit',
                          id: item.id,
                          item: item
                        });
                        _context2.next = 31;
                        break;

                      case 29:
                        index = $(".item").index($item);
                        wiki.renderFrom(index);

                      case 31:
                        _context2.next = 37;
                        break;

                      case 33:
                        wiki.pageHandler.put($page, {
                          type: 'remove',
                          id: item.id
                        });
                        index = $(".item").index($item);
                        $item.remove();
                        wiki.renderFrom(index);

                      case 37:
                        return _context2.abrupt("return", null);

                      case 38:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function focusoutHandler(_x3) {
                return _ref3.apply(this, arguments);
              };
            }();

            if (!$item.hasClass('imageEditing')) {
              _context3.next = 12;
              break;
            }

            return _context3.abrupt("return");

          case 12:
            $item.addClass('imageEditing');
            $item.unbind();
            original = JSON.parse(JSON.stringify(item));

            if (!newImage) {
              _context3.next = 26;
              break;
            }

            _context3.next = 18;
            return exifr.gps(imageDataURL);

          case 18:
            imageLocation = _context3.sent;

            if (imageLocation) {
              exifrAvailable = true;
              item.location = imageLocation;
            }

            _context3.next = 22;
            return imageSize(imageDataURL);

          case 22:
            imgPossibleSize = _context3.sent;
            imgURL = imageDataURL;
            _context3.next = 29;
            break;

          case 26:
            imgPossibleSize = $item.children('img').first()[0].naturalWidth > 415 ? 'wide' : 'thumbnail';
            imgURL = $item.children('img').first().attr('src');
            imageCaption = item.text || (item.text = item.caption);

          case 29:
            if (item.size) {
              imgCurrentSize = item.size;
            } else {
              if (newImage) {
                imgCurrentSize = imgPossibleSize;
              } else {
                imgCurrentSize = "thumbnail";
              }
            }

            $item.addClass(imgCurrentSize);
            $imageEditor = $("<img class='".concat(imgCurrentSize, "' src='").concat(imgURL, "'>\n<textarea>").concat(escape(imageCaption), "</textarea>"));
            $item.html($imageEditor);
            $item.append("<div id=\"image-options\"></div>");
            $('#image-options').append("  <details ".concat(item.location ? 'open' : '', ">\n  <summary>Location:</summary>\n  <input type='text' id='location-lat' value='").concat(((ref = item.location) != null ? ref.latitude : void 0) || '', "' placeholder='Latitude'>\n  <input type='text' id='location-lon' value='").concat(((ref1 = item.location) != null ? ref1.longitude : void 0) || '', "' placeholder='Longitude'>\n</details>"));

            pasteLocation = function pasteLocation(event) {
              var pasteLat, pasteLon, pasted, separator;
              event.preventDefault();
              separator = /[,\/]/;
              pasted = (event.originalEvent.clipboardData || window.clipboardData).getData('text');

              if (separator.test(pasted)) {
                var _pasted$split$map = pasted.split(separator).map(function (i) {
                  return i.trim();
                });

                var _pasted$split$map2 = _slicedToArray(_pasted$split$map, 2);

                pasteLat = _pasted$split$map2[0];
                pasteLon = _pasted$split$map2[1];

                if (!(isNaN(pasteLat) || isNaN(pasteLon))) {
                  item.location = {
                    latitude: pasteLat,
                    longitude: pasteLon
                  };
                  $item.find('#location-lat').val(pasteLat);
                  return $item.find('#location-lon').val(pasteLon);
                }
              }
            };

            $('#location-lat').on('paste', pasteLocation);
            $('#location-lon').on('paste', pasteLocation);

            if (imgPossibleSize === "wide") {
              $('#image-options').append("<div>\n  <label>Image Size:</label>\n  <select id=\"size-select\">\n    <option value=\"\" disabled>--Please choose a size--</option>\n    <option value=\"thumbnail\">Half page width</option>\n    <option value=\"wide\">Full page width</option>\n  </select>\n</div>");
              $item.find("#size-select option[value='".concat(imgCurrentSize, "']")).attr('selected', true);
              $('#size-select').change(function () {
                $item.removeClass("thumbnail wide");
                $item.addClass($(this).val());
                return $item.find('img').removeClass("thumbnail wide").addClass($(this).val());
              });
            }

            $item.focusout(focusoutHandler).bind('keydown', keydownHandler);
            $imageEditor.focus(); // from https://web.archive.org/web/20140327091827/http://www.benknowscode.com/2014/01/resizing-images-in-browser-using-canvas.html
            // Patrick Oswald version from comment, coffeescript and further simplification for wiki

            return _context3.abrupt("return", resizeImage = function resizeImage(dataURL) {
              var cH, cW, imageQuality, smallEnough, src, tH, tW;
              src = new Image();
              cW = void 0;
              cH = void 0; // target sizes

              tW = 1920;
              tH = 1080; // image quality

              imageQuality = 0.5;

              smallEnough = function smallEnough(img) {
                return img.width <= tW && img.height <= tH;
              };

              return new Promise(function (resolve) {
                src.src = dataURL;
                return src.onload = function () {
                  return resolve();
                };
              }).then(function () {
                cW = src.naturalWidth;
                return cH = src.naturalHeight;
              }).then(function () {
                var iterations, oversize, prescale; // determine size for first squeeze

                if (smallEnough(src)) {
                  return;
                }

                oversize = Math.max(1, cW / tW, cH / tH);
                iterations = Math.floor(Math.log2(oversize));
                prescale = oversize / Math.pow(2, iterations);
                cW = Math.round(cW / prescale);
                return cH = Math.round(cH / prescale);
              }).then(function () {
                return new Promise(function (resolve) {
                  var tmp;
                  tmp = new Image();
                  tmp.src = src.src;
                  return tmp.onload = function () {
                    var canvas, context;

                    if (smallEnough(tmp)) {
                      return resolve(dataURL);
                    }

                    canvas = document.createElement('canvas');
                    canvas.width = cW;
                    canvas.height = cH;
                    context = canvas.getContext('2d');
                    context.drawImage(tmp, 0, 0, cW, cH);
                    dataURL = canvas.toDataURL('image/jpeg', imageQuality);
                    cW /= 2;
                    cH /= 2;
                    return tmp.src = dataURL;
                  };
                });
              }).then(function () {
                return dataURL;
              });
            });

          case 42:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function editor(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

if (typeof window !== "undefined" && window !== null) {
  window.plugins.image = {
    emit: emit,
    bind: bind,
    editor: editor
  };
}

module.exports = {
  emit: emit,
  bind: bind,
  editor: editor
};

},{"./md5":2,"exifr":3}],2:[function(require,module,exports){
//  A formatted version of a popular md5 implementation.
//  Original copyright (c) Paul Johnston & Greg Holt.
//  The function itself is now 42 lines long.

function md5(inputString) {
  var hc="0123456789abcdef";
  function rh(n) {var j,s="";for(j=0;j<=3;j++) s+=hc.charAt((n>>(j*8+4))&0x0F)+hc.charAt((n>>(j*8))&0x0F);return s;}
  function ad(x,y) {var l=(x&0xFFFF)+(y&0xFFFF);var m=(x>>16)+(y>>16)+(l>>16);return (m<<16)|(l&0xFFFF);}
  function rl(n,c)            {return (n<<c)|(n>>>(32-c));}
  function cm(q,a,b,x,s,t)    {return ad(rl(ad(ad(a,q),ad(x,t)),s),b);}
  function ff(a,b,c,d,x,s,t)  {return cm((b&c)|((~b)&d),a,b,x,s,t);}
  function gg(a,b,c,d,x,s,t)  {return cm((b&d)|(c&(~d)),a,b,x,s,t);}
  function hh(a,b,c,d,x,s,t)  {return cm(b^c^d,a,b,x,s,t);}
  function ii(a,b,c,d,x,s,t)  {return cm(c^(b|(~d)),a,b,x,s,t);}
  function sb(x) {
      var i;var nblk=((x.length+8)>>6)+1;var blks=new Array(nblk*16);for(i=0;i<nblk*16;i++) blks[i]=0;
      for(i=0;i<x.length;i++) blks[i>>2]|=x.charCodeAt(i)<<((i%4)*8);
      blks[i>>2]|=0x80<<((i%4)*8);blks[nblk*16-2]=x.length*8;return blks;
  }
  var i,x=sb(inputString),a=1732584193,b=-271733879,c=-1732584194,d=271733878,olda,oldb,oldc,oldd;
  for(i=0;i<x.length;i+=16) {olda=a;oldb=b;oldc=c;oldd=d;
      a=ff(a,b,c,d,x[i+ 0], 7, -680876936);d=ff(d,a,b,c,x[i+ 1],12, -389564586);c=ff(c,d,a,b,x[i+ 2],17,  606105819);
      b=ff(b,c,d,a,x[i+ 3],22,-1044525330);a=ff(a,b,c,d,x[i+ 4], 7, -176418897);d=ff(d,a,b,c,x[i+ 5],12, 1200080426);
      c=ff(c,d,a,b,x[i+ 6],17,-1473231341);b=ff(b,c,d,a,x[i+ 7],22,  -45705983);a=ff(a,b,c,d,x[i+ 8], 7, 1770035416);
      d=ff(d,a,b,c,x[i+ 9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,     -42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);
      a=ff(a,b,c,d,x[i+12], 7, 1804603682);d=ff(d,a,b,c,x[i+13],12,  -40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);
      b=ff(b,c,d,a,x[i+15],22, 1236535329);a=gg(a,b,c,d,x[i+ 1], 5, -165796510);d=gg(d,a,b,c,x[i+ 6], 9,-1069501632);
      c=gg(c,d,a,b,x[i+11],14,  643717713);b=gg(b,c,d,a,x[i+ 0],20, -373897302);a=gg(a,b,c,d,x[i+ 5], 5, -701558691);
      d=gg(d,a,b,c,x[i+10], 9,   38016083);c=gg(c,d,a,b,x[i+15],14, -660478335);b=gg(b,c,d,a,x[i+ 4],20, -405537848);
      a=gg(a,b,c,d,x[i+ 9], 5,  568446438);d=gg(d,a,b,c,x[i+14], 9,-1019803690);c=gg(c,d,a,b,x[i+ 3],14, -187363961);
      b=gg(b,c,d,a,x[i+ 8],20, 1163531501);a=gg(a,b,c,d,x[i+13], 5,-1444681467);d=gg(d,a,b,c,x[i+ 2], 9,  -51403784);
      c=gg(c,d,a,b,x[i+ 7],14, 1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734);a=hh(a,b,c,d,x[i+ 5], 4,    -378558);
      d=hh(d,a,b,c,x[i+ 8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16, 1839030562);b=hh(b,c,d,a,x[i+14],23,  -35309556);
      a=hh(a,b,c,d,x[i+ 1], 4,-1530992060);d=hh(d,a,b,c,x[i+ 4],11, 1272893353);c=hh(c,d,a,b,x[i+ 7],16, -155497632);
      b=hh(b,c,d,a,x[i+10],23,-1094730640);a=hh(a,b,c,d,x[i+13], 4,  681279174);d=hh(d,a,b,c,x[i+ 0],11, -358537222);
      c=hh(c,d,a,b,x[i+ 3],16, -722521979);b=hh(b,c,d,a,x[i+ 6],23,   76029189);a=hh(a,b,c,d,x[i+ 9], 4, -640364487);
      d=hh(d,a,b,c,x[i+12],11, -421815835);c=hh(c,d,a,b,x[i+15],16,  530742520);b=hh(b,c,d,a,x[i+ 2],23, -995338651);
      a=ii(a,b,c,d,x[i+ 0], 6, -198630844);d=ii(d,a,b,c,x[i+ 7],10, 1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);
      b=ii(b,c,d,a,x[i+ 5],21,  -57434055);a=ii(a,b,c,d,x[i+12], 6, 1700485571);d=ii(d,a,b,c,x[i+ 3],10,-1894986606);
      c=ii(c,d,a,b,x[i+10],15,   -1051523);b=ii(b,c,d,a,x[i+ 1],21,-2054922799);a=ii(a,b,c,d,x[i+ 8], 6, 1873313359);
      d=ii(d,a,b,c,x[i+15],10,  -30611744);c=ii(c,d,a,b,x[i+ 6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21, 1309151649);
      a=ii(a,b,c,d,x[i+ 4], 6, -145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+ 2],15,  718787259);
      b=ii(b,c,d,a,x[i+ 9],21, -343485551);a=ad(a,olda);b=ad(b,oldb);c=ad(c,oldc);d=ad(d,oldd);
  }
  return rh(a)+rh(b)+rh(c)+rh(d);
}

module.exports = md5
},{}],3:[function(require,module,exports){
(function (process,global,Buffer){(function (){
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define("exifr",["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).exifr={})}(this,(function(e){"use strict";var t="undefined"!=typeof self?self:global;const i="undefined"!=typeof navigator,n=i&&"undefined"==typeof HTMLImageElement,s=!("undefined"==typeof global||"undefined"==typeof process||!process.versions||!process.versions.node),r=t.Buffer,a=t.BigInt,o=!!r,l=e=>e;function h(e,t=l){if(s)try{return"function"==typeof require?Promise.resolve(t(require(e))):import(/* webpackIgnore: true */ e).then(t)}catch(t){console.warn(`Couldn't load ${e}`)}}let u=t.fetch;const c=e=>u=e;if(!t.fetch){const e=h("http",(e=>e)),t=h("https",(e=>e)),i=(n,{headers:s}={})=>new Promise((async(r,a)=>{let{port:o,hostname:l,pathname:h,protocol:u,search:c}=new URL(n);const f={method:"GET",hostname:l,path:encodeURI(h)+c,headers:s};""!==o&&(f.port=Number(o));const d=("https:"===u?await t:await e).request(f,(e=>{if(301===e.statusCode||302===e.statusCode){let t=new URL(e.headers.location,n).toString();return i(t,{headers:s}).then(r).catch(a)}r({status:e.statusCode,arrayBuffer:()=>new Promise((t=>{let i=[];e.on("data",(e=>i.push(e))),e.on("end",(()=>t(Buffer.concat(i))))}))})}));d.on("error",a),d.end()}));c(i)}function f(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}const d=e=>g(e)?void 0:e,p=e=>void 0!==e;function g(e){return void 0===e||(e instanceof Map?0===e.size:0===Object.values(e).filter(p).length)}function m(e){let t=new Error(e);throw delete t.stack,t}function S(e){return""===(e=function(e){for(;e.endsWith("\0");)e=e.slice(0,-1);return e}(e).trim())?void 0:e}function C(e){let t=function(e){let t=0;return e.ifd0.enabled&&(t+=1024),e.exif.enabled&&(t+=2048),e.makerNote&&(t+=2048),e.userComment&&(t+=1024),e.gps.enabled&&(t+=512),e.interop.enabled&&(t+=100),e.ifd1.enabled&&(t+=1024),t+2048}(e);return e.jfif.enabled&&(t+=50),e.xmp.enabled&&(t+=2e4),e.iptc.enabled&&(t+=14e3),e.icc.enabled&&(t+=6e3),t}const y=e=>String.fromCharCode.apply(null,e),b="undefined"!=typeof TextDecoder?new TextDecoder("utf-8"):void 0;function P(e){return b?b.decode(e):o?Buffer.from(e).toString("utf8"):decodeURIComponent(escape(y(e)))}class I{static from(e,t){return e instanceof this&&e.le===t?e:new I(e,void 0,void 0,t)}constructor(e,t=0,i,n){if("boolean"==typeof n&&(this.le=n),Array.isArray(e)&&(e=new Uint8Array(e)),0===e)this.byteOffset=0,this.byteLength=0;else if(e instanceof ArrayBuffer){void 0===i&&(i=e.byteLength-t);let n=new DataView(e,t,i);this._swapDataView(n)}else if(e instanceof Uint8Array||e instanceof DataView||e instanceof I){void 0===i&&(i=e.byteLength-t),(t+=e.byteOffset)+i>e.byteOffset+e.byteLength&&m("Creating view outside of available memory in ArrayBuffer");let n=new DataView(e.buffer,t,i);this._swapDataView(n)}else if("number"==typeof e){let t=new DataView(new ArrayBuffer(e));this._swapDataView(t)}else m("Invalid input argument for BufferView: "+e)}_swapArrayBuffer(e){this._swapDataView(new DataView(e))}_swapBuffer(e){this._swapDataView(new DataView(e.buffer,e.byteOffset,e.byteLength))}_swapDataView(e){this.dataView=e,this.buffer=e.buffer,this.byteOffset=e.byteOffset,this.byteLength=e.byteLength}_lengthToEnd(e){return this.byteLength-e}set(e,t,i=I){return e instanceof DataView||e instanceof I?e=new Uint8Array(e.buffer,e.byteOffset,e.byteLength):e instanceof ArrayBuffer&&(e=new Uint8Array(e)),e instanceof Uint8Array||m("BufferView.set(): Invalid data argument."),this.toUint8().set(e,t),new i(this,t,e.byteLength)}subarray(e,t){return t=t||this._lengthToEnd(e),new I(this,e,t)}toUint8(){return new Uint8Array(this.buffer,this.byteOffset,this.byteLength)}getUint8Array(e,t){return new Uint8Array(this.buffer,this.byteOffset+e,t)}getString(e=0,t=this.byteLength){return P(this.getUint8Array(e,t))}getLatin1String(e=0,t=this.byteLength){let i=this.getUint8Array(e,t);return y(i)}getUnicodeString(e=0,t=this.byteLength){const i=[];for(let n=0;n<t&&e+n<this.byteLength;n+=2)i.push(this.getUint16(e+n));return y(i)}getInt8(e){return this.dataView.getInt8(e)}getUint8(e){return this.dataView.getUint8(e)}getInt16(e,t=this.le){return this.dataView.getInt16(e,t)}getInt32(e,t=this.le){return this.dataView.getInt32(e,t)}getUint16(e,t=this.le){return this.dataView.getUint16(e,t)}getUint32(e,t=this.le){return this.dataView.getUint32(e,t)}getFloat32(e,t=this.le){return this.dataView.getFloat32(e,t)}getFloat64(e,t=this.le){return this.dataView.getFloat64(e,t)}getFloat(e,t=this.le){return this.dataView.getFloat32(e,t)}getDouble(e,t=this.le){return this.dataView.getFloat64(e,t)}getUintBytes(e,t,i){switch(t){case 1:return this.getUint8(e,i);case 2:return this.getUint16(e,i);case 4:return this.getUint32(e,i);case 8:return this.getUint64&&this.getUint64(e,i)}}getUint(e,t,i){switch(t){case 8:return this.getUint8(e,i);case 16:return this.getUint16(e,i);case 32:return this.getUint32(e,i);case 64:return this.getUint64&&this.getUint64(e,i)}}toString(e){return this.dataView.toString(e,this.constructor.name)}ensureChunk(){}}function k(e,t){m(`${e} '${t}' was not loaded, try using full build of exifr.`)}class w extends Map{constructor(e){super(),this.kind=e}get(e,t){return this.has(e)||k(this.kind,e),t&&(e in t||function(e,t){m(`Unknown ${e} '${t}'.`)}(this.kind,e),t[e].enabled||k(this.kind,e)),super.get(e)}keyList(){return Array.from(this.keys())}}var T=new w("file parser"),A=new w("segment parser"),D=new w("file reader");const O="Invalid input argument";function x(e,t){return"string"==typeof e?v(e,t):i&&!n&&e instanceof HTMLImageElement?v(e.src,t):e instanceof Uint8Array||e instanceof ArrayBuffer||e instanceof DataView?new I(e):i&&e instanceof Blob?M(e,t,"blob",U):void m(O)}function v(e,t){return(n=e).startsWith("data:")||n.length>1e4?R(e,t,"base64"):s&&e.includes("://")?M(e,t,"url",L):s?R(e,t,"fs"):i?M(e,t,"url",L):void m(O);var n}async function M(e,t,i,n){return D.has(i)?R(e,t,i):n?async function(e,t){let i=await t(e);return new I(i)}(e,n):void m(`Parser ${i} is not loaded`)}async function R(e,t,i){let n=new(D.get(i))(e,t);return await n.read(),n}const L=e=>u(e).then((e=>e.arrayBuffer())),U=e=>new Promise(((t,i)=>{let n=new FileReader;n.onloadend=()=>t(n.result||new ArrayBuffer),n.onerror=i,n.readAsArrayBuffer(e)}));class F extends Map{get tagKeys(){return this.allKeys||(this.allKeys=Array.from(this.keys())),this.allKeys}get tagValues(){return this.allValues||(this.allValues=Array.from(this.values())),this.allValues}}function B(e,t,i){let n=new F;for(let[e,t]of i)n.set(e,t);if(Array.isArray(t))for(let i of t)e.set(i,n);else e.set(t,n);return n}function E(e,t,i){let n,s=e.get(t);for(n of i)s.set(n[0],n[1])}const N=new Map,G=new Map,V=new Map,z=37500,H=37510,j=700,W=33723,K=34675,X=34665,_=34853,Y=40965,$=["chunked","firstChunkSize","firstChunkSizeNode","firstChunkSizeBrowser","chunkSize","chunkLimit"],J=["jfif","xmp","icc","iptc","ihdr"],q=["tiff",...J],Q=["ifd0","ifd1","exif","gps","interop"],Z=[...q,...Q],ee=["makerNote","userComment"],te=["translateKeys","translateValues","reviveValues","multiSegment"],ie=[...te,"sanitize","mergeOutput","silentErrors"];class ne{get translate(){return this.translateKeys||this.translateValues||this.reviveValues}}class se extends ne{get needed(){return this.enabled||this.deps.size>0}constructor(e,t,i,n){if(super(),f(this,"enabled",!1),f(this,"skip",new Set),f(this,"pick",new Set),f(this,"deps",new Set),f(this,"translateKeys",!1),f(this,"translateValues",!1),f(this,"reviveValues",!1),this.key=e,this.enabled=t,this.parse=this.enabled,this.applyInheritables(n),this.canBeFiltered=Q.includes(e),this.canBeFiltered&&(this.dict=N.get(e)),void 0!==i)if(Array.isArray(i))this.parse=this.enabled=!0,this.canBeFiltered&&i.length>0&&this.translateTagSet(i,this.pick);else if("object"==typeof i){if(this.enabled=!0,this.parse=!1!==i.parse,this.canBeFiltered){let{pick:e,skip:t}=i;e&&e.length>0&&this.translateTagSet(e,this.pick),t&&t.length>0&&this.translateTagSet(t,this.skip)}this.applyInheritables(i)}else!0===i||!1===i?this.parse=this.enabled=i:m(`Invalid options argument: ${i}`)}applyInheritables(e){let t,i;for(t of te)i=e[t],void 0!==i&&(this[t]=i)}translateTagSet(e,t){if(this.dict){let i,n,{tagKeys:s,tagValues:r}=this.dict;for(i of e)"string"==typeof i?(n=r.indexOf(i),-1===n&&(n=s.indexOf(Number(i))),-1!==n&&t.add(Number(s[n]))):t.add(i)}else for(let i of e)t.add(i)}finalizeFilters(){!this.enabled&&this.deps.size>0?(this.enabled=!0,ue(this.pick,this.deps)):this.enabled&&this.pick.size>0&&ue(this.pick,this.deps)}}var re={jfif:!1,tiff:!0,xmp:!1,icc:!1,iptc:!1,ifd0:!0,ifd1:!1,exif:!0,gps:!0,interop:!1,ihdr:void 0,makerNote:!1,userComment:!1,multiSegment:!1,skip:[],pick:[],translateKeys:!0,translateValues:!0,reviveValues:!0,sanitize:!0,mergeOutput:!0,silentErrors:!0,chunked:!0,firstChunkSize:void 0,firstChunkSizeNode:512,firstChunkSizeBrowser:65536,chunkSize:65536,chunkLimit:5},ae=new Map;class oe extends ne{static useCached(e){let t=ae.get(e);return void 0!==t||(t=new this(e),ae.set(e,t)),t}constructor(e){super(),!0===e?this.setupFromTrue():void 0===e?this.setupFromUndefined():Array.isArray(e)?this.setupFromArray(e):"object"==typeof e?this.setupFromObject(e):m(`Invalid options argument ${e}`),void 0===this.firstChunkSize&&(this.firstChunkSize=i?this.firstChunkSizeBrowser:this.firstChunkSizeNode),this.mergeOutput&&(this.ifd1.enabled=!1),this.filterNestedSegmentTags(),this.traverseTiffDependencyTree(),this.checkLoadedPlugins()}setupFromUndefined(){let e;for(e of $)this[e]=re[e];for(e of ie)this[e]=re[e];for(e of ee)this[e]=re[e];for(e of Z)this[e]=new se(e,re[e],void 0,this)}setupFromTrue(){let e;for(e of $)this[e]=re[e];for(e of ie)this[e]=re[e];for(e of ee)this[e]=!0;for(e of Z)this[e]=new se(e,!0,void 0,this)}setupFromArray(e){let t;for(t of $)this[t]=re[t];for(t of ie)this[t]=re[t];for(t of ee)this[t]=re[t];for(t of Z)this[t]=new se(t,!1,void 0,this);this.setupGlobalFilters(e,void 0,Q)}setupFromObject(e){let t;for(t of(Q.ifd0=Q.ifd0||Q.image,Q.ifd1=Q.ifd1||Q.thumbnail,Object.assign(this,e),$))this[t]=he(e[t],re[t]);for(t of ie)this[t]=he(e[t],re[t]);for(t of ee)this[t]=he(e[t],re[t]);for(t of q)this[t]=new se(t,re[t],e[t],this);for(t of Q)this[t]=new se(t,re[t],e[t],this.tiff);this.setupGlobalFilters(e.pick,e.skip,Q,Z),!0===e.tiff?this.batchEnableWithBool(Q,!0):!1===e.tiff?this.batchEnableWithUserValue(Q,e):Array.isArray(e.tiff)?this.setupGlobalFilters(e.tiff,void 0,Q):"object"==typeof e.tiff&&this.setupGlobalFilters(e.tiff.pick,e.tiff.skip,Q)}batchEnableWithBool(e,t){for(let i of e)this[i].enabled=t}batchEnableWithUserValue(e,t){for(let i of e){let e=t[i];this[i].enabled=!1!==e&&void 0!==e}}setupGlobalFilters(e,t,i,n=i){if(e&&e.length){for(let e of n)this[e].enabled=!1;let t=le(e,i);for(let[e,i]of t)ue(this[e].pick,i),this[e].enabled=!0}else if(t&&t.length){let e=le(t,i);for(let[t,i]of e)ue(this[t].skip,i)}}filterNestedSegmentTags(){let{ifd0:e,exif:t,xmp:i,iptc:n,icc:s}=this;this.makerNote?t.deps.add(z):t.skip.add(z),this.userComment?t.deps.add(H):t.skip.add(H),i.enabled||e.skip.add(j),n.enabled||e.skip.add(W),s.enabled||e.skip.add(K)}traverseTiffDependencyTree(){let{ifd0:e,exif:t,gps:i,interop:n}=this;n.needed&&(t.deps.add(Y),e.deps.add(Y)),t.needed&&e.deps.add(X),i.needed&&e.deps.add(_),this.tiff.enabled=Q.some((e=>!0===this[e].enabled))||this.makerNote||this.userComment;for(let e of Q)this[e].finalizeFilters()}get onlyTiff(){return!J.map((e=>this[e].enabled)).some((e=>!0===e))&&this.tiff.enabled}checkLoadedPlugins(){for(let e of q)this[e].enabled&&!A.has(e)&&k("segment parser",e)}}function le(e,t){let i,n,s,r,a=[];for(s of t){for(r of(i=N.get(s),n=[],i))(e.includes(r[0])||e.includes(r[1]))&&n.push(r[0]);n.length&&a.push([s,n])}return a}function he(e,t){return void 0!==e?e:void 0!==t?t:void 0}function ue(e,t){for(let i of t)e.add(i)}f(oe,"default",re);class ce{constructor(e){f(this,"parsers",{}),f(this,"output",{}),f(this,"errors",[]),f(this,"pushToErrors",(e=>this.errors.push(e))),this.options=oe.useCached(e)}async read(e){this.file=await x(e,this.options)}setup(){if(this.fileParser)return;let{file:e}=this,t=e.getUint16(0);for(let[i,n]of T)if(n.canHandle(e,t))return this.fileParser=new n(this.options,this.file,this.parsers),e[i]=!0;this.file.close&&this.file.close(),m("Unknown file format")}async parse(){let{output:e,errors:t}=this;return this.setup(),this.options.silentErrors?(await this.executeParsers().catch(this.pushToErrors),t.push(...this.fileParser.errors)):await this.executeParsers(),this.file.close&&this.file.close(),this.options.silentErrors&&t.length>0&&(e.errors=t),d(e)}async executeParsers(){let{output:e}=this;await this.fileParser.parse();let t=Object.values(this.parsers).map((async t=>{let i=await t.parse();t.assignToOutput(e,i)}));this.options.silentErrors&&(t=t.map((e=>e.catch(this.pushToErrors)))),await Promise.all(t)}async extractThumbnail(){this.setup();let{options:e,file:t}=this,i=A.get("tiff",e);var n;if(t.tiff?n={start:0,type:"tiff"}:t.jpeg&&(n=await this.fileParser.getOrFindSegment("tiff")),void 0===n)return;let s=await this.fileParser.ensureSegmentChunk(n),r=this.parsers.tiff=new i(s,e,t),a=await r.extractThumbnail();return t.close&&t.close(),a}}async function fe(e,t){let i=new ce(t);return await i.read(e),i.parse()}var de=Object.freeze({__proto__:null,parse:fe,Exifr:ce,fileParsers:T,segmentParsers:A,fileReaders:D,tagKeys:N,tagValues:G,tagRevivers:V,createDictionary:B,extendDictionary:E,fetchUrlAsArrayBuffer:L,readBlobAsArrayBuffer:U,chunkedProps:$,otherSegments:J,segments:q,tiffBlocks:Q,segmentsAndBlocks:Z,tiffExtractables:ee,inheritables:te,allFormatters:ie,Options:oe});class pe{constructor(e,t,i){f(this,"errors",[]),f(this,"ensureSegmentChunk",(async e=>{let t=e.start,i=e.size||65536;if(this.file.chunked)if(this.file.available(t,i))e.chunk=this.file.subarray(t,i);else try{e.chunk=await this.file.readChunk(t,i)}catch(t){m(`Couldn't read segment: ${JSON.stringify(e)}. ${t.message}`)}else this.file.byteLength>t+i?e.chunk=this.file.subarray(t,i):void 0===e.size?e.chunk=this.file.subarray(t):m("Segment unreachable: "+JSON.stringify(e));return e.chunk})),this.extendOptions&&this.extendOptions(e),this.options=e,this.file=t,this.parsers=i}injectSegment(e,t){this.options[e].enabled&&this.createParser(e,t)}createParser(e,t){let i=new(A.get(e))(t,this.options,this.file);return this.parsers[e]=i}createParsers(e){for(let t of e){let{type:e,chunk:i}=t,n=this.options[e];if(n&&n.enabled){let t=this.parsers[e];t&&t.append||t||this.createParser(e,i)}}}async readSegments(e){let t=e.map(this.ensureSegmentChunk);await Promise.all(t)}}class ge{static findPosition(e,t){let i=e.getUint16(t+2)+2,n="function"==typeof this.headerLength?this.headerLength(e,t,i):this.headerLength,s=t+n,r=i-n;return{offset:t,length:i,headerLength:n,start:s,size:r,end:s+r}}static parse(e,t={}){return new this(e,new oe({[this.type]:t}),e).parse()}normalizeInput(e){return e instanceof I?e:new I(e)}constructor(e,t={},i){f(this,"errors",[]),f(this,"raw",new Map),f(this,"handleError",(e=>{if(!this.options.silentErrors)throw e;this.errors.push(e.message)})),this.chunk=this.normalizeInput(e),this.file=i,this.type=this.constructor.type,this.globalOptions=this.options=t,this.localOptions=t[this.type],this.canTranslate=this.localOptions&&this.localOptions.translate}translate(){this.canTranslate&&(this.translated=this.translateBlock(this.raw,this.type))}get output(){return this.translated?this.translated:this.raw?Object.fromEntries(this.raw):void 0}translateBlock(e,t){let i=V.get(t),n=G.get(t),s=N.get(t),r=this.options[t],a=r.reviveValues&&!!i,o=r.translateValues&&!!n,l=r.translateKeys&&!!s,h={};for(let[t,r]of e)a&&i.has(t)?r=i.get(t)(r):o&&n.has(t)&&(r=this.translateValue(r,n.get(t))),l&&s.has(t)&&(t=s.get(t)||t),h[t]=r;return h}translateValue(e,t){return t[e]||t.DEFAULT||e}assignToOutput(e,t){this.assignObjectToOutput(e,this.constructor.type,t)}assignObjectToOutput(e,t,i){if(this.globalOptions.mergeOutput)return Object.assign(e,i);e[t]?Object.assign(e[t],i):e[t]=i}}f(ge,"headerLength",4),f(ge,"type",void 0),f(ge,"multiSegment",!1),f(ge,"canHandle",(()=>!1));function me(e){return 192===e||194===e||196===e||219===e||221===e||218===e||254===e}function Se(e){return e>=224&&e<=239}function Ce(e,t,i){for(let[n,s]of A)if(s.canHandle(e,t,i))return n}class ye extends pe{constructor(...e){super(...e),f(this,"appSegments",[]),f(this,"jpegSegments",[]),f(this,"unknownSegments",[])}static canHandle(e,t){return 65496===t}async parse(){await this.findAppSegments(),await this.readSegments(this.appSegments),this.mergeMultiSegments(),this.createParsers(this.mergedAppSegments||this.appSegments)}setupSegmentFinderArgs(e){!0===e?(this.findAll=!0,this.wanted=new Set(A.keyList())):(e=void 0===e?A.keyList().filter((e=>this.options[e].enabled)):e.filter((e=>this.options[e].enabled&&A.has(e))),this.findAll=!1,this.remaining=new Set(e),this.wanted=new Set(e)),this.unfinishedMultiSegment=!1}async findAppSegments(e=0,t){this.setupSegmentFinderArgs(t);let{file:i,findAll:n,wanted:s,remaining:r}=this;if(!n&&this.file.chunked&&(n=Array.from(s).some((e=>{let t=A.get(e),i=this.options[e];return t.multiSegment&&i.multiSegment})),n&&await this.file.readWhole()),e=this.findAppSegmentsInRange(e,i.byteLength),!this.options.onlyTiff&&i.chunked){let t=!1;for(;r.size>0&&!t&&(i.canReadNextChunk||this.unfinishedMultiSegment);){let{nextChunkOffset:n}=i,s=this.appSegments.some((e=>!this.file.available(e.offset||e.start,e.length||e.size)));if(t=e>n&&!s?!await i.readNextChunk(e):!await i.readNextChunk(n),void 0===(e=this.findAppSegmentsInRange(e,i.byteLength)))return}}}findAppSegmentsInRange(e,t){t-=2;let i,n,s,r,a,o,{file:l,findAll:h,wanted:u,remaining:c,options:f}=this;for(;e<t;e++)if(255===l.getUint8(e))if(i=l.getUint8(e+1),Se(i)){if(n=l.getUint16(e+2),s=Ce(l,e,n),s&&u.has(s)&&(r=A.get(s),a=r.findPosition(l,e),o=f[s],a.type=s,this.appSegments.push(a),!h&&(r.multiSegment&&o.multiSegment?(this.unfinishedMultiSegment=a.chunkNumber<a.chunkCount,this.unfinishedMultiSegment||c.delete(s)):c.delete(s),0===c.size)))break;f.recordUnknownSegments&&(a=ge.findPosition(l,e),a.marker=i,this.unknownSegments.push(a)),e+=n+1}else if(me(i)){if(n=l.getUint16(e+2),218===i&&!1!==f.stopAfterSos)return;f.recordJpegSegments&&this.jpegSegments.push({offset:e,length:n,marker:i}),e+=n+1}return e}mergeMultiSegments(){if(!this.appSegments.some((e=>e.multiSegment)))return;let e=function(e,t){let i,n,s,r=new Map;for(let a=0;a<e.length;a++)i=e[a],n=i[t],r.has(n)?s=r.get(n):r.set(n,s=[]),s.push(i);return Array.from(r)}(this.appSegments,"type");this.mergedAppSegments=e.map((([e,t])=>{let i=A.get(e,this.options);if(i.handleMultiSegments){return{type:e,chunk:i.handleMultiSegments(t)}}return t[0]}))}getSegment(e){return this.appSegments.find((t=>t.type===e))}async getOrFindSegment(e){let t=this.getSegment(e);return void 0===t&&(await this.findAppSegments(0,[e]),t=this.getSegment(e)),t}}f(ye,"type","jpeg"),T.set("jpeg",ye);const be=[void 0,1,1,2,4,8,1,1,2,4,8,4,8,4];class Pe extends ge{parseHeader(){var e=this.chunk.getUint16();18761===e?this.le=!0:19789===e&&(this.le=!1),this.chunk.le=this.le,this.headerParsed=!0}parseTags(e,t,i=new Map){let{pick:n,skip:s}=this.options[t];n=new Set(n);let r=n.size>0,a=0===s.size,o=this.chunk.getUint16(e);e+=2;for(let l=0;l<o;l++){let o=this.chunk.getUint16(e);if(r){if(n.has(o)&&(i.set(o,this.parseTag(e,o,t)),n.delete(o),0===n.size))break}else!a&&s.has(o)||i.set(o,this.parseTag(e,o,t));e+=12}return i}parseTag(e,t,i){let{chunk:n}=this,s=n.getUint16(e+2),r=n.getUint32(e+4),a=be[s];if(a*r<=4?e+=8:e=n.getUint32(e+8),(s<1||s>13)&&m(`Invalid TIFF value type. block: ${i.toUpperCase()}, tag: ${t.toString(16)}, type: ${s}, offset ${e}`),e>n.byteLength&&m(`Invalid TIFF value offset. block: ${i.toUpperCase()}, tag: ${t.toString(16)}, type: ${s}, offset ${e} is outside of chunk size ${n.byteLength}`),1===s)return n.getUint8Array(e,r);if(2===s)return S(n.getString(e,r));if(7===s)return n.getUint8Array(e,r);if(1===r)return this.parseTagValue(s,e);{let t=new(function(e){switch(e){case 1:return Uint8Array;case 3:return Uint16Array;case 4:return Uint32Array;case 5:return Array;case 6:return Int8Array;case 8:return Int16Array;case 9:return Int32Array;case 10:return Array;case 11:return Float32Array;case 12:return Float64Array;default:return Array}}(s))(r),i=a;for(let n=0;n<r;n++)t[n]=this.parseTagValue(s,e),e+=i;return t}}parseTagValue(e,t){let{chunk:i}=this;switch(e){case 1:return i.getUint8(t);case 3:return i.getUint16(t);case 4:return i.getUint32(t);case 5:return i.getUint32(t)/i.getUint32(t+4);case 6:return i.getInt8(t);case 8:return i.getInt16(t);case 9:return i.getInt32(t);case 10:return i.getInt32(t)/i.getInt32(t+4);case 11:return i.getFloat(t);case 12:return i.getDouble(t);case 13:return i.getUint32(t);default:m(`Invalid tiff type ${e}`)}}}class Ie extends Pe{static canHandle(e,t){return 225===e.getUint8(t+1)&&1165519206===e.getUint32(t+4)&&0===e.getUint16(t+8)}async parse(){this.parseHeader();let{options:e}=this;return e.ifd0.enabled&&await this.parseIfd0Block(),e.exif.enabled&&await this.safeParse("parseExifBlock"),e.gps.enabled&&await this.safeParse("parseGpsBlock"),e.interop.enabled&&await this.safeParse("parseInteropBlock"),e.ifd1.enabled&&await this.safeParse("parseThumbnailBlock"),this.createOutput()}safeParse(e){let t=this[e]();return void 0!==t.catch&&(t=t.catch(this.handleError)),t}findIfd0Offset(){void 0===this.ifd0Offset&&(this.ifd0Offset=this.chunk.getUint32(4))}findIfd1Offset(){if(void 0===this.ifd1Offset){this.findIfd0Offset();let e=this.chunk.getUint16(this.ifd0Offset),t=this.ifd0Offset+2+12*e;this.ifd1Offset=this.chunk.getUint32(t)}}parseBlock(e,t){let i=new Map;return this[t]=i,this.parseTags(e,t,i),i}async parseIfd0Block(){if(this.ifd0)return;let{file:e}=this;this.findIfd0Offset(),this.ifd0Offset<8&&m("Malformed EXIF data"),!e.chunked&&this.ifd0Offset>e.byteLength&&m(`IFD0 offset points to outside of file.\nthis.ifd0Offset: ${this.ifd0Offset}, file.byteLength: ${e.byteLength}`),e.tiff&&await e.ensureChunk(this.ifd0Offset,C(this.options));let t=this.parseBlock(this.ifd0Offset,"ifd0");return 0!==t.size?(this.exifOffset=t.get(X),this.interopOffset=t.get(Y),this.gpsOffset=t.get(_),this.xmp=t.get(j),this.iptc=t.get(W),this.icc=t.get(K),this.options.sanitize&&(t.delete(X),t.delete(Y),t.delete(_),t.delete(j),t.delete(W),t.delete(K)),t):void 0}async parseExifBlock(){if(this.exif)return;if(this.ifd0||await this.parseIfd0Block(),void 0===this.exifOffset)return;this.file.tiff&&await this.file.ensureChunk(this.exifOffset,C(this.options));let e=this.parseBlock(this.exifOffset,"exif");return this.interopOffset||(this.interopOffset=e.get(Y)),this.makerNote=e.get(z),this.userComment=e.get(H),this.options.sanitize&&(e.delete(Y),e.delete(z),e.delete(H)),this.unpack(e,41728),this.unpack(e,41729),e}unpack(e,t){let i=e.get(t);i&&1===i.length&&e.set(t,i[0])}async parseGpsBlock(){if(this.gps)return;if(this.ifd0||await this.parseIfd0Block(),void 0===this.gpsOffset)return;let e=this.parseBlock(this.gpsOffset,"gps");return e&&e.has(2)&&e.has(4)&&(e.set("latitude",ke(...e.get(2),e.get(1))),e.set("longitude",ke(...e.get(4),e.get(3)))),e}async parseInteropBlock(){if(!this.interop&&(this.ifd0||await this.parseIfd0Block(),void 0!==this.interopOffset||this.exif||await this.parseExifBlock(),void 0!==this.interopOffset))return this.parseBlock(this.interopOffset,"interop")}async parseThumbnailBlock(e=!1){if(!this.ifd1&&!this.ifd1Parsed&&(!this.options.mergeOutput||e))return this.findIfd1Offset(),this.ifd1Offset>0&&(this.parseBlock(this.ifd1Offset,"ifd1"),this.ifd1Parsed=!0),this.ifd1}async extractThumbnail(){if(this.headerParsed||this.parseHeader(),this.ifd1Parsed||await this.parseThumbnailBlock(!0),void 0===this.ifd1)return;let e=this.ifd1.get(513),t=this.ifd1.get(514);return this.chunk.getUint8Array(e,t)}get image(){return this.ifd0}get thumbnail(){return this.ifd1}createOutput(){let e,t,i,n={};for(t of Q)if(e=this[t],!g(e))if(i=this.canTranslate?this.translateBlock(e,t):Object.fromEntries(e),this.options.mergeOutput){if("ifd1"===t)continue;Object.assign(n,i)}else n[t]=i;return this.makerNote&&(n.makerNote=this.makerNote),this.userComment&&(n.userComment=this.userComment),n}assignToOutput(e,t){if(this.globalOptions.mergeOutput)Object.assign(e,t);else for(let[i,n]of Object.entries(t))this.assignObjectToOutput(e,i,n)}}function ke(e,t,i,n){var s=e+t/60+i/3600;return"S"!==n&&"W"!==n||(s*=-1),s}f(Ie,"type","tiff"),f(Ie,"headerLength",10),A.set("tiff",Ie);var we=Object.freeze({__proto__:null,default:de,Exifr:ce,fileParsers:T,segmentParsers:A,fileReaders:D,tagKeys:N,tagValues:G,tagRevivers:V,createDictionary:B,extendDictionary:E,fetchUrlAsArrayBuffer:L,readBlobAsArrayBuffer:U,chunkedProps:$,otherSegments:J,segments:q,tiffBlocks:Q,segmentsAndBlocks:Z,tiffExtractables:ee,inheritables:te,allFormatters:ie,Options:oe,parse:fe});const Te={ifd0:!1,ifd1:!1,exif:!1,gps:!1,interop:!1,sanitize:!1,reviveValues:!0,translateKeys:!1,translateValues:!1,mergeOutput:!1},Ae=Object.assign({},Te,{firstChunkSize:4e4,gps:[1,2,3,4]});async function De(e){let t=new ce(Ae);await t.read(e);let i=await t.parse();if(i&&i.gps){let{latitude:e,longitude:t}=i.gps;return{latitude:e,longitude:t}}}const Oe=Object.assign({},Te,{tiff:!1,ifd1:!0,mergeOutput:!1});async function xe(e){let t=new ce(Oe);await t.read(e);let i=await t.extractThumbnail();return i&&o?r.from(i):i}async function ve(e){let t=await this.thumbnail(e);if(void 0!==t){let e=new Blob([t]);return URL.createObjectURL(e)}}const Me=Object.assign({},Te,{firstChunkSize:4e4,ifd0:[274]});async function Re(e){let t=new ce(Me);await t.read(e);let i=await t.parse();if(i&&i.ifd0)return i.ifd0[274]}const Le=Object.freeze({1:{dimensionSwapped:!1,scaleX:1,scaleY:1,deg:0,rad:0},2:{dimensionSwapped:!1,scaleX:-1,scaleY:1,deg:0,rad:0},3:{dimensionSwapped:!1,scaleX:1,scaleY:1,deg:180,rad:180*Math.PI/180},4:{dimensionSwapped:!1,scaleX:-1,scaleY:1,deg:180,rad:180*Math.PI/180},5:{dimensionSwapped:!0,scaleX:1,scaleY:-1,deg:90,rad:90*Math.PI/180},6:{dimensionSwapped:!0,scaleX:1,scaleY:1,deg:90,rad:90*Math.PI/180},7:{dimensionSwapped:!0,scaleX:1,scaleY:-1,deg:270,rad:270*Math.PI/180},8:{dimensionSwapped:!0,scaleX:1,scaleY:1,deg:270,rad:270*Math.PI/180}});if(e.rotateCanvas=!0,e.rotateCss=!0,"object"==typeof navigator){let t=navigator.userAgent;if(t.includes("iPad")||t.includes("iPhone")){let i=t.match(/OS (\d+)_(\d+)/);if(i){let[,t,n]=i,s=Number(t)+.1*Number(n);e.rotateCanvas=s<13.4,e.rotateCss=!1}}else if(t.includes("OS X 10")){let[,i]=t.match(/OS X 10[_.](\d+)/);e.rotateCanvas=e.rotateCss=Number(i)<15}if(t.includes("Chrome/")){let[,i]=t.match(/Chrome\/(\d+)/);e.rotateCanvas=e.rotateCss=Number(i)<81}else if(t.includes("Firefox/")){let[,i]=t.match(/Firefox\/(\d+)/);e.rotateCanvas=e.rotateCss=Number(i)<77}}async function Ue(t){let i=await Re(t);return Object.assign({canvas:e.rotateCanvas,css:e.rotateCss},Le[i])}class Fe extends I{constructor(...e){super(...e),f(this,"ranges",new Be),0!==this.byteLength&&this.ranges.add(0,this.byteLength)}_tryExtend(e,t,i){if(0===e&&0===this.byteLength&&i){let e=new DataView(i.buffer||i,i.byteOffset,i.byteLength);this._swapDataView(e)}else{let i=e+t;if(i>this.byteLength){let{dataView:e}=this._extend(i);this._swapDataView(e)}}}_extend(e){let t;t=o?r.allocUnsafe(e):new Uint8Array(e);let i=new DataView(t.buffer,t.byteOffset,t.byteLength);return t.set(new Uint8Array(this.buffer,this.byteOffset,this.byteLength),0),{uintView:t,dataView:i}}subarray(e,t,i=!1){return t=t||this._lengthToEnd(e),i&&this._tryExtend(e,t),this.ranges.add(e,t),super.subarray(e,t)}set(e,t,i=!1){i&&this._tryExtend(t,e.byteLength,e);let n=super.set(e,t);return this.ranges.add(t,n.byteLength),n}async ensureChunk(e,t){this.chunked&&(this.ranges.available(e,t)||await this.readChunk(e,t))}available(e,t){return this.ranges.available(e,t)}}class Be{constructor(){f(this,"list",[])}get length(){return this.list.length}add(e,t,i=0){let n=e+t,s=this.list.filter((t=>Ee(e,t.offset,n)||Ee(e,t.end,n)));if(s.length>0){e=Math.min(e,...s.map((e=>e.offset))),n=Math.max(n,...s.map((e=>e.end))),t=n-e;let i=s.shift();i.offset=e,i.length=t,i.end=n,this.list=this.list.filter((e=>!s.includes(e)))}else this.list.push({offset:e,length:t,end:n})}available(e,t){let i=e+t;return this.list.some((t=>t.offset<=e&&i<=t.end))}}function Ee(e,t,i){return e<=t&&t<=i}class Ne extends Fe{constructor(e,t){super(0),f(this,"chunksRead",0),this.input=e,this.options=t}async readWhole(){this.chunked=!1,await this.readChunk(this.nextChunkOffset)}async readChunked(){this.chunked=!0,await this.readChunk(0,this.options.firstChunkSize)}async readNextChunk(e=this.nextChunkOffset){if(this.fullyRead)return this.chunksRead++,!1;let t=this.options.chunkSize,i=await this.readChunk(e,t);return!!i&&i.byteLength===t}async readChunk(e,t){if(this.chunksRead++,0!==(t=this.safeWrapAddress(e,t)))return this._readChunk(e,t)}safeWrapAddress(e,t){return void 0!==this.size&&e+t>this.size?Math.max(0,this.size-e):t}get nextChunkOffset(){if(0!==this.ranges.list.length)return this.ranges.list[0].length}get canReadNextChunk(){return this.chunksRead<this.options.chunkLimit}get fullyRead(){return void 0!==this.size&&this.nextChunkOffset===this.size}read(){return this.options.chunked?this.readChunked():this.readWhole()}close(){}}D.set("blob",class extends Ne{async readWhole(){this.chunked=!1;let e=await U(this.input);this._swapArrayBuffer(e)}readChunked(){return this.chunked=!0,this.size=this.input.size,super.readChunked()}async _readChunk(e,t){let i=t?e+t:void 0,n=this.input.slice(e,i),s=await U(n);return this.set(s,e,!0)}});var Ge=Object.freeze({__proto__:null,default:we,Exifr:ce,fileParsers:T,segmentParsers:A,fileReaders:D,tagKeys:N,tagValues:G,tagRevivers:V,createDictionary:B,extendDictionary:E,fetchUrlAsArrayBuffer:L,readBlobAsArrayBuffer:U,chunkedProps:$,otherSegments:J,segments:q,tiffBlocks:Q,segmentsAndBlocks:Z,tiffExtractables:ee,inheritables:te,allFormatters:ie,Options:oe,parse:fe,gpsOnlyOptions:Ae,gps:De,thumbnailOnlyOptions:Oe,thumbnail:xe,thumbnailUrl:ve,orientationOnlyOptions:Me,orientation:Re,rotations:Le,get rotateCanvas(){return e.rotateCanvas},get rotateCss(){return e.rotateCss},rotation:Ue});D.set("url",class extends Ne{async readWhole(){this.chunked=!1;let e=await L(this.input);e instanceof ArrayBuffer?this._swapArrayBuffer(e):e instanceof Uint8Array&&this._swapBuffer(e)}async _readChunk(e,t){let i=t?e+t-1:void 0,n=this.options.httpHeaders||{};(e||i)&&(n.range=`bytes=${[e,i].join("-")}`);let s=await u(this.input,{headers:n}),r=await s.arrayBuffer(),a=r.byteLength;if(416!==s.status)return a!==t&&(this.size=e+a),this.set(r,e,!0)}});I.prototype.getUint64=function(e){let t=this.getUint32(e),i=this.getUint32(e+4);return t<1048575?t<<32|i:void 0!==typeof a?(console.warn("Using BigInt because of type 64uint but JS can only handle 53b numbers."),a(t)<<a(32)|a(i)):void m("Trying to read 64b value but JS can only handle 53b numbers.")};class Ve extends pe{parseBoxes(e=0){let t=[];for(;e<this.file.byteLength-4;){let i=this.parseBoxHead(e);if(t.push(i),0===i.length)break;e+=i.length}return t}parseSubBoxes(e){e.boxes=this.parseBoxes(e.start)}findBox(e,t){return void 0===e.boxes&&this.parseSubBoxes(e),e.boxes.find((e=>e.kind===t))}parseBoxHead(e){let t=this.file.getUint32(e),i=this.file.getString(e+4,4),n=e+8;return 1===t&&(t=this.file.getUint64(e+8),n+=8),{offset:e,length:t,kind:i,start:n}}parseBoxFullHead(e){if(void 0!==e.version)return;let t=this.file.getUint32(e.start);e.version=t>>24,e.start+=4}}class ze extends Ve{static canHandle(e,t){if(0!==t)return!1;let i=e.getUint16(2);if(i>50)return!1;let n=16,s=[];for(;n<i;)s.push(e.getString(n,4)),n+=4;return s.includes(this.type)}async parse(){let e=this.file.getUint32(0),t=this.parseBoxHead(e);for(;"meta"!==t.kind;)e+=t.length,await this.file.ensureChunk(e,16),t=this.parseBoxHead(e);await this.file.ensureChunk(t.offset,t.length),this.parseBoxFullHead(t),this.parseSubBoxes(t),this.options.icc.enabled&&await this.findIcc(t),this.options.tiff.enabled&&await this.findExif(t)}async registerSegment(e,t,i){await this.file.ensureChunk(t,i);let n=this.file.subarray(t,i);this.createParser(e,n)}async findIcc(e){let t=this.findBox(e,"iprp");if(void 0===t)return;let i=this.findBox(t,"ipco");if(void 0===i)return;let n=this.findBox(i,"colr");void 0!==n&&await this.registerSegment("icc",n.offset+12,n.length)}async findExif(e){let t=this.findBox(e,"iinf");if(void 0===t)return;let i=this.findBox(e,"iloc");if(void 0===i)return;let n=this.findExifLocIdInIinf(t),s=this.findExtentInIloc(i,n);if(void 0===s)return;let[r,a]=s;await this.file.ensureChunk(r,a);let o=4+this.file.getUint32(r);r+=o,a-=o,await this.registerSegment("tiff",r,a)}findExifLocIdInIinf(e){this.parseBoxFullHead(e);let t,i,n,s,r=e.start,a=this.file.getUint16(r);for(r+=2;a--;){if(t=this.parseBoxHead(r),this.parseBoxFullHead(t),i=t.start,t.version>=2&&(n=3===t.version?4:2,s=this.file.getString(i+n+2,4),"Exif"===s))return this.file.getUintBytes(i,n);r+=t.length}}get8bits(e){let t=this.file.getUint8(e);return[t>>4,15&t]}findExtentInIloc(e,t){this.parseBoxFullHead(e);let i=e.start,[n,s]=this.get8bits(i++),[r,a]=this.get8bits(i++),o=2===e.version?4:2,l=1===e.version||2===e.version?2:0,h=a+n+s,u=2===e.version?4:2,c=this.file.getUintBytes(i,u);for(i+=u;c--;){let e=this.file.getUintBytes(i,o);i+=o+l+2+r;let u=this.file.getUint16(i);if(i+=2,e===t)return u>1&&console.warn("ILOC box has more than one extent but we're only processing one\nPlease create an issue at https://github.com/MikeKovarik/exifr with this file"),[this.file.getUintBytes(i+a,n),this.file.getUintBytes(i+a+n,s)];i+=u*h}}}class He extends ze{}f(He,"type","heic");class je extends ze{}f(je,"type","avif"),T.set("heic",He),T.set("avif",je),B(N,["ifd0","ifd1"],[[256,"ImageWidth"],[257,"ImageHeight"],[258,"BitsPerSample"],[259,"Compression"],[262,"PhotometricInterpretation"],[270,"ImageDescription"],[271,"Make"],[272,"Model"],[273,"StripOffsets"],[274,"Orientation"],[277,"SamplesPerPixel"],[278,"RowsPerStrip"],[279,"StripByteCounts"],[282,"XResolution"],[283,"YResolution"],[284,"PlanarConfiguration"],[296,"ResolutionUnit"],[301,"TransferFunction"],[305,"Software"],[306,"ModifyDate"],[315,"Artist"],[316,"HostComputer"],[317,"Predictor"],[318,"WhitePoint"],[319,"PrimaryChromaticities"],[513,"ThumbnailOffset"],[514,"ThumbnailLength"],[529,"YCbCrCoefficients"],[530,"YCbCrSubSampling"],[531,"YCbCrPositioning"],[532,"ReferenceBlackWhite"],[700,"ApplicationNotes"],[33432,"Copyright"],[33723,"IPTC"],[34665,"ExifIFD"],[34675,"ICC"],[34853,"GpsIFD"],[330,"SubIFD"],[40965,"InteropIFD"],[40091,"XPTitle"],[40092,"XPComment"],[40093,"XPAuthor"],[40094,"XPKeywords"],[40095,"XPSubject"]]),B(N,"exif",[[33434,"ExposureTime"],[33437,"FNumber"],[34850,"ExposureProgram"],[34852,"SpectralSensitivity"],[34855,"ISO"],[34858,"TimeZoneOffset"],[34859,"SelfTimerMode"],[34864,"SensitivityType"],[34865,"StandardOutputSensitivity"],[34866,"RecommendedExposureIndex"],[34867,"ISOSpeed"],[34868,"ISOSpeedLatitudeyyy"],[34869,"ISOSpeedLatitudezzz"],[36864,"ExifVersion"],[36867,"DateTimeOriginal"],[36868,"CreateDate"],[36873,"GooglePlusUploadCode"],[36880,"OffsetTime"],[36881,"OffsetTimeOriginal"],[36882,"OffsetTimeDigitized"],[37121,"ComponentsConfiguration"],[37122,"CompressedBitsPerPixel"],[37377,"ShutterSpeedValue"],[37378,"ApertureValue"],[37379,"BrightnessValue"],[37380,"ExposureCompensation"],[37381,"MaxApertureValue"],[37382,"SubjectDistance"],[37383,"MeteringMode"],[37384,"LightSource"],[37385,"Flash"],[37386,"FocalLength"],[37393,"ImageNumber"],[37394,"SecurityClassification"],[37395,"ImageHistory"],[37396,"SubjectArea"],[37500,"MakerNote"],[37510,"UserComment"],[37520,"SubSecTime"],[37521,"SubSecTimeOriginal"],[37522,"SubSecTimeDigitized"],[37888,"AmbientTemperature"],[37889,"Humidity"],[37890,"Pressure"],[37891,"WaterDepth"],[37892,"Acceleration"],[37893,"CameraElevationAngle"],[40960,"FlashpixVersion"],[40961,"ColorSpace"],[40962,"ExifImageWidth"],[40963,"ExifImageHeight"],[40964,"RelatedSoundFile"],[41483,"FlashEnergy"],[41486,"FocalPlaneXResolution"],[41487,"FocalPlaneYResolution"],[41488,"FocalPlaneResolutionUnit"],[41492,"SubjectLocation"],[41493,"ExposureIndex"],[41495,"SensingMethod"],[41728,"FileSource"],[41729,"SceneType"],[41730,"CFAPattern"],[41985,"CustomRendered"],[41986,"ExposureMode"],[41987,"WhiteBalance"],[41988,"DigitalZoomRatio"],[41989,"FocalLengthIn35mmFormat"],[41990,"SceneCaptureType"],[41991,"GainControl"],[41992,"Contrast"],[41993,"Saturation"],[41994,"Sharpness"],[41996,"SubjectDistanceRange"],[42016,"ImageUniqueID"],[42032,"OwnerName"],[42033,"SerialNumber"],[42034,"LensInfo"],[42035,"LensMake"],[42036,"LensModel"],[42037,"LensSerialNumber"],[42080,"CompositeImage"],[42081,"CompositeImageCount"],[42082,"CompositeImageExposureTimes"],[42240,"Gamma"],[59932,"Padding"],[59933,"OffsetSchema"],[65e3,"OwnerName"],[65001,"SerialNumber"],[65002,"Lens"],[65100,"RawFile"],[65101,"Converter"],[65102,"WhiteBalance"],[65105,"Exposure"],[65106,"Shadows"],[65107,"Brightness"],[65108,"Contrast"],[65109,"Saturation"],[65110,"Sharpness"],[65111,"Smoothness"],[65112,"MoireFilter"],[40965,"InteropIFD"]]),B(N,"gps",[[0,"GPSVersionID"],[1,"GPSLatitudeRef"],[2,"GPSLatitude"],[3,"GPSLongitudeRef"],[4,"GPSLongitude"],[5,"GPSAltitudeRef"],[6,"GPSAltitude"],[7,"GPSTimeStamp"],[8,"GPSSatellites"],[9,"GPSStatus"],[10,"GPSMeasureMode"],[11,"GPSDOP"],[12,"GPSSpeedRef"],[13,"GPSSpeed"],[14,"GPSTrackRef"],[15,"GPSTrack"],[16,"GPSImgDirectionRef"],[17,"GPSImgDirection"],[18,"GPSMapDatum"],[19,"GPSDestLatitudeRef"],[20,"GPSDestLatitude"],[21,"GPSDestLongitudeRef"],[22,"GPSDestLongitude"],[23,"GPSDestBearingRef"],[24,"GPSDestBearing"],[25,"GPSDestDistanceRef"],[26,"GPSDestDistance"],[27,"GPSProcessingMethod"],[28,"GPSAreaInformation"],[29,"GPSDateStamp"],[30,"GPSDifferential"],[31,"GPSHPositioningError"]]),B(G,["ifd0","ifd1"],[[274,{1:"Horizontal (normal)",2:"Mirror horizontal",3:"Rotate 180",4:"Mirror vertical",5:"Mirror horizontal and rotate 270 CW",6:"Rotate 90 CW",7:"Mirror horizontal and rotate 90 CW",8:"Rotate 270 CW"}],[296,{1:"None",2:"inches",3:"cm"}]]);let We=B(G,"exif",[[34850,{0:"Not defined",1:"Manual",2:"Normal program",3:"Aperture priority",4:"Shutter priority",5:"Creative program",6:"Action program",7:"Portrait mode",8:"Landscape mode"}],[37121,{0:"-",1:"Y",2:"Cb",3:"Cr",4:"R",5:"G",6:"B"}],[37383,{0:"Unknown",1:"Average",2:"CenterWeightedAverage",3:"Spot",4:"MultiSpot",5:"Pattern",6:"Partial",255:"Other"}],[37384,{0:"Unknown",1:"Daylight",2:"Fluorescent",3:"Tungsten (incandescent light)",4:"Flash",9:"Fine weather",10:"Cloudy weather",11:"Shade",12:"Daylight fluorescent (D 5700 - 7100K)",13:"Day white fluorescent (N 4600 - 5400K)",14:"Cool white fluorescent (W 3900 - 4500K)",15:"White fluorescent (WW 3200 - 3700K)",17:"Standard light A",18:"Standard light B",19:"Standard light C",20:"D55",21:"D65",22:"D75",23:"D50",24:"ISO studio tungsten",255:"Other"}],[37385,{0:"Flash did not fire",1:"Flash fired",5:"Strobe return light not detected",7:"Strobe return light detected",9:"Flash fired, compulsory flash mode",13:"Flash fired, compulsory flash mode, return light not detected",15:"Flash fired, compulsory flash mode, return light detected",16:"Flash did not fire, compulsory flash mode",24:"Flash did not fire, auto mode",25:"Flash fired, auto mode",29:"Flash fired, auto mode, return light not detected",31:"Flash fired, auto mode, return light detected",32:"No flash function",65:"Flash fired, red-eye reduction mode",69:"Flash fired, red-eye reduction mode, return light not detected",71:"Flash fired, red-eye reduction mode, return light detected",73:"Flash fired, compulsory flash mode, red-eye reduction mode",77:"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",79:"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",89:"Flash fired, auto mode, red-eye reduction mode",93:"Flash fired, auto mode, return light not detected, red-eye reduction mode",95:"Flash fired, auto mode, return light detected, red-eye reduction mode"}],[41495,{1:"Not defined",2:"One-chip color area sensor",3:"Two-chip color area sensor",4:"Three-chip color area sensor",5:"Color sequential area sensor",7:"Trilinear sensor",8:"Color sequential linear sensor"}],[41728,{1:"Film Scanner",2:"Reflection Print Scanner",3:"Digital Camera"}],[41729,{1:"Directly photographed"}],[41985,{0:"Normal",1:"Custom",2:"HDR (no original saved)",3:"HDR (original saved)",4:"Original (for HDR)",6:"Panorama",7:"Portrait HDR",8:"Portrait"}],[41986,{0:"Auto",1:"Manual",2:"Auto bracket"}],[41987,{0:"Auto",1:"Manual"}],[41990,{0:"Standard",1:"Landscape",2:"Portrait",3:"Night",4:"Other"}],[41991,{0:"None",1:"Low gain up",2:"High gain up",3:"Low gain down",4:"High gain down"}],[41996,{0:"Unknown",1:"Macro",2:"Close",3:"Distant"}],[42080,{0:"Unknown",1:"Not a Composite Image",2:"General Composite Image",3:"Composite Image Captured While Shooting"}]]);const Ke={1:"No absolute unit of measurement",2:"Inch",3:"Centimeter"};We.set(37392,Ke),We.set(41488,Ke);const Xe={0:"Normal",1:"Low",2:"High"};function _e(e){return"object"==typeof e&&void 0!==e.length?e[0]:e}function Ye(e){let t=Array.from(e).slice(1);return t[1]>15&&(t=t.map((e=>String.fromCharCode(e)))),"0"!==t[2]&&0!==t[2]||t.pop(),t.join(".")}function $e(e){if("string"==typeof e){var[t,i,n,s,r,a]=e.trim().split(/[-: ]/g).map(Number),o=new Date(t,i-1,n);return Number.isNaN(s)||Number.isNaN(r)||Number.isNaN(a)||(o.setHours(s),o.setMinutes(r),o.setSeconds(a)),Number.isNaN(+o)?e:o}}function Je(e){if("string"==typeof e)return e;let t=[];if(0===e[1]&&0===e[e.length-1])for(let i=0;i<e.length;i+=2)t.push(qe(e[i+1],e[i]));else for(let i=0;i<e.length;i+=2)t.push(qe(e[i],e[i+1]));return S(String.fromCodePoint(...t))}function qe(e,t){return e<<8|t}We.set(41992,Xe),We.set(41993,Xe),We.set(41994,Xe),B(V,["ifd0","ifd1"],[[50827,function(e){return"string"!=typeof e?P(e):e}],[306,$e],[40091,Je],[40092,Je],[40093,Je],[40094,Je],[40095,Je]]),B(V,"exif",[[40960,Ye],[36864,Ye],[36867,$e],[36868,$e],[40962,_e],[40963,_e]]),B(V,"gps",[[0,e=>Array.from(e).join(".")],[7,e=>Array.from(e).join(":")]]);const Qe="http://ns.adobe.com/",Ze="http://ns.adobe.com/xmp/extension/";class et extends ge{static canHandle(e,t){return 225===e.getUint8(t+1)&&1752462448===e.getUint32(t+4)&&e.getString(t+4,Qe.length)===Qe}static headerLength(e,t){return e.getString(t+4,Ze.length)===Ze?79:4+"http://ns.adobe.com/xap/1.0/".length+1}static findPosition(e,t){let i=super.findPosition(e,t);return i.multiSegment=i.extended=79===i.headerLength,i.multiSegment?(i.chunkCount=e.getUint8(t+72),i.chunkNumber=e.getUint8(t+76),0!==e.getUint8(t+77)&&i.chunkNumber++):(i.chunkCount=1/0,i.chunkNumber=-1),i}static handleMultiSegments(e){return e.map((e=>e.chunk.getString())).join("")}normalizeInput(e){return"string"==typeof e?e:I.from(e).getString()}parse(e=this.chunk){if(!this.localOptions.parse)return e;e=function(e){let t={},i={};for(let e of ut)t[e]=[],i[e]=0;return e.replace(ct,((e,n,s)=>{if("<"===n){let n=++i[s];return t[s].push(n),`${e}#${n}`}return`${e}#${t[s].pop()}`}))}(e);let t=nt.findAll(e,"rdf","Description");0===t.length&&t.push(new nt("rdf","Description",void 0,e));let i,n={};for(let e of t)for(let t of e.properties)i=ot(t.ns,n),st(t,i);return function(e){let t;for(let i in e)t=e[i]=d(e[i]),void 0===t&&delete e[i];return d(e)}(n)}assignToOutput(e,t){if(this.localOptions.parse)for(let[i,n]of Object.entries(t))switch(i){case"tiff":this.assignObjectToOutput(e,"ifd0",n);break;case"exif":this.assignObjectToOutput(e,"exif",n);break;case"xmlns":break;default:this.assignObjectToOutput(e,i,n)}else e.xmp=t}}f(et,"type","xmp"),f(et,"multiSegment",!0),A.set("xmp",et);class tt{static findAll(e){return lt(e,/([a-zA-Z0-9-]+):([a-zA-Z0-9-]+)=("[^"]*"|'[^']*')/gm).map(tt.unpackMatch)}static unpackMatch(e){let t=e[1],i=e[2],n=e[3].slice(1,-1);return n=ht(n),new tt(t,i,n)}constructor(e,t,i){this.ns=e,this.name=t,this.value=i}serialize(){return this.value}}const it="[\\w\\d-]+";class nt{static findAll(e,t,i){if(void 0!==t||void 0!==i){t=t||it,i=i||it;var n=new RegExp(`<(${t}):(${i})(#\\d+)?((\\s+?[\\w\\d-:]+=("[^"]*"|'[^']*'))*\\s*)(\\/>|>([\\s\\S]*?)<\\/\\1:\\2\\3>)`,"gm")}else n=/<([\w\d-]+):([\w\d-]+)(#\d+)?((\s+?[\w\d-:]+=("[^"]*"|'[^']*'))*\s*)(\/>|>([\s\S]*?)<\/\1:\2\3>)/gm;return lt(e,n).map(nt.unpackMatch)}static unpackMatch(e){let t=e[1],i=e[2],n=e[4],s=e[8];return new nt(t,i,n,s)}constructor(e,t,i,n){this.ns=e,this.name=t,this.attrString=i,this.innerXml=n,this.attrs=tt.findAll(i),this.children=nt.findAll(n),this.value=0===this.children.length?ht(n):void 0,this.properties=[...this.attrs,...this.children]}get isPrimitive(){return void 0!==this.value&&0===this.attrs.length&&0===this.children.length}get isListContainer(){return 1===this.children.length&&this.children[0].isList}get isList(){let{ns:e,name:t}=this;return"rdf"===e&&("Seq"===t||"Bag"===t||"Alt"===t)}get isListItem(){return"rdf"===this.ns&&"li"===this.name}serialize(){if(0===this.properties.length&&void 0===this.value)return;if(this.isPrimitive)return this.value;if(this.isListContainer)return this.children[0].serialize();if(this.isList)return at(this.children.map(rt));if(this.isListItem&&1===this.children.length&&0===this.attrs.length)return this.children[0].serialize();let e={};for(let t of this.properties)st(t,e);return void 0!==this.value&&(e.value=this.value),d(e)}}function st(e,t){let i=e.serialize();void 0!==i&&(t[e.name]=i)}var rt=e=>e.serialize(),at=e=>1===e.length?e[0]:e,ot=(e,t)=>t[e]?t[e]:t[e]={};function lt(e,t){let i,n=[];if(!e)return n;for(;null!==(i=t.exec(e));)n.push(i);return n}function ht(e){if(function(e){return null==e||"null"===e||"undefined"===e||""===e||""===e.trim()}(e))return;let t=Number(e);if(!Number.isNaN(t))return t;let i=e.toLowerCase();return"true"===i||"false"!==i&&e.trim()}const ut=["rdf:li","rdf:Seq","rdf:Bag","rdf:Alt","rdf:Description"],ct=new RegExp(`(<|\\/)(${ut.join("|")})`,"g");var ft=Object.freeze({__proto__:null,default:Ge,Exifr:ce,fileParsers:T,segmentParsers:A,fileReaders:D,tagKeys:N,tagValues:G,tagRevivers:V,createDictionary:B,extendDictionary:E,fetchUrlAsArrayBuffer:L,readBlobAsArrayBuffer:U,chunkedProps:$,otherSegments:J,segments:q,tiffBlocks:Q,segmentsAndBlocks:Z,tiffExtractables:ee,inheritables:te,allFormatters:ie,Options:oe,parse:fe,gpsOnlyOptions:Ae,gps:De,thumbnailOnlyOptions:Oe,thumbnail:xe,thumbnailUrl:ve,orientationOnlyOptions:Me,orientation:Re,rotations:Le,get rotateCanvas(){return e.rotateCanvas},get rotateCss(){return e.rotateCss},rotation:Ue});const dt=["xmp","icc","iptc","tiff"],pt=()=>{};async function gt(e,t,i){let n=i[e];return n.enabled=!0,n.parse=!0,A.get(e).parse(t,n)}let mt=h("fs",(e=>e.promises));D.set("fs",class extends Ne{async readWhole(){this.chunked=!1,this.fs=await mt;let e=await this.fs.readFile(this.input);this._swapBuffer(e)}async readChunked(){this.chunked=!0,this.fs=await mt,await this.open(),await this.readChunk(0,this.options.firstChunkSize)}async open(){void 0===this.fh&&(this.fh=await this.fs.open(this.input,"r"),this.size=(await this.fh.stat(this.input)).size)}async _readChunk(e,t){void 0===this.fh&&await this.open(),e+t>this.size&&(t=this.size-e);var i=this.subarray(e,t,!0);return await this.fh.read(i.dataView,0,t,e),i}async close(){if(this.fh){let e=this.fh;this.fh=void 0,await e.close()}}});D.set("base64",class extends Ne{constructor(...e){super(...e),this.input=this.input.replace(/^data:([^;]+);base64,/gim,""),this.size=this.input.length/4*3,this.input.endsWith("==")?this.size-=2:this.input.endsWith("=")&&(this.size-=1)}async _readChunk(e,t){let i,n,s=this.input;void 0===e?(e=0,i=0,n=0):(i=4*Math.floor(e/3),n=e-i/4*3),void 0===t&&(t=this.size);let a=e+t,l=i+4*Math.ceil(a/3);s=s.slice(i,l);let h=Math.min(t,this.size-e);if(o){let t=r.from(s,"base64").slice(n,n+h);return this.set(t,e,!0)}{let t=this.subarray(e,h,!0),i=atob(s),r=t.toUint8();for(let e=0;e<h;e++)r[e]=i.charCodeAt(n+e);return t}}});class St extends pe{static canHandle(e,t){return 18761===t||19789===t}extendOptions(e){let{ifd0:t,xmp:i,iptc:n,icc:s}=e;i.enabled&&t.deps.add(j),n.enabled&&t.deps.add(W),s.enabled&&t.deps.add(K),t.finalizeFilters()}async parse(){let{tiff:e,xmp:t,iptc:i,icc:n}=this.options;if(e.enabled||t.enabled||i.enabled||n.enabled){let e=Math.max(C(this.options),this.options.chunkSize);await this.file.ensureChunk(0,e),this.createParser("tiff",this.file),this.parsers.tiff.parseHeader(),await this.parsers.tiff.parseIfd0Block(),this.adaptTiffPropAsSegment("xmp"),this.adaptTiffPropAsSegment("iptc"),this.adaptTiffPropAsSegment("icc")}}adaptTiffPropAsSegment(e){if(this.parsers.tiff[e]){let t=this.parsers.tiff[e];this.injectSegment(e,t)}}}f(St,"type","tiff"),T.set("tiff",St);let Ct=h("zlib");const yt="XML:com.adobe.xmp",bt="ihdr",Pt="iccp",It="text",kt="itxt",wt=[bt,Pt,It,kt,"exif"];class Tt extends pe{constructor(...e){super(...e),f(this,"catchError",(e=>this.errors.push(e))),f(this,"metaChunks",[]),f(this,"unknownChunks",[])}static canHandle(e,t){return 35152===t&&2303741511===e.getUint32(0)&&218765834===e.getUint32(4)}async parse(){let{file:e}=this;await this.findPngChunksInRange("PNG\r\n\n".length,e.byteLength),await this.readSegments(this.metaChunks),this.findIhdr(),this.parseTextChunks(),await this.findExif().catch(this.catchError),await this.findXmp().catch(this.catchError),await this.findIcc().catch(this.catchError)}async findPngChunksInRange(e,t){let{file:i}=this;for(;e<t;){let t=i.getUint32(e),n=i.getUint32(e+4),s=i.getString(e+4,4).toLowerCase(),r=t+4+4+4,a={type:s,offset:e,length:r,start:e+4+4,size:t,marker:n};wt.includes(s)?this.metaChunks.push(a):this.unknownChunks.push(a),e+=r}}parseTextChunks(){let e=this.metaChunks.filter((e=>e.type===It));for(let t of e){let[e,i]=this.file.getString(t.start,t.size).split("\0");this.injectKeyValToIhdr(e,i)}}injectKeyValToIhdr(e,t){let i=this.parsers.ihdr;i&&i.raw.set(e,t)}findIhdr(){let e=this.metaChunks.find((e=>e.type===bt));e&&!1!==this.options.ihdr.enabled&&this.createParser(bt,e.chunk)}async findExif(){let e=this.metaChunks.find((e=>"exif"===e.type));e&&this.injectSegment("tiff",e.chunk)}async findXmp(){let e=this.metaChunks.filter((e=>e.type===kt));for(let t of e){t.chunk.getString(0,yt.length)===yt&&this.injectSegment("xmp",t.chunk)}}async findIcc(){let e=this.metaChunks.find((e=>e.type===Pt));if(!e)return;let{chunk:t}=e,i=t.getUint8Array(0,81),n=0;for(;n<80&&0!==i[n];)n++;let r=n+2,a=t.getString(0,n);if(this.injectKeyValToIhdr("ProfileName",a),s){let e=await Ct,i=t.getUint8Array(r);i=e.inflateSync(i),this.injectSegment("icc",i)}}}f(Tt,"type","png"),T.set("png",Tt),B(N,"interop",[[1,"InteropIndex"],[2,"InteropVersion"],[4096,"RelatedImageFileFormat"],[4097,"RelatedImageWidth"],[4098,"RelatedImageHeight"]]),E(N,"ifd0",[[11,"ProcessingSoftware"],[254,"SubfileType"],[255,"OldSubfileType"],[263,"Thresholding"],[264,"CellWidth"],[265,"CellLength"],[266,"FillOrder"],[269,"DocumentName"],[280,"MinSampleValue"],[281,"MaxSampleValue"],[285,"PageName"],[286,"XPosition"],[287,"YPosition"],[290,"GrayResponseUnit"],[297,"PageNumber"],[321,"HalftoneHints"],[322,"TileWidth"],[323,"TileLength"],[332,"InkSet"],[337,"TargetPrinter"],[18246,"Rating"],[18249,"RatingPercent"],[33550,"PixelScale"],[34264,"ModelTransform"],[34377,"PhotoshopSettings"],[50706,"DNGVersion"],[50707,"DNGBackwardVersion"],[50708,"UniqueCameraModel"],[50709,"LocalizedCameraModel"],[50736,"DNGLensInfo"],[50739,"ShadowScale"],[50740,"DNGPrivateData"],[33920,"IntergraphMatrix"],[33922,"ModelTiePoint"],[34118,"SEMInfo"],[34735,"GeoTiffDirectory"],[34736,"GeoTiffDoubleParams"],[34737,"GeoTiffAsciiParams"],[50341,"PrintIM"],[50721,"ColorMatrix1"],[50722,"ColorMatrix2"],[50723,"CameraCalibration1"],[50724,"CameraCalibration2"],[50725,"ReductionMatrix1"],[50726,"ReductionMatrix2"],[50727,"AnalogBalance"],[50728,"AsShotNeutral"],[50729,"AsShotWhiteXY"],[50730,"BaselineExposure"],[50731,"BaselineNoise"],[50732,"BaselineSharpness"],[50734,"LinearResponseLimit"],[50735,"CameraSerialNumber"],[50741,"MakerNoteSafety"],[50778,"CalibrationIlluminant1"],[50779,"CalibrationIlluminant2"],[50781,"RawDataUniqueID"],[50827,"OriginalRawFileName"],[50828,"OriginalRawFileData"],[50831,"AsShotICCProfile"],[50832,"AsShotPreProfileMatrix"],[50833,"CurrentICCProfile"],[50834,"CurrentPreProfileMatrix"],[50879,"ColorimetricReference"],[50885,"SRawType"],[50898,"PanasonicTitle"],[50899,"PanasonicTitle2"],[50931,"CameraCalibrationSig"],[50932,"ProfileCalibrationSig"],[50933,"ProfileIFD"],[50934,"AsShotProfileName"],[50936,"ProfileName"],[50937,"ProfileHueSatMapDims"],[50938,"ProfileHueSatMapData1"],[50939,"ProfileHueSatMapData2"],[50940,"ProfileToneCurve"],[50941,"ProfileEmbedPolicy"],[50942,"ProfileCopyright"],[50964,"ForwardMatrix1"],[50965,"ForwardMatrix2"],[50966,"PreviewApplicationName"],[50967,"PreviewApplicationVersion"],[50968,"PreviewSettingsName"],[50969,"PreviewSettingsDigest"],[50970,"PreviewColorSpace"],[50971,"PreviewDateTime"],[50972,"RawImageDigest"],[50973,"OriginalRawFileDigest"],[50981,"ProfileLookTableDims"],[50982,"ProfileLookTableData"],[51043,"TimeCodes"],[51044,"FrameRate"],[51058,"TStop"],[51081,"ReelName"],[51089,"OriginalDefaultFinalSize"],[51090,"OriginalBestQualitySize"],[51091,"OriginalDefaultCropSize"],[51105,"CameraLabel"],[51107,"ProfileHueSatMapEncoding"],[51108,"ProfileLookTableEncoding"],[51109,"BaselineExposureOffset"],[51110,"DefaultBlackRender"],[51111,"NewRawImageDigest"],[51112,"RawToPreviewGain"]]);let At=[[273,"StripOffsets"],[279,"StripByteCounts"],[288,"FreeOffsets"],[289,"FreeByteCounts"],[291,"GrayResponseCurve"],[292,"T4Options"],[293,"T6Options"],[300,"ColorResponseUnit"],[320,"ColorMap"],[324,"TileOffsets"],[325,"TileByteCounts"],[326,"BadFaxLines"],[327,"CleanFaxData"],[328,"ConsecutiveBadFaxLines"],[330,"SubIFD"],[333,"InkNames"],[334,"NumberofInks"],[336,"DotRange"],[338,"ExtraSamples"],[339,"SampleFormat"],[340,"SMinSampleValue"],[341,"SMaxSampleValue"],[342,"TransferRange"],[343,"ClipPath"],[344,"XClipPathUnits"],[345,"YClipPathUnits"],[346,"Indexed"],[347,"JPEGTables"],[351,"OPIProxy"],[400,"GlobalParametersIFD"],[401,"ProfileType"],[402,"FaxProfile"],[403,"CodingMethods"],[404,"VersionYear"],[405,"ModeNumber"],[433,"Decode"],[434,"DefaultImageColor"],[435,"T82Options"],[437,"JPEGTables"],[512,"JPEGProc"],[515,"JPEGRestartInterval"],[517,"JPEGLosslessPredictors"],[518,"JPEGPointTransforms"],[519,"JPEGQTables"],[520,"JPEGDCTables"],[521,"JPEGACTables"],[559,"StripRowCounts"],[999,"USPTOMiscellaneous"],[18247,"XP_DIP_XML"],[18248,"StitchInfo"],[28672,"SonyRawFileType"],[28688,"SonyToneCurve"],[28721,"VignettingCorrection"],[28722,"VignettingCorrParams"],[28724,"ChromaticAberrationCorrection"],[28725,"ChromaticAberrationCorrParams"],[28726,"DistortionCorrection"],[28727,"DistortionCorrParams"],[29895,"SonyCropTopLeft"],[29896,"SonyCropSize"],[32781,"ImageID"],[32931,"WangTag1"],[32932,"WangAnnotation"],[32933,"WangTag3"],[32934,"WangTag4"],[32953,"ImageReferencePoints"],[32954,"RegionXformTackPoint"],[32955,"WarpQuadrilateral"],[32956,"AffineTransformMat"],[32995,"Matteing"],[32996,"DataType"],[32997,"ImageDepth"],[32998,"TileDepth"],[33300,"ImageFullWidth"],[33301,"ImageFullHeight"],[33302,"TextureFormat"],[33303,"WrapModes"],[33304,"FovCot"],[33305,"MatrixWorldToScreen"],[33306,"MatrixWorldToCamera"],[33405,"Model2"],[33421,"CFARepeatPatternDim"],[33422,"CFAPattern2"],[33423,"BatteryLevel"],[33424,"KodakIFD"],[33445,"MDFileTag"],[33446,"MDScalePixel"],[33447,"MDColorTable"],[33448,"MDLabName"],[33449,"MDSampleInfo"],[33450,"MDPrepDate"],[33451,"MDPrepTime"],[33452,"MDFileUnits"],[33589,"AdventScale"],[33590,"AdventRevision"],[33628,"UIC1Tag"],[33629,"UIC2Tag"],[33630,"UIC3Tag"],[33631,"UIC4Tag"],[33918,"IntergraphPacketData"],[33919,"IntergraphFlagRegisters"],[33921,"INGRReserved"],[34016,"Site"],[34017,"ColorSequence"],[34018,"IT8Header"],[34019,"RasterPadding"],[34020,"BitsPerRunLength"],[34021,"BitsPerExtendedRunLength"],[34022,"ColorTable"],[34023,"ImageColorIndicator"],[34024,"BackgroundColorIndicator"],[34025,"ImageColorValue"],[34026,"BackgroundColorValue"],[34027,"PixelIntensityRange"],[34028,"TransparencyIndicator"],[34029,"ColorCharacterization"],[34030,"HCUsage"],[34031,"TrapIndicator"],[34032,"CMYKEquivalent"],[34152,"AFCP_IPTC"],[34232,"PixelMagicJBIGOptions"],[34263,"JPLCartoIFD"],[34306,"WB_GRGBLevels"],[34310,"LeafData"],[34687,"TIFF_FXExtensions"],[34688,"MultiProfiles"],[34689,"SharedData"],[34690,"T88Options"],[34732,"ImageLayer"],[34750,"JBIGOptions"],[34856,"Opto-ElectricConvFactor"],[34857,"Interlace"],[34908,"FaxRecvParams"],[34909,"FaxSubAddress"],[34910,"FaxRecvTime"],[34929,"FedexEDR"],[34954,"LeafSubIFD"],[37387,"FlashEnergy"],[37388,"SpatialFrequencyResponse"],[37389,"Noise"],[37390,"FocalPlaneXResolution"],[37391,"FocalPlaneYResolution"],[37392,"FocalPlaneResolutionUnit"],[37397,"ExposureIndex"],[37398,"TIFF-EPStandardID"],[37399,"SensingMethod"],[37434,"CIP3DataFile"],[37435,"CIP3Sheet"],[37436,"CIP3Side"],[37439,"StoNits"],[37679,"MSDocumentText"],[37680,"MSPropertySetStorage"],[37681,"MSDocumentTextPosition"],[37724,"ImageSourceData"],[40965,"InteropIFD"],[40976,"SamsungRawPointersOffset"],[40977,"SamsungRawPointersLength"],[41217,"SamsungRawByteOrder"],[41218,"SamsungRawUnknown"],[41484,"SpatialFrequencyResponse"],[41485,"Noise"],[41489,"ImageNumber"],[41490,"SecurityClassification"],[41491,"ImageHistory"],[41494,"TIFF-EPStandardID"],[41995,"DeviceSettingDescription"],[42112,"GDALMetadata"],[42113,"GDALNoData"],[44992,"ExpandSoftware"],[44993,"ExpandLens"],[44994,"ExpandFilm"],[44995,"ExpandFilterLens"],[44996,"ExpandScanner"],[44997,"ExpandFlashLamp"],[46275,"HasselbladRawImage"],[48129,"PixelFormat"],[48130,"Transformation"],[48131,"Uncompressed"],[48132,"ImageType"],[48256,"ImageWidth"],[48257,"ImageHeight"],[48258,"WidthResolution"],[48259,"HeightResolution"],[48320,"ImageOffset"],[48321,"ImageByteCount"],[48322,"AlphaOffset"],[48323,"AlphaByteCount"],[48324,"ImageDataDiscard"],[48325,"AlphaDataDiscard"],[50215,"OceScanjobDesc"],[50216,"OceApplicationSelector"],[50217,"OceIDNumber"],[50218,"OceImageLogic"],[50255,"Annotations"],[50459,"HasselbladExif"],[50547,"OriginalFileName"],[50560,"USPTOOriginalContentType"],[50656,"CR2CFAPattern"],[50710,"CFAPlaneColor"],[50711,"CFALayout"],[50712,"LinearizationTable"],[50713,"BlackLevelRepeatDim"],[50714,"BlackLevel"],[50715,"BlackLevelDeltaH"],[50716,"BlackLevelDeltaV"],[50717,"WhiteLevel"],[50718,"DefaultScale"],[50719,"DefaultCropOrigin"],[50720,"DefaultCropSize"],[50733,"BayerGreenSplit"],[50737,"ChromaBlurRadius"],[50738,"AntiAliasStrength"],[50752,"RawImageSegmentation"],[50780,"BestQualityScale"],[50784,"AliasLayerMetadata"],[50829,"ActiveArea"],[50830,"MaskedAreas"],[50935,"NoiseReductionApplied"],[50974,"SubTileBlockSize"],[50975,"RowInterleaveFactor"],[51008,"OpcodeList1"],[51009,"OpcodeList2"],[51022,"OpcodeList3"],[51041,"NoiseProfile"],[51114,"CacheVersion"],[51125,"DefaultUserCrop"],[51157,"NikonNEFInfo"],[65024,"KdcIFD"]];E(N,"ifd0",At),E(N,"exif",At),B(G,"gps",[[23,{M:"Magnetic North",T:"True North"}],[25,{K:"Kilometers",M:"Miles",N:"Nautical Miles"}]]);class Dt extends ge{static canHandle(e,t){return 224===e.getUint8(t+1)&&1246120262===e.getUint32(t+4)&&0===e.getUint8(t+8)}parse(){return this.parseTags(),this.translate(),this.output}parseTags(){this.raw=new Map([[0,this.chunk.getUint16(0)],[2,this.chunk.getUint8(2)],[3,this.chunk.getUint16(3)],[5,this.chunk.getUint16(5)],[7,this.chunk.getUint8(7)],[8,this.chunk.getUint8(8)]])}}f(Dt,"type","jfif"),f(Dt,"headerLength",9),A.set("jfif",Dt),B(N,"jfif",[[0,"JFIFVersion"],[2,"ResolutionUnit"],[3,"XResolution"],[5,"YResolution"],[7,"ThumbnailWidth"],[8,"ThumbnailHeight"]]);class Ot extends ge{parse(){return this.parseTags(),this.translate(),this.output}parseTags(){this.raw=new Map([[0,this.chunk.getUint32(0)],[4,this.chunk.getUint32(4)],[8,this.chunk.getUint8(8)],[9,this.chunk.getUint8(9)],[10,this.chunk.getUint8(10)],[11,this.chunk.getUint8(11)],[12,this.chunk.getUint8(12)],...Array.from(this.raw)])}}f(Ot,"type","ihdr"),A.set("ihdr",Ot),B(N,"ihdr",[[0,"ImageWidth"],[4,"ImageHeight"],[8,"BitDepth"],[9,"ColorType"],[10,"Compression"],[11,"Filter"],[12,"Interlace"]]),B(G,"ihdr",[[9,{0:"Grayscale",2:"RGB",3:"Palette",4:"Grayscale with Alpha",6:"RGB with Alpha",DEFAULT:"Unknown"}],[10,{0:"Deflate/Inflate",DEFAULT:"Unknown"}],[11,{0:"Adaptive",DEFAULT:"Unknown"}],[12,{0:"Noninterlaced",1:"Adam7 Interlace",DEFAULT:"Unknown"}]]);const xt="\0\0\0\0";class vt extends ge{static canHandle(e,t){return 226===e.getUint8(t+1)&&1229144927===e.getUint32(t+4)}static findPosition(e,t){let i=super.findPosition(e,t);return i.chunkNumber=e.getUint8(t+16),i.chunkCount=e.getUint8(t+17),i.multiSegment=i.chunkCount>1,i}static handleMultiSegments(e){return function(e){let t=function(e){let t=e[0].constructor,i=0;for(let t of e)i+=t.length;let n=new t(i),s=0;for(let t of e)n.set(t,s),s+=t.length;return n}(e.map((e=>e.chunk.toUint8())));return new I(t)}(e)}parse(){return this.raw=new Map,this.parseHeader(),this.parseTags(),this.translate(),this.output}parseHeader(){let{raw:e}=this;this.chunk.byteLength<84&&m("ICC header is too short");for(let[t,i]of Object.entries(Mt)){t=parseInt(t,10);let n=i(this.chunk,t);n!==xt&&e.set(t,n)}}parseTags(){let e,t,i,n,s,{raw:r}=this,a=this.chunk.getUint32(128),o=132,l=this.chunk.byteLength;for(;a--;){if(e=this.chunk.getString(o,4),t=this.chunk.getUint32(o+4),i=this.chunk.getUint32(o+8),n=this.chunk.getString(t,4),t+i>l)return void console.warn("reached the end of the first ICC chunk. Enable options.tiff.multiSegment to read all ICC segments.");s=this.parseTag(n,t,i),void 0!==s&&s!==xt&&r.set(e,s),o+=12}}parseTag(e,t,i){switch(e){case"desc":return this.parseDesc(t);case"mluc":return this.parseMluc(t);case"text":return this.parseText(t,i);case"sig ":return this.parseSig(t)}if(!(t+i>this.chunk.byteLength))return this.chunk.getUint8Array(t,i)}parseDesc(e){let t=this.chunk.getUint32(e+8)-1;return S(this.chunk.getString(e+12,t))}parseText(e,t){return S(this.chunk.getString(e+8,t-8))}parseSig(e){return S(this.chunk.getString(e+8,4))}parseMluc(e){let{chunk:t}=this,i=t.getUint32(e+8),n=t.getUint32(e+12),s=e+16,r=[];for(let a=0;a<i;a++){let i=t.getString(s+0,2),a=t.getString(s+2,2),o=t.getUint32(s+4),l=t.getUint32(s+8)+e,h=S(t.getUnicodeString(l,o));r.push({lang:i,country:a,text:h}),s+=n}return 1===i?r[0].text:r}translateValue(e,t){return"string"==typeof e?t[e]||t[e.toLowerCase()]||e:t[e]||e}}f(vt,"type","icc"),f(vt,"multiSegment",!0),f(vt,"headerLength",18);const Mt={4:Rt,8:function(e,t){return[e.getUint8(t),e.getUint8(t+1)>>4,e.getUint8(t+1)%16].map((e=>e.toString(10))).join(".")},12:Rt,16:Rt,20:Rt,24:function(e,t){const i=e.getUint16(t),n=e.getUint16(t+2)-1,s=e.getUint16(t+4),r=e.getUint16(t+6),a=e.getUint16(t+8),o=e.getUint16(t+10);return new Date(Date.UTC(i,n,s,r,a,o))},36:Rt,40:Rt,48:Rt,52:Rt,64:(e,t)=>e.getUint32(t),80:Rt};function Rt(e,t){return S(e.getString(t,4))}A.set("icc",vt),B(N,"icc",[[4,"ProfileCMMType"],[8,"ProfileVersion"],[12,"ProfileClass"],[16,"ColorSpaceData"],[20,"ProfileConnectionSpace"],[24,"ProfileDateTime"],[36,"ProfileFileSignature"],[40,"PrimaryPlatform"],[44,"CMMFlags"],[48,"DeviceManufacturer"],[52,"DeviceModel"],[56,"DeviceAttributes"],[64,"RenderingIntent"],[68,"ConnectionSpaceIlluminant"],[80,"ProfileCreator"],[84,"ProfileID"],["Header","ProfileHeader"],["MS00","WCSProfiles"],["bTRC","BlueTRC"],["bXYZ","BlueMatrixColumn"],["bfd","UCRBG"],["bkpt","MediaBlackPoint"],["calt","CalibrationDateTime"],["chad","ChromaticAdaptation"],["chrm","Chromaticity"],["ciis","ColorimetricIntentImageState"],["clot","ColorantTableOut"],["clro","ColorantOrder"],["clrt","ColorantTable"],["cprt","ProfileCopyright"],["crdi","CRDInfo"],["desc","ProfileDescription"],["devs","DeviceSettings"],["dmdd","DeviceModelDesc"],["dmnd","DeviceMfgDesc"],["dscm","ProfileDescriptionML"],["fpce","FocalPlaneColorimetryEstimates"],["gTRC","GreenTRC"],["gXYZ","GreenMatrixColumn"],["gamt","Gamut"],["kTRC","GrayTRC"],["lumi","Luminance"],["meas","Measurement"],["meta","Metadata"],["mmod","MakeAndModel"],["ncl2","NamedColor2"],["ncol","NamedColor"],["ndin","NativeDisplayInfo"],["pre0","Preview0"],["pre1","Preview1"],["pre2","Preview2"],["ps2i","PS2RenderingIntent"],["ps2s","PostScript2CSA"],["psd0","PostScript2CRD0"],["psd1","PostScript2CRD1"],["psd2","PostScript2CRD2"],["psd3","PostScript2CRD3"],["pseq","ProfileSequenceDesc"],["psid","ProfileSequenceIdentifier"],["psvm","PS2CRDVMSize"],["rTRC","RedTRC"],["rXYZ","RedMatrixColumn"],["resp","OutputResponse"],["rhoc","ReflectionHardcopyOrigColorimetry"],["rig0","PerceptualRenderingIntentGamut"],["rig2","SaturationRenderingIntentGamut"],["rpoc","ReflectionPrintOutputColorimetry"],["sape","SceneAppearanceEstimates"],["scoe","SceneColorimetryEstimates"],["scrd","ScreeningDesc"],["scrn","Screening"],["targ","CharTarget"],["tech","Technology"],["vcgt","VideoCardGamma"],["view","ViewingConditions"],["vued","ViewingCondDesc"],["wtpt","MediaWhitePoint"]]);const Lt={"4d2p":"Erdt Systems",AAMA:"Aamazing Technologies",ACER:"Acer",ACLT:"Acolyte Color Research",ACTI:"Actix Sytems",ADAR:"Adara Technology",ADBE:"Adobe",ADI:"ADI Systems",AGFA:"Agfa Graphics",ALMD:"Alps Electric",ALPS:"Alps Electric",ALWN:"Alwan Color Expertise",AMTI:"Amiable Technologies",AOC:"AOC International",APAG:"Apago",APPL:"Apple Computer",AST:"AST","AT&T":"AT&T",BAEL:"BARBIERI electronic",BRCO:"Barco NV",BRKP:"Breakpoint",BROT:"Brother",BULL:"Bull",BUS:"Bus Computer Systems","C-IT":"C-Itoh",CAMR:"Intel",CANO:"Canon",CARR:"Carroll Touch",CASI:"Casio",CBUS:"Colorbus PL",CEL:"Crossfield",CELx:"Crossfield",CGS:"CGS Publishing Technologies International",CHM:"Rochester Robotics",CIGL:"Colour Imaging Group, London",CITI:"Citizen",CL00:"Candela",CLIQ:"Color IQ",CMCO:"Chromaco",CMiX:"CHROMiX",COLO:"Colorgraphic Communications",COMP:"Compaq",COMp:"Compeq/Focus Technology",CONR:"Conrac Display Products",CORD:"Cordata Technologies",CPQ:"Compaq",CPRO:"ColorPro",CRN:"Cornerstone",CTX:"CTX International",CVIS:"ColorVision",CWC:"Fujitsu Laboratories",DARI:"Darius Technology",DATA:"Dataproducts",DCP:"Dry Creek Photo",DCRC:"Digital Contents Resource Center, Chung-Ang University",DELL:"Dell Computer",DIC:"Dainippon Ink and Chemicals",DICO:"Diconix",DIGI:"Digital","DL&C":"Digital Light & Color",DPLG:"Doppelganger",DS:"Dainippon Screen",DSOL:"DOOSOL",DUPN:"DuPont",EPSO:"Epson",ESKO:"Esko-Graphics",ETRI:"Electronics and Telecommunications Research Institute",EVER:"Everex Systems",EXAC:"ExactCODE",Eizo:"Eizo",FALC:"Falco Data Products",FF:"Fuji Photo Film",FFEI:"FujiFilm Electronic Imaging",FNRD:"Fnord Software",FORA:"Fora",FORE:"Forefront Technology",FP:"Fujitsu",FPA:"WayTech Development",FUJI:"Fujitsu",FX:"Fuji Xerox",GCC:"GCC Technologies",GGSL:"Global Graphics Software",GMB:"Gretagmacbeth",GMG:"GMG",GOLD:"GoldStar Technology",GOOG:"Google",GPRT:"Giantprint",GTMB:"Gretagmacbeth",GVC:"WayTech Development",GW2K:"Sony",HCI:"HCI",HDM:"Heidelberger Druckmaschinen",HERM:"Hermes",HITA:"Hitachi America",HP:"Hewlett-Packard",HTC:"Hitachi",HiTi:"HiTi Digital",IBM:"IBM",IDNT:"Scitex",IEC:"Hewlett-Packard",IIYA:"Iiyama North America",IKEG:"Ikegami Electronics",IMAG:"Image Systems",IMI:"Ingram Micro",INTC:"Intel",INTL:"N/A (INTL)",INTR:"Intra Electronics",IOCO:"Iocomm International Technology",IPS:"InfoPrint Solutions Company",IRIS:"Scitex",ISL:"Ichikawa Soft Laboratory",ITNL:"N/A (ITNL)",IVM:"IVM",IWAT:"Iwatsu Electric",Idnt:"Scitex",Inca:"Inca Digital Printers",Iris:"Scitex",JPEG:"Joint Photographic Experts Group",JSFT:"Jetsoft Development",JVC:"JVC Information Products",KART:"Scitex",KFC:"KFC Computek Components",KLH:"KLH Computers",KMHD:"Konica Minolta",KNCA:"Konica",KODA:"Kodak",KYOC:"Kyocera",Kart:"Scitex",LCAG:"Leica",LCCD:"Leeds Colour",LDAK:"Left Dakota",LEAD:"Leading Technology",LEXM:"Lexmark International",LINK:"Link Computer",LINO:"Linotronic",LITE:"Lite-On",Leaf:"Leaf",Lino:"Linotronic",MAGC:"Mag Computronic",MAGI:"MAG Innovision",MANN:"Mannesmann",MICN:"Micron Technology",MICR:"Microtek",MICV:"Microvitec",MINO:"Minolta",MITS:"Mitsubishi Electronics America",MITs:"Mitsuba",MNLT:"Minolta",MODG:"Modgraph",MONI:"Monitronix",MONS:"Monaco Systems",MORS:"Morse Technology",MOTI:"Motive Systems",MSFT:"Microsoft",MUTO:"MUTOH INDUSTRIES",Mits:"Mitsubishi Electric",NANA:"NANAO",NEC:"NEC",NEXP:"NexPress Solutions",NISS:"Nissei Sangyo America",NKON:"Nikon",NONE:"none",OCE:"Oce Technologies",OCEC:"OceColor",OKI:"Oki",OKID:"Okidata",OKIP:"Okidata",OLIV:"Olivetti",OLYM:"Olympus",ONYX:"Onyx Graphics",OPTI:"Optiquest",PACK:"Packard Bell",PANA:"Matsushita Electric Industrial",PANT:"Pantone",PBN:"Packard Bell",PFU:"PFU",PHIL:"Philips Consumer Electronics",PNTX:"HOYA",POne:"Phase One A/S",PREM:"Premier Computer Innovations",PRIN:"Princeton Graphic Systems",PRIP:"Princeton Publishing Labs",QLUX:"Hong Kong",QMS:"QMS",QPCD:"QPcard AB",QUAD:"QuadLaser",QUME:"Qume",RADI:"Radius",RDDx:"Integrated Color Solutions",RDG:"Roland DG",REDM:"REDMS Group",RELI:"Relisys",RGMS:"Rolf Gierling Multitools",RICO:"Ricoh",RNLD:"Edmund Ronald",ROYA:"Royal",RPC:"Ricoh Printing Systems",RTL:"Royal Information Electronics",SAMP:"Sampo",SAMS:"Samsung",SANT:"Jaime Santana Pomares",SCIT:"Scitex",SCRN:"Dainippon Screen",SDP:"Scitex",SEC:"Samsung",SEIK:"Seiko Instruments",SEIk:"Seikosha",SGUY:"ScanGuy.com",SHAR:"Sharp Laboratories",SICC:"International Color Consortium",SONY:"Sony",SPCL:"SpectraCal",STAR:"Star",STC:"Sampo Technology",Scit:"Scitex",Sdp:"Scitex",Sony:"Sony",TALO:"Talon Technology",TAND:"Tandy",TATU:"Tatung",TAXA:"TAXAN America",TDS:"Tokyo Denshi Sekei",TECO:"TECO Information Systems",TEGR:"Tegra",TEKT:"Tektronix",TI:"Texas Instruments",TMKR:"TypeMaker",TOSB:"Toshiba",TOSH:"Toshiba",TOTK:"TOTOKU ELECTRIC",TRIU:"Triumph",TSBT:"Toshiba",TTX:"TTX Computer Products",TVM:"TVM Professional Monitor",TW:"TW Casper",ULSX:"Ulead Systems",UNIS:"Unisys",UTZF:"Utz Fehlau & Sohn",VARI:"Varityper",VIEW:"Viewsonic",VISL:"Visual communication",VIVO:"Vivo Mobile Communication",WANG:"Wang",WLBR:"Wilbur Imaging",WTG2:"Ware To Go",WYSE:"WYSE Technology",XERX:"Xerox",XRIT:"X-Rite",ZRAN:"Zoran",Zebr:"Zebra Technologies",appl:"Apple Computer",bICC:"basICColor",berg:"bergdesign",ceyd:"Integrated Color Solutions",clsp:"MacDermid ColorSpan",ds:"Dainippon Screen",dupn:"DuPont",ffei:"FujiFilm Electronic Imaging",flux:"FluxData",iris:"Scitex",kart:"Scitex",lcms:"Little CMS",lino:"Linotronic",none:"none",ob4d:"Erdt Systems",obic:"Medigraph",quby:"Qubyx Sarl",scit:"Scitex",scrn:"Dainippon Screen",sdp:"Scitex",siwi:"SIWI GRAFIKA",yxym:"YxyMaster"},Ut={scnr:"Scanner",mntr:"Monitor",prtr:"Printer",link:"Device Link",abst:"Abstract",spac:"Color Space Conversion Profile",nmcl:"Named Color",cenc:"ColorEncodingSpace profile",mid:"MultiplexIdentification profile",mlnk:"MultiplexLink profile",mvis:"MultiplexVisualization profile",nkpf:"Nikon Input Device Profile (NON-STANDARD!)"};B(G,"icc",[[4,Lt],[12,Ut],[40,Object.assign({},Lt,Ut)],[48,Lt],[80,Lt],[64,{0:"Perceptual",1:"Relative Colorimetric",2:"Saturation",3:"Absolute Colorimetric"}],["tech",{amd:"Active Matrix Display",crt:"Cathode Ray Tube Display",kpcd:"Photo CD",pmd:"Passive Matrix Display",dcam:"Digital Camera",dcpj:"Digital Cinema Projector",dmpc:"Digital Motion Picture Camera",dsub:"Dye Sublimation Printer",epho:"Electrophotographic Printer",esta:"Electrostatic Printer",flex:"Flexography",fprn:"Film Writer",fscn:"Film Scanner",grav:"Gravure",ijet:"Ink Jet Printer",imgs:"Photo Image Setter",mpfr:"Motion Picture Film Recorder",mpfs:"Motion Picture Film Scanner",offs:"Offset Lithography",pjtv:"Projection Television",rpho:"Photographic Paper Printer",rscn:"Reflective Scanner",silk:"Silkscreen",twax:"Thermal Wax Printer",vidc:"Video Camera",vidm:"Video Monitor"}]]);class Ft extends ge{static canHandle(e,t,i){return 237===e.getUint8(t+1)&&"Photoshop"===e.getString(t+4,9)&&void 0!==this.containsIptc8bim(e,t,i)}static headerLength(e,t,i){let n,s=this.containsIptc8bim(e,t,i);if(void 0!==s)return n=e.getUint8(t+s+7),n%2!=0&&(n+=1),0===n&&(n=4),s+8+n}static containsIptc8bim(e,t,i){for(let n=0;n<i;n++)if(this.isIptcSegmentHead(e,t+n))return n}static isIptcSegmentHead(e,t){return 56===e.getUint8(t)&&943868237===e.getUint32(t)&&1028===e.getUint16(t+4)}parse(){let{raw:e}=this,t=this.chunk.byteLength-1,i=!1;for(let n=0;n<t;n++)if(28===this.chunk.getUint8(n)&&2===this.chunk.getUint8(n+1)){i=!0;let t=this.chunk.getUint16(n+3),s=this.chunk.getUint8(n+2),r=this.chunk.getLatin1String(n+5,t);e.set(s,this.pluralizeValue(e.get(s),r)),n+=4+t}else if(i)break;return this.translate(),this.output}pluralizeValue(e,t){return void 0!==e?e instanceof Array?(e.push(t),e):[e,t]:t}}f(Ft,"type","iptc"),f(Ft,"translateValues",!1),f(Ft,"reviveValues",!1),A.set("iptc",Ft),B(N,"iptc",[[0,"ApplicationRecordVersion"],[3,"ObjectTypeReference"],[4,"ObjectAttributeReference"],[5,"ObjectName"],[7,"EditStatus"],[8,"EditorialUpdate"],[10,"Urgency"],[12,"SubjectReference"],[15,"Category"],[20,"SupplementalCategories"],[22,"FixtureIdentifier"],[25,"Keywords"],[26,"ContentLocationCode"],[27,"ContentLocationName"],[30,"ReleaseDate"],[35,"ReleaseTime"],[37,"ExpirationDate"],[38,"ExpirationTime"],[40,"SpecialInstructions"],[42,"ActionAdvised"],[45,"ReferenceService"],[47,"ReferenceDate"],[50,"ReferenceNumber"],[55,"DateCreated"],[60,"TimeCreated"],[62,"DigitalCreationDate"],[63,"DigitalCreationTime"],[65,"OriginatingProgram"],[70,"ProgramVersion"],[75,"ObjectCycle"],[80,"Byline"],[85,"BylineTitle"],[90,"City"],[92,"Sublocation"],[95,"State"],[100,"CountryCode"],[101,"Country"],[103,"OriginalTransmissionReference"],[105,"Headline"],[110,"Credit"],[115,"Source"],[116,"CopyrightNotice"],[118,"Contact"],[120,"Caption"],[121,"LocalCaption"],[122,"Writer"],[125,"RasterizedCaption"],[130,"ImageType"],[131,"ImageOrientation"],[135,"LanguageIdentifier"],[150,"AudioType"],[151,"AudioSamplingRate"],[152,"AudioSamplingResolution"],[153,"AudioDuration"],[154,"AudioOutcue"],[184,"JobID"],[185,"MasterDocumentID"],[186,"ShortDocumentID"],[187,"UniqueDocumentID"],[188,"OwnerID"],[200,"ObjectPreviewFileFormat"],[201,"ObjectPreviewFileVersion"],[202,"ObjectPreviewData"],[221,"Prefs"],[225,"ClassifyState"],[228,"SimilarityIndex"],[230,"DocumentNotes"],[231,"DocumentHistory"],[232,"ExifCameraInfo"],[255,"CatalogSets"]]),B(G,"iptc",[[10,{0:"0 (reserved)",1:"1 (most urgent)",2:"2",3:"3",4:"4",5:"5 (normal urgency)",6:"6",7:"7",8:"8 (least urgent)",9:"9 (user-defined priority)"}],[75,{a:"Morning",b:"Both Morning and Evening",p:"Evening"}],[131,{L:"Landscape",P:"Portrait",S:"Square"}]]),e.Exifr=ce,e.Options=oe,e.allFormatters=ie,e.chunkedProps=$,e.createDictionary=B,e.default=ft,e.extendDictionary=E,e.fetchUrlAsArrayBuffer=L,e.fileParsers=T,e.fileReaders=D,e.gps=De,e.gpsOnlyOptions=Ae,e.inheritables=te,e.orientation=Re,e.orientationOnlyOptions=Me,e.otherSegments=J,e.parse=fe,e.readBlobAsArrayBuffer=U,e.rotation=Ue,e.rotations=Le,e.segmentParsers=A,e.segments=q,e.segmentsAndBlocks=Z,e.sidecar=async function(e,t,i){let n=new oe(t);n.chunked=!1,void 0===i&&"string"==typeof e&&(i=function(e){let t=e.toLowerCase().split(".").pop();if(function(e){return"exif"===e||"tiff"===e||"tif"===e}(t))return"tiff";if(dt.includes(t))return t}(e));let s=await x(e,n);if(i){if(dt.includes(i))return gt(i,s,n);m("Invalid segment type")}else{if(function(e){let t=e.getString(0,50).trim();return t.includes("<?xpacket")||t.includes("<x:")}(s))return gt("xmp",s,n);for(let[e]of A){if(!dt.includes(e))continue;let t=await gt(e,s,n).catch(pt);if(t)return t}m("Unknown file format")}},e.tagKeys=N,e.tagRevivers=V,e.tagValues=G,e.thumbnail=xe,e.thumbnailOnlyOptions=Oe,e.thumbnailUrl=ve,e.tiffBlocks=Q,e.tiffExtractables=ee,Object.defineProperty(e,"__esModule",{value:!0})}));

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"_process":7,"buffer":5}],4:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],5:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":4,"buffer":5,"ieee754":6}],6:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],7:[function(require,module,exports){
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

},{}]},{},[1]);
