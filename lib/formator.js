'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _mediaQueryFormator = require('./mediaQueryFormator');

var _mediaQueryFormator2 = _interopRequireDefault(_mediaQueryFormator);

var _keyFrameFormator = require('./keyFrameFormator');

var _keyFrameFormator2 = _interopRequireDefault(_keyFrameFormator);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formator = function formator(css) {
    css = css.replace(/{/g, '{\n');
    css = css.replace(/{/g, '{\n');
    css = css.replace(/}/g, '\n}\n');
    var lines = css.split('\n');
    var formatedObj = {
        __common_: {},
        __keyFramesKeys_: {},
        __keyFrames_: {},
        __mediaKeys_: {}
    };
    var mediaQueries = {};
    var isMedia = false;
    var isKeyFrame = false;
    var style = '';
    var key = '';
    lines.forEach(function (line) {
        if (!(0, _utils.isUnwantedLine)(line)) {
            if (((0, _utils.hasMediaQuery)(line) || isMedia) && !isKeyFrame) {
                if (!isMedia) {
                    isMedia = true;
                }
                var result = (0, _mediaQueryFormator2.default)(line);
                if (result) {
                    var data = result.data,
                        subKeys = result.subKeys;

                    var _Object$keys = Object.keys(data),
                        _Object$keys2 = _slicedToArray(_Object$keys, 1),
                        mediaKey = _Object$keys2[0];

                    subKeys.forEach(function (subKey) {
                        if (formatedObj['__mediaKeys_'][subKey]) {
                            if (formatedObj['__mediaKeys_'][subKey].indexOf(mediaKey) === -1) {
                                formatedObj['__mediaKeys_'][subKey].push(mediaKey);
                            }
                        } else {
                            formatedObj['__mediaKeys_'][subKey] = [mediaKey];
                        }
                    });
                    if (mediaQueries[mediaKey]) {
                        var obj = data[mediaKey];
                        var subStyles = Object.keys(mediaQueries[mediaKey]);
                        subStyles.forEach(function (subStyle) {
                            var style = mediaQueries[mediaKey][subStyle];
                            var newStyle = data[mediaKey][subStyle];
                            style = Object.assign(style, newStyle);
                            obj[subStyle] = style;
                        });
                        mediaQueries[mediaKey] = obj;
                    } else {
                        mediaQueries = Object.assign(mediaQueries, data);
                    }
                    isMedia = false;
                }
            } else if ((0, _utils.hasKeyFrame)(line) && !isMedia || isKeyFrame) {
                if (!isKeyFrame) {
                    isKeyFrame = true;
                }
                var _result = (0, _keyFrameFormator2.default)(line);
                if (_result) {
                    var _key = _result.key,
                        object = _result.object;

                    formatedObj['__keyFrames_'][_key] = Object.assign(object);
                    isKeyFrame = false;
                }
            } else if ((0, _utils.hasOpenCurly)(line) && !isMedia && !isKeyFrame) {
                key = line.split('{')[0];
            } else if ((0, _utils.hasCloseCurly)(line) && !isMedia && !isKeyFrame) {
                var styleObj = (0, _utils.parseStyle)(style);
                var keys = key.split(',');
                keys.forEach(function (cName) {
                    if (styleObj['-webkit-animation-name']) {
                        var _getSelector = (0, _utils.getSelector)(cName),
                            _getSelector2 = _slicedToArray(_getSelector, 2),
                            name = _getSelector2[0],
                            selector = _getSelector2[1];

                        formatedObj['__keyFramesKeys_'][name] = {};
                        formatedObj['__keyFramesKeys_'][name]['name'] = styleObj['-webkit-animation-name'];
                        formatedObj['__keyFramesKeys_'][name]['__selectors'] = selector;
                    }
                    formatedObj = (0, _utils.updateCss)(formatedObj, cName, styleObj);
                });
                key = '';
                style = '';
            } else {
                style += line;
            }
        }
    });
    formatedObj['__media_quries'] = mediaQueries;
    return formatedObj;
};

exports.default = formator;