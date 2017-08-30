import { hasKeyFrame, hasOpenCurly, hasCloseCurly, parseStyle, updateObj, updateCss } from './utils';

let keyFrames = {}
let count = 0;
let key = '';
let raw = '';
let style = '';
let keys = '';
let needReturn = false;
let initialized = false;

let keyFrameFormator = (line, parseSelector)=>{
    if (!initialized){
        initialized = true;
        keyFrames = {}
    }
    if (hasKeyFrame(line)){
        raw = line.split('{')[0];
        key = raw.split(' ');
        key = key.pop();
        keyFrames[key] = {
            __raw: raw
        };
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
                keyFrames[key] = updateCss(keyFrames[key], str, styleObj, true, parseSelector);
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
        let obj = {
            object: keyFrames,
            key: key
        }
        key = '';
        initialized = false;
        return obj;
    }
}

export default keyFrameFormator;
