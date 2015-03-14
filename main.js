/*
 * This file is part of the fastimage node module. Copyright (C) 2015 and above Shogun <shogun@cowtech.it>.
 * Licensed under the MIT license, which can be found at http://www.opensource.org/licenses/mit-license.php.
 */

// TODO: Test

(function(){
  "use strict";

  var errors = require("./lib/errors");
  var analyzer = require("./lib/analyzer");
  var parseUrl = require("url").parse;

  // TODO: Work directly on buffers
  // TODO: Stream interface in input
  // TODO: Stream interface in output
  // TODO: Promise interface

  /**
   * Analyzes a URL (local or remote) and return the image informations.
   *
   * The second argument of the callback, when successful, will be a object containing the image informations.
   *
   * Specifically, when the URL is a remote URL, the object will be similar to this:
   *
   * ```javascript
   * {
   *   "width": 1000, // The width of the image in pixels.
   *   "height": 1000, // The height of the image in pixels.
   *   "type": "gif", // The type of the image. Can be `bmp`, `gif`, `jpeg`, `png`, `psd`, `tif`, `webp` or `svg`.
   *   "url": "http://placehold.it/1000x1000.gif", // The original URL of the image.
   *   "realUrl": "http://placehold.it/1000x1000.gif", // The real URL of the image after all the redirects. It will be omitted if equals to the URL.
   *   "size": 24090, // The size of the image (in bytes). Present only if the server returned the Content-Length HTTP header.
   *   "transferred": 979, // The amount of data transferred (in bytes) to identify the image.
   *   "time": 171.43721 // The time required for the operation, in milliseconds.
   * }
   * ```
   *
   * When the URL is a local file the object will be similar to this:
   *
   * ```javascript
   * {
   *   "width": 150, // The width of the image in pixels.
   *   "height": 150, // The height of the image in pixels.
   *   "type": "png", // The type of the image. Can be `bmp`, `gif`, `jpeg`, `png`, `psd`, `tif`, `webp` or `svg`.
   *   "path": "1.png", // The original path of the image.
   *   "realPath": "/home/user/1.png", // The absolute path of the image. It will be omitted if equals to the path.
   *   "size": 24090, // The size (in bytes) of the image.
   *   "time": 14.00558 // The time required for the operation, in milliseconds.
   * }
   * ```
   *
   * @alias module:fastimage.analyze
   * @param {string} url - The URL to analyze.
   * @param {function} callback - The callback to invoke once finished.
   */
  var analyze = function(url, callback){
    if(typeof callback !== "function")
      callback = function(){};

    var parsed = parseUrl(url);

    if(!parsed.path)
      return callback(new errors.FastImageError("Invalid URL provided.", {url: url, code: "INVALID_URL"}));
    else if(!parsed.protocol || parsed.protocol == "file")
      return analyzer.analyzeFile(parsed.path, callback);
    else
      return analyzer.analyzeRemote(url, callback);
  };

  /**
   * Analyzes a URL (local or remote) and return the image size.
   *
   * The second argument of the callback, when successful, will be a object containing the fields `width` and `height` in pixels.
   *
   * @alias module:fastimage.size
   * @param {string} url - The URL to analyze.
   * @param {function} callback - The callback to invoke once finished.
   */
   var size = function(url, callback){
    if(typeof callback !== "function")
      callback = function(){};

    analyze(url, function(error, info){
      if(error)
        callback(error);
      else
        callback(null, {width: info.width, height: info.height});
    });
  };

  /**
   * Analyzes a URL (local or remote) and return the image type.
   *
   * The second argument of the callback, when successful, will be the type of the image.
   *
   * @alias module:fastimage.type
   * @param {string} url - The URL to analyze.
   * @param {function} callback - The callback to invoke once finished.
   */
  var type = function(url, callback){
    if(typeof callback !== "function")
      callback = function(){};

    analyze(url, function(error, info){
      if(error)
        callback(error);
      else
        callback(null, info.type);
    });
  };

  /**
   * Fastimage module.
   *
   * @module fastimage
   */
  module.exports = {
    analyze: analyze,
    size: size,
    type: type,
    FastImageError: errors.FastImageError
  };
})();