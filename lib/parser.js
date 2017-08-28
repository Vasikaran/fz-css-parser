'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fzUglifycss = require('fz-uglifycss');

var _fzUglifycss2 = _interopRequireDefault(_fzUglifycss);

var _formator = require('./formator');

var _formator2 = _interopRequireDefault(_formator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cssParser = function cssParser(css) {
    var minifiedCss = (0, _fzUglifycss2.default)(css);
    return (0, _formator2.default)(minifiedCss);
};

exports.default = cssParser;