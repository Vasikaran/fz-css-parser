const cssParser = require('../lib').default;
const fs = require('fs');

let css = fs.readFileSync('./sample.css').toString();

let parsedCss = cssParser(css);

fs.writeFileSync('./style.json', JSON.stringify(parsedCss));
