'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fzUglifycss = require('fz-uglifycss');

var _fzUglifycss2 = _interopRequireDefault(_fzUglifycss);

var _formator = require('./formator');

var _formator2 = _interopRequireDefault(_formator);

var _utils = require('./utils');

var _optimizer2 = require('./optimizer');

var _optimizer3 = _interopRequireDefault(_optimizer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cssParser = function () {
    function cssParser(css) {
        _classCallCheck(this, cssParser);

        var minifiedCss = (0, _fzUglifycss2.default)(css);
        this.ast = (0, _formator2.default)(minifiedCss);
    }

    _createClass(cssParser, [{
        key: 'getAST',
        value: function getAST() {
            return this.ast;
        }
    }, {
        key: 'objToStr',
        value: function objToStr(obj, selector) {
            var _this = this;

            var ignoreKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
            var isSubStyle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            var str = '';
            var keys = Object.keys(obj);
            keys.forEach(function (key) {
                if (ignoreKeys.indexOf(key) === -1) {
                    var data = obj[key];
                    if ((0, _utils.isObject)(data)) {
                        str += _this.objToStr(data, key, ignoreKeys, isSubStyle);
                    } else if ((0, _utils.isString)(data)) {
                        str += isSubStyle ? '\t' : '';
                        str += '\t' + key + ':' + data + ';\n';
                    }
                }
            });
            if (str !== '') {
                str += isSubStyle ? '\t' : '';
                str = '\n' + selector + '{\n' + str + '}\n';
            }
            return str;
        }
    }, {
        key: 'mediaToStr',
        value: function mediaToStr(media, styleName) {
            var mediaQueries = this.ast['__media_quries'];
            var mediaDatas = mediaQueries[media];
            var str = '';
            var style = mediaDatas[styleName];
            str += this.getRaw(styleName, style, undefined, undefined, true);
            return str;
        }
    }, {
        key: 'getMedia',
        value: function getMedia(styleName) {
            var _this2 = this;

            var mediaKeys = this.ast['__mediaKeys_'];
            var str = '';
            var medias = mediaKeys[styleName];
            if (medias) {
                medias.forEach(function (media) {
                    var data = _this2.mediaToStr(media, styleName);
                    if (data !== '') {
                        str += '\n' + media + '{\n' + data + '\n}\n';
                    }
                });
            }
            return str;
        }
    }, {
        key: 'keyFrameToStr',
        value: function keyFrameToStr(name) {
            var keyFrame = this.ast['__keyFrames_'][name];
            return this.getRaw(name, keyFrame, ['__raw'], keyFrame['__raw'], true);
        }
    }, {
        key: 'getKeyFrames',
        value: function getKeyFrames(styleName) {
            var _this3 = this;

            var keyFrameKeys = this.ast['__keyFramesKeys_'];
            var str = '';
            var names = keyFrameKeys[styleName];
            if (names) {
                names.forEach(function (name) {
                    str += _this3.keyFrameToStr(name);
                });
            }
            return str;
        }
    }, {
        key: 'selectorToStr',
        value: function selectorToStr(selectors, styleName) {
            var _this4 = this;

            var keys = Object.keys(selectors);
            var raw = '';
            keys.forEach(function (key) {
                var selector = selectors[key];
                raw += _this4.objToStr(selector, styleName + key);
            });
            return raw;
        }
    }, {
        key: 'getRaw',
        value: function getRaw(selector, style) {
            var ignoreKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['__selectors'];
            var prefix = arguments[3];
            var isSubStyle = arguments[4];

            var selectors = style['__selectors'];
            selector = prefix ? prefix : selector;
            var raw = this.objToStr(style, selector, ignoreKeys, isSubStyle);
            var rawSelectors = void 0;
            rawSelectors = selectors ? this.selectorToStr(selectors, selector) : '';
            raw = raw + rawSelectors;
            return raw;
        }
    }, {
        key: 'getValue',
        value: function getValue(selectors) {
            var _this5 = this;

            var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var css = '';
            if ((0, _utils.isString)(selectors)) {
                selectors = [selectors];
            }
            var _option$isClass = option.isClass,
                isClass = _option$isClass === undefined ? true : _option$isClass,
                _option$optimize = option.optimize,
                optimize = _option$optimize === undefined ? true : _option$optimize;

            selectors.forEach(function (selector) {
                if (isClass) {
                    selector = '.' + selector;
                } else if (option.isId) {
                    selector = '#' + selector;
                }
                var value = _this5.ast[selector];
                if (value) {
                    var raw = _this5.getRaw(selector, value);
                    var medias = _this5.getMedia(selector);
                    var keyframes = _this5.getKeyFrames(selector);
                    css += raw + medias + keyframes;
                }
            });
            if (optimize) {
                var _optimizer = (0, _optimizer3.default)(css),
                    media = _optimizer.media,
                    keyFrame = _optimizer.keyFrame,
                    style = _optimizer.style;

                media = this.netedObjToStr(media);
                keyFrame = this.netedObjToStr(keyFrame);
                style = this.netedObjToStr(style);
                css = style + media + keyFrame;
            }
            return css;
        }
    }, {
        key: 'netedObjToStr',
        value: function netedObjToStr(obj) {
            var _this6 = this;

            var isSubStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var str = '';
            var keys = Object.keys(obj);
            keys.forEach(function (key, count) {
                var data = obj[key];
                str += isSubStyle ? '\t' : '';
                if ((0, _utils.isObject)(data)) {
                    str += key + '{\n' + _this6.netedObjToStr(data, true);
                    str += isSubStyle ? '\n\t}\n' : '\n}\n';
                } else if ((0, _utils.isString)(data)) {
                    str += '\t' + key + ':' + data;
                    str += count === keys.length - 1 ? ';' : ';\n';
                }
            });
            return str;
        }
    }, {
        key: 'getCommon',
        value: function getCommon() {
            var _this7 = this;

            var commons = this.ast['__common_'];
            var selectors = Object.keys(commons);
            var str = '';
            selectors.forEach(function (selector) {
                var raw = _this7.getRaw(selector, commons[selector]);
                var medias = _this7.getMedia(selector);
                var keyframes = _this7.getKeyFrames(selector);
                str += raw + medias + keyframes;
            });
            return str;
        }
    }]);

    return cssParser;
}();

exports.default = cssParser;