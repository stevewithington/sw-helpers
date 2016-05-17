(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*global unescape, define, module */

;(function ($) {
  'use strict'

  /*
  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
  * to work around bugs in some JS interpreters.
  */
  function safe_add (x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF)
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xFFFF)
  }

  /*
  * Bitwise rotate a 32-bit number to the left.
  */
  function bit_rol (num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }

  /*
  * These functions implement the four basic operations the algorithm uses.
  */
  function md5_cmn (q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
  }
  function md5_ff (a, b, c, d, x, s, t) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
  }
  function md5_gg (a, b, c, d, x, s, t) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
  }
  function md5_hh (a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5_ii (a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
  }

  /*
  * Calculate the MD5 of an array of little-endian words, and a bit length.
  */
  function binl_md5 (x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (len % 32)
    x[(((len + 64) >>> 9) << 4) + 14] = len

    var i
    var olda
    var oldb
    var oldc
    var oldd
    var a = 1732584193
    var b = -271733879
    var c = -1732584194
    var d = 271733878

    for (i = 0; i < x.length; i += 16) {
      olda = a
      oldb = b
      oldc = c
      oldd = d

      a = md5_ff(a, b, c, d, x[i], 7, -680876936)
      d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586)
      c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819)
      b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330)
      a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897)
      d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426)
      c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341)
      b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983)
      a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416)
      d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417)
      c = md5_ff(c, d, a, b, x[i + 10], 17, -42063)
      b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162)
      a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682)
      d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101)
      c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290)
      b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329)

      a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510)
      d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632)
      c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713)
      b = md5_gg(b, c, d, a, x[i], 20, -373897302)
      a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691)
      d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083)
      c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335)
      b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848)
      a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438)
      d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690)
      c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961)
      b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501)
      a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467)
      d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784)
      c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473)
      b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734)

      a = md5_hh(a, b, c, d, x[i + 5], 4, -378558)
      d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463)
      c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562)
      b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556)
      a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060)
      d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353)
      c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632)
      b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640)
      a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174)
      d = md5_hh(d, a, b, c, x[i], 11, -358537222)
      c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979)
      b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189)
      a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487)
      d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835)
      c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520)
      b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651)

      a = md5_ii(a, b, c, d, x[i], 6, -198630844)
      d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415)
      c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905)
      b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055)
      a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571)
      d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606)
      c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523)
      b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799)
      a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359)
      d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744)
      c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380)
      b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649)
      a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070)
      d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379)
      c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259)
      b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551)

      a = safe_add(a, olda)
      b = safe_add(b, oldb)
      c = safe_add(c, oldc)
      d = safe_add(d, oldd)
    }
    return [a, b, c, d]
  }

  /*
  * Convert an array of little-endian words to a string
  */
  function binl2rstr (input) {
    var i
    var output = ''
    for (i = 0; i < input.length * 32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF)
    }
    return output
  }

  /*
  * Convert a raw string to an array of little-endian words
  * Characters >255 have their high-byte silently ignored.
  */
  function rstr2binl (input) {
    var i
    var output = []
    output[(input.length >> 2) - 1] = undefined
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0
    }
    for (i = 0; i < input.length * 8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32)
    }
    return output
  }

  /*
  * Calculate the MD5 of a raw string
  */
  function rstr_md5 (s) {
    return binl2rstr(binl_md5(rstr2binl(s), s.length * 8))
  }

  /*
  * Calculate the HMAC-MD5, of a key and some data (raw strings)
  */
  function rstr_hmac_md5 (key, data) {
    var i
    var bkey = rstr2binl(key)
    var ipad = []
    var opad = []
    var hash
    ipad[15] = opad[15] = undefined
    if (bkey.length > 16) {
      bkey = binl_md5(bkey, key.length * 8)
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636
      opad[i] = bkey[i] ^ 0x5C5C5C5C
    }
    hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
    return binl2rstr(binl_md5(opad.concat(hash), 512 + 128))
  }

  /*
  * Convert a raw string to a hex string
  */
  function rstr2hex (input) {
    var hex_tab = '0123456789abcdef'
    var output = ''
    var x
    var i
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i)
      output += hex_tab.charAt((x >>> 4) & 0x0F) +
      hex_tab.charAt(x & 0x0F)
    }
    return output
  }

  /*
  * Encode a string as utf-8
  */
  function str2rstr_utf8 (input) {
    return unescape(encodeURIComponent(input))
  }

  /*
  * Take string arguments and return either raw or hex encoded strings
  */
  function raw_md5 (s) {
    return rstr_md5(str2rstr_utf8(s))
  }
  function hex_md5 (s) {
    return rstr2hex(raw_md5(s))
  }
  function raw_hmac_md5 (k, d) {
    return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))
  }
  function hex_hmac_md5 (k, d) {
    return rstr2hex(raw_hmac_md5(k, d))
  }

  function md5 (string, key, raw) {
    if (!key) {
      if (!raw) {
        return hex_md5(string)
      }
      return raw_md5(string)
    }
    if (!raw) {
      return hex_hmac_md5(key, string)
    }
    return raw_hmac_md5(key, string)
  }

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return md5
    })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = md5
  } else {
    $.md5 = md5
  }
}(this))

},{}],2:[function(require,module,exports){
'use strict';

(function() {
  function toArray(arr) {
    return Array.prototype.slice.call(arr);
  }

  function promisifyRequest(request) {
    return new Promise(function(resolve, reject) {
      request.onsuccess = function() {
        resolve(request.result);
      };

      request.onerror = function() {
        reject(request.error);
      };
    });
  }

  function promisifyRequestCall(obj, method, args) {
    var request;
    var p = new Promise(function(resolve, reject) {
      request = obj[method].apply(obj, args);
      promisifyRequest(request).then(resolve, reject);
    });

    p.request = request;
    return p;
  }
  
  function promisifyCursorRequestCall(obj, method, args) {
    var p = promisifyRequestCall(obj, method, args);
    return p.then(function(value) {
      if (!value) return;
      return new Cursor(value, p.request);
    });
  }

  function proxyProperties(ProxyClass, targetProp, properties) {
    properties.forEach(function(prop) {
      Object.defineProperty(ProxyClass.prototype, prop, {
        get: function() {
          return this[targetProp][prop];
        }
      });
    });
  }

  function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return promisifyRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function proxyMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return this[targetProp][prop].apply(this[targetProp], arguments);
      };
    });
  }

  function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return promisifyCursorRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function Index(index) {
    this._index = index;
  }

  proxyProperties(Index, '_index', [
    'name',
    'keyPath',
    'multiEntry',
    'unique'
  ]);

  proxyRequestMethods(Index, '_index', IDBIndex, [
    'get',
    'getKey',
    'getAll',
    'getAllKeys',
    'count'
  ]);

  proxyCursorRequestMethods(Index, '_index', IDBIndex, [
    'openCursor',
    'openKeyCursor'
  ]);

  function Cursor(cursor, request) {
    this._cursor = cursor;
    this._request = request;
  }

  proxyProperties(Cursor, '_cursor', [
    'direction',
    'key',
    'primaryKey',
    'value'
  ]);

  proxyRequestMethods(Cursor, '_cursor', IDBCursor, [
    'update',
    'delete'
  ]);

  // proxy 'next' methods
  ['advance', 'continue', 'continuePrimaryKey'].forEach(function(methodName) {
    if (!(methodName in IDBCursor.prototype)) return;
    Cursor.prototype[methodName] = function() {
      var cursor = this;
      var args = arguments;
      return Promise.resolve().then(function() {
        cursor._cursor[methodName].apply(cursor._cursor, args);
        return promisifyRequest(cursor._request).then(function(value) {
          if (!value) return;
          return new Cursor(value, cursor._request);
        });
      });
    };
  });

  function ObjectStore(store) {
    this._store = store;
  }

  ObjectStore.prototype.createIndex = function() {
    return new Index(this._store.createIndex.apply(this._store, arguments));
  };

  ObjectStore.prototype.index = function() {
    return new Index(this._store.index.apply(this._store, arguments));
  };

  proxyProperties(ObjectStore, '_store', [
    'name',
    'keyPath',
    'indexNames',
    'autoIncrement'
  ]);

  proxyRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'put',
    'add',
    'delete',
    'clear',
    'get',
    'getAll',
    'getAllKeys',
    'count'
  ]);

  proxyCursorRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'openCursor',
    'openKeyCursor'
  ]);

  proxyMethods(ObjectStore, '_store', IDBObjectStore, [
    'deleteIndex'
  ]);

  function Transaction(idbTransaction) {
    this._tx = idbTransaction;
    this.complete = new Promise(function(resolve, reject) {
      idbTransaction.oncomplete = function() {
        resolve();
      };
      idbTransaction.onerror = function() {
        reject(idbTransaction.error);
      };
    });
  }

  Transaction.prototype.objectStore = function() {
    return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));
  };

  proxyProperties(Transaction, '_tx', [
    'objectStoreNames',
    'mode'
  ]);

  proxyMethods(Transaction, '_tx', IDBTransaction, [
    'abort'
  ]);

  function UpgradeDB(db, oldVersion, transaction) {
    this._db = db;
    this.oldVersion = oldVersion;
    this.transaction = new Transaction(transaction);
  }

  UpgradeDB.prototype.createObjectStore = function() {
    return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));
  };

  proxyProperties(UpgradeDB, '_db', [
    'name',
    'version',
    'objectStoreNames'
  ]);

  proxyMethods(UpgradeDB, '_db', IDBDatabase, [
    'deleteObjectStore',
    'close'
  ]);

  function DB(db) {
    this._db = db;
  }

  DB.prototype.transaction = function() {
    return new Transaction(this._db.transaction.apply(this._db, arguments));
  };

  proxyProperties(DB, '_db', [
    'name',
    'version',
    'objectStoreNames'
  ]);

  proxyMethods(DB, '_db', IDBDatabase, [
    'close'
  ]);

  // Add cursor iterators
  // TODO: remove this once browsers do the right thing with promises
  ['openCursor', 'openKeyCursor'].forEach(function(funcName) {
    [ObjectStore, Index].forEach(function(Constructor) {
      Constructor.prototype[funcName.replace('open', 'iterate')] = function() {
        var args = toArray(arguments);
        var callback = args[args.length - 1];
        var request = (this._store || this._index)[funcName].apply(this._store, args.slice(0, -1));
        request.onsuccess = function() {
          callback(request.result);
        };
      };
    });
  });

  // polyfill getAll
  [Index, ObjectStore].forEach(function(Constructor) {
    if (Constructor.prototype.getAll) return;
    Constructor.prototype.getAll = function(query, count) {
      var instance = this;
      var items = [];

      return new Promise(function(resolve) {
        instance.iterateCursor(query, function(cursor) {
          if (!cursor) {
            resolve(items);
            return;
          }
          items.push(cursor.value);

          if (count !== undefined && items.length == count) {
            resolve(items);
            return;
          }
          cursor.continue();
        });
      });
    };
  });

  var exp = {
    open: function(name, version, upgradeCallback) {
      var p = promisifyRequestCall(indexedDB, 'open', [name, version]);
      var request = p.request;

      request.onupgradeneeded = function(event) {
        if (upgradeCallback) {
          upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));
        }
      };

      return p.then(function(db) {
        return new DB(db);
      });
    },
    delete: function(name) {
      return promisifyRequestCall(indexedDB, 'deleteDatabase', [name]);
    }
  };

  if (typeof module !== 'undefined') {
    module.exports = exp;
  }
  else {
    self.idb = exp;
  }
}());
},{}],3:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  module.exports = function(manifest) {
    var currentSection, entries, firstLine, line, lines, mode, tokens, _i, _len;
    lines = manifest.split(/\r\n|\r|\n/);
    firstLine = lines.shift();
    if (firstLine.indexOf('CACHE MANIFEST') !== 0) {
      throw new Error("Invalid cache manifest header: " + firstLine);
    }
    if (firstLine.length > 'CACHE MANIFEST'.length && firstLine[14] !== ' ' && firstLine[14] !== '\t') {
      throw new Error("Invalid cache manifest header: " + firstLine);
    }
    currentSection = 'CACHE';
    entries = {
      cache: [],
      network: [],
      fallback: {},
      settings: [],
      tokens: []
    };
    mode = 'CACHE';
    entries.tokens = [
      {
        type: 'magic signature',
        value: 'CACHE MANIFEST'
      }
    ];
    for (_i = 0, _len = lines.length; _i < _len; _i++) {
      line = lines[_i];
      line = line.trim();
      if (!line.length) {
        entries.tokens.push({
          type: 'newline'
        });
      } else if (line.indexOf('#') === 0) {
        entries.tokens.push({
          type: 'comment',
          value: line.substring(1)
        });
      } else if (['CACHE:', 'FALLBACK:', 'NETWORK:', 'SETTINGS:'].indexOf(line) >= 0) {
        mode = line.substring(0, line.length - 1);
        entries.tokens.push({
          type: 'mode',
          value: mode
        });
      } else if (line.indexOf(':') === (line.length - 1)) {
        mode = 'unknown';
        entries.tokens.push({
          type: 'mode',
          value: mode,
          raw: line
        });
      } else {
        tokens = line.split(/[ ]+/);
        entries.tokens.push({
          type: 'data',
          tokens: tokens
        });
        if (mode === 'FALLBACK') {
          entries.fallback[tokens[0]] = tokens[1];
        } else if (mode !== 'unknown') {
          entries[mode.toLowerCase()].push(line);
        }
      }
    }
    return entries;
  };

}).call(this);

