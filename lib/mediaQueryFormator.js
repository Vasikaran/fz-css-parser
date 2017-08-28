'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils');

var mediaQueries = {};
var count = 0;
var key = '';
var style = '';
var keys = '';
var needReturn = false;
var initialized = false;

var mediaQueryFormator = function mediaQueryFormator(line) {
    if (!initialized) {
        initialized = true;
        mediaQueries = {};
    }
    if ((0, _utils.hasMediaQuery)(line)) {
        key = line.split('{')[0];
        mediaQueries[key] = {};
    } else if (key !== '' && (0, _utils.hasOpenCurly)(line)) {
        keys = line.split('{')[0];
        count += 1;
    } else if ((0, _utils.hasCloseCurly)(line)) {
        if (count === 0) {
            needReturn = true;
        } else {
            var styleObj = (0, _utils.parseStyle)(style);
            keys = keys.split(',');
            keys.forEach(function (str) {
                mediaQueries[key] = (0, _utils.updateCss)(mediaQueries[key], str, styleObj, true);
            });
            count -= 1;
            keys = '';
            style = '';
        }
    } else {
        style += line;
    }
    if (needReturn) {
        needReturn = false;
        key = '';
        initialized = false;
        return mediaQueries;
    }
};

exports.default = mediaQueryFormator;