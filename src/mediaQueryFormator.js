import { hasMediaQuery, hasOpenCurly, hasCloseCurly, parseStyle, updateObj, updateCss, getSelector, classNameFilter } from './utils';

let mediaQueries = {}
let count = 0;
let key = '';
let style = '';
let keys = '';
let subKeys = [];
let needReturn = false;
let initialized = false;

let mediaQueryFormator = (line, parseSelector)=>{
    if (!initialized){
        initialized = true;
        mediaQueries = {};
        subKeys = [];
    }
    if (hasMediaQuery(line)){
        key = line.split('{')[0];
        mediaQueries[key] = {};
    }else if (key !== '' && hasOpenCurly(line)){
        keys = line.split('{')[0];
        count += 1;
    }else if (hasCloseCurly(line)){
        if (count === 0){
            needReturn = true;
        }else{
            let styleObj = parseStyle(style);
            keys = keys.split(',');
            keys.forEach(str=>{
                str = classNameFilter(str);
                subKeys.push(getSelector(str)[0]);
                mediaQueries[key] = updateCss(mediaQueries[key], str, styleObj, true, parseSelector);
            })
            count -= 1;
            keys = '';
            style = '';
        }
    }else{
        style += line;
    }
    if (needReturn){
        needReturn = false;
        key = '';
        initialized = false;
        let obj = {
            data: mediaQueries,
            subKeys: subKeys
        }
        return obj;
    }
}

export default mediaQueryFormator;