/*

*/

},{}],4:[function(require,module,exports){
/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

/* eslint-env browser */

var constants = require('./lib/constants.js');

var swScript = document.currentScript.dataset.serviceWorker;
var manifestAttribute = document.documentElement.getAttribute('manifest');

if (manifestAttribute && 'serviceWorker' in navigator) {
  var manifestUrl = (new URL(manifestAttribute, location.href)).href;

  openIdb().then(function(db) {
    return checkManifestVersion(db, manifestUrl).then(function(hash) {
      return updateManifestAssociationForCurrentPage(db, manifestUrl, hash);
    });
  }).then(function() {
    if (swScript) {
      return navigator.serviceWorker.register(swScript);
    }
  });
}

/**
 * Opens a connection to IndexedDB, using the idb library.
 *
 * @private
 * @returns {Promise.<DB>}
 */
function openIdb() {
  // TODO: Use idb-helpers.js instead.
  var idb = require('idb');
  return idb.open(constants.DB_NAME, constants.DB_VERSION, function(upgradeDB) {
    if (upgradeDB.oldVersion === 0) {
      Object.keys(constants.STORES).forEach(function(objectStore) {
        upgradeDB.createObjectStore(constants.STORES[objectStore]);
      });
    }
  });
}

/**
 * Caches the Responses for one or more URLs, using the Cache Storage API.
 *
 * @private
 * @param {String} hash
 * @param {Array.<String>} urls
 * @returns {Promise.<T>}
 */
function addToCache(hash, urls) {
  // Use the manifest hash as the name of the Cache to open.
  return caches.open(hash).then(function(cache) {
    var fetchRequests = urls.map(function(url) {
      // See Item 18.3 of https://html.spec.whatwg.org/multipage/browsers.html#downloading-or-updating-an-application-cache
      var request = new Request(url, {
        credentials: 'include',
        headers: {
          'X-Use-Fetch': true
        },
        redirect: 'manual'
      });

      return fetch(request).then(function(response) {
        var cacheControl = response.headers.get('Cache-Control');
        if (cacheControl && cacheControl.indexOf('no-store') !== -1) {
          // Bail early if we're told not to cache this response.
          return;
        }

        if (response.ok) {
          return cache.put(url, response);
        }

        // See Item 18.5 of https://html.spec.whatwg.org/multipage/browsers.html#downloading-or-updating-an-application-cache
        if (response.status !== 404 &&
            response.status !== 410) {
          // Assuming this isn't a 200, 404 or 410, we want the .catch() to
          // trigger, which will cause any previously cached Response for this
          // URL to be copied over to this new cache.
          return Promise.reject();
        }
      }).catch(function() {
        // We're here if one of the following happens:
        // - The fetch() rejected due to a NetworkError.
        // - The HTTP status code from the fetch() was something other than
        //   200, 404, and 410 AND the response isn't Cache-Control: no-store
        return caches.match(url).then(function(response) {
          // Add a copy of the cached response to this new cache, if it exists.
          if (response) {
            return cache.put(url, response.clone());
          }
        });
      });
    });

    return Promise.all(fetchRequests);
  });
}

/**
 * Compares the copy of a manifest obtained from fetch() with the copy stored
 * in IndexedDB. If they differ, it kicks off the manifest update process.
 *
 * It returns a Promise which fulfills with the hash for the current manifest.
 *
 * @private
 * @param {DB} db
 * @param {String} manifestUrl
 * @returns {Promise.<String>}
 */
function checkManifestVersion(db, manifestUrl) {
  var tx = db.transaction(constants.STORES.MANIFEST_URL_TO_CONTENTS);
  var store = tx.objectStore(
    constants.STORES.MANIFEST_URL_TO_CONTENTS);

  // See Item 4 of https://html.spec.whatwg.org/multipage/browsers.html#downloading-or-updating-an-application-cache
  var manifestRequest = new Request(manifestUrl, {
    credentials: 'include',
    headers: {
      'X-Use-Fetch': true
    }
  });

  return Promise.all([
    // TODO: Handle manifest fetch failure errors.
    // TODO: Consider cache-busting if the manifest response > 24 hours old.
    fetch(manifestRequest).then(function(manifestResponse) {
      return manifestResponse.text();
    }).then(function(text) {
      var md5 = require('blueimp-md5');
      return {
        // Hash a combination of URL and text so that two identical manifests
        // served from a different location are treated distinctly.
        hash: md5(manifestUrl + text),
        text: text
      };
    }),
    store.get(manifestUrl)
  ]).then(function(values) {
    // values[0].hash is the MD5 hash of the manifest returned by fetch().
    // values[0].text is the manifest text returned by fetch().
    // values[1] is array of Objects with {hash, parsed} properties, or null.
    var knownManifests = values[1] || [];
    var knownManifestVersion = knownManifests.some(function(entry) {
      return entry.hash === values[0].hash;
    });

    if (knownManifestVersion) {
      // If we already know about this manifest version, return the hash.
      return values[0].hash;
    }

    // If the hash of the manifest retrieved from the network isn't already
    // in the list of known manifest hashes, then trigger an update.
    return performManifestUpdate(db, manifestUrl, values[0].hash,
      values[0].text, knownManifests);
  });
}

/**
 * Parses the newest manifest text into the format described at
 * https://www.npmjs.com/package/parse-appcache-manifest
 * The parsed manifest is stored in IndexedDB.
 * This also calls addToCache() to cache the relevant URLs from the manifest.
 *
 * It returns a Promise which fulfills with the hash for the current manifest.
 *
 * @private
 * @param {DB} db
 * @param {String} manifestUrl
 * @param {String} hash
 * @param {String} text
 * @param {Array.<Object>} knownManifests
 * @returns {Promise.<String>}
 */
function performManifestUpdate(db, manifestUrl, hash, text, knownManifests) {
  var parseAppCacheManifest = require('parse-appcache-manifest');
  var parsedManifest = makeManifestUrlsAbsolute(manifestUrl,
    parseAppCacheManifest(text));

  knownManifests.push({
    hash: hash,
    parsed: parsedManifest
  });

  var fallbackUrls = Object.keys(parsedManifest.fallback).map(function(key) {
    return parsedManifest.fallback[key];
  });

  var urlsToCache = parsedManifest.cache.concat(fallbackUrls);

  // All the master entries, i.e. those pages that were associated with an older
  // version of the manifest at the same URL, should be copied over to the new
  // cache as well.
  var readTx = db.transaction(constants.STORES.PATH_TO_MANIFEST, 'readonly');
  readTx.objectStore(constants.STORES.PATH_TO_MANIFEST).iterateCursor(
    function(cursor) {
      if (cursor) {
        if (cursor.value === manifestUrl) {
          urlsToCache.push(cursor.key);
        }
        cursor.continue();
      }
    }
  );

  return readTx.complete.then(function() {
    var writeTx = db.transaction(constants.STORES.MANIFEST_URL_TO_CONTENTS,
      'readwrite');
    var manifestUrlToContentsStore = writeTx.objectStore(
      constants.STORES.MANIFEST_URL_TO_CONTENTS);

    return Promise.all([
      manifestUrlToContentsStore.put(knownManifests, manifestUrl),
      // Wait on tx.complete to ensure that the transaction succeeded.
      writeTx.complete,
      addToCache(hash, urlsToCache)
    ]);
  }).then(function() {
    return hash;
  });
}

/**
 * Updates IndexedDB to indicate that the current page's URL is associated
 * with the AppCache manifest at manifestUrl.
 * It also adds the current page to the cache versioned with hash, matching
 * the master entry cache-as-you-go behavior you get with AppCache.
 *
 * @private
 * @param {DB} db
 * @param {String} manifestUrl
 * @param {String} hash
 * @returns {Promise.<T>}
 */
function updateManifestAssociationForCurrentPage(db, manifestUrl, hash) {
  var tx = db.transaction(constants.STORES.PATH_TO_MANIFEST,
    'readwrite');
  var store = tx.objectStore(constants.STORES.PATH_TO_MANIFEST);

  return Promise.all([
    store.put(manifestUrl, location.href),
    // Wait on tx.complete to ensure that the transaction succeeded.
    tx.complete,
    addToCache(hash, [location.href])
  ]);
}

/**
 * Converts all the URLs in a given manifest's CACHE, NETWORK, and FALLBACK
 * sections to be absolute URLs.
 *
 * @private
 * @param {String} baseUrl
 * @param {Object} originalManifest
 * @returns {Object}
 */
function makeManifestUrlsAbsolute(baseUrl, originalManifest) {
  var manifest = {};

  manifest.cache = originalManifest.cache.map(function(relativeUrl) {
    return (new URL(relativeUrl, baseUrl)).href;
  });

  manifest.network = originalManifest.network.map(function(relativeUrl) {
    if (relativeUrl === '*') {
      return relativeUrl;
    }

    return (new URL(relativeUrl, baseUrl)).href;
  });

  manifest.fallback = {};
  Object.keys(originalManifest.fallback).forEach(function(key) {
    manifest.fallback[(new URL(key, baseUrl)).href] =
      (new URL(originalManifest.fallback[key], baseUrl)).href;
  });

  return manifest;
}

},{"./lib/constants.js":5,"blueimp-md5":1,"idb":2,"parse-appcache-manifest":3}],5:[function(require,module,exports){
/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

module.exports = {
  DB_NAME: 'appcache-to-service-worker',
  DB_VERSION: 1,
  STORES: {
    CLIENT_ID_TO_HASH: 'client-to-hash',
    MANIFEST_URL_TO_CONTENTS: 'manifest-url-to-contents',
    PATH_TO_MANIFEST: 'path-to-manifest'
  }
};

},{}]},{},[4]);
