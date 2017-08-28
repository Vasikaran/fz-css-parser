import { hasMediaQuery, hasOpenCurly, hasCloseCurly, parseStyle, updateObj, updateCss } from './utils';

let mediaQueries = {}
let count = 0;
let key = '';
let style = '';
let keys = '';
let needReturn = false;
let initialized = false;

let mediaQueryFormator = (line)=>{
    if (!initialized){
        initialized = true;
        mediaQueries = {}
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
                mediaQueries[key] = updateCss(mediaQueries[key], str, styleObj, true);
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
        return mediaQueries;
    }
}

export default mediaQueryFormator;
