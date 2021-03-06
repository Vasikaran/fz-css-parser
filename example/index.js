const cssParser = require('../lib').default;
const fs = require('fs');

let css = fs.readFileSync('./sample.css').toString();

let parsedCss = new cssParser(css);

fs.writeFileSync('./style.json', JSON.stringify(parsedCss.getAST()));


let data = '';

data += parsedCss.getValue(['div', 'bounceBox', 'divChild']);

data += parsedCss.getCommon();

console.log(parsedCss.getCommon());

fs.writeFileSync('./app.css', data, 'utf-8');
