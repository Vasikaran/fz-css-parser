'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils');

var keyFrames = {};
var count = 0;
var key = '';
var raw = '';
var style = '';
var keys = '';
var needReturn = false;
var initialized = false;

var keyFrameFormator = function keyFrameFormator(line) {
    if (!initialized) {
        initialized = true;
        keyFrames = {};
    }
    if ((0, _utils.hasKeyFrame)(line)) {
        raw = line.split('{')[0];
        key = raw.split(' ');
        key = key.pop();
        keyFrames[key] = {
            __raw: raw
        };
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
                keyFrames[key] = (0, _utils.updateCss)(keyFrames[key], str, styleObj, true);
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
        var obj = {
            object: keyFrames,
            key: key
        };
        key = '';
        initialized = false;
        return obj;
    }
};

exports.default = keyFrameFormator;