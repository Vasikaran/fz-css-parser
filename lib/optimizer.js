'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _formator = require('./formator');

var _formator2 = _interopRequireDefault(_formator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var concatProperties = function concatProperties(property, value, object) {
    var selectors = Object.keys(object);
    var result = {};
    var keys = [];
    selectors.forEach(function (selector) {
        var style = object[selector];
        var properties = Object.keys(style);
        var isCheck = false;
        properties.forEach(function (prop) {
            if (prop === property && style[prop] === value && !isCheck) {
                keys.push(selector);
                result[prop] = value;
                isCheck = true;
            }
        });
    });
    keys = keys.join(',');
    var obj = _defineProperty({
        selector: keys
    }, keys, result);
    return obj;
};

var iterateObj = function iterateObj(object) {
    var selectors = Object.keys(object);
    var result = {};
    selectors.forEach(function (selector) {
        var style = object[selector];
        var properties = Object.keys(style);
        properties.forEach(function (property) {
            var data = concatProperties(property, style[property], object);
            var key = data.selector;
            var obj = data[key];
            if (result[key]) {
                var newObj = Object.assign(result[key], obj);
                result[key] = newObj;
            } else {
                result[key] = obj;
            }
        });
    });
    return result;
};

var commonOptimize = function commonOptimize(object) {
    var isKeyFrame = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var keys = Object.keys(object);
    var result = {};
    keys.forEach(function (key) {
        var data = key;
        if (isKeyFrame) {
            data = object[key]['__raw'];
            delete object[key]['__raw'];
        }
        result[data] = iterateObj(object[key]);
    });
    return result;
};

var getStyle = function getStyle(obj) {
    var newObj = JSON.parse(JSON.stringify(obj));
    delete newObj.__common_;
    delete newObj.__keyFramesKeys_;
    delete newObj.__keyFrames_;
    delete newObj.__mediaKeys_;
    delete newObj.__media_quries;
    return newObj;
};

var optimizer = function optimizer(css) {
    css = css.replace(/(\r|\n|\t)/g, '');
    var tree = (0, _formator2.default)(css, false);
    var media = tree.__media_quries;
    var keyFrame = tree.__keyFrames_;
    var obj = {
        media: {},
        keyFrame: {},
        style: {}
    };
    obj['media'] = commonOptimize(media);
    obj['keyFrame'] = commonOptimize(keyFrame, true);
    var style = getStyle(tree);
    obj['style'] = iterateObj(style);
    return obj;
};

exports.default = optimizer;