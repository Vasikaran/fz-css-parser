'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var hasMediaQuery = function hasMediaQuery(str) {
    return hasValue(str, '@media');
};

var hasOpenCurly = function hasOpenCurly(str) {
    return hasValue(str, '{');
};

var hasCloseCurly = function hasCloseCurly(str) {
    return hasValue(str, '}');
};

var parseStyle = function parseStyle(styleStr) {
    var styles = styleStr.split(';');
    var styleObj = {};
    styles.forEach(function (style) {
        var _style$split = style.split(':'),
            _style$split2 = _slicedToArray(_style$split, 2),
            key = _style$split2[0],
            value = _style$split2[1];

        styleObj[key] = value;
    });
    return styleObj;
};

var isStyle = function isStyle(str) {
    if (str) {
        return str.startsWith('.') ? true : str.startsWith('#') ? true : false;
    }
    return;
};

var hasValue = function hasValue(str, key) {
    return str.indexOf(key) === -1 ? false : true;
};

var getSelector = function getSelector(str) {
    if (str) {
        if (str.startsWith('::')) {
            return [undefined, str];
        }
    }
    var regex = /[:.+ ]/;
    var substr = str;
    var index = 0;
    if (isStyle(str)) {
        substr = str.substring(1, str.length);
        index = 1;
    }
    var splitChar = substr.match(regex) && substr.match(regex)[0];
    if (splitChar) {
        var styleParts = substr.split(splitChar);
        var className = styleParts.splice(0, 1);
        var selector = styleParts.join(splitChar);
        return [str.substring(0, index) + className, splitChar + selector];
    }
    return [str];
};

var updateObj = function updateObj(obj, key, value) {
    if (obj[key]) {
        var oldValue = JSON.parse(JSON.stringify(obj[key]));
        var newVale = JSON.parse(JSON.stringify(value));
        oldValue = Object.assign(oldValue, newVale);
        obj[key] = oldValue;
    } else {
        if (key.replace(/\s+/, '') !== '') {
            value = JSON.parse(JSON.stringify(value));
            obj[key] = value;
        }
    }
    return obj;
};

var updateCss = function updateCss(object, key, style) {
    var isMedia = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var parseSelector = arguments[4];

    if (parseSelector) {
        var _getSelector = getSelector(key),
            _getSelector2 = _slicedToArray(_getSelector, 2),
            cName = _getSelector2[0],
            selector = _getSelector2[1];

        if (!isStyle(cName) && !isMedia) {
            var obj = object['__common_'];
            if (selector && cName) {
                obj = updateSelectors(obj, cName, selector, style);
            } else if (!cName && selector) {
                obj = updateObj(obj, selector, style);
            } else {
                obj = updateObj(obj, cName, style);
            }
        } else {
            if (selector && cName) {
                object = updateSelectors(object, cName, selector, style);
            } else {
                if (key.replace(/\s+/, '') !== '') {
                    object = updateObj(object, key, style);
                }
            }
        }
    } else {
        if (key.replace(/\s+/, '') !== '') {
            object = updateObj(object, key, style);
        }
    }
    return object;
};

var updateSelectors = function updateSelectors(obj, cName, selector, style) {
    obj[cName] = obj[cName] ? obj[cName] : {};
    obj[cName]['__selectors'] = obj[cName]['__selectors'] ? obj[cName]['__selectors'] : {};
    var tempObj = obj[cName]['__selectors'];
    obj[cName]['__selectors'] = updateObj(tempObj, selector, style);
    return obj;
};

var isUnwantedLine = function isUnwantedLine(line) {
    if (line.startsWith('@charset')) {
        return true;
    }
    return false;
};

var hasKeyFrame = function hasKeyFrame(line) {
    if (!line.startsWith('@')) {
        return false;
    }
    return hasValue(line, 'keyframes');
};

var isObject = function isObject(data) {
    return data && data.toString() === '[object Object]' ? true : false;
};

var isString = function isString(data) {
    return data && typeof data === 'string' ? true : false;
};

var classNameFilter = function classNameFilter(data) {
    var pieces = data.split('-');
    var str = pieces.splice(0, 1)[0];
    pieces.forEach(function (piece) {
        if (piece !== '') {
            str += piece[0].toUpperCase() + piece.substr(1);
        }
    });
    return str;
};

exports.classNameFilter = classNameFilter;
exports.isString = isString;
exports.isObject = isObject;
exports.hasMediaQuery = hasMediaQuery;
exports.hasOpenCurly = hasOpenCurly;
exports.hasCloseCurly = hasCloseCurly;
exports.parseStyle = parseStyle;
exports.isStyle = isStyle;
exports.getSelector = getSelector;
exports.updateObj = updateObj;
exports.updateCss = updateCss;
exports.updateSelectors = updateSelectors;
exports.isUnwantedLine = isUnwantedLine;
exports.hasKeyFrame = hasKeyFrame;